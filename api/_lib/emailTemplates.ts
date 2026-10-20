/**
 * Plantillas HTML de correo (tablas + estilos inline para compatibilidad con Gmail/Outlook).
 * Paleta tomada del propio sitio: fondo crema #FFFDF9, verde institucional #315B55 / #477A72,
 * texto principal #24302F, texto apagado #6F7976, bordes #DDE2DE.
 */
import { LOGO_CID } from './logoAsset.js';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente de revisión',
  IN_ANALYSIS: 'En análisis',
  PERTINENT: 'Pertinente',
  NEW_PROPOSAL: 'Nueva propuesta',
  NEEDS_INTERVIEW: 'Requiere entrevista',
  NO_CORRESPONDENCE: 'Sin correspondencia'
};

export const DECISION_LABELS: Record<string, string> = {
  VINCULAR_PROYECTO: 'Vincularte a un proyecto existente',
  VINCULAR_LINEA: 'Vincularte a una línea de investigación',
  NUEVA_PROPUESTA: 'Desarrollar una nueva propuesta contigo',
  REQUIERE_ENTREVISTA: 'Conversar contigo en una entrevista',
  EXPLORACION_ADICIONAL: 'Proponerte una exploración adicional',
  SIN_CORRESPONDENCIA: 'Seguir explorando antes de vincularte a una línea'
};

