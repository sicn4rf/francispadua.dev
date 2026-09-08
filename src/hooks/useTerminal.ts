import { useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { commands } from '../utils/commands';
import { getNode, resolvePath } from '../utils/fileSystem';
import type { HistoryItem, TerminalContext } from '../types';

let cmdId = 0;

export const useTerminal = (ctx: Omit<TerminalContext, 'addToHistory' | 'clearHistory'>) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const historyIndex = useRef(-1);

  const addToHistory = useCallback((command: string, output: ReactNode | string) => {
    setHistory(prev => [
      ...prev,
      { id: `cmd_${++cmdId}`, command, output },
    ]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const fullCtx: TerminalContext = {
    ...ctx,
    addToHistory,
    clearHistory,
  };

  const processCommand = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      setCmdHistory(prev => [...prev, trimmedInput]);
      historyIndex.current = -1;

      const [cmdName, ...args] = trimmedInput.split(/\s+/);
      const lowerCmd = cmdName.toLowerCase();

      if (lowerCmd === 'clear') {
        clearHistory();
        return;
      }

      const command = commands[lowerCmd];
      if (command) {
        addToHistory(trimmedInput, command.action(args, fullCtx));
      } else {
        addToHistory(
          trimmedInput,
          `Command not found: ${cmdName}. Type 'help' for available commands.`
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addToHistory, clearHistory, ctx.cwd, ctx.currentTheme, ctx.soundEnabled, ctx.soundVolume]
  );

  const navigateHistory = useCallback(
    (_direction: 'up' | 'down'): string | null => {
      if (cmdHistory.length === 0) return null;

      if (_direction === 'up') {
        if (historyIndex.current === -1) {
          historyIndex.current = cmdHistory.length - 1;
        } else if (historyIndex.current > 0) {
          historyIndex.current--;
        }
        return cmdHistory[historyIndex.current];
      } else {
        if (historyIndex.current === -1) return null;
        if (historyIndex.current < cmdHistory.length - 1) {
          historyIndex.current++;
          return cmdHistory[historyIndex.current];
        } else {
          historyIndex.current = -1;
          return '';
        }
      }
    },
    [cmdHistory]
  );

  const getCompletions = useCallback(
    (partial: string): string[] => {
      if (!partial) return [];

      const parts = partial.split(/\s+/);

      if (parts.length === 1) {
        return Object.keys(commands)
          .filter(c => c.startsWith(parts[0].toLowerCase()))
          .sort();
      }

      const cmd = parts[0].toLowerCase();
      if (['cd', 'cat', 'ls'].includes(cmd)) {
        const pathPart = parts[parts.length - 1] || '';
        const lastSlash = pathPart.lastIndexOf('/');
        const dirPath = lastSlash >= 0 ? pathPart.substring(0, lastSlash) || '~' : ctx.cwd;
        const prefix = lastSlash >= 0 ? pathPart.substring(lastSlash + 1) : pathPart;

        const resolved = resolvePath(ctx.cwd, dirPath);
        const node = getNode(resolved);

        if (node && node.type === 'directory') {
          return Object.values(node.children)
            .filter(child => child.name.startsWith(prefix) && !child.hidden)
            .map(child => {
              const base = lastSlash >= 0 ? pathPart.substring(0, lastSlash + 1) : '';
              const suffix = child.type === 'directory' ? '/' : '';
              return `${cmd} ${base}${child.name}${suffix}`;
            });
        }
      }

      return [];
    },
    [ctx.cwd]
  );

  return {
    history,
    processCommand,
    navigateHistory,
    getCompletions,
  };
};
