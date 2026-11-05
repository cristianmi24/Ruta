import { handle, json, readJson, requireConsent, requireCoordinator, HttpError } from './_lib/server.js';

/**
 * POST /api/qwen — puente hacia el modelo de lenguaje. Las claves viven solo en el servidor.
 * Requiere el JWT de consentimiento para no funcionar como proxy abierto.
 *
 * Proveedores (ambos con API compatible con OpenAI):
 *   - groq: GROQ_API_KEY (gsk_...), GROQ_MODEL (por defecto qwen/qwen3.8-27b)
 *   - qwen: QWEN_API_KEY (Alibaba Cloud Model Studio / DashScope), QWEN_MODEL (por defecto qwen-plus)
 * AI_PROVIDER elige el principal; si falla y el otro tiene clave, se usa como respaldo.
 */
type Provider = 'groq' | 'qwen';
type Message = { role: string; content: string };

const PROVIDERS: Record<Provider, { key?: string; url: string; model: string }> = {
  groq: {
    key: process.env.GROQ_API_KEY,
    url: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions',
    model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b'
  },
  qwen: {
    key: process.env.QWEN_API_KEY,
    url: process.env.QWEN_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: process.env.QWEN_MODEL || 'qwen-plus'
  }
};

async function callProvider(name: Provider, messages: Message[]) {
  const p = PROVIDERS[name];
  const upstream = await fetch(p.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
    body: JSON.stringify({
      model: p.model,
      messages,
      temperature: 0.6,
      // El reporte en español ronda 2.500-4.500 tokens; con 2.500 el JSON llegaba cortado.
      // En Groq el razonamiento de Qwen3 también consume este límite, por eso se deja holgado.
      max_tokens: 8000,
      response_format: { type: 'json_object' },
      // Qwen3 en Groq razona antes de responder: se oculta para que el contenido sea solo el JSON.
      ...(name === 'groq' ? { reasoning_format: 'hidden' } : {})
    }),
    // Un reporte completo tarda ~40-70 s en qwen-plus; vercel.json da 120 s a esta función.
    signal: AbortSignal.timeout(name === 'groq' ? 50_000 : 65_000)
  });

  if (!upstream.ok) {
    const body = await upstream.text();
    console.error(`[ai:${name}]`, upstream.status, body.slice(0, 300));
    if (upstream.status === 429) {
      // Límite por minuto del proveedor (en Groq gratis ≈ 1 reporte/min): se avisa cuánto esperar.
      const header = Number(upstream.headers.get('retry-after'));
      const fromText = Number(body.match(/try again in ([\d.]+)s/i)?.[1]);
      const retryAfter = Math.ceil(header > 0 ? header : fromText > 0 ? fromText : 30);
      throw new HttpError(429, 'Hay muchas solicitudes al modelo en este momento.', { retryAfter });
    }
    throw new HttpError(502, `${name} respondió con error HTTP ${upstream.status}.`);
  }
  const data = await upstream.json();
  const choice = data.choices?.[0];
  if (choice?.finish_reason === 'length') {
    console.error(`[ai:${name}] respuesta truncada por max_tokens`, data.usage);
    throw new HttpError(502, `${name} devolvió una respuesta incompleta.`);
  }
  const content = choice?.message?.content || '';
  if (!content) throw new HttpError(502, `${name} devolvió una respuesta vacía.`);
  return { model: data.model || p.model, content };
}

export const POST = handle(async req => {
  // Estudiante (consentimiento) o coordinación (para regenerar reportes pendientes desde el panel).
  if (!req.headers.get('x-consent-token')) requireCoordinator(req);
  else requireConsent(req);

  const preferred: Provider = process.env.AI_PROVIDER === 'qwen' ? 'qwen' : 'groq';
  const order = ([preferred, preferred === 'groq' ? 'qwen' : 'groq'] as Provider[]).filter(n => PROVIDERS[n].key);
  if (!order.length) throw new HttpError(503, 'El modelo de lenguaje no está configurado.');

  const { messages } = await readJson<{ messages?: Message[] }>(req, 120_000);
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 4 ||
    messages.some(m => !['system', 'user'].includes(m?.role) || typeof m.content !== 'string')
  ) {
    throw new HttpError(400, 'Mensajes inválidos.');
  }

  let lastError: unknown;
  let rateLimited: HttpError | undefined;
  for (const name of order) {
    try {
      return json(await callProvider(name, messages));
    } catch (err) {
      console.error(`[ai:${name}] falló${order.length > 1 ? ', probando el siguiente proveedor' : ''}:`, (err as Error)?.message);
      lastError = err;
      if (err instanceof HttpError && err.status === 429) rateLimited = err;
    }
  }
  // Si algún proveedor solo estaba saturado, se devuelve el 429 para que el cliente reintente.
  if (rateLimited) throw rateLimited;
  throw lastError instanceof HttpError ? lastError : new HttpError(502, 'No se pudo contactar al modelo de lenguaje.');
});
