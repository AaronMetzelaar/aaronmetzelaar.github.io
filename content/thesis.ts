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
    "My bachelor thesis: a modular Mixed Reality framework, built in Unity, that turns any surface into an interactive space. A camera and projector track real, tangible objects and give them a digital double. The calibration, object-initialisation, and object-detection parts are all reusable, and I demonstrated them with a live RGB colour-mixing app.",
  highlights: [
    "Modular MR framework: calibration, object init, and detection as reusable parts",
    "Camera + projector pipeline that tracks tangible objects in real time",
    "Demonstrated with an interactive RGB colour-mixing application",
  ],
  tags: ["Mixed Reality", "Unity", "C#", "Computer Vision"],
  repo: "https://github.com/AaronMetzelaar/MRFramework",
  href: "/aaron-metzelaar-thesis.pdf",
};
