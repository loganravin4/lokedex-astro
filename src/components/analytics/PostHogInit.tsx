import { useEffect } from 'react';
import { initPostHog } from '../../lib/analytics';

interface PostHogInitProps {
  apiKey: string;
  apiHost?: string;
}

export default function PostHogInit({ apiKey, apiHost }: PostHogInitProps) {
  useEffect(() => {
    initPostHog(apiKey, apiHost);
  }, [apiKey, apiHost]);

  return null;
}

