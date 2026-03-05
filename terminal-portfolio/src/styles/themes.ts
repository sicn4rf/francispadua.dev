import type { DefaultTheme } from 'styled-components';

const FONT = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

export const cursorTheme: DefaultTheme = {
  colors: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    prompt: '#89b4fa',
    command: '#a6e3a1',
    result: '#bac2de',
    error: '#f38ba8',
    link: '#89b4fa',
    surface: '#313244',
    muted: '#6c7086',
    accent: '#cba6f7',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    red: '#f38ba8',
    blue: '#89b4fa',
    purple: '#cba6f7',
    teal: '#94e2d5',
  },
  font: FONT,
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#0d1117',
    foreground: '#c9d1d9',
    prompt: '#58a6ff',
    command: '#7ee787',
    result: '#8b949e',
    error: '#f85149',
    link: '#58a6ff',
    surface: '#161b22',
    muted: '#484f58',
    accent: '#bc8cff',
    yellow: '#e3b341',
    green: '#7ee787',
    red: '#f85149',
    blue: '#58a6ff',
    purple: '#bc8cff',
    teal: '#39d353',
  },
  font: FONT,
};

export const matrixTheme: DefaultTheme = {
  colors: {
    background: '#0D0208',
    foreground: '#00FF41',
    prompt: '#008F11',
    command: '#00FF41',
    result: '#003B00',
    error: '#FF0000',
    link: '#008F11',
    surface: '#0a1a0a',
    muted: '#005500',
    accent: '#00FF41',
    yellow: '#00FF41',
    green: '#00FF41',
    red: '#FF0000',
    blue: '#008F11',
    purple: '#00FF41',
    teal: '#00FF41',
  },
  font: "'Courier New', monospace",
};

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#ffffff',
    foreground: '#24292f',
    prompt: '#0550ae',
    command: '#116329',
    result: '#57606a',
    error: '#cf222e',
    link: '#0550ae',
    surface: '#f6f8fa',
    muted: '#8c959f',
    accent: '#8250df',
    yellow: '#9a6700',
    green: '#116329',
    red: '#cf222e',
    blue: '#0550ae',
    purple: '#8250df',
    teal: '#1b7c83',
  },
  font: FONT,
};

export const catppuccinTheme: DefaultTheme = {
  colors: {
    background: '#303446',
    foreground: '#c6d0f5',
    prompt: '#8caaee',
    command: '#a6d189',
    result: '#b5bfe2',
    error: '#e78284',
    link: '#8caaee',
    surface: '#414559',
    muted: '#737994',
    accent: '#ca9ee6',
    yellow: '#e5c890',
    green: '#a6d189',
    red: '#e78284',
    blue: '#8caaee',
    purple: '#ca9ee6',
    teal: '#81c8be',
  },
  font: FONT,
};

export const themes: Record<string, DefaultTheme> = {
  cursor: cursorTheme,
  catppuccin: catppuccinTheme,
  dark: darkTheme,
  matrix: matrixTheme,
  light: lightTheme,
};
