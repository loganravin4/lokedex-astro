import clsx from 'clsx';
import type { ReactNode } from 'react';

interface PixelLabelProps {
  children: ReactNode;
  // Spacing override (defaults to mb-1).
  className?: string;
}

// Press Start 2P label shared across detail-panel entries (DESC:, STACK:, etc).
// font-family stays in style{}: a CSS-var font ref is unwieldy as a Tailwind class.
export default function PixelLabel({ children, className }: PixelLabelProps) {
  return (
    <div
      className={clsx(
        'text-[length:var(--text-screen-xs)] tracking-[0.05em] text-[color:var(--detail-muted)]',
        className ?? 'mb-1',
      )}
      style={{ fontFamily: 'var(--font-family-pokemon)' }}
    >
      {children}
    </div>
  );
}
