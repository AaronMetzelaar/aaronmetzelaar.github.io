"use client";

import { useEffect } from "react";

// Give the analytics beacon a beat to record this path, then land on the
// homepage. location.replace keeps the attribution page out of history so
// Back never returns to a blank page.
export function Forwarder() {
  useEffect(() => {
    const t = setTimeout(() => window.location.replace("/"), 600);
    return () => clearTimeout(t);
  }, []);
  return null;
}
