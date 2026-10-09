import React from 'react';
import { ArrowRight, Compass, Library, Sparkles, Layers, Lock, Brain, Gamepad2, BarChart3, GraduationCap, Clock } from 'lucide-react';
import { ResearchProject, ResearchLine } from '../types';

interface WelcomeViewProps {
  onStartTest: () => void;
  onExploreHeritage: () => void;
  onExploreLines?: () => void;
  projects: ResearchProject[];
  lines?: ResearchLine[];
  isTestUnlocked?: boolean;
  onOpenWelcomeModal?: () => void;
  onActivateRoute?: () => void;
  onDeactivateRoute?: () => void;
}

const INTERESTS = [
  { icon: Brain, label: 'Inteligencia Artificial' },
  { icon: Gamepad2, label: 'Videojuegos y entornos virtuales' },
  { icon: BarChart3, label: 'Analítica de datos' },
  { icon: GraduationCap, label: 'Innovación didáctica' }
];

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartTest,
  onExploreHeritage,
  onExploreLines,
  projects,
  lines = [],
  isTestUnlocked = false,
  onOpenWelcomeModal
}) => {
  const handlePrimary = () => {
    if (!isTestUnlocked) onOpenWelcomeModal?.();
    else onStartTest();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12 space-y-10 md:space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FFFDF9]/92 backdrop-blur-md border-2 border-[#E8D5B5] shadow-lg">
        <div className="h-1.5 bg-gradient-to-r from-[#36e0d0] via-[#ffcf3f] to-[#ff5d8f]" aria-hidden="true" />
        <div className="p-5 sm:p-8 md:p-12">
          <div className="space-y-5 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Convocatoria abierta · Licenciatura en Informática
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2D1A0B] leading-tight text-balance">
              Te invitamos a ser parte del <span className="text-[#047857]">Semillero LabSIE</span>
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#7A4D27] font-semibold">
              De tu curiosidad personal a una ruta de investigación real en el Grupo EduTLAN.
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-left">
              {INTERESTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF3E6] border border-[#E8D5B5] text-xs font-semibold text-[#4A2D16]">
                  <Icon className="w-4 h-4 text-[#047857] shrink-0" />
                  <span className="leading-tight">{label}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
              <button
                type="button"
                onClick={handlePrimary}
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#059669] text-[#FFFDF9] font-bold text-sm sm:text-base hover:bg-[#047857] transition-all shadow-md group"
              >
                {isTestUnlocked ? <Sparkles className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                <span>{isTestUnlocked ? 'Ir al test de exploración' : 'Quiero ingresar'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                onClick={onExploreHeritage}
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-[#E8D5B5] bg-[#FFFDF9] text-[#2D1A0B] font-bold text-sm hover:border-[#059669] hover:bg-[#ECFDF5] transition-all"
              >
                <Library className="w-5 h-5 text-[#059669]" />
                <span>Ver {projects.length} proyectos</span>
              </button>
            </div>
            <p className="text-[11px] sm:text-xs text-[#7A4D27] font-medium">
              El test se activa cuando decides ingresar al semillero.
            </p>
            <p className="text-xs text-[#4A2D16] pt-2 border-t border-[#E8D5B5]">
              Laboratorio de Sistemas Inteligentes en Educación · Grupo EduTLAN, <strong>Categoría A MinCiencias</strong> ·
              Universidad de Córdoba
            </p>
          </div>
        </div>
      </section>

      {/* Visual Flow Representation with strong defined borders */}
      <section className="p-5 sm:p-8 md:p-10 rounded-3xl bg-[#FFFDF9]/95 border-2 border-[#E8D5B5] shadow-sm">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
            Dinámica del Sistema de Orientación
          </span>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
            De la curiosidad personal al patrimonio científico
          </h2>
        </div>

        {/* Flow diagram steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-[#FAF3E6] border border-[#E8D5B5] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              01
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Tú</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Tus experiencias previas, saberes en informática y formas intuitivas de encarar interrogantes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-[#FAF3E6] border border-[#E8D5B5] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              02
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Intereses</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Tus curiosidades sobre IA, cognición, analítica, diseño didáctico y desafíos socioculturales.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-[#FAF3E6] border border-[#E8D5B5] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              03
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Investigación</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Cruce con la memoria científica de LabSIE: problemas resueltos, conceptos y preguntas abiertas.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-xl bg-[#FAF3E6] border border-[#E8D5B5] flex flex-col items-center text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#C79A52] text-[#FFFDF9] flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              04
            </div>
            <span className="font-serif font-bold text-[#24302F] text-lg" style={{ color: '#24302F' }}>Nuevas Posibilidades</span>
            <p className="mt-2 text-xs text-[#526066] leading-relaxed font-medium">
              Rutas concretas para heredar, conectar, trascender o explorar una propuesta con respaldo docente.
            </p>
          </div>
        </div>

        {/* Philosophical Banner */}
        <div className="mt-8 pt-6 border-t-2 border-[#CCD4CF] text-center">
          <blockquote className="font-serif italic text-base md:text-lg font-bold text-[#059669]">
            "Investigar no es empezar de cero. Es saber desde dónde continuar."
          </blockquote>
        </div>
      </section>

      {/* Acceso a la sección de Líneas */}
      <section className="rounded-3xl bg-[#2D1A0B]/90 backdrop-blur-md text-[#FFFDF9] p-5 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#ffcf3f]">
            <Layers className="w-4 h-4" /> Líneas de investigación
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF9]" style={{ color: "#FFFDF9" }}>{lines.length || 5} líneas oficiales para investigar</h2>
          <p className="text-sm text-[#F3DCB4] max-w-xl">
            Desde la analítica del aprendizaje hasta la metacognición artificial: conoce en qué trabaja el semillero y qué
            proyectos ya existen en cada línea.
          </p>
        </div>
        <button
          type="button"
          onClick={onExploreLines}
          className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#ffcf3f] text-[#2D1A0B] font-bold text-sm hover:bg-[#ffe07a] transition-colors"
        >
          <Compass className="w-5 h-5" /> Explorar las líneas
        </button>
      </section>

      {/* The 4 Trajectory Modes Preview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto rounded-2xl bg-[#FFFDF9]/90 backdrop-blur-md border border-[#CCD4CF] shadow-xs px-4 py-5 sm:px-6">
          <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
            Modalidades de Recomendación
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#24302F] mt-1" style={{ color: '#24302F' }}>
            Cuatro formas de vincularte con LabSIE
          </h2>
          <p className="text-sm text-[#526066] mt-2 font-medium">
            La plataforma no dictamina un destino rígido; identifica posibilidades según tu afinidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🧬</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Heredar</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Continúa o profundiza una investigación existente que cuenta con datos y preguntas abiertas
                documentadas.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Profundización científica
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Conectar</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Articula dos o más proyectos del semillero en una intersección fértil (ej. analítica de datos +
                retroalimentación inteligente).
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Cruce interdisciplinar
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🌱</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Trascender</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Nace de la memoria investigativa del semillero pero abre una dirección totalmente nueva,
                otra población o contexto.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Nueva propuesta situada
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm flex flex-col justify-between hover:border-[#10B981] transition-all">
            <div>
              <div className="text-2xl mb-2">🧭</div>
              <h3 className="font-serif font-bold text-lg text-[#059669]">Explorar</h3>
              <p className="text-xs text-[#1C2624] mt-2 leading-relaxed font-medium">
                Tus inquietudes aún no convergen con las líneas activas. No se descarta tu idea: se propone
                diálogo y maduración.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t-2 border-[#CCD4CF] text-xs font-bold text-[#059669]">
              Entrevista y diálogo formativo
            </span>
          </div>
        </div>
      </section>
      {/* Horario de Atención - Formato Tabla */}
      <section className="relative overflow-hidden rounded-3xl bg-[#F7F9F8] border border-[#E5E9E6] shadow-sm p-6 sm:p-8 md:p-10 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-10">
          <div className="w-20 h-20 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E5E9E6]">
            <Clock className="w-10 h-10 text-[#305C55]" strokeWidth={1.5} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#203D37]">
              Horario de atención
            </h2>
            <p className="text-[#596F69] text-base md:text-lg font-medium mt-1">
              Encuentro en el Semillero con el Director Manuel Fernando Caro Piñeres
            </p>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10 rounded-xl shadow-sm border border-[#D5DDD9] bg-white">
          <table className="w-full text-center text-sm md:text-base border-collapse min-w-[700px]">
            <thead>
              <tr className="text-white">
                <th className="bg-[#244941] font-bold p-4 border-r border-[#305C55]/50 whitespace-nowrap w-[220px]">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" /> Hora
                  </div>
                </th>
                <th className="bg-[#305C55] font-bold p-4 border-r border-[#41746B]/50 w-[16%]">Lunes</th>
                <th className="bg-[#305C55] font-bold p-4 border-r border-[#41746B]/50 w-[16%]">Martes</th>
                <th className="bg-[#305C55] font-bold p-4 border-r border-[#41746B]/50 w-[16%]">Miércoles</th>
                <th className="bg-[#305C55] font-bold p-4 border-r border-[#41746B]/50 w-[16%]">Jueves</th>
                <th className="bg-[#305C55] font-bold p-4 w-[16%]">Viernes</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Row 1 */}
              <tr className="border-b border-[#E5E9E6]">
                <td className="p-4 font-bold text-[#425953] bg-[#F9FAFA]">8:00 a. m. – 10:00 a. m.</td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#E6EFEA] border-x border-white">
                  <div className="flex flex-col items-center justify-center gap-1 font-bold text-[#305C55]">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#305C55]"></div> Atención</div>
                    <span className="text-[11px] font-normal text-[#41746B]">(9:00 - 10:00)</span>
                  </div>
                </td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#E6EFEA] border-l border-white">
                  <div className="flex flex-col items-center justify-center gap-1 font-bold text-[#305C55]">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#305C55]"></div> Atención</div>
                    <span className="text-[11px] font-normal text-[#41746B]">(9:00 - 10:00)</span>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="border-b border-[#E5E9E6]">
                <td className="p-4 font-bold text-[#425953] bg-[#F9FAFA]">10:00 a. m. – 12:00 m.</td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
              </tr>
              {/* Row 3 */}
              <tr className="border-b border-[#E5E9E6]">
                <td className="p-4 font-bold text-[#425953] bg-[#F9FAFA]">2:00 p. m. – 4:00 p. m.</td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#E6EFEA] border-x border-white">
                  <div className="flex flex-col items-center justify-center gap-1 font-bold text-[#305C55]">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#305C55]"></div> Atención</div>
                    <span className="text-[11px] font-normal text-[#41746B]">(3:00 - 4:00)</span>
                  </div>
                </td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
              </tr>
              {/* Row 4 */}
              <tr>
                <td className="p-4 font-bold text-[#425953] bg-[#F9FAFA]">4:00 p. m. – 6:00 p. m.</td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
                <td className="p-4 bg-[#F2F5F4]"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Decoraciones visuales abstractas similares a la imagen */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EBE0C9] rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C8DCD5] rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      </section>
    </div>
  );
};
