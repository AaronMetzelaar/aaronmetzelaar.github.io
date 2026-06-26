export const site = {
  name: "Aaron Metzelaar",
  initials: "AM",
  role: "Frontend Developer",
  roleLine: "Frontend developer × AI / agentic engineer",
  tagline: "I build the interface, and the AI tooling my team ships it with.",
  // A line Aaron loves: the range that resists a single job title.
  beyondLine: "The part that doesn't fit in a job title yet.",
  location: "Netherlands",
  age: 25,
  email: "aaronmetzelaar@gmail.com",
  socials: {
    github: "https://github.com/AaronMetzelaar",
    githubHandle: "AaronMetzelaar",
    linkedin: "",
  },
  education: {
    degree: "BSc Computer Science",
    school: "University of Amsterdam",
    year: "2024",
  },
  // Single source of truth for both the desktop links and the mobile menu.
  // Order matches the page sections so scroll-spy reads correctly.
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "AI & Agentic", href: "#ai" },
    { label: "Thesis", href: "#thesis" },
    { label: "Creative", href: "#creative" },
    { label: "Contact", href: "#contact" },
  ],
};

export const about = [
  "I work at the seam between design and engineering, where a good interface stops feeling like software. The same instinct keeps pulling me up a layer, toward the systems my whole team builds on.",
  "I care about intuitive interfaces, interactions that feel effortless, and tools that get out of the way.",
];

// A short trajectory rendered as a vertical ledger in About: each rung is a
// step up in leverage, from the interface users touch to the tooling the whole
// team builds with. This is what "one layer up" means, made concrete.
export const trajectory = [
  {
    k: "Interface",
    v: "The products collectors use: MWS on web and in the app.",
  },
  {
    k: "System",
    v: "The agentic dev setup underneath it: skills, hooks, reviewers.",
  },
  { k: "Leverage", v: "Tooling the whole team now builds with, every day." },
];
