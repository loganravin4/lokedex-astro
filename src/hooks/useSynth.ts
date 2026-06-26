import { useMemo, useRef } from 'react';
import type * as ToneNS from 'tone';

// The ONLY file in the codebase that touches Tone.js. All sounds are
// synthesized at runtime -- no audio files.
//
// Tone is loaded lazily via dynamic import inside the first user gesture
// (openFold), NOT at module load. This keeps the AudioContext from being
// created before a gesture -- which would trip the browser autoplay warning
// -- and code-splits Tone.js out of the initial bundle. Every other sound
// runs only after openFold, so the module is already cached by then.
let toneMod: typeof ToneNS | null = null;
let toneLoading: Promise<typeof ToneNS> | null = null;
function ensureTone(): Promise<typeof ToneNS> {
  if (toneMod) return Promise.resolve(toneMod);
  if (!toneLoading) toneLoading = import('tone').then((m) => (toneMod = m));
  return toneLoading;
}

// A single pitched blip with a fast exponential decay to silence.
function blip(
  Tone: typeof ToneNS,
  freq: number,
  durSec: number,
  gain: number,
  startAt: number,
  type: ToneNS.ToneOscillatorType = 'square'
) {
  const g = new Tone.Gain(0).toDestination();
  const osc = new Tone.Oscillator(freq, type).connect(g);
  g.gain.setValueAtTime(gain, startAt);
  g.gain.exponentialRampToValueAtTime(0.0001, startAt + durSec);
  osc.start(startAt);
  osc.stop(startAt + durSec);
  osc.onstop = () => {
    osc.dispose();
    g.dispose();
  };
}

// A sequence of square-wave notes, each `durMs` long with `gapMs` between.
function sequence(Tone: typeof ToneNS, freqs: number[], durMs: number, gain: number, gapMs = 0) {
  let t = Tone.now();
  const step = (durMs + gapMs) / 1000;
  for (const f of freqs) {
    blip(Tone, f, durMs / 1000, gain, t);
    t += step;
  }
}

export function useSynth(isMuted: boolean) {
  // Read mute state at call time (avoids stale closures if it changes).
  const mutedRef = useRef(isMuted);
  mutedRef.current = isMuted;

  return useMemo(() => {
    // The short sounds only ever fire after the device is open (i.e. after
    // openFold has loaded + started Tone), so they use the cached module.
    const ready = () => (mutedRef.current ? null : toneMod);

    return {
      navigate: () => {
        const Tone = ready();
        if (Tone) blip(Tone, 880, 0.04, 0.25, Tone.now());
      },

      select: () => {
        const Tone = ready();
        if (Tone) sequence(Tone, [523, 784], 30, 0.3);
      },

      back: () => {
        const Tone = ready();
        if (Tone) sequence(Tone, [523, 392], 30, 0.3);
      },

      sectionSwitch: () => {
        const Tone = ready();
        if (Tone) sequence(Tone, [440, 554, 659], 25, 0.28);
      },

      // Confirmation blip for the mute toggle: ascending when unmuting,
      // descending when muting.
      //
      // Deliberately NOT gated by mutedRef: the blip must be audible even on
      // the unmute press (when the device is still muted). It is wired in
      // PokedexShell to fire BEFORE the mute state flips. ensureTone()/start()
      // run here so the sound works even if the device was opened while muted
      // (openFold short-circuits in that case and never loads Tone); this is a
      // user gesture, so Tone.start() is allowed.
      muteToggle: async (unmuting: boolean) => {
        const Tone = await ensureTone();
        await Tone.start();
        sequence(Tone, unmuting ? [440, 660] : [660, 440], 25, 0.2);
      },

      // One boot-arpeggio note by index (C4/E4/G4/C5), fired once per progress
      // segment as the boot bar fills.
      bootNote: (index: number) => {
        const Tone = ready();
        const freq = [262, 330, 392, 523][index];
        if (Tone && freq) blip(Tone, freq, 0.08, 0.3, Tone.now());
      },

      // Mechanical open sound. Loads Tone and calls Tone.start() within the
      // user gesture (required by browser autoplay policy).
      openFold: async () => {
        if (mutedRef.current) return;
        const Tone = await ensureTone();
        await Tone.start();
        const t0 = Tone.now();

        // Low sine thud.
        blip(Tone, 80, 0.15, 0.2, t0, 'sine');

        // White-noise burst.
        const noiseGain = new Tone.Gain(0.2).toDestination();
        const noise = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.005, decay: 0.075, sustain: 0, release: 0.01 },
        }).connect(noiseGain);
        noise.triggerAttackRelease(0.08, t0);
        setTimeout(() => {
          noise.dispose();
          noiseGain.dispose();
        }, 400);
      },
    };
  }, []);
}
