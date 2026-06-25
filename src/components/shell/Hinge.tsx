// Recessed hinge spine between the two device halves (Section 6.7).
export default function Hinge() {
  // Shared ridge classes; only the vertical position differs between the two.
  const ridge = 'absolute left-0 right-0 h-[1px] bg-[var(--shell-hinge-metal)]';

  // The hinge is a vertical spine (fixed 24px width, left/right inset shadows,
  // align-self: stretch for height). In the mobile flex-col stack it can't
  // reorient — it collapses to a 0-height, 24px-wide artifact — so hide it
  // below md and let the two half-shells butt together over the shell body.
  return (
    <div className="hinge relative hidden md:block">
      <div className={`${ridge} top-[33%]`} />
      <div className={`${ridge} top-[66%]`} />
    </div>
  );
}
