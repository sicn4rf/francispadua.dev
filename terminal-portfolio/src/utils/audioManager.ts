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

  // Thocky mechanical keyboard sound using layered noise bursts
  private playThock(pitchBase: number, vol?: number) {
    if (!this._enabled) return;
    const ctx = this.getCtx();
    const v = (vol ?? this._volume) * 0.6;
    const now = ctx.currentTime;

    // Layer 1: sharp click (high-freq noise burst)
    const clickLen = 0.012;
    const clickBuf = ctx.createBuffer(1, ctx.sampleRate * clickLen, ctx.sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickData.length * 0.15));
    }
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(v * 1.2, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + clickLen);
    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'bandpass';
    clickFilter.frequency.value = 3000 + pitchBase;
    clickFilter.Q.value = 1.5;
    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(now);

    // Layer 2: thock body (lower-freq resonance)
    const bodyLen = 0.04;
    const bodyBuf = ctx.createBuffer(1, ctx.sampleRate * bodyLen, ctx.sampleRate);
    const bodyData = bodyBuf.getChannelData(0);
    for (let i = 0; i < bodyData.length; i++) {
      bodyData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bodyData.length * 0.25));
    }
    const bodySrc = ctx.createBufferSource();
    bodySrc.buffer = bodyBuf;
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(v * 0.7, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + bodyLen);
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.value = 800 + pitchBase * 0.3;
    bodyFilter.Q.value = 2;
    bodySrc.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodySrc.start(now);

    // Layer 3: subtle pop (sine transient)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 + pitchBase * 0.5, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(v * 0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  keystroke() {
    // Randomize pitch slightly for natural variation
    const pitch = Math.random() * 400;
    this.playThock(pitch);
  }

  enter() {
    // Deeper, more satisfying thock for Enter
    this.playThock(0, this._volume * 1.3);
    setTimeout(() => this.playThock(200, this._volume * 0.5), 25);
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
