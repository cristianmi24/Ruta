/**
 * LabSIE · Ruta Investigativa
 * Types & Domain Interfaces
 */

export type RouteType = 'HEREDAR' | 'CONECTAR' | 'TRASCENDER' | 'EXPLORAR';

export type CorrespondenceLevel =
  | 'Baja correspondencia'
  | 'Correspondencia exploratoria'
  | 'Buena correspondencia'
  | 'Alta correspondencia';

export type ReviewStatus =
  | 'PENDING'
  | 'IN_ANALYSIS'
  | 'PERTINENT'
  | 'NEW_PROPOSAL'
  | 'NEEDS_INTERVIEW'
  | 'NO_CORRESPONDENCE';

export type AdminDecision =
  | 'VINCULAR_PROYECTO'
  | 'VINCULAR_LINEA'
  | 'NUEVA_PROPUESTA'
  | 'REQUIERE_ENTREVISTA'
  | 'EXPLORACION_ADICIONAL'
  | 'SIN_CORRESPONDENCIA';

export type ProjectStatus = 'active' | 'in_development' | 'completed' | 'historical';

export interface ResearchLine {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ResearchProject {
  id: string;
  code: string;
  title: string;
  lineId: string;
  lineName: string;
  description: string;
  problem: string;
  question: string;
  generalObjective: string;
  context: string;
  population: string;
  concepts: string[];
  methodology: string;
  results: string;
  limitaciones: string;
  openQuestions: string[];
  continuityPossibilities: string[];
  keywords: string[];
  status: ProjectStatus;
  year?: string;
  leadResearcher?: string;
}

export interface StudentProfileData {
  name: string;
  email: string;
  phone?: string; // Teléfono / WhatsApp institucional del estudiante
  program: 'Licenciatura en Informática';
  semester: string; // "1.º", "2.º", ... "10.º"
  wantsToJoinLabSIE?: string; // Respuesta a "¿Quieres ser parte del Semillero de Investigación LabSIE?"
  researchExperience:
    | 'No, es mi primer acercamiento.'
    | 'He participado en actividades de investigación.'
    | 'He participado en un proyecto.'
    | 'Tengo experiencia en investigación.'
    | string;
  techExperience: 'Básico' | 'Intermedio' | 'Avanzado' | 'Muy avanzado' | string;
  aiExperience: 'Nunca' | 'Algunas veces' | 'Ocasionalmente' | 'Frecuentemente' | 'Habitualmente' | string;
  // Caracterización de nuevo integrante del semillero
  personalPassions?: string[]; // Áreas y temáticas que le apasionan
  programmingInterestLevel?: string; // Gusto y afinidad por la programación
  programmingLanguages?: string[]; // Lenguajes y tecnologías de interés
  programmingExperienceSummary?: string; // Qué le gustaría construir o experiencia previa
  internationalProjectsInterest?: string; // Interés en proyectos que abarquen otros países / COIL / alianzas
  internationalMotivations?: string[]; // Aspectos de internacionalización que le atraen
  preferredRole?: string; // Rol soñado en el semillero
}

export interface TestAnswers {
  wantsToJoinLabSIE?: string; // Pregunta 1: Deseo de vinculación al Semillero LabSIE
  profile: StudentProfileData;
  // INTEGRACIÓN DE NUEVOS INTEGRANTES (GUSTOS, PROGRAMACIÓN, INTERNACIONALIZACIÓN)
  personalPassions?: string[]; // Qué le gusta al aspirante
  programmingInterestLevel?: string; // Gusto por la programación
  programmingLanguages?: string[]; // Lenguajes o tecnologías
  programmingExperienceSummary?: string; // Experiencia o aplicaciones soñadas
  internationalProjectsInterest?: string; // Proyectos que abarquen otros países
  internationalMotivations?: string[]; // Motivaciones de proyectos internacionales
  preferredRole?: string; // Rol preferido en el semillero
  // SECCIÓN 2 — TU CURIOSIDAD
  firstActionOnProblem: string; // Q7 (1 respuesta)
  curiosityQuestions: string[]; // Q8 (varias respuestas)
  // SECCIÓN 3 — ¿CÓMO TE GUSTARÍA INVESTIGAR?
  preferredActivities: string[]; // Q9 (máx 4)
  // SECCIÓN 4 — SITUACIONES
  scenarioDifficulty: string; // Q10 (A-F)
  scenarioTeacherAI: string; // Q11 (A-E)
  scenarioIntelligentSystem: string; // Q12 (A-G)
  scenarioCulturalChallenge: string; // Q13 (A-F)
  // SECCIÓN 5 — TU RELACIÓN CON LA IA
  aiInterests: string[]; // Q14 (varias respuestas)
  // SECCIÓN 6 — ¿QUÉ TIPO DE INVESTIGADOR TE REPRESENTA?
  researcherArchetypes: string[]; // Q15 (máx 3)
  // SECCIÓN 7 — TU PROPIA CURIOSIDAD
  problemToInvestigate: string; // Q16 (respuesta larga)
  dreamResearch: string; // Q17 (respuesta larga)
  sixMonthsDiscovery: string; // Q18 (respuesta larga)
  // SECCIÓN 9 — CONEXIÓN
  selectedLabSIEProjects: string[]; // Q19 (Proyecto 1-7 o 1-28)
  divergentProjectIdea: string; // Q20 (respuesta larga)
  // SECCIÓN 10 — HEREDAR, CONECTAR O CREAR
  continuationPreference: string; // Q21 (Profundizar, Conectar, Transformar, Crear, Explorar)
  // SECCIÓN 11 — CIERRE
  labsieExpectations: string[]; // Q22 (varias respuestas)
  additionalInterests: string; // Q23 (respuesta larga)
  // Backward compatibility / alias fields
  curiosities?: string[];
  researchWays?: string[];
  scenarios?: Record<string, string>;
  studentResearchIdea?: string;
  selectedProjects?: string[];
}

export interface RelatedProjectAffinity {
  projectId: string;
  projectTitle: string;
  projectCode: string;
  affinity: number; // 0-100
  connectionReason: string;
  matchingConcepts: string[];
}

export interface ProposedProject {
  tentativeTitle: string;
  tentativeQuestion: string;
  tentativeObjective: string;
  centralConcepts: string[];
  possibleContextPopulation: string;
  possibleContribution: string;
  nextSteps: string[];
  statusLabel: string; // e.g. "PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN"
}

export interface ProposedProjectOption {
  id: string; // 'opcion-1' | 'opcion-2' | 'opcion-3'
  optionNumber: number; // 1, 2, 3
  badge: string; // e.g. "Opción 1 · Prototipo con Inteligencia Artificial"
  icon: string; // e.g. "🤖", "📖", "🌐"
  category: 'Tecnológico & IA' | 'Didáctico & Aula' | 'Social & Comunitario' | 'Artificial Metacognition';
  tentativeTitle: string;
  tentativeQuestion: string;
  tentativeObjective: string;
  centralConcepts: string[];
  possibleContextPopulation: string;
  methodology: {
    name: string;
    description: string;
  };
  whyThisOption: string;
  possibleContribution: string;
  nextSteps: string[];
  isHighlighted?: boolean;
}

export interface AnalysisPerspective {
  id: 'tecnologico' | 'pedagogico' | 'social';
  title: string;
  badge: string;
  icon: string;
  shortDescription: string;
  focusArea: string;
  archetype: string;
  routeType: RouteType;
  correspondenceScore: number;
  correspondenceLevel: CorrespondenceLevel;
  primaryLineId: string;
  primaryLineName: string;
  methodologyFocus: {
    type: string;
    icon: string;
    description: string;
  };
  whyExplanation: string[];
  keyStrengths: string[];
  relatedProjects: RelatedProjectAffinity[];
  proposedProject: ProposedProject;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  algorithmVersion: string;
  studentId: string;
  studentProfile: StudentProfileData;
  routeType: RouteType;
  correspondenceScore: number;
  correspondenceLevel: CorrespondenceLevel;
  profileArchetype: string;
  interestPercentages: Record<string, number>;
  dominantResearchWays: string[];
  primaryLineId: string;
  primaryLineName: string;
  relatedProjects: RelatedProjectAffinity[];
  whyExplanation: string[];
  whyBreakdown: {
    matchingInterests: string[];
    matchingWays: string[];
    relatedConcepts: string[];
    selectedProjectsCount: number;
    studentIdeaAnalysis: string;
    detectedConnections: string[];
  };
  proposedProject: ProposedProject;
  proposedProjectOptions?: ProposedProjectOption[];
  selectedProjectOptionId?: string;
  perspectives?: AnalysisPerspective[];
  selectedPerspectiveId?: 'tecnologico' | 'pedagogico' | 'social';
  studentAnswers: TestAnswers;
  adminReview?: AdminReview;
  qwenAnalysis?: {
    model: string;
    analysisTimestamp: string;
    contrastingNarrative: string;
    topMatchingProjects: {
      projectCode: string;
      projectTitle: string;
      matchRationale: string;
    }[];
    programmingAffinityNote: string;
    internationalDimensionNote: string;
    newMemberIntegrationAdvice: string;
    whereYouCanEnter?: string;
    projectsYouCanDo?: {
      projectCode: string;
      projectTitle: string;
      whatYouCanDo: string;
    }[];
    closingNote?: string;
    warmLetter?: string[];
  };
  consentToken?: string; // JWT de aceptación de términos (tratamiento de datos)
}

export interface AdminReview {
  id: string;
  status: ReviewStatus;
  decision: AdminDecision;
  assignedLineId?: string;
  assignedProjectId?: string;
  assignedTutor?: string;
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  adminComments?: string;
  reviewedAt: string;
  reviewedBy: string;
}

export interface QuestionDefinition {
  id: string;
  category: 'curiosity' | 'way' | 'scenario';
  title: string;
  description?: string;
  options: {
    id: string;
    label: string;
    description?: string;
    tags: string[];
  }[];
}
