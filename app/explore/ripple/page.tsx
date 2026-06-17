import {
  about,
  aiWork,
  creativeWork,
  experience,
  experienceMeta,
  site,
  thesis,
} from "@/content";
import { MediaFrame } from "@/components/media/media-frame";
import { Reveal } from "@/components/motion/reveal";
import { premiumTheme } from "@/lib/premium-theme";
import { DotGrid } from "../_shared/dot-grid";
import { HoloCard } from "../_shared/holo-card";
import { ClipReveal, MaskReveal } from "../_shared/kinetic";
import { RippleName } from "../_shared/names";
import { PageDots } from "../_shared/page-dots";
import { FilingsRule, PullLink } from "../_shared/pull-link";
import { TypedTagline } from "../_shared/typed-tagline";
import {
  Bob,
  FloatIn,
  RippleEyebrow,
  Ripples,
  WaveRule,
} from "./_ripple-motion";

const HERO_LINKS = [
  { label: "Work", href: "#work" },
  { label: "AI & agentic", href: "#ai" },
  { label: "Creative", href: "#creative" },
  { label: "Say hello", href: "#contact" },
];

export default function RipplePage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <PageDots />

      <div className="relative z-10">
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-28 pb-24 sm:px-10 sm:pt-36 sm:pb-32">
          <Reveal>
            <p className="flex items-center gap-3 text-[0.7rem] text-muted-fg uppercase tracking-[0.34em]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {site.role} · {site.location}
            </p>
          </Reveal>

          <h1 className="mt-10 font-bold text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] tracking-[-0.045em]">
            <RippleName />
          </h1>

          {/* Tagline drifts in below the name, offset to the right — the wave
              spreading outward into open water. */}
          <div className="mt-12 grid gap-y-10 sm:grid-cols-12">
            <div className="sm:col-span-10 sm:col-start-3 lg:col-span-7 lg:col-start-4">
              <TypedTagline
                className="max-w-2xl font-grotesk text-[clamp(1.05rem,2.4vw,1.5rem)] text-muted-fg leading-relaxed"
                text="I build clean, fast interfaces — then drift one layer up, into the AI and agentic tooling that lets other developers move quicker."
              />

              {/* A line of dots that lifts toward the cursor — the surface
                  catching the wave as it spreads. */}
              <FilingsRule className="mt-12 max-w-md" count={40} />

              <nav className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-5">
                {HERO_LINKS.map((l, i) => (
                  <PullLink
                    arrow={i === HERO_LINKS.length - 1 ? "→" : "↓"}
                    href={l.href}
                    key={l.href}
                  >
                    {l.label}
                  </PullLink>
                ))}
              </nav>
            </div>
          </div>
        </section>

        {/* ───────────────────────── ABOUT ───────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28" id="about">
          <FloatIn>
            <RippleEyebrow index="01" label="About" />
          </FloatIn>

          {/* Asymmetric: portrait drifts left, words pool to the right. */}
          <div className="mt-12 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 lg:col-start-1">
              <FloatIn delay={0.05}>
                <Bob amount={6} duration={7}>
                  <div className="relative">
                    <MediaFrame
                      aspect={4 / 5}
                      className="w-full"
                      label="Portrait"
                      minimal
                    />
                    {/* The portrait, rendered in the dot motif. */}
                    <DotGrid accent className="mix-blend-multiply" opacity={0.16} size={20} />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 border border-accent/15"
                    />
                  </div>
                </Bob>
                <p className="mt-4 text-[0.65rem] text-muted-fg uppercase tracking-[0.28em]">
                  {site.name} — in dots
                </p>
              </FloatIn>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-6 font-grotesk text-[clamp(1.15rem,2.2vw,1.6rem)] leading-relaxed">
                {about.map((line, i) => (
                  <FloatIn delay={0.1 + i * 0.08} key={line}>
                    <p className={i === 0 ? "text-fg" : "text-muted-fg"}>
                      {line}
                    </p>
                  </FloatIn>
                ))}
              </div>

              <FloatIn className="mt-10" delay={0.3}>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <PullLink
                    arrow="↗"
                    href={site.socials.github}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {site.socials.githubHandle}
                  </PullLink>
                  <PullLink arrow="→" href="#contact">
                    {site.email}
                  </PullLink>
                </div>
              </FloatIn>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <WaveRule />
        </div>

        {/* ───────────────────────── WORK ───────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28" id="work">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <FloatIn>
                <RippleEyebrow index="02" label="Work" />
              </FloatIn>
              <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.03em]">
                <MaskReveal>Three years across</MaskReveal>
                <MaskReveal delay={0.08}>
                  the whole <span className="text-accent">{experienceMeta.company}</span> frontend.
                </MaskReveal>
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <FloatIn delay={0.15}>
                <p className="font-grotesk text-muted-fg leading-relaxed">
                  {experienceMeta.summary}
                </p>
                <p className="mt-4 text-[0.7rem] text-muted-fg uppercase tracking-[0.28em]">
                  {experienceMeta.role} · {experienceMeta.period}
                </p>
              </FloatIn>
            </div>
          </div>

          {/* Staggered, breathing column flow — cards offset to echo a ripple. */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {experience.map((item, i) => (
              <FloatIn
                className={i % 2 === 1 ? "sm:mt-12" : ""}
                delay={i * 0.06}
                key={item.slug}
              >
                <HoloCard
                  className="flex min-h-[20rem] flex-col p-7 sm:p-8"
                  tone={i % 2 === 0 ? "iridescent" : "blue"}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-accent text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-grotesk text-[0.65rem] text-muted-fg uppercase tracking-[0.2em]">
                      {item.period}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 flex-1 font-grotesk text-muted-fg text-sm leading-relaxed">
                    {item.summary}
                  </p>
                  <Ripples className="mt-6" items={item.tags} />
                </HoloCard>
              </FloatIn>
            ))}
          </div>
        </section>

        {/* ───────────────────────── THESIS ───────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28" id="thesis">
          <FloatIn>
            <RippleEyebrow index="03" label="Thesis" />
          </FloatIn>

          <div className="mt-12">
            <ClipReveal>
              <HoloCard className="p-8 sm:p-12" tone="blue">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                  <div className="lg:col-span-7">
                    <p className="font-grotesk text-[0.7rem] text-muted-fg uppercase tracking-[0.28em]">
                      {thesis.period}
                    </p>
                    <h3 className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.05] tracking-[-0.02em]">
                      {thesis.title}
                    </h3>
                    <p className="mt-6 max-w-xl font-grotesk text-muted-fg leading-relaxed">
                      {thesis.summary}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                      <PullLink
                        arrow="↗"
                        href={thesis.repo ?? site.socials.github}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Framework repo
                      </PullLink>
                      <PullLink
                        arrow="↗"
                        href={thesis.href ?? "#"}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Read the thesis (PDF)
                      </PullLink>
                    </div>
                  </div>

                  <ul className="space-y-4 lg:col-span-4 lg:col-start-9">
                    {thesis.highlights?.map((h) => (
                      <li
                        className="flex gap-3 font-grotesk text-muted-fg text-sm leading-relaxed"
                        key={h}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </HoloCard>
            </ClipReveal>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <WaveRule />
        </div>

        {/* ───────────────────────── AI & AGENTIC ───────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28" id="ai">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <FloatIn>
                <RippleEyebrow index="04" label="AI & agentic" />
              </FloatIn>
              <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.03em]">
                <MaskReveal>The layer above</MaskReveal>
                <MaskReveal delay={0.08}>
                  the <span className="text-accent">interface</span>.
                </MaskReveal>
              </h2>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <FloatIn delay={0.15}>
                <p className="font-grotesk text-muted-fg text-sm leading-relaxed">
                  Architecture, guardrails, and tooling for building with
                  Claude Code and MCP — so a team&rsquo;s agents move fast and
                  stay reviewable.
                </p>
              </FloatIn>
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {aiWork.map((item, i) => (
              <FloatIn
                className={i === 1 ? "lg:mt-14" : i === 2 ? "lg:mt-7" : ""}
                delay={i * 0.07}
                key={item.slug}
              >
                <HoloCard
                  className="flex min-h-[20rem] flex-col p-7 sm:p-8"
                  tone="iridescent"
                >
                  <span className="text-accent text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 font-display text-xl leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 flex-1 font-grotesk text-muted-fg text-sm leading-relaxed">
                    {item.summary}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {item.highlights?.map((h) => (
                      <li
                        className="flex gap-2.5 font-grotesk text-muted-fg text-xs leading-relaxed"
                        key={h}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Ripples className="mt-6" items={item.tags} />
                </HoloCard>
              </FloatIn>
            ))}
          </div>
        </section>

        {/* ───────────────────────── CREATIVE ───────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28" id="creative">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <FloatIn>
                <RippleEyebrow index="05" label="Creative" />
              </FloatIn>
              <h2 className="mt-6 font-display text-[clamp(1.9rem,4.4vw,3rem)] italic leading-[1.05] tracking-[-0.02em]">
                {site.beyondLine}
              </h2>
              <FloatIn delay={0.12}>
                <p className="mt-6 max-w-md font-grotesk text-muted-fg leading-relaxed">
                  Before the code, there was a camera and a stack of posters.
                  Work I made for my student association — and the reason I
                  still care how a thing looks, not just how it runs.
                </p>
              </FloatIn>
            </div>

            <div className="space-y-6 lg:col-span-6 lg:col-start-7">
              {creativeWork.map((item, i) => (
                <FloatIn delay={i * 0.08} key={item.slug}>
                  <HoloCard className="p-6 sm:p-7" tone="iridescent">
                    <div className="flex items-baseline gap-5">
                      <span className="text-accent text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-lg leading-tight tracking-tight">
                          {item.title}
                        </h3>
                        <p className="mt-2 font-grotesk text-muted-fg text-sm leading-relaxed">
                          {item.summary}
                        </p>
                        <Ripples className="mt-4" items={item.tags} />
                      </div>
                    </div>
                  </HoloCard>
                </FloatIn>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── CONTACT ───────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-36"
          id="contact"
        >
          <FloatIn>
            <RippleEyebrow index="06" label="Contact" />
          </FloatIn>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.98] tracking-[-0.035em]">
                <MaskReveal>Let&rsquo;s make</MaskReveal>
                <MaskReveal delay={0.08}>
                  some <span className="text-accent">waves</span>.
                </MaskReveal>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <FloatIn delay={0.15}>
                <p className="font-grotesk text-muted-fg leading-relaxed">
                  Frontend, agentic tooling, or something in between — if it
                  sounds interesting, I&rsquo;d love to hear about it.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  <PullLink
                    arrow="→"
                    className="text-base"
                    href={`mailto:${site.email}`}
                  >
                    {site.email}
                  </PullLink>
                  <PullLink
                    arrow="↗"
                    className="text-base"
                    href={site.socials.github}
                    rel="noreferrer"
                    target="_blank"
                  >
                    github.com/{site.socials.githubHandle}
                  </PullLink>
                </div>
              </FloatIn>
            </div>
          </div>

          <div className="mt-20">
            <WaveRule />
            <p className="mt-6 text-[0.7rem] text-muted-fg uppercase tracking-[0.28em]">
              {site.roleLine} — {site.location}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
