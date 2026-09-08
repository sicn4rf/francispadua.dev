export type LetterState = 'correct' | 'present' | 'absent';
export type KeyState = LetterState | 'unused';

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export interface WordleStats {
  played: number;
  won: number;
  streak: number;
  maxStreak: number;
}

export const EMPTY_STATS: WordleStats = { played: 0, won: 0, streak: 0, maxStreak: 0 };

/**
 * Standard two-pass Wordle marking.
 *
 * The naive version — "green if in position, else yellow if the answer
 * contains it" — over-reports duplicates: EERIE against CRANE marked three
 * yellow Es when the answer holds one. Greens are claimed first, then each
 * yellow consumes one remaining occurrence.
 */
export function markGuess(guess: string, answer: string): LetterState[] {
  const marks: LetterState[] = Array(guess.length).fill('absent');
  const remaining = new Map<string, number>();

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      marks[i] = 'correct';
    } else {
      remaining.set(answer[i], (remaining.get(answer[i]) ?? 0) + 1);
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (marks[i] === 'correct') continue;
    const left = remaining.get(guess[i]) ?? 0;
    if (left > 0) {
      marks[i] = 'present';
      remaining.set(guess[i], left - 1);
    }
  }

  return marks;
}

const RANK: Record<KeyState, number> = { unused: 0, absent: 1, present: 2, correct: 3 };

/** The best state a letter has ever achieved, for the on-screen keyboard. */
export function keyStates(guesses: string[], answer: string): Map<string, KeyState> {
  const states = new Map<string, KeyState>();

  for (const guess of guesses) {
    const marks = markGuess(guess, answer);
    for (let i = 0; i < guess.length; i++) {
      const current = states.get(guess[i]) ?? 'unused';
      if (RANK[marks[i]] > RANK[current]) states.set(guess[i], marks[i]);
    }
  }

  return states;
}

export function loadStats(): WordleStats {
  try {
    const raw = localStorage.getItem('portfolio:wordle-stats');
    return raw ? { ...EMPTY_STATS, ...JSON.parse(raw) } : { ...EMPTY_STATS };
  } catch {
    return { ...EMPTY_STATS };
  }
}

export function recordGame(won: boolean): WordleStats {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.won++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  try {
    localStorage.setItem('portfolio:wordle-stats', JSON.stringify(stats));
  } catch {
    // Private browsing; the game still works, the stats just do not persist.
  }
  return stats;
}

/** Answers are drawn from here; guesses are validated against it too. */
export const WORDS = [
  'crane', 'slate', 'trace', 'audio', 'raise', 'stare', 'arise', 'learn',
  'stern', 'crate', 'irate', 'snare', 'adieu', 'route', 'saint', 'outer',
  'react', 'train', 'plant', 'share', 'heart', 'stone', 'smart', 'ocean',
  'earth', 'house', 'light', 'world', 'night', 'water', 'dream', 'space',
  'brain', 'cloud', 'flame', 'steel', 'pearl', 'tiger', 'quiet', 'waste',
  'solid', 'royal', 'panel', 'rapid', 'blend', 'frost', 'brave', 'grace',
  'prime', 'drift', 'scope', 'focus', 'pixel', 'stack', 'debug', 'build',
  'parse', 'query', 'cache', 'fetch', 'proxy', 'merge', 'patch', 'trunk',
  'shell', 'token', 'chart', 'index', 'batch', 'chain', 'clone', 'defer',
  'field', 'graph', 'input', 'layer', 'mount', 'nodes', 'panic', 'queue',
  'shard', 'trait', 'yield', 'alias', 'array', 'block', 'crash', 'weave',
];

export const isValidWord = (word: string) => WORDS.includes(word.toLowerCase());
