interface TypeBadgeProps {
  type: string;
  label: string;
}

// Hardware type badge: no shadow/hover, sized for the screen rows. Each type
// maps to its --color-poke-* token; color-mix derives fill/border/text from the
// one token. The color is a runtime value from `type`, so it lives in style{}.
const typeColorVar: Record<string, string> = {
  normal: '--color-poke-normal',
  fire: '--color-poke-fire',
  water: '--color-poke-water',
  electric: '--color-poke-electric',
  grass: '--color-poke-grass',
  ice: '--color-poke-ice',
  fighting: '--color-poke-fighting',
  poison: '--color-poke-poison',
  ground: '--color-poke-ground',
  flying: '--color-poke-flying',
  psychic: '--color-poke-psychic',
  bug: '--color-poke-bug',
  rock: '--color-poke-rock',
  ghost: '--color-poke-ghost',
  dragon: '--color-poke-dragon',
  dark: '--color-poke-dark',
  steel: '--color-poke-steel',
  fairy: '--color-poke-fairy',
};

export default function TypeBadge({ type, label }: TypeBadgeProps) {
  const colorVar = typeColorVar[type.toLowerCase()] ?? '--color-poke-normal';
  const color = `var(${colorVar})`;

  return (
    <span
      className="rounded-[3px] border px-[5px] py-[1px] text-[length:var(--text-screen-xs)] whitespace-nowrap"
      style={{
        fontFamily: 'var(--font-family-mono)',
        backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
        borderColor: `color-mix(in srgb, ${color} 60%, transparent)`,
        color,
      }}
    >
      {label}
    </span>
  );
}
