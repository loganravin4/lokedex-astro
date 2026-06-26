import { motion } from 'framer-motion';
import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';

interface CloseAnimationProps {
  onComplete: () => void;
}

// The 3D fold close
export default function CloseAnimation({ onComplete }: CloseAnimationProps) {
  return (
    <div className="pokedex-shell w-[var(--device-width)] h-[var(--device-height)] flex flex-row items-stretch perspective-[1200px]">
      <motion.div
        className="flex"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <LeftHalf />
      </motion.div>

      <Hinge />

      <motion.div
        className="flex"
        style={{ transformOrigin: 'left center' }}
        initial={{ rotateY: 0, opacity: 1 }}
        animate={{ rotateY: -90, opacity: 0 }}
        transition={{
          rotateY: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
          opacity: { duration: 0.2 },
        }}
        onAnimationComplete={onComplete}
      >
        <RightHalf isReady={false} />
      </motion.div>
    </div>
  );
}
