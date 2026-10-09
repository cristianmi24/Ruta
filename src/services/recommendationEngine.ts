import {
  TestAnswers,
  ResearchProject,
  ResearchLine,
  AnalysisResult,
  RouteType,
  CorrespondenceLevel,
  RelatedProjectAffinity,
  ProposedProject,
  ProposedProjectOption,
  AnalysisPerspective
} from '../types';

export const ALGORITHM_VERSION = 'v2.0-lic-informatica-engine';

export function runRecommendationEngine(
  answers: TestAnswers,
  projects: ResearchProject[],
  lines: ResearchLine[]
): AnalysisResult {
  const {
    profile,
    firstActionOnProblem = '',
    curiosityQuestions = [],
    preferredActivities = [],
    scenarioDifficulty = '',
    scenarioTeacherAI = '',
    scenarioIntelligentSystem = '',
    scenarioCulturalChallenge = '',
    aiInterests = [],
    researcherArchetypes = [],
    problemToInvestigate = '',
    dreamResearch = '',
    sixMonthsDiscovery = '',
    selectedLabSIEProjects = [],
    divergentProjectIdea = '',
    continuationPreference = '',
    labsieExpectations = [],
    additionalInterests = '',
    personalPassions = answers.personalPassions || profile.personalPassions || [],
    programmingInterestLevel = answers.programmingInterestLevel || profile.programmingInterestLevel || '',
    programmingLanguages = answers.programmingLanguages || profile.programmingLanguages || [],
    programmingExperienceSummary = answers.programmingExperienceSummary || profile.programmingExperienceSummary || '',
    internationalProjectsInterest = answers.internationalProjectsInterest || profile.internationalProjectsInterest || '',
    internationalMotivations = answers.internationalMotivations || profile.internationalMotivations || [],
    preferredRole = answers.preferredRole || profile.preferredRole || ''
  } = answers;

  // Combine long text answers for conceptual semantic analysis
  const combinedIdeaText = [
    problemToInvestigate,
    dreamResearch,
    sixMonthsDiscovery,
    divergentProjectIdea,
    additionalInterests,
    programmingExperienceSummary,
    ...personalPassions,
    ...programmingLanguages,
    ...internationalMotivations
  ].join(' ').toLowerCase();

  const projectAffinities: {
    project: ResearchProject;
    totalAffinity: number;
    interestScore: number;
    waysScore: number;
    scenarioScore: number;
    ideaScore: number;
    selectedScore: number;
    experienceScore: number;
    connectionReason: string;
    matchingConcepts: string[];
  }[] = [];

  for (const project of projects) {
    const projConceptsLower = project.concepts.map(c => c.toLowerCase());
    const projKeywordsLower = project.keywords.map(k => k.toLowerCase());
    const projAllTerms = [...projConceptsLower, ...projKeywordsLower, project.title.toLowerCase()];

    // A. Intereses (Curiosidades Q8 + IA Interests Q14 + Pasiones Vocacionales + Proyectos Internacionales) - 25%
    let interestMatches = 0;
    const matchingConceptsFound: string[] = [];

    // Check curiosity questions
    curiosityQuestions.forEach(q => {
      const qLow = q.toLowerCase();
      if (qLow.includes('aprenden') && (projAllTerms.some(t => t.includes('aprendizaje') || t.includes('cognitivo') || t.includes('pensamiento') || t.includes('estudiante')))) interestMatches += 1.5;
      if (qLow.includes('inteligentes') && (projAllTerms.some(t => t.includes('inteligente') || t.includes('ia') || t.includes('tutor') || t.includes('llm') || t.includes('carina')))) interestMatches += 1.6;
      if (qLow.includes('patrones') && (projAllTerms.some(t => t.includes('tracing') || t.includes('predicción') || t.includes('datos') || t.includes('benchmark')))) interestMatches += 1.6;
      if (qLow.includes('tecnología') && (projAllTerms.some(t => t.includes('tecnología') || t.includes('gemelo') || t.includes('coil') || t.includes('sistema')))) interestMatches += 1.3;
      if (qLow.includes('diferente') || qLow.includes('condición')) interestMatches += 1.2;
    });

    // Check Personal Passions (¿Qué le gusta?)
    personalPassions.forEach(pass => {
      const pLow = pass.toLowerCase();
      if (pLow.includes('artificial') || pLow.includes('llm') || pLow.includes('agente')) {
        if (projAllTerms.some(t => t.includes('ia') || t.includes('llm') || t.includes('inteligente') || t.includes('metacogn') || t.includes('generativa'))) interestMatches += 2.2;
      }
      if (pLow.includes('software') || pLow.includes('programación') || pLow.includes('web') || pLow.includes('móvil')) {
        if (projAllTerms.some(t => t.includes('app') || t.includes('software') || t.includes('sistema') || t.includes('desarrollo') || t.includes('red') || t.includes('tracing'))) interestMatches += 2.0;
      }
      if (pLow.includes('datos') || pLow.includes('analítica')) {
        if (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('datos') || t.includes('markov') || t.includes('tracing') || t.includes('machine learning'))) interestMatches += 2.4;
      }
      if (pLow.includes('gamificación') || pLow.includes('juego') || pLow.includes('lúd')) {
        if (projAllTerms.some(t => t.includes('gamificación') || t.includes('juego') || t.includes('lúdico') || t.includes('lúdica'))) interestMatches += 2.8;
      }
      if (pLow.includes('didáctica') || pLow.includes('pedagogía') || pLow.includes('aula')) {
        if (projAllTerms.some(t => t.includes('didáctica') || t.includes('aula') || t.includes('enseñanza') || t.includes('docente') || t.includes('microcurrículo'))) interestMatches += 2.0;
      }
      if (pLow.includes('cultural') || pLow.includes('nativa') || pLow.includes('etno')) {
        if (projAllTerms.some(t => t.includes('cultural') || t.includes('embera') || t.includes('indígena') || t.includes('pln') || t.includes('identidad'))) interestMatches += 2.8;
      }
      if (pLow.includes('metacognición') || pLow.includes('autorregula')) {
        if (project.lineId === 'line-artificial-metacognition' || projAllTerms.some(t => t.includes('metacogn') || t.includes('carina') || t.includes('cpcc') || t.includes('claustrum') || t.includes('dma'))) interestMatches += 2.8;
      }
    });

    // Check International Projects Interest (Proyectos que abarquen otros países)
    if (internationalProjectsInterest.includes('Mucho') || internationalProjectsInterest.includes('apasiona') || internationalMotivations.length > 0) {
      // Proyectos con vocación internacional/intercultural o benchmarks globales
      if (projAllTerms.some(t => t.includes('coil') || t.includes('benchmark') || t.includes('carina') || t.includes('llm') || t.includes('pln') || t.includes('traductor') || t.includes('cpcc') || t.includes('marina') || t.includes('meta-dna'))) {
        interestMatches += 2.5;
      }
    }

    // Check Programming affinity
    if (programmingInterestLevel.includes('apasiona') || programmingInterestLevel.includes('gusta')) {
      if (projAllTerms.some(t => t.includes('app') || t.includes('software') || t.includes('modelo') || t.includes('tracing') || t.includes('machine learning') || t.includes('algoritmo') || t.includes('código') || t.includes('red') || t.includes('cpcc') || t.includes('ontología'))) {
        interestMatches += 2.2;
      }
    }

    // Check AI interests
    aiInterests.forEach(ai => {
      const aiLow = ai.toLowerCase();
      if (aiLow.includes('aprender') && projAllTerms.some(t => t.includes('aprender') || t.includes('aprendizaje') || t.includes('gamificación') || t.includes('autónomo'))) interestMatches += 1.8;
      if (aiLow.includes('enseñar') && projAllTerms.some(t => t.includes('enseñar') || t.includes('didáctica') || t.includes('currículo') || t.includes('formación'))) interestMatches += 1.8;
      if (aiLow.includes('datos') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('datos') || t.includes('markov') || t.includes('machine learning')))) interestMatches += 2.0;
      if (aiLow.includes('retroalimentación') && projAllTerms.some(t => t.includes('retroalimentación') || t.includes('tutor') || t.includes('recomendación'))) interestMatches += 2.0;
      if (aiLow.includes('adapta') && (project.lineId === 'line-entornos-virtuales-adaptativos' || projAllTerms.some(t => t.includes('adaptativ') || t.includes('asistente') || t.includes('tutor')))) interestMatches += 1.8;
      if (aiLow.includes('comportamiento') && projAllTerms.some(t => t.includes('comportamiento') || t.includes('disciplinario') || t.includes('autorregulado') || t.includes('inasistencia'))) interestMatches += 2.0;
      if (aiLow.includes('evalúa') && projAllTerms.some(t => t.includes('evaluación') || t.includes('competencias') || t.includes('rendimiento') || t.includes('metacognición') || t.includes('carina'))) interestMatches += 2.2;
      if (aiLow.includes('límites') && projAllTerms.some(t => t.includes('pensamiento crítico') || t.includes('dificultades') || t.includes('experiencias'))) interestMatches += 2.0;
      if ((aiLow.includes('metacognici') || aiLow.includes('autorregula') || aiLow.includes('endógena') || aiLow.includes('object level') || aiLow.includes('meta level')) && (project.lineId === 'line-artificial-metacognition' || projAllTerms.some(t => t.includes('metacogn') || t.includes('carina') || t.includes('cpcc') || t.includes('claustrum') || t.includes('dma')))) interestMatches += 2.6;
    });

    const interestScore = Math.min(100, Math.round((interestMatches / Math.max(3, (curiosityQuestions.length + aiInterests.length + personalPassions.length) * 0.35)) * 100));

    // B. Actividades y Formas de Investigar (Q7 + Q9) - 15%
    let waysMatches = 0;
    const actionLow = firstActionOnProblem.toLowerCase();
    if (actionLow.includes('comprender') && projAllTerms.some(t => t.includes('cognitivo') || t.includes('neurocognitivo') || t.includes('pensamiento crítico') || t.includes('fenomenología'))) waysMatches += 2;
    if (actionLow.includes('datos') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('markov') || t.includes('machine learning') || t.includes('indicadores')))) waysMatches += 2.5;
    if ((actionLow.includes('prototipo') || actionLow.includes('diseñar')) && projAllTerms.some(t => t.includes('diseño') || t.includes('desarrollo') || t.includes('app') || t.includes('red'))) waysMatches += 2;
    if (actionLow.includes('experimentar') || actionLow.includes('comparar')) waysMatches += 2;

    preferredActivities.forEach(act => {
      const actLow = act.toLowerCase();
      if ((actLow.includes('datos') || actLow.includes('patrones')) && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('datos') || t.includes('markov') || t.includes('machine learning')))) waysMatches += 2.5;
      if ((actLow.includes('programar') || actLow.includes('aplicaciones')) && projAllTerms.some(t => t.includes('app') || t.includes('software') || t.includes('desarrollo') || t.includes('qr'))) waysMatches += 2.5;
      if (actLow.includes('inteligencia artificial') && (project.lineId === 'line-diseno-sistemas-inteligentes' || project.lineId === 'line-ia-aprendizaje-personalizado' || projAllTerms.some(t => t.includes('ia') || t.includes('inteligente') || t.includes('tutor') || t.includes('machine learning')))) waysMatches += 2.5;
      if ((actLow.includes('actividades educativas') || actLow.includes('interfaces')) && projAllTerms.some(t => t.includes('actividades') || t.includes('didáctica') || t.includes('gamificación') || t.includes('ux'))) waysMatches += 2.5;
      if ((actLow.includes('entrevistar') || actLow.includes('docentes')) && projAllTerms.some(t => t.includes('docentes') || t.includes('formación') || t.includes('currículo') || t.includes('experiencias'))) waysMatches += 2.5;
      if (actLow.includes('estudiantes') && projAllTerms.some(t => t.includes('estudiante') || t.includes('secundaria') || t.includes('rural') || t.includes('aula'))) waysMatches += 2.5;
    });

    const waysScore = Math.min(100, Math.round((waysMatches / Math.max(3, preferredActivities.length * 0.8)) * 100));

    // C. Escenarios Situacionales (Q10, Q11, Q12, Q13) - 20%
    let scenarioScore = 50;

    // Q10: Dificultad en plataforma
    if (scenarioDifficulty.startsWith('A') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('predecir') || t.includes('inasistencia') || t.includes('rendimiento')))) scenarioScore += 18; // Detección temprana
    if (scenarioDifficulty.startsWith('B') && projAllTerms.some(t => t.includes('dificultades') || t.includes('pensamiento crítico') || t.includes('experiencias'))) scenarioScore += 18; // Por qué ocurre
    if (scenarioDifficulty.startsWith('C') && projAllTerms.some(t => t.includes('tutor') || t.includes('resolución de problemas') || t.includes('asistente') || t.includes('gamificación'))) scenarioScore += 18; // Cómo ayudar
    if (scenarioDifficulty.startsWith('D') && (project.lineId === 'line-entornos-virtuales-adaptativos' || projAllTerms.some(t => t.includes('adaptar') || t.includes('rural') || t.includes('dua')))) scenarioScore += 18; // Adaptar
    if (scenarioDifficulty.startsWith('E') && projAllTerms.some(t => t.includes('autorregulado') || t.includes('pensamiento crítico') || t.includes('autónomo'))) scenarioScore += 18; // Reflexión errores
    if (scenarioDifficulty.startsWith('F') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('machine learning') || t.includes('automatiz') || t.includes('ontología')))) scenarioScore += 18; // Automatización

    // Q11: Docente con IA
    if (scenarioTeacherAI.startsWith('A') && projAllTerms.some(t => t.includes('currículo') || t.includes('resultados de aprendizaje') || t.includes('planeación') || t.includes('competencias'))) scenarioScore += 20;
    if (scenarioTeacherAI.startsWith('B') && projAllTerms.some(t => t.includes('asistente') || t.includes('steam') || t.includes('didáctica') || t.includes('gamificación'))) scenarioScore += 18;
    if (scenarioTeacherAI.startsWith('D') && projAllTerms.some(t => t.includes('tutor') || t.includes('autorregulado') || t.includes('classroom'))) scenarioScore += 18;
    if (scenarioTeacherAI.startsWith('E') && projAllTerms.some(t => t.includes('rural') || t.includes('cultural') || t.includes('botánica') || t.includes('identidad'))) scenarioScore += 18;

    // Q12: Sistema observa comportamiento
    if (scenarioIntelligentSystem.startsWith('A') && (project.lineId === 'line-analisis-datos-educativos' || projAllTerms.some(t => t.includes('predecir') || t.includes('rendimiento') || t.includes('inasistencia')))) scenarioScore += 20;
    if (scenarioIntelligentSystem.startsWith('B') && projAllTerms.some(t => t.includes('markov') || t.includes('datos') || t.includes('competencias'))) scenarioScore += 18;
    if (scenarioIntelligentSystem.startsWith('C') && projAllTerms.some(t => t.includes('gamificación') || t.includes('app') || t.includes('qr') || t.includes('adaptad'))) scenarioScore += 18;
    if (scenarioIntelligentSystem.startsWith('D') && projAllTerms.some(t => t.includes('tutor') || t.includes('retroalimentación') || t.includes('resolución'))) scenarioScore += 22;
    if (scenarioIntelligentSystem.startsWith('F') && projAllTerms.some(t => t.includes('pensamiento crítico') || t.includes('resolución de problemas'))) scenarioScore += 22;
    if (scenarioIntelligentSystem.startsWith('G') && projAllTerms.some(t => t.includes('autorregulado') || t.includes('autónomo') || t.includes('metacogn'))) scenarioScore += 22;

    // Q13: Reto cultural colaborativo
    if (projAllTerms.some(t => t.includes('cultural') || t.includes('identidad') || t.includes('rural') || t.includes('botánica') || t.includes('comunidad'))) {
      scenarioScore += 22;
    }

    scenarioScore = Math.min(100, scenarioScore);

    // D. Ideas Propias del Estudiante (Q16, Q17, Q18, Q20) - 20%
    let ideaScore = 40;
    const keywordsBank = [
      'conocimiento', 'aprendizaje', 'tutor', 'inteligencia artificial', 'ia', 'retroalimentación',
      'crítico', 'evaluación', 'modelo', 'datos', 'escuela', 'docente', 'estudiante', 'cultura',
      'coil', 'lenguaje', 'llm', 'chatgpt', 'gemelo', 'simulación', 'programación', 'algoritmo',
      'código', 'error', 'dificultad', 'predecir', 'intervención', 'metacognición', 'rural', 'córdoba',
      'artificial metacognition', 'object level', 'meta level', 'cpcc', 'meta-dna', 'dma', 'marina-10', 'metalingua', 'cortico-claustrum', 'explainable control', 'im-onto', 'introspección'
    ];

    let ideaMatches = 0;
    keywordsBank.forEach(kw => {
      if (combinedIdeaText.includes(kw)) {
        if (projAllTerms.some(t => t.includes(kw))) {
          ideaMatches += 1;
        }
      }
    });

    if (combinedIdeaText.length > 20) {
      ideaScore = Math.min(100, 45 + ideaMatches * 7);
    }

    // E. Proyectos seleccionados explícitamente (Q19) y Expectativas (Q22) - 10%
    const isSelected = selectedLabSIEProjects.some(sp => sp.toLowerCase().includes(project.id.toLowerCase()) || sp.toLowerCase().includes(project.code.toLowerCase()) || sp.toLowerCase().includes(project.title.toLowerCase().slice(0, 15)));
    let selectedScore = isSelected ? 95 : 45;

    // F. Experiencia y Trayectoria Técnica (Q4, Q5, Q6) - 10%
    let experienceScore = 50;
    const techExp = profile.techExperience || '';
    const aiExp = profile.aiExperience || '';
    const resExp = profile.researchExperience || '';

    if (techExp.includes('Muy avanzado') || techExp.includes('Avanzado')) experienceScore += 25;
    else if (techExp.includes('Intermedio')) experienceScore += 15;

    if (aiExp.includes('Habitualmente') || aiExp.includes('Frecuentemente')) experienceScore += 25;
    else if (aiExp.includes('Ocasionalmente')) experienceScore += 15;

    if (resExp.includes('proyecto') || resExp.includes('experiencia')) experienceScore += 20;

    experienceScore = Math.min(100, experienceScore);

    // Ponderación oficial:
    // Intereses (25%), Actividades (15%), Escenarios (20%), Ideas propias (20%), Seleccionados (10%), Experiencia (10%)
    const totalAffinity = Math.round(
      interestScore * 0.25 +
      waysScore * 0.15 +
      scenarioScore * 0.20 +
      ideaScore * 0.20 +
      selectedScore * 0.10 +
      experienceScore * 0.10
    );

    // Matching concepts
    project.concepts.forEach(c => {
      const cLow = c.toLowerCase();
      if (
        curiosityQuestions.some(q => q.toLowerCase().includes(cLow.substring(0, 5))) ||
        aiInterests.some(ai => ai.toLowerCase().includes(cLow.substring(0, 5))) ||
        combinedIdeaText.includes(cLow.substring(0, 5)) ||
        projAllTerms.some(t => t.includes(cLow))
      ) {
        if (!matchingConceptsFound.includes(c)) {
          matchingConceptsFound.push(c);
        }
      }
    });

    let connectionReason = `Afinidad detectada en el eje de ${project.lineName}.`;
    if (isSelected && totalAffinity >= 75) {
      connectionReason = `Fuerte coincidencia entre tus intereses declarados en la Licenciatura en Informática y la memoria de este proyecto.`;
    } else if (totalAffinity >= 70) {
      connectionReason = `Correspondencia significativa con tu interés en ${project.concepts[0]} y tus elecciones situacionales.`;
    } else {
      connectionReason = `Alineación en aspectos didácticos y computacionales de ${project.concepts.slice(0, 2).join(' y ')}.`;
    }

    projectAffinities.push({
      project,
      totalAffinity,
      interestScore,
      waysScore,
      scenarioScore,
      ideaScore,
      selectedScore,
      experienceScore,
      connectionReason,
      matchingConcepts: matchingConceptsFound.slice(0, 4)
    });
  }

  // Sort descending by affinity
  projectAffinities.sort((a, b) => b.totalAffinity - a.totalAffinity);

  const topProject = projectAffinities[0];
  const secondProject = projectAffinities[1];
  const thirdProject = projectAffinities[2];

  // Overall correspondence score
  const correspondenceScore = Math.min(
    100,
    Math.round(topProject.totalAffinity * 0.6 + (secondProject ? secondProject.totalAffinity * 0.3 : 0) + (thirdProject ? thirdProject.totalAffinity * 0.1 : 0))
  );

  let correspondenceLevel: CorrespondenceLevel = 'Correspondencia exploratoria';
  if (correspondenceScore >= 80) correspondenceLevel = 'Alta correspondencia';
  else if (correspondenceScore >= 60) correspondenceLevel = 'Buena correspondencia';
  else if (correspondenceScore >= 40) correspondenceLevel = 'Correspondencia exploratoria';
  else correspondenceLevel = 'Baja correspondencia';

  // Determine Route Type based on Q21 (continuationPreference) and affinities:
  // 🧬 Profundizar -> HEREDAR
  // 🔗 Conectar -> CONECTAR
  // 🌱 Transformar / 💡 Crear -> TRASCENDER
  // 🧭 Explorar -> EXPLORAR
  let routeType: RouteType = 'HEREDAR';

  const pref = continuationPreference.toLowerCase();
  if (pref.includes('profundizar') && correspondenceScore >= 55) {
    routeType = 'HEREDAR';
  } else if (pref.includes('conectar') && correspondenceScore >= 50) {
    routeType = 'CONECTAR';
  } else if ((pref.includes('transformar') || pref.includes('crear')) && correspondenceScore >= 50) {
    routeType = 'TRASCENDER';
  } else if (pref.includes('explorar') || correspondenceScore < 45) {
    routeType = 'EXPLORAR';
  } else {
    // Fallback if not chosen or nuanced
    if (topProject.totalAffinity >= 75 && secondProject && secondProject.totalAffinity >= 72) {
      routeType = 'CONECTAR';
    } else if (topProject.totalAffinity >= 70) {
      routeType = 'HEREDAR';
    } else if (correspondenceScore >= 55) {
      routeType = 'TRASCENDER';
    } else {
      routeType = 'EXPLORAR';
    }
  }

  // Archetype: Prioritize Q15 choice if present
  let profileArchetype = 'El Explorador 🔎 · Descubridor Pedagógico';
  if (researcherArchetypes.length > 0) {
    profileArchetype = researcherArchetypes.slice(0, 2).join(' & ');
  } else if (preferredActivities.some(a => a.includes('datos') || a.includes('patrones'))) {
    profileArchetype = 'El Analista 📊 · Analítica de Datos y Knowledge Tracing';
  } else if (preferredActivities.some(a => a.includes('programar') || a.includes('aplicaciones'))) {
    profileArchetype = 'El Constructor 💻 · Arquitecto de Sistemas Inteligentes';
  } else if (preferredActivities.some(a => a.includes('actividades') || a.includes('interfaces'))) {
    profileArchetype = 'El Diseñador 🎨 · Diseñador de Experiencias y Tareas Pedagógicas';
  }

  // Interest percentages breakdown for visualization
  const interestPercentages: Record<string, number> = {
    'IA Educativa y Tutores': Math.min(96, Math.max(45, Math.round(topProject.interestScore * 0.95))),
    'Analítica y Knowledge Tracing': Math.min(95, Math.max(40, Math.round(topProject.waysScore * 0.9 + 10))),
    'Diseño Didáctico e Interfaces': Math.min(92, Math.max(35, Math.round(topProject.scenarioScore * 0.85 + 10))),
    'Metacognición y Modelos LLM': Math.min(90, Math.max(30, Math.round(topProject.experienceScore * 0.8 + 15))),
    'Colaboración e Interculturalidad': Math.min(88, Math.max(30, scenarioCulturalChallenge ? 85 : 45))
  };

  // Related projects list (max 3)
  const relatedProjects: RelatedProjectAffinity[] = projectAffinities.slice(0, 3).map(pa => ({
    projectId: pa.project.id,
    projectTitle: pa.project.title,
    projectCode: pa.project.code,
    affinity: pa.totalAffinity,
    connectionReason: pa.connectionReason,
    matchingConcepts: pa.matchingConcepts.length > 0 ? pa.matchingConcepts : pa.project.concepts.slice(0, 3)
  }));

  // Why explanation (2-4 academic paragraphs)
  const whyExplanation: string[] = [];
  const primaryProject = topProject.project;

  if (routeType === 'HEREDAR') {
    whyExplanation.push(
      `En la Licenciatura en Informática de la Universidad de Córdoba, tu perfil presenta una afinidad alta y concentrada con la investigación "${primaryProject.title}" (${primaryProject.code}), vinculada a la línea de ${primaryProject.lineName}. Tus respuestas en las actividades y situaciones demuestran que tu interés está en profundizar un problema que ya cuenta con base sólida en el semillero.`
    );
    whyExplanation.push(
      `En LabSIE, esta investigación cuenta con un marco teórico estructurado, preguntas abiertas formuladas y vías de continuidad directas (por ejemplo: transferir el modelo a nuevos cursos de programación o perfeccionar la retroalimentación en tiempo real). En lugar de empezar desde cero, te apoyas en la memoria viva de EduTLAN.`
    );
    whyExplanation.push(
      `La ruta HEREDAR te brinda la oportunidad de vincularte inmediatamente a un equipo de trabajo para continuar o validar una fase pendiente, lo cual es ideal para proyectar tu trabajo de grado en la licenciatura.`
    );
  } else if (routeType === 'CONECTAR') {
    const secProj = secondProject?.project;
    whyExplanation.push(
      `Tus respuestas y preferencias situacionales se sitúan en la intersección de dos investigaciones patrimoniales de LabSIE: "${primaryProject.title}" y "${secProj?.title}".`
    );
    whyExplanation.push(
      `El sistema detecta una complementariedad natural para un estudiante de Licenciatura en Informática: articular los avances en ${primaryProject.lineName} con los desarrollos de ${secProj?.lineName}. Tu interés en conectar ideas te permite ser el puente entre dos metodologías que se venían explorando en paralelo.`
    );
    whyExplanation.push(
      `Bajo la ruta CONECTAR, tu proyecto puede articular el diseño tecnológico con la mediación pedagógica situada, generando un aporte metodológico interdisciplinar con alto potencial de publicación.`
    );
  } else if (routeType === 'TRASCENDER') {
    whyExplanation.push(
      `Tus inquietudes sobre "${problemToInvestigate ? problemToInvestigate.slice(0, 80) + '...' : 'nuevos retos pedagógicos con tecnología'}" demuestran una mirada innovadora. Utilizas como trampolín las investigaciones de LabSIE pero proyectas tu indagación hacia un contexto, población o enfoque didáctico que aún no ha sido explorado en el semillero.`
    );
    whyExplanation.push(
      `Las líneas de investigación de EduTLAN te darán el rigor y las herramientas de evaluación, mientras tú aportas la formulación de una nueva problemática con anclaje regional o comunitario.`
    );
    whyExplanation.push(
      `La ruta TRASCENDER implica diseñar una nueva propuesta investigativa que crezca desde las raíces de LabSIE pero expanda su horizonte temático en la educación en informática.`
    );
  } else {
    // EXPLORAR
    whyExplanation.push(
      `Tu perfil se encuentra en una etapa exploratoria y abierta. Tus intereses aún no convergen de forma unívoca con las investigaciones activas de LabSIE, lo cual es completamente natural en las primeras etapas de formación investigativa.`
    );
    whyExplanation.push(
      `Esto no significa que tus ideas carezcan de valor. Al contrario: representa una oportunidad para participar en las sesiones formativas del semillero, conocer los semilleristas activos y delimitar una pregunta de investigación con el apoyo de un docente tutor.`
    );
    whyExplanation.push(
      `La ruta EXPLORAR te invita a agendar una sesión de orientación con el coordinador de LabSIE para explorar qué temáticas de la Licenciatura en Informática pueden conectar con tu curiosidad.`
    );
  }

  // Proposed Tentative Project
  const proposedProject = generateTentativeProposal(
    routeType,
    primaryProject,
    secondProject?.project,
    problemToInvestigate || dreamResearch || sixMonthsDiscovery,
    profile
  );

  // Generate the 3 distinct perspectives requested by the user
  const perspectives = generateThreePerspectives(
    answers,
    projects,
    lines,
    routeType,
    correspondenceScore,
    projectAffinities,
    primaryProject,
    secondProject?.project,
    proposedProject,
    profile
  );

  // Formulate 3 distinct innovative project options based on the analysis
  const proposedProjectOptions = generateThreeProjectOptions(
    answers,
    primaryProject,
    secondProject?.project,
    routeType,
    profile
  );

  return {
    id: `eval-${Date.now()}`,
    timestamp: new Date().toISOString(),
    algorithmVersion: ALGORITHM_VERSION,
    studentId: `std-${Date.now().toString().slice(-5)}`,
    studentProfile: profile,
    routeType,
    correspondenceScore,
    correspondenceLevel,
    profileArchetype,
    interestPercentages,
    dominantResearchWays: preferredActivities.length > 0 ? preferredActivities.slice(0, 4) : [firstActionOnProblem],
    primaryLineId: primaryProject.lineId,
    primaryLineName: primaryProject.lineName,
    relatedProjects,
    whyExplanation,
    whyBreakdown: {
      matchingInterests: curiosityQuestions.length > 0 ? curiosityQuestions.slice(0, 4) : aiInterests.slice(0, 4),
      matchingWays: preferredActivities.length > 0 ? preferredActivities.slice(0, 4) : [firstActionOnProblem],
      relatedConcepts: primaryProject.concepts.slice(0, 4),
      selectedProjectsCount: selectedLabSIEProjects.length,
      studentIdeaAnalysis: problemToInvestigate
        ? `Inquietud expresada: "${problemToInvestigate.slice(0, 110)}..."`
        : 'Inquietud latente para perfilar en entrevista.',
      detectedConnections: [
        `Línea prioritaria: ${primaryProject.lineName}`,
        secondProject ? `Línea complementaria: ${secondProject.project.lineName}` : 'Focalizado en una línea principal',
        `Preferencia declarada: ${continuationPreference || 'Abierta a orientación'}`
      ]
    },
    proposedProject,
    proposedProjectOptions,
    selectedProjectOptionId: 'opcion-1',
    perspectives,
    selectedPerspectiveId: 'tecnologico',
    studentAnswers: answers
  };
}

