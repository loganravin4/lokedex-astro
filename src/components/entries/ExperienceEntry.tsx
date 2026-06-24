import PixelLabel from '../ui/PixelLabel';
import type { Experience } from '../../types/sanity';

interface ExperienceEntryProps {
  exp: Experience;
}

// "Jan 2024" — short month + year, matching the existing ExperienceCard format.
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Detail-panel layout for a single experience (Section 7 ExperienceEntry).
export default function ExperienceEntry({ exp }: ExperienceEntryProps) {
  const start = formatDate(exp.startDate);
  // current jobs (or any without an endDate) read as PRESENT (Section 12).
  const end = exp.current || !exp.endDate ? 'PRESENT' : formatDate(exp.endDate);
  const hasProjects = Boolean(exp.projects && exp.projects.length > 0);

  return (
    <div
      className="no-scrollbar h-full overflow-y-auto p-[var(--screen-padding)]"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      {/* Header */}
      <h2 className="text-[length:var(--text-screen-xl)] font-semibold text-[color:var(--detail-heading)]">
        {exp.title}
      </h2>
      <div className="mt-1 text-[length:var(--text-screen-sm)] text-[color:var(--detail-muted)]">
        {exp.company}
        {exp.location && ` · ${exp.location}`}
      </div>
      <div className="mt-1 text-[length:var(--text-screen-xs)] text-[color:var(--detail-muted)]">
        {start} – {end}
      </div>

      <div className="my-3 h-px bg-[var(--detail-divider)]" />

      {/* Description bullets */}
      {exp.description && exp.description.length > 0 && (
        <>
          <PixelLabel className="mb-2">HIGHLIGHTS:</PixelLabel>
          {exp.description.map((bullet, i) => (
            <div
              key={i}
              className="mb-1 flex text-[length:var(--text-screen-sm)] leading-relaxed"
            >
              <span className="mr-[6px] text-[color:var(--detail-heading)]">▶</span>
              <span className="text-[color:var(--detail-body)]">{bullet}</span>
            </div>
          ))}
        </>
      )}

      {/* Sub-projects */}
      {hasProjects && (
        <div className="mt-4">
          <PixelLabel className="mb-2">PROJECTS:</PixelLabel>
          {exp.projects!.map((proj, i) => {
            const hasLinks = Boolean(proj.github || proj.link);
            return (
              <div key={i} className="mb-3">
                <div className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-heading)]">
                  {proj.name}
                </div>
                <p className="mt-1 text-[length:var(--text-screen-xs)] leading-relaxed text-[color:var(--detail-muted)]">
                  {proj.description}
                </p>
                {proj.techs && proj.techs.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {proj.techs.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-[3px] border border-[var(--detail-tech-border)] bg-[var(--detail-tech-bg)] px-[6px] py-[1px] text-[length:var(--text-screen-xs)] text-[color:var(--detail-body)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {hasLinks && (
                  <div className="mt-1 flex flex-wrap gap-3">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-link)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
                      >
                        ▶ GITHUB
                      </a>
                    )}
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-link)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
                      >
                        ▶ LIVE
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
