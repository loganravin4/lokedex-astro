import { motion } from 'framer-motion';
import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';

interface HingeAnimationProps {
  onComplete: () => void;
}

// The 3D fold open (Section 9 "Opening fold"). The right half swings into
// view from rotateY(-90deg) around its left edge, while the left half fades
// in simultaneously. The hinge spine between them renders statically. When the
// fold finishes, onComplete() fires so PokedexShell can advance to 'booting'.
//
// This uses Framer Motion directly per the animation hierarchy (Section 1,
// item 5: the hinge fold is explicitly a Framer-Motion-direct interaction).
export default function HingeAnimation({ onComplete }: HingeAnimationProps) {
  // Perspective on the parent (not the rotating child) gives a shared
  // vanishing point at perspective-origin 50% 50% — the hinge line the right
  // half pivots on — for a more realistic clamshell fold.
  return (
    <div className="pokedex-shell w-[var(--device-width)] h-[var(--device-height)] flex flex-row items-stretch perspective-[1200px]">
      {/* Left half — fades in over 200ms (Section 9) */}
      <motion.div
        className="flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <LeftHalf />
      </motion.div>

      {/* Hinge spine — no animation */}
      <Hinge />

      {/* Right half — swings in from -90deg around its left edge. onComplete
          is driven off the rotateY leg (the slower of the two).
          transformOrigin stays in style — Framer animates the transform it
          pairs with (Section 13 inline-style exception 1). */}
      <motion.div
        className="flex"
        style={{ transformOrigin: 'left center' }}
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{
          rotateY: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
          opacity: { duration: 0.2 },
        }}
        onAnimationComplete={onComplete}
      >
        <RightHalf />
      </motion.div>
    </div>
  );
}
