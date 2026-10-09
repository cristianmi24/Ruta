import { db, handle, json, readJson, requireCoordinator, HttpError } from './_lib/server.js';

const KINDS = new Set(['project', 'line']);

/** GET /api/catalog — proyectos y líneas guardados por la coordinación (lectura pública). */
export const GET = handle(async () => {
  const rows = (await db()`SELECT kind, payload FROM catalog ORDER BY kind, id`) as { kind: string; payload: unknown }[];
  return json({
    projects: rows.filter(r => r.kind === 'project').map(r => r.payload),
    lines: rows.filter(r => r.kind === 'line').map(r => r.payload)
  });
});

/** PUT /api/catalog — crea o actualiza un proyecto o línea. */
export const PUT = handle(async req => {
  requireCoordinator(req);
  const { kind, item } = await readJson<{ kind?: string; item?: { id?: string } }>(req, 100_000);
  if (!kind || !KINDS.has(kind) || !item?.id) throw new HttpError(400, 'Elemento de catálogo inválido.');
  await db()`
    INSERT INTO catalog (kind, id, payload) VALUES (${kind}, ${item.id}, ${JSON.stringify(item)}::jsonb)
    ON CONFLICT (kind, id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`;
  return json({ ok: true });
});

/** DELETE /api/catalog?kind=project&id=... */
export const DELETE = handle(async req => {
  requireCoordinator(req);
  const url = new URL(req.url);
  const kind = url.searchParams.get('kind') || '';
  const id = url.searchParams.get('id') || '';
  if (!KINDS.has(kind) || !id) throw new HttpError(400, 'Parámetros inválidos.');
  await db()`DELETE FROM catalog WHERE kind = ${kind} AND id = ${id}`;
  return json({ ok: true });
});
