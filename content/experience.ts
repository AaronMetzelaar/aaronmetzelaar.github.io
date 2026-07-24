import type { WorkItem } from "./types";

export const experienceMeta = {
  company: "MWS",
  companyUrl: "https://mws.com",
  role: "Frontend Engineer",
  period: "2023 – Present",
  summary:
    "MWS is the marketplace for authenticated match-worn shirts and sports memorabilia. I work across its frontend; the builds below are mine end to end.",
};

/**
 * The CV's Experience section: one role, told as themed areas of ownership
 * rather than a flat bullet list. Each area carries its own keyword row so a
 * recruiter (or an ATS) can scan the stack per theme. Only /cv renders this;
 * the homepage keeps using `experience` below.
 */
export const cvExperience: {
  area: string;
  bullets: string[];
  skills: string[];
}[] = [
  {
    area: "AI tooling & developer productivity",
    bullets: [
      "Designed and maintained the internal AI agent ecosystem for frontend and mobile engineering",
      "Built MCP servers, agent skills, and reusable workflows for codebase context, specialist code review, documentation, worktrees, and engineering automation",
      "Standardised team-wide AI adoption through shared tooling, guidance, and quality controls",
      "Increased AI co-authored PR adoption from 5% to 35% in four months",
    ],
    skills: [
      "AI agents",
      "Agentic workflows",
      "MCP servers",
      "Agent skills",
      "LLM tooling",
      "Prompt and context design",
      "Workflow automation",
      "Developer experience",
      "AI enablement",
    ],
  },
  {
    area: "Frontend & product engineering",
    bullets: [
      "Built and maintained customer-facing and internal features across web, mobile app, and admin tooling",
      "Designed interactive and spatial interfaces using real-time input, visual feedback, and reusable patterns to create intuitive user experiences",
      "Improved frontend maintainability through shared composables, reusable implementation patterns, refactoring, and documentation",
      "Designed product-critical workflows across CMS-driven content, operational tooling, translation flows, and cross-platform frontend logic",
      "Delivered solutions through cross-functional collaboration with product, design, marketing, support, and engineering",
    ],
    skills: [
      "Vue",
      "Nuxt",
      "React Native",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind",
      "WebGL / Three.js",
      "Interactive spatial interfaces",
      "Real-time interaction",
      "Component architecture",
      "Design systems",
      "Cross-platform frontend",
    ],
  },
  {
    area: "Localisation & content infrastructure",
    bullets: [
      "Revived a deadlocked translation project and turned it into a scalable multilingual publishing system",
      "Replaced a blocked backend-first approach with a practical localisation strategy across CMS content, UI copy, validation, and release workflows",
      "Reduced manual translation overhead and release risk with cleaner content structures, automated checks, and developer-friendly workflows",
      "Enabled reliable publishing across 12 languages for multiple products",
    ],
    skills: [
      "Architecture & solution design",
      "CMS integrations",
      "Internationalisation",
      "Automation",
      "CI/CD",
      "Storyblok",
      "Crowdin",
    ],
  },
  {
    area: "Payments, checkout & business impact",
    bullets: [
      "Introduced Klarna across web and app, establishing reusable payment logic for company products",
      "Improved checkout visibility and consistency, reducing unpaid orders by 40%",
      "Validated placement decisions through A/B testing, ad hoc analysis, and product research, prioritising high-impact implementation over unnecessary scope",
    ],
    skills: [
      "Payment integrations",
      "Checkout optimisation",
      "Klarna",
      "Conversion-focused UX",
      "A/B testing",
      "Data-informed decisions",
    ],
  },
  {
    area: "Engineering quality & team enablement",
    bullets: [
      "Top reviewer and contributor across web, app, and admin codebases",
      "Improved developer experience by standardising workflows, AI workflow guidance, documentation, and reusable engineering practices",
      "Coached engineers through presentations and hands-on sessions on AI-assisted development, code quality, workflow adoption, and responsible tool usage",
    ],
    skills: [
      "Code reviews",
      "Developer experience",
      "Technical coaching",
      "AI-assisted engineering",
      "Knowledge transfer",
      "Technical communication",
    ],
  },
];

/** Highlighted, metric-led projects for the CV. Rendered on /cv only. */
export const cvProjects: { name: string; result: string }[] = [
  {
    name: "Internal AI agent ecosystem",
    result:
      "Increased AI co-authored PR adoption from 5% to 35% by turning individual experimentation into structured team workflows",
  },
  {
    name: "Translation & localisation workflow",
    result:
      "Revived a stalled translation project and scaled multilingual publishing across 12 languages, 154,500+ CMS words, and 11,500+ strings",
  },
  {
    name: "Interactive frontend architecture",
    result:
      "Designed reusable spatial and 360° interaction patterns, contributing to 60% higher user engagement",
  },
  {
    name: "Mixed Reality framework",
    result:
      "Built a modular Unity framework combining computer vision, physical-object tracking, and responsive projected interfaces",
  },
];

export const experience: WorkItem[] = [
  {
    slug: "platform",
    title: "MWS marketplace",
    org: "MWS",
    period: "Nuxt 3 · Vue 3 · TypeScript",
    tagline: "Auctions, bidding, and checkout for collectors worldwide.",
    summary:
      "The consumer marketplace where collectors bid on authenticated match-worn shirts and sports memorabilia: auctions, bidding, checkout. Plus the internal admin that runs the catalog and auctions behind it.",
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
      alt: "The MWS marketplace on mws.com: the live homepage, an auction event page, and instant-buy.",
      width: 1280,
      height: 622,
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
    period: "Interaction · Web & app",
    tagline: "A draggable 360° view of every shirt, on web and in the app.",
    summary:
      "A way to inspect a shirt from every angle. I built the capture-to-web pipeline and the draggable viewer, with the interaction system and UI shipped on both web and the app.",
    highlights: [
      "Built the viewer's interaction system and UI, on web and in the app",
      "Capture-to-web pipeline that turns a row of photos into one spin",
    ],
    tags: ["360°", "Interaction", "Web & app"],
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
    media: {
      kind: "video",
      src: "/work/mobile.mp4",
      poster: "/work/mobile-poster.jpg",
      alt: "The MWS mobile app: browsing live auctions of match-worn shirts, with current bids.",
      width: 540,
      height: 1098,
    },
  },
];
