import clsx from 'clsx';
import type { Section } from '../../types/pokedex';
import { usePokedex } from '../../hooks/usePokedex';
import { useSynth } from '../../hooks/useSynth';

// Section switcher row below the LIST screen.
const SECTIONS: { label: string; section: Section }[] = [
  { label: 'PROJ', section: 'projects' },
  { label: 'EXP', section: 'experience' },
  { label: 'ABOUT', section: 'about' },
  { label: 'CNTCT', section: 'contact' },
];

export default function SectionButtons() {
  const { activeSection, setActiveSection, setSelectedEntry, setFocusedIndex, isMuted } =
    usePokedex();
  const synth = useSynth(isMuted);

  const handleClick = (section: Section) => {
    setActiveSection(section);
    setSelectedEntry(null);
    setFocusedIndex(0);
    synth.sectionSwitch();
  };

  return (
    <div className="no-scrollbar flex w-full flex-nowrap justify-start gap-[8px] overflow-x-auto px-2 md:justify-center md:overflow-visible md:px-0">
      {SECTIONS.map(({ label, section }) => (
        <button
          key={section}
          type="button"
          onClick={() => handleClick(section)}
          className={clsx('btn-section shrink-0', { active: section === activeSection })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
