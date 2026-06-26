import Link from "next/link";
import type { ReactNode } from "react";

import { PageDots } from "@/components/site/page-dots";
import { PullLink } from "@/components/site/pull-link";
import { experience, experienceMeta, site, thesis } from "@/content";
import { premiumTheme } from "@/lib/premium-theme";

export const metadata = {
  title: "Aaron Metzelaar · CV",
  description:
    "Frontend engineer with three years of production Vue 3, Nuxt 3, and TypeScript at MWS. Performance, accessibility, design systems, and the code-review tooling and standards a team builds on.",
};

// Keyword-grouped so a recruiter (or an ATS) can scan the stack fast. Frontend
// leads; the agentic work is grouped as the standards / DX competency it is.
const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "Vue 3",
      "Nuxt 3",
      "TypeScript",
      "JavaScript",
      "HTML / CSS",
      "React Native",
      "Tailwind",
      "Three.js / WebGL",
    ],
  },
  {
    group: "Standards & DX",
    items: [
      "Code review",
      "Testing (Vitest / Jest)",
      "Documentation",
      "Agent tooling (Claude Code, MCP)",
    ],
  },
  {
    group: "Craft",
    items: ["Performance", "Accessibility", "Design systems", "Motion / interaction"],
  },
  {
    group: "Languages",
    items: ["Dutch (native)", "English (fluent)"],
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
              Frontend Engineer · Vue / Nuxt · Performance &amp; code quality
            </p>
            <h1 className="mt-4 font-bold text-[clamp(2rem,6vw,3.25rem)] leading-[1.02] tracking-[-0.04em]">
              {site.name}
            </h1>
            <p className="mt-5 max-w-xl text-muted-fg text-sm leading-relaxed">
              Frontend engineer with three years shipping production web and
              mobile at MWS, the marketplace for authenticated match-worn
              shirts and sports memorabilia. I go deep on Vue 3 / Nuxt 3 /
              TypeScript interfaces used by
              collectors worldwide, with real performance, accessibility, and
              design-system work on high-traffic pages. I also build one layer
              up: the code-review tooling, shared standards, and developer
              experience the whole team relies on every day.
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
            match-worn shirts and sports memorabilia: the consumer platform, the internal tooling, and
            the app.
          </p>
          <ul className="mt-4 space-y-3">
            {experience.map((item) => {
              // The flagship marketplace item carries the strongest, most
              // role-relevant evidence, so it gets its full highlight list;
              // the rest stay one tight line each.
              const lead = item.slug === "platform";
              return (
                <li className="flex gap-3 text-sm leading-snug" key={item.slug}>
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-3 shrink-0 bg-accent"
                  />
                  <span>
                    <span className="text-fg">{item.title}</span>
                    {lead ? (
                      <ul className="mt-1.5 space-y-1 text-muted-fg">
                        {item.highlights?.slice(0, 4).map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-fg">
                        : {item.highlights?.[0]}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </Row>

        {/* Engineering standards & DX — the team-enablement layer (was AI &
            Agentic), framed as the review/standards/DX work it is */}
        <Row label="Engineering standards & DX">
          <ul className="space-y-2.5 text-sm leading-snug">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-px w-3 shrink-0 bg-accent"
              />
              <span className="text-muted-fg">
                Built the team's automated code-review system: a review command
                that spawns per-area reviewer personas, each checking its area
                against its own rulebook, with a session-end gate that runs
                typecheck, lint, and unit tests (Vitest / Jest).
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-px w-3 shrink-0 bg-accent"
              />
              <span className="text-muted-fg">
                Authored the team's living engineering conventions (layered
                AGENTS.md, one set per area) and the reusable skills the team
                runs every day.
              </span>
            </li>
          </ul>
        </Row>

        {/* Skills — above Education so the stack hits the eye first */}
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
            Mixed Reality framework in Unity (computer vision).
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
