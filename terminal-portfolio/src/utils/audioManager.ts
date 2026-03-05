class AudioManager {
  private ctx: AudioContext | null = null;
  private _volume = 0.3;
  private _enabled: boolean;

  constructor() {
    this._enabled = localStorage.getItem('portfolio:sound') !== 'off';
    const savedVol = localStorage.getItem('portfolio:sound-volume');
    if (savedVol) this._volume = parseFloat(savedVol);
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  get enabled() { return this._enabled; }
  set enabled(v: boolean) {
    this._enabled = v;
    localStorage.setItem('portfolio:sound', v ? 'on' : 'off');
  }

  get volume() { return this._volume; }
  set volume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    localStorage.setItem('portfolio:sound-volume', String(this._volume));
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol?: number) {
    if (!this._enabled) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = (vol ?? this._volume) * 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, vol?: number) {
    if (!this._enabled) return;
    const ctx = this.getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = (vol ?? this._volume) * 0.5;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  keystroke() {
    const freq = 800 + Math.random() * 400;
    this.playNoise(0.04);
    this.playTone(freq, 0.03, 'square', this._volume * 0.3);
  }

  enter() {
    this.playTone(600, 0.06, 'sine');
    setTimeout(() => this.playTone(800, 0.06, 'sine'), 30);
  }

  error() {
    this.playTone(200, 0.15, 'sawtooth');
  }

  success() {
    this.playTone(523, 0.08, 'sine');
    setTimeout(() => this.playTone(659, 0.08, 'sine'), 80);
    setTimeout(() => this.playTone(784, 0.12, 'sine'), 160);
  }

  boot() {
    this.playTone(220, 0.1, 'sine');
    setTimeout(() => this.playTone(330, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(440, 0.15, 'sine'), 200);
  }
}

export const audioManager = new AudioManager();
