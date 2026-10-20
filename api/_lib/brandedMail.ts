import { sendMail, SendMailOptions } from './mailjet.js';
import { getLogoInlineAsset, LOGO_CID } from './logoAsset.js';

/** Envía un correo de marca LabSIE incrustando el logo como adjunto inline (cid:) en vez de una URL remota. */
export async function sendBrandedMail(opts: Omit<SendMailOptions, 'inlineAttachments'>): Promise<boolean> {
  const logo = await getLogoInlineAsset();
  return sendMail({
    ...opts,
    inlineAttachments: logo
      ? [{ contentId: LOGO_CID, filename: 'logo-labsie.png', contentType: logo.contentType, base64: logo.base64 }]
      : undefined
  });
}
