import Link from "next/link";
import type { ReactNode } from "react";

import { PageDots } from "@/components/site/page-dots";
import { PrintCvButton } from "@/components/site/print-cv-button";
import { PullLink } from "@/components/site/pull-link";
import {
  cvExperience,
  cvProjects,
  experienceMeta,
  site,
  thesis,
} from "@/content";
import { premiumTheme } from "@/lib/premium-theme";

export const metadata = {
  title: "Aaron Metzelaar · CV",
  description:
    "Software engineer with three years of production Vue, Nuxt, React Native, and TypeScript at MWS, plus server-side, SQL, and cloud work. Product engineering, AI tooling, localisation infrastructure, and payments.",
};

/*
 * Visual system, tuned for skim > scan > read:
 *
 * Ink (three levels + one accent, nothing else):
 *   - accent blue  = signposts only: section labels, dates, bullet dots,
 *     the SKILLS micro-label, links. A skimmer follows blue down the page.
 *   - bold near-black = the skim layer: name, role, area headings, project
 *     names, metrics. Reading only bold text should tell the whole story.
 *   - muted grey   = the read layer: prose and supporting detail.
 *   Skill chips stay neutral (paper-grey fill) so keywords read as a quiet
 *   band instead of competing with the blue signposts.
 *
 * Space (proximity: gaps inside a group are at most half the gap between
 * groups, so blocks read as blocks without boxes or extra rules):
 *   - 8px  between bullets            (space-y-2) — wrapped bullets need a
 *     gap clearly wider than their own line height to read as separate items
 *   - 8px  heading → its bullets      (mt-2)
 *   - 10px bullets → skills row       (mt-2.5)
 *   - 28px between experience areas   (space-y-7)
 *   - 48px + ruled line between sections (mt-12 pt-8)
 * The print stylesheet in globals.css maps this same scale to A4.
 */

// The deployed portfolio origin. Used to build absolute links (portfolio,
// thesis PDF) so they resolve from a standalone PDF, which has no page to
// resolve a relative URL against. The GitHub and thesis-repo links still show
// their full URL so they survive a flattened PDF export that drops link
// annotations; the portfolio link is friendly text by choice.
const SITE_URL = "https://aaronmetzelaar.nl";

// Degree focus areas, shown as the same chip row the experience areas use.
const COURSEWORK = [
  "Computer Vision",
  "Software Architecture",
  "Game Engine Dev",
  "Mixed/Extended Reality",
  "Real-time Interactive Systems",
  "HCI",
];

// Recruiters scan for numbers before they read sentences. Any metric-looking
// token (40%, 5% to 35%, 154,500+, 360°) gets lifted from the muted bullet
// text into bold full-strength ink so the results register at a glance.
const METRIC = /(\d[\d,.]*(?:\+|%|°)?(?:\s+to\s+\d[\d,.]*(?:\+|%|°)?)?)/g;

