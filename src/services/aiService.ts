import { AnalysisResult, TestAnswers, ResearchProject } from '../types';
import { askQwen } from './apiClient';

/**
 * QwenResearchAnalysisService
 * Servicio de Inteligencia Artificial impulsado por Qwen (Alibaba Cloud Model Studio, vía servidor)
 * Especializado en el análisis y caracterización de nuevos aspirantes al Semillero LabSIE (Grupo EduTLAN),
 * contrastando sus gustos, habilidades de programación y vocación internacional contra el patrimonio
 * de los 28 proyectos de investigación.
 */
class QwenResearchAnalysisService {
  /**
   * Genera el reporte del aspirante contrastándolo con los proyectos de LabSIE usando Qwen (vía /api/qwen).
   * Si Qwen no está configurado en el servidor o falla, usa el reporte local con el mismo formato.
   */
  public async augmentAnalysisWithAI(
    baseResult: AnalysisResult,
    projects: ResearchProject[]
  ): Promise<AnalysisResult> {
    const answers = baseResult.studentAnswers;
    const profile = baseResult.studentProfile;
    try {
      const qwenResult = await this.callQwenAPI(baseResult, projects, answers, profile);
      if (qwenResult) return qwenResult;
    } catch (err) {
      console.warn('Qwen no disponible, se usa el reporte local:', err);
    }
    return this.generateAutonomousQwenContrast(baseResult, projects, answers, profile);
  }

