import { ScrambleText } from "@/components/motion/scramble-text";
import { HeroPortrait } from "@/components/site/hero-portrait";
import { site } from "@/content/site";

/**
 * Dot-portrait hero — the page's one choreographed arrival. The name decodes
 * (ScrambleText fade) in lock-step with the portrait assembling from across the
 * canvas, so type and face resolve as a single event. Desktop: portrait
 * full-bleed behind the text on the right, drag to turn it. Mobile: a top band
 * whose portrait dissolves into dots at its foot, text on clean canvas below.
 */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden font-terminal lg:block"
      id="top"
    >
      {/* portrait — mobile: a sized top band; desktop: full-bleed behind text.
          The band height is derived from viewport WIDTH (not height) so the
          mobile address bar collapsing on scroll can't rescale the portrait. */}
      <div className="relative h-[clamp(18rem,80vw,26rem)] w-full shrink-0 lg:absolute lg:inset-0 lg:h-auto">
        <HeroPortrait />
        {/* desktop hint: anchored to the portrait itself instead of the text
            column, with a beckoning arrow — the label alone was easy to miss */}
        <span className="pointer-events-none absolute right-10 bottom-10 hidden items-center gap-2.5 text-[0.68rem] text-accent uppercase tracking-[0.25em] lg:flex">
          <span aria-hidden="true" className="nudge-x">
            ↔
          </span>
          Drag to turn
        </span>
      </div>

      {/* touch hint — a flow element below the portrait band (mobile only) so
          it always sits clear of both the dissolving dots above and the kicker
          below, on any viewport height. Desktop gets its own over the portrait
          (above), where the drag actually happens. */}
      <span className="pointer-events-none flex shrink-0 items-center gap-2 px-6 pt-4 text-[0.62rem] text-accent uppercase tracking-[0.25em] sm:px-10 lg:hidden">
        <span aria-hidden="true" className="nudge-x">
          ↔
        </span>
        Drag to turn
      </span>

      <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 pb-20 sm:px-10 lg:min-h-screen lg:grid-cols-[1fr_0.9fr] lg:py-24 lg:pb-24">
        <div className="lg:order-1">
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            {site.roleLine}
          </p>
          <h1 className="mt-6 font-bold text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] tracking-[-0.05em]">
            <ScrambleText
              className="block"
              durationMs={1100}
              fade
              text="Aaron"
              waitForReveal
            />
            <span className="block">
              <ScrambleText
                durationMs={1500}
                fade
                startDelayMs={160}
                text="Metzelaar"
                waitForReveal
              />
              {/* low, terminal-style underscore caret — not a full-height bar */}
              <span aria-hidden="true" className="cursor-blink text-accent">
                _
              </span>
            </span>
          </h1>
          <p className="mt-8 max-w-md text-[1.05rem] text-muted-fg leading-relaxed">
            {site.tagline}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.7rem] uppercase tracking-[0.25em]">
            <span className="text-muted-fg">
              Interfaces · AI tooling · Design systems · {site.location}
            </span>
          </div>
        </div>
        <div aria-hidden="true" className="hidden lg:order-2 lg:block" />
      </div>

      <a
        className="pointer-events-auto absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-6xl items-center gap-2 px-6 text-[0.7rem] text-muted-fg uppercase tracking-[0.3em] sm:px-10"
        href="#about"
      >
        <span aria-hidden="true" className="h-px w-8 bg-current" />
        Scroll
      </a>
    </section>
  );
}
