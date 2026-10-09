import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Layers,
  Search,
  Plus,
  X,
  CheckCircle2,
  Bookmark,
  Compass,
  Filter,
  Lock,
  Code,
  Globe,
  Heart,
  Cpu,
  UserCheck,
  Terminal,
  Languages,
  ShieldCheck
} from 'lucide-react';
import {
  StudentProfileData,
  TestAnswers,
  ResearchProject,
  ResearchLine,
  AnalysisResult
} from '../types';
import { runRecommendationEngine } from '../services/recommendationEngine';
import { researchAnalysisService } from '../services/aiService';
import { storageService } from '../services/storageService';
import { hasValidConsent, issueConsentToken, protectProfilePII, TERMS_VERSION } from '../services/dataProtection';
import { submitAnalysis } from '../services/apiClient';
import { getProjectMethodology } from '../data/projectMetadata';
import { LabSIELogo } from './LabSIELogo';
import { EduTLANLogo } from './EduTLANLogo';

interface TestViewProps {
  projects: ResearchProject[];
  lines: ResearchLine[];
  onTestComplete: (result: AnalysisResult) => void;
  onCancel: () => void;
  isTestUnlocked?: boolean;
  onActivateRoute?: () => void;
  onOpenWelcomeModal?: () => void;
  onExploreHeritage?: () => void;
}

const TOTAL_SECTIONS = 7;

