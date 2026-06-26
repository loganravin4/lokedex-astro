// Recessed hinge spine between the two device halves.
export default function Hinge() {
  // Shared ridge classes; only the vertical position differs between the two.
  const ridge = 'absolute left-0 right-0 h-[1px] bg-[var(--shell-hinge-metal)]';

  // In the mobile flex-col stack the vertical hinge spine can't reorient and
  // collapses to a 0-height artifact, so it's hidden below md; the half-shells
  // butt together over the shell body instead.
  return (
    <div className="hinge relative hidden md:block">
      <div className={`${ridge} top-[33%]`} />
      <div className={`${ridge} top-[66%]`} />
    </div>
  );
}
