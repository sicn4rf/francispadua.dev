import type { FSNode, VirtualDirectory, VirtualFile } from '../types';
import { profile, education, experience, projects, awards, skills, now } from './content';

const file = (name: string, content: string, hidden = false): VirtualFile => ({
  type: 'file', name, content, hidden,
});

const dir = (name: string, children: Record<string, FSNode>, hidden = false): VirtualDirectory => ({
  type: 'directory', name, children, hidden,
});

const heading = (text: string) => [text, '='.repeat(text.length)].join('\n');

const roleFile = (r: (typeof experience)[number]) =>
  file(
    `${r.id}.md`,
    [
      heading(`${r.title.toUpperCase()} @ ${r.org.toUpperCase()}`),
      `${r.start} — ${r.end}  |  ${r.location}`,
      '',
      ...r.bullets.map(b => `- ${b}`),
    ].join('\n'),
  );

const projectFile = (p: (typeof projects)[number]) =>
  file(
    `${p.id}.md`,
    [
      heading(p.name.toUpperCase()),
      `${p.date}  |  ${p.stack.join(', ')}`,
      '',
      ...p.bullets.map(b => `- ${b}`),
    ].join('\n'),
  );

const fromEntries = <T>(items: T[], key: (t: T) => string, value: (t: T) => FSNode) =>
  Object.fromEntries(items.map(i => [key(i), value(i)]));

