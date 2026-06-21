import { useState } from 'react';
import type { AnimationState } from '../../types/pokedex';
import ClosedCover from './ClosedCover';
import HingeAnimation from './HingeAnimation';
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--page-bg)',
      }}
    >
      {animationState === 'closed' && (
        // TODO(Task 9): replace hardcoded isMuted={false} with real mute state
        // from usePokedex context once it's wired in.
        <ClosedCover onOpen={() => setAnimationState('opening')} isMuted={false} />
      )}

      {animationState === 'opening' && (
        <HingeAnimation onComplete={() => setAnimationState('booting')} />
      )}

      {(animationState === 'booting' || animationState === 'ready') && (
        <div
          className="pokedex-shell"
          style={{
            width: 'var(--device-width)',
            height: 'var(--device-height)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <LeftHalf />
          <Hinge />
          <RightHalf />
        </div>
      )}
    </div>
  );
}
