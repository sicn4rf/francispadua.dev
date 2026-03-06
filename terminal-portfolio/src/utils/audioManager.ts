export type SoundStyle = 'thocky' | 'poppy' | 'clacky';

class AudioManager {
  private ctx: AudioContext | null = null;
  private _volume = 0.3;
  private _enabled: boolean;
  private _style: SoundStyle;

  constructor() {
    this._enabled = localStorage.getItem('portfolio:sound') !== 'off';
    const savedVol = localStorage.getItem('portfolio:sound-volume');
    if (savedVol) this._volume = parseFloat(savedVol);
    this._style = (localStorage.getItem('portfolio:sound-style') as SoundStyle) || 'thocky';
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

  get style() { return this._style; }
  set style(v: SoundStyle) {
    this._style = v;
    localStorage.setItem('portfolio:sound-style', v);
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

  // ── Thocky: deep, rounded mechanical keyboard ──
  private playThocky(pitchBase: number, vol?: number) {
    const ctx = this.getCtx();
    const v = (vol ?? this._volume) * 0.6;
    const now = ctx.currentTime;

    // Layer 1: soft click (filtered noise, longer decay for roundness)
    const clickLen = 0.018;
    const clickBuf = ctx.createBuffer(1, ctx.sampleRate * clickLen, ctx.sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickData.length * 0.3));
    }
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(v * 0.8, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + clickLen);
    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'lowpass';
    clickFilter.frequency.value = 2000 + pitchBase * 0.5;
    clickFilter.Q.value = 0.8;
    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(now);

    // Layer 2: deep body resonance (low-freq, long decay)
    const bodyLen = 0.055;
    const bodyBuf = ctx.createBuffer(1, ctx.sampleRate * bodyLen, ctx.sampleRate);
    const bodyData = bodyBuf.getChannelData(0);
    for (let i = 0; i < bodyData.length; i++) {
      bodyData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bodyData.length * 0.35));
    }
    const bodySrc = ctx.createBufferSource();
    bodySrc.buffer = bodyBuf;
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(v * 0.9, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + bodyLen);
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.value = 600 + pitchBase * 0.2;
    bodyFilter.Q.value = 3;
    bodySrc.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodySrc.start(now);

    // Layer 3: warm sine thump
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280 + pitchBase * 0.3, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(v * 0.45, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // ── Poppy: snappy, higher-pitched, bouncy ──
  private playPoppy(pitchBase: number, vol?: number) {
    const ctx = this.getCtx();
    const v = (vol ?? this._volume) * 0.6;
    const now = ctx.currentTime;

    // Layer 1: sharp pop (short noise burst, high-pass)
    const popLen = 0.008;
    const popBuf = ctx.createBuffer(1, ctx.sampleRate * popLen, ctx.sampleRate);
    const popData = popBuf.getChannelData(0);
    for (let i = 0; i < popData.length; i++) {
      popData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (popData.length * 0.1));
    }
    const popSrc = ctx.createBufferSource();
    popSrc.buffer = popBuf;
    const popGain = ctx.createGain();
    popGain.gain.setValueAtTime(v * 1.0, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + popLen);
    const popFilter = ctx.createBiquadFilter();
    popFilter.type = 'bandpass';
    popFilter.frequency.value = 4000 + pitchBase;
    popFilter.Q.value = 2;
    popSrc.connect(popFilter);
    popFilter.connect(popGain);
    popGain.connect(ctx.destination);
    popSrc.start(now);

    // Layer 2: bouncy sine pop (higher pitch, quick decay)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + pitchBase * 0.8, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(v * 0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);

    // Layer 3: tiny click accent
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2000 + pitchBase, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(v * 0.25, now);
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);
    osc2.connect(osc2Gain);
    osc2Gain.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.01);
  }

  // ── Clacky: sharp, crisp, mechanical click ──
  private playClacky(pitchBase: number, vol?: number) {
    const ctx = this.getCtx();
    const v = (vol ?? this._volume) * 0.6;
    const now = ctx.currentTime;

    // Layer 1: hard click (very short, high-freq noise)
    const clickLen = 0.006;
    const clickBuf = ctx.createBuffer(1, ctx.sampleRate * clickLen, ctx.sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickData.length * 0.08));
    }
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(v * 1.4, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + clickLen);
    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.value = 3500 + pitchBase;
    clickFilter.Q.value = 1;
    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(now);

    // Layer 2: metallic ring (bandpass, short sustain)
    const ringLen = 0.025;
    const ringBuf = ctx.createBuffer(1, ctx.sampleRate * ringLen, ctx.sampleRate);
    const ringData = ringBuf.getChannelData(0);
    for (let i = 0; i < ringData.length; i++) {
      ringData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ringData.length * 0.2));
    }
    const ringSrc = ctx.createBufferSource();
    ringSrc.buffer = ringBuf;
    const ringGain = ctx.createGain();
    ringGain.gain.setValueAtTime(v * 0.6, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + ringLen);
    const ringFilter = ctx.createBiquadFilter();
    ringFilter.type = 'bandpass';
    ringFilter.frequency.value = 5000 + pitchBase * 0.5;
    ringFilter.Q.value = 4;
    ringSrc.connect(ringFilter);
    ringFilter.connect(ringGain);
    ringGain.connect(ctx.destination);
    ringSrc.start(now);

    // Layer 3: sharp transient spike
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + pitchBase, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.008);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(v * 0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.012);
  }

  private playKey(pitchBase: number, vol?: number) {
    if (!this._enabled) return;
    switch (this._style) {
      case 'poppy': this.playPoppy(pitchBase, vol); break;
      case 'clacky': this.playClacky(pitchBase, vol); break;
      case 'thocky': default: this.playThocky(pitchBase, vol); break;
    }
  }

  keystroke() {
    const pitch = Math.random() * 400;
    this.playKey(pitch);
  }

  enter() {
    this.playKey(0, this._volume * 1.3);
    setTimeout(() => this.playKey(200, this._volume * 0.5), 25);
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