function generateTentativeProposal(
  routeType: RouteType,
  p1: ResearchProject,
  p2: ResearchProject | undefined,
  idea: string,
  profile: any
): ProposedProject {
  const isIdeaPresent = idea && idea.trim().length > 10;
  const context = 'Estudiantes y docentes de la Licenciatura en Informática, Universidad de Córdoba (Colombia)';

  if (routeType === 'HEREDAR') {
    return {
      tentativeTitle: `Continuidad y profundización en ${p1.concepts[0] || 'la investigación'}: ampliación del andamiaje pedagógico en la Licenciatura en Informática`,
      tentativeQuestion: `¿Cómo pueden optimizarse las dimensiones de ${p1.concepts[0] || 'interacción'} identificadas en ${p1.code} para mejorar el aprendizaje autónomo en cursos de la Universidad de Córdoba?`,
      tentativeObjective: `Profundizar y validar una fase de continuidad del proyecto ${p1.code}, incorporando mecanismos refinados de seguimiento e intervención en el aula de informática.`,
      centralConcepts: [p1.concepts[0] || 'Investigación Educativa', p1.concepts[1] || 'Tecnología', 'Autonomía de Aprendizaje', 'Evaluación Formativa'],
      possibleContextPopulation: `Estudiantes de la Licenciatura en Informática, Universidad de Córdoba`,
      possibleContribution: `Aportar datos empíricos y adaptaciones metodológicas que den respuesta a una de las preguntas abiertas documentadas en la memoria del proyecto ${p1.code}.`,
      nextSteps: [
        `Revisión exhaustiva del informe técnico y repositorios del proyecto ${p1.code}.`,
        `Reunión de empalme con el investigador tutor responsable (${p1.leadResearcher || 'LabSIE'}).`,
        `Delimitación del alcance metodológico específico para el trabajo de grado o estancia semillero.`
      ],
      statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
    };
  }

  if (routeType === 'CONECTAR') {
    const conceptA = p1.concepts[0] || 'Inteligencia Artificial';
    const conceptB = p2 ? (p2.concepts[0] || 'Evaluación Pedagógica') : 'Knowledge Tracing';
    return {
      tentativeTitle: `Articulación de ${conceptA} y ${conceptB}: un marco integrado para la mediación didáctica en informática`,
      tentativeQuestion: `¿Cómo articular los modelos de ${conceptA} desarrollados en ${p1.code} con los principios de ${conceptB} de ${p2?.code || 'otra investigación LabSIE'} para generar una experiencia de aprendizaje personalizada en la Universidad de Córdoba?`,
      tentativeObjective: `Diseñar y evaluar una propuesta conceptual y metodológica que integre ${conceptA} y ${conceptB} en entornos de enseñanza de la programación.`,
      centralConcepts: [conceptA, conceptB, 'Integración Didáctica', 'Sistemas Inteligentes Adaptativos'],
      possibleContextPopulation: `${context}`,
      possibleContribution: `Crear un puente interdisciplinar dentro del semillero que conecte la analítica predictiva con la interacción pedagógica en tiempo real.`,
      nextSteps: [
        `Lectura cruzada de los marcos metodológicos de ambos proyectos (${p1.code} y ${p2?.code || 'P02'}).`,
        `Diseño del diagrama conceptual de integración bajo asesoría del equipo docente EduTLAN.`,
        `Formulación del anteproyecto de investigación conjunto.`
      ],
      statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
    };
  }

  if (routeType === 'TRASCENDER') {
    const focusIdea = isIdeaPresent ? idea.slice(0, 60) : 'nuevas mediaciones pedagógicas situadas';
    return {
      tentativeTitle: `Nuevos horizontes en ${p1.lineName}: ${focusIdea.replace(/[.,]/g, '')} en el contexto de la Licenciatura en Informática`,
      tentativeQuestion: `¿De qué manera los fundamentos investigativos de ${p1.lineName} pueden extenderse para dar respuesta a la problemática de: ${isIdeaPresent ? idea : 'las nuevas demandas del contexto educativo regional'}?`,
      tentativeObjective: `Formular y pilotear un enfoque investigativo emergente que aproveche la base metodológica de LabSIE para indagar sobre ${focusIdea}.`,
      centralConcepts: [p1.concepts[0] || 'Innovación Educativa', 'Contexto Situado', 'Nuevas Mediaciones', 'Apropiación Social'],
      possibleContextPopulation: `Estudiantes y comunidades educativas vinculadas a la Licenciatura en Informática (Universidad de Córdoba)`,
      possibleContribution: `Abrir una nueva vertiente investigativa dentro del grupo EduTLAN que vincule el rigor técnico con problemáticas emergentes de alta pertinencia social.`,
      nextSteps: [
        `Presentación de la idea en seminario interno de semilleristas de LabSIE.`,
        `Revisión del estado del arte en bases de datos indexadas (Scopus, WoS, SciELO).`,
        `Estructuración del problema de investigación con el comité de línea.`
      ],
      statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
    };
  }

  // EXPLORAR
  return {
    tentativeTitle: `Exploración y delimitación temática: articulación de intereses iniciales con las líneas de investigación de la Licenciatura en Informática`,
    tentativeQuestion: `¿Cuáles son las conexiones viables entre los intereses formativos del estudiante y los ejes epistemológicos del grupo de investigación EduTLAN?`,
    tentativeObjective: `Realizar un ejercicio de exploración documental y diálogo académico para delimitar un problema investigativo con pertinencia y viabilidad institucional.`,
    centralConcepts: ['Formación Investigativa', 'Exploración Vocacional Científica', 'Didáctica de la Informática'],
    possibleContextPopulation: `Estudiante en etapa de exploración investigativa (${profile.program}, Semestre ${profile.semester})`,
    possibleContribution: `Clarificar la vocación investigativa y definir si se perfila hacia una investigación formativa o un trabajo de grado interdisciplinar.`,
    nextSteps: [
      `Agendar entrevista de orientación con el coordinador de semillero LabSIE.`,
      `Participar como asistente en dos sesiones ordinarias del semillero para conocer los proyectos en curso.`,
      `Realizar una reevaluación o reformulación de la idea investigativa tras conocer el banco de problemas.`
    ],
    statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
  };
}

