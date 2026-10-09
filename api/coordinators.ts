import { db, handle, hashPassword, json, readJson, requireCoordinator, HttpError } from './_lib/server.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** GET /api/coordinators — lista de cuentas de coordinación. */
export const GET = handle(async req => {
  requireCoordinator(req);
  const rows = await db()`SELECT id, email, created_at FROM coordinators ORDER BY created_at`;
  return json({ coordinators: rows });
});

/** POST /api/coordinators — un coordinador agrega a otro (correo + contraseña inicial). */
export const POST = handle(async req => {
  requireCoordinator(req);
  const { email, password } = await readJson<{ email?: string; password?: string }>(req, 2_000);
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(cleanEmail)) throw new HttpError(400, 'Ingresa un correo válido.');
  if (!password || password.length < 10) throw new HttpError(400, 'La contraseña debe tener al menos 10 caracteres.');

  const inserted = (await db()`
    INSERT INTO coordinators (email, password_hash) VALUES (${cleanEmail}, ${hashPassword(password)})
    ON CONFLICT (email) DO NOTHING RETURNING id, email, created_at`) as unknown[];
  if (!inserted.length) throw new HttpError(409, 'Ya existe un coordinador con ese correo.');
  return json({ coordinator: inserted[0] }, 201);
});

/** DELETE /api/coordinators?id=... — quita el acceso a otro coordinador (no a sí mismo ni al último). */
export const DELETE = handle(async req => {
  const me = requireCoordinator(req);
  const id = new URL(req.url).searchParams.get('id') || '';
  if (!id) throw new HttpError(400, 'Falta el identificador.');
  if (id === me.sub) throw new HttpError(400, 'No puedes eliminar tu propia cuenta.');
  const [{ count }] = (await db()`SELECT COUNT(*)::int AS count FROM coordinators`) as { count: number }[];
  if (count <= 1) throw new HttpError(400, 'Debe quedar al menos un coordinador.');
  await db()`DELETE FROM coordinators WHERE id = ${id}`;
  return json({ ok: true });
});
