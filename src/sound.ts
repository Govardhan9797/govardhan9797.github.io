/*
  Tiny UI sound effects synthesised with the Web Audio API: no audio files to download.
  Sounds are off until the visitor turns them on; the choice is remembered.
*/

export type Blip = 'tap' | 'on' | 'off' | 'pop';

const KEY = 'sound';
let enabled = (() => {
  try { return localStorage.getItem(KEY) === 'on'; } catch { return false; }
})();
let ctx: AudioContext | null = null;

export const isSoundOn = () => enabled;

export function setSoundOn(on: boolean) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
}

const NOTES: Record<Blip, [number, number, number]> = {
  // [start Hz, end Hz, duration s]
  tap: [520, 760, 0.09],
  on: [440, 880, 0.14],
  off: [660, 330, 0.14],
  pop: [300, 1200, 0.12],
};

export function blip(kind: Blip = 'tap', force = false) {
  if (!enabled && !force) return;
  try {
    ctx ??= new AudioContext();
    const [from, to, dur] = NOTES[kind];
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch { /* audio unavailable */ }
}
