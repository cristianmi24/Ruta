import { handle, json, requireCoordinator } from '../_lib/server.js';

/** GET /api/auth/me — valida la sesión de coordinación. */
export const GET = handle(async req => {
  const { email } = requireCoordinator(req);
  return json({ email });
});
