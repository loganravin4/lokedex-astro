// Recessed hinge spine between the two device halves (Section 6.7).
export default function Hinge() {
  const ridge: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '1px',
    background: 'var(--shell-hinge-metal)',
  };

  return (
    <div className="hinge" style={{ position: 'relative' }}>
      <div style={{ ...ridge, top: '33%' }} />
      <div style={{ ...ridge, top: '66%' }} />
    </div>
  );
}
