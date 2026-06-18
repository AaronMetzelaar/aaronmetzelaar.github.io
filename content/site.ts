export const site = {
  name: "Aaron Metzelaar",
  initials: "AM",
  role: "Frontend Developer",
  roleLine: "Frontend developer × AI / agentic engineer",
  tagline:
    "I build the interface — and the AI system the team builds it with.",
  // A line Aaron loves — the range that resists a single job title.
  beyondLine: "The part that does not fit in a job title yet.",
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
  "I'm a frontend developer based in the Netherlands, three years into shipping production interfaces at MWS — across web and mobile.",
  "I like clean systems, sharp typography, and tools that disappear into the work.",
];

// The "one layer up" story as a trajectory — rendered as a vertical ledger in
// About. Each rung is a layer Aaron moved up to, interface → system → agentic.
export const trajectory = [
  { k: "Interface", v: "Production UI at MWS — web and mobile, shipped." },
  { k: "System", v: "The AI & agentic architecture the team builds with." },
  { k: "Agentic", v: "Skills, hooks, and reviewers that move other devs faster." },
];
