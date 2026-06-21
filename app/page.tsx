import { PageDots } from "@/app/explore/_shared/page-dots";
import { FilingsRule, PullLink } from "@/app/explore/_shared/pull-link";
import { Reveal } from "@/components/motion/reveal";
import { ArchitectureMap } from "@/components/site/architecture-map";
import { CreativeShowcase } from "@/components/site/creative-showcase";
import { Hero } from "@/components/site/hero";
import { Preloader } from "@/components/site/preloader";
import { SectionHeader } from "@/components/site/section-header";
import { SiteNav } from "@/components/site/site-nav";
import { WorkGallery } from "@/components/site/work-gallery";
import {
  about,
  creativeWork,
  experience,
  experienceMeta,
  site,
  thesis,
  trajectory,
} from "@/content";
import { layers } from "@/content/architecture";
import { premiumTheme } from "@/lib/premium-theme";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <main
      className="relative isolate bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <Preloader />
      <SiteNav />
      {/* static ambient dot grid — the page's fine-dot texture, behind everything */}
      <PageDots />

      <div className="relative z-10">
        <Hero />

        {/* 01 — About */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="about"
        >
          <SectionHeader
            index="01"
            kicker="Profile"
            note="Frontend × AI · Netherlands"
            title="About"
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Reveal>
              <p className="text-pretty text-[clamp(1.25rem,2.2vw,1.6rem)] leading-[1.45] tracking-[-0.01em]">
                {about[0]}
              </p>
              <p className="mt-6 max-w-xl text-muted-fg leading-relaxed">
                {about[1]}
              </p>
            </Reveal>
            {/* the trajectory as a vertical ledger — each rung a step up in
                leverage, a deliberate counter-shape to the AI section's grid */}
            <Reveal delay={0.1}>
              <p className="text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
                <span aria-hidden="true" className="text-accent">
                  ↑
                </span>{" "}
                Interface to system
              </p>
              <ol className="mt-7 border-border border-l">
                {trajectory.map((t, i) => (
                  <li className="relative pb-8 pl-7 last:pb-0" key={t.k}>
                    <span
                      aria-hidden="true"
                      className="-translate-x-1/2 absolute top-[0.45rem] left-0 h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    <p className="text-sm uppercase tracking-[0.2em]">
                      <span className="text-accent tabular-nums">
                        {pad(i + 1)}
                      </span>
                      <span className="ml-3">{t.k}</span>
                    </p>
                    <p className="mt-2 max-w-sm text-muted-fg text-sm leading-relaxed">
                      {t.v}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* 02 — Work */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="work"
        >
          <SectionHeader
            hint="Hover an image to bring it forward"
            index="02"
            kicker="At MWS"
            note={`${experienceMeta.role} · ${experienceMeta.period}`}
            title="Selected work"
          />
          <Reveal>
            <div className="mt-10 flex flex-col gap-5 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
              <p className="max-w-2xl text-muted-fg leading-relaxed">
                {experienceMeta.summary}
              </p>
              <PullLink
                arrow="↗"
                href={experienceMeta.companyUrl}
                rel="noreferrer"
                target="_blank"
              >
                mws.com
              </PullLink>
            </div>
          </Reveal>
          <div className="mt-10">
            <WorkGallery items={experience} />
          </div>
        </section>

        {/* 03 — AI & Agentic */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="ai"
        >
          <SectionHeader
            index="03"
            kicker="AI · Agentic"
            lead="The interface is the easy part. The real value is the system a team's AI agents run inside: the context, skills, reviewers, and hooks that keep agentic development reliable instead of chaotic."
            note="One layer up"
            title="Harness engineering"
          />
          <Reveal className="mt-10">
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {layers.map((l, i) => (
                <div key={l.id}>
                  <p className="text-[0.7rem] uppercase tracking-[0.25em]">
                    <span className="text-accent tabular-nums">
                      {pad(i + 1)}
                    </span>
                    <span className="ml-3">{l.label}</span>
                  </p>
                  <p className="mt-3 text-muted-fg text-sm leading-relaxed">
                    {l.blurb}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-14">
            <p className="mb-6 flex items-center gap-2 text-[0.7rem] text-accent uppercase tracking-[0.25em]">
              <span aria-hidden="true">↳</span>
              Hover a node to trace its connections
            </p>
            <ArchitectureMap />
          </Reveal>
        </section>

        {/* 04 — Thesis */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="thesis"
        >
          <SectionHeader
            density="record"
            index="04"
            kicker="Research"
            meta={[
              { k: "Programme", v: "BSc Computer Science" },
              { k: "Institution", v: thesis.org ?? "" },
              { k: "Year", v: "2024" },
              { k: "Stack", v: "Unity · C# · CV" },
            ]}
            note="Filed 2024"
            title={thesis.title}
          />
          <Reveal>
            <article className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <p className="max-w-xl text-muted-fg leading-relaxed">
                  {thesis.summary}
                </p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {thesis.href ? (
                    <PullLink
                      arrow="↗"
                      href={thesis.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Read the thesis
                    </PullLink>
                  ) : null}
                  {thesis.repo ? (
                    <PullLink
                      arrow="↗"
                      href={thesis.repo}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Framework on GitHub
                    </PullLink>
                  ) : null}
                </div>
              </div>
              <ol className="space-y-4 lg:pt-1">
                {thesis.highlights?.map((h, i) => (
                  <li className="flex gap-4 text-sm leading-snug" key={h}>
                    <span className="text-accent text-xs tabular-nums">
                      {pad(i + 1)}
                    </span>
                    <span className="text-fg/80">{h}</span>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        </section>

        {/* 05 — Creative */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="creative"
        >
          <CreativeShowcase items={creativeWork} />
        </section>

        {/* Contact */}
        <section
          className="mx-auto max-w-6xl px-6 pt-24 pb-16 sm:px-10 sm:pt-32"
          id="contact"
        >
          <FilingsRule className="mb-12" count={56} />
          <Reveal>
            <p className="text-[0.7rem] text-accent uppercase tracking-[0.3em]">
              Contact
            </p>
            <h2 className="mt-6 text-[clamp(2.25rem,7vw,5rem)] leading-[0.92] tracking-[-0.04em]">
              Get in touch.
            </h2>
            <p className="mt-7 max-w-md font-display text-[clamp(1.1rem,2.1vw,1.45rem)] text-muted-fg italic leading-relaxed">
              Open to frontend, AI, and design-engineering roles, plus the odd
              interesting build on the side.
            </p>
            <div className="mt-12 flex flex-col gap-7">
              <div>
                <p className="mb-1.5 text-[0.6rem] text-muted-fg uppercase tracking-[0.25em]">
                  Write
                </p>
                <PullLink
                  arrow="↗"
                  className="text-[clamp(1rem,5vw,1.875rem)] tracking-[-0.01em]"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </PullLink>
              </div>
              <div>
                <p className="mb-1.5 text-[0.6rem] text-muted-fg uppercase tracking-[0.25em]">
                  Code
                </p>
                <PullLink
                  arrow="↗"
                  className="text-[clamp(1rem,5vw,1.875rem)] tracking-[-0.01em]"
                  href={site.socials.github}
                  rel="noreferrer"
                  target="_blank"
                >
                  github.com/{site.socials.githubHandle}
                </PullLink>
              </div>
            </div>
            <div className="mt-12">
              <PullLink arrow="→" href="/cv">
                Prefer the short version? Read the CV
              </PullLink>
            </div>
          </Reveal>
        </section>

        <footer className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 pb-12 sm:px-10">
          <span className="text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
            {site.name}
          </span>
          <span className="text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
            {site.location} · ©2026
          </span>
        </footer>
      </div>
    </main>
  );
}
