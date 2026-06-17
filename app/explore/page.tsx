import Link from "next/link";
import { site } from "@/content/site";
import { premiumTheme } from "@/lib/premium-theme";
import { PageDots } from "./_shared/page-dots";

const VARIANTS = [
  {
    slug: "rise",
    name: "Rise",
    blurb: "Letters lift + tint as the cursor nears. The clean editorial baseline.",
  },
  {
    slug: "drift",
    name: "Drift",
    blurb: "Letters lean toward the cursor; the links you liked, everywhere. Lively, asymmetric.",
  },
  {
    slug: "flux",
    name: "Flux",
    blurb: "The name (and headings) are dots that scatter from the cursor. Refined, dot-forward.",
  },
  {
    slug: "ripple",
    name: "Ripple",
    blurb: "A wave runs through the letters from the cursor. Organic and fluid.",
  },
  {
    slug: "echo",
    name: "Echo",
    blurb: "The name casts blue echoes that spread with the cursor. Dimensional, layered.",
  },
];

export default function ExploreIndex() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <PageDots />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16 sm:px-10 sm:py-24">
        <header>
          <p className="text-muted-fg text-xs uppercase tracking-[0.35em]">
            {site.name} — Portfolio
          </p>
          <h1 className="mt-6 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] tracking-tight">
            Five cuts<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-fg leading-relaxed">
            One blue dot field follows your cursor across each page. The
            description types itself in; the links pull toward you. Each cut
            gives the name its own reaction — move your cursor over it, and over
            the cards.
          </p>
        </header>

        <ul className="mt-16 border-border border-t">
          {VARIANTS.map((v, i) => (
            <li key={v.slug}>
              <Link
                className="group grid items-baseline gap-2 border-border border-b py-7 sm:grid-cols-[auto_1fr_auto] sm:gap-8"
                href={`/explore/${v.slug}`}
              >
                <span className="text-accent text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                    {v.name}
                  </h2>
                  <p className="mt-1 text-muted-fg text-sm">{v.blurb}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="text-accent opacity-0 transition-opacity group-hover:opacity-100 sm:text-right"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          className="group mt-10 inline-flex items-center gap-3 text-sm text-muted-fg transition-colors hover:text-fg"
          href="/explore/headers"
        >
          <span className="text-[0.7rem] text-accent uppercase tracking-[0.3em]">
            New
          </span>
          <span className="relative">
            Header studies — 10 interactive headers
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
            />
          </span>
          <span aria-hidden="true" className="text-accent">
            →
          </span>
        </Link>

        <Link
          className="group mt-3 inline-flex items-center gap-3 text-sm text-muted-fg transition-colors hover:text-fg"
          href="/explore/cv"
        >
          <span className="text-[0.7rem] text-accent uppercase tracking-[0.3em]">
            Also
          </span>
          <span className="relative">
            The overview — a quick CV
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
            />
          </span>
          <span aria-hidden="true" className="text-accent">
            →
          </span>
        </Link>

        <footer className="mt-auto pt-16 text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
          {site.roleLine}
        </footer>
      </div>
    </main>
  );
}
