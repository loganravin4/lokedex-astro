import clsx from 'clsx';
import type { Section } from '../../types/pokedex';
import { usePokedex } from '../../hooks/usePokedex';
import { useSynth } from '../../hooks/useSynth';

// Section switcher row below the LIST screen (Section 7 / Section 6.6).
// Clicking a button switches the active section, clears the selected entry and
// resets the list cursor, then fires the sectionSwitch beep (Section 1).
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
    <div className="flex w-full justify-center gap-[8px]">
      {SECTIONS.map(({ label, section }) => (
        <button
          key={section}
          type="button"
          onClick={() => handleClick(section)}
          className={clsx('btn-section', { active: section === activeSection })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
