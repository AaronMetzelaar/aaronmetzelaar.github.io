import { cn } from "@/lib/utils";
import { CursorScope } from "./cursor-scope";
import styles from "./field-hero.module.css";
import { HeroText, StatusBar } from "./hero-content";

/** The locked dot-field hero: cursor-reactive blue dots + interactive name. */
export function FieldHero() {
  return (
    <CursorScope className="flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className={cn(styles.field, "pointer-events-none absolute inset-0")}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 sm:px-10">
        <StatusBar />
        <div className="flex flex-1 flex-col justify-center py-20">
          <HeroText />
        </div>
      </div>
    </CursorScope>
  );
}
