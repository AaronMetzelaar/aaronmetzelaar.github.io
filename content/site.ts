export const site = {
  name: "Aaron Metzelaar",
  initials: "AM",
  role: "Frontend Developer",
  roleLine: "Frontend developer × AI / agentic engineer",
  tagline:
    "I build the interface, and the AI tooling my team ships it with.",
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
  "I'm a frontend developer in the Netherlands. For the last three years I've built MWS's web and mobile products.",
  "I care about clean systems, sharp typography, and tools that get out of the way.",
];

// The "one layer up" story as a trajectory, rendered as a vertical ledger in
// About. Each rung is a layer Aaron moved up to: interface, system, agentic.
export const trajectory = [
  { k: "Interface", v: "Production UI at MWS, on web and mobile." },
  { k: "System", v: "The AI and agentic setup my team builds with." },
  { k: "Agentic", v: "Skills, hooks, and reviewers that speed everyone up." },
];
