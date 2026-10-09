import { useState, useEffect, useMemo, ReactNode, CSSProperties } from 'react';

const LOGO_E = 'https://pub-1ec8494dfebf4d9d96fdb25fd581ca63.r2.dev/logo%20edutlan%20sin%20fondo%20(1).png';
const LOGO_L = 'https://pub-1ec8494dfebf4d9d96fdb25fd581ca63.r2.dev/logo%20labsie%20sin%20fondo.png';

/* ── sprites ── */
const BODY = [
  '....HHHH....',
  '...HHHHHH...',
  '...HSSSSH...',
  '...SESSES...',
  '...SSSSSS...',
  '....SSSS....',
  '..TTTTTTTT..',
  '.BTTTTTTTTS.',
  '.BTTTTTTTTS.',
  '.BTTTTTTTTS.',
  '..TTTTTTTT..',
  '...PPPPPP...'
];
const LEG_A = ['...PP..PP...', '...KK..KK...'];
const LEG_B = ['....PPPP....', '....KKKK....'];
const SEAT_LEGS = ['..PPPPPPPP..', '..PPPPPPPP..', '...PP..PP...', '...KK..KK...'];

type Pal = Record<string, string>;

const px = (rows: string[], pal: Pal, oy = 0) =>
  rows.flatMap((r, y) =>
    [...r].map((k, x) =>
      pal[k] ? <rect key={`${x}-${y}-${oy}`} x={x} y={y + oy} width="1.03" height="1.03" fill={pal[k]} /> : null
    )
  );

/** Cabello largo: los costados de la cara se pintan con el color del pelo. */
const bodyFor = (long?: boolean) =>
  long ? BODY.map((r, i) => (i >= 2 && i <= 6 ? r.slice(0, 2) + 'H' + r.slice(3, 9) + 'H' + r.slice(10) : r)) : BODY;

/** Diadema con audífonos y micrófono (videollamada). */
const Headset = () => (
  <g>
    <rect x="3" y="0" width="6" height=".7" fill="#120f33" />
    <rect x="2" y="2" width="1" height="2" fill="#ff5d8f" />
    <rect x="9" y="2" width="1" height="2" fill="#ff5d8f" />
    <rect x="7" y="4.4" width="2" height=".6" fill="#120f33" />
  </g>
);

function Character({ pal, long }: { pal: Pal; long?: boolean }) {
  return (
    <svg className="char" viewBox="0 0 12 14" shapeRendering="crispEdges" style={{ width: 'calc(var(--u)*12)', display: 'block' }}>
      {px(bodyFor(long), pal)}
      <g className="la">{px(LEG_A, pal, 12)}</g>
      <g className="lb">{px(LEG_B, pal, 12)}</g>
    </svg>
  );
}

const mk = (T: string, B: string, S: string, H: string, P = '#2b2f6b'): Pal => ({ T, B, S, H, P, K: '#120f33', E: '#120f33' });

/* ── el equipo ── */
const TEAM = {
  manuel: { pal: mk('#f6f5ef', '#d6d4cb', '#f6d5b8', '#2a1a0e'), long: false },
  yuliana: { pal: mk('#1d1b26', '#2c2a38', '#f2c29b', '#ff7a1a', '#3a5a9b'), long: true },
  jesus: { pal: mk('#f6f5ef', '#d6d4cb', '#f6d5b8', '#120f33', '#3b3f4a'), long: false },
  andreina: { pal: mk('#9b7bff', '#7d5ee6', '#e0ac69', '#4a2c17'), long: true },
  mafe: { pal: mk('#ff5d8f', '#e04476', '#f6d5b8', '#1a1330'), long: true },
  leidy: { pal: mk('#36e0d0', '#22bfb0', '#f6d5b8', '#2a1a0e'), long: true },
  cristian: { pal: mk('#2fbf71', '#239a5a', '#e0ac69', '#120f33'), long: false },
  daniela: { pal: mk('#ffcf3f', '#e6b322', '#f2c29b', '#6b3a1e'), long: true },
  daniel: { pal: mk('#3a7bd5', '#2c62b0', '#c68642', '#2a1a0e'), long: false },
  sami: { pal: mk('#ff9fd0', '#f47cbb', '#f6d5b8', '#3b2414', '#4a6fb5'), long: true },
  jeffrey: { pal: mk('#ff9a4d', '#e07a2d', '#f6d5b8', '#8a5a2b', '#2b2f6b'), long: false },
  andrea: { pal: mk('#f87171', '#e05252', '#c68642', '#1a1330'), long: true },
  raul: { pal: mk('#f7f7f2', '#dcdcd4', '#7a4a2a', '#120f33'), long: false },
  diana: { pal: mk('#60a5fa', '#3b82f6', '#e0ac69', '#5b3a1e'), long: true }
};


/* ── Sami: sprite propio y más detallado (16 px de ancho) ── */
const SAMI_PAL: Pal = {
  H: '#3b2414', // cabello
  h: '#7a4a2a', // brillo del cabello
  R: '#ff4f9a', // moño
  r: '#ffc2dd', // luz del moño
  S: '#f6d5b8', // piel
  W: '#ffffff', // brillo de los ojos
  E: '#120f33', // ojos
  M: '#c9636f', // boca
  D: '#ff9fd0', // blusa rosadita
  d: '#f47cbb', // sombra de la blusa
  P: '#4a6fb5', // jean
  K: '#2b2f6b' // zapatos
};
const SAMI_BODY = [
  '....HHHHHH.RrR..',
  '...HHhhHHHHHRR..',
  '..HHhHHHHHHHH...',
  '..HHhSSSSSShHH..',
  '..HSSEESSEESSH..',
  '..HSSEWSSEWSSH..',
  '..HSSSSSSSSSSH..',
  '..HHSSSMMSSSHH..',
  '..HHH..SS..HHH..',
  '..HHHdDDDDdHHH..',
  '..HHdDDDDDDdHH..',
  '...SdDDDDDDdS...',
  '....dDDDDDDd....',
  '.....PPPPPP.....',
  '.....PPPPPP.....'
];
const SAMI_LEG_A = ['.....PP..PP.....', '.....KK..KK.....'];
const SAMI_LEG_B = ['......PPPP......', '......KKKK......'];

