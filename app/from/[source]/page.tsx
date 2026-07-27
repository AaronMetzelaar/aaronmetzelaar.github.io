import type { Metadata } from "next";

import Home from "@/app/page";

// Traffic-attribution landings: links handed out on the CV, cover letters,
// and profiles point here (e.g. /from/cv) instead of carrying a ?ref= query,
// because Cloudflare Web Analytics strips query strings but does report paths.
// The beacon reporting this path IS the whole mechanism, so the page simply is
// the homepage. It used to render nothing, wait for the beacon's request to
// appear in a PerformanceObserver, then redirect: a blank page for up to 2.5s
// plus a second full document load, on the one link that matters most.
const SOURCES = ["cv", "letter", "github", "linkedin"];

export const metadata: Metadata = {
  robots: { index: false },
  title: "Aaron Metzelaar",
  // The content here is the homepage verbatim, so point crawlers and anyone
  // who shares the link at the real URL.
  alternates: { canonical: "/" },
};

export function generateStaticParams() {
  return SOURCES.map((source) => ({ source }));
}

export default function FromPage() {
  return <Home />;
}
