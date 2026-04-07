
import { use } from 'react';
import { PLACES_DATA } from '@/services/data/places';
import PlaceClient from './PlaceClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Static Params for Export
export async function generateStaticParams() {
    return PLACES_DATA.map((place) => ({
        id: place.id,
    }));
}

export default function PlaceDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return <PlaceClient id={id} />;
}
