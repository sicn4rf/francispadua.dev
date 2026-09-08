import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { audioManager } from '../utils/audioManager';
import {
  CODE_SNIPPETS,
  chunkIntoLines,
  computeStats,
  lineAtIndex,
  loadBest,
  recordBest,
  sampleWords,
} from '../utils/typing';

type Mode = 'words' | 'code';

const VISIBLE_LINES = 3;
const LINE_WIDTH = 62;

const Container = styled.div`
  max-width: 780px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Options = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Option = styled.button<{ $active: boolean }>`
  background: ${({ theme, $active }) => ($active ? theme.colors.overlay : 'transparent')};
  border: none;
  border-radius: 3px;
  padding: 3px 9px;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.muted)};

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const Divider = styled.span`
  color: ${({ theme }) => theme.colors.overlay};
`;

const Timer = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 20px;
  font-variant-numeric: tabular-nums;
`;

const Viewport = styled.div<{ $lines: number }>`
  font-size: 19px;
  line-height: 1.75;
  height: ${p => p.$lines * 1.75}em;
  overflow: hidden;
  position: relative;
`;

/** Scrolls a whole line at a time, so the caret is never off-screen. */
const Scroller = styled.div<{ $offset: number }>`
  transform: translateY(${p => -p.$offset * 1.75}em);
  transition: transform 0.15s ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Char = styled.span<{ $state: 'pending' | 'right' | 'wrong' | 'caret' }>`
  color: ${({ theme, $state }) =>
    $state === 'right'
      ? theme.colors.green
      : $state === 'wrong'
        ? theme.colors.red
        : theme.colors.muted};
  background: ${({ theme, $state }) =>
    $state === 'wrong' ? `${theme.colors.red}22` : 'transparent'};
  border-left: 2px solid
    ${({ theme, $state }) => ($state === 'caret' ? theme.colors.accent : 'transparent')};
  margin-left: -2px;
`;

/**
 * A textarea, not an input: `HTMLInputElement.value` silently strips newlines,
 * so in code mode every character after the first line was being compared
 * against the wrong index of the target.
 */
const Capture = styled.textarea`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  resize: none;
  pointer-events: none;
`;

const Stats = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const Stat = styled.div``;

