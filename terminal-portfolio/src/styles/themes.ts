import type { DefaultTheme } from 'styled-components';

const FONT = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

// Cursor Dark base + punchy accent colors
export const cursorTheme: DefaultTheme = {
  colors: {
    background: '#181818',
    foreground: '#e4e4e4',
    prompt: '#5de4c7',
    command: '#ffa463',
    result: '#d6d6dd',
    error: '#ff6b8a',
    link: '#7dc4ff',
    surface: '#141414',
    muted: '#7a7a7a',
    accent: '#c49cff',
    yellow: '#ffd580',
    green: '#5de4c7',
    red: '#ff6b8a',
    blue: '#7dc4ff',
    purple: '#f087d0',
    teal: '#5de4c7',
  },
  font: FONT,
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#0d1117',
    foreground: '#e6edf3',
    prompt: '#79c0ff',
    command: '#7ee787',
    result: '#b1bac4',
    error: '#ff7b72',
    link: '#79c0ff',
    surface: '#161b22',
    muted: '#7d8590',
    accent: '#d2a8ff',
    yellow: '#e3b341',
    green: '#7ee787',
    red: '#ff7b72',
    blue: '#79c0ff',
    purple: '#d2a8ff',
    teal: '#56d364',
  },
  font: FONT,
};

export const matrixTheme: DefaultTheme = {
  colors: {
    background: '#0a0a0a',
    foreground: '#00ff41',
    prompt: '#20c20e',
    command: '#00ff41',
    result: '#33ff66',
    error: '#ff3333',
    link: '#20c20e',
    surface: '#0f0f0f',
    muted: '#0d7a0d',
    accent: '#00ff41',
    yellow: '#00ff41',
    green: '#00ff41',
    red: '#ff3333',
    blue: '#20c20e',
    purple: '#00ff41',
    teal: '#00ff41',
  },
  font: "'Courier New', monospace",
};

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#fafafa',
    foreground: '#1a1a1a',
    prompt: '#0969da',
    command: '#1a7f37',
    result: '#424242',
    error: '#cf222e',
    link: '#0969da',
    surface: '#f0f0f0',
    muted: '#656d76',
    accent: '#8250df',
    yellow: '#9a6700',
    green: '#1a7f37',
    red: '#cf222e',
    blue: '#0969da',
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
    muted: '#838ba7',
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
