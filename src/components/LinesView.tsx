import React from 'react';
import { CheckCircle, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { ResearchProject } from '../types';

/** Sección "Líneas": las cinco líneas oficiales de investigación de LabSIE y sus proyectos insignia. */
export const LinesView: React.FC<{ projects: ResearchProject[]; onExploreHeritage: () => void }> = ({ projects, onExploreHeritage }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* Las 5 Líneas de Investigación Oficiales */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 rounded-2xl bg-[#FFFDF9]/90 backdrop-blur-md border border-[#CCD4CF] shadow-xs px-4 py-5 sm:px-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-bold uppercase tracking-wider border border-[#A7F3D0]">
            <Layers className="w-3.5 h-3.5" />
            Estructura Epistemológica LabSIE · EduTLAN
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F]" style={{ color: '#24302F' }}>
            Las Cinco Líneas Oficiales de Investigación
          </h2>
          <p className="text-sm md:text-base text-[#526066] leading-relaxed">
            El Semillero LabSIE y el Grupo EduTLAN (Categoría A MinCiencias) desarrollan su labor científica
            alrededor de <strong className="text-[#059669]">cinco líneas oficiales de investigación</strong> en la Licenciatura en Informática (incluyendo la línea de vanguardia en <em>Artificial Metacognition</em>):
          </p>
        </div>

        {/* Grid de las 4 líneas con diseño enriquecido para todas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Línea 1 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 01
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-diseno-sistemas-inteligentes').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Diseño e implementación de sistemas inteligentes para la educación
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Investigación orientada al diseño, modelado e implementación de sistemas inteligentes, agentes tutores y herramientas computacionales aplicadas a la educación, integrando inteligencia artificial con pedagogía.
                </p>
              </div>

              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>
                
                {/* LABSIE-P06 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P06</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🎯 Sistemas Tutores & Resolución de Problemas
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Diseño de un modelo de actividades de aprendizaje para un sistema tutor inteligente
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Estructuración pedagógica de tareas para un STI orientado a potenciar habilidades cognitivas superiores y competencias del siglo XXI (Diaz Arteaga, 2024).
                  </p>
                </div>

                {/* LABSIE-P20 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P20</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🧪 Benchmarking Experimental en LLMs
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    CARINA MIRROR Test: un benchmark conductual para la Metacognición Artificial en LLMs
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Protocolos experimentales de sondeo y perturbación para medir autoconocimiento, calibración y detección de errores en IA.
                  </p>
                </div>

                {/* LABSIE-P19 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P19</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      📐 Investigación Basada en Diseño (DBR)
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Diseño de tareas para el desarrollo del pensamiento crítico en un sistema tutor mediado por IA
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Ciclos iterativos de prototipado pedagógico y validación con usuarios para andamiar inferencias y argumentación crítica.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Sistemas Inteligentes', 'Tutorías Adaptativas', 'Metacognición', 'CARINA', 'Resolución de Problemas', 'LLMs'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Línea 2 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 02
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-entornos-virtuales-adaptativos').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Desarrollo de entornos de aprendizaje virtuales y adaptativos
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Desarrollo de entornos y plataformas virtuales que se adaptan a las necesidades del estudiante, ambientes híbridos de aprendizaje y espacios colaborativos con anclaje cultural y metodológico.
                </p>
              </div>

              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>

                {/* LABSIE-P01 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P01</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🎮 Gamificación Rural & Didáctica
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Estrategia didáctica mediante la gamificación en área de informática de zonas rurales
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Mecánicas lúdicas aplicadas a la superación de brechas digitales en instituciones de Córdoba (Mangones & Banquez, 2024).
                  </p>
                </div>

                {/* LABSIE-P21 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P21</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      👥 Metodología Mixta & Gemelo Digital
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Diseño de un gemelo humano digital como Laboratorio pedagógico (IE Guillermo Valencia)
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Caracterización etnográfica y modelado multi-agente para permitir a futuros docentes simular escenarios de aula secundaria.
                  </p>
                </div>

                {/* LABSIE-P22 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P22</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🌐 PLN & Traducción Intercultural
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Traductor estadístico y computacional para la lengua nativa Embera Katío del Alto Sinú
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Herramientas de Procesamiento de Lenguaje Natural para la conservación, enseñanza y revitalización de la lengua ancestral indígena.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Entornos Virtuales', 'Gamificación', 'Anclaje Cultural', 'Gemelo Digital', 'Embera Katío', 'TreeScanEdu'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Línea 3 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 03
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-analisis-datos-educativos').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Análisis de datos educativos para la mejora de la enseñanza
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Modelado y análisis de datos educativos masivos y de interacción para detectar dificultades a tiempo, monitorear trayectorias de aprendizaje y brindar soporte fundamentado a la toma de decisiones docentes.
                </p>
              </div>

              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>

                {/* LABSIE-P03 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P03</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      📈 Cadenas de Markov & EDM
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Análisis longitudinal de patrones de compromiso mediante cadenas de Markov
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Modelos probabilísticos para analizar transiciones estocásticas de rendimiento durante la pandemia (Marchena & Medrano, 2024).
                  </p>
                </div>

                {/* LABSIE-P23 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P23</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      📊 Knowledge Tracing & Predicción Temprana
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Análisis de indicadores dinámicos de Knowledge Tracing para la predicción temprana
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Modelado cuantitativo empírico de series temporales para alertar oportunamente sobre vacíos antes de evaluaciones sumativas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Knowledge Tracing', 'Cadenas de Markov', 'Predicción Temprana', 'Modelado Dinámico', 'EDM'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Línea 4 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#10B981] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 04
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-ia-aprendizaje-personalizado').length} Proyectos Activos
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#24302F]" style={{ color: '#24302F' }}>
                  Aplicación de la inteligencia artificial en el aprendizaje personalizado
                </h3>
                <p className="text-xs md:text-sm text-[#3F4E4C] leading-relaxed mt-1.5 font-normal">
                  Aplicación e integración de modelos de IA y tecnologías generativas en la personalización del aprendizaje, retroalimentación formativa inmediata y dinámica de agencia docente.
                </p>
              </div>
              
              {/* Proyectos patrimoniales con diseño uniforme */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>

                {/* LABSIE-P04 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P04</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🤖 Asistente STEAM & Neurocognición
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Asistente inteligente para actividades STEAM y desarrollo neurocognitivo
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Estructuración de actividades STEAM respetando las etapas cognitivas de estudiantes de primer grado (Bedoya & Alegría, 2025).
                  </p>
                </div>

                {/* LABSIE-P24 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P24</span>
                    <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold border border-[#FCD34D]">
                      🧭 Teoría Fundamentada Constructivista (Kathy Charmaz)
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Negociación del control pedagógico: Planificación educativa con inteligencia artificial generativa
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Investigación fundamentada para modelar la tensión entre delegación y autonomía al co-diseñar con IA.
                  </p>
                </div>

                {/* LABSIE-P25 */}
                <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P25</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                      🔬 Diseño Cuasi-experimental
                    </span>
                  </div>
                  <strong className="text-[#24302F] block text-xs md:text-sm">
                    Sistema de retroalimentación inteligente basado en Knowledge Tracing en Tecnología e Informática
                  </strong>
                  <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                    Evaluación cuasi-experimental con grupo control y experimental para diagnosticar vacíos y personalizar retroalimentación en tiempo real.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Teoría Fundamentada', 'Control Pedagógico', 'IA Generativa', 'Retroalimentación', 'Agencia Docente'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Línea 5: Artificial Metacognition (Línea transversal de frontera en IA) */}
          <div className="md:col-span-2 p-6 md:p-8 rounded-2xl bg-[#FFFDF9] border-2 border-[#10B981] shadow-md hover:border-[#059669] transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#ECFDF5] border-b-2 border-l-2 border-[#A7F3D0] rounded-bl-2xl text-[11px] font-bold text-[#065F46] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Línea de Frontera en IA & Agentes Autónomos</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-[#059669] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider">
                  Línea 05
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  {projects.filter(p => p.lineId === 'line-artificial-metacognition').length} Proyectos Activos
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl md:text-2xl text-[#1C2624]">
                  Artificial Metacognition
                </h3>
                <p className="text-xs md:text-sm text-[#24302F] leading-relaxed mt-2 font-normal">
                  Artificial Metacognition es la línea de investigación centrada en <strong>sistemas de metacognición endógena en IA</strong>. Define la capacidad de los agentes artificiales de monitorear, evaluar y regular autónomamente su razonamiento mediante una interacción estructurada y auditable entre el <strong>Object Level</strong> (ejecución) y el <strong>Meta Level</strong> (monitoreo y control). Integra y unifica <em>CPCC, Meta-DNA, Dendritic Metacognition (DMA), MARINA-10, MetaLingua++, Cortico-Claustrum, Explainable Control e IM-Onto</em>.
                </p>
              </div>

              {/* Pilares Unificados */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] text-xs space-y-2">
                <span className="font-bold text-[#059669] uppercase tracking-wider text-[11px] block">
                  Framework Unificado de Metacognición Endógena:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#FFFDF9] border border-[#CCD4CF]">
                    <strong className="text-[#059669] block">Object vs Meta Level</strong>
                    <span>Bucle auditable de ejecución, autovigilancia y control.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFFDF9] border border-[#CCD4CF]">
                    <strong className="text-[#059669] block">CPCC & Cortico-Claustrum</strong>
                    <span>Protocolo de comunicación cortical para control explicable.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFFDF9] border border-[#CCD4CF]">
                    <strong className="text-[#059669] block">Meta-DNA & DMA</strong>
                    <span>Metacognición dendrítica y autorregulación sináptica.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFFDF9] border border-[#CCD4CF]">
                    <strong className="text-[#059669] block">MARINA-10 & IM-Onto</strong>
                    <span>MetaLingua++ y ontología formal para auditoría de razonamiento.</span>
                  </div>
                </div>
              </div>

              {/* Proyectos patrimoniales */}
              <div className="pt-2 border-t border-[#CCD4CF] space-y-2.5 text-xs">
                <span className="font-bold text-[#059669] block uppercase tracking-wider text-[11px]">Investigaciones Destacadas:</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {/* LABSIE-P20 */}
                  <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P20</span>
                      <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                        🧪 CARINA MIRROR Test
                      </span>
                    </div>
                    <strong className="text-[#24302F] block text-xs md:text-sm">
                      Benchmark conductual para la Metacognición Artificial en LLMs
                    </strong>
                    <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                      Protocolos de perturbación para medir autoconocimiento, calibración y detección de alucinaciones en modelos fundacionales.
                    </p>
                  </div>

                  {/* LABSIE-P26 */}
                  <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P26</span>
                      <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                        🧠 Cortico-Claustrum & CPCC
                      </span>
                    </div>
                    <strong className="text-[#24302F] block text-xs md:text-sm">
                      Protocolo CPCC para control metacognitivo explicable en agentes IA
                    </strong>
                    <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                      Arbitraje bioinspirado entre Object Level y Meta Level para justificación auditable de inferencias en aula.
                    </p>
                  </div>

                  {/* LABSIE-P27 */}
                  <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P27</span>
                      <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                        🧬 Meta-DNA & DMA
                      </span>
                    </div>
                    <strong className="text-[#24302F] block text-xs md:text-sm">
                      Dendritic Metacognition (DMA) y autorregulación sináptica en educación
                    </strong>
                    <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                      Adaptación dinámica de heurísticas didácticas según el historial de razonamiento interno del tutor virtual.
                    </p>
                  </div>

                  {/* LABSIE-P28 */}
                  <div className="p-3.5 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF] hover:border-[#10B981] transition-colors space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#FFFDF9] text-[10px] font-bold">LABSIE-P28</span>
                      <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                        📜 MARINA-10 & IM-Onto
                      </span>
                    </div>
                    <strong className="text-[#24302F] block text-xs md:text-sm">
                      MetaLingua++ y ontología formal IM-Onto para auditoría de razonamiento
                    </strong>
                    <p className="text-[11px] text-[#3F4E4C] leading-relaxed">
                      Sintaxis formal e introspección semántica para verificar trayectorias cognitivas en agentes educativos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#CCD4CF] flex flex-wrap gap-1.5">
              {['Object Level', 'Meta Level', 'CPCC', 'Meta-DNA', 'DMA', 'MARINA-10', 'MetaLingua++', 'Cortico-Claustrum', 'Explainable Control', 'IM-Onto', 'Metacognición Endógena'].map(k => (
                <span key={k} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F7F3ED] text-[#059669] border border-[#CCD4CF]">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Nota Institucional Aclaratoria sobre Líneas vs Modalidades */}
        <div className="p-4 md:p-5 rounded-xl bg-[#F7F3ED] border-2 border-[#A7F3D0] text-xs md:text-sm text-[#24302F] flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#059669] block mb-0.5">Clarificación Epistemológica:</strong>
            LabSIE cuenta con estas <strong className="text-[#059669]">cinco líneas de investigación oficiales</strong> (incluyendo la línea de frontera en <em>Artificial Metacognition</em>). Las figuras siguientes (<em>Heredar, Conectar, Trascender y Explorar</em>) no son líneas de investigación; corresponden a las <strong className="text-[#059669]">modalidades de trayectoria</strong> mediante las cuales puedes vincular tu propio perfil a los proyectos del semillero.
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onExploreHeritage}
          className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#059669] text-[#FFFDF9] text-sm font-bold hover:bg-[#047857] transition-colors shadow-sm"
        >
          Ver todos los proyectos <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