function Metrics({ text }: { text: string }) {
  return text.split(METRIC).map((part, i) =>
    i % 2 === 1 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static text, order never changes
      <strong className="font-semibold text-fg" key={i}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function CvPage() {
  return (
    // `cv-doc` hooks the print stylesheet in globals.css, which scales type and
    // collapses the web rhythm so the page prints within two A4 sheets.
    <main
      className="cv-doc relative min-h-screen overflow-hidden bg-bg font-terminal text-fg print:min-h-0 print:overflow-visible"
      style={premiumTheme}
    >
      {/* The site's dot texture is web-only: on paper it reads as noise, so
          the print stylesheet drops it. */}
      <PageDots className="cv-dots" />
      {/* 52rem, not max-w-4xl: at 4xl every bullet ran 81 characters per line,
          past the 75ch ceiling where the eye starts losing its place on the
          return sweep, and mono type pays that cost harder than proportional.
          Print keeps its own grid via print:max-w-none. */}
      <div className="relative z-10 mx-auto max-w-[52rem] px-6 py-14 sm:px-10 sm:py-20 print:max-w-none print:p-0">
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

        {/* Masthead: kicker and name span the full width; below them, the
            intro block and the headshot share a grid so the photo tops out
            at the first line of prose, not at the name. */}
        <header className="mt-12">
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            Software Engineer
          </p>
          <h1 className="mt-4 font-bold text-[clamp(2rem,6vw,3.25rem)] leading-[1.02] tracking-[-0.04em]">
            {site.name}
          </h1>
          <div className="cv-hero mt-5 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
            <div>
              {/* The intro is context, not content — one paragraph, one
                  type-size below body text, so the eye lands on the name and
                  slides to Experience instead of parking on a wall of prose. */}
              <p className="cv-intro text-[0.8125rem] text-muted-fg leading-relaxed">
                I&apos;m a software engineer who likes building things that feel
                simple on the outside and solid underneath. My work combines
                product thinking, frontend engineering, automation, and AI
                tooling, with a focus on turning unclear ideas into practical
                solutions people actually enjoy using. I&apos;m curious,
                hands-on, and collaborative, and I enjoy helping teams work
                smarter as much as I enjoy building the product itself. Off the
                clock, I play football, organise events with friends, and
                I&apos;m always up for a good specialty coffee.
              </p>
              {/* One compact strip: contact, location, languages. Identity
                  facts share a line instead of each renting their own row. */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8125rem]">
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
                {/* Portfolio link is redundant on the web CV (you're already
                    on the site), so it's print-only — kept in the PDF export
                    so a recruiter reading it can still reach the site. */}
                {/* /from/cv instead of a ?ref= query: Cloudflare Web
                    Analytics strips query strings but reports paths, so this
                    is how PDF traffic shows up in the dashboard */}
                <PullLink
                  arrow="↗"
                  className="hidden print:inline-flex"
                  href={`${SITE_URL}/from/cv`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Portfolio website
                </PullLink>
                <span className="text-[0.7rem] text-muted-fg uppercase tracking-[0.12em]">
                  {site.location} · Dutch (native) · English (fluent)
                </span>
              </div>
            </div>
            {/* A proper headshot, not a stamp: 4:5 portrait sized to roughly
                the height of the text block beside it, so the header reads as
                one unit instead of text plus a floating thumbnail. */}
            <div
              aria-label={`Portrait of ${site.name}`}
              className="w-36 shrink-0 border border-border bg-bg bg-cover sm:w-44"
              role="img"
              style={{
                aspectRatio: "4 / 5",
                backgroundImage: "url(/me.jpg)",
                backgroundPosition: "center 22%",
              }}
            />
          </div>
        </header>

        <Row label="Experience">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-semibold text-base tracking-tight">
              MatchWornShirt · {experienceMeta.role}
            </h3>
            <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
              {experienceMeta.period}
            </span>
          </div>
          <p className="mt-2 text-muted-fg text-sm leading-relaxed">
            Work across the public marketplace, mobile app, and internal admin
            tools as a{" "}
            <strong className="font-semibold text-fg">T‑shaped engineer</strong>
            : frontend and product at the core, reaching across the stack into
            server-side Node, Python, and C#, SQL, and Docker, AWS, and CI/CD
            for delivery. AI-assisted tooling runs through all of it.
          </p>
          {/* One role, five areas of ownership. Each area is a self-contained
              skim unit: bold heading, dashed bullets, then a labelled keyword
              row. The 28px between areas (vs 6px inside them) is what makes
              them read as separate blocks. */}
          <div className="mt-6 space-y-7">
            {cvExperience.map((area) => (
              <div className="break-inside-avoid" key={area.area}>
                <h4 className="font-semibold text-fg text-sm tracking-tight">
                  {area.area}
                </h4>
                <ul className="mt-2 space-y-2">
                  {area.bullets.map((b) => (
                    <li className="flex gap-3 text-sm leading-snug" key={b}>
                      <span
                        aria-hidden="true"
                        className="cv-bullet mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-muted-fg">
                        <Metrics text={b} />
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
                  <span className="font-semibold text-[0.65rem] text-accent uppercase tracking-[0.18em]">
                    Skills
                  </span>
                  {area.skills.map((s) => (
                    <span
                      className="cv-chip border border-border bg-muted/60 px-2 py-0.5 text-[0.65rem] text-fg tracking-[0.04em]"
                      key={s}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Row>

        <Row label="Highlighted projects">
          <ul className="space-y-3">
            {cvProjects.map((p) => (
              <li
                className="flex gap-3 break-inside-avoid text-sm leading-snug"
                key={p.name}
              >
                <span
                  aria-hidden="true"
                  className="cv-bullet mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                />
                <span>
                  <span className="font-semibold text-fg">{p.name}</span>
                  <span className="text-muted-fg">
                    : <Metrics text={p.result} />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Row>

        <Row label="Education">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-semibold text-base tracking-tight">
              {site.education.degree}
            </h3>
            <span className="text-[0.7rem] text-accent uppercase tracking-[0.18em]">
              {site.education.school} · {site.education.year}
            </span>
          </div>
          <p className="mt-2 text-muted-fg text-sm leading-relaxed">
            Thesis: <span className="text-fg">{thesis.title}</span>. A modular
            Mixed Reality framework built in Unity (C#): real-time
            computer-vision tracking of physical objects through a camera and
            projector pipeline, with calibration and projection mapping that
            connect them to responsive spatial interfaces.
          </p>
          <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
            <span className="font-semibold text-[0.65rem] text-accent uppercase tracking-[0.18em]">
              Domains
            </span>
            {COURSEWORK.map((c) => (
              <span
                className="cv-chip border border-border bg-muted/60 px-2 py-0.5 text-[0.65rem] text-fg tracking-[0.04em]"
                key={c}
              >
                {c}
              </span>
            ))}
          </div>
          {/* Links show their full URL so they survive a flattened PDF export. */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
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
 * A hairline-ruled CV row: a left label gutter + content. Every label gets the
 * same accent treatment — one consistent signpost style, so the eye can walk
 * the left rail down the document without re-deciding what each colour means.
 */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-12 grid gap-x-6 gap-y-4 border-border border-t pt-8 sm:grid-cols-[7rem_1fr]">
      <h2 className="font-semibold text-[0.7rem] text-accent uppercase tracking-[0.22em]">
        {label}
      </h2>
      <div>{children}</div>
    </section>
  );
}
