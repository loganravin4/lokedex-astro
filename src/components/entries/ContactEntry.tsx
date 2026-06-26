const EMAIL = 'ravinuthala.l@northeastern.edu';
const GITHUB_HANDLE = 'loganravin4';
const LINKEDIN_HANDLE = 'logan-ravinuthala';

interface ContactRowProps {
  label: string;
  value: string;
  href: string;
}

// One contact line rendered as a link.
function ContactRow({ label, value, href }: ContactRowProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-baseline gap-2 transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
    >
      <span
        className="text-[length:var(--text-screen-xs)] tracking-[0.05em] text-[color:var(--detail-muted)]"
        style={{ fontFamily: 'var(--font-family-pokemon)' }}
      >
        {label}
      </span>
      <span
        className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-link)]"
        style={{ fontFamily: 'var(--font-family-mono)' }}
      >
        {value}
      </span>
    </a>
  );
}

  // Static contact card
export default function ContactEntry() {
  return (
    <div
      className="no-scrollbar flex h-full flex-col gap-3 overflow-y-auto p-[var(--screen-padding)]"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      <ContactRow label="EMAIL:" value={EMAIL} href={`mailto:${EMAIL}`} />
      <ContactRow
        label="GITHUB:"
        value={GITHUB_HANDLE}
        href={`https://github.com/${GITHUB_HANDLE}`}
      />
      <ContactRow
        label="LINKEDIN:"
        value={LINKEDIN_HANDLE}
        href={`https://www.linkedin.com/in/${LINKEDIN_HANDLE}`}
      />
    </div>
  );
}
