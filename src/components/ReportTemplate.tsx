import React from 'react';
import { AnalysisResult, RouteType } from '../types';
import { CLOSING_MESSAGE } from '../data/closingMessage';

/* =========================================================================
   INFORME DE ORIENTACIÓN INVESTIGATIVA · Semillero LabSIE · Grupo EduTLAN
   Plantilla del PDF: se renderiza fuera de pantalla y se convierte en páginas A4.
   Colores y tipografías del sistema (Lora, DM Sans, JetBrains Mono).
   ========================================================================= */

const css = `
.lr {
  --ink: #16241f; --muted: #556660; --line: #E4E2D8; --line-2: #D5DCD6;
  --paper: #FBFAF5; --card: #ffffff;
  --green: #0F5A3C; --green-2: #1F7A54; --green-3: #10B981; --green-soft: #E7F3EC; --green-line: #BFE3CF;
  --gold: #B8862B; --gold-ink: #8A611A; --gold-soft: #F8F0DD; --gold-line: #EBD9AE;
  --teal: #0E8A88; --teal-soft: #E3F4F3;
  --rose: #C2416C; --rose-soft: #FBEAF0;
  --serif: 'Lora', Georgia, serif;
  --sans: 'DM Sans', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
  width: 794px; background: var(--paper); color: var(--ink);
  font-family: var(--sans); font-size: 13px; line-height: 1.55;
}
.lr * { box-sizing: border-box; }
.lr h1, .lr h2, .lr h3, .lr h4 { color: inherit !important; }
.lr p { margin: 0; }
.lr-page { padding: 0 38px 30px; }

/* ---------- Encabezado ---------- */
.lr-hero { background: radial-gradient(700px 300px at 88% -20%, #2A8A60 0%, transparent 62%), linear-gradient(135deg, #0B3F2B 0%, #0F5A3C 58%, #13694A 100%); color: #F4F8F3; position: relative; overflow: hidden; }
.lr-hero::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 26px 26px; }
.lr-hero-in { padding: 24px 38px 92px; position: relative; z-index: 1; }
.lr-topbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; opacity: .9; }
.lr-id { display: inline-flex; align-items: center; line-height: 1.3; font-family: var(--mono); letter-spacing: .03em; text-transform: none; background: rgba(255,255,255,.13); padding: 3px 10px; border-radius: 99px; }
.lr-hero-row { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-top: 30px; }
.lr-kicker { color: #E9C77F; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; font-weight: 700; }
.lr-title { font-family: var(--serif); font-weight: 700; font-size: 42px; line-height: 1.06; margin: 10px 0 12px; color: #fff !important; }
.lr-lema { font-family: var(--serif); font-style: italic; font-size: 17px; opacity: .92; }
.lr-logo img { height: 92px; display: block; opacity: .96; }
.lr-stripe { height: 5px; background: linear-gradient(90deg, #1F7A54 0 25%, #E9C77F 25% 50%, #0E8A88 50% 75%, #C2416C 75% 100%); }

/* ---------- Tarjeta del estudiante ---------- */
.lr-student { margin-top: -62px; position: relative; z-index: 2; background: var(--card); border: 1px solid var(--line); border-radius: 18px;
  box-shadow: 0 18px 38px -22px rgba(15,58,40,.45); display: grid; grid-template-columns: 1.05fr 2fr; overflow: hidden; }
.lr-student-main { padding: 22px 24px; background: linear-gradient(160deg, #E7F3EC, #F3F9F5); border-right: 1px solid var(--line); }
.lr-avatar { width: 52px; height: 52px; border-radius: 50%; background: var(--green); color: #fff; display: block; text-align: center; line-height: 52px; font-family: var(--serif); font-size: 20px; font-weight: 700; box-shadow: 0 0 0 4px #fff; }
.lr-student-name { font-family: var(--serif); font-size: 21px; font-weight: 700; line-height: 1.2; margin: 12px 0 4px; }
.lr-student-prog { color: var(--muted); font-size: 12.5px; }
.lr-student-grid { padding: 20px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px 22px; align-content: center; }
.lr-field small { display: block; font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-ink); font-weight: 700; margin-bottom: 2px; }
.lr-field span { font-size: 12.5px; word-break: break-word; }

/* ---------- Secciones ---------- */
.lr-section { margin-top: 34px; }
.lr-sec-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.lr-sec-num { display: inline-block; text-align: center; line-height: 20px; min-width: 34px; height: 24px; padding: 0 9px; border-radius: 8px;
  background: var(--gold); color: #fff; font-family: var(--mono); font-size: 11px; font-weight: 600; }
.lr-sec-title { font-family: var(--serif); font-size: 21px; font-weight: 700; margin: 0; }
.lr-sec-rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--line-2), transparent); }
.lr-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; }
.lr-muted { color: var(--muted); }
.lr-label { font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--green-2); font-weight: 700; margin-bottom: 7px; }
.tint-green { background: linear-gradient(160deg, #EEF7F1, #fff 70%); border-color: var(--green-line); }
.tint-gold { background: linear-gradient(160deg, #FBF4E4, #fff 70%); border-color: var(--gold-line); }
.tint-gold .lr-label { color: var(--gold-ink); }
.top-green { border-top: 4px solid var(--green-2); }
.top-gold { border-top: 4px solid var(--gold); }
.top-teal { border-top: 4px solid var(--teal); }
.top-rose { border-top: 4px solid var(--rose); }
.top-teal .lr-label { color: var(--teal); }
.top-gold .lr-label { color: var(--gold-ink); }
.top-rose .lr-label { color: var(--rose); }

/* ---------- Perfil ---------- */
.lr-profile { display: grid; grid-template-columns: 180px 1fr; gap: 24px; align-items: center; }
.lr-gauge { position: relative; width: 170px; height: 170px; margin: 0 auto; }
.lr-gauge-val { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
.lr-gauge-val b { display: block; font-family: var(--serif); font-size: 46px; line-height: 50px; height: 50px; color: var(--green); }
.lr-gauge-val span { display: block; font-size: 10.5px; line-height: 1.2; color: var(--muted); }
.lr-archetype { font-family: var(--serif); font-size: 25px; line-height: 1.2; font-weight: 700; margin: 0; }
.lr-focus { color: var(--muted); margin: 4px 0 10px !important; }
.lr-badge { display: inline-flex; align-items: center; line-height: 1.25; padding: 4px 12px; border-radius: 99px; font-size: 11.5px; font-weight: 700; }
.lr-badge.green { background: var(--green-soft); color: var(--green); border: 1px solid var(--green-line); }
.lr-badge.gold { background: var(--gold-soft); color: var(--gold-ink); border: 1px solid var(--gold-line); }
.lr-traits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
.lr-trait { border-left: 3px solid var(--gold); padding: 2px 0 2px 10px; }
.lr-trait small { display: block; font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; font-weight: 700; }
.lr-trait span { font-size: 12.5px; font-weight: 500; }

/* ---------- Intereses ---------- */
.lr-two { display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; align-items: stretch; }
.lr-list { list-style: none; padding: 0; margin: 0; }
.lr-list li { padding: 8px 0 8px 28px; position: relative; border-bottom: 1px dashed var(--line); }
.lr-list li:last-child { border-bottom: 0; }
.lr-list li::before { content: "?"; position: absolute; left: 0; top: 9px; width: 18px; height: 18px; border-radius: 50%;
  background: var(--green-2); color: #fff; font-weight: 700; font-size: 10px; display: block; text-align: center; line-height: 18px; }
.lr-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.lr-chip { display: inline-flex; align-items: center; line-height: 1.25; border: 1px solid var(--green-2); color: var(--green); border-radius: 99px; padding: 5px 12px; font-size: 12px; font-weight: 600; background: #fff; }
.tint-gold .lr-chip { border-color: var(--gold); color: var(--gold-ink); }

/* ---------- Inquietud ---------- */
.lr-quote { font-family: var(--serif); font-size: 17px; line-height: 1.5; margin: 0; padding: 20px 24px 20px 58px; background: linear-gradient(120deg, #FBF4E4, #fff 60%); border: 1px solid var(--gold-line); border-radius: 14px; position: relative; }
.lr-quote::before { content: "\\201C"; position: absolute; left: 16px; top: 4px; font-size: 64px; color: var(--gold); line-height: 1; font-family: var(--serif); }
.lr-ideas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }
.lr-idea p { font-size: 12.5px; }

/* ---------- Proyectos ---------- */
.lr-proj { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.lr-projcard { padding: 0; overflow: hidden; }
.lr-projhead { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: var(--green); color: #fff; }
.lr-code { display: inline-flex; align-items: center; line-height: 1.3; font-family: var(--mono); font-size: 11px; font-weight: 600; }
.lr-aff { display: inline-flex; align-items: center; line-height: 1.3; font-size: 10.5px; font-weight: 700; background: #E9C77F; color: #3B2A08; padding: 2px 9px; border-radius: 99px; }
.lr-projbody { padding: 14px 16px 16px; }
.lr-proj h4 { font-family: var(--serif); font-size: 14.5px; line-height: 1.35; font-weight: 700; margin: 0 0 10px; }
.lr-proj-q { font-size: 12px !important; font-style: italic; color: var(--muted); border-left: 2px solid var(--gold); padding-left: 10px; margin-top: 10px !important; }

/* ---------- Ruta ---------- */
.lr-route { display: grid; grid-template-columns: auto 1fr; gap: 22px; align-items: center; background: linear-gradient(120deg, var(--gold-soft), #fff 75%);
  border: 1px solid var(--gold-line); border-radius: 14px; padding: 20px 22px; margin-top: 14px; }
.lr-route-tag { font-family: var(--serif); font-size: 30px; font-weight: 700; letter-spacing: .06em; color: var(--gold-ink); line-height: 1.1; }
.lr-steps-route { display: flex; gap: 5px; margin-top: 8px; }
.lr-steps-route span { display: inline-flex; align-items: center; line-height: 1.3; font-size: 9.5px; font-weight: 600; padding: 2px 7px; border-radius: 6px; background: #fff; border: 1px solid var(--line); color: var(--muted); }
.lr-steps-route span.on { background: var(--gold-ink); border-color: var(--gold-ink); color: #fff; }

/* ---------- Propuesta ---------- */
.lr-proposal { border: 1.5px solid var(--green); border-radius: 18px; overflow: hidden; background: var(--card); }
.lr-proposal-head { background: linear-gradient(135deg, #0B3F2B, #0F5A3C 60%, #1F7A54); color: #fff; padding: 20px 24px; }
.lr-stamp { display: inline-flex; align-items: center; line-height: 1.3; font-family: var(--mono); font-size: 9.5px; letter-spacing: .08em; border: 1px dashed rgba(255,255,255,.65); padding: 3px 8px; border-radius: 4px; color: #E9C77F; }
.lr-proposal-head h3 { font-family: var(--serif); font-size: 20px; line-height: 1.3; margin: 12px 0 0; font-weight: 700; color: #fff !important; }
.lr-proposal-body { padding: 20px 24px; display: grid; gap: 16px; }
.lr-rq { font-family: var(--serif); font-size: 16px; line-height: 1.5; background: var(--green-soft); border-left: 4px solid var(--green-2); padding: 12px 16px; border-radius: 0 10px 10px 0; }
.lr-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.lr-mini { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }

/* ---------- Enfoques ---------- */
.lr-approach { display: grid; gap: 10px; }
.lr-ap { display: grid; grid-template-columns: 1fr 170px; gap: 18px; align-items: center; border-left: 5px solid var(--acc); }
.lr-ap h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; font-family: var(--sans); color: var(--acc) !important; }
.lr-ap p { font-size: 12.5px; }
.lr-bar { height: 9px; border-radius: 99px; background: #EEF1EC; overflow: hidden; }
.lr-bar i { display: block; height: 100%; border-radius: 99px; background: var(--acc); }
.lr-bar-val { display: flex; justify-content: space-between; align-items: baseline; font-size: 10.5px; color: var(--muted); margin-bottom: 5px; }
.lr-bar-val b { font-family: var(--serif); font-size: 20px; color: var(--acc); }

/* ---------- Opciones ---------- */
.lr-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding-top: 18px; }
.lr-opt { display: flex; flex-direction: column; gap: 9px; position: relative; padding-top: 28px; border-top: 4px solid var(--acc); }
.lr-opt-n { position: absolute; top: -18px; left: 18px; width: 34px; height: 34px; border-radius: 50%; background: var(--acc); color: #fff; font-family: var(--serif); font-weight: 700; font-size: 15px; display: block; text-align: center; line-height: 34px; box-shadow: 0 0 0 4px var(--paper); }
.lr-opt .lr-label { color: var(--acc); margin: 0; }
.lr-opt h4 { font-family: var(--serif); font-size: 14px; line-height: 1.35; margin: 0; font-weight: 700; }
.lr-opt p { font-size: 12px; }

/* ---------- Línea + pasos ---------- */
.lr-line { font-family: var(--serif); font-size: 17px; line-height: 1.4; }
.lr-timeline { list-style: none; margin: 0; padding: 0; counter-reset: s; }
.lr-timeline li { counter-increment: s; position: relative; padding: 4px 0 16px 46px; font-size: 12.5px; }
.lr-timeline li::before { content: counter(s, decimal-leading-zero); position: absolute; left: 0; top: 0; width: 30px; height: 30px; border-radius: 9px; background: var(--green); color: #fff; font-family: var(--mono); font-size: 11px; display: block; text-align: center; line-height: 30px; }
.lr-timeline li::after { content: ""; position: absolute; left: 14px; top: 32px; bottom: 2px; width: 2px; background: var(--green-line); }
.lr-timeline li:last-child::after { display: none; }

/* ---------- Carta ---------- */
.lr-letter { border: 1px solid var(--gold-line); border-radius: 18px; padding: 26px 30px; background: linear-gradient(180deg, #FBF4E4 0, #fff 140px); }
.lr-letter h3 { font-family: var(--serif); font-size: 20px; margin: 0 0 12px; font-weight: 700; color: var(--green) !important; }
.lr-letter p { margin-bottom: 10px; }
.lr-do { list-style: none; padding: 0; margin: 6px 0 12px; display: grid; gap: 8px; }
.lr-do li { border-left: 4px solid var(--green-2); background: var(--green-soft); border-radius: 0 10px 10px 0; padding: 9px 13px; font-size: 12.5px; }
.lr-do b { color: var(--green); }
.lr-sign { font-family: var(--serif); font-style: italic; color: var(--green); font-size: 15.5px; margin-top: 12px !important; }

/* ---------- Antes de irte (mismo estilo que en Resultados) ---------- */
.lr-goodbye { position: relative; overflow: hidden; background: #FFFDF9; border: 2px solid #10B981; border-radius: 18px; padding: 32px 40px 28px; }
.lr-goodbye::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 6px; background: linear-gradient(90deg, #10B981, #ffcf3f, #ff5d8f); }
.lr-goodbye-k { display: block; text-align: center; font-size: 10.5px; letter-spacing: .13em; text-transform: uppercase; font-weight: 700; color: #059669; }
.lr-goodbye h3 { font-family: var(--serif); text-align: center; font-size: 23px; line-height: 1.28; font-weight: 700; margin: 6px auto 16px; max-width: 560px; }
.lr-goodbye p { font-family: var(--serif); font-size: 13.8px; line-height: 1.65; margin-bottom: 11px; color: #24302F; }
.lr-goodbye blockquote { margin: 0 0 11px; border-left: 4px solid #10B981; padding-left: 14px; font-family: var(--serif); font-style: italic; font-size: 14.5px; color: #065F46; }
.lr-goodbye .lr-final { font-weight: 700; color: #1C2624; }
.lr-goodbye-cta { text-align: center; margin-top: 14px; }
.lr-goodbye-cta span { display: inline-flex; align-items: center; line-height: 1.3; background: #059669; color: #fff; font-weight: 700; font-size: 12.5px; padding: 9px 18px; border-radius: 12px; }

.lr-admin { border: 1.5px dashed var(--gold); background: var(--gold-soft); }
.lr-note { margin-top: 26px; font-size: 11px; color: var(--muted); background: #F3F1EA; border-radius: 12px; padding: 12px 16px; }
`;

