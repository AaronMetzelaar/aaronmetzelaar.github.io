import type { Metadata } from "next";

import { premiumTheme } from "@/lib/premium-theme";

export const metadata: Metadata = {
  title: "Not found · Aaron Metzelaar",
  robots: { index: false, follow: true },
};

/**
 * A stale link is a real arrival, usually from an old CV or a forwarded
 * message, so it lands on the site instead of the framework's default. Same
 * canvas, same caret, one way back.
 */
export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col justify-center bg-bg px-6 font-terminal text-fg sm:px-10"
      style={premiumTheme}
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-[0.7rem] text-accent uppercase tracking-[0.3em]">
          404
        </p>
        <h1 className="mt-6 font-bold text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.04em]">
          This page moved on
          <span aria-hidden="true" className="text-accent">
            _
          </span>
        </h1>
        <p className="mt-7 max-w-md text-muted-fg leading-relaxed">
          The link you followed points somewhere that no longer exists. The work
          is all still on the homepage.
        </p>
        <a
          className="mt-10 inline-flex items-center gap-3 py-2 text-accent uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
          href="/"
        >
          <span aria-hidden="true">→</span>
          Back to the homepage
        </a>
      </div>
    </main>
  );
}
