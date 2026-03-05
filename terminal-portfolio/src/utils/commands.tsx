import React from 'react';
import styled from 'styled-components';
import type { Command } from '../types';
import { getNode, resolvePath } from './fileSystem';
import { themes } from '../styles/themes';
import { NEOFETCH, COW_TEMPLATE } from './asciiArt';

const Link = styled.a`
  color: ${({ theme }) => theme.colors.link};
  text-decoration: underline;
  cursor: pointer;
`;

// Man page styled components
const ManHeader = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.25rem;
`;

const ManSection = styled.div`
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.foreground};
  text-transform: uppercase;
`;

const ManEntry = styled.div`
  padding-left: 2rem;
  margin-bottom: 0.15rem;
  display: flex;
  gap: 1rem;
`;

const ManCmd = styled.span`
  color: ${({ theme }) => theme.colors.command};
  font-weight: bold;
  min-width: 120px;
  display: inline-block;
`;

const ManDesc = styled.span`
  color: ${({ theme }) => theme.colors.result};
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0.5rem 0;
`;

const ListItem = styled.li`
  margin-bottom: 0.4rem;
  display: flex;
  align-items: flex-start;
  &:before {
    content: '>';
    color: ${({ theme }) => theme.colors.prompt};
    margin-right: 0.75rem;
    font-weight: bold;
  }
`;

const SectionTitle = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.85em;
`;

const ProjectTitle = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.command};
`;

const TechStack = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9em;
  font-style: italic;
  margin-left: 0.5rem;
`;

const Pre = styled.pre`
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.4;
  white-space: pre;
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const DirName = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  font-weight: bold;
`;

const FileName = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
`;

const HiddenFile = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const SwatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const Swatch = styled.span<{ $bg: string; $fg: string; $accent: string }>`
  display: inline-flex;
  gap: 2px;
  padding: 2px 8px;
  border-radius: 3px;
  background: ${p => p.$bg};
  font-size: 0.85em;
  span:nth-child(1) { color: ${p => p.$fg}; }
  span:nth-child(2) { color: ${p => p.$accent}; }
