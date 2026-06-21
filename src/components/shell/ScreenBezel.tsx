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
    <div
      className="screen-bezel"
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="screen-glass"
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Content layer — above the glass background, below glow + scanlines */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
          {children}
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-family-pokemon)',
          fontSize: 'var(--text-hw-xs)',
          color: 'var(--detail-muted)',
          marginTop: '6px',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
    </div>
  );
}
