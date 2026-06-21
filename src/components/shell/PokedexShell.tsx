import { useState } from 'react';
import type { AnimationState } from '../../types/pokedex';
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
export default function PokedexShell() {
  const [animationState, setAnimationState] = useState<AnimationState>('closed');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--page-bg)]">
      {animationState === 'closed' && (
        // TODO(Task 9): replace hardcoded isMuted={false} with real mute state
        // from usePokedex context once it's wired in.
        <ClosedCover onOpen={() => setAnimationState('opening')} isMuted={false} />
      )}

      {animationState === 'opening' && (
        <HingeAnimation onComplete={() => setAnimationState('booting')} />
      )}

      {(animationState === 'booting' || animationState === 'ready') && (
        <div className="pokedex-shell w-[var(--device-width)] h-[var(--device-height)] flex flex-row items-stretch">
          <LeftHalf
            listContent={
              animationState === 'booting' ? (
                // TODO(Task 9): isMuted hardcoded false until usePokedex wires
                // in real mute state.
                <BootSequence
                  onComplete={() => setAnimationState('ready')}
                  isMuted={false}
                />
              ) : undefined
            }
          />
          <Hinge />
          <RightHalf />
        </div>
      )}
    </div>
  );
}
