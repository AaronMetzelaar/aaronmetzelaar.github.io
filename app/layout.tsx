import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const TITLE = "Aaron Metzelaar · Software Engineer";
const DESCRIPTION =
  "Software engineer with three years shipping production web and mobile at MatchWornShirt: frontend, product engineering, and internal AI tooling.";

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
  },
  // og:image is picked up automatically from app/opengraph-image.tsx; X falls
  // back to it when twitter:image is absent.
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
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
