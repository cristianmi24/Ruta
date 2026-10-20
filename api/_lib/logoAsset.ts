/**
 * Descarga el logo de LabSIE (Cloudflare R2) una sola vez por instancia de función serverless
 * y lo reutiliza como adjunto inline (cid:) en los correos, para que se muestre siempre sin
 * depender de que el cliente de correo cargue imágenes remotas.
 */
import { LOGO_URL } from '../logo.js';

export const LOGO_CID = 'labsie-logo';

let cached: Promise<{ base64: string; contentType: string } | null> | null = null;

export function getLogoInlineAsset(): Promise<{ base64: string; contentType: string } | null> {
  if (!cached) {
    cached = fetch(LOGO_URL)
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        return { base64: buf.toString('base64'), contentType: res.headers.get('content-type') || 'image/png' };
      })
      .catch(err => {
        console.error('[logoAsset] no se pudo descargar el logo para el correo:', err);
        cached = null; // permite reintentar en la siguiente invocación
        return null;
      });
  }
  return cached;
}
