import React from 'react';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Lock,
  X,
  Award,
  GraduationCap,
  Users,
  Lightbulb
} from 'lucide-react';
import { LabSIELogo } from './LabSIELogo';
import { EduTLANLogo } from './EduTLANLogo';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinAndStartTest: () => void;
  onExploreBeforeTest: () => void;
  mode?: 'welcome' | 'locked-attempt';
  totalProjectsCount?: number;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onJoinAndStartTest,
  onExploreBeforeTest,
  mode = 'welcome',
  totalProjectsCount = 25
}) => {
  if (!isOpen) return null;

  const isLockedAttempt = mode === 'locked-attempt';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1C2624]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div className="relative w-full max-w-2xl lg:max-w-3xl my-auto max-h-[92vh] overflow-y-auto bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-3xl shadow-2xl p-5 sm:p-7 md:p-8 space-y-5">
        {/* Close button (top right) */}
        <button
          onClick={onClose}
          type="button"
          className="cursor-pointer absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#CCD4CF] text-[#24302F] hover:bg-[#F2EDE5] hover:text-[#059669] transition-all flex items-center justify-center shadow-xs"
          title="Cerrar ventana"
          aria-label="Cerrar ventana emergente"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3.5 pr-8 sm:pr-0">
          {/* Badge Convocatoria & Promoción */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span>Convocatoria de Promoción e Invitación · Semillero de Investigación</span>
          </div>

          {/* DUAL LOGOS CONTAINER - BOTH LOGOS CRYSTAL CLEAR & PROMINENT */}
          <div className="p-3 sm:p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#CCD4CF] shadow-xs flex flex-row items-center justify-center gap-4 sm:gap-8 max-w-lg mx-auto">
            {/* Logo 1: LABSIE */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#059669] mb-0.5">
                Semillero LabSIE
              </span>
              <LabSIELogo size="md" className="hover:scale-[1.02] transition-transform" />
            </div>

            {/* Institutional Divider */}
            <div className="w-px h-16 bg-[#CCD4CF] shrink-0" aria-hidden="true" />

            {/* Logo 2: EDUTLAN */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#92400E] mb-0.5">
                Grupo EduTLAN (Cat. A)
              </span>
              <EduTLANLogo size="md" showCategoryBadge={true} className="hover:scale-[1.02] transition-transform" />
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-1 max-w-2xl mx-auto">
            <h2
              id="welcome-modal-title"
              className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#1C2624] tracking-tight leading-snug"
            >
              ¡Te invitamos a ser parte del Semillero de Investigación LabSIE!
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#059669] tracking-wide uppercase">
              Grupo EduTLAN (Categoría A MinCiencias) · Licenciatura en Informática · Unicórdoba
            </p>
          </div>
        </div>

        {/* Conditional Alert if user tried to run test while not joined */}
        {isLockedAttempt && (
          <div className="p-3.5 rounded-xl bg-[#FEF3C7] border-2 border-[#FCD34D] flex items-start gap-2.5 shadow-xs">
            <Lock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs text-[#78350F]">
              <strong className="font-bold text-[#92400E] block text-xs sm:text-sm">
                ⚠️ El Test está reservado para miembros que deseen ingresar al Semillero LabSIE
              </strong>
              <p className="leading-relaxed">
                Para habilitar y realizar el test de caracterización investigativa, debes aceptar la invitación e ingresar al semillero. Si prefieres explorar primero, puedes revisar los proyectos antes de tomar tu decisión.
              </p>
            </div>
          </div>
        )}

        {/* Promotional Invitation Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#CCD4CF] space-y-3.5 shadow-xs text-left">
          <div className="flex items-center gap-2 text-[#059669] font-bold text-xs sm:text-sm">
            <GraduationCap className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Invitación Especial para Estudiantes de Licenciatura en Informática:</span>
          </div>

          <p className="text-[#1C2624] text-xs sm:text-sm leading-relaxed font-normal">
            Esta es una <strong>convocatoria de promoción y vinculación</strong>. El <strong>Semillero de Investigación LabSIE</strong>, respaldado por el <strong>Grupo EduTLAN</strong> (Categoría A MinCiencias), abre sus puertas para impulsar tus ideas en Inteligencia Artificial y tecnologías educativas, y acompañarte en la consolidación de tu trabajo de grado.
          </p>

          {/* 4 Pillars of the Semillero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] flex items-start gap-2.5 shadow-xs">
              <Lightbulb className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs">
                <strong className="text-[#1C2624] block">Inteligencia Artificial y Educación</strong>
                <span className="text-[#526066]">Sistemas inteligentes, analítica del aprendizaje y entornos pedagógicos.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] flex items-start gap-2.5 shadow-xs">
              <Users className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs">
                <strong className="text-[#1C2624] block">Mentoría Docente EduTLAN</strong>
                <span className="text-[#526066]">Acompañamiento cercano de profesores investigadores categorizados.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] flex items-start gap-2.5 shadow-xs">
              <Award className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs">
                <strong className="text-[#1C2624] block">Tu Trabajo de Grado Asegurado</strong>
                <span className="text-[#526066]">Articula tus ideas con investigaciones reales y consolida tu monografía.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] flex items-start gap-2.5 shadow-xs">
              <BookOpen className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs">
                <strong className="text-[#1C2624] block">Publicaciones y RedCOLSI</strong>
                <span className="text-[#526066]">Participación en encuentros departamentales, nacionales y memorias.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Decision Question Box */}
        <div className="text-center p-3.5 sm:p-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] space-y-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#059669]">
            Activación Requerida
          </span>
          <p className="font-serif text-sm sm:text-base font-bold text-[#065F46]">
            ¿Quieres ingresar al Semillero LabSIE y activar tu test ahora, o prefieres explorar las investigaciones primero?
          </p>
        </div>

        {/* Modal Actions Footer: Clearly separated, prominent, never overlapped */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Path 2: Explore First */}
          <button
            type="button"
            onClick={onExploreBeforeTest}
            className="cursor-pointer order-2 sm:order-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#1C2624] font-bold text-xs sm:text-sm hover:bg-[#F2EDE5] hover:border-[#059669] transition-all shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Explorar investigaciones primero ({totalProjectsCount} proyectos)</span>
          </button>

          {/* Path 1: Join Semillero & Activate Route (Enables Test) */}
          <button
            type="button"
            onClick={onJoinAndStartTest}
            className="cursor-pointer order-1 sm:order-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#10B981] text-[#FFFDF9] font-bold text-xs sm:text-sm hover:bg-[#059669] transition-all shadow-md hover:shadow-lg border-2 border-[#10B981] group"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FFFDF9] shrink-0" />
            <span>¡Sí, quiero ingresar! Activar Ruta y Test</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
