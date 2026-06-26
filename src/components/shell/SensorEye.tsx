// Camera/sensor detail, top-left of the left half. Self-positioned.
export default function SensorEye() {
  return (
    <div className="absolute top-[14px] left-[14px] w-[12px] h-[12px] rounded-full bg-[var(--sensor-eye-housing)] border-2 border-[var(--sensor-eye-ring)] flex items-center justify-center">
      <div className="w-[7px] h-[7px] rounded-full bg-[var(--sensor-eye-lens)] opacity-70" />
    </div>
  );
}
