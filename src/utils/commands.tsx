import React from 'react';
import styled from 'styled-components';
import type { Command, TerminalContext } from '../types';
import { getNode, resolvePath } from './fileSystem';
import { themes, themeMeta } from '../styles/themes';
import { NEOFETCH_LOGO, neofetchInfo, COW_TEMPLATE } from './asciiArt';
import { audioManager } from './audioManager';
import type { SoundStyle } from './audioManager';
import { ClickableItem } from '../components/ClickableItem';
import { panelData } from './panelData';
import { clusterCommands } from './clusterCommands';
import {
  profile,
  education,
  experience,
  projects,
  awards,
  skills,
  now,
} from './content';
import {
  Link,
  SectionTitle,
  Muted,
  List,
  ListItem,
  Pre,
  Meta,
  Title,
  Stack,
} from './outputStyles';

/* ── Local styled bits ──────────────────────────────────────────────────── */

const ManHeader = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: bold;
  margin-bottom: 0.5rem;
  max-width: 640px;
`;

const ManSection = styled.div`
  margin-top: 0.9rem;
  margin-bottom: 0.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.foreground};
  letter-spacing: 0.5px;
`;

const ManEntry = styled.div`
  padding-left: 1.75rem;
  display: flex;
  gap: 1rem;
  margin-bottom: 0.1rem;
`;

const ManCmd = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  min-width: 132px;
  flex-shrink: 0;
`;

const ManDesc = styled.span`
  color: ${({ theme }) => theme.colors.result};
`;

const Entry = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
`;

const DirName = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  font-weight: bold;
`;

const FileName = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
`;

const HiddenName = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const SwatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.3rem;
`;

const ThemeName = styled.span<{ $active: boolean }>`
  min-width: 132px;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.foreground)};
`;

const Swatch = styled.span<{ $bg: string; $colors: string[] }>`
  display: inline-flex;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${p => p.$bg};

  span {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }
`;

const NeofetchLayout = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const NeofetchLogo = styled(Pre)`
  color: ${({ theme }) => theme.colors.accent};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0 1.5ch;
  align-content: start;
  line-height: 1.45;
`;

