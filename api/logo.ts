import { handle, HttpError } from './_lib/server.js';

const LOGO_URL = 'https://pub-1ec8494dfebf4d9d96fdb25fd581ca63.r2.dev/logo%20labsie%20sin%20fondo.png';

/**
 * GET /api/logo — sirve el logo oficial de LabSIE desde el mismo dominio.
 * El almacenamiento original no permite leerlo desde el navegador (CORS), y el PDF necesita los píxeles.
 */
export const GET = handle(async () => {
  const upstream = await fetch(LOGO_URL);
  if (!upstream.ok) throw new HttpError(502, 'No se pudo obtener el logo.');
  return new Response(await upstream.arrayBuffer(), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' }
  });
});
