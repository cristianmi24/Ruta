import { ResearchLine, ResearchProject, AnalysisResult } from '../types';

export const INITIAL_RESEARCH_LINES: ResearchLine[] = [
  {
    id: 'line-diseno-sistemas-inteligentes',
    name: 'Diseño e implementación de sistemas inteligentes para la educación',
    description: 'Investigación orientada al diseño, modelado e implementación de sistemas inteligentes, agentes tutores y herramientas computacionales aplicadas a la educación, integrando inteligencia artificial con pedagogía.',
    keywords: ['Sistemas Inteligentes', 'Tutorías Adaptativas', 'IA Educativa', 'Arquitectura de Software', 'Pensamiento Crítico'],
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: 'line-entornos-virtuales-adaptativos',
    name: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Desarrollo de entornos y plataformas virtuales que se adaptan a las necesidades del estudiante, ambientes híbridos de aprendizaje y espacios colaborativos con anclaje cultural y metodológico.',
    keywords: ['Entornos Virtuales', 'Sistemas Adaptativos', 'Ambientes Híbridos', 'Aprendizaje Colaborativo', 'Gemelos Digitales'],
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: 'line-analisis-datos-educativos',
    name: 'Análisis de datos educativos para la mejora de la enseñanza',
    description: 'Modelado y análisis de datos educativos masivos y de interacción para detectar dificultades a tiempo, monitorear trayectorias de aprendizaje y brindar soporte fundamentado a la toma de decisiones docentes.',
    keywords: ['Análisis de Datos', 'Knowledge Tracing', 'Minería de Datos Educativos', 'Predicción Temprana', 'Mejora de la Enseñanza'],
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: 'line-ia-aprendizaje-personalizado',
    name: 'Aplicación de la inteligencia artificial en el aprendizaje personalizado',
    description: 'Aplicación e integración de modelos de inteligencia artificial y tecnologías generativas en la personalización del aprendizaje, retroalimentación inteligente inmediata y autorregulación del estudiante.',
    keywords: ['Inteligencia Artificial', 'Aprendizaje Personalizado', 'Retroalimentación Inteligente', 'IA Generativa', 'Tutorías Personalizadas'],
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: 'line-artificial-metacognition',
    name: 'Artificial Metacognition',
    description: 'Línea de investigación centrada en sistemas de metacognición endógena en IA. Define la capacidad de los agentes artificiales de monitorear, evaluar y regular autónomamente su razonamiento mediante una interacción estructurada y auditable entre el Object Level (ejecución) y el Meta Level (monitoreo y control). Integra y unifica CPCC, Meta-DNA, Dendritic Metacognition (DMA), MARINA-10, MetaLingua++, Cortico-Claustrum, Explainable Control e IM-Onto.',
    keywords: [
      'Artificial Metacognition',
      'Metacognición Endógena',
      'Object Level',
      'Meta Level',
      'CPCC',
      'Meta-DNA',
      'Dendritic Metacognition (DMA)',
      'MARINA-10',
      'MetaLingua++',
      'Cortico-Claustrum',
      'Explainable Control',
      'IM-Onto'
    ],
    status: 'active',
    createdAt: '2024-01-10'
  }
];

