import { describe, it, expect } from 'vitest';
import { markGuess, keyStates, WORDS, isValidWord, WORD_LENGTH } from './wordle';

describe('markGuess', () => {
  it('marks an exact match all correct', () => {
    expect(markGuess('crane', 'crane')).toEqual([
      'correct', 'correct', 'correct', 'correct', 'correct',
    ]);
  });

  it('marks letters not in the answer absent', () => {
    expect(markGuess('bumpy', 'crane')).toEqual([
      'absent', 'absent', 'absent', 'absent', 'absent',
    ]);
  });

  it('marks a right letter in the wrong place present', () => {
    // 'r' and 'a' exist in CRANE but not at these positions.
    expect(markGuess('parts', 'crane')).toEqual([
      'absent', 'present', 'present', 'absent', 'absent',
    ]);
  });

  describe('duplicate letters', () => {
    it('does not over-report a letter the answer holds once', () => {
      // CRANE holds one E, and the guess's final E takes it as a green — so
      // the two leading Es have nothing left to claim. The naive
      // "answer.includes(letter)" check marked all three present.
      expect(markGuess('eerie', 'crane')).toEqual([
        'absent', 'absent', 'present', 'absent', 'correct',
      ]);
    });

    it('lets a green claim the occurrence before any yellow', () => {
      // SLATE's only E is matched in place by ELATE's final E, so the leading
      // E has nothing left to match and stays grey.
      expect(markGuess('elate', 'slate')).toEqual([
        'absent', 'correct', 'correct', 'correct', 'correct',
      ]);
    });

    it('marks both copies when the answer holds two', () => {
      // SHEEP has two Es; SPEED's two Es are both in position.
      expect(markGuess('speed', 'sheep')).toEqual([
        'correct', 'present', 'correct', 'correct', 'absent',
      ]);
    });
  });
});

describe('keyStates', () => {
  it('keeps the best state a letter has ever earned', () => {
    // 'a' is present in the first guess and correct in the second; correct wins.
    const states = keyStates(['about', 'crane'], 'crane');
    expect(states.get('a')).toBe('correct');
  });

  it('never downgrades a green to a grey', () => {
    const states = keyStates(['crane', 'aloft'], 'crane');
    expect(states.get('a')).toBe('correct');
  });

  it('reports untouched letters as unused', () => {
    expect(keyStates(['crane'], 'crane').get('z')).toBeUndefined();
  });
});

describe('the word list', () => {
  it('holds only five-letter lowercase words', () => {
    for (const word of WORDS) {
      expect(word).toMatch(/^[a-z]{5}$/);
      expect(word).toHaveLength(WORD_LENGTH);
    }
  });

  it('has no duplicates', () => {
    expect(new Set(WORDS).size).toBe(WORDS.length);
  });

  it('validates case-insensitively', () => {
    expect(isValidWord('CRANE')).toBe(true);
    expect(isValidWord('zzzzz')).toBe(false);
  });
});
