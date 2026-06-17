import { site } from "@/content/site";

/**
 * A thin fixed nav in the terminal/mono language: initials mark on the left,
 * section anchors + a contact pull on the right. Stays out of the way — the
 * page is white throughout, so it reads cleanly over everything.
 */
export function SiteNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 font-terminal">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <a
          className="pointer-events-auto text-sm tracking-[0.2em] transition-colors hover:text-accent"
          href="#top"
        >
          {site.initials}
        </a>
        <ul className="pointer-events-auto hidden items-center gap-7 text-[0.7rem] uppercase tracking-[0.2em] md:flex">
          {site.nav.map((n) => (
            <li key={n.href}>
              <a
                className="text-muted-fg transition-colors hover:text-fg"
                href={n.href}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          className="pointer-events-auto text-[0.7rem] text-muted-fg uppercase tracking-[0.2em] transition-colors hover:text-accent md:hidden"
          href="#contact"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
