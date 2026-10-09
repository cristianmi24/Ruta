import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';

/**
 * En desarrollo, ejecuta las funciones de /api (las mismas que Vercel despliega)
 * dentro del servidor de Vite, para que `pnpm dev` funcione con Neon sin vercel dev.
 */
function apiDevServer(): Plugin {
  return {
    name: 'labsie-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        const url = new URL(req.url, 'http://localhost');
        const file = path.resolve(import.meta.dirname, `.${url.pathname}.ts`);
        if (!file.startsWith(path.resolve(import.meta.dirname, 'api')) || url.pathname.includes('/_') || !fs.existsSync(file)) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'No encontrado' }));
        }
        try {
          const mod = await server.ssrLoadModule(file);
          const handler = mod[req.method || 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            return res.end(JSON.stringify({ error: 'Método no permitido' }));
          }
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const request = new Request(url, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : Buffer.concat(chunks)
          });
          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          console.error('[api dev]', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Error interno del servidor.' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Variables de servidor (sin VITE_) disponibles para /api en desarrollo; no se inyectan en el bundle
  for (const [k, v] of Object.entries(env)) {
    if (!k.startsWith('VITE_') && process.env[k] === undefined) process.env[k] = v;
  }

  return {
    plugins: [react(), tailwindcss(), apiDevServer()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