  /**
   * Llamada a Qwen a través de /api/qwen (la clave vive solo en el servidor).
   * Solo se envían respuestas del test y el primer nombre: nunca correo, teléfono ni token de consentimiento.
   */
  private async callQwenAPI(
    baseResult: AnalysisResult,
    projects: ResearchProject[],
    answers: TestAnswers,
    profile: any
  ): Promise<AnalysisResult | null> {
    const firstName = String(profile.name || '').trim().split(/\s+/)[0] || 'futuro semillerista';
    const list = (v?: string[]) => (v && v.length ? v.join(', ') : 'Sin respuesta');
    const text = (v?: string) => (v && v.trim() ? v.trim() : 'Sin respuesta');

    const catalogSummary = projects
      .map(p => `[${p.code}] "${p.title}" | Línea: ${p.lineName} | Metodología: ${p.methodology} | Conceptos: ${p.concepts.join(', ')} | Pregunta: ${p.question}`)
      .join('\n');

    const selectedByStudent = (answers.selectedLabSIEProjects || [])
      .map(id => projects.find(p => p.id === id || p.code === id))
      .filter((p): p is ResearchProject => Boolean(p))
      .map(p => `${p.code} — ${p.title}`);

    const engineMatches = baseResult.relatedProjects
      .slice(0, 5)
      .map(p => `${p.projectCode} — ${p.projectTitle} (afinidad ${p.affinity}%)`);

    const prompt = `
Eres la voz cálida del Semillero de Investigación LabSIE y del Grupo EduTLAN (Categoría A MinCiencias, Universidad de Córdoba).
Vas a escribirle a ${firstName}, estudiante de ${profile.program} (semestre ${profile.semester || 'no indicado'}), que acaba de responder el test de Ruta Investigativa.

TONO: cariñoso, cercano y alentador, pero con rigor investigativo. Háblale de "tú". Celebra su curiosidad, retoma lo que respondió con sus propias palabras y conviértelo en preguntas de investigación. Nada de frases genéricas ni lenguaje burocrático.

LO QUE RESPONDIÓ:
- Experiencia en investigación: ${text(profile.researchExperience)}
- Nivel tecnológico: ${text(profile.techExperience)} · Uso de IA: ${text(profile.aiExperience)}
- Lo que le apasiona: ${list(answers.personalPassions)}
- Preguntas que le dan curiosidad: ${list(answers.curiosityQuestions)}
- Primera acción ante un problema: ${text(answers.firstActionOnProblem)}
- Actividades de investigación preferidas: ${list(answers.preferredActivities)}
- Intereses en IA: ${list(answers.aiInterests)}
- Gusto por programar: ${text(answers.programmingInterestLevel)} · Tecnologías: ${list(answers.programmingLanguages)}
- Lo que quiere construir: ${text(answers.programmingExperienceSummary)}
- Interés en proyectos con otros países: ${text(answers.internationalProjectsInterest)} · Motivaciones: ${list(answers.internationalMotivations)}
- Rol que sueña en el semillero: ${text(answers.preferredRole)}
- Problema que quiere investigar: ${text(answers.problemToInvestigate || answers.studentResearchIdea)}
- Investigación soñada: ${text(answers.dreamResearch)}
- Qué quiere descubrir en 6 meses: ${text(answers.sixMonthsDiscovery)}
- Preferencia (heredar/conectar/crear): ${text(answers.continuationPreference)}
- Idea propia frente a los proyectos: ${text(answers.divergentProjectIdea)}
- Expectativas con LabSIE: ${list(answers.labsieExpectations)}
- Comentarios adicionales: ${text(answers.additionalInterests)}

PROYECTOS QUE MARCÓ EN EL TEST: ${selectedByStudent.length ? selectedByStudent.join('; ') : 'Ninguno'}
PROYECTOS MÁS AFINES SEGÚN EL MOTOR DE LABSIE: ${engineMatches.join('; ') || 'Sin cálculo'}
LÍNEA PRINCIPAL SUGERIDA: ${baseResult.primaryLineName} · Tipo de ruta: ${baseResult.routeType}

CATÁLOGO DE PROYECTOS DE LABSIE (usa SOLO estos códigos y títulos, no inventes otros):
${catalogSummary}

TAREA:
1. Contrasta sus respuestas con los proyectos del catálogo. Prioriza los que marcó y los del motor, pero corrige si ves una afinidad mejor.
2. Dile con claridad DÓNDE PUEDE ENTRAR: línea de investigación, rol inicial y forma de vincularse.
3. Propón entre 3 y 4 PROYECTOS QUE PUEDE HACER: qué tarea concreta haría en cada uno, conectada con lo que respondió.
4. Cierra SIEMPRE invitándole a buscar más información en edutlan.online.

Responde ÚNICAMENTE con JSON válido, sin markdown, con esta estructura:
{
  "warmLetter": ["Párrafo 1 cariñoso que retoma lo que respondió", "Párrafo 2 investigativo: qué preguntas se abren con sus intereses", "Párrafo 3 de proyección y ánimo"],
  "contrastingNarrative": "Síntesis de cómo su perfil se contrastó con los proyectos de LabSIE",
  "whereYouCanEnter": "Línea, rol inicial y cómo vincularse, en 2-3 frases",
  "projectsYouCanDo": [
    { "projectCode": "LABSIE-PXX", "projectTitle": "Título exacto del catálogo", "whatYouCanDo": "Tarea concreta que haría y por qué encaja con sus respuestas" }
  ],
  "topMatchingProjects": [
    { "projectCode": "LABSIE-PXX", "projectTitle": "Título exacto", "matchRationale": "Por qué encaja" }
  ],
  "refinedTitle": "Título tentativo de su investigación",
  "refinedQuestion": "¿Pregunta de investigación tentativa?",
  "refinedObjective": "Objetivo general que inicia con verbo en infinitivo",
  "contribution": "Aporte concreto a LabSIE y EduTLAN",
  "programmingAffinityNote": "Cómo aprovechará (o desarrollará) la programación en el semillero",
  "internationalDimensionNote": "Cómo se proyecta su interés por otros países (COIL, redes, publicaciones)",
  "newMemberIntegrationAdvice": "Sugerencia para el tutor que le acompañará",
  "nextSteps": ["Paso 1", "Paso 2", "Paso 3"],
  "closingNote": "Despedida cariñosa que termina invitando a visitar edutlan.online para más información"
}
`;

    const { model, content: rawContent } = await askQwen([
      {
        role: 'system',
        content:
          'Eres la mentora investigativa del Semillero LabSIE (Grupo EduTLAN, Universidad de Córdoba). Escribes en español de Colombia, con calidez y rigor. Solo citas proyectos que existen en el catálogo recibido. Respondes exclusivamente con JSON válido.'
      },
      { role: 'user', content: prompt }
    ]);
    if (!rawContent) return null;

    const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Solo se aceptan códigos que existen en el catálogo (evita proyectos inventados por el modelo)
    const validCodes = new Set(projects.map(p => p.code));
    const titleOf = (code: string, fallbackTitle: string) => projects.find(p => p.code === code)?.title || fallbackTitle;
    const projectsYouCanDo = Array.isArray(parsed.projectsYouCanDo)
      ? parsed.projectsYouCanDo
          .filter((p: any) => p && validCodes.has(p.projectCode))
          .map((p: any) => ({ projectCode: p.projectCode, projectTitle: titleOf(p.projectCode, p.projectTitle), whatYouCanDo: String(p.whatYouCanDo || '') }))
      : [];
    const topMatchingProjects = Array.isArray(parsed.topMatchingProjects)
      ? parsed.topMatchingProjects
          .filter((p: any) => p && validCodes.has(p.projectCode))
          .map((p: any) => ({ projectCode: p.projectCode, projectTitle: titleOf(p.projectCode, p.projectTitle), matchRationale: String(p.matchRationale || '') }))
      : [];

    const local = this.generateAutonomousQwenContrast(baseResult, projects, answers, profile).qwenAnalysis!;
    const closingNote =
      typeof parsed.closingNote === 'string' && parsed.closingNote.includes('edutlan.online')
        ? parsed.closingNote
        : `${parsed.closingNote || local.closingNote} Más información en edutlan.online.`;

    return {
      ...baseResult,
      algorithmVersion: `${baseResult.algorithmVersion}+qwen-augmented`,
      qwenAnalysis: {
        model: model || 'Qwen',
        analysisTimestamp: new Date().toISOString(),
        contrastingNarrative: parsed.contrastingNarrative || local.contrastingNarrative,
        topMatchingProjects: topMatchingProjects.length ? topMatchingProjects : local.topMatchingProjects,
        programmingAffinityNote: parsed.programmingAffinityNote || local.programmingAffinityNote,
        internationalDimensionNote: parsed.internationalDimensionNote || local.internationalDimensionNote,
        newMemberIntegrationAdvice: parsed.newMemberIntegrationAdvice || local.newMemberIntegrationAdvice,
        whereYouCanEnter: parsed.whereYouCanEnter || local.whereYouCanEnter,
        projectsYouCanDo: projectsYouCanDo.length ? projectsYouCanDo : local.projectsYouCanDo,
        warmLetter: Array.isArray(parsed.warmLetter) && parsed.warmLetter.length ? parsed.warmLetter : local.warmLetter,
        closingNote
      },
      proposedProject: {
        ...baseResult.proposedProject,
        tentativeTitle: parsed.refinedTitle || baseResult.proposedProject.tentativeTitle,
        tentativeQuestion: parsed.refinedQuestion || baseResult.proposedProject.tentativeQuestion,
        tentativeObjective: parsed.refinedObjective || baseResult.proposedProject.tentativeObjective,
        possibleContribution: parsed.contribution || baseResult.proposedProject.possibleContribution,
        nextSteps: Array.isArray(parsed.nextSteps) && parsed.nextSteps.length ? parsed.nextSteps : baseResult.proposedProject.nextSteps
      }
    };
  }

