/**
 * Protección de datos en el navegador.
 * - El consentimiento es un JWT firmado por el servidor (/api/consent); aquí solo se solicita y consulta.
 * - La copia local de los resultados guarda correo y teléfono cifrados (AES-GCM) con una clave propia del
 *   dispositivo. En la base de datos (Neon) el servidor los vuelve a cifrar con su propia clave.
 */
import { acceptTerms, hasConsent, getConsentToken } from './apiClient';

export const TERMS_VERSION = 'edutlan-labsie-habeas-2026-10';
const DEVICE_KEY_STORAGE = 'labsie_data_protection_device_key_v1';
const ENC_PREFIX = 'enc:v1:';

export const issueConsentToken = () => acceptTerms(TERMS_VERSION);
export const hasValidConsent = () => hasConsent(TERMS_VERSION);
export const getStoredConsentToken = getConsentToken;

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = '';
  arr.forEach(b => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string): Uint8Array<ArrayBuffer> {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const bin = atob(padded + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function utf8(str: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(str);
}

function getDeviceSecret(): string {
  try {
    const existing = localStorage.getItem(DEVICE_KEY_STORAGE);
    if (existing) return existing;
    const generated = `dev-${crypto.randomUUID()}-${crypto.randomUUID()}`;
    localStorage.setItem(DEVICE_KEY_STORAGE, generated);
    return generated;
  } catch {
    return 'labsie-session-fallback-key';
  }
}

async function importAesKey(): Promise<CryptoKey> {
  const hash = await crypto.subtle.digest('SHA-256', utf8(getDeviceSecret()));
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export function isEncryptedField(value: string | undefined | null): boolean {
  return typeof value === 'string' && value.startsWith(ENC_PREFIX);
}

export async function encryptSensitive(value: string): Promise<string> {
  if (!value || isEncryptedField(value)) return value;
  const key = await importAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, utf8(value));
  return `${ENC_PREFIX}${toBase64Url(iv)}.${toBase64Url(cipher)}`;
}

export async function decryptSensitive(value: string): Promise<string> {
  if (!value || !isEncryptedField(value)) return value;
  try {
    const [ivB64, dataB64] = value.slice(ENC_PREFIX.length).split('.');
    if (!ivB64 || !dataB64) return '';
    const key = await importAesKey();
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64Url(ivB64) }, key, fromBase64Url(dataB64));
    return new TextDecoder().decode(plain);
  } catch {
    return '';
  }
}

export async function protectProfilePII<T extends { email?: string; phone?: string }>(profile: T): Promise<T> {
  const email = profile.email ? await encryptSensitive(profile.email) : profile.email;
  const phone = profile.phone ? await encryptSensitive(profile.phone) : profile.phone;
  return { ...profile, email, phone };
}

export async function revealProfilePII<T extends { email?: string; phone?: string }>(profile: T): Promise<T> {
  const email = profile.email ? await decryptSensitive(profile.email) : profile.email;
  const phone = profile.phone ? await decryptSensitive(profile.phone) : profile.phone;
  return { ...profile, email, phone };
}
