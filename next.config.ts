import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages. Served at the root of a user page
  // (aaronmetzelaar.github.io), so no basePath — the hardcoded /asset paths
  // (portrait, videos, social stills) keep resolving.
  output: "export",
  images: { unoptimized: true },
  // emit /cv/index.html etc. so nested routes resolve cleanly on GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
