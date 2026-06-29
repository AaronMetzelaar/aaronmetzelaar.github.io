import type { CSSProperties } from "react";

/** The bold blue that anchors the premium direction. */
const PREMIUM_BLUE = "#1b34ff";

/**
 * Forces a white canvas + bold blue accent regardless of the OS color scheme,
 * so the shared token utilities (bg-bg, text-fg, border-border, text-accent,
 * and MediaFrame) all render light + blue on every premium variant. Applied as
 * an inline style on each variant's root element.
 */
export const premiumTheme = {
  "--bg": "#ffffff",
  "--fg": "#0a0a0b",
  "--muted": "#f3f3ef",
  "--muted-fg": "#73737a",
  "--border": "#e7e7e1",
  "--accent": PREMIUM_BLUE,
  "--accent-fg": "#ffffff",
} as CSSProperties;

/**
 * Inverted palette for the one dark "chapter" (the Harness section): the same
 * tokens flipped to a near-black canvas with light ink, a lifted border, and a
 * brightened blue so the accent still sings on dark. Applied as an inline style
 * on the section's root, so every token utility inside (bg-bg, text-fg,
 * text-muted-fg, border-border, text-accent) flips automatically. The nav reuses
 * it to stay legible while it scrolls over the dark band.
 */
export const darkSection = {
  "--bg": "#0a0a0b",
  "--fg": "#f6f6f4",
  "--muted": "#17171a",
  "--muted-fg": "#b6b6c0",
  "--border": "#37373f",
  "--accent": "#5e76ff",
  "--accent-fg": "#ffffff",
} as CSSProperties;
