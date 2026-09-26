import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "learning", label: "Learning" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { threshold: [0.25, 0.5], rootMargin: "-20% 0px -40% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <a
          href="#home"
          className={cn(
            "font-mono text-sm tracking-[0.2em] transition-colors",
            scrolled ? "text-foreground" : "text-foreground/90",
          )}
        >
          AG<span className="text-primary">.</span>
        </a>

        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 md:flex",
            scrolled ? "glass shadow-[var(--glow-violet)]" : "border border-transparent",
          )}
        >
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                active === l.id && "text-foreground",
              )}
            >
              {active === l.id && (
                <span className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/40" />
              )}
              <span className="relative">{l.label}</span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="glass flex size-10 items-center justify-center rounded-full text-foreground md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "mx-5 mt-3 overflow-hidden rounded-2xl transition-all duration-400 md:hidden",
          open ? "glass max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col p-3">
          {links.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 30}ms` }}
              className={cn(
                "rounded-xl px-4 py-3 text-sm transition-colors",
                active === l.id
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="mr-3 font-mono text-xs text-primary">
                0{i + 1}
              </span>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
