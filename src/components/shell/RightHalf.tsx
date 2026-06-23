import ScreenBezel from './ScreenBezel';
import DPad from './DPad';
import ActionButtons from './ActionButtons';
import SpeakerGrille from './SpeakerGrille';
import { usePokedex } from '../../hooks/usePokedex';

interface RightHalfProps {
  // True only once the boot sequence finishes. Gates D-pad input so presses
  // during 'booting' don't mutate the list cursor before it's visible.
  isReady: boolean;
}

// Right half of the device housing. Holds the detail screen + d-pad /
// action controls and the speaker grille.
// box-sizing: content-box so width (--panel-width) + padding fills the
// shell exactly per the --panel-width formula in Section 4.
export default function RightHalf({ isReady }: RightHalfProps) {
  const { focusedIndex, setFocusedIndex, setSelectedEntry } = usePokedex();

  return (
    <div className="relative box-content w-[var(--panel-width)] bg-[var(--shell-red)] rounded-[0_18px_18px_0] flex flex-col p-[var(--shell-padding)]">
      {/* Detail screen */}
      <ScreenBezel label="DATA" />

      {/* D-pad (left) + action buttons (right) — Section 8 layout */}
      <div className="flex items-center justify-between h-[var(--control-area-height)] px-4">
        <DPad
          isReady={isReady}
          onUp={() => setFocusedIndex(Math.max(0, focusedIndex - 1))}
          // TODO(Task 13): clamp the upper bound to the active list's length
          // (e.g. Math.min(entries.length - 1, focusedIndex + 1)) once
          // useSanityData provides the entry count. Unbounded for now.
          onDown={() => setFocusedIndex(focusedIndex + 1)}
          onLeft={() => setSelectedEntry(null)}
          onRight={() => {
            /* no-op until Task 13 wires the list data → selected _id */
          }}
        />
        <ActionButtons
          onA={() => {
            /* no-op until Task 13 wires the list data → selected _id */
          }}
          onB={() => setSelectedEntry(null)}
        />
      </div>

      {/* Speaker grille — bottom-right detail */}
      <SpeakerGrille />
    </div>
  );
}
