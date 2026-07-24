"use client";

import { useEffect } from "react";

// A /from/<source> landing exists only to be counted once by Cloudflare Web
// Analytics, then it sends the visitor to the homepage. The beacon (loaded in
// the root layout) fires its pageview on the window `load` event, so we must
// not navigate away before that request has gone out — the old fixed timer
// redirected first and the hit was lost. Watch for the beacon's request to
// Cloudflare and leave the instant it lands, with a safety-net timeout so a
// blocked or offline beacon never strands the visitor on a blank page.
export function Forwarder() {
  useEffect(() => {
    let done = false;
    const land = () => {
      if (done) {
        return;
      }
      done = true;
      window.location.replace("/");
    };

    const observer = new PerformanceObserver((list) => {
      const sent = list
        .getEntries()
        .some((e) => e.name.includes("cloudflareinsights.com"));
      if (sent) {
        land();
      }
    });
    observer.observe({ type: "resource", buffered: true });

    const t = setTimeout(land, 2500);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return null;
}
