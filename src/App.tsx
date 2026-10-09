/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WelcomeView } from './components/WelcomeView';
import { LinesView } from './components/LinesView';
import { TestView } from './components/TestView';
import { HeritageExplorer } from './components/HeritageExplorer';
import { ResultsView } from './components/ResultsView';
import { AdminDashboard } from './components/AdminDashboard';
import { WelcomeModal } from './components/WelcomeModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import PixelOffice from './components/PixelOffice';
import { Fireworks } from './components/Fireworks';
import { storageService, AppUser } from './services/storageService';
import { fetchAnalyses } from './services/apiClient';
import { revealProfilePII } from './services/dataProtection';
import { ResearchProject, ResearchLine, AnalysisResult } from './types';
import { AdminTab, View, buildPath, navigateTo, parseRoute } from './routes';

// Descifra correo y teléfono solo en memoria, para mostrarlos en pantalla y en los reportes
async function revealAnalyses(list: AnalysisResult[]): Promise<AnalysisResult[]> {
  return Promise.all(
    list.map(async a => {
      const profile = await revealProfilePII(a.studentProfile);
      return { ...a, studentProfile: profile, studentAnswers: { ...a.studentAnswers, profile } };
    })
  );
}

export default function App() {
  const initialRoute = parseRoute();
  const [currentView, setView] = useState<View>(initialRoute.view);
  const [adminTab, setAdminTab] = useState<AdminTab>(initialRoute.adminTab);
  const [adminStudentId, setAdminStudentId] = useState<string | null>(initialRoute.studentId);
  const [sessionChecked, setSessionChecked] = useState(false);

  /** Cambia de sección y actualiza la URL (al refrescar se queda en la misma). */
  const setCurrentView = (view: View, replace = false) => {
    setView(view);
    navigateTo(buildPath(view, view === 'admin' ? adminTab : undefined, view === 'admin' ? adminStudentId : null), replace);
  };

  const handleAdminRouteChange = (tab: AdminTab, studentId: string | null) => {
    setAdminTab(tab);
    setAdminStudentId(studentId);
    navigateTo(buildPath('admin', tab, studentId));
  };
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [lines, setLines] = useState<ResearchLine[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser>(storageService.getCurrentUser());
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [celebrationKey, setCelebrationKey] = useState<number | null>(null);

  // Semillero affiliation and popup modal state
  const [isTestUnlocked, setIsTestUnlocked] = useState<boolean>(storageService.isTestUnlocked());
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [welcomeModalMode, setWelcomeModalMode] = useState<'welcome' | 'locked-attempt'>('welcome');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  const loadData = async () => {
    setProjects(storageService.getProjects());
    setLines(storageService.getLines());
    setCurrentUser(storageService.getCurrentUser());

    // La coordinación consulta la base de datos PostgreSQL (Neon); se combina con lo local por id
    let allAnalyses = storageService.getAnalyses();
    if (storageService.isAdminAuthenticated()) {
      const remote = await fetchAnalyses().catch(err => {
        console.warn('No se pudieron cargar los análisis de la base de datos:', err);
        return [] as AnalysisResult[];
      });
      const byId = new Map(allAnalyses.map(a => [a.id, a]));
      remote.forEach(r => byId.set(r.id, r));
      allAnalyses = [...byId.values()].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
    const revealed = await revealAnalyses(allAnalyses);
    setAnalyses(revealed);
    setActiveAnalysis(prev => prev ?? revealed[0] ?? null);
  };

  useEffect(() => {
    storageService.restoreCoordinatorSession().finally(() => {
      setSessionChecked(true);
      loadData();
      // Si se refrescó en /coordinacion sin sesión válida, se pide iniciar sesión
      if (parseRoute().view === 'admin' && !storageService.isAdminAuthenticated()) {
        setView('welcome');
        navigateTo('/', true);
        setIsAdminAuthModalOpen(true);
      }
    });
    const unsubscribe = storageService.subscribe(() => {
      loadData();
    });
    // Botones atrás/adelante del navegador
    const onPop = () => {
      const r = parseRoute();
      setView(r.view);
      setAdminTab(r.adminTab);
      setAdminStudentId(r.studentId);
    };
    window.addEventListener('popstate', onPop);
    return () => {
      unsubscribe();
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  const handleTestComplete = (result: AnalysisResult) => {
    setActiveAnalysis(result);
    // Celebración al terminar la evaluación
    const key = Date.now();
    setCelebrationKey(key);
    setTimeout(() => setCelebrationKey(k => (k === key ? null : k)), 8000);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions from WelcomeModal and Route Activation Menu
  const handleJoinAndStartTest = () => {
    storageService.setSemilleroAffiliation('joined');
    setIsTestUnlocked(true);
    setIsWelcomeModalOpen(false);
    setCurrentView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActivateRoute = () => {
    storageService.setSemilleroAffiliation('joined');
    setIsTestUnlocked(true);
    setIsWelcomeModalOpen(false);
    setCurrentView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeactivateRoute = () => {
    storageService.setSemilleroAffiliation('exploring');
    setIsTestUnlocked(false);
  };

  const handleExploreBeforeTest = () => {
    storageService.setSemilleroAffiliation('exploring');
    setIsTestUnlocked(false);
    setIsWelcomeModalOpen(false);
    setCurrentView('heritage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct navigation with role separation protection
  const handleNavigate = (view: View) => {
    if (view === 'admin') {
      if (!storageService.isAdminAuthenticated()) {
        setIsAdminAuthModalOpen(true);
        return;
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthModalOpen(false);
    loadData();
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sección "Animación": solo el fondo, con un botón discreto para volver
  if (currentView === 'animacion') {
    return (
      <PixelOffice>
        <div className="min-h-screen pointer-events-none">
          <button
            onClick={() => handleNavigate('welcome')}
            className="pointer-events-auto cursor-pointer fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFDF9]/95 border-2 border-[#CCD4CF] text-sm font-bold text-[#1C2624] shadow-md hover:border-[#10B981] hover:text-[#059669] transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </PixelOffice>
    );
  }

  return (
    <PixelOffice plain={currentView === 'test' ? '#FFFFFF' : currentView === 'admin' ? '#FFFDF9' : undefined}>
    <div className="min-h-screen flex flex-col text-[#24302F] relative overflow-x-clip">

      {/* 3-Zone Header Contract with Route Activation Menu */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        isTestUnlocked={isTestUnlocked}
        onOpenWelcomeModal={() => {
          setWelcomeModalMode('welcome');
          setIsWelcomeModalOpen(true);
        }}
        onOpenAdminAuthModal={() => setIsAdminAuthModalOpen(true)}
        onActivateRoute={handleActivateRoute}
        onDeactivateRoute={handleDeactivateRoute}
      />

      {/* Main View Router — Firmemente ADELANTE con z-index positivo */}
      <main className="flex-1 relative z-10" style={{ position: 'relative', zIndex: 10 }}>
        {currentView === 'welcome' && (
          <WelcomeView
            onStartTest={() => handleNavigate('test')}
            onExploreHeritage={() => handleNavigate('heritage')}
            onExploreLines={() => handleNavigate('lineas')}
            projects={projects}
            lines={lines}
            isTestUnlocked={isTestUnlocked}
            onOpenWelcomeModal={() => {
              setWelcomeModalMode('welcome');
              setIsWelcomeModalOpen(true);
            }}
            onActivateRoute={handleActivateRoute}
            onDeactivateRoute={handleDeactivateRoute}
          />
        )}

        {currentView === 'lineas' && (
          <LinesView projects={projects} onExploreHeritage={() => handleNavigate('heritage')} />
        )}

        {currentView === 'test' && (
          <TestView
            projects={projects}
            lines={lines}
            onTestComplete={handleTestComplete}
            onCancel={() => handleNavigate('welcome')}
            isTestUnlocked={isTestUnlocked}
            onActivateRoute={handleActivateRoute}
            onOpenWelcomeModal={() => {
              setWelcomeModalMode('welcome');
              setIsWelcomeModalOpen(true);
            }}
            onExploreHeritage={() => handleNavigate('heritage')}
          />
        )}

        {currentView === 'heritage' && (
          <HeritageExplorer
            projects={projects}
            lines={lines}
            onStartTest={() => handleNavigate('test')}
            isTestUnlocked={isTestUnlocked}
          />
        )}

        {currentView === 'results' && !activeAnalysis && (
          <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] p-8 space-y-4">
              <p className="font-serif text-xl font-bold text-[#1C2624]">Aún no tienes un reporte en este navegador</p>
              <button onClick={() => handleNavigate('test')} className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#059669] text-[#FFFDF9] text-sm font-bold">
                Ir a mi ruta
              </button>
            </div>
          </div>
        )}

        {currentView === 'results' && activeAnalysis && (
          <ResultsView
            analysis={activeAnalysis}
            onExploreHeritage={() => handleNavigate('heritage')}
            onRetakeTest={() => handleNavigate('test')}
          />
        )}

        {currentView === 'admin' && storageService.isAdminAuthenticated() && (
          <AdminDashboard
            initialTab={adminTab}
            initialStudentId={adminStudentId}
            onRouteChange={handleAdminRouteChange}
            analyses={analyses}
            projects={projects}
            lines={lines}
            onRefreshData={loadData}
            onExitAdmin={() => handleNavigate('welcome')}
          />
        )}
      </main>

      {celebrationKey !== null && <Fireworks key={celebrationKey} />}

      {/* Institutional Footer */}
      <Footer />

      {/* Ventana emergente al inicio: Bienvenida, Promoción, Logotipos Grandes y Decisión */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onJoinAndStartTest={handleJoinAndStartTest}
        onExploreBeforeTest={handleExploreBeforeTest}
        mode={welcomeModalMode}
        totalProjectsCount={projects.length}
      />

      {/* Modal de Autenticación de Administrador con Clave Única */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />
    </div>
    </PixelOffice>
  );
}
