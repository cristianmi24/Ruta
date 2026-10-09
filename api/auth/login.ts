import { db, handle, json, readJson, signJwt, verifyPassword, HttpError } from '../_lib/server.js';

/** POST /api/auth/login — ingreso de coordinación con correo y contraseña (sesión JWT de 8 h). */
export const POST = handle(async req => {
  const { email, password } = await readJson<{ email?: string; password?: string }>(req, 2_000);
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail || !password) throw new HttpError(400, 'Ingresa tu correo y tu contraseña.');

  const rows = (await db()`SELECT id, email, password_hash FROM coordinators WHERE email = ${cleanEmail} LIMIT 1`) as {
    id: string;
    email: string;
    password_hash: string;
  }[];
  const user = rows[0];
  if (!user || !verifyPassword(String(password), user.password_hash)) {
    throw new HttpError(401, 'Correo o contraseña incorrectos.');
  }
  const token = signJwt({ typ: 'coordinator', sub: user.id, email: user.email }, 60 * 60 * 8);
  return json({ token, email: user.email });
});
