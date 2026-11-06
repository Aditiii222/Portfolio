import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "./Reveal";

type DeckId = "core" | "web" | "next";
type SkillCard = { title: string; body: string };
type LeavingCard = { deck: Deck; card: SkillCard; index: number };
type Deck = {
  id: DeckId;
  title: string;
  badge: string;
  color: string;
  dashed?: boolean;
  cards: SkillCard[];
};

const decks: Deck[] = [
  {
    id: "core",
    title: "Core skills",
    badge: "Hands-on",
    color: "#22D3EE",
    cards: [
      { title: "Python", body: "Pandas, scikit-learn, Matplotlib, Seaborn" },
      { title: "Machine learning", body: "Classification, TF-IDF, model evaluation" },
      { title: "Data and version control", body: "SQL, Git and GitHub" },
      { title: "Java and C/C++", body: "Programming fundamentals" },
    ],
  },
  {
    id: "web",
    title: "Web and tools",
    badge: "Used in projects",
    color: "#3B82F6",
    cards: [
      { title: "HTML, CSS, JavaScript", body: "Used in coursework and projects" },
      { title: "Firebase and Google Maps API", body: "Used in projects" },
    ],
  },
  {
    id: "next",
    title: "What comes next",
    badge: "In progress",
    color: "#8B5CF6",
    dashed: true,
    cards: [
      { title: "Machine Learning Specialization", body: "Andrew Ng, Coursera" },
      { title: "Kaggle", body: "Courses and competitions" },
      { title: "Retrieval-Augmented Generation", body: "My seminar topic" },
      { title: "Data structures and algorithms", body: "In progress" },
    ],
  },
];

