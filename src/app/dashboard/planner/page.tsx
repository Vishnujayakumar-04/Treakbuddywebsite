'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Trash, ArrowRight, Sparkles, Route, Clock, Heart, Navigation } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuthContext } from '@/context/AuthContext';

import { TripWizard } from '@/components/planner/TripWizard';
import { TripDraft, GeneratedTrip } from '@/types/planner';

const SAVED_PLACES_KEY = 'trekbuddy_saved_places';

interface SavedPlace {
    id: string;
    name: string;
    category: string;
    location: string;
    image: string;
    addedAt: string;
}

const TRIP_COLORS = [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-700',
];

function TripSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 animate-pulse" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                        <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                        <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                        <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function TripPlannerPage() {
    const { user } = useAuthContext();
    const [trips, setTrips] = useState<GeneratedTrip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

    // Load saved places from localStorage
    useEffect(() => {
        try {
            const data = localStorage.getItem(SAVED_PLACES_KEY);
            if (data) setSavedPlaces(JSON.parse(data));
        } catch { /* ignore */ }
    }, []);

    const handleRemoveSavedPlace = (placeId: string) => {
        const updated = savedPlaces.filter(p => p.id !== placeId);
        setSavedPlaces(updated);
        localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
        toast.success('Place removed from your trip');
    };

    useEffect(() => {
        if (!user || !db) {
            setIsLoading(false);
            return;
        }

        const q = query(
            collection(db, 'trips'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tripData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GeneratedTrip[];

            // Sort client-side to avoid Firestore index requirement issues
            // Sort by createdAt desc
            const sortedTrips = tripData.sort((a, b) => {
                const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date();
                const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date();
                return dateB.getTime() - dateA.getTime();
            });

            setTrips(sortedTrips);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching trips:", error);
            // If index error, show specific message? No, just fallback safe.
            toast.error("Could not load trips. Please check console.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);


    const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this trip?')) return;
        if (db) {
            await deleteDoc(doc(db, 'trips', id));
            toast.success('Trip deleted');
        }
    };

    return (
        <div className="min-h-screen pb-24 relative overflow-hidden">
            {/* Immersive gradient background */}
            <div className="fixed inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            {/* Decorative orbs */}
            <div className="fixed top-20 right-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl -z-10" />
            <div className="fixed bottom-20 left-10 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl -z-10" />

            {/* Header Section */}
            <div className="container px-4 md:px-6 max-w-6xl mx-auto pt-8 pb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-3"
                    >
                        <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                            <Route className="w-3 h-3 mr-1.5" />
                            AI-Powered Planning
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            Plan Your
                            <br />
                            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Perfect Trip
                            </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg leading-relaxed">
                            Design your Puducherry getaway with AI — personalized itineraries in seconds.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all text-base font-bold">
                                    <Plus className="w-5 h-5 mr-2" />
                                    New Trip
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-none shadow-2xl p-6 rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Plan Your Adventure</DialogTitle>
                                    <DialogDescription className="text-slate-500 text-base">
                                        Tell us your preferences, and we'll craft the perfect itinerary.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 h-[600px] w-full">
                                    <TripWizard onCancel={() => setIsCreateOpen(false)} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </motion.div>
                </div>
            </div>

            {/* Saved Places Section */}
            {savedPlaces.length > 0 && (
                <div className="container px-4 md:px-6 max-w-6xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20">
                                    <Heart className="w-5 h-5 fill-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Saved Places</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{savedPlaces.length} place{savedPlaces.length !== 1 ? 's' : ''} added to your trip</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {savedPlaces.map((place, index) => (
                                <motion.div
                                    key={place.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative"
                                >
                                    <Link href={`/dashboard/places/${place.id}`}>
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
                                            <div className="relative h-40 overflow-hidden">
                                                <Image
                                                    src={place.image}
                                                    alt={place.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white border-white/10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                                                    {place.category}
                                                </Badge>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-cyan-600 transition-colors truncate">{place.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{place.location}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                    {/* Remove button */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleRemoveSavedPlace(place.id); }}
                                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                                        title="Remove from trip"
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Content Section */}
            <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <TripSkeleton />
                        </motion.div>
                    ) : trips.length > 0 ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {trips.map((trip, index) => (
                                <Link key={trip.id} href={`/dashboard/planner/${trip.id}`} className="block group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08, type: 'spring', bounce: 0.25 }}
                                        whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                        className="relative h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
                                    >
                                        {/* Gradient background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${TRIP_COLORS[index % TRIP_COLORS.length]} opacity-90`} />

                                        {/* Pattern overlay */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)]" />

                                        {/* Delete button */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all z-10">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/15 rounded-xl backdrop-blur-sm"
                                                onClick={(e) => handleDeleteTrip(trip.id, e)}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className="bg-white/15 backdrop-blur-sm text-white border-white/10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                                    {trip.status === 'draft' ? 'Draft' : 'Planned'}
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold text-xl tracking-tight mb-2 leading-tight">
                                                {trip.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 text-xs text-white/80 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {trip.type}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-3 h-3" />
                                                    {trip.places || 0} Places
                                                </span>
                                            </div>

                                            {/* Arrow CTA */}
                                            <div className="absolute bottom-5 right-5 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                                                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center py-28 px-4 text-center max-w-lg mx-auto"
                        >
                            <div className="relative mb-8">
                                <div className="w-28 h-28 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-3xl flex items-center justify-center shadow-xl shadow-cyan-500/10 rotate-3 group hover:rotate-0 transition-transform duration-500">
                                    <Sparkles className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg -rotate-12">
                                    <MapPin className="w-5 h-5" />
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                                No trips yet
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">
                                Your adventure dashboard is empty. Let AI craft your perfect Puducherry itinerary.
                            </p>
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-10 h-14 text-lg font-bold shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Start Planning
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
