import type { WorkItem } from "./types";

/**
 * Aaron's BSc Computer Science thesis (University of Amsterdam, 2024).
 * `repo` → the GitHub framework, `href` → the thesis PDF (served from /public).
 */
export const thesis: WorkItem = {
  slug: "thesis",
  title: "Projection-Based Interaction using Tangible Objects",
  org: "University of Amsterdam",
  period: "BSc Computer Science · 2024",
  summary:
    "A modular Mixed Reality framework in Unity that turns any surface into an interactive space: a camera and projector track real objects and give them a digital double. The reusable parts are detailed below.",
  highlights: [
    "Modular MR framework: calibration, object init, and detection as reusable parts",
    "Camera + projector pipeline that tracks tangible objects in real time",
    "Demonstrated with an interactive RGB colour-mixing application",
  ],
  tags: ["Mixed Reality", "Unity", "C#", "Computer Vision"],
  repo: "https://github.com/AaronMetzelaar/MRFramework",
  href: "/aaron-metzelaar-thesis.pdf",
};
