import { Reveal, SectionHeading } from "./Reveal";

const steps = [
  { title: "Academic Projects", note: "Coursework projects at Trinity Academy of Engineering" },
  { title: "Python & AI/ML Learning", note: "Fundamentals, practice and self-study" },
  { title: "Personal Projects", note: "Building small things end to end" },
  {
    title: "Leadership & College Involvement",
    note: "ITSA — Training & Placement & Higher Education Head · 2026–Present",
    detail: "ITSA Anchoring Club — Member · Previous academic year",
  },
  { title: "Technical Communities", note: "Learning alongside other students and developers" },
  { title: "Hackathons & Experiments", note: "Testing ideas under time pressure" },
  { title: "Preparing for an AI/ML Career", note: "Open to real-world experience" },
];

const activities = [
  { label: "Academic projects", note: "IT coursework projects" },
  { label: "AI/ML learning", note: "Python, ML workflows, practical AI" },
  { label: "Hackathons", note: "Participation and experiments" },
  { label: "Technical communities", note: "Student and developer groups" },
  { label: "Technical events & workshops", note: "Sessions I take part in" },
  { label: "Foreign Language — German", note: "Completed A1; recently appeared for the A2 exam" },
  { label: "Certifications", note: "A collection of courses, workshops, and certifications that reflect my continuous learning." },
];

export function Journey() {
  return (
    <section id="journey" className="relative scroll-mt-24 py-28">
      <div className="pointer-events-none absolute right-0 top-10 -z-10 size-80 rounded-full bg-violet/10 blur-[130px]" />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="05"
          kicker="My journey"
          title="Learning, Building, and Moving Toward AI/ML"
        />

        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-[0.4rem] top-2 bottom-2 w-px bg-gradient-to-b from-cyan/60 via-primary/40 to-transparent sm:left-[0.55rem]" />
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <li className="relative">
                  <span className="absolute -left-8 top-5 size-3 rounded-full bg-background ring-2 ring-primary/60 sm:-left-10" />
                  <div className="glass lift rounded-2xl p-5">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="mono-label text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-medium">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.note}</p>
                    {s.detail ? (
                      <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                    ) : null}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-24">
          <SectionHeading
            index="06"
            kicker="Achievements & activities"
            title="Where my time goes outside class."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a, i) => (
              <Reveal key={a.label} delay={i * 70}>
                <div className="glass lift h-full rounded-2xl p-5">
                  <span className="animate-node block size-2 rounded-full bg-cyan" />
                  <h3 className="mt-4 text-base font-medium">{a.label}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{a.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
