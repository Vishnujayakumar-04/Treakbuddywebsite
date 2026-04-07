import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Download TrekBuddy App',
    description: 'Download the TrekBuddy app for Android and iOS. Explore Puducherry with AI-powered itineraries, real-time bus routes, and offline maps.',
    openGraph: {
        title: 'Download TrekBuddy – Your Puducherry Travel Companion',
        description: 'AI-powered itineraries, offline maps, bus routes and emergency tools. Free to download.',
        type: 'website',
        url: 'https://trekbuddy.app/download',
        images: [{ url: '/assets/heritage/aayi-mandapam/photo-1.jpg', width: 1200, height: 630, alt: 'TrekBuddy App Download' }],
    },
};

export { default } from './page';
