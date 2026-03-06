import type { SidePanelContent } from '../types';

export const panelData: Record<string, SidePanelContent> = {
  about: {
    title: 'Francis Escares Padua',
    subtitle: 'CS @ UCI \'27 | Developer | Builder',
    sections: [
      { data: { kind: 'image', alt: 'Francis Padua' } },
      { label: 'Interests & Hobbies', data: { kind: 'tags', items: [
        { label: 'Matcha' },
        { label: 'Keyboards' },
        { label: 'Terraria' },
        { label: 'League of Legends' },
        { label: 'Software Dev' },
        { label: 'Cybersecurity' },
        { label: 'Anime' },
        { label: 'Manga' },
      ]}},
    ],
  },

  antalmanac: {
    title: 'AntAlmanac',
    subtitle: 'Software Developer | Nov 2025 - Present',
    sections: [
      { data: { kind: 'image', alt: 'AntAlmanac Preview' } },
      { label: 'Links', data: { kind: 'links', items: [
        { label: 'AntAlmanac Website', url: 'https://antalmanac.com' },
        { label: 'GitHub Repository', url: 'https://github.com/icssc/AntAlmanac' },
      ]}},
      { data: { kind: 'text', content: 'Course scheduler for UCI students, serving 17,000+ users. Optimized search latency by 30% with constant-time lookups.' }},
    ],
  },

  cyberuci: {
    title: 'Cyber@UCI',
    subtitle: 'Infrastructure Engineer | Nov 2025 - Present',
    sections: [
      { data: { kind: 'image', alt: 'Cyber@UCI Team' } },
      { label: 'Links', data: { kind: 'links', items: [
        { label: 'Cyber@UCI Website', url: 'https://cyberuci.com' },
      ]}},
      { data: { kind: 'text', content: 'Deployed Proxmox virtualization environments and engineered VMs hosting Kubernetes, Docker, and Apache services.' }},
    ],
  },

  northstar: {
    title: 'Northstar',
    subtitle: 'Go, React, TypeScript, ConnectRPC, SQLite',
    sections: [
      { data: { kind: 'image', alt: 'Northstar Preview' } },
      { label: 'Links', data: { kind: 'links', items: [
        { label: 'GitHub Repository', url: 'https://github.com/sicn4rf/northstar' },
      ]}},
      { data: { kind: 'text', content: 'Self-contained binary for instant deployment on air-gapped Linux hosts. Type-safe backend with ConnectRPC and GORM.' }},
    ],
  },

  phoenix: {
    title: 'Phoenix',
    subtitle: 'Go, MCP, ConnectRPC',
    sections: [
      { data: { kind: 'image', alt: 'Phoenix Preview' } },
      { label: 'Links', data: { kind: 'links', items: [
        { label: 'GitHub Repository', url: 'https://github.com/sicn4rf/phoenix' },
      ]}},
      { data: { kind: 'text', content: 'Custom MCP server connecting Northstar to Claude Code for autonomous agentic workflows on air-gapped infrastructure.' }},
    ],
  },

  cointegration: {
    title: 'Cointegration Analyzer',
    subtitle: 'C++, Python, Pandas',
    sections: [
      { data: { kind: 'image', alt: 'Cointegration Analyzer' } },
      { data: { kind: 'text', content: 'Pipeline analyzing 10,000 stock pairs for statistical arbitrage. Reduced computational overhead by 60% with C++.' }},
    ],
  },

  skillsLanguages: {
    title: 'Languages',
    sections: [
      { data: { kind: 'tags', items: [
        { label: 'Go' },
        { label: 'C++' },
        { label: 'Python' },
        { label: 'TypeScript' },
        { label: 'JavaScript' },
        { label: 'SQL' },
        { label: 'Bash' },
      ]}},
    ],
  },

  skillsFrameworks: {
    title: 'Frameworks',
    sections: [
      { data: { kind: 'tags', items: [
        { label: 'React' },
        { label: 'Tailwind CSS' },
        { label: 'MUI' },
        { label: 'ConnectRPC' },
        { label: 'GORM' },
        { label: 'Node.js' },
        { label: 'Next.js' },
        { label: 'tRPC' },
        { label: 'Vite' },
      ]}},
    ],
  },

  skillsInfra: {
    title: 'Infrastructure',
    sections: [
      { data: { kind: 'tags', items: [
        { label: 'Kubernetes' },
        { label: 'Docker' },
        { label: 'Ansible' },
        { label: 'Proxmox' },
        { label: 'GitHub Actions' },
        { label: 'Linux' },
        { label: 'Nginx' },
      ]}},
    ],
  },

  skillsTools: {
    title: 'Tools & Data',
    sections: [
      { data: { kind: 'tags', items: [
        { label: 'Protocol Buffers' },
        { label: 'SQLite' },
        { label: 'PostgreSQL' },
        { label: 'MySQL' },
        { label: 'pandas' },
        { label: 'NumPy' },
      ]}},
    ],
  },

  wrccdc: {
    title: 'WRCCDC',
    subtitle: '1st Place (vs. 30 Teams) | Nov 2025',
    sections: [
      { data: { kind: 'image', alt: 'WRCCDC Team Photo' } },
      { data: { kind: 'text', content: 'Secured critical Linux services within Kubernetes/Docker while defending against active adversaries. Orchestrated incident response workflows utilizing Claude Code (Phoenix).' }},
    ],
  },

  nowBuilding: {
    title: 'Currently Building',
    sections: [
      { data: { kind: 'text', content: 'Terminal Portfolio — this interactive portfolio you\'re using right now.\nPhoenix — MCP server connecting AI agents to air-gapped infrastructure.' }},
    ],
  },

  nowReading: {
    title: 'Reading / Watching',
    sections: [
      { data: { kind: 'gallery', items: [
        { alt: 'Designing Data-Intensive Applications' },
        { alt: 'Darknet Diaries' },
      ]}},
    ],
  },
};
