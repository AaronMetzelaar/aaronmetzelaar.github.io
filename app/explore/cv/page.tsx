import type { ReactNode } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import {
  about,
  aiWork,
  creativeWork,
  experience,
  experienceMeta,
  site,
  thesis,
} from "@/content";
import { premiumTheme } from "@/lib/premium-theme";
import { DotGrid } from "../_shared/dot-grid";
import { TraceName } from "../_shared/names";
import { PageDots } from "../_shared/page-dots";
import { PullLink } from "../_shared/pull-link";

const SKILLS = [
  "Nuxt 3",
  "Vue 3",
  "React",
  "React Native",
  "TypeScript",
  "Agentic AI",
  "Design systems",
];

export default function CvPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <PageDots />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-10 sm:py-20">
        {/* Masthead */}
        <header className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-accent text-xs uppercase tracking-[0.3em]">
              Curriculum vitae
            </p>
            <h1 className="mt-5 font-bold text-[clamp(1.75rem,5vw,3rem)] leading-[1.05] tracking-[-0.03em]">
              <TraceName />
            </h1>
            <p className="mt-4 max-w-lg text-muted-fg text-sm leading-relaxed">
              Frontend developer with an AI / agentic engineering edge, based in
              the {site.location}. I build clean, fast interfaces — and the
              tooling that helps other developers build faster.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <PullLink arrow="→" href={`mailto:${site.email}`}>
                {site.email}
              </PullLink>
              <PullLink
                arrow="↗"
                href={site.socials.github}
                rel="noreferrer"
                target="_blank"
              >
                github.com/{site.socials.githubHandle}
              </PullLink>
            </div>
          </div>
          <figure className="relative w-32 overflow-hidden border border-border sm:w-36">
            <MediaFrame aspect={1} label="Portrait" minimal />
            <DotGrid accent opacity={0.18} />
          </figure>
        </header>

        {/* Experience */}
        <Row label="Experience">
          <p className="text-muted-fg text-xs uppercase tracking-[0.2em]">
            {experienceMeta.company} · {experienceMeta.period}
          </p>
          <ul className="mt-5 space-y-5">
            {experience.map((item) => (
              <li key={item.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-base tracking-tight">{item.title}</h3>
                  <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1.5 max-w-2xl text-muted-fg text-sm leading-relaxed">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>
        </Row>

        {/* Education / Thesis */}
        <Row label="Education">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-base tracking-tight">{site.education.degree}</h3>
            <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
              {site.education.school} · {site.education.year}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-muted-fg text-sm leading-relaxed">
            Thesis — <span className="text-fg">{thesis.title}</span>:{" "}
            {thesis.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
            {thesis.repo ? (
              <PullLink
                arrow="↗"
                href={thesis.repo}
                rel="noreferrer"
                target="_blank"
              >
                Framework repo
              </PullLink>
            ) : null}
            {thesis.href ? (
              <PullLink
                arrow="↗"
                href={thesis.href}
                rel="noreferrer"
                target="_blank"
              >
                Thesis (PDF)
              </PullLink>
            ) : null}
          </div>
        </Row>

        {/* AI & Agentic */}
        <Row label="AI & Agentic">
          <ul className="space-y-4">
            {aiWork.map((item) => (
              <li key={item.slug}>
                <h3 className="text-base tracking-tight">{item.title}</h3>
                <p className="mt-1 max-w-2xl text-muted-fg text-sm leading-relaxed">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>
        </Row>

        {/* Creative */}
        <Row label="Creative">
          <p className="font-display text-lg italic leading-snug">
            {site.beyondLine}
          </p>
          <p className="mt-3 max-w-2xl text-muted-fg text-sm leading-relaxed">
            {creativeWork.map((c) => c.title).join(" · ")} — promotional work for
            my student association.
          </p>
        </Row>

        {/* Skills */}
        <Row label="Stack">
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span
                className="border border-border px-3 py-1 text-[0.7rem] text-muted-fg uppercase tracking-[0.16em]"
                key={s}
              >
                {s}
              </span>
            ))}
          </div>
        </Row>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-border border-t pt-6 text-[0.7rem] text-muted-fg uppercase tracking-[0.22em]">
          <span>{site.roleLine}</span>
          <PullLink arrow="→" href="/explore">
            Explore the interactive site
          </PullLink>
        </footer>
      </div>
    </main>
  );
}

/** A hairline-ruled CV row: a left label gutter + content. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-12 grid gap-x-8 gap-y-4 border-border border-t pt-8 sm:grid-cols-[8rem_1fr]">
      <h2 className="text-[0.7rem] text-muted-fg uppercase tracking-[0.28em]">
        {label}
      </h2>
      <div>{children}</div>
    </section>
  );
}
