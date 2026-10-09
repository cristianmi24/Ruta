import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  CheckCircle,
  ExternalLink,
  Sparkles,
  GitFork,
  ArrowRight,
  Info,
  Layers,
  Compass,
  Cpu,
  GraduationCap,
  Users,
  Lightbulb,
  CheckCircle2,
  Table as TableIcon,
  Eye,
  BookOpen,
  Award,
  Copy,
  Check,
  Star,
  Zap,
  Globe,
  Code2,
  Heart,
  Terminal,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { AnalysisResult, RouteType, AnalysisPerspective, ProposedProjectOption } from '../types';
import { generatePDFReport, generateDOCXReport } from '../services/documentGenerator';
import { CLOSING_MESSAGE } from '../data/closingMessage';
import { getProjectMethodology } from '../data/projectMetadata';
import { storageService } from '../services/storageService';
import { LabSIELogo } from './LabSIELogo';
import { EduTLANLogo } from './EduTLANLogo';

interface ResultsViewProps {
  analysis: AnalysisResult;
  onExploreHeritage: () => void;
  onRetakeTest: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  analysis,
  onExploreHeritage,
  onRetakeTest
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'docx' | null>(null);
  const [selectedPerspectiveId, setSelectedPerspectiveId] = useState<'tecnologico' | 'pedagogico' | 'social'>(
    analysis.selectedPerspectiveId || 'tecnologico'
  );
  const [viewMode, setViewMode] = useState<'detail' | 'compare'>('detail');
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    analysis.selectedProjectOptionId || 'opcion-1'
  );
  const [selectedSuccessBanner, setSelectedSuccessBanner] = useState<string | null>(null);

  // Fallback if perspectives aren't pre-generated
  const perspectives: AnalysisPerspective[] = analysis.perspectives || [
    {
      id: 'tecnologico',
      title: 'Enfoque Tecnológico y Prototipado con IA',
      badge: '💻 Sistemas Inteligentes & Software Educativo',
      icon: '💻',
      shortDescription: 'Orientado al desarrollo de software educativo, algoritmos de IA (LLMs, agentes pedagógicos), analítica y prototipado.',
      focusArea: 'Ingeniería de Software Educativo, Inteligencia Artificial y Analítica',
      archetype: 'El Arquitecto de Sistemas Inteligentes y Prototipos Educativos',
      routeType: analysis.routeType,
      correspondenceScore: analysis.correspondenceScore,
      correspondenceLevel: analysis.correspondenceLevel,
      primaryLineId: analysis.primaryLineId,
      primaryLineName: analysis.primaryLineName,
      methodologyFocus: {
        type: 'Design-Based Research (DBR) & Prototipado Ágil',
        icon: '⚡',
        description: 'Metodología iterativa que combina diseño de software educativo, IA, pruebas con usuarios en laboratorio y validación.'
      },
      whyExplanation: analysis.whyExplanation,
      keyStrengths: [
        'Habilidades en código, algoritmos y diseño de sistemas',
        'Curiosidad por modelos LLM y agentes pedagógicos',
        'Capacidad para prototipar herramientas funcionales'
      ],
      relatedProjects: analysis.relatedProjects,
      proposedProject: analysis.proposedProject
    }
  ];

  // 3 Project Options
  const projectOptions: ProposedProjectOption[] = analysis.proposedProjectOptions && analysis.proposedProjectOptions.length > 0
    ? analysis.proposedProjectOptions
    : [
        {
          id: 'opcion-1',
          optionNumber: 1,
          badge: 'Opción 1 · Innovación Tecnológica & IA',
          icon: '🤖',
          category: 'Tecnológico & IA',
          tentativeTitle: analysis.proposedProject?.tentativeTitle || 'Desarrollo de un tutor inteligente asistido por IA para informática',
          tentativeQuestion: analysis.proposedProject?.tentativeQuestion || '¿Cómo optimiza un sistema inteligente la retroalimentación en programación?',
          tentativeObjective: analysis.proposedProject?.tentativeObjective || 'Diseñar e implementar un prototipo interactivo con analítica de aprendizaje.',
          centralConcepts: ['Inteligencia Artificial', 'Software Educativo', 'Analítica de Datos', 'Tutoría Adaptativa'],
          possibleContextPopulation: 'Estudiantes de Programación de la Licenciatura en Informática (Universidad de Córdoba)',
          methodology: {
            name: 'Design-Based Research (DBR) & Prototipado de Software',
            description: 'Ciclos de diseño técnico, integración de APIs de IA y pruebas de usabilidad con usuarios.'
          },
          whyThisOption: 'Surge de tus respuestas orientadas al modelado algorítmico, programación y curiosidad por herramientas inteligentes.',
          possibleContribution: 'Prototipo de software educativo funcional en código abierto para el semillero LabSIE.',
          nextSteps: ['Revisión de arquitectura técnica', 'Sprint de desarrollo de prototipo', 'Pruebas en laboratorio']
        },
        {
          id: 'opcion-2',
          optionNumber: 2,
          badge: 'Opción 2 · Innovación Didáctica & Aula',
          icon: '📖',
          category: 'Didáctico & Aula',
          tentativeTitle: 'Secuencia didáctica mediada por pensamiento computacional para la superación de obstáculos en el aula escolar',
          tentativeQuestion: '¿Cómo incide una secuencia didáctica gamificada en la comprensión algorítmica de estudiantes escolares de Córdoba?',
          tentativeObjective: 'Diseñar y validar una secuencia didáctica situada que potencie el pensamiento computacional en básica o media.',
          centralConcepts: ['Didáctica de la Informática', 'Pensamiento Computacional', 'Secuencia de Aprendizaje', 'Evaluación Formativa'],
          possibleContextPopulation: 'Estudiantes y docentes de instituciones educativas de básica y media de Córdoba',
          methodology: {
            name: 'Investigación-Acción Pedagógica (IAPed) & Métodos Mixtos',
            description: 'Diagnóstico en el aula escolar, diseño de unidades de aprendizaje y evaluación del progreso cognitivo.'
          },
          whyThisOption: 'Surge de tu interés en la transposición didáctica, la mediación docente y el impacto pedagógico en los estudiantes.',
          possibleContribution: 'Unidades didácticas validadas e instrumentos formativos para la enseñanza de la computación.',
          nextSteps: ['Mapeo de dificultades curriculares', 'Diseño de la secuencia lúdica', 'Validación con docentes de EduTLAN']
        },
        {
          id: 'opcion-3',
          optionNumber: 3,
          badge: 'Opción 3 · Apropiación Social & Impacto Regional',
          icon: '🌐',
          category: 'Social & Comunitario',
          tentativeTitle: 'Estrategia comunitaria de apropiación de tecnologías educativas y pensamiento computacional en zonas rurales de Córdoba',
          tentativeQuestion: '¿Qué modelo de apropiación social tecnológica permite mitigar las brechas digitales en colegios rurales con baja conectividad?',
          tentativeObjective: 'Estructurar y evaluar una estrategia participativa de apropiación tecnológica comunitaria en el departamento de Córdoba.',
          centralConcepts: ['Apropiación Social', 'Brecha Digital Rural', 'Tecnologías Abiertas', 'Ética e Inclusión'],
          possibleContextPopulation: 'Comunidades educativas rurales y periurbanas del departamento de Córdoba',
          methodology: {
            name: 'Investigación Acción Participativa (IAP) & Estudio de Casos',
            description: 'Trabajo directo con la comunidad escolar, codiseño de soluciones y sistematización del impacto territorial.'
          },
          whyThisOption: 'Surge de tu visión crítica hacia la equidad territorial, inclusión educativa y la responsabilidad social universitaria.',
          possibleContribution: 'Modelo replicable de extensión e investigación formativa para políticas públicas educativas del Caribe.',
          nextSteps: ['Diagnóstico territorial con líderes escolares', 'Talleres participativos de diseño', 'Sistematización de impacto']
        }
      ];

  const activePerspective = perspectives.find(p => p.id === selectedPerspectiveId) || perspectives[0];
  const activeOption = projectOptions.find(o => o.id === selectedOptionId) || projectOptions[0];

  const handleSelectOptionAsPreferred = (optId: string) => {
    setSelectedOptionId(optId);
    storageService.updateSelectedProjectOption(analysis.id, optId);
    setSelectedSuccessBanner(`¡Excelente elección! Has seleccionado la "${projectOptions.find(o => o.id === optId)?.badge}" como tu propuesta de investigación preferida.`);
    setTimeout(() => setSelectedSuccessBanner(null), 5000);
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingFormat('pdf');
      const customAnalysis: AnalysisResult = {
        ...analysis,
        routeType: activePerspective.routeType,
        correspondenceScore: activePerspective.correspondenceScore,
        correspondenceLevel: activePerspective.correspondenceLevel,
        profileArchetype: activePerspective.archetype,
        primaryLineName: activePerspective.primaryLineName,
        relatedProjects: activePerspective.relatedProjects,
        whyExplanation: activePerspective.whyExplanation,
        proposedProject: {
          tentativeTitle: activeOption.tentativeTitle,
          tentativeQuestion: activeOption.tentativeQuestion,
          tentativeObjective: activeOption.tentativeObjective,
          centralConcepts: activeOption.centralConcepts,
          possibleContextPopulation: activeOption.possibleContextPopulation,
          possibleContribution: activeOption.possibleContribution,
          nextSteps: activeOption.nextSteps,
          statusLabel: 'PROPUESTA SELECCIONADA POR EL ESTUDIANTE'
        },
        proposedProjectOptions: projectOptions,
        selectedProjectOptionId: selectedOptionId
      };
      await generatePDFReport(customAnalysis, { includeAdminSection: false });
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadDOCX = async () => {
    try {
      setDownloadingFormat('docx');
      const customAnalysis: AnalysisResult = {
        ...analysis,
        routeType: activePerspective.routeType,
        correspondenceScore: activePerspective.correspondenceScore,
        correspondenceLevel: activePerspective.correspondenceLevel,
        profileArchetype: activePerspective.archetype,
        primaryLineName: activePerspective.primaryLineName,
        relatedProjects: activePerspective.relatedProjects,
        whyExplanation: activePerspective.whyExplanation,
        proposedProject: {
          tentativeTitle: activeOption.tentativeTitle,
          tentativeQuestion: activeOption.tentativeQuestion,
          tentativeObjective: activeOption.tentativeObjective,
          centralConcepts: activeOption.centralConcepts,
          possibleContextPopulation: activeOption.possibleContextPopulation,
          possibleContribution: activeOption.possibleContribution,
          nextSteps: activeOption.nextSteps,
          statusLabel: 'PROPUESTA SELECCIONADA POR EL ESTUDIANTE'
        },
        proposedProjectOptions: projectOptions,
        selectedProjectOptionId: selectedOptionId
      };
      await generateDOCXReport(customAnalysis, { includeAdminSection: false });
    } catch (e) {
      console.error('Error generating DOCX:', e);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const getRouteBadge = (route: RouteType) => {
    switch (route) {
      case 'HEREDAR':
        return {
          icon: '🧬',
          name: 'Heredar',
          subtitle: 'Profundizar una investigación existente con memoria científica acumulada.',
          colorClass: 'text-[#059669] border-[#10B981] bg-[#ECFDF5]'
        };
      case 'CONECTAR':
        return {
          icon: '🔗',
          name: 'Conectar',
          subtitle: 'Articular dos o más investigaciones del semillero en una intersección fértil.',
          colorClass: 'text-[#065F46] border-[#059669] bg-[#ECFDF5]'
        };
      case 'TRASCENDER':
        return {
          icon: '🌱',
          name: 'Trascender',
          subtitle: 'Apertura de una dirección novedosa inspirada en las raíces del semillero.',
          colorClass: 'text-[#C79A52] border-[#C79A52] bg-[#C79A52]/10'
        };
      case 'EXPLORAR':
      default:
        return {
          icon: '🧭',
          name: 'Explorar',
          subtitle: 'Diálogo con la coordinación para delimitar o buscar nueva línea.',
          colorClass: 'text-[#6F7976] border-[#6F7976] bg-[#6F7976]/10'
        };
    }
  };

  const routeInfo = getRouteBadge(activePerspective.routeType);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14 space-y-8">
      {/* 1. Header Institucional y Datos del Estudiante */}
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#CCD4CF] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3.5">
              <LabSIELogo size="md" className="shrink-0" />
              <div className="h-12 w-px bg-[#CCD4CF] hidden sm:block" />
              <EduTLANLogo size="md" showCategoryBadge={true} className="shrink-0" />
              <div className="border-l-2 border-[#CCD4CF] pl-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider block">
                    Semillero LabSIE · Grupo EduTLAN (Categoría A)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[10px] font-bold">
                    Ruta Oficial Activada
                  </span>
                </div>
                <span className="text-xs text-[#1C2624] font-medium">
                  Estudiante: <strong className="text-[#059669]">{analysis.studentProfile.name}</strong>
                </span>
              </div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1C2624] mt-2">
              Resultados de tu Caracterización Investigativa
            </h1>
            <p className="text-xs md:text-sm font-semibold text-[#1C2624]">
              {analysis.studentProfile.program} · Semestre {analysis.studentProfile.semester} · ✉️ {analysis.studentProfile.email}
              {analysis.studentProfile.phone && ` · 📱 ${analysis.studentProfile.phone}`}
            </p>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingFormat !== null}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl bg-[#268E6C] text-[#FFFDF9] hover:bg-[#1E785B] transition-all shadow-sm border-2 border-[#268E6C] disabled:opacity-50"
              title="Descargar informe oficial en PDF"
            >
              <Download className="w-4 h-4 text-[#FFFDF9]" />
              <span>{downloadingFormat === 'pdf' ? 'Generando PDF...' : 'Descargar PDF'}</span>
            </button>

            <button
              onClick={handleDownloadDOCX}
              disabled={downloadingFormat !== null}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl border-2 border-[#268E6C] bg-[#FFFDF9] text-[#1C2624] hover:bg-[#F2FAF6] transition-all shadow-sm disabled:opacity-50"
              title="Descargar reporte editable en Word (DOCX)"
            >
              <FileText className="w-4 h-4 text-[#268E6C]" />
              <span>{downloadingFormat === 'docx' ? 'Generando DOCX...' : 'DOCX Editable'}</span>
            </button>
          </div>
        </div>

        {/* 2. SELECTOR DE LOS 3 PUNTOS DE VISTA */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#059669]" />
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  Análisis Multidimensional de Resultados
                </span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1C2624] mt-0.5">
                3 Puntos de Vista para tu Ruta en LabSIE
              </h2>
              <p className="text-xs md:text-sm text-[#4A5568] mt-1">
                Tus respuestas fueron procesadas a través de 3 perspectivas epistemológicas complementarias de la Licenciatura en Informática. Haz clic en cada opción para ver su ruta y propuesta:
              </p>
            </div>

            {/* Toggle Detail / Compare */}
            <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#CCD4CF] self-start sm:self-auto shrink-0">
              <button
                onClick={() => setViewMode('detail')}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'detail'
                    ? 'bg-[#FFFDF9] text-[#059669] shadow-xs border border-[#CCD4CF]'
                    : 'text-[#4A5568] hover:text-[#1C2624]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vista Detallada</span>
              </button>
              <button
                onClick={() => setViewMode('compare')}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'compare'
                    ? 'bg-[#FFFDF9] text-[#059669] shadow-xs border border-[#CCD4CF]'
                    : 'text-[#4A5568] hover:text-[#1C2624]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Comparar las 3</span>
              </button>
            </div>
          </div>

          {/* 3 Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {perspectives.map((persp) => {
              const isSelected = selectedPerspectiveId === persp.id;
              return (
                <button
                  key={persp.id}
                  onClick={() => {
                    setSelectedPerspectiveId(persp.id);
                    setViewMode('detail');
                  }}
                  className={`cursor-pointer text-left rounded-2xl p-4.5 md:p-5 transition-all relative border-2 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#ECFDF5] border-[#059669] shadow-md ring-2 ring-[#059669]/20 scale-[1.01]'
                      : 'bg-[#FFFDF9] border-[#CCD4CF] hover:border-[#10B981] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{persp.icon}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#059669] text-white'
                          : 'bg-[#F0FDF4] text-[#059669] border border-[#A7F3D0]'
                      }`}>
                        {persp.correspondenceScore}% Afinidad
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#059669] block">
                        {persp.id === 'tecnologico' ? 'Opción A · Prototipado' : persp.id === 'pedagogico' ? 'Opción B · Didáctica' : 'Opción C · Transformación'}
                      </span>
                      <h3 className="font-serif font-bold text-base text-[#1C2624] leading-snug mt-0.5">
                        {persp.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-3">
                      {persp.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#CCD4CF]/70 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#059669] text-[11px]">
                      Ruta {persp.routeType}
                    </span>
                    <span className={`font-bold inline-flex items-center gap-1 ${
                      isSelected ? 'text-[#059669]' : 'text-[#6F7976]'
                    }`}>
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Seleccionado</span>
                        </>
                      ) : (
                        <span>Explorar →</span>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* REPORTE PERSONAL: carta, dónde puede entrar y qué proyectos puede hacer */}
      {analysis.qwenAnalysis && (
        <section
          aria-labelledby="personal-report-title"
          className="bg-[#FFFDF9] border-2 border-[#10B981] rounded-2xl p-5 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 border-b-2 border-[#CCD4CF] pb-4">
            <span className="p-2 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] shrink-0">
              <Heart className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#059669] font-bold block">Tu reporte de ruta investigativa</span>
              <h3 id="personal-report-title" className="font-serif text-xl sm:text-2xl font-bold text-[#1C2624]">
                Una carta para ti desde LabSIE
              </h3>
            </div>
          </div>

          {(analysis.qwenAnalysis.warmLetter || []).length > 0 && (
            <div className="space-y-3 text-sm sm:text-base text-[#24302F] leading-relaxed font-serif">
              {analysis.qwenAnalysis.warmLetter!.map((parr, i) => (
                <p key={i}>{parr}</p>
              ))}
            </div>
          )}

          {analysis.qwenAnalysis.whereYouCanEnter && (
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1.5">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#065F46]">
                <Compass className="w-4 h-4" /> Dónde puedes entrar
              </h4>
              <p className="text-xs sm:text-sm text-[#1C2624] leading-relaxed">{analysis.qwenAnalysis.whereYouCanEnter}</p>
            </div>
          )}

          {(analysis.qwenAnalysis.projectsYouCanDo || []).length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
                <Layers className="w-4 h-4" /> Proyectos en los que puedes participar
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.qwenAnalysis.projectsYouCanDo!.map(p => (
                  <li key={p.projectCode} className="p-4 rounded-xl border-2 border-[#CCD4CF] bg-[#FAF8F5] space-y-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                      {p.projectCode}
                    </span>
                    <p className="text-sm font-bold text-[#1C2624] leading-snug">{p.projectTitle}</p>
                    <p className="text-xs text-[#3F4E4C] leading-relaxed">{p.whatYouCanDo}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t-2 border-[#CCD4CF]">
            <p className="text-sm text-[#1C2624] font-serif italic">
              {analysis.qwenAnalysis.closingNote || 'Te esperamos en el semillero. Más información en edutlan.online.'}
            </p>
            <a
              href="https://edutlan.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#059669] text-[#FFFDF9] text-xs font-bold hover:bg-[#047857] transition-colors shrink-0"
            >
              <span>Visitar edutlan.online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      )}

      {/* 3. VISTA COMPARATIVA (Si viewMode === 'compare') */}
      {viewMode === 'compare' && (
        <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b-2 border-[#CCD4CF] pb-4">
            <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
              Matriz Comparativa Pedagógica
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1C2624] mt-1">
              Comparativa de los 3 Puntos de Vista para tu Trabajo de Grado
            </h2>
            <p className="text-xs md:text-sm text-[#4A5568] mt-1">
              Esta tabla te permite contrastar los tres enfoques de investigación para que decidas junto con tus docentes tutores cuál se adapta mejor a tu vocación.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F3ED] border-b-2 border-[#CCD4CF]">
                  <th className="p-3.5 font-bold text-[#1C2624] w-1/4">Dimensión / Criterio</th>
                  {perspectives.map(p => (
                    <th key={p.id} className="p-3.5 font-bold text-[#059669] w-1/4">
                      <div className="flex items-center gap-1.5">
                        <span>{p.icon}</span>
                        <span>{p.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CCD4CF]">
                <tr>
                  <td className="p-3.5 font-bold text-[#1C2624] bg-[#FAF8F5]">Foco Central</td>
                  <td className="p-3.5 text-[#24302F]">Desarrollo de software educativo, IA, LLMs y analítica de datos.</td>
                  <td className="p-3.5 text-[#24302F]">Pensamiento computacional escolar, secuencias didácticas y mediación formativa.</td>
                  <td className="p-3.5 text-[#24302F]">Brecha digital en Córdoba, inclusión territorial y ética computacional.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C2624] bg-[#FAF8F5]">Arquetipo Sugerido</td>
                  {perspectives.map(p => (
                    <td key={p.id} className="p-3.5 font-semibold text-[#059669]">{p.archetype}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C2624] bg-[#FAF8F5]">Metodología Recomendada</td>
                  {perspectives.map(p => (
                    <td key={p.id} className="p-3.5 text-[#24302F]">
                      <span className="font-bold block text-[#1C2624]">{p.methodologyFocus.type}</span>
                      <span className="text-xs text-[#4A5568]">{p.methodologyFocus.description}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C2624] bg-[#FAF8F5]">Modalidad de Ruta</td>
                  {perspectives.map(p => (
                    <td key={p.id} className="p-3.5 font-bold text-[#059669]">Ruta {p.routeType}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C2624] bg-[#FAF8F5]">Entregable de Trabajo de Grado</td>
                  <td className="p-3.5 text-[#24302F]">Prototipo funcional de software educativo, agente de IA o módulo web validado.</td>
                  <td className="p-3.5 text-[#24302F]">Secuencia didáctica validada en colegios con instrumentos de evaluación pedagógica.</td>
                  <td className="p-3.5 text-[#24302F]">Estrategia de apropiación social con sistematización de impacto en comunidades.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C2624] bg-[#FAF8F5]">Acción</td>
                  {perspectives.map(p => (
                    <td key={p.id} className="p-3.5">
                      <button
                        onClick={() => {
                          setSelectedPerspectiveId(p.id);
                          setViewMode('detail');
                        }}
                        className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#268E6C] text-[#FFFDF9] font-bold text-xs hover:bg-[#1E785B] transition-colors"
                      >
                        Ver este Detalle →
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. VISTA DETALLADA DEL PUNTO DE VISTA SELECCIONADO */}
      {viewMode === 'detail' && (
        <div className="space-y-8">
          {/* Banner del Enfoque Activo */}
          <div className="bg-[#ECFDF5] border-2 border-[#10B981] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-[#FFFDF9] rounded-xl border border-[#A7F3D0] shadow-xs">
                  {activePerspective.icon}
                </span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#059669] font-bold block">
                    Punto de Vista Activo · {activePerspective.badge}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#065F46]">
                    {activePerspective.title}
                  </h2>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#A7F3D0] text-center self-start sm:self-auto min-w-[130px]">
                <span className="text-[10px] uppercase font-bold text-[#059669] block">
                  Afinidad Específica
                </span>
                <span className="text-2xl font-serif font-bold text-[#059669]">
                  {activePerspective.correspondenceScore} / 100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#059669] font-bold block">
                  Arquetipo de Perfil
                </span>
                <p className="font-serif font-bold text-xs md:text-sm text-[#1C2624]">
                  {activePerspective.archetype}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#059669] font-bold block">
                  Línea Sugerida en EduTLAN
                </span>
                <p className="font-serif font-bold text-xs md:text-sm text-[#1C2624]">
                  {activePerspective.primaryLineName}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#059669] font-bold block">
                  Metodología Insignia
                </span>
                <p className="font-serif font-bold text-xs md:text-sm text-[#059669] truncate" title={activePerspective.methodologyFocus.type}>
                  {activePerspective.methodologyFocus.icon} {activePerspective.methodologyFocus.type}
                </p>
              </div>
            </div>

            {/* Fortalezas Clave */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#059669] font-bold block mb-2">
                Tus Fortalezas para este Enfoque:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activePerspective.keyStrengths.map((str, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2 bg-[#FFFDF9] p-3 rounded-xl border border-[#CCD4CF] text-xs text-[#24302F]">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="font-medium">{str}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trayectoria (Ruta) */}
          <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#CCD4CF] pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  Modalidad de Trayectoria Recomendada
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl">{routeInfo.icon}</span>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#24302F]">
                      Ruta {routeInfo.name}
                    </h3>
                    <p className="text-xs text-[#3F4E4C] font-medium">{routeInfo.subtitle}</p>
                  </div>
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 uppercase tracking-wide self-start sm:self-auto ${routeInfo.colorClass}`}>
                Modalidad {activePerspective.routeType}
              </span>
            </div>

            {/* ¿Por qué surge esta recomendación? */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#059669]">
                ¿Por qué surge esta orientación bajo el {activePerspective.title}?
              </h4>
              <div className="space-y-3 text-xs md:text-sm text-[#24302F] leading-relaxed">
                {activePerspective.whyExplanation.map((parr, pIdx) => (
                  <p key={pIdx}>{parr}</p>
                ))}
              </div>
            </div>
          </div>

          {/* 🤖 ANÁLISIS CIENTÍFICO Y CONTRASTE CON LOS 28 PROYECTOS MEDIANTE QWEN LLM */}
          <div className="bg-[#FFFDF9] border-2 border-[#059669] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#CCD4CF] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  <Sparkles className="w-5 h-5 text-[#10B981]" />
                </span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#059669] font-bold block">
                    Evaluación de Nuevo Integrante · Qwen LLM
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1C2624]">
                    Contraste Integral con los 28 Proyectos de LabSIE
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold font-mono">
                {analysis.qwenAnalysis?.model || 'Qwen 2.5 72B Instruct'}
              </span>
            </div>

            {/* Narrativa de contraste generada por Qwen */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF] space-y-2">
              <h4 className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                Dictamen Académico de Vinculación
              </h4>
              <p className="text-xs md:text-sm text-[#1C2624] leading-relaxed font-serif">
                {analysis.qwenAnalysis?.contrastingNarrative ||
                  'Perfil analizado y contrastado con los 28 proyectos de investigación histórica y activa del Grupo EduTLAN.'}
              </p>
            </div>

            {/* Cuadrícula de 3 Dimensiones Clave: Gustos, Programación y Dimensión Internacional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Dimensión 1: Qué le gusta y pasiones */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E11D48]">
                  <Heart className="w-4 h-4 text-[#E11D48]" />
                  <span>Áreas de Interés y Pasiones</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.studentAnswers.personalPassions || analysis.studentProfile.personalPassions || []).length > 0 ? (
                    (analysis.studentAnswers.personalPassions || analysis.studentProfile.personalPassions || []).map((p, i) => (
                      <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#526066]">Informática Educativa y Metodología</span>
                  )}
                </div>
              </div>

              {/* Dimensión 2: Programación y Código */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#059669]">
                  <Code2 className="w-4 h-4 text-[#059669]" />
                  <span>Afinidad con Programación</span>
                </div>
                <p className="text-xs text-[#1C2624] leading-relaxed">
                  {analysis.qwenAnalysis?.programmingAffinityNote ||
                    (analysis.studentAnswers.programmingInterestLevel || 'Interés en desarrollo tecnológico y software didáctico.')}
                </p>
                {(analysis.studentAnswers.programmingLanguages || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(analysis.studentAnswers.programmingLanguages || []).map((l, i) => (
                      <span key={i} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Dimensión 3: Proyectos de otros países / Dimensión Internacional */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#CCD4CF] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                  <Globe className="w-4 h-4 text-[#0284C7]" />
                  <span>Proyectos Internacionales</span>
                </div>
                <p className="text-xs text-[#1C2624] leading-relaxed">
                  {analysis.qwenAnalysis?.internationalDimensionNote ||
                    (analysis.studentAnswers.internationalProjectsInterest || 'Orientación hacia colaboración transfronteriza y retos globales.')}
                </p>
                {(analysis.studentAnswers.internationalMotivations || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(analysis.studentAnswers.internationalMotivations || []).map((m, i) => (
                      <span key={i} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Consejo de Integración y Rol Deseado */}
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="text-[#065F46] font-medium">
                  <strong>Recomendación Tutorial:</strong> {analysis.qwenAnalysis?.newMemberIntegrationAdvice || 'Vincular a mesas de trabajo y co-diseño con investigadores del semillero.'}
                </span>
              </div>
              {(analysis.studentAnswers.preferredRole || analysis.studentProfile.preferredRole) && (
                <span className="px-2.5 py-1 rounded-lg bg-[#059669] text-white font-bold shrink-0">
                  Rol: {analysis.studentAnswers.preferredRole || analysis.studentProfile.preferredRole}
                </span>
              )}
            </div>
          </div>

          {/* Proyectos de LabSIE Relacionados con este enfoque */}
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                Memoria Científica LabSIE · Proyectos Afines
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1C2624] mt-1">
                Investigaciones Compatibles con este Punto de Vista
              </h2>
              <p className="text-xs md:text-sm text-[#3F4E4C] mt-1 font-medium">
                Proyectos del semillero que sustentan metodológica y técnicamente esta perspectiva investigativa:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {activePerspective.relatedProjects.map((rp) => {
                const methInfo = getProjectMethodology(rp.projectId);
                return (
                  <div
                    key={rp.projectId}
                    className="bg-[#FFFDF9] border-2 border-[#CCD4CF] hover:border-[#10B981] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                          {rp.projectCode}
                        </span>
                        <span className="font-bold text-[#059669] tabular-nums">{rp.affinity}% afinidad</span>
                      </div>

                      <div className="pt-0.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${methInfo.themeColor.bg} ${methInfo.themeColor.text} text-[10px] font-bold border ${methInfo.themeColor.border}`}>
                          <span>{methInfo.badgeIcon} {methInfo.badgeTitle.replace('Metodología: ', '')}</span>
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-[#1C2624] leading-snug">
                        {rp.projectTitle}
                      </h3>

                      <p className="text-xs text-[#24302F] leading-relaxed">
                        {rp.connectionReason}
                      </p>
                    </div>

                    <div className="pt-3 border-t-2 border-[#CCD4CF] text-[11px] text-[#059669]">
                      <span className="font-bold">Conceptos: {rp.matchingConcepts.join(' · ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. NUEVA SECCIÓN PRINCIPAL: 3 OPCIONES DE PROYECTOS NUEVOS FORMULADAS EN BASE AL ANÁLISIS */}
          <div className="bg-[#FFFDF9] border-2 border-[#10B981] rounded-3xl p-6 md:p-10 shadow-md space-y-6">
            <div className="border-b-2 border-[#CCD4CF] pb-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#ECFDF5] text-[#059669]">
                  <Lightbulb className="w-5 h-5" />
                </span>
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">
                  Ideas de Investigación Formuladas por el Semillero
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1C2624]">
                3 Opciones de Proyectos Nuevos Formuladas a partir de tu Análisis
              </h2>
              <p className="text-xs md:text-sm text-[#4A5568] leading-relaxed">
                A partir de tus respuestas, inquietudes planteadas y competencias identificadas, el motor del LabSIE formuló <strong>3 ideas de proyectos de investigación completamente nuevas</strong>. Explora cada opción y selecciona tu favorita para tu trabajo de grado:
              </p>
            </div>

            {selectedSuccessBanner && (
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#10B981] text-xs font-bold text-[#065F46] flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{selectedSuccessBanner}</span>
              </div>
            )}

            {/* Selector de las 3 opciones de proyectos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {projectOptions.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`cursor-pointer text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#059669] shadow-sm ring-2 ring-[#059669]/20'
                        : 'bg-[#FAF8F5] border-[#CCD4CF] hover:border-[#10B981] hover:bg-[#FFFDF9]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{opt.icon}</span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#059669] text-white px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Activa</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wide block">
                        {opt.badge}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1C2624] mt-1 leading-snug line-clamp-2">
                        {opt.tentativeTitle}
                      </h4>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#CCD4CF]/60 text-[11px] font-medium text-[#4A5568]">
                      <span>{opt.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ficha Detallada de la Opción de Proyecto Seleccionada */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#F7F3ED] border-2 border-[#CCD4CF] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CCD4CF] pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#059669] font-bold block">
                    Ficha de la Propuesta · {activeOption.badge}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-[#065F46] mt-1 leading-snug">
                    {activeOption.tentativeTitle}
                  </h3>
                </div>

                <button
                  onClick={() => handleSelectOptionAsPreferred(activeOption.id)}
                  className={`cursor-pointer self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                    selectedOptionId === activeOption.id
                      ? 'bg-[#059669] text-white hover:bg-[#047857]'
                      : 'bg-[#FFFDF9] border-2 border-[#059669] text-[#059669] hover:bg-[#ECFDF5]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${selectedOptionId === activeOption.id ? 'fill-white' : ''}`} />
                  <span>{selectedOptionId === activeOption.id ? 'Propuesta Preferida ✓' : 'Elegir como Propuesta Preferida'}</span>
                </button>
              </div>

              {/* Justificación: Por qué surge en base al análisis */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-[#059669] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                  <span>¿Por qué surge esta idea a partir de tu análisis?</span>
                </span>
                <p className="text-xs md:text-sm text-[#24302F] leading-relaxed">
                  {activeOption.whyThisOption}
                </p>
              </div>

              {/* Pregunta y Objetivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1">
                  <span className="text-[11px] font-bold text-[#1C2624] uppercase tracking-wider block">
                    Pregunta de Investigación Tentativa:
                  </span>
                  <p className="text-xs md:text-sm text-[#065F46] italic font-serif font-semibold">
                    "{activeOption.tentativeQuestion}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1">
                  <span className="text-[11px] font-bold text-[#1C2624] uppercase tracking-wider block">
                    Objetivo General Tentativo:
                  </span>
                  <p className="text-xs md:text-sm text-[#1C2624] font-medium">
                    {activeOption.tentativeObjective}
                  </p>
                </div>
              </div>

              {/* Metodología y Población */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1 md:col-span-2">
                  <span className="font-bold text-[#059669] block">
                    Metodología de Investigación Recomendada:
                  </span>
                  <p className="font-bold text-[#1C2624]">
                    {activeOption.methodology.name}
                  </p>
                  <p className="text-[#4A5568] text-[11px] leading-relaxed">
                    {activeOption.methodology.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1">
                  <span className="font-bold text-[#059669] block">
                    Población y Contexto:
                  </span>
                  <p className="text-[#1C2624] font-medium text-[11px]">
                    {activeOption.possibleContextPopulation}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#CCD4CF] space-y-1 md:col-span-3">
                  <span className="font-bold text-[#059669] block">
                    Posible Aporte al Semillero LabSIE y a EduTLAN:
                  </span>
                  <p className="text-[#1C2624] text-xs leading-relaxed">
                    {activeOption.possibleContribution}
                  </p>
                </div>
              </div>

              {/* Próximos pasos recomendados */}
              <div className="pt-3 border-t border-[#CCD4CF] space-y-2">
                <span className="font-bold text-xs text-[#059669] uppercase tracking-wider block">
                  Próximos pasos para estructurar este proyecto:
                </span>
                <ul className="space-y-1.5 text-xs text-[#1C2624]">
                  {activeOption.nextSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Disclaimers & Next Actions */}
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl p-6 text-xs text-[#1C2624] space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-[#1C2624]">Nota Institucional del Semillero LabSIE:</span> El presente
            resultado no constituye la aprobación automática ni la asignación obligatoria de un proyecto.
            El comité docente de EduTLAN evaluará formalmente la pertinencia, asignará el docente tutor responsable y
            acompañará la delimitación final del trabajo de grado.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[#CCD4CF]">
          <button
            onClick={onRetakeTest}
            className="cursor-pointer text-xs font-bold text-[#1C2624] hover:text-[#059669] transition-colors"
          >
            ← Volver a realizar el test
          </button>

          <button
            onClick={onExploreHeritage}
            className="cursor-pointer text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors"
          >
            Explorar todas las fichas del patrimonio LabSIE →
          </button>
        </div>
      </div>

      {/* 7. Antes de irte, lee esto */}
      <section
        aria-labelledby="before-you-go-title"
        className="relative overflow-hidden bg-[#FFFDF9] border-2 border-[#10B981] rounded-2xl p-6 sm:p-10 shadow-sm"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#10B981] via-[#ffcf3f] to-[#ff5d8f]" aria-hidden="true" />
        <div className="max-w-2xl mx-auto space-y-5 text-[#24302F]">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#059669]">{CLOSING_MESSAGE.kicker}</span>
            <h3 id="before-you-go-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2624] text-balance">
              {CLOSING_MESSAGE.title}
            </h3>
          </div>
          <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed">
            <p>{CLOSING_MESSAGE.intro}</p>
            <blockquote className="border-l-4 border-[#10B981] pl-4 italic text-[#065F46]">{CLOSING_MESSAGE.quote}</blockquote>
            {CLOSING_MESSAGE.paragraphs.map((x, i) => (
              <p key={i}>{x}</p>
            ))}
            <p className="font-bold text-[#1C2624]">{CLOSING_MESSAGE.closing}</p>
          </div>
          <div className="text-center pt-2">
            <a
              href="https://edutlan.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] text-[#FFFDF9] text-sm font-bold hover:bg-[#047857] transition-colors"
            >
              <Heart className="w-4 h-4" /> Más información en edutlan.online
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
