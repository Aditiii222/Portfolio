import { useRef, useState } from "react";
import { ArrowUpRight, Bot, MapPinned } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

function ViewProjectLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="glass lift mono-label inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-primary/90 transition-colors hover:text-foreground"
    >
      View Project
      <ArrowUpRight
        size={14}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({
      transform: `perspective(1100px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-6px)`,
      background: `radial-gradient(600px circle at ${px * 100}% ${py * 100}%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 65%)`,
      boxShadow: "var(--glow-primary)",
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setStyle({})}
      style={style}
      className="glass group relative overflow-hidden rounded-[2rem] p-7 transition-[transform,box-shadow] duration-300 ease-out sm:p-9"
    >
      {children}
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading index="03" kicker="Projects" title="Projects I've Built & Contributed To" />

        <div className="space-y-7">
          <Reveal>
            <TiltCard>
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="mono-label">Project 01</p>
                  <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
                    Vanarai NGO Tree Plantation Website
                  </h3>
                  <p className="mt-4 max-w-xl text-muted-foreground">
                    A website created for a tree plantation initiative associated with the Vanarai
                    NGO.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="text-foreground">Contribution:</span> Student developer —
                    Google Maps API integration.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Google Maps API", "Firebase", "Web technologies"].map((t) => (
                      <span
                        key={t}
                        className="mono-label rounded-full bg-foreground/[0.05] px-3 py-1.5 text-[0.62rem] ring-1 ring-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7">
                    <ViewProjectLink href="https://treemovement-627bd.web.app/" />
                  </div>
                </div>

                <div className="relative min-h-52 overflow-hidden rounded-2xl ring-1 ring-border">
                  <div className="grid-bg absolute inset-0 opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-violet/20" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="relative flex size-16 items-center justify-center rounded-full bg-background/70 ring-1 ring-primary/50">
                      <MapPinned size={24} className="text-primary" />
                      <span className="absolute inset-0 animate-node rounded-full ring-2 ring-cyan/40" />
                    </span>
                    <p className="mono-label mt-4">Maps integration</p>
                  </div>
                  {[
                    { x: 22, y: 26 },
                    { x: 72, y: 34 },
                    { x: 36, y: 74 },
                    { x: 80, y: 70 },
                  ].map((p, i) => (
                    <span
                      key={i}
                      className="animate-node absolute size-2 rounded-full bg-cyan"
                      style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 0.5}s` }}
                    />
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={100}>
            <TiltCard>
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="mono-label">Project 02</p>
                  <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">Crock-Kill Chatbot</h3>
                  <p className="mt-4 max-w-xl text-muted-foreground">
                    An AI-powered customer-service chatbot created for Crock Kill Cockroach Vanisher
                    Powder, developed as a web-based chatbot using AI-assisted development tools and
                    deployed through GitHub Pages.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="text-foreground">Role:</span> Student developer
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["HTML", "AI-assisted development", "GitHub Pages"].map((t) => (
                      <span
                        key={t}
                        className="mono-label rounded-full bg-foreground/[0.05] px-3 py-1.5 text-[0.62rem] ring-1 ring-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-background/50 p-4 ring-1 ring-border">
                  <div className="mono-label flex items-center gap-2">
                    <Bot size={14} className="text-violet" /> chat preview
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary/20 px-3.5 py-2 ring-1 ring-primary/30">
                      How do I use the powder safely?
                    </div>
                    <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-foreground/[0.06] px-3.5 py-2 ring-1 ring-border">
                      Sprinkle it along cracks and corners, keep it away from food, and wash hands
                      after use.
                    </div>
                    <div className="flex items-center gap-1.5 pl-2 pt-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="animate-node size-1.5 rounded-full bg-violet"
                          style={{ animationDelay: `${i * 0.25}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
