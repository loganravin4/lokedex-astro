import type { ReactNode } from 'react';
import ScreenBezel from './ScreenBezel';
import SectionButtons from './SectionButtons';

interface LeftHalfProps {
  // Content for the LIST screen — BootSequence during 'booting', ListPanel
  // later (Task 13), nothing during 'ready' for now.
  listContent?: ReactNode;
}

// Left half of the device housing. Holds the list screen + section
// controls (placeholders for now) and the sensor eye detail.
// box-sizing: content-box so width (--panel-width) + padding fills the
// shell exactly per the --panel-width formula in Section 4.
export default function LeftHalf({ listContent }: LeftHalfProps) {
  return (
    <div className="shell-left relative box-content w-[var(--panel-width)] rounded-[18px_0_0_18px] flex flex-col p-[var(--shell-padding)]">
      {/* Sensor eye — top-left detail */}
      <div className="absolute top-[14px] left-[14px] w-[12px] h-[12px] rounded-full bg-[var(--sensor-eye-housing)] border-2 border-[var(--sensor-eye-ring)] flex items-center justify-center">
        <div className="w-[7px] h-[7px] rounded-full bg-[var(--sensor-eye-lens)] opacity-70" />
      </div>

      {/* List screen */}
      <ScreenBezel label="LIST">{listContent}</ScreenBezel>

      {/* Section switcher controls */}
      <div className="flex items-center justify-center h-[var(--control-area-height)]">
        <SectionButtons />
      </div>
    </div>
  );
}
