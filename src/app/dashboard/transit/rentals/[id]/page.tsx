import { use } from 'react';
import RentalClient from './RentalClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Generate static params - returns empty array since rentals are stored in Firestore
export function generateStaticParams() {
    return [];
}

export default function RentalDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return <RentalClient id={id} />;
}
