import { useEffect } from 'react';
import { trackCTAClick, trackExternalLink, trackNavigationClick, trackProjectClick, trackTechClick } from '../../lib/analytics';

export default function AnalyticsClickHandler() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Track CTA buttons
      const ctaName = link.getAttribute('data-track-cta');
      if (ctaName) {
        trackCTAClick(ctaName, 'page');
        return;
      }

      // Track external links
      const externalPlatform = link.getAttribute('data-track-external');
      if (externalPlatform) {
        trackExternalLink(externalPlatform, href);
        return;
      }

      // Track project interactions
      const projectName = link.getAttribute('data-track-project');
      const projectAction = link.getAttribute('data-track-action') as 'view' | 'github' | 'demo' | null;
      if (projectName && projectAction) {
        trackProjectClick(projectName, projectAction);
        return;
      }

      // Track tech clicks
      const techName = link.getAttribute('data-track-tech');
      if (techName) {
        trackTechClick(techName);
        return;
      }

      // Track internal navigation (non-hash links)
      if (href.startsWith('/') && !href.startsWith('//')) {
        const destination = href.replace(/^\/|\/$/g, '') || 'home';
        if (destination !== window.location.pathname.replace(/^\/|\/$/g, '') || 'home') {
          trackNavigationClick(destination);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

