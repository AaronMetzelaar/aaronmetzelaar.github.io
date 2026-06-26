/**
 * The real AI / agentic development system Aaron set up in the MWS monorepo,
 * as a data model the schema page renders. The horizontal axis is the
 * development lifecycle (`stages`); every `node` lands in the stage(s) where it
 * acts. Layers stack the system: the context that grounds every agent, the
 * skills that run the work, the stack-specific reviewers, and the hooks that
 * fire automatically. `deps` draws the connections between them.
 *
 * Sourced from the monorepo's .claude config — settings.json hooks,
 * .agents/skills, .agents/agents reviewers, and the layered AGENTS.md files.
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
  /** Where it lives in the repo. */
  source?: string;
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
    source: "/AGENTS.md · /CLAUDE.md",
  },
  {
    id: "ctx-area",
    layer: "context",
    name: "Per-area rulebooks",
    stages: ["Context", "Build", "Review"],
    detail:
      "Every app and service carries its own AGENTS.md: the conventions, patterns, and pitfalls for that part of the stack. Agents read the nearest one, so each change is judged by the right local rules.",
    source: "nested AGENTS.md, one per area",
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
    source: ".agents/skills/mws-commit",
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
    source: ".agents/skills/mws-pr",
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
    source: ".agents/skills/mws-review",
    deps: ["rev-stack"],
  },
  {
    id: "skill-wbso",
    layer: "skill",
    role: "The Administrator",
    name: "wbso",
    stages: ["Operate"],
    detail:
      "The WBSO R&D-tax loop: audits authored PRs, commits, and reviews, links them to Linear tickets, estimates hours, and writes back to the sheet, under-claiming by default.",
    source: ".agents/skills/mws-wbso",
  },
  {
    id: "skill-context",
    layer: "skill",
    role: "The Localizer",
    name: "string context",
    stages: ["Operate"],
    detail:
      "Writes translator-ready context into Crowdin JSONL, disambiguating short words and ICU strings, touching only the ai_context field and leaving the rest intact.",
    source: ".agents/skills/context-extraction",
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
    source: ".agents/agents, one per area",
    deps: ["ctx-area"],
  },

  // ── Hooks ────────────────────────────────────────────────
  {
    id: "hook-seed",
    layer: "hook",
    name: "Seed worktree env",
    stages: ["Context"],
    detail:
      "On session start (and on git worktree add, via post-checkout) copies .env and LocalSecrets files into a fresh worktree so codegen and tooling work immediately. One shared script, two triggers.",
    source: "SessionStart · .githooks/post-checkout",
  },
  {
    id: "hook-csharpier",
    layer: "hook",
    name: "Format C#",
    stages: ["Build"],
    detail:
      "A PostToolUse hook runs CSharpier on every .cs file the moment it's edited or written, so formatting never reaches review.",
    source: "settings.json · PostToolUse Edit/Write(*.cs)",
  },
  {
    id: "hook-deps",
    layer: "hook",
    name: "Sync frontend deps",
    stages: ["Build"],
    detail:
      "After any edit, if a frontend's package.json or lockfile changed, it runs npm install there to keep dependencies in sync automatically.",
    source: "settings.json · PostToolUse",
  },
  {
    id: "hook-verify",
    layer: "hook",
    name: "Verify on stop",
    stages: ["Test"],
    detail:
      "At session end, Stop hooks run across changed modules: typecheck, lint, and unit tests (Vitest / Jest / NUnit), plus a Roslyn pass that prunes unused C# usings.",
    source: "settings.json · Stop",
  },
  {
    id: "hook-telemetry",
    layer: "hook",
    name: "Skill telemetry",
    stages: ["Operate"],
    detail:
      "Fires a Mixpanel event whenever a skill is invoked, caught at both the Skill tool and the /slash-command path, to track adoption without blocking the call.",
    source: "settings.json · PreToolUse · UserPromptSubmit",
  },
];
