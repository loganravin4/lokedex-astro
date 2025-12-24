import { motion } from 'framer-motion';

interface TypeBadgeProps {
  type: string;
  tech: string;
}

const typeColors: Record<string, string> = {
  fire: 'bg-poke-fire',
  water: 'bg-poke-water',
  electric: 'bg-poke-electric',
  grass: 'bg-poke-grass',
  ice: 'bg-poke-ice',
  fighting: 'bg-poke-fighting',
  poison: 'bg-poke-poison',
  ground: 'bg-poke-ground',
  flying: 'bg-poke-flying',
  psychic: 'bg-poke-psychic',
  bug: 'bg-poke-bug',
  rock: 'bg-poke-rock',
  ghost: 'bg-poke-ghost',
  dragon: 'bg-poke-dragon',
  dark: 'bg-poke-dark',
  steel: 'bg-poke-steel',
  fairy: 'bg-poke-fairy',
  normal: 'bg-poke-normal',
};

export default function TypeBadge({ type, tech }: TypeBadgeProps) {
  const colorClass = typeColors[type.toLowerCase()] || 'bg-poke-normal';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${colorClass} px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-lg border-2 border-white/20`}
    >
      {tech}
    </motion.div>
  );
}