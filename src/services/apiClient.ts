/**
 * Cliente de la API del servidor (/api → funciones de Vercel con Neon PostgreSQL).
 * El navegador nunca ve la cadena de conexión ni las claves: solo JWT de corta duración.
 */
import { AnalysisResult, AdminReview, ResearchLine, ResearchProject } from '../types';

const COORDINATOR_TOKEN_KEY = 'labsie_coordinator_jwt_v1';
const CONSENT_TOKEN_KEY = 'labsie_consent_jwt_v2';

function read(store: Storage, key: string): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function write(store: Storage, key: string, value: string | null) {
  try {
    if (value) store.setItem(key, value);
    else store.removeItem(key);
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Lee el payload de un JWT sin verificarlo (la verificación real ocurre en el servidor). */
export function decodeJwt<T = Record<string, any>>(token: string | null): T | null {
  if (!token) return null;
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(part)))) as T;
  } catch {
    return null;
  }
}

const isExpired = (token: string | null) => {
  const exp = decodeJwt<{ exp?: number }>(token)?.exp;
  return !exp || exp * 1000 < Date.now();
};

async function request<T>(path: string, init: RequestInit = {}, auth?: 'coordinator' | 'consent'): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (auth === 'coordinator') {
    const t = getCoordinatorToken();
    if (t) headers.set('Authorization', `Bearer ${t}`);
  }
  if (auth === 'consent') {
    const t = getConsentToken();
    if (t) headers.set('X-Consent-Token', t);
  }
  const res = await fetch(path, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth === 'coordinator') write(sessionStorage, COORDINATOR_TOKEN_KEY, null);
    throw new Error((data as { error?: string }).error || `Error HTTP ${res.status}`);
  }
  return data as T;
}

// ---------- Consentimiento del estudiante ----------
export function getConsentToken(): string | null {
  const t = read(localStorage, CONSENT_TOKEN_KEY);
  return t && !isExpired(t) ? t : null;
}

export async function acceptTerms(termsVersion: string): Promise<string> {
  const { token } = await request<{ token: string }>('/api/consent', {
    method: 'POST',
    body: JSON.stringify({ accepted: true, termsVersion })
  });
  write(localStorage, CONSENT_TOKEN_KEY, token);
  return token;
}

export function hasConsent(termsVersion: string): boolean {
  const t = getConsentToken();
  return decodeJwt<{ termsVersion?: string }>(t)?.termsVersion === termsVersion;
}

// ---------- Sesión de coordinación ----------
export function getCoordinatorToken(): string | null {
  const t = read(sessionStorage, COORDINATOR_TOKEN_KEY);
  return t && !isExpired(t) ? t : null;
}

export async function loginCoordinator(email: string, password: string): Promise<string> {
  const { token, email: confirmed } = await request<{ token: string; email: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  write(sessionStorage, COORDINATOR_TOKEN_KEY, token);
  return confirmed;
}

export async function currentCoordinator(): Promise<string | null> {
  if (!getCoordinatorToken()) return null;
  try {
    const { email } = await request<{ email: string }>('/api/auth/me', {}, 'coordinator');
    return email;
  } catch {
    return null;
  }
}

export function logoutCoordinator() {
  write(sessionStorage, COORDINATOR_TOKEN_KEY, null);
}

// ---------- Análisis ----------
export function submitAnalysis(analysis: AnalysisResult) {
  return request<{ ok: true }>('/api/analyses', { method: 'POST', body: JSON.stringify({ analysis }) }, 'consent');
}

export async function fetchAnalyses(): Promise<AnalysisResult[]> {
  const { analyses } = await request<{ analyses: AnalysisResult[] }>('/api/analyses', {}, 'coordinator');
  return analyses;
}

export function saveAdminReview(id: string, adminReview: AdminReview) {
  return request('/api/analyses', { method: 'PATCH', body: JSON.stringify({ id, adminReview }) }, 'coordinator');
}

// ---------- Catálogo (proyectos y líneas) ----------
export function fetchCatalog() {
  return request<{ projects: ResearchProject[]; lines: ResearchLine[] }>('/api/catalog');
}

export function saveCatalogItem(kind: 'project' | 'line', item: ResearchProject | ResearchLine) {
  return request('/api/catalog', { method: 'PUT', body: JSON.stringify({ kind, item }) }, 'coordinator');
}

export function deleteCatalogItem(kind: 'project' | 'line', id: string) {
  return request(`/api/catalog?kind=${kind}&id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'coordinator');
}

// ---------- Qwen (vía servidor) ----------
export function askQwen(messages: { role: 'system' | 'user'; content: string }[]) {
  return request<{ model: string; content: string }>('/api/qwen', { method: 'POST', body: JSON.stringify({ messages }) }, 'consent');
}

// ---------- Coordinadores ----------
export interface CoordinatorAccount {
  id: string;
  email: string;
  created_at: string;
}

export async function fetchCoordinators(): Promise<CoordinatorAccount[]> {
  const { coordinators } = await request<{ coordinators: CoordinatorAccount[] }>('/api/coordinators', {}, 'coordinator');
  return coordinators;
}

export function createCoordinator(email: string, password: string) {
  return request('/api/coordinators', { method: 'POST', body: JSON.stringify({ email, password }) }, 'coordinator');
}

export function deleteCoordinator(id: string) {
  return request(`/api/coordinators?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'coordinator');
}

/** Id del coordinador con sesión activa (claim `sub` del JWT). */
export function currentCoordinatorId(): string | null {
  return decodeJwt<{ sub?: string }>(getCoordinatorToken())?.sub || null;
}
