import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useTerminal } from '../hooks/useTerminal';
import { Output } from './Output';
import { Prompt } from './Prompt';
import { WindowFrame } from './WindowFrame';
import { StatusBar } from './StatusBar';
import { SidePanel } from './SidePanel';
import { BANNER_LINES, BOOT_LINES, bannerRuns } from '../utils/asciiArt';
import { audioManager } from '../utils/audioManager';
import { profile } from '../utils/content';
import { fadeIn, prefersReducedMotion } from '../styles/GlobalStyle';
import type { ReactNode } from 'react';
import type { SidePanelContent, TerminalMode } from '../types';

const Split = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 1.25rem;
  cursor: text;
`;

const InputRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-height: 22px;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.foreground};
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  min-width: 0;
  outline: none;
  padding: 0;
  caret-color: ${({ theme }) => theme.colors.accent};
`;

const Banner = styled.div`
  margin-bottom: 0.75rem;
`;

const BannerLine = styled.div<{ $t: number }>`
  font-size: 7px;
  line-height: 1.08;
  white-space: pre;
  animation: ${fadeIn} 0.18s ease-out ${p => p.$t * 0.06}s both;
  /* Blend across the theme's two loudest hues so the ramp is actually visible.
     The old pink→purple pair differed by ~6% and read as flat. */
  color: ${({ $t, theme }) => mix(theme.colors.purple, theme.colors.blue, $t)};

  ${prefersReducedMotion} {
    animation: none;
  }

  @media (min-width: 700px) {
    font-size: 9px;
  }
  @media (min-width: 1100px) {
    font-size: 11px;
  }
  @media (max-width: 480px) {
    font-size: 5px;
  }
`;

/**
 * The ░ drop-shadow layer of the DOS Rebel font. At full weight it interleaves
 * with the █ face and the whole wordmark reads as checkerboard; held well back
 * it does the job the font intends and gives the letters depth.
 */
const BannerShadow = styled.span`
  opacity: 0.28;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 12.5px;
  animation: ${fadeIn} 0.4s ease-out 0.25s both;

  ${prefersReducedMotion} {
    animation: none;
  }
`;

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.25rem;
  font-size: 12.5px;
  animation: ${fadeIn} 0.4s ease-out 0.4s both;

  ${prefersReducedMotion} {
    animation: none;
  }

  b {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }
`;

const BootLine = styled.div<{ $delay: number }>`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  white-space: pre-wrap;
  animation: ${fadeIn} 0.1s ease-out ${p => p.$delay}s both;

  ${prefersReducedMotion} {
    animation: none;
  }
`;

const FullScreen = styled.div`
  padding: 1rem 1.25rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const Completions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 1.5rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12.5px;
  margin-bottom: 0.3rem;
`;

const TouchHint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  text-align: center;
  padding: 0.75rem 0;
  display: none;

  @media (hover: none) and (pointer: coarse) {
    display: block;
  }
`;

/** Linear blend between two hex colours; `t` runs 0→1 down the banner. */
function mix(from: string, to: string, t: number): string {
  const parse = (hex: string) =>
    [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const channel = (a: number, b: number) =>
    Math.round(a + (b - a) * t)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
}

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];

interface TerminalProps {
  currentTheme: string;
  setTheme: (name: string) => void;
}

