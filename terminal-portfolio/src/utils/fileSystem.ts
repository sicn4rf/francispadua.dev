import type { FSNode, VirtualDirectory, VirtualFile } from '../types';

const file = (name: string, content: string, hidden = false): VirtualFile => ({
  type: 'file', name, content, hidden,
});

const dir = (name: string, children: Record<string, FSNode>, hidden = false): VirtualDirectory => ({
  type: 'directory', name, children, hidden,
});

export const fileSystem: VirtualDirectory = dir('~', {
  'about.txt': file('about.txt', [
    'Francis Escares Padua',
    'Computer Science @ UC Irvine (Class of 2027)',
    'GPA: 3.9/4.0',
    '',
    'Software Developer at AntAlmanac',
    'Infrastructure Engineer at Cyber@UCI',
    '',
    'Passionate about building robust systems,',
    'exploring cybersecurity, and shipping clean code.',
  ].join('\n')),

  'contact.txt': file('contact.txt', [
    'Email:    paduaf@uci.edu',
    'LinkedIn: linkedin.com/in/francis-e-padua',
    'GitHub:   github.com/sicn4rf',
    'Phone:    +1 661-844-0230',
  ].join('\n')),

  'skills.txt': file('skills.txt', [
    'LANGUAGES',
    '  Go, C++, Python, TypeScript, JavaScript, SQL, Bash',
    '',
    'FRAMEWORKS',
    '  React, Tailwind CSS, MUI, ConnectRPC, GORM, Node.js, Next.js, tRPC, Vite',
    '',
    'INFRASTRUCTURE',
    '  Kubernetes, Docker, Ansible, Proxmox, GitHub Actions, Linux, Nginx',
    '',
    'TOOLS & DATA',
    '  Protocol Buffers, SQLite, PostgreSQL, MySQL, pandas, NumPy',
  ].join('\n')),

  'now.txt': file('now.txt', [
    'WHAT I\'M UP TO RIGHT NOW',
    '========================',
    '',
    '> Building',
    '  - Terminal Portfolio — this interactive portfolio you\'re using right now',
    '  - Phoenix — MCP server connecting AI agents to air-gapped infrastructure',
    '',
    '> Learning',
    '  - Advanced Kubernetes networking and service mesh',
    '  - Systems programming in Go and Rust',
    '',
    '> Reading / Listening',
    '  - "Designing Data-Intensive Applications" by Martin Kleppmann',
    '  - Darknet Diaries podcast',
    '',
    '> Goals',
    '  - Land a summer 2026 SWE internship',
    '  - Contribute to open-source infrastructure tooling',
    '  - Defend WRCCDC title',
  ].join('\n')),

  'awards.txt': file('awards.txt', [
    'AWARDS & COMPETITIONS',
    '=====================',
    '',
    'Western Regional Collegiate Cyber Defense Competition',
    '  1st Place (vs. 30 Teams) | Nov 2025',
    '  Secured critical Linux services within Kubernetes/Docker',
    '  while defending against active adversaries.',
    '  Orchestrated incident response workflows utilizing Claude Code (Phoenix).',
  ].join('\n')),

  'projects': dir('projects', {
    'northstar.md': file('northstar.md', [
      'NORTHSTAR',
      'Tech: Go, React, TypeScript, ConnectRPC, SQLite',
      '',
      'Engineered a self-contained binary using Go and Vite',
      'enabling instant deployment on air-gapped Linux hosts.',
      'Architected a type-safe backend with ConnectRPC and GORM.',
    ].join('\n')),
    'phoenix.md': file('phoenix.md', [
      'PHOENIX',
      'Tech: Go, MCP, ConnectRPC',
      '',
      'Engineered a custom MCP server connecting Northstar',
      'to Claude Code enabling autonomous agentic workflows.',
      'Bridged the gap between AI agents and air-gapped infrastructure.',
    ].join('\n')),
    'cointegration-analyzer.md': file('cointegration-analyzer.md', [
      'COINTEGRATION ANALYZER',
      'Tech: C++, Python, Pandas',
      '',
      'Pipeline analyzing 10,000 stock pairs for statistical arbitrage.',
      'Reduced computational overhead by 60% with C++.',
    ].join('\n')),
  }),

  'experience': dir('experience', {
    'antalmanac.md': file('antalmanac.md', [
      'SOFTWARE DEVELOPER @ ANTALMANAC',
      'Nov 2025 -- Present | Irvine, CA',
      '',
      '- Optimized search latency by 30% by implementing',
      '  constant-time lookups in TypeScript, serving 17,000 users.',
      '- Developed features to visualize course availability',
      '  using React/MUI, improving user navigation experience.',
      '- Automated data processing latency using TypeScript',
      '  and GitHub Actions CI/CD reducing latency to <60 minutes.',
    ].join('\n')),
    'cyberuci.md': file('cyberuci.md', [
      'INFRASTRUCTURE ENGINEER @ CYBER@UCI',
      'Nov 2025 -- Present | Irvine, CA',
      '',
      '- Deployed virtualization environments using Proxmox',
      '  and Cloud-init to replicate complex network topologies.',
      '- Engineered virtual machines hosting diverse open-source',
      '  services including Kubernetes, Docker, and Apache.',
      '- Developed internal tooling and scripts using Bash, Go,',
      '  and Ansible to automate manual competition workflows.',
    ].join('\n')),
  }),

  'education': dir('education', {
    'uci.md': file('uci.md', [
      'UNIVERSITY OF CALIFORNIA, IRVINE',
      'B.S. in Computer Science (GPA 3.9/4.0)',
      'Expected June 2027',
    ].join('\n')),
    'fullerton.md': file('fullerton.md', [
      'FULLERTON COLLEGE',
      'Computer Science (GPA 4.0/4.0)',
      'Sept 2023 -- June 2025',
    ].join('\n')),
  }),

  '.secret': file('.secret', [
    '    You found the secret file!',
    '',
    '    "Any sufficiently advanced technology',
    '     is indistinguishable from magic."',
    '        — Arthur C. Clarke',
    '',
    '    P.S. Try the konami code ;)',
  ].join('\n'), true),

  '.bashrc': file('.bashrc', [
    '# ~/.bashrc - Francis\'s totally real shell config',
    '',
    'alias sleep="echo \'CS students don\'t sleep\'"',
    'alias fix="git commit -m \'fix\' && git push --force"  # don\'t do this',
    'alias pls="sudo"',
    'alias yeet="rm -rf"',
    'alias deploy="echo \'it works on my machine\' && exit"',
    '',
    'export PS1="visitor@portfolio:~$ "',
    'export EDITOR="vim"  # I use vim btw',
    'export PATH="$PATH:/usr/local/bin/coffee"',
    '',
    '# TODO: fix that one bug',
    '# TODO: fix that other bug',
    '# TODO: stop adding TODOs',
  ].join('\n'), true),
});

export function resolvePath(cwd: string, target: string): string {
  if (target === '~' || target === '/') return '~';
  if (target === '..') {
    if (cwd === '~') return '~';
    const parts = cwd.split('/');
    parts.pop();
    return parts.length === 1 ? '~' : parts.join('/');
  }

  const base = target.startsWith('~') ? '' : cwd;
  const fullPath = target.startsWith('~') ? target : `${base}/${target}`;
  const parts = fullPath.split('/').filter(Boolean);

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      if (resolved.length > 1) resolved.pop();
    } else if (part !== '.') {
      resolved.push(part);
    }
  }

  return resolved.length === 0 ? '~' : resolved.join('/');
}

export function getNode(path: string): FSNode | null {
  if (path === '~') return fileSystem;

  const parts = path.split('/').filter(p => p && p !== '~');
  let current: FSNode = fileSystem;

  for (const part of parts) {
    if (current.type !== 'directory') return null;
    const child = current.children[part];
    if (!child) return null;
    current = child;
  }

  return current;
}
