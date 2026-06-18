import type { WorkItem } from "./types";

export const aiWork: WorkItem[] = [
  {
    slug: "agent-architecture",
    title: "AI & agent architecture",
    summary:
      "Designing how a team builds with AI agents. The conventions, guardrails, and structure that keep agentic development reliable instead of chaotic.",
    highlights: [
      "Standards and patterns other developers build on top of",
      "Guardrails that keep agent output safe and reviewable",
    ],
    tags: ["Agents", "Architecture", "DX"],
  },
  {
    slug: "skills-and-hooks",
    title: "Skills & hooks",
    summary:
      "Authoring reusable agent skills and lifecycle hooks that other developers use day to day, turning repeated workflows into one-command operations.",
    highlights: [
      "Reusable skills that codify team workflows",
      "Hooks that automate the boring, error-prone steps",
    ],
    tags: ["Claude Code", "Skills", "Hooks", "Automation"],
  },
  {
    slug: "agentic-workflows",
    title: "Agentic workflows",
    summary:
      "Building multi-step, mostly-autonomous workflows for review, admin, and research. They run on their own, with a human in the loop where it matters.",
    highlights: [
      "Multi-agent pipelines for review and research",
      "Human-in-the-loop checkpoints on high-stakes steps",
    ],
    tags: ["Workflows", "MCP", "Tooling"],
  },
];