function generateThreePerspectives(
  answers: TestAnswers,
  projects: ResearchProject[],
  lines: ResearchLine[],
  defaultRouteType: RouteType,
  baseScore: number,
  allAffinities: {
    project: ResearchProject;
    totalAffinity: number;
    connectionReason: string;
    matchingConcepts: string[];
  }[],
  primaryProject: ResearchProject,
  secondProject: ResearchProject | undefined,
  defaultProposal: ProposedProject,
  profile: any
): AnalysisPerspective[] {
  const idea = answers.problemToInvestigate || answers.dreamResearch || answers.sixMonthsDiscovery || '';

  // Helpers to score projects for a specific perspective
  const techTerms = ['ia', 'tutor', 'inteligente', 'tracing', 'algoritmo', 'gemelo', 'markov', 'datos', 'carina', 'software', 'sistema', 'computacional', 'llm', 'modelo', 'predictiv', 'adaptativ'];
  const pedTerms = ['didáctica', 'pensamiento computacional', 'secuencia', 'aula', 'aprendizaje', 'competencias', 'formación', 'evaluación', 'andamiaje', 'gamificación', 'docente', 'pedagógic', 'escolar'];
  const socTerms = ['rural', 'brecha digital', 'ética', 'sesgos', 'inclusión', 'accesibilidad', 'intercultural', 'comunidad', 'coil', 'redes', 'apropiación', 'social', 'territorio', 'diversidad'];

  const scoreForTerms = (p: ResearchProject, terms: string[]) => {
    let s = 0;
    const txt = (p.title + ' ' + p.concepts.join(' ') + ' ' + p.keywords.join(' ') + ' ' + (p.problem || '')).toLowerCase();
    terms.forEach(t => {
      if (txt.includes(t)) s += 2;
    });
    return s;
  };

  // 1. PERSPECTIVA TECNOLÓGICA Y PROTOTIPADO CON IA
  const techSorted = [...allAffinities].sort((a, b) => {
    const aTech = scoreForTerms(a.project, techTerms) * 2 + a.totalAffinity;
    const bTech = scoreForTerms(b.project, techTerms) * 2 + b.totalAffinity;
    return bTech - aTech;
  });
  const techProjects = techSorted.slice(0, 3).map(pa => ({
    projectId: pa.project.id,
    projectTitle: pa.project.title,
    projectCode: pa.project.code,
    affinity: Math.min(99, Math.round(pa.totalAffinity * 0.95 + 4)),
    connectionReason: `Énfasis computacional: vinculación técnica con la arquitectura de ${pa.project.code} y desarrollo de módulos inteligentes interactivos.`,
    matchingConcepts: pa.project.concepts.slice(0, 3)
  }));
  const techP1 = techSorted[0]?.project || primaryProject;
  const techScore = Math.min(98, Math.max(50, Math.round(baseScore * 0.96 + (answers.aiInterests.length > 2 ? 6 : 2))));

  const techPerspective: AnalysisPerspective = {
    id: 'tecnologico',
    title: 'Enfoque Tecnológico y Prototipado con IA',
    badge: '💻 Sistemas Inteligentes & Software Educativo',
    icon: '💻',
    shortDescription: 'Orientado al desarrollo de software educativo, algoritmos de IA (LLMs, agentes pedagógicos), analítica de datos y prototipado interactivo.',
    focusArea: 'Ingeniería de Software Educativo, Inteligencia Artificial y Analítica de Aprendizaje',
    archetype: 'El Arquitecto de Sistemas Inteligentes y Prototipos Educativos',
    routeType: defaultRouteType === 'EXPLORAR' ? 'HEREDAR' : defaultRouteType,
    correspondenceScore: techScore,
    correspondenceLevel: techScore >= 80 ? 'Alta correspondencia' : 'Buena correspondencia',
    primaryLineId: techP1.lineId,
    primaryLineName: techP1.lineName,
    methodologyFocus: {
      type: 'Design-Based Research (DBR) & Prototipado Ágil de Software',
      icon: '⚡',
      description: 'Metodología iterativa que combina el diseño de software educativo, ingeniería de prompts o modelos de IA, pruebas con usuarios en laboratorio y validación de interfaces interactivas.'
    },
    whyExplanation: [
      `Desde la perspectiva del desarrollo técnico en la Licenciatura en Informática, tus respuestas muestran una vocación natural por la construcción de artefactos digitales, programación y aplicaciones inteligentes.`,
      `Este punto de vista prioriza la creación o enriquecimiento de arquitecturas como ${techP1.title} (${techP1.code}), aprovechando librerías modernas, integración de APIs de Inteligencia Artificial y bases de datos relacionales en la nube.`,
      `Te permite consolidar un perfil de egresado con competencias sólidas en ingeniería de software educativo, desarrollo web interactivo y analítica predictiva de datos escolares.`
    ],
    keyStrengths: [
      'Habilidades e interés en código, algoritmos y diseño de sistemas',
      'Curiosidad por el funcionamiento interno de modelos LLM y agentes pedagógicos',
      'Capacidad para prototipar herramientas funcionales que resuelvan problemas de aula'
    ],
    relatedProjects: techProjects,
    proposedProject: {
      tentativeTitle: `Desarrollo e integración de un entorno interactivo con IA asistiva basado en ${techP1.code} para la Licenciatura en Informática`,
      tentativeQuestion: `¿Cómo diseñar e implementar una arquitectura de software inteligente que optimice la retroalimentación automática y la experiencia interactiva de aprendizaje en cursos de informática?`,
      tentativeObjective: `Desarrollar y evaluar un prototipo funcional de software educativo asistido por IA, integrando módulos de analítica y personalización en tiempo real para la Universidad de Córdoba.`,
      centralConcepts: ['Software Educativo', 'Inteligencia Artificial', 'Arquitectura de Sistemas', 'Prototipado Interactivo'],
      possibleContextPopulation: `Estudiantes de informática y programación de la Universidad de Córdoba`,
      possibleContribution: `Aportar una herramienta digital funcional, código abierto o módulo de software que potencie las plataformas investigativas activas del LabSIE.`,
      nextSteps: [
        `Revisión de especificaciones técnicas y repositorios de código de ${techP1.code}.`,
        `Definición de stack tecnológico (Frontend, API de IA, persistencia de datos).`,
        `Construcción del diagrama de arquitectura y primer sprint de prototipado.`
      ],
      statusLabel: 'ENFOQUE TECNOLÓGICO · PROPUESTA PRELIMINAR'
    }
  };

  // 2. PERSPECTIVA PEDAGÓGICA Y DIDÁCTICA DE LA INFORMÁTICA
  const pedSorted = [...allAffinities].sort((a, b) => {
    const aPed = scoreForTerms(a.project, pedTerms) * 2 + a.totalAffinity;
    const bPed = scoreForTerms(b.project, pedTerms) * 2 + b.totalAffinity;
    return bPed - aPed;
  });
  const pedProjects = pedSorted.slice(0, 3).map(pa => ({
    projectId: pa.project.id,
    projectTitle: pa.project.title,
    projectCode: pa.project.code,
    affinity: Math.min(99, Math.round(pa.totalAffinity * 0.94 + 3)),
    connectionReason: `Énfasis didáctico: transposición curricular y mediación formativa de ${pa.project.code} en ambientes de aprendizaje escolar.`,
    matchingConcepts: pa.project.concepts.slice(0, 3)
  }));
  const pedP1 = pedSorted[0]?.project || primaryProject;
  const pedScore = Math.min(97, Math.max(50, Math.round(baseScore * 0.95 + (answers.preferredActivities.some(a => a.includes('diseñar') || a.includes('actividades')) ? 5 : 2))));

  const pedPerspective: AnalysisPerspective = {
    id: 'pedagogico',
    title: 'Enfoque Pedagógico y Didáctica de la Informática',
    badge: '🎓 Didáctica, Aula & Aprendizaje',
    icon: '🎓',
    shortDescription: 'Orientado a la mediación docente, desarrollo del pensamiento computacional en colegios, secuencias didácticas situadas y evaluación auténtica formativa.',
    focusArea: 'Didáctica de las Ciencias de la Computación, Evaluación Formativa y Mediación Pedagógica',
    archetype: 'El Diseñador Pedagógico e Investigador en Didáctica Escolar',
    routeType: defaultRouteType === 'EXPLORAR' ? 'HEREDAR' : (defaultRouteType === 'TRASCENDER' ? 'CONECTAR' : defaultRouteType),
    correspondenceScore: pedScore,
    correspondenceLevel: pedScore >= 80 ? 'Alta correspondencia' : 'Buena correspondencia',
    primaryLineId: pedP1.lineId,
    primaryLineName: pedP1.lineName,
    methodologyFocus: {
      type: 'Investigación-Acción Pedagógica (IAPed) & Enfoques Mixtos Cuasi-experimentales',
      icon: '📖',
      description: 'Diagnóstico de necesidades en el aula de informática escolar, diseño de secuencias formativas guiadas, intervención situada con estudiantes y evaluación del progreso cognitivo.'
    },
    whyExplanation: [
      `Desde la esencia formadora de la Licenciatura en Informática, este punto de vista privilegia cómo los estudiantes aprenden y cómo el futuro docente media el conocimiento tecnológico.`,
      `El foco de tus resultados se concentra en el impacto pedagógico directo: cómo proyectos como ${pedP1.title} (${pedP1.code}) transforman la comprensión conceptual, la motivación y la autorregulación del escolar.`,
      `Este enfoque es ideal para trabajos de grado orientados a la práctica docente, diseño curricular para la educación básica y media, y publicaciones en revistas de pedagogía de la computación.`
    ],
    keyStrengths: [
      'Sensibilidad pedagógica hacia las dificultades de aprendizaje de los estudiantes',
      'Habilidad para diseñar secuencias didácticas, rúbricas formativas y andamiajes metacognitivos',
      'Articulación entre contenidos de informática y habilidades del siglo XXI (pensamiento crítico y resolución de problemas)'
    ],
    relatedProjects: pedProjects,
    proposedProject: {
      tentativeTitle: `Diseño y validación de una secuencia didáctica mediada por tecnologías educativas para el fortalecimiento del pensamiento computacional`,
      tentativeQuestion: `¿De qué manera una propuesta didáctica estructurada a partir de los hallazgos de ${pedP1.code} favorece el desarrollo del pensamiento computacional y la comprensión algorítmica en estudiantes escolares de Córdoba?`,
      tentativeObjective: `Diseñar, implementar y evaluar una secuencia didáctica situada, fundamentada en mediaciones digitales activas, que potencie las competencias informáticas en la educación básica o media.`,
      centralConcepts: ['Pensamiento Computacional', 'Didáctica de la Informática', 'Secuencias de Aprendizaje', 'Evaluación Formativa'],
      possibleContextPopulation: `Estudiantes y docentes de instituciones educativas de básica y media de Córdoba`,
      possibleContribution: `Aportar guías docentes, unidades didácticas validadas empíricamente e instrumentos de evaluación pedagógica con rigor metodológico para el magisterio.`,
      nextSteps: [
        `Revisión del marco didáctico y resultados de aprendizaje del proyecto ${pedP1.code}.`,
        `Diseño de las matrices de competencias y actividades de mediación en el aula.`,
        `Validación de la secuencia con expertos docentes del área de didáctica de EduTLAN.`
      ],
      statusLabel: 'ENFOQUE PEDAGÓGICO · PROPUESTA PRELIMINAR'
    }
  };

  // 3. PERSPECTIVA DE INNOVACIÓN, GESTIÓN Y APROPIACIÓN SOCIAL
  const socSorted = [...allAffinities].sort((a, b) => {
    const aSoc = scoreForTerms(a.project, socTerms) * 2 + a.totalAffinity;
    const bSoc = scoreForTerms(b.project, socTerms) * 2 + b.totalAffinity;
    return bSoc - aSoc;
  });
  const socProjects = socSorted.slice(0, 3).map(pa => ({
    projectId: pa.project.id,
    projectTitle: pa.project.title,
    projectCode: pa.project.code,
    affinity: Math.min(99, Math.round(pa.totalAffinity * 0.93 + 4)),
    connectionReason: `Énfasis social y regional: apropiación comunitaria, superación de brechas digitales y consideraciones éticas derivadas de ${pa.project.code}.`,
    matchingConcepts: pa.project.concepts.slice(0, 3)
  }));
  const socP1 = socSorted[0]?.project || primaryProject;
  const socScore = Math.min(96, Math.max(48, Math.round(baseScore * 0.93 + (answers.scenarioCulturalChallenge ? 6 : 2))));

  const socPerspective: AnalysisPerspective = {
    id: 'social',
    title: 'Enfoque de Innovación, Gestión y Apropiación Social',
    badge: '🌐 Impacto Social & Ética Tecnológica',
    icon: '🌐',
    shortDescription: 'Orientado a la mitigación de la brecha digital en el Caribe colombiano, ética y uso crítico de la IA, inclusión en zonas rurales y redes de divulgación investigativa.',
    focusArea: 'Apropiación Social de la Tecnología, Inclusión Digital Regional y Ética Computacional',
    archetype: 'El Gestor de Innovación e Impacto Comunitario y Social',
    routeType: defaultRouteType === 'HEREDAR' ? 'CONECTAR' : 'TRASCENDER',
    correspondenceScore: socScore,
    correspondenceLevel: socScore >= 80 ? 'Alta correspondencia' : 'Buena correspondencia',
    primaryLineId: socP1.lineId,
    primaryLineName: socP1.lineName,
    methodologyFocus: {
      type: 'Investigación Acción Participativa (IAP) & Estudio de Casos Territoriales',
      icon: '🤝',
      description: 'Trabajo colaborativo directo con comunidades educativas rurales, análisis contextualizado de barreras de acceso, diálogo de saberes y cocreación de soluciones tecnológicas sostenibles.'
    },
    whyExplanation: [
      `Desde la responsabilidad social de la universidad pública, este punto de vista examina la informática como palanca de equidad, transformación regional y democratización del saber en Córdoba.`,
      `Tus respuestas conectan con la necesidad de llevar la ciencia y la tecnología más allá del laboratorio universitario: atender contextos rurales, comunidades vulnerables y debatir la ética de las tecnologías emergentes.`,
      `Este enfoque abre puertas para formulación de proyectos financiados por MinCiencias, redes internacionales de investigación (COIL) y proyectos de extensión universitaria con alto reconocimiento social.`
    ],
    keyStrengths: [
      'Compromiso y sensibilidad con las realidades territoriales y socioeducativas de la región',
      'Capacidad crítica para reflexionar sobre los dilemas éticos, privacidad y equidad en el uso de IA',
      'Liderazgo para articular comunidades, instituciones educativas y semilleros de investigación'
    ],
    relatedProjects: socProjects,
    proposedProject: {
      tentativeTitle: `Estrategia de apropiación social de tecnologías educativas y pensamiento computacional en contextos educativos de la región Caribe`,
      tentativeQuestion: `¿Qué modelo de apropiación social tecnológica y mediación comunitaria permite mitigar las brechas digitales y fomentar el uso crítico de la tecnología en instituciones de Córdoba?`,
      tentativeObjective: `Formular y sistematizar una estrategia participativa de apropiación tecnológica que promueva el acceso equitativo, la ética digital y la integración comunitaria en la educación en informática.`,
      centralConcepts: ['Apropiación Social', 'Brecha Digital', 'Ética de la Tecnología', 'Inclusión Educativa'],
      possibleContextPopulation: `Comunidades escolares de zonas rurales y periurbanas del departamento de Córdoba`,
      possibleContribution: `Generar un modelo replicable de apropiación tecnológica con indicadores de impacto social para el grupo EduTLAN y la política educativa regional.`,
      nextSteps: [
        `Cartografía social de necesidades tecnológicas en la institución educativa aliada.`,
        `Articulación con los directivos docentes y líderes comunitarios del territorio.`,
        `Talleres de codiseño participativo para la apropiación crítica de la informática.`
      ],
      statusLabel: 'ENFOQUE SOCIAL · PROPUESTA PRELIMINAR'
    }
  };

  return [techPerspective, pedPerspective, socPerspective];
}

