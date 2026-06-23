import { useState } from 'react';
import type { AnimationState } from '../../types/pokedex';
import { usePokedex } from '../../hooks/usePokedex';
import ClosedCover from './ClosedCover';
import HingeAnimation from './HingeAnimation';
import BootSequence from './BootSequence';
import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';

// Outer plastic housing. Centers the device on the dark backdrop and renders
// one of the four animationState views (Section 7 / Section 8):
//   'closed'  → <ClosedCover />, which owns the open interaction + sound
//   'opening' → <HingeAnimation />, the 3D fold (Section 9 "Opening fold")
//   'booting' → open shell with the boot sequence (wired up in Task 8)
//   'ready'   → open shell, fully interactive (Task 9+)
// The static open layout (booting/ready) mirrors HingeAnimation's final frame
// exactly so there is no layout jump when the fold settles.
//
// animationState stays local here — it is view/animation state, not the shared
// content state that lives in usePokedex.
export default function PokedexShell() {
  const [animationState, setAnimationState] = useState<AnimationState>('closed');
  const { isMuted, toggleMute } = usePokedex();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--page-bg)]">
      <div className="relative">
        {animationState === 'closed' && (
          <ClosedCover onOpen={() => setAnimationState('opening')} isMuted={isMuted} />
        )}

        {animationState === 'opening' && (
          <HingeAnimation onComplete={() => setAnimationState('booting')} />
        )}

        {(animationState === 'booting' || animationState === 'ready') && (
          <div className="pokedex-shell w-[var(--device-width)] h-[var(--device-height)] flex flex-row items-stretch">
            <LeftHalf
              listContent={
                animationState === 'booting' ? (
                  <BootSequence
                    onComplete={() => setAnimationState('ready')}
                    isMuted={isMuted}
                  />
                ) : undefined
              }
            />
            <Hinge />
            <RightHalf />
          </div>
        )}

        {/* Global mute toggle (Section 7 / Section 10): lives on the shell,
            top-right of the device. Hidden on the closed cover — no controls
            there. */}
        {animationState !== 'closed' && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="absolute top-[14px] right-[14px] z-20 cursor-pointer bg-transparent text-[length:var(--text-hw-xs)] text-[color:var(--detail-muted)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
            style={{ fontFamily: 'var(--font-family-pokemon)' }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        )}
      </div>
    </div>
  );
}
