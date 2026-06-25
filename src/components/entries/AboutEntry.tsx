import TypeBadge from '../ui/TypeBadge';
import SpotifyWidget from '../features/SpotifyWidget';

const GITHUB_URL = 'https://github.com/loganravin4';
const LINKEDIN_URL = 'https://www.linkedin.com/in/logan-ravinuthala';

// A trainer-card stat line: Press Start 2P label + JetBrains Mono value
// (Section 7 AboutEntry). Baseline-aligned so the two fonts sit on one line.
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-[length:var(--text-screen-xs)] tracking-[0.05em] text-[color:var(--detail-muted)]"
        style={{ fontFamily: 'var(--font-family-pokemon)' }}
      >
        {label}
      </span>
      <span className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-body)]">
        {value}
      </span>
    </div>
  );
}

// The Logan trainer card (Section 7 AboutEntry). Static content — no Sanity
// data. Body copy mirrors the tone/facts of the live site (loganravinuthala.dev).
export default function AboutEntry() {
  return (
    <div
      className="no-scrollbar h-full overflow-y-auto p-[var(--screen-padding)]"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      {/* Trainer stat card */}
      <div className="flex flex-col gap-1">
        <StatRow label="TRAINER:" value="Logan Ravinuthala" />
        <StatRow label="CLASS:" value="Computer Engineering + CS" />
        <StatRow label="SCHOOL:" value="Northeastern University" />
        <StatRow label="GPA:" value="3.9" />
      </div>

      <div className="my-3 h-px bg-[var(--detail-divider)]" />

      {/* Trainer bio — first-person, punchy */}
      <div className="flex flex-col gap-2 text-[length:var(--text-screen-sm)] leading-relaxed text-[color:var(--detail-body)]">
        <p>
          I'm a Computer Engineering + CS student at Northeastern who builds
          things that actually ship. Incoming software engineering co-op at MORSE
          Corp, working on technical solutions inside the U.S. national security
          ecosystem.
        </p>
        <p>
          I'm a Member of Technical Staff at CampusGTM, a full-stack AI SaaS.
          Before that I was a software engineer at NExT Consulting, where I shipped
          an AI Chief-of-Staff and a data analytics platform for clients — and
          TA'd Databases and Fundamentals of CS along the way.
        </p>
        <p>
          On campus I build at Generate Product Development Studio and lead Digital
          Innovation for the Student Government Association. Off the keyboard:
          weightlifting, long aimless walks, and far too many Spotify minutes on
          The Weeknd and BTS.
        </p>
      </div>

      {/* Interests as type badges — type colors used creatively */}
      <div className="mt-3 flex flex-wrap gap-1">
        <TypeBadge type="fighting" label="Weightlifting" />
        <TypeBadge type="psychic" label="Music" />
        <TypeBadge type="electric" label="Mario Kart" />
        <TypeBadge type="grass" label="Pokémon" />
      </div>

      {/* Links */}
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-link)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
        >
          ▶ GITHUB
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-link)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
        >
          ▶ LINKEDIN
        </a>
      </div>

      {/* Live Spotify now-playing — a natural extension of the trainer card
          (the bio already nods at Spotify minutes). Compact, screen-native. */}
      <SpotifyWidget />
    </div>
  );
}
