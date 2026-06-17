import type { CSSProperties } from "react";

/** The bold blue that anchors the premium direction. */
export const PREMIUM_BLUE = "#1b34ff";

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
