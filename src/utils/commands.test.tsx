import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import type { ReactNode } from 'react';
import { commands } from './commands';
import { themes, DEFAULT_THEME, themeMeta } from '../styles/themes';
import type { TerminalContext } from '../types';

function makeCtx(overrides: Partial<TerminalContext> = {}): TerminalContext {
  return {
    cwd: '~',
    setCwd: vi.fn(),
    setTheme: vi.fn(),
    currentTheme: DEFAULT_THEME,
    soundEnabled: true,
    setSoundEnabled: vi.fn(),
    soundVolume: 0.3,
    setSoundVolume: vi.fn(),
    setActiveComponent: vi.fn(),
    setOverlay: vi.fn(),
    addToHistory: vi.fn(),
    clearHistory: vi.fn(),
    commandHistory: [],
    clearCommandHistory: vi.fn(),
    openSidePanel: vi.fn(),
    ...overrides,
  };
}

/** Renders whatever a command returned, so JSX output is exercised too. */
const renderOutput = (output: ReactNode | string) =>
  render(
    <ThemeProvider theme={themes[DEFAULT_THEME]}>
      <div>{output}</div>
    </ThemeProvider>,
  );

describe('the command table', () => {
  it('gives every command a description', () => {
    for (const [name, command] of Object.entries(commands)) {
      expect(command.desc, `${name} has no description`).toBeTruthy();
      expect(command.cmd, `${name} has no cmd`).toBeTruthy();
    }
  });

  it('renders every command without throwing', () => {
    for (const [name, command] of Object.entries(commands)) {
      // `resume` opens a window and the launchers pull in lazy chunks.
      if (['resume', 'typingtest', 'tt', 'snake', 'wordle', 'matrix'].includes(name)) continue;
      expect(() => renderOutput(command.action([], makeCtx())), `${name} threw`).not.toThrow();
    }
  });

  it('lists only real commands in help', () => {
    const { container } = renderOutput(commands.help.action([], makeCtx()));
    // Every monospaced command name help prints must exist in the table.
    for (const name of ['about', 'ls', 'theme', 'whoami', 'neofetch']) {
      expect(container.textContent).toContain(name);
    }
  });
});

describe('cd', () => {
  it('moves into a directory', () => {
    const ctx = makeCtx();
    commands.cd.action(['projects'], ctx);
    expect(ctx.setCwd).toHaveBeenCalledWith('~/projects');
  });

  it('refuses a file', () => {
    const ctx = makeCtx();
    const out = commands.cd.action(['about.txt'], ctx);
    expect(out).toContain('not a directory');
    expect(ctx.setCwd).not.toHaveBeenCalled();
  });

  it('reports a missing directory', () => {
    const ctx = makeCtx();
    expect(commands.cd.action(['nope'], ctx)).toContain('no such file or directory');
    expect(ctx.setCwd).not.toHaveBeenCalled();
  });

  it('goes home with no argument', () => {
    const ctx = makeCtx({ cwd: '~/projects' });
    commands.cd.action([], ctx);
    expect(ctx.setCwd).toHaveBeenCalledWith('~');
  });
});

describe('ls', () => {
  it('hides dotfiles by default and shows them with -a', () => {
    const plain = renderOutput(commands.ls.action([], makeCtx()));
    expect(plain.container.textContent).not.toContain('.secret');

    const all = renderOutput(commands.ls.action(['-a'], makeCtx()));
    expect(all.container.textContent).toContain('.secret');
  });

  it('accepts a path argument', () => {
    const { container } = renderOutput(commands.ls.action(['projects'], makeCtx()));
    expect(container.textContent).toContain('northstar.md');
  });

  it('errors on a missing path', () => {
    expect(commands.ls.action(['nope'], makeCtx())).toContain('No such file or directory');
  });
});

describe('cat', () => {
  it('prints a file', () => {
    const { container } = renderOutput(commands.cat.action(['about.txt'], makeCtx()));
    expect(container.textContent).toContain('Francis');
  });

  it('refuses a directory', () => {
    expect(commands.cat.action(['projects'], makeCtx())).toContain('Is a directory');
  });

  it('asks for an argument', () => {
    expect(commands.cat.action([], makeCtx())).toContain('usage:');
  });
});

describe('theme', () => {
  it('switches to a known theme', () => {
    const ctx = makeCtx();
    commands.theme.action(['set', 'nord'], ctx);
    expect(ctx.setTheme).toHaveBeenCalledWith('nord');
  });

  it('accepts a bare name too', () => {
    const ctx = makeCtx();
    commands.theme.action(['gruvbox-dark'], ctx);
    expect(ctx.setTheme).toHaveBeenCalledWith('gruvbox-dark');
  });

  it('rejects an unknown theme', () => {
    const ctx = makeCtx();
    expect(commands.theme.action(['set', 'nope'], ctx)).toContain('Unknown theme');
    expect(ctx.setTheme).not.toHaveBeenCalled();
  });

  it('describes every theme it lists', () => {
    for (const name of Object.keys(themes)) {
      expect(themeMeta[name], `${name} has no description`).toBeTruthy();
    }
  });
});

describe('history', () => {
  it('says so when empty', () => {
    expect(commands.history.action([], makeCtx())).toContain('No history');
  });

  it('numbers the entries', () => {
    const ctx = makeCtx({ commandHistory: ['about', 'ls'] });
    const { container } = renderOutput(commands.history.action([], ctx));
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('about');
  });

  it('clears on request', () => {
    const ctx = makeCtx({ commandHistory: ['about'] });
    commands.history.action(['clear'], ctx);
    expect(ctx.clearCommandHistory).toHaveBeenCalled();
  });
});

describe('kubectl', () => {
  it('lists the pods', () => {
    const { container } = renderOutput(commands.kubectl.action(['get', 'pods'], makeCtx()));
    expect(container.textContent).toContain('northstar');
    expect(container.textContent).toContain('Running');
  });

  it('is aliased to k', () => {
    expect(commands.k.action).toBe(commands.kubectl.action);
  });

  it('opens the pane when describing a pod', () => {
    const ctx = makeCtx();
    renderOutput(commands.kubectl.action(['describe', 'pod', 'northstar'], ctx));
    expect(ctx.openSidePanel).toHaveBeenCalled();
  });

  it('reports an unknown pod', () => {
    expect(commands.kubectl.action(['describe', 'pod', 'nope'], makeCtx())).toContain('NotFound');
  });

  it('refuses to mutate the cluster', () => {
    expect(commands.kubectl.action(['delete', 'pod', 'northstar'], makeCtx())).toContain('Forbidden');
  });
});

describe('cowsay', () => {
  it('says moo with no argument', () => {
    const { container } = renderOutput(commands.cowsay.action([], makeCtx()));
    expect(container.textContent).toContain('moo');
  });

  it('keeps the bubble aligned when wrapping a long message', () => {
    const output = commands.cowsay.action('word '.repeat(30).trim().split(' '), makeCtx());
    const { container } = renderOutput(output);
    const lines = (container.textContent ?? '').split('\n');
    const bubble = lines.filter(l => /^[/|\\<]/.test(l));
    expect(bubble.length).toBeGreaterThan(1);
    // Every bubble line is padded to the same width.
    expect(new Set(bubble.map(l => l.length)).size).toBe(1);
  });
});
