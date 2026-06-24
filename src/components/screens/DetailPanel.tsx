import { AnimatePresence, motion } from 'framer-motion';
import { usePokedex } from '../../hooks/usePokedex';
import type { Project, Experience } from '../../types/sanity';
import ProjectEntry from '../entries/ProjectEntry';
import ExperienceEntry from '../entries/ExperienceEntry';
import AboutEntry from '../entries/AboutEntry';
import ContactEntry from '../entries/ContactEntry';

interface DetailPanelProps {
  // Same single-fetch data as ListPanel, passed down from PokedexShell so the
  // detail view can resolve selectedEntry (_id) against the full record.
  projects: Project[];
  experiences: Experience[];
}

// Right screen — the full detail for the selected entry (Section 7 DetailPanel).
// No selection: a centered prompt with a blinking cursor.
function EmptyState() {
  return (
    <div
      className="flex h-full items-center justify-center text-[length:var(--text-screen-sm)] text-[color:var(--detail-muted)]"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      {/* Custom blink keyframe — not expressible as a Tailwind class (Section
          13); decorative-only, so a CSS keyframe is the correct tool. */}
      <span className="mr-1" style={{ animation: 'blink 1s step-end infinite' }}>
        █
      </span>
      SELECT AN ENTRY
    </div>
  );
}

export default function DetailPanel({ projects, experiences }: DetailPanelProps) {
  const { activeSection, selectedEntry } = usePokedex();

  // Route to the right entry component (Section 7). About/Contact ignore
  // selectedEntry — they're single-entry sections. Projects/Experience resolve
  // selectedEntry (_id) against the fetched records; an unmatched id (e.g. a
  // hash slug not yet resolved) falls back to the empty prompt.
  const renderContent = () => {
    if (activeSection === 'about') return <AboutEntry />;
    if (activeSection === 'contact') return <ContactEntry />;
    if (!selectedEntry) return <EmptyState />;

    if (activeSection === 'projects') {
      const index = projects.findIndex((p) => p._id === selectedEntry);
      if (index === -1) return <EmptyState />;
      return (
        <ProjectEntry
          project={projects[index]}
          number={String(index + 1).padStart(3, '0')}
        />
      );
    }

    if (activeSection === 'experience') {
      const exp = experiences.find((e) => e._id === selectedEntry);
      if (!exp) return <EmptyState />;
      return <ExperienceEntry exp={exp} />;
    }

    return <EmptyState />;
  };

  // Panel swap fade (Section 9 "Detail panel entry change", 150ms). mode="wait"
  // so the outgoing entry fades out before the next fades in — no overlap or
  // layout jump inside the fixed-height screen.
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedEntry ?? 'empty'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="h-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
