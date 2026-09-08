import { describe, it, expect } from 'vitest';
import { resolvePath, getNode, fileSystem } from './fileSystem';

describe('resolvePath', () => {
  it('treats ~, / and the empty string as home', () => {
    expect(resolvePath('~/projects', '~')).toBe('~');
    expect(resolvePath('~/projects', '/')).toBe('~');
    expect(resolvePath('~/projects', '')).toBe('~');
  });

  it('resolves a relative child', () => {
    expect(resolvePath('~', 'projects')).toBe('~/projects');
  });

  it('resolves an absolute path from anywhere', () => {
    expect(resolvePath('~/projects', '~/experience')).toBe('~/experience');
  });

  it('walks up with ..', () => {
    expect(resolvePath('~/projects', '..')).toBe('~');
    expect(resolvePath('~/.config/zellij', '..')).toBe('~/.config');
  });

  it('never climbs above home', () => {
    expect(resolvePath('~', '..')).toBe('~');
    expect(resolvePath('~', '../../..')).toBe('~');
    expect(resolvePath('~/projects', '../../../..')).toBe('~');
  });

  it('collapses . and .. mid-path', () => {
    expect(resolvePath('~', 'projects/../experience')).toBe('~/experience');
    expect(resolvePath('~', './projects')).toBe('~/projects');
    expect(resolvePath('~/projects', './../experience')).toBe('~/experience');
  });

  it('ignores a trailing slash', () => {
    expect(resolvePath('~', 'projects/')).toBe('~/projects');
  });

  it('always returns a path rooted at ~', () => {
    for (const target of ['projects', '..', '../..', './x/../y', '~/a/b']) {
      expect(resolvePath('~/projects', target).startsWith('~')).toBe(true);
    }
  });
});

describe('getNode', () => {
  it('returns the root for ~', () => {
    expect(getNode('~')).toBe(fileSystem);
  });

  it('finds a nested file', () => {
    const node = getNode('~/projects/northstar.md');
    expect(node?.type).toBe('file');
    expect(node?.name).toBe('northstar.md');
  });

  it('finds a directory', () => {
    expect(getNode('~/experience')?.type).toBe('directory');
  });

  it('returns null for a missing path', () => {
    expect(getNode('~/nope')).toBeNull();
    expect(getNode('~/projects/nope.md')).toBeNull();
  });

  it('returns null when descending through a file', () => {
    expect(getNode('~/about.txt/deeper')).toBeNull();
  });

  it('reaches hidden files by exact path', () => {
    expect(getNode('~/.secret')?.type).toBe('file');
    expect(getNode('~/.config/zellij/config.kdl')?.type).toBe('file');
  });
});

describe('the tree itself', () => {
  it('names every node the same as its key', () => {
    const walk = (dir: typeof fileSystem) => {
      for (const [key, child] of Object.entries(dir.children)) {
        expect(child.name).toBe(key);
        if (child.type === 'directory') walk(child);
      }
    };
    walk(fileSystem);
  });

  it('gives every file non-empty content', () => {
    const walk = (dir: typeof fileSystem) => {
      for (const child of Object.values(dir.children)) {
        if (child.type === 'directory') walk(child);
        else expect(String(child.content).length).toBeGreaterThan(0);
      }
    };
    walk(fileSystem);
  });
});