export const Terminal = ({ currentTheme, setTheme }: TerminalProps) => {
  const [cwd, setCwd] = useState('~');
  const [soundEnabled, setSoundEnabled] = useState(audioManager.enabled);
  const [soundVolume, setSoundVolume] = useState(audioManager.volume);
  const [activeComponent, setActiveComponent] = useState<ReactNode | null>(null);
  const [overlay, setOverlay] = useState<ReactNode | null>(null);
  const [panelContent, setPanelContent] = useState<SidePanelContent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [input, setInput] = useState('');
  const [booting, setBooting] = useState(true);
  const [completions, setCompletions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const mode: TerminalMode = activeComponent ? 'GAME' : panelOpen ? 'PANE' : 'NORMAL';

  const handleSetSound = useCallback((v: boolean) => {
    audioManager.enabled = v;
    setSoundEnabled(v);
  }, []);

  const handleSetVolume = useCallback((v: number) => {
    audioManager.volume = v;
    setSoundVolume(v);
  }, []);

  const openSidePanel = useCallback((content: SidePanelContent) => {
    setPanelContent(content);
    setPanelOpen(true);
  }, []);

  const closeSidePanel = useCallback(() => setPanelOpen(false), []);

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
    setOverlay,
    openSidePanel,
  });

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Konami code. Scoped to NORMAL mode — on `window` and always-on it ate the
   * arrow keys that walk command history, and Snake's steering.
   */
  useEffect(() => {
    if (mode !== 'NORMAL') return;

    let seq: string[] = [];
    const handler = (e: KeyboardEvent) => {
      seq = [...seq, e.key].slice(-KONAMI.length);
      if (seq.length < KONAMI.length || !seq.every((k, i) => k === KONAMI[i])) return;

      seq = [];
      audioManager.success();
      setTheme('matrix');
      processCommand('cowsay Matrix theme unlocked. Try `kubectl get pods` next.');
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode, setTheme, processCommand]);

  /** Ctrl-p toggles the pane from anywhere except inside a game. */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'p' || !e.ctrlKey || activeComponent) return;
      e.preventDefault();
      setPanelOpen(open => (panelContent ? !open : open));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeComponent, panelContent]);

  /** Escape closes the pane, but games own Escape while they are running. */
  useEffect(() => {
    if (!panelOpen || activeComponent) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setPanelOpen(false);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [panelOpen, activeComponent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [history, booting]);

  useEffect(() => {
    if (!activeComponent && !booting) inputRef.current?.focus();
  }, [history, activeComponent, booting]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      audioManager.enter();
      setCompletions([]);
      processCommand(input);
      setInput('');
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = navigateHistory(e.key === 'ArrowUp' ? 'up' : 'down', input);
      if (next !== null) setInput(next);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const { candidates, replacement } = getCompletions(input);
      if (replacement && replacement !== input) setInput(replacement);
      setCompletions(candidates.length > 1 ? candidates : []);
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      processCommand('clear');
      setInput('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setCompletions([]);
    audioManager.keystroke();
  };

  const statusBar = useMemo(
    () => (
      <StatusBar
        cwd={cwd}
        mode={mode}
        themeName={currentTheme}
        soundEnabled={soundEnabled}
        onToggleSound={() => handleSetSound(!soundEnabled)}
      />
    ),
    [cwd, mode, currentTheme, soundEnabled, handleSetSound],
  );

  const title = `visitor@portfolio: ${cwd}`;

  if (activeComponent) {
    return (
      <WindowFrame title={title} statusBar={statusBar}>
        <FullScreen>{activeComponent}</FullScreen>
        {overlay}
      </WindowFrame>
    );
  }

  return (
    <WindowFrame title={title} statusBar={statusBar}>
      <Split>
        <Body onClick={() => inputRef.current?.focus()}>
          {booting ? (
            BOOT_LINES.map((line, i) => (
              <BootLine key={line} $delay={i * 0.12}>
                {line}
              </BootLine>
            ))
          ) : (
            <>
              <Banner role="img" aria-label={profile.name}>
                {BANNER_LINES.map((line, i) => (
                  <BannerLine key={i} $t={i / (BANNER_LINES.length - 1)} aria-hidden="true">
                    {bannerRuns(line).map((run, j) =>
                      run.shadow ? (
                        <BannerShadow key={j}>{run.text}</BannerShadow>
                      ) : (
                        <span key={j}>{run.text}</span>
                      ),
                    )}
                  </BannerLine>
                ))}
              </Banner>
              <Subtitle>{profile.subtitle}</Subtitle>
              <Hint>
                Type <b>help</b> to get started, or just type what you would type in a real shell.
              </Hint>

              <div aria-live="polite" aria-atomic="false">
                {history.map(item => (
                  <Output key={item.id} item={item} />
                ))}
              </div>

              {completions.length > 1 && (
                <Completions>
                  {completions.map(c => (
                    <span key={c}>{c}</span>
                  ))}
                </Completions>
              )}

              <InputRow>
                <Prompt cwd={cwd} />
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  aria-label="Terminal input"
                />
              </InputRow>
              <TouchHint>Tap anywhere to bring up the keyboard.</TouchHint>
              <div ref={bottomRef} />
            </>
          )}
        </Body>
        <SidePanel content={panelContent} open={panelOpen} onClose={closeSidePanel} />
        {overlay}
      </Split>
    </WindowFrame>
  );
};
