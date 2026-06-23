// Central device state shared by every component — POKEDEX_SPEC.md Section 11.
//
// This context owns *content* state (which section is active, which entry is
// selected, where the list cursor sits, and global mute). Animation state
// (`AnimationState`) deliberately stays local to PokedexShell — it describes the
// fold/boot view machine, not the content the device is displaying.
//
// Implemented with createElement rather than JSX so the file can keep the
// `.ts` extension named in the Section 2 project structure.

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import type { Section } from '../types/pokedex';

// Section 1 / Section 10: mute state persists here so useSynth can gate playback.
const MUTE_STORAGE_KEY = 'lokedex-muted';

const VALID_SECTIONS: Section[] = ['projects', 'experience', 'about', 'contact'];

// Sections whose hash carries a per-entry segment (#projects/slug).
function sectionHasEntry(section: Section): boolean {
  return section === 'projects' || section === 'experience';
}

interface PokedexContextValue {
  activeSection: Section;
  selectedEntry: string | null; // entry _id (see slug note below)
  focusedIndex: number; // list cursor position
  isMuted: boolean;
  setActiveSection: (s: Section) => void;
  setSelectedEntry: (id: string | null) => void;
  setFocusedIndex: (i: number) => void;
  toggleMute: () => void;
}

// No default value — usePokedex throws if read outside the provider.
const PokedexContext = createContext<PokedexContextValue | null>(null);

interface ParsedHash {
  section: Section;
  entry: string | null;
}

// Hash format (Section 11): #projects/slug, #experience/slug, #about, #contact.
// Empty or unrecognised hashes fall back to the projects section, no entry.
//
// NOTE(Task 13): the segment after the section is a *slug*, but selectedEntry is
// meant to hold an entry _id. Until useSanityData is wired, we store the raw slug
// here as a temporary stand-in; slug→_id resolution lands in Task 13.
function parseHash(rawHash: string): ParsedHash {
  const raw = rawHash.replace(/^#/, '');
  if (!raw) return { section: 'projects', entry: null };

  const [sectionPart, slugPart] = raw.split('/');
  if (!VALID_SECTIONS.includes(sectionPart as Section)) {
    return { section: 'projects', entry: null };
  }

  const section = sectionPart as Section;
  const entry = sectionHasEntry(section) && slugPart ? slugPart : null;
  return { section, entry };
}

// Build the canonical hash for the current content state. Mirror of parseHash:
// only projects/experience emit the trailing slug segment.
function buildHash(section: Section, entry: string | null): string {
  if (sectionHasEntry(section) && entry) {
    return `#${section}/${entry}`;
  }
  return `#${section}`;
}

export function PokedexProvider({ children }: { children: ReactNode }) {
  // Restore section + entry from the URL hash on first mount.
  const [activeSection, setActiveSection] = useState<Section>(
    () => parseHash(window.location.hash).section,
  );
  const [selectedEntry, setSelectedEntry] = useState<string | null>(
    () => parseHash(window.location.hash).entry,
  );
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // isMuted seeds from localStorage: muted only when the key is present and 'true'.
  const [isMuted, setIsMuted] = useState<boolean>(
    () => localStorage.getItem(MUTE_STORAGE_KEY) === 'true',
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTE_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  // Keep the URL hash in sync as the active section / selected entry change.
  useEffect(() => {
    const hash = buildHash(activeSection, selectedEntry);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, [activeSection, selectedEntry]);

  const value: PokedexContextValue = {
    activeSection,
    selectedEntry,
    focusedIndex,
    isMuted,
    setActiveSection,
    setSelectedEntry,
    setFocusedIndex,
    toggleMute,
  };

  return createElement(PokedexContext.Provider, { value }, children);
}

export function usePokedex(): PokedexContextValue {
  const ctx = useContext(PokedexContext);
  if (!ctx) {
    throw new Error('usePokedex must be used within a <PokedexProvider>');
  }
  return ctx;
}
