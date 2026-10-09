import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, X, Mail, KeyRound } from 'lucide-react';
import { storageService } from '../services/storageService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Ingresa tu correo y tu contraseña.');
      return;
    }

    setIsSubmitting(true);
    const result = await storageService.loginCoordinator(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg(result.error || 'No fue posible iniciar sesión.');
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#1C2624] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all placeholder:text-[#3F4E4C]/50';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coordinator-login-title"
    >
      <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl border-2 border-[#CCD4CF] shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-1.5 rounded-lg text-[#3F4E4C] hover:text-[#1C2624] hover:bg-[#FAF8F5] transition-colors"
          aria-label="Cerrar inicio de sesión"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#059669] shadow-xs">
            <ShieldCheck className="w-8 h-8 text-[#059669]" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#059669] block mb-1">
              Semillero LabSIE · Grupo EduTLAN
            </span>
            <h2 id="coordinator-login-title" className="font-serif text-2xl font-bold text-[#1C2624]">
              Ingreso de coordinación
            </h2>
            <p className="text-xs text-[#3F4E4C] mt-1.5 leading-relaxed">
              Acceso exclusivo para coordinadores y tutores del semillero. Los estudiantes no necesitan cuenta para hacer el test.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="coordinatorEmail" className="flex items-center gap-1.5 text-xs font-bold text-[#1C2624]">
              <Mail className="w-3.5 h-3.5 text-[#059669]" /> Correo
            </label>
            <input
              id="coordinatorEmail"
              type="email"
              autoComplete="username"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="coordinacion@ejemplo.com"
              autoFocus
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="coordinatorPassword" className="flex items-center gap-1.5 text-xs font-bold text-[#1C2624]">
              <KeyRound className="w-3.5 h-3.5 text-[#059669]" /> Contraseña
            </label>
            <div className="relative">
              <input
                id="coordinatorPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#3F4E4C] hover:text-[#1C2624] p-1 transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div role="alert" className="flex items-center gap-1.5 text-xs font-bold text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-[#059669] text-[#FFFDF9] hover:bg-[#047857] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Verificando...' : 'Iniciar sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer w-full py-2 px-4 rounded-xl font-bold text-xs text-[#3F4E4C] hover:text-[#1C2624] hover:bg-[#FAF8F5] transition-colors"
            >
              Cancelar y continuar como estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
