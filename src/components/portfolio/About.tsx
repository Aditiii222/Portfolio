import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";

const stages = [
  { label: "Learn", note: "Courses, docs, fundamentals" },
  { label: "Build", note: "Small projects end to end" },
  { label: "Experiment", note: "Try, break, retry" },
  { label: "Improve", note: "Refine with feedback" },
  { label: "Deploy", note: "Make it live" },
];

const STEP_DEG = 72;
const SPRING = 0.014;
const DAMPING = 0.85;
const WHALF = 34; // half-width of each wedge tread, degrees
const EDGE = 7; // tread thickness in screen px
const R0 = 16; // radius where treads meet the pole

type Geo = {
  w: number;
  h: number;
  cx: number;
  cy: number;
  rise: number;
  R: number;
  depthY: number;
  squash: number;
  poleTop: number;
  poleBottom: number;
};

const stars = [
  { left: "10%", top: "14%", d: "0s" },
  { left: "82%", top: "10%", d: "0.8s" },
  { left: "90%", top: "55%", d: "1.6s" },
  { left: "16%", top: "78%", d: "2.2s" },
  { left: "52%", top: "6%", d: "1.1s" },
  { left: "36%", top: "90%", d: "2.8s" },
];

// Wedge tread in local (circular) space: outer arc from -WHALF..WHALF at R, back along the inner arc at R0.
const WEDGE_D = (() => {
  const pts: string[] = [];
  const N = 9;
  for (let k = 0; k <= N; k++) {
    const t = ((-WHALF + (2 * WHALF * k) / N) * Math.PI) / 180;
    pts.push(`${(Math.cos(t)).toFixed(3)},${(Math.sin(t)).toFixed(3)}`);
  }
  const NI = 4;
  for (let k = NI; k >= 0; k--) {
    const t = ((-WHALF + (2 * WHALF * k) / NI) * Math.PI) / 180;
    pts.push(`${(R0 * Math.cos(t)).toFixed(3)},${(R0 * Math.sin(t)).toFixed(3)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

// Catmull-Rom through screen-space points, as an SVG path.
const catmullPath = (p: Array<[number, number]>) => {
  if (p.length < 2) return "";
  const pt = (i: number): [number, number] => p[Math.max(0, Math.min(p.length - 1, i))]!;
  let d = `M${p[0]![0].toFixed(1)},${p[0]![1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = pt(i - 1);
    const p1 = pt(i);
    const p2 = pt(i + 1);
    const p3 = pt(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};

const treadTransform = (g: Geo, i: number, rot: number, extraY = 0) =>
  `translate(${g.cx.toFixed(1)} ${(g.cy - i * g.rise + extraY).toFixed(1)}) scale(1 ${g.squash.toFixed(4)}) rotate(${(i * STEP_DEG + rot).toFixed(2)})`;

const railPoints = (g: Geo, rot: number): Array<[number, number]> =>
  stages.map((_, i) => {
    const a = ((i * STEP_DEG + rot) * Math.PI) / 180;
    const r = g.R + 4;
    return [g.cx + r * Math.cos(a), g.cy - i * g.rise + g.squash * r * Math.sin(a)];
  });

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const climbRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRefs = useRef<(SVGGElement | null)[]>([]);
  const topRefs = useRef<(SVGGElement | null)[]>([]);
  const edgeRefs = useRef<(SVGGElement | null)[]>([]);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railRef = useRef<SVGPathElement | null>(null);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pulse, setPulse] = useState(false);

  const counterRef = useRef(0);
  const activeRef = useRef(0);
  const rotRef = useRef(90);
  const velRef = useRef(0);
  const targetRef = useRef(90);
  const hoverRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const inViewRef = useRef(false);
  const reducedRef = useRef(false);
  const geoRef = useRef<Geo | null>(null);
  const orderRef = useRef("");

  const geo = useMemo<Geo | null>(() => {
    const { w, h } = size;
    if (!w || !h) return null;
    const cy = h * 0.68;
    const rise = h * 0.115;
    const R = Math.min(w * 0.3, 150);
    const depthY = Math.min(h * 0.15, 64);
    return {
      w,
      h,
      cx: w / 2,
      cy,
      rise,
      R,
      depthY,
      squash: depthY / R,
      poleTop: cy - rise * (stages.length - 1) - 34,
      poleBottom: cy + depthY + 12,
    };
  }, [size]);

  const applyPositions = useCallback(() => {
    const g = geoRef.current;
    if (!g) return;
    const rot = rotRef.current;
    const depths = stages.map((_, i) => {
      const a = ((i * STEP_DEG + rot) * Math.PI) / 180;
      return { i, sin: Math.sin(a), cos: Math.cos(a) };
    });
    for (const { i, sin, cos } of depths) {
      const depth = (sin + 1) / 2;
      topRefs.current[i]?.setAttribute("transform", treadTransform(g, i, rot));
      edgeRefs.current[i]?.setAttribute("transform", treadTransform(g, i, rot, EDGE));
      const el = labelRefs.current[i];
      if (el) {
        const lr = g.R + 20;
        const x = g.cx + lr * cos;
        const y = g.cy - i * g.rise + g.squash * lr * sin;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${(0.72 + 0.36 * depth).toFixed(3)})`;
        let op = 0.3 + 0.7 * depth;
        if (i === activeRef.current) op = Math.max(op, 0.95);
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = i === activeRef.current ? "60" : String(10 + Math.round(depth * 40));
      }
    }
    // Reorder treads back-to-front only when the order actually changes.
    const sorted = [...depths].sort((a, b) => a.sin - b.sin);
    const key = sorted.map((d) => d.i).join(",");
    if (key !== orderRef.current) {
      orderRef.current = key;
      const svg = svgRef.current;
      if (svg) {
        for (const d of sorted) {
          const wrap = wrapRefs.current[d.i];
          if (wrap) svg.appendChild(wrap);
        }
        const rail = railRef.current;
        if (rail) svg.appendChild(rail);
      }
    }
    const rail = railRef.current;
    if (rail) rail.setAttribute("d", catmullPath(railPoints(g, rot)));
  }, []);

  const advance = useCallback(
    (dir: number) => {
      const n = stages.length;
      const prev = ((counterRef.current % n) + n) % n;
      counterRef.current += dir;
      const next = ((counterRef.current % n) + n) % n;
      activeRef.current = next;
      setActive(next);
      targetRef.current = 90 - counterRef.current * STEP_DEG;
      if (reducedRef.current) {
        rotRef.current = targetRef.current;
        velRef.current = 0;
        applyPositions();
      }
      if (prev === n - 1 && next === 0) setPulse(true);
    },
    [applyPositions],
  );

  const selectStep = (i: number) => {
    if (i === activeRef.current) return;
    const delta = (i - activeRef.current + stages.length) % stages.length;
    pauseUntilRef.current = Date.now() + 10000;
    advance(delta);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      pauseUntilRef.current = Date.now() + 10000;
      advance(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      pauseUntilRef.current = Date.now() + 10000;
      advance(-1);
    }
  };

  // Motion preference (declared first so later effects see it).
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useEffect(() => {
    const el = climbRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const r = entry.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    geoRef.current = geo;
    applyPositions();
  }, [geo, applyPositions]);

  // Spring rotation loop — runs only while the section is in view.
  useEffect(() => {
    if (!inView) return;
    if (reducedRef.current) {
      applyPositions();
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      const target = targetRef.current;
      const diff = target - rotRef.current;
      if (Math.abs(diff) < 0.005 && Math.abs(velRef.current) < 0.005) {
        if (rotRef.current !== target) {
          rotRef.current = target;
          velRef.current = 0;
          applyPositions();
        }
        return;
      }
      velRef.current = (velRef.current + diff * SPRING * dt) * Math.pow(DAMPING, dt);
      rotRef.current += velRef.current * dt;
      applyPositions();
    };
    const rafRef = { current: 0 };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, applyPositions]);

  // Auto-advance every 4s; pauses on hover and for 10s after a click.
  useEffect(() => {
    if (reducedRef.current) return;
    const id = window.setInterval(() => {
      if (!inViewRef.current || hoverRef.current || Date.now() < pauseUntilRef.current) return;
      advance(1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [advance]);

  const current = stages[active] ?? stages[0]!;

  return (
    <section ref={sectionRef} id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <style>{`
        @keyframes climb-core-pulse {
          0%, 100% { opacity: 0.7; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .climb-star { animation: climb-core-pulse 4s ease-in-out infinite; }
        @keyframes climb-flash {
          0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--cyan) 55%, transparent), 0 0 80px 24px color-mix(in oklab, var(--violet) 55%, transparent); }
          100% { box-shadow: 0 0 0 0 transparent, 0 0 0 0 transparent; }
        }
        .climb-flash { animation: climb-flash 1.1s ease-out; }
        .climb-label {
          transition: color 0.3s;
          will-change: transform, opacity;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-shadow: 0 2px 12px color-mix(in oklab, var(--background) 85%, transparent);
        }
        .climb-label:focus-visible { outline: 1px solid color-mix(in oklab, var(--cyan) 70%, transparent); outline-offset: 4px; border-radius: 6px; }
        .climb-tread-edge { fill: color-mix(in oklab, var(--violet) 14%, var(--background)); }
        .climb-tread-top { fill: url(#climb-tread-grad); transition: fill 0.4s; }
        .climb-tread-line { fill: none; stroke: color-mix(in oklab, var(--cyan) 40%, transparent); stroke-width: 1; transition: stroke 0.4s; }
        .climb-rail { fill: none; stroke: url(#climb-rail-grad); stroke-width: 2; stroke-linecap: round; opacity: 0.45; }
        .tread-wrap { transition: filter 0.4s; }
        .tread-active .climb-tread-top { fill: url(#climb-tread-grad-active); }
        .tread-active .climb-tread-line { stroke: color-mix(in oklab, var(--cyan) 85%, transparent); }
        .tread-active { filter: drop-shadow(0 10px 30px color-mix(in oklab, var(--violet) 55%, transparent)); }
        @media (prefers-reduced-motion: reduce) {
          .climb-star, .climb-flash { animation: none; }
        }
      `}</style>

      <SectionHeading index="01" kicker="About me" title="Learning by building, not just reading." />

      <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <Reveal>
          <p>
            I&apos;m <span className="text-foreground">Aditi Anand Guddeti</span>, a third-year
            Information Technology student at Trinity Academy of Engineering, Pune, with a growing
            interest in Artificial Intelligence and Machine Learning.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <p>
            I&apos;m currently building my skills in Python, machine learning, and practical AI
            projects while exploring opportunities to gain real-world experience through
            internships, hackathons, and technical communities.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p>
            I enjoy learning by building, experimenting with new technologies, and turning ideas
            into useful solutions.
          </p>
        </Reveal>
      </div>

      <Reveal delay={120} className="mt-12">
        <div className="glass rounded-3xl p-4 sm:p-6">
          <div
            ref={climbRef}
            role="group"
            aria-label={`The Climb — a spiral staircase of the learning journey from Learn to Deploy. Current step: ${current.label}. Use arrow keys to move between steps.`}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onMouseEnter={() => (hoverRef.current = true)}
            onMouseLeave={() => (hoverRef.current = false)}
            className="relative h-[400px] select-none outline-none sm:h-[500px]"
          >
            {/* subtle grid backdrop */}
            <div
              aria-hidden
              className="grid-bg absolute inset-0 rounded-2xl opacity-25"
              style={{
                maskImage: "radial-gradient(circle at 50% 55%, black, transparent 80%)",
                WebkitMaskImage: "radial-gradient(circle at 50% 55%, black, transparent 80%)",
              }}
            />
            {stars.map((s, i) => (
              <span
                key={i}
                aria-hidden
                className="climb-star absolute size-1 rounded-full bg-cyan/60"
                style={{ left: s.left, top: s.top, animationDelay: s.d }}
              />
            ))}

            {/* spiral staircase — central pole, wedge treads, outer rail */}
            {geo && (
              <svg
                ref={svgRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox={`0 0 ${geo.w} ${geo.h}`}
              >
                <defs>
                  <linearGradient id="climb-pole-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--foreground) 22%, var(--background))" }} />
                    <stop offset="45%" style={{ stopColor: "color-mix(in oklab, var(--cyan) 30%, var(--foreground))" }} />
                    <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--violet) 25%, var(--background))" }} />
                  </linearGradient>
                  <linearGradient id="climb-tread-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--cyan) 16%, var(--background))" }} />
                    <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--violet) 22%, var(--background))" }} />
                  </linearGradient>
                  <linearGradient id="climb-tread-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--cyan) 42%, var(--background))" }} />
                    <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--violet) 60%, var(--background))" }} />
                  </linearGradient>
                  <linearGradient id="climb-rail-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "var(--cyan)", stopOpacity: 0.15 }} />
                    <stop offset="50%" style={{ stopColor: "var(--primary)", stopOpacity: 0.7 }} />
                    <stop offset="100%" style={{ stopColor: "var(--violet)", stopOpacity: 0.15 }} />
                  </linearGradient>
                </defs>

                {/* central pole + finial */}
                <rect
                  x={geo.cx - 4}
                  y={geo.poleTop}
                  width={8}
                  height={geo.poleBottom - geo.poleTop}
                  rx={4}
                  fill="url(#climb-pole-grad)"
                />
                <circle
                  cx={geo.cx}
                  cy={geo.poleTop}
                  r={7}
                  className={pulse ? "climb-flash" : ""}
                  style={{
                    fill: "linear-gradient(135deg, var(--cyan), var(--violet))",
                    onAnimationEnd: (e) => {
                      if (e.target === e.currentTarget) setPulse(false);
                    },
                  }}
                />

                {/* wedge treads, reordered back-to-front each frame */}
                {stages.map((s, i) => (
                  <g
                    key={s.label}
                    ref={(el) => {
                      wrapRefs.current[i] = el;
                    }}
                    className={active === i ? "tread-wrap tread-active" : "tread-wrap"}
                    transform={treadTransform(geo, i, rotRef.current)}
                  >
                    <g
                      ref={(el) => {
                        edgeRefs.current[i] = el;
                      }}
                      transform={treadTransform(geo, i, rotRef.current, EDGE)}
                    >
                      <path d={WEDGE_D} className="climb-tread-edge" />
                    </g>
                    <g
                      ref={(el) => {
                        topRefs.current[i] = el;
                      }}
                      transform={treadTransform(geo, i, rotRef.current)}
                    >
                      <path d={WEDGE_D} className="climb-tread-top" />
                      <path d={WEDGE_D} className="climb-tread-line" />
                    </g>
                  </g>
                ))}

                {/* outer spiral rail through the tread tips */}
                <path ref={railRef} d={catmullPath(railPoints(geo, rotRef.current))} className="climb-rail" />
              </svg>
            )}

            {/* step labels — floating text on each tread, no boxes */}
            {stages.map((s, i) => (
              <button
                key={s.label}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                type="button"
                aria-label={`${s.label}: ${s.note}`}
                aria-pressed={active === i}
                onClick={() => selectStep(i)}
                style={{ opacity: 0 }}
                className="climb-label absolute left-0 top-0 flex flex-col items-center gap-1"
              >
                <span
                  className={`font-mono text-[0.55rem] tracking-widest ${active === i ? "text-cyan" : "text-primary/70"}`}
                >
                  0{i + 1}
                </span>
                <span
                  className={`font-display text-sm leading-none sm:text-base ${
                    active === i ? "text-gradient font-semibold" : "text-foreground/85"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`max-w-[7rem] text-[0.6rem] leading-snug sm:max-w-[9rem] sm:text-[0.65rem] ${
                    active === i ? "text-foreground/85" : "text-muted-foreground/70"
                  }`}
                >
                  {s.note}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
            Click a step — arrow keys work too
          </p>
        </div>
      </Reveal>
    </section>
  );
}
