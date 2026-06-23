interface TypeBadgeProps {
  type: string; // drives the chip color via the --color-poke-* token
  label: string; // the text rendered in the chip
}

// Hardware-spec type badge (Section 13 compliant): no shadow, no framer-motion,
// no hover. A small colored chip — the type color at 20% fill / 60% border —
// sized for the screen rows. Replaces the web-styled projects/TypeBadge inside
// the device screens.
//
// Each type maps to its --color-poke-* token; opacity is applied with
// color-mix so the single token drives fill, border, and text. The color is a
// runtime value derived from the `type` prop, so it lives in style{} per the
// Section 13 inline-style exceptions (1: dynamic value).
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
