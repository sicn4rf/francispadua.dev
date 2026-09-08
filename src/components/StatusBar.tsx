import styled from 'styled-components';
import type { TerminalMode } from '../types';

/**
 * Modelled on zellij's status bar: a mode indicator followed by keybinding
 * chips. It doubles as discoverability — nothing else on the page tells you
 * that Tab completes or that Ctrl-p opens the pane.
 */

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  height: 26px;
  min-height: 26px;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.overlay};
  font-size: 11px;
  user-select: none;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Mode = styled.span<{ $mode: TerminalMode }>`
  padding: 2px 10px;
  border-radius: 3px;
  font-weight: 700;
  letter-spacing: 1px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.background};
  background: ${({ theme, $mode }) =>
    $mode === 'GAME'
      ? theme.colors.yellow
      : $mode === 'PANE'
        ? theme.colors.accent
        : theme.colors.green};
`;

const Hints = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.overlay};
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;

  b {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  padding-left: 10px;
  color: ${({ theme }) => theme.colors.muted};
  flex-shrink: 0;
`;

const Path = styled.span`
  color: ${({ theme }) => theme.colors.blue};
`;

const Toggle = styled.button<{ $on: boolean }>`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: ${({ theme, $on }) => ($on ? theme.colors.green : theme.colors.muted)};

  &:hover {
    text-decoration: underline;
  }
`;

const HINTS: Record<TerminalMode, [string, string][]> = {
  NORMAL: [
    ['Tab', 'complete'],
    ['↑↓', 'history'],
    ['Ctrl-p', 'pane'],
    ['Ctrl-l', 'clear'],
    ['help', 'commands'],
  ],
  GAME: [
    ['Esc', 'quit'],
    ['Enter', 'restart'],
  ],
  PANE: [
    ['Esc', 'close'],
    ['Ctrl-p', 'toggle'],
  ],
};

interface StatusBarProps {
  cwd: string;
  mode: TerminalMode;
  themeName: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StatusBar = ({ cwd, mode, themeName, soundEnabled, onToggleSound }: StatusBarProps) => (
  <Bar>
    <Mode $mode={mode}>{mode}</Mode>
    <Hints>
      {HINTS[mode].map(([key, label]) => (
        <Chip key={key}>
          <b>{key}</b>
          {label}
        </Chip>
      ))}
    </Hints>
    <Right>
      <Path>{cwd}</Path>
      <Toggle
        $on={soundEnabled}
        onClick={onToggleSound}
        aria-label={soundEnabled ? 'Mute keyboard sounds' : 'Unmute keyboard sounds'}
      >
        {soundEnabled ? 'sound on' : 'sound off'}
      </Toggle>
      <span>{themeName}</span>
    </Right>
  </Bar>
);
