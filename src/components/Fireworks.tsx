import { useEffect, useRef } from 'react';

/** Fuegos artificiales en canvas a pantalla completa; se apagan solos tras `durationMs`. */
export function Fireworks({ durationMs = 6500 }: { durationMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#10B981', '#36e0d0', '#ff5d8f', '#ffcf3f', '#9b7bff', '#ff9a4d'];
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };
    type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };
    let sparks: Spark[] = [];
    let rockets: Rocket[] = [];
    const start = performance.now();
    let lastLaunch = 0;
    let raf = 0;

    const launch = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h,
        vy: -(h / 70 + Math.random() * 3),
        targetY: h * (0.15 + Math.random() * 0.3),
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    };

    const explode = (r: Rocket) => {
      const n = 46;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n;
        const speed = 2 + Math.random() * 3;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 1, color: r.color });
      }
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < durationMs - 1500 && now - lastLaunch > 380) {
        launch();
        lastLaunch = now;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      rockets = rockets.filter(r => {
        r.y += r.vy;
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x - 1.5, r.y, 3, 8);
        if (r.y <= r.targetY) {
          explode(r);
          return false;
        }
        return true;
      });

      sparks = sparks.filter(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.vx *= 0.985;
        s.life -= 0.014;
        ctx.globalAlpha = Math.max(s.life, 0);
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, 3, 3);
        ctx.globalAlpha = 1;
        return s.life > 0;
      });

      if (elapsed < durationMs || sparks.length || rockets.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [durationMs]);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-[60] pointer-events-none w-full h-full" />;
}
