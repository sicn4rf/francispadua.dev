/**
 * Every résumé fact on the site lives here.
 *
 * Commands, the virtual filesystem, the side pane and the Kubernetes easter
 * eggs all read from this module. Restating a date or a metric inline in a
 * component is how the site drifted a year out of date the first time.
 */

export interface Role {
  id: string;
  org: string;
  title: string;
  start: string;
  end: string;
  location: string;
  bullets: string[];
  links?: { label: string; url: string }[];
  blurb: string;
}

export interface Project {
  id: string;
  name: string;
  stack: string[];
  date: string;
  bullets: string[];
  links?: { label: string; url: string }[];
  blurb: string;
}

export const profile = {
  name: 'Francis Escares Padua',
  short: 'Francis Padua',
  tagline: 'Platform & infrastructure engineering, and whatever the CCDC red team throws next.',
  subtitle: "CS @ UCI '28  ·  Platform Engineering  ·  Infrastructure & Security",
  email: 'paduaf@uci.edu',
  linkedin: 'linkedin.com/in/francis-e-padua',
  github: 'github.com/sicn4rf',
  githubUser: 'sicn4rf',
  site: 'francispadua.dev',
  bio: [
    "I'm a Computer Science student at UC Irvine, graduating June 2028.",
    'Most of my work sits underneath other people’s software: Kubernetes platforms, GitOps pipelines, CI supply-chain security, and the kind of Linux hardening you only learn by having a red team take your services down in real time.',
    'This past summer I was a Platform Engineering Intern at Resmed, where I built a CI/CD shell-injection detection library and a config layer that transpiles intent-based YAML into Helm values for EKS. Outside of that I lead engineering on AntAlmanac, UCI’s open-source course scheduler, and compete with Cyber@UCI.',
  ],
} as const;

export const education = [
  {
    id: 'uci',
    school: 'University of California, Irvine',
    degree: 'B.S. in Computer Science',
    detail: 'GPA: 3.97',
    dates: 'Expected June 2028',
  },
  {
    id: 'fullerton',
    school: 'Fullerton College',
    degree: 'Computer Science',
    detail: 'GPA: 4.00',
    dates: 'Sept 2023 — June 2025',
  },
];

export const experience: Role[] = [
  {
    id: 'resmed',
    org: 'Resmed',
    title: 'Platform Engineering Intern',
    start: 'Jun 2026',
    end: 'Sep 2026',
    location: 'San Diego, CA',
    bullets: [
      'Secured 60+ CI/CD workflows against shell injection vulnerabilities by building a detection library from 0 to 1.',
      'Abstracted EKS deployment complexity by transpiling intent-based configs to Helm values via TypeScript and Zod.',
      'Engineered a GitOps deployment layer with ArgoCD, cutting deployment latency from 5 minutes to 5 seconds.',
    ],
    links: [{ label: 'Resmed', url: 'https://www.resmed.com' }],
    blurb:
      'Platform engineering on an EKS-backed internal developer platform. Built a shell-injection detection library covering 60+ CI/CD workflows, a TypeScript/Zod layer that transpiles intent-based configs into Helm values, and an ArgoCD GitOps layer that took deployment latency from 5 minutes to 5 seconds.',
  },
  {
    id: 'antalmanac',
    org: 'AntAlmanac',
    title: 'Lead Software Engineer',
    start: 'Nov 2025',
    end: 'Present',
    location: 'Irvine, CA',
    bullets: [
      "Built UCI's open-source course scheduler (~17K users), leading design and release direction for 12 developers.",
      'Reduced search latency 30% by precomputing availability indexes, rendering live data via React and TypeScript.',
      'Automated quarterly course-data releases with GitHub Actions workflow, taking 3–4 manual PRs per term to zero.',
    ],
    links: [
      { label: 'antalmanac.com', url: 'https://antalmanac.com' },
      { label: 'github.com/icssc/AntAlmanac', url: 'https://github.com/icssc/AntAlmanac' },
    ],
    blurb:
      "UCI's open-source course scheduler, used by roughly 17,000 students. I lead design and release direction for a team of 12, cut search latency 30% by precomputing availability indexes, and automated the quarterly course-data release that used to take 3–4 hand-written PRs a term.",
  },
  {
    id: 'cyberuci',
    org: 'Cyber@UCI',
    title: 'Software Developer, Competitor',
    start: 'Nov 2025',
    end: 'Present',
    location: 'Irvine, CA',
    bullets: [
      'Emulated complex attack paths by architecting intentionally vulnerable enterprise Linux topologies via Proxmox.',
      'Enforced least-privilege network guardrails across 50+ critical Linux and WindowsOS services under active attack.',
      'Engineered Ansible automations to lock down vulnerable services across networks, neutralizing active backdoors.',
    ],
    links: [{ label: 'cyberuci.com', url: 'https://cyberuci.com' }],
    blurb:
      'Blue team for the National Collegiate Cyber Defense Competition. I build the intentionally vulnerable Proxmox topologies we train against, and during competition I hold least-privilege guardrails across 50+ Linux and Windows services while a professional red team works to keep them down.',
  },
  {
    id: 'csuf',
    org: 'California State University, Fullerton',
    title: 'Undergraduate Researcher',
    start: 'Jun 2025',
    end: 'Aug 2025',
    location: 'Fullerton, CA',
    bullets: [
      'Engineered a hybrid C++/Python pipeline to execute large-scale statistical arbitrage tests across 10K+ stock pairs.',
      'Optimized computation by designing a C++ correlation filter to cull non-viable pairs, reducing the search space.',
    ],
    blurb:
      'Quantitative finance research. A hybrid C++/Python pipeline running cointegration tests across 10,000+ stock pairs, fronted by a C++ correlation filter that culls non-viable pairs before the expensive statistical work runs.',
  },
];

