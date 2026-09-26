import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Loader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDone(true), 900);
    const t2 = setTimeout(() => setHidden(true), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
        done ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div className="grid-bg absolute inset-0 opacity-25" />
      <div className="relative text-center">
        <div className="relative mx-auto size-16">
          <span className="animate-ring absolute inset-0 rounded-full border border-primary/30 border-t-cyan" />
          <span className="absolute inset-3 animate-node rounded-full bg-primary/40" />
        </div>
        <p className="mono-label mt-6">Initializing</p>
        <div className="mx-auto mt-3 h-px w-28 overflow-hidden bg-border">
          <span
            className="block h-full bg-gradient-to-r from-cyan to-violet transition-[width] duration-700 ease-out"
            style={{ width: done ? "100%" : "35%" }}
          />
        </div>
      </div>
    </div>
  );
}