function emailShell(preheader: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LabSIE · Grupo EduTLAN</title>
</head>
<body style="margin:0;padding:0;background-color:#F1EEE7;font-family:'DM Sans',Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1EEE7;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#FFFDF9;border-radius:18px;overflow:hidden;border:1px solid #DDE2DE;">
          <tr>
            <td style="background-color:#315B55;background:linear-gradient(135deg,#315B55,#477A72);padding:28px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 12px;background-color:#FFFFFF;border-radius:16px;">
                <tr>
                  <td style="padding:10px;">
                    <img src="cid:${LOGO_CID}" alt="LabSIE" width="76" height="76" style="display:block;border-radius:8px;" />
                  </td>
                </tr>
              </table>
              <div style="color:#FFFDF9;font-size:18px;font-weight:700;letter-spacing:0.3px;">Semillero de Investigación LabSIE</div>
              <div style="color:#D7E4DF;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;margin-top:4px;">Grupo EduTLAN · Universidad de Córdoba</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 28px;">
              <hr style="border:none;border-top:1px solid #DDE2DE;margin:0 0 16px;" />
              <p style="margin:0 0 6px;font-size:12px;color:#6F7976;text-align:center;">
                Semillero LabSIE · Grupo EduTLAN · <a href="https://edutlan.online" style="color:#477A72;text-decoration:none;font-weight:600;">edutlan.online</a>
              </p>
              <p style="margin:0;font-size:11px;color:#9AA3A0;text-align:center;">
                Recibiste este correo porque completaste la Ruta Investigativa de LabSIE. No es necesario responder a este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px auto 4px;">
    <tr>
      <td style="background-color:#315B55;border-radius:10px;">
        <a href="${href}" style="display:inline-block;padding:12px 26px;font-size:14px;font-weight:700;color:#FFFDF9;text-decoration:none;">${label}</a>
      </td>
    </tr>
  </table>`;
}

/** Correo al estudiante justo después de completar y enviar su Ruta Investigativa (con el PDF adjunto). */
export function studentSubmissionEmailHtml(opts: { studentName: string; routeType?: string; primaryLineName?: string }): string {
  const firstName = escapeHtml((opts.studentName || '').trim().split(' ')[0] || 'futuro investigador');
  const lineName = opts.primaryLineName ? escapeHtml(opts.primaryLineName) : '';
  const body = `
    <h1 style="margin:0 0 14px;font-size:21px;color:#1C2624;font-family:Georgia,'Lora',serif;">¡Hola, ${firstName}! Recibimos tu Ruta 🎉</h1>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#24302F;">
      Gracias por completar tu <strong>Ruta Investigativa</strong> en el Semillero de Investigación LabSIE del Grupo EduTLAN.
      Ya registramos tus respuestas y adjuntamos a este correo tu <strong>informe personalizado en PDF</strong>, con el detalle de tu
      perfil investigativo${lineName ? ` y la línea de investigación sugerida: <strong>${lineName}</strong>` : ''}.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;border:1px solid #DDE2DE;border-radius:12px;margin:18px 0;">
      <tr>
        <td style="padding:16px 18px;font-size:13px;color:#315B55;font-weight:700;">¿Qué sigue?</td>
      </tr>
      <tr>
        <td style="padding:0 18px 16px;font-size:13.5px;line-height:1.6;color:#4C5956;">
          La coordinación del semillero revisará tu caracterización y te escribirá de nuevo a este mismo correo con su respuesta:
          la línea, el proyecto o el tutor con el que podrías continuar.
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:13.5px;line-height:1.6;color:#4C5956;">
      Mientras tanto, revisa con calma el PDF adjunto: ahí encontrarás tu perfil, tus intereses y los próximos pasos sugeridos.
    </p>
    ${button('https://edutlan.online', 'Visitar edutlan.online')}
  `;
  return emailShell('Recibimos tu Ruta Investigativa · Tu informe en PDF va adjunto', body);
}

/** Correo al estudiante cuando la coordinación guarda su revisión/respuesta sobre su Ruta. */
export function coordinatorDecisionEmailHtml(opts: {
  studentName: string;
  status?: string;
  decision?: string;
  assignedTutor?: string;
  adminComments?: string;
  lineName?: string;
}): string {
  const firstName = escapeHtml((opts.studentName || '').trim().split(' ')[0] || 'futuro investigador');
  const statusLabel = escapeHtml(STATUS_LABELS[opts.status || ''] || opts.status || '');
  const decisionLabel = escapeHtml(DECISION_LABELS[opts.decision || ''] || opts.decision || '');
  const lineName = opts.lineName ? escapeHtml(opts.lineName) : '';
  const assignedTutor = opts.assignedTutor ? escapeHtml(opts.assignedTutor) : '';
  const adminComments = opts.adminComments ? escapeHtml(opts.adminComments) : '';

  const rows = [
    statusLabel ? `<tr><td style="padding:6px 0;font-size:13px;color:#6F7976;width:150px;">Estado</td><td style="padding:6px 0;font-size:13.5px;color:#1C2624;font-weight:700;">${statusLabel}</td></tr>` : '',
    decisionLabel ? `<tr><td style="padding:6px 0;font-size:13px;color:#6F7976;">Decisión</td><td style="padding:6px 0;font-size:13.5px;color:#1C2624;">${decisionLabel}</td></tr>` : '',
    lineName ? `<tr><td style="padding:6px 0;font-size:13px;color:#6F7976;">Línea sugerida</td><td style="padding:6px 0;font-size:13.5px;color:#1C2624;">${lineName}</td></tr>` : '',
    assignedTutor ? `<tr><td style="padding:6px 0;font-size:13px;color:#6F7976;">Tutor asignado</td><td style="padding:6px 0;font-size:13.5px;color:#1C2624;">${assignedTutor}</td></tr>` : ''
  ].filter(Boolean).join('');

  const body = `
    <h1 style="margin:0 0 14px;font-size:21px;color:#1C2624;font-family:Georgia,'Lora',serif;">¡Hola, ${firstName}! Tenemos novedades sobre tu Ruta</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#24302F;">
      La coordinación del Semillero LabSIE ya revisó tu Ruta Investigativa y esto es lo que decidió:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;border:1px solid #DDE2DE;border-radius:12px;margin:0 0 16px;">
      <tr><td style="padding:16px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td></tr>
    </table>
    ${
      adminComments
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
            <tr><td style="padding:14px 16px;border-left:3px solid #477A72;background-color:#F3F7F5;border-radius:0 10px 10px 0;">
              <div style="font-size:11.5px;color:#315B55;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Observaciones de la coordinación</div>
              <div style="font-size:13.5px;line-height:1.55;color:#374542;">${adminComments}</div>
            </td></tr>
          </table>`
        : ''
    }
    <p style="margin:0 0 4px;font-size:13.5px;line-height:1.6;color:#4C5956;">
      Si tienes dudas, puedes acercarte al horario de atención del semillero o escribirnos. ¡Seguimos construyendo tu ruta investigativa!
    </p>
    ${button('https://edutlan.online', 'Visitar edutlan.online')}
  `;
  return emailShell('La coordinación de LabSIE respondió tu Ruta Investigativa', body);
}
