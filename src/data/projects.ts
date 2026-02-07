export interface Project {
  slug: string
  title: string
  shortDescription: string
  description: string
  highlights: string[]
  tech: string[]
  githubUrl: string
}

export const projects: Project[] = [
  {
    slug: "debugbox",
    title: "debugbox",
    shortDescription:
      "Lightweight Kubernetes debug containers optimized for real-world cluster troubleshooting.",
    description:
      "Most Kubernetes debugging images are heavy and overkill. Pulling a 200+ MB image just to run curl or dig is slow and wasteful. debugbox provides tiered debug images optimized for different debugging depths. The goal is to reduce pull time, bandwidth usage, and operational friction during live cluster debugging.",
    highlights: [
      "Ultra-light debug images (~15 MB) for fast incident response",
      "Balanced and power variants for deeper troubleshooting",
      "Lower bandwidth usage and reduced cluster cost",
      "Designed for real production debugging, not demos",
    ],
    tech: ["Kubernetes", "Containers", "Linux", "Networking"],
    githubUrl: "https://github.com/ibtisam-iq/debugbox",
  },

  {
    slug: "nectar",
    title: "Nectar",
    shortDescription:
      "A long-form engineering knowledge system documenting how I understand and design infrastructure and distributed systems.",
    description:
      "Nectar is my personal engineering knowledge system. It is not a collection of notes or tutorials, but a continuously evolving body of written understanding focused on why systems behave the way they do in production.\n\nEvery concept I study is broken down, challenged, rewritten, and refined until it can be clearly explained and practically applied. Writing is used as an engineering tool — to eliminate shallow learning, reduce knowledge decay, and improve decision-making under real-world constraints.\n\nEach topic follows a strict structure: real-world problem, why it matters in production, possible solution paths, trade-offs, failure modes, and a final engineering rule. This system directly shapes how I design Kubernetes platforms, infrastructure, and debugging workflows.",
    highlights: [
      "Production-focused system design explanations",
      "Emphasis on trade-offs, failure modes, and constraints",
      "Structured writing to prevent shallow tool usage",
      "Acts as a long-term engineering memory system",
    ],
    tech: [
      "Systems Thinking",
      "Kubernetes",
      "Networking",
      "Linux",
      "Architecture",
    ],
    githubUrl: "https://github.com/ibtisam-iq/nectar",
  },
]

