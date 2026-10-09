/**
 * Metadatos y especificaciones metodológicas oficiales para todos los proyectos patrimoniales
 * del Semillero LabSIE y Grupo EduTLAN (Universidad de Córdoba).
 */

export interface ProjectMethodologyInfo {
  code: string;
  badgeTitle: string;
  badgeIcon: string;
  paradigm: string;
  referenceAuthor?: string;
  summary: string;
  themeColor: {
    bg: string;
    text: string;
    border: string;
    pillBg: string;
  };
}

export const PROJECT_METHODOLOGIES: Record<string, ProjectMethodologyInfo> = {
  'proj-01': {
    code: 'LABSIE-P01',
    badgeTitle: 'Metodología: Investigación Acción Pedagógica (IAP) / Mixta',
    badgeIcon: '🎮',
    paradigm: 'Investigación Acción Pedagógica (IAP) / Mixta',
    referenceAuthor: 'Mangones Rodríguez, D. & Banquez Humanez, S. (2024)',
    summary: 'Diseño e implementación de una estrategia didáctica mediada por gamificación para superar brechas en informática rural.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-02': {
    code: 'LABSIE-P02',
    badgeTitle: 'Metodología: Desarrollo de Software / Investigación Basada en Diseño',
    badgeIcon: '📱',
    paradigm: 'Investigación tecnológica orientada al desarrollo e Ingeniería de Software Educativo',
    referenceAuthor: 'Perez Fajardo, R. (2023)',
    summary: 'Herramienta tecno-pedagógica móvil para la preservación e incidencia de la identidad cultural en la I.E. Obdulio Mayo Scarpeta.',
    themeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      pillBg: 'bg-teal-100'
    }
  },
  'proj-03': {
    code: 'LABSIE-P03',
    badgeTitle: 'Metodología: Cuantitativa Explicativa / Minería de Datos Educativos',
    badgeIcon: '📈',
    paradigm: 'Minería de Datos Educativos (EDM) y Modelos Estocásticos de Markov',
    referenceAuthor: 'Marchena Madera, L. & Medrano Gómez, M. (2024)',
    summary: 'Modelado longitudinal probabilístico de transiciones de compromiso y rendimiento en estudiantes universitarios durante la pandemia de COVID-19.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-04': {
    code: 'LABSIE-P04',
    badgeTitle: 'Metodología: Investigación Basada en Diseño (DBR)',
    badgeIcon: '🤖',
    paradigm: 'Investigación Basada en Diseño (DBR), Neurociencia Cognitiva y Pedagogía STEAM',
    referenceAuthor: 'Bedoya Ortega, M. & Alegría Durango, D. (2025)',
    summary: 'Asistente de IA generativa para estructurar actividades STEAM alineadas con los hitos neurocognitivos de grado primero.',
    themeColor: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-300',
      pillBg: 'bg-cyan-100'
    }
  },
  'proj-05': {
    code: 'LABSIE-P05',
    badgeTitle: 'Metodología: Investigación Acción Pedagógica / Diseño Participativo',
    badgeIcon: '📚',
    paradigm: 'Teoría Fundamentada y Diseño Curricular Participativo',
    referenceAuthor: 'Martínez Luna, W. & Ramírez Vega, W. (2026)',
    summary: 'Cocreación de microcurrículo contextualizado para integrar alfabetización en IA en instituciones públicas de Montería.',
    themeColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      pillBg: 'bg-amber-100'
    }
  },
  'proj-06': {
    code: 'LABSIE-P06',
    badgeTitle: 'Metodología: Investigación Basada en Diseño (DBR)',
    badgeIcon: '🧩',
    paradigm: 'Investigación Basada en Diseño (DBR) y Sistemas Tutores Inteligentes (ITS)',
    referenceAuthor: 'Diaz Arteaga, L. (2024)',
    summary: 'Modelo de actividades de aprendizaje y andamiaje en STI enfocado en potenciar resolución de problemas y competencias del siglo XXI.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-07': {
    code: 'LABSIE-P07',
    badgeTitle: 'Metodología: Investigación Acción (IA)',
    badgeIcon: '✍️',
    paradigm: 'Investigación Acción en el Aula y Mediación Tecnológica',
    referenceAuthor: 'Barriosnuevo Pérez, Y. & Fernández de la Rosa, J. (2023)',
    summary: 'Estrategia pedagógica con recursos TIC para el fortalecimiento de habilidades de comprensión lectora y producción textual en secundaria.',
    themeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      pillBg: 'bg-teal-100'
    }
  },
  'proj-08': {
    code: 'LABSIE-P08',
    badgeTitle: 'Metodología: Cuantitativa / Analítica de Datos Educativos',
    badgeIcon: '🎯',
    paradigm: 'Analítica del Aprendizaje, Logs de Interacción y Aprendizaje Autorregulado (SRL)',
    referenceAuthor: 'Salgado Montiel, M. & BRUNO AGUIRRE, M. (2024)',
    summary: 'Evaluación empírica del aprendizaje autorregulado al interactuar con un tutor virtual de IA mediante logs y métricas psicométricas.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-09': {
    code: 'LABSIE-P09',
    badgeTitle: 'Metodología: Cualitativa / Fenomenología',
    badgeIcon: '👥',
    paradigm: 'Hermenéutica Fenomenológica y Comprensión Curricular',
    referenceAuthor: 'Mercado Fernández, J. & Padilla Urueta, M. (2025)',
    summary: 'Experiencias vividas y tensiones de los docentes en formación en la implementación de resultados de aprendizaje en la Licenciatura.',
    themeColor: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-300',
      pillBg: 'bg-cyan-100'
    }
  },
  'proj-10': {
    code: 'LABSIE-P10',
    badgeTitle: 'Metodología: Cualitativa / Estudio de Caso',
    badgeIcon: '🔍',
    paradigm: 'Estudio de Caso, Interacción Humano-Computador (HCI) y Usabilidad Cognitiva',
    referenceAuthor: 'Ojeda Márquez, A. & Cogollo Barba, D. (2025)',
    summary: 'Exploración de percepciones, dificultades cognitivas y UX de estudiantes al interactuar con un STI orientado a pensamiento crítico.',
    themeColor: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-300',
      pillBg: 'bg-cyan-100'
    }
  },
  'proj-11': {
    code: 'LABSIE-P11',
    badgeTitle: 'Metodología: Desarrollo Tecnológico / IAP',
    badgeIcon: '🛡️',
    paradigm: 'Desarrollo Tecnológico Aplicado y Gestión Educativa',
    referenceAuthor: 'Perez Agamez, J. & Racine Guerra, J. (2022)',
    summary: 'Solución tecnológica para optimizar el registro, seguimiento y control de procesos disciplinarios y convivencia escolar en educación media.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-12': {
    code: 'LABSIE-P12',
    badgeTitle: 'Metodología: Investigación Aplicada / Diseño Instruccional y de Software',
    badgeIcon: '🏥',
    paradigm: 'Diseño Instruccional Interdisciplinario y Modelado de Simuladores',
    referenceAuthor: 'Pérez Carrascal, L. & Mestra Ávila, A. (2023)',
    summary: 'Modelo para la creación de Recursos Educativos Digitales integrados a un STI para la enseñanza de protocolos clínicos de sífilis.',
    themeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      pillBg: 'bg-teal-100'
    }
  },
  'proj-13': {
    code: 'LABSIE-P13',
    badgeTitle: 'Metodología: Cuantitativa / Machine Learning - Minería de Datos',
    badgeIcon: '🧠',
    paradigm: 'Ciencias de la Computación, Aprendizaje Automático Supervisado y EDM',
    referenceAuthor: 'Echenique Hernández, J. & Pantoja Wilches, J. (2024)',
    summary: 'Modelo de Machine Learning para predecir el desempeño y notas de estudiantes en la asignatura producción de artefactos tecnológicos.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-14': {
    code: 'LABSIE-P14',
    badgeTitle: 'Metodología: Analítica Predictiva y Prescriptiva',
    badgeIcon: '📊',
    paradigm: 'Sistemas Expertos, Analítica Predictiva y Prescriptiva',
    referenceAuthor: 'Arteaga Ramos, A. & Tapias López, N. (2024)',
    summary: 'Sistema impulsado por Machine Learning que predice el ausentismo escolar crónico y prescribe acciones preventivas en tiempo real.',
    themeColor: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
      pillBg: 'bg-green-100'
    }
  },
  'proj-15': {
    code: 'LABSIE-P15',
    badgeTitle: 'Metodología: Ingeniería Ontológica',
    badgeIcon: '🕸️',
    paradigm: 'Ingeniería de Software Teórica, Web Semántica y Modelado de Conocimiento',
    referenceAuthor: 'Causil García, A. & Humanez Tobar, D. (2024)',
    summary: 'Ontología computacional en OWL/RDF para la representación semántica y razonamiento automatizado sobre resultados de aprendizaje.',
    themeColor: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-300',
      pillBg: 'bg-cyan-100'
    }
  },
  'proj-16': {
    code: 'LABSIE-P16',
    badgeTitle: 'Metodología: Cuantitativa Descriptiva',
    badgeIcon: '💻',
    paradigm: 'Cuantitativo Descriptivo y Transversal (DigCompEdu)',
    referenceAuthor: 'Hernández Gil, H. & Rivas Alvarez, D. (2024)',
    summary: 'Medición estandarizada del nivel de apropiación de competencias digitales en estudiantes de la Licenciatura en Informática.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-17': {
    code: 'LABSIE-P17',
    badgeTitle: 'Metodología: Investigación Acción Pedagógica',
    badgeIcon: '🏫',
    paradigm: 'Investigación Acción Pedagógica y Prácticas de Aula Virtual',
    referenceAuthor: 'Ramírez Vargas, G. & Ramírez Velázquez, C. (2023)',
    summary: 'Implementación de Google Classroom como estrategia didáctica para promover la autogestión y el aprendizaje autónomo.',
    themeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      pillBg: 'bg-teal-100'
    }
  },
  'proj-18': {
    code: 'LABSIE-P18',
    badgeTitle: 'Metodología: Desarrollo de Software Educativo',
    badgeIcon: '🌿',
    paradigm: 'Ingeniería de Software Educativo y M-Learning Situado',
    referenceAuthor: 'Cuadrado Escobar, C. & Alean Viloria, E. (2022)',
    summary: 'TreeScanEdu como App móvil basada en códigos QR para fortalecer el conocimiento botánico y la cultura ambiental en el colegio.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-19': {
    code: 'LABSIE-P19',
    badgeTitle: 'Metodología: Investigación Basada en Diseño (DBR)',
    badgeIcon: '📐',
    paradigm: 'Investigación Basada en Diseño (DBR) y Andamiaje Instruccional',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2023)',
    summary: 'Diseño de tareas pedagógicas iterativas para el andamiaje del pensamiento crítico en un Sistema Tutor Inteligente.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-20': {
    code: 'LABSIE-P20',
    badgeTitle: 'Metodología: Benchmarking Experimental en LLMs',
    badgeIcon: '🧪',
    paradigm: 'Benchmarking Experimental y Metacognición Artificial',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2024)',
    summary: 'CARINA MIRROR Test: benchmark conductual experimental para medir autoconocimiento y detección de errores en LLMs.',
    themeColor: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-300',
      pillBg: 'bg-cyan-100'
    }
  },
  'proj-21': {
    code: 'LABSIE-P21',
    badgeTitle: 'Metodología: Mixta & Gemelo Digital',
    badgeIcon: '👥',
    paradigm: 'Investigación Mixta, Etnografía y Modelado Multi-Agente',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2023)',
    summary: 'Gemelo humano digital como laboratorio pedagógico para simular dinámicas de aula escolar (IE Guillermo Valencia).',
    themeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      pillBg: 'bg-teal-100'
    }
  },
  'proj-22': {
    code: 'LABSIE-P22',
    badgeTitle: 'Metodología: PLN & Traducción Intercultural',
    badgeIcon: '🌐',
    paradigm: 'Procesamiento de Lenguaje Natural e Investigación Lingüística Participativa',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2024)',
    summary: 'Traductor estadístico y computacional para la preservación y enseñanza de la lengua nativa Embera Katío del Alto Sinú.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  },
  'proj-23': {
    code: 'LABSIE-P23',
    badgeTitle: 'Metodología: Minería de Datos & Knowledge Tracing (EDM)',
    badgeIcon: '📊',
    paradigm: 'Minería de Datos Educativos (EDM) y Analítica Cuantitativa',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2023)',
    summary: 'Modelado empírico de indicadores de Knowledge Tracing para la predicción temprana de riesgo académico.',
    themeColor: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
      pillBg: 'bg-green-100'
    }
  },
  'proj-24': {
    code: 'LABSIE-P24',
    badgeTitle: 'Metodología: Teoría Fundamentada Constructivista',
    badgeIcon: '🧭',
    paradigm: 'Teoría Fundamentada Constructivista (Kathy Charmaz)',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2024)',
    summary: 'Modelo de negociación del control pedagógico y agencia docente en la planificación educativa con IA generativa.',
    themeColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      pillBg: 'bg-amber-100'
    }
  },
  'proj-25': {
    code: 'LABSIE-P25',
    badgeTitle: 'Metodología: Diseño Cuasi-experimental',
    badgeIcon: '🔬',
    paradigm: 'Diseño Cuasi-experimental y Evaluación Formativa',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2023)',
    summary: 'Sistema de retroalimentación inteligente basado en Knowledge Tracing para programación en Tecnología e Informática.',
    themeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      pillBg: 'bg-teal-100'
    }
  },
  'proj-26': {
    code: 'LABSIE-P26',
    badgeTitle: 'Metodología: Arquitectura Cortico-Claustrum & Protocolo CPCC',
    badgeIcon: '🧠',
    paradigm: 'Arquitecturas Cognitivas Endógenas & Protocolo CPCC',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2024)',
    summary: 'Protocolo CPCC para arbitrar la interacción bidireccional entre el Object Level y el Meta Level con control explicable.',
    themeColor: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-300',
      pillBg: 'bg-indigo-100'
    }
  },
  'proj-27': {
    code: 'LABSIE-P27',
    badgeTitle: 'Metodología: Dendritic Metacognition (DMA) & Meta-DNA',
    badgeIcon: '🧬',
    paradigm: 'Modelado Bioinspirado y Regulación Sináptica',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2024)',
    summary: 'Framework DMA y arquitectura Meta-DNA para autorregulación sináptica y memoria evolutiva en tutores inteligentes.',
    themeColor: {
      bg: 'bg-violet-50',
      text: 'text-violet-800',
      border: 'border-violet-300',
      pillBg: 'bg-violet-100'
    }
  },
  'proj-28': {
    code: 'LABSIE-P28',
    badgeTitle: 'Metodología: MARINA-10, MetaLingua++ & Ontología IM-Onto',
    badgeIcon: '📜',
    paradigm: 'Ingeniería Ontológica y Auditoría Formal Neuro-Simbólica',
    referenceAuthor: 'Equipo LabSIE · EduTLAN (2024)',
    summary: 'Ontología IM-Onto y lenguaje MetaLingua++ para verificación semántica e introspección auditable en agentes educativos.',
    themeColor: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-300',
      pillBg: 'bg-purple-100'
    }
  }
};

export function getProjectMethodology(projectId: string): ProjectMethodologyInfo {
  if (PROJECT_METHODOLOGIES[projectId]) {
    return PROJECT_METHODOLOGIES[projectId];
  }
  return {
    code: projectId,
    badgeTitle: 'Metodología Científica LabSIE',
    badgeIcon: '🔬',
    paradigm: 'Metodología de Investigación Rigurosa',
    summary: 'Investigación orientada al avance de la informática educativa en el Grupo EduTLAN.',
    themeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      pillBg: 'bg-emerald-100'
    }
  };
}
