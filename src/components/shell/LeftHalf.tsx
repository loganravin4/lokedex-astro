import ScreenBezel from './ScreenBezel';

// Left half of the device housing. Holds the list screen + section
// controls (placeholders for now) and the sensor eye detail.
// box-sizing: content-box so width (--panel-width) + padding fills the
// shell exactly per the --panel-width formula in Section 4.
export default function LeftHalf() {
  return (
    <div
      className="shell-left"
      style={{
        position: 'relative',
        boxSizing: 'content-box',
        width: 'var(--panel-width)',
        borderRadius: '18px 0 0 18px',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--shell-padding)',
      }}
    >
      {/* Sensor eye — top-left detail */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'var(--sensor-eye-housing)',
          border: '2px solid var(--sensor-eye-ring)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--sensor-eye-lens)',
            opacity: 0.7,
          }}
        />
      </div>

      {/* List screen */}
      <ScreenBezel label="LIST" />

      {/* Control area placeholder */}
      <div
        style={{
          height: 'var(--control-area-height)',
          background: 'var(--shell-red-dark)',
          borderRadius: '8px',
          marginTop: '16px',
        }}
      />
    </div>
  );
}
