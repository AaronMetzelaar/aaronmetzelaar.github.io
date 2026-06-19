import type { WorkItem } from "./types";

export const experienceMeta = {
  company: "MWS",
  companyUrl: "https://mws.com",
  role: "Frontend Developer",
  period: "Since 2023",
  summary:
    "MWS is the marketplace for authenticated match-worn shirts and memorabilia. For three years I've worked across its frontend: the consumer platform, the tooling behind it, and the app. A few standout features are mine end to end.",
};

export const experience: WorkItem[] = [
  {
    slug: "platform",
    title: "Marketplace platform",
    org: "MWS",
    period: "Nuxt 3 · Vue 3 · TypeScript",
    tagline: "Auctions, bidding, and checkout for collectors worldwide.",
    summary:
      "The consumer marketplace where collectors bid on authenticated shirts: auctions, bidding, checkout. Plus the internal admin that runs the catalog and auctions behind it.",
    highlights: [
      "Auction, bidding, and checkout flows used by collectors worldwide",
      "Data-dense admin interfaces for catalog and auction management",
      "Shared design-system and component work across the Nuxt app",
      "Performance and accessibility passes on high-traffic pages",
    ],
    tags: ["Nuxt 3", "Vue 3", "TypeScript"],
    media: {
      kind: "video",
      src: "/work/marketplace.mp4",
      poster: "/work/marketplace-poster.jpg",
      alt: "The MWS marketplace on mws.com: the live homepage and an auction event page.",
      width: 1280,
      height: 558,
    },
  },
  {
    slug: "configurator",
    title: "Frame the Game configurator",
    org: "MWS",
    period: "Interactive product builder",
    tagline: "Design your own framed shirt, previewed live before you order.",
    summary:
      "An interactive configurator for designing your own framed shirt. Pick the frame, layout, and finishing, and watch the result update live before you order.",
    highlights: [
      "Real-time visual preview of a custom framed shirt",
      "Guided, step-by-step configuration flow",
      "Built to feel tactile and immediate, not like a form",
    ],
    tags: ["Vue", "Interactive", "Configurator"],
    media: {
      kind: "video",
      src: "/work/configurator.mp4",
      poster: "/work/configurator-poster.jpg",
      alt: "The Frame the Game configurator: choosing sleeves, frame, and background for a framed AC Milan shirt, previewed live.",
      width: 1280,
      height: 752,
    },
    mediaMobile: {
      kind: "video",
      src: "/work/configurator-mobile.mp4",
      poster: "/work/configurator-mobile-poster.jpg",
      alt: "The Frame the Game configurator on mobile.",
      width: 540,
      height: 1182,
    },
  },
  {
    slug: "product-360",
    title: "360° product imaging",
    org: "MWS",
    period: "Tooling · Media",
    tagline: "Turn a row of photographs into one spinnable object.",
    summary:
      "A way to shoot and show products in 360°, so a shirt can be inspected from every angle. It turns a row of photographs into a single spinnable object on the page.",
    highlights: [
      "Capture-to-web pipeline for 360° product spins",
      "Smooth, draggable viewer tuned for detail and weight",
    ],
    tags: ["360°", "Media", "Tooling"],
    media: {
      kind: "video",
      src: "/work/shirts-360.mp4",
      poster: "/work/shirts-360-poster.jpg",
      alt: "Signed shirts lit and slowly turning, dissolving one into the next, captured for 360-degree product viewing.",
      width: 900,
      height: 1124,
    },
  },
  {
    slug: "mobile",
    title: "Mobile app",
    org: "MWS",
    period: "React Native",
    tagline: "Bidding and collecting, native on iOS and Android.",
    summary:
      "The MWS app for iOS and Android. Bidding and collecting on mobile, with native-feeling interactions and patterns shared cleanly across both platforms.",
    highlights: [
      "Cross-platform screens and navigation in React Native",
      "Shared interaction patterns across iOS and Android",
    ],
    tags: ["React Native", "iOS", "Android"],
  },
];
