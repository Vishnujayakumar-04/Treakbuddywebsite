'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GeneratedTrip, DayActivity } from '@/types/planner';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Wallet, ArrowLeft, Sun, Moon, Coffee, Sparkles, Navigation, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogClose } from '@/components/ui/dialog';

// Data Lookup
import { PLACES_DATA, Place } from '@/services/data/places';

interface TripClientProps {
    id: string;
}

export default function TripClient({ id }: TripClientProps) {
    const router = useRouter();
    const [trip, setTrip] = useState<GeneratedTrip | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedActivity, setSelectedActivity] = useState<DayActivity | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTrip = async () => {
            if (!db) return;
            try {
                const docRef = doc(db, 'trips', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTrip({ id: docSnap.id, ...docSnap.data() } as GeneratedTrip);
                }
            } catch (error) {
                console.error("Error fetching trip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleActivityClick = (activity: DayActivity) => {
        setSelectedActivity(activity);
        setIsModalOpen(true);
    };

    // Fuzzy matching logic to find the rich place details from our massive dataset
    const matchedPlaceData = useMemo<Place | null>(() => {
        if (!selectedActivity) return null;
        
        const target = selectedActivity.placeName.toLowerCase().trim();
        const found = PLACES_DATA.find(p => {
            const name = p.name.toLowerCase().trim();
            return name === target || target.includes(name) || name.includes(target);
        });
        
        return found || null;
    }, [selectedActivity]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
        </div>;
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
                <h2 className="text-xl font-bold">Trip not found</h2>
                <Button onClick={() => router.push('/dashboard/planner')}>Back to Planner</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <DashboardHeader
                title={trip.name}
                subtitle={`${trip.itinerary?.length || 0} Days • ${trip.travelers} Travelers • ${trip.type}`}
                showHome={false}
                backHref="/dashboard/planner"
            />

            <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-8 mt-4">
                {/* Trip Overview Card */}
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="h-48 bg-slate-900 relative">
                        {/* Placeholder for dynamic image */}
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 text-8xl md:text-9xl font-black select-none">
                            TRIP
                        </div>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-none">
                                <Calendar className="w-3 h-3 mr-1" /> {trip.startDate?.split('T')[0]} - {trip.endDate?.split('T')[0]}
                            </Badge>
                            <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-none">
                                <Wallet className="w-3 h-3 mr-1" /> ₹{trip.budgetAmount} Budget
                            </Badge>
                            <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-none">
                                <MapPin className="w-3 h-3 mr-1" /> {trip.stayArea} Stay
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Daily Itinerary */}
                <div className="space-y-8">
                    {trip.itinerary.map((day, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Day Header */}
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Day {day.dayNumber}</h3>
                                    <p className="text-sm text-slate-500">{day.date}</p>
                                </div>
                                <div className="text-xs font-medium px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                    {day.totalTravelTime} travel
                                </div>
                            </div>

                            {/* Activities Timeline */}
                            <div className="p-6">
                                <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-10">
                                    {(day.activities || []).map((activity, i) => (
                                        <li key={i} className="mb-4 ml-6 group relative">
                                            <span className={cn(
                                                "absolute flex items-center justify-center w-8 h-8 rounded-full -left-[19px] ring-4 ring-white dark:ring-slate-900 border",
                                                activity.timeSlot === 'Morning' ? "bg-amber-100 border-amber-500 text-amber-600" :
                                                    activity.timeSlot === 'Afternoon' ? "bg-orange-100 border-orange-500 text-orange-600" :
                                                        "bg-indigo-100 border-indigo-500 text-indigo-600"
                                            )}>
                                                {activity.timeSlot === 'Morning' ? <Sun className="w-4 h-4" /> :
                                                    activity.timeSlot === 'Afternoon' ? <Sun className="w-4 h-4" /> :
                                                        <Moon className="w-4 h-4" />}
                                            </span>

                                            {/* Interactive Activity Card */}
                                            <div 
                                              onClick={() => handleActivityClick(activity)}
                                              className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 cursor-pointer bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 -mx-3 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                        <span className="truncate block max-w-full">{activity.placeName}</span>
                                                        <span className="bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3 dark:bg-slate-700 dark:text-slate-300 shrink-0">
                                                            {activity.timeRange}
                                                        </span>
                                                    </h3>
                                                    <p className="block mb-2 text-sm font-normal leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 pr-2">
                                                        {activity.description}
                                                    </p>
                                                    {activity.tips && (
                                                        <div className="flex items-center gap-2 text-xs text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2.5 py-1.5 rounded w-fit mt-3 font-medium">
                                                            <Sparkles className="w-3 h-3 shrink-0" />
                                                            <span className="truncate max-w-[200px] sm:max-w-xs">{activity.tips}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg shrink-0 sm:mt-0 mt-2">
                                                    <Clock className="w-3 h-3 mr-1.5" />
                                                    {activity.travelTime}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>

                                {(!day.activities || day.activities.length === 0) && (
                                    <div className="text-center py-8 text-slate-400 italic">
                                        Free day for leisure and exploration.
                                    </div>
                                )}
                            </div>

                            {/* Daily Note Footer */}
                            {day.notes && (
                                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                                    <Coffee className="w-3.5 h-3.5 shrink-0" />
                                    {day.notes}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Rich Detailed Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-none rounded-2xl shadow-2xl">
                    <DialogHeader className="p-0">
                        <DialogTitle className="sr-only">Activity Details</DialogTitle>
                        <DialogDescription className="sr-only">Detailed view of the selected itinerary location.</DialogDescription>
                    </DialogHeader>

                    <div className="relative">
                        {/* Dynamic Image Header */}
                        {matchedPlaceData?.image ? (
                            <div className="h-48 md:h-64 w-full relative">
                                <img src={matchedPlaceData.image} alt={matchedPlaceData.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-2 text-white">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500/90 text-white backdrop-blur border-none hover:bg-emerald-600 transition-colors uppercase tracking-widest text-[10px]">
                                            {matchedPlaceData.category}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur border-none font-bold text-[10px]">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" /> {matchedPlaceData.rating}
                                        </Badge>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                                        {matchedPlaceData.name}
                                    </h2>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                    {selectedActivity?.placeName}
                                </h2>
                            </div>
                        )}

                        {/* Close Button UI Injection */}
                        <DialogClose asChild>
                            <button className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </DialogClose>
                    </div>

                    <div className="p-6 md:p-8 pt-4 md:pt-6 space-y-6">
                        
                        {/* AI Instructions block */}
                        {selectedActivity && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Time Block</div>
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    {selectedActivity.timeRange}
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Commute Time</div>
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Navigation className="w-4 h-4 text-emerald-500" />
                                    {selectedActivity.travelTime}
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Database Merge Content */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" /> 
                                    Activity Details
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {matchedPlaceData?.description || selectedActivity?.description}
                                </p>
                            </div>

                            {/* Tags block */}
                            {matchedPlaceData?.tags && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {matchedPlaceData.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                            )}

                            {/* Trip Planner Dynamic Tip */}
                            {selectedActivity?.tips && (
                            <div className="mt-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30 text-cyan-800 dark:text-cyan-300 text-sm font-medium">
                                <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Planner Tip</span>
                                {selectedActivity.tips}
                            </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
