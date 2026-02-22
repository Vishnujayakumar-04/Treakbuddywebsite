'use client';

import { useParams } from 'next/navigation';
import { CategoryHero } from '@/components/events/CategoryHero';
import { EventFilters } from '@/components/events/EventFilters';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/events/EmptyState';
import { use } from 'react';

// Mock data store for demonstrations based on screenshots
const CATEGORY_DATA: Record<string, any> = {
    'music': {
        title: 'Music Events',
        description: 'Music signifies the vibrant energy of the place! Such music events in Pondicherry make the city alive throughout the year. From live music shows and concerts to local gigs...',
        heroImage: 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=1600&auto=format&fit=crop&q=80',
        followers: '3.7M+',
        activeEvents: [
            { id: 1, title: 'Immersive Flumie Workshop with Bear Love and Shion Buschner', date: 'Fri, 06 Mar, 2026 - 05:00 PM', location: 'Kottakarai, Irumbai B.O, Auroville', interested: '33+ Interested', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=60' },
            { id: 2, title: 'Planetary Sound Symphony with Jens Zygar', date: 'Mon, 16 Mar, 2026 - 09:00 AM', location: 'Auroville, India 605111', interested: '22+ Interested', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=60' },
            { id: 3, title: 'Carnatic Classical Evening by TM Krishna', date: 'Sat, 14 Mar, 2026 - 06:00 PM', location: 'Pondicherry Rock Beach', interested: '150+ Interested', image: 'https://images.unsplash.com/photo-1470225620880-dba8ba36b745?w=400&q=60' },
        ],
        nearbyEvents: [
            { id: 4, title: 'Planetary Sound Symphony • Cosmic Octave Performance Workshop', date: 'Sun, 15 Mar • 10:00 AM', location: 'Auroville, pondicherry', interested: '87+ Interested', image: 'https://images.unsplash.com/photo-1470229722913-7c092bce8e4d?w=400&q=60' },
        ],
        trendingEvents: [
            { id: 5, title: 'Acoustic Sunset by local band "Sea Breeze"', date: 'Sun, 23 Feb Onwards', location: 'Promenade Beach, Pondicherry', interested: '200+ Interested', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=60' },
        ]
    },
    'concerts': {
        title: 'Concerts',
        description: 'Music to ears is like a soul to life. Escape the monotonous life and find pieces of you by attending live music events, festivals and concerts in Pondicherry. From indie rock bands to pop stars.',
        heroImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&auto=format&fit=crop&q=80',
        followers: '1.3M+',
        activeEvents: [
            { id: 6, title: 'Live Tribute to Coldplay by "Yellow"', date: 'Sat, 07 Mar, 2026 - 08:00 PM', location: 'Le Cafe Seaview, Pondicherry', interested: '450+ Interested', image: 'https://images.unsplash.com/photo-1540039155733-d7696f0ba35a?w=400&q=60' },
            { id: 7, title: 'Symphony Orchestra Night', date: 'Fri, 13 Mar, 2026 - 07:00 PM', location: 'Pondicherry Marina', interested: '120+ Interested', image: 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=400&q=60' },
        ],
        nearbyEvents: [
            { id: 8, title: 'EDM Pre-party at Auroville', date: 'Sat, 21 Mar • 10:00 PM', location: 'Auroville Forest Area', interested: '300+ Interested', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=60' },
        ],
        trendingEvents: [
            { id: 9, title: 'Bollywood Gala Live Concert', date: 'Sun, 01 Mar Onwards', location: 'ECR Grounds, Pondicherry', interested: '1.2k+ Interested', image: 'https://images.unsplash.com/photo-1470229722913-7c092bce8e4d?w=400&q=60' },
        ]
    },
    'festivals': {
        title: 'Festivals',
        description: 'The best things to do in the world include attending top-notch festivals in Pondicherry. Be it a rocking music festival or scrumptious food festival in the heart of the city.',
        heroImage: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1600&auto=format&fit=crop&q=80',
        followers: '2.5M+',
        activeEvents: [
            { id: 10, title: 'The 13th AUROVILLE TANGO FESTIVAL 2026 > INDIA !', date: 'Wed, 11 Mar, 2026 - 10:00 AM', location: 'Auroville : The Future Of World In India', interested: '122+ Interested', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=60' },
            { id: 11, title: 'Pondicherry French Food Festival', date: 'Sat, 14 Mar, 2026 - 11:00 AM', location: 'Alliance Francaise, Pondicherry', interested: '2k+ Interested', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=60' },
        ],
        nearbyEvents: [
            { id: 12, title: 'Auroville International Yoga Festival', date: 'Sun, 22 Mar • 06:00 AM', location: 'Matrimandir Gardens, Auroville', interested: '890+ Interested', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=60' },
        ],
        trendingEvents: []
    },
    'dance': {
        title: 'Dance Events',
        description: 'Bring the true star in you out at the top dance classes in Pondicherry and be a performer like you are. You can learn your best moves, be a champ at your local studios.',
        heroImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80',
        followers: '732k+',
        activeEvents: [
            { id: 13, title: 'Bharatanatyam Recital - "Divine Moves"', date: 'Fri, 06 Mar, 2026 - 06:30 PM', location: 'Aurobindo Ashram Hall', interested: '150+ Interested', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=60' },
            { id: 14, title: 'Salsa & Bachata Weekend Bootcamp', date: 'Sat, 07 Mar, 2026 - 04:00 PM', location: 'White Town Dance Studio', interested: '80+ Interested', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=60' },
        ],
        nearbyEvents: [],
        trendingEvents: [
            { id: 15, title: 'Hip-Hop Dance Battle 2026', date: 'Sun, 29 Mar Onwards', location: 'Pondicherry University', interested: '300+ Interested', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=60' },
        ]
    },
    'health-wellness': {
        title: 'Health & Wellness Events',
        description: 'If there is anything that will stay with you until the end of your life, it is your body. Treat your body like a temple to your soul and it will never leave you till the last breath.',
        heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&auto=format&fit=crop&q=80',
        followers: '1.1M+',
        activeEvents: [
            { id: 16, title: 'Aerial yoga workshop for beginners', date: 'Sun, 23 Feb Onwards', location: 'Health Club, Pondicherry', interested: '105+ Interested', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=60' },
            { id: 17, title: 'ISSP Module 1: Principles and Concepts of Therapeutic Music & Sound Work', date: 'Mon, 09 Mar, 2026 - 09:30 AM', location: 'Kottakarai, Irumbai B.O, Auroville', interested: '50+ Interested', image: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?w=400&q=60' },
            { id: 18, title: '8 days pilgrimage tour and yoga retreat', date: 'Tue, 24 Feb Onwards', location: 'Thavathiru Yoga, Pondicherry', interested: 'New', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=60' },
        ],
        nearbyEvents: [
            { id: 19, title: 'Vipassana Meditation Intro Session', date: 'Wed, 18 Mar • 07:00 AM', location: 'Auroville Global Retreat Center', interested: '250+ Interested', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=60' },
        ],
        trendingEvents: [
            { id: 20, title: 'Sunrise Beach Meditation Walk', date: 'Sun, 01 Mar Onwards', location: 'Serenity Beach, Pondicherry', interested: '400+ Interested', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=60' },
        ]
    },
    'theatre': {
        title: 'Theatre Events',
        description: 'Attending a theatre workshop could be tremendous fun and an absolute stress buster. Be it improv, musicals, open mics, screening or performing arts in the local theatres.',
        heroImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&auto=format&fit=crop&q=80',
        followers: '820.4k+',
        activeEvents: [
            { id: 21, title: 'English Play: "A Midsummer Night\'s Dream"', date: 'Fri, 20 Mar, 2026 - 07:00 PM', location: 'Jawaharlal Nehru Auditorium', interested: '350+ Interested', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=60' },
            { id: 22, title: 'Regional Tamil Modern Drama Showcase', date: 'Sat, 21 Mar, 2026 - 05:00 PM', location: 'Puducherry Art Academy', interested: '180+ Interested', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=60' },
        ],
        nearbyEvents: [
            { id: 23, title: 'Auroville Theater Experimental Showcase', date: 'Sun, 22 Mar • 06:00 PM', location: 'Auroville Main Stage', interested: '120+ Interested', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=60' },
        ],
        trendingEvents: [
            { id: 24, title: 'Improv Comedy Night: French Connection', date: 'Wed, 25 Mar Onwards', location: 'Café Des Arts, White Town', interested: '90+ Interested', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=60' },
        ]
    },
    'adventure': {
        title: 'Adventure Events',
        description: 'Unleash your wild side with adrenaline-pumping adventure sports and outdoor activities around Pondicherry. Experience scuba diving, surfing, kayaking and more.',
        heroImage: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1600&auto=format&fit=crop&q=80',
        followers: '450.2k+',
        activeEvents: [
            { id: 25, title: 'PADI Scuba Diving Open Water Certification', date: 'Sat, 07 Mar, 2026 - 06:00 AM', location: 'Temple Adventures Dive Center', interested: '75+ Interested', image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&q=60' },
            { id: 26, title: 'Surfing Lessons for Beginners', date: 'Sun, 08 Mar, 2026 - 08:00 AM', location: 'Kallialay Surf School, Serenity Beach', interested: '230+ Interested', image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&q=60' },
            { id: 27, title: 'Mangrove Kayaking Expedition', date: 'Tue, 10 Mar, 2026 - 04:00 PM', location: 'Pichavaram Mangrove Forest', interested: '110+ Interested', image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&q=60' },
        ],
        nearbyEvents: [
            { id: 28, title: 'Rock Climbing at Auroville Forest', date: 'Sat, 14 Mar • 07:00 AM', location: 'Auroville Boulders', interested: '40+ Interested', image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&q=60' },
        ],
        trendingEvents: [
            { id: 29, title: 'Sunset Paddleboarding Tour', date: 'Fri, 13 Mar Onwards', location: 'Chunnambar Boat House', interested: '300+ Interested', image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&q=60' },
        ]
    }
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    // Await params per Next.js 15 guidelines
    const resolvedParams = use(params);
    const categoryId = resolvedParams.category;

    // Fallback to a default structure if the category isn't mocked (e.g., Adventure)
    const data = CATEGORY_DATA[categoryId] || {
        title: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Events`,
        description: `Everything you need to know about ${categoryId} in Pondicherry.`,
        heroImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80',
        followers: '100k+',
        activeEvents: [],
        nearbyEvents: [],
        trendingEvents: []
    };

    const capitalizedCatName = data.title.replace(' Events', '');

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
            {/* Hero Section */}
            <CategoryHero
                title={data.title}
                description={data.description}
                imageSrc={data.heroImage}
                followersCount={data.followers}
            />

            {/* Filters */}
            <EventFilters activeCategory={capitalizedCatName} />

            {/* Main Content Area */}
            <div className="container max-w-[1280px] mx-auto px-4 mt-8 space-y-16">

                {/* Active Events List */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {capitalizedCatName} events in <span className="underline decoration-2 underline-offset-4 decoration-current">Pondicherry</span>
                    </h2>

                    {data.activeEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.activeEvents.map((evt: any) => (
                                <EventCard key={evt.id} title={evt.title} date={evt.date} location={evt.location} interested={evt.interested} imageSrc={evt.image} />
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
