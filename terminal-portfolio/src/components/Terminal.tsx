import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTerminal } from '../hooks/useTerminal';
import { Output } from './Output';
import { Prompt } from './Prompt';
import { WindowFrame } from './WindowFrame';
import { StatusBar } from './StatusBar';
import { BANNER_LINES, BOOT_LINES } from '../utils/asciiArt';
import { audioManager } from '../utils/audioManager';
import { blink, fadeIn } from '../styles/GlobalStyle';
import type { ReactNode } from 'react';

const TerminalBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 1rem 1.25rem;
  cursor: text;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 24px;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.foreground};
  font-family: ${({ theme }) => theme.font};
  font-size: 14px;
  flex: 1;
  outline: none;
  caret-color: ${({ theme }) => theme.colors.green};
`;

const BannerLine = styled.div<{ $index: number; $total: number }>`
  font-size: 6px;
  line-height: 1.1;
  font-family: inherit;
  white-space: pre;
  animation: ${fadeIn} 0.15s ease-out ${p => p.$index * 0.05}s both;
  color: ${({ $index, $total }) => {
    const t = $index / ($total - 1);
    // Catppuccin purple-pink gradient: mauve -> pink -> rosewater
    const colors = ['#cba6f7', '#f5c2e7', '#f5e0dc'];
    const segment = t * (colors.length - 1);
    const i = Math.min(Math.floor(segment), colors.length - 2);
    const mix = segment - i;
    const from = colors[i];
    const to = colors[i + 1];
    // Simple hex interpolation
    const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
    const parse = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    const [r1, g1, b1] = parse(from);
    const [r2, g2, b2] = parse(to);
    return '#' + [lerp(r1, r2, mix), lerp(g1, g2, mix), lerp(b1, b2, mix)].map(v => v.toString(16).padStart(2, '0')).join('');
  }};

  @media (min-width: 900px) {
    font-size: 8px;
  }

  @media (min-width: 1200px) {
    font-size: 10px;
  }

  @media (max-width: 600px) {
    font-size: 4px;
  }
`;

const BannerContainer = styled.div`
  margin: 0;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 12px;
  animation: ${fadeIn} 0.5s ease-out 0.2s both;
`;

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.5rem;
  font-size: 12px;
  animation: ${fadeIn} 0.5s ease-out 0.4s both;
`;

const BootLine = styled.div<{ $delay: number }>`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  animation: ${fadeIn} 0.1s ease-out ${p => p.$delay}s both;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: ${({ theme }) => theme.colors.green};
  animation: ${blink} 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
`;

const ActiveComponentWrapper = styled.div`
  padding: 1rem 1.25rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const CompletionHint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  padding-left: 0.25rem;
  margin-bottom: 0.25rem;
`;

const MobileHint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  text-align: center;
  padding: 0.5rem;
  opacity: 0.6;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

interface TerminalProps {
  currentTheme: string;
  setTheme: (name: string) => void;
}

export const Terminal = ({ currentTheme, setTheme }: TerminalProps) => {
  const [cwd, setCwd] = useState('~');
  const [soundEnabled, setSoundEnabled] = useState(audioManager.enabled);
  const [soundVolume, setSoundVolume] = useState(audioManager.volume);
  const [activeComponent, setActiveComponent] = useState<ReactNode | null>(null);
  const [input, setInput] = useState('');
  const [booting, setBooting] = useState(true);
  const [completions, setCompletions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSetSound = useCallback((v: boolean) => {
    audioManager.enabled = v;
    setSoundEnabled(v);
  }, []);

  const handleSetVolume = useCallback((v: number) => {
    audioManager.volume = v;
    setSoundVolume(v);
  }, []);

  const { history, processCommand, navigateHistory, getCompletions } = useTerminal({
    cwd,
    setCwd,
    setTheme,
    currentTheme,
    soundEnabled,
    setSoundEnabled: handleSetSound,
    soundVolume,
    setSoundVolume: handleSetVolume,
    setActiveComponent,
  });

  useEffect(() => {
    audioManager.boot();
    const timer = setTimeout(() => setBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Konami code: ↑↑↓↓←→←→BA
  useEffect(() => {
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let seq: string[] = [];
    const handler = (e: KeyboardEvent) => {
      seq.push(e.key);
      if (seq.length > KONAMI.length) seq = seq.slice(-KONAMI.length);
      if (seq.length === KONAMI.length && seq.every((k, i) => k === KONAMI[i])) {
        seq = [];
        audioManager.success();
        // Flash effect
        document.body.style.transition = 'filter 0.15s';
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        setTimeout(() => { document.body.style.filter = ''; }, 300);
        // Unlock secret theme
        setTheme('matrix');
        processCommand('cowsay You found the secret! Matrix theme unlocked.');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTheme, processCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, booting]);

  useEffect(() => {
    if (!activeComponent && !booting) {
      inputRef.current?.focus();
    }
  }, [history, activeComponent, booting]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      audioManager.enter();
      setCompletions([]);
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = navigateHistory('up');
      if (prev !== null) setInput(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = navigateHistory('down');
      if (next !== null) setInput(next);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = getCompletions(input);
      if (matches.length === 1) {
        setInput(matches[0]);
        setCompletions([]);
      } else if (matches.length > 1) {
        setCompletions(matches);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      processCommand('clear');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setCompletions([]);
    audioManager.keystroke();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const statusBar = (
    <StatusBar cwd={cwd} themeName={currentTheme} soundEnabled={soundEnabled} />
  );

  if (activeComponent) {
    return (
      <WindowFrame title={`visitor@portfolio: ${cwd}`} statusBar={statusBar}>
        <ActiveComponentWrapper>{activeComponent}</ActiveComponentWrapper>
      </WindowFrame>
    );
  }

  return (
    <WindowFrame title={`visitor@portfolio: ${cwd}`} statusBar={statusBar}>
      <TerminalBody onClick={handleContainerClick}>
        {booting ? (
          BOOT_LINES.map((line, i) => (
            <BootLine key={i} $delay={i * 0.14}>{line}</BootLine>
          ))
        ) : (
          <>
            <BannerContainer>
              {BANNER_LINES.map((line, i) => (
                <BannerLine key={i} $index={i} $total={BANNER_LINES.length}>{line}</BannerLine>
              ))}
            </BannerContainer>
            <Subtitle>CS @ UCI '27 | Software Developer | Infrastructure Engineer</Subtitle>
            <Hint>Type <strong style={{ color: 'inherit' }}>'help'</strong> to see available commands.</Hint>

            {history.map((item) => (
              <Output key={item.id} item={item} cwd={cwd} />
            ))}

            {completions.length > 1 && (
              <CompletionHint>{completions.join('  ')}</CompletionHint>
            )}

            <InputArea>
              <Prompt cwd={cwd} />
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
              {!input && <Cursor />}
            </InputArea>
            <MobileHint>Tap anywhere to type</MobileHint>
            <div ref={bottomRef} />
          </>
        )}
      </TerminalBody>
    </WindowFrame>
  );
};