/* ── Camisa blanca con cuello y botones (Manuel y Raúl): sprite detallado de 16 px ── */
const SHIRT_ROWS = [
  '....cWWccWWc....',
  '...WWWWbWWWWW...',
  '...WwWWbWWWwW...',
  '...SwWWbWWWwS...',
  '....WWWbWWWW....',
  '....PPPPPPPP....',
  '....PPPPPPPP....'
];
const SHIRT_LEG_A = ['.....PP..PP.....', '.....KK..KK.....'];
const SHIRT_LEG_B = ['......PPPP......', '......KKKK......'];

/** Raúl: moreno, delgado, con gafas y camisa blanca. */
const RAUL_PAL: Pal = {
  H: '#120f33', S: '#7a4a2a', G: '#1d1b26', L: '#cfe8ff', E: '#120f33', M: '#4a2416',
  W: '#f7f7f2', w: '#dcdcd4', c: '#e6e6de', b: '#b9b9b0', P: '#2b2f6b', K: '#1d1b26'
};
const RAUL_BODY = [
  '......HHHH......',
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '...HSSSSSSSSH...',
  '...GGGGSSGGGG...',
  '...GLLEGGELLG...',
  '...SGGGSSGGGS...',
  '....SSSSSSSS....',
  '....SSSMMSSS....',
  '......SSSS......',
  ...SHIRT_ROWS
];

/** Manuel: piel blanca, cabello castaño corto y camisa blanca. */
const MANUEL_PAL: Pal = {
  H: '#2a1a0e', h: '#5a3a22', S: '#f6d5b8', E: '#120f33', M: '#c9636f',
  W: '#ffffff', w: '#dedbd2', c: '#ecebe4', b: '#bdbab0', P: '#3b4a7a', K: '#1d1b26'
};
const MANUEL_BODY = [
  '......HHHH......',
  '....HHhHHHHH....',
  '...HHhHHHHHHH...',
  '...HSSSSSSSSH...',
  '....SSSSSSSS....',
  '....SSESSESS....',
  '....SSSSSSSS....',
  '....SSSMMSSS....',
  '.....SSSSSS.....',
  '......SSSS......',
  ...SHIRT_ROWS
];

type DetailedId = 'sami' | 'raul' | 'manuel';
const DETAILED: Record<DetailedId, { pal: Pal; body: string[]; legA: string[]; legB: string[] }> = {
  sami: { pal: SAMI_PAL, body: SAMI_BODY, legA: SAMI_LEG_A, legB: SAMI_LEG_B },
  raul: { pal: RAUL_PAL, body: RAUL_BODY, legA: SHIRT_LEG_A, legB: SHIRT_LEG_B },
  manuel: { pal: MANUEL_PAL, body: MANUEL_BODY, legA: SHIRT_LEG_A, legB: SHIRT_LEG_B }
};

function DetailedCharacter({ id }: { id: DetailedId }) {
  const d = DETAILED[id];
  const rows = d.body.length;
  return (
    <svg className="char" viewBox={`0 0 16 ${rows + 2}`} shapeRendering="crispEdges" style={{ width: 'calc(var(--u)*13)', display: 'block' }}>
      {px(d.body, d.pal)}
      <g className="la">{px(d.legA, d.pal, rows)}</g>
      <g className="lb">{px(d.legB, d.pal, rows)}</g>
      {id === 'sami' && <rect className="blink" x="14.2" y="0" width=".7" height=".7" fill="#fff" />}
      {id === 'raul' && <rect className="blink" x="4.6" y="5" width=".6" height=".6" fill="#fff" />}
    </svg>
  );
}

interface WalkerCfg {
  name: string;
  y: number;
  s: number;
  dur: number;
  delay: number;
  x: number;
  long?: boolean;
  pal: Pal;
  every: number;
  say: string[];
  sparkle?: boolean;
  special?: DetailedId;
}

function Walker({ cfg }: { cfg: WalkerCfg }) {
  const [show, setShow] = useState(true);
  const [hop, setHop] = useState(false);
  useEffect(() => {
    if (!cfg.say.length) return;
    const t = setInterval(() => setShow(v => !v), cfg.every);
    return () => clearInterval(t);
  }, [cfg]);
  const poke = () => {
    setShow(true);
    setHop(true);
    setTimeout(() => setHop(false), 500);
  };
  return (
    <div
      className="w"
      style={
        {
          bottom: `${cfg.y}%`,
          zIndex: 100 - cfg.y,
          '--u': `calc(var(--u0)*${cfg.s})`,
          '--x0': `${cfg.x}%`,
          animationDuration: `${cfg.dur}s`,
          animationDelay: `${cfg.delay}s`
        } as CSSProperties
      }
    >
      {cfg.say.length > 0 && show && (
        <div className="bub" style={{ '--bc': cfg.pal.T === '#f6f5ef' ? '#36e0d0' : cfg.pal.T } as CSSProperties}>
          {cfg.say[0]}
        </div>
      )}
      <div className={hop ? 'hp hop' : 'hp'} onClick={poke} role="img" aria-label={cfg.name}>
        <div className="bob">
          <div className="fl" style={{ animationDuration: `${cfg.dur}s`, animationDelay: `${cfg.delay}s` }}>
            {cfg.special ? <DetailedCharacter id={cfg.special} /> : <Character pal={cfg.pal} long={cfg.long} />}
          </div>
        </div>
      </div>
      <div className="shadow" />
      {cfg.sparkle && (
        <div className="sparkles" aria-hidden="true">
          {SPARKLES.map((sp, i) => (
            <i key={i} style={{ '--dx': sp.dx, '--sx': sp.x, background: sp.c, animationDelay: `${sp.d}s` } as CSSProperties} />
          ))}
        </div>
      )}
      <span className={cfg.special === 'sami' ? 'tag tag-special' : 'tag'}>{cfg.name}</span>
    </div>
  );
}

