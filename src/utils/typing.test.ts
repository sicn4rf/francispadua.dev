import { describe, it, expect } from 'vitest';
import { computeStats, chunkIntoLines, lineAtIndex, CODE_SNIPPETS, sampleWords } from './typing';

describe('computeStats', () => {
  it('is 100% accurate and zero speed before anything is typed', () => {
    const s = computeStats('', 'hello world', 0);
    expect(s).toMatchObject({ wpm: 0, raw: 0, accuracy: 100, correct: 0, incorrect: 0 });
  });

  it('scores a word as five characters', () => {
    // 25 correct characters in 30s = 5 words in half a minute = 10 wpm.
    const target = 'a'.repeat(25);
    expect(computeStats(target, target, 30).wpm).toBe(10);
  });

  it('separates net speed from raw speed', () => {
    // 10 chars typed, 5 of them right.
    const s = computeStats('aaaaabbbbb', 'aaaaaccccc', 60);
    expect(s.correct).toBe(5);
    expect(s.incorrect).toBe(5);
    expect(s.raw).toBeGreaterThan(s.wpm);
  });

  it('computes accuracy over everything typed', () => {
    expect(computeStats('abcd', 'abxx', 10).accuracy).toBe(50);
  });

  it('counts overtyping past the target as incorrect', () => {
    const s = computeStats('abcdef', 'abc', 10);
    expect(s.correct).toBe(3);
    expect(s.incorrect).toBe(3);
  });

  it('handles newlines, which code mode depends on', () => {
    // The regression this guards: an <input> stripped the \n, shifting every
    // later character against the target by one.
    const target = 'def f():\n    return 1';
    expect(computeStats(target, target, 60).accuracy).toBe(100);

    const stripped = target.replace('\n', '');
    expect(computeStats(stripped, target, 60).accuracy).toBeLessThan(100);
  });
});

describe('chunkIntoLines', () => {
  it('keeps every line within the budget', () => {
    const lines = chunkIntoLines(sampleWords(200), 60);
    for (const line of lines) {
      expect(line.join(' ').length).toBeLessThanOrEqual(60);
    }
  });

  it('preserves word order and loses nothing', () => {
    const words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
    expect(chunkIntoLines(words, 12).flat()).toEqual(words);
  });

  it('never emits an empty line', () => {
    expect(chunkIntoLines(sampleWords(50), 20).every(l => l.length > 0)).toBe(true);
  });

  it('gives an over-long word its own line rather than dropping it', () => {
    const lines = chunkIntoLines(['a', 'supercalifragilistic', 'b'], 10);
    expect(lines.flat()).toEqual(['a', 'supercalifragilistic', 'b']);
  });

  it('returns nothing for no words', () => {
    expect(chunkIntoLines([], 60)).toEqual([]);
  });
});

describe('lineAtIndex', () => {
  const words = ['aaa', 'bbb', 'ccc', 'ddd'];
  // maxChars 7 → [['aaa','bbb'], ['ccc','ddd']], joined as "aaa bbb ccc ddd"
  const lines = chunkIntoLines(words, 7);

  it('puts the start on the first line', () => {
    expect(lineAtIndex(lines, 0)).toBe(0);
  });

  it('advances when the caret crosses into the next line', () => {
    expect(lineAtIndex(lines, 7)).toBe(0); // the space after "bbb"
    expect(lineAtIndex(lines, 8)).toBe(1); // first char of "ccc"
  });

  it('clamps past the end rather than running off', () => {
    expect(lineAtIndex(lines, 9999)).toBe(lines.length - 1);
  });
});

describe('code snippets', () => {
  it('offers snippets for every advertised language', () => {
    for (const lang of ['go', 'python', 'ts']) {
      expect(CODE_SNIPPETS[lang]?.length).toBeGreaterThan(0);
    }
  });

  it('has no trailing whitespace to type blind', () => {
    for (const snippets of Object.values(CODE_SNIPPETS)) {
      for (const snippet of snippets) {
        for (const line of snippet.split('\n')) {
          expect(line).toBe(line.replace(/\s+$/, ''));
        }
      }
    }
  });
});
