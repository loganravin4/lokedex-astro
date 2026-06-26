// Core device state and view types.

export type Section = 'projects' | 'experience' | 'about' | 'contact';

export interface PokedexState {
  isOpen: boolean;
  activeSection: Section;
  selectedEntry: string | null;
  focusedIndex: number;
  isMuted: boolean;
}

export type AnimationState = 'closed' | 'opening' | 'booting' | 'ready' | 'closing';

export interface ListEntry {
  id: string;
  number: string; // zero-padded: '001', '002'...
  name: string;
  subtitle?: string; // company name for experience, empty for projects
  types?: string[]; // projects only
}
