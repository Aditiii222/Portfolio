import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

const GREETING = "Hi, I'm Aditi. Tap a question to get to know me.";

const QA_LIST = [
  {
    id: "who",
    q: "Who are you?",
    a: "I'm Aditi, a third-year IT engineering student from Pune, passionate about exploring AI and turning innovative ideas into practical applications.",
  },
  {
    id: "building",
    q: "What are you building?",
    a: "A German language learning web app based on the Goethe framework, this portfolio, and ML projects like Sentiment Analysis of Product Reviews. I've also worked on GreenYug, a tree plantation website built as a group project in collaboration with Vanarai NGO, where I did the Google Maps integration.",
  },
  {
    id: "learning",
    q: "What are you learning?",
    a: "I’m exploring AI tools, application development, and emerging technologies while improving my communication, learning German, and focusing on personal growth.",
  },
  {
    id: "led",
    q: "What have you led?",
    a: "I'm a Technical Member of Google Developer Group on Campus (GDGOC) at my college, Training & Placement & Higher Education head and Anchoring Club member at the IT Students' Association (ITSA)",
  },
  {
    id: "looking",
    q: "What are you looking for?",
    a: "An AI/ML internship where I can apply my skills, gain practical experience, learn from industry professionals, and contribute to impactful real-world projects.",
  },
] as const;

const SKILL_CHIPS = ["Python", "Java", "C/C++", "SQL", "HTML"];

type Msg = { id: number; role: "user" | "assistant"; text: string };
type Phase = "idle" | "dots" | "type";

function TypingDots() {
  return (
    <span className="flex items-center gap-1.5 py-1" aria-label="Aditi is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="chat-dot" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </span>
  );
}

