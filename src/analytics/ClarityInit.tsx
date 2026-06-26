import { useEffect } from 'react';

// Microsoft Clarity (heatmaps + session replay)
const CLARITY_PROJECT_ID = import.meta.env.VITE_PUBLIC_CLARITY_PROJECT_ID as string | undefined;

// Guard so the tag is injected exactly once
let injected = false;

export default function ClarityInit() {
  useEffect(() => {
    if (injected || !CLARITY_PROJECT_ID || typeof document === 'undefined') return;
    injected = true;

    // Clarity bootstrap stub + tag
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
