import { useEffect } from 'react';
import type { ReactNode } from 'react';

// PostHog bootstrap for the SPA
const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com';

// Module-level guard so init + the page_view fire exactly once
let initialized = false;

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (initialized || !POSTHOG_KEY) return;
    initialized = true;

    // Lazy-import posthog-js so the (~280 kB) library is code-split into its own
    // chunk and kept out of the critical-path bundle
    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        // Send exactly one $pageview ourselves below; disable autocapture's so
        // there's no duplicate on load.
        capture_pageview: false,
        // Match the original site's config: always create person profiles.
        person_profiles: 'always',
      });

      // $pageview (PostHog's built-in event) so this populates the native
      // Pageviews graph, Paths, and Session Replay filters
      posthog.capture('$pageview');
    });
  }, []);

  return <>{children}</>;
}
