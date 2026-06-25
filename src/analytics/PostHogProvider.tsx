import { useEffect } from 'react';
import type { ReactNode } from 'react';

// PostHog bootstrap for the SPA. Reads the Vite-exposed env vars (only VITE_*
// keys reach client code); the host falls back to PostHog US cloud if unset.
// These are public, client-side project tokens by design — not secrets.
const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com';

// Module-level guard so init + the page_view fire exactly once, even under
// React 18 StrictMode's intentional double-mount in development.
let initialized = false;

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (initialized || !POSTHOG_KEY) return;
    initialized = true;

    // Lazy-import posthog-js so the (~280 kB) library is code-split into its own
    // chunk and kept out of the critical-path bundle — it loads right after
    // mount rather than blocking first paint.
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
      // Pageviews graph, Paths, and Session Replay filters — not just custom
      // queries. One real page in this SPA = one pageview on load.
      posthog.capture('$pageview');
    });
  }, []);

  return <>{children}</>;
}
