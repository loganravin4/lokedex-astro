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
  // Active section's entries — the same list ListPanel renders, so focusedIndex
  // resolves to the same entry. Defaults to [] for the pre-'ready' renders
  // (HingeAnimation) where input is gated anyway.
  entries?: ListEntry[];
}

// Right half of the device housing. Holds the detail screen + d-pad /
// action controls and the speaker grille.
// box-sizing: content-box so width (--panel-width) + padding fills the
// shell exactly per the --panel-width formula in Section 4.
export default function RightHalf({ isReady, entries = [] }: RightHalfProps) {
  const { focusedIndex, setFocusedIndex, setSelectedEntry } = usePokedex();

  // Clamp downward navigation to the last entry (Task 10 TODO, now resolved).
  const maxIndex = Math.max(0, entries.length - 1);
  // Right / A select the focused entry by its _id.
  const selectFocused = () => {
    const entry = entries[focusedIndex];
    if (entry) setSelectedEntry(entry.id);
  };

  return (
    <div className="relative box-content w-[var(--panel-width)] bg-[var(--shell-red)] rounded-[0_18px_18px_0] flex flex-col p-[var(--shell-padding)]">
      {/* Detail screen */}
      <ScreenBezel label="DATA" />

      {/* D-pad (left) + action buttons (right) — Section 8 layout */}
      <div className="flex items-center justify-between h-[var(--control-area-height)] px-4">
        <DPad
          isReady={isReady}
          onUp={() => setFocusedIndex(Math.max(0, focusedIndex - 1))}
          onDown={() => setFocusedIndex(Math.min(maxIndex, focusedIndex + 1))}
          onLeft={() => setSelectedEntry(null)}
          onRight={selectFocused}
        />
        <ActionButtons onA={selectFocused} onB={() => setSelectedEntry(null)} />
      </div>

      {/* Speaker grille — bottom-right detail */}
      <SpeakerGrille />
    </div>
  );
}
