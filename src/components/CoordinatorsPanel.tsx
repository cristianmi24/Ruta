import React, { useEffect, useState } from 'react';
import { UserPlus, Trash2, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  CoordinatorAccount,
  createCoordinator,
  currentCoordinatorId,
  deleteCoordinator,
  fetchCoordinators
} from '../services/apiClient';

/** Gestión de cuentas de coordinación (guardadas en Neon con contraseña cifrada con scrypt). */
export const CoordinatorsPanel: React.FC = () => {
  const [list, setList] = useState<CoordinatorAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const myId = currentCoordinatorId();

  const load = async () => {
    setLoading(true);
    try {
      setList(await fetchCoordinators());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la lista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (password.length < 10) {
      setError('La contraseña debe tener al menos 10 caracteres.');
      return;
    }
    setSaving(true);
    try {
      await createCoordinator(email, password);
      setNotice(`Se agregó a ${email.trim().toLowerCase()}. Ya puede ingresar con su correo y contraseña.`);
      setEmail('');
      setPassword('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar el coordinador.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: CoordinatorAccount) => {
    if (!window.confirm(`¿Quitar el acceso de coordinación a ${c.email}?`)) return;
    setError(null);
    setNotice(null);
    try {
      await deleteCoordinator(c.id);
      setNotice(`Se quitó el acceso a ${c.email}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar.');
    }
  };

  const input =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#1C2624] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
      <section className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1C2624]">Equipo de coordinación</h2>
          <p className="text-xs text-[#3F4E4C]">Personas con acceso al panel. Las contraseñas se guardan cifradas en la base de datos.</p>
        </div>
        {loading ? (
          <p className="text-sm text-[#3F4E4C]">Cargando…</p>
        ) : (
          <ul className="divide-y divide-[#DDE2DE]">
            {list.map(c => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1C2624] truncate">
                      {c.email} {c.id === myId && <span className="ml-1 text-[10px] font-bold text-[#059669]">(tú)</span>}
                    </p>
                    <p className="text-[11px] text-[#3F4E4C]">Desde {new Date(c.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
                {c.id !== myId && list.length > 1 && (
                  <button
                    onClick={() => handleDelete(c)}
                    className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Quitar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={handleAdd} className="bg-[#FFFDF9] border-2 border-[#10B981] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#059669]" />
          <h2 className="font-serif text-lg font-bold text-[#1C2624]">Agregar coordinador</h2>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="newCoordEmail" className="text-xs font-bold text-[#1C2624]">Correo</label>
          <input id="newCoordEmail" type="email" required autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} className={input} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="newCoordPassword" className="text-xs font-bold text-[#1C2624]">Contraseña inicial (mín. 10 caracteres)</label>
          <div className="relative">
            <input
              id="newCoordPassword"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`${input} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#3F4E4C] p-1"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && (
          <p role="alert" className="flex items-start gap-1.5 text-xs font-bold text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}
        {notice && (
          <p className="flex items-start gap-1.5 text-xs font-bold text-[#065F46]">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {notice}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#059669] text-[#FFFDF9] text-sm font-bold hover:bg-[#047857] disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" /> {saving ? 'Guardando…' : 'Agregar coordinador'}
        </button>
      </form>
    </div>
  );
};
