import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTerminal } from './useTerminal';
import { DEFAULT_THEME } from '../styles/themes';

const setup = (cwd = '~') =>
  renderHook(() =>
    useTerminal({
      cwd,
      setCwd: vi.fn(),
      setTheme: vi.fn(),
      currentTheme: DEFAULT_THEME,
      soundEnabled: false,
      setSoundEnabled: vi.fn(),
      soundVolume: 0,
      setSoundVolume: vi.fn(),
      setActiveComponent: vi.fn(),
      setOverlay: vi.fn(),
      openSidePanel: vi.fn(),
    }),
  );

describe('processCommand', () => {
  it('records what the visitor typed', () => {
    const { result } = setup();
    act(() => result.current.processCommand('whoami'));

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].command).toBe('whoami');
    expect(result.current.commandHistory).toEqual(['whoami']);
  });

  it('shows output without recording when record is false', () => {
    // The login banner runs a command the visitor did not type; it should not
    // be sitting in the buffer for them to arrow past.
    const { result } = setup();
    act(() => result.current.processCommand('kubectl get pods', { record: false }));

    expect(result.current.history).toHaveLength(1);
    expect(result.current.commandHistory).toEqual([]);
  });

  it('reports an unknown command', () => {
    const { result } = setup();
    act(() => result.current.processCommand('nope'));

    expect(result.current.history[0].output).toContain('command not found');
  });

  it('ignores blank input', () => {
    const { result } = setup();
    act(() => result.current.processCommand('   '));

    expect(result.current.history).toHaveLength(0);
    expect(result.current.commandHistory).toHaveLength(0);
  });

  it('is case-insensitive on the command name', () => {
    const { result } = setup();
    act(() => result.current.processCommand('WhoAmI'));

    expect(result.current.history[0].output).not.toContain('command not found');
  });

  it('leaves nothing behind after clear', () => {
    const { result } = setup();
    act(() => result.current.processCommand('whoami'));
    act(() => result.current.processCommand('clear'));

    expect(result.current.history).toHaveLength(0);
    // The recallable buffer survives clear, exactly as a real shell's does.
    expect(result.current.commandHistory).toEqual(['whoami', 'clear']);
  });

  it('collapses an immediately repeated command', () => {
    const { result } = setup();
    act(() => result.current.processCommand('whoami'));
    act(() => result.current.processCommand('whoami'));

    expect(result.current.commandHistory).toEqual(['whoami']);
    expect(result.current.history).toHaveLength(2);
  });
});

describe('navigateHistory', () => {
  it('walks back through what was typed', () => {
    const { result } = setup();
    act(() => result.current.processCommand('about'));
    act(() => result.current.processCommand('skills'));

    expect(result.current.navigateHistory('up', '')).toBe('skills');
    expect(result.current.navigateHistory('up', '')).toBe('about');
    // Already at the oldest entry — stay put rather than wrap.
    expect(result.current.navigateHistory('up', '')).toBe('about');
  });

  it('restores the half-typed line on the way back down', () => {
    const { result } = setup();
    act(() => result.current.processCommand('about'));

    expect(result.current.navigateHistory('up', 'kubec')).toBe('about');
    expect(result.current.navigateHistory('down', 'about')).toBe('kubec');
  });

  it('does nothing with an empty buffer', () => {
    const { result } = setup();
    expect(result.current.navigateHistory('up', '')).toBeNull();
    expect(result.current.navigateHistory('down', '')).toBeNull();
  });
});

describe('getCompletions', () => {
  it('completes a unique command outright', () => {
    const { result } = setup();
    expect(result.current.getCompletions('neof').replacement).toBe('neofetch');
  });

  it('advances to the longest common prefix when ambiguous', () => {
    const { result } = setup();
    // `wordle` and `whoami` share only "w"; `t` covers theme/tree/typingtest/tt.
    const { candidates, replacement } = result.current.getCompletions('th');
    expect(candidates.length).toBeGreaterThan(0);
    expect(replacement?.startsWith('th')).toBe(true);
  });

  it('completes paths for filesystem commands', () => {
    const { result } = setup();
    const { replacement } = result.current.getCompletions('cd proj');
    expect(replacement).toBe('cd projects/');
  });

  it('hides dotfiles unless the prefix asks for them', () => {
    const { result } = setup();
    expect(result.current.getCompletions('cat ').candidates).not.toContain('.secret');
    expect(result.current.getCompletions('cat .sec').candidates).toContain('.secret');
  });

  it('returns nothing for a command that takes no path', () => {
    const { result } = setup();
    expect(result.current.getCompletions('echo hel').candidates).toEqual([]);
  });

  it('returns nothing for empty input', () => {
    const { result } = setup();
    expect(result.current.getCompletions('').candidates).toEqual([]);
  });
});
