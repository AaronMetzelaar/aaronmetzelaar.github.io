import { HeroPortrait } from "@/app/explore/headers/_hero-portrait";
import { ScrambleText } from "@/components/motion/scramble-text";
import { site } from "@/content/site";

/**
 * Dot-portrait hero — the page's one choreographed arrival. The name decodes
 * (ScrambleText fade) in lock-step with the portrait assembling from across the
 * canvas, so type and face resolve as a single event. Desktop: portrait
 * full-bleed behind the text on the right, drag to turn it. Mobile: a contained
 * band up top dissolving into white, text on clean canvas below.
 */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden font-terminal lg:block"
      id="top"
    >
      {/* portrait — mobile: a sized top band; desktop: full-bleed behind text. */}
      <div className="relative h-[44svh] w-full shrink-0 lg:absolute lg:inset-0 lg:h-auto">
        <HeroPortrait gateReveal />
        {/* dissolve the band's lower edge into the white canvas (mobile only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-bg lg:hidden"
        />
      </div>

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
            <span className="text-muted-fg">{site.location} · MWS — 3 yrs</span>
            {/* desktop-only: drag needs a pointer */}
            <span className="hidden items-center gap-2 text-accent lg:flex">
              <span aria-hidden="true">↳</span>
              Drag to turn
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
