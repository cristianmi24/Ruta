import { handle, json, readJson, requireConsent, HttpError } from './_lib/server.js';

/**
 * POST /api/qwen — puente hacia Qwen. La clave QWEN_API_KEY vive solo en el servidor.
 * Requiere el JWT de consentimiento para no funcionar como proxy abierto.
 */
export const POST = handle(async req => {
  requireConsent(req);
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) throw new HttpError(503, 'Qwen no está configurado.');

  const { messages } = await readJson<{ messages?: { role: string; content: string }[] }>(req, 120_000);
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 4 ||
    messages.some(m => !['system', 'user'].includes(m?.role) || typeof m.content !== 'string')
  ) {
    throw new HttpError(400, 'Mensajes inválidos.');
  }

  // Qwen directo: Alibaba Cloud Model Studio (DashScope) en modo compatible con OpenAI
  const upstream = await fetch(process.env.QWEN_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.QWEN_MODEL || 'qwen-plus',
      messages,
      temperature: 0.6,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    })
  });

  if (!upstream.ok) {
    console.error('[qwen]', upstream.status, (await upstream.text()).slice(0, 300));
    throw new HttpError(502, `Qwen respondió con error HTTP ${upstream.status}.`);
  }
  const data = await upstream.json();
  return json({ model: data.model || process.env.QWEN_MODEL, content: data.choices?.[0]?.message?.content || '' });
});
