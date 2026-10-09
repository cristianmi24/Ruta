/**
 * Utilidades del servidor (funciones de Vercel en /api).
 * Aquí viven los secretos: DATABASE_URL (Neon), JWT_SECRET, DATA_ENCRYPTION_KEY y QWEN_API_KEY.
 * Nunca se exponen al navegador (no llevan prefijo VITE_).
 */
import { neon } from '@neondatabase/serverless';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// ---------- Base de datos (Neon PostgreSQL) ----------
let _sql: ReturnType<typeof neon> | null = null;
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new HttpError(500, 'DATABASE_URL no está configurada en el servidor.');
  if (!_sql) _sql = neon(url);
  return _sql;
}

// ---------- Respuestas HTTP ----------
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

/** Envuelve un handler para convertir errores en respuestas JSON sin filtrar detalles internos. */
export function handle(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await fn(req);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, err.status);
      console.error('[api]', err);
      return json({ error: 'Error interno del servidor.' }, 500);
    }
  };
}

export async function readJson<T = any>(req: Request, maxBytes = 300_000): Promise<T> {
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, 'La solicitud es demasiado grande.');
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, 'JSON inválido.');
  }
}

// ---------- JWT (HS256) ----------
const b64url = (buf: Buffer) => buf.toString('base64url');

function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new HttpError(500, 'JWT_SECRET no está configurado (mínimo 32 caracteres).');
  return s;
}

export function signJwt(payload: Record<string, unknown>, ttlSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = b64url(Buffer.from(JSON.stringify({ iss: 'labsie-edutlan', iat: now, exp: now + ttlSeconds, ...payload })));
  const sig = b64url(createHmac('sha256', jwtSecret()).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

export function verifyJwt<T = Record<string, any>>(token: string | null | undefined): T | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const expected = createHmac('sha256', jwtSecret()).update(`${parts[0]}.${parts[1]}`).digest();
  const given = Buffer.from(parts[2], 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload as T;
  } catch {
    return null;
  }
}

const bearer = (req: Request) => req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null;

export function requireCoordinator(req: Request): { sub: string; email: string } {
  const payload = verifyJwt<{ typ: string; sub: string; email: string }>(bearer(req));
  if (!payload || payload.typ !== 'coordinator') throw new HttpError(401, 'Sesión de coordinación inválida o vencida.');
  return payload;
}

export const TERMS_VERSION = 'edutlan-labsie-habeas-2026-10';

export function requireConsent(req: Request): { sub: string } {
  const payload = verifyJwt<{ typ: string; sub: string; termsVersion: string }>(req.headers.get('x-consent-token'));
  if (!payload || payload.typ !== 'consent' || payload.termsVersion !== TERMS_VERSION) {
    throw new HttpError(403, 'Debes aceptar los términos y el tratamiento de datos antes de continuar.');
  }
  return payload;
}

// ---------- Contraseñas (scrypt) ----------
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltB64, hashB64] = stored.split('$');
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length);
  return timingSafeEqual(actual, expected);
}

// ---------- Cifrado de datos personales (AES-256-GCM) ----------
function dataKey(): Buffer {
  const k = process.env.DATA_ENCRYPTION_KEY;
  if (!k || k.length < 32) throw new HttpError(500, 'DATA_ENCRYPTION_KEY no está configurada (mínimo 32 caracteres).');
  return createHash('sha256').update(k).digest();
}

export function encryptPII(value: string | null | undefined): string | null {
  if (!value) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', dataKey(), iv);
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `v1.${b64url(iv)}.${b64url(cipher.getAuthTag())}.${b64url(data)}`;
}

export function decryptPII(value: string | null | undefined): string {
  if (!value) return '';
  try {
    const [v, iv, tag, data] = value.split('.');
    if (v !== 'v1') return '';
    const decipher = createDecipheriv('aes-256-gcm', dataKey(), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}
