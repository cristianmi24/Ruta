import React from 'react';
import { AnalysisResult, RouteType } from '../types';
import { CLOSING_MESSAGE } from '../data/closingMessage';

/* =========================================================================
   DOSSIER DE ANÁLISIS ESTUDIANTIL · Semillero LabSIE · Grupo EduTLAN
   Diseño formal para documento impreso/PDF (no UI-clone).
   ========================================================================= */

const css = `
.lr {
  --ink: #111827; 
  --text: #374151;
  --muted: #6B7280; 
  --border: #D1D5DB; 
  --border-light: #E5E7EB;
  --paper: #FFFFFF; 
  --brand-main: #047857; 
  --brand-light: #D1FAE5;
  --brand-accent: #B45309;
  --serif: 'Playfair Display', 'Lora', Georgia, serif;
  --sans: 'Inter', 'DM Sans', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
  
  width: 794px; 
  background: var(--paper); 
  color: var(--text);
  font-family: var(--sans); 
  font-size: 12px; 
  line-height: 1.6;
}
.lr * { box-sizing: border-box; }
.lr h1, .lr h2, .lr h3, .lr h4 { color: var(--ink) !important; font-family: var(--serif); margin: 0; }
.lr p { margin: 0 0 0.8em; }

/* ---------- Page Structure ---------- */
.lr-page { padding: 40px 50px; }
.page-break { break-before: page; }

/* ---------- Header ---------- */
.lr-hero {
  border-bottom: 3px solid var(--brand-main);
  padding-bottom: 25px;
  margin-bottom: 35px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.lr-hero-info { max-width: 65%; }
.lr-kicker { 
  font-family: var(--sans); 
  font-size: 10px; 
  letter-spacing: 0.15em; 
  text-transform: uppercase; 
  color: var(--muted);
  margin-bottom: 8px;
}
.lr-title { 
  font-size: 34px; 
  font-weight: 700; 
  line-height: 1.1; 
  margin-bottom: 15px; 
}
.lr-meta {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--muted);
}
.lr-logo img { height: 75px; object-fit: contain; }

/* ---------- Student Details (Formal Table) ---------- */
.lr-student-box {
  border: 1px solid var(--border);
  border-top: 4px solid var(--brand-main);
  background: #F9FAFB;
  padding: 20px 25px;
  margin-bottom: 35px;
}
.lr-student-name {
  font-size: 22px;
  font-weight: 700;
  font-family: var(--serif);
  color: var(--ink);
  margin-bottom: 12px;
}
.lr-student-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 11px;
}
.lr-student-grid strong { color: var(--ink); margin-right: 5px; }

/* ---------- Sections ---------- */
.lr-section { margin-bottom: 35px; }
.lr-sec-title {
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
  margin-bottom: 15px;
  color: var(--brand-main) !important;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.lr-sec-num {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--muted);
}

/* ---------- Grids & Layouts ---------- */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }

/* ---------- Basic Elements ---------- */
.lr-box {
  border: 1px solid var(--border-light);
  padding: 15px;
  background: #fff;
}
.lr-box-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink);
  margin-bottom: 8px;
}

/* ---------- Typography styles ---------- */
.lr-quote {
  font-family: var(--serif);
  font-size: 16px;
  font-style: italic;
  color: var(--ink);
  border-left: 3px solid var(--brand-accent);
  padding-left: 15px;
  margin: 10px 0 20px;
}
.lr-list {
  padding-left: 20px;
  margin: 0 0 15px;
}
.lr-list li { margin-bottom: 5px; }

/* ---------- Specific Components ---------- */
.score-display {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.score-number {
  font-family: var(--serif);
  font-size: 38px;
  font-weight: 700;
  color: var(--brand-main);
  line-height: 1;
}
.score-text { font-size: 13px; font-weight: 600; color: var(--ink); }

.project-item {
  border-left: 2px solid var(--brand-main);
  padding-left: 15px;
  margin-bottom: 15px;
}
.project-code {
  font-family: var(--mono);
  font-size: 10px;
  background: var(--brand-light);
  color: var(--brand-main);
  padding: 2px 6px;
  font-weight: 600;
}
.project-title { font-weight: 700; font-size: 14px; margin: 5px 0; }

.route-banner {
  background: #F3F4F6;
  border: 1px solid var(--border);
  padding: 20px;
  text-align: center;
}
.route-name {
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 700;
  color: var(--brand-main);
  margin-bottom: 10px;
}

.table-layout {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.table-layout th, .table-layout td {
  border: 1px solid var(--border);
  padding: 10px 15px;
  text-align: left;
  font-size: 11px;
}
.table-layout th {
  background: #F9FAFB;
  font-weight: 700;
  color: var(--ink);
}

.letter-format {
  font-family: var(--serif);
  font-size: 13px;
  line-height: 1.8;
}
.signature {
  margin-top: 30px;
  font-style: italic;
  color: var(--brand-main);
}
`;

