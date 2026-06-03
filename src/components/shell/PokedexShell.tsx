import { useState } from 'react';
import type { AnimationState } from '../../types/pokedex';
import ClosedCover from './ClosedCover';
import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';

// Outer plastic housing. Centers the device on the dark backdrop and, based
// on animationState, renders either the closed cover or the open
// left/hinge/right layout (Section 7 / Section 8). The opening → booting →
// ready transitions are wired up in later tasks; the closed cover owns the
// open interaction (click / keypress + open sound).
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
      {animationState === 'closed' ? (
        <ClosedCover onOpen={() => setAnimationState('opening')} isMuted={false} />
      ) : (
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
