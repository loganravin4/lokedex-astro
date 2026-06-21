import ScreenBezel from './ScreenBezel';

// Left half of the device housing. Holds the list screen + section
// controls (placeholders for now) and the sensor eye detail.
// box-sizing: content-box so width (--panel-width) + padding fills the
// shell exactly per the --panel-width formula in Section 4.
export default function LeftHalf() {
  return (
    <div className="shell-left relative box-content w-[var(--panel-width)] rounded-[18px_0_0_18px] flex flex-col p-[var(--shell-padding)]">
      {/* Sensor eye — top-left detail */}
      <div className="absolute top-[14px] left-[14px] w-[12px] h-[12px] rounded-full bg-[var(--sensor-eye-housing)] border-2 border-[var(--sensor-eye-ring)] flex items-center justify-center">
        <div className="w-[7px] h-[7px] rounded-full bg-[var(--sensor-eye-lens)] opacity-70" />
      </div>

      {/* List screen */}
      <ScreenBezel label="LIST" />

      {/* Control area placeholder */}
      <div className="h-[var(--control-area-height)] bg-[var(--shell-red-dark)] rounded-[8px] mt-4" />
    </div>
  );
}
