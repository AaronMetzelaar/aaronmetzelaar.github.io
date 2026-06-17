import { HeroPortrait } from "@/app/explore/headers/_hero-portrait";
import { ScrambleText } from "@/components/motion/scramble-text";
import { site } from "@/content/site";

/**
 * Dot-portrait hero. On desktop the portrait is full-bleed behind the text on
 * the right and reacts to the cursor. On mobile it becomes a contained band up
 * top that dissolves into the white canvas, with the name + tagline on clean
 * white below — so text never sits on portrait pixels. One rich visual moment;
 * the rest of the page stays quiet by comparison.
 */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden font-terminal lg:block"
      id="top"
    >
      {/* portrait — mobile: a sized top band; desktop: full-bleed behind text. */}
      <div className="relative h-[44svh] w-full shrink-0 lg:absolute lg:inset-0 lg:h-auto">
        <HeroPortrait />
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
            <ScrambleText className="block" durationMs={650} text="Aaron" />
            <ScrambleText
              className="block"
              durationMs={950}
              startDelayMs={140}
              text="Metzelaar"
            />
          </h1>
          <p className="mt-8 max-w-md text-muted-fg leading-relaxed">
            {site.tagline}
          </p>
          {/* desktop-only: a literal lie on touch (no cursor) */}
          <p className="mt-10 hidden items-center gap-2 text-[0.7rem] text-accent uppercase tracking-[0.3em] lg:flex">
            <span aria-hidden="true">↳</span>
            Sweep the cursor — the dots scatter
          </p>
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