const ACCENTS = ['#1F7A54', '#0E8A88', '#B8862B'];
const OPTION_ACCENTS = ['#1F7A54', '#B8862B', '#C2416C'];

const ROUTES: RouteType[] = ['HEREDAR', 'CONECTAR', 'TRASCENDER', 'EXPLORAR'];
const ROUTE_TEXT: Record<RouteType, string> = {
  HEREDAR: 'Cuentas con lo necesario para continuar y profundizar una investigación que ya existe en el semillero, con datos y preguntas abiertas documentadas.',
  CONECTAR: 'Tu perfil une dos o más proyectos del semillero: puedes trabajar en la intersección entre ellos y abrir un cruce interdisciplinar.',
  TRASCENDER: 'Partes de la memoria investigativa de LabSIE para abrir una dirección nueva, con otra población, contexto o enfoque.',
  EXPLORAR: 'Tus inquietudes aún no convergen con una línea activa: la ruta propone diálogo con tu tutor para madurar tu idea.'
};

const Section: React.FC<{ num: string; title: string; children: React.ReactNode }> = ({ num, title, children }) => (
  <section className="lr-section" data-break>
    <div className="lr-sec-head" data-keep-next>
      <span className="lr-sec-num">{num}</span>
      <h2 className="lr-sec-title">{title}</h2>
      <span className="lr-sec-rule" />
    </div>
    {children}
  </section>
);

