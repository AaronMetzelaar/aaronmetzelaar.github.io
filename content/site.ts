export const site = {
  name: "Aaron Metzelaar",
  initials: "AM",
  location: "Netherlands",
  email: "aaronmetzelaar@gmail.com",
  socials: {
    github: "https://github.com/AaronMetzelaar",
    githubHandle: "AaronMetzelaar",
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
    // Matches the section's own heading ("Harness engineering") so a click and
    // its destination read as the same thing, while keeping the AI keyword.
    { label: "AI harness", href: "#ai" },
    { label: "Thesis", href: "#thesis" },
    { label: "Creative", href: "#creative" },
    { label: "Contact", href: "#contact" },
  ],
};

export const about = [
  "I'm a software engineer who likes building things that feel simple on the outside and solid underneath. I work across product and frontend engineering, and increasingly on the internal AI tooling my team builds with.",
  "I like turning unclear ideas into practical solutions people actually enjoy using, and helping the team work smarter along the way.",
];

// A short trajectory rendered as a vertical ledger in About: each rung is a
// step up in leverage, from the interface users touch to the tooling the whole
// team builds with. This is what "one layer up" means, made concrete.
export const trajectory = [
  {
    k: "Interface",
    v: "The products collectors use: the MWS marketplace on web and in the app.",
  },
  {
    k: "System",
    v: "The internal AI tooling underneath it: skills, hooks, and reviewers.",
  },
  { k: "Leverage", v: "Tooling the whole team now builds with every day." },
];