const SPARKLES = [
  { x: '10%', dx: '-6px', c: '#ffe066', d: 0 },
  { x: '70%', dx: '8px', c: '#ff8fc8', d: 0.25 },
  { x: '35%', dx: '-10px', c: '#ffc2dd', d: 0.5 },
  { x: '85%', dx: '4px', c: '#ffe066', d: 0.75 },
  { x: '50%', dx: '-3px', c: '#fff', d: 1 },
  { x: '20%', dx: '10px', c: '#ff4f9a', d: 1.25 },
  { x: '60%', dx: '-8px', c: '#ffc2dd', d: 1.5 },
  { x: '28%', dx: '6px', c: '#ffe066', d: 1.75 }
];

const WALKERS: WalkerCfg[] = [
  { name: 'Manuel', y: 3, s: 1.3, dur: 70, delay: -5, x: 20, ...TEAM.manuel, every: 4200, say: ['¿Dónde están los mayas?'], special: 'manuel' },
  { name: 'Yuliana', y: 11, s: 1.2, dur: 92, delay: -48, x: 14, ...TEAM.yuliana, every: 0, say: [] },
  { name: 'Jesús', y: 18, s: 1.1, dur: 81, delay: -66, x: 60, ...TEAM.jesus, every: 0, say: [] },
  { name: 'Mafe', y: 7, s: 1.25, dur: 104, delay: -30, x: 80, ...TEAM.mafe, every: 4600, say: ['¿Quieren postres?'] },
  { name: 'Jeffrey', y: 16, s: 1.15, dur: 98, delay: -55, x: 50, ...TEAM.jeffrey, every: 0, say: [] },
  { name: 'Raúl', y: 9, s: 1.2, dur: 84, delay: -12, x: 40, ...TEAM.raul, every: 0, say: [], special: 'raul' },
  { name: 'Diana', y: 20, s: 1.1, dur: 94, delay: -60, x: 70, ...TEAM.diana, every: 0, say: [] },
  { name: 'Sami', y: 14, s: 1.15, dur: 86, delay: -78, x: 30, ...TEAM.sami, every: 0, say: [], sparkle: true, special: 'sami' }
];

/* ── puestos de trabajo ── */
type ScreenKind = 'code' | 'chart' | 'video';

function Screen({ x, kind }: { x: number; kind: ScreenKind }) {
  return (
    <g>
      <rect x={x} y="3" width="12" height="9" fill="#120f33" />
      <rect x={x + 1} y="4" width="10" height="7" fill={kind === 'video' ? '#1b1646' : kind === 'chart' ? '#fff7e0' : '#0f2a2a'} />
      {kind === 'code' && (
        <g>
          {[
            [2, 5, 5, '#36e0d0'],
            [3, 6, 6, '#ffcf3f'],
            [3, 7, 4, '#ff5d8f'],
            [2, 8, 6, '#36e0d0'],
            [3, 9, 3, '#e8e4ff']
          ].map(([dx, y, w, c], k) => (
            <rect key={k} x={x + (dx as number)} y={y as number} width={w as number} height=".6" fill={c as string} />
          ))}
          <rect className="blink" x={x + 7} y="9" width=".8" height=".8" fill="#fff" />
        </g>
      )}
      {kind === 'chart' &&
        [2, 4, 6, 8].map((dx, k) => (
          <rect key={dx} className="bar" x={x + dx} y="5" width="1.4" height="5" fill={['#36e0d0', '#ff5d8f', '#ffcf3f', '#9b7bff'][k]} style={{ animationDelay: `${k * 0.35}s` }} />
        ))}
      {kind === 'video' && (
        <g>
          <g transform={`translate(${x + 1.6} 4.6) scale(.5)`}>{px(bodyFor(true).slice(0, 11), mk('#ff9a4d', '#e07a2d', '#e0ac69', '#4a2c17'))}</g>
          <rect className="talk" x={x + 4.1} y="7.1" width="1" height=".4" fill="#7a2d2d" />
          <rect x={x + 8} y="8.3" width="2.4" height="2.2" fill="#3a7bd5" />
          <rect className="blink" x={x + 9.6} y="4.6" width=".8" height=".8" fill="#ff3b3b" />
        </g>
      )}
      <rect x={x + 5} y="12" width="2" height="1" fill="#3a3580" />
      <rect x={x + 3} y="13" width="6" height="1" fill="#3a3580" />
    </g>
  );
}

