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
import { sendBrandedMail } from './_lib/brandedMail.js';
import { studentSubmissionEmailHtml, coordinatorDecisionEmailHtml } from './_lib/emailTemplates.js';

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
  const { analysis, reportPdfBase64, reportFilename } = await readJson<{
    analysis?: AnyAnalysis;
    reportPdfBase64?: string;
    reportFilename?: string;
  }>(req, 8_000_000);
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

  // El correo de confirmación (con el PDF adjunto) no debe tumbar el registro del test si falla.
  if (p.email) {
    try {
      await sendBrandedMail({
        to: p.email,
        toName: p.name,
        subject: 'Recibimos tu Ruta Investigativa · Semillero LabSIE',
        html: studentSubmissionEmailHtml({
          studentName: p.name,
          routeType: analysis.routeType,
          primaryLineName: analysis.primaryLineName
        }),
        attachments: reportPdfBase64
          ? [{ filename: reportFilename || 'Informe_LabSIE.pdf', contentType: 'application/pdf', base64: reportPdfBase64 }]
          : undefined
      });
    } catch (err) {
      console.error('[analyses] no se pudo enviar el correo de confirmación:', err);
    }
  }

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

interface AdminReviewPayload {
  status?: string;
  decision?: string;
  assignedTutor?: string;
  adminComments?: string;
}

/** PATCH /api/analyses — la coordinación guarda su revisión de un estudiante. */
export const PATCH = handle(async req => {
  requireCoordinator(req);
  const { id, adminReview } = await readJson<{ id?: string; adminReview?: AdminReviewPayload }>(req, 20_000);
  if (!id || !adminReview) throw new HttpError(400, 'Faltan datos de la revisión.');
  const updated = (await db()`
    UPDATE analyses SET payload = jsonb_set(payload, '{adminReview}', ${JSON.stringify(adminReview)}::jsonb), updated_at = NOW()
    WHERE id = ${id} RETURNING id, student_name, email_enc, primary_line_name`) as {
    id: string;
    student_name: string;
    email_enc: string | null;
    primary_line_name: string | null;
  }[];
  if (!updated.length) throw new HttpError(404, 'No se encontró el análisis.');

  // Avisar al estudiante de la respuesta de la coordinación; si el correo falla, la revisión ya quedó guardada.
  const email = decryptPII(updated[0].email_enc);
  if (email) {
    try {
      await sendBrandedMail({
        to: email,
        toName: updated[0].student_name,
        subject: 'La coordinación de LabSIE respondió tu Ruta Investigativa',
        html: coordinatorDecisionEmailHtml({
          studentName: updated[0].student_name,
          status: adminReview.status,
          decision: adminReview.decision,
          assignedTutor: adminReview.assignedTutor,
          adminComments: adminReview.adminComments,
          lineName: updated[0].primary_line_name || undefined
        })
      });
    } catch (err) {
      console.error('[analyses] no se pudo enviar el correo de revisión:', err);
    }
  }

  return json({ ok: true });
});
