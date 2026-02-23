'use client';

import { useParams } from 'next/navigation';
import { CategoryHero } from '@/components/events/CategoryHero';
import { EventFilters } from '@/components/events/EventFilters';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/events/EmptyState';
import { use, useEffect, useState } from 'react';
import { getEventsByCategory } from '@/services/eventService';
import { AdminEvent } from '@/types/admin';
import { Loader2 } from 'lucide-react';

const CATEGORY_META: Record<string, any> = {
    'music': {
        title: 'Music Events',
        description: 'Music signifies the vibrant energy of the place! Such music events in Pondicherry make the city alive throughout the year.',
        heroImage: '/assets/spot/white town walks.jfif',
        followers: '3.7M+',
    },
    'concerts': {
        title: 'Concerts',
        description: 'Music to ears is like a soul to life. Escape the monotonous life and find pieces of you by attending live music events.',
        heroImage: '/assets/spot/aayi mandapam.jfif',
        followers: '1.3M+',
    },
    'festivals': {
        title: 'Festivals',
        description: 'The best things to do in the world include attending top-notch festivals in Pondicherry.',
        heroImage: '/assets/beaches/paradise beach.jpeg',
        followers: '2.5M+',
    },
    'dance': {
        title: 'Dance Events',
        description: 'Bring the true star in you out at the top dance classes in Pondicherry and be a performer like you are.',
        heroImage: '/assets/beaches/serenity beach.jpg',
        followers: '732k+',
    },
    'health-wellness': {
        title: 'Health & Wellness Events',
        description: 'If there is anything that will stay with you until the end of your life, it is your body.',
        heroImage: '/assets/spot/botanical garden.jfif',
        followers: '1.1M+',
    },
    'theatre': {
        title: 'Theatre Events',
        description: 'Attending a theatre workshop could be tremendous fun and an absolute stress buster.',
        heroImage: '/assets/spot/museum.jfif',
        followers: '820.4k+',
    },
    'adventure': {
        title: 'Adventure Events',
        description: 'Unleash your wild side with adrenaline-pumping adventure sports and outdoor activities around Pondicherry.',
        heroImage: '/assets/beaches/auroville beach.jpg',
        followers: '450.2k+',
    }
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = use(params);
    const categoryId = resolvedParams.category;

    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getEventsByCategory(categoryId).then(res => {
            setEvents(res);
            setLoading(false);
        });
    }, [categoryId]);

    const meta = CATEGORY_META[categoryId] || {
        title: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Events`,
        description: `Everything you need to know about ${categoryId} in Pondicherry.`,
        heroImage: '/assets/beaches/promenade beach.jpg',
        followers: '100k+',
    };

    const activeEvents = events.filter(e => e.type === 'active');
    const nearbyEvents = events.filter(e => e.type === 'nearby');
    const trendingEvents = events.filter(e => e.type === 'trending');

    const capitalizedCatName = meta.title.replace(' Events', '');

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-violet-500 mb-4" />
                <p className="text-slate-500 font-medium">Loading events...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
            <CategoryHero
                title={meta.title}
                description={meta.description}
                imageSrc={meta.heroImage}
                followersCount={meta.followers}
            />

            <EventFilters activeCategory={capitalizedCatName} />

            <div className="container max-w-[1280px] mx-auto px-4 mt-8 space-y-16">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {capitalizedCatName} events in <span className="underline decoration-2 underline-offset-4 decoration-current">Pondicherry</span>
                    </h2>

                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {events.map((evt) => (
                                <EventCard
                                    key={evt.id}
                                    title={evt.title}
                                    date={evt.date}
                                    location={evt.location}
                                    interested={evt.interested}
                                    imageSrc={evt.image}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </section>
            </div>
        </div>
    );
}
