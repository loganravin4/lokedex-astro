import clsx from 'clsx';

interface IndicatorLightProps {
  on?: boolean;
}

// Small status LED -- renders only the circle; callers own placement.
export default function IndicatorLight({ on = true }: IndicatorLightProps) {
  return <div className={clsx('indicator-light', { off: !on })} />;
}
