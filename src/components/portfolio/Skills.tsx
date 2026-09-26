import { Reveal, SectionHeading } from "./Reveal";

type Group = {
  title: string;
  status: string;
  accent: string;
  items: { name: string; note: string }[];
};

const groups: Group[] = [
  {
    title: "Current foundation",
    status: "Comfortable with basics",
    accent: "var(--cyan)",
    items: [
      { name: "Python", note: "Core language for my AI/ML work" },
      { name: "Machine Learning fundamentals", note: "Core concepts and workflows" },
      { name: "GitHub", note: "Version control and collaboration" },
    ],
  },
  {
    title: "Web / technical exposure",
    status: "Used in coursework & projects",
    accent: "var(--primary)",
    items: [
      { name: "HTML", note: "Structure for web projects" },
      { name: "CSS", note: "Styling and layout basics" },
      { name: "JavaScript", note: "Interactivity on the web" },
      { name: "Firebase", note: "Hosting and app data" },
      { name: "Google Maps API", note: "Map integration in a live project" },
    ],
  },
  {
    title: "Currently strengthening",
    status: "Active practice",
    accent: "var(--violet)",
    items: [
      { name: "Python", note: "Deeper, project-driven practice" },
      { name: "Machine Learning", note: "Supervised learning workflows" },
      { name: "Data preprocessing", note: "Cleaning and preparing datasets" },
      { name: "Model development", note: "Training and tuning models" },
      { name: "Model evaluation", note: "Metrics and validation" },
      { name: "Practical AI applications", note: "Turning models into usable tools" },
    ],
  },
  {
    title: "Exploring",
    status: "Early exploration",
    accent: "var(--accent)",
    items: [
      { name: "Generative AI", note: "Learning the landscape and tooling" },
      { name: "Large Language Models", note: "Reading, testing, experimenting" },
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-24 py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-72 bg-primary/5 blur-[120px]" />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="02"
          kicker="Skills & tech stack"
          title="An honest map of where I am right now."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 90}>
              <div className="glass lift h-full rounded-3xl p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-medium">{g.title}</h3>
                  <span
                    className="mono-label rounded-full px-3 py-1 text-[0.62rem] ring-1"
                    style={{
                      color: g.accent,
                      borderColor: "transparent",
                      background: `color-mix(in oklab, ${g.accent} 12%, transparent)`,
                    }}
                  >
                    {g.status}
                  </span>
                </div>

                <ul className="mt-5 space-y-2">
                  {g.items.map((it) => (
                    <li
                      key={it.name}
                      className="group cursor-default rounded-xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-border hover:bg-foreground/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="size-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150"
                          style={{ background: g.accent }}
                        />
                        <span className="text-sm font-medium">{it.name}</span>
                      </div>
                      <p className="max-h-0 overflow-hidden pl-[1.1rem] text-xs text-muted-foreground opacity-0 transition-all duration-300 group-hover:max-h-12 group-hover:pt-1.5 group-hover:opacity-100">
                        {it.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
