/**
 * Web Audio API synthesizer for mechanical keyboard keystroke clicks.
 * Zero asset downloads required, zero latency, satisfying mechanical feel.
 */

let audioCtx: AudioContext | null = null;
let isAudioEnabled = true;

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

/**
 * Plays a realistic mechanical keyboard switch sound.
 */
export function playKeyClick(type: 'char' | 'space' | 'backspace' | 'error' = 'char') {
  if (!isAudioEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Parameters based on key type
    let startFreq = 420;
    let endFreq = 90;
    let duration = 0.045;
    let gainVal = 0.12;

    if (type === 'space') {
      startFreq = 220;
      endFreq = 55;
      duration = 0.07;
      gainVal = 0.15;
    } else if (type === 'backspace') {
      startFreq = 480;
      endFreq = 120;
      duration = 0.04;
      gainVal = 0.13;
    } else if (type === 'error') {
      startFreq = 260;
      endFreq = 140;
      duration = 0.06;
      gainVal = 0.14;
    } else {
      // Slight pitch variation for organic realism
      const variance = (Math.random() - 0.5) * 60;
      startFreq += variance;
    }

    // Oscillator 1: Body tone (thock)
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

    // Filtered noise click: initial switch contact transient
    const bufferSize = ctx.sampleRate * 0.015; // 15ms noise burst
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(type === 'space' ? 1200 : 2800, now);
    filter.Q.setValueAtTime(1.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.015);
  } catch {
    // Graceful fallback if audio context blocked
  }
}
