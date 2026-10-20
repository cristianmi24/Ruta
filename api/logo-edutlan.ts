import { handle, HttpError } from './_lib/server.js';

const LOGO_URL = 'https://pub-1ec8494dfebf4d9d96fdb25fd581ca63.r2.dev/logo%20edutlan%20sin%20fondo%20(1).png';

/** GET /api/logo-edutlan — sirve el logo oficial de EduTLAN desde el almacenamiento Cloudflare del proyecto. */
export const GET = handle(async () => {
  const upstream = await fetch(LOGO_URL);
  if (!upstream.ok) throw new HttpError(502, 'No se pudo obtener el logo de EduTLAN.');
  return new Response(await upstream.arrayBuffer(), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' }
  });
});
