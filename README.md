# LABSIE · RUTA INVESTIGATIVA
> *"De tus intereses a una posible investigación."*  
> Semillero de Investigación LabSIE · Grupo EduTLAN  
> Licenciatura en Informática · Universidad de Córdoba (Montería, Colombia)

---

## 1. Filosofía del Sistema

> **"Investigar no es empezar de cero. Es saber desde dónde continuar."**

Esta plataforma no es un formulario vocacional tradicional ni un generador automático de proyectos artificiales. Su función central es conectar:
1. **El perfil del estudiante**: Curiosidades, formas intuitivas de abordar enigmas, escenarios situacionales y una idea propia (*student_research_idea*).
2. **El patrimonio investigativo de LabSIE**: Lo que ya se ha investigado históricamente (problemas abordados, conceptos desarrollados, metodologías, preguntas abiertas, limitaciones y posibilidades de continuidad).
3. **Las líneas de investigación activas**.
4. **La validación humana del coordinador/administrador**, quien determina la pertinencia, línea, proyecto y tutor.

---

## 2. Modalidades de Ruta Investigativa

El motor de correspondencia clasifica cada perfil en una de cuatro modalidades:

- 🧬 **HEREDAR**: El estudiante presenta afinidad alta y concentrada con una investigación existente de LabSIE; se propone profundizar una pregunta abierta o fase pendiente.
- 🔗 **CONECTAR**: El estudiante presenta afinidad significativa con dos o más investigaciones a través de distintas líneas (e.g. Analítica de datos + Retroalimentación inteligente).
- 🌱 **TRASCENDER**: La inquietud del estudiante se nutre de la memoria metodológica de LabSIE pero abre una dirección totalmente nueva, otra población o contexto.
- 🧭 **EXPLORAR**: No existe correspondencia directa inmediata. El sistema no descarta la idea; orienta hacia diálogo formativo, revisión vocacional o apertura de nueva línea.

---

## 3. Algoritmo de Correspondencia y Ponderación

El motor opera bajo un sistema de reglas multicriterio desacoplado de dependencias externas obligatorias:

| Dimensión | Ponderación | Criterio Evaluado |
| :--- | :--- | :--- |
| **Intereses y Curiosidades** | **25%** | Mapeo de áreas científicas (cognición, analítica, ITS, LLMs, simulación, cultura). |
| **Escenarios Situacionales** | **20%** | Reacción ante dilemas reales de aprendizaje e interacción humano-IA. |
| **Idea Propia del Estudiante** | **20%** | Densidad conceptual y correspondencia semántica del texto `student_research_idea`. |
| **Formas de Investigar** | **15%** | Preferencias metodológicas (patrones, prototipos, entrevistas de campo, benchmarks). |
| **Proyectos Explorados** | **10%** | Proyectos del patrimonio que despertaron curiosidad directa en el test. |
| **Trayectoria y Experiencia** | **10%** | Semestre, formación técnica y familiaridad con IA. |

**Niveles de Correspondencia:**
- `0–39`: Baja correspondencia
- `40–59`: Correspondencia exploratoria
- `60–79`: Buena correspondencia
- `80–100`: Alta correspondencia

---

## 4. Patrimonio Científico Pre-cargado (7 Proyectos Reales)

1. **LABSIE-P01**: *Diseño de tareas para el desarrollo del pensamiento crítico en un sistema tutor mediado por inteligencia artificial*.
2. **LABSIE-P02**: *CARINA MIRROR Test: un benchmark conductual para la Metacognición Artificial en LLMs*.
3. **LABSIE-P03**: *Marco metodológico COIL-AC basado en retos computacionales con anclaje cultural para la colaboración intercultural en la Licenciatura en Informática de la Universidad de Córdoba*.
4. **LABSIE-P04**: *Análisis de indicadores dinámicos de Knowledge Tracing para la predicción temprana del riesgo de bajo desempeño académico*.
5. **LABSIE-P05**: *Negociación del control pedagógico: Planificación educativa con inteligencia artificial generativa*.
6. **LABSIE-P06**: *Aplicación de un sistema de retroalimentación inteligente basado en Knowledge Tracing en el aprendizaje de Tecnología e Informática de la Universidad de Córdoba*.
7. **LABSIE-P07**: *Diseño de un gemelo humano digital como un Laboratorio pedagógico para la simulación y caracterización de estudiantes de octavo grado en la Institución Educativa Guillermo Valencia*.

> **Rigor Académico**: En estricto cumplimiento de los principios éticos, los campos empíricos que no cuentan con datos consolidados se rotulan explícitamente como *"Información pendiente de completar por el administrador"*, sin invención de resultados ficticios.

---

## 5. Arquitectura Técnica

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Tipografías**: *Lora* (títulos editoriales) y *DM Sans* (interfaz y datos).
- **Generación Documental**:
  - `jspdf`: Generación de informes académicos formales en formato PDF.
  - `docx`: Generación de informes editables en formato Microsoft Word `.docx`.
- **Capa de Persistencia**: Servicio reactivo compatible con Firestore (`src/services/storageService.ts`), con sincronización en `localStorage` y soporte para exportación/importación.
- **Capa Híbrida de IA**: `src/services/aiService.ts` implementa el patrón decoupled para enriquecimiento semántico mediante `@google/genai` manteniendo funcionamiento autónomo garantizado sin API Key.

---

## 6. Panel Administrativo

Permite a la coordinación del semillero:
- Visualizar métricas del panorama investigativo.
- Gestionar estudiantes con estados: *Pendiente de revisión, En análisis, Pertinente, Nueva propuesta, Requiere entrevista, Sin correspondencia*.
- Inspeccionar el dossier de 10 secciones de cada estudiante.
- Registrar resoluciones institucionales: asignación de línea, proyecto, tutor, prioridad y comentarios.
- Descargar informes oficiales en PDF y DOCX con la resolución administrativa integrada.
- Gestión completa (CRUD) de Proyectos y Líneas de investigación con integración en caliente al motor de recomendación.