export const projects: Project[] = [
  {
    id: 'northstar',
    name: 'Northstar',
    stack: ['Go', 'React', 'TypeScript', 'ConnectRPC', 'SQLite', 'GORM'],
    date: 'Jan 2026',
    bullets: [
      'Built a real-time host management dashboard by packing a React/Vite UI and SQLite database into single Go binary.',
      'Redesigned credential handling to store zero passwords in the dashboard, mitigating secret leaks on compromise.',
      'Eliminated stale telemetry for dashboard operators by resolving WebSocket race conditions via buffered channels.',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/sicn4rf/northstar' }],
    blurb:
      'A real-time host management dashboard that ships as one Go binary — React/Vite UI and SQLite database packed inside, so it drops onto an air-gapped host with no install step. Stores zero passwords, so compromising the dashboard yields no credentials.',
  },
  {
    id: 'hypernova',
    name: 'Hypernova',
    stack: ['Go', 'Model Context Protocol (MCP)', 'ConnectRPC'],
    date: 'Feb 2026',
    bullets: [
      'Engineered an MCP server in Go enabling AI agents to access critical service hardening and threat detection tools.',
      'Exposed SSH command execution, playbook automation, log parsing, and Northstar APIs as typed tools for agents.',
      "Designed credentials to be out of agents' context via index references, and gated mutating tools behind approval.",
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/sicn4rf/hypernova' }],
    blurb:
      'An MCP server that gives AI agents real incident-response tooling — SSH execution, Ansible playbooks, log parsing, the Northstar API — as typed tools. Credentials never enter the agent’s context; the agent passes an index reference and the server resolves it. Anything that mutates state is gated behind human approval.',
  },
];

export const awards = [
  {
    id: 'nccdc',
    name: 'National Collegiate Cyber Defense Competition',
    date: 'Apr 2026',
    placements: ['1st Place in National Wild Card', '8th Place in Nationals'],
  },
  {
    id: 'wrccdc',
    name: 'Western Region Collegiate Cyber Defense Competition',
    date: 'Feb 2026 — Mar 2026',
    placements: ['1st Place in Qualifiers', '2nd Place in Regionals'],
  },
];

export const skills = {
  Languages: ['Go', 'C++', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash'],
  Frameworks: [
    'React',
    'Next.js',
    'tRPC',
    'ConnectRPC',
    'Protobuf',
    'Node.js',
    'Vite',
    'MUI',
    'Tailwind CSS',
    'Drizzle',
  ],
  Infrastructure: [
    'Kubernetes',
    'Helm',
    'ArgoCD',
    'AWS EKS',
    'Envoy Gateway',
    'Kyverno',
    'Ansible',
    'Proxmox',
    'GitHub Actions',
    'Gravitee',
  ],
};

export const now = {
  Building: [
    'This portfolio — a terminal you can actually use, deployed on Vercel.',
    'Hypernova — extending the MCP tool surface for incident response.',
  ],
  Learning: [
    'Envoy Gateway and the Gateway API, after living in Ingress for a year.',
    'Kyverno policy authoring — admission control that fails loudly at deploy time rather than quietly at 3am.',
    'Distributed systems coursework, and enough Rust to be dangerous.',
  ],
  Reading: ['"Atomic Habits" — James Clear'],
  Watching: ['Jujutsu Kaisen S3', 'My Hero Academia', 'Fullmetal Alchemist: Brotherhood'],
  Goals: [
    'Return to platform engineering full-time after graduation.',
    'Take the CCDC national title — 8th place stings.',
    'Land a patch in a CNCF project.',
  ],
};

export const interests = [
  'Mechanical keyboards',
  'Matcha',
  'Homelab',
  'Zellij',
  'Terraria',
  'Anime',
];
