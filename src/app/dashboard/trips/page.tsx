'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowRight, Plus, Map } from 'lucide-react';

// Mock Data
const MOCK_TRIPS = [
    {
        id: 1,
        title: "Weekend in White Town",
        dates: "Oct 12 - Oct 14, 2024",
        status: "Completed",
        places: 8,
        image: "https://images.unsplash.com/photo-1582510003544-5243789972d0?q=80&w=400&fit=crop"
    },
    {
        id: 2,
        title: "Beach Bliss & Heritage",
        dates: "Nov 05 - Nov 08, 2024",
        status: "Upcoming",
        places: 12,
        image: "https://images.unsplash.com/photo-1543362906-ac1b4526c1d0?q=80&w=400&fit=crop"
    }
];

export default function MyTripsPage() {
    const [trips] = useState(MOCK_TRIPS);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8 pt-24">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">My Trips</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Your saved Pondicherry itineraries</p>
                    </div>
                    <Button asChild size="lg" className="rounded-full font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
                        <Link href="/dashboard/chat">
                            <Plus className="w-5 h-5 mr-2" /> Plan New Trip
                        </Link>
                    </Button>
                </div>

                {/* Content */}
                {trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip, i) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
                            >
                                {/* Image Base */}
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    {/* Placeholder Image or Real Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${trip.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <Badge variant={trip.status === 'Completed' ? 'secondary' : 'default'} className="backdrop-blur-md bg-white/20 text-white border-none font-semibold">
                                            {trip.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-5 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{trip.title}</h3>
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {trip.dates}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {trip.places} Places Saved
                                        </span>
                                        <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 font-bold -mr-2">
                                            View Details <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <MapPin className="w-10 h-10" />
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No saved trips yet</h3>
                            <p className="text-slate-500 dark:text-slate-400">Create your first AI-powered itinerary and it will appear here.</p>
                        </div>
                        <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 font-bold text-white shadow-lg shadow-orange-500/20 px-8 h-12">
                            <Link href="/">
                                <Plus className="w-4 h-4 mr-2" /> Plan Your First Trip
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
