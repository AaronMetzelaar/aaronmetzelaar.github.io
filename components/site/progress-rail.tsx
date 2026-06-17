"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "ai", label: "AI & Agentic" },
  { id: "thesis", label: "Thesis" },
  { id: "creative", label: "Creative" },
  { id: "contact", label: "Contact" },
];

/**
 * Fixed dot navigator down the right edge — the page's blue-dot motif as
 * wayfinding. The section nearest the viewport centre fills in; the rest stay
 * faint and reveal their label on hover. Desktop only.
 */
export function ProgressRail() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const it of ITEMS) {
      const el = document.getElementById(it.id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 sm:right-8 lg:block"
    >
      <ul className="flex flex-col items-end gap-4 font-terminal">
        {ITEMS.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                className="group pointer-events-auto flex items-center justify-end gap-3"
                href={`#${it.id}`}
              >
                <span
                  className={cn(
                    "text-[0.6rem] uppercase tracking-[0.2em] transition-all duration-300",
                    on
                      ? "text-accent opacity-100"
                      : "text-muted-fg opacity-0 group-hover:opacity-100"
                  )}
                >
                  {it.label}
                </span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                    on ? "scale-150 bg-accent" : "bg-fg/25 group-hover:bg-fg/50"
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
