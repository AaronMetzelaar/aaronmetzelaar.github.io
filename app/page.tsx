import { PageDots } from "@/app/explore/_shared/page-dots";
import { FilingsRule, PullLink } from "@/app/explore/_shared/pull-link";
import { Reveal } from "@/components/motion/reveal";
import { ArchitectureMap } from "@/components/site/architecture-map";
import { Hero } from "@/components/site/hero";
import { MiniCard } from "@/components/site/mini-card";
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
} from "@/content";
import { premiumTheme } from "@/lib/premium-theme";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <main
      className="relative isolate bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
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
            note="Frontend × AI — Netherlands"
            title="About"
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal>
              <p className="text-pretty text-[clamp(1.25rem,2.2vw,1.6rem)] leading-[1.45] tracking-[-0.01em]">
                {about[0]}
              </p>
              <p className="mt-6 max-w-xl text-muted-fg leading-relaxed">
                {about[1]}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="lg:pl-8">
                <blockquote className="font-display text-[clamp(1.5rem,3vw,2.1rem)] italic leading-[1.25] tracking-[-0.01em]">
                  “I kept following the work one layer up — from the interface
                  to the system the team builds it with.”
                </blockquote>
                <figcaption className="mt-6 text-[0.7rem] text-muted-fg uppercase tracking-[0.2em]">
                  {site.location} · {site.role}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* 02 — Work */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="work"
        >
          <SectionHeader
            index="02"
            kicker="Selected work"
            note={`${experienceMeta.role} · ${experienceMeta.period}`}
            title="Work at MWS"
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
                matchwornshirt.com
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
            kicker="One layer up"
            note="Anatomy of an AI dev workflow"
            title="AI & Agentic"
          />
          <Reveal>
            <p className="mt-10 max-w-2xl text-muted-fg leading-relaxed">
              Most of my work now is one layer up — designing the system the
              team builds with: the context that grounds every agent, the skills
              that run the work, the reviewers, and the hooks that fire on their
              own. Read it across the development lifecycle; hover or tap any
              node for detail.
            </p>
          </Reveal>
          <Reveal className="mt-14">
            <ArchitectureMap />
          </Reveal>
        </section>

        {/* 04 — Thesis */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="thesis"
        >
          <SectionHeader
            index="04"
            kicker="Research"
            note={thesis.period}
            title="Thesis"
          />
          <Reveal>
            <article className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] tracking-[-0.02em]">
                  {thesis.title}
                </h3>
                <p className="mt-6 max-w-xl text-muted-fg leading-relaxed">
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
              <div className="lg:pt-2">
                <ul className="space-y-4 border-border border-t pt-6">
                  {thesis.highlights?.map((h) => (
                    <li className="flex gap-3 text-sm leading-snug" key={h}>
                      <span
                        aria-hidden="true"
                        className="mt-2 h-px w-3 shrink-0 bg-accent"
                      />
                      <span className="text-fg/80">{h}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
                  {thesis.tags.map((t) => (
                    <li
                      className="text-[0.68rem] text-muted-fg uppercase tracking-[0.18em]"
                      key={t}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </section>

        {/* 05 — Creative */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="creative"
        >
          <SectionHeader
            index="05"
            kicker="Beyond code"
            note="Video, design, social"
            title="Creative"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {creativeWork.map((item, i) => (
              <MiniCard
                delay={i * 0.08}
                index={pad(i + 1)}
                item={item}
                key={item.slug}
              />
            ))}
          </div>
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
              <span className="block">Let&apos;s build</span>
              <span className="block">something sharp.</span>
            </h2>
            <div className="mt-12 flex flex-col gap-5">
              <PullLink
                arrow="↗"
                className="text-[clamp(1rem,5vw,1.875rem)] tracking-[-0.01em]"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </PullLink>
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
          </Reveal>
        </section>

        <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 pb-12 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
            {site.name}
          </span>
          <span className="text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
            {site.roleLine}
          </span>
        </footer>
      </div>
    </main>
  );
}
