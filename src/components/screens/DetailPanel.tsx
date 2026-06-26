import { AnimatePresence, motion } from 'framer-motion';
import { usePokedex } from '../../hooks/usePokedex';
import type { Project, Experience } from '../../types/sanity';
import ProjectEntry from '../entries/ProjectEntry';
import ExperienceEntry from '../entries/ExperienceEntry';
import AboutEntry from '../entries/AboutEntry';
import ContactEntry from '../entries/ContactEntry';

interface DetailPanelProps {
  // Same single-fetch data as ListPanel, passed down from PokedexShell so the detail view can resolve selectedEntry (_id) against the full record
  projects: Project[];
  experiences: Experience[];
}

function EmptyState() {
  return (
    <div
      className="flex h-full items-center justify-center text-[length:var(--text-screen-sm)] text-[color:var(--detail-muted)]"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      {/* Custom blink keyframe */}
      <span className="mr-1" style={{ animation: 'blink 1s step-end infinite' }}>
        █
      </span>
      SELECT AN ENTRY
    </div>
  );
}

export default function DetailPanel({ projects, experiences }: DetailPanelProps) {
  const { activeSection, selectedEntry } = usePokedex();

  // Route to the entry component for the active section. About/Contact are
  // single-entry (they ignore selectedEntry); an unmatched project/experience
  // id (e.g. an unresolved hash slug) falls back to the empty prompt.
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

  // Panel swap fade on entry change (150ms)
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
