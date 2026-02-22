'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Umbrella, TreePine, MapPin,
    Utensils, ShoppingBag, Bus,
    ArrowRight, Search, Sparkles, Compass
} from 'lucide-react';

const CATEGORY_IMAGES: Record<string, string> = {
    beaches: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', // Tropical beach
    heritage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', // Colonial building
    temples: 'https://images.unsplash.com/photo-1582510003544-5243789972d0?w=800&auto=format&fit=crop&q=80', // Indian temple
    churches: 'https://images.unsplash.com/photo-1548625361-987747e70e3c?w=800&auto=format&fit=crop&q=80', // Gothic church
    mosques: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=800&auto=format&fit=crop&q=80', // Mosque
    spiritual: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&auto=format&fit=crop&q=80', // Meditation/Ashram
    restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', // Restaurant interior
    nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80', // Lush green nature
    adventure: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80', // Underwater scuba
    shopping: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80', // Market shopping
    hotels: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', // Hotel pool
    nightlife: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80', // Bar/nightlife
};

const MARQUEE_IMAGES = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', // Promenade Beach
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', // French Colony
    'https://images.unsplash.com/photo-1582510003544-5243789972d0?w=800&auto=format&fit=crop&q=80', // Temple
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&auto=format&fit=crop&q=80', // Ashram
    'https://images.unsplash.com/photo-1623083984360-15bd8434cc85?w=800&auto=format&fit=crop&q=80', // Matrimandir
    'https://images.unsplash.com/photo-1548625361-987747e70e3c?w=800&auto=format&fit=crop&q=80', // Basilica
];


