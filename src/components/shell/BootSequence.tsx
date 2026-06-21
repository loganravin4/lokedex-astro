import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSynth } from '../../hooks/useSynth';

interface BootSequenceProps {
  onComplete: () => void;
  // TODO(Task 9): replace hardcoded isMuted with real mute state from
  // usePokedex context once it's wired in.
  isMuted: boolean;
}

// Boot sequence (Section 9) — plays inside the left screen when
// animationState === 'booting'. Flicker on → type two lines at 60ms/char →
// fill a 3-segment progress bar (with the boot arpeggio) → onComplete().
// Skipped on repeat visits via the 'lokedex-booted' localStorage flag.
//
// Screen content, so JetBrains Mono per Section 5 (font-family in style is the
// permitted CSS-var inline-style exception).

const LINE1 = 'LOKÉDEX v2.0';
const LINE2 = 'LOADING DATA...';
const CHAR_MS = 60; // line 1 typing speed (Section 9)
const LINE2_CHAR_MS = 45; // line 2 a touch faster to keep total near ~2.5s
const SEGMENTS = 3;
const SEG_FILL_MS = 300; // per-segment fill (Section 9)
const SEG_GAP_MS = 100; // gap between segments (Section 9)
const BOOTED_KEY = 'lokedex-booted';
const MONO = { fontFamily: 'var(--font-family-mono)' } as const;

export default function BootSequence({ onComplete, isMuted }: BootSequenceProps) {
  const synth = useSynth(isMuted);

  // If we've booted before, render nothing and skip straight to ready —
  // initialised from storage so there's no one-frame flash of boot text.
  const [skipped] = useState(
    () => typeof window !== 'undefined' && !!localStorage.getItem(BOOTED_KEY),
  );

  const [line1, setLine1] = useState(0); // chars of LINE1 revealed
  const [line2, setLine2] = useState(0); // chars of LINE2 revealed
  const [segments, setSegments] = useState(0); // progress segments filled
  const [cursorOn, setCursorOn] = useState(true);

  // Latest-value refs so the one-shot orchestrator never reads stale props.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const synthRef = useRef(synth);
  synthRef.current = synth;

  // Orchestrator — schedules the whole sequence once on mount.
  useEffect(() => {
    if (skipped) {
      onCompleteRef.current();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    let t = 150; // begin typing after the 150ms flicker

    for (let i = 1; i <= LINE1.length; i++) {
      at(t, () => setLine1(i));
      t += CHAR_MS;
    }
    for (let i = 1; i <= LINE2.length; i++) {
      at(t, () => setLine2(i));
      t += LINE2_CHAR_MS;
    }

    // Progress bar — one arpeggio note per segment as it finishes filling.
    for (let s = 1; s <= SEGMENTS; s++) {
      at(t + SEG_FILL_MS, () => {
        setSegments(s);
        synthRef.current.bootNote(s - 1);
      });
      t += SEG_FILL_MS + SEG_GAP_MS;
    }

    at(t, () => {
      // C5 resolution — 100ms after G4, on the arpeggio beat. The note is
      // scheduled on Tone's destination so it rings its full 80ms even as
      // onComplete unmounts this component.
      synthRef.current.bootNote(3);
      localStorage.setItem(BOOTED_KEY, 'true');
      onCompleteRef.current();
    });

    return () => timers.forEach(clearTimeout);
  }, [skipped]);

  // Cursor blink — 500ms interval (Section 9).
  useEffect(() => {
    if (skipped) return;
    const id = setInterval(() => setCursorOn((c) => !c), 500);
    return () => clearInterval(id);
  }, [skipped]);

  if (skipped) return null;

  // Cursor sits at the end of whichever line is currently typing.
  const cursorOnLine1 = line2 === 0;
  const cursor = (
    <span className={cursorOn ? '' : 'opacity-0'}>█</span>
  );

  return (
    <motion.div
      className="h-full w-full flex flex-col justify-center p-[var(--screen-padding)] text-[length:var(--text-screen-sm)] text-[color:var(--detail-body)] leading-[1.6]"
      style={MONO}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0.8, 0.3, 1] }}
      transition={{ duration: 0.15, times: [0, 0.3, 0.55, 0.8, 1] }}
    >
      <div>
        {LINE1.slice(0, line1)}
        {cursorOnLine1 && cursor}
      </div>
      <div>
        {LINE2.slice(0, line2)}
        {!cursorOnLine1 && cursor}
      </div>

      {/* Progress bar — 3 segments, filled = yellow, empty = outline only */}
      <div className="flex gap-[6px] mt-4">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className={`w-[24px] h-[8px] border border-[var(--detail-muted)] ${
              i < segments ? 'bg-[var(--color-poke-yellow)]' : ''
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
