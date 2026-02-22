import { use } from 'react';
import TripClient from './TripClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Generate static params - returns empty array since trips are user-generated
export function generateStaticParams() {
    return [];
}

export default function TripDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return <TripClient id={id} />;
}
