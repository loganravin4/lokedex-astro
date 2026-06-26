import { usePokedex } from '../../hooks/usePokedex';
import { useSynth } from '../../hooks/useSynth';

interface ActionButtonsProps {
  onA: () => void;
  onB: () => void;
}

export default function ActionButtons({ onA, onB }: ActionButtonsProps) {
  const { isMuted } = usePokedex();
  const synth = useSynth(isMuted);

  const handleA = () => {
    synth.select();
    onA();
  };
  const handleB = () => {
    synth.back();
    onB();
  };

  return (
    <div className="hidden md:flex items-center gap-[14px]">
      <button type="button" aria-label="B (back)" onClick={handleB} className="btn-action">
        B
      </button>
      <button type="button" aria-label="A (select)" onClick={handleA} className="btn-action">
        A
      </button>
    </div>
  );
}