function CheckMark() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3 shrink-0">
      <path
        d="M3 8.5 6.5 12 13 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function About() {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: "assistant", text: GREETING }]);
  const [used, setUsed] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [flash, setFlash] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const fullTextRef = useRef("");
  const dotsTimerRef = useRef<number | null>(null);
  const typeTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    return () => {
      if (dotsTimerRef.current) clearTimeout(dotsTimerRef.current);
      if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: phaseRef.current === "type" ? "auto" : "smooth" });
  }, [msgs, phase]);

  const clearTimers = () => {
    if (dotsTimerRef.current) {
      clearTimeout(dotsTimerRef.current);
      dotsTimerRef.current = null;
    }
    if (typeTimerRef.current) {
      clearTimeout(typeTimerRef.current);
      typeTimerRef.current = null;
    }
  };

  // Finish any in-flight answer instantly (full text in the last bubble).
  const finishInstant = () => {
    clearTimers();
    if (phaseRef.current !== "idle") {
      const full = fullTextRef.current;
      setMsgs((m) => {
        const last = m[m.length - 1];
        if (last && last.role === "assistant" && last.text !== full) {
          return [...m.slice(0, -1), { ...last, text: full }];
        }
        return m;
      });
      phaseRef.current = "idle";
      setPhase("idle");
    }
  };

  const typeStep = (i: number) => {
    const full = fullTextRef.current;
    if (i >= full.length) {
      typeTimerRef.current = null;
      phaseRef.current = "idle";
      setPhase("idle");
      setMsgs((m) => {
        const last = m[m.length - 1];
        if (last && last.role === "assistant") return [...m.slice(0, -1), { ...last, text: full }];
        return m;
      });
      return;
    }
    const next = Math.min(full.length, i + 2);
    setMsgs((m) =>
      m.map((msg, idx) =>
        idx === m.length - 1 && msg.role === "assistant" ? { ...msg, text: full.slice(0, next) } : msg,
      ),
    );
    typeTimerRef.current = window.setTimeout(() => typeStep(next), 18);
  };

  const handleChip = (qa: (typeof QA_LIST)[number]) => {
    if (reducedRef.current) {
      clearTimers();
      phaseRef.current = "idle";
      setPhase("idle");
      setUsed((u) => (u.includes(qa.id) ? u : [...u, qa.id]));
      const uid = ++idRef.current;
      const aid = ++idRef.current;
      setMsgs((m) => [
        ...m,
        { id: uid, role: "user", text: qa.q },
        { id: aid, role: "assistant", text: qa.a },
      ]);
      return;
    }

    finishInstant();
    setUsed((u) => (u.includes(qa.id) ? u : [...u, qa.id]));

    // Orb flashes brighter on a new question, then returns to its default state.
    setFlash(true);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setFlash(false), 700);

    fullTextRef.current = qa.a;
    const uid = ++idRef.current;
    const aid = ++idRef.current;
    setMsgs((m) => [
      ...m,
      { id: uid, role: "user", text: qa.q },
      { id: aid, role: "assistant", text: "" },
    ]);
    phaseRef.current = "dots";
    setPhase("dots");
    dotsTimerRef.current = window.setTimeout(() => {
      phaseRef.current = "type";
      setPhase("type");
      typeStep(0);
    }, 700);
  };

  const clearChat = () => {
    clearTimers();
    phaseRef.current = "idle";
    setPhase("idle");
    idRef.current = 0;
    setMsgs([{ id: 0, role: "assistant", text: GREETING }]);
    setUsed([]);
  };

  const lastIsTyping = phase === "type";

  return (
    <section ref={undefined} id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <style>{`
        @keyframes chat-msg-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .chat-msg { animation: chat-msg-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes chat-dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .chat-dot {
          width: 6px; height: 6px; border-radius: 9999px;
          background: var(--cyan);
          animation: chat-dot-bounce 1.1s ease-in-out infinite;
        }

        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: color-mix(in oklab, var(--primary) 40%, transparent) transparent;
        }
        .chat-scroll::-webkit-scrollbar { width: 6px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: color-mix(in oklab, var(--primary) 40%, transparent);
          border-radius: 9999px;
        }

        .chat-online {
          background: oklch(0.78 0.17 160);
          box-shadow: 0 0 8px oklch(0.78 0.17 160 / 60%);
        }

        /* Orb avatar */
        @keyframes orb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.92; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes orb-flash {
          0% { transform: scale(1.28); filter: brightness(1.7); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        .aditi-orb { animation: orb-float 5.5s ease-in-out infinite; }
        .orb-glow {
          position: absolute; inset: -12px; border-radius: 9999px;
          background: radial-gradient(circle, color-mix(in oklab, var(--cyan) 40%, transparent), transparent 70%);
          filter: blur(9px);
          animation: orb-pulse 3.4s ease-in-out infinite;
        }
        .orb-core {
          background: radial-gradient(circle at 30% 30%, var(--cyan), var(--primary) 55%, var(--violet));
          box-shadow: 0 0 14px color-mix(in oklab, var(--primary) 55%, transparent),
            0 0 34px color-mix(in oklab, var(--violet) 40%, transparent);
          animation: orb-pulse 3.4s ease-in-out infinite;
        }
        .aditi-orb[data-typing="true"] .orb-core,
        .aditi-orb[data-typing="true"] .orb-glow {
          animation-duration: 0.9s;
        }
        .aditi-orb[data-typing="true"] .orb-core {
          box-shadow: 0 0 20px color-mix(in oklab, var(--primary) 80%, transparent),
            0 0 48px color-mix(in oklab, var(--violet) 60%, transparent);
        }
        .aditi-orb[data-flash="true"] .orb-core {
          animation: orb-flash 0.6s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .aditi-orb, .orb-glow, .orb-core, .chat-dot, .chat-msg { animation: none !important; }
        }
      `}</style>

      <Reveal className="mb-12 max-w-2xl">
        <p className="mono-label flex items-center gap-3">
          <span className="text-primary">01</span>
          <span className="h-px w-10 bg-border" />
          About me
        </p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl">About Me</h2>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Ask me anything
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.15fr]">
          {/* Intro — left column */}
          <div className="space-y-5">
            <h3 className="font-display text-2xl font-semibold text-gradient sm:text-3xl">
              Aditi Anand Guddeti
            </h3>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              BE Information Technology student at Trinity Academy of Engineering, Pune, building
              towards a career in AI/ML.
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="glass rounded-full px-3 py-1.5 font-mono text-xs text-foreground/90"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Chat card — right column */}
          <div
            className="glass overflow-hidden rounded-3xl"
            style={{ boxShadow: "var(--glow-violet)" }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full" style={{ background: "var(--destructive)" }} />
                <span className="size-2.5 rounded-full" style={{ background: "var(--cyan)" }} />
                <span className="size-2.5 rounded-full" style={{ background: "var(--primary)" }} />
              </span>
              <span className="ml-2 font-mono text-xs text-muted-foreground">aditi.ai</span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                <span className="chat-online size-2 rounded-full" aria-hidden />
                online
              </span>
            </div>

            {/* Orb avatar */}
            <div className="flex justify-center pb-1 pt-4">
              <div
                className="aditi-orb relative grid size-16 place-items-center"
                data-typing={phase !== "idle"}
                data-flash={flash}
                aria-hidden
              >
                <span className="orb-glow" />
                <span className="orb-core relative size-11 rounded-full" />
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Chat with Aditi"
              className="chat-scroll flex h-[300px] flex-col gap-3 overflow-y-auto px-4 py-4 sm:h-[340px]"
            >
              {msgs.map((msg, i) => {
                const isLast = i === msgs.length - 1;
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="chat-msg flex justify-end">
                      <div
                        className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
                        style={{ background: "var(--gradient-accent)" }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                }
                const showDots = phase === "dots" && isLast && msg.text === "";
                return (
                  <div key={msg.id} className="chat-msg flex justify-start">
                    <div
                      className="max-w-[85%] rounded-2xl rounded-bl-md border border-border px-4 py-2.5 text-sm leading-relaxed text-foreground/95"
                      style={{ background: "color-mix(in oklab, var(--secondary) 65%, transparent)" }}
                    >
                      {showDots ? (
                        <TypingDots />
                      ) : (
                        <>
                          {msg.text}
                          {lastIsTyping && isLast && (
                            <span
                              aria-hidden
                              className="animate-caret ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-primary"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Question chips */}
            <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
              {QA_LIST.map((qa) => {
                const usedOnce = used.includes(qa.id);
                return (
                  <button
                    key={qa.id}
                    type="button"
                    onClick={() => handleChip(qa)}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      usedOnce
                        ? "border-border/70 bg-secondary/40 text-muted-foreground hover:border-primary/50"
                        : "border-border bg-secondary/50 text-foreground/90 hover:border-primary/60 hover:text-primary"
                    }`}
                  >
                    {usedOnce && <CheckMark />}
                    {qa.q}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                5 questions — tap any chip
              </span>
              <button
                type="button"
                onClick={clearChat}
                className="rounded-full border border-border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Clear chat
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
