import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

const stars = [
  { left: "12%", top: "18%", d: "0s" },
  { left: "78%", top: "12%", d: "0.8s" },
  { left: "88%", top: "52%", d: "1.6s" },
  { left: "20%", top: "72%", d: "2.2s" },
  { left: "55%", top: "8%", d: "1.1s" },
  { left: "38%", top: "86%", d: "2.8s" },
];

type Geo = {
  w: number;
  h: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  depthY: number;
  stepRise: number;
  coreY: number;
};

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const climbRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const geo = useMemo<Geo | null>(() => {
    const { w, h } = size;
    if (!w || !h) return null;
    const compact = w < 480;
    const ry = Math.min(h * 0.22, 96);
    const stepRise = h * 0.145;
    return {
      w,
      h,
      cx: w / 2,
      cy: h * 0.3,
      rx: Math.min(w * (compact ? 0.34 : 0.3), 210),
      ry,
      depthY: ry * 0.3,
      stepRise,
      coreY: h * 0.3 + stepRise * 2.2,
    };
  }, [size]);

  const helixPath = useMemo(() => {
    const g = geo;
    if (!g) return "";
    // Anchor the curve to each step's position (at the rest rotation of 90°).
    const p: Array<[number, number]> = stages.map((_, i) => {
      const th = ((i * STEP_DEG + 90) * Math.PI) / 180;
      return [
        g.cx + g.rx * Math.cos(th),
        g.cy + g.depthY * Math.sin(th) + (stages.length - 1 - i) * g.stepRise,
      ];
    });
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
  }, [geo]);

  const applyPositions = useCallback(() => {
    const g = geoRef.current;
    if (!g) return;
    const rot = rotRef.current;
    for (let i = 0; i < stages.length; i++) {
      const el = stepRefs.current[i];
      if (!el) continue;
      const angle = ((i * STEP_DEG + rot) * Math.PI) / 180;
      const sin = Math.sin(angle);
      const depth = (sin + 1) / 2;
      const x = g.cx + g.rx * Math.cos(angle);
      const y = g.cy + g.depthY * sin + (stages.length - 1 - i) * g.stepRise;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${(0.7 + 0.4 * depth).toFixed(3)})`;
      el.style.opacity = (0.35 + 0.65 * depth).toFixed(3);
      el.style.zIndex = String(10 + Math.round(depth * 50));
    }
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

  useEffect(() => {
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
        @keyframes climb-panel-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .climb-panel-enter { animation: climb-panel-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes climb-core-pulse {
          0%, 100% { opacity: 0.8; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        .climb-core-pulse { animation: climb-core-pulse 3.2s ease-in-out infinite; }
        @keyframes climb-flash {
          0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--cyan) 55%, transparent), 0 0 80px 24px color-mix(in oklab, var(--violet) 55%, transparent); }
          100% { box-shadow: 0 0 0 0 transparent, 0 0 0 0 transparent; }
        }
        .climb-flash { animation: climb-flash 1.1s ease-out; }
        .climb-ring { transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .climb-step {
          transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, color 0.3s;
          will-change: transform, opacity;
        }
        .climb-step-active {
          background: linear-gradient(120deg, var(--violet), color-mix(in oklab, var(--violet) 50%, var(--destructive)));
          border: 1px solid color-mix(in oklab, var(--cyan) 60%, transparent);
          box-shadow: 0 12px 44px -12px color-mix(in oklab, var(--violet) 75%, transparent),
            0 0 24px color-mix(in oklab, var(--cyan) 35%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .climb-panel-enter, .climb-flash { animation: none; }
          .climb-ring { transition: none; }
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
          <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_1fr]">
            {/* The Climb — staircase */}
            <div
              ref={climbRef}
              role="group"
              aria-label="The Climb — the learning journey from Learn to Deploy. Use arrow keys to move between steps."
              tabIndex={-1}
              onKeyDown={onKeyDown}
              onMouseEnter={() => (hoverRef.current = true)}
              onMouseLeave={() => (hoverRef.current = false)}
              className="relative h-[340px] select-none sm:h-[400px]"
            >
              {/* subtle grid backdrop */}
              <div
                aria-hidden
                className="grid-bg absolute inset-0 rounded-2xl opacity-25"
                style={{
                  maskImage: "radial-gradient(circle at 50% 45%, black, transparent 78%)",
                  WebkitMaskImage: "radial-gradient(circle at 50% 45%, black, transparent 78%)",
                }}
              />
              {stars.map((s, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute size-1 rounded-full bg-cyan/60"
                  style={{ left: s.left, top: s.top, animation: `climb-core-pulse 4s ease-in-out ${s.d} infinite` }}
                />
              ))}

              {/* helix curve */}
              {geo && helixPath && (
                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${geo.w} ${geo.h}`}
                >
                  <defs>
                    <linearGradient id="climb-helix-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: "var(--cyan)", stopOpacity: 0.2 }} />
                      <stop offset="50%" style={{ stopColor: "var(--primary)", stopOpacity: 0.45 }} />
                      <stop offset="100%" style={{ stopColor: "var(--violet)", stopOpacity: 0.2 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d={helixPath}
                    fill="none"
                    stroke="url(#climb-helix-grad)"
                    strokeWidth="4"
                    opacity="0.4"
                    style={{ filter: "blur(4px)" }}
                  />
                  <path d={helixPath} fill="none" stroke="url(#climb-helix-grad)" strokeWidth="1.5" />
                </svg>
              )}

              {/* core orb + progress ring */}
              {geo && (
                <div
                  aria-hidden
                  className={`absolute -translate-x-1/2 -translate-y-1/2 ${pulse ? "climb-flash" : ""}`}
                  style={{ left: geo.cx, top: geo.coreY, zIndex: 35 }}
                  onAnimationEnd={(e) => {
                    if (e.target === e.currentTarget) setPulse(false);
                  }}
                >
                  <div className="relative grid size-24 place-items-center">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, color-mix(in oklab, var(--cyan) 30%, transparent), transparent 70%)",
                        filter: "blur(5px)",
                      }}
                    />
                    <svg className="absolute inset-0" viewBox="0 0 96 96" style={{ transform: "rotate(-90deg)" }}>
                      <defs>
                        <linearGradient id="climb-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "var(--violet)" }} />
                          <stop
                            offset="100%"
                            style={{ stopColor: "color-mix(in oklab, var(--violet) 55%, var(--destructive))" }}
                          />
                        </linearGradient>
                      </defs>
                      <circle cx="48" cy="48" r={RING_R} fill="none" stroke="var(--border)" strokeWidth="3" />
                      <circle
                        className="climb-ring"
                        cx="48"
                        cy="48"
                        r={RING_R}
                        fill="none"
                        stroke="url(#climb-ring-grad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={RING_C}
                        style={{ strokeDashoffset: RING_C * (1 - (active + 1) / stages.length) }}
                      />
                    </svg>
                    <div
                      className="climb-core-pulse relative size-9 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--cyan), var(--violet), color-mix(in oklab, var(--violet) 55%, var(--destructive)))",
                        boxShadow: "0 0 28px color-mix(in oklab, var(--violet) 60%, transparent)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* steps */}
              {stages.map((s, i) => (
                <button
                  key={s.label}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  type="button"
                  aria-label={`${s.label}: ${s.note}`}
                  aria-pressed={active === i}
                  onClick={() => selectStep(i)}
                  style={{ opacity: 0 }}
                  className={`climb-step group absolute left-0 top-0 cursor-pointer rounded-full border ${
                    active === i
                      ? "climb-step-active text-primary-foreground"
                      : "glass text-foreground/90 hover:border-cyan/50"
                  }`}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-3 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--cyan) 35%, transparent), transparent 70%)",
                      filter: "blur(6px)",
                    }}
                  />
                  <span className="relative flex items-center gap-1.5 px-3 py-1.5 font-display text-xs transition-transform duration-300 group-hover:-translate-y-1 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                    <span className={`font-mono text-[0.6rem] sm:text-[0.65rem] ${active === i ? "opacity-90" : "text-primary"}`}>
                      0{i + 1}
                    </span>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* info panel */}
            <div className="glass rounded-2xl border-primary/25 p-6 sm:p-8">
              <div key={active} aria-live="polite" className="climb-panel-enter">
                <p className="mono-label">Step 0{active + 1} / 05</p>
                <h3 className="mt-3 font-display text-3xl font-medium text-gradient">{current.label}</h3>
                <p className="mt-2 text-muted-foreground">{current.note}</p>
              </div>
              <div className="mt-6 flex items-center gap-2" aria-hidden>
                {stages.map((s, i) => (
                  <span
                    key={s.label}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                      i <= active ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-5 text-center font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                Click a step — arrow keys work too
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
