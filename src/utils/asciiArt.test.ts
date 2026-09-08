import { describe, it, expect } from 'vitest';
import { BANNER_LINES, bannerRuns, COW_TEMPLATE } from './asciiArt';

describe('the banner', () => {
  it('is a rectangle, so the letterforms line up', () => {
    const widths = new Set(BANNER_LINES.map(l => l.length));
    expect(widths.size).toBe(1);
  });

  it('uses only the two figlet glyphs and spaces', () => {
    for (const line of BANNER_LINES) {
      expect(line).toMatch(/^[█░ ]+$/);
    }
  });
});

describe('bannerRuns', () => {
  it('round-trips the line exactly', () => {
    for (const line of BANNER_LINES) {
      expect(bannerRuns(line).map(r => r.text).join('')).toBe(line);
    }
  });

  it('flags shadow runs and only shadow runs', () => {
    for (const run of bannerRuns(BANNER_LINES[1])) {
      expect(run.shadow).toBe(run.text.startsWith('░'));
      // A run is homogeneous: all shadow or none of it.
      expect(/^░+$/.test(run.text)).toBe(run.shadow);
    }
  });

  it('coalesces adjacent characters of the same kind', () => {
    const runs = bannerRuns('░░███░');
    expect(runs).toEqual([
      { text: '░░', shadow: true },
      { text: '███', shadow: false },
      { text: '░', shadow: true },
    ]);
  });

  it('returns nothing for an empty line', () => {
    expect(bannerRuns('')).toEqual([]);
  });
});

describe('COW_TEMPLATE', () => {
  it('sizes the bubble to the message', () => {
    const lines = COW_TEMPLATE('moo').split('\n');
    expect(lines[1]).toBe('< moo >');
  });
});
