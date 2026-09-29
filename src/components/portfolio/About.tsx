import { Reveal, SectionHeading } from "./Reveal";

const stages = [
  { label: "Learn", note: "Courses, docs, fundamentals" },
  { label: "Build", note: "Small projects end to end" },
  { label: "Experiment", note: "Try, break, retry" },
  { label: "Improve", note: "Refine with feedback" },
  { label: "Deploy", note: "Make it live" },
];

export function About() {
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

        <div className="relative">
          <div className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-gradient-to-b from-cyan/60 via-primary/50 to-violet/10" />
          <ol className="space-y-4">
            {stages.map((s, i) => (
              <Reveal key={s.label} delay={i * 110}>
                <li className="glass lift flex items-start gap-4 rounded-2xl p-4">
                  <span className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-background font-mono text-xs text-primary ring-1 ring-primary/40">
                    0{i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-medium">{s.label}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{s.note}</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
