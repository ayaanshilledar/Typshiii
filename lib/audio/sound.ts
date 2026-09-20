/**
 * Web Audio API synthesizer for mechanical keyboard keystroke clicks.
 * Zero asset downloads required, zero latency, satisfying realistic acoustic feel.
 */

export type SoundTheme = 'mechanical' | 'thock' | 'creamy' | 'typewriter' | 'pop';

export type KeySoundType = 'char' | 'space' | 'backspace' | 'error';

let audioCtx: AudioContext | null = null;
let isAudioEnabled = true;
let currentTheme: SoundTheme = 'mechanical';
let currentVolume = 0.7; // 0.0 to 1.0

// Load initial settings on client side
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem('typeshii_settings_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.soundEnabled === 'boolean') isAudioEnabled = parsed.soundEnabled;
      if (parsed.soundTheme) currentTheme = parsed.soundTheme;
      if (typeof parsed.soundVolume === 'number') currentVolume = Math.max(0, Math.min(1, parsed.soundVolume / 100));
    }
  } catch {
    // ignore
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  isAudioEnabled = enabled;
}

export function getSoundEnabled(): boolean {
  return isAudioEnabled;
}

export function setSoundTheme(theme: SoundTheme) {
  currentTheme = theme;
}

export function getSoundTheme(): SoundTheme {
  return currentTheme;
}

export function setSoundVolume(volume: number) {
  currentVolume = Math.max(0, Math.min(1, volume));
}

export function getSoundVolume(): number {
  return currentVolume;
}

/**
 * Generates and plays switch clicks according to the active theme.
 */
export function playKeyClick(type: KeySoundType = 'char', overrideTheme?: SoundTheme) {
  if (!isAudioEnabled) return;
  if (currentVolume <= 0.001) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const theme = overrideTheme || currentTheme;
    const now = ctx.currentTime;
    const vol = currentVolume;

    switch (theme) {
      case 'thock':
        playThockSound(ctx, now, type, vol);
        break;
      case 'creamy':
        playCreamySound(ctx, now, type, vol);
        break;
      case 'typewriter':
        playTypewriterSound(ctx, now, type, vol);
        break;
      case 'pop':
        playPopSound(ctx, now, type, vol);
        break;
      case 'mechanical':
      default:
        playMechanicalSound(ctx, now, type, vol);
        break;
    }
  } catch {
    // Graceful fallback if audio blocked
  }
}

/**
 * 1. Mechanical Switch (Cherry MX Blue style clicky switch)
 * Crisp snap + sharp spring ping + snappy transient
 */
function playMechanicalSound(ctx: AudioContext, now: number, type: KeySoundType, vol: number) {
  let startFreq = 440;
  let endFreq = 95;
  let duration = 0.045;
  let gainVal = 0.16 * vol;

  if (type === 'space') {
    startFreq = 230;
    endFreq = 60;
    duration = 0.07;
    gainVal = 0.2 * vol;
  } else if (type === 'backspace') {
    startFreq = 490;
    endFreq = 120;
    duration = 0.04;
    gainVal = 0.17 * vol;
  } else if (type === 'error') {
    startFreq = 260;
    endFreq = 130;
    duration = 0.06;
    gainVal = 0.18 * vol;
  } else {
    // Natural organic variance
    startFreq += (Math.random() - 0.5) * 50;
  }

  // Body Tone (Tone sweep)
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type === 'space' ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gainNode.gain.setValueAtTime(gainVal, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);

  // Click transient: filtered noise click
  const noiseDur = 0.012;
  const bufferSize = Math.floor(ctx.sampleRate * noiseDur);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(type === 'space' ? 1400 : 3100, now);
  filter.Q.setValueAtTime(2.2, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.11 * vol, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + noiseDur);
}

/**
 * 2. Deep Thock (Lubed tactile switch - Holy Panda / Ink Black)
 * Warm, resonant low-frequency wooden/polycarbonate thud
 */
function playThockSound(ctx: AudioContext, now: number, type: KeySoundType, vol: number) {
  let startFreq = 190;
  let endFreq = 48;
  let duration = 0.055;
  let gainVal = 0.28 * vol;

  if (type === 'space') {
    startFreq = 135;
    endFreq = 34;
    duration = 0.085;
    gainVal = 0.35 * vol;
  } else if (type === 'backspace') {
    startFreq = 210;
    endFreq = 55;
    duration = 0.05;
    gainVal = 0.26 * vol;
  } else if (type === 'error') {
    startFreq = 150;
    endFreq = 70;
    duration = 0.07;
    gainVal = 0.28 * vol;
  } else {
    startFreq += (Math.random() - 0.5) * 25;
  }

  // Deep resonant oscillator
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gainNode.gain.setValueAtTime(gainVal, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Acoustic chamber low-pass filter (simulates enclosed keyboard case)
  const lowPass = ctx.createBiquadFilter();
  lowPass.type = 'lowpass';
  lowPass.frequency.setValueAtTime(type === 'space' ? 520 : 750, now);
  lowPass.Q.setValueAtTime(2.8, now);

  osc.connect(lowPass);
  lowPass.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);

  // Soft bottom-out pad impact
  const impactDur = 0.018;
  const bufferSize = Math.floor(ctx.sampleRate * impactDur);
  const impactBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = impactBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const impact = ctx.createBufferSource();
  impact.buffer = impactBuffer;

  const impactFilter = ctx.createBiquadFilter();
  impactFilter.type = 'lowpass';
  impactFilter.frequency.setValueAtTime(900, now);

  const impactGain = ctx.createGain();
  impactGain.gain.setValueAtTime(0.12 * vol, now);
  impactGain.gain.exponentialRampToValueAtTime(0.001, now + impactDur);

  impact.connect(impactFilter);
  impactFilter.connect(impactGain);
  impactGain.connect(ctx.destination);

  impact.start(now);
  impact.stop(now + impactDur);
}

