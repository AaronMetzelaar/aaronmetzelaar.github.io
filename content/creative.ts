import type { WorkItem } from "./types";

export const creativeWork: WorkItem[] = [
  {
    slug: "promo-video",
    title: "Film",
    // Leads with the craft; the association is a credit, not the headline.
    summary:
      "Event recaps and recruitment films, shot and cut by me for my student association.",
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
    slug: "social",
    title: "Poster series",
    summary:
      "Recruitment posters and social posts I designed, including the 'is een Ridder' run for my student association.",
    tags: ["Graphic design", "Posters", "Social"],
    // first = the hero still; the rest fan out on hover
    gallery: [
      {
        src: "/creative/social/sven.jpg",
        alt: "Sven is een Ridder, a recruitment poster.",
      },
      {
        src: "/creative/social/bryan.jpg",
        alt: "Bryan is een Ridder, a recruitment poster.",
      },
      {
        src: "/creative/social/servaas.jpg",
        alt: "Servaas is een Ridder, a recruitment poster.",
      },
    ],
  },
];
