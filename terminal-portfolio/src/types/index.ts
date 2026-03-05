import type { ReactNode } from 'react';

export interface Command {
  cmd: string;
  desc: string;
  action: (args: string[], ctx: TerminalContext) => ReactNode | string;
}

export interface HistoryItem {
  id: string;
  command: string;
  output: ReactNode | string;
}

export interface TerminalContext {
  cwd: string;
  setCwd: (path: string) => void;
  setTheme: (name: string) => void;
  currentTheme: string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  soundVolume: number;
  setSoundVolume: (vol: number) => void;
  setActiveComponent: (component: ReactNode | null) => void;
  addToHistory: (command: string, output: ReactNode | string) => void;
  clearHistory: () => void;
}

export interface Theme {
  colors: {
    background: string;
    foreground: string;
    prompt: string;
    command: string;
    result: string;
    error: string;
    link: string;
    surface: string;
    muted: string;
    accent: string;
    yellow: string;
    green: string;
    red: string;
    blue: string;
    purple: string;
    teal: string;
  };
  font: string;
}

export interface VirtualFile {
  type: 'file';
  name: string;
  content: ReactNode | string;
  hidden?: boolean;
}

export interface VirtualDirectory {
  type: 'directory';
  name: string;
  children: Record<string, VirtualFile | VirtualDirectory>;
  hidden?: boolean;
}

export type FSNode = VirtualFile | VirtualDirectory;
