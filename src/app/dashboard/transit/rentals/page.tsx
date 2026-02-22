'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Loader2, Star, ArrowUpRight, Filter, Sparkles, Car, Bike, Zap, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';

const VEHICLE_CATEGORIES = [
    { id: 'All', label: 'All Vehicles', icon: LayoutGrid },
    { id: 'Bike', label: 'Bikes', icon: Zap },
    { id: 'Scooty', label: 'Scooters', icon: Zap },
    { id: 'Car', label: 'Cars', icon: Car },
    { id: 'Cycle', label: 'Cycles', icon: Bike },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.3 } }
};

export default function RentalsPage({ embedded = false }: { embedded?: boolean }) {
    const [providers, setProviders] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('rentals');
                setProviders(data);
                setError(null);
            } catch (err: unknown) {
                console.error("Failed to load rentals:", err);
                setError("Failed to load rentals. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredProviders = filter === 'All'
        ? providers
        : providers.filter(p => p.subCategory === filter);

    return (
        <div className={embedded ? "space-y-6" : "container mx-auto py-8 px-4 max-w-6xl space-y-8"}>
            {!embedded && (
                <DashboardHeader
                    title="Vehicle Rentals"
                    subtitle="Self-drive bikes, scooters & cars"
                    backHref="/dashboard/transit"
                    backLabel="Transit"
                />
            )}

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-8 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Self Drive</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Explore at Your Own Pace
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
                        Rent a vehicle and discover Puducherry's hidden gems on your schedule.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    <Filter className="w-3.5 h-3.5" />
                    <span>{filteredProviders.length} options</span>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {VEHICLE_CATEGORIES.map((type) => {
                    const Icon = type.icon;
                    return (
                        <motion.button
                            key={type.id}
                            onClick={() => setFilter(type.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border
                                ${filter === type.id
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {type.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                            <Loader2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 animate-spin" />
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium">Loading rentals...</p>
                </div>
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200/50 dark:border-red-800/30"
                >
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                </motion.div>
            ) : filteredProviders.length > 0 ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                >
                    {filteredProviders.map((provider) => (
                        <motion.div
                            key={provider.id}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => window.location.href = `/dashboard/transit/rentals/${provider.id}`}
                        >
                            <div className="flex flex-col sm:flex-row h-full">
                                {/* Image Section */}
                                <div className="w-full sm:w-40 h-40 sm:h-auto relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                    {provider.image ? (
                                        <Image
                                            src={provider.image}
                                            alt={provider.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300 dark:text-slate-600">
                                            {provider.subCategory === 'Car' ? <Car className="w-12 h-12" /> : <Zap className="w-12 h-12" />}
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-slate-900 dark:text-white text-[10px] font-bold px-2 py-1 rounded">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        {provider.rating}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div>
                                            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                {provider.name}
                                            </h3>
                                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mt-1 gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span className="line-clamp-1">{provider.location}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-200">
                                            {provider.subCategory}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Starts at</p>
                                            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg leading-none">
                                                {provider.price}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {provider.contact && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 rounded-lg border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-xs font-semibold"
                                                    asChild
                                                >
                                                    <a href={`tel:${provider.contact}`}>
                                                        <Phone className="w-3 h-3 mr-1.5" /> Call
                                                    </a>
                                                </Button>
                                            )}
                                            {provider.bookingUrl && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 text-xs font-semibold shadow-md"
                                                    asChild
                                                >
                                                    <a href={provider.bookingUrl} target="_blank" rel="noopener noreferrer">
                                                        <ArrowUpRight className="w-3 h-3 mr-1.5" /> Book
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700"
                >
                    <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No rentals found</p>
                </motion.div>
            )}
        </div>
    );
}