const InfoKey = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: bold;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.result};
`;

/* ── Helpers ────────────────────────────────────────────────────────────── */

const panel = (key: string, ctx: TerminalContext, children: React.ReactNode) => (
  <ClickableItem panel={panelData[key]} openSidePanel={ctx.openSidePanel}>
    {children}
  </ClickableItem>
);

/** Loads a heavy component lazily and hands it to the terminal body. */
const launch = (
  ctx: TerminalContext,
  importer: () => Promise<{ default: React.ComponentType<never> }>,
  props: Record<string, unknown>,
  label: string,
) => {
  const Lazy = React.lazy(importer as () => Promise<{ default: React.ComponentType }>);
  ctx.setActiveComponent(
    <React.Suspense fallback={<Muted>Loading {label}…</Muted>}>
      <Lazy {...props} />
    </React.Suspense>,
  );
  return '';
};

/* ── Command table ──────────────────────────────────────────────────────── */

export const commands: Record<string, Command> = {
  help: {
    cmd: 'help',
    desc: 'List available commands',
    action: () => {
      const sections: [string, string[]][] = [
        ['ABOUT ME', ['about', 'experience', 'projects', 'skills', 'education', 'awards', 'now', 'contact', 'resume']],
        ['FILESYSTEM', ['ls', 'cd', 'cat', 'pwd', 'tree']],
        ['SHELL', ['whoami', 'history', 'echo', 'date', 'uname', 'man', 'clear']],
        ['INTERACTIVE', ['typingtest', 'snake', 'wordle']],
        ['SYSTEM', ['theme', 'sound', 'neofetch']],
      ];

      return (
        <div>
          <ManHeader>
            <span>PORTFOLIO(1)</span>
            <span>User Commands</span>
            <span>PORTFOLIO(1)</span>
          </ManHeader>
          <ManSection>NAME</ManSection>
          <ManEntry>
            <ManDesc>portfolio — the interactive terminal portfolio of {profile.short}</ManDesc>
          </ManEntry>
          <ManSection>SYNOPSIS</ManSection>
          <ManEntry>
            <ManDesc>command [arguments...]</ManDesc>
          </ManEntry>
          {sections.map(([title, cmds]) => (
            <React.Fragment key={title}>
              <ManSection>{title}</ManSection>
              {cmds.map(c => (
                <ManEntry key={c}>
                  <ManCmd>{c}</ManCmd>
                  <ManDesc>{commands[c]?.desc}</ManDesc>
                </ManEntry>
              ))}
            </React.Fragment>
          ))}
          <ManSection>KEYS</ManSection>
          <ManEntry><ManCmd>Tab</ManCmd><ManDesc>complete a command or path</ManDesc></ManEntry>
          <ManEntry><ManCmd>↑ / ↓</ManCmd><ManDesc>walk back through command history</ManDesc></ManEntry>
          <ManEntry><ManCmd>Ctrl-p</ManCmd><ManDesc>toggle the details pane</ManDesc></ManEntry>
          <ManEntry><ManCmd>Ctrl-l</ManCmd><ManDesc>clear the screen</ManDesc></ManEntry>
          <ManSection>SEE ALSO</ManSection>
          <ManEntry>
            <ManDesc>
              <Muted>
                There is more here than this list. If you use a terminal for work, try the
                things you would actually type.
              </Muted>
            </ManDesc>
          </ManEntry>
        </div>
      );
    },
  },

  about: {
    cmd: 'about',
    desc: 'Who I am',
    action: (_args, ctx) =>
      panel(
        'about',
        ctx,
        <div>
          <div style={{ marginBottom: '0.6rem' }}>
            <Title>{profile.name}</Title>
          </div>
          {profile.bio.map((line, i) => (
            <div key={i} style={{ marginBottom: '0.5rem', maxWidth: '78ch' }}>
              {line}
            </div>
          ))}
        </div>,
      ),
  },

  experience: {
    cmd: 'experience',
    desc: 'Where I have worked',
    action: (_args, ctx) => (
      <div>
        {experience.map(role =>
          panel(
            role.id,
            ctx,
            <div key={role.id} style={{ marginBottom: '0.75rem' }}>
              <SectionTitle>
                {role.title} @ {role.org}
              </SectionTitle>
              <Meta>
                {role.start} — {role.end} · {role.location}
              </Meta>
              <List>
                {role.bullets.map((b, i) => (
                  <ListItem key={i}>{b}</ListItem>
                ))}
              </List>
            </div>,
          ),
        )}
      </div>
    ),
  },

  projects: {
    cmd: 'projects',
    desc: 'Things I have built',
    action: (_args, ctx) => (
      <div>
        {projects.map(p =>
          panel(
            p.id,
            ctx,
            <div key={p.id} style={{ marginBottom: '0.75rem' }}>
              <div>
                <Title>{p.name}</Title>
                <Stack>[{p.stack.join(', ')}]</Stack>
              </div>
              <Meta>{p.date}</Meta>
              <List>
                {p.bullets.map((b, i) => (
                  <ListItem key={i}>{b}</ListItem>
                ))}
              </List>
            </div>,
          ),
        )}
      </div>
    ),
  },

  skills: {
    cmd: 'skills',
    desc: 'What I work with',
    action: (_args, ctx) => (
      <div>
        {Object.entries(skills).map(([group, items]) =>
          panel(
            `skills.${group.toLowerCase()}`,
            ctx,
            <div key={group} style={{ marginBottom: '0.5rem' }}>
              <SectionTitle>{group}</SectionTitle>
              <div>{items.join(', ')}</div>
            </div>,
          ),
        )}
      </div>
    ),
  },

  education: {
    cmd: 'education',
    desc: 'Where I studied',
    action: () => (
      <div>
        {education.map(e => (
          <div key={e.id} style={{ marginBottom: '0.6rem' }}>
            <SectionTitle>{e.school}</SectionTitle>
            <div>
              {e.degree} · {e.detail}
            </div>
            <Meta>{e.dates}</Meta>
          </div>
        ))}
      </div>
    ),
  },

  awards: {
    cmd: 'awards',
    desc: 'Competition results',
    action: (_args, ctx) =>
      panel(
        'awards',
        ctx,
        <div>
          {awards.map(a => (
            <div key={a.id} style={{ marginBottom: '0.6rem' }}>
              <SectionTitle>{a.name}</SectionTitle>
              <Meta>{a.date}</Meta>
              <List>
                {a.placements.map((p, i) => (
                  <ListItem key={i}>{p}</ListItem>
                ))}
              </List>
            </div>
          ))}
        </div>,
      ),
  },

  now: {
    cmd: 'now',
    desc: 'What I am doing at the moment',
    action: (_args, ctx) =>
      panel(
        'now',
        ctx,
        <div>
          {Object.entries(now).map(([section, items]) => (
            <div key={section} style={{ marginBottom: '0.5rem' }}>
              <SectionTitle>{section}</SectionTitle>
              <List>
                {items.map((item, i) => (
                  <ListItem key={i}>{item}</ListItem>
                ))}
              </List>
            </div>
          ))}
          <Meta>Last updated September 2026.</Meta>
        </div>,
      ),
  },

  contact: {
    cmd: 'contact',
    desc: 'How to reach me',
    action: () => (
      <List>
        <ListItem>
          Email:&nbsp;&nbsp;&nbsp;&nbsp;<Link href={`mailto:${profile.email}`}>{profile.email}</Link>
        </ListItem>
        <ListItem>
          LinkedIn:&nbsp;
          <Link href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer">
            {profile.linkedin}
          </Link>
        </ListItem>
        <ListItem>
          GitHub:&nbsp;&nbsp;&nbsp;
          <Link href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer">
            {profile.github}
          </Link>
        </ListItem>
      </List>
    ),
  },

  resume: {
    cmd: 'resume',
    desc: 'Open my résumé (PDF)',
    action: () => {
      window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
      return (
        <div>
          Opening <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume.pdf</Link>…
          <Muted> (if your browser blocked it, use the link.)</Muted>
        </div>
      );
    },
  },

  /* ── Filesystem ───────────────────────────────────────────────────────── */

  ls: {
    cmd: 'ls',
    desc: 'List directory contents',
    action: (args, ctx) => {
      const flags = args.filter(a => a.startsWith('-')).join('');
      const showHidden = flags.includes('a');
      const longFormat = flags.includes('l');
      const target = args.find(a => !a.startsWith('-'));
      const resolved = target ? resolvePath(ctx.cwd, target) : ctx.cwd;
      const node = getNode(resolved);

      if (!node) return `ls: ${target}: No such file or directory`;
      if (node.type === 'file') return node.name;

      const entries = Object.values(node.children)
        .filter(child => showHidden || !child.hidden)
        .sort((a, b) => {
          if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });

      const name = (entry: (typeof entries)[number]) =>
        entry.type === 'directory' ? (
          <DirName>{entry.name}/</DirName>
        ) : entry.hidden ? (
          <HiddenName>{entry.name}</HiddenName>
        ) : (
          <FileName>{entry.name}</FileName>
        );

      if (longFormat) {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'max-content max-content 1fr', gap: '0 2ch' }}>
            {entries.map(entry => (
              <React.Fragment key={entry.name}>
                <Muted>{entry.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'}</Muted>
                <Muted style={{ textAlign: 'right' }}>
                  {entry.type === 'file' ? String(entry.content).length : 4096}
                </Muted>
                {name(entry)}
              </React.Fragment>
            ))}
          </div>
        );
      }

      return (
        <Entry>
          {showHidden && <Muted>./</Muted>}
          {showHidden && <Muted>../</Muted>}
          {entries.map(entry => (
            <React.Fragment key={entry.name}>{name(entry)}</React.Fragment>
          ))}
        </Entry>
      );
    },
  },

  cd: {
    cmd: 'cd',
    desc: 'Change directory',
    action: (args, ctx) => {
      const target = args[0] ?? '~';
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
    desc: 'Print a file',
    action: (args, ctx) => {
      if (!args[0]) return 'usage: cat <file>';
      const resolved = resolvePath(ctx.cwd, args[0]);
      const node = getNode(resolved);

      if (!node) return `cat: ${args[0]}: No such file or directory`;
      if (node.type === 'directory') return `cat: ${args[0]}: Is a directory`;

      return <Pre>{node.content}</Pre>;
    },
  },

  pwd: {
    cmd: 'pwd',
    desc: 'Print the working directory',
    action: (_args, ctx) => ctx.cwd.replace(/^~/, '/home/visitor'),
  },

  tree: {
    cmd: 'tree',
    desc: 'List the directory tree',
    action: (args, ctx) => {
      const showHidden = args.includes('-a');
      const root = getNode(ctx.cwd);
      if (!root || root.type !== 'directory') return `tree: ${ctx.cwd}: Not a directory`;

      const lines: string[] = [ctx.cwd];
      let dirs = 0;
      let files = 0;

      const walk = (node: typeof root, prefix: string) => {
        const children = Object.values(node.children)
          .filter(c => showHidden || !c.hidden)
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
            return a.name.localeCompare(b.name);
          });

        children.forEach((child, i) => {
          const last = i === children.length - 1;
          lines.push(`${prefix}${last ? '└── ' : '├── '}${child.name}`);
          if (child.type === 'directory') {
            dirs++;
            walk(child, `${prefix}${last ? '    ' : '│   '}`);
          } else {
            files++;
          }
        });
      };

      walk(root, '');
      lines.push('', `${dirs} directories, ${files} files`);
      return <Pre>{lines.join('\n')}</Pre>;
    },
  },

  /* ── Shell ────────────────────────────────────────────────────────────── */

  whoami: {
    cmd: 'whoami',
    desc: 'Print the current user',
    action: () => 'visitor',
  },

  history: {
    cmd: 'history',
    desc: 'Show the commands you have run',
    action: (args, ctx) => {
      if (args[0] === 'clear' || args[0] === '-c') {
        ctx.clearCommandHistory();
        return 'History cleared.';
      }
      if (ctx.commandHistory.length === 0) return 'No history yet.';
      return (
        <Pre>
          {ctx.commandHistory
            .map((cmd, i) => `${String(i + 1).padStart(4)}  ${cmd}`)
            .join('\n')}
        </Pre>
      );
    },
  },

  echo: {
    cmd: 'echo',
    desc: 'Print the arguments',
    action: args => args.join(' '),
  },

  date: {
    cmd: 'date',
    desc: 'Print the current date',
    action: () =>
      new Date().toString().replace(/\s\(.*\)$/, ''),
  },

  uname: {
    cmd: 'uname',
    desc: 'Print system information',
    action: args =>
      args.includes('-a')
        ? 'PortfolioOS portfolio-term 2.0.0 React/19.2.0 x86_64 GNU/Linux'
        : 'PortfolioOS',
  },

  man: {
    cmd: 'man',
    desc: 'Show a command manual',
    action: args => {
      if (!args[0]) return 'What manual page do you want?';
      const target = commands[args[0].toLowerCase()];
      if (!target) return `No manual entry for ${args[0]}`;
      return (
        <div>
          <ManHeader>
            <span>{target.cmd.toUpperCase()}(1)</span>
            <span>User Commands</span>
            <span>{target.cmd.toUpperCase()}(1)</span>
          </ManHeader>
          <ManSection>NAME</ManSection>
          <ManEntry>
            <ManDesc>
              {target.cmd} — {target.desc.toLowerCase()}
            </ManDesc>
          </ManEntry>
          {target.usage && (
            <>
              <ManSection>SYNOPSIS</ManSection>
              <ManEntry>
                <ManDesc>{target.usage}</ManDesc>
              </ManEntry>
            </>
          )}
        </div>
      );
    },
  },

  clear: {
    cmd: 'clear',
    desc: 'Clear the screen',
    action: (_args, ctx) => {
      ctx.clearHistory();
      return '';
    },
  },

  /* ── System ───────────────────────────────────────────────────────────── */

  theme: {
    cmd: 'theme',
    desc: 'Switch the colour theme',
    usage: 'theme [list | set <name>]',
    action: (args, ctx) => {
      if (!args[0] || args[0] === 'list') {
        return (
          <div>
            <Muted>Available themes — `theme set &lt;name&gt;`</Muted>
            <div style={{ marginTop: '0.5rem' }}>
              {Object.entries(themes).map(([name, t]) => (
                <SwatchRow key={name}>
                  <Muted style={{ width: '1ch' }}>{name === ctx.currentTheme ? '*' : ' '}</Muted>
                  <ThemeName $active={name === ctx.currentTheme}>{name}</ThemeName>
                  <Swatch
                    $bg={t.colors.background}
                    $colors={[]}
                  >
                    {[t.colors.red, t.colors.yellow, t.colors.green, t.colors.blue, t.colors.purple, t.colors.accent].map(
                      (c, i) => (
                        <span key={i} style={{ background: c }} />
                      ),
                    )}
                  </Swatch>
                  <Muted>{themeMeta[name]}</Muted>
                </SwatchRow>
              ))}
            </div>
          </div>
        );
      }

      const name = (args[0] === 'set' ? args[1] : args[0])?.toLowerCase();
      if (!name) return 'Usage: theme list | theme set <name>';
      if (!themes[name]) return `Unknown theme: ${name}. Try 'theme list'.`;
      ctx.setTheme(name);
      return `Theme set to ${name}.`;
    },
  },

  sound: {
    cmd: 'sound',
    desc: 'Keyboard sound settings',
    usage: 'sound [on | off | volume <0-100> | style <thocky|poppy|clacky>]',
    action: (args, ctx) => {
      if (!args[0])
        return `Sound is ${ctx.soundEnabled ? 'on' : 'off'} — volume ${Math.round(
          ctx.soundVolume * 100,
        )}%, style ${audioManager.style}.`;

      if (args[0] === 'on') {
        ctx.setSoundEnabled(true);
        return 'Sound enabled.';
      }
      if (args[0] === 'off') {
        ctx.setSoundEnabled(false);
        return 'Sound disabled.';
      }
      if (args[0] === 'volume') {
        const vol = Number(args[1]);
        if (!Number.isFinite(vol) || vol < 0 || vol > 100) return 'Volume must be 0–100.';
        ctx.setSoundVolume(vol / 100);
        return `Volume set to ${vol}%.`;
      }
      if (args[0] === 'style') {
        const styles: SoundStyle[] = ['thocky', 'poppy', 'clacky'];
        if (!args[1]) return `Current style: ${audioManager.style}. Available: ${styles.join(', ')}.`;
        if (!styles.includes(args[1] as SoundStyle))
          return `Unknown style "${args[1]}". Available: ${styles.join(', ')}.`;
        audioManager.style = args[1] as SoundStyle;
        audioManager.keystroke();
        return `Sound style set to ${args[1]}.`;
      }
      return 'Usage: sound on | off | volume <0-100> | style <thocky|poppy|clacky>';
    },
  },

  neofetch: {
    cmd: 'neofetch',
    desc: 'System information',
    action: (_args, ctx) => (
      <NeofetchLayout>
        <NeofetchLogo>{NEOFETCH_LOGO.join('\n')}</NeofetchLogo>
        <InfoGrid>
          <InfoKey>visitor</InfoKey>
          <InfoValue>@ {profile.site}</InfoValue>
          <Muted style={{ gridColumn: '1 / -1' }}>{'─'.repeat(34)}</Muted>
          {neofetchInfo(ctx.currentTheme).map(([key, value]) => (
            <React.Fragment key={key}>
              <InfoKey>{key}</InfoKey>
              <InfoValue>{value}</InfoValue>
            </React.Fragment>
          ))}
        </InfoGrid>
      </NeofetchLayout>
    ),
  },

  /* ── Interactive ──────────────────────────────────────────────────────── */

  typingtest: {
    cmd: 'typingtest',
    desc: 'Typing speed test',
    usage: 'typingtest [words 15|30|60 | code go|python|ts]',
    action: (args, ctx) =>
      launch(
        ctx,
        () => import('../components/TypingTest'),
        { args, onExit: () => ctx.setActiveComponent(null) },
        'typing test',
      ),
  },

  tt: {
    cmd: 'tt',
    desc: 'Alias for typingtest',
    action: (args, ctx) => commands.typingtest.action(args, ctx),
  },

  snake: {
    cmd: 'snake',
    desc: 'Play Snake',
    action: (_args, ctx) =>
      launch(ctx, () => import('../components/Snake'), { onExit: () => ctx.setActiveComponent(null) }, 'snake'),
  },

  wordle: {
    cmd: 'wordle',
    desc: 'Play Wordle',
    usage: 'wordle [stats]',
    action: (args, ctx) => {
      if (args[0] === 'stats') {
        const raw = localStorage.getItem('portfolio:wordle-stats');
        const stats = raw ? JSON.parse(raw) : { played: 0, won: 0, streak: 0, maxStreak: 0 };
        if (stats.played === 0) return 'No games played yet.';
        return (
          <Pre>
            {[
              `Played:      ${stats.played}`,
              `Won:         ${stats.won} (${Math.round((stats.won / stats.played) * 100)}%)`,
              `Streak:      ${stats.streak}`,
              `Best streak: ${stats.maxStreak ?? stats.streak}`,
            ].join('\n')}
          </Pre>
        );
      }
      return launch(ctx, () => import('../components/Wordle'), { onExit: () => ctx.setActiveComponent(null) }, 'wordle');
    },
  },

  matrix: {
    cmd: 'matrix',
    desc: 'Digital rain',
    action: (_args, ctx) => {
      const MatrixRain = React.lazy(() => import('../components/MatrixRain'));
      ctx.setOverlay(
        <React.Suspense fallback={null}>
          <MatrixRain onDone={() => ctx.setOverlay(null)} />
        </React.Suspense>,
      );
      return '';
    },
  },

  /* ── Platform toolchain ───────────────────────────────────────────────── */

  ...clusterCommands,

  /* ── Small ones ───────────────────────────────────────────────────────── */

  sudo: {
    cmd: 'sudo',
    desc: 'Execute as another user',
    action: args =>
      args.length === 0
        ? 'usage: sudo <command>'
        : 'visitor is not in the sudoers file. This incident will be reported.',
  },

  rm: {
    cmd: 'rm',
    desc: 'Remove files',
    action: args =>
      args.some(a => /^-\w*[rf]/.test(a))
        ? 'rm: it is a read-only filesystem, and I have restored from backup before.'
        : 'rm: read-only file system',
    },

  cowsay: {
    cmd: 'cowsay',
    desc: 'A cow says something',
    action: args => <Pre>{COW_TEMPLATE(args.join(' ') || 'moo')}</Pre>,
  },

  zellij: {
    cmd: 'zellij',
    desc: 'Terminal workspace',
    action: () => (
      <Pre>
        {[
          'You are already inside a zellij session.',
          '',
          'Nesting is allowed but rarely wise. See ~/.config/zellij/config.kdl',
          'for the layout and keybinds I actually use.',
        ].join('\n')}
      </Pre>
    ),
  },

  alacritty: {
    cmd: 'alacritty',
    desc: 'Terminal emulator',
    action: () => (
      <Pre>
        {[
          'This is already a terminal. Opening another one inside it would be',
          'turtles all the way down.',
          '',
          'Config: ~/.config/alacritty/alacritty.toml',
        ].join('\n')}
      </Pre>
    ),
  },

  vim: {
    cmd: 'vim',
    desc: 'Text editor',
    action: () => 'vim: command not found. Try `nvim`.',
  },

  nvim: {
    cmd: 'nvim',
    desc: 'Text editor',
    action: () => (
      <Pre>
        {[
          'E138: Cannot write viminfo file — read-only filesystem.',
          '',
          'Nothing to edit here anyway. The interesting configs are in ~/.config.',
        ].join('\n')}
      </Pre>
    ),
  },

  exit: {
    cmd: 'exit',
    desc: 'Close the session',
    action: () => (
      <Muted>
        There is no exit — this shell is the page. Close the tab, or run{' '}
        <strong>clear</strong> and start over.
      </Muted>
    ),
  },
};

/** Commands offered by tab-completion and listed by `help`, minus the eggs. */
export const isHiddenCommand = (name: string) =>
  ['k', 'tt', 'vim', 'nvim', 'exit', 'rm', 'sudo'].includes(name);
