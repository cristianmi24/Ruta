import React, { useEffect, useRef } from 'react';
import { Sparkles, Lock, ShieldCheck, LogOut, KeyRound, Clapperboard, Home, Layers, Library, Route } from 'lucide-react';
import { storageService, AppUser } from '../services/storageService';
import type { View } from '../routes';
import { LabSIELogo } from './LabSIELogo';
import { EduTLANLogo } from './EduTLANLogo';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  currentUser: AppUser;
  isTestUnlocked?: boolean;
  onOpenWelcomeModal?: () => void;
  onOpenAdminAuthModal?: () => void;
  onActivateRoute?: () => void;
  onDeactivateRoute?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  isTestUnlocked = false,
  onOpenWelcomeModal,
  onOpenAdminAuthModal,
  onActivateRoute,
  onDeactivateRoute
}) => {
  const isAdmin = currentUser.role === 'admin';
  const headerRef = useRef<HTMLElement>(null);

  // Publica la altura del encabezado para que otros menús fijos se ubiquen justo debajo
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--header-h');
    };
  }, []);
  const inAdmin = currentView === 'admin';

  const handleAdminClick = () => {
    if (isAdmin) {
      onNavigate('admin');
    } else {
      if (onOpenAdminAuthModal) {
        onOpenAdminAuthModal();
      } else {
        onNavigate('admin');
      }
    }
  };

  const handleLogoutAdmin = async () => {
    await storageService.logoutAdmin();
    onNavigate('welcome');
  };

  const openRoute = () => {
    if (!isTestUnlocked && onOpenWelcomeModal) {
      onOpenWelcomeModal();
    } else {
      onNavigate('test');
    }
  };

  type View = HeaderProps['currentView'];
  const NAV: { view: View; label: string; icon: typeof Home; onClick?: () => void; locked?: boolean }[] = [
    { view: 'welcome', label: 'Inicio', icon: Home },
    { view: 'lineas', label: 'Líneas', icon: Layers },
    { view: 'heritage', label: 'Proyectos', icon: Library },
    { view: 'test', label: 'Mi ruta', icon: Route, onClick: openRoute, locked: !isTestUnlocked },
    { view: 'animacion', label: 'Animación', icon: Clapperboard }
  ];

  const navItem = (active: boolean, compact = false) =>
    `cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-bold transition-colors ${
      compact ? 'shrink-0 px-3 py-1.5 text-xs border' : 'px-3.5 py-2 text-sm'
    } ${
      active
        ? 'bg-[#059669] text-[#FFFDF9] border-[#059669] shadow-sm'
        : compact
          ? 'bg-[#FFFDF9] text-[#2D1A0B] border-[#E8D5B5]'
          : 'text-[#2D1A0B] hover:bg-[#FAF3E6] hover:text-[#047857]'
    }`;

  const renderNav = (compact: boolean) =>
    NAV.map(({ view, label, icon: Icon, onClick, locked }) => (
      <button
        key={view}
        onClick={onClick || (() => onNavigate(view))}
        className={navItem(currentView === view, compact)}
        aria-current={currentView === view ? 'page' : undefined}
      >
        {locked ? <Lock className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
        {label}
      </button>
    ));

  return (
    <>
      {/* Banner superior de horarios */}
      <div className="bg-[#047857] text-[#FFFDF9] text-xs sm:text-sm font-bold py-2 px-4 text-center flex items-center justify-center gap-2 relative z-50">
        <span className="text-lg">🕒</span>
        <span>
          <strong>Atención Director Manuel Caro:</strong> Martes de 3:00 a 4:00 p.m. | Miércoles y Viernes de 9:00 a 10:00 a.m.
        </span>
      </div>

      <header ref={headerRef} className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b-2 border-[#E8D5B5] px-3 sm:px-6 md:px-8 py-2.5 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand Zone con AMBOS Logos Oficiales (LabSIE y EduTLAN) */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-xl py-1 px-1 -ml-1 transition-all shrink-0"
          title="Ir al inicio: Semillero de Investigación LabSIE · Grupo EduTLAN"
          aria-label="Logotipos oficiales Semillero LabSIE y Grupo EduTLAN"
        >
          {/* Contenedor de Logos Oficiales */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LabSIELogo size="sm" className="group-hover:scale-105 transition-transform shrink-0" />
            <div className="w-px h-8 sm:h-9 bg-[#CCD4CF]" aria-hidden="true" />
            <EduTLANLogo size="sm" showCategoryBadge={false} className="group-hover:scale-105 transition-transform shrink-0" />
          </div>

          {/* Wordmark Institucional */}
          <div className="hidden 2xl:flex flex-col border-l-2 border-[#CCD4CF] pl-3 leading-tight py-0.5 justify-center">
            <span className="font-serif font-bold text-sm text-[#1C2624] tracking-tight">
              Semillero de Investigación LabSIE
            </span>
            <span className="text-[11px] font-bold text-[#059669]">
              Grupo EduTLAN · Licenciatura en Informática
            </span>
          </div>
        </button>

        {inAdmin ? (
          /* En coordinación: solo el menú del panel; aquí únicamente volver al sitio */
          <button
            onClick={() => onNavigate('welcome')}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#E8D5B5] bg-[#FFFDF9] text-xs sm:text-sm font-bold text-[#2D1A0B] hover:border-[#059669] hover:text-[#047857] transition-colors whitespace-nowrap"
          >
            <Home className="w-4 h-4" /> Volver al sitio
          </button>
        ) : (
          <>
          {/* Zone 2: Navegación principal (escritorio) */}
          <nav aria-label="Secciones" className="hidden xl:flex items-center gap-1 p-1 rounded-full bg-[#FFFDF9] border border-[#E8D5B5]">
            {renderNav(false)}
          </nav>

          {/* Zone 3: Acciones principales (Único botón de Coordinador + Botón de Test) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Botón único de Acceso / Gestión de Coordinación */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('admin')}
                  className="cursor-pointer text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-1.5 shadow-xs bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] hover:bg-[#D1FAE5]"
                  title="Ir al panel de coordinación"
                >
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span className="hidden sm:inline">Panel Coordinador</span>
                  <span className="sm:hidden">Panel</span>
                </button>
                <button
                  onClick={handleLogoutAdmin}
                  className="cursor-pointer text-xs font-bold p-2 sm:px-2.5 sm:py-2 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1 shadow-xs"
                  title="Cerrar sesión de coordinador"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminClick}
                className="cursor-pointer text-xs font-bold px-3 sm:px-3.5 py-2 rounded-xl border-2 transition-all whitespace-nowrap shadow-xs flex items-center gap-1.5 sm:gap-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#FAF8F5] hover:border-[#10B981] hover:text-[#059669]"
                title="Acceso exclusivo para docentes y coordinación de LabSIE"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#059669]" />
                <span className="hidden sm:inline">Acceso Coordinador</span>
                <span className="sm:hidden">Coordinador</span>
              </button>
            )}

            {/* Botón principal de acción para estudiantes: Activar Ruta / Realizar Test */}
            {currentView !== 'test' && (
              <button
                type="button"
                onClick={() => {
                  if (!isTestUnlocked) {
                    if (onOpenWelcomeModal) onOpenWelcomeModal();
                  } else {
                    onNavigate('test');
                  }
                }}
                className={`cursor-pointer text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap shadow-sm border-2 items-center gap-1.5 hidden sm:flex ${
                  isTestUnlocked
                    ? 'bg-[#10B981] text-[#FFFDF9] hover:bg-[#059669] border-[#10B981]'
                    : 'bg-[#059669] text-[#FFFDF9] hover:bg-[#047857] border-[#059669]'
                }`}
                title={isTestUnlocked ? 'Comenzar Test Vocacional' : 'Abrir invitación al semillero y activar ruta'}
              >
                {!isTestUnlocked ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#FEF3C7]" />
                    <span>Activar Ruta</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#FFFDF9]" />
                    <span>Realizar Test</span>
                  </>
                )}
              </button>
            )}
          </div>
          </>
        )}
      </div>

      {/* Navegación en celulares y tabletas */}
      {!inAdmin && (
        <nav aria-label="Navegación principal" className="xl:hidden mt-2 -mx-1 px-1 pb-0.5 flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
          {renderNav(true)}
        </nav>
      )}
    </header>
    </>
  );
};
