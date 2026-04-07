import { use } from 'react';
import CategoryClient from './CategoryClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Generate static params for all categories
export function generateStaticParams() {
    return [
        { id: 'beaches' },
        { id: 'heritage' },
        { id: 'museums' },
        { id: 'spiritual' },
        { id: 'temples' },
        { id: 'churches' },
        { id: 'mosques' },
        { id: 'hotels' },
        { id: 'restaurants' },
        { id: 'nature' },
        { id: 'parks' },
        { id: 'adventure' },
        { id: 'shopping' },
    ];
}

export default function CategoryDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return <CategoryClient id={id} />;
}
