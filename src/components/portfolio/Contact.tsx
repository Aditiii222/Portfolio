import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <p className="mono-label">07 — Contact</p>
          <h2 className="mt-5 text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.05] font-semibold">
            Let&apos;s Build Something <span className="text-gradient">Interesting</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground sm:text-lg">
            “I&apos;m currently exploring AI/ML opportunities, technical projects, hackathons, and
            ways to gain real-world experience.”
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:aditi.guddeti@gmail.com"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Mail size={16} /> Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/aditi-guddeti-73592b310/"
              target="_blank"
              rel="noreferrer"
              className="glass lift inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href="https://github.com/Aditiii222"
              target="_blank"
              rel="noreferrer"
              className="glass lift inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              <Github size={16} /> GitHub
            </a>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mono-label mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="flex items-center gap-2">
              <Mail size={13} className="text-primary" /> aditi.guddeti@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={13} className="text-primary" /> Pune, India
            </span>
          </div>
        </Reveal>
      </div>

      <footer className="mono-label mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 pt-8">
        <span>© {new Date().getFullYear()} Aditi Anand Guddeti</span>
        <span>Designed &amp; built with curiosity</span>
      </footer>
    </section>
  );
}
