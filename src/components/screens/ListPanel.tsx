import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { usePokedex } from '../../hooks/usePokedex';
import { useSynth } from '../../hooks/useSynth';
import TypeBadge from '../ui/TypeBadge';
import type { ListEntry } from '../../types/pokedex';

interface ListPanelProps {
  // Built upstream (PokedexShell) from a single useSanityData call
  entries: ListEntry[];
  loading: boolean;
  error: Error | null;
}

// Left screen: the scrollable numbered entry list for the active section.
export default function ListPanel({ entries, loading, error }: ListPanelProps) {
  const {
    activeSection,
    selectedEntry,
    focusedIndex,
    setSelectedEntry,
    setFocusedIndex,
    isMuted,
  } = usePokedex();
  const synth = useSynth(isMuted);
  const focusedRowRef = useRef<HTMLDivElement | null>(null);

  // About/Contact are single-entry sections
  useEffect(() => {
    if (activeSection === 'about') setSelectedEntry('about');
    else if (activeSection === 'contact') setSelectedEntry('contact');
  }, [activeSection, setSelectedEntry]);

  // Scroll follows the cursor
  useEffect(() => {
    focusedRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [focusedIndex]);

  if (loading || error) {
    return (
      <div
        className="flex h-full items-center justify-center text-[length:var(--text-screen-sm)] text-[color:var(--detail-muted)]"
        style={{ fontFamily: 'var(--font-family-mono)' }}
      >
        {loading ? 'LOADING...' : 'ERROR'}
      </div>
    );
  }

  const handleClick = (entry: ListEntry, index: number) => {
    setFocusedIndex(index);
    setSelectedEntry(entry.id);
    synth.select();
  };

  return (
    <div
      className="no-scrollbar h-full overflow-y-auto"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      {entries.map((entry, index) => {
        const isSelected = selectedEntry === entry.id;
        const isFocused = focusedIndex === index;

        return (
          <div
            key={entry.id}
            ref={isFocused ? focusedRowRef : undefined}
            onClick={() => handleClick(entry, index)}
            onMouseEnter={() => setFocusedIndex(index)}
            className={clsx(
              'flex h-[28px] cursor-pointer items-center gap-[8px] px-[var(--screen-padding)]',
              {
                'bg-[var(--list-row-active)]': isSelected,
                'bg-[var(--list-row-hover)]': isFocused && !isSelected,
              },
            )}
          >
            <span className="min-w-[32px] text-[length:var(--text-screen-xs)] text-[color:var(--list-number)]">
              #{entry.number}
            </span>

            {activeSection === 'projects' && entry.types?.[0] && (
              <TypeBadge type={entry.types[0]} label={entry.types[0]} />
            )}

            <span
              className={clsx(
                'flex-1 truncate text-[length:var(--text-screen-md)]',
                isSelected
                  ? 'text-[color:var(--list-cursor)]'
                  : 'text-[color:var(--list-name)]',
              )}
            >
              {entry.name}
              {activeSection === 'experience' && entry.subtitle && (
                <span className="text-[color:var(--detail-muted)]">
                  {' · '}
                  {entry.subtitle}
                </span>
              )}
            </span>

            {/* Reserved-width cursor column */}
            <span className="w-[12px] text-center text-[length:var(--text-screen-xs)] text-[color:var(--list-cursor)]">
              {isFocused ? '▶' : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
