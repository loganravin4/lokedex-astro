import { motion } from 'framer-motion';
import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';

interface HingeAnimationProps {
  onComplete: () => void;
}

// The 3D fold-open: the right half swings in from rotateY(-90deg) around its
// left edge while the left half fades in. onComplete advances PokedexShell to
// 'booting'.
export default function HingeAnimation({ onComplete }: HingeAnimationProps) {
  // Perspective lives on the parent (not the rotating child) so both halves share
  // one vanishing point, for a more realistic clamshell fold.
  return (
    <div className="pokedex-shell w-[var(--device-width)] h-[var(--device-height)] flex flex-row items-stretch perspective-[1200px]">
      <motion.div
        className="flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <LeftHalf />
      </motion.div>

      <Hinge />

      {/* Swings in from -90deg; onComplete fires off the rotateY leg (the slower
          of the two). transformOrigin stays in style so Framer animates its transform. */}
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
        {/* Input stays inert until the boot sequence finishes. */}
        <RightHalf isReady={false} />
      </motion.div>
    </div>
  );
}
