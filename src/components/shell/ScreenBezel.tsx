import type { ReactNode } from 'react';

interface ScreenBezelProps {
  children?: ReactNode;
  label: string;
}

// Screen housing (Section 7 / Sections 6.2 + 6.3). The .screen-bezel outer
// frame holds the .screen-glass inner surface; the scanline (::after) and glow
// (::before) pseudo-elements live on .screen-glass in hardware.css and render
// automatically. children sit at z-index 1 inside the glass, below the glow
// (9) and scanlines (10). A small pixel label sits below the bezel.
export default function ScreenBezel({ children, label }: ScreenBezelProps) {
  return (
    <div className="screen-bezel flex-1 relative flex flex-col">
      <div className="screen-glass flex-1 relative overflow-hidden">
        {/* Content layer — above the glass background, below glow + scanlines */}
        <div className="relative z-[1] h-full">{children}</div>
      </div>

      {/* font-family kept in style — a CSS-var font ref is unwieldy as an
          arbitrary Tailwind class (Section 13 inline-style exception 3). */}
      <div
        className="text-[length:var(--text-hw-xs)] text-[color:var(--detail-muted)] mt-[6px] text-center tracking-[0.05em]"
        style={{ fontFamily: 'var(--font-family-pokemon)' }}
      >
        {label}
      </div>
    </div>
  );
}
