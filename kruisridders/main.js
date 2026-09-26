// Small enhancements only: the page works fully without this file.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.getElementById("menu");

  // Nav turns solid once the dark hero has scrolled past.
  const hero = document.getElementById("top");
  if (nav && hero) {
    new IntersectionObserver(
      ([entry]) => nav.toggleAttribute("data-scrolled", !entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    ).observe(hero);
  }

  // Mobile menu.
  const setOpen = (open) => {
    nav.toggleAttribute("data-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle?.addEventListener("click", () =>
    setOpen(!nav.hasAttribute("data-open"))
  );
  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.hasAttribute("data-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Mark the menu link for the section in view.
  const links = new Map(
    [...(menu?.querySelectorAll('a[href^="#"]') ?? [])].map((a) => [
      a.getAttribute("href").slice(1),
      a,
    ])
  );
  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of links.values()) a.removeAttribute("aria-current");
        links.get(entry.target.id)?.setAttribute("aria-current", "true");
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  for (const section of sections) spy.observe(section);

  // Reveal fallback for browsers without scroll-driven animations.
  if (!CSS.supports("animation-timeline: view()")) {
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    for (const el of document.querySelectorAll(".reveal")) reveal.observe(el);
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
});
