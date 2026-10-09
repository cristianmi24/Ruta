import {
  db,
  decryptPII,
  encryptPII,
  handle,
  json,
  readJson,
  requireConsent,
  requireCoordinator,
  HttpError
} from './_lib/server.js';

type AnyAnalysis = Record<string, any>;

/** Quita correo y teléfono del JSON guardado: solo existen cifrados en sus columnas. */
function stripPII(analysis: AnyAnalysis): AnyAnalysis {
  const profile = { ...(analysis.studentProfile || {}), email: '', phone: '' };
  return {
    ...analysis,
    studentProfile: profile,
    studentAnswers: { ...(analysis.studentAnswers || {}), profile }
  };
}

/** POST /api/analyses — el estudiante registra su test (requiere JWT de consentimiento). */
export const POST = handle(async req => {
  const consent = requireConsent(req);
  const { analysis } = await readJson<{ analysis?: AnyAnalysis }>(req);
  if (!analysis || typeof analysis.id !== 'string' || !analysis.studentProfile) {
    throw new HttpError(400, 'Análisis inválido.');
  }
  const p = analysis.studentProfile;
  const payload = stripPII(analysis);

  // Solo quien tiene el mismo consentimiento puede actualizar su propio registro
  await db()`
    INSERT INTO analyses (id, consent_sub, student_name, email_enc, phone_enc, program, semester, route_type,
                          correspondence_score, primary_line_name, payload)
    VALUES (${analysis.id}, ${consent.sub}, ${String(p.name || '')}, ${encryptPII(p.email)}, ${encryptPII(p.phone)},
            ${String(p.program || '')}, ${String(p.semester || '')}, ${String(analysis.routeType || '')},
            ${Number(analysis.correspondenceScore) || 0}, ${String(analysis.primaryLineName || '')}, ${JSON.stringify(payload)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
    WHERE analyses.consent_sub = EXCLUDED.consent_sub`;
  return json({ ok: true }, 201);
});

/** GET /api/analyses — listado para coordinación, con datos personales descifrados. */
export const GET = handle(async req => {
  requireCoordinator(req);
  const rows = (await db()`
    SELECT payload, email_enc, phone_enc FROM analyses ORDER BY created_at DESC LIMIT 1000`) as {
    payload: AnyAnalysis;
    email_enc: string | null;
    phone_enc: string | null;
  }[];
  const analyses = rows.map(r => {
    const profile = { ...r.payload.studentProfile, email: decryptPII(r.email_enc), phone: decryptPII(r.phone_enc) };
    return { ...r.payload, studentProfile: profile, studentAnswers: { ...r.payload.studentAnswers, profile } };
  });
  return json({ analyses });
});

/** PATCH /api/analyses — la coordinación guarda su revisión de un estudiante. */
export const PATCH = handle(async req => {
  requireCoordinator(req);
  const { id, adminReview } = await readJson<{ id?: string; adminReview?: unknown }>(req, 20_000);
  if (!id || !adminReview) throw new HttpError(400, 'Faltan datos de la revisión.');
  const updated = (await db()`
    UPDATE analyses SET payload = jsonb_set(payload, '{adminReview}', ${JSON.stringify(adminReview)}::jsonb), updated_at = NOW()
    WHERE id = ${id} RETURNING id`) as unknown[];
  if (!updated.length) throw new HttpError(404, 'No se encontró el análisis.');
  return json({ ok: true });
});
