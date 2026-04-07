'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, MapPin, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPlacesByCategory } from '@/services/data/places';
import Image from 'next/image';
import { PONDICHERRY_AREAS } from '@/constants/areas';

const CATEGORY_HEROES: Record<string, string> = {
    beaches: "/assets/beaches/promenade-beach/photo-1.jpg",
    heritage: "/assets/heritage/white-town-tales/photo-1.jpg",
    museums: "/assets/heritage/puducherry-museum/photo-1.jpg",
    spiritual: "/assets/temples-spiritual/sri-aurobindo-ashram/photo-1.jpg",
    temples: "/assets/temples-spiritual/manakula-vinayagar-temple/photo-1.jpg",
    churches: "/assets/temples-spiritual/sacred-heart-basilica/photo-1.jpg",
    mosques: "/assets/temples-spiritual/muthialpet-mosque/photo-1.jpg",
    hotels: "/assets/hotels-stays/villa-shanti/photo-1.jpg",
    restaurants: "/assets/food-dining/le-cafe/photo-1.jpg",
    nature: "/assets/nature/pichavaram-mangroves/photo-1.jpg",
    parks: "/assets/nature/botanical-gardens/photo-1.jpg",
    adventure: "/assets/adventures/surfing-lessons/photo-1.jpg",
    shopping: "/assets/shopping/sunday-market/photo-1.jpg",
    default: "/assets/beaches/promenade-beach/photo-1.jpg"
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    beaches: "Discover Puducherry's pristine coastline — from golden sunrise views to thrilling water sports.",
    heritage: "Walk through centuries of French colonial architecture and Tamil cultural heritage.",
    temples: "Experience divine blessings at ancient Hindu temples with rich spiritual heritage and sacred rituals.",
    churches: "Marvel at stunning Gothic and colonial architecture in historic churches and cathedrals.",
    mosques: "Visit peaceful Islamic prayer halls and mosques reflecting Puducherry's diverse religious heritage.",
    spiritual: "Find peace at sacred ashrams and meditation centers for inner reflection and spiritual growth.",
    hotels: "Stay in charming heritage hotels, luxury resorts, or budget-friendly accommodations across Puducherry.",
    restaurants: "Savor the unique fusion of French, Tamil, and coastal cuisines at Pondy's finest spots.",
    nature: "Explore lush mangroves, serene lakes, and tropical botanical gardens.",
    adventure: "Dive deep, ride the waves, and paddle through Puducherry's best adventure spots.",
    shopping: "Browse French-inspired boutiques, artisan handicraft shops, and vibrant local markets.",
};

const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const cardVars = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.25, duration: 0.5 } }
};

interface CategoryClientProps {
    id: string;
}

