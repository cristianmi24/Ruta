/**
 * Crea las tablas en Neon y, opcionalmente, una cuenta de coordinación.
 *
 *   pnpm db:setup
 *   pnpm db:setup --email coordinacion@ejemplo.com --password "una-clave-segura"
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from '../api/_lib/server.js';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Falta DATABASE_URL en .env');
  process.exit(1);
}
const sql = neon(url);

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};

await sql`CREATE TABLE IF NOT EXISTS coordinators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`;

await sql`CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  consent_sub TEXT NOT NULL,
  student_name TEXT NOT NULL,
  email_enc TEXT,
  phone_enc TEXT,
  program TEXT,
  semester TEXT,
  route_type TEXT,
  correspondence_score INTEGER,
  primary_line_name TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`;

await sql`CREATE TABLE IF NOT EXISTS catalog (
  kind TEXT NOT NULL CHECK (kind IN ('project', 'line')),
  id TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (kind, id)
)`;

console.log('✔ Tablas listas: coordinators, analyses, catalog');

const email = arg('email')?.trim().toLowerCase();
const password = arg('password');
if (email && password) {
  if (password.length < 10) {
    console.error('La contraseña debe tener al menos 10 caracteres.');
    process.exit(1);
  }
  await sql`INSERT INTO coordinators (email, password_hash) VALUES (${email}, ${hashPassword(password)})
            ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`;
  console.log(`✔ Cuenta de coordinación lista: ${email}`);
}