  /**
   * Reporte local (sin API key o si Qwen falla): mismo formato y tono que el de Qwen,
   * construido con las respuestas del aspirante y los proyectos afines del motor de LabSIE.
   */
  private generateAutonomousQwenContrast(
    baseResult: AnalysisResult,
    projects: ResearchProject[],
    answers: TestAnswers,
    profile: any
  ): AnalysisResult {
    const firstName = String(profile.name || '').trim().split(/\s+/)[0] || 'futuro semillerista';
    const passions = answers.personalPassions || [];
    const progLevel = answers.programmingInterestLevel || '';
    const progLangs = answers.programmingLanguages || [];
    const intlInterest = answers.internationalProjectsInterest || '';
    const intlMotivations = answers.internationalMotivations || [];
    const studentRole = answers.preferredRole || 'investigador/a en formación';
    const problem = (answers.problemToInvestigate || answers.studentResearchIdea || '').trim().replace(/\.$/, '');

    const related = baseResult.relatedProjects.slice(0, 4);
    const topMatches = related.slice(0, 3).map(p => {
      let rationale = `Afinidad del ${p.affinity}% con tus respuestas. `;
      if (progLangs.length > 0) rationale += `Tu gusto por ${progLangs.slice(0, 2).join(' y ')} suma en el desarrollo de este proyecto. `;
      if (intlMotivations.length > 0) rationale += 'Tiene potencial de proyección con redes internacionales.';
      return { projectCode: p.projectCode, projectTitle: p.projectTitle, matchRationale: rationale.trim() };
    });

    const projectsYouCanDo = related.map(p => {
      const full = projects.find(item => item.code === p.projectCode);
      const task = progLangs.length > 0
        ? `podrías apoyar el prototipo o el análisis de datos usando ${progLangs[0]}`
        : 'podrías apoyar el diseño de instrumentos, la revisión de literatura y la validación en aula';
      const guide = full?.question ? ` Su pregunta guía (${full.question}) dialoga con lo que te inquieta.` : '';
      return {
        projectCode: p.projectCode,
        projectTitle: p.projectTitle,
        whatYouCanDo: `En este proyecto ${task}.${guide}`
      };
    });

    const progNote = progLangs.length > 0 || /apasiona|gusta/i.test(progLevel)
      ? `Nos encanta que disfrutes programar (${progLangs.join(', ') || 'desarrollo de software'}): en LabSIE eso se convierte en prototipos tecno-pedagógicos, modelos de IA y herramientas de análisis.`
      : 'Si la programación aún no es lo tuyo, no pasa nada: tu mirada pedagógica es clave para diseñar tareas, instrumentos y validar en el aula. Y si te animas, aquí aprendemos a programar en equipo.';

    const intlNote = intlMotivations.length > 0 || /alta|interesad/i.test(intlInterest)
      ? `Tu interés por trabajar con otros países (${intlMotivations.join(', ') || 'colaboración internacional'}) encaja con las experiencias COIL y las redes académicas en las que participa EduTLAN.`
      : 'A medida que madure tu propuesta podrás sumarte a intercambios, ponencias y redes internacionales del grupo.';

    const whereYouCanEnter = `Puedes entrar por la línea "${baseResult.primaryLineName}", iniciando como ${studentRole}. El primer paso es unirte a las reuniones del semillero, acompañar uno de los proyectos afines y, con tu tutor, ir afinando tu propia pregunta.`;

    const passionText = passions.length
      ? `Nos contaste que te apasiona ${passions.slice(0, 3).join(', ')}`
      : 'Tus respuestas muestran ganas de entender cómo la tecnología transforma la educación';
    const problemText = problem ? ` y que te inquieta "${problem}"` : '';

    const warmLetter = [
      `${firstName}, gracias por abrirnos tu curiosidad. ${passionText}${problemText}. Eso ya es el comienzo de una investigación.`,
      `Al contrastar tus respuestas con los proyectos de LabSIE encontramos puentes muy concretos: ${related.slice(0, 3).map(p => p.projectCode).join(', ') || 'varias de nuestras líneas'} trabajan preguntas cercanas a las tuyas. Investigar no es empezar de cero: es saber desde dónde continuar, y tú ya tienes un punto de partida.`,
      'En los próximos meses puedes pasar de la curiosidad a la evidencia: formular tu pregunta, aprender métodos junto a tus compañeros y presentar tus primeros hallazgos. Aquí no vas a caminar sin compañía.'
    ];

    const advice = `Vincular a ${firstName} como ${studentRole}, conectando su interés por ${passions.slice(0, 2).join(' y ') || 'la informática educativa'} con el proyecto ${topMatches[0]?.projectCode || 'más afín'}.`;

    return {
      ...baseResult,
      algorithmVersion: `${baseResult.algorithmVersion}+labsie-local-report`,
      qwenAnalysis: {
        model: 'Motor local LabSIE (sin conexión a Qwen)',
        analysisTimestamp: new Date().toISOString(),
        contrastingNarrative: `Contrastamos tus respuestas con los ${projects.length} proyectos de LabSIE: tus intereses (${passions.join(', ') || 'tecnología educativa'}), tu relación con la programación${progLevel ? ` (${progLevel})` : ''} y tu interés internacional${intlInterest ? ` (${intlInterest})` : ''}.`,
        topMatchingProjects: topMatches,
        programmingAffinityNote: progNote,
        internationalDimensionNote: intlNote,
        newMemberIntegrationAdvice: advice,
        whereYouCanEnter,
        projectsYouCanDo,
        warmLetter,
        closingNote: `Te esperamos con los brazos abiertos en el semillero, ${firstName}. Más información en edutlan.online.`
      }
    };
  }
}

export const researchAnalysisService = new QwenResearchAnalysisService();
export const qwenAnalysisService = researchAnalysisService;
