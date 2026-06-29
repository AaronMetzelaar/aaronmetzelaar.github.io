"use client";

/**
 * Triggers the browser's native print dialog, where "Save as PDF" exports the
 * CV. The page's `@media print` rules collapse it to a clean single page, so no
 * PDF library or build step is needed — the download always reflects live copy.
 */
export function PrintCvButton({ className }: { className?: string }) {
  return (
    <button className={className} onClick={() => window.print()} type="button">
      Download PDF ↓
    </button>
  );
}
