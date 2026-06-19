import type { WorkItem } from "./types";

export const aiWork: WorkItem[] = [
  {
    slug: "harness-engineering",
    title: "Harness engineering",
    summary:
      "The part I care about most. An agent is only as good as the harness around it, so I build that harness: the context it reads first, the skills it can run, the reviewers that check its work, and the hooks that fire on their own. Get it right and agentic development stays reliable instead of turning into a mess.",
    highlights: [
      "The standards and structure the rest of the team builds on",
      "Guardrails that keep agent output safe and reviewable",
    ],
    tags: ["Harness", "Agents", "DX"],
  },
  {
    slug: "skills-and-hooks",
    title: "Skills & hooks",
    summary:
      "Reusable agent skills and lifecycle hooks the team reaches for every day. They take a repeated, easy-to-get-wrong workflow and turn it into a single command.",
    highlights: [
      "Reusable skills that capture how we actually work",
      "Hooks that handle the boring, error-prone steps",
    ],
    tags: ["Claude Code", "Skills", "Hooks", "Automation"],
  },
  {
    slug: "agentic-workflows",
    title: "Agentic workflows",
    summary:
      "Multi-step, mostly-autonomous pipelines for review, admin, and research. They run on their own and pull a human in on the calls that actually matter.",
    highlights: [
      "Multi-agent pipelines for review and research",
      "Human-in-the-loop checkpoints on the high-stakes steps",
    ],
    tags: ["Workflows", "MCP", "Tooling"],
  },
];
