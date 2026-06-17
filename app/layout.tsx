import type { Metadata } from "next";
import {
  Fraunces,
  Geist,
  Geist_Mono,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aaron Metzelaar — Frontend Developer",
  description:
    "Frontend developer with an AI / agentic edge. Three years shipping web and mobile at MatchWornShirt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${hankenGrotesk.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
