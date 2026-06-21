import { useEffect, useRef } from 'react';
import { Tilt } from '../ui/Tilt';
import ShinyText from '../ui/ShinyText';
import { useSynth } from '../../hooks/useSynth';

interface ClosedCoverProps {
  onOpen: () => void;
  isMuted: boolean;
}

// Pre-open state: a single unified red panel (no hinge / no halves) wrapped
// in <Tilt> for spring-physics mouse tracking (Section 7 + animation
// hierarchy). Any click or keypress fires the mechanical open sound and
// then hands control back to PokedexShell via onOpen().
export default function ClosedCover({ onOpen, isMuted }: ClosedCoverProps) {
  const synth = useSynth(isMuted);
  // Guard so a near-simultaneous click + keypress can't open twice.
  const openedRef = useRef(false);

  const handleOpen = async () => {
    if (openedRef.current) return;
    openedRef.current = true;
    await synth.openFold(); // triggers Tone.start() on this user gesture
    onOpen();
  };

  // Keydown listener — "press any key". Cleaned up on unmount (the cover
  // unmounts as soon as it opens).
  useEffect(() => {
    const onKey = () => {
      void handleOpen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tilt rotationFactor={8} springOptions={{ stiffness: 120, damping: 20 }}>
      <div
        className="pokedex-shell relative w-[var(--device-width)] h-[var(--device-height)] rounded-[18px] flex flex-col items-center justify-center cursor-pointer"
        onClick={() => void handleOpen()}
      >
        {/* Indicator light — steady green glow, top-left */}
        <div className="indicator-light absolute top-[20px] left-[20px]" />

        {/* Wordmark — shiny sweep over poke-yellow.
            font-family kept in style (Section 13 inline-style exception 3). */}
        <div
          className="text-[20px] tracking-[0.1em]"
          style={{ fontFamily: 'var(--font-family-pokemon)' }}
        >
          <ShinyText text="LOKÉDEX" color="var(--color-poke-yellow)" />
        </div>

        {/* Subtitle */}
        <div
          className="text-[8px] text-[color:var(--detail-muted)] mt-3"
          style={{ fontFamily: 'var(--font-family-pokemon)' }}
        >
          TRAINER PORTFOLIO
        </div>

        {/* Blinking prompt — animation kept in style (custom keyframe, not
            expressible as a Tailwind class per spec). */}
        <div
          className="text-[8px] text-[color:var(--detail-muted)] mt-12"
          style={{
            fontFamily: 'var(--font-family-pokemon)',
            animation: 'blink 1s step-end infinite',
          }}
        >
          PRESS ANY KEY
        </div>
      </div>
    </Tilt>
  );
}
