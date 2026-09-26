import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mono-label flex items-center gap-3">
        <span className="text-primary">{index}</span>
        <span className="h-px w-10 bg-border" />
        {kicker}
      </p>
      <h2 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl">{title}</h2>
    </Reveal>
  );
}