function Workstation({
  cls,
  name,
  pal,
  long,
  chair,
  screens,
  headset
}: {
  cls: string;
  name: string;
  pal: Pal;
  long?: boolean;
  chair: string;
  screens: { x: number; kind: ScreenKind }[];
  headset?: boolean;
}) {
  return (
    <div className={`st ${cls}`} style={{ '--sw': 40 } as CSSProperties}>
      <svg viewBox="0 0 40 27" shapeRendering="crispEdges" role="img" aria-label={name}>
        <rect x="13" y="5" width="14" height="10" fill={chair} />
        <rect x="14" y="6" width="12" height="1" fill="#fff" opacity=".25" />
        <g transform="translate(14 3)">
          <g className="sit">
            {px(bodyFor(long).slice(0, 11), pal)}
            {headset && <Headset />}
          </g>
        </g>
        {screens.map(s => (
          <Screen key={s.x} x={s.x} kind={s.kind} />
        ))}
        <rect x="15" y="13" width="10" height="1" fill="#e8e4ff" />
        <rect x="0" y="14" width="40" height="2" fill="#f3dcb4" />
        <rect x="0" y="16" width="40" height="1" fill="#c9a36e" />
        <rect x="1" y="17" width="2" height="10" fill="#a67c4a" />
        <rect x="37" y="17" width="2" height="10" fill="#a67c4a" />
      </svg>
      <span className="tag">{name}</span>
    </div>
  );
}

function SeatedOnChair({ cls, name, pal, long, chair }: { cls: string; name: string; pal: Pal; long?: boolean; chair: string }) {
  return (
    <div className={`st ${cls}`} style={{ '--sw': 16 } as CSSProperties}>
      <svg viewBox="0 0 16 24" shapeRendering="crispEdges" role="img" aria-label={name}>
        <rect x="2" y="5" width="12" height="9" fill={chair} />
        <rect x="3" y="6" width="10" height="1" fill="#fff" opacity=".25" />
        <rect x="1" y="14" width="14" height="2" fill={chair} />
        <g transform="translate(2 2)">
          <g className="sit">
            {px(bodyFor(long).slice(0, 11), pal)}
            {px(SEAT_LEGS, pal, 11)}
            {/* libreta en las piernas */}
            <rect x="3.5" y="10.6" width="5" height="1.6" fill="#ff9a4d" />
            <rect x="3.5" y="10.6" width="5" height=".5" fill="#ffd0a0" />
          </g>
        </g>
        <rect x="7" y="18" width="2" height="4" fill="#120f33" />
        <rect x="3" y="22" width="10" height="1" fill="#120f33" />
        <rect x="2" y="23" width="2" height="1" fill="#120f33" />
        <rect x="12" y="23" width="2" height="1" fill="#120f33" />
      </svg>
      <span className="tag">{name}</span>
    </div>
  );
}


/** Andreina: sentada en una silla de oficina con rueditas que rueda y gira por la sala. */
function ChairRider({ name, pal, long, say }: { name: string; pal: Pal; long?: boolean; say: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setShow(v => !v), 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="roller" style={{ '--u': 'calc(var(--u0)*1.1)' } as CSSProperties}>
      {show && (
        <div className="bub" style={{ '--bc': pal.T } as CSSProperties}>
          {say}
        </div>
      )}
      <div className="roll-spin">
        <svg className="char" viewBox="0 0 16 24" shapeRendering="crispEdges" style={{ width: 'calc(var(--u)*16)', display: 'block' }} role="img" aria-label={name}>
          {/* silla minimalista negra: respaldo y asiento */}
          <rect x="4" y="5" width="8" height="8" fill="#1d1b26" />
          <rect x="5" y="6" width="6" height=".5" fill="#ffffff" opacity=".18" />
          <rect x="3" y="14" width="10" height="1.5" fill="#1d1b26" />
          <g className="roll-tilt" transform="translate(2 2)">
            {px(bodyFor(long).slice(0, 11), pal)}
            {px(SEAT_LEGS, pal, 11)}
          </g>
          {/* pistón y base */}
          <rect x="7.5" y="17" width="1" height="4" fill="#1d1b26" />
          <rect x="3.5" y="21" width="9" height=".8" fill="#1d1b26" />
          {/* rueditas que giran (dos cuadros alternados) */}
          <g className="la">
            <rect x="3" y="22" width="1.2" height="1.2" fill="#1d1b26" />
            <rect x="7.4" y="22" width="1.2" height="1.2" fill="#1d1b26" />
            <rect x="11.8" y="22" width="1.2" height="1.2" fill="#1d1b26" />
          </g>
          <g className="lb">
            <rect x="3" y="22" width="1.2" height="1.2" fill="#3a3746" />
            <rect x="7.4" y="22" width="1.2" height="1.2" fill="#3a3746" />
            <rect x="11.8" y="22" width="1.2" height="1.2" fill="#3a3746" />
          </g>
        </svg>
      </div>
      <div className="shadow" />
      <span className="tag">{name}</span>
    </div>
  );
}

const Plant = ({ cls }: { cls: string }) => (
  <svg className={`plant ${cls}`} viewBox="0 0 10 16" shapeRendering="crispEdges" style={{ width: 'calc(var(--u0)*10)' }}>
    <g className="leaf">
      <rect x="4" y="0" width="2" height="9" fill="#2fbf71" />
      <rect x="1" y="3" width="3" height="2" fill="#2fbf71" />
      <rect x="6" y="2" width="3" height="2" fill="#5be08f" />
      <rect x="0" y="5" width="2" height="2" fill="#5be08f" />
      <rect x="8" y="5" width="2" height="2" fill="#2fbf71" />
    </g>
    <rect x="2" y="9" width="6" height="7" fill="#ff9a4d" />
    <rect x="2" y="9" width="6" height="1" fill="#ffd0a0" />
  </svg>
);

