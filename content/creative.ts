import type { WorkItem } from "./types";

export const creativeWork: WorkItem[] = [
  {
    slug: "promo-video",
    title: "Promo videos",
    summary:
      "Event recaps and recruitment films for my student association. Shot and cut by me.",
    tags: ["Video", "Editing", "Storytelling"],
    media: {
      kind: "video",
      src: "/creative/promo.mp4",
      poster: "/creative/promo-poster.jpg",
      alt: "Student association promo film: a member hyping up the kit against a brick wall.",
      width: 540,
      height: 960,
    },
  },
  {
    slug: "posters",
    title: "Posters & graphics",
    summary:
      "Event and campaign posters built to cut through a crowded board.",
    tags: ["Graphic design", "Print", "Branding"],
  },
  {
    slug: "social",
    title: "Social content",
    summary:
      "Social campaigns that grew the student association's reach.",
    tags: ["Social", "Content", "Campaigns"],
    // first = the hero still; the rest fan out on hover
    gallery: [
      {
        src: "/creative/social/sven.jpg",
        alt: "Sven is een Ridder, a recruitment post.",
      },
      {
        src: "/creative/social/bryan.jpg",
        alt: "Bryan is een Ridder, a recruitment post.",
      },
      {
        src: "/creative/social/servaas.jpg",
        alt: "Servaas is een Ridder, a recruitment post.",
      },
    ],
  },
];
