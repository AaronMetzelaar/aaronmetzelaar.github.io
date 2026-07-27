/**
 * The AI / agentic development system Aaron set up in a production monorepo,
 * described as a data model the map renders. The horizontal axis is the
 * development lifecycle (`stages`); every `node` lands in the stage(s) where it
 * acts. Layers stack the system: the context that grounds every agent, the
 * skills that run the work, the stack-specific reviewers, and the hooks that
 * fire automatically. `deps` draws the connections between them.
 *
 * Deliberately pitched at the level of shape, not implementation: each node says what
 * it does, never where it lives. An earlier version carried a `source` field with
 * repo paths and trigger config, which published an employer's internal layout
 * for no reader benefit.
 */

export const stages = [
  "Context",
  "Plan",
  "Build",
  "Test",
  "Review",
  "Ship",
  "Operate",
] as const;

export type Stage = (typeof stages)[number];

export type Layer = "context" | "skill" | "reviewer" | "hook";

export const layers: { id: Layer; label: string; blurb: string }[] = [
  {
    id: "context",
    label: "Context",
    blurb:
      "The AGENTS.md files every agent reads first. House rules, one set per area.",
  },
  {
    id: "skill",
    label: "Skills",
    blurb:
      "Slash-invoked specialists. Each one owns a job, and the way we do it here.",
  },
  {
    id: "reviewer",
    label: "Reviewers",
    blurb:
      "Review personas, one per area. The review skill spawns the ones a change touches.",
  },
  {
    id: "hook",
    label: "Hooks",
    blurb:
      "Automation tied to lifecycle events. It fires on its own, no prompting.",
  },
];

export type ArchNode = {
  id: string;
  layer: Layer;
  /** Persona / role for skills + reviewers — the "professional" on the team. */
  role?: string;
  name: string;
  /** Lifecycle stages it spans (contiguous). */
  stages: Stage[];
  detail: string;
  /** Ids this node connects to (calls, spawns, or reads). */
  deps?: string[];
};

export const archNodes: ArchNode[] = [
  // ── Context ──────────────────────────────────────────────
  {
    id: "ctx-root",
    layer: "context",
    name: "Root AGENTS.md · CLAUDE.md",
    stages: ["Context", "Plan", "Build", "Review", "Ship"],
    detail:
      "Monorepo-wide house rules: the `task` runner as the single entry point, branch and commit conventions, and shipping through the project's own skills. Nested AGENTS.md files override it locally; nearest file wins.",
  },
  {
    id: "ctx-area",
    layer: "context",
    name: "Per-area rulebooks",
    stages: ["Context", "Build", "Review"],
    detail:
      "Every app and service carries its own AGENTS.md: the conventions, patterns, and pitfalls for that part of the stack. Agents read the nearest one, so each change is judged by the right local rules.",
  },

  // ── Skills ───────────────────────────────────────────────
  {
    id: "skill-commit",
    layer: "skill",
    role: "The Committer",
    name: "commit",
    stages: ["Ship"],
    detail:
      "Stages only the relevant files, branches off main when needed, and writes a conventional-commit message, never a blind git add -A.",
    deps: ["ctx-root"],
  },
  {
    id: "skill-pr",
    layer: "skill",
    role: "The Shipper",
    name: "pr",
    stages: ["Ship"],
    detail:
      "The full ship: commit, push with tracking, and open a GitHub PR with a structured body (references, change list, demo steps) after pre-flighting the gh CLI and auth.",
    deps: ["skill-commit", "ctx-root"],
  },
  {
    id: "skill-review",
    layer: "skill",
    role: "The Reviewer",
    name: "review",
    stages: ["Review"],
    detail:
      "Runs a full review pipeline and adds the stack reviewers to the persona pool, picked by what the change touches. Findings flow through one merge/dedup pass into a single structured report.",
    deps: ["rev-stack"],
  },
  {
    id: "skill-wbso",
    layer: "skill",
    role: "The Administrator",
    name: "report",
    stages: ["Operate"],
    detail:
      "An admin loop that audits authored PRs, commits, and reviews over a period, links each to its ticket (e.g. Linear), estimates the hours, and writes the summary back to a sheet.",
  },
  {
    id: "skill-context",
    layer: "skill",
    role: "The Localizer",
    name: "string context",
    stages: ["Operate"],
    detail:
      "Writes translator-ready context for the localization platform (e.g. Crowdin), disambiguating short words and ICU strings, and touching only the context field it owns.",
  },

  // ── Reviewers (stack-specific personas) ──────────────────
  {
    id: "rev-stack",
    layer: "reviewer",
    role: "Stack reviewers",
    name: "Per-area review personas",
    stages: ["Review"],
    detail:
      "A reviewer persona for each part of the stack. The review skill spawns only the ones a change touches and runs them in parallel; each checks its area against that area's rulebook, then findings merge into one report.",
    deps: ["ctx-area"],
  },

  // ── Hooks ────────────────────────────────────────────────
  {
    id: "hook-seed",
    layer: "hook",
    name: "Seed worktree env",
    stages: ["Context"],
    detail:
      "On session start (and on git worktree add, via post-checkout) copies .env and local secrets into a fresh worktree so codegen and tooling work immediately. One shared script, two triggers.",
  },
  {
    id: "hook-csharpier",
    layer: "hook",
    name: "Format on write",
    stages: ["Build"],
    detail:
      "A hook runs the language's formatter the moment a file is edited or written, so formatting never reaches review.",
  },
  {
    id: "hook-deps",
    layer: "hook",
    name: "Sync frontend deps",
    stages: ["Build"],
    detail:
      "After any edit, if a frontend's package.json or lockfile changed, it installs there to keep dependencies in sync automatically.",
  },
  {
    id: "hook-verify",
    layer: "hook",
    name: "Verify on stop",
    stages: ["Test"],
    detail:
      "At session end, Stop hooks run across changed modules: typecheck, lint, and unit tests (e.g. Vitest, Jest), plus a pass that prunes unused imports.",
  },
  {
    id: "hook-telemetry",
    layer: "hook",
    name: "Skill telemetry",
    stages: ["Operate"],
    detail:
      "Fires an analytics event (e.g. Mixpanel) whenever a skill is invoked, caught at both the Skill tool and the slash-command path, to track adoption without blocking the call.",
  },
];
