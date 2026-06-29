import Link from "next/link";
import type { ReactNode } from "react";

import { PageDots } from "@/components/site/page-dots";
import { PrintCvButton } from "@/components/site/print-cv-button";
import { PullLink } from "@/components/site/pull-link";
import { experience, experienceMeta, site, thesis } from "@/content";
import { premiumTheme } from "@/lib/premium-theme";

export const metadata = {
  title: "Aaron Metzelaar · CV",
  description:
    "Frontend engineer with three years of production Vue 3, Nuxt 3, and TypeScript at MWS. Performance, accessibility, design systems, and the code-review tooling and standards a team builds on.",
};

// The deployed portfolio origin. Printed links must be absolute and shown as
// readable text — a PDF has no page to resolve relative URLs against, and some
// "Save as PDF" paths (e.g. macOS') flatten link annotations, so the visible
// URL is the only thing guaranteed to survive.
const SITE_URL = "https://aaronmetzelaar.github.io";

// Keyword-grouped so a recruiter (or an ATS) can scan the stack fast. `primary`
// groups (Frontend, Standards & DX) are the ones worth highlighting — they get
// the accent treatment so the important categories lead the eye.
const SKILLS: { group: string; items: string[]; primary?: boolean }[] = [
  {
    group: "Frontend",
    primary: true,
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
    primary: true,
    items: [
      "Code review",
      "Testing (Vitest / Jest)",
      "Documentation",
      "Agent tooling (Claude Code, MCP)",
    ],
  },
  {
    group: "Craft",
    items: [
      "Performance",
      "Accessibility",
      "Design systems",
      "Motion / interaction",
    ],
  },
  {
    group: "Languages",
    items: ["Dutch (native)", "English (fluent)"],
  },
];

export default function CvPage() {
  return (
    // `cv-doc` hooks the print stylesheet in globals.css, which scales type and
    // collapses the web rhythm so the page prints as one full A4 sheet.
    <main
      className="cv-doc relative min-h-screen overflow-hidden bg-bg font-terminal text-fg print:min-h-0 print:overflow-visible"
      style={premiumTheme}
    >
      <PageDots className="print:hidden" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-14 sm:px-10 sm:py-20 print:max-w-none print:p-0">
        {/* Web-only chrome: a back link and the PDF export. Neither belongs in
            the printed document, so the whole row drops out on print. */}
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Link
            className="text-[0.7rem] text-muted-fg uppercase tracking-[0.3em] transition-colors hover:text-accent"
            href="/"
          >
            ← {site.name}
          </Link>
          <PrintCvButton className="text-[0.7rem] text-muted-fg uppercase tracking-[0.3em] transition-colors hover:text-accent" />
        </div>

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
              I&apos;m a frontend engineer happiest at the seam where design
              meets engineering — where a good interface stops feeling like
              software. Three years at MWS building production web and mobile
              for collectors worldwide pulled me a layer up, too: into the
              code-review tooling and shared standards my whole team now ships
              with. I care about craft, momentum, and tools that get out of the
              way.
            </p>
            <p className="mt-3 max-w-xl text-muted-fg text-sm leading-relaxed">
              Off the clock you&apos;ll find me on the football pitch,
              organizing events for friends, or tracking down a great specialty
              coffee.
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
              <PullLink
                arrow="↗"
                href={SITE_URL}
                rel="noreferrer"
                target="_blank"
              >
                aaronmetzelaar.github.io
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

        {/* Experience — the most important category, so its label leads in accent */}
        <Row accent label="Experience">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-base tracking-tight">
              MatchWornShirt · {experienceMeta.role}
            </h3>
            <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
              {experienceMeta.period}
            </span>
          </div>
          <p className="mt-1.5 text-muted-fg text-sm leading-relaxed">
            Across the whole frontend: the consumer marketplace, the internal
            tooling, and the app.
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

        {/* Engineering standards & DX — the team-enablement layer, also highlighted */}
        <Row accent label="Engineering standards & DX">
          <ul className="space-y-2.5 text-sm leading-snug">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-px w-3 shrink-0 bg-accent"
              />
              <span className="text-muted-fg">
                Built the team's automated code-review system — per-area
                reviewer personas, each with its own rulebook, behind a
                session-end gate that runs typecheck, lint, and tests (Vitest /
                Jest).
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-px w-3 shrink-0 bg-accent"
              />
              <span className="text-muted-fg">
                Authored the team's living engineering conventions (layered
                AGENTS.md) and the reusable skills they run every day.
              </span>
            </li>
          </ul>
        </Row>

        {/* Skills — above Education so the stack hits the eye first */}
        <Row accent label="Skills">
          <dl className="space-y-4">
            {SKILLS.map((s) => (
              <div
                className="grid gap-x-6 gap-y-2 sm:grid-cols-[7rem_1fr]"
                key={s.group}
              >
                <dt
                  className={`text-[0.7rem] uppercase tracking-[0.2em] ${
                    s.primary ? "font-semibold text-accent" : "text-muted-fg"
                  }`}
                >
                  {s.group}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <span
                      className={`border px-2.5 py-1 text-[0.7rem] tracking-[0.04em] ${
                        s.primary
                          ? "border-accent/40 bg-accent/[0.06] text-fg"
                          : "border-border text-muted-fg"
                      }`}
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
            <h3 className="text-base tracking-tight">
              {site.education.degree}
            </h3>
            <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
              {site.education.school} · {site.education.year}
            </span>
          </div>
          <p className="mt-2 text-muted-fg text-sm leading-relaxed">
            Thesis: <span className="text-fg">{thesis.title}</span>. A modular
            Mixed Reality framework in Unity (computer vision).
          </p>
          {/* Links show their full URL so they survive a flattened PDF export. */}
          <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
            {thesis.repo ? (
              <PullLink
                arrow="↗"
                href={thesis.repo}
                rel="noreferrer"
                target="_blank"
              >
                {thesis.repo.replace(/^https?:\/\//, "")}
              </PullLink>
            ) : null}
            {thesis.href ? (
              <PullLink
                arrow="↗"
                href={`${SITE_URL}${thesis.href}`}
                rel="noreferrer"
                target="_blank"
              >
                Thesis (PDF)
              </PullLink>
            ) : null}
          </div>
        </Row>

        <footer className="mt-16 flex flex-wrap items-center justify-end gap-4 border-border border-t pt-6 text-[0.7rem] text-muted-fg uppercase tracking-[0.22em] print:hidden">
          <PullLink arrow="→" href="/">
            See the full site
          </PullLink>
        </footer>
      </div>
    </main>
  );
}

/**
 * A hairline-ruled CV row: a left label gutter + content. `accent` lifts the
 * gutter label into the accent colour to flag an important category.
 */
function Row({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 grid gap-x-8 gap-y-4 border-border border-t pt-8 sm:grid-cols-[8rem_1fr]">
      <h2
        className={`text-[0.7rem] uppercase tracking-[0.28em] ${
          accent ? "font-semibold text-accent" : "text-muted-fg"
        }`}
      >
        {label}
      </h2>
      <div>{children}</div>
    </section>
  );
}
