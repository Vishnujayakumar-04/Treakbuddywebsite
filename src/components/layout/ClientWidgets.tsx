'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const AIWidget = dynamic(() => import('@/components/layout/AIWidget').then((m) => ({ default: m.AIWidget })), {
  ssr: false,
});
const MobileAppBanner = dynamic(
  () => import('@/components/layout/MobileAppBanner').then((m) => ({ default: m.MobileAppBanner })),
  { ssr: false }
);

export function ClientWidgets() {
  // Avoid any edge-case hydration issues by rendering only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <>
      <AIWidget />
      <MobileAppBanner />
    </>
  );
}

