import { usePokedex } from '../../hooks/usePokedex';
import { useSynth } from '../../hooks/useSynth';
import { useDPad } from '../../hooks/useDPad';

interface DPadProps {
  isReady: boolean;
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
}

// Cross-shaped directional pad -- 3×3 grid of 24px cells.
export default function DPad({ isReady, onUp, onDown, onLeft, onRight }: DPadProps) {
  const { isMuted } = usePokedex();
  const synth = useSynth(isMuted);

  // Gating here makes both the keyboard (useDPad) and the arm clicks inert during 'booting', and suppresses the sound too -- nothing fires until ready
  const handleUp = () => {
    if (!isReady) return;
    synth.navigate();
    onUp();
  };
  const handleDown = () => {
    if (!isReady) return;
    synth.navigate();
    onDown();
  };
  const handleLeft = () => {
    if (!isReady) return;
    synth.back();
    onLeft();
  };
  const handleRight = () => {
    if (!isReady) return;
    synth.select();
    onRight();
  };

  // Keyboard arrows mirror the arms exactly
  useDPad({ onUp: handleUp, onDown: handleDown, onLeft: handleLeft, onRight: handleRight });

  return (
    <div className="hidden md:grid w-[var(--dpad-size)] h-[var(--dpad-size)] grid-cols-[repeat(3,24px)] grid-rows-[repeat(3,24px)]">
      <button
        type="button"
        aria-label="Up"
        onClick={handleUp}
        className="dpad-arm col-start-2 row-start-1 w-full h-full"
      />
      <button
        type="button"
        aria-label="Left"
        onClick={handleLeft}
        className="dpad-arm col-start-1 row-start-2 w-full h-full"
      />
      {/* Center filler */}
      <div className="col-start-2 row-start-2 bg-[var(--btn-dpad)]" />
      <button
        type="button"
        aria-label="Right"
        onClick={handleRight}
        className="dpad-arm col-start-3 row-start-2 w-full h-full"
      />
      <button
        type="button"
        aria-label="Down"
        onClick={handleDown}
        className="dpad-arm col-start-2 row-start-3 w-full h-full"
      />
    </div>
  );
}