const ROUTES: RouteType[] = ['HEREDAR', 'CONECTAR', 'TRASCENDER', 'EXPLORAR'];
const ROUTE_TEXT: Record<RouteType, string> = {
  HEREDAR: 'Cuentas con lo necesario para continuar y profundizar una investigación que ya existe en el semillero.',
  CONECTAR: 'Tu perfil une dos o más proyectos del semillero: puedes trabajar en la intersección entre ellos.',
  TRASCENDER: 'Partes de la memoria investigativa de LabSIE para abrir una dirección nueva, con otra población, contexto o enfoque.',
  EXPLORAR: 'Tus inquietudes aún no convergen con una línea activa: la ruta propone diálogo con tu tutor para madurar tu idea.'
};

const Section: React.FC<{ num: string; title: string; children: React.ReactNode }> = ({ num, title, children }) => (
  <section className="lr-section" data-break>
    <div className="lr-sec-title" data-keep-next>
      <span className="lr-sec-num">{num}.</span>
      <span>{title}</span>
    </div>
    {children}
  </section>
);

export interface ReportTemplateProps {
  analysis: AnalysisResult;
  logoSrc?: string | null;
  logoWhiteSrc?: string | null;
  projectQuestions?: Record<string, string>;
  includeAdminSection?: boolean;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({ analysis: d, logoSrc, projectQuestions = {}, includeAdminSection }) => {
  const p = d.studentProfile;
  const a = d.studentAnswers;
  const q = d.qwenAnalysis;
  const date = new Date(d.timestamp).toLocaleDateString('es-CO');
  const perspective = d.perspectives?.find(x => x.id === d.selectedPerspectiveId) || d.perspectives?.[0];

  return (
    <div className="lr">
      <style>{css}</style>

      <main className="lr-page">
        {/* HEADER */}
        <header className="lr-hero">
          <div className="lr-hero-info">
            <div className="lr-kicker">Semillero LabSIE · Grupo EduTLAN</div>
            <h1 className="lr-title">Dossier de Análisis<br/>Estudiantil</h1>
            <div className="lr-meta">ID DOCUMENTO: {d.id} | FECHA: {date}</div>
          </div>
          {logoSrc && (
            <div className="lr-logo">
              <img src={logoSrc} alt="LabSIE Logo" />
            </div>
          )}
        </header>

        {/* DATOS DEL ESTUDIANTE */}
        <div className="lr-student-box" data-break>
          <div className="lr-student-name">{p.name}</div>
          <div className="lr-student-grid">
            <div><strong>Programa:</strong> {p.program} (Sem. {p.semester})</div>
            <div><strong>Vinculación:</strong> Semillero LabSIE</div>
            <div><strong>Correo:</strong> {p.email || 'N/A'}</div>
            <div><strong>Teléfono:</strong> {p.phone || 'N/A'}</div>
          </div>
        </div>

        {/* 01. PERFIL INVESTIGATIVO */}
        <Section num="01" title="Perfil Investigativo y Correspondencia">
          <div className="score-display">
            <div className="score-number">{d.correspondenceScore}/100</div>
            <div>
              <div className="score-text">Nivel: {d.correspondenceLevel}</div>
              <p style={{ margin: 0, fontSize: 11, color: '#6B7280' }}>Índice de afinidad con las líneas del Semillero</p>
            </div>
          </div>
          <p><strong>Arquetipo Asignado:</strong> {d.profileArchetype}</p>
          {perspective && <p><strong>Área de Enfoque:</strong> {perspective.focusArea}</p>}
          
          <table className="table-layout" style={{ marginTop: 15 }}>
            <thead>
              <tr>
                <th>Experiencia Previa</th>
                <th>Formación Técnica</th>
                <th>Familiaridad con IA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{p.researchExperience || 'Ninguna documentada.'}</td>
                <td>{p.techExperience || 'Básica.'}</td>
                <td>{p.aiExperience || 'No reportada.'}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 02. INTERESES Y FORMAS DE INVESTIGAR */}
        <Section num="02" title="Intereses y Metodologías de Preferencia">
          <div className="grid-2">
            <div className="lr-box">
              <div className="lr-box-title">Áreas de Curiosidad Científica</div>
              <ul className="lr-list" style={{ margin: 0 }}>
                {d.whyBreakdown.matchingInterests.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="lr-box">
              <div className="lr-box-title">Formas Preferidas de Investigar</div>
              <ul className="lr-list" style={{ margin: 0 }}>
                {d.dominantResearchWays.map(f => <li key={f}>{f}</li>)}
              </ul>
              {a.continuationPreference && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
                  <div className="lr-box-title">Preferencia de Continuidad</div>
                  <p style={{ margin: 0 }}>{a.continuationPreference}</p>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* 03. INQUIETUD PROPIA */}
        <Section num="03" title="Inquietudes Declaradas">
          <div className="lr-box-title">Problema o Tema de Interés Principal</div>
          <div className="lr-quote">{a.problemToInvestigate || a.studentResearchIdea || 'El estudiante no ha especificado un problema concreto de investigación.'}</div>
          
          <table className="table-layout">
            <tbody>
              <tr>
                <td width="30%"><strong>Investigación Soñada</strong></td>
                <td>{a.dreamResearch || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Meta a 6 Meses</strong></td>
                <td>{a.sixMonthsDiscovery || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Idea Divergente</strong></td>
                <td>{a.divergentProjectIdea || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 04. PROYECTOS RELACIONADOS */}
        <Section num="04" title="Articulación con Investigaciones LabSIE">
          <p style={{ marginBottom: 15 }}>Se ha detectado correspondencia con los siguientes proyectos activos o históricos del grupo de investigación:</p>
          {d.relatedProjects.map(rp => (
            <div className="project-item" key={rp.projectCode} data-break>
              <div><span className="project-code">{rp.projectCode}</span> <span style={{fontSize: 10, color: 'var(--muted)', marginLeft: 8}}>Afinidad: {rp.affinity}%</span></div>
              <div className="project-title">{rp.projectTitle}</div>
              <p style={{ fontSize: 11 }}><strong>Motivo de la conexión:</strong> {rp.connectionReason}</p>
            </div>
          ))}
        </Section>

        <div className="page-break"></div>

        {/* 05. RUTA SUGERIDA Y ANÁLISIS */}
        <Section num="05" title="Determinación de Ruta Estratégica">
          <div className="route-banner" data-break>
            <div className="lr-box-title">Modalidad Sugerida</div>
            <div className="route-name">{d.routeType}</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text)' }}>{ROUTE_TEXT[d.routeType]}</p>
          </div>
          <div style={{ marginTop: 20 }}>
            <div className="lr-box-title">Justificación de la Correspondencia</div>
            {d.whyExplanation.map((x, i) => <p key={i}>{x}</p>)}
          </div>
        </Section>

        {/* 06. PROPUESTA PRELIMINAR */}
        <Section num="06" title="Diseño Preliminar de Investigación">
          <div className="lr-box" style={{ borderColor: 'var(--brand-main)' }} data-break>
            <p style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>{d.proposedProject.statusLabel || 'PROPUESTA DE TRABAJO DE GRADO'}</p>
            <h3 style={{ marginBottom: 15, fontSize: 18 }}>{d.proposedProject.tentativeTitle}</h3>
            
            <table className="table-layout" style={{ margin: 0 }}>
              <tbody>
                <tr>
                  <td width="25%"><strong>Pregunta de Investigación</strong></td>
                  <td style={{ fontStyle: 'italic' }}>{d.proposedProject.tentativeQuestion}</td>
                </tr>
                <tr>
                  <td><strong>Objetivo General</strong></td>
                  <td>{d.proposedProject.tentativeObjective}</td>
                </tr>
                <tr>
                  <td><strong>Conceptos Centrales</strong></td>
                  <td>{d.proposedProject.centralConcepts.join(' • ')}</td>
                </tr>
                <tr>
                  <td><strong>Contexto / Población</strong></td>
                  <td>{d.proposedProject.possibleContextPopulation}</td>
                </tr>
                <tr>
                  <td><strong>Aporte Proyectado</strong></td>
                  <td>{d.proposedProject.possibleContribution}</td>
                </tr>
                <tr>
                  <td><strong>Línea de Investigación</strong></td>
                  <td>{d.primaryLineName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 07. PRÓXIMOS PASOS */}
        <Section num="07" title="Siguientes Etapas Recomendadas">
          <ul className="lr-list" data-break>
            {d.proposedProject.nextSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </Section>

        {/* CARTA QWEN */}
        {q && (
          <Section num="08" title="Concepto Evaluativo Institucional">
            <div className="lr-box letter-format" style={{ background: '#FAF8F5' }} data-break>
              {(q.warmLetter || []).map((x, i) => <p key={i}>{x}</p>)}
              {q.whereYouCanEnter && (
                <p><strong>Punto de inserción sugerido:</strong> {q.whereYouCanEnter}</p>
              )}
              {(q.projectsYouCanDo || []).length > 0 && (
                <div style={{ marginTop: 15 }}>
                  <p><strong>Proyectos recomendados para tu perfil:</strong></p>
                  <ul className="lr-list">
                    {q.projectsYouCanDo!.map(x => (
                      <li key={x.projectCode}><strong>{x.projectCode}:</strong> {x.whatYouCanDo}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="signature">
                {q.closingNote || 'Atentamente,\nCoordinación Semillero LabSIE'}
              </div>
            </div>
          </Section>
        )}

        {/* SECCIÓN ADMIN */}
        {includeAdminSection && d.adminReview && (
          <Section num="09" title="Resolución de la Coordinación (Uso Interno)">
            <table className="table-layout" style={{ background: '#FEF3C7' }} data-break>
              <tbody>
                <tr>
                  <td width="25%"><strong>Estado de Revisión</strong></td>
                  <td>{d.adminReview.status}</td>
                </tr>
                <tr>
                  <td><strong>Decisión Oficial</strong></td>
                  <td>{d.adminReview.decision}</td>
                </tr>
                <tr>
                  <td><strong>Tutor Asignado</strong></td>
                  <td>{d.adminReview.assignedTutor || 'Pendiente de asignación'}</td>
                </tr>
                <tr>
                  <td><strong>Prioridad</strong></td>
                  <td>{d.adminReview.priority || 'Normal'}</td>
                </tr>
                <tr>
                  <td><strong>Observaciones Internas</strong></td>
                  <td>{d.adminReview.adminComments || 'Sin comentarios adicionales.'}</td>
                </tr>
              </tbody>
            </table>
          </Section>
        )}

        {/* NOTA FINAL */}
        <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', marginTop: 40, borderTop: '1px solid var(--border-light)', paddingTop: 20 }} data-break>
          <p><strong>Nota Institucional:</strong> Este documento constituye un análisis preliminar estructurado a partir del perfil del estudiante y la memoria técnica del Semillero LabSIE. No constituye un aval definitivo ni reemplaza los protocolos oficiales de aprobación de trabajo de grado de la Universidad.</p>
          <p>Semillero de Investigación LabSIE | Grupo de Investigación EduTLAN | edutlan.online</p>
        </div>

      </main>
    </div>
  );
};
