import React from 'react';
import { Sparkles, ClipboardList, Compass, Layers, Heart } from 'lucide-react';
import { AnalysisResult, ResearchProject } from '../types';

/** Para coordinación: todo lo que respondió el estudiante y el reporte completo generado por Qwen. */
export const AnalysisFullDetails: React.FC<{ analysis: AnalysisResult; projects: ResearchProject[] }> = ({ analysis, projects }) => {
  const a = analysis.studentAnswers;
  const p = analysis.studentProfile;
  const q = analysis.qwenAnalysis;
  const projectName = (id: string) => {
    const found = projects.find(x => x.id === id || x.code === id);
    return found ? `${found.code} · ${found.title}` : id;
  };

  const rows: [string, string | string[] | undefined][] = [
    ['Nombre', p.name],
    ['Correo', p.email],
    ['Teléfono', p.phone],
    ['Programa', p.program],
    ['Semestre', p.semester],
    ['Experiencia en investigación', p.researchExperience],
    ['Nivel tecnológico', p.techExperience],
    ['Uso de IA', p.aiExperience],
    ['Lo que le apasiona', a.personalPassions],
    ['Gusto por programar', a.programmingInterestLevel],
    ['Lenguajes y tecnologías', a.programmingLanguages],
    ['Qué quiere construir', a.programmingExperienceSummary],
    ['Interés en proyectos con otros países', a.internationalProjectsInterest],
    ['Motivaciones internacionales', a.internationalMotivations],
    ['Rol que sueña en el semillero', a.preferredRole],
    ['Primera acción ante un problema', a.firstActionOnProblem],
    ['Preguntas que le dan curiosidad', a.curiosityQuestions],
    ['Actividades de investigación preferidas', a.preferredActivities],
    ['Escenario: dificultad', a.scenarioDifficulty],
    ['Escenario: docente e IA', a.scenarioTeacherAI],
    ['Escenario: sistema inteligente', a.scenarioIntelligentSystem],
    ['Escenario: reto cultural', a.scenarioCulturalChallenge],
    ['Intereses en IA', a.aiInterests],
    ['Problema que quiere investigar', a.problemToInvestigate],
    ['Investigación soñada', a.dreamResearch],
    ['Qué quiere descubrir en 6 meses', a.sixMonthsDiscovery],
    ['Proyectos de LabSIE que marcó', (a.selectedLabSIEProjects || []).map(projectName)],
    ['Idea propia frente a los proyectos', a.divergentProjectIdea],
    ['Heredar, conectar o crear', a.continuationPreference],
    ['Expectativas con LabSIE', a.labsieExpectations],
    ['Comentarios adicionales', a.additionalInterests]
  ];

  const render = (v: string | string[] | undefined) => {
    if (Array.isArray(v)) {
      return v.length ? (
        <div className="flex flex-wrap gap-1">
          {v.map((x, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[11px] font-semibold">
              {x}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[#9AA5A1]">Sin respuesta</span>
      );
    }
    return v && String(v).trim() ? <span className="whitespace-pre-line">{v}</span> : <span className="text-[#9AA5A1]">Sin respuesta</span>;
  };

  return (
    <div className="space-y-6">
      {/* Reporte completo de Qwen */}
      {q && (
        <section className="rounded-2xl border-2 border-[#10B981] bg-[#FFFDF9] p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CCD4CF] pb-3">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C2624]">
              <Sparkles className="w-5 h-5 text-[#10B981]" /> Reporte entregado al estudiante
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
              {q.model} · {new Date(q.analysisTimestamp).toLocaleString('es-CO')}
            </span>
          </div>

          {(q.warmLetter || []).length > 0 && (
            <div className="space-y-2 font-serif text-sm text-[#24302F] leading-relaxed">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E11D48] font-sans">
                <Heart className="w-3.5 h-3.5" /> Carta
              </p>
              {q.warmLetter!.map((x, i) => (
                <p key={i}>{x}</p>
              ))}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF]">
              <p className="text-xs font-bold text-[#059669] mb-1">Contraste con los proyectos</p>
              <p className="text-[#24302F]">{q.contrastingNarrative}</p>
            </div>
            {q.whereYouCanEnter && (
              <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#065F46] mb-1">
                  <Compass className="w-3.5 h-3.5" /> Dónde puede entrar
                </p>
                <p className="text-[#24302F]">{q.whereYouCanEnter}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF]">
              <p className="text-xs font-bold text-[#059669] mb-1">Programación</p>
              <p className="text-[#24302F]">{q.programmingAffinityNote}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#CCD4CF]">
              <p className="text-xs font-bold text-[#0284C7] mb-1">Dimensión internacional</p>
              <p className="text-[#24302F]">{q.internationalDimensionNote}</p>
            </div>
          </div>

          {(q.projectsYouCanDo || []).length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#059669]">
                <Layers className="w-3.5 h-3.5" /> Proyectos que puede hacer
              </p>
              <ul className="grid gap-2 md:grid-cols-2">
                {q.projectsYouCanDo!.map(x => (
                  <li key={x.projectCode} className="p-3 rounded-xl border border-[#CCD4CF] bg-[#FAF8F5] text-sm">
                    <p className="font-bold text-[#1C2624]">
                      <span className="font-mono text-xs text-[#065F46]">{x.projectCode}</span> · {x.projectTitle}
                    </p>
                    <p className="text-xs text-[#3F4E4C] mt-1">{x.whatYouCanDo}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {q.topMatchingProjects?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#059669]">Proyectos más afines</p>
              <ul className="space-y-1 text-xs text-[#24302F]">
                {q.topMatchingProjects.map(x => (
                  <li key={x.projectCode}>
                    <strong>{x.projectCode}</strong> · {x.projectTitle}: {x.matchRationale}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] text-xs text-[#92400E]">
            <strong>Sugerencia para el tutor:</strong> {q.newMemberIntegrationAdvice}
          </div>
          {q.closingNote && <p className="text-sm italic font-serif text-[#24302F]">{q.closingNote}</p>}
        </section>
      )}

      {/* Todas las respuestas */}
      <section className="rounded-2xl border-2 border-[#CCD4CF] bg-[#FFFDF9] p-5 sm:p-6 space-y-3">
        <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C2624]">
          <ClipboardList className="w-5 h-5 text-[#059669]" /> Todo lo que respondió
        </h3>
        <dl className="divide-y divide-[#E5E9E6]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 sm:grid-cols-[240px_1fr] py-2.5 text-sm">
              <dt className="text-xs font-bold text-[#3F4E4C]">{label}</dt>
              <dd className="text-[#1C2624]">{render(value)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};
