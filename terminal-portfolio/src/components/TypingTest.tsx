import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { audioManager } from '../utils/audioManager';

const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'great', 'between', 'need',
  'large', 'under', 'never', 'each', 'right', 'move', 'own', 'while',
  'found', 'head', 'still', 'long', 'might', 'next', 'much', 'call',
  'world', 'hand', 'high', 'keep', 'last', 'left', 'start', 'might',
  'begin', 'life', 'always', 'those', 'both', 'paper', 'group', 'often',
  'run', 'point', 'turn', 'play', 'line', 'set', 'state', 'home',
  'read', 'small', 'end', 'put', 'place', 'number', 'man', 'ask',
  'change', 'went', 'light', 'kind', 'off', 'need', 'house', 'picture',
  'try', 'again', 'animal', 'every', 'school', 'name', 'help', 'city',
  'tree', 'cross', 'hard', 'port', 'miss', 'act', 'build', 'stay',
  'fall', 'eat', 'room', 'friend', 'began', 'idea', 'fish', 'stop',
  'example', 'system', 'code', 'function', 'program', 'type', 'data',
];

const CODE_SNIPPETS: Record<string, string[]> = {
  go: [
    `func fibonacci(n int) int {\n  if n <= 1 {\n    return n\n  }\n  return fibonacci(n-1) + fibonacci(n-2)\n}`,
    `func reverseString(s string) string {\n  runes := []rune(s)\n  for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n    runes[i], runes[j] = runes[j], runes[i]\n  }\n  return string(runes)\n}`,
    `func contains(slice []string, item string) bool {\n  for _, v := range slice {\n    if v == item {\n      return true\n    }\n  }\n  return false\n}`,
  ],
  python: [
    `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
    `def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result`,
    `def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]`,
  ],
  ts: [
    `function debounce<T extends (...args: any[]) => void>(\n  fn: T,\n  delay: number\n): (...args: Parameters<T>) => void {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}`,
    `function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {\n  return arr.reduce((acc, item) => {\n    const k = String(item[key]);\n    if (!acc[k]) acc[k] = [];\n    acc[k].push(item);\n    return acc;\n  }, {} as Record<string, T[]>);\n}`,
    `async function retry<T>(\n  fn: () => Promise<T>,\n  attempts: number\n): Promise<T> {\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();\n    } catch (e) {\n      if (i === attempts - 1) throw e;\n    }\n  }\n  throw new Error("unreachable");\n}`,
  ],
};

const Container = styled.div`
  font-family: ${({ theme }) => theme.font};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const WordsDisplay = styled.div`
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 16px;
  min-height: 80px;
  max-height: 200px;
  overflow: hidden;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
`;

const StatBlock = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.accent};
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ModeButton = styled.span<{ $active: boolean }>`
  color: ${({ theme, $active }) => $active ? theme.colors.accent : theme.colors.muted};
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 3px;
  background: ${({ theme, $active }) => $active ? theme.colors.surface : 'transparent'};
  font-size: 12px;
`;

