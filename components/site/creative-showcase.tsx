"use client";

import { useState } from "react";

import { CreativeGallery } from "@/components/site/creative-gallery";
import { SectionHeader } from "@/components/site/section-header";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The Creative section's header + gallery. Lifts the gallery's focus state so
 * that hovering a tile also blurs the content *outside* the block (the header),
 * pulling all attention onto the focused work.
 */
export function CreativeShowcase({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState(false);
  return (
    <>
      <div
        className={cn(
          "transition-[filter,opacity] duration-500",
          active && "opacity-40 blur-[4px]"
        )}
      >
        <SectionHeader
          dividerCount={28}
          index="05"
          kicker="Beyond code"
          note="Video · Design · Social"
          title="Off the clock"
        />
      </div>
      <div className="mt-12">
        <CreativeGallery items={items} onActiveChange={setActive} />
      </div>
    </>
  );
}
