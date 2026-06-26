import { useEffect, useRef } from 'react';
import { Tilt } from '../ui/Tilt';
import ShinyText from '../ui/ShinyText';
import IndicatorLight from './IndicatorLight';
import { useSynth } from '../../hooks/useSynth';

interface ClosedCoverProps {
  onOpen: () => void;
  isMuted: boolean;
}

// Pre-open state
export default function ClosedCover({ onOpen, isMuted }: ClosedCoverProps) {
  const synth = useSynth(isMuted);
  // Guard so a near-simultaneous click + keypress can't open twice
  const openedRef = useRef(false);

  const handleOpen = async () => {
    if (openedRef.current) return;
    openedRef.current = true;
    await synth.openFold(); // triggers Tone.start() on this user gesture
    onOpen();
  };

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
        <div className="absolute top-[20px] left-[20px]">
          <IndicatorLight on={true} />
        </div>

        <div
          className="text-[20px] tracking-[0.1em]"
          style={{ fontFamily: 'var(--font-family-pokemon)' }}
        >
          <ShinyText text="LOKÉDEX" color="var(--color-poke-yellow)" />
        </div>

        <div
          className="text-[8px] text-[color:var(--detail-muted)] mt-3"
          style={{ fontFamily: 'var(--font-family-pokemon)' }}
        >
          TRAINER PORTFOLIO
        </div>

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