/* ── retrato grupal (cuadro de la pared) ── */
const PORTRAIT_BACK = [TEAM.manuel, TEAM.jesus, TEAM.cristian, TEAM.daniel, TEAM.daniela, TEAM.andrea, TEAM.raul];
const PORTRAIT_FRONT = [TEAM.yuliana, TEAM.andreina, TEAM.sami, TEAM.mafe, TEAM.leidy, TEAM.jeffrey, TEAM.diana];
/** Integrantes con sprite detallado: en el retrato se dibujan con él (escalado a 12 px). */
const PORTRAIT_DETAILED = new Map<object, DetailedId>([[TEAM.sami, 'sami'], [TEAM.raul, 'raul'], [TEAM.manuel, 'manuel']]);

const GroupPortrait = () => (
  <div className="fr group" style={{ '--d': '0s' } as CSSProperties}>
    <div className="mat">
      <svg viewBox="0 0 92 23" shapeRendering="crispEdges" role="img" aria-label="Retrato del equipo del semillero">
        <rect x="0" y="0" width="92" height="23" fill="#ffe9c7" />
        <rect x="0" y="0" width="92" height="9" fill="#ffd9a8" />
        <rect x="6" y="2" width="2" height="2" fill="#fff6" />
        <rect x="86" y="3" width="2" height="2" fill="#fff6" />
        {PORTRAIT_BACK.map((p, i) => {
          const det = PORTRAIT_DETAILED.get(p);
          return det ? (
            <g key={i} transform={`translate(${1 + i * 12} 1) scale(.75)`}>{px(DETAILED[det].body.slice(0, 13), DETAILED[det].pal)}</g>
          ) : (
            <g key={i} transform={`translate(${1 + i * 12} 1)`}>{px(bodyFor(p.long).slice(0, 10), p.pal)}</g>
          );
        })}
        {PORTRAIT_FRONT.map((p, i) => {
          const det = PORTRAIT_DETAILED.get(p);
          return det ? (
            <g key={i} transform={`translate(${7 + i * 12} 10) scale(.75)`}>{px(DETAILED[det].body.slice(0, 15), DETAILED[det].pal)}</g>
          ) : (
            <g key={i} transform={`translate(${7 + i * 12} 10)`}>{px(bodyFor(p.long).slice(0, 11), p.pal)}</g>
          );
        })}
        <g transform="translate(37 1)">
          <Headset />
        </g>
      </svg>
    </div>
    <span className="plaque">Semillero LabSIE · EduTLAN</span>
  </div>
);

const STARS: [number, number][] = [
  [8, 12],
  [22, 28],
  [38, 10],
  [52, 34],
  [66, 16],
  [80, 30],
  [90, 8],
  [14, 44]
];
const BLD: [number, number, number, number][] = [
  [0, 6, 5, 6],
  [5, 3, 4, 9],
  [9, 7, 5, 5],
  [14, 2, 4, 10],
  [18, 5, 6, 7],
  [24, 8, 4, 4],
  [28, 3, 5, 9],
  [33, 6, 7, 6]
];

