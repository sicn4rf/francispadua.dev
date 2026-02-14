import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { commands } from '../utils/commands';
import type { HistoryItem } from '../types';
import _ from 'lodash';

export const useTerminal = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = useCallback((command: string, output: ReactNode | string) => {
    setHistory((prev) => [
      ...prev,
      {
        id: _.uniqueId('cmd_'),
        command,
        output,
      },
    ]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const processCommand = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      const [cmdName, ...args] = trimmedInput.split(' ');
      const command = commands[cmdName.toLowerCase()];

      if (cmdName.toLowerCase() === 'clear') {
        clearHistory();
        return;
      }

      if (command) {
        addToHistory(trimmedInput, command.action(args));
      } else {
        addToHistory(
          trimmedInput,
          `Command not found: ${cmdName}. Type 'help' for available commands.`
        );
      }
    },
    [addToHistory, clearHistory]
  );

  return {
    history,
    processCommand,
  };
};
