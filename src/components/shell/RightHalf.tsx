// Right half of the device housing. Holds the detail screen + d-pad /
// action controls (placeholders for now) and the speaker grille.
// box-sizing: content-box so width (--panel-width) + padding fills the
// shell exactly per the --panel-width formula in Section 4.
export default function RightHalf() {
  // 4 columns × 3 rows of speaker dots (Section 6.8).
  const dots = Array.from({ length: 12 });

  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'content-box',
        width: 'var(--panel-width)',
        background: 'var(--shell-red)',
        borderRadius: '0 18px 18px 0',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--shell-padding)',
      }}
    >
      {/* Screen placeholder */}
      <div
        style={{
          flex: 1,
          background: 'var(--screen-bezel)',
          borderRadius: '8px',
        }}
      />

      {/* Control area placeholder */}
      <div
        style={{
          height: 'var(--control-area-height)',
          background: 'var(--shell-red-dark)',
          borderRadius: '8px',
          marginTop: '16px',
        }}
      />

      {/* Speaker grille — bottom-right detail */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 5px)',
          gap: '5px',
        }}
      >
        {dots.map((_, i) => (
          <div key={i} className="speaker-dot" />
        ))}
      </div>
    </div>
  );
}
