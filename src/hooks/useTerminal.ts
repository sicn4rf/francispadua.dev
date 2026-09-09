import { useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { commands } from '../utils/commands';
import { getNode, resolvePath } from '../utils/fileSystem';
import { audioManager } from '../utils/audioManager';
import type { HistoryItem, TerminalContext } from '../types';

type Ctx = Omit<
  TerminalContext,
  'addToHistory' | 'clearHistory' | 'commandHistory' | 'clearCommandHistory'
>;

let cmdId = 0;

export const useTerminal = (ctx: Ctx) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const historyIndex = useRef(-1);
  /** Whatever the user had half-typed before they started walking history. */
  const draft = useRef('');

  /**
   * The command context is held in a ref refreshed on every render.
   *
   * The previous version rebuilt the context object each render and memoised
   * `processCommand` over a hand-maintained dependency list behind an
   * eslint-disable — so any context field missing from that list was read from
   * a stale closure. This way `processCommand` is genuinely stable and always
   * sees current state.
   */
  const ctxRef = useRef(ctx as TerminalContext);

  const addToHistory = useCallback((command: string, output: ReactNode | string) => {
    setHistory(prev => [
      ...prev,
      { id: `cmd_${++cmdId}`, command, cwd: ctxRef.current.cwd, output },
    ]);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const clearCommandHistory = useCallback(() => {
    setCommandHistory([]);
    historyIndex.current = -1;
  }, []);

  // Refreshed after every render (no dependency array). Commands only ever run
  // from event handlers, which happen after effects have flushed, so the ref
  // is always current by the time anything reads it.
  useEffect(() => {
    ctxRef.current = {
      ...ctx,
      addToHistory,
      clearHistory,
      commandHistory,
      clearCommandHistory,
    };
  });

  /**
   * `record: false` runs a command without putting it in the recallable
   * history — for the login banner, which the visitor did not type and should
   * not have to arrow past.
   */
  const processCommand = useCallback((input: string, { record = true } = {}) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (record) {
      setCommandHistory(prev => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]));
      historyIndex.current = -1;
      draft.current = '';
    }

    const [name, ...args] = trimmed.split(/\s+/);
    const command = commands[name.toLowerCase()];

    if (!command) {
      audioManager.error();
      addToHistory(trimmed, `${name}: command not found. Type 'help' for a list.`);
      return;
    }

    // `clear` empties the scrollback, so there is nothing to append afterwards.
    const output = command.action(args, ctxRef.current);
    if (command.cmd === 'clear') return;

    addToHistory(trimmed, output);
  }, [addToHistory]);

  /**
   * Returns the line the input should now show, or null to leave it alone.
   * `current` is the text in the input, preserved as a draft on the first
   * step back so walking history and returning restores what you were typing.
   */
  const navigateHistory = useCallback(
    (direction: 'up' | 'down', current: string): string | null => {
      if (commandHistory.length === 0) return null;

      if (direction === 'up') {
        if (historyIndex.current === -1) {
          draft.current = current;
          historyIndex.current = commandHistory.length - 1;
        } else if (historyIndex.current > 0) {
          historyIndex.current--;
        }
        return commandHistory[historyIndex.current];
      }

      if (historyIndex.current === -1) return null;
      if (historyIndex.current < commandHistory.length - 1) {
        historyIndex.current++;
        return commandHistory[historyIndex.current];
      }
      historyIndex.current = -1;
      return draft.current;
    },
    [commandHistory],
  );

  /**
   * Bash-style completion. Returns the candidates; the caller decides whether
   * to insert the single match or list the ambiguous ones.
   */
  const getCompletions = useCallback(
    (partial: string): { candidates: string[]; replacement: string | null } => {
      const none = { candidates: [], replacement: null };
      if (!partial) return none;

      const parts = partial.split(/\s+/);

      if (parts.length === 1) {
        const matches = Object.keys(commands)
          .filter(c => c.startsWith(parts[0].toLowerCase()))
          .sort();
        return {
          candidates: matches,
          replacement: matches.length === 1 ? matches[0] : commonPrefix(matches) || null,
        };
      }

      if (!['cd', 'cat', 'ls', 'tree'].includes(parts[0].toLowerCase())) return none;

      const pathPart = parts[parts.length - 1];
      const lastSlash = pathPart.lastIndexOf('/');
      const dirPath = lastSlash >= 0 ? pathPart.slice(0, lastSlash) || '~' : '.';
      const prefix = lastSlash >= 0 ? pathPart.slice(lastSlash + 1) : pathPart;

      const node = getNode(resolvePath(ctx.cwd, dirPath));
      if (!node || node.type !== 'directory') return none;

      const matches = Object.values(node.children)
        .filter(child => child.name.startsWith(prefix) && (prefix.startsWith('.') || !child.hidden))
        .map(child => child.name + (child.type === 'directory' ? '/' : ''))
        .sort();

      if (matches.length === 0) return none;

      const base = lastSlash >= 0 ? pathPart.slice(0, lastSlash + 1) : '';
      const head = parts.slice(0, -1).join(' ');
      const completed = matches.length === 1 ? matches[0] : commonPrefix(matches);

      return {
        candidates: matches,
        replacement: completed ? `${head} ${base}${completed}` : null,
      };
    },
    [ctx.cwd],
  );

  return { history, commandHistory, processCommand, navigateHistory, getCompletions };
};

/** Longest shared prefix, so Tab can advance even when the match is ambiguous. */
function commonPrefix(values: string[]): string {
  if (values.length === 0) return '';
  return values.reduce((prefix, value) => {
    let i = 0;
    while (i < prefix.length && i < value.length && prefix[i] === value[i]) i++;
    return prefix.slice(0, i);
  });
}
