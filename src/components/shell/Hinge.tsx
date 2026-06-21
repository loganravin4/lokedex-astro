// Recessed hinge spine between the two device halves (Section 6.7).
export default function Hinge() {
  // Shared ridge classes; only the vertical position differs between the two.
  const ridge = 'absolute left-0 right-0 h-[1px] bg-[var(--shell-hinge-metal)]';

  return (
    <div className="hinge relative">
      <div className={`${ridge} top-[33%]`} />
      <div className={`${ridge} top-[66%]`} />
    </div>
  );
}
