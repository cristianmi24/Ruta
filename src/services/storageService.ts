import {
  ResearchProject,
  ResearchLine,
  AnalysisResult,
  AdminReview
} from '../types';
import { INITIAL_PROJECTS, INITIAL_RESEARCH_LINES, DEMO_ANALYSES } from '../data/initialData';
import * as api from './apiClient';
import { revealProfilePII } from './dataProtection';

const STORAGE_KEYS = {
  PROJECTS: 'labsie_research_projects_v11',
  LINES: 'labsie_research_lines_v11',
  ANALYSES: 'labsie_analysis_results_v11',
  CURRENT_USER: 'labsie_current_user_v11',
  SEMILLERO_AFFILIATION: 'labsie_semillero_affiliation_v11',
  ADMIN_AUTH: 'labsie_admin_authenticated_v1'
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

class StorageService {
  private projects: ResearchProject[] = [];
  private lines: ResearchLine[] = [];
  private analyses: AnalysisResult[] = [];
  private currentUser: AppUser = {
    id: 'guest-student',
    name: 'Estudiante LabSIE',
    email: 'estudiante@correo.unicordoba.edu.co',
    role: 'student'
  };
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initialize();
    this.loadRemoteCatalog();
  }

  /** Proyectos y líneas guardados por la coordinación en Neon tienen prioridad sobre los locales. */
  private async loadRemoteCatalog() {
    try {
      const { projects, lines } = await api.fetchCatalog();
      if (!projects.length && !lines.length) return;
      projects.forEach(p => {
        const i = this.projects.findIndex(x => x.id === p.id);
        if (i >= 0) this.projects[i] = p;
        else this.projects.push(p);
      });
      lines.forEach(l => {
        const i = this.lines.findIndex(x => x.id === l.id);
        if (i >= 0) this.lines[i] = l;
        else this.lines.push(l);
      });
      this.projects.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
      this.persistProjects();
      this.persistLines();
      this.notify();
    } catch (e) {
      console.warn('Catálogo remoto no disponible:', e);
    }
  }

  private pushCatalog(action: Promise<unknown>) {
    action.catch(err => console.warn('No se pudo sincronizar el catálogo con la base de datos:', err));
  }

  private initialize() {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
        // Ensure all official 18 projects are present and updated with official data
        INITIAL_PROJECTS.forEach(initP => {
          const idx = this.projects.findIndex(p => p.id === initP.id);
          if (idx >= 0) {
            this.projects[idx] = { ...this.projects[idx], ...initP };
          } else {
            this.projects.push(initP);
          }
        });
        // Sort stably by code in natural order (LABSIE-P01 to P18)
        this.projects.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
        this.persistProjects();
      } else {
        this.projects = [...INITIAL_PROJECTS];
        this.projects.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
        this.persistProjects();
      }

      const storedLines = localStorage.getItem(STORAGE_KEYS.LINES);
      if (storedLines) {
        this.lines = JSON.parse(storedLines);
        // Guarantee synchronization with all official research lines (including Artificial Metacognition)
        const validIds = new Set(INITIAL_RESEARCH_LINES.map(l => l.id));
        const allPresent = INITIAL_RESEARCH_LINES.every(l => this.lines.some(cur => cur.id === l.id));
        if (this.lines.length !== INITIAL_RESEARCH_LINES.length || !allPresent || this.lines.some(l => !validIds.has(l.id))) {
          this.lines = [...INITIAL_RESEARCH_LINES];
          this.persistLines();
        }
      } else {
        this.lines = [...INITIAL_RESEARCH_LINES];
        this.persistLines();
      }

      const storedAnalyses = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      if (storedAnalyses) {
        this.analyses = JSON.parse(storedAnalyses);
      } else {
        this.analyses = [...DEMO_ANALYSES];
        this.persistAnalyses();
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn('Storage initialization fallback to memory', e);
      this.projects = [...INITIAL_PROJECTS];
      this.lines = [...INITIAL_RESEARCH_LINES];
      this.analyses = [...DEMO_ANALYSES];
    }
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private persistProjects() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
    } catch (e) {
      console.error(e);
    }
  }

  private persistLines() {
    try {
      localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(this.lines));
    } catch (e) {
      console.error(e);
    }
  }

  private persistAnalyses() {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(this.analyses));
    } catch (e) {
      console.error(e);
    }
  }

  // --- Current User & Role ---
  public getCurrentUser(): AppUser {
    return this.currentUser;
  }

  public setCurrentUser(user: AppUser) {
    this.currentUser = user;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public isAdminAuthenticated(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return val === 'true' && this.currentUser.role === 'admin';
    } catch {
      return false;
    }
  }

  /** Inicia sesión de coordinación con correo y contraseña (Supabase Auth). */
  public async loginCoordinator(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const confirmed = await api.loginCoordinator(email, password);
      this.markAdminSession(confirmed);
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'No fue posible iniciar sesión.' };
    }
  }

  /** Revalida la sesión guardada contra Supabase; si ya no es válida, cierra la sesión local. */
  public async restoreCoordinatorSession(): Promise<boolean> {
    const email = await api.currentCoordinator();
    if (email) {
      this.markAdminSession(email);
      return true;
    }
    if (this.isAdminAuthenticated() || this.currentUser.role === 'admin') this.clearAdminSession();
    return false;
  }

  public async logoutAdmin(): Promise<void> {
    this.clearAdminSession();
    api.logoutCoordinator();
  }

  private markAdminSession(email: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } catch (e) {
      console.error(e);
    }
    this.setCurrentUser({
      id: `coordinator:${email}`,
      name: 'Coordinación LabSIE / EduTLAN',
      email,
      role: 'admin'
    });
  }

  private clearAdminSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch (e) {
      console.error(e);
    }
    this.setCurrentUser({
      id: 'guest-student',
      name: 'Estudiante LabSIE',
      email: '',
      role: 'student'
    });
  }

  // --- Semillero Affiliation & Route Activation ---
  public getSemilleroAffiliation(): 'joined' | 'exploring' | null {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SEMILLERO_AFFILIATION);
      if (val === 'joined' || val === 'exploring') return val;
      return null;
    } catch {
      return null;
    }
  }

  public setSemilleroAffiliation(status: 'joined' | 'exploring' | null) {
    try {
      if (status) {
        localStorage.setItem(STORAGE_KEYS.SEMILLERO_AFFILIATION, status);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SEMILLERO_AFFILIATION);
      }
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public isTestUnlocked(): boolean {
    return this.getSemilleroAffiliation() === 'joined';
  }

  // --- Projects CRUD ---
  public getProjects(): ResearchProject[] {
    return [...this.projects];
  }

  public getProjectById(id: string): ResearchProject | undefined {
    return this.projects.find(p => p.id === id);
  }

  public saveProject(project: ResearchProject): void {
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      this.projects[index] = { ...project };
    } else {
      this.projects.push({ ...project });
    }
    this.persistProjects();
    this.notify();
    if (this.isAdminAuthenticated()) this.pushCatalog(api.saveCatalogItem('project', project));
  }

  public deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.persistProjects();
    this.notify();
    if (this.isAdminAuthenticated()) this.pushCatalog(api.deleteCatalogItem('project', id));
  }

  // --- Lines CRUD ---
  public getLines(): ResearchLine[] {
    return [...this.lines];
  }

  public getLineById(id: string): ResearchLine | undefined {
    return this.lines.find(l => l.id === id);
  }

  public saveLine(line: ResearchLine): void {
    const index = this.lines.findIndex(l => l.id === line.id);
    if (index >= 0) {
      this.lines[index] = { ...line };
    } else {
      this.lines.push({ ...line });
    }
    this.persistLines();
    this.notify();
    if (this.isAdminAuthenticated()) this.pushCatalog(api.saveCatalogItem('line', line));
  }

  public deleteLine(id: string): void {
    this.lines = this.lines.filter(l => l.id !== id);
    this.persistLines();
    this.notify();
    if (this.isAdminAuthenticated()) this.pushCatalog(api.deleteCatalogItem('line', id));
  }

  // --- Analysis Results CRUD ---
  public getAnalyses(): AnalysisResult[] {
    return [...this.analyses].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public getAnalysisById(id: string): AnalysisResult | undefined {
    return this.analyses.find(a => a.id === id);
  }

  public saveAnalysis(analysis: AnalysisResult): void {
    const index = this.analyses.findIndex(a => a.id === analysis.id);
    if (index >= 0) {
      this.analyses[index] = { ...analysis };
    } else {
      this.analyses.unshift({ ...analysis });
    }
    this.persistAnalyses();
    this.notify();
  }

  public updateSelectedProjectOption(analysisId: string, optionId: string): void {
    const target = this.analyses.find(a => a.id === analysisId);
    if (target) {
      target.selectedProjectOptionId = optionId;
      this.persistAnalyses();
      this.notify();
      // Se reenvía al servidor con los datos personales en claro (el servidor los cifra con su clave)
      revealProfilePII(target.studentProfile)
        .then(profile => api.submitAnalysis({ ...target, studentProfile: profile, studentAnswers: { ...target.studentAnswers, profile } }))
        .catch(err => console.warn('No se pudo sincronizar la opción elegida:', err));
    }
  }

  public async updateAdminReview(analysisId: string, review: AdminReview): Promise<void> {
    const target = this.analyses.find(a => a.id === analysisId);
    if (target) {
      target.adminReview = review;
      this.persistAnalyses();
    }
    if (this.isAdminAuthenticated()) {
      try {
        await api.saveAdminReview(analysisId, review);
      } catch (err) {
        console.warn('No se pudo guardar la revisión en la base de datos:', err);
      }
    }
    this.notify();
  }

  public resetToDefaults(): void {
    this.projects = [...INITIAL_PROJECTS];
    this.lines = [...INITIAL_RESEARCH_LINES];
    this.analyses = [...DEMO_ANALYSES];
    this.persistProjects();
    this.persistLines();
    this.persistAnalyses();
    this.notify();
  }
}

export const storageService = new StorageService();