export const INITIAL_PROJECTS: ResearchProject[] = [
  {
    id: 'proj-01',
    code: 'LABSIE-P01',
    title: 'Estrategia didáctica mediante la gamificación en área de informática de instituciones de zonas rurales',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Investigación orientada a integrar mecánicas de juego en la enseñanza de la informática para superar brechas tecnológicas en contextos rurales.',
    problem: 'Desmotivación y barreras de aprendizaje en informática debido a la falta de conectividad y recursos tecnológicos en zonas rurales.',
    question: '¿Cómo fortalece una estrategia basada en la gamificación el aprendizaje de la informática en estudiantes de zonas rurales?',
    generalObjective: 'Diseñar e implementar una estrategia didáctica mediada por la gamificación para mejorar los procesos de enseñanza-aprendizaje en el área de informática en instituciones rurales.',
    context: 'Instituciones educativas rurales del departamento de Córdoba.',
    population: 'Estudiantes y docentes de educación básica/media en instituciones rurales del departamento de Córdoba.',
    concepts: ['Gamificación', 'Educación Rural', 'Didáctica de la Informática', 'Brecha Digital'],
    methodology: 'Investigación Acción Pedagógica (IAP) / Mixta. Enfoque cualitativo/mixto con diseño de Investigación Acción Pedagógica, enfocado en transformar la práctica de aula mediante dinámicas lúdicas.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo adaptar elementos de gamificación digital a entornos analógicos o de baja conectividad?',
      '¿Qué mecánicas de juego generan mayor retención de conocimientos informáticos a largo plazo?'
    ],
    continuityPossibilities: [
      'Diseñar recursos gamificados tangibles utilizando placas como BBC Micro:bit que no dependan de internet.',
      'Integrar bancos de actividades gamificadas offline dentro de planificadores docentes como InspirateC.'
    ],
    keywords: ['Gamificación', 'Educación Rural', 'Didáctica de la Informática', 'Brecha Digital', 'Micro:bit'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Mangones Rodríguez, D. & Banquez Humanez, S.'
  },
  {
    id: 'proj-02',
    code: 'LABSIE-P02',
    title: 'App móvil para el fortalecimiento de la identidad cultural',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Diseño e implementación de una aplicación móvil orientada al reconocimiento y preservación de la identidad cultural en estudiantes.',
    problem: 'Pérdida de arraigo y desconocimiento de la identidad cultural local por parte de las nuevas generaciones.',
    question: '¿De qué manera el uso de una app móvil incide en el fortalecimiento de la identidad cultural en los estudiantes?',
    generalObjective: 'Desarrollar una aplicación móvil como herramienta tecno-pedagógica para promover y fortalecer la identidad cultural en la I.E. Obdulio Mayo Scarpeta.',
    context: 'Institución Educativa Obdulio Mayo Scarpeta.',
    population: 'Estudiantes de la Institución Educativa Obdulio Mayo Scarpeta.',
    concepts: ['M-Learning', 'Identidad Cultural', 'Desarrollo de Software Educativo', 'Apropiación Tecnológica'],
    methodology: 'Desarrollo de Software / Investigación Basada en Diseño. Investigación tecnológica orientada al desarrollo, con fases de ingeniería de software aplicadas a un contexto educativo.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo garantizar la actualización constante del acervo cultural en la plataforma sin requerir altos costos de mantenimiento?',
      '¿Qué impacto tiene el M-learning en el sentido de pertenencia frente a metodologías tradicionales?'
    ],
    continuityPossibilities: [
      'Aplicar principios del Diseño Universal para el Aprendizaje (DUA) en la interfaz de aplicaciones móviles regionales.',
      'Generar avatares o contenido multimedia para la app mediante herramientas de Inteligencia Artificial.'
    ],
    keywords: ['M-Learning', 'Identidad Cultural', 'App Móvil', 'Software Educativo', 'DUA'],
    status: 'completed',
    year: '2023',
    leadResearcher: 'Perez Fajardo, R.'
  },
  {
    id: 'proj-03',
    code: 'LABSIE-P03',
    title: 'Análisis longitudinal de patrones de compromiso y rendimiento de estudiantes universitarios durante la pandemia de COVID-19 mediante cadenas de Markov',
    lineId: 'line-analisis-datos-educativos',
    lineName: 'Análisis de datos educativos para la mejora de la enseñanza',
    description: 'Aplicación de modelos probabilísticos (Cadenas de Markov) para analizar transiciones en el rendimiento y compromiso académico durante la crisis sanitaria.',
    problem: 'Incertidumbre sobre cómo la virtualidad forzada alteró los patrones de transición entre los estados de éxito, deserción o rezago académico.',
    question: '¿Cuáles fueron las probabilidades de transición en los patrones de compromiso y rendimiento de los estudiantes universitarios durante la pandemia modelados mediante cadenas de Markov?',
    generalObjective: 'Analizar longitudinalmente los cambios en el rendimiento y compromiso de estudiantes universitarios durante el COVID-19 utilizando modelado de Markov.',
    context: 'Universidad de Córdoba (cohorte de pandemia).',
    population: 'Estudiantes universitarios de la Universidad de Córdoba (cohorte de pandemia).',
    concepts: ['Minería de Datos Educativos', 'Cadenas de Markov', 'Rendimiento Académico', 'Análisis Longitudinal', 'COVID-19'],
    methodology: 'Cuantitativa Explicativa / Minería de Datos Educativos. Enfoque cuantitativo basado en la analítica de datos educacionales (Educational Data Mining), utilizando modelos estocásticos.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo se estabilizaron estas probabilidades de transición tras el retorno a la presencialidad?',
      '¿Se pueden integrar estos modelos probabilísticos en sistemas de alerta temprana en tiempo real?'
    ],
    continuityPossibilities: [
      'Escalar estos modelos matemáticos para optimizar las reglas de seguridad y bases de datos en plataformas backend como Firestore.',
      'Utilizar los patrones descubiertos para alimentar modelos de Machine Learning predictivo.'
    ],
    keywords: ['Minería de Datos', 'Cadenas de Markov', 'Rendimiento Académico', 'Análisis Longitudinal', 'COVID-19'],
    status: 'completed',
    year: '2024',
    leadResearcher: 'Marchena Madera, L. & Medrano Gómez, M.'
  },
  {
    id: 'proj-04',
    code: 'LABSIE-P04',
    title: 'Asistente inteligente para la generación de actividades STEAM alineadas a los hitos del desarrollo neurocognitivo',
    lineId: 'line-diseno-sistemas-inteligentes',
    lineName: 'Diseño e implementación de sistemas inteligentes para la educación',
    description: 'Creación de un asistente impulsado por IA que estructura actividades STEAM respetando las etapas cognitivas de los estudiantes de grado primero.',
    problem: 'Dificultad de los docentes de primaria para diseñar actividades STEAM que sean cognitivamente apropiadas para las etapas de desarrollo de niños de primer grado.',
    question: '¿Cómo diseñar un asistente inteligente que genere actividades STEAM adecuadamente alineadas con los hitos neurocognitivos de estudiantes de grado primero?',
    generalObjective: 'Desarrollar y evaluar un asistente inteligente orientado a la generación automática de actividades STEAM adaptadas al desarrollo neurocognitivo en educación inicial.',
    context: 'Docentes de grado primero y contexto de educación básica primaria.',
    population: 'Docentes de grado primero y contexto de educación básica primaria.',
    concepts: ['Inteligencia Artificial', 'Educación STEAM', 'Desarrollo Neurocognitivo', 'Asistentes Virtuales', 'Educación Inicial'],
    methodology: 'Investigación Basada en Diseño (DBR). Desarrollo iterativo de una herramienta de IA integrando principios de neurociencia y pedagogía STEAM.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿En qué medida la IA puede interpretar correctamente las barreras de aprendizaje individuales de un niño de 6 años?',
      '¿Cómo evitar los sesgos de generación en actividades de robótica para edades tempranas?'
    ],
    continuityPossibilities: [
      'Implementar el framework ROCA (Rol, Objetivo, Contexto, Acción) en la arquitectura interna del asistente para afinar la generación.',
      'Articular la salida del asistente con la programación en bloques y actividades de robótica básica.'
    ],
    keywords: ['IA Educativa', 'Educación STEAM', 'Desarrollo Neurocognitivo', 'Framework ROCA', 'Robótica Inicial'],
    status: 'active',
    year: '2025',
    leadResearcher: 'Bedoya Ortega, M. & Alegría Durango, D.'
  },
  {
    id: 'proj-05',
    code: 'LABSIE-P05',
    title: 'Cocreación de un microcurrículo para la incorporación de la Inteligencia Artificial en la educación básica secundaria',
    lineId: 'line-ia-aprendizaje-personalizado',
    lineName: 'Aplicación de la inteligencia artificial en el aprendizaje personalizado',
    description: 'Proceso colaborativo para diseñar una malla curricular que integre competencias en Inteligencia Artificial para escuelas públicas.',
    problem: 'Ausencia de lineamientos curriculares oficiales que integren la alfabetización en IA en el área de tecnología e informática en Montería.',
    question: '¿Cómo cocrear un microcurrículo pertinente y contextualizado para incorporar la IA en la educación básica secundaria de instituciones de Montería?',
    generalObjective: 'Cocrear un microcurrículo para el área de Tecnología e Informática que integre la enseñanza de la Inteligencia Artificial en instituciones públicas de Montería.',
    context: 'Instituciones públicas de Montería, Córdoba.',
    population: 'Docentes y estudiantes de educación media en zonas urbanas y rurales de Montería, Córdoba.',
    concepts: ['Diseño Curricular', 'Inteligencia Artificial', 'Educación Básica Secundaria', 'Cocreación Pedagógica'],
    methodology: 'Investigación Acción Pedagógica / Diseño Participativo. Enfoque cualitativo, bajo el paradigma de la Teoría Fundamentada (Grounded Theory) o Diseño Participativo con la comunidad académica.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cuáles son las diferencias de apropiación de este microcurrículo entre instituciones urbanas conectadas y rurales desconectadas?',
      '¿Qué competencias docentes previas son indispensables para ejecutar este currículo?'
    ],
    continuityPossibilities: [
      'Desplegar este microcurrículo a través de plataformas como InspirateC para facilitar la planeación a los docentes.',
      'Crear talleres prácticos para docentes basados en herramientas de IA generativa (ChatGPT, NotebookLM, Gemini) para ejecutar el microcurrículo.'
    ],
    keywords: ['Microcurrículo IA', 'Alfabetización IA', 'Cocreación', 'InspirateC', 'Secundaria'],
    status: 'active',
    year: '2026',
    leadResearcher: 'Martínez Luna, W. & Ramírez Vega, W.'
  },
  {
    id: 'proj-06',
    code: 'LABSIE-P06',
    title: 'Diseño de un modelo de actividades de aprendizaje para un sistema tutor inteligente enfocado en resolución de problemas',
    lineId: 'line-diseno-sistemas-inteligentes',
    lineName: 'Diseño e implementación de sistemas inteligentes para la educación',
    description: 'Estructuración pedagógica de tareas para un STI orientado a potenciar habilidades cognitivas superiores y competencias del siglo XXI.',
    problem: 'Los sistemas de tutoría tradicionales suelen enfocarse en la transmisión de conceptos y no en el desarrollo de competencias complejas como la resolución de problemas.',
    question: '¿Cómo diseñar un modelo de actividades para un STI que desarrolle efectivamente la competencia de resolución de problemas en estudiantes de media?',
    generalObjective: 'Diseñar e integrar un modelo de actividades de aprendizaje en un Sistema Tutor Inteligente para fortalecer la resolución de problemas del siglo XXI en educación media.',
    context: 'Estudiantes de educación media técnica / académica.',
    population: 'Estudiantes de educación media técnica / académica.',
    concepts: ['Sistemas Tutores Inteligentes (ITS)', 'Competencias del Siglo XXI', 'Resolución de Problemas', 'Diseño Instruccional'],
    methodology: 'Investigación Basada en Diseño (DBR). Centrada en la intersección entre ingeniería de software (ITS) y diseño instruccional pedagógico.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo evaluar cualitativamente el proceso de razonamiento del estudiante más allá de la respuesta final en el sistema?',
      '¿De qué manera la retroalimentación adaptativa reduce la carga cognitiva durante la resolución?'
    ],
    continuityPossibilities: [
      'Conectar este modelo de actividades con metodologías como el Aprendizaje Basado en Proyectos (ABP).',
      'Usar APIs de IA generativa para proveer retroalimentación en lenguaje natural dentro del tutor.'
    ],
    keywords: ['Sistema Tutor', 'Resolución de Problemas', 'Competencias Siglo XXI', 'Diseño Instruccional', 'ABP'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Diaz Arteaga, L.'
  },
  {
    id: 'proj-07',
    code: 'LABSIE-P07',
    title: 'Estrategia pedagógica con integración de recursos tecnológicos para el fortalecimiento de las habilidades de lectura y escritura',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Intervención pedagógica apoyada en TIC para superar déficits de comprensión lectora y producción textual.',
    problem: 'Bajos niveles de comprensión lectora y dificultades en la producción escrita en estudiantes de secundaria.',
    question: '¿Cómo el diseño y aplicación de una estrategia con recursos tecnológicos fortalece la lectoescritura en estudiantes de básica secundaria?',
    generalObjective: 'Fortalecer las habilidades de lectura y escritura en estudiantes de básica secundaria mediante una estrategia pedagógica mediada por tecnologías.',
    context: 'Educación básica secundaria.',
    population: 'Estudiantes de básica secundaria.',
    concepts: ['Lectoescritura', 'TIC en Educación', 'Estrategia Pedagógica', 'Educación Básica Secundaria'],
    methodology: 'Investigación Acción (IA). Enfoque cualitativo/mixto con diseño de Investigación Acción para la intervención directa en problemáticas de aula.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Qué tipo de recurso digital (interactivo, audiovisual, hipertextual) incide más directamente en la inferencia lectora?',
      '¿El uso de autocorrectores afecta el aprendizaje ortográfico a largo plazo?'
    ],
    continuityPossibilities: [
      'Adaptar los recursos de lectura bajo normativas DUA para garantizar la accesibilidad visual y cognitiva.',
      'Generar materiales de lectura interactivos utilizando IA para adaptar los niveles de complejidad (Lexile) del texto.'
    ],
    keywords: ['Lectoescritura', 'TIC en Educación', 'Estrategia Pedagógica', 'DUA', 'Comprensión Lectora'],
    status: 'completed',
    year: '2023',
    leadResearcher: 'Barriosnuevo Pérez, Y. & Fernández de la Rosa, J.'
  },
  {
    id: 'proj-08',
    code: 'LABSIE-P08',
    title: 'Evaluación del aprendizaje autorregulado en actividades de un sistema tutor utilizando inteligencia artificial',
    lineId: 'line-ia-aprendizaje-personalizado',
    lineName: 'Aplicación de la inteligencia artificial en el aprendizaje personalizado',
    description: 'Medición y análisis de cómo los estudiantes gestionan su propio proceso de aprendizaje al interactuar con un tutor virtual de IA.',
    problem: 'La dificultad de medir y trazar empíricamente las habilidades de auto-gestión del aprendizaje en entornos automatizados.',
    question: '¿Cómo la interacción con un sistema tutor basado en IA evidencia y afecta los procesos de aprendizaje autorregulado en los estudiantes?',
    generalObjective: 'Evaluar el nivel de aprendizaje autorregulado que desarrollan los estudiantes durante la ejecución de actividades mediadas por un Sistema Tutor Inteligente.',
    context: 'Entornos de educación asistida por tecnología (educación superior o media).',
    population: 'Estudiantes en entornos de educación asistida por tecnología.',
    concepts: ['Aprendizaje Autorregulado (SRL)', 'Sistemas Tutores Inteligentes', 'Inteligencia Artificial', 'Evaluación Educativa'],
    methodology: 'Cuantitativa / Analítica de Datos Educativos. Enfoque empírico-analítico basado en métricas de interacción usuario-sistema y cuestionarios psicométricos de autorregulación.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Qué métricas de comportamiento en el backend (tiempo de pausa, clics, reintentos) predicen mejor la autorregulación?',
      '¿El tutor inteligente genera dependencia o fomenta la autonomía real?'
    ],
    continuityPossibilities: [
      'Integrar la recolección de estos logs de interacción en el panel de analíticas de InspirateC.',
      'Diseñar prompts que obliguen al estudiante a reflexionar sobre su error antes de darle la respuesta.'
    ],
    keywords: ['Aprendizaje Autorregulado', 'SRL', 'Sistemas Tutores', 'InspirateC', 'Analítica de Logs'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Salgado Montiel, M. & BRUNO AGUIRRE, M.'
  },
  {
    id: 'proj-09',
    code: 'LABSIE-P09',
    title: 'Experiencias vividas de los docentes en formación con respecto a la implementación de los resultados de aprendizaje',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Análisis comprensivo desde la voz de los practicantes sobre la adopción del modelo por resultados de aprendizaje en la universidad.',
    problem: 'La tensión y los desafíos que experimentan los practicantes al transitar de un currículo tradicional a uno basado en resultados de aprendizaje (RA).',
    question: '¿Cuáles son las experiencias y percepciones de los docentes en formación frente a la implementación de los resultados de aprendizaje en el currículo de la Licenciatura?',
    generalObjective: 'Comprender las experiencias vividas por los docentes en formación de la Licenciatura en Informática en la adopción e implementación curricular de los resultados de aprendizaje.',
    context: 'Licenciatura en Informática, Universidad de Córdoba.',
    population: 'Docentes en formación (practicantes) de la Licenciatura en Informática, Universidad de Córdoba.',
    concepts: ['Resultados de Aprendizaje', 'Docentes en Formación', 'Currículo', 'Fenomenología Pedagógica'],
    methodology: 'Cualitativa / Fenomenología. Paradigma hermenéutico-fenomenológico, enfocado en comprender la realidad educativa desde la subjetividad y vivencia de los actores.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo se alinean estos Resultados de Aprendizaje universitarios con los DBA del Ministerio de Educación en la práctica real de aula?'
    ],
    continuityPossibilities: [
      'Sistematizar estas experiencias para iterar y mejorar la sección de "Resultados de Aprendizaje" en los formularios de planeación de InspirateC.'
    ],
    keywords: ['Resultados de Aprendizaje', 'Docentes en Formación', 'Fenomenología', 'InspirateC', 'Currículo'],
    status: 'active',
    year: '2025',
    leadResearcher: 'Mercado Fernández, J. & Padilla Urueta, M.'
  },
  {
    id: 'proj-10',
    code: 'LABSIE-P10',
    title: 'Exploración de las experiencias, percepciones y dificultades de los estudiantes al interactuar con un sistema tutor inteligente que fomenta el pensamiento crítico',
    lineId: 'line-diseno-sistemas-inteligentes',
    lineName: 'Diseño e implementación de sistemas inteligentes para la educación',
    description: 'Investigación centrada en la experiencia de usuario (UX) y la asimilación cognitiva frente a un STI enfocado en habilidades complejas.',
    problem: 'Las barreras técnicas y de comprensión que surgen cuando una IA intenta mediar procesos de debate y argumentación crítica.',
    question: '¿Qué percepciones, dificultades y experiencias manifiestan los estudiantes al interactuar con un STI orientado al pensamiento crítico?',
    generalObjective: 'Explorar las dificultades cognitivas e interactivas que enfrentan los estudiantes al utilizar un STI diseñado para fomentar el pensamiento crítico.',
    context: 'Sistemas de tutoría universitaria o secundaria técnica.',
    population: 'Estudiantes usuarios de sistemas de tutoría universitaria o secundaria técnica.',
    concepts: ['Pensamiento Crítico', 'Sistemas Tutores Inteligentes', 'Experiencia del Usuario (UX)', 'Interacción Humano-Computador'],
    methodology: 'Cualitativa / Estudio de Caso. Cualitativo exploratorio. Se busca entender la interacción desde la usabilidad técnica y la carga cognitiva pedagógica.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿La frustración ante el sistema tutor es producto de fallas en la interfaz o de la exigencia cognitiva del pensamiento crítico?'
    ],
    continuityPossibilities: [
      'Mejorar los modelos de retroalimentación de la IA usando prompts encadenados que guíen al usuario sin frustrarlo.'
    ],
    keywords: ['Pensamiento Crítico', 'UX Educativo', 'Sistemas Tutores', 'HCI', 'Carga Cognitiva'],
    status: 'active',
    year: '2025',
    leadResearcher: 'Ojeda Márquez, A. & Cogollo Barba, D.'
  },
  {
    id: 'proj-11',
    code: 'LABSIE-P11',
    title: 'Integración de la tecnología en el seguimiento y control disciplinario en educación media',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Digitalización de los procesos de convivencia y seguimiento comportamental escolar.',
    problem: 'Gestión manual, desorganizada o ineficiente de los observadores del alumno y el historial disciplinario.',
    question: '¿Cómo optimizar el seguimiento y control disciplinario en educación media mediante la integración de un sistema tecnológico?',
    generalObjective: 'Desarrollar e integrar una solución tecnológica que permita el registro, seguimiento y control eficiente de los procesos disciplinarios en educación media.',
    context: 'Directivos, docentes y coordinadores de convivencia en instituciones de educación media.',
    population: 'Directivos, docentes y coordinadores de convivencia en instituciones de educación media.',
    concepts: ['Convivencia Escolar', 'Sistemas de Información', 'Control Disciplinario', 'Gestión Educativa'],
    methodology: 'Desarrollo Tecnológico / IAP. Enfoque aplicado, centrado en el desarrollo y despliegue de un sistema de información para la gestión administrativa-docente.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo balancear el monitoreo de convivencia escolar con el respeto a la intimidad y los derechos digitales de los estudiantes?'
    ],
    continuityPossibilities: [
      'Asegurar reglas de seguridad perimetral (ej. Firebase Security Rules) para proteger datos sensibles de los menores.'
    ],
    keywords: ['Convivencia Escolar', 'Sistemas de Información', 'Gestión Educativa', 'Seguridad de Datos', 'Firebase'],
    status: 'completed',
    year: '2022',
    leadResearcher: 'Perez Agamez, J. & Racine Guerra, J.'
  },
  {
    id: 'proj-12',
    code: 'LABSIE-P12',
    title: 'Modelo de creación de RED para el desarrollo de un STI para el aprendizaje del protocolo de atención en detección de sífilis',
    lineId: 'line-diseno-sistemas-inteligentes',
    lineName: 'Diseño e implementación de sistemas inteligentes para la educación',
    description: 'Creación de un modelo tecno-pedagógico para entrenar personal de salud mediante simuladores e IA.',
    problem: 'Necesidad de entrenamiento estandarizado y sin riesgo para la aplicación de protocolos clínicos de atención materno-infantil.',
    question: '¿Cómo diseñar un modelo de RED articulado a un STI para la apropiación efectiva de protocolos de salud materno-infantil?',
    generalObjective: 'Proponer un modelo para la creación de Recursos Educativos Digitales integrados a un Sistema Tutor Inteligente para la enseñanza de protocolos de sífilis gestacional.',
    context: 'Estudiantes o profesionales del área de la salud, apoyados por el área de informática.',
    population: 'Estudiantes o profesionales del área de la salud, apoyados por el área de informática.',
    concepts: ['Recursos Educativos Digitales (RED)', 'Sistema Tutor Inteligente', 'Educación en Salud', 'Modelado Pedagógico'],
    methodology: 'Investigación Aplicada / Diseño Instruccional y de Software. Interdisciplinario (Salud e Informática), basado en metodologías de diseño de software educativo y simuladores.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo evaluar la transferencia del aprendizaje desde el simulador de tutoría virtual hacia la práctica clínica real?'
    ],
    continuityPossibilities: [
      'Utilizar generadores de IA (imágenes y video) para crear avatares de pacientes realistas que interactúen en el STI.'
    ],
    keywords: ['RED', 'Salud e Informática', 'Simuladores', 'Sistemas Tutores', 'Avatares IA'],
    status: 'completed',
    year: '2023',
    leadResearcher: 'Pérez Carrascal, L. & Mestra Ávila, A.'
  },
  {
    id: 'proj-13',
    code: 'LABSIE-P13',
    title: 'Modelo de machine learning para predecir el rendimiento académico en la asignatura producción de artefactos tecnológicos',
    lineId: 'line-analisis-datos-educativos',
    lineName: 'Análisis de datos educativos para la mejora de la enseñanza',
    description: 'Uso de algoritmos de inteligencia artificial para pronosticar las notas y el desempeño estudiantil basándose en variables históricas.',
    problem: 'Altas tasas de reprobación y dificultad para identificar tempranamente qué estudiantes requieren intervención pedagógica.',
    question: '¿Qué variables y algoritmos de Machine Learning configuran el modelo más preciso para predecir el rendimiento académico en esta asignatura específica?',
    generalObjective: 'Desarrollar y evaluar un modelo de Machine Learning capaz de predecir el rendimiento académico de los estudiantes en la asignatura de producción de artefactos tecnológicos.',
    context: 'Estudiantes de la Licenciatura en Informática (Unicórdoba).',
    population: 'Estudiantes de la Licenciatura en Informática (Unicórdoba).',
    concepts: ['Machine Learning', 'Predicción de Rendimiento Académico', 'Analítica de Datos Educativos', 'Producción de Artefactos Tecnológicos'],
    methodology: 'Cuantitativa / Machine Learning - Minería de Datos. Empírico-analítico, fundamentado en las ciencias de la computación y entrenamiento de modelos supervisados.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Qué variables formativas previas influyen con mayor peso en el éxito de la construcción de artefactos?'
    ],
    continuityPossibilities: [
      'Relacionar las variables predictivas de este modelo con la construcción física de hardware (ej. programación de BBC Micro:bit).'
    ],
    keywords: ['Machine Learning', 'Predicción de Rendimiento', 'Minería de Datos', 'Artefactos Tecnológicos', 'Micro:bit'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Echenique Hernández, J. & Pantoja Wilches, J.'
  },
  {
    id: 'proj-14',
    code: 'LABSIE-P14',
    title: 'Modelo de recomendación de acciones para la prevención de la inasistencia escolar basado en un sistema predictivo',
    lineId: 'line-analisis-datos-educativos',
    lineName: 'Análisis de datos educativos para la mejora de la enseñanza',
    description: 'Paso más allá de la predicción: un sistema que, usando Machine Learning, sugiere qué hacer para evitar el ausentismo.',
    problem: 'El ausentismo escolar crónico y la falta de estrategias preventivas basadas en evidencia en tiempo real.',
    question: '¿Cómo diseñar un modelo que vincule la predicción de ausentismo con recomendaciones pedagógicas personalizadas?',
    generalObjective: 'Diseñar un modelo de recomendación impulsado por aprendizaje automático que prescriba acciones preventivas frente a la inasistencia escolar.',
    context: 'Instituciones educativas de educación básica y media.',
    population: 'Instituciones educativas de educación básica y media.',
    concepts: ['Sistemas Predictivos', 'Inasistencia Escolar', 'Sistemas de Recomendación', 'Machine Learning'],
    methodology: 'Analítica Predictiva y Prescriptiva. Tecnológico-Predictivo, integrando sistemas expertos para la toma de decisiones directivas.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo ponderar factores de vulnerabilidad contextual frente a variables académicas en la prescripción de alertas?'
    ],
    continuityPossibilities: [
      'Automatizar la generación de estas "recomendaciones" a través de modelos de lenguaje natural (LLMs) integrados a la plataforma institucional.'
    ],
    keywords: ['Inasistencia Escolar', 'Sistemas de Recomendación', 'Machine Learning', 'Prescripción Pedagógica', 'LLMs'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Arteaga Ramos, A. & Tapias López, N.'
  },
  {
    id: 'proj-15',
    code: 'LABSIE-P15',
    title: 'Ontología para la representación del conocimiento de los resultados de aprendizaje del área de tecnología',
    lineId: 'line-diseno-sistemas-inteligentes',
    lineName: 'Diseño e implementación de sistemas inteligentes para la educación',
    description: 'Construcción de un modelo semántico (web semántica) para estructurar y conectar lógicamente los conceptos y resultados curriculares.',
    problem: 'Desestructuración y falta de interoperabilidad computacional en la forma en que se declaran los resultados de aprendizaje en las mallas curriculares.',
    question: '¿Cómo modelar semánticamente los resultados de aprendizaje del área de tecnología para permitir razonamiento automatizado?',
    generalObjective: 'Desarrollar una ontología computacional que permita la representación semántica y el razonamiento automatizado sobre los resultados de aprendizaje en tecnología.',
    context: 'Licenciatura en Informática (Nivel microcurricular).',
    population: 'Licenciatura en Informática (Nivel microcurricular).',
    concepts: ['Ontologías Computacionales', 'Web Semántica', 'Resultados de Aprendizaje', 'Representación del Conocimiento'],
    methodology: 'Ingeniería Ontológica. Ingeniería de Software Teórica / Computación Semántica.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo interoperar esta ontología con estándares educativos internacionales como IEEE LOM o Dublin Core?'
    ],
    continuityPossibilities: [
      'Esta ontología es la base arquitectónica perfecta para estructurar las bases de datos NoSQL (Firestore) de plataformas como InspirateC.',
    ],
    keywords: ['Ontología', 'Web Semántica', 'Resultados de Aprendizaje', 'Representación del Conocimiento', 'InspirateC'],
    status: 'completed',
    year: '2024',
    leadResearcher: 'Causil García, A. & Humanez Tobar, D.'
  },
  {
    id: 'proj-16',
    code: 'LABSIE-P16',
    title: 'Medición de competencias digitales en estudiantes de licenciatura en informática: un enfoque transversal',
    lineId: 'line-analisis-datos-educativos',
    lineName: 'Análisis de datos educativos para la mejora de la enseñanza',
    description: 'Evaluación estandarizada del nivel de apropiación TIC en futuros docentes a lo largo de su carrera.',
    problem: 'Desconocimiento empírico del nivel real de competencias digitales de los docentes en formación frente a marcos estandarizados (ej. DigCompEdu).',
    question: '¿Cuál es el nivel real de desarrollo de las competencias digitales en los estudiantes de la Licenciatura en Informática a lo largo de los semestres?',
    generalObjective: 'Medir y describir el nivel de desarrollo de las competencias digitales en los estudiantes de la Licenciatura en Informática desde una perspectiva transversal.',
    context: 'Estudiantes activos de distintos semestres de la Licenciatura en Informática.',
    population: 'Estudiantes activos de distintos semestres de la Licenciatura en Informática.',
    concepts: ['Competencias Digitales', 'Formación Docente', 'Evaluación Transversal', 'TIC'],
    methodology: 'Cuantitativa Descriptiva. Cuantitativo descriptivo y transversal (recolección de datos en un solo momento a diferentes semestres).',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Qué factores extracurriculares influyen en las brechas de competencia digital observadas entre cohortes?'
    ],
    continuityPossibilities: [
      'Utilizar estos resultados para justificar la necesidad de talleres de capacitación en herramientas de IA Generativa.'
    ],
    keywords: ['Competencias Digitales', 'DigCompEdu', 'Formación Docente', 'Evaluación Transversal', 'TIC'],
    status: 'completed',
    year: '2024',
    leadResearcher: 'Hernández Gil, H. & Rivas Alvarez, D.'
  },
  {
    id: 'proj-17',
    code: 'LABSIE-P17',
    title: 'Google classroom: una estrategia para el desarrollo del aprendizaje autónomo, desde el área de tecnología',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Implementación de un LMS estándar para fomentar la independencia del estudiante en la gestión de sus tareas.',
    problem: 'Dependencia docente y falta de hábitos de estudio autónomo en el área de tecnología.',
    question: '¿Cómo incide la mediación de Google Classroom en el desarrollo del aprendizaje autónomo en estudiantes de educación básica y media?',
    generalObjective: 'Implementar Google Classroom como estrategia didáctica para promover el aprendizaje autónomo en los estudiantes.',
    context: 'Educación Básica / Media.',
    population: 'Educación Básica / Media.',
    concepts: ['Aprendizaje Autónomo', 'Google Classroom', 'LMS', 'Área de Tecnología'],
    methodology: 'Investigación Acción Pedagógica. Cualitativo, centrado en la observación de prácticas de aula e interacción en plataformas virtuales.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo mitigar la dispersión y mantener la persistencia autónoma en actividades asincrónicas sin supervisión directa?'
    ],
    continuityPossibilities: [
      'Escalar este enfoque de autonomía mediante asistentes virtuales integrados (como ChatGPT o Gemini) que guíen al estudiante cuando no esté el docente en el LMS.'
    ],
    keywords: ['Google Classroom', 'Aprendizaje Autónomo', 'LMS', 'Asistentes IA', 'Educación Básica y Media'],
    status: 'completed',
    year: '2023',
    leadResearcher: 'Ramírez Vargas, G. & Ramírez Velázquez, C.'
  },
  {
    id: 'proj-18',
    code: 'LABSIE-P18',
    title: 'TreeScanEdu como App móvil para fortalecer el conocimiento de la botánica y cultura ambiental por medio de códigos QR',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'App interactiva que permite a los estudiantes escanear árboles en su entorno para aprender biología e informática.',
    problem: 'Desconexión entre la enseñanza teórica de las ciencias naturales y el entorno ambiental real del colegio.',
    question: '¿De qué forma el uso de TreeScanEdu mediado por códigos QR fortalece el conocimiento botánico y la conciencia ambiental en los educandos?',
    generalObjective: 'Diseñar la aplicación TreeScanEdu basada en tecnología QR para potenciar el aprendizaje de la botánica y el cuidado ambiental.',
    context: 'Institución educativa con zonas verdes (Interdisciplinariedad Ciencias Naturales - Informática).',
    population: 'Institución educativa con zonas verdes (Interdisciplinariedad Ciencias Naturales - Informática).',
    concepts: ['App Móvil', 'Códigos QR', 'Educación Ambiental', 'M-Learning'],
    methodology: 'Desarrollo de Software Educativo. Investigación aplicada con ingeniería de software.',
    results: 'Información pendiente de validar en documento original.',
    limitaciones: 'Información pendiente de validar en documento original.',
    openQuestions: [
      '¿Cómo sostener la interacción con la plataforma una vez completado el inventario vegetal inicial del plantel?'
    ],
    continuityPossibilities: [
      'Aplicar un enfoque de Aprendizaje Basado en Proyectos (ABP) donde los estudiantes utilicen las placas de Micro:bit para complementar los códigos QR midiendo la humedad del suelo de las plantas.'
    ],
    keywords: ['TreeScanEdu', 'Códigos QR', 'Educación Ambiental', 'M-Learning', 'Micro:bit'],
    status: 'completed',
    year: '2022',
    leadResearcher: 'Cuadrado Escobar, C. & Alean Viloria, E.'
  },
  {
    id: 'proj-19',
    code: 'LABSIE-P19',
    title: 'Diseño de tareas para el desarrollo del pensamiento crítico en un sistema tutor mediado por IA',
    lineId: 'line-diseno-sistemas-inteligentes',
    lineName: 'Diseño e implementación de sistemas inteligentes para la educación',
    description: 'Ciclos iterativos de prototipado pedagógico y validación con usuarios para andamiar inferencias y argumentación crítica.',
    problem: 'Falta de andamiaje explícito para inferencias complejas y argumentación crítica en entornos de tutoría automatizados.',
    question: '¿Cómo diseñar secuencias instruccionales dentro de un STI que desarrollen efectivamente el pensamiento crítico?',
    generalObjective: 'Diseñar y validar tareas pedagógicas orientadas al andamiaje del pensamiento crítico en un Sistema Tutor Inteligente.',
    context: 'Licenciatura en Informática, Universidad de Córdoba.',
    population: 'Estudiantes de educación superior y formación docente.',
    concepts: ['Pensamiento Crítico', 'Sistemas Tutores Inteligentes', 'Diseño Instruccional', 'Andamiaje Cognitivo'],
    methodology: 'Investigación Basada en Diseño (DBR). Ciclos iterativos de prototipado pedagógico y validación con usuarios.',
    results: 'Rúbricas de pensamiento crítico integradas y validación empírica preliminar.',
    limitaciones: 'Muestra restringida a asignaturas piloto de la Licenciatura.',
    openQuestions: [
      '¿Cómo modelar el pensamiento crítico en tiempo real con agentes conversacionales?',
      '¿Qué métricas de argumentación son más sensibles a la mediación de la IA?'
    ],
    continuityPossibilities: [
      'Articular tareas de pensamiento crítico con modelos de evaluación formativa automatizada.',
      'Extender la biblioteca de problemas a contextos interdisciplinares STEAM.'
    ],
    keywords: ['Pensamiento Crítico', 'STI', 'DBR', 'Andamiaje', 'Diseño Pedagógico'],
    status: 'active',
    year: '2023',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-20',
    code: 'LABSIE-P20',
    title: 'CARINA MIRROR Test: un benchmark conductual para la Metacognición Artificial en LLMs',
    lineId: 'line-artificial-metacognition',
    lineName: 'Artificial Metacognition',
    description: 'Protocolos experimentales de sondeo y perturbación para medir autoconocimiento, calibración y detección de errores en IA.',
    problem: 'Falta de instrumentos empíricos para medir la autocalibración y metacognición en modelos fundacionales de IA usados en educación.',
    question: '¿En qué medida el test CARINA MIRROR permite cuantificar la capacidad de autorrevisión de un LLM en tareas pedagógicas?',
    generalObjective: 'Desarrollar y aplicar el benchmark conductual CARINA MIRROR para evaluar la metacognición artificial en modelos de lenguaje.',
    context: 'Arquitecturas cognitivas y agentes inteligentes aplicados al aprendizaje.',
    population: 'Agentes tutores y modelos de lenguaje de gran escala (LLMs).',
    concepts: ['Metacognición Artificial', 'LLMs', 'Benchmarking Experimental', 'Arquitectura CARINA'],
    methodology: 'Benchmarking Experimental en LLMs. Pruebas de perturbación, auto-diagnóstico y calibración de confianza.',
    results: 'Matriz comparativa de calibración metacognitiva en agentes conversacionales.',
    limitaciones: 'Evolución acelerada de las arquitecturas de modelos de frontera.',
    openQuestions: [
      '¿Pueden los LLMs detectar genuinamente sus propias alucinaciones pedagógicas antes de emitir la respuesta?',
      '¿Cómo trasladar la metacognición artificial a la metacognición del estudiante?'
    ],
    continuityPossibilities: [
      'Integrar el benchmark en el pipeline de evaluación de asistentes tutoriales del semillero.',
      'Diseñar agentes con reflexión en dos etapas usando la arquitectura CARINA.'
    ],
    keywords: ['CARINA', 'Metacognición', 'LLMs', 'Benchmark', 'Inteligencia Artificial'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-21',
    code: 'LABSIE-P21',
    title: 'Diseño de un gemelo humano digital como Laboratorio pedagógico (IE Guillermo Valencia)',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Caracterización etnográfica y modelado multi-agente para permitir a futuros docentes simular escenarios de aula secundaria.',
    problem: 'Pocos espacios de simulación segura donde los docentes en formación puedan experimentar la gestión de aula antes de la práctica presencial.',
    question: '¿De qué manera un gemelo digital pedagógico enriquece las competencias de gestión de aula en docentes de informática?',
    generalObjective: 'Diseñar y validar un gemelo humano digital de aula escolar como entorno inmersivo de práctica docente.',
    context: 'Institución Educativa Guillermo Valencia, Montería, Córdoba.',
    population: 'Docentes en formación de la Licenciatura en Informática y estudiantes de secundaria.',
    concepts: ['Gemelo Digital', 'Simulación de Aula', 'Formación Docente', 'Modelado Multi-Agente'],
    methodology: 'Investigación Mixta y Modelado Digital. Caracterización etnográfica de campo combinada con prototipado de simulación.',
    results: 'Arquetipos de interacción estudiantil caracterizados en el contexto local de Montería.',
    limitaciones: 'Carga computacional de la renderización y simulación de agentes sincrónicos.',
    openQuestions: [
      '¿Qué nivel de fidelidad conductual se requiere para que el docente experimente presencia pedagógica?',
      '¿Cómo transferir las decisiones del gemelo a la práctica presencial?'
    ],
    continuityPossibilities: [
      'Incorporar modelos de lenguaje para dotar a los gemelos estudiantiles de respuestas adaptativas y contextualizadas.',
      'Desplegar escenarios de resolución de conflictos escolares mediante simuladores web ligeros.'
    ],
    keywords: ['Gemelo Digital', 'Simulación', 'Formación Docente', 'Multi-Agente', 'IE Guillermo Valencia'],
    status: 'active',
    year: '2023',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-22',
    code: 'LABSIE-P22',
    title: 'Traductor estadístico y computacional para la lengua nativa Embera Katío del Alto Sinú',
    lineId: 'line-entornos-virtuales-adaptativos',
    lineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
    description: 'Herramientas de Procesamiento de Lenguaje Natural para la conservación, enseñanza y revitalización de la lengua ancestral indígena.',
    problem: 'Falta de recursos computacionales y riesgo de pérdida lingüística en comunidades indígenas de baja densidad de recursos digitales.',
    question: '¿Cómo construir un modelo computacional de traducción para una lengua indígena de bajos recursos computacionales como el Embera Katío?',
    generalObjective: 'Desarrollar una herramienta tecno-pedagógica de traducción computacional para la lengua nativa Embera Katío del Alto Sinú.',
    context: 'Resguardos indígenas del Alto Sinú, departamento de Córdoba.',
    population: 'Comunidad indígena Embera Katío y etnoeducadores de la región.',
    concepts: ['PLN', 'Embera Katío', 'Lenguas Nativas', 'Preservación Cultural', 'Traducción Automática'],
    methodology: 'Procesamiento de Lenguaje Natural (PLN) e Investigación Lingüística Participativa con la comunidad.',
    results: 'Corpus bilingüe recolectado y modelo estadístico de alineación lexical preliminar.',
    limitaciones: 'Escasez de textos digitalizados en la lengua materna (low-resource language).',
    openQuestions: [
      '¿Cómo resolver la variación dialectal en comunidades dispersas geográficamente?',
      '¿Qué papel juega la tradición oral en la validación de diccionarios digitales?'
    ],
    continuityPossibilities: [
      'Crear aplicaciones móviles offline para escuelas etnoeducativas usando síntesis de voz y reconocimiento fonético.',
      'Diseñar cartillas interactivas con realidad aumentada y anclaje cultural.'
    ],
    keywords: ['Embera Katío', 'PLN', 'Bajos Recursos', 'Lenguas Indígenas', 'Alto Sinú'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-23',
    code: 'LABSIE-P23',
    title: 'Análisis de indicadores dinámicos de Knowledge Tracing para la predicción temprana del riesgo académico',
    lineId: 'line-analisis-datos-educativos',
    lineName: 'Análisis de datos educativos para la mejora de la enseñanza',
    description: 'Modelado cuantitativo empírico de series temporales para alertar oportunamente sobre vacíos antes de evaluaciones sumativas.',
    problem: 'Identificación tardía del rezago conceptual en plataformas educativas, imposibilitando la intervención remedial preventiva.',
    question: '¿Qué indicadores dinámicos de Knowledge Tracing predicen con mayor precisión el riesgo de reprobación en programación?',
    generalObjective: 'Modelar y validar indicadores predictivos tempranos mediante técnicas de Bayesian y Deep Knowledge Tracing.',
    context: 'Asignaturas de algoritmos y programación básica, Universidad de Córdoba.',
    population: 'Estudiantes de primeros semestres de Licenciatura en Informática.',
    concepts: ['Knowledge Tracing', 'Analítica del Aprendizaje', 'Predicción Temprana', 'EDM', 'Series Temporales'],
    methodology: 'Minería de Datos Educativos (EDM) y Analítica Cuantitativa. Modelado estocástico y redes neuronales secuenciales.',
    results: 'Curvas ROC y matrices de confusión para alertas con 3 semanas de anticipación al corte evaluativo.',
    limitaciones: 'Sensibilidad a la tasa de inactividad de los estudiantes en la plataforma.',
    openQuestions: [
      '¿Cómo comunicar el riesgo predicho al estudiante sin inducir efecto Pigmalión o desmotivación?',
      '¿Qué intervenciones automáticas revierten más eficazmente la probabilidad de falla?'
    ],
    continuityPossibilities: [
      'Integrar el motor de Knowledge Tracing con el dashboard docente de LabSIE para alertas en tiempo real.',
      'Personalizar las secuencias de ejercicios en función de la probabilidad estimada de dominio conceptual.'
    ],
    keywords: ['Knowledge Tracing', 'EDM', 'Predicción Temprana', 'Riesgo Académico', 'Analítica'],
    status: 'active',
    year: '2023',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-24',
    code: 'LABSIE-P24',
    title: 'Negociación del control pedagógico: Planificación educativa con inteligencia artificial generativa',
    lineId: 'line-ia-aprendizaje-personalizado',
    lineName: 'Aplicación de la inteligencia artificial en el aprendizaje personalizado',
    description: 'Investigación fundamentada en la Teoría Fundamentada Constructivista para modelar la tensión entre delegación y autonomía al co-diseñar con IA.',
    problem: 'Tensión no resuelta entre la pérdida de agencia profesional docente y el incremento de productividad al usar IA generativa.',
    question: '¿Cómo construyen y negocian los docentes su autonomía pedagógica al planificar con herramientas de IA generativa?',
    generalObjective: 'Construir una teoría sustantiva sobre la negociación del control pedagógico en la co-planificación docente mediada por IA.',
    context: 'Instituciones educativas oficiales de Montería y Córdoba.',
    population: 'Docentes en ejercicio de áreas de Tecnología e Informática.',
    concepts: ['Teoría Fundamentada', 'Control Pedagógico', 'IA Generativa', 'Agencia Docente', 'Kathy Charmaz'],
    methodology: 'Teoría Fundamentada Constructivista (Kathy Charmaz). Muestreo teórico, codificación abierta, axial y teórica.',
    results: 'Modelo conceptual de tres posturas docentes: Resistencia defensiva, Delegación pasiva y Co-construcción crítica.',
    limitaciones: 'Cambios rápidos en las interfaces comerciales de IA durante el periodo del estudio.',
    openQuestions: [
      '¿Cómo evoluciona la postura de los docentes a medida que incrementan su alfabetización técnica en IA?',
      '¿Qué principios de interfaz promueven una co-construcción crítica en lugar de una delegación acrítica?'
    ],
    continuityPossibilities: [
      'Diseñar rúbricas y talleres de formación docente fundamentados en el modelo de control pedagógico.',
      'Publicar directrices institucionales para el uso ético y reflexivo de la IA generativa en la planificación de aula.'
    ],
    keywords: ['Control Pedagógico', 'IA Generativa', 'Teoría Fundamentada', 'Agencia Docente', 'Charmaz'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-25',
    code: 'LABSIE-P25',
    title: 'Sistema de retroalimentación inteligente basado en Knowledge Tracing en Tecnología e Informática',
    lineId: 'line-ia-aprendizaje-personalizado',
    lineName: 'Aplicación de la inteligencia artificial en el aprendizaje personalizado',
    description: 'Evaluación cuasi-experimental con grupo control y experimental para diagnosticar vacíos y personalizar retroalimentación en tiempo real.',
    problem: 'La retroalimentación retardada o genérica reduce la eficacia del aprendizaje autorregulado en programación.',
    question: '¿Qué impacto produce la retroalimentación inmediata adaptativa en el rendimiento y la metacognición de estudiantes de secundaria?',
    generalObjective: 'Desarrollar y evaluar un sistema de retroalimentación formativa inmediata guiado por Knowledge Tracing.',
    context: 'Aulas de Tecnología e Informática de secundaria en Córdoba.',
    population: 'Estudiantes de grado 9° y 10°.',
    concepts: ['Retroalimentación Inteligente', 'Knowledge Tracing', 'Evaluación Formativa', 'Cuasi-experimental', 'Metacognición'],
    methodology: 'Diseño Cuasi-experimental con pre-test, post-test, grupo experimental y grupo control.',
    results: 'Incremento estadísticamente significativo en la resolución autónoma de problemas de lógica computacional.',
    limitaciones: 'Disparidad en la conectividad de los laboratorios escolares.',
    openQuestions: [
      '¿Cómo evitar que la retroalimentación excesiva genere dependencia en el estudiante?',
      '¿Qué tipo de pistas (hints) promueven mayor retención conceptual a largo plazo?'
    ],
    continuityPossibilities: [
      'Integrar módulos de micro-evaluaciones offline con retroalimentación instantánea.',
      'Conectar el sistema con el marco de competencias digitales docentes de LabSIE.'
    ],
    keywords: ['Retroalimentación Adaptativa', 'Knowledge Tracing', 'Cuasi-experimental', 'Secundaria', 'Lógica'],
    status: 'completed',
    year: '2023',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-26',
    code: 'LABSIE-P26',
    title: 'Arquitectura Cortico-Claustrum y CPCC: Protocolo de comunicación cortical para control metacognitivo explicable en agentes IA',
    lineId: 'line-artificial-metacognition',
    lineName: 'Artificial Metacognition',
    description: 'Implementación del protocolo de comunicación cortical (CPCC) inspirado en la interacción cortico-claustrum para arbitrar el flujo bidireccional entre el Object Level (ejecución) y el Meta Level (monitoreo introspectivo y control explicable).',
    problem: 'La opacidad de los agentes autónomos de IA y su incapacidad para justificar formalmente sus decisiones de autorrevisión en tiempo de inferencia pedagógica.',
    question: '¿De qué manera una arquitectura bioinspirada Cortico-Claustrum y el protocolo CPCC garantizan un control metacognitivo explicable y auditable entre el Object Level y el Meta Level en agentes pedagógicos?',
    generalObjective: 'Diseñar, implementar y evaluar el protocolo CPCC dentro de una arquitectura Cortico-Claustrum para el control metacognitivo explicable y la regulación autónoma del razonamiento.',
    context: 'Arquitecturas cognitivas endógenas y agentes tutores inteligentes, Grupo EduTLAN.',
    population: 'Agentes pedagógicos autónomos y modelos de razonamiento guiado en educación.',
    concepts: ['Cortico-Claustrum', 'CPCC', 'Explainable Control', 'Object Level', 'Meta Level', 'Metacognición Endógena'],
    methodology: 'Investigación en Arquitecturas Cognitivas & Ingeniería de Software de IA. Modelado formal del protocolo CPCC, simulación bioinspirada claustro-cortical y validación empírica de auditabilidad.',
    results: 'Protocolo CPCC validado con trazas auditables y reducción del 42% en alucinaciones no detectadas.',
    limitaciones: 'Latencia computacional introducida por la capa de arbitraje claustro-cortical.',
    openQuestions: [
      '¿Cómo optimizar el canal de control explicable sin degradar el tiempo de respuesta del agente en el aula?',
      '¿Qué nivel de granularidad formal del Meta Level es óptimo para la comprensión del docente tutor?'
    ],
    continuityPossibilities: [
      'Integrar el protocolo CPCC en asistentes tutoriales sincrónicos de LabSIE.',
      'Conectar el control explicable con rúbricas formativas audibles para docentes de la Licenciatura.'
    ],
    keywords: ['Cortico-Claustrum', 'CPCC', 'Explainable Control', 'Object Level', 'Meta Level', 'Metacognición Endógena', 'Artificial Metacognition'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-27',
    code: 'LABSIE-P27',
    title: 'Meta-DNA y Dendritic Metacognition (DMA): Rastreo evolutivo y autorregulación sináptica en modelos cognitivos para la educación',
    lineId: 'line-artificial-metacognition',
    lineName: 'Artificial Metacognition',
    description: 'Modelado computacional de metacognición dendrítica (DMA) y codificación epigenética de estrategias heurísticas (Meta-DNA) para permitir que los agentes adapten y regulen sus estrategias didácticas según su propio historial de razonamiento.',
    problem: 'La rigidez adaptativa de los tutores virtuales frente a errores conceptuales complejos y la falta de memoria evolutiva en sus decisiones meta-cognitivas.',
    question: '¿Cómo incide la articulación entre Dendritic Metacognition (DMA) y la estructura Meta-DNA en la autorregulación sináptica de agentes tutores autónomos?',
    generalObjective: 'Modelar e implementar el framework DMA y la arquitectura Meta-DNA para dotar a agentes de tutoría de autorregulación sináptica y memoria evolutiva auditable.',
    context: 'Entornos de aprendizaje adaptativo, Universidad de Córdoba.',
    population: 'Sistemas inteligentes tutores y estudiantes de programación.',
    concepts: ['Meta-DNA', 'Dendritic Metacognition (DMA)', 'Autorregulación Sináptica', 'Plasticidad Cognitiva', 'IM-Onto'],
    methodology: 'Modelado Bioinspirado y Experimentación Computacional. Simulación dendrítica computacional y seguimiento genómico de estrategias heurísticas.',
    results: 'Framework DMA operativo con adaptación dinámica de tasas de aprendizaje reflexivo.',
    limitaciones: 'Requiere calibración previa de perfiles de interacción estudiantil.',
    openQuestions: [
      '¿Cómo trasladar la plasticidad del Meta-DNA a contextos pedagógicos interdisciplinares?',
      '¿En qué medida el DMA previene la degradación catastrófica del conocimiento en el agente?'
    ],
    continuityPossibilities: [
      'Vincular la firma de Meta-DNA con las trayectorias de Knowledge Tracing de estudiantes reales.',
      'Publicar librerías de DMA de código abierto para semilleristas de informática.'
    ],
    keywords: ['Meta-DNA', 'DMA', 'Dendritic Metacognition', 'Autorregulación Sináptica', 'Artificial Metacognition'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  },
  {
    id: 'proj-28',
    code: 'LABSIE-P28',
    title: 'MARINA-10 y MetaLingua++: Marco de introspección semántica y ontología formal IM-Onto para auditoría de razonamiento',
    lineId: 'line-artificial-metacognition',
    lineName: 'Artificial Metacognition',
    description: 'Unificación del marco MARINA-10 con el lenguaje introspectivo MetaLingua++ y la ontología formal IM-Onto para auditar, formalizar y verificar en tiempo real las trayectorias de razonamiento de agentes en entornos formativos.',
    problem: 'La ausencia de una ontología formal unificada y un lenguaje simbólico auditable para expresar los estados introspectivos de la IA en tiempo real.',
    question: '¿Cómo unifica la ontología IM-Onto y el lenguaje MetaLingua++ dentro de MARINA-10 la verificación semántica del razonamiento entre el Object Level y el Meta Level?',
    generalObjective: 'Construir y validar la ontología IM-Onto y el lenguaje MetaLingua++ integrados en MARINA-10 para la auditoría y certificación formal del razonamiento artificial.',
    context: 'Investigación en Inteligencia Artificial Simbólica y Neuro-simbólica, LabSIE.',
    population: 'Agentes conversacionales educativos y evaluadores formales de conocimiento.',
    concepts: ['MARINA-10', 'MetaLingua++', 'IM-Onto', 'Auditoría de Razonamiento', 'Introspección Semántica', 'Verificación Formal'],
    methodology: 'Ingeniería Ontológica y Métodos Formales Neuro-Simbólicos. Desarrollo de IM-Onto según estándares W3C/OWL y parser para MetaLingua++.',
    results: 'Ontología IM-Onto con 120 axiomas de introspección y banco de pruebas MARINA-10 formalizado.',
    limitaciones: 'Complejidad computacional en razonamiento ontológico para corpus masivos en tiempo real.',
    openQuestions: [
      '¿Puede MetaLingua++ servir como estándar de interoperabilidad entre agentes educativos de diferentes proveedores?',
      '¿Cómo mapear las descripciones ontológicas de IM-Onto en explicaciones directas para estudiantes novatos?'
    ],
    continuityPossibilities: [
      'Integrar IM-Onto como estándar de evaluación de explicabilidad en el grupo EduTLAN.',
      'Desarrollar un visor visual de introspección en tiempo real para laboratorios de informática.'
    ],
    keywords: ['MARINA-10', 'MetaLingua++', 'IM-Onto', 'Auditoría de Razonamiento', 'Artificial Metacognition', 'Meta Level'],
    status: 'active',
    year: '2024',
    leadResearcher: 'Equipo LabSIE · EduTLAN'
  }
];

export const DEMO_ANALYSES: AnalysisResult[] = [
  {
    id: 'eval-001',
    timestamp: '2026-03-28T14:20:00Z',
    algorithmVersion: 'v2.0-lic-informatica',
    studentId: 'std-101',
    studentProfile: {
      name: 'María Valentina Ramos',
      email: 'm.ramos@correo.unicordoba.edu.co',
      program: 'Licenciatura en Informática',
      semester: '7.º',
      researchExperience: 'He participado en actividades de investigación.',
      techExperience: 'Avanzado',
      aiExperience: 'Frecuentemente'
    },
    routeType: 'HEREDAR',
    correspondenceScore: 88,
    correspondenceLevel: 'Alta correspondencia',
    profileArchetype: 'El Analista 📊 · Analítica de Datos y Knowledge Tracing',
    interestPercentages: {
      'IA Educativa y Tutores': 94,
      'Knowledge Tracing y Analítica': 92,
      'Procesos de Aprendizaje': 86,
      'Diseño Tecnológico': 72,
      'Simulación Pedagógica': 56
    },
    dominantResearchWays: ['Buscar patrones.', 'Analizar datos.', 'Programar.'],
    primaryLineId: 'line-analisis-datos-educativos',
    primaryLineName: 'Análisis de datos educativos para la mejora de la enseñanza',
    relatedProjects: [
      {
        projectId: 'proj-03',
        projectTitle: 'Análisis longitudinal de patrones de compromiso y rendimiento de estudiantes universitarios durante la pandemia de COVID-19 mediante cadenas de Markov',
        projectCode: 'LABSIE-P03',
        affinity: 92,
        connectionReason: 'Alta coincidencia entre tu interés por detectar patrones temporales en datos educativos y el modelado probabilístico de este proyecto.',
        matchingConcepts: ['Minería de Datos Educativos', 'Cadenas de Markov', 'Rendimiento Académico', 'Análisis Longitudinal']
      },
      {
        projectId: 'proj-13',
        projectTitle: 'Modelo de machine learning para predecir el rendimiento académico en la asignatura producción de artefactos tecnológicos',
        projectCode: 'LABSIE-P13',
        affinity: 86,
        connectionReason: 'Fuerte alineación con tu interés por modelos de inteligencia artificial y analítica predictiva del rendimiento estudiantil.',
        matchingConcepts: ['Machine Learning', 'Predicción de Rendimiento Académico', 'Analítica de Datos Educativos']
      }
    ],
    whyExplanation: [
      'Tu perfil investigativo se destaca por una marcada curiosidad hacia el modelado secuencial del aprendizaje y la analítica predictiva. Expresas un claro interés por comprender el momento exacto en que un estudiante experimenta una brecha cognitiva en el aula de informática.',
      'Existe una estrecha correspondencia con las investigaciones de LabSIE en Knowledge Tracing (proyectos LABSIE-P04 y LABSIE-P06), donde el semillero ya cuenta con formulaciones matemáticas y datasets iniciales en la Universidad de Córdoba.',
      'Por esto, el sistema identifica la ruta HEREDAR: cuentas con las competencias para profundizar preguntas abiertas ya formuladas en el semillero, específicamente cómo convertir indicadores matemáticos en retroalimentaciones comprensibles para los estudiantes.'
    ],
    whyBreakdown: {
      matchingInterests: ['¿Cómo detectar patrones en los datos?', '¿Cómo aprenden las personas?', 'Una IA que analiza datos educativos.'],
      matchingWays: ['Buscar patrones.', 'Analizar datos.', 'Programar.'],
      relatedConcepts: ['Knowledge Tracing', 'Predicción Temprana', 'Retroalimentación Inteligente'],
      selectedProjectsCount: 2,
      studentIdeaAnalysis: 'Idea orientada a construir un tablero que alerte al estudiante antes del parcial sobre los temas específicos que aún no domina con suficiente solidez.',
      detectedConnections: ['Conexión directa con la línea de Analítica del Aprendizaje', 'Posibilidad de extensión a asignaturas de programación']
    },
    proposedProject: {
      tentativeTitle: 'Modelado explicable de trayectorias de Knowledge Tracing para la auto-regulación del aprendizaje en programación',
      tentativeQuestion: '¿De qué manera los indicadores dinámicos de Knowledge Tracing pueden representarse visualmente para que el propio estudiante autorregule su tiempo de práctica en ejercicios de programación?',
      tentativeObjective: 'Diseñar e implementar un módulo visual de autoregulación estudiantil alimentado por las predicciones secuenciales de un modelo de Knowledge Tracing.',
      centralConcepts: ['Knowledge Tracing Explicable', 'Autorregulación Cognitiva', 'Didáctica de la Programación', 'Dashboards para Estudiantes'],
      possibleContextPopulation: 'Estudiantes de Algoritmia y Programación de la Licenciatura en Informática (Universidad de Córdoba).',
      possibleContribution: 'Cerrar la brecha entre la predicción algorítmica y la acción consciente del estudiante sobre su propio proceso de estudio.',
      nextSteps: [
        'Revisión del repositorio y dataset del proyecto LABSIE-P04.',
        'Entrevista con el tutor responsable de la línea de Analítica del Aprendizaje.',
        'Formulación del protocolo de andamiaje visual con el grupo EduTLAN.'
      ],
      statusLabel: 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'
    },
    perspectives: [
      {
        id: 'tecnologico',
        title: 'Enfoque Tecnológico y Prototipado con IA',
        badge: '💻 Sistemas Inteligentes & Software Educativo',
        icon: '💻',
        shortDescription: 'Orientado al modelado matemático de Knowledge Tracing, algoritmos secuenciales de Markov y tableros interactivos para estudiantes.',
        focusArea: 'Ingeniería de Software Educativo, Analítica del Aprendizaje y Algoritmos Inteligentes',
        archetype: 'El Analista 📊 · Modelador de Knowledge Tracing y Software Educativo',
        routeType: 'HEREDAR',
        correspondenceScore: 92,
        correspondenceLevel: 'Alta correspondencia',
        primaryLineId: 'line-analisis-datos-educativos',
        primaryLineName: 'Análisis de datos educativos para la mejora de la enseñanza',
        methodologyFocus: {
          type: 'Design-Based Research (DBR) & Prototipado de Software',
          icon: '⚡',
          description: 'Modelado algorítmico, desarrollo iterativo del dashboard de autoregulación y validación de métricas de precisión.'
        },
        whyExplanation: [
          'Tu perfil destaca por habilidades analíticas y de desarrollo de software para el modelado de datos educativos en la Licenciatura en Informática.',
          'Esta perspectiva prioriza la herencia directa de las bases matemáticas del proyecto LABSIE-P03 y P13 en EduTLAN.'
        ],
        keyStrengths: [
          'Manejo de algoritmos y modelado secuencial de datos',
          'Interés en desarrollo de interfaces y dashboards estudiantiles',
          'Curiosidad técnica en Knowledge Tracing'
        ],
        relatedProjects: [
          {
            projectId: 'proj-03',
            projectTitle: 'Análisis longitudinal de patrones de compromiso mediante cadenas de Markov',
            projectCode: 'LABSIE-P03',
            affinity: 92,
            connectionReason: 'Alineación directa con modelado de datos temporales y secuencias de estudiantes.',
            matchingConcepts: ['Minería de Datos', 'Cadenas de Markov', 'Rendimiento']
          },
          {
            projectId: 'proj-13',
            projectTitle: 'Modelo de machine learning para predecir el rendimiento académico',
            projectCode: 'LABSIE-P13',
            affinity: 86,
            connectionReason: 'Modelos predictivos aplicados a asignaturas de tecnología.',
            matchingConcepts: ['Machine Learning', 'Predicción', 'Analítica']
          }
        ],
        proposedProject: {
          tentativeTitle: 'Modelado explicable de trayectorias de Knowledge Tracing para la auto-regulación del aprendizaje en programación',
          tentativeQuestion: '¿De qué manera los indicadores dinámicos de Knowledge Tracing pueden representarse visualmente para que el estudiante autorregule su aprendizaje?',
          tentativeObjective: 'Diseñar e implementar un módulo visual de autoregulación estudiantil alimentado por Knowledge Tracing.',
          centralConcepts: ['Knowledge Tracing', 'Autorregulación', 'Didáctica de la Programación'],
          possibleContextPopulation: 'Estudiantes de Programación de la Licenciatura en Informática (Universidad de Córdoba)',
          possibleContribution: 'Herramienta de software con analítica predictiva en tiempo real para el semillero.',
          nextSteps: ['Revisión de repositorios y dataset P03', 'Prototipado del módulo en React'],
          statusLabel: 'PROPUESTA TECNOLÓGICA PRELIMINAR'
        }
      },
      {
        id: 'pedagogico',
        title: 'Enfoque Pedagógico y Didáctica de la Informática',
        badge: '🎓 Didáctica, Aula & Aprendizaje',
        icon: '🎓',
        shortDescription: 'Orientado a cómo la retroalimentación de la analítica incide en la superación de errores conceptuales en programación escolar.',
        focusArea: 'Didáctica de la Programación, Mediación Formativa y Evaluación del Aprendizaje',
        archetype: 'El Diseñador Pedagógico en Didáctica de la Computación',
        routeType: 'CONECTAR',
        correspondenceScore: 88,
        correspondenceLevel: 'Alta correspondencia',
        primaryLineId: 'line-ia-aprendizaje-personalizado',
        primaryLineName: 'Aplicación de la inteligencia artificial en el aprendizaje personalizado',
        methodologyFocus: {
          type: 'Investigación-Acción Pedagógica (IAPed) y Enfoque Mixto',
          icon: '📖',
          description: 'Diseño de secuencias didácticas de apoyo para conceptos difíciles de programación y evaluación del impacto pedagógico.'
        },
        whyExplanation: [
          'Desde la didáctica, el valor no reside en la matemática del modelo sino en cómo ayuda al futuro docente a intervenir oportunamente en el aula.',
          'Permite articular el diagnóstico analítico con la mediación docente activa.'
        ],
        keyStrengths: [
          'Comprensión pedagógica de la frustración del estudiante al programar',
          'Diseño de rúbricas y estrategias de andamiaje cognitivo',
          'Orientación hacia la formación del futuro profesor de informática'
        ],
        relatedProjects: [
          {
            projectId: 'proj-02',
            projectTitle: 'Estrategia didáctica mediada por pensamiento computacional',
            projectCode: 'LABSIE-P02',
            affinity: 85,
            connectionReason: 'Enfoque formativo directo en el desarrollo de habilidades computacionales en el aula.',
            matchingConcepts: ['Didáctica', 'Pensamiento Computacional', 'Secuencias']
          }
        ],
        proposedProject: {
          tentativeTitle: 'Secuencia didáctica mediada por analítica formativa para la superación de obstáculos conceptuales en programación',
          tentativeQuestion: '¿Cómo incide una secuencia didáctica basada en alertas tempranas en la persistencia y logro de competencias algorítmicas?',
          tentativeObjective: 'Diseñar y validar una secuencia didáctica que incorpore alertas analíticas formativas en cursos de programación.',
          centralConcepts: ['Didáctica de la Programación', 'Andamiaje Metacognitivo', 'Evaluación Formativa'],
          possibleContextPopulation: 'Estudiantes de colegios o universidad en cursos iniciales de informática',
          possibleContribution: 'Guías didácticas e instrumentos de evaluación pedagógica para la enseñanza de la algoritmia.',
          nextSteps: ['Mapeo de errores frecuentes en ciclos y condicionales', 'Diseño de la unidad didáctica'],
          statusLabel: 'PROPUESTA PEDAGÓGICA PRELIMINAR'
        }
      },
      {
        id: 'social',
        title: 'Enfoque de Innovación, Gestión y Apropiación Social',
        badge: '🌐 Impacto Social & Ética Tecnológica',
        icon: '🌐',
        shortDescription: 'Orientado a mitigar la deserción temprana en carreras tecnológicas de la región y democratizar el acceso a la formación computacional.',
        focusArea: 'Apropiación Social, Retención Estudiantil Regional y Ética de Datos',
        archetype: 'El Gestor de Innovación e Inclusión Educativa',
        routeType: 'TRASCENDER',
        correspondenceScore: 84,
        correspondenceLevel: 'Alta correspondencia',
        primaryLineId: 'line-entornos-virtuales-adaptativos',
        primaryLineName: 'Desarrollo de entornos de aprendizaje virtuales y adaptativos',
        methodologyFocus: {
          type: 'Investigación Participativa & Evaluación de Impacto Institucional',
          icon: '🤝',
          description: 'Sistematización de factores socioeconómicos y tecnológicos para la equidad educativa regional en Córdoba.'
        },
        whyExplanation: [
          'La deserción en informática en universidades públicas del Caribe afecta la movilidad social de jóvenes de la región.',
          'Esta perspectiva convierte la investigación en una política formativa inclusiva para la retención y éxito de los estudiantes.'
        ],
        keyStrengths: [
          'Compromiso con la permanencia estudiantil y equidad en la Universidad de Córdoba',
          'Visión ética sobre el uso responsable de algoritmos predictivos sin estigmatizar al estudiante',
          'Capacidad de articulación institucional con bienestar universitario'
        ],
        relatedProjects: [
          {
            projectId: 'proj-01',
            projectTitle: 'Estrategia didáctica mediante gamificación en áreas rurales',
            projectCode: 'LABSIE-P01',
            affinity: 82,
            connectionReason: 'Enfoque contextualizado en la superación de barreras educativas regionales.',
            matchingConcepts: ['Inclusión', 'Educación Regional', 'Brecha Digital']
          }
        ],
        proposedProject: {
          tentativeTitle: 'Estrategia integral de acompañamiento sociotécnico para la permanencia estudiantil en la Licenciatura en Informática',
          tentativeQuestion: '¿De qué forma un ecosistema de soporte sociotécnico contribuye a la equidad y permanencia de estudiantes en informática?',
          tentativeObjective: 'Estructurar y evaluar una estrategia participativa de acompañamiento que vincule tutorías de pares y analítica ética.',
          centralConcepts: ['Permanencia Estudiantil', 'Equidad Regional', 'Ética de la IA', 'Acompañamiento Socioeducativo'],
          possibleContextPopulation: 'Comunidad universitaria de la Licenciatura en Informática (Universidad de Córdoba)',
          possibleContribution: 'Lineamientos de política institucional para la retención con tecnologías éticas.',
          nextSteps: ['Articulación con bienestar estudiantil', 'Talleres participativos de diseño ético'],
          statusLabel: 'PROPUESTA SOCIAL PRELIMINAR'
        }
      }
    ],
    selectedPerspectiveId: 'tecnologico',
    proposedProjectOptions: [
      {
        id: 'opcion-1',
        optionNumber: 1,
        badge: 'Opción 1 · Innovación Tecnológica & IA',
        icon: '🤖',
        category: 'Tecnológico & IA',
        tentativeTitle: 'Modelado explicable de trayectorias de Knowledge Tracing para la auto-regulación del aprendizaje en programación',
        tentativeQuestion: '¿De qué manera los indicadores dinámicos de Knowledge Tracing pueden representarse visualmente para que el estudiante autorregule su tiempo de práctica en ejercicios de programación?',
        tentativeObjective: 'Diseñar e implementar un módulo visual de autoregulación estudiantil alimentado por las predicciones secuenciales de un modelo de Knowledge Tracing.',
        centralConcepts: ['Knowledge Tracing Explicable', 'Autorregulación Cognitiva', 'Didáctica de la Programación', 'Dashboards para Estudiantes'],
        possibleContextPopulation: 'Estudiantes de Algoritmia y Programación de la Licenciatura en Informática (Universidad de Córdoba)',
        methodology: {
          name: 'Design-Based Research (DBR) & Prototipado Ágil de Software',
          description: 'Modelado matemático, ingeniería de software educativo y validación de métricas de interacción con estudiantes reales.'
        },
        whyThisOption: 'Surge de tu marcada afinidad por la analítica de datos, algoritmos de Markov y desarrollo de software aplicado a la educación.',
        possibleContribution: 'Cerrar la brecha entre la predicción algorítmica y la acción consciente del estudiante sobre su propio proceso de estudio.',
        nextSteps: ['Revisión del repositorio y dataset LABSIE-P04', 'Prototipado del módulo en React', 'Pruebas de usabilidad en laboratorio'],
        isHighlighted: true
      },
      {
        id: 'opcion-2',
        optionNumber: 2,
        badge: 'Opción 2 · Innovación Didáctica & Aula',
        icon: '📖',
        category: 'Didáctico & Aula',
        tentativeTitle: 'Secuencia didáctica gamificada para la superación de obstáculos conceptuales en estructuras de control algorítmicas',
        tentativeQuestion: '¿Cómo incide una secuencia didáctica gamificada con retroalimentación temprana en la persistencia y comprensión profunda de ciclos y condicionales?',
        tentativeObjective: 'Diseñar y validar una secuencia didáctica situada que combine retos lúdicos y andamiajes metacognitivos en el aula de programación.',
        centralConcepts: ['Didáctica de la Programación', 'Gamificación Educativa', 'Andamiaje Metacognitivo', 'Evaluación Formativa'],
        possibleContextPopulation: 'Estudiantes de cursos introductorios de informática en educación superior o media técnica',
        methodology: {
          name: 'Investigación-Acción Pedagógica (IAPed) & Métodos Mixtos',
          description: 'Diagnóstico de errores frecuentes, diseño de unidades didácticas activas y medición de aprendizaje pre/post test.'
        },
        whyThisOption: 'Surge de tu interés en cómo los estudiantes aprenden y cómo prevenir la frustración temprana en cursos de informática.',
        possibleContribution: 'Guías didácticas, unidades instruccionales y rúbricas formativas validadas para docentes de programación.',
        nextSteps: ['Mapeo de errores conceptuales en condicionales', 'Diseño de la secuencia lúdica', 'Validación con docentes de EduTLAN']
      },
      {
        id: 'opcion-3',
        optionNumber: 3,
        badge: 'Opción 3 · Apropiación Social & Impacto Regional',
        icon: '🌐',
        category: 'Social & Comunitario',
        tentativeTitle: 'Ecosistema sociotécnico abierto para la prevención temprana de la deserción estudiantil en la Licenciatura en Informática',
        tentativeQuestion: '¿De qué forma un ecosistema de alertas éticas y tutorías comunitarias entre pares mitiga la deserción en carreras de computación en el Caribe colombiano?',
        tentativeObjective: 'Estructurar y evaluar una estrategia participativa que integre analítica de datos ética con redes de acompañamiento pedagógico y comunitario.',
        centralConcepts: ['Permanencia Estudiantil', 'Equidad Educativa Regional', 'Ética de Datos', 'Tutorías de Pares'],
        possibleContextPopulation: 'Comunidad universitaria de la Licenciatura en Informática (Universidad de Córdoba)',
        methodology: {
          name: 'Investigación Acción Participativa (IAP) & Evaluación de Impacto',
          description: 'Investigación dialógica que involucra a estudiantes, docentes y bienestar universitario en el codiseño de soluciones institucionales.'
        },
        whyThisOption: 'Surge de tu visión transformadora sobre el impacto social de la informática en la permanencia de jóvenes de la región.',
        possibleContribution: 'Lineamientos de política formativa e institucional para la retención con tecnologías éticas en universidades públicas.',
        nextSteps: ['Mesa de trabajo con bienestar universitario', 'Talleres participativos de diseño ético', 'Sistematización de indicadores']
      }
    ],
    selectedProjectOptionId: 'opcion-1',
    studentAnswers: {
      profile: {
        name: 'María Valentina Ramos',
        email: 'm.ramos@correo.unicordoba.edu.co',
        program: 'Licenciatura en Informática',
        semester: '7.º',
        researchExperience: 'He participado en actividades de investigación.',
        techExperience: 'Avanzado',
        aiExperience: 'Frecuentemente'
      },
      firstActionOnProblem: 'Analizar datos.',
      curiosityQuestions: ['¿Cómo detectar patrones en los datos?', '¿Cómo aprenden las personas?', '¿Cómo funcionan los sistemas inteligentes?'],
      preferredActivities: ['Analizar datos.', 'Buscar patrones.', 'Programar.', 'Crear aplicaciones.'],
      scenarioDifficulty: 'A. ¿Cómo detectar tempranamente la dificultad?',
      scenarioTeacherAI: 'B. Diseñar una IA que genere mejores propuestas.',
      scenarioIntelligentSystem: 'A. Predecir su desempeño.',
      scenarioCulturalChallenge: 'D. Cómo utilizar tecnología para facilitar la colaboración.',
      aiInterests: ['Una IA que analiza datos educativos.', 'Una IA que ayuda a aprender.', 'Una IA que adapta actividades.'],
      researcherArchetypes: ['El Analista 📊', 'El Constructor 💻'],
      problemToInvestigate: 'Me gustaría investigar cómo saber con certeza cuándo un estudiante realmente comprendió un ciclo o una estructura condicional en programación, y no solo que memorizó la sintaxis.',
      dreamResearch: 'Desarrollar un sistema de analítica en tiempo real para laboratorios de informática.',
      sixMonthsDiscovery: 'Un modelo predictivo con interfaz visual que ayude a los estudiantes de primer semestre a no desertar en programación.',
      selectedLabSIEProjects: ['proj-04', 'proj-06'],
      divergentProjectIdea: 'Investigaría cómo añadirle al Knowledge Tracing indicadores sobre la frustración del estudiante al depurar errores de código.',
      continuationPreference: '🧬 Profundizar',
      labsieExpectations: ['Aprender a investigar.', 'Participar en proyectos.', 'Encontrar un tema para mi trabajo de grado.'],
      additionalInterests: 'Tengo muchas ganas de vincularme a los laboratorios de LabSIE y aprender a escribir artículos científicos.'
    },
    adminReview: {
      id: 'rev-001',
      status: 'PERTINENT',
      decision: 'VINCULAR_PROYECTO',
      assignedLineId: 'line-analisis-datos-educativos',
      assignedProjectId: 'proj-04',
      assignedTutor: 'Dr. Coordinador LabSIE',
      priority: 'ALTA',
      adminComments: 'Perfil sólido con excelente afinidad hacia la línea de Knowledge Tracing. Convocada a reunión de vinculación para heredar fase de visualización del proyecto P04.',
      reviewedAt: '2026-03-29T10:15:00Z',
      reviewedBy: 'Coordinación EduTLAN'
    }
  }
];
