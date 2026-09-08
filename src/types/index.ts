import type { ReactNode } from 'react';

export interface Command {
  cmd: string;
  desc: string;
  /** Shown by `man <cmd>` when present. */
  usage?: string;
  action: (args: string[], ctx: TerminalContext) => ReactNode | string;
}

export interface HistoryItem {
  id: string;
  command: string;
  /** The cwd at the time the command ran, so scrollback keeps its prompts. */
  cwd: string;
  output: ReactNode | string;
}

/**
 * Exactly one thing owns the keyboard at a time. Global listeners — the Konami
 * sequence, Ctrl-l — must check this before acting, or they steal arrow keys
 * from Snake and from history navigation.
 */
export type TerminalMode = 'NORMAL' | 'GAME' | 'PANE';

export interface TerminalContext {
  cwd: string;
  setCwd: (path: string) => void;
  setTheme: (name: string) => void;
  currentTheme: string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  soundVolume: number;
  setSoundVolume: (vol: number) => void;
  /** Takes over the terminal body — games, the typing test. */
  setActiveComponent: (component: ReactNode | null) => void;
  /** Draws *above* the terminal without unmounting it — the matrix rain. */
  setOverlay: (component: ReactNode | null) => void;
  addToHistory: (command: string, output: ReactNode | string) => void;
  clearHistory: () => void;
  commandHistory: string[];
  clearCommandHistory: () => void;
  openSidePanel: (content: SidePanelContent) => void;
}

export interface SidePanelContent {
  title: string;
  subtitle?: string;
  sections: PanelSection[];
}

export interface PanelSection {
  label?: string;
  data: PanelSectionData;
}

export type PanelSectionData =
  | { kind: 'image'; alt: string; src?: string }
  | { kind: 'links'; items: { label: string; url: string }[] }
  | { kind: 'tags'; items: { label: string; color?: string; icon?: string }[] }
  | { kind: 'text'; content: string }
  | { kind: 'gallery'; items: { alt: string; src?: string }[] };

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
    /** One step above surface — pane borders, status bar chips. */
    overlay: string;
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
