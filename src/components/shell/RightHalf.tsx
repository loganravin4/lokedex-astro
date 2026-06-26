import type { ReactNode } from 'react';
import ScreenBezel from './ScreenBezel';
import DPad from './DPad';
import ActionButtons from './ActionButtons';
import SpeakerGrille from './SpeakerGrille';
import { usePokedex } from '../../hooks/usePokedex';
import type { ListEntry } from '../../types/pokedex';

interface RightHalfProps {
  // True only once the boot sequence finishes. Gates D-pad input so presses
  // during 'booting' don't mutate the list cursor before it's visible.
  isReady: boolean;
  // Active section's entries -- the same list ListPanel renders, so focusedIndex
  // resolves to the same entry. Defaults to [] for the pre-'ready' renders
  // (HingeAnimation) where input is gated anyway.
  entries?: ListEntry[];
  // The detail screen content (<DetailPanel />), passed from PokedexShell so the
  // single Sanity fetch stays hoisted there. Absent during the boot render.
  detailContent?: ReactNode;
}

// Right half of the device housing. box-sizing: content-box so width
// (--panel-width) + padding fills the shell exactly.
export default function RightHalf({ isReady, entries = [], detailContent }: RightHalfProps) {
  const { focusedIndex, setFocusedIndex, setSelectedEntry } = usePokedex();

  const maxIndex = Math.max(0, entries.length - 1);
  const selectFocused = () => {
    const entry = entries[focusedIndex];
    if (entry) setSelectedEntry(entry.id);
  };

  return (
    <div className="relative box-border md:box-content w-[100vw] h-[50vh] md:w-[var(--panel-width)] md:h-auto bg-[var(--shell-red)] rounded-[0_0_18px_18px] md:rounded-[0_18px_18px_0] flex flex-col p-[var(--shell-padding)]">
      <ScreenBezel label="DATA">{detailContent}</ScreenBezel>

      {/* Controls are hidden on mobile (DPad/ActionButtons carry their own
          hidden md:* classes); drop the fixed control-area height there too so
          the empty row doesn't reserve 140px of the 50vh half. */}
      <div className="flex items-center justify-between md:h-[var(--control-area-height)] px-4">
        <DPad
          isReady={isReady}
          onUp={() => setFocusedIndex(Math.max(0, focusedIndex - 1))}
          onDown={() => setFocusedIndex(Math.min(maxIndex, focusedIndex + 1))}
          onLeft={() => setSelectedEntry(null)}
          onRight={selectFocused}
        />
        <ActionButtons onA={selectFocused} onB={() => setSelectedEntry(null)} />
      </div>

      <SpeakerGrille />
    </div>
  );
}
