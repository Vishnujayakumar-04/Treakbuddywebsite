import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Famous Places in Puducherry',
    description: 'Explore the most famous places in Puducherry — historical sites, temples, churches, beaches, and top restaurants. Your curated Puducherry tourist guide.',
    keywords: ['Puducherry tourist places', 'famous places Pondicherry', 'Pondicherry temples', 'Pondicherry beaches', 'Puducherry churches'],
    openGraph: {
        title: 'Famous Places in Puducherry | TrekBuddy',
        description: 'Explore historical sites, temples, nature spots, churches, and restaurants in Puducherry.',
        images: [{ url: '/assets/spot/aayi mandapam.jfif', width: 1200, height: 630, alt: 'Famous Places in Puducherry' }],
    },
};

export default function FamousPlacesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