export const fileSystem: VirtualDirectory = dir('~', {
  'about.txt': file('about.txt', [
    profile.name,
    '',
    ...profile.bio,
  ].join('\n\n')),

  'contact.txt': file('contact.txt', [
    `Email:    ${profile.email}`,
    `LinkedIn: ${profile.linkedin}`,
    `GitHub:   ${profile.github}`,
  ].join('\n')),

  'skills.txt': file(
    'skills.txt',
    Object.entries(skills)
      .map(([group, items]) => [group.toUpperCase(), `  ${items.join(', ')}`].join('\n'))
      .join('\n\n'),
  ),

  'now.txt': file('now.txt', [
    heading('WHAT I AM UP TO RIGHT NOW'),
    '',
    ...Object.entries(now).flatMap(([section, items]) => [
      `> ${section}`,
      ...items.map(i => `  - ${i}`),
      '',
    ]),
  ].join('\n').trimEnd()),

  'awards.txt': file('awards.txt', [
    heading('AWARDS & COMPETITIONS'),
    '',
    ...awards.flatMap(a => [a.name, `  ${a.date}`, ...a.placements.map(p => `  - ${p}`), '']),
  ].join('\n').trimEnd()),

  'projects': dir('projects', fromEntries(projects, p => `${p.id}.md`, projectFile)),

  'experience': dir('experience', fromEntries(experience, r => `${r.id}.md`, roleFile)),

  'education': dir(
    'education',
    fromEntries(education, e => `${e.id}.md`, e =>
      file(`${e.id}.md`, [heading(e.school.toUpperCase()), e.degree, e.detail, e.dates].join('\n')),
    ),
  ),

  '.config': dir('.config', {
    'zellij': dir('zellij', {
      'config.kdl': file('config.kdl', [
        'theme "catppuccin-mocha"',
        'default_layout "compact"',
        'pane_frames false',
        'copy_on_select true',
        '',
        'keybinds clear-defaults=true {',
        '    normal {',
        '        bind "Ctrl p" { SwitchToMode "Pane"; }',
        '        bind "Ctrl t" { SwitchToMode "Tab"; }',
        '        bind "Ctrl n" { SwitchToMode "Resize"; }',
        '        bind "Alt h" { MoveFocusOrTab "Left"; }',
        '        bind "Alt l" { MoveFocusOrTab "Right"; }',
        '        bind "Alt j" { MoveFocus "Down"; }',
        '        bind "Alt k" { MoveFocus "Up"; }',
        '        bind "Alt n" { NewPane; }',
        '    }',
        '    pane {',
        '        bind "d" { NewPane "Down"; SwitchToMode "Normal"; }',
        '        bind "r" { NewPane "Right"; SwitchToMode "Normal"; }',
        '        bind "x" { CloseFocus; SwitchToMode "Normal"; }',
        '        bind "f" { ToggleFocusFullscreen; SwitchToMode "Normal"; }',
        '        bind "Esc" { SwitchToMode "Normal"; }',
        '    }',
        '}',
        '',
        '// Layout I actually live in: editor on the left, two shells stacked right.',
        'layout {',
        '    pane split_direction="vertical" {',
        '        pane size="60%"',
        '        pane split_direction="horizontal" {',
        '            pane',
        '            pane',
        '        }',
        '    }',
        '}',
      ].join('\n')),
    }),
    'alacritty': dir('alacritty', {
      'alacritty.toml': file('alacritty.toml', [
        '[general]',
        'import = ["~/.config/alacritty/themes/catppuccin-mocha.toml"]',
        '',
        '[window]',
        'padding = { x = 14, y = 14 }',
        'decorations = "buttonless"',
        'opacity = 0.94',
        'blur = true',
        'option_as_alt = "Both"',
        '',
        '[font]',
        'size = 13.5',
        'normal = { family = "JetBrains Mono", style = "Regular" }',
        'bold = { family = "JetBrains Mono", style = "Bold" }',
        '',
        '[scrolling]',
        'history = 10000',
        '',
        '[terminal.shell]',
        'program = "/bin/zsh"',
        'args = ["-l", "-c", "zellij attach -c main"]',
        '',
        '[keyboard]',
        'bindings = [',
        '  { key = "K", mods = "Command", action = "ClearHistory" },',
        ']',
      ].join('\n')),
    }),
    'k9s': dir('k9s', {
      'config.yaml': file('config.yaml', [
        'k9s:',
        '  liveViewAutoRefresh: true',
        '  refreshRate: 2',
        '  ui:',
        '    skin: catppuccin-mocha',
        '    logoless: true',
        '  logger:',
        '    tail: 200',
        '    sinceSeconds: -1',
      ].join('\n')),
    }),
  }, true),

  '.secret': file('.secret', [
    'Nothing classified in here.',
    '',
    'But since you went looking: the most useful thing I learned this year is',
    'that the interesting failures are never in the code you wrote. They are in',
    'the five-minute ArgoCD sync you assumed was instant, the admission policy',
    'that was never actually enforcing, and the WebSocket that reconnected but',
    'never resubscribed.',
    '',
    'Try `kubectl get pods`.',
  ].join('\n'), true),

  '.bashrc': file('.bashrc', [
    '# ~/.bashrc',
    '',
    'export EDITOR="nvim"',
    'export KUBE_EDITOR="nvim"',
    'export PAGER="less -FRX"',
    '',
    '# kubectl is 7 characters too long',
    'alias k="kubectl"',
    'alias kgp="kubectl get pods"',
    'alias kgpa="kubectl get pods --all-namespaces"',
    'alias kctx="kubectl config use-context"',
    'alias kns="kubectl config set-context --current --namespace"',
    'alias klf="kubectl logs -f"',
    '',
    '# helm / argo',
    'alias hl="helm list --all-namespaces"',
    'alias hdiff="helm diff upgrade"',
    'alias async="argocd app sync"',
    '',
    '# git',
    'alias gs="git status -sb"',
    'alias gl="git log --oneline --graph --decorate -20"',
    'alias gfix="git commit --amend --no-edit"',
    '',
    '# Drop into the cluster a namespace at a time',
    'kexec() { kubectl exec -it "$1" -- /bin/sh; }',
    '',
    'source <(kubectl completion bash)',
    'complete -o default -F __start_kubectl k',
  ].join('\n'), true),
});

export function resolvePath(cwd: string, target: string): string {
  if (target === '' || target === '~' || target === '/') return '~';

  const startsAtRoot = target.startsWith('~') || target.startsWith('/');
  const fullPath = startsAtRoot ? target.replace(/^\//, '~/') : `${cwd}/${target}`;
  const parts = fullPath.split('/').filter(Boolean);

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      // Never climb above ~; the first segment is the home marker.
      if (resolved.length > 1) resolved.pop();
    } else if (part !== '.' && part !== '~') {
      resolved.push(part);
    } else if (part === '~') {
      resolved.length = 0;
      resolved.push('~');
    }
  }

  if (resolved.length === 0 || resolved[0] !== '~') resolved.unshift('~');
  return resolved.join('/');
}

export function getNode(path: string): FSNode | null {
  const parts = path.split('/').filter(p => p && p !== '~');
  let current: FSNode = fileSystem;

  for (const part of parts) {
    if (current.type !== 'directory') return null;
    const child: FSNode | undefined = current.children[part];
    if (!child) return null;
    current = child;
  }

  return current;
}
