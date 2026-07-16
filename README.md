# aaronmetzelaar.nl

Personal portfolio and CV, live at **[aaronmetzelaar.nl](https://aaronmetzelaar.nl)**.

One palette, one typeface, one accent colour. White canvas, near-black ink, deep blue, JetBrains Mono. Everything else is restraint.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static export) with React 19 and TypeScript
- Tailwind CSS 4
- [Three.js](https://threejs.org) + react-three-fiber for the hero portrait
- [Motion](https://motion.dev) for reveals and micro-interactions
- Deployed to GitHub Pages through GitHub Actions, on a custom domain

## Details worth a look

- **The hero portrait** ([`components/site/voxel-portrait.tsx`](components/site/voxel-portrait.tsx)) is a halftone dot cloud: one photo plus a depth map, sampled on a rotated grid so dot size encodes tone. Drag to turn it. The preloader assembles the same dots into the resting pose so the arrival reads as a single event.
- **The CV is print-engineered** ([`app/cv/page.tsx`](app/cv/page.tsx)). The `/cv` route doubles as the downloadable PDF: a print stylesheet in [`app/globals.css`](app/globals.css) remaps the screen layout onto exactly two A4 pages, so "Download PDF" is just `window.print()` and the export always matches the live page.
- **Content is typed data** ([`content/`](content/)). Experience, projects, and thesis live as TypeScript modules shared between the homepage and the CV, so copy is edited once.
- **No backend, no cookies.** The whole site is a static export; the only measurement is cookieless Cloudflare Web Analytics.

## Development

```bash
pnpm install
pnpm dev
```

Useful scripts: `pnpm check` (lint + format via ultracite), `pnpm typecheck`, `pnpm build` (static export to `out/`). Node version is pinned in `.nvmrc`.

## Deploying

Push to `main`. The [deploy workflow](.github/workflows/deploy.yml) builds the static export and publishes it to GitHub Pages at [aaronmetzelaar.nl](https://aaronmetzelaar.nl).

## License

The code is [MIT licensed](LICENSE). Personal content is not: photographs, written copy, the CV, and the thesis PDF remain all rights reserved.
