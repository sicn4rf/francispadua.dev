export interface TypingStats {
  /** Net speed: correctly typed characters only. */
  wpm: number;
  /** Gross speed: every character typed, right or wrong. */
  raw: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  typed: number;
}

/**
 * A "word" is five characters, the standard WPM convention — so a test's score
 * doesn't depend on how long the sampled words happen to be.
 */
export function computeStats(typed: string, target: string, elapsedSeconds: number): TypingStats {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (i < target.length && typed[i] === target[i]) correct++;
  }

  const incorrect = typed.length - correct;
  const minutes = elapsedSeconds / 60;

  return {
    wpm: minutes > 0 ? Math.round(correct / 5 / minutes) : 0,
    raw: minutes > 0 ? Math.round(typed.length / 5 / minutes) : 0,
    accuracy: typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100,
    correct,
    incorrect,
    typed: typed.length,
  };
}

/**
 * Groups words into lines of at most `maxChars`.
 *
 * Word mode used to render all 80 words into a 200px box with `overflow:
 * hidden`, so past the third line you were typing against text you could not
 * see. Chunking here lets the view scroll a line at a time without measuring
 * the DOM.
 */
export function chunkIntoLines(words: string[], maxChars = 60): string[][] {
  const lines: string[][] = [];
  let line: string[] = [];
  let width = 0;

  for (const word of words) {
    const cost = line.length === 0 ? word.length : word.length + 1;
    if (width + cost > maxChars && line.length > 0) {
      lines.push(line);
      line = [word];
      width = word.length;
    } else {
      line.push(word);
      width += cost;
    }
  }
  if (line.length > 0) lines.push(line);

  return lines;
}

/** Which line holds the character at `index`, given the lines' joined widths. */
export function lineAtIndex(lines: string[][], index: number): number {
  let consumed = 0;
  for (let i = 0; i < lines.length; i++) {
    // +1 for the space that joins this line to the next.
    const width = lines[i].join(' ').length + 1;
    if (index < consumed + width) return i;
    consumed += width;
  }
  return Math.max(0, lines.length - 1);
}

export const WORD_POOL = [
  'the', 'be', 'to', 'of', 'and', 'in', 'that', 'have', 'it', 'for',
  'not', 'on', 'with', 'as', 'you', 'do', 'at', 'this', 'but', 'by',
  'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
  'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'great', 'between', 'need', 'large',
  'under', 'never', 'each', 'right', 'move', 'own', 'while', 'found', 'head', 'still',
  'long', 'might', 'next', 'much', 'call', 'world', 'hand', 'high', 'keep', 'last',
  'left', 'start', 'begin', 'life', 'always', 'those', 'both', 'paper', 'group', 'often',
  'run', 'point', 'turn', 'play', 'line', 'set', 'state', 'home', 'read', 'small',
  'end', 'put', 'place', 'number', 'ask', 'change', 'went', 'light', 'kind', 'off',
  'house', 'try', 'again', 'every', 'school', 'name', 'help', 'city', 'tree', 'cross',
  'hard', 'port', 'miss', 'act', 'build', 'stay', 'fall', 'eat', 'room', 'friend',
  'idea', 'stop', 'example', 'system', 'code', 'function', 'program', 'type', 'data', 'value',
];

export function sampleWords(count: number): string[] {
  return Array.from(
    { length: count },
    () => WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)],
  );
}

export const CODE_SNIPPETS: Record<string, string[]> = {
  go: [
    'func Contains(haystack []string, needle string) bool {\n\tfor _, v := range haystack {\n\t\tif v == needle {\n\t\t\treturn true\n\t\t}\n\t}\n\treturn false\n}',
    'func (s *Server) Health(ctx context.Context) error {\n\tif err := s.db.PingContext(ctx); err != nil {\n\t\treturn fmt.Errorf("db: %w", err)\n\t}\n\treturn nil\n}',
    'func Retry(n int, fn func() error) error {\n\tvar err error\n\tfor i := 0; i < n; i++ {\n\t\tif err = fn(); err == nil {\n\t\t\treturn nil\n\t\t}\n\t}\n\treturn err\n}',
  ],
  python: [
    'def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        if arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1',
    'def flatten(items):\n    out = []\n    for item in items:\n        if isinstance(item, list):\n            out.extend(flatten(item))\n        else:\n            out.append(item)\n    return out',
    'def chunked(seq, size):\n    for i in range(0, len(seq), size):\n        yield seq[i:i + size]',
  ],
  ts: [
    'function debounce<T extends (...a: never[]) => void>(fn: T, ms: number) {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}',
    'export function groupBy<T>(rows: T[], key: keyof T) {\n  return rows.reduce<Record<string, T[]>>((acc, row) => {\n    const k = String(row[key]);\n    (acc[k] ??= []).push(row);\n    return acc;\n  }, {});\n}',
    'const useDebounced = <T,>(value: T, ms: number): T => {\n  const [held, setHeld] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setHeld(value), ms);\n    return () => clearTimeout(id);\n  }, [value, ms]);\n  return held;\n};',
  ],
};

export interface BestScores {
  [key: string]: { wpm: number; accuracy: number };
}

const BEST_KEY = 'portfolio:typing-best';

export function loadBest(): BestScores {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function recordBest(key: string, wpm: number, accuracy: number): BestScores {
  const best = loadBest();
  if (!best[key] || wpm > best[key].wpm) {
    best[key] = { wpm, accuracy };
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(best));
    } catch {
      // Private browsing — the run still scores, it just is not saved.
    }
  }
  return best;
}
