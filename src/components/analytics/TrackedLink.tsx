import { trackNavigationClick, trackExternalLink, trackCTAClick } from '../../lib/analytics';

interface TrackedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isExternal?: boolean;
  isCTA?: boolean;
  ctaName?: string;
  platform?: string;
}

export default function TrackedLink({
  href,
  children,
  className,
  isExternal = false,
  isCTA = false,
  ctaName,
  platform,
}: TrackedLinkProps) {
  const handleClick = () => {
    if (isExternal && platform) {
      trackExternalLink(platform, href);
    } else if (isCTA && ctaName) {
      trackCTAClick(ctaName, 'page');
    } else {
      const destination = href.replace(/^\/|\/$/g, '') || 'home';
      trackNavigationClick(destination);
    }
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

