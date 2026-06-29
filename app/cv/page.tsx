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

// The deployed portfolio origin. Used to build absolute links (portfolio,
// thesis PDF) so they resolve from a standalone PDF, which has no page to
// resolve a relative URL against. The GitHub and thesis-repo links still show
// their full URL so they survive a flattened PDF export that drops link
// annotations; the portfolio link is friendly text by choice.
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
              For the past three years I&apos;ve worked as a frontend developer
              at MWS, the marketplace for match-worn shirts and sports
              memorabilia. I build the website and the mobile app, and I pay
              close attention to how things feel to use. Lately I&apos;ve also
              been building the tools the rest of the team relies on, like our
              code review setup and shared coding standards.
            </p>
            <p className="mt-3 max-w-xl text-muted-fg text-sm leading-relaxed">
              Off the clock I play football, organize events for friends, and
              I&apos;m always up for a good specialty coffee.
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
                Check out my portfolio!
              </PullLink>
              <span className="text-[0.72rem] text-muted-fg uppercase tracking-[0.18em]">
                {site.location}
              </span>
            </div>
          </div>
          <div
            aria-label={`Portrait of ${site.name}`}
            className="w-28 shrink-0 border border-border bg-bg bg-cover sm:w-32"
            role="img"
            style={{
              aspectRatio: "1",
              backgroundImage: "url(/me.jpg)",
              backgroundPosition: "center 22%",
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
            I work across the whole frontend here: the public marketplace, the
            internal admin tools, and the mobile app.
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
                Built an automated code review system for the team. Separate
                reviewers check each part of the code, and a final step runs
                type-checking, linting, and tests (Vitest and Jest).
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-px w-3 shrink-0 bg-accent"
              />
              <span className="text-muted-fg">
                Wrote our shared coding guidelines and the everyday tools the
                team builds with.
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
            Thesis: <span className="text-fg">{thesis.title}</span>. A Mixed
            Reality framework I built in Unity that uses a camera and projector
            to track real objects.
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
