import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { ResearchProject, ResearchLine, ProjectStatus } from '../types';

interface AdminProjectModalProps {
  project?: ResearchProject | null;
  lines: ResearchLine[];
  onSave: (project: ResearchProject) => void;
  onClose: () => void;
}

export const AdminProjectModal: React.FC<AdminProjectModalProps> = ({
  project,
  lines,
  onSave,
  onClose
}) => {
  const isEditing = !!project;

  const [code, setCode] = useState(project?.code || `LABSIE-P0${Math.floor(Math.random() * 90) + 10}`);
  const [title, setTitle] = useState(project?.title || '');
  const [lineId, setLineId] = useState(project?.lineId || lines[0]?.id || '');
  const [description, setDescription] = useState(project?.description || '');
  const [problem, setProblem] = useState(project?.problem || '');
  const [question, setQuestion] = useState(project?.question || '');
  const [generalObjective, setGeneralObjective] = useState(project?.generalObjective || '');
  const [context, setContext] = useState(project?.context || 'Licenciatura en Informática, Universidad de Córdoba');
  const [population, setPopulation] = useState(project?.population || 'Estudiantes de educación superior');
  const [conceptsStr, setConceptsStr] = useState(project?.concepts.join(', ') || '');
  const [methodology, setMethodology] = useState(project?.methodology || 'Investigación basada en diseño / cuasi-experimental');
  const [results, setResults] = useState(project?.results || 'Información pendiente de completar por el administrador.');
  const [limitaciones, setLimitaciones] = useState(project?.limitaciones || 'Información pendiente de completar por el administrador.');
  const [openQuestionsStr, setOpenQuestionsStr] = useState(project?.openQuestions.join('\n') || '');
  const [continuityStr, setContinuityStr] = useState(project?.continuityPossibilities.join('\n') || '');
  const [keywordsStr, setKeywordsStr] = useState(project?.keywords.join(', ') || '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'active');
  const [year, setYear] = useState(project?.year || '2024-2025');
  const [leadResearcher, setLeadResearcher] = useState(project?.leadResearcher || 'Equipo LabSIE / EduTLAN');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título de la investigación es obligatorio.');
      return;
    }
    if (!lineId) {
      setError('Debes asociar una línea de investigación.');
      return;
    }

    const selectedLine = lines.find(l => l.id === lineId);
    const lineName = selectedLine ? selectedLine.name : 'Línea de Investigación';

    const savedProject: ResearchProject = {
      id: project?.id || `proj-${Date.now()}`,
      code: code.trim(),
      title: title.trim(),
      lineId,
      lineName,
      description: description.trim(),
      problem: problem.trim(),
      question: question.trim(),
      generalObjective: generalObjective.trim(),
      context: context.trim(),
      population: population.trim(),
      concepts: conceptsStr.split(',').map(c => c.trim()).filter(Boolean),
      methodology: methodology.trim(),
      results: results.trim(),
      limitaciones: limitaciones.trim(),
      openQuestions: openQuestionsStr.split('\n').map(q => q.trim()).filter(Boolean),
      continuityPossibilities: continuityStr.split('\n').map(c => c.trim()).filter(Boolean),
      keywords: keywordsStr.split(',').map(k => k.trim()).filter(Boolean),
      status,
      year: year.trim(),
      leadResearcher: leadResearcher.trim()
    };

    onSave(savedProject);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2624]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col shadow-2xl relative z-60">
        {/* Header */}
        <div className="p-5 border-b-2 border-[#CCD4CF] flex items-center justify-between bg-[#FAF8F5] rounded-t-2xl">
          <div>
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
              Patrimonio Científico LabSIE
            </span>
            <h2 className="font-serif text-xl font-bold text-[#1C2624]">
              {isEditing ? 'Editar Proyecto de Investigación' : 'Nuevo Proyecto de Investigación'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#1C2624] hover:bg-[#F7F3ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm">
          {error && (
            <div className="p-3 rounded-lg bg-[#B65C5C]/10 border border-[#B65C5C]/30 text-[#B65C5C] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Código:</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-medium text-[#24302F]">Línea de Investigación:</label>
              <select
                value={lineId}
                onChange={e => setLineId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              >
                {lines.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Título de la investigación:</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Descripción general:</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Problema abordado:</label>
              <textarea
                rows={2}
                value={problem}
                onChange={e => setProblem(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Pregunta de investigación:</label>
              <textarea
                rows={2}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Objetivo General:</label>
            <input
              type="text"
              value={generalObjective}
              onChange={e => setGeneralObjective(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Contexto y Ubicación:</label>
              <input
                type="text"
                value={context}
                onChange={e => setContext(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Población:</label>
              <input
                type="text"
                value={population}
                onChange={e => setPopulation(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Conceptos Desarrollados (separados por coma):</label>
            <input
              type="text"
              placeholder="Pensamiento Crítico, Sistemas Tutores, IA Educativa"
              value={conceptsStr}
              onChange={e => setConceptsStr(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Metodología:</label>
            <input
              type="text"
              value={methodology}
              onChange={e => setMethodology(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Resultados obtenidos:</label>
              <textarea
                rows={2}
                value={results}
                onChange={e => setResults(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Limitaciones:</label>
              <textarea
                rows={2}
                value={limitaciones}
                onChange={e => setLimitaciones(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Preguntas abiertas (una por línea):</label>
              <textarea
                rows={3}
                placeholder="¿Cómo transferir este modelo a...?&#10;¿Qué impacto longitudinal...?"
                value={openQuestionsStr}
                onChange={e => setOpenQuestionsStr(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Posibilidades de continuidad (una por línea):</label>
              <textarea
                rows={3}
                placeholder="Incorporar LLMs para...&#10;Extender a nuevas cohortes..."
                value={continuityStr}
                onChange={e => setContinuityStr(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Estado:</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              >
                <option value="active">Activo</option>
                <option value="in_development">En desarrollo</option>
                <option value="completed">Finalizado</option>
                <option value="historical">Histórico</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Año / Periodo:</label>
              <input
                type="text"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#24302F]">Investigador / Tutor:</label>
              <input
                type="text"
                value={leadResearcher}
                onChange={e => setLeadResearcher(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
              />
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-[#DDE2DE] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#6F7976] hover:bg-[#F7F3ED] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] text-[#FFFDF9] text-xs font-bold hover:bg-[#059669] transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en Patrimonio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
