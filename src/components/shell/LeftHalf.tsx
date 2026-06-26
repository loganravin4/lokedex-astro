import type { ReactNode } from 'react';
import ScreenBezel from './ScreenBezel';
import SectionButtons from './SectionButtons';
import SensorEye from './SensorEye';

interface LeftHalfProps {
  // LIST screen content: BootSequence while booting, ListPanel once ready.
  listContent?: ReactNode;
}

// Left half of the device housing. box-sizing: content-box so width
// (--panel-width) + padding fills the shell exactly.
export default function LeftHalf({ listContent }: LeftHalfProps) {
  return (
    <div className="shell-left relative box-border md:box-content w-[100vw] h-[50vh] md:w-[var(--panel-width)] md:h-auto rounded-[18px_18px_0_0] md:rounded-[18px_0_0_18px] flex flex-col p-[var(--shell-padding)]">
      <SensorEye />

      <ScreenBezel label="LIST">{listContent}</ScreenBezel>

      <div className="flex items-center justify-center h-[var(--control-area-height)]">
        <SectionButtons />
      </div>
    </div>
  );
}
