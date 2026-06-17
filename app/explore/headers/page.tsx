import { premiumTheme } from "@/lib/premium-theme";
import { HeroPortrait } from "./_hero-portrait";

export default function HeadersGallery() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      {/* full-bleed dot portrait — dots fly in from across the page */}
      <HeroPortrait />

      {/* text overlay (pass pointer through to the canvas) */}
      <div className="pointer-events-none relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
        <div className="order-2 lg:order-1">
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            Frontend developer — AI / Agentic
          </p>
          <h1 className="mt-6 font-bold text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] tracking-[-0.05em]">
            <span className="block">Aaron</span>
            <span className="block">Metzelaar</span>
          </h1>
          <p className="mt-8 max-w-md text-muted-fg leading-relaxed">
            Clean, fast interfaces — and the AI tooling that ships them.
          </p>
          <p className="mt-10 flex items-center gap-2 text-[0.7rem] text-accent uppercase tracking-[0.3em]">
            <span aria-hidden="true">↳</span>
            Sweep the cursor — the dots scatter
          </p>
        </div>
        <div aria-hidden="true" className="order-1 lg:order-2" />
      </div>

      <p className="pointer-events-none absolute right-5 bottom-5 max-w-[16rem] text-right text-[0.64rem] text-muted-fg leading-relaxed">
        A halftone dot portrait — one photo and its depth map, tone drawn in dot
        size. It assembles from across the page; sweep the cursor to scatter it.
      </p>
    </main>
  );
}
