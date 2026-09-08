import type { DefaultTheme } from 'styled-components';

const FONT = "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace";

/**
 * Real terminal palettes, taken from the upstream projects rather than
 * approximated. Every theme must define every colour in the `Theme` shape —
 * components read `theme.colors.*` and never hardcode a hex.
 */

export const catppuccinMocha: DefaultTheme = {
  colors: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    prompt: '#a6e3a1',
    command: '#f9e2af',
    result: '#bac2de',
    error: '#f38ba8',
    link: '#89b4fa',
    surface: '#181825',
    overlay: '#313244',
    muted: '#7f849c',
    accent: '#cba6f7',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    red: '#f38ba8',
    blue: '#89b4fa',
    purple: '#f5c2e7',
    teal: '#94e2d5',
  },
  font: FONT,
};

export const tokyoNight: DefaultTheme = {
  colors: {
    background: '#1a1b26',
    foreground: '#c0caf5',
    prompt: '#9ece6a',
    command: '#e0af68',
    result: '#a9b1d6',
    error: '#f7768e',
    link: '#7aa2f7',
    surface: '#16161e',
    overlay: '#292e42',
    muted: '#565f89',
    accent: '#bb9af7',
    yellow: '#e0af68',
    green: '#9ece6a',
    red: '#f7768e',
    blue: '#7aa2f7',
    purple: '#bb9af7',
    teal: '#7dcfff',
  },
  font: FONT,
};

export const gruvboxDark: DefaultTheme = {
  colors: {
    background: '#282828',
    foreground: '#ebdbb2',
    prompt: '#b8bb26',
    command: '#fabd2f',
    result: '#d5c4a1',
    error: '#fb4934',
    link: '#83a598',
    surface: '#1d2021',
    overlay: '#3c3836',
    muted: '#928374',
    accent: '#d3869b',
    yellow: '#fabd2f',
    green: '#b8bb26',
    red: '#fb4934',
    blue: '#83a598',
    purple: '#d3869b',
    teal: '#8ec07c',
  },
  font: FONT,
};

export const rosePine: DefaultTheme = {
  colors: {
    background: '#191724',
    foreground: '#e0def4',
    prompt: '#9ccfd8',
    command: '#f6c177',
    result: '#c5c1d8',
    error: '#eb6f92',
    link: '#31748f',
    surface: '#1f1d2e',
    overlay: '#26233a',
    muted: '#6e6a86',
    accent: '#c4a7e7',
    yellow: '#f6c177',
    green: '#9ccfd8',
    red: '#eb6f92',
    blue: '#31748f',
    purple: '#c4a7e7',
    teal: '#ebbcba',
  },
  font: FONT,
};

export const nord: DefaultTheme = {
  colors: {
    background: '#2e3440',
    foreground: '#eceff4',
    prompt: '#a3be8c',
    command: '#ebcb8b',
    result: '#d8dee9',
    error: '#bf616a',
    link: '#88c0d0',
    surface: '#272c36',
    overlay: '#3b4252',
    muted: '#6f7a8f',
    accent: '#b48ead',
    yellow: '#ebcb8b',
    green: '#a3be8c',
    red: '#bf616a',
    blue: '#81a1c1',
    purple: '#b48ead',
    teal: '#8fbcbb',
  },
  font: FONT,
};

export const everforest: DefaultTheme = {
  colors: {
    background: '#2d353b',
    foreground: '#d3c6aa',
    prompt: '#a7c080',
    command: '#dbbc7f',
    result: '#c1b199',
    error: '#e67e80',
    link: '#7fbbb3',
    surface: '#272e33',
    overlay: '#374145',
    muted: '#859289',
    accent: '#d699b6',
    yellow: '#dbbc7f',
    green: '#a7c080',
    red: '#e67e80',
    blue: '#7fbbb3',
    purple: '#d699b6',
    teal: '#83c092',
  },
  font: FONT,
};

export const latte: DefaultTheme = {
  colors: {
    background: '#eff1f5',
    foreground: '#4c4f69',
    prompt: '#40a02b',
    command: '#df8e1d',
    result: '#5c5f77',
    error: '#d20f39',
    link: '#1e66f5',
    surface: '#e6e9ef',
    overlay: '#ccd0da',
    muted: '#8c8fa1',
    accent: '#8839ef',
    yellow: '#df8e1d',
    green: '#40a02b',
    red: '#d20f39',
    blue: '#1e66f5',
    purple: '#ea76cb',
    teal: '#179299',
  },
  font: FONT,
};

/** Unlocked by the Konami code. */
export const matrix: DefaultTheme = {
  colors: {
    background: '#0a0a0a',
    foreground: '#00ff41',
    prompt: '#20c20e',
    command: '#7dff9c',
    result: '#33ff66',
    error: '#ff3333',
    link: '#20c20e',
    surface: '#050505',
    overlay: '#0f2a0f',
    muted: '#0d7a0d',
    accent: '#00ff41',
    yellow: '#aaff00',
    green: '#00ff41',
    red: '#ff3333',
    blue: '#20c20e',
    purple: '#7dff9c',
    teal: '#00ff41',
  },
  font: FONT,
};

export const themes: Record<string, DefaultTheme> = {
  'catppuccin-mocha': catppuccinMocha,
  'tokyo-night': tokyoNight,
  'gruvbox-dark': gruvboxDark,
  'rose-pine': rosePine,
  nord,
  everforest,
  latte,
  matrix,
};

export const themeMeta: Record<string, string> = {
  'catppuccin-mocha': 'the default',
  'tokyo-night': 'blue hour',
  'gruvbox-dark': 'retro warmth',
  'rose-pine': 'soho vibes',
  nord: 'arctic',
  everforest: 'green, easy on the eyes',
  latte: 'light mode, for the brave',
  matrix: 'you know what this is',
};

export const DEFAULT_THEME = 'catppuccin-mocha';
