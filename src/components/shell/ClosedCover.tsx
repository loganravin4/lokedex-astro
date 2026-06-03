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
        className="pokedex-shell"
        onClick={() => void handleOpen()}
        style={{
          position: 'relative',
          width: 'var(--device-width)',
          height: 'var(--device-height)',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Indicator light — steady green glow, top-left */}
        <div
          className="indicator-light"
          style={{ position: 'absolute', top: '20px', left: '20px' }}
        />

        {/* Wordmark — shiny sweep over poke-yellow */}
        <div
          style={{
            fontFamily: 'var(--font-family-pokemon)',
            fontSize: '20px',
            letterSpacing: '0.1em',
          }}
        >
          <ShinyText text="LOKÉDEX" color="var(--color-poke-yellow)" />
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'var(--font-family-pokemon)',
            fontSize: '8px',
            color: 'var(--detail-muted)',
            marginTop: '12px',
          }}
        >
          TRAINER PORTFOLIO
        </div>

        {/* Blinking prompt */}
        <div
          style={{
            fontFamily: 'var(--font-family-pokemon)',
            fontSize: '8px',
            color: 'var(--detail-muted)',
            marginTop: '48px',
            animation: 'blink 1s step-end infinite',
          }}
        >
          PRESS ANY KEY
        </div>
      </div>
    </Tilt>
  );
}
