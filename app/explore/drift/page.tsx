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
} from "@/content";
import { premiumTheme } from "@/lib/premium-theme";
import { DotGrid } from "../_shared/dot-grid";
import { HoloCard } from "../_shared/holo-card";
import { MagneticName } from "../_shared/names";
import { PageDots } from "../_shared/page-dots";
import { FilingsRule, PullLink } from "../_shared/pull-link";
import { TypedTagline } from "../_shared/typed-tagline";
import { DriftEyebrow } from "./_drift-eyebrow";

export default function DriftPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <PageDots />
      <div className="relative z-10">
        {/* Top bar */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <span className="font-bold tracking-tight">AM.</span>
          <nav className="hidden items-center gap-7 sm:flex">
            <PullLink arrow="" href="#work">
              Work
            </PullLink>
            <PullLink arrow="" href="#ai">
              AI
            </PullLink>
            <PullLink arrow="" href="#creative">
              Creative
            </PullLink>
            <PullLink arrow="→" href="#contact">
              Contact
            </PullLink>
          </nav>
          <span className="text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
            {site.location}
          </span>
        </header>

        {/* Hero */}
        <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 sm:px-10">
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            {site.role} — AI / Agentic
          </p>
          <h1 className="mt-7 max-w-4xl font-bold text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] tracking-[-0.045em]">
            <MagneticName />
          </h1>
          <TypedTagline
            className="mt-9 max-w-xl text-base text-fg/80 leading-relaxed sm:text-lg"
            text={site.tagline}
          />
          <div className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-4">
            <PullLink href="#work">Selected work</PullLink>
            <PullLink arrow="→" href={`mailto:${site.email}`}>
              {site.email}
            </PullLink>
          </div>
          <FilingsRule className="mt-16 max-w-2xl" />
        </section>

        {/* About */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="about"
        >
          <DriftEyebrow index="01" label="About" />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div className="space-y-6">
              {about.map((p) => (
                <Reveal key={p.slice(0, 24)}>
                  <p className="max-w-2xl text-fg/80 leading-relaxed sm:text-lg">
                    {p}
                  </p>
                </Reveal>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Vue / Nuxt", "React Native", "TypeScript", "Agentic AI", "Design systems"].map(
                  (t) => (
                    <span
                      className="border border-border px-3 py-1 text-[0.7rem] text-muted-fg uppercase tracking-[0.18em]"
                      key={t}
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>
            <Reveal delay={0.1}>
              <figure className="relative ml-auto w-full max-w-[16rem]">
                <div className="relative overflow-hidden border border-border">
                  <MediaFrame aspect={3 / 4} label="Portrait" minimal />
                  <DotGrid accent opacity={0.16} />
                </div>
                <figcaption className="mt-3 text-[0.65rem] text-muted-fg uppercase tracking-[0.22em]">
                  Portrait — in dots
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <Divider />

        {/* Work */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="work"
        >
          <DriftEyebrow index="02" label={experienceMeta.company} />
          <h2 className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.04] tracking-[-0.02em]">
            The whole front of a marketplace — and a few standouts.
          </h2>
          <p className="mt-6 max-w-2xl text-muted-fg leading-relaxed">
            {experienceMeta.summary}
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {experience.map((item, i) => (
              <Reveal delay={i * 0.05} key={item.slug}>
                <HoloCard
                  className="flex min-h-[16rem] flex-col p-7"
                  tone={i % 2 === 0 ? "iridescent" : "blue"}
                >
                  <span className="text-accent text-xs uppercase tracking-[0.22em]">
                    {item.period}
                  </span>
                  <h3 className="mt-4 font-display text-2xl tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-muted-fg text-sm leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        className="text-[0.65rem] text-muted-fg uppercase tracking-[0.16em]"
                        key={t}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </HoloCard>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* Thesis */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="thesis"
        >
          <DriftEyebrow index="03" label="Thesis · University of Amsterdam" />
          <div className="mt-10">
            <HoloCard className="p-8 sm:p-12" tone="iridescent">
              <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-14">
                <div>
                  <h3 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.1] tracking-[-0.015em]">
                    {thesis.title}
                  </h3>
                  <p className="mt-2 text-accent text-xs uppercase tracking-[0.22em]">
                    {thesis.period}
                  </p>
                  <p className="mt-5 text-muted-fg leading-relaxed">
                    {thesis.summary}
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-x-9 gap-y-3">
                    {thesis.repo ? (
                      <PullLink arrow="↗" href={thesis.repo} rel="noreferrer" target="_blank">
                        View the framework
                      </PullLink>
                    ) : null}
                    {thesis.href ? (
                      <PullLink arrow="↗" href={thesis.href} rel="noreferrer" target="_blank">
                        Read the thesis (PDF)
                      </PullLink>
                    ) : null}
                  </div>
                </div>
                <ul className="space-y-3 self-center">
                  {(thesis.highlights ?? []).map((h) => (
                    <li
                      className="flex gap-3 text-muted-fg text-sm leading-relaxed"
                      key={h}
                    >
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </HoloCard>
          </div>
        </section>

        <Divider />

        {/* AI & Agentic */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="ai"
        >
          <DriftEyebrow index="04" label="AI & Agentic" />
          <h2 className="mt-8 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.04] tracking-[-0.02em]">
            I build the systems other developers build on.
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {aiWork.map((item, i) => (
              <Reveal delay={i * 0.05} key={item.slug}>
                <HoloCard className="flex min-h-[15rem] flex-col p-7" tone="blue">
                  <h3 className="font-display text-xl tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-muted-fg text-sm leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        className="text-[0.65rem] text-muted-fg uppercase tracking-[0.16em]"
                        key={t}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </HoloCard>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* Creative */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="creative"
        >
          <DriftEyebrow index="05" label="Creative" />
          <h2 className="mt-8 max-w-3xl font-display text-[clamp(1.8rem,4.5vw,3rem)] italic leading-[1.1] tracking-[-0.015em]">
            {site.beyondLine}
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {creativeWork.map((item, i) => (
              <Reveal delay={i * 0.05} key={item.slug}>
                <HoloCard className="flex min-h-[13rem] flex-col p-7" tone="iridescent">
                  <h3 className="font-display text-xl tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-muted-fg text-sm leading-relaxed">
                    {item.summary}
                  </p>
                </HoloCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40"
          id="contact"
        >
          <DriftEyebrow index="06" label="Contact" />
          <h2 className="mt-8 max-w-4xl font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.04em]">
            Let's build something
            <span className="text-accent"> that pulls.</span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-5 text-lg">
            <PullLink arrow="→" href={`mailto:${site.email}`}>
              {site.email}
            </PullLink>
            <PullLink arrow="↗" href={site.socials.github} rel="noreferrer" target="_blank">
              github.com/{site.socials.githubHandle}
            </PullLink>
          </div>
          <footer className="mt-24 text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
            {site.roleLine}
          </footer>
        </section>
      </div>
    </main>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <FilingsRule />
    </div>
  );
}
