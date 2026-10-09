import { randomUUID } from 'node:crypto';
import { handle, json, readJson, signJwt, TERMS_VERSION, HttpError } from './_lib/server.js';

/** POST /api/consent — el estudiante acepta términos; se emite un JWT firmado por el servidor (24 h). */
export const POST = handle(async req => {
  const body = await readJson<{ accepted?: boolean; termsVersion?: string }>(req, 2_000);
  if (body.accepted !== true || body.termsVersion !== TERMS_VERSION) {
    throw new HttpError(400, 'Debes aceptar la versión vigente de los términos.');
  }
  const token = signJwt({ typ: 'consent', sub: randomUUID(), termsVersion: TERMS_VERSION }, 60 * 60 * 24);
  return json({ token, termsVersion: TERMS_VERSION });
});
