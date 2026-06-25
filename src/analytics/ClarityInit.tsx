import { useEffect } from 'react';

// Microsoft Clarity (heatmaps + session replay). The project ID comes from the
// Vite-exposed env var — no ID is hardcoded. Set VITE_PUBLIC_CLARITY_PROJECT_ID
// in .env to enable; absent, this no-ops. ID from https://clarity.microsoft.com
// → Project → Settings → Setup.
const CLARITY_PROJECT_ID = import.meta.env.VITE_PUBLIC_CLARITY_PROJECT_ID as string | undefined;

// Guard so the tag is injected exactly once — even under StrictMode's dev
// double-mount — and so we never tear down an already-running Clarity.
let injected = false;

export default function ClarityInit() {
  useEffect(() => {
    if (injected || !CLARITY_PROJECT_ID || typeof document === 'undefined') return;
    injected = true;

    // Clarity bootstrap stub + tag — ported verbatim from the original
    // src/components/analytics/ClarityInit.tsx (only the env var name changed to
    // the VITE_-exposed equivalent, since Vite does not expose PUBLIC_* vars).
    (window as any).clarity =
      (window as any).clarity ||
      function () {
        ((window as any).clarity.q = (window as any).clarity.q || []).push(arguments);
      };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`;
    document.head.appendChild(script);
  }, []);

  return null;
}
