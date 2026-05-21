let ctx: AudioContext | null = null;

const MUTE_KEY = "atc-muted";
let muted: boolean =
  typeof window !== "undefined" && window.localStorage?.getItem(MUTE_KEY) === "1";

export function isMuted() {
  return muted;
}
export function setMuted(v: boolean) {
  muted = v;
  if (typeof window !== "undefined") {
    window.localStorage?.setItem(MUTE_KEY, v ? "1" : "0");
    window.dispatchEvent(new CustomEvent("atc:mute", { detail: v }));
  }
}
export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

function emitSound() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("atc:sound"));
  }
}

function getCtx(): AudioContext {
  if (!ctx || ctx.state === "closed") {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function master(gain: number, when: number, duration: number): GainNode {
  const ac = getCtx();
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, when);
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  g.connect(ac.destination);
  return g;
}

function osc(
  type: OscillatorType,
  freq: number,
  startTime: number,
  duration: number,
  gain: number,
  freqEnd?: number
) {
  const ac = getCtx();
  const o = ac.createOscillator();
  const g = master(gain, startTime, duration);
  o.type = type;
  o.frequency.setValueAtTime(freq, startTime);
  if (freqEnd !== undefined) {
    o.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
  }
  o.connect(g);
  o.start(startTime);
  o.stop(startTime + duration + 0.01);
}

function noise(startTime: number, duration: number, gain: number, highpass = 0) {
  const ac = getCtx();
  const bufferSize = Math.ceil(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const g = master(gain, startTime, duration);
  if (highpass > 0) {
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = highpass;
    src.connect(hp);
    hp.connect(g);
  } else {
    src.connect(g);
  }
  src.start(startTime);
}

export function unlockAudio() {
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      void ac.resume();
    }
  } catch { /* ignore */ }
}

export function playKeystroke() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    noise(t, 0.022, 0.14, 4000);
    osc("square", 2200 + Math.random() * 400, t, 0.014, 0.06);
  } catch { /* ignore */ }
}

export function playHoverClick() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    osc("sine", 1800, t, 0.04, 0.08, 900);
    noise(t, 0.025, 0.04, 5000);
  } catch { /* ignore */ }
}

export function playExecute() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    osc("sine", 1200, t, 0.05, 0.35, 600);
    osc("sine", 800, t + 0.04, 0.07, 0.25, 500);
    noise(t, 0.06, 0.1, 3000);
  } catch { /* ignore */ }
}

export function playOutputTick() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    osc("square", 1600 + Math.random() * 300, t, 0.016, 0.08);
    noise(t, 0.016, 0.04, 6000);
  } catch { /* ignore */ }
}

export function playHackTick() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    const freq = 400 + Math.random() * 900;
    osc("sawtooth", freq, t, 0.03, 0.12);
    noise(t, 0.02, 0.07, 2000);
  } catch { /* ignore */ }
}

export function playSuccess() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    osc("sine", 440, t, 0.12, 0.4);
    osc("sine", 660, t + 0.1, 0.12, 0.4);
    osc("sine", 880, t + 0.2, 0.18, 0.45);
    osc("sine", 1320, t + 0.3, 0.22, 0.5);
  } catch { /* ignore */ }
}

export function playError() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    osc("sawtooth", 220, t, 0.08, 0.35, 160);
    osc("sawtooth", 180, t + 0.07, 0.1, 0.28, 120);
    noise(t, 0.12, 0.1, 500);
  } catch { /* ignore */ }
}

export function playMatrixBoot() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    for (let i = 0; i < 8; i++) {
      const freq = 200 + Math.random() * 1400;
      osc("sawtooth", freq, t + i * 0.05, 0.05, 0.14);
    }
    noise(t, 0.4, 0.1, 500);
  } catch { /* ignore */ }
}

export function playHackStart() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    osc("sawtooth", 80, t, 0.15, 0.35, 200);
    osc("square", 1200, t + 0.1, 0.08, 0.22, 400);
    noise(t, 0.2, 0.12, 1000);
  } catch { /* ignore */ }
}

export function playHackSuccess() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    noise(t, 0.06, 0.14, 2000);
    osc("sine", 220, t, 0.1, 0.35, 440);
    osc("sine", 440, t + 0.08, 0.1, 0.35, 880);
    osc("sine", 880, t + 0.16, 0.15, 0.42, 1320);
    osc("sine", 1320, t + 0.24, 0.2, 0.5);
    osc("square", 2400, t + 0.3, 0.08, 0.2, 1200);
  } catch { /* ignore */ }
}

/**
 * Air-flow "whoosh" sound. Duration & pitch depend on mouse speed.
 * speed: px/ms (0 = stationary, ~3+ = very fast)
 * Slow drag → long "whooooop". Fast flick → short "whoop".
 */
export function playWhoosh(speed: number) {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    const s = Math.max(0.05, Math.min(speed, 4));
    // Inverse mapping: slow=long, fast=short
    const duration = Math.max(0.18, Math.min(0.9, 0.9 / (s + 0.4)));
    const gain = Math.min(0.16, 0.05 + s * 0.025);

    // Pinkish noise body — airier than pure white noise
    const bufferSize = Math.ceil(ac.sampleRate * duration);
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Cheap pink-ish filter
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.96300 * b1 + white * 0.296754;
      b2 = 0.57000 * b2 + white * 1.040820;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.18;
    }
    const src = ac.createBufferSource();
    src.buffer = buffer;

    // Wide bandpass for airy "shhh" character, not a tonal "whoop".
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 220;
    hp.Q.value = 0.4;

    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 0.5;
    // Gentle arc: open up, then close — like air passing by
    const peakFreq = 2200 + s * 1800;
    const startFreq = 900 + s * 300;
    const endFreq = 700 + s * 200;
    lp.frequency.setValueAtTime(startFreq, t);
    lp.frequency.exponentialRampToValueAtTime(peakFreq, t + duration * 0.45);
    lp.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

    // Soft attack + long tail = whooooosh, not whoop
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + duration * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    src.connect(hp);
    hp.connect(lp);
    lp.connect(g);
    g.connect(ac.destination);
    src.start(t);
    src.stop(t + duration + 0.02);
  } catch { /* ignore */ }
}

export function playClear() {
  try {
    if (muted) return;
    emitSound();
    const ac = getCtx();
    const t = ac.currentTime;
    osc("sine", 800, t, 0.04, 0.18, 400);
    noise(t, 0.06, 0.06, 4000);
  } catch { /* ignore */ }
}
