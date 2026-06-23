import type { Section, ListEntry } from '../types/pokedex';
import type { Project, Experience } from '../types/sanity';

// Maps the active section's Sanity data into the uniform ListEntry[] the list
// renders and the D-pad/action buttons index into (Section 12 mapping).
// Both ListPanel and RightHalf derive from this so focusedIndex stays aligned
// across the visual list and the hardware selection logic.
export function buildEntries(
  section: Section,
  projects: Project[],
  experiences: Experience[],
): ListEntry[] {
  const pad = (i: number) => String(i + 1).padStart(3, '0');

  switch (section) {
    case 'projects':
      return projects.map((p, i) => ({
        id: p._id,
        number: pad(i),
        name: p.name,
        types: p.types,
      }));
    case 'experience':
      return experiences.map((e, i) => ({
        id: e._id,
        number: pad(i),
        name: e.title,
        subtitle: e.company,
      }));
    case 'about':
      return [{ id: 'about', number: '—', name: 'ABOUT' }];
    case 'contact':
      return [{ id: 'contact', number: '—', name: 'CONTACT' }];
  }
}
