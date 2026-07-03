'use client';

import { useEffect } from 'react';

interface Props {
  outfitId: string;
  outfitCode: string;
}

export default function TrackOutfitView({ outfitId, outfitCode }: Props) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    fetch('/api/tracking/outfit-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outfitId,
        outfitCode,
        referrer: document.referrer || null,
        utmSource: params.get('utm_source'),
        utmMedium: params.get('utm_medium'),
        utmCampaign: params.get('utm_campaign'),
      }),
    }).catch(() => {
      // Silently ignore — tracking must not affect the user experience.
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