/** `plain`: color de fondo liso en lugar de la escena animada (formulario del test, panel de coordinación). */
export default function PixelOffice({ children, plain }: { children?: ReactNode; plain?: string }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        l: (i * 53) % 100,
        s: 4 + (i % 4) * 2,
        d: 9 + ((i * 7) % 11),
        dl: -((i * 3) % 14),
        c: ['#36e0d0', '#ff5d8f', '#ffcf3f'][i % 3]
      })),
    []
  );
  return (
    <div className={plain ? 'po po-plain' : 'po'} style={plain ? { background: plain } : undefined}>
      <style>{css}</style>
      {!plain && (
      <div className="po-scene" aria-hidden="true">
        <div className="wall">
          <div className="win">
            <div className="sky" />
            <div className="sun" />
            <div className="moon" />
            {STARS.map(([l, t], i) => (
              <i key={i} className="star" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.4}s` }} />
            ))}
            <svg className="sk" viewBox="0 0 40 12" preserveAspectRatio="none" shapeRendering="crispEdges">
              {BLD.map(([x, y, w, h], i) => (
                <g key={i}>
                  <rect x={x} y={12 - h} width={w} height={h} fill="#1b1646" />
                  <rect className="lit" x={x + 1} y={12 - h + 1} width="1" height="1" fill="#ffcf3f" style={{ animationDelay: `${i * 0.7}s` }} />
                </g>
              ))}
            </svg>
            <b className="mull v" />
            <b className="mull h" />
          </div>
          <GroupPortrait />
          {['l1', 'l2', 'l3'].map(c => (
            <div key={c} className={`lamp ${c}`}>
              <i />
              <b />
              <u />
            </div>
          ))}
          <div className="base" />
        </div>
        <div className="floor">
          <div className="rug" />
        </div>
        <img className="wm wm-e" src={LOGO_E} alt="" />
        <img className="wm wm-l" src={LOGO_L} alt="" />
        <Plant cls="p1" />
        <Plant cls="p2" />
        <Workstation cls="s1" name="Leidy" {...TEAM.leidy} chair="#ff5d8f" screens={[{ x: 27, kind: 'code' }]} />
        <Workstation
          cls="s2"
          name="Cristian"
          {...TEAM.cristian}
          chair="#36e0d0"
          screens={[
            { x: 1, kind: 'chart' },
            { x: 27, kind: 'code' }
          ]}
        />
        <Workstation cls="s3" name="Daniel" {...TEAM.daniel} chair="#9b7bff" screens={[{ x: 27, kind: 'video' }]} headset />
        <Workstation cls="s5" name="Andrea" {...TEAM.andrea} chair="#36e0d0" screens={[{ x: 27, kind: 'chart' }]} />
        <SeatedOnChair cls="s4" name="Daniela" {...TEAM.daniela} chair="#ff9a4d" />
        {WALKERS.map((w, i) => (
          <Walker key={i} cfg={w} />
        ))}
        <ChairRider name="Andreina" {...TEAM.andreina} say="¡Llegué!" />
        {bits.map((b, i) => (
          <i
            key={i}
            className="bit"
            style={{
              left: `${b.l}%`,
              width: b.s,
              height: b.s,
              background: b.c,
              animationDuration: `${b.d}s`,
              animationDelay: `${b.dl}s`
            }}
          />
        ))}
        <div className="crt" />
      </div>
      )}
      {children && <div className="content">{children}</div>}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');
.po{position:relative;width:100%;min-height:100vh;isolation:isolate}
.po *{box-sizing:border-box}
.po-scene{--u0:clamp(3.6px,.5vw + 1.6px,8px);--u:var(--u0);position:fixed;inset:0;z-index:0;overflow:hidden;background:#fff;font-family:'Silkscreen','Courier New',monospace;pointer-events:none}
.po-scene .hp{pointer-events:auto}
.wall{position:absolute;inset:0 0 42% 0;z-index:0;background:
linear-gradient(90deg,#5e3b1e 0 calc(var(--u0)*3),#7a4d27 calc(var(--u0)*3) calc(var(--u0)*3.8),transparent calc(var(--u0)*3.8)) 0 0/25% 100% repeat-x,
repeating-linear-gradient(0deg,#0000 0 calc(var(--u0)*6),#3f26124d calc(var(--u0)*6) calc(var(--u0)*7)),
repeating-linear-gradient(90deg,#0000 0 calc(var(--u0)*11),#ffffff10 calc(var(--u0)*11) calc(var(--u0)*12)),
repeating-linear-gradient(0deg,#c58d4e 0 calc(var(--u0)*14),#b97f42 calc(var(--u0)*14) calc(var(--u0)*28))}
.wall::before{content:"";position:absolute;left:0;right:0;top:0;height:calc(var(--u0)*4);background:#4a2d16;box-shadow:0 calc(var(--u0)*1) 0 #7a4d27,0 calc(var(--u0)*2) 0 #2d1a0b}
.lamp{position:absolute;top:calc(var(--u0)*4);width:0;z-index:3;transform-origin:50% 0;animation:swing 6s ease-in-out infinite}
.lamp i{position:absolute;left:calc(var(--u0)*-.4);top:0;width:calc(var(--u0)*.8);height:calc(var(--u0)*9);background:#2d1a0b}
.lamp b{position:absolute;left:calc(var(--u0)*-4);top:calc(var(--u0)*9);width:calc(var(--u0)*8);height:calc(var(--u0)*4);background:#ffcf3f;box-shadow:inset 0 calc(var(--u0)*-1) 0 #d9a21b}
.lamp u{position:absolute;left:calc(var(--u0)*-20);top:calc(var(--u0)*10);width:calc(var(--u0)*40);height:calc(var(--u0)*40);background:radial-gradient(circle,#ffe6a066 0,#0000 65%);animation:glow 3s ease-in-out infinite}
.l1{left:22%}.l2{left:54%;animation-delay:-2s}.l3{left:86%;animation-delay:-4s}
.base{position:absolute;left:0;right:0;bottom:0;height:calc(var(--u0)*3);background:#4a2d16;box-shadow:0 calc(var(--u0)*-1) 0 #7a4d27}
.floor{position:absolute;inset:58% 0 0 0;background:linear-gradient(#0000 calc(100% - 2px),#c9cfe0 0) 0 0/calc(var(--u0)*14) calc(var(--u0)*14),linear-gradient(90deg,#0000 calc(100% - 2px),#c9cfe0 0) 0 0/calc(var(--u0)*14) calc(var(--u0)*14),conic-gradient(#ffffff 25%,#f1f3fa 0 50%,#ffffff 0 75%,#f1f3fa 0) 0 0/calc(var(--u0)*28) calc(var(--u0)*28);box-shadow:inset 0 calc(var(--u0)*3) 0 #0e0c2e22;z-index:0}
.rug{position:absolute;left:18%;right:18%;top:28%;bottom:10%;background:repeating-linear-gradient(45deg,#ff5d8f40 0 calc(var(--u0)*2),#ff5d8f1a 0 calc(var(--u0)*4));box-shadow:0 0 0 calc(var(--u0)*1) #ff5d8f88 inset}
.wm{position:absolute;z-index:2;opacity:.14;pointer-events:none;object-fit:contain;filter:drop-shadow(0 2px 8px #120f3344)}
.wm-e{left:6%;top:18%;width:min(22vw,180px)}
.wm-l{right:6%;top:22%;width:min(20vw,160px)}
.win{position:absolute;left:4%;top:calc(var(--header-h,0px) + 3%);width:calc(var(--u0)*60);height:calc(var(--u0)*40);border:calc(var(--u0)*2) solid #4a2d16;box-shadow:0 0 0 calc(var(--u0)*2) #7a4d27,calc(var(--u0)*2) calc(var(--u0)*3) 0 #2d1a0b66;overflow:hidden;z-index:1}
.sky{position:absolute;inset:0;animation:sky 56s linear infinite}
.sun,.moon,.star{position:absolute;display:block}
.sun{width:calc(var(--u0)*6);height:calc(var(--u0)*6);background:#ffcf3f;box-shadow:0 0 0 calc(var(--u0)*1.5) #ffcf3f66;animation:sun 56s linear infinite}
.moon{width:calc(var(--u0)*5);height:calc(var(--u0)*5);background:#e8e4ff;box-shadow:inset calc(var(--u0)*-2) 0 0 #b9b3f0;opacity:0;animation:moon 56s linear infinite}
.star{width:calc(var(--u0)*1);height:calc(var(--u0)*1);background:#fff;opacity:0;animation:stars 56s linear infinite}
.sk{position:absolute;left:0;bottom:0;width:100%;height:42%}
.lit{animation:lit 4s steps(1) infinite}
.mull{position:absolute;background:#4a2d16}
.mull.v{left:50%;top:0;bottom:0;width:calc(var(--u0)*1.5)}.mull.h{top:55%;left:0;right:0;height:calc(var(--u0)*1.5)}
.fr{position:absolute;top:8%;width:calc(var(--u0)*17);background:#fffdf9;padding:calc(var(--u0)*1);border:1px solid #2d1a0b26;border-radius:4px;box-shadow:0 6px 18px -8px #2d1a0b55;z-index:1;transform-origin:50% 0;animation:sway 9s ease-in-out infinite;animation-delay:var(--d)}
.mat{width:100%;height:100%;display:grid;place-items:center;padding:calc(var(--u0)*1.2);border:1px solid #2d1a0b14;border-radius:2px}
.mat svg{display:block;width:100%;height:auto}
.fr.group{width:calc(var(--u0)*62);padding:calc(var(--u0)*1.2) calc(var(--u0)*1.2) calc(var(--u0)*.6)}
.fr.group .mat{padding:0;overflow:hidden}
.plaque{display:block;margin:calc(var(--u0)*.6) auto 0;width:max-content;max-width:100%;padding:1px 6px;font-size:clamp(6px,calc(var(--u0)*1.25),10px);color:#4a2d16;background:#f3dcb4;border:1px solid #c9a36e;border-radius:2px;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.group{left:58%;top:calc(var(--header-h,0px) + 2%)}
.plant{position:absolute;z-index:2;bottom:calc(42% - var(--u0)*4)}.p1{left:1%}.p2{right:1%}
.st{--k:.75;position:absolute;z-index:3;bottom:calc(42% - var(--u0)*9)}
.st svg{display:block;width:calc(var(--u0)*var(--sw)*var(--k))}
.s1{left:2%}.s2{left:20.5%}.s3{left:40%}.s5{left:59.5%}.s4{left:82%}
.sparkles{position:absolute;inset:0;pointer-events:none}
.sparkles i{position:absolute;left:var(--sx);bottom:15%;width:calc(var(--u)*1.6);height:calc(var(--u)*1.6);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);opacity:0;animation:twinkle 1.5s ease-out infinite}
@keyframes twinkle{0%{opacity:0;transform:translate(0,0) scale(.3) rotate(0)}25%{opacity:1}100%{opacity:0;transform:translate(var(--dx),calc(var(--u)*-9)) scale(1.1) rotate(90deg)}}
.sit{animation:sit 1.6s steps(2) infinite}
.blink{animation:blink 1s steps(1) infinite}
.talk{animation:talk .5s steps(1) infinite}
.char{filter:drop-shadow(1px 0 0 #120f3399) drop-shadow(-1px 0 0 #120f3399) drop-shadow(0 1px 0 #120f3399) drop-shadow(0 -1px 0 #120f3399)}
.tag{position:absolute;left:50%;top:calc(100% + 3px);transform:translateX(-50%);padding:1px 6px;font-size:clamp(7px,calc(var(--u0)*1.5),11px);line-height:1.4;color:#fff;background:#120f33d9;border-radius:2px;white-space:nowrap;box-shadow:0 0 0 1px #ffffff40}
.leaf{transform-box:fill-box;transform-origin:50% 100%;animation:leaf 3.6s ease-in-out infinite}
.bar{transform-box:fill-box;transform-origin:50% 100%;animation:bar 2.4s steps(6) infinite}
.scan{animation:scan 3s linear infinite}
.steam{animation:steam 2.2s steps(4) infinite}
.swivel{transform-origin:50% 100%;animation:swivel 5s ease-in-out infinite}
.w{position:absolute;left:var(--x0);animation:walkx 80s linear infinite}
.w:hover{animation-play-state:paused}.w:hover *{animation-play-state:paused}
.hp{cursor:pointer}.hop{animation:hop .5s cubic-bezier(.3,.7,.4,1)}
.bob{animation:bob .5s steps(2) infinite}
.fl{animation:flip 80s steps(1) infinite}
.la{animation:la .5s steps(1) infinite}.lb{animation:lb .5s steps(1) infinite}
.w .tag{top:auto;bottom:calc(100% + 3px)}
.st .tag{top:auto;bottom:calc(100% + 2px)}
.roller{position:absolute;bottom:17%;left:8%;z-index:83;animation:roll 26s ease-in-out infinite}
.roller .la,.roller .lb{animation-duration:.25s}
.roll-spin{animation:rollspin 26s ease-in-out infinite}
.roll-tilt{transform-box:fill-box;transform-origin:50% 100%;animation:tilt 1.6s ease-in-out infinite}
.roller .tag{top:auto;bottom:calc(100% + 3px)}
.tag-special{background:#ff4f9a;box-shadow:0 0 0 1px #ffc2dd,0 0 8px #ff8fc8aa}
.shadow{position:absolute;left:10%;right:10%;bottom:calc(var(--u)*-.6);height:calc(var(--u)*1.4);background:#0e0c2e66;z-index:-1}
.bub{position:absolute;bottom:calc(100% + var(--u)*2 + 16px);left:0;width:max-content;max-width:calc(var(--u)*26);padding:calc(var(--u)*1.2) calc(var(--u)*1.6);font-size:clamp(7px,calc(var(--u)*1.9),12px);line-height:1.35;color:#120f33;background:#fff;box-shadow:-3px 0 #120f33,3px 0 #120f33,0 -3px #120f33,0 3px #120f33,0 6px 0 3px #0e0c2e44;animation:pop .45s steps(5) both;z-index:5}
.bub::after{content:"";position:absolute;left:calc(var(--u)*3);bottom:-9px;width:9px;height:9px;background:#fff;box-shadow:3px 0 #120f33,-3px 0 #120f33,0 3px #120f33}
.bub::before{content:"";position:absolute;left:0;top:0;bottom:0;width:calc(var(--u)*.7);background:var(--bc)}
.bit{position:absolute;bottom:-20px;opacity:0;animation:rise 12s linear infinite;z-index:90;pointer-events:none}
.crt{position:absolute;inset:0;pointer-events:none;z-index:40;background:linear-gradient(180deg,#fffdf92e 0%,#fffdf91f 45%,#fffdf94d 100%),repeating-linear-gradient(0deg,#0000 0 3px,#0e0c2e05 3px 4px)}
.content{position:relative;z-index:150;min-height:100vh}
@keyframes sit{0%,100%{transform:translateY(0)}50%{transform:translateY(-.4px)}}
@keyframes blink{0%{opacity:1}50%{opacity:0}}
@keyframes talk{0%{opacity:1}50%{opacity:.2}}
@keyframes roll{0%{left:8%}18%{left:30%}30%{left:26%}52%{left:62%}64%{left:58%}82%{left:78%}100%{left:8%}}
@keyframes rollspin{0%,16%{transform:scaleX(1)}20%,48%{transform:scaleX(-1)}52%,78%{transform:scaleX(1)}84%,100%{transform:scaleX(-1)}}
@keyframes tilt{0%,100%{transform:translate(2px,2px) rotate(0)}25%{transform:translate(2px,2px) rotate(-3deg)}75%{transform:translate(2px,2px) rotate(3deg)}}
@keyframes walkx{0%{left:2%}50%{left:92%}100%{left:2%}}
@keyframes flip{0%{transform:scaleX(1)}50%,100%{transform:scaleX(-1)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(var(--u)*-1))}}
@keyframes la{0%{opacity:1}50%{opacity:0}}@keyframes lb{0%{opacity:0}50%{opacity:1}}
@keyframes hop{0%,100%{transform:translateY(0)}40%{transform:translateY(calc(var(--u)*-6)) rotate(-8deg)}}
@keyframes pop{0%{transform:scale(.2);opacity:0;transform-origin:0 100%}100%{transform:scale(1);opacity:1;transform-origin:0 100%}}
@keyframes swing{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
@keyframes glow{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes sway{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
@keyframes shine{0%,70%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@keyframes sky{0%,32%{background:#8fdcff}50%{background:#ff9a7a}62%{background:#4a2f8f}78%,92%{background:#15123f}100%{background:#8fdcff}}
@keyframes sun{0%{left:4%;top:70%;opacity:1}25%{left:36%;top:8%}50%{left:82%;top:62%;opacity:1}54%,100%{left:90%;top:80%;opacity:0}}
@keyframes moon{0%,58%{left:4%;top:70%;opacity:0}62%{left:6%;top:66%;opacity:1}80%{left:42%;top:10%;opacity:1}97%{left:84%;top:66%;opacity:1}100%{opacity:0}}
@keyframes stars{0%,58%{opacity:0}68%,90%{opacity:1}100%{opacity:0}}
@keyframes lit{0%{opacity:.2}50%{opacity:1}}
@keyframes leaf{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes bar{0%{transform:scaleY(.15)}50%{transform:scaleY(1)}100%{transform:scaleY(.15)}}
@keyframes scan{0%{transform:translateY(0)}100%{transform:translateY(calc(7px))}}
@keyframes steam{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(-3px);opacity:0}}
@keyframes swivel{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.55)}}
@keyframes rise{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:.8}100%{transform:translateY(-110vh) rotate(180deg);opacity:0}}
@media (max-width:700px){
 .po-scene{--u0:4.2px}
 .win{left:3%;width:calc(var(--u0)*32);height:calc(var(--u0)*30);top:calc(var(--header-h,0px) + 2%)}
 .group{left:auto;right:3%;top:calc(var(--header-h,0px) + 2%);width:calc(var(--u0)*52)}
 .plaque{font-size:6px}
 .lamp{display:none}
 .wall{bottom:58%}.floor{top:42%}.plant{display:none}
 .st{--k:.7;bottom:calc(58% - var(--u0)*6)}.s1{left:1%}.s2{left:34%}.s3{left:67%}
 .s5{left:12%;bottom:34%}.s4{left:70%;bottom:34%}
 .tag{font-size:7px;padding:0 4px}
 .roller{bottom:14%}
 .bub{font-size:8px}
 .wm-e{width:28vw}.wm-l{width:24vw}
}
@media (prefers-reduced-motion:reduce){.po-scene *,.po-scene *::before,.po-scene *::after{animation:none!important}.sun{left:36%;top:10%}}
`;
