import { useEffect, useState } from 'react';
import { fetchProjects } from '../lib/fetchProjects';
import { fetchExperiences } from '../lib/fetchExperiences';
import type { Project, Experience } from '../types/sanity';

interface SanityData {
  projects: Project[];
  experiences: Experience[];
  loading: boolean;
  error: Error | null;
}

/**
 * Loads all Pokédex data once on mount: projects + experiences in parallel.
 * The dataset is small enough that no per-entry fetches are needed.
 */
export function useSanityData(): SanityData {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchProjects(), fetchExperiences()])
      .then(([projectData, experienceData]) => {
        if (cancelled) return;
        setProjects(projectData);
        setExperiences(experienceData);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, experiences, loading, error };
}
