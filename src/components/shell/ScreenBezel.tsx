import type { ReactNode } from 'react';

interface ScreenBezelProps {
  children?: ReactNode;
  label: string;
}

// Screen housing. The .screen-glass surface carries the scanline (::after) and
// glow (::before) pseudo-elements from hardware.css; children sit at z-index 1,
// below the glow (9) and scanlines (10).
export default function ScreenBezel({ children, label }: ScreenBezelProps) {
  return (
    <div className="screen-bezel flex-1 min-h-0 relative flex flex-col">
      <div className="screen-glass flex-1 min-h-0 relative overflow-hidden">
        <div className="relative z-[1] h-full">{children}</div>
      </div>

      {/* font-family in style: a CSS-var font ref is unwieldy as a Tailwind class. */}
      <div
        className="text-[length:var(--text-hw-xs)] text-[color:var(--detail-muted)] mt-[6px] text-center tracking-[0.05em]"
        style={{ fontFamily: 'var(--font-family-pokemon)' }}
      >
        {label}
      </div>
    </div>
  );
}
