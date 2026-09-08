import '@testing-library/jest-dom/vitest';

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
