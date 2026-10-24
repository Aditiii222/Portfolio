import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import profileImg from "@/assets/aditi-portrait.png.asset.json";

const nodes = [
  { x: 12, y: 22, d: 0 },
  { x: 28, y: 68, d: 0.6 },
  { x: 46, y: 18, d: 1.2 },
  { x: 62, y: 78, d: 0.3 },
  { x: 78, y: 34, d: 1.8 },
  { x: 90, y: 62, d: 0.9 },
  { x: 20, y: 46, d: 1.5 },
  { x: 70, y: 12, d: 2.1 },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.4 });
  const phrases = ["Third-Year IT Student", "AI/ML Enthusiast", "Builder"];
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        setPointer({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
        frame = 0;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(phrases[0]);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    let phrase = 0;
    let char = 0;
    let deleting = false;

    const tick = () => {
      const current = phrases[phrase] ?? phrases[0] ?? "";
      if (!deleting) {
        char += 1;
        setTyped(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 65);
      } else {
        char -= 1;
        setTyped(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = setTimeout(tick, 380);
          return;
        }
        timer = setTimeout(tick, 34);
      }
    };

    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shift = (depth: number) => ({
    transform: `translate3d(${(pointer.x - 0.5) * depth}px, ${(pointer.y - 0.5) * depth}px, 0)`,
  });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20"
    >
      {/* layered background */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_35%,black,transparent_72%)]" />
      <div
        className="pointer-events-none absolute -inset-40 transition-transform duration-300 ease-out"
        style={{
          background: `radial-gradient(520px circle at ${pointer.x * 100}% ${pointer.y * 100}%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-1/4 size-[26rem] rounded-full bg-violet/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-[22rem] rounded-full bg-cyan/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0">
        {nodes.map((n, i) => (
          <span
            key={i}
            className="animate-node absolute size-1.5 rounded-full bg-cyan shadow-[0_0_12px_2px_color-mix(in_oklab,var(--cyan)_60%,transparent)]"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              animationDelay: `${n.d}s`,
              transform: `translate3d(${(pointer.x - 0.5) * (14 + i * 3)}px, ${(pointer.y - 0.5) * (14 + i * 3)}px, 0)`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.25fr_0.9fr]">
        <div>
          <p className="mono-label flex items-center gap-3">
            <span className="size-2 animate-node rounded-full bg-cyan" />
            Portfolio / 2026
          </p>

          <h1 className="mt-6 text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.95] font-semibold">
            Aditi Anand
            <br />
            <span className="text-gradient">Guddeti</span>
          </h1>

          <p className="mt-6 max-w-xl font-mono text-sm text-primary/90 sm:text-base">
            <span className="inline-block min-w-[19ch] whitespace-nowrap">
              {typed}
              <span className="animate-caret ml-0.5 text-cyan">▍</span>
            </span>
            <span className="text-muted-foreground">|</span> Exploring AI
            &amp; Machine Learning
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Building, learning, and experimenting at the intersection of AI &amp; ML.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-primary-foreground"
              style={{ background: "var(--gradient-accent)" }}
            >
              View My Projects
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="glass lift inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              Let&apos;s Connect
            </a>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Aditiii222"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="glass lift flex size-11 items-center justify-center rounded-full"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/aditi-guddeti-73592b310/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="glass lift flex size-11 items-center justify-center rounded-full"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="mono-label mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              <MapPin size={13} className="text-primary" /> Pune, India
            </span>
            <span>Trinity Academy of Engineering · SPPU</span>
            <span>B.E. IT · 2028</span>
          </div>
        </div>

        {/* profile visual */}
        <div className="relative mx-auto w-full max-w-sm lg:mx-0" style={shift(-18)}>
          <div className="animate-float relative">
            <div
              className="animate-ring absolute -inset-4 rounded-[2.5rem] opacity-70"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0 55%, color-mix(in oklab, var(--cyan) 70%, transparent) 75%, color-mix(in oklab, var(--violet) 80%, transparent) 90%, transparent 100%)",
                filter: "blur(14px)",
              }}
            />
            <div className="glass relative overflow-hidden rounded-[2rem] p-2">
              <img
                src={profileImg.url}
                alt="Aditi Anand Guddeti"
                width={912}
                height={912}
                className="aspect-square w-full rounded-[1.6rem] object-cover"
              />
            </div>
          </div>
          {[
            { label: "Python", pos: "-left-4 top-6", depth: 26, delay: "0s", blur: true },
            { label: "ML", pos: "-right-3 bottom-24", depth: -20, delay: "1.4s", blur: false },
            { label: "LLMs", pos: "-bottom-2 left-10", depth: 32, delay: "2.6s", blur: false },
          ].map((chip) => (
            <div
              key={chip.label}
              className={`absolute ${chip.pos}`}
              style={{
                transform: `translate3d(${(pointer.x - 0.5) * chip.depth}px, ${(pointer.y - 0.5) * chip.depth}px, 0)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <div
                className={`glass mono-label animate-float rounded-full px-3 py-1.5${chip.blur ? " backdrop-blur-md" : ""}`}
                style={{ animationDelay: chip.delay }}
              >
                {chip.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
