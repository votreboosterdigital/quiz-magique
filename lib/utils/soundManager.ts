'use client';

type SoundType = 'correct' | 'wrong' | 'levelup' | 'sparkle' | 'click';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.3,
  startTime = 0
): void {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gainNode.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
}

const SOUNDS: Record<SoundType, () => void> = {
  correct: () => {
    // Ascending magic arpeggio C-E-G
    playTone(523, 0.15, 'sine', 0.35, 0);
    playTone(659, 0.15, 'sine', 0.35, 0.12);
    playTone(784, 0.25, 'sine', 0.35, 0.24);
    playTone(1047, 0.3, 'sine', 0.3, 0.38);
  },
  wrong: () => {
    // Low descending tone
    playTone(220, 0.2, 'sawtooth', 0.2, 0);
    playTone(196, 0.3, 'sawtooth', 0.15, 0.18);
  },
  levelup: () => {
    // Fanfare C-E-G-C high
    playTone(523, 0.1, 'sine', 0.3, 0);
    playTone(659, 0.1, 'sine', 0.3, 0.1);
    playTone(784, 0.1, 'sine', 0.3, 0.2);
    playTone(1047, 0.15, 'sine', 0.35, 0.3);
    playTone(1319, 0.4, 'sine', 0.4, 0.45);
  },
  sparkle: () => {
    // High-pitched twinkling
    [1319, 1568, 1760, 2093].forEach((freq, i) => {
      playTone(freq, 0.1, 'sine', 0.2, i * 0.06);
    });
  },
  click: () => {
    playTone(800, 0.05, 'sine', 0.15, 0);
  },
};

let soundEnabled = true;

export const soundManager = {
  setEnabled: (enabled: boolean) => { soundEnabled = enabled; },
  play: (sound: SoundType) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      SOUNDS[sound]();
    } catch {
      // Web Audio API peut être bloquée par le navigateur avant interaction
    }
  },
};
