import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

/**
 * Node 25 ships its own `localStorage` global that is inert without
 * `--localstorage-file`, and it shadows the one jsdom installs. Replace it with
 * a real in-memory Storage, cleared between tests so nothing leaks across them.
 */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() { return this.map.size; }
  key(i: number) { return [...this.map.keys()][i] ?? null; }
  getItem(k: string) { return this.map.get(k) ?? null; }
  setItem(k: string, v: string) { this.map.set(k, String(v)); }
  removeItem(k: string) { this.map.delete(k); }
  clear() { this.map.clear(); }
}

const storage = new MemoryStorage();
vi.stubGlobal('localStorage', storage);
vi.stubGlobal('sessionStorage', new MemoryStorage());

beforeEach(() => storage.clear());

// jsdom implements neither the Web Audio API nor matchMedia; the terminal
// touches both on mount.
class StubAudioContext {
  state = 'running';
  currentTime = 0;
  sampleRate = 44100;
  destination = {};
  resume() { return Promise.resolve(); }
  createGain() { return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
  createOscillator() { return { type: 'sine', frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
  createBiquadFilter() { return { type: 'lowpass', frequency: { value: 0 }, Q: { value: 0 }, connect() {} }; }
  createBufferSource() { return { buffer: null, connect() {}, start() {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(64) }; }
}

vi.stubGlobal('AudioContext', StubAudioContext);

vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
}));
