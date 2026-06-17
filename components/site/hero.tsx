import { HeroPortrait } from "@/app/explore/headers/_hero-portrait";
import { ScrambleText } from "@/components/motion/scramble-text";
import { site } from "@/content/site";

/**
 * Full-bleed dot-portrait hero. The portrait assembles from across the page and
 * sits on the right; the name and role sit left. One rich visual moment — the
 * rest of the page stays quiet by comparison.
 */
export function Hero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden font-terminal"
      id="top"
    >
      <HeroPortrait />

      <div className="pointer-events-none relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="order-2 lg:order-1">
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
          <p className="mt-10 flex items-center gap-2 text-[0.7rem] text-accent uppercase tracking-[0.3em]">
            <span aria-hidden="true">↳</span>
            Sweep the cursor — the dots scatter
          </p>
        </div>
        <div aria-hidden="true" className="order-1 lg:order-2" />
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
