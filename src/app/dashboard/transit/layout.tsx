'use client';

import { useEffect, ReactNode } from 'react';
import { seedTransitData } from '@/services/transitService';

export default function TransitLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Run seed on mount ensuring data consistency across all transit pages
        seedTransitData().catch((error) => {
            console.error("Failed to seed transit data:", error);
        });
    }, []);

    return <>{children}</>;
}