export function Skills() {
  const [activeDeck, setActiveDeck] = useState<DeckId | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [cardPhase, setCardPhase] = useState<"idle" | "enter" | "exit">("idle");
  const [leavingCard, setLeavingCard] = useState<LeavingCard | null>(null);
  const transitioning = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const active = decks.find((deck) => deck.id === activeDeck) ?? null;
  const currentCard = active?.cards[cardIndex] ?? null;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const openDeck = (deck: Deck) => {
    if (deck.id === activeDeck && !finished && active) {
      if (transitioning.current) return;
      advanceCard();
      return;
    }
    clearTimers();
    transitioning.current = false;
    setLeavingCard(null);
    setActiveDeck(deck.id);
    setCardIndex(0);
    setFinished(false);
    setCardPhase("enter");
  };

  function advanceCard() {
    if (!active || transitioning.current) return;
    if (reducedMotion) {
      if (cardIndex >= active.cards.length - 1) {
        setFinished(true);
      } else {
        setCardIndex((index) => index + 1);
      }
      setCardPhase("idle");
      return;
    }

    transitioning.current = true;
    setCardPhase("exit");
    if (cardIndex >= active.cards.length - 1) {
      timers.current.push(setTimeout(() => {
        setFinished(true);
        setCardPhase("idle");
        transitioning.current = false;
      }, 700));
      return;
    }

    const leaving = { deck: active, card: active.cards[cardIndex], index: cardIndex };
    timers.current.push(setTimeout(() => {
      setLeavingCard(leaving);
      setCardIndex((index) => index + 1);
      setCardPhase("enter");
      timers.current.push(setTimeout(() => {
        setLeavingCard(null);
        setCardPhase("idle");
        transitioning.current = false;
      }, 400));
    }, 300));
  }

  const openNextDeck = () => {
    if (!active) return;
    const deckIndex = decks.findIndex((deck) => deck.id === active.id);
    const nextDeck = decks[(deckIndex + 1) % decks.length];
    if (nextDeck) openDeck(nextDeck);
  };

  const startDeckOver = () => {
    clearTimers();
    transitioning.current = false;
    setLeavingCard(null);
    setCardIndex(0);
    setFinished(false);
    setCardPhase("enter");
  };

  const renderCard = (
    deck: Deck,
    card: SkillCard,
    index: number,
    phase: "idle" | "enter" | "exit" | "exit-continued",
    interactive: boolean,
  ) => (
    <div
      key={`${deck.id}-${index}-${phase}`}
      className={`skills-card-layer ${phase === "enter" ? "skills-card-enter" : ""} ${phase.startsWith("exit") ? "skills-card-exit" : ""} ${phase === "exit-continued" ? "skills-card-exit-continued" : ""}`}
      style={{ "--deck-color": deck.color } as CSSProperties}
      aria-hidden={!interactive || undefined}
    >
      <button
        type="button"
        className={`skills-active-card w-full text-left ${deck.dashed ? "skills-dashed" : ""}`}
        aria-label={interactive ? `${card.title}, card ${index + 1} of ${deck.cards.length}. Advance to the next card.` : undefined}
        tabIndex={interactive ? undefined : -1}
        onClick={interactive ? advanceCard : undefined}
        disabled={!interactive}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="skills-badge">{deck.badge}</span>
          <span className="mono-label !text-[0.62rem]">
            {index + 1} of {deck.cards.length}
          </span>
        </div>
        <h3 className="mt-5 text-2xl font-medium">{card.title}</h3>
        <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{card.body}</p>
        {interactive && reducedMotion === false && (
          <div className="skills-progress-track mt-6" aria-hidden="true">
            <div className="skills-progress-line" onAnimationEnd={advanceCard} />
          </div>
        )}
      </button>
      {interactive && reducedMotion && (
        <Button className="mt-3 w-full" onClick={advanceCard}>
          Next
        </Button>
      )}
    </div>
  );

  return (
    <section id="skills" className="relative scroll-mt-24 py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-72 bg-primary/5 blur-[120px]" />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="02"
          kicker="Skills & tech stack"
          title="Where I Stand. What Comes Next."
        />

        <Reveal>
          <div
            aria-live="polite"
            aria-atomic="false"
            className="skills-stage relative flex min-h-[220px] items-center justify-center py-5 sm:min-h-[240px]"
          >
            {!active ? (
              <p className="text-sm text-muted-foreground">Tap a deck to draw a card</p>
            ) : finished ? (
              <div key={`${active.id}-finished`} className="skills-stage-fade text-center">
                <p className="text-lg font-medium">That&apos;s the {active.title} deck.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={startDeckOver}>
                    Draw again
                  </Button>
                  <Button onClick={openNextDeck}>Next deck</Button>
                </div>
              </div>
            ) : currentCard ? (
              <>
                {leavingCard && renderCard(leavingCard.deck, leavingCard.card, leavingCard.index, "exit-continued", false)}
                {renderCard(active, currentCard, cardIndex, cardPhase, true)}
              </>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {decks.map((deck) => {
              const isActive = deck.id === activeDeck && !finished;
              const isDimmed = activeDeck !== null && !finished && !isActive;
              return (
                <Button
                  key={deck.id}
                  variant="ghost"
                  type="button"
                  aria-label={`Open ${deck.title} deck, ${deck.cards.length} cards`}
                  aria-pressed={isActive}
                  onClick={() => openDeck(deck)}
                  onPointerMove={(event) => {
                    if (event.pointerType !== "mouse") return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                    event.currentTarget.style.setProperty("--tilt-x", `${x * 8}deg`);
                    event.currentTarget.style.setProperty("--tilt-y", `${y * -8}deg`);
                  }}
                  onPointerLeave={(event) => {
                    event.currentTarget.style.setProperty("--tilt-x", "0deg");
                    event.currentTarget.style.setProperty("--tilt-y", "0deg");
                  }}
                  className={`skills-deck relative h-[142px] w-full whitespace-normal px-2 py-3 text-left sm:h-[150px] sm:w-[220px] sm:max-w-full sm:px-4 sm:py-4 ${deck.dashed ? "skills-dashed" : ""}`}
                  style={{
                    "--deck-color": deck.color,
                    opacity: isDimmed ? 0.5 : 1,
                    borderColor: isActive ? deck.color : undefined,
                  } as CSSProperties}
                >
                  <span className="skills-stack skills-stack-back" aria-hidden="true" />
                  <span className="skills-stack skills-stack-mid" aria-hidden="true" />
                  <span className="skills-deck-front">
                    <span className="skills-deck-title">{deck.title}</span>
                    <span className="skills-deck-count">
                      {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="mt-5 text-center">
            <Button
              variant="link"
              className="h-auto p-1 text-sm text-muted-foreground hover:text-foreground"
              aria-expanded={showAll}
              onClick={() => setShowAll((visible) => !visible)}
            >
              See all skills
            </Button>
          </div>

          {showAll && (
            <div className="mt-8 grid gap-8 border-t border-border pt-7 md:grid-cols-3">
              {decks.map((deck) => (
                <div key={deck.id}>
                  <h3 className="text-lg font-medium" style={{ color: deck.color }}>
                    {deck.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {deck.cards.map((card) => (
                      <li key={card.title}>
                        <p className="text-sm font-medium">{card.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{card.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>

      <style>{`
        .skills-deck {
          overflow: visible;
          isolation: isolate;
          border: 1px solid color-mix(in oklab, var(--deck-color) 48%, var(--border));
          border-radius: 16px;
          background: color-mix(in oklab, var(--card) 88%, var(--background));
          transition: opacity 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
        }
        .skills-deck:hover, .skills-deck[aria-pressed="true"] {
          box-shadow: 0 0 26px color-mix(in oklab, var(--deck-color) 35%, transparent);
          transform: perspective(700px) rotateX(var(--tilt-y, 0deg)) rotateY(var(--tilt-x, 0deg)) translateY(-6px);
        }
        .skills-deck[aria-pressed="true"] {
          animation: skills-deck-pulse 3s ease-in-out infinite;
        }
        .skills-dashed { border-style: dashed !important; }
        .skills-stack {
          position: absolute;
          z-index: -1;
          inset: 0;
          border: 1px solid color-mix(in oklab, var(--deck-color) 38%, var(--border));
          border-radius: 16px;
          background: color-mix(in oklab, var(--card) 82%, var(--background));
          pointer-events: none;
        }
        .skills-stack-back { transform: translate(5px, 6px); opacity: 0.52; }
        .skills-stack-mid { transform: translate(2px, 3px); opacity: 0.76; }
        .skills-deck-front {
          position: relative;
          display: flex;
          width: 100%;
          height: 100%;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 8px;
          border: 1px solid color-mix(in oklab, var(--deck-color) 38%, var(--border));
          border-radius: 14px;
          padding: 10px;
          background: color-mix(in oklab, var(--card) 92%, var(--background));
        }
        .skills-deck-title { font-size: 14px; font-weight: 500; line-height: 1.25; overflow-wrap: anywhere; }
        .skills-deck-count { font-family: var(--font-mono); font-size: 0.59rem; color: var(--muted-foreground); }
        .skills-active-card {
          display: block;
          min-height: 205px;
          border: 1px solid var(--deck-color);
          border-radius: 16px;
          padding: 24px;
          background: color-mix(in oklab, var(--card) 95%, var(--background));
          box-shadow: 0 0 32px color-mix(in oklab, var(--deck-color) 13%, transparent);
          cursor: pointer;
        }
        .skills-card-layer {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          width: min(100%, 460px);
          transform: translate(-50%, -50%);
        }
        .skills-card-enter { animation: skills-card-emerge 500ms ease-out both; z-index: 2; }
        .skills-card-exit { animation: skills-card-dissolve 700ms ease both; pointer-events: none; }
        .skills-card-exit-continued { animation-delay: -300ms; }
        .skills-card-layer:has(.skills-active-card:disabled) { pointer-events: none; }
        .skills-active-card:focus-visible { outline: 2px solid var(--deck-color); outline-offset: 4px; }
        .skills-badge {
          border-radius: 999px;
          padding: 5px 10px;
          background: color-mix(in oklab, var(--deck-color) 15%, transparent);
          color: var(--deck-color);
          font-family: var(--font-mono);
          font-size: 0.62rem;
        }
        .skills-progress-track { height: 3px; overflow: hidden; border-radius: 999px; background: color-mix(in oklab, var(--deck-color) 18%, transparent); }
        .skills-progress-line { height: 100%; width: 100%; transform: scaleX(0); transform-origin: left; background: var(--deck-color); animation: skills-card-progress 3s linear 500ms forwards; }
        .skills-stage-fade { animation: skills-stage-in 200ms ease both; }
        @keyframes skills-card-progress { to { transform: scaleX(1); } }
        @keyframes skills-card-emerge {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 70px)) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes skills-card-dissolve {
          to { opacity: 0; filter: blur(10px); transform: translate(-50%, calc(-50% - 24px)) scale(1.04); }
        }
        @keyframes skills-deck-pulse {
          0%, 100% { box-shadow: 0 0 18px color-mix(in oklab, var(--deck-color) 24%, transparent); }
          50% { box-shadow: 0 0 32px color-mix(in oklab, var(--deck-color) 42%, transparent); }
        }
        @keyframes skills-stage-in { from { opacity: 0; } to { opacity: 1; } }
        @media (hover: hover) and (pointer: fine) {
          .skills-active-card:hover .skills-progress-line { animation-play-state: paused; }
        }
        @media (min-width: 640px) {
          .skills-deck-title { font-size: 20px; }
          .skills-deck-count { font-size: 0.65rem; }
          .skills-deck-front { padding: 16px; }
          .skills-active-card { min-height: 220px; padding: 28px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skills-progress-track { display: none; }
          .skills-stage-fade, .skills-deck, .skills-card-enter, .skills-card-exit { animation: none !important; transition: none !important; }
          .skills-card-layer { opacity: 1; filter: none; transform: translate(-50%, -50%); }
        }
      `}</style>
    </section>
  );
}