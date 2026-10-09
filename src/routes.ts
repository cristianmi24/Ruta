/** Rutas con URL propia: al refrescar o compartir el enlace se conserva la sección. */
export type View = 'welcome' | 'lineas' | 'test' | 'heritage' | 'results' | 'admin' | 'animacion';
export type AdminTab = 'panorama' | 'estudiantes' | 'proyectos' | 'lineas' | 'coordinadores';

const VIEW_PATHS: Record<View, string> = {
  welcome: '/',
  lineas: '/lineas',
  heritage: '/proyectos',
  test: '/mi-ruta',
  results: '/resultados',
  admin: '/coordinacion',
  animacion: '/animacion'
};

const ADMIN_TABS: AdminTab[] = ['panorama', 'estudiantes', 'proyectos', 'lineas', 'coordinadores'];

export interface Route {
  view: View;
  adminTab: AdminTab;
  studentId: string | null;
}

export function parseRoute(pathname = window.location.pathname): Route {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const view = (Object.keys(VIEW_PATHS) as View[]).find(v => VIEW_PATHS[v] === `/${parts[0] || ''}`) || 'welcome';
  const tab = ADMIN_TABS.includes(parts[1] as AdminTab) ? (parts[1] as AdminTab) : 'panorama';
  const studentId = view === 'admin' && tab === 'estudiantes' && parts[2] ? parts[2] : null;
  return { view, adminTab: tab, studentId };
}

export function buildPath(view: View, adminTab?: AdminTab, studentId?: string | null): string {
  if (view !== 'admin' || !adminTab || adminTab === 'panorama') return VIEW_PATHS[view];
  return `${VIEW_PATHS.admin}/${adminTab}${studentId ? `/${encodeURIComponent(studentId)}` : ''}`;
}

/** Cambia la URL sin recargar; `replace` evita llenar el historial con pasos intermedios. */
export function navigateTo(path: string, replace = false) {
  if (window.location.pathname === path) return;
  if (replace) window.history.replaceState(null, '', path);
  else window.history.pushState(null, '', path);
}