export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const categories = [
        { id: 'beaches', name: 'Beaches', icon: Umbrella, desc: 'Sun-kissed shores & sunrise walks', emoji: '🏖️', count: '8 spots' },
        { id: 'heritage', name: 'Heritage', icon: '🏰', desc: 'French Quarter & colonial charm', emoji: '🏛️', count: '12 spots' },
        { id: 'spiritual', name: 'Temples & Spiritual', icon: '🛕', desc: 'Hindu temples, churches, mosques & ashrams', emoji: '🕉️', count: '17 places' },
        { id: 'hotels', name: 'Hotels & Stays', icon: '🏨', desc: 'Boutique hotels, resorts & PG accommodations', emoji: '🏨', count: '15 places' },
        { id: 'restaurants', name: 'Food & Dining', icon: Utensils, desc: 'Cafes, French cuisine & street food', emoji: '🍽️', count: '15 spots' },
        { id: 'nature', name: 'Nature', icon: TreePine, desc: 'Mangroves, lakes & botanical gardens', emoji: '🌿', count: '5 spots' },
        { id: 'theatre', name: 'Theatre & Performing Arts', icon: '🎭', desc: 'Local plays, shows & classical dance', emoji: '🎭', count: '4 spots' },
        { id: 'adventure', name: 'Adventure', icon: MapPin, desc: 'Scuba, surfing & kayaking', emoji: '🏄', count: '7 spots' },
        { id: 'shopping', name: 'Shopping', icon: ShoppingBag, desc: 'Boutiques, handicrafts & markets', emoji: '🛍️', count: '9 spots' },
        { id: 'nightlife', name: 'Nightlife & Pubs', icon: '🍸', desc: 'Vibrant clubs & seaside lounges', emoji: '🥂', count: '5+ spots' },
    ];

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-20 relative bg-slate-50 dark:bg-slate-950">
            {/* Immersive Marquee Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                {/* Scrolling Background Marquee */}
                <div className="absolute inset-0 flex items-center overflow-hidden bg-slate-900">
                    <motion.div
                        key="marquee-v2" // Force remount
                        className="flex gap-0 min-w-full"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                    >
                        {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((img, idx) => (
                            <div key={idx} className="relative w-[600px] h-[60vh] shrink-0 opacity-60">
                                <Image
                                    src={img}
                                    alt="Puducherry Scenery"
                                    fill
                                    className="object-cover"
                                    priority={idx < 4}
                                    unoptimized
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Multi-layer gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-900/40 to-slate-900/60" />

                {/* Hero Content - Reverted Positioning */}
                <div className="absolute inset-0 flex flex-col justify-end pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-4 text-left"
                    >
                        <Badge className="bg-white/15 backdrop-blur-xl text-white border-white/20 px-4 py-1.5 text-sm font-semibold rounded-full w-fit">
                            <Sparkles className="w-3.5 h-3.5 mr-2" />
                            Puducherry Travel Guide
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] drop-shadow-xl">
                            Discover<br />
                            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                Puducherry
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-lg font-medium leading-relaxed drop-shadow-md">
                            Curated experiences across beaches, heritage, cuisine & more.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container px-4 md:px-6 max-w-7xl mx-auto space-y-12 -mt-8 relative z-10">
                {/* Search Bar — Floating Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-xl mx-auto"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-xl opacity-70 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-full shadow-2xl shadow-slate-900/10 overflow-hidden h-16">
                            <Search className="h-6 w-6 text-slate-400 ml-6 shrink-0" />
                            <Input
                                type="text"
                                placeholder="Search beaches, food, adventure..."
                                className="border-0 h-full text-lg pl-4 pr-6 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-slate-800 dark:text-slate-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-slate-400 hover:text-slate-600 pr-6 text-sm font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Section Label */}
                <div className="flex items-center gap-4 justify-center">
                    <div className="h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800 w-20" />
                    <div className="flex items-center gap-2 text-slate-400 uppercase tracking-[0.2em] text-xs font-bold">
                        <Compass className="w-4 h-4 text-cyan-500" />
                        Browse by Experience
                    </div>
                    <div className="h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800 w-20" />
                </div>

                {/* Category Grid — Enhanced Cards */}
                {filteredCategories.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredCategories.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <Link
                                    href={cat.id === 'transport' ? '/dashboard/transit' : `/dashboard/categories/${cat.id}`}
                                    className="group block h-full"
                                    onMouseEnter={() => setHoveredCard(cat.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className="relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 bg-slate-900 border border-slate-200/10 dark:border-slate-800">
                                        {/* Background Image */}
                                        <Image
                                            src={CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES.beaches}
                                            alt={cat.name}
                                            fill
                                            className={`object-cover transition-transform duration-1000 ease-in-out ${hoveredCard === cat.id ? 'scale-110' : 'scale-100 opacity-90'}`}
                                            unoptimized
                                        />

                                        {/* Gradient Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                                        <div className={`absolute inset-0 bg-cyan-900/30 mix-blend-overlay transition-opacity duration-500 ${hoveredCard === cat.id ? 'opacity-100' : 'opacity-0'}`} />

                                        {/* Top badge */}
                                        <div className="absolute top-5 right-5 z-20">
                                            <Badge className="bg-black/30 backdrop-blur-md text-white border-white/10 font-bold px-3 py-1 rounded-full text-xs">
                                                {cat.count}
                                            </Badge>
                                        </div>

                                        {/* Icon Floating */}
                                        <div className="absolute top-6 left-6 z-20 text-4xl transform group-hover:-rotate-12 transition-transform duration-300 drop-shadow-lg">
                                            {cat.emoji}
                                        </div>

                                        {/* Bottom content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-2xl font-black text-white mb-2 leading-none">
                                                {cat.name}
                                            </h3>
                                            <div className="h-0.5 w-12 bg-cyan-400 mb-3 transform origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-300" />
                                            <p className="text-slate-300 text-sm font-medium leading-relaxed mb-4 line-clamp-2 group-hover:text-white transition-colors">
                                                {cat.desc}
                                            </p>

                                            <div className={`flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-widest ${hoveredCard === cat.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-300`}>
                                                Explore Now <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
                        <p className="text-slate-500 mb-6">We couldn&apos;t find any categories matching &quot;{searchQuery}&quot;</p>
                        <Button
                            onClick={() => setSearchQuery('')}
                            className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8"
                        >
                            Clear Search
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
