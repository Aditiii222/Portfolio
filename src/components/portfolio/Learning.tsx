import { Reveal, SectionHeading } from "./Reveal";

const roadmap = [
  { name: "Python", status: "Building foundation" },
  { name: "Machine Learning", status: "Currently learning" },
  { name: "Data Processing", status: "Currently learning" },
  { name: "Model Development", status: "Currently learning" },
  { name: "Model Evaluation", status: "Currently learning" },
  { name: "Generative AI", status: "Exploring" },
  { name: "LLMs", status: "Exploring" },
];

const statusColor: Record<string, string> = {
  "Building foundation": "var(--cyan)",
  "Currently learning": "var(--primary)",
  Exploring: "var(--violet)",
};

export function Learning() {
  return (
    <section id="learning" className="relative scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="04"
          kicker="Currently learning"
          title="An evolving roadmap, stage by stage."
        />

        <div className="relative">
          <div className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-cyan/50 via-primary/40 to-violet/30 lg:block" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:gap-3">
            {roadmap.map((r, i) => (
              <Reveal key={r.name} delay={i * 80}>
                <div className="glass lift relative h-full rounded-2xl p-4">
                  <span
                    className="mono-label block text-[0.6rem]"
                    style={{ color: statusColor[r.status] }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="animate-node mt-3 block size-2.5 rounded-full"
                    style={{
                      background: statusColor[r.status],
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                  <h3 className="mt-3 text-base leading-tight font-medium">{r.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{r.status}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mono-label mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {Object.entries(statusColor).map(([label, color]) => (
              <span key={label} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