export const TestView: React.FC<TestViewProps> = ({
  projects,
  lines,
  onTestComplete,
  onCancel,
  isTestUnlocked = true,
  onActivateRoute,
  onOpenWelcomeModal,
  onExploreHeritage
}) => {
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatusText, setAnalysisStatusText] = useState<string>('Mapeando perfil investigativo...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Términos y tratamiento de datos: deben aceptarse antes de diligenciar el formulario
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [consentAccepted, setConsentAccepted] = useState<boolean | null>(null);
  const [consentToken, setConsentToken] = useState<string | null>(null);

  useEffect(() => {
    setConsentAccepted(hasValidConsent());
  }, []);

  const handleAcceptTerms = async () => {
    if (!consentChecked) return;
    setErrorMsg(null);
    try {
      const token = await issueConsentToken();
      setConsentToken(token);
      setConsentAccepted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrorMsg('No pudimos registrar tu aceptación. Revisa tu conexión e intenta de nuevo.');
    }
  };

  // =========================================================================
  // ZERO PRE-SELECTION: All user answers start strictly EMPTY / UNSELECTED
  // =========================================================================

  // SECCIÓN 1 — 👤 DATOS PERSONALES Y ACADÉMICOS (Preguntas 1 a 8)
  const [name, setName] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [program, setProgram] = useState<string>('Licenciatura en Informática'); // Exclusivo Licenciatura en Informática
  const [semester, setSemester] = useState<string>(''); // No preselected semester
  const [researchExperience, setResearchExperience] = useState<string>(''); // No preselected experience
  const [techExperience, setTechExperience] = useState<string>(''); // No preselected tech
  const [aiExperience, setAiExperience] = useState<string>(''); // No preselected AI

  // CARACTERIZACIÓN NUEVOS INTEGRANTES (Gustos, Programación, Dimensión Internacional)
  const [personalPassions, setPersonalPassions] = useState<string[]>([]);
  const [programmingInterestLevel, setProgrammingInterestLevel] = useState<string>('');
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>([]);
  const [programmingExperienceSummary, setProgrammingExperienceSummary] = useState<string>('');
  const [internationalProjectsInterest, setInternationalProjectsInterest] = useState<string>('');
  const [internationalMotivations, setInternationalMotivations] = useState<string[]>([]);
  const [preferredRole, setPreferredRole] = useState<string>('');

  // SECCIÓN 2 — 🔎 TU CURIOSIDAD (Preguntas 7 y 8)
  const [firstActionOnProblem, setFirstActionOnProblem] = useState<string>(''); // No preselected first action
  const [curiosityQuestions, setCuriosityQuestions] = useState<string[]>([]); // Empty selection

  // SECCIÓN 3 — 🧠 ¿CÓMO TE GUSTARÍA INVESTIGAR? (Pregunta 9)
  const [preferredActivities, setPreferredActivities] = useState<string[]>([]); // Empty selection (máx 4)

  // SECCIÓN 4 — 🎯 SITUACIONES (Preguntas 10 a 14)
  const [scenarioDifficulty, setScenarioDifficulty] = useState<string>(''); // No preselected scenario
  const [scenarioTeacherAI, setScenarioTeacherAI] = useState<string>(''); // No preselected scenario
  const [scenarioIntelligentSystem, setScenarioIntelligentSystem] = useState<string>(''); // No preselected scenario
  const [scenarioCulturalChallenge, setScenarioCulturalChallenge] = useState<string>(''); // No preselected scenario
  const [aiInterests, setAiInterests] = useState<string[]>([]); // Empty selection

  // SECCIÓN 5 — 🗺️ EXPLORA EL PATRIMONIO DE LABSIE (Preguntas 15 a 17)
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null); // None expanded by default
  const [selectedLabSIEProjects, setSelectedLabSIEProjects] = useState<string[]>([]); // Empty selection
  const [divergentProjectIdea, setDivergentProjectIdea] = useState<string>('');
  const [section5FilterLine, setSection5FilterLine] = useState<string>('all');
  const [section5Search, setSection5Search] = useState<string>('');
  const [section5ViewMode, setSection5ViewMode] = useState<'by-line' | 'sequential'>('by-line');

  // SECCIÓN 6 — 💡 TUS PROPIAS IDEAS (Preguntas 18 a 21)
  const [problemToInvestigate, setProblemToInvestigate] = useState<string>('');
  const [dreamResearch, setDreamResearch] = useState<string>('');
  const [sixMonthsDiscovery, setSixMonthsDiscovery] = useState<string>('');
  const [continuationPreference, setContinuationPreference] = useState<string>(''); // No preselected continuation

  // SECCIÓN 7 — 🚀 TUS EXPECTATIVAS (Preguntas 22 y 23)
  const [labsieExpectations, setLabsieExpectations] = useState<string[]>([]); // Empty selection
  const [additionalInterests, setAdditionalInterests] = useState<string>('');

  // Opciones para Caracterización de Nuevos Integrantes
  const PERSONAL_PASSIONS_LIST = [
    'Inteligencia Artificial y Modelos de Lenguaje (LLMs)',
    'Programación y Desarrollo de Software (Web / Móvil)',
    'Analítica del Aprendizaje y Minería de Datos Educativos',
    'Gamificación, Videojuegos y Entornos Lúdicos',
    'Metacognición Artificial y Agentes Autónomos',
    'Didáctica, Pedagogía e Innovación en el Aula',
    'Preservación Cultural, Lenguas Nativas y Etnografía',
    'Neurocognición, STEAM y Robótica Educativa',
    'Inclusión Educativa, Diseño Universal (DUA) y Accesibilidad'
  ];

  const PROGRAMMING_LEVELS = [
    'Me apasiona programar: me encanta escribir código, resolver algoritmos y crear software.',
    'Me gusta la programación: conozco las bases y deseo profundizar y crear aplicaciones reales.',
    'Tengo conocimientos básicos: me interesa la lógica pero prefiero combinarlo con diseño y pedagogía.',
    'Prefiero el análisis conceptual y didáctico más que escribir código directamente.'
  ];

  const PROGRAMMING_LANGUAGES_LIST = [
    'Python (Machine Learning, IA, Datos)',
    'JavaScript / TypeScript / React (Desarrollo Web)',
    'Aplicaciones Móviles (Flutter / React Native)',
    'Modelos de IA Generativa y APIs (Qwen, DeepSeek, etc.)',
    'Bases de Datos (SQL, PostgreSQL, Supabase)',
    'Hardware Educativo (Micro:bit, Arduino, Robótica)',
    'Programación por Bloques / Scratch'
  ];

  const INTERNATIONAL_INTEREST_OPTIONS = [
    '¡Mucho! Me apasiona colaborar con universidades, estudiantes e investigadores de otros países.',
    'Sí, me interesan iniciativas internacionales como retos COIL e intercambio intercultural.',
    'Moderadamente: me interesaría si surge la oportunidad durante la investigación.',
    'Prefiero concentrarme primero en el contexto local y regional de Córdoba.'
  ];

  const INTERNATIONAL_MOTIVATIONS_LIST = [
    'Colaborar en retos computacionales conjuntos con estudiantes del exterior (COIL)',
    'Publicar artículos y participar en congresos y redes internacionales',
    'Co-diseñar soluciones tecnológicas con impacto transfronterizo o intercultural',
    'Aprender cómo se investiga y se enseña la informática en el mundo'
  ];

  const PREFERRED_ROLES_LIST = [
    'Desarrollador / Creador de Prototipos de Software e IA',
    'Investigador de Campo y Trabajo en Aula con Comunidades',
    'Diseñador Didáctico y de Experiencias Tecno-Pedagógicas',
    'Analista de Datos Educativos y Evaluación Cuantitativa',
    'Articulador de Proyectos Internacionales y Difusión Científica'
  ];

  // Section 2 Questions data
  const FIRST_ACTIONS = [
    'Comprender por qué ocurre.',
    'Buscar información sobre el problema.',
    'Analizar datos.',
    'Preguntar a las personas involucradas.',
    'Diseñar una posible solución.',
    'Construir un prototipo.',
    'Experimentar.',
    'Comparar diferentes alternativas.'
  ];

  const CURIOSITY_QUESTIONS = [
    '¿Por qué ocurre algo?',
    '¿Cómo aprenden las personas?',
    '¿Cómo mejorar un proceso?',
    '¿Cómo construir una solución?',
    '¿Cómo utilizar tecnología para resolver un problema?',
    '¿Cómo funcionan los sistemas inteligentes?',
    '¿Cómo detectar patrones en los datos?',
    '¿Cómo saber si una estrategia funciona?',
    '¿Cómo podría hacerse algo de una manera diferente?',
    '¿Qué podría ocurrir si cambiamos una determinada condición?',
    '¿Cómo pueden los sistemas de IA monitorear, evaluar y regular su propio razonamiento de forma autónoma (metacognición artificial)?'
  ];

  // Section 3 Activities
  const ACTIVITIES_LIST = [
    'Leer y analizar investigaciones.',
    'Formular preguntas.',
    'Entrevistar personas.',
    'Diseñar encuestas o instrumentos.',
    'Observar situaciones.',
    'Analizar datos.',
    'Buscar patrones.',
    'Diseñar actividades educativas.',
    'Programar.',
    'Crear aplicaciones.',
    'Diseñar interfaces.',
    'Trabajar con Inteligencia Artificial.',
    'Diseñar experimentos.',
    'Probar soluciones.',
    'Escribir.',
    'Presentar resultados.',
    'Trabajar directamente con estudiantes.',
    'Trabajar directamente con docentes.'
  ];

  // Section 4 Question 14: AI Interests
  const AI_INTERESTS_LIST = [
    'Una IA que ayuda a aprender.',
    'Una IA que ayuda a enseñar.',
    'Una IA que analiza datos educativos.',
    'Una IA que proporciona retroalimentación.',
    'Una IA que adapta actividades.',
    'Una IA que intenta comprender el comportamiento humano.',
    'Una IA que evalúa sus propias respuestas.',
    'Metacognición Artificial: Agentes que monitorean, evalúan y autorregulan su razonamiento (Object Level vs Meta Level).',
    'Una IA que ayuda a tomar decisiones.',
    'Una IA que genera recursos educativos.',
    'Investigar los límites y riesgos de la IA.'
  ];

  // Section 6 Question 21: Continuation options
  const CONTINUATION_OPTIONS = [
    { key: '🧬 Profundizar', title: '🧬 Profundizar', desc: 'Investigar algo que todavía no se haya estudiado suficientemente.' },
    { key: '🔗 Conectar', title: '🔗 Conectar', desc: 'Relacionar dos investigaciones diferentes.' },
    { key: '🌱 Transformar', title: '🌱 Transformar', desc: 'Llevar una investigación a otro contexto o población.' },
    { key: '💡 Crear', title: '💡 Crear', desc: 'Utilizar una investigación como punto de partida para algo nuevo.' },
    { key: '🧭 Explorar', title: '🧭 Explorar', desc: 'No lo sé todavía; quiero descubrirlo.' }
  ];

  // Section 7 Question 22: Expectations
  const EXPECTATIONS_LIST = [
    'Aprender a investigar.',
    'Participar en proyectos.',
    'Crear una investigación propia.',
    'Trabajar con IA.',
    'Desarrollar tecnología.',
    'Publicar.',
    'Participar en eventos.',
    'Encontrar un tema para mi trabajo de grado.',
    'Trabajar con otros estudiantes.',
    'Todavía no lo sé.'
  ];

  const sectionTitles = [
    '👤 Conócete',
    '🔎 Tu Curiosidad',
    '🧠 ¿Cómo te gustaría investigar?',
    '🎯 Situaciones y Desafíos',
    '🗺️ Explora el Patrimonio de LabSIE',
    '💡 Tus Propias Ideas',
    '🚀 Tus Expectativas'
  ];

  // Toggles for checkboxes
  const toggleCuriosityQ = (item: string) => {
    setCuriosityQuestions(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const toggleActivity = (act: string) => {
    if (preferredActivities.includes(act)) {
      setPreferredActivities(prev => prev.filter(x => x !== act));
    } else {
      if (preferredActivities.length >= 4) {
        setErrorMsg('Puedes seleccionar máximo 4 actividades en esta pregunta.');
        return;
      }
      setErrorMsg(null);
      setPreferredActivities(prev => [...prev, act]);
    }
  };

  const toggleAiInterest = (item: string) => {
    setAiInterests(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const toggleLabSIEProject = (projectId: string) => {
    setSelectedLabSIEProjects(prev =>
      prev.includes(projectId) ? prev.filter(x => x !== projectId) : [...prev, projectId]
    );
  };

  const toggleExpectation = (item: string) => {
    setLabsieExpectations(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const togglePassion = (passion: string) => {
    setPersonalPassions(prev =>
      prev.includes(passion) ? prev.filter(x => x !== passion) : [...prev, passion]
    );
  };

  const toggleProgrammingLanguage = (lang: string) => {
    setProgrammingLanguages(prev =>
      prev.includes(lang) ? prev.filter(x => x !== lang) : [...prev, lang]
    );
  };

  const toggleInternationalMotivation = (mot: string) => {
    setInternationalMotivations(prev =>
      prev.includes(mot) ? prev.filter(x => x !== mot) : [...prev, mot]
    );
  };

  // Navigations & Validations
  const handleNext = async () => {
    setErrorMsg(null);

    // Validation Section 1
    if (currentSection === 1) {
      if (!name.trim()) {
        setErrorMsg('Por favor escribe tu nombre completo (Pregunta 1).');
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMsg('Por favor escribe un correo electrónico institucional válido (Pregunta 2, ej: tu.usuario@correo.unicordoba.edu.co).');
        return;
      }
      if (!phone.trim() || phone.trim().replace(/\D/g, '').length < 7) {
        setErrorMsg('Por favor escribe un número de teléfono / WhatsApp válido (Pregunta 3, mínimo 7 dígitos).');
        return;
      }
      if (!program) {
        setErrorMsg('Por favor selecciona tu programa académico (Pregunta 4).');
        return;
      }
      if (!semester) {
        setErrorMsg('Por favor selecciona tu semestre actual (Pregunta 5).');
        return;
      }
      if (!researchExperience) {
        setErrorMsg('Por favor responde si has participado en investigación (Pregunta 6).');
        return;
      }
      if (!techExperience) {
        setErrorMsg('Por favor selecciona tu nivel de trabajo con tecnología (Pregunta 7).');
        return;
      }
      if (!aiExperience) {
        setErrorMsg('Por favor indica qué tanto has utilizado herramientas de IA (Pregunta 8).');
        return;
      }
      if (personalPassions.length === 0) {
        setErrorMsg('Por favor selecciona al menos una temática o área que te apasione (Pregunta 9).');
        return;
      }
      if (!programmingInterestLevel) {
        setErrorMsg('Por favor responde cuál es tu relación y gusto con la programación (Pregunta 10).');
        return;
      }
      if (!internationalProjectsInterest) {
        setErrorMsg('Por favor responde tu interés en proyectos que involucren otros países (Pregunta 12).');
        return;
      }
      if (!preferredRole) {
        setErrorMsg('Por favor selecciona el rol con el que te gustaría integrarte al semillero (Pregunta 13).');
        return;
      }
    }

    // Validation Section 2
    if (currentSection === 2) {
      if (!firstActionOnProblem) {
        setErrorMsg('Por favor selecciona qué es lo primero que te gustaría hacer (Pregunta 7).');
        return;
      }
      if (curiosityQuestions.length === 0) {
        setErrorMsg('Por favor selecciona al menos una pregunta que te genere curiosidad (Pregunta 8).');
        return;
      }
    }

    // Validation Section 3
    if (currentSection === 3) {
      if (preferredActivities.length === 0) {
        setErrorMsg('Por favor selecciona al menos 1 actividad que disfrutarías en un proyecto (máximo 4).');
        return;
      }
    }

    // Validation Section 4
    if (currentSection === 4) {
      if (!scenarioDifficulty) {
        setErrorMsg('Por favor responde la situación 10 (Dificultades en plataforma educativa).');
        return;
      }
      if (!scenarioTeacherAI) {
        setErrorMsg('Por favor responde la situación 11 (Docente con herramienta de IA).');
        return;
      }
      if (!scenarioIntelligentSystem) {
        setErrorMsg('Por favor responde la situación 12 (Sistema inteligente de observación).');
        return;
      }
      if (!scenarioCulturalChallenge) {
        setErrorMsg('Por favor responde la situación 13 (Reto colaborativo intercultural).');
        return;
      }
      if (aiInterests.length === 0) {
        setErrorMsg('Por favor selecciona al menos una posibilidad relacionada con IA (Pregunta 14).');
        return;
      }
    }

    // Validation Section 5
    if (currentSection === 5) {
      if (selectedLabSIEProjects.length === 0) {
        setErrorMsg('Por favor selecciona al menos una investigación del patrimonio que te llame la atención (Pregunta 16).');
        return;
      }
    }

    // Validation Section 6
    if (currentSection === 6) {
      if (!problemToInvestigate.trim()) {
        setErrorMsg('Por favor describe qué problema te gustaría investigar (Pregunta 18).');
        return;
      }
      if (!continuationPreference) {
        setErrorMsg('Por favor selecciona tu preferencia de continuidad: Profundizar, Conectar, Transformar, Crear o Explorar (Pregunta 21).');
        return;
      }
    }

    if (currentSection < TOTAL_SECTIONS) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await runAnalysis();
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStatusText('Mapeando respuestas y perfil académico de Licenciatura en Informática...');

    const profileData: StudentProfileData = {
      name: name.trim(),
      documentNumber: documentNumber.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@correo.unicordoba.edu.co`,
      phone: phone.trim(),
      program: (program || 'Licenciatura en Informática') as any,
      semester: semester || '1.º',
      wantsToJoinLabSIE: '¡Sí, quiero ser parte del Semillero LabSIE!',
      researchExperience: researchExperience || 'No, es mi primer acercamiento.',
      techExperience: techExperience || 'Intermedio',
      aiExperience: aiExperience || 'Ocasionalmente',
      personalPassions,
      programmingInterestLevel,
      programmingLanguages,
      programmingExperienceSummary,
      internationalProjectsInterest,
      internationalMotivations,
      preferredRole
    };

    const answers: TestAnswers = {
      wantsToJoinLabSIE: '¡Sí, quiero ser parte del Semillero LabSIE!',
      profile: profileData,
      personalPassions,
      programmingInterestLevel,
      programmingLanguages,
      programmingExperienceSummary,
      internationalProjectsInterest,
      internationalMotivations,
      preferredRole,
      firstActionOnProblem,
      curiosityQuestions,
      preferredActivities,
      scenarioDifficulty,
      scenarioTeacherAI,
      scenarioIntelligentSystem,
      scenarioCulturalChallenge,
      aiInterests,
      researcherArchetypes: [],
      problemToInvestigate,
      dreamResearch,
      sixMonthsDiscovery,
      selectedLabSIEProjects,
      divergentProjectIdea,
      continuationPreference,
      labsieExpectations,
      additionalInterests,
      // Backward compatibility aliases
      curiosities: curiosityQuestions,
      researchWays: preferredActivities,
      scenarios: {
        scenario_1: scenarioDifficulty,
        scenario_2: scenarioTeacherAI,
        scenario_3: scenarioIntelligentSystem,
        scenario_4: scenarioCulturalChallenge
      },
      studentResearchIdea: problemToInvestigate,
      selectedProjects: selectedLabSIEProjects
    };

    await new Promise(r => setTimeout(r, 600));
    setAnalysisStatusText('Contrastando gustos, programación y proyectos de otros países con los 28 proyectos de LabSIE...');
    await new Promise(r => setTimeout(r, 600));
    setAnalysisStatusText('Evaluando correspondencias multicriterio y rutas de investigación...');

    const baseResult = runRecommendationEngine(answers, projects, lines);

    let finalResult = baseResult;
    try {
      setAnalysisStatusText('Generando análisis y contraste científico mediante Qwen LLM...');
      finalResult = await researchAnalysisService.augmentAnalysisWithAI(baseResult, projects);
    } catch (e) {
      console.warn('AI layer fallback:', e);
    }

    // Registro en la base de datos (el servidor cifra correo y teléfono con su propia clave)
    const plainResult = finalResult;
    try {
      setAnalysisStatusText('Guardando tu caracterización de forma segura...');
      await submitAnalysis(plainResult);
    } catch (e) {
      console.warn('No se pudo registrar el análisis en la base de datos:', e);
    }

    // Copia local en este navegador con correo y teléfono cifrados (AES-GCM)
    const protectedProfile = await protectProfilePII(finalResult.studentProfile);
    finalResult = {
      ...finalResult,
      studentProfile: protectedProfile,
      studentAnswers: { ...finalResult.studentAnswers, profile: protectedProfile },
      consentToken: consentToken || undefined
    };
    storageService.saveAnalysis(finalResult);

    await new Promise(r => setTimeout(r, 400));
    setIsAnalyzing(false);
    onTestComplete({ ...plainResult, consentToken: finalResult.consentToken });
  };

  // Safe gate: El test solo se activará si el usuario busca ingresar al semillero, mientras decida que no, no dejes que pueda realizar el test
  if (!isTestUnlocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-3xl p-6 md:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] text-[#B45309] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Semillero de Investigación LabSIE · Grupo EduTLAN</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2624]">
              Acceso al Test de Exploración Investigativa
            </h2>
            <p className="text-sm text-[#526066] leading-relaxed">
              El test de caracterización investigativa está reservado exclusivamente para los estudiantes que desean ingresar al <strong>Semillero de Investigación LabSIE</strong> del <strong>Grupo EduTLAN</strong>. Mientras decidas que no, puedes explorar las investigaciones o consultar la información institucional.
            </p>
          </div>

          {/* Opciones de activación y vinculación */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border-2 border-[#CCD4CF] max-w-lg mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#059669] block">
              Convocatoria Oficial · Semillero LabSIE
            </span>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (onActivateRoute) onActivateRoute();
                }}
                className="cursor-pointer w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#10B981] text-[#FFFDF9] font-bold text-sm sm:text-base hover:bg-[#059669] transition-all shadow-md hover:shadow-lg border-2 border-[#10B981]"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>¡Sí, quiero ingresar! Activar mi Ruta y Test</span>
              </button>

              {onOpenWelcomeModal && (
                <button
                  type="button"
                  onClick={onOpenWelcomeModal}
                  className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#1C2624] font-bold text-xs sm:text-sm hover:bg-[#F2EDE5] hover:border-[#059669] transition-all shadow-xs"
                >
                  <Layers className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Ver de nuevo la ventana emergente de invitación</span>
                </button>
              )}

              {onExploreHeritage && (
                <button
                  type="button"
                  onClick={onExploreHeritage}
                  className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-transparent text-[#526066] font-semibold text-xs hover:text-[#1C2624] transition-all"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Explorar los 25 proyectos de investigación primero</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer text-xs font-semibold text-[#526066] hover:text-[#1C2624] underline underline-offset-2"
            >
              ← Volver a la pantalla de inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso previo obligatorio (en la página, no flotante): aceptación de términos y tratamiento de datos
  if (consentAccepted !== true) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <section
          aria-labelledby="terms-title"
          className="bg-[#FFFDF9]/95 backdrop-blur-sm border-2 border-[#CCD4CF] rounded-2xl p-5 sm:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] block">Antes de empezar</span>
              <h2 id="terms-title" className="font-serif text-xl sm:text-2xl font-bold text-[#1C2624]">
                Términos y tratamiento de tus datos
              </h2>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-[#CCD4CF] bg-[#FAF8F5] p-4 text-xs sm:text-sm text-[#1C2624] leading-relaxed space-y-3">
            <p>
              El <strong>Semillero LabSIE</strong> y el <strong>Grupo EduTLAN</strong> (Universidad de Córdoba) recogen tus datos para
              caracterizar tu perfil investigativo y recomendarte una ruta y proyectos dentro del semillero, conforme a la Ley 1581 de 2012
              de protección de datos personales (Habeas Data).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Qué recogemos:</strong> nombre, correo, teléfono, programa, semestre y tus respuestas al test.</li>
              <li><strong>Para qué:</strong> generar tu reporte de ruta investigativa y que la coordinación del semillero pueda acompañarte.</li>
              <li><strong>Cómo los protegemos:</strong> tu aceptación queda firmada en un token JWT; tu correo y teléfono se cifran (AES-GCM) antes de guardarse, y solo la coordinación autenticada puede consultar los registros.</li>
              <li><strong>Análisis con IA:</strong> para redactar tu reporte se envían tus respuestas y tu primer nombre a un modelo de lenguaje (Qwen). Nunca se envían tu correo ni tu teléfono.</li>
              <li><strong>Tus derechos:</strong> puedes conocer, actualizar, rectificar o pedir la supresión de tus datos a través de edutlan.online.</li>
            </ul>
            <p className="text-[11px] text-[#526066]">Versión de los términos: {TERMS_VERSION}</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 border-[#CCD4CF] bg-[#FFFDF9] hover:border-[#10B981] transition-colors">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={e => setConsentChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#059669] shrink-0"
            />
            <span className="text-xs sm:text-sm text-[#1C2624] font-medium">
              He leído y acepto los términos y autorizo el tratamiento de mis datos personales para este fin.
            </span>
          </label>

          {errorMsg && (
            <p role="alert" className="flex items-center gap-2 text-xs font-bold text-[#B65C5C]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#24302F] bg-[#FFFDF9] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio</span>
            </button>
            <button
              type="button"
              onClick={handleAcceptTerms}
              disabled={!consentChecked || consentAccepted === null}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#10B981] text-[#FFFDF9] text-sm font-bold hover:bg-[#059669] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Aceptar y comenzar el test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 md:px-10 py-6 md:py-10">
      {/* =================================================================== */}
      {/* TOP INSTITUTIONAL HEADER & OFFICIAL LOGO */}
      {/* =================================================================== */}
      <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <LabSIELogo size="md" className="hover:opacity-95 transition-opacity shrink-0" />
          <div className="hidden sm:block h-10 w-px bg-[#CCD4CF]" />
          <EduTLANLogo size="sm" showCategoryBadge={true} className="shrink-0" />
        </div>
        <div className="text-center md:text-right">
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 mb-1.5">
            <span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold uppercase tracking-wider">
              Semillero de Investigación LabSIE
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] text-xs font-bold uppercase tracking-wider">
              Grupo EduTLAN
            </span>
          </div>
          <p className="text-xs text-[#1C2624] font-bold">
            Convocatoria & Promoción Investigativa · Licenciatura en Informática
          </p>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="mb-8 p-4 rounded-2xl bg-[#FFFDF9]/92 backdrop-blur-md border-2 border-[#CCD4CF] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-[#1C2624] mb-2 font-bold">
          <span className="font-bold text-[#1C2624]">Sección {currentSection} de {TOTAL_SECTIONS}</span>
          <span className="font-serif font-bold text-sm text-[#059669]">{sectionTitles[currentSection - 1]}</span>
          <span className="tabular-nums font-bold text-[#1C2624]">{Math.round((currentSection / TOTAL_SECTIONS) * 100)}%</span>
        </div>

        <div className="h-2 w-full bg-[#DDE2DE] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#10B981] transition-all duration-300 rounded-full"
            style={{ width: `${(currentSection / TOTAL_SECTIONS) * 100}%` }}
          />
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#B65C5C]/10 border-2 border-[#B65C5C]/50 text-xs md:text-sm text-[#B65C5C] font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#B65C5C]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Questionnaire Card */}
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 md:p-10 shadow-sm min-h-[480px] flex flex-col justify-between relative overflow-hidden">
        <div>
          {/* ============================================================== */}
          {/* SECCIÓN 1 — 👤 CARACTERIZACIÓN DEL ESTUDIANTE */}
          {/* ============================================================== */}
          {currentSection === 1 && (
            <div className="space-y-7">
              <div className="border-b-2 border-[#CCD4CF] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                    SECCIÓN 1 · CARACTERIZACIÓN DEL ESTUDIANTE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Ruta LabSIE Activada</span>
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1C2624] mt-1" style={{ color: '#1C2624' }}>
                  👤 Datos Personales y Académicos
                </h2>
                <p className="text-xs md:text-sm text-[#1C2624] mt-1.5 leading-relaxed font-normal">
                  Diligencia tus datos oficiales para vincular tu caracterización al <strong>Semillero de Investigación LabSIE</strong> (<strong>Grupo EduTLAN</strong>) y personalizar tu ruta de orientación investigativa en la <strong>Licenciatura en Informática</strong>.
                </p>
              </div>

              <div className="space-y-6">
                {/* 1. Nombre completo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 1
                      </span>
                      <label htmlFor="q1-name" className="text-sm font-bold text-[#1C2624] font-serif" style={{ color: '#1C2624' }}>
                        Nombre completo <span className="text-[#B65C5C]">*</span>
                      </label>
                    </div>
                    <input
                      id="q1-name"
                      type="text"
                      required
                      placeholder="Escribe tu nombre y apellido..."
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] font-medium placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 1.1
                      </span>
                      <label htmlFor="q1-doc" className="text-sm font-bold text-[#1C2624] font-serif" style={{ color: '#1C2624' }}>
                        Cédula de Ciudadanía o TI <span className="text-[#B65C5C]">*</span>
                      </label>
                    </div>
                    <input
                      id="q1-doc"
                      type="text"
                      required
                      placeholder="Escribe tu número de documento..."
                      value={documentNumber}
                      onChange={e => setDocumentNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] font-medium placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner"
                    />
                  </div>
                </div>

                {/* 2. Correo institucional y 3. Número de teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 2. Correo institucional */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 2
                      </span>
                      <label htmlFor="q2-email" className="text-sm font-bold text-[#1C2624] font-serif" style={{ color: '#1C2624' }}>
                        Correo electrónico institucional <span className="text-[#B65C5C]">*</span>
                      </label>
                    </div>
                    <input
                      id="q2-email"
                      type="email"
                      required
                      placeholder="usuario@correo.unicordoba.edu.co"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] font-medium placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner"
                    />
                    <p className="text-[11px] text-[#526066]">
                      Vincula tu informe oficial al dominio institucional de la Universidad de Córdoba.
                    </p>
                  </div>

                  {/* 3. Número de teléfono / WhatsApp */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 3
                      </span>
                      <label htmlFor="q3-phone" className="text-sm font-bold text-[#1C2624] font-serif" style={{ color: '#1C2624' }}>
                        Número de teléfono / WhatsApp <span className="text-[#B65C5C]">*</span>
                      </label>
                    </div>
                    <input
                      id="q3-phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="tel-national"
                      maxLength={10}
                      required
                      placeholder="Ej: 3001234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] font-medium placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner"
                    />
                    <p className="text-[11px] text-[#526066]">
                      Contacto para convocatorias, tutorías y novedades del Semillero LabSIE.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 4. Programa académico */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 4
                      </span>
                      <label htmlFor="q4-program" className="text-sm font-bold text-[#24302F] font-serif" style={{ color: '#24302F' }}>
                        Programa académico <span className="text-[#059669] text-xs font-sans font-normal">(Exclusivo)</span>
                      </label>
                    </div>
                    <select
                      id="q4-program"
                      value={program}
                      onChange={e => setProgram(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#FFFDF9] border-2 border-[#10B981]/50 rounded-xl text-[#24302F] font-medium focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                    >
                      <option value="Licenciatura en Informática">Licenciatura en Informática</option>
                    </select>
                    <p className="text-[11px] text-[#059669] flex items-center gap-1 font-medium">
                      <span>✓</span>
                      <span>Programa institucional del Semillero LabSIE (Universidad de Córdoba).</span>
                    </p>
                  </div>

                  {/* 5. Semestre */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 5
                      </span>
                      <label htmlFor="q5-semester" className="text-sm font-bold text-[#24302F] font-serif" style={{ color: '#24302F' }}>
                        Semestre <span className="text-[#B65C5C]">*</span>
                      </label>
                    </div>
                    <select
                      id="q5-semester"
                      value={semester}
                      onChange={e => setSemester(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F7F3ED] border border-[#DDE2DE] rounded-xl text-[#24302F] focus:outline-none focus:border-[#10B981]"
                    >
                      <option value="" disabled className="text-[#6F7976]">-- Selecciona tu semestre actual --</option>
                      {['1.º', '2.º', '3.º', '4.º', '5.º', '6.º', '7.º', '8.º', '9.º', '10.º'].map(s => (
                        <option key={s} value={s}>
                          {s} semestre
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. ¿Has participado anteriormente en procesos de investigación? */}
                <div className="space-y-3 pt-3 border-t border-[#DDE2DE]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                      Pregunta 6
                    </span>
                    <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                      ¿Has participado anteriormente en procesos de investigación? <span className="text-[#B65C5C]">*</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'No, es mi primer acercamiento.',
                      'He participado en actividades de investigación.',
                      'He participado en un proyecto.',
                      'Tengo experiencia en investigación.'
                    ].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setResearchExperience(opt)}
                        className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                          researchExperience === opt
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                            : 'border border-[#DDE2DE] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <span style={{ color: researchExperience === opt ? '#065F46' : '#24302F' }}>{opt}</span>
                        <span
                          className={`w-4 h-4 rounded-full border-2 ml-2 shrink-0 flex items-center justify-center ${
                            researchExperience === opt ? 'border-[#10B981] bg-[#10B981]' : 'border-[#DDE2DE] bg-[#FFFDF9]'
                          }`}
                        >
                          {researchExperience === opt && <span className="w-1.5 h-1.5 bg-[#FFFDF9] rounded-full" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. ¿Qué tanto has trabajado con tecnología? */}
                <div className="space-y-3 pt-3 border-t border-[#DDE2DE]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                      Pregunta 7
                    </span>
                    <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                      ¿Qué tanto has trabajado con tecnología? <span className="text-[#B65C5C]">*</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['Básico', 'Intermedio', 'Avanzado', 'Muy avanzado'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTechExperience(opt)}
                        className={`cursor-pointer p-3 rounded-xl border text-center text-xs md:text-sm transition-all font-medium ${
                          techExperience === opt
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                            : 'border border-[#DDE2DE] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <span style={{ color: techExperience === opt ? '#065F46' : '#24302F' }}>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. ¿Qué tanto has utilizado herramientas de Inteligencia Artificial? */}
                <div className="space-y-3 pt-3 border-t border-[#DDE2DE]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                      Pregunta 8
                    </span>
                    <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                      ¿Qué tanto has utilizado herramientas de Inteligencia Artificial? <span className="text-[#B65C5C]">*</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {['Nunca', 'Algunas veces', 'Ocasionalmente', 'Frecuentemente', 'Habitualmente'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAiExperience(opt)}
                        className={`cursor-pointer p-3 rounded-xl border text-center text-xs md:text-sm transition-all font-medium ${
                          aiExperience === opt
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                            : 'border border-[#DDE2DE] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <span style={{ color: aiExperience === opt ? '#065F46' : '#24302F' }}>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ------------------------------------------------------------------ */}
                {/* 🎯 CONVOCATORIA DE NUEVOS INTEGRANTES: GUSTOS, CÓDIGO E INTERNACIONAL */}
                {/* ------------------------------------------------------------------ */}
                <div className="pt-6 border-t-2 border-[#10B981]/40 space-y-6 bg-[#FAF8F5] p-5 sm:p-7 rounded-2xl border-2 border-[#CCD4CF] shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CCD4CF] pb-3">
                    <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Convocatoria Nuevos Integrantes · LabSIE & EduTLAN</span>
                    </span>
                    <span className="text-[11px] font-bold text-[#059669]">
                      Contraste activo con los 28 proyectos mediante Qwen
                    </span>
                  </div>

                  {/* 9. ¿Qué áreas y temáticas te gustan más? */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 9
                      </span>
                      <label className="text-sm font-bold text-[#1C2624] font-serif block flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#E11D48]" />
                        <span>¿Qué áreas temáticas te apasionan o llaman más tu atención? <span className="text-[#B65C5C]">*</span></span>
                      </label>
                    </div>
                    <p className="text-xs text-[#526066]">
                      Selecciona una o más áreas que despiertan tu curiosidad (estas se contrastarán con los 28 proyectos de LabSIE):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {PERSONAL_PASSIONS_LIST.map(passion => {
                        const isSelected = personalPassions.includes(passion);
                        return (
                          <button
                            key={passion}
                            type="button"
                            onClick={() => togglePassion(passion)}
                            className={`cursor-pointer p-3 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start justify-between gap-2 ${
                              isSelected
                                ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20 shadow-xs'
                                : 'border border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            <span>{passion}</span>
                            <span
                              className={`w-4 h-4 rounded-md border mt-0.5 shrink-0 flex items-center justify-center ${
                                isSelected ? 'border-[#10B981] bg-[#10B981] text-white' : 'border-[#CCD4CF] bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 10. Gusto y afinidad por la Programación */}
                  <div className="space-y-3 pt-4 border-t border-[#CCD4CF]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 10
                      </span>
                      <label className="text-sm font-bold text-[#1C2624] font-serif block flex items-center gap-2">
                        <Code className="w-4 h-4 text-[#059669]" />
                        <span>¿Cuál es tu relación y gusto con la Programación y Desarrollo de Software? <span className="text-[#B65C5C]">*</span></span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PROGRAMMING_LEVELS.map(level => {
                        const isSelected = programmingInterestLevel === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setProgrammingInterestLevel(level)}
                            className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start justify-between gap-2.5 ${
                              isSelected
                                ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20 shadow-xs'
                                : 'border border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            <span>{level}</span>
                            <span
                              className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                                isSelected ? 'border-[#10B981] bg-[#10B981]' : 'border-[#CCD4CF] bg-white'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 11. Lenguajes y tecnologías de interés */}
                  <div className="space-y-3 pt-4 border-t border-[#CCD4CF]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 11
                      </span>
                      <label className="text-sm font-bold text-[#1C2624] font-serif block flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-[#059669]" />
                        <span>¿Qué lenguajes, tecnologías o herramientas manejas o te gustaría aprender en el semillero?</span>
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PROGRAMMING_LANGUAGES_LIST.map(lang => {
                        const isSelected = programmingLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleProgrammingLanguage(lang)}
                            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#10B981] text-white border-[#10B981] shadow-xs'
                                : 'bg-[#FFFDF9] text-[#24302F] border-[#CCD4CF] hover:bg-[#F3F4F6]'
                            }`}
                          >
                            <span>{isSelected ? '✓ ' : '+ '}</span>
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 12. Proyectos que abarquen otros países / Dimensión Internacional */}
                  <div className="space-y-3 pt-4 border-t border-[#CCD4CF]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 12
                      </span>
                      <label className="text-sm font-bold text-[#1C2624] font-serif block flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#0284C7]" />
                        <span>¿Te llama la atención vincularte a proyectos que abarquen otros países o colaboración internacional? <span className="text-[#B65C5C]">*</span></span>
                      </label>
                    </div>
                    <p className="text-xs text-[#526066]">
                      LabSIE y EduTLAN desarrollan iniciativas COIL, benchmarks internacionales de IA y redes globales.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {INTERNATIONAL_INTEREST_OPTIONS.map(opt => {
                        const isSelected = internationalProjectsInterest === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setInternationalProjectsInterest(opt)}
                            className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start justify-between gap-2.5 ${
                              isSelected
                                ? 'border-2 border-[#0284C7] bg-[#F0F9FF] font-bold text-[#0369A1] ring-2 ring-[#0284C7]/20 shadow-xs'
                                : 'border border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            <span>{opt}</span>
                            <span
                              className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                                isSelected ? 'border-[#0284C7] bg-[#0284C7]' : 'border-[#CCD4CF] bg-white'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Motivaciones internacionales específicas */}
                    <div className="pt-2">
                      <span className="text-xs font-bold text-[#526066] block mb-2">
                        ¿Qué es lo que más te atrae de un proyecto internacional?
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {INTERNATIONAL_MOTIVATIONS_LIST.map(mot => {
                          const isSelected = internationalMotivations.includes(mot);
                          return (
                            <button
                              key={mot}
                              type="button"
                              onClick={() => toggleInternationalMotivation(mot)}
                              className={`cursor-pointer p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'border-[#0284C7] bg-[#F0F9FF] font-semibold text-[#0369A1]'
                                  : 'border-[#CCD4CF] bg-white text-[#24302F] hover:bg-[#FAF8F5]'
                              }`}
                            >
                              <span>{mot}</span>
                              <span
                                className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                                  isSelected ? 'border-[#0284C7] bg-[#0284C7] text-white' : 'border-[#CCD4CF]'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 13. Rol que te gustaría desempeñar */}
                  <div className="space-y-3 pt-4 border-t border-[#CCD4CF]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                        Pregunta 13
                      </span>
                      <label className="text-sm font-bold text-[#1C2624] font-serif block flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#059669]" />
                        <span>¿En qué rol te gustaría integrarte y aportar al Semillero LabSIE? <span className="text-[#B65C5C]">*</span></span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {PREFERRED_ROLES_LIST.map(role => {
                        const isSelected = preferredRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setPreferredRole(role)}
                            className={`cursor-pointer p-3 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start justify-between gap-2 ${
                              isSelected
                                ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20 shadow-xs'
                                : 'border border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            <span>{role}</span>
                            <span
                              className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                                isSelected ? 'border-[#10B981] bg-[#10B981]' : 'border-[#CCD4CF] bg-white'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECCIÓN 2 — 🔎 TU CURIOSIDAD */}
          {/* ============================================================== */}
          {currentSection === 2 && (
            <div className="space-y-7">
              <div className="border-b border-[#DDE2DE] pb-4">
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  SECCIÓN 2
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
                  🔎 Tu Curiosidad
                </h2>
                <p className="text-xs md:text-sm text-[#059669] italic mt-1 font-serif font-semibold">
                  Aquí empieza el verdadero test. Indaga sobre tu impulso intelectual innato.
                </p>
              </div>

              {/* 7. Cuando encuentras un problema, ¿qué es lo primero que te gustaría hacer? */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 7
                  </span>
                  <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                    Cuando encuentras un problema, ¿qué es lo primero que te gustaría hacer?{' '}
                    <span className="text-[#6F7976] font-normal text-xs">(Selecciona una respuesta)</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FIRST_ACTIONS.map(action => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => setFirstActionOnProblem(action)}
                      className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                        firstActionOnProblem === action
                          ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                          : 'border border-[#DDE2DE] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                      }`}
                    >
                      <span style={{ color: firstActionOnProblem === action ? '#065F46' : '#24302F' }}>{action}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 ml-2 shrink-0 flex items-center justify-center ${
                          firstActionOnProblem === action ? 'border-[#10B981] bg-[#10B981]' : 'border-[#DDE2DE] bg-[#FFFDF9]'
                        }`}
                      >
                        {firstActionOnProblem === action && <span className="w-1.5 h-1.5 bg-[#FFFDF9] rounded-full" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. ¿Qué tipo de preguntas te generan mayor curiosidad? */}
              <div className="space-y-3 pt-4 border-t border-[#DDE2DE]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                      Pregunta 8
                    </span>
                    <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                      ¿Qué tipo de preguntas te generan mayor curiosidad?{' '}
                      <span className="text-[#6F7976] font-normal text-xs">(Varias respuestas)</span>
                    </label>
                  </div>
                  {curiosityQuestions.length > 0 && (
                    <span className="text-xs font-bold text-[#059669]">
                      {curiosityQuestions.length} seleccionadas
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CURIOSITY_QUESTIONS.map(q => {
                    const isSelected = curiosityQuestions.includes(q);
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => toggleCuriosityQ(q)}
                        className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                            : 'border border-[#DDE2DE] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <span style={{ color: isSelected ? '#065F46' : '#24302F' }}>{q}</span>
                        <span
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ml-2 ${
                            isSelected ? 'bg-[#10B981] border-[#10B981] text-[#FFFDF9]' : 'border-[#DDE2DE] bg-[#FFFDF9]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#FFFDF9]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECCIÓN 3 — 🧠 ¿CÓMO TE GUSTARÍA INVESTIGAR? */}
          {/* ============================================================== */}
          {currentSection === 3 && (
            <div className="space-y-7">
              <div className="border-b border-[#DDE2DE] pb-4 flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                    SECCIÓN 3
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
                    🧠 ¿Cómo te gustaría investigar?
                  </h2>
                  <p className="text-xs md:text-sm text-[#6F7976] mt-1.5">
                    Identifica las actividades empíricas, teóricas o de desarrollo en las que te sentirías más motivado.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] whitespace-nowrap">
                  {preferredActivities.length} / 4 seleccionadas
                </span>
              </div>

              {/* 9. ¿Cuál de estas actividades disfrutarías más en un proyecto? */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 9
                  </span>
                  <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                    ¿Cuál de estas actividades disfrutarías más en un proyecto?{' '}
                    <span className="text-[#6F7976] font-normal text-xs">(Selecciona máximo 4 actividades)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {ACTIVITIES_LIST.map(act => {
                    const isSelected = preferredActivities.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => toggleActivity(act)}
                        className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                            : 'border border-[#DDE2DE] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <span className="truncate pr-1" style={{ color: isSelected ? '#065F46' : '#24302F' }}>{act}</span>
                        <span
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ml-1.5 ${
                            isSelected ? 'bg-[#10B981] border-[#10B981] text-[#FFFDF9]' : 'border-[#DDE2DE] bg-[#FFFDF9]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#FFFDF9]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECCIÓN 4 — 🎯 SITUACIONES Y DESAFÍOS */}
          {/* ============================================================== */}
          {currentSection === 4 && (
            <div className="space-y-7">
              <div className="border-b border-[#DDE2DE] pb-4">
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  SECCIÓN 4
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
                  🎯 Situaciones y Desafíos
                </h2>
                <p className="text-xs md:text-sm text-[#059669] italic mt-1 font-serif font-semibold">
                  No te preguntamos qué proyecto te gusta: te presentamos problemas y desafíos de aula para ver tu enfoque investigativo.
                </p>
              </div>

              {/* 10. Dificultades en plataforma educativa */}
              <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 10
                  </span>
                  <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                    Imagina que una plataforma educativa detecta que un estudiante está teniendo dificultades.{' '}
                    <span className="font-normal text-xs text-[#3F4E4C]">¿Qué te gustaría investigar? (Una respuesta)</span>
                  </label>
                </div>
                <div className="space-y-2">
                  {[
                    'A. ¿Cómo detectar tempranamente la dificultad?',
                    'B. ¿Por qué está ocurriendo?',
                    'C. ¿Cómo ayudar al estudiante?',
                    'D. ¿Cómo adaptar las actividades?',
                    'E. ¿Cómo lograr que el estudiante reflexione sobre sus errores?',
                    'F. ¿Cómo diseñar un sistema que tome decisiones automáticamente?'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setScenarioDifficulty(opt)}
                      className={`cursor-pointer w-full p-3 rounded-lg border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                        scenarioDifficulty === opt
                          ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                          : 'border border-[#CCD4CF] bg-[#FFFDF9] hover:bg-[#F2FAF6] text-[#24302F]'
                      }`}
                    >
                      <span style={{ color: scenarioDifficulty === opt ? '#065F46' : '#24302F' }}>{opt}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 ml-2 shrink-0 flex items-center justify-center ${
                          scenarioDifficulty === opt ? 'border-[#10B981] bg-[#10B981]' : 'border-[#CCD4CF] bg-[#FFFDF9]'
                        }`}
                      >
                        {scenarioDifficulty === opt && <span className="w-1.5 h-1.5 bg-[#FFFDF9] rounded-full" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 11. Docente con IA */}
              <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 11
                  </span>
                  <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                    Un docente utiliza una herramienta de IA que genera una actividad para sus estudiantes, pero considera que la propuesta no se adapta completamente a su contexto.{' '}
                    <span className="font-normal text-xs text-[#3F4E4C]">¿Qué te parece más interesante? (Una respuesta)</span>
                  </label>
                </div>
                <div className="space-y-2">
                  {[
                    'A. Comprender cómo el docente decide qué aceptar o modificar.',
                    'B. Diseñar una IA que genere mejores propuestas.',
                    'C. Analizar qué características debe tener una buena actividad.',
                    'D. Diseñar un sistema que permita adaptar automáticamente la propuesta.',
                    'E. Investigar cómo influye el contexto en la decisión.'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setScenarioTeacherAI(opt)}
                      className={`cursor-pointer w-full p-3 rounded-lg border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                        scenarioTeacherAI === opt
                          ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                          : 'border border-[#CCD4CF] bg-[#FFFDF9] hover:bg-[#F2FAF6] text-[#24302F]'
                      }`}
                    >
                      <span style={{ color: scenarioTeacherAI === opt ? '#065F46' : '#24302F' }}>{opt}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 ml-2 shrink-0 flex items-center justify-center ${
                          scenarioTeacherAI === opt ? 'border-[#10B981] bg-[#10B981]' : 'border-[#CCD4CF] bg-[#FFFDF9]'
                        }`}
                      >
                        {scenarioTeacherAI === opt && <span className="w-1.5 h-1.5 bg-[#FFFDF9] rounded-full" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 12. Sistema inteligente observa comportamiento */}
              <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 12
                  </span>
                  <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                    Un sistema inteligente puede observar el comportamiento de un estudiante durante varias actividades.{' '}
                    <span className="font-normal text-xs text-[#3F4E4C]">¿Qué investigarías? (Una respuesta)</span>
                  </label>
                </div>
                <div className="space-y-2">
                  {[
                    'A. Predecir su desempeño.',
                    'B. Detectar dificultades.',
                    'C. Adaptar las actividades.',
                    'D. Generar retroalimentación.',
                    'E. Analizar cómo aprende.',
                    'F. Ayudarlo a desarrollar pensamiento crítico.',
                    'G. Ayudarlo a reflexionar sobre su propio aprendizaje.'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setScenarioIntelligentSystem(opt)}
                      className={`cursor-pointer w-full p-3 rounded-lg border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                        scenarioIntelligentSystem === opt
                          ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                          : 'border border-[#CCD4CF] bg-[#FFFDF9] hover:bg-[#F2FAF6] text-[#24302F]'
                      }`}
                    >
                      <span style={{ color: scenarioIntelligentSystem === opt ? '#065F46' : '#24302F' }}>{opt}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 ml-2 shrink-0 flex items-center justify-center ${
                          scenarioIntelligentSystem === opt ? 'border-[#10B981] bg-[#10B981]' : 'border-[#CCD4CF] bg-[#FFFDF9]'
                        }`}
                      >
                        {scenarioIntelligentSystem === opt && <span className="w-1.5 h-1.5 bg-[#FFFDF9] rounded-full" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 13. Reto colaborativo intercultural */}
              <div className="p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 13
                  </span>
                  <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                    Dos grupos de estudiantes de diferentes contextos culturales deben resolver juntos un reto tecnológico.{' '}
                    <span className="font-normal text-xs text-[#3F4E4C]">¿Qué te interesaría estudiar? (Una respuesta)</span>
                  </label>
                </div>
                <div className="space-y-2">
                  {[
                    'A. Cómo colaboran.',
                    'B. Cómo influye la cultura.',
                    'C. Cómo diseñar el reto.',
                    'D. Cómo utilizar tecnología para facilitar la colaboración.',
                    'E. Qué aprendizajes se producen.',
                    'F. Qué dificultades aparecen.'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setScenarioCulturalChallenge(opt)}
                      className={`cursor-pointer w-full p-3 rounded-lg border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                        scenarioCulturalChallenge === opt
                          ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                          : 'border border-[#CCD4CF] bg-[#FFFDF9] hover:bg-[#F2FAF6] text-[#24302F]'
                      }`}
                    >
                      <span style={{ color: scenarioCulturalChallenge === opt ? '#065F46' : '#24302F' }}>{opt}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 ml-2 shrink-0 flex items-center justify-center ${
                          scenarioCulturalChallenge === opt ? 'border-[#10B981] bg-[#10B981]' : 'border-[#CCD4CF] bg-[#FFFDF9]'
                        }`}
                      >
                        {scenarioCulturalChallenge === opt && <span className="w-1.5 h-1.5 bg-[#FFFDF9] rounded-full" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 14. Posibilidades de IA */}
              <div className="space-y-3 pt-3 border-t border-[#DDE2DE]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                      Pregunta 14
                    </span>
                    <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                      ¿Cuál de estas posibilidades te resulta más interesante?{' '}
                      <span className="text-[#6F7976] font-normal text-xs">(Selecciona las que despierten tu curiosidad)</span>
                    </label>
                  </div>
                  {aiInterests.length > 0 && (
                    <span className="text-xs font-bold text-[#059669]">
                      {aiInterests.length} seleccionadas
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AI_INTERESTS_LIST.map(item => {
                    const isSelected = aiInterests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAiInterest(item)}
                        className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                            : 'border border-[#DDE2DE] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <span style={{ color: isSelected ? '#065F46' : '#24302F' }}>{item}</span>
                        <span
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ml-2 ${
                            isSelected ? 'bg-[#10B981] border-[#10B981] text-[#FFFDF9]' : 'border-[#DDE2DE] bg-[#FFFDF9]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#FFFDF9]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECCIÓN 5 — 🗺️ EXPLORA EL PATRIMONIO DE LABSIE */}
          {/* ============================================================== */}
          {currentSection === 5 && (() => {
            // Proyectos ordenados oficialmente LABSIE-P01 a LABSIE-P18
            const sortedProjects = [...projects].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

            // Filtro por línea y búsqueda interactiva
            const filteredProjects = sortedProjects.filter(p => {
              const matchesLine = section5FilterLine === 'all' || p.lineId === section5FilterLine;
              const q = section5Search.trim().toLowerCase();
              const matchesSearch =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.code.toLowerCase().includes(q) ||
                p.lineName.toLowerCase().includes(q) ||
                p.problem.toLowerCase().includes(q) ||
                p.concepts.some(c => c.toLowerCase().includes(q)) ||
                p.keywords.some(k => k.toLowerCase().includes(q));
              return matchesLine && matchesSearch;
            });

            // Agrupación por las 4 Líneas de Investigación Oficiales
            const groupedByLine = lines.map(line => ({
              line,
              projects: filteredProjects.filter(p => p.lineId === line.id)
            })).filter(g => section5FilterLine === 'all' || g.line.id === section5FilterLine);

            return (
              <div className="space-y-8">
                {/* 1. Header Institucional de Sección */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#ECFDF5] border border-[#A7F3D0] space-y-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                      SECCIÓN 5 · Memoria Científica y Patrimonio Investigativo
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFFDF9] text-[#059669] font-bold border border-[#A7F3D0]">
                      {sortedProjects.length} Proyectos Oficiales · 4 Líneas
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F]" style={{ color: '#24302F' }}>
                    🗺️ Explora el Patrimonio Investigativo de LabSIE
                  </h2>

                  <p className="text-xs md:text-sm text-[#065F46] leading-relaxed font-medium">
                    <strong className="text-[#059669]">"Investigar no es empezar de cero. Es saber desde dónde continuar."</strong>{' '}
                    Los {projects.length} proyectos a continuación constituyen la memoria científica activa del semillero,
                    ordenados en sus cuatro líneas oficiales. Conócelos, revisa sus metodologías y{' '}
                    <strong className="text-[#24302F]">selecciona directamente aquellos que llamen tu atención</strong> para contrastar con tu perfil vocacional.
                  </p>

                  {/* 2. Barra de Selección en Vivo (Live Selection Dashboard) */}
                  <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#10B981]/40 shadow-xs space-y-2.5 pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-bold text-[#24302F] uppercase tracking-wider">
                          Tus Investigaciones Marcadas:
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          selectedLabSIEProjects.length > 0
                            ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {selectedLabSIEProjects.length} de {projects.length} seleccionadas
                        </span>
                      </div>

                      {selectedLabSIEProjects.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedLabSIEProjects([])}
                          className="cursor-pointer text-[11px] text-[#6F7976] hover:text-rose-600 underline transition-colors"
                        >
                          Limpiar selección
                        </button>
                      )}
                    </div>

                    {selectedLabSIEProjects.length === 0 ? (
                      <p className="text-xs text-[#6F7976] italic bg-[#FAF8F5] p-2.5 rounded-lg border border-dashed border-[#CCD4CF]">
                        💡 Aún no has marcado investigaciones. Haz clic en el botón{' '}
                        <strong className="text-[#059669] font-bold">+ Marcar para mi perfil</strong> en cualquiera de las tarjetas para vincularlas a tu resultado.
                      </p>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {selectedLabSIEProjects.map(id => {
                          const p = sortedProjects.find(proj => proj.id === id);
                          if (!p) return null;
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981] text-[#FFFDF9] text-xs font-bold shadow-xs transition-transform hover:scale-102"
                            >
                              <Check className="w-3 h-3 text-[#FFFDF9]" />
                              <span>{p.code}</span>
                              <span className="font-normal text-[11px] opacity-90 max-w-[150px] truncate hidden sm:inline">
                                · {p.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleLabSIEProject(id)}
                                className="cursor-pointer hover:bg-black/20 rounded-full p-0.5 ml-0.5 text-white"
                                title={`Desmarcar ${p.code}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Controles de Ordenamiento, Filtro por Línea y Búsqueda */}
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#CCD4CF]">
                    {/* Búsqueda rápida */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#6F7976] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={section5Search}
                        onChange={e => setSection5Search(e.target.value)}
                        placeholder="Buscar por concepto, título, metodología o palabra clave..."
                        className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-[#FAF8F5] border border-[#CCD4CF] rounded-xl text-[#24302F] placeholder-[#6F7976] focus:outline-none focus:border-[#10B981]"
                      />
                      {section5Search && (
                        <button
                          type="button"
                          onClick={() => setSection5Search('')}
                          className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F7976] hover:text-[#24302F]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Selector de modo de presentación */}
                    <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0 text-xs font-bold">
                      <span className="text-[#6F7976] text-[11px] font-normal mr-1 hidden lg:inline">Modo:</span>
                      <button
                        type="button"
                        onClick={() => setSection5ViewMode('by-line')}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${
                          section5ViewMode === 'by-line'
                            ? 'bg-[#10B981] border-[#10B981] text-white shadow-xs'
                            : 'bg-[#FFFDF9] border-[#CCD4CF] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        🗂️ Por Líneas
                      </button>
                      <button
                        type="button"
                        onClick={() => setSection5ViewMode('sequential')}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${
                          section5ViewMode === 'sequential'
                            ? 'bg-[#10B981] border-[#10B981] text-white shadow-xs'
                            : 'bg-[#FFFDF9] border-[#CCD4CF] text-[#24302F] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        🔢 Secuencial ({sortedProjects.length})
                      </button>
                    </div>
                  </div>

                  {/* Pills de Filtrado Rápido por Línea de Investigación */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[#059669] mr-1 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#10B981]" /> Filtrar:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSection5FilterLine('all')}
                      className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        section5FilterLine === 'all'
                          ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669]'
                          : 'bg-[#FFFDF9] border-[#CCD4CF] text-[#526066] hover:bg-[#F7F3ED]'
                      }`}
                    >
                      Todas ({sortedProjects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection5FilterLine('line-diseno-sistemas-inteligentes')}
                      className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        section5FilterLine === 'line-diseno-sistemas-inteligentes'
                          ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669]'
                          : 'bg-[#FFFDF9] border-[#CCD4CF] text-[#526066] hover:bg-[#F7F3ED]'
                      }`}
                    >
                      🤖 L1: Sistemas Inteligentes ({sortedProjects.filter(p => p.lineId === 'line-diseno-sistemas-inteligentes').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection5FilterLine('line-entornos-virtuales-adaptativos')}
                      className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        section5FilterLine === 'line-entornos-virtuales-adaptativos'
                          ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669]'
                          : 'bg-[#FFFDF9] border-[#CCD4CF] text-[#526066] hover:bg-[#F7F3ED]'
                      }`}
                    >
                      🌐 L2: Entornos Adaptativos ({sortedProjects.filter(p => p.lineId === 'line-entornos-virtuales-adaptativos').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection5FilterLine('line-analisis-datos-educativos')}
                      className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        section5FilterLine === 'line-analisis-datos-educativos'
                          ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669]'
                          : 'bg-[#FFFDF9] border-[#CCD4CF] text-[#526066] hover:bg-[#F7F3ED]'
                      }`}
                    >
                      📊 L3: Analítica de Datos ({sortedProjects.filter(p => p.lineId === 'line-analisis-datos-educativos').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection5FilterLine('line-ia-aprendizaje-personalizado')}
                      className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        section5FilterLine === 'line-ia-aprendizaje-personalizado'
                          ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669]'
                          : 'bg-[#FFFDF9] border-[#CCD4CF] text-[#526066] hover:bg-[#F7F3ED]'
                      }`}
                    >
                      💡 L4: IA en Aprendizaje ({sortedProjects.filter(p => p.lineId === 'line-ia-aprendizaje-personalizado').length})
                    </button>
                  </div>
                </div>

                {/* 4. Pregunta 15: Presentación de Proyectos en Tarjetas Enriquecidas */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[11px] font-bold border border-[#A7F3D0]">
                        Pregunta 15
                      </span>
                      <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                        Conoce y Selecciona las Investigaciones del Semillero{' '}
                        <span className="text-[#3F4E4C] font-normal text-xs">(Haz clic en el botón de cada tarjeta para marcarla)</span>
                      </label>
                    </div>
                    <span className="text-xs font-bold text-[#059669]">
                      Mostrando {filteredProjects.length} de {projects.length} proyectos
                    </span>
                  </div>

                  {/* Renderizado de Proyectos — Modo 1: Agrupado por Líneas */}
                  {section5ViewMode === 'by-line' ? (
                    <div className="space-y-6">
                      {groupedByLine.map(({ line, projects: lineProjects }) => {
                        if (lineProjects.length === 0) return null;
                        return (
                          <div key={line.id} className="space-y-3.5 bg-[#FAF8F5] p-4 md:p-5 rounded-2xl border-2 border-[#CCD4CF]">
                            {/* Cabecera de la Línea */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#DDE2DE] gap-1.5">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] block">
                                  Línea Oficial de Investigación
                                </span>
                                <h3 className="font-serif font-bold text-sm md:text-base text-[#24302F]">
                                  {line.name}
                                </h3>
                              </div>
                              <span className="self-start sm:self-center text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] shrink-0">
                                {lineProjects.length} proyecto{lineProjects.length > 1 ? 's' : ''}
                              </span>
                            </div>

                            {/* Tarjetas de Proyectos dentro de esta Línea */}
                            <div className="space-y-3.5">
                              {lineProjects.map((p) => {
                                const isSelected = selectedLabSIEProjects.includes(p.id);
                                const isExpanded = expandedProjectId === p.id;
                                const methInfo = getProjectMethodology(p.id);

                                return (
                                  <div
                                    key={p.id}
                                    className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                                      isSelected
                                        ? 'bg-[#F0FDF4] border-2 border-[#10B981] shadow-sm ring-2 ring-[#10B981]/20'
                                        : 'bg-[#FFFDF9] border border-[#CCD4CF] hover:border-[#10B981]/70 hover:shadow-xs'
                                    }`}
                                  >
                                    {/* Cabecera y Selección Directa */}
                                    <div className="p-4 md:p-5 space-y-3">
                                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                          <span className="font-mono font-bold text-[#059669] px-2.5 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0]">
                                            {p.code}
                                          </span>
                                          <span className="text-[#CCD4CF]">·</span>
                                          <span className={`px-2 py-0.5 rounded ${methInfo.themeColor.bg} ${methInfo.themeColor.text} text-[10px] font-bold border ${methInfo.themeColor.border}`}>
                                            {methInfo.badgeIcon} {methInfo.badgeTitle.replace('Metodología: ', '')}
                                          </span>
                                          <span className="text-[10px] font-bold text-[#526066] px-2 py-0.5 rounded bg-[#F7F3ED] border border-[#CCD4CF]">
                                            {p.year}
                                          </span>
                                        </div>

                                        {/* Botón de Selección Rápida en la Cabecera de la Tarjeta */}
                                        <button
                                          type="button"
                                          onClick={() => toggleLabSIEProject(p.id)}
                                          className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                                            isSelected
                                              ? 'bg-[#10B981] text-white shadow-xs hover:bg-[#059669]'
                                              : 'bg-[#FFFDF9] border-2 border-[#10B981] text-[#059669] hover:bg-[#ECFDF5]'
                                          }`}
                                        >
                                          {isSelected ? (
                                            <>
                                              <Check className="w-3.5 h-3.5 text-white" />
                                              <span>En tu perfil ✓</span>
                                            </>
                                          ) : (
                                            <>
                                              <Plus className="w-3.5 h-3.5 text-[#059669]" />
                                              <span>Marcar investigación</span>
                                            </>
                                          )}
                                        </button>
                                      </div>

                                      {/* Título y Síntesis */}
                                      <div>
                                        <h4 className="font-serif font-bold text-base md:text-lg text-[#24302F] leading-snug">
                                          {p.title}
                                        </h4>
                                        <p className="text-xs md:text-sm text-[#526066] leading-relaxed mt-1.5">
                                          {p.description}
                                        </p>
                                      </div>

                                      {/* Pilares Científicos Clave (Problema y Pregunta) */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#CCD4CF]">
                                          <span className="font-bold text-[#059669] block mb-0.5 text-[11px] uppercase tracking-wider">
                                            🎯 Problema Abordado:
                                          </span>
                                          <p className="text-[#24302F] leading-relaxed">{p.problem}</p>
                                        </div>
                                        <div className="bg-[#ECFDF5] p-3 rounded-xl border border-[#A7F3D0]">
                                          <span className="font-bold text-[#059669] block mb-0.5 text-[11px] uppercase tracking-wider">
                                            ❓ Pregunta Científica:
                                          </span>
                                          <p className="text-[#065F46] italic leading-relaxed">{p.question}</p>
                                        </div>
                                      </div>

                                      {/* Conceptos Clave */}
                                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                        <span className="text-[11px] font-bold text-[#059669]">Conceptos clave:</span>
                                        {p.concepts.map((concept, cIdx) => (
                                          <span
                                            key={cIdx}
                                            className="px-2 py-0.5 rounded-md bg-[#FFFDF9] text-[#24302F] border border-[#CCD4CF] text-[10px] font-medium"
                                          >
                                            {concept}
                                          </span>
                                        ))}
                                      </div>

                                      {/* Botón para Desplegar Ficha Metodológica Completa */}
                                      <div className="pt-2 border-t border-[#DDE2DE]/80 flex justify-between items-center">
                                        <button
                                          type="button"
                                          onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                                          className="cursor-pointer text-xs font-bold text-[#059669] hover:text-[#065F46] flex items-center gap-1.5 py-1 px-2 -ml-2 rounded-lg hover:bg-[#ECFDF5] transition-colors"
                                        >
                                          <BookOpen className="w-3.5 h-3.5" />
                                          <span>{isExpanded ? 'Ocultar ficha científica' : 'Ver ficha metodológica y preguntas abiertas'}</span>
                                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>

                                        <span className="text-[11px] text-[#6F7976]">
                                          Líder: {p.leadResearcher}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Ficha Metodológica Expandible */}
                                    {isExpanded && (
                                      <div className="p-5 border-t border-[#DDE2DE] bg-[#FAF8F5] text-xs md:text-sm space-y-4">
                                        {/* Paradigma Metodológico Formal */}
                                        <div className={`p-4 rounded-xl text-xs ${methInfo.themeColor.bg} border ${methInfo.themeColor.border} text-[#24302F] space-y-1.5 shadow-xs`}>
                                          <span className={`font-bold block text-[11px] uppercase tracking-wider ${methInfo.themeColor.text}`}>
                                            {methInfo.badgeIcon} Paradigma Metodológico: {methInfo.paradigm}
                                          </span>
                                          <p className="leading-relaxed text-[#24302F]">{p.methodology}</p>
                                          <p className={`text-[11px] ${methInfo.themeColor.text} font-medium pt-1`}>
                                            {methInfo.summary}
                                          </p>
                                        </div>

                                        {/* Preguntas Abiertas & Continuidad */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                          <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#CCD4CF] space-y-2">
                                            <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">
                                              ❓ Preguntas abiertas por resolver en LabSIE:
                                            </span>
                                            <ul className="list-disc pl-4 space-y-1.5 text-[#526066]">
                                              {p.openQuestions.map((qItem, qIdx) => (
                                                <li key={qIdx} className="leading-relaxed">{qItem}</li>
                                              ))}
                                            </ul>
                                          </div>

                                          <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#CCD4CF] space-y-2">
                                            <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">
                                              🚀 Posibilidades de continuidad para estudiantes:
                                            </span>
                                            <ul className="list-disc pl-4 space-y-1.5 text-[#526066]">
                                              {p.continuityPossibilities.map((cItem, cIdx) => (
                                                <li key={cIdx} className="leading-relaxed">{cItem}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#526066] border-t border-[#DDE2DE]">
                                          <span><strong>Contexto:</strong> {p.context}</span>
                                          <span><strong>Población:</strong> {p.population}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Renderizado de Proyectos — Modo 2: Secuencial P01 – P07 */
                    <div className="space-y-4">
                      {filteredProjects.map((p, idx) => {
                        const isSelected = selectedLabSIEProjects.includes(p.id);
                        const isExpanded = expandedProjectId === p.id;
                        const methInfo = getProjectMethodology(p.id);

                        return (
                          <div
                            key={p.id}
                            className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                              isSelected
                                ? 'bg-[#F0FDF4] border-2 border-[#10B981] shadow-sm ring-2 ring-[#10B981]/20'
                                : 'bg-[#FFFDF9] border border-[#CCD4CF] hover:border-[#10B981]/70 hover:shadow-xs'
                            }`}
                          >
                            <div className="p-4 md:p-5 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2.5">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="font-mono font-bold text-[#059669] px-2.5 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0]">
                                    {p.code}
                                  </span>
                                  <span className="text-[#CCD4CF]">·</span>
                                  <span className="text-[#24302F] font-semibold">{p.lineName}</span>
                                  <span className={`px-2 py-0.5 rounded ${methInfo.themeColor.bg} ${methInfo.themeColor.text} text-[10px] font-bold border ${methInfo.themeColor.border}`}>
                                    {methInfo.badgeIcon} {methInfo.badgeTitle.replace('Metodología: ', '')}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleLabSIEProject(p.id)}
                                  className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                                    isSelected
                                      ? 'bg-[#10B981] text-white shadow-xs hover:bg-[#059669]'
                                      : 'bg-[#FFFDF9] border-2 border-[#10B981] text-[#059669] hover:bg-[#ECFDF5]'
                                  }`}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-white" />
                                      <span>En tu perfil ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5 text-[#059669]" />
                                      <span>Marcar investigación</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div>
                                <h4 className="font-serif font-bold text-base md:text-lg text-[#24302F] leading-snug">
                                  Proyecto {idx + 1}: {p.title}
                                </h4>
                                <p className="text-xs md:text-sm text-[#526066] leading-relaxed mt-1.5">
                                  {p.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#CCD4CF]">
                                  <span className="font-bold text-[#059669] block mb-0.5 text-[11px] uppercase tracking-wider">
                                    🎯 Problema Abordado:
                                  </span>
                                  <p className="text-[#24302F] leading-relaxed">{p.problem}</p>
                                </div>
                                <div className="bg-[#ECFDF5] p-3 rounded-xl border border-[#A7F3D0]">
                                  <span className="font-bold text-[#059669] block mb-0.5 text-[11px] uppercase tracking-wider">
                                    ❓ Pregunta Científica:
                                  </span>
                                  <p className="text-[#065F46] italic leading-relaxed">{p.question}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[11px] font-bold text-[#059669]">Conceptos clave:</span>
                                {p.concepts.map((concept, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-2 py-0.5 rounded-md bg-[#FFFDF9] text-[#24302F] border border-[#CCD4CF] text-[10px] font-medium"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-[#DDE2DE]/80 flex justify-between items-center">
                                <button
                                  type="button"
                                  onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                                  className="cursor-pointer text-xs font-bold text-[#059669] hover:text-[#065F46] flex items-center gap-1.5 py-1 px-2 -ml-2 rounded-lg hover:bg-[#ECFDF5] transition-colors"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>{isExpanded ? 'Ocultar ficha científica' : 'Ver ficha metodológica y preguntas abiertas'}</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                                <span className="text-[11px] text-[#6F7976]">
                                  Líder: {p.leadResearcher}
                                </span>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="p-5 border-t border-[#DDE2DE] bg-[#FAF8F5] text-xs md:text-sm space-y-4">
                                <div className={`p-4 rounded-xl text-xs ${methInfo.themeColor.bg} border ${methInfo.themeColor.border} text-[#24302F] space-y-1.5`}>
                                  <span className={`font-bold block text-[11px] uppercase tracking-wider ${methInfo.themeColor.text}`}>
                                    {methInfo.badgeIcon} Paradigma Metodológico: {methInfo.paradigm}
                                  </span>
                                  <p className="leading-relaxed text-[#24302F]">{p.methodology}</p>
                                  <p className={`text-[11px] ${methInfo.themeColor.text} font-medium pt-1`}>
                                    {methInfo.summary}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#CCD4CF] space-y-2">
                                    <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">
                                      ❓ Preguntas abiertas por resolver en LabSIE:
                                    </span>
                                    <ul className="list-disc pl-4 space-y-1.5 text-[#526066]">
                                      {p.openQuestions.map((qItem, qIdx) => (
                                        <li key={qIdx} className="leading-relaxed">{qItem}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#CCD4CF] space-y-2">
                                    <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">
                                      🚀 Posibilidades de continuidad para estudiantes:
                                    </span>
                                    <ul className="list-disc pl-4 space-y-1.5 text-[#526066]">
                                      {p.continuityPossibilities.map((cItem, cIdx) => (
                                        <li key={cIdx} className="leading-relaxed">{cItem}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5. Pregunta 16: Verificación y Selección Rápida en Matriz */}
                <div className="space-y-3 pt-6 border-t border-[#DDE2DE]">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[11px] font-bold border border-[#A7F3D0]">
                        Pregunta 16
                      </span>
                      <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                        Confirmación de Investigaciones de Mayor Interés{' '}
                        <span className="text-[#3F4E4C] font-normal text-xs">(Selecciona al menos una investigación para tu perfil)</span>
                      </label>
                    </div>
                    {selectedLabSIEProjects.length > 0 && (
                      <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                        {selectedLabSIEProjects.length} seleccionada{selectedLabSIEProjects.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#3F4E4C] font-medium">
                    Puedes marcar o desmarcar con un solo clic en esta cuadrícula rápida resumen de los {projects.length} proyectos:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {sortedProjects.map((p, idx) => {
                      const isSelected = selectedLabSIEProjects.includes(p.id);
                      const methInfo = getProjectMethodology(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleLabSIEProject(p.id)}
                          className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20 shadow-xs'
                              : 'border border-[#CCD4CF] bg-[#FFFDF9] text-[#24302F] hover:bg-[#F7F3ED]'
                          }`}
                        >
                          <div className="flex-1 pr-1">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="font-mono font-bold text-[#059669] text-xs">
                                {p.code}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded ${methInfo.themeColor.pillBg} ${methInfo.themeColor.text} text-[10px] font-bold`}>
                                {methInfo.badgeIcon} {methInfo.badgeTitle.replace('Metodología: ', '')}
                              </span>
                            </div>
                            <span className="line-clamp-2 text-xs leading-snug block" style={{ color: isSelected ? '#065F46' : '#24302F' }}>
                              Proyecto {idx + 1}: {p.title}
                            </span>
                            <span className="text-[10px] text-[#526066] font-medium block mt-1">
                              {p.lineName}
                            </span>
                          </div>

                          <span
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#10B981] border-[#10B981] text-white shadow-xs'
                                : 'border-[#CCD4CF] bg-[#FFFDF9]'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Pregunta 17: Pensamiento Divergente a partir del Patrimonio */}
                <div className="space-y-3 pt-6 border-t border-[#DDE2DE]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[11px] font-bold border border-[#A7F3D0]">
                      Pregunta 17
                    </span>
                    <label className="text-sm font-bold text-[#24302F] font-serif block" style={{ color: '#24302F' }}>
                      ¿Hubo algún proyecto que te haya hecho pensar: "Yo investigaría algo diferente a partir de esto"?
                    </label>
                  </div>

                  <p className="text-xs text-[#526066]">
                    Si al conocer las investigaciones se te ocurrió una variante, un contexto distinto o un enfoque divergente, descríbelo aquí (opcional pero muy valioso para la ruta TRASCENDER):
                  </p>

                  {/* Sugerencias contextuales según los proyectos marcados */}
                  {selectedLabSIEProjects.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] font-bold text-[#059669]">Inspiración rápida:</span>
                      {selectedLabSIEProjects.slice(0, 3).map(id => {
                        const p = sortedProjects.find(proj => proj.id === id);
                        if (!p) return null;
                        const sampleIdea = `A partir de ${p.code} (${p.title.slice(0, 35)}...), me gustaría investigar cómo aplicarlo a...`;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              if (!divergentProjectIdea) {
                                setDivergentProjectIdea(sampleIdea);
                              } else {
                                setDivergentProjectIdea(prev => `${prev} Además, a partir de ${p.code}...`);
                              }
                            }}
                            className="cursor-pointer text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] px-2 py-0.5 rounded-full transition-colors truncate max-w-[280px]"
                          >
                            + Inspirarse en {p.code}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <textarea
                    rows={3}
                    value={divergentProjectIdea}
                    onChange={e => setDivergentProjectIdea(e.target.value)}
                    placeholder="Por ejemplo: 'A partir del Gemelo Digital (LABSIE-P07), me gustaría simular grupos colaborativos enteros en vez de estudiantes individuales...'"
                    className="w-full p-4 text-xs md:text-sm bg-[#FAF8F5] border border-[#CCD4CF] rounded-xl text-[#24302F] placeholder-[#6F7976] focus:outline-none focus:border-[#10B981] leading-relaxed shadow-inner"
                  />
                </div>
              </div>
            );
          })()}

          {/* ============================================================== */}
          {/* SECCIÓN 6 — 💡 TUS PROPIAS IDEAS */}
          {/* ============================================================== */}
          {currentSection === 6 && (
            <div className="space-y-7">
              <div className="border-b border-[#DDE2DE] pb-4">
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  SECCIÓN 6
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
                  💡 Tus Propias Ideas
                </h2>
                <p className="text-xs md:text-sm text-[#059669] italic mt-1 font-serif font-semibold">
                  Esta sección es el corazón creativo para estructurar tu ruta investigativa en LabSIE.
                </p>
              </div>

              {/* 18. ¿Qué problema te gustaría investigar? */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 18
                  </span>
                  <label className="text-sm font-bold text-[#1C2624] font-serif block" style={{ color: '#1C2624' }}>
                    ¿Qué problema relacionado con educación, tecnología o Inteligencia Artificial te gustaría investigar? <span className="text-[#B65C5C]">*</span>
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={problemToInvestigate}
                  onChange={e => setProblemToInvestigate(e.target.value)}
                  placeholder="Describe el problema, curiosidad o fenómeno en tus propias palabras..."
                  className="w-full p-4 text-xs md:text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner font-medium"
                />
              </div>

              {/* 19. ¿Hay algo que siempre hayas querido investigar? */}
              <div className="space-y-2 pt-3 border-t-2 border-[#CCD4CF]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 19
                  </span>
                  <label className="text-sm font-bold text-[#1C2624] font-serif block" style={{ color: '#1C2624' }}>
                    ¿Hay algo que siempre hayas querido investigar, pero nunca hayas tenido la oportunidad?
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={dreamResearch}
                  onChange={e => setDreamResearch(e.target.value)}
                  placeholder="Alguna idea latente, curiosidad pedagógica o tecnología que sueñes explorar..."
                  className="w-full p-4 text-xs md:text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner font-medium"
                />
              </div>

              {/* 20. Si tuvieras seis meses para investigar... */}
              <div className="space-y-2 pt-3 border-t-2 border-[#CCD4CF]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 20
                  </span>
                  <label className="text-sm font-bold text-[#1C2624] font-serif block" style={{ color: '#1C2624' }}>
                    Si tuvieras seis meses para desarrollar una investigación, ¿qué te gustaría descubrir, crear o resolver?
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={sixMonthsDiscovery}
                  onChange={e => setSixMonthsDiscovery(e.target.value)}
                  placeholder="Un resultado concreto, un prototipo de software o un hallazgo didáctico tangible..."
                  className="w-full p-4 text-xs md:text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner font-medium"
                />
              </div>

              {/* 21. Si tuvieras que continuar una investigación existente, ¿qué preferirías hacer? */}
              <div className="space-y-3 pt-3 border-t-2 border-[#CCD4CF]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 21
                  </span>
                  <label className="text-sm font-bold text-[#1C2624] font-serif block" style={{ color: '#1C2624' }}>
                    Si tuvieras que continuar una investigación existente, ¿qué preferirías hacer? <span className="text-[#B65C5C]">*</span>{' '}
                    <span className="text-[#059669] font-bold text-xs">(Selecciona una respuesta)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {CONTINUATION_OPTIONS.map(opt => {
                    const isSelected = continuationPreference === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setContinuationPreference(opt.key)}
                        className={`cursor-pointer p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
                          isSelected
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold ring-2 ring-[#10B981]/20'
                            : 'border border-[#DDE2DE] bg-[#FFFDF9] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <div>
                          <span className="font-serif font-bold text-base block" style={{ color: isSelected ? '#065F46' : '#24302F' }}>
                            {opt.title}
                          </span>
                          <p className="text-xs md:text-sm text-[#6F7976] mt-1 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 ml-3 flex items-center justify-center ${
                            isSelected ? 'bg-[#10B981] border-[#10B981]' : 'border-[#DDE2DE] bg-[#FFFDF9]'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 bg-[#FFFDF9] rounded-full" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECCIÓN 7 — 🚀 TUS EXPECTATIVAS */}
          {/* ============================================================== */}
          {currentSection === 7 && (
            <div className="space-y-7">
              <div className="border-b border-[#DDE2DE] pb-4">
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  SECCIÓN 7
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
                  🚀 Tus Expectativas
                </h2>
                <p className="text-xs md:text-sm text-[#6F7976] mt-1.5">
                  Últimas reflexiones para guiar tu proceso de vinculación y acompañamiento tutorial en LabSIE.
                </p>
              </div>

              {/* 22. ¿Qué esperas encontrar en LabSIE? */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                      Pregunta 22
                    </span>
                    <label className="text-sm font-bold text-[#1C2624] font-serif block" style={{ color: '#1C2624' }}>
                      ¿Qué esperas encontrar en LabSIE?{' '}
                      <span className="text-[#059669] font-bold text-xs">(Varias respuestas)</span>
                    </label>
                  </div>
                  {labsieExpectations.length > 0 && (
                    <span className="text-xs font-bold text-[#059669]">
                      {labsieExpectations.length} seleccionadas
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXPECTATIONS_LIST.map(item => {
                    const isSelected = labsieExpectations.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleExpectation(item)}
                        className={`cursor-pointer p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-[#10B981] bg-[#ECFDF5] font-bold text-[#065F46] ring-2 ring-[#10B981]/20'
                            : 'border-2 border-[#CCD4CF] bg-[#FFFDF9] text-[#1C2624] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        <span style={{ color: isSelected ? '#065F46' : '#1C2624' }}>{item}</span>
                        <span
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ml-2 ${
                            isSelected ? 'bg-[#10B981] border-[#10B981] text-[#FFFDF9]' : 'border-[#CCD4CF] bg-[#FAF8F5]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#FFFDF9]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 23. ¿Hay algo más que quieras contarnos sobre tus intereses? */}
              <div className="space-y-2 pt-4 border-t-2 border-[#CCD4CF]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold">
                    Pregunta 23
                  </span>
                  <label className="text-sm font-bold text-[#1C2624] font-serif block" style={{ color: '#1C2624' }}>
                    ¿Hay algo más que quieras contarnos sobre tus intereses?
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={additionalInterests}
                  onChange={e => setAdditionalInterests(e.target.value)}
                  placeholder="Comentarios adicionales, disponibilidad, áreas de pasión en informática o docencia..."
                  className="w-full p-4 text-xs md:text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] placeholder-[#526066] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] shadow-inner font-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal / Analyzing State Overlay */}
        {isAnalyzing && (
          <div className="py-14 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] mx-auto flex items-center justify-center animate-pulse border border-[#A7F3D0]">
              <Sparkles className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#24302F]" style={{ color: '#24302F' }}>
              Generando tu Ruta Investigativa LabSIE
            </h3>
            <p className="text-sm text-[#059669] italic font-serif font-semibold">
              {analysisStatusText}
            </p>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        {!isAnalyzing && (
          <div className="mt-10 pt-6 border-t-2 border-[#CCD4CF] flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold text-[#24302F] bg-[#FFFDF9] border-2 border-[#CCD4CF] hover:bg-[#ECFDF5] hover:border-[#10B981] transition-colors shadow-xs"
              style={{ color: '#24302F' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentSection === 1 ? 'Cancelar e ir a Inicio' : 'Anterior'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="cursor-pointer inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#10B981] text-[#FFFDF9] text-xs md:text-sm font-bold hover:bg-[#059669] transition-all shadow-md hover:shadow-lg border-2 border-[#10B981]"
            >
              <span>
                {currentSection === TOTAL_SECTIONS ? 'Finalizar y Descubrir Ruta' : 'Siguiente sección'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