const StatValue = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.1;
`;

const StatLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-top: 0.2rem;
`;

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  margin-top: 1.5rem;
`;

const Best = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const DURATIONS = [15, 30, 60];
const LANGS = ['go', 'python', 'ts'];

const makeTarget = (mode: Mode, lang: string) =>
  mode === 'words'
    ? sampleWords(120).join(' ')
    : (CODE_SNIPPETS[lang] ?? CODE_SNIPPETS.ts)[
        Math.floor(Math.random() * (CODE_SNIPPETS[lang] ?? CODE_SNIPPETS.ts).length)
      ];

interface TypingTestProps {
  args: string[];
  onExit: () => void;
}

const TypingTest = ({ args, onExit }: TypingTestProps) => {
  const theme = useTheme();

  const [mode, setMode] = useState<Mode>(args[0] === 'code' ? 'code' : 'words');
  const [lang, setLang] = useState(() => (LANGS.includes(args[1]) ? args[1] : 'ts'));
  const [duration, setDuration] = useState(() => {
    const found = args.find(a => DURATIONS.includes(Number(a)));
    return found ? Number(found) : 30;
  });

  // Lazy initialiser rather than a setState in an effect, which cascades renders.
  const [target, setTarget] = useState(() => makeTarget(mode, lang));
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  /** Set when the run ends; its distance from startedAt is the scored time. */
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  /** Whole seconds since the start, for the countdown only. */
  const [ticks, setTicks] = useState(0);
  const [best, setBest] = useState(loadBest);

  const captureRef = useRef<HTMLTextAreaElement>(null);
  // The deadline fires from a timer, which needs the newest text.
  const typedRef = useRef('');
  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  const finished = finishedAt !== null;
  const timeLeft = Math.max(0, duration - ticks);
  const bestKey = mode === 'words' ? `words-${duration}` : `code-${lang}`;

  const restart = useCallback(
    (nextMode = mode, nextLang = lang) => {
      setTarget(makeTarget(nextMode, nextLang));
      setTyped('');
      setStartedAt(null);
      setFinishedAt(null);
      setTicks(0);
      captureRef.current?.focus();
    },
    [mode, lang],
  );

  /**
   * Ends the run and banks the score. Called from event handlers and from the
   * countdown — never from render, so reading the clock here is safe.
   */
  const finish = useCallback(
    (finalTyped: string) => {
      const at = Date.now();
      setFinishedAt(at);

      const seconds = startedAt ? (at - startedAt) / 1000 : 0;
      const result = computeStats(finalTyped, target, seconds);
      if (result.typed > 0) {
        setBest(recordBest(bestKey, result.wpm, result.accuracy));
        audioManager.success();
      }
    },
    [startedAt, target, bestKey],
  );

  const elapsedSeconds =
    startedAt !== null && finishedAt !== null ? (finishedAt - startedAt) / 1000 : ticks;

  const stats = useMemo(
    () => computeStats(typed, target, elapsedSeconds),
    [typed, target, elapsedSeconds],
  );

  /* Drives the displayed countdown only. */
  useEffect(() => {
    if (startedAt === null || finished) return;
    const id = setInterval(() => setTicks(prev => prev + 1), 1000);
    return () => clearInterval(id);
  }, [startedAt, finished]);

  /* The actual deadline. One timer against the wall clock, so a throttled
     background tab cannot stretch the run. Code mode ends on completion. */
  useEffect(() => {
    if (startedAt === null || finished || mode !== 'words') return;
    const remaining = startedAt + duration * 1000 - Date.now();
    const id = setTimeout(() => finish(typedRef.current), Math.max(0, remaining));
    return () => clearTimeout(id);
  }, [startedAt, finished, mode, duration, finish]);

  useEffect(() => {
    captureRef.current?.focus();
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;

    const value = e.target.value;
    if (startedAt === null && value.length > 0) setStartedAt(Date.now());
    audioManager.keystroke();
    setTyped(value);

    if (value.length >= target.length) finish(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();

    if (e.key === 'Escape') {
      e.preventDefault();
      onExit();
      return;
    }

    if (e.key === 'Enter') {
      if (finished) {
        e.preventDefault();
        restart();
        return;
      }
      // In word mode a newline is never part of the target; swallow it.
      if (mode === 'words') e.preventDefault();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (mode === 'code' && !finished) {
        const value = `${typed}\t`;
        if (startedAt === null) setStartedAt(Date.now());
        setTyped(value);
      }
    }
  };

  /* Render the target, colour-coded, scrolled to keep the caret visible. */
  const lines = useMemo(
    () =>
      mode === 'words'
        ? chunkIntoLines(target.split(' '), LINE_WIDTH).map(w => w.join(' '))
        : target.split('\n'),
    [target, mode],
  );

  const caretLine = useMemo(() => {
    if (mode === 'words') {
      return lineAtIndex(
        chunkIntoLines(target.split(' '), LINE_WIDTH),
        typed.length,
      );
    }
    return typed.split('\n').length - 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed.length, target, mode]);

  const visible = mode === 'code' ? lines.length : VISIBLE_LINES;
  // Keep the active line in the middle band rather than at the bottom edge.
  const offset = Math.max(0, Math.min(caretLine - 1, Math.max(0, lines.length - visible)));

  let index = 0;
  const rendered = lines.map((line, li) => {
    const chars = [...line].map(char => {
      const i = index++;
      const state =
        i < typed.length
          ? typed[i] === char
            ? ('right' as const)
            : ('wrong' as const)
          : i === typed.length
            ? ('caret' as const)
            : ('pending' as const);
      return (
        <Char key={i} $state={state}>
          {char}
        </Char>
      );
    });
    // The separator between lines is a real character in the target.
    index++;
    return <div key={li}>{chars.length > 0 ? chars : ' '}</div>;
  });

  const record = best[bestKey];

  return (
    <Container onClick={() => captureRef.current?.focus()}>
      <Header>
        <Options>
          {(['words', 'code'] as Mode[]).map(m => (
            <Option
              key={m}
              $active={mode === m}
              onClick={() => {
                setMode(m);
                restart(m, lang);
              }}
            >
              {m}
            </Option>
          ))}
          <Divider>│</Divider>
          {mode === 'words'
            ? DURATIONS.map(d => (
                <Option
                  key={d}
                  $active={duration === d}
                  onClick={() => {
                    setDuration(d);
                    restart(mode, lang);
                  }}
                >
                  {d}s
                </Option>
              ))
            : LANGS.map(l => (
                <Option
                  key={l}
                  $active={lang === l}
                  onClick={() => {
                    setLang(l);
                    restart(mode, l);
                  }}
                >
                  {l}
                </Option>
              ))}
        </Options>
        {mode === 'words' && !finished && startedAt !== null && <Timer>{timeLeft}</Timer>}
        {record && <Best>best {record.wpm} wpm</Best>}
      </Header>

      <Viewport $lines={visible} style={{ whiteSpace: mode === 'code' ? 'pre' : 'pre-wrap' }}>
        <Scroller $offset={offset}>{rendered}</Scroller>
      </Viewport>

      <Capture
        ref={captureRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Typing test input"
      />

      {finished && (
        <Stats>
          <Stat>
            <StatValue>{stats.wpm}</StatValue>
            <StatLabel>wpm</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{stats.accuracy}%</StatValue>
            <StatLabel>accuracy</StatLabel>
          </Stat>
          <Stat>
            <StatValue style={{ color: theme.colors.muted }}>{stats.raw}</StatValue>
            <StatLabel>raw</StatLabel>
          </Stat>
          <Stat>
            <StatValue style={{ color: theme.colors.muted }}>
              {stats.correct}/{stats.incorrect}
            </StatValue>
            <StatLabel>correct / wrong</StatLabel>
          </Stat>
        </Stats>
      )}

      <Hint>
        {finished
          ? 'Enter to go again, Escape to exit.'
          : startedAt === null
            ? 'Start typing to begin. Escape to exit.'
            : 'Escape to exit.'}
      </Hint>
    </Container>
  );
};

export default TypingTest;