`;

export const commands: Record<string, Command> = {
  help: {
    cmd: 'help',
    desc: 'List available commands',
    action: () => {
      const sections: [string, string[]][] = [
        ['NAVIGATION', ['about', 'experience', 'projects', 'skills', 'education', 'competitions', 'awards', 'contact', 'now']],
        ['FILE SYSTEM', ['ls', 'cd', 'cat', 'pwd']],
        ['INTERACTIVE', ['typingtest', 'snake', 'wordle']],
        ['SYSTEM', ['theme', 'sound', 'neofetch', 'clear']],
      ];

      return (
        <div>
          <ManHeader>PORTFOLIO(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User Commands&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PORTFOLIO(1)</ManHeader>
          <ManSection>NAME</ManSection>
          <ManEntry><ManDesc>portfolio - interactive terminal portfolio of Francis Padua</ManDesc></ManEntry>
          <ManSection>SYNOPSIS</ManSection>
          <ManEntry><ManDesc>command [args...]</ManDesc></ManEntry>
          {sections.map(([title, cmds]) => (
            <React.Fragment key={title}>
              <ManSection>{title}</ManSection>
              {cmds.map(c => (
                <ManEntry key={c}>
                  <ManCmd>{c}</ManCmd>
                  <ManDesc>{commands[c].desc}</ManDesc>
                </ManEntry>
              ))}
            </React.Fragment>
          ))}
          <ManSection>TIPS</ManSection>
          <ManEntry><ManDesc>Use arrow keys to navigate command history</ManDesc></ManEntry>
          <ManEntry><ManDesc>Press Tab for autocomplete</ManDesc></ManEntry>
          <ManEntry><ManDesc>Try: ls -a, cd projects, cat .secret</ManDesc></ManEntry>
        </div>
      );
    },
  },

  about: {
    cmd: 'about',
    desc: 'Learn about me',
    action: () => (
      <div>
        <div style={{ marginBottom: '0.5rem' }}>
          Hi! I'm <strong>Francis Escares Padua</strong>.
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          I'm a Computer Science student at the <strong>University of California, Irvine</strong> (Class of 2027),
          maintaining a 3.9 GPA. I have a strong background in software development and infrastructure engineering,
          with a passion for building robust systems and exploring cybersecurity.
        </div>
        <div>
          Currently, I work as a Software Developer for <strong>AntAlmanac</strong> and an Infrastructure Engineer for <strong>Cyber@UCI</strong>.
        </div>
      </div>
    ),
  },

  experience: {
    cmd: 'experience',
    desc: 'View my professional experience',
    action: () => (
      <div>
        <SectionTitle>Software Developer @ AntAlmanac</SectionTitle>
        <Muted>Nov 2025 -- Present | Irvine, CA</Muted>
        <List>
          <ListItem>Optimized search latency by 30% by implementing constant-time lookups in TypeScript, serving 17,000 users.</ListItem>
          <ListItem>Developed features to visualize course availability using React/MUI, improving user navigation experience.</ListItem>
          <ListItem>Automated data processing latency using TypeScript and Github Actions CI/CD reducing latency to &lt;60 minutes.</ListItem>
        </List>
        <SectionTitle>Infrastructure Engineer @ Cyber@UCI</SectionTitle>
        <Muted>Nov 2025 -- Present | Irvine, CA</Muted>
        <List>
          <ListItem>Deployed virtualization environments using Proxmox and Cloud-init to replicate complex network topologies.</ListItem>
          <ListItem>Engineered virtual machines hosting diverse open-source services including Kubernetes, Docker, and Apache.</ListItem>
          <ListItem>Developed internal tooling and scripts using Bash, Go, and Ansible to automate manual competition workflows.</ListItem>
        </List>
      </div>
    ),
  },

  projects: {
    cmd: 'projects',
    desc: 'View my technical projects',
    action: () => (
      <div>
        <List>
          <ListItem>
            <div>
              <div><ProjectTitle>Northstar</ProjectTitle><TechStack>[Go, React, TypeScript, ConnectRPC, SQLite]</TechStack></div>
              <div style={{ marginTop: '0.25rem' }}>Engineered a self-contained binary using Go and Vite enabling instant deployment on air-gapped Linux hosts. Architected a type-safe backend with ConnectRPC and GORM.</div>
            </div>
          </ListItem>
          <ListItem>
            <div>
              <div><ProjectTitle>Phoenix</ProjectTitle><TechStack>[Go, MCP, ConnectRPC]</TechStack></div>
              <div style={{ marginTop: '0.25rem' }}>Engineered a custom MCP server connecting Northstar to Claude Code enabling autonomous agentic workflows. Bridged the gap between AI agents and air-gapped infrastructure.</div>
            </div>
          </ListItem>
          <ListItem>
            <div>
              <div><ProjectTitle>Cointegration Analyzer</ProjectTitle><TechStack>[C++, Python, Pandas]</TechStack></div>
              <div style={{ marginTop: '0.25rem' }}>Pipeline analyzing 10,000 stock pairs for statistical arbitrage. Reduced computational overhead by 60% with C++.</div>
            </div>
          </ListItem>
        </List>
      </div>
    ),
  },

  skills: {
    cmd: 'skills',
    desc: 'View my technical skills',
    action: () => (
      <div>
        <SectionTitle>Languages</SectionTitle>
        <div>Go, C++, Python, TypeScript, JavaScript, SQL, Bash</div>
        <SectionTitle>Frameworks</SectionTitle>
        <div>React, Tailwind CSS, MUI, ConnectRPC, GORM, Node.js, Next.js, tRPC, Vite</div>
        <SectionTitle>Infrastructure</SectionTitle>
        <div>Kubernetes, Docker, Ansible, Proxmox, GitHub Actions, Linux, Nginx</div>
        <SectionTitle>Tools & Data</SectionTitle>
        <div>Protocol Buffers, SQLite, PostgreSQL, MySQL, pandas, NumPy</div>
      </div>
    ),
  },

  education: {
    cmd: 'education',
    desc: 'View my education',
    action: () => (
      <div>
        <SectionTitle>University of California, Irvine</SectionTitle>
        <div>B.S. in Computer Science (GPA 3.9/4.0)</div>
        <Muted>Expected June 2027</Muted>
        <SectionTitle>Fullerton College</SectionTitle>
        <div>Computer Science (GPA 4.0/4.0)</div>
        <Muted>Sept 2023 -- June 2025</Muted>
      </div>
    ),
  },

  competitions: {
    cmd: 'competitions',
    desc: 'View competition achievements',
    action: () => (
      <div>
        <SectionTitle>Western Regional Collegiate Cyber Defense Competition</SectionTitle>
        <div style={{ marginBottom: '0.5rem' }}><strong>1st Place</strong> (vs. 30 Teams) | Nov 2025 -- Present</div>
        <List>
          <ListItem>Secured critical Linux services within Kubernetes/Docker while defending against adversaries.</ListItem>
          <ListItem>Orchestrated incident response workflows utilizing Claude Code (Phoenix).</ListItem>
        </List>
      </div>
    ),
  },

  awards: {
    cmd: 'awards',
    desc: 'View awards & certifications',
    action: () => (
      <div>
        <SectionTitle>Awards & Competitions</SectionTitle>
        <List>
          <ListItem>
            <div>
              <strong>WRCCDC 1st Place</strong> <Muted>(vs. 30 Teams) | Nov 2025</Muted>
              <div>Secured critical Linux services within Kubernetes/Docker while defending against active adversaries.</div>
            </div>
          </ListItem>
        </List>
      </div>
    ),
  },

  now: {
    cmd: 'now',
    desc: "What I'm up to right now",
    action: () => (
      <div>
        <SectionTitle>Building</SectionTitle>
        <List>
          <ListItem>Terminal Portfolio — this interactive portfolio you're using right now</ListItem>
          <ListItem>Phoenix — MCP server connecting AI agents to air-gapped infrastructure</ListItem>
        </List>
        <SectionTitle>Learning</SectionTitle>
        <List>
          <ListItem>Advanced Kubernetes networking and service mesh</ListItem>
          <ListItem>Systems programming in Go and Rust</ListItem>
        </List>
        <SectionTitle>Reading / Listening</SectionTitle>
        <List>
          <ListItem>"Designing Data-Intensive Applications" by Martin Kleppmann</ListItem>
          <ListItem>Darknet Diaries podcast</ListItem>
        </List>
        <SectionTitle>Goals</SectionTitle>
        <List>
          <ListItem>Land a summer 2026 SWE internship</ListItem>
          <ListItem>Contribute to open-source infrastructure tooling</ListItem>
          <ListItem>Defend WRCCDC title</ListItem>
        </List>
      </div>
    ),
  },

  contact: {
    cmd: 'contact',
    desc: 'Get in touch',
    action: () => (
      <div>
        <List>
          <ListItem>Email: <Link href="mailto:paduaf@uci.edu">paduaf@uci.edu</Link></ListItem>
          <ListItem>LinkedIn: <Link href="https://linkedin.com/in/francis-e-padua" target="_blank">linkedin.com/in/francis-e-padua</Link></ListItem>
          <ListItem>GitHub: <Link href="https://github.com/sicn4rf" target="_blank">github.com/sicn4rf</Link></ListItem>
          <ListItem>Phone: +1 661-844-0230</ListItem>
        </List>
      </div>
    ),
  },

  // File system commands
  ls: {
    cmd: 'ls',
    desc: 'List directory contents',
    action: (args, ctx) => {
      const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const targetPath = args.find(a => !a.startsWith('-')) || ctx.cwd;
      const resolved = targetPath === ctx.cwd ? ctx.cwd : resolvePath(ctx.cwd, targetPath);
      const node = getNode(resolved);

      if (!node) return `ls: cannot access '${targetPath}': No such file or directory`;
      if (node.type === 'file') return node.name;

      const entries = Object.values(node.children)
        .filter(child => showHidden || !child.hidden)
        .sort((a, b) => {
          if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });

      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1.5rem' }}>
          {showHidden && <Muted>./</Muted>}
          {showHidden && <Muted>../</Muted>}
          {entries.map(entry => (
            entry.type === 'directory'
              ? <DirName key={entry.name}>{entry.name}/</DirName>
              : entry.hidden
                ? <HiddenFile key={entry.name}>{entry.name}</HiddenFile>
                : <FileName key={entry.name}>{entry.name}</FileName>
          ))}
        </div>
      );
    },
  },

  cd: {
    cmd: 'cd',
    desc: 'Change directory',
    action: (args, ctx) => {
      const target = args[0] || '~';
      const resolved = resolvePath(ctx.cwd, target);
      const node = getNode(resolved);

      if (!node) return `cd: no such file or directory: ${target}`;
      if (node.type === 'file') return `cd: not a directory: ${target}`;

      ctx.setCwd(resolved);
      return '';
    },
  },

  cat: {
    cmd: 'cat',
    desc: 'Display file contents',
    action: (args, ctx) => {
      if (!args[0]) return 'usage: cat <filename>';
      const resolved = resolvePath(ctx.cwd, args[0]);
      const node = getNode(resolved);

      if (!node) return `cat: ${args[0]}: No such file or directory`;
      if (node.type === 'directory') return `cat: ${args[0]}: Is a directory`;

      return <Pre>{node.content}</Pre>;
    },
  },

  pwd: {
    cmd: 'pwd',
    desc: 'Print working directory',
    action: (_args, ctx) => ctx.cwd,
  },

  // System commands
  theme: {
    cmd: 'theme',
    desc: 'Change terminal theme',
    action: (args, ctx) => {
      if (!args[0] || args[0] === 'list') {
        return (
          <div>
            <div style={{ marginBottom: '0.5rem' }}>Available themes:</div>
            {Object.entries(themes).map(([name, t]) => (
              <SwatchRow key={name}>
                <span style={{ minWidth: '80px' }}>
                  {name === ctx.currentTheme ? '* ' : '  '}{name}
                </span>
                <Swatch $bg={t.colors.background} $fg={t.colors.foreground} $accent={t.colors.accent}>
                  <span>abc</span>
                  <span>xyz</span>
                </Swatch>
              </SwatchRow>
            ))}
            <Muted><br />Usage: theme set &lt;name&gt;</Muted>
          </div>
        );
      }

      if (args[0] === 'set' && args[1]) {
        const name = args[1].toLowerCase();
        if (!themes[name]) return `Unknown theme: ${name}. Try 'theme list'.`;
        ctx.setTheme(name);
        return `Theme set to ${name}.`;
      }

      return "Usage: theme list | theme set <name>";
    },
  },

  sound: {
    cmd: 'sound',
    desc: 'Toggle sound effects',
    action: (args, ctx) => {
      if (!args[0]) return `Sound is currently ${ctx.soundEnabled ? 'on' : 'off'} (volume: ${Math.round(ctx.soundVolume * 100)}%)`;
      if (args[0] === 'on') { ctx.setSoundEnabled(true); return 'Sound enabled.'; }
      if (args[0] === 'off') { ctx.setSoundEnabled(false); return 'Sound disabled.'; }
      if (args[0] === 'volume' && args[1]) {
        const vol = parseInt(args[1]);
        if (isNaN(vol) || vol < 0 || vol > 100) return 'Volume must be 0-100.';
        ctx.setSoundVolume(vol / 100);
        return `Volume set to ${vol}%.`;
      }
      return 'Usage: sound on|off|volume <0-100>';
    },
  },

  neofetch: {
    cmd: 'neofetch',
    desc: 'Display system info',
    action: (_args, ctx) => {
      const info = NEOFETCH.replace('cursor', ctx.currentTheme);
      return <Pre>{info}</Pre>;
    },
  },

  clear: {
    cmd: 'clear',
    desc: 'Clear the terminal',
    action: () => '',
  },

  // Easter eggs
  sudo: {
    cmd: 'sudo',
    desc: 'Run as superuser',
    action: () => "Nice try. You don't have root access here.",
  },

  rm: {
    cmd: 'rm',
    desc: 'Remove files',
    action: (args) => {
      if (args.some(a => a.includes('-rf') || a.includes('-r'))) {
        return "I'm not falling for that one.";
      }
      return 'rm: operation not permitted in portfolio mode';
    },
  },

  vim: {
    cmd: 'vim',
    desc: 'Open text editor',
    action: () => "You've entered vim. Good luck getting out. (just kidding, type any command)",
  },

  cowsay: {
    cmd: 'cowsay',
    desc: 'Make a cow say something',
    action: (args) => {
      const msg = args.join(' ') || 'moo';
      return <Pre>{COW_TEMPLATE(msg)}</Pre>;
    },
  },

  matrix: {
    cmd: 'matrix',
    desc: 'Enter the Matrix',
    action: (_args, ctx) => {
      const MatrixRainLauncher = React.lazy(() => import('../components/MatrixRain'));
      ctx.setActiveComponent(
        <React.Suspense fallback={null}>
          <MatrixRainLauncher onDone={() => ctx.setActiveComponent(null)} />
        </React.Suspense>
      );
      return 'Wake up, Neo...';
    },
  },

  // Interactive commands (render as components)
  typingtest: {
    cmd: 'typingtest',
    desc: 'Start a typing speed test',
    action: (args, ctx) => {
      const TypingTestLauncher = React.lazy(() => import('../components/TypingTest'));
      ctx.setActiveComponent(
        <React.Suspense fallback={<div>Loading typing test...</div>}>
          <TypingTestLauncher args={args} onExit={() => ctx.setActiveComponent(null)} />
        </React.Suspense>
      );
      return 'Starting typing test...';
    },
  },

  tt: {
    cmd: 'tt',
    desc: 'Alias for typingtest',
    action: (args, ctx) => commands.typingtest.action(args, ctx),
  },

  snake: {
    cmd: 'snake',
    desc: 'Play Snake',
    action: (_args, ctx) => {
      const SnakeLauncher = React.lazy(() => import('../components/Snake'));
      ctx.setActiveComponent(
        <React.Suspense fallback={<div>Loading snake...</div>}>
          <SnakeLauncher onExit={() => ctx.setActiveComponent(null)} />
        </React.Suspense>
      );
      return 'Starting Snake...';
    },
  },

  wordle: {
    cmd: 'wordle',
    desc: 'Play Wordle',
    action: (args, ctx) => {
      if (args[0] === 'stats') {
        const stats = JSON.parse(localStorage.getItem('portfolio:wordle-stats') || '{"played":0,"won":0,"streak":0}');
        return `Games: ${stats.played} | Won: ${stats.won} | Streak: ${stats.streak}`;
      }
      const WordleLauncher = React.lazy(() => import('../components/Wordle'));
      ctx.setActiveComponent(
        <React.Suspense fallback={<div>Loading wordle...</div>}>
          <WordleLauncher onExit={() => ctx.setActiveComponent(null)} />
        </React.Suspense>
      );
      return 'Starting Wordle...';
    },
  },
};
