import { useEffect, useRef, useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";

const stages = [
  { label: "Learn", note: "Courses, docs, fundamentals" },
  { label: "Build", note: "Small projects end to end" },
  { label: "Experiment", note: "Try, break, retry" },
  { label: "Improve", note: "Refine with feedback" },
  { label: "Deploy", note: "Make it live" },
];

export function About() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!autoPlay || reducedMotion.current) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % stages.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [autoPlay]);

  const select = (i: number) => {
    setActive(i);
    setAutoPlay(false);
  };

  const current = stages[active] ?? stages[0]!;

  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <SectionHeading index="01" kicker="About me" title="Learning by building, not just reading." />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
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

        <Reveal delay={120}>
          <div className="glass rounded-3xl p-6 sm:p-8">
            {/* Stepper: connected nodes in a loop */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute left-[1.6rem] right-[1.6rem] top-6 h-px bg-gradient-to-r from-cyan/60 via-primary/60 to-violet/60"
              />
              <ol className="relative flex items-start justify-between">
                {stages.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <li key={s.label} className="relative flex w-full flex-col items-center">
                      <button
                        type="button"
                        aria-label={`${s.label}: ${s.note}`}
                        aria-pressed={isActive}
                        onClick={() => select(i)}
                        className={`group flex size-12 cursor-pointer items-center justify-center rounded-full font-mono text-xs transition-all duration-300 ${
                          isActive
                            ? "scale-110 bg-primary text-primary-foreground shadow-[var(--glow-primary)] ring-2 ring-primary/70"
                            : "bg-background text-muted-foreground ring-1 ring-primary/30 hover:scale-105 hover:text-foreground hover:ring-primary/60"
                        }`}
                      >
                        0{i + 1}
                      </button>
                      <span
                        className={`mt-2 text-center font-display text-[0.7rem] transition-colors duration-300 sm:text-xs ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
              {/* Loop-back connector: Deploy → Learn */}
              <div aria-hidden className="mt-3 flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-violet/50" />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  ↻ repeat
                </span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-violet/50" />
              </div>
            </div>

            {/* Description panel */}
            <div className="mt-6 rounded-2xl border border-primary/25 bg-background/60 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="mono-label">
                  Step 0{active + 1} / 05
                </span>
                <span
                  aria-hidden
                  className={`size-2 rounded-full bg-primary ${
                    autoPlay ? "animate-node" : ""
                  }`}
                />
              </div>
              <h3 className="mt-2 font-display text-xl font-medium text-gradient">{current.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{current.note}</p>
            </div>

            <p className="mt-4 text-center font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
              {autoPlay ? "Auto-cycling — click a step to take control" : "Manual mode — click ↻ to resume"}
            </p>
            {!autoPlay && (
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setAutoPlay(true)}
                  className="cursor-pointer rounded-full px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary ring-1 ring-primary/40 transition-all duration-300 hover:bg-primary/10 hover:shadow-[var(--glow-primary)]"
                >
                  ↻ resume
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
