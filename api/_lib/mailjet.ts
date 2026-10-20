/**
 * Envío de correo transaccional vía Mailjet (API REST v3.1, sin SDK).
 * Variables de entorno requeridas: MAILJET_API_KEY, MAILJET_API_SECRET, MAILJET_FROM_EMAIL.
 * MAILJET_FROM_NAME es opcional (por defecto "LabSIE · EduTLAN").
 */

export interface MailAttachment {
  filename: string;
  contentType: string;
  /** Contenido en base64 (sin el prefijo "data:...;base64,"). */
  base64: string;
}

/** Versión en texto plano del HTML, requerida por buenas prácticas anti-spam (correos "solo HTML" penalizan). */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h1|h2|h3)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export interface InlineAttachment {
  /** Identificador referenciado en el HTML como src="cid:ESTE_ID". */
  contentId: string;
  filename: string;
  contentType: string;
  base64: string;
}

export interface SendMailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
  /** Imágenes incrustadas (ej. el logo) referenciadas por cid: en vez de una URL remota. */
  inlineAttachments?: InlineAttachment[];
}

/**
 * Envía un correo. Nunca lanza: si faltan credenciales o Mailjet responde con error,
 * registra el detalle en consola y devuelve false para que el llamador decida si continuar.
 * El envío de correo es una notificación adicional y no debe tumbar el flujo principal
 * (guardar el test del estudiante o la revisión del coordinador).
 */
export async function sendMail(opts: SendMailOptions): Promise<boolean> {
  const apiKey = process.env.MAILJET_API_KEY;
  const apiSecret = process.env.MAILJET_API_SECRET;
  const fromEmail = process.env.MAILJET_FROM_EMAIL;
  const fromName = process.env.MAILJET_FROM_NAME || 'LabSIE · EduTLAN';

  if (!apiKey || !apiSecret || !fromEmail) {
    console.error('[mailjet] Faltan MAILJET_API_KEY / MAILJET_API_SECRET / MAILJET_FROM_EMAIL; correo no enviado.');
    return false;
  }
  if (!opts.to) return false;

  const body = {
    Messages: [
      {
        From: { Email: fromEmail, Name: fromName },
        To: [{ Email: opts.to, Name: opts.toName || opts.to }],
        Subject: opts.subject,
        HTMLPart: opts.html,
        TextPart: htmlToPlainText(opts.html),
        ...(opts.attachments?.length
          ? { Attachments: opts.attachments.map(a => ({ ContentType: a.contentType, Filename: a.filename, Base64Content: a.base64 })) }
          : {}),
        ...(opts.inlineAttachments?.length
          ? {
              InlinedAttachments: opts.inlineAttachments.map(a => ({
                ContentType: a.contentType,
                Filename: a.filename,
                ContentID: a.contentId,
                Base64Content: a.base64
              }))
            }
          : {})
      }
    ]
  };

  try {
    const res = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      console.error('[mailjet] Error al enviar correo:', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    console.error('[mailjet] Excepción al enviar correo:', err);
    return false;
  }
}