export default function CategoryClient({ id }: CategoryClientProps) {
    const categoryName = id.charAt(0).toUpperCase() + id.slice(1);
    const heroImage = CATEGORY_HEROES[id] || CATEGORY_HEROES.default;
    const description = CATEGORY_DESCRIPTIONS[id] || `Explore the best ${id} in Puducherry tailored for you.`;

    const allPlaces = useMemo(() => getPlacesByCategory(id), [id]);

    // Special handling for spiritual category - show religion filters
    const religionFilters = ['All', 'Hindu Temples', 'Churches', 'Mosques', 'Ashrams'];

    const allTags = useMemo(() => {
        if (id === 'spiritual') {
            return religionFilters;
        }
        const tags = new Set<string>();
        allPlaces.forEach(p => p.tags.forEach(t => tags.add(t)));
        return ['All', ...Array.from(tags)];
    }, [allPlaces, id]);

    const [activeFilter, setActiveFilter] = useState('All');
    const [activeArea, setActiveArea] = useState('All');

    const availableAreas = useMemo(() => {
        const matching = PONDICHERRY_AREAS.filter(area =>
            allPlaces.some(p => p.location.toLowerCase().includes(area.toLowerCase()))
        );
        return ['All', ...matching];
    }, [allPlaces]);

    const filteredPlaces = useMemo(() => {
        let result = allPlaces;

        // Base tag filtering
        if (activeFilter !== 'All') {
            if (id === 'spiritual') {
                switch (activeFilter) {
                    case 'Hindu Temples':
                        result = result.filter(p => p.category === 'temples');
                        break;
                    case 'Churches':
                        result = result.filter(p => p.category === 'churches');
                        break;
                    case 'Mosques':
                        result = result.filter(p => p.category === 'mosques');
                        break;
                    case 'Ashrams':
                        result = result.filter(p => p.category === 'spiritual');
                        break;
                }
            } else {
                result = result.filter(p => p.tags.includes(activeFilter));
            }
        }

        // Area filtering
        if (activeArea !== 'All') {
            result = result.filter(p =>
                p.location.toLowerCase().includes(activeArea.toLowerCase())
            );
        }

        return result;
    }, [allPlaces, activeFilter, activeArea, id]);

    return (
        <div className="min-h-screen pb-20">
            {/* Immersive Hero with Image Marquee */}
            <div className="relative h-[45vh] min-h-[320px] md:h-[50vh] w-full overflow-hidden -mt-16">
                {/* Animated Image Marquee Background */}
                <div className="absolute inset-0 flex gap-4">
                    {/* First set of images */}
                    <motion.div
                        className="flex gap-4 shrink-0"
                        animate={{
                            x: [0, -1920]
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear"
                            }
                        }}
                    >
                        {allPlaces.slice(0, 8).map((place, idx) => (
                            <div key={`img-1-${idx}`} className="relative w-[400px] h-full shrink-0">
                                <Image
                                    src={place.image}
                                    alt={place.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </motion.div>
                    {/* Duplicate set for seamless loop */}
                    <motion.div
                        className="flex gap-4 shrink-0"
                        animate={{
                            x: [0, -1920]
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear"
                            }
                        }}
                    >
                        {allPlaces.slice(0, 8).map((place, idx) => (
                            <div key={`img-2-${idx}`} className="relative w-[400px] h-full shrink-0">
                                <Image
                                    src={place.image}
                                    alt={place.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Multi-layer overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-50 dark:to-slate-950" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

                {/* Back button */}
                <div className="absolute top-20 left-4 md:left-8 z-20">
                    <Button variant="secondary" size="sm" asChild className="rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-xl border-white/10 shadow-lg px-5 font-semibold">
                        <Link href="/dashboard/categories">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Link>
                    </Button>
                </div>

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 pb-16 z-20 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-3"
                    >
                        <Badge className="bg-white/15 backdrop-blur-xl text-white border-white/20 px-4 py-1.5 font-semibold rounded-full text-sm">
                            <Sparkles className="w-3.5 h-3.5 mr-2" />
                            {allPlaces.length} Places to Explore
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
                            {categoryName}
                        </h1>
                        <p className="text-white/75 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container px-4 md:px-6 max-w-7xl mx-auto space-y-8 -mt-4 relative z-30">
                {/* Advanced Premium Filter Control Center */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-3xl shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 flex flex-col gap-6 relative overflow-hidden"
                >
                    {/* Decorative Background Blobs inside filter */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Filter Group: TYPE */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 relative z-10">
                        <div className="flex items-center gap-3 md:w-32 shrink-0">
                            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shadow-inner">
                                <Filter className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <span className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">Type</span>
                        </div>
                        <div className="flex overflow-x-auto items-center gap-2.5 pb-3 md:pb-0 scrollbar-hide w-full [mask-image:linear-gradient(to_right,white_85%,transparent)] pr-10">
                            {allTags.map((tag) => (
                                <motion.button
                                    key={tag}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveFilter(tag)}
                                    className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 overflow-hidden
                                    ${activeFilter === tag
                                            ? 'text-white shadow-xl shadow-violet-500/30 ring-2 ring-white/20'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                                        }`}
                                >
                                    {activeFilter === tag && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600" />
                                    )}
                                    <span className="relative z-10">{tag}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Separator */}
                    {availableAreas.length > 1 && (
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700/50 to-transparent relative z-10" />
                    )}

                    {/* Filter Group: AREA */}
                    {availableAreas.length > 1 && (
                        <div className="flex flex-col md:flex-row md:items-center gap-4 relative z-10">
                            <div className="flex items-center gap-3 md:w-32 shrink-0">
                                <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center shadow-inner">
                                    <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <span className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">Area</span>
                            </div>
                            <div className="flex overflow-x-auto items-center gap-2.5 pb-3 md:pb-0 scrollbar-hide w-full [mask-image:linear-gradient(to_right,white_85%,transparent)] pr-10">
                                {availableAreas.map((area) => (
                                    <motion.button
                                        key={area}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveArea(area)}
                                        className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 overflow-hidden
                                        ${activeArea === area
                                                ? 'text-white shadow-xl shadow-cyan-500/30 ring-2 ring-white/20'
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                                            }`}
                                    >
                                        {activeArea === area && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sky-500" />
                                        )}
                                        <span className="relative z-10">{area}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Places Grid — Immersive Cards */}
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPlaces.length > 0 ? (
                            filteredPlaces.map((place) => (
                                <motion.div
                                    key={place.id}
                                    variants={cardVars}
                                    layout
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Link href={`/dashboard/places/${place.id}`} className="group block h-full">
                                        <div className="relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
                                            <Image
                                                src={place.image}
                                                alt={place.name}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                unoptimized
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                                            {/* Hover shine */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Rating */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white font-bold shadow-lg rounded-lg px-2.5 py-1 text-xs">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                                                    {place.rating}
                                                </Badge>
                                            </div>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                                                <h3 className="text-xl font-bold text-white tracking-tight mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                                                    {place.name}
                                                </h3>
                                                <div className="flex items-center text-white/70 text-sm mb-3">
                                                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                                                    {place.location}
                                                </div>
                                                <p className="text-white/60 text-xs line-clamp-2 leading-relaxed mb-3">
                                                    {place.description}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {place.tags.slice(0, 3).map(t => (
                                                        <span key={t} className="text-[9px] uppercase font-bold px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/80 rounded-md tracking-wider">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Explore CTA — slides in on hover */}
                                                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300 mt-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    <span>View Details</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-24 text-center"
                            >
                                <Filter className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                                <p className="text-slate-500 text-lg font-medium">No places found for this filter.</p>
                                <Button variant="link" onClick={() => { setActiveFilter('All'); setActiveArea('All'); }} className="text-cyan-600 font-semibold mt-2">
                                    Clear Filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
