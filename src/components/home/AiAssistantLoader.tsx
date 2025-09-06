
'use client';

import React, { Suspense } from 'react';

// Dynamically import the AiAssistant component with SSR turned off
const AiAssistant = React.lazy(() => import('./AiAssistant'));

export default function AiAssistantLoader() {
  return (
    <Suspense fallback={null}>
      <AiAssistant />
    </Suspense>
  );
}

    