const ExitHint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  margin-top: 1rem;
`;

interface TypingTestProps {
  args: string[];
  onExit: () => void;
}

function shuffleWords(count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  }
  return result;
}

const TypingTest = ({ args, onExit }: TypingTestProps) => {
  const theme = useTheme();

  // Parse args
  const isCodeMode = args[0] === 'code';
  const codeLang = isCodeMode ? (args[1] || 'ts') : '';
  const timeArg = args.find(a => ['15', '30', '60'].includes(a));
  const duration = parseInt(timeArg || '30');

  const [mode, setMode] = useState<'words' | 'code'>(isCodeMode ? 'code' : 'words');
  const [lang, setLang] = useState(codeLang || 'ts');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [typed, setTyped] = useState('');
  const [target, setTarget] = useState('');
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Generate target text
  useEffect(() => {
    if (mode === 'words') {
      setTarget(shuffleWords(80).join(' '));
    } else {
      const snippets = CODE_SNIPPETS[lang] || CODE_SNIPPETS.ts;
      setTarget(snippets[Math.floor(Math.random() * snippets.length)]);
    }
    setTyped('');
    setStarted(false);
    setFinished(false);
    setTimeLeft(duration);
    setCorrectChars(0);
    setTotalChars(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [mode, lang, duration]);

  // Timer
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setFinished(true);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished]);

  // Focus
  useEffect(() => {
    inputRef.current?.focus();
  }, [mode, finished]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onExit();
      return;
    }

    if (finished) {
      if (e.key === 'Enter') {
        // Restart
        setTyped('');
        setStarted(false);
        setFinished(false);
        setTimeLeft(duration);
        setCorrectChars(0);
        setTotalChars(0);
        if (mode === 'words') setTarget(shuffleWords(80).join(' '));
        else {
          const snippets = CODE_SNIPPETS[lang] || CODE_SNIPPETS.ts;
          setTarget(snippets[Math.floor(Math.random() * snippets.length)]);
        }
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (mode === 'code') {
        // Insert two spaces for tab in code mode
        const newTyped = typed + '  ';
        setTyped(newTyped);
        if (!started) setStarted(true);
      }
      return;
    }
  }, [finished, started, typed, mode, lang, duration, onExit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;

    const newValue = e.target.value;
    if (!started) setStarted(true);

    audioManager.keystroke();
    setTyped(newValue);

    // Count correct chars
    let correct = 0;
    let total = newValue.length;
    for (let i = 0; i < newValue.length && i < target.length; i++) {
      if (newValue[i] === target[i]) correct++;
    }
    setCorrectChars(correct);
    setTotalChars(total);

    // If typed all target in code mode
    if (mode === 'code' && newValue.length >= target.length) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const elapsedTime = duration - timeLeft;
  const wpm = elapsedTime > 0 ? Math.round((correctChars / 5) / (elapsedTime / 60)) : 0;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

  // Render target with coloring
  const renderTarget = () => {
    const chars = target.split('');
    return chars.map((char, i) => {
      let color = theme.colors.muted;
      if (i < typed.length) {
        color = typed[i] === char ? theme.colors.green : theme.colors.red;
      } else if (i === typed.length) {
        color = theme.colors.foreground;
      }

      const isCurrentChar = i === typed.length;
      return (
        <span
          key={i}
          style={{
            color,
            textDecoration: isCurrentChar ? 'underline' : 'none',
            fontWeight: isCurrentChar ? 'bold' : 'normal',
            whiteSpace: mode === 'code' ? 'pre' : undefined,
          }}
        >
          {char === '\n' ? '\u21b5\n' : char}
        </span>
      );
    });
  };

  return (
    <Container onClick={() => inputRef.current?.focus()}>
      <Header>
        <ModeSelector>
          <ModeButton $active={mode === 'words'} onClick={() => setMode('words')}>words</ModeButton>
          <ModeButton $active={mode === 'code'} onClick={() => setMode('code')}>code</ModeButton>
          {mode === 'code' && (
            <>
              <span style={{ color: theme.colors.muted }}>|</span>
              {['go', 'python', 'ts'].map(l => (
                <ModeButton key={l} $active={lang === l} onClick={() => setLang(l)}>{l}</ModeButton>
              ))}
            </>
          )}
          {mode === 'words' && (
            <>
              <span style={{ color: theme.colors.muted }}>|</span>
              <span style={{ color: theme.colors.muted, fontSize: 12 }}>{duration}s</span>
            </>
          )}
        </ModeSelector>
        <span>{started && !finished ? `${timeLeft}s` : ''}</span>
      </Header>

      <WordsDisplay style={{ whiteSpace: mode === 'code' ? 'pre' : 'pre-wrap' }}>
        {renderTarget()}
      </WordsDisplay>

      <HiddenInput
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />

      {finished && (
        <Stats>
          <StatBlock>
            <StatValue>{wpm}</StatValue>
            <StatLabel>WPM</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatValue>{accuracy}%</StatValue>
            <StatLabel>Accuracy</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatValue>{correctChars}</StatValue>
            <StatLabel>Correct</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatValue>{totalChars - correctChars}</StatValue>
            <StatLabel>Errors</StatLabel>
          </StatBlock>
        </Stats>
      )}

      <ExitHint>
        {finished ? 'Press Enter to restart or Escape to exit.' : 'Press Escape to exit. Start typing to begin.'}
      </ExitHint>
    </Container>
  );
};

export default TypingTest;
