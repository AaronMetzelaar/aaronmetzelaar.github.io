import type { WorkItem } from "./types";

export const experienceMeta = {
  company: "MWS",
  companyUrl: "https://matchwornshirt.com",
  role: "Frontend Developer",
  period: "2023 — Present",
  summary:
    "MWS is the marketplace for authenticated match-worn sports shirts and memorabilia. Over three years I've built across its whole frontend — the consumer platform, the tooling behind it, and the app — plus a few standout product features.",
};

export const experience: WorkItem[] = [
  {
    slug: "platform",
    title: "Marketplace platform",
    org: "MWS",
    period: "Nuxt 3 · Vue 3 · TypeScript",
    tagline: "Auctions, bidding, and checkout for collectors worldwide.",
    summary:
      "The consumer marketplace where collectors bid on authenticated shirts — auctions, bidding, and checkout — plus the internal admin that runs catalog, auctions, and operations behind it.",
    highlights: [
      "Auction, bidding, and checkout flows used by collectors worldwide",
      "Data-dense admin interfaces for catalog and auction management",
      "Shared design-system and component work across the Nuxt app",
      "Performance and accessibility passes on high-traffic pages",
    ],
    tags: ["Nuxt 3", "Vue 3", "TypeScript"],
  },
  {
    slug: "configurator",
    title: "Frame the Game configurator",
    org: "MWS",
    period: "Interactive product builder",
    tagline: "Design your own framed shirt, previewed live before you order.",
    summary:
      "An interactive configurator that lets collectors design their own framed shirt — picking the frame, layout, and finishing and previewing the result live before they order.",
    highlights: [
      "Real-time visual preview of a custom framed shirt",
      "Guided, step-by-step configuration flow",
      "Built to feel tactile and immediate, not like a form",
    ],
    tags: ["Vue", "Interactive", "Configurator"],
  },
  {
    slug: "product-360",
    title: "360° product imaging",
    org: "MWS",
    period: "Tooling · Media",
    tagline: "Turn a row of photographs into one spinnable object.",
    summary:
      "A solution for shooting and presenting 360° images of products, so a shirt can be inspected from every angle — turning a row of photographs into a single spinnable object on the page.",
    highlights: [
      "Capture-to-web pipeline for 360° product spins",
      "Smooth, draggable viewer tuned for detail and weight",
    ],
    tags: ["360°", "Media", "Tooling"],
  },
  {
    slug: "mobile",
    title: "Mobile app",
    org: "MWS",
    period: "React Native",
    tagline: "Bidding and collecting, native on iOS and Android.",
    summary:
      "The MWS app for iOS and Android — bringing bidding and collecting to mobile with native-feeling interactions and patterns shared cleanly across platforms.",
    highlights: [
      "Cross-platform screens and navigation in React Native",
      "Shared interaction patterns across iOS and Android",
    ],
    tags: ["React Native", "iOS", "Android"],
  },
];
