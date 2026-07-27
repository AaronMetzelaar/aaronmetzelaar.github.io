import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";

// Two faces, both of which actually paint. A third (Geist) used to load as the
// body family and was overridden by `font-terminal` on every route root, so it
// preloaded ~40kB and rendered nothing. Fraunces is requested italic-only for
// the same reason: the one element using it is the italic contact line.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic"],
});

const TITLE = "Aaron Metzelaar · Software Engineer";
const DESCRIPTION =
  "Software engineer with three years shipping production web and mobile at MatchWornShirt: frontend, product engineering, and internal AI tooling.";

/*
 * The card is drawn by app/opengraph-image.tsx, but its URL is pinned here by
 * hand. A generated image route emits an extensionless file under
 * `output: "export"` (out/opengraph-image), and GitHub Pages types files by
 * extension, so scrapers would receive a PNG labelled application/octet-stream
 * and drop it. `pnpm build` copies the file to opengraph-image.png; this points
 * every card at that copy.
 */
export const SHARE_CARD = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${TITLE}. I make interfaces people enjoy using, and build the AI tooling my team ships them with.`,
};

export const metadata: Metadata = {
  // Absolute base for og:image and canonical. Without it, the share card
  // resolves to a relative path and every scraper (LinkedIn, Slack, iMessage)
  // silently drops the image.
  metadataBase: new URL("https://aaronmetzelaar.nl"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Aaron Metzelaar",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_NL",
    images: [SHARE_CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SHARE_CARD],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <body className="min-h-full">
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          type="module"
          data-cf-beacon='{"token": "b58ab02562f6416cb504d8ea7d4cbd46"}'
        />
      </body>
    </html>
  );
}
