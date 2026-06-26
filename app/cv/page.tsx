import Link from "next/link";
import type { ReactNode } from "react";

import { PageDots } from "@/app/explore/_shared/page-dots";
import { PullLink } from "@/app/explore/_shared/pull-link";
import {
  aiWork,
  experience,
  experienceMeta,
  site,
  thesis,
} from "@/content";
import { premiumTheme } from "@/lib/premium-theme";

export const metadata = {
  title: "Aaron Metzelaar — CV",
  description:
    "Frontend & AI engineer. Three years building production web and mobile at MWS — Vue, Nuxt, React Native, TypeScript, design systems, and agentic AI tooling.",
};

// Keyword-grouped so a recruiter (or an ATS) can scan the stack fast.
const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "React",
      "Vue 3",
      "Nuxt 3",
      "React Native",
      "TypeScript",
      "Tailwind",
      "Three.js / WebGL",
    ],
  },
  {
    group: "AI & Agentic",
    items: [
      "Claude Code",
      "MCP",
      "Agent skills & hooks",
      "LLM tooling",
      "Agentic workflows",
    ],
  },
  {
    group: "Craft",
    items: [
      "Design systems",
      "Accessibility",
      "Performance",
      "Motion / interaction",
    ],
  },
];

export default function CvPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <PageDots />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-14 sm:px-10 sm:py-20">
        <Link
          className="text-[0.7rem] text-muted-fg uppercase tracking-[0.3em] transition-colors hover:text-accent"
          href="/"
        >
          ← {site.name}
        </Link>

        {/* Masthead */}
        <header className="mt-12 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="text-accent text-xs uppercase tracking-[0.3em]">
              Frontend Engineer · AI / Agentic · Design Engineer
            </p>
            <h1 className="mt-4 font-bold text-[clamp(2rem,6vw,3.25rem)] leading-[1.02] tracking-[-0.04em]">
              {site.name}
            </h1>
            <p className="mt-5 max-w-xl text-muted-fg text-sm leading-relaxed">
              Three years shipping production web and mobile at MWS, the
              marketplace for match-worn shirts. I work across its frontend
              (Nuxt, Vue, React Native, TypeScript) and build the AI and
              agentic tooling, design systems, and DX that help the whole team
              ship faster.
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
              <span className="text-[0.72rem] text-muted-fg uppercase tracking-[0.18em]">
                {site.location}
              </span>
            </div>
          </div>
          <div
            aria-label={`Portrait of ${site.name}`}
            className="w-28 shrink-0 border border-border bg-bg bg-center bg-cover sm:w-32"
            role="img"
            style={{
              aspectRatio: "1",
              backgroundImage: "url(/portrait/photo.jpg)",
            }}
          />
        </header>

        {/* Experience */}
        <Row label="Experience">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-base tracking-tight">
              MatchWornShirt · {experienceMeta.role}
            </h3>
            <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
              {experienceMeta.period}
            </span>
          </div>
          <p className="mt-1.5 text-muted-fg text-sm leading-relaxed">
            Built across the whole frontend of the marketplace for authenticated
            match-worn shirts: the consumer platform, the internal tooling, and
            the app.
          </p>
          <ul className="mt-4 space-y-2.5">
            {experience.map((item) => (
              <li className="flex gap-3 text-sm leading-snug" key={item.slug}>
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-3 shrink-0 bg-accent"
                />
                <span>
                  <span className="text-fg">{item.title}: </span>
                  <span className="text-muted-fg">{item.tagline}</span>
                </span>
              </li>
            ))}
          </ul>
        </Row>

        {/* AI & Agentic */}
        <Row label="AI & Agentic">
          <ul className="space-y-2.5">
            {aiWork.map((item) => (
              <li className="flex gap-3 text-sm leading-snug" key={item.slug}>
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-3 shrink-0 bg-accent"
                />
                <span>
                  <span className="text-fg">{item.title}: </span>
                  <span className="text-muted-fg">{item.highlights?.[0]}</span>
                </span>
              </li>
            ))}
          </ul>
        </Row>

        {/* Education */}
        <Row label="Education">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-base tracking-tight">{site.education.degree}</h3>
            <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
              {site.education.school} · {site.education.year}
            </span>
          </div>
          <p className="mt-2 text-muted-fg text-sm leading-relaxed">
            Thesis: <span className="text-fg">{thesis.title}</span>. A modular
            Mixed Reality framework in Unity.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
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

        {/* Skills */}
        <Row label="Skills">
          <dl className="space-y-4">
            {SKILLS.map((s) => (
              <div
                className="grid gap-x-6 gap-y-2 sm:grid-cols-[7rem_1fr]"
                key={s.group}
              >
                <dt className="text-[0.7rem] text-muted-fg uppercase tracking-[0.2em]">
                  {s.group}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <span
                      className="border border-border px-2.5 py-1 text-[0.7rem] tracking-[0.04em]"
                      key={i}
                    >
                      {i}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Row>

        <footer className="mt-16 flex flex-wrap items-center justify-end gap-4 border-border border-t pt-6 text-[0.7rem] text-muted-fg uppercase tracking-[0.22em]">
          <PullLink arrow="→" href="/">
            See the full site
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
