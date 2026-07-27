import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/content";

/*
 * The share card, generated at build time so it's made of the same parts as the
 * page it opens: JetBrains Mono, the white canvas, the accent blue, the 30px dot
 * grid, and the caret that ends the name in the hero and on the 404.
 *
 * It replaces a hand-made PNG that was set in a sans-serif the site doesn't use
 * and led with a tracked-caps SOFTWARE ENGINEER eyebrow — the label layer
 * retired from the page itself in 2d0cb98, left standing on the one surface a
 * stranger sees first.
 *
 * Why a route handler rather than the app/opengraph-image.tsx convention: a
 * generated metadata image emits an EXTENSIONLESS file under `output: "export"`
 * (out/opengraph-image), GitHub Pages types files by extension, and a PNG served
 * as application/octet-stream is dropped by every scraper. A static route
 * handler renders to the file its own path names, so this one produces a real
 * out/opengraph-image.png. The og:* tags are then written by hand in
 * app/layout.tsx (SHARE_CARD) — the convention file would otherwise override
 * them in its own segment and put the extensionless URL back.
 *
 * Satori does flexbox only (no grid), and reads ttf/otf/woff (not woff2), which
 * is why the font comes from @fontsource rather than next/font.
 */

const size = { width: 1200, height: 630 };
// Rendered once at build, like every other file the site ships.
export const dynamic = "force-static";

const FG = "#0a0a0b";
const MUTED = "#6c6c74";
const ACCENT = "#1b34ff";

// The page's dot texture as a repeating tile. Satori ignores a tiled
// `radial-gradient` (it renders nothing), but it does repeat an SVG background
// image, so the same 30px grid is drawn as one tile instead.
const DOT_TILE = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><circle cx="15" cy="15" r="1.3" fill="${ACCENT}" fill-opacity="0.14"/></svg>`
).toString("base64")}`;

const font = (weight: 400 | 700) =>
  readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/jetbrains-mono/files",
      `jetbrains-mono-latin-${weight}-normal.woff`
    )
  );

export async function GET() {
  const [regular, bold] = await Promise.all([font(400), font(700)]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        backgroundImage: `url(${DOT_TILE})`,
        backgroundSize: "30px 30px",
        backgroundRepeat: "repeat",
        padding: "84px",
        fontFamily: "JetBrains Mono",
        color: FG,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1,
              color: ACCENT,
            }}
          >
            _
          </div>
        </div>
        <div
          style={{
            marginTop: 44,
            // wide enough that the sentence sets in two lines instead of
            // orphaning "with." on a third
            maxWidth: 900,
            fontSize: 31,
            lineHeight: 1.5,
            color: MUTED,
          }}
        >
          I make interfaces people enjoy using, and build the AI tooling my team
          ships them with.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 21,
          letterSpacing: "0.18em",
          color: MUTED,
        }}
      >
        {/* mirrors the page footer: wordmark left, place right, micro-caps.
            Blue stays on the caret alone, the way the page spends it. */}
        <div style={{ display: "flex" }}>AARONMETZELAAR.NL</div>
        <div style={{ display: "flex" }}>{site.location.toUpperCase()}</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: regular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