function generateThreeProjectOptions(
  answers: TestAnswers,
  p1: ResearchProject,
  p2: ResearchProject | undefined,
  routeType: RouteType,
  profile: any
): ProposedProjectOption[] {
  const idea = answers.problemToInvestigate || answers.dreamResearch || answers.sixMonthsDiscovery || '';
  const focusTopic = idea.trim().length > 10 ? idea.trim().replace(/[.,]/g, '') : (p1.concepts[0] || 'la informática educativa');

  const isMetacognitive =
    p1.lineId === 'line-artificial-metacognition' ||
    (p2 && p2.lineId === 'line-artificial-metacognition') ||
    idea.toLowerCase().includes('metacogn') ||
    idea.toLowerCase().includes('autorregula') ||
    idea.toLowerCase().includes('introspecci');

  // Option 1: Tecnológica & IA / Artificial Metacognition
  const opt1: ProposedProjectOption = {
    id: 'opcion-1',
    optionNumber: 1,
    badge: isMetacognitive ? 'Opción 1 · Artificial Metacognition & IA' : 'Opción 1 · Innovación Tecnológica & IA',
    icon: isMetacognitive ? '🧠' : '🤖',
    category: isMetacognitive ? 'Artificial Metacognition' : 'Tecnológico & IA',
    tentativeTitle: isMetacognitive
      ? `Agente pedagógico con Metacognición Artificial endógena: Interacción auditable entre Object Level y Meta Level mediante protocolo CPCC para ${focusTopic}`
      : `Diseño e implementación de un sistema tutor interactivo asistido por IA generativa para ${focusTopic}`,
    tentativeQuestion: isMetacognitive
      ? `¿Cómo garantiza una arquitectura bioinspirada Cortico-Claustrum y el protocolo CPCC un control metacognitivo explicable y auditable entre el Object Level y el Meta Level en agentes para ${focusTopic}?`
      : `¿De qué manera una arquitectura de software con agentes inteligentes y retroalimentación adaptativa en tiempo real optimiza el aprendizaje de ${focusTopic} en estudiantes de la Universidad de Córdoba?`,
    tentativeObjective: isMetacognitive
      ? `Diseñar y evaluar un agente con metacognición endógena que monitoree, evalúe y autorregule su razonamiento didáctico integrando los pilares de Artificial Metacognition (CPCC, Meta-DNA y DMA) en ${focusTopic}.`
      : `Desarrollar y evaluar un entorno de software asistido por Inteligencia Artificial y analítica de datos que potencie la autonomía y resolución de problemas en ${focusTopic}.`,
    centralConcepts: isMetacognitive
      ? ['Artificial Metacognition', 'Object Level vs Meta Level', 'Protocolo CPCC', 'Cortico-Claustrum', 'Explainable Control', 'Meta-DNA']
      : ['Inteligencia Artificial Educativa', 'Arquitectura de Software', 'Tutoría Inteligente Adaptativa', 'Analítica de Aprendizaje'],
    possibleContextPopulation: `Estudiantes de cursos de programación y tecnología de la Licenciatura en Informática (Universidad de Córdoba)`,
    methodology: {
      name: isMetacognitive
        ? 'Arquitecturas Cognitivas Endógenas, Protocolo CPCC & Benchmarking CARINA MIRROR'
        : 'Design-Based Research (DBR) & Prototipado Ágil de Software',
      description: isMetacognitive
        ? 'Modelado formal del flujo Object/Meta Level, simulación de control explicable claustro-cortical y pruebas conductuales con el benchmark CARINA MIRROR.'
        : 'Metodología iterativa que articula requerimientos funcionales, arquitectura de componentes, pruebas de usabilidad y refinamiento algorítmico.'
    },
    whyThisOption: isMetacognitive
      ? `Surge de tu interés en agentes autónomos capaces de monitorear y regular su propio razonamiento, vinculándote a la línea de vanguardia Artificial Metacognition de LabSIE.`
      : `Surge de tu marcada afinidad por la programación, modelado computacional y la curiosidad expresada hacia sistemas inteligentes y asistentes de IA.`,
    possibleContribution: isMetacognitive
      ? `Aportar un framework auditable de metacognición artificial endógena (Object Level/Meta Level) validado con la ontología IM-Onto para la educación en informática.`
      : `Proporcionar un prototipo funcional de software y framework de prompts/agentes de código abierto validado empíricamente en el semillero LabSIE.`,
    nextSteps: isMetacognitive
      ? [
          `Revisión del benchmark CARINA MIRROR (LABSIE-P20) y especificación de protocolo CPCC.`,
          `Implementación del bucle de introspección entre Object Level y Meta Level.`,
          `Pruebas experimentales de calibración y detección de alucinaciones en el laboratorio de LabSIE.`
        ]
      : [
          `Definición de requerimientos técnicos y stack de desarrollo (React, APIs de IA, bases de datos).`,
          `Construcción del prototipo funcional y módulo de analítica.`,
          `Pruebas de interacción y usabilidad en laboratorios con estudiantes de informática.`
        ],
    isHighlighted: true
  };

  // Option 2: Didáctico & Aula
  const opt2: ProposedProjectOption = {
    id: 'opcion-2',
    optionNumber: 2,
    badge: 'Opción 2 · Innovación Didáctica & Aula',
    icon: '📖',
    category: 'Didáctico & Aula',
    tentativeTitle: `Secuencia didáctica mediada por pensamiento computacional para la transposición didáctica de ${focusTopic}`,
    tentativeQuestion: `¿Cómo influye una propuesta de intervención didáctica estructurada y gamificada en el desarrollo de habilidades de pensamiento computacional asociadas a ${focusTopic} en colegios de Córdoba?`,
    tentativeObjective: `Diseñar, implementar y evaluar una secuencia didáctica situada que favorezca la comprensión conceptual, la metacognición y la resolución colaborativa de problemas en el aula escolar.`,
    centralConcepts: ['Pensamiento Computacional', 'Didáctica de la Informática', 'Secuencia de Aprendizaje', 'Evaluación Auténtica'],
    possibleContextPopulation: `Estudiantes y docentes de instituciones educativas de básica y media de Córdoba`,
    methodology: {
      name: 'Investigación-Acción Pedagógica (IAPed) & Métodos Mixtos',
      description: 'Fases de diagnóstico curricular en el aula, planeación de unidades didácticas, intervención pedagógica y medición cuasi-experimental del logro de competencias.'
    },
    whyThisOption: `Surge de tu interés en la práctica docente, la mediación en el aula y cómo los estudiantes superan obstáculos conceptuales reales.`,
    possibleContribution: `Aportar unidades didácticas con rigor pedagógico, rúbricas formativas e instrumentos validados para el magisterio de informática.`,
    nextSteps: [
      `Revisión del currículo escolar y mapeo de dificultades de aprendizaje en la institución aliada.`,
      `Diseño de actividades de mediación (desenchufadas y conectadas) con rúbricas formativas.`,
      `Validación de la secuencia con el equipo de didáctica del Grupo EduTLAN.`
    ]
  };

  // Option 3: Social & Comunitario
  const opt3: ProposedProjectOption = {
    id: 'opcion-3',
    optionNumber: 3,
    badge: 'Opción 3 · Apropiación Social & Impacto Regional',
    icon: '🌐',
    category: 'Social & Comunitario',
    tentativeTitle: `Estrategia de apropiación social tecnológica y mitigación de brechas digitales en contextos educativos rurales de Córdoba`,
    tentativeQuestion: `¿Qué modelo pedagógico y comunitario permite integrar tecnologías educativas abiertas y pensamiento computacional en instituciones con baja conectividad en el departamento de Córdoba?`,
    tentativeObjective: `Diseñar y validar un modelo participativo de apropiación social de la informática que promueva la inclusión digital, el uso crítico y la pertinencia territorial en comunidades rurales.`,
    centralConcepts: ['Apropiación Social del Conocimiento', 'Brecha Digital Rural', 'Tecnologías Educativas Abiertas', 'Ética e Inclusión'],
    possibleContextPopulation: `Comunidades educativas rurales y periurbanas del departamento de Córdoba`,
    methodology: {
      name: 'Investigación Acción Participativa (IAP) & Estudio de Casos Territoriales',
      description: 'Inmersión dialógica con la comunidad escolar, codiseño de soluciones contextualizadas y evaluación del impacto socioeducativo y comunitario.'
    },
    whyThisOption: `Surge de tu sensibilidad hacia las necesidades del entorno territorial, la equidad educativa y el compromiso social de la Universidad de Córdoba.`,
    possibleContribution: `Generar una guía metodológica y modelo replicable de extensión e investigación formativa para MinCiencias y la política educativa del Caribe.`,
    nextSteps: [
      `Diagnóstico participativo de infraestructura y necesidades en comunidad educativa rural.`,
      `Codiseño de talleres y recursos tecnológicos offline (Micro:bit, software libre).`,
      `Sistematización de la experiencia y formulación del informe de impacto territorial.`
    ]
  };

  return [opt1, opt2, opt3];
}
