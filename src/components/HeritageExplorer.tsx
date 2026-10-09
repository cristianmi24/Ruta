import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, Layers, CheckCircle, ExternalLink, Sparkles, Lock } from 'lucide-react';
import { ResearchProject, ResearchLine } from '../types';
import { getProjectMethodology } from '../data/projectMetadata';

interface HeritageExplorerProps {
  projects: ResearchProject[];
  lines: ResearchLine[];
  onStartTest?: () => void;
  selectableMode?: boolean;
  selectedProjectIds?: string[];
  onToggleProjectSelection?: (projectId: string) => void;
  isTestUnlocked?: boolean;
}

export const HeritageExplorer: React.FC<HeritageExplorerProps> = ({
  projects,
  lines,
  onStartTest,
  selectableMode = false,
  selectedProjectIds = [],
  onToggleProjectSelection,
  isTestUnlocked = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);

  const filteredProjects = projects.filter(p => {
    const matchesLine = selectedLineFilter === 'all' || p.lineId === selectedLineFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.concepts.some(c => c.toLowerCase().includes(q)) ||
      p.keywords.some(k => k.toLowerCase().includes(q)) ||
      p.problem.toLowerCase().includes(q);
    return matchesLine && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedProjectId(prev => (prev === id ? null : id));
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'in_development':
        return 'En desarrollo';
      case 'completed':
        return 'Finalizado';
      case 'historical':
        return 'Histórico';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3 rounded-2xl bg-[#FFFDF9]/90 backdrop-blur-md border border-[#CCD4CF] shadow-xs px-4 py-5 sm:px-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#059669] tracking-wider uppercase">
          <span>Semillero de Investigación LabSIE</span>
          <span aria-hidden="true">·</span>
          <span>Grupo EduTLAN (Categoría A MinCiencias)</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#24302F]" style={{ color: '#24302F' }}>
          Ahora conoce lo que ya hemos investigado.
        </h1>

        <p className="text-[#24302F] text-base leading-relaxed font-normal" style={{ color: '#24302F' }}>
          Los proyectos a continuación forman parte del patrimonio investigativo de LabSIE y Grupo EduTLAN, organizados
          estrictamente en las <strong className="text-[#059669] font-bold">cuatro líneas oficiales de investigación</strong> del semillero. No son
          categorías de personalidad ni respuestas correctas: son puntos de partida para imaginar
          nuevas investigaciones.
        </p>
      </div>

      {/* Líneas de Investigación Tabs / Pills */}
      <div className="mb-6 space-y-2 rounded-2xl bg-[#FFFDF9]/90 backdrop-blur-md border border-[#CCD4CF] p-3 sm:p-4">
        <div className="flex items-center justify-between text-xs font-bold text-[#059669]">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#10B981]" />
            Líneas Oficiales de Investigación LabSIE · EduTLAN ({lines.length} Líneas):
          </span>
          <span className="text-[#3F4E4C] font-medium hidden sm:inline">
            Filtra por línea con un clic
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedLineFilter('all')}
            className={`cursor-pointer p-3.5 rounded-xl border-2 text-left transition-all text-xs flex flex-col justify-between ${
              selectedLineFilter === 'all'
                ? 'border-[#059669] bg-[#059669] font-bold shadow-sm'
                : 'border-[#CCD4CF] bg-[#FFFDF9] hover:bg-[#ECFDF5] hover:border-[#10B981]'
            }`}
            style={selectedLineFilter === 'all' ? { backgroundColor: '#059669', borderColor: '#059669', color: '#FFFFFF' } : { backgroundColor: '#FFFDF9', color: '#24302F' }}
          >
            <span
              className="block uppercase text-[10px] font-bold tracking-wider"
              style={{ color: selectedLineFilter === 'all' ? '#ECFDF5' : '#059669' }}
            >
              Todas
            </span>
            <span
              className="font-serif font-bold text-sm mt-0.5"
              style={{ color: selectedLineFilter === 'all' ? '#FFFFFF' : '#24302F' }}
            >
              Todas las Líneas
            </span>
            <span
              className="mt-1 text-[11px] font-medium"
              style={{ color: selectedLineFilter === 'all' ? '#ECFDF5' : '#3F4E4C' }}
            >
              {projects.length} proyectos
            </span>
          </button>

          {lines.map((line, idx) => {
            const isSelected = selectedLineFilter === line.id;
            const lineProjectsCount = projects.filter(p => p.lineId === line.id).length;
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => setSelectedLineFilter(line.id)}
                className={`cursor-pointer p-3.5 rounded-xl border-2 text-left transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#059669] bg-[#059669] font-bold shadow-sm'
                    : 'border-[#CCD4CF] bg-[#FFFDF9] hover:bg-[#ECFDF5] hover:border-[#10B981]'
                }`}
                style={isSelected ? { backgroundColor: '#059669', borderColor: '#059669', color: '#FFFFFF' } : { backgroundColor: '#FFFDF9', color: '#24302F' }}
              >
                <span
                  className="block uppercase text-[10px] font-bold tracking-wider"
                  style={{ color: isSelected ? '#ECFDF5' : '#059669' }}
                >
                  Línea 0{idx + 1}
                </span>
                <span
                  className="font-serif font-bold text-xs mt-0.5 line-clamp-2 leading-snug"
                  style={{ color: isSelected ? '#FFFFFF' : '#24302F' }}
                >
                  {line.name}
                </span>
                <span
                  className="mt-1 text-[11px] font-medium"
                  style={{ color: isSelected ? '#ECFDF5' : '#3F4E4C' }}
                >
                  {lineProjectsCount} {lineProjectsCount === 1 ? 'proyecto' : 'proyectos'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFDF9] p-4 rounded-xl border-2 border-[#CCD4CF] mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#059669] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por conceptos, palabras clave, problemas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl text-[#1C2624] font-medium placeholder-[#526066] focus:outline-none focus:border-[#10B981] shadow-inner"
          />
        </div>

        {/* Line Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="line-filter" className="text-xs font-bold text-[#1C2624] whitespace-nowrap">
            Filtro por Línea:
          </label>
          <select
            id="line-filter"
            value={selectedLineFilter}
            onChange={e => setSelectedLineFilter(e.target.value)}
            className="text-xs bg-[#FAF8F5] border-2 border-[#CCD4CF] rounded-xl px-3 py-2.5 text-[#1C2624] font-semibold focus:outline-none focus:border-[#10B981]"
          >
            <option value="all">Todas las 4 líneas ({projects.length})</option>
            {lines.slice(0, 4).map((line, idx) => (
              <option key={line.id} value={line.id}>
                Línea {idx + 1}: {line.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectableMode && (
        <div className="mb-6 p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between">
          <p className="text-xs md:text-sm text-[#065F46]">
            <span className="font-semibold">Selecciona las investigaciones</span> que despierten tu interés o curiosidad (puedes marcar 0, 1 o varias).
          </p>
          <span className="text-xs font-semibold text-[#059669] bg-[#FFFDF9] px-2.5 py-1 rounded-md border border-[#A7F3D0]">
            {selectedProjectIds.length} seleccionadas
          </span>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF9] rounded-2xl border border-[#DDE2DE] text-[#6F7976]">
            <p className="text-sm">No se encontraron investigaciones que coincidan con la búsqueda.</p>
          </div>
        ) : (
          filteredProjects.map((project, idx) => {
            const isExpanded = expandedProjectId === project.id;
            const isSelected = selectedProjectIds.includes(project.id);
            const methInfo = getProjectMethodology(project.id);

            return (
              <div
                key={project.id}
                className={`rounded-2xl border-2 transition-all shadow-xs ${
                  isSelected
                    ? 'border-[#10B981] bg-[#FFFDF9] ring-2 ring-[#10B981]/25'
                    : 'border-[#CCD4CF] bg-[#FFFDF9] hover:border-[#10B981]'
                }`}
              >
                {/* Project Header Card */}
                <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#3F4E4C] font-semibold">
                      <span className="font-bold text-[#10B981] px-2 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0]">
                        {project.code}
                      </span>
                      <span aria-hidden="true" className="text-[#CCD4CF]">·</span>
                      <span className="font-bold text-[#1C2624]">{project.lineName}</span>
                      <span aria-hidden="true" className="text-[#CCD4CF]">·</span>
                      <span className="text-[#059669] font-bold">{getStatusLabel(project.status)}</span>
                      {project.year && (
                        <>
                          <span aria-hidden="true" className="text-[#CCD4CF]">·</span>
                          <span className="text-[#3F4E4C]">{project.year}</span>
                        </>
                      )}
                    </div>

                    <h2
                      onClick={() => toggleExpand(project.id)}
                      className="font-serif text-lg md:text-xl font-bold text-[#1C2624] cursor-pointer hover:text-[#059669] transition-colors leading-snug"
                    >
                      {project.title}
                    </h2>

                    {/* Insignia Metodológica Oficial - Para TODOS los proyectos */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${methInfo.themeColor.bg} ${methInfo.themeColor.text} text-xs font-bold border ${methInfo.themeColor.border}`}>
                        <span>{methInfo.badgeIcon} {methInfo.badgeTitle}</span>
                      </div>
                      {methInfo.referenceAuthor && (
                        <span className="text-[11px] font-semibold text-[#1C2624] px-2.5 py-0.5 rounded bg-[#F7F3ED] border-2 border-[#CCD4CF]">
                          Ref: {methInfo.referenceAuthor}
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm text-[#24302F] leading-relaxed line-clamp-2 font-normal">
                      {project.description}
                    </p>

                    {/* Unboxed Concepts with typographic dots */}
                    <div className="pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#059669]">
                      <span className="font-bold text-[#059669]">Conceptos clave:</span>
                      {project.concepts.map((concept, cIdx) => (
                        <React.Fragment key={concept}>
                          <span className="font-semibold text-[#1C2624] bg-[#F7F3ED] px-2 py-0.5 rounded border border-[#CCD4CF]">{concept}</span>
                          {cIdx < project.concepts.length - 1 && <span aria-hidden="true" className="text-[#CCD4CF]">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-start">
                    {selectableMode && onToggleProjectSelection && (
                      <button
                        onClick={() => onToggleProjectSelection(project.id)}
                        className={`cursor-pointer text-xs font-medium px-3.5 py-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#10B981] text-[#FFFDF9] border-[#10B981]'
                            : 'bg-[#F7F3ED] text-[#24302F] border-[#CCD4CF] hover:bg-[#EFEAE2]'
                        }`}
                      >
                        <CheckCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FFFDF9]' : 'text-[#6F7976]'}`} />
                        <span>{isSelected ? 'Seleccionado' : 'Me interesa'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="cursor-pointer text-xs font-semibold px-3 py-2 rounded-lg text-[#10B981] hover:bg-[#ECFDF5] transition-colors flex items-center gap-1"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? 'Ocultar ficha' : 'Ver ficha completa'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Academic Sheet */}
                {isExpanded && (
                  <div className="px-5 md:px-6 pb-6 pt-2 border-t-2 border-[#CCD4CF] bg-[#FFFDF9] space-y-5 text-xs md:text-sm">
                    {/* Tarjeta Destacada de Encuadre Metodológico - Uniforme en TODOS los proyectos */}
                    <div className={`p-4 rounded-xl border ${methInfo.themeColor.bg} ${methInfo.themeColor.border} space-y-2`}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{methInfo.badgeIcon}</span>
                        <span className={`font-bold text-xs uppercase tracking-wider ${methInfo.themeColor.text}`}>
                          Enfoque y Paradigma Metodológico:
                        </span>
                      </div>
                      <p className={`text-xs ${methInfo.themeColor.text} font-medium leading-relaxed`}>
                        <strong>{methInfo.paradigm}</strong> — {methInfo.summary}
                      </p>
                    </div>

                    {/* Grid of details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                      <div className="space-y-1.5">
                        <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px]">
                          Problema abordado:
                        </span>
                        <p className="text-[#24302F] leading-relaxed font-normal">{project.problem}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px]">
                          Pregunta de investigación:
                        </span>
                        <p className="text-[#24302F] italic leading-relaxed">{project.question}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px]">
                        Objetivo general:
                      </span>
                      <p className="text-[#24302F] leading-relaxed">{project.generalObjective}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px]">
                          Contexto y Población:
                        </span>
                        <p className="text-[#3F4E4C]">
                          {project.context} · <span className="font-bold text-[#24302F]">{project.population}</span>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px]">
                          Metodología implementada:
                        </span>
                        <p className="text-[#24302F]">{project.methodology}</p>
                      </div>
                    </div>

                    {/* Results & Limitations (Adhering to strict rule: clearly state if pending) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-[#F7F3ED] border-2 border-[#CCD4CF]">
                      <div>
                        <span className="font-bold text-[#059669] uppercase tracking-wider text-[11px]">
                          Resultados registrados:
                        </span>
                        <p className="text-xs text-[#24302F] mt-1 font-medium">{project.results}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#059669] uppercase tracking-wider text-[11px]">
                          Limitaciones identificadas:
                        </span>
                        <p className="text-xs text-[#24302F] mt-1 font-medium">{project.limitaciones}</p>
                      </div>
                    </div>

                    {/* Open Questions & Continuity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <span className="font-semibold text-[#C79A52] uppercase tracking-wider text-[11px]">
                          Preguntas abiertas (Brechas científicas):
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#24302F] list-disc list-inside">
                          {project.openQuestions.map((oq, oqIdx) => (
                            <li key={oqIdx} className="leading-relaxed">
                              {oq}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px]">
                          Posibilidades de continuidad en LabSIE:
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#24302F] list-disc list-inside">
                          {project.continuityPossibilities.map((cp, cpIdx) => (
                            <li key={cpIdx} className="leading-relaxed">
                              {cp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {!selectableMode && onStartTest && (
        <div className="mt-12 text-center p-8 rounded-2xl bg-[#FFFDF9] border-2 border-[#CCD4CF] shadow-sm max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Semillero de Investigación LabSIE · Grupo EduTLAN</span>
          </div>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[#24302F]" style={{ color: '#24302F' }}>
            ¿Sientes curiosidad por conectar tu vocación con estos proyectos?
          </h2>
          <p className="text-xs md:text-sm text-[#526066] max-w-xl mx-auto font-medium leading-relaxed">
            {isTestUnlocked
              ? 'Tu ruta investigativa está activa. Realiza el test de exploración para vincularte formalmente a una de las investigaciones.'
              : 'El test de exploración investigativa está reservado para estudiantes que deseen ingresar al Semillero LabSIE. Confirma tu vinculación para activar tu ruta.'}
          </p>
          <div className="pt-2">
            <button
              onClick={onStartTest}
              className={`cursor-pointer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg border-2 ${
                isTestUnlocked
                  ? 'bg-[#10B981] text-[#FFFDF9] hover:bg-[#059669] border-[#10B981]'
                  : 'bg-[#FFFDF9] text-[#1C2624] hover:bg-[#ECFDF5] border-[#059669]'
              }`}
            >
              {!isTestUnlocked && <Lock className="w-4 h-4 text-[#B45309]" />}
              <span>{isTestUnlocked ? 'Iniciar Test de Exploración (Ruta Activa)' : '¡Ingresar al Semillero y Activar Test!'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