const Gauge: React.FC<{ value: number }> = ({ value }) => {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <div className="lr-gauge">
      <svg viewBox="0 0 170 170" width="170" height="170">
        <defs>
          <linearGradient id="lrg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1F7A54" />
            <stop offset="1" stopColor="#B8862B" />
          </linearGradient>
        </defs>
        <circle cx="85" cy="85" r={r} fill="none" stroke="#E7F3EC" strokeWidth="13" />
        <circle cx="85" cy="85" r={r} fill="none" stroke="url(#lrg)" strokeWidth="13" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(100, value)) / 100)} transform="rotate(-90 85 85)" />
      </svg>
      <div className="lr-gauge-val">
        <b>{value}</b>
        <span>de 100 puntos</span>
      </div>
    </div>
  );
};

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

export interface ReportTemplateProps {
  analysis: AnalysisResult;
  logoSrc?: string | null;
  logoWhiteSrc?: string | null;
  projectQuestions?: Record<string, string>;
  includeAdminSection?: boolean;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({ analysis: d, logoSrc, logoWhiteSrc, projectQuestions = {}, includeAdminSection }) => {
  const p = d.studentProfile;
  const a = d.studentAnswers;
  const q = d.qwenAnalysis;
  const date = new Date(d.timestamp).toLocaleDateString('es-CO');
  const perspective = d.perspectives?.find(x => x.id === d.selectedPerspectiveId) || d.perspectives?.[0];

  return (
    <div className="lr">
      <style>{css}</style>

      <header className="lr-hero">
        <div className="lr-hero-in">
          <div className="lr-topbar">
            <span>Semillero de Investigación LabSIE · Grupo EduTLAN · Universidad de Córdoba</span>
            <span className="lr-id">ID {d.id} · {date}</span>
          </div>
          <div className="lr-hero-row">
            <div>
              <div className="lr-kicker">Informe de orientación investigativa</div>
              <h1 className="lr-title text-white">De la curiosidad<br />a la investigación</h1>
              <p className="lr-lema">“De tus intereses a una posible investigación.”</p>
            </div>
            {(logoWhiteSrc || logoSrc) && (
              <div className="lr-logo">
                <img src={logoWhiteSrc || logoSrc!} alt="LabSIE" />
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="lr-stripe" />

      <main className="lr-page">
        <div className="lr-student" data-break>
          <div className="lr-student-main">
            <div className="lr-avatar">{initials(p.name)}</div>
            <div className="lr-student-name">{p.name}</div>
            <div className="lr-student-prog">{p.program} · Semestre {p.semester}</div>
          </div>
          <div className="lr-student-grid">
            <div className="lr-field"><small>Vinculación</small><span>Semillero LabSIE (Ruta activada)</span></div>
            <div className="lr-field"><small>Grupo</small><span>EduTLAN (Categoría A MinCiencias)</span></div>
            <div className="lr-field"><small>Correo</small><span>{p.email || '—'}</span></div>
            <div className="lr-field"><small>Teléfono</small><span>{p.phone || 'No registrado'}</span></div>
          </div>
        </div>

        <Section num="01" title="Perfil investigativo">
          <div className="lr-card lr-profile" data-break>
            <Gauge value={d.correspondenceScore} />
            <div>
              <div className="lr-label">Arquetipo identificado</div>
              <h3 className="lr-archetype">{d.profileArchetype}</h3>
              {perspective && <p className="lr-focus">{perspective.focusArea}</p>}
              <span className="lr-badge green">Correspondencia global · {d.correspondenceLevel}</span>
              <p className="lr-muted" style={{ fontSize: 12, marginTop: 8 }}>
                Sintetiza la relación entre tus intereses, tus preferencias de investigación y el patrimonio histórico de LabSIE.
              </p>
              <div className="lr-traits">
                <div className="lr-trait"><small>Experiencia previa</small><span>{p.researchExperience}</span></div>
                <div className="lr-trait"><small>Formación técnica</small><span>{p.techExperience}</span></div>
                <div className="lr-trait"><small>Familiaridad con IA</small><span>{p.aiExperience}</span></div>
              </div>
            </div>
          </div>
        </Section>

        <Section num="02 · 03" title="Intereses y formas de investigar">
          <div className="lr-two" data-break>
            <div className="lr-card tint-green">
              <div className="lr-label">Curiosidades científicas</div>
              <ul className="lr-list">{d.whyBreakdown.matchingInterests.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="lr-card tint-gold">
              <div className="lr-label">Cómo prefieres investigar</div>
              <div className="lr-chips">{d.dominantResearchWays.map(f => <span className="lr-chip" key={f}>{f}</span>)}</div>
              {a.continuationPreference && (
                <>
                  <div className="lr-label" style={{ marginTop: 18 }}>Preferencia de continuidad</div>
                  <span className="lr-badge gold">{a.continuationPreference}</span>
                </>
              )}
            </div>
          </div>
        </Section>

        <Section num="04" title="Tu inquietud propia">
          <div data-break>
            <div className="lr-label">Problema a investigar</div>
            <blockquote className="lr-quote">{a.problemToInvestigate || a.studentResearchIdea || 'No especificado en el test.'}</blockquote>
          </div>
          <div className="lr-ideas" data-break>
            <div className="lr-card lr-idea top-teal"><div className="lr-label">Investigación soñada</div><p>{a.dreamResearch || '—'}</p></div>
            <div className="lr-card lr-idea top-gold"><div className="lr-label">Meta a seis meses</div><p>{a.sixMonthsDiscovery || '—'}</p></div>
            <div className="lr-card lr-idea top-rose"><div className="lr-label">Idea divergente</div><p>{a.divergentProjectIdea || '—'}</p></div>
          </div>
        </Section>

        <Section num="05" title="Investigaciones de LabSIE relacionadas">
          <div className="lr-proj">
            {d.relatedProjects.map(rp => (
              <article className="lr-card lr-projcard" key={rp.projectCode} data-break>
                <div className="lr-projhead">
                  <span className="lr-code">{rp.projectCode}</span>
                  <span className="lr-aff">Afinidad {rp.affinity}%</span>
                </div>
                <div className="lr-projbody">
                  <h4>{rp.projectTitle}</h4>
                  <div className="lr-label">Por qué se relaciona contigo</div>
                  <p style={{ fontSize: 12.5 }}>{rp.connectionReason}</p>
                  {projectQuestions[rp.projectCode] && <p className="lr-proj-q">Pregunta guía: {projectQuestions[rp.projectCode]}</p>}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section num="06 · 07" title="Análisis de correspondencia y ruta sugerida">
          <div className="lr-card tint-green" data-break>
            {d.whyExplanation.map((x, i) => <p key={i} style={{ marginTop: i ? 10 : 0, marginBottom: 0 }}>{x}</p>)}
          </div>
          <div className="lr-route" data-break>
            <div>
              <div className="lr-label" style={{ color: '#7A4D27' }}>Modalidad de ruta</div>
              <div className="lr-route-tag">{d.routeType}</div>
              <div className="lr-steps-route">
                {ROUTES.map(r => <span key={r} className={r === d.routeType ? 'on' : ''}>{r}</span>)}
              </div>
            </div>
            <p style={{ margin: 0 }}>{ROUTE_TEXT[d.routeType]}</p>
          </div>
        </Section>

        <Section num="08" title="Posibilidad de investigación para explorar">
          <div className="lr-proposal" data-break>
            <div className="lr-proposal-head">
              <span className="lr-stamp">{d.proposedProject.statusLabel || 'PROPUESTA PRELIMINAR — SUJETA A VALIDACIÓN'}</span>
              <h3 className="text-white">{d.proposedProject.tentativeTitle}</h3>
            </div>
            <div className="lr-proposal-body">
              <div>
                <div className="lr-label">Pregunta de investigación tentativa</div>
                <p className="lr-rq">{d.proposedProject.tentativeQuestion}</p>
              </div>
              <div>
                <div className="lr-label">Objetivo general tentativo</div>
                <p style={{ margin: 0 }}>{d.proposedProject.tentativeObjective}</p>
              </div>
              <div>
                <div className="lr-label">Conceptos centrales</div>
                <div className="lr-chips">{d.proposedProject.centralConcepts.map(c => <span className="lr-chip" key={c}>{c}</span>)}</div>
              </div>
              <div className="lr-grid2">
                <div className="lr-mini"><div className="lr-label">Contexto / población</div><p>{d.proposedProject.possibleContextPopulation}</p></div>
                <div className="lr-mini"><div className="lr-label">Aporte al semillero</div><p>{d.proposedProject.possibleContribution}</p></div>
              </div>
            </div>
          </div>
        </Section>

        {d.perspectives && d.perspectives.length > 0 && (
          <Section num="08-B" title="Tres puntos de vista analizados">
            <div className="lr-approach">
              {d.perspectives.map((x, i) => (
                <div className="lr-card lr-ap" key={x.id} data-break style={{ '--acc': ACCENTS[i % ACCENTS.length] } as React.CSSProperties}>
                  <div>
                    <h4>{x.title}</h4>
                    <p>{x.shortDescription}</p>
                    <p className="lr-muted" style={{ marginTop: 5, fontSize: 12 }}><b>Metodología:</b> {x.methodologyFocus.type}</p>
                  </div>
                  <div>
                    <div className="lr-bar-val"><span>Afinidad</span><b>{x.correspondenceScore}%</b></div>
                    <div className="lr-bar"><i style={{ width: `${x.correspondenceScore}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {d.proposedProjectOptions && d.proposedProjectOptions.length > 0 && (
          <Section num="08-C" title="Opciones de proyectos nuevos">
            <div className="lr-options" data-break>
              {d.proposedProjectOptions.map((o, i) => (
                <article className="lr-card lr-opt" key={o.id} style={{ '--acc': OPTION_ACCENTS[i % OPTION_ACCENTS.length] } as React.CSSProperties}>
                  <span className="lr-opt-n">{i + 1}</span>
                  <span className="lr-label" style={{ margin: 0 }}>{o.category}</span>
                  <h4>{o.tentativeTitle}</h4>
                  <p className="lr-muted"><b>Pregunta:</b> {o.tentativeQuestion}</p>
                  <p><b>Objetivo:</b> {o.tentativeObjective}</p>
                </article>
              ))}
            </div>
          </Section>
        )}

        <div className="lr-two">
          <Section num="09" title="Línea sugerida">
            <div className="lr-card tint-gold" data-break>
              <div className="lr-label">Línea de investigación</div>
              <p className="lr-line">{d.primaryLineName}</p>
            </div>
          </Section>
          <Section num="10" title="Próximos pasos">
            <ol className="lr-timeline" data-break>{d.proposedProject.nextSteps.map(x => <li key={x}>{x}</li>)}</ol>
          </Section>
        </div>

        {includeAdminSection && d.adminReview && (
          <Section num="11" title="Decisión de la coordinación">
            <div className="lr-card lr-admin" data-break>
              <div className="lr-grid2">
                <div><div className="lr-label">Estado</div><p style={{ margin: 0 }}>{d.adminReview.status}</p></div>
                <div><div className="lr-label">Decisión</div><p style={{ margin: 0 }}>{d.adminReview.decision}</p></div>
                {d.adminReview.assignedTutor && <div><div className="lr-label">Tutor asignado</div><p style={{ margin: 0 }}>{d.adminReview.assignedTutor}</p></div>}
                {d.adminReview.priority && <div><div className="lr-label">Prioridad</div><p style={{ margin: 0 }}>{d.adminReview.priority}</p></div>}
              </div>
              <div className="lr-label" style={{ marginTop: 14 }}>Observaciones</div>
              <p style={{ margin: 0 }}>{d.adminReview.adminComments || 'Sin observaciones adicionales registradas.'}</p>
            </div>
          </Section>
        )}

        <p className="lr-note" data-break>
          <b>Nota metodológica.</b> Este documento es una orientación inicial basada en las respuestas del estudiante y en la información disponible
          sobre las investigaciones del semillero. No representa por sí mismo la aprobación, asignación o validación definitiva de un proyecto; la
          decisión final corresponde a la coordinación del Semillero LabSIE y al Grupo EduTLAN.
        </p>

        {q && (
          <Section num={includeAdminSection && d.adminReview ? '12' : '11'} title="Tu reporte de ruta investigativa">
            <div className="lr-letter" data-break>
              <h3>{p.name.split(' ')[0]}, gracias por abrirnos tu curiosidad.</h3>
              {(q.warmLetter || []).map((x, i) => <p key={i}>{x}</p>)}
              {q.whereYouCanEnter && (
                <>
                  <div className="lr-label" style={{ marginTop: 16 }}>Dónde puedes entrar</div>
                  <p>{q.whereYouCanEnter}</p>
                </>
              )}
              {(q.projectsYouCanDo || []).length > 0 && (
                <>
                  <div className="lr-label" style={{ marginTop: 12 }}>Proyectos en los que puedes participar</div>
                  <ul className="lr-do">
                    {q.projectsYouCanDo!.map(x => (
                      <li key={x.projectCode}><b>{x.projectCode} · {x.projectTitle}.</b> {x.whatYouCanDo}</li>
                    ))}
                  </ul>
                </>
              )}
              <p className="lr-sign">{q.closingNote || 'Te esperamos en el semillero.'}</p>
              <p className="lr-muted" style={{ margin: 0, fontSize: 12 }}>Más información en edutlan.online</p>
            </div>
          </Section>
        )}

        <section className="lr-section" data-break>
          <div className="lr-goodbye">
            <span className="lr-goodbye-k">{CLOSING_MESSAGE.kicker}</span>
            <h3>{CLOSING_MESSAGE.title}</h3>
            <p>{CLOSING_MESSAGE.intro}</p>
            <blockquote>{CLOSING_MESSAGE.quote}</blockquote>
            {CLOSING_MESSAGE.paragraphs.map((x, i) => <p key={i}>{x}</p>)}
            <p className="lr-final">{CLOSING_MESSAGE.closing}</p>
            <div className="lr-goodbye-cta"><span>Más información en edutlan.online</span></div>
          </div>
        </section>


      </main>
    </div>
  );
};