/**
 * 3. Creamy Switch (Smooth lubed linear - NovelKeys Cream)
 * Velvety mid-range stem clack, rounded high end
 */
function playCreamySound(ctx: AudioContext, now: number, type: KeySoundType, vol: number) {
  let startFreq = 380;
  let endFreq = 130;
  let duration = 0.038;
  let gainVal = 0.22 * vol;

  if (type === 'space') {
    startFreq = 220;
    endFreq = 80;
    duration = 0.06;
    gainVal = 0.26 * vol;
  } else if (type === 'backspace') {
    startFreq = 420;
    endFreq = 150;
    duration = 0.035;
    gainVal = 0.22 * vol;
  } else {
    startFreq += (Math.random() - 0.5) * 30;
  }

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gainNode.gain.setValueAtTime(gainVal, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(type === 'space' ? 1200 : 1750, now);
  bandpass.Q.setValueAtTime(1.4, now);

  osc.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);

  // Soft high-end stem tap
  const tapDur = 0.009;
  const bufferSize = Math.floor(ctx.sampleRate * tapDur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const tap = ctx.createBufferSource();
  tap.buffer = buffer;

  const tapFilter = ctx.createBiquadFilter();
  tapFilter.type = 'bandpass';
  tapFilter.frequency.setValueAtTime(2200, now);
  tapFilter.Q.setValueAtTime(1.8, now);

  const tapGain = ctx.createGain();
  tapGain.gain.setValueAtTime(0.07 * vol, now);
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + tapDur);

  tap.connect(tapFilter);
  tapFilter.connect(tapGain);
  tapGain.connect(ctx.destination);

  tap.start(now);
  tap.stop(now + tapDur);
}

/**
 * 4. Vintage Typewriter (Mechanical striker impact & metal lever ring)
 */
function playTypewriterSound(ctx: AudioContext, now: number, type: KeySoundType, vol: number) {
  let strikeFreq = 1250;
  let thudFreq = 260;
  let duration = 0.045;
  let gainVal = 0.18 * vol;

  if (type === 'space') {
    strikeFreq = 880;
    thudFreq = 160;
    duration = 0.075;
    gainVal = 0.22 * vol;
  } else if (type === 'backspace') {
    strikeFreq = 1450;
    thudFreq = 300;
    duration = 0.038;
    gainVal = 0.18 * vol;
  } else {
    strikeFreq += (Math.random() - 0.5) * 80;
  }

  // Metallic strike ping
  const strikeOsc = ctx.createOscillator();
  const strikeGain = ctx.createGain();
  strikeOsc.type = 'triangle';
  strikeOsc.frequency.setValueAtTime(strikeFreq, now);
  strikeOsc.frequency.exponentialRampToValueAtTime(strikeFreq * 0.4, now + 0.025);

  strikeGain.gain.setValueAtTime(gainVal * 0.7, now);
  strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  strikeOsc.connect(strikeGain);
  strikeGain.connect(ctx.destination);
  strikeOsc.start(now);
  strikeOsc.stop(now + 0.025);

  // Deep platen impact thud
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(thudFreq, now);
  thudOsc.frequency.exponentialRampToValueAtTime(65, now + duration);

  thudGain.gain.setValueAtTime(gainVal, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);
  thudOsc.start(now);
  thudOsc.stop(now + duration);

  // Metallic lever clatter
  const metalDur = 0.016;
  const bufferSize = Math.floor(ctx.sampleRate * metalDur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const metalNoise = ctx.createBufferSource();
  metalNoise.buffer = buffer;

  const metalFilter = ctx.createBiquadFilter();
  metalFilter.type = 'highpass';
  metalFilter.frequency.setValueAtTime(3600, now);

  const metalNoiseGain = ctx.createGain();
  metalNoiseGain.gain.setValueAtTime(0.09 * vol, now);
  metalNoiseGain.gain.exponentialRampToValueAtTime(0.001, now + metalDur);

  metalNoise.connect(metalFilter);
  metalFilter.connect(metalNoiseGain);
  metalNoiseGain.connect(ctx.destination);

  metalNoise.start(now);
  metalNoise.stop(now + metalDur);
}

/**
 * 5. Bubble Pop (Playful, soothing water droplet / popcat pop)
 */
function playPopSound(ctx: AudioContext, now: number, type: KeySoundType, vol: number) {
  let startFreq = 340;
  let peakFreq = 780;
  let endFreq = 200;
  let duration = 0.04;
  let gainVal = 0.24 * vol;

  if (type === 'space') {
    startFreq = 220;
    peakFreq = 560;
    endFreq = 140;
    duration = 0.06;
    gainVal = 0.28 * vol;
  } else if (type === 'backspace') {
    startFreq = 390;
    peakFreq = 880;
    endFreq = 240;
    duration = 0.035;
    gainVal = 0.22 * vol;
  } else {
    const variance = (Math.random() - 0.5) * 50;
    startFreq += variance;
    peakFreq += variance;
  }

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.25);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.linearRampToValueAtTime(gainVal, now + duration * 0.15);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}
