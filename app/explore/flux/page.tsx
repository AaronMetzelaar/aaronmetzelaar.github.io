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
import { ScatterName, ScatterText } from "../_shared/names";
import { PageDots } from "../_shared/page-dots";
import { PullLink } from "../_shared/pull-link";
import { TypedTagline } from "../_shared/typed-tagline";

export default function FluxPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-bg font-terminal text-fg"
      style={premiumTheme}
    >
      <PageDots />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <span className="font-bold tracking-tight">AM.</span>
          <span className="flex items-center gap-2 text-[0.7rem] text-muted-fg uppercase tracking-[0.25em]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Available for work
          </span>
        </header>

        {/* Hero — the name as scattering dots */}
        <section className="mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-6 sm:px-10">
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            {site.role} — AI / Agentic
          </p>
          <ScatterName className="mt-6 h-[44vh] w-full" />
          <TypedTagline
            className="mt-6 max-w-xl text-base text-fg/80 leading-relaxed sm:text-lg"
            text="I build clean, fast interfaces — then build the AI tooling that ships them faster. Run your cursor through the name."
          />
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
            <PullLink href="#work">Selected work</PullLink>
            <PullLink arrow="→" href={`mailto:${site.email}`}>
              {site.email}
            </PullLink>
          </div>
        </section>

        {/* About */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="about"
        >
          <p className="text-accent text-xs uppercase tracking-[0.3em]">About</p>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div className="space-y-6">
              {about.map((p) => (
                <Reveal key={p.slice(0, 24)}>
                  <p className="max-w-2xl text-fg/80 leading-relaxed sm:text-lg">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <figure className="relative ml-auto w-full max-w-[16rem]">
                <div className="relative overflow-hidden border border-border">
                  <MediaFrame aspect={3 / 4} label="Portrait" minimal />
                  <DotGrid accent opacity={0.18} />
                </div>
                <figcaption className="mt-3 text-[0.65rem] text-muted-fg uppercase tracking-[0.22em]">
                  Portrait — in dots
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Work — heading also rendered in scattering dots */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="work"
        >
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            {experienceMeta.company} · 2023 — Present
          </p>
          <ScatterText className="mt-4 h-[14vh] w-full" lines={["Selected work"]} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
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

        {/* Thesis */}
        <section
          className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28"
          id="thesis"
        >
          <HoloCard className="p-8 sm:p-12" tone="iridescent">
            <p className="text-accent text-xs uppercase tracking-[0.22em]">
              {thesis.org} · {thesis.period}
            </p>
            <h3 className="mt-4 max-w-3xl font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.1] tracking-[-0.015em]">
              {thesis.title}
            </h3>
            <p className="mt-5 max-w-3xl text-muted-fg leading-relaxed">
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
          </HoloCard>
        </section>

        {/* AI & Agentic */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="ai"
        >
          <p className="text-accent text-xs uppercase tracking-[0.3em]">
            AI & Agentic
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.04] tracking-[-0.02em]">
            The leverage layer.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
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

        {/* Creative */}
        <section
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
          id="creative"
        >
          <p className="text-accent text-xs uppercase tracking-[0.3em]">Creative</p>
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,4.5vw,3rem)] italic leading-[1.1] tracking-[-0.015em]">
            {site.beyondLine}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
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
          <ScatterText className="h-[16vh] w-full" lines={["Let's talk"]} />
          <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-5 text-lg">
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
