import clsx from 'clsx';

interface IndicatorLightProps {
  // Lit green when true (default), dim when false — Section 6.9.
  on?: boolean;
}

// Small status LED (Section 6.9). Renders only the circle; callers own its
// placement (e.g. ClosedCover positions it absolutely top-left).
export default function IndicatorLight({ on = true }: IndicatorLightProps) {
  return <div className={clsx('indicator-light', { off: !on })} />;
}
