import ScreenBezel from './ScreenBezel';

// Right half of the device housing. Holds the detail screen + d-pad /
// action controls (placeholders for now) and the speaker grille.
// box-sizing: content-box so width (--panel-width) + padding fills the
// shell exactly per the --panel-width formula in Section 4.
export default function RightHalf() {
  // 4 columns × 3 rows of speaker dots (Section 6.8).
  const dots = Array.from({ length: 12 });

  return (
    <div className="relative box-content w-[var(--panel-width)] bg-[var(--shell-red)] rounded-[0_18px_18px_0] flex flex-col p-[var(--shell-padding)]">
      {/* Detail screen */}
      <ScreenBezel label="DATA" />

      {/* Control area placeholder */}
      <div className="h-[var(--control-area-height)] bg-[var(--shell-red-dark)] rounded-[8px] mt-4" />

      {/* Speaker grille — bottom-right detail */}
      <div className="absolute bottom-[20px] right-[20px] grid grid-cols-[repeat(4,5px)] gap-[5px]">
        {dots.map((_, i) => (
          <div key={i} className="speaker-dot" />
        ))}
      </div>
    </div>
  );
}
