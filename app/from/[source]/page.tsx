import type { Metadata } from "next";

import { Forwarder } from "./forwarder";

// Traffic-attribution landings: links handed out on the CV, cover letters,
// and profiles point here (e.g. /from/cv) instead of carrying a ?ref= query,
// because Cloudflare Web Analytics strips query strings but does report
// paths. The page records one beacon view of its own path, then forwards to
// the homepage.
const SOURCES = ["cv", "letter", "github", "linkedin"];

export const metadata: Metadata = {
  robots: { index: false },
  title: "Aaron Metzelaar",
};

export function generateStaticParams() {
  return SOURCES.map((source) => ({ source }));
}

export default function FromPage() {
  return <Forwarder />;
}
