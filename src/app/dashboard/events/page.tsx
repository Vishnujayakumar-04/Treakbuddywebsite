'use client';

import { EventsHero } from '@/components/events/EventsHero';
import { PopOutCard } from '@/components/events/PopOutCard';
import { MapPin } from 'lucide-react';

const MOST_LOVED = [
    {
        id: 'music',
        title: 'Music',
        bgColor: 'bg-[#e5f0ff] dark:bg-blue-950',
        textColor: 'text-[#1e3a8a] dark:text-blue-100',
        imageSrc: 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=400&auto=format&fit=crop&q=60',
        href: '/dashboard/events/music'
    },
    {
        id: 'concerts',
        title: 'Concerts',
        bgColor: 'bg-[#f3e8ff] dark:bg-purple-950',
        textColor: 'text-[#581c87] dark:text-purple-100',
        imageSrc: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=60',
        href: '/dashboard/events/concerts'
    },
    {
        id: 'festivals',
        title: 'Festivals',
        bgColor: 'bg-[#fce7f3] dark:bg-pink-950',
        textColor: 'text-[#831843] dark:text-pink-100',
        imageSrc: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&auto=format&fit=crop&q=60',
        href: '/dashboard/events/festivals'
    },
    {
        id: 'dance',
        title: 'Dance',
        bgColor: 'bg-[#ffe4e6] dark:bg-rose-950',
        textColor: 'text-[#881337] dark:text-rose-100',
        imageSrc: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=60',
        href: '/dashboard/events/dance'
    },
    {
        id: 'health-wellness',
        title: 'Health & Wellness',
        bgColor: 'bg-[#dcfce7] dark:bg-emerald-950',
        textColor: 'text-[#14532d] dark:text-emerald-100',
        imageSrc: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60',
        href: '/dashboard/events/health-wellness'
    },
    {
        id: 'theatre',
        title: 'Theatre',
        bgColor: 'bg-[#ffedd5] dark:bg-orange-950',
        textColor: 'text-[#7c2d12] dark:text-orange-100',
        imageSrc: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&auto=format&fit=crop&q=60',
        href: '/dashboard/events/theatre'
    },
    {
        id: 'adventure',
        title: 'Adventure',
        bgColor: 'bg-[#e0e7ff] dark:bg-indigo-950',
        textColor: 'text-[#312e81] dark:text-indigo-100',
        imageSrc: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&auto=format&fit=crop&q=60',
        href: '/dashboard/events/adventure'
    },
];

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">

            {/* Hero Section */}
            <EventsHero />

            {/* Pondicherry's Most-Loved Section */}
            <div className="container max-w-[1280px] mx-auto px-4 py-8">
                <div className="flex bg-gray-50 dark:bg-slate-900/50 w-fit px-3 py-1.5 rounded-full items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Explore By Category</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Pondicherry&apos;s Most-Loved
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    {MOST_LOVED.map((item, idx) => (
                        <PopOutCard
                            key={idx}
                            title={item.title}
                            bgColor={item.bgColor}
                            textColor={item.textColor}
                            imageSrc={item.imageSrc}
                            href={item.href || '/dashboard/categories'}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}
