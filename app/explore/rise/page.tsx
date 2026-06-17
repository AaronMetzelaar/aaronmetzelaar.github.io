import { MediaFrame } from "@/components/media/media-frame";
import { Reveal } from "@/components/motion/reveal";
import {
  about,
  aiWork,
  creativeWork,
  experience,
  experienceMeta,
  site,
  thesis,
  type WorkItem,
} from "@/content";
import { premiumTheme } from "@/lib/premium-theme";
import { DotGrid } from "../_shared/dot-grid";
import { HoloCard } from "../_shared/holo-card";
import { ClipReveal, LineDraw, MaskReveal } from "../_shared/kinetic";
import { LiftName } from "../_shared/names";
import { PageDots } from "../_shared/page-dots";
import { FilingsRule, PullLink } from "../_shared/pull-link";
import { TypedTagline } from "../_shared/typed-tagline";

/** A small, repeated section kicker — index + label on a hairline rhythm. */
function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-accent text-xs tracking-[0.1em]">{index}</span>
      <span className="text-muted-fg text-xs uppercase tracking-[0.32em]">
        {label}
      </span>
    </div>
  );
}

/** Tag chips shared by every work / project card. */
function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {tags.map((t) => (
        <li
          className="border border-border px-2.5 py-1 text-[0.68rem] text-muted-fg uppercase tracking-[0.14em]"
          key={t}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/** One holographic work card — title, summary, optional highlights, tags. */
function WorkCard({
  item,
  tone = "iridescent",
}: {
  item: WorkItem;
  tone?: "iridescent" | "blue";
}) {
  return (
    <HoloCard
      className="flex min-h-[20rem] flex-col p-8"
      tone={tone}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl leading-tight tracking-tight">
          {item.title}
        </h3>
        {item.period ? (
          <span className="shrink-0 text-muted-fg text-[0.68rem] uppercase tracking-[0.14em]">
            {item.period}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-muted-fg text-sm leading-relaxed">
        {item.summary}
      </p>
      {item.highlights ? (
        <ul className="mt-5 space-y-2 border-border border-t pt-5">
          {item.highlights.map((h) => (
            <li
              className="flex gap-3 text-fg/80 text-[0.82rem] leading-snug"
              key={h}
            >
              <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent" />
              {h}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto">
        <Tags tags={item.tags} />
      </div>
    </HoloCard>
  );
}

export default function RisePage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <PageDots />

      <div className="relative z-10">
        {/* ── Top status line ───────────────────────────────────────── */}
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 pt-8 sm:px-10">
          <span className="text-muted-fg text-xs uppercase tracking-[0.28em]">
            {site.location}
          </span>
          <span className="flex items-center gap-2.5 text-muted-fg text-xs uppercase tracking-[0.28em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for work
          </span>
        </header>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32 lg:grid-cols-[1.55fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-muted-fg text-xs uppercase tracking-[0.32em]">
              {site.roleLine}
            </p>
            <h1 className="mt-8 font-bold text-[clamp(2.75rem,9.5vw,7rem)] leading-[0.95] tracking-[-0.045em]">
              <LiftName />
            </h1>
            <TypedTagline
              className="mt-8 max-w-xl text-balance text-fg/85 text-lg leading-relaxed sm:text-xl"
              text="I build clean, fast interfaces — and the AI tooling that helps other developers build faster."
            />
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <PullLink arrow="↓" href="#work">
                See the work
              </PullLink>
              <PullLink arrow="↓" href="#ai">
                AI &amp; agentic
              </PullLink>
              <PullLink arrow="→" href="#contact">
                Get in touch
              </PullLink>
            </div>
          </div>

          {/* Portrait, rendered in the dot motif. */}
          <div className="lg:pb-2">
            <div className="relative">
              <MediaFrame
                aspect={4 / 5}
                className="w-full"
                label="Portrait"
                minimal
              />
              <DotGrid accent className="mix-blend-multiply" size={20} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border border-accent/15"
              />
            </div>
            <p className="mt-3 text-muted-fg text-[0.7rem] uppercase tracking-[0.24em]">
              {site.name} — in dots, for now
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <FilingsRule />
        </div>

        {/* ── About ─────────────────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="about"
        >
          <Eyebrow index="01" label="About" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-tight">
              <MaskReveal>Frontend developer with</MaskReveal>
              <MaskReveal delay={0.08}>
                <span className="text-accent">an agentic edge.</span>
              </MaskReveal>
            </h2>
            <div className="space-y-6">
              {about.map((p, i) => (
                <Reveal delay={i * 0.08} key={p}>
                  <p className="text-fg/85 text-lg leading-relaxed">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.16}>
                <div className="pt-2">
                  <PullLink arrow="↓" href="#contact">
                    Work with me
                  </PullLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Work ──────────────────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="work"
        >
          <Eyebrow index="02" label="Work" />
          <div className="mt-10">
            <h2 className="max-w-3xl font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-tight">
              <MaskReveal>Three years building</MaskReveal>
              <MaskReveal delay={0.08}>
                across the{" "}
                <a
                  className="text-accent underline decoration-accent/30 decoration-1 underline-offset-[6px] transition-colors hover:decoration-accent"
                  href={experienceMeta.companyUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {experienceMeta.company}
                </a>{" "}
                frontend.
              </MaskReveal>
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-muted-fg leading-relaxed">
                {experienceMeta.summary}
              </p>
            </Reveal>
          </div>

          <div className="mt-12">
            <LineDraw />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {experience.map((item, i) => (
              <Reveal delay={(i % 2) * 0.08} key={item.slug}>
                <WorkCard
                  item={item}
                  tone={i % 2 === 0 ? "iridescent" : "blue"}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Thesis ────────────────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="thesis"
        >
          <Eyebrow index="03" label="Thesis" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
            <div>
              <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.08] tracking-tight">
                <MaskReveal>{thesis.title}</MaskReveal>
              </h2>
              <Reveal delay={0.08}>
                <p className="mt-3 text-muted-fg text-xs uppercase tracking-[0.2em]">
                  {thesis.period} · {thesis.org}
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-6 max-w-xl text-fg/85 leading-relaxed">
                  {thesis.summary}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <PullLink
                    arrow="↗"
                    href={thesis.href ?? "#"}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Read the thesis (PDF)
                  </PullLink>
                  <PullLink
                    arrow="↗"
                    href={thesis.repo ?? "#"}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Framework on GitHub
                  </PullLink>
                </div>
              </Reveal>
            </div>

            <ClipReveal>
              <HoloCard className="flex h-full min-h-[18rem] flex-col p-8" tone="iridescent">
                <span className="text-muted-fg text-xs uppercase tracking-[0.24em]">
                  What it does
                </span>
                <ul className="mt-6 space-y-4">
                  {thesis.highlights?.map((h) => (
                    <li
                      className="flex gap-3 text-fg/85 leading-snug"
                      key={h}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Tags tags={thesis.tags} />
                </div>
              </HoloCard>
            </ClipReveal>
          </div>
        </section>

        {/* ── AI & Agentic ──────────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="ai"
        >
          <Eyebrow index="04" label="AI & Agentic" />
          <div className="mt-10">
            <h2 className="max-w-3xl font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-tight">
              <MaskReveal>One layer up —</MaskReveal>
              <MaskReveal delay={0.08}>
                <span className="text-accent">building the tools</span> other
                developers build with.
              </MaskReveal>
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-muted-fg leading-relaxed">
                Most of my time now goes into agentic engineering — designing the
                architecture and guardrails, then authoring the skills, hooks, and
                multi-agent workflows that make day-to-day development faster.
                Mostly in Claude Code and MCP.
              </p>
            </Reveal>
          </div>

          <div className="mt-12">
            <LineDraw />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {aiWork.map((item, i) => (
              <Reveal delay={i * 0.08} key={item.slug}>
                <WorkCard item={item} tone="blue" />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Creative ──────────────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="creative"
        >
          <Eyebrow index="05" label="Creative" />
          <h2 className="mt-10 max-w-3xl font-display text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.02] tracking-tight">
            <MaskReveal>{site.beyondLine}</MaskReveal>
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-muted-fg leading-relaxed">
              Before the code, there was a camera and a poster board. I made promo
              videos, print, and social campaigns for my student association — the
              visual instinct that still shows up in everything I ship.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {creativeWork.map((item, i) => (
              <Reveal delay={i * 0.08} key={item.slug}>
                <WorkCard
                  item={item}
                  tone={i % 2 === 0 ? "iridescent" : "blue"}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-40"
          id="contact"
        >
          <Eyebrow index="06" label="Contact" />
          <div className="mt-10">
            <h2 className="font-display text-[clamp(2.25rem,7vw,5rem)] leading-[0.98] tracking-[-0.03em]">
              <MaskReveal>Let&apos;s build</MaskReveal>
              <MaskReveal delay={0.08}>
                something <span className="text-accent">clean.</span>
              </MaskReveal>
            </h2>
            <Reveal delay={0.14}>
              <p className="mt-8 max-w-xl text-fg/85 text-lg leading-relaxed">
                Open to frontend and agentic-engineering work. The fastest way to
                reach me is email — I read everything.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-12 flex flex-col gap-6 border-border border-t pt-10 sm:flex-row sm:items-center sm:justify-between">
                <PullLink
                  arrow="→"
                  className="text-xl tracking-tight sm:text-2xl"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </PullLink>
                <PullLink
                  arrow="↗"
                  href={site.socials.github}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub / {site.socials.githubHandle}
                </PullLink>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="mx-auto max-w-6xl px-6 pb-16 sm:px-10">
          <FilingsRule className="mb-8" />
          <div className="flex flex-col gap-2 text-muted-fg text-xs uppercase tracking-[0.24em] sm:flex-row sm:items-center sm:justify-between">
            <span>
              {site.name} — {site.role}
            </span>
            <span>{site.location}</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
