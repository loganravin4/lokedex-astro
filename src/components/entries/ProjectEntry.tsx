import TypeBadge from '../ui/TypeBadge';
import PixelLabel from '../ui/PixelLabel';
import type { Project } from '../../types/sanity';

interface ProjectEntryProps {
  project: Project;
  number: string; // zero-padded entry number ('001')
}

// Detail-panel layout for a single project
export default function ProjectEntry({ project, number }: ProjectEntryProps) {
  const hasLinks = Boolean(project.github || project.link);

  return (
    <div
      className="no-scrollbar h-full overflow-y-auto p-[var(--screen-padding)]"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      <div className="text-[length:var(--text-screen-xs)] text-[color:var(--list-number)]">
        #{number}
      </div>
      <h2 className="mt-1 text-[length:var(--text-screen-xl)] font-semibold text-[color:var(--detail-heading)]">
        {project.name}
      </h2>
      {project.types && project.types.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {project.types.map((type) => (
            <TypeBadge key={type} type={type} label={type} />
          ))}
        </div>
      )}

      <div className="my-3 h-px bg-[var(--detail-divider)]" />

      <PixelLabel>DESC:</PixelLabel>
      <p className="text-[length:var(--text-screen-sm)] leading-relaxed text-[color:var(--detail-body)]">
        {project.description}
      </p>

      {project.techs && project.techs.length > 0 && (
        <>
          <div className="mt-3">
            <PixelLabel>STACK:</PixelLabel>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.techs.map((tech) => (
              <span
                key={tech}
                className="rounded-[3px] border border-[var(--detail-tech-border)] bg-[var(--detail-tech-bg)] px-[6px] py-[1px] text-[length:var(--text-screen-xs)] text-[color:var(--detail-body)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </>
      )}

      {hasLinks && (
        <>
          <div className="mt-3">
            <PixelLabel>LINKS:</PixelLabel>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-link)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
              >
                ▶ GITHUB
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-link)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
              >
                ▶ LIVE
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
