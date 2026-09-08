/**
 * figlet -f "DOS Rebel" -w 999 ">FRANCIS"
 *
 * The font draws letterforms in two glyphs: █ is the face, ░ is the drop
 * shadow. Rendered at one weight they interleave into checkerboard noise at
 * the size this has to display at, which is why the shadow layer is dimmed —
 * see `bannerRuns`.
 */
export const BANNER_LINES = [
  ' ███       ███████████ ███████████     █████████   ██████   █████   █████████  █████  █████████ ',
  '░░░███    ░░███░░░░░░█░░███░░░░░███   ███░░░░░███ ░░██████ ░░███   ███░░░░░███░░███  ███░░░░░███',
  '  ░░░███   ░███   █ ░  ░███    ░███  ░███    ░███  ░███░███ ░███  ███     ░░░  ░███ ░███    ░░░ ',
  '    ░░░███ ░███████    ░██████████   ░███████████  ░███░░███░███ ░███          ░███ ░░█████████ ',
  '     ███░  ░███░░░█    ░███░░░░░███  ░███░░░░░███  ░███ ░░██████ ░███          ░███  ░░░░░░░░███',
  '   ███░    ░███  ░     ░███    ░███  ░███    ░███  ░███  ░░█████ ░░███     ███ ░███  ███    ░███',
  ' ███░      █████       █████   █████ █████   █████ █████  ░░█████ ░░█████████  █████░░█████████ ',
  '░░░       ░░░░░       ░░░░░   ░░░░░ ░░░░░   ░░░░░ ░░░░░    ░░░░░   ░░░░░░░░░  ░░░░░  ░░░░░░░░░  ',
];

/**
 * Splits a banner line into face and shadow runs so the two can be painted at
 * different intensities. Adjacent same-kind characters coalesce into one run,
 * which keeps the span count down to a handful per line.
 */
export function bannerRuns(line: string): { text: string; shadow: boolean }[] {
  const runs: { text: string; shadow: boolean }[] = [];

  for (const char of line) {
    const shadow = char === '░';
    const last = runs[runs.length - 1];
    if (last && last.shadow === shadow) last.text += char;
    else runs.push({ text: char, shadow });
  }

  return runs;
}

export const BOOT_LINES = [
  '[  0.000000] Booting portfolio-term 2.0',
  '[  0.114203] systemd[1]: Reached target Local File Systems.',
  '[  0.287551] Mounted /home/visitor ....................... OK',
  '[  0.402118] Started francis-sh (interactive shell) ...... OK',
  '[  0.588934] argocd: application "portfolio" Synced ...... OK',
  '[  0.771260] kubelet: 6/6 pods Running ................... OK',
  '[  0.912847] Reached target Multi-User System.',
];

/**
 * Rendered as two independent columns rather than one pre-formatted block —
 * the old version reconstructed the split with a regex over run-lengths of
 * whitespace, which broke whenever a value changed length.
 */
export const NEOFETCH_LOGO = [
  '    ┌──────────────────────────┐',
  '    │  ●   ●   ●               │',
  '    ├──────────────────────────┤',
  '    │                          │',
  '    │  $ whoami                │',
  '    │  francis                 │',
  '    │                          │',
  '    │  $ kubectl get pods      │',
  '    │  6/6 Running             │',
  '    │                          │',
  '    │  $ _                     │',
  '    │                          │',
  '    └──────────────────────────┘',
];

export const neofetchInfo = (themeName: string): [string, string][] => [
  ['OS', 'PortfolioOS 2.0 x86_64'],
  ['Host', 'francispadua.com'],
  ['Kernel', 'react-19.2.0'],
  ['Shell', 'francis-sh 5.9'],
  ['Terminal', 'portfolio-term'],
  ['WM', 'zellij 0.42'],
  ['Theme', themeName],
  ['Editor', 'nvim'],
  ['Cluster', 'portfolio-prod (6 pods, Healthy)'],
  ['Languages', 'Go · TypeScript · C++ · Python'],
  ['Infra', 'Kubernetes · Helm · ArgoCD · EKS'],
  ['Uptime', 'since you opened this tab'],
];

export const COW_TEMPLATE = (message: string) => {
  // Wrap at 40 so a long message doesn't produce a mile-wide speech bubble.
  const words = message.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (line && line.length + word.length + 1 > 40) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);

  const width = Math.max(...lines.map(l => l.length));
  const top = ` ${'_'.repeat(width + 2)}`;
  const bottom = ` ${'-'.repeat(width + 2)}`;

  const body =
    lines.length === 1
      ? [`< ${lines[0].padEnd(width)} >`]
      : lines.map((l, i) => {
          const [open, close] =
            i === 0 ? ['/', '\\'] : i === lines.length - 1 ? ['\\', '/'] : ['|', '|'];
          return `${open} ${l.padEnd(width)} ${close}`;
        });

  return [
    top,
    ...body,
    bottom,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ].join('\n');
};
