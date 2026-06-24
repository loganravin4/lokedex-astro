import clsx from 'clsx';
import type { ReactNode } from 'react';

interface PixelLabelProps {
  children: ReactNode;
  // Spacing override (defaults to mb-1). ExperienceEntry uses mb-2 for its
  // bullet/sub-project groups; ProjectEntry keeps the tighter default.
  className?: string;
}

// Press Start 2P section label (DESC:, STACK:, LINKS:, HIGHLIGHTS:, PROJECTS:)
// shared across detail-panel entries. Press Start 2P is for labels only, never
// body copy (Section 5); letter-spacing 0.05em per the same section. The
// font-family stays in style{} — a CSS-var font ref is unwieldy as an arbitrary
// Tailwind class (Section 13 inline-style exception 3).
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
