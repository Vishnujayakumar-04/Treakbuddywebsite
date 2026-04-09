'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GeneratedTrip, TripSlot } from '@/types/planner';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Wallet, ArrowLeft, Sun, Moon, Coffee, Sparkles, Navigation, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogClose } from '@/components/ui/dialog';

const SLOT_CONFIG = {
  hotel_checkin: {
    icon: "🏨",
    label: "Hotel Check-In",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    badgeColor: "bg-blue-100"
  },
  sunrise: {
    icon: "🌅",
    label: "Sunrise",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    badgeColor: "bg-orange-100"
  },
  breakfast: {
    icon: "☕",
    label: "Breakfast",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    badgeColor: "bg-yellow-100"
  },
  place: {
    icon: "📍",
    label: "Place",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
    badgeColor: "bg-gray-100"
  },
  lunch: {
    icon: "🍛",
    label: "Lunch",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    badgeColor: "bg-green-100"
  },
  snack: {
    icon: "🥐",
    label: "Evening Snack",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    badgeColor: "bg-amber-100"
  },
  sunset: {
    icon: "🌇",
    label: "Sunset",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    badgeColor: "bg-rose-100"
  },
  dinner: {
    icon: "🍽️",
    label: "Dinner",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    badgeColor: "bg-purple-100"
  },
  night_activity: {
    icon: "🌙",
    label: "Night Activity",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
    badgeColor: "bg-indigo-100"
  },
  hotel_return: {
    icon: "🛌",
    label: "Return to Stay",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-700",
    badgeColor: "bg-slate-100"
  }
} as const;
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
    const [selectedActivity, setSelectedActivity] = useState<TripSlot | null>(null);
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
                void 0; // console.("Error fetching trip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleActivityClick = (activity: TripSlot) => {
        setSelectedActivity(activity);
        setIsModalOpen(true);
    };

    // Fuzzy matching logic to find the rich place details from our massive dataset
    const matchedPlaceData = useMemo<Place | null>(() => {
        if (!selectedActivity) return null;
        
        const target = selectedActivity.title.toLowerCase().trim();
        const found = PLACES_DATA.find(p => {
            const name = p.name.toLowerCase().trim();
            return name === target || target.includes(name) || name.includes(target);
        });
        
        return found || null;
    }, [selectedActivity]);

    // Resolve the first destination image for the Hero background
    const heroBackgroundImage = useMemo(() => {
        if (!trip || !trip.itinerary || !trip.itinerary[0]?.slots) return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&q=80';
        
        // Find the first valid activity placeName
        const firstPlace = trip.itinerary[0].slots[0]?.title.toLowerCase().trim();
        const found = PLACES_DATA.find(p => {
            const n = p.name.toLowerCase().trim();
            return n === firstPlace || firstPlace.includes(n);
        });
        
        return found?.image || trip.image || 'https://images.unsplash.com/photo-1580519542036-ed47f3ae3c9d?w=1600&q=80';
    }, [trip]);

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
                    <div className="h-48 md:h-64 bg-slate-900 relative">
                        {/* Dynamic Image Header instead of TRIP text */}
                        <div 
                           className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                           style={{ backgroundImage: `url(${heroBackgroundImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
                            <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-none shadow-sm">
                                <Calendar className="w-3 h-3 mr-1" /> {trip.startDate?.split('T')[0]} - {trip.endDate?.split('T')[0]}
                            </Badge>
                            <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-none shadow-sm">
                                <Wallet className="w-3 h-3 mr-1" /> ₹{trip.budgetAmount} Budget
                            </Badge>
                            <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-none shadow-sm">
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
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                        Day {day.dayNumber} 
                                        <span className="bg-slate-200/50 dark:bg-slate-800 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded text-slate-500">Plan</span>
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">Mapped on {day.date}</p>
                                </div>
                                <div className="text-xs font-bold px-3 py-1.5 bg-white dark:bg-slate-800 shadow-sm rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                    {day.estimatedCommute} Estimated Commute
                                </div>
                            </div>

                            {/* Activities Timeline */}
                            <div className="p-4 sm:p-6 ml-2 sm:ml-4">
                                {(day.slots || []).map((slot) => {
                                  const config = SLOT_CONFIG[slot.type] ?? SLOT_CONFIG["place"];
                                  return (
                                    <div
                                      key={slot.slotNumber}
                                      onClick={() => handleActivityClick(slot)}
                                      className={`rounded-xl border p-4 mb-3 ${config.bgColor} ${config.borderColor} cursor-pointer hover:shadow-md transition-shadow`}
                                    >
                                      {/* Header row */}
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xl">{config.icon}</span>
                                          <div>
                                            <span className={`text-xs font-semibold uppercase tracking-wide ${config.textColor}`}>
                                              {config.label}
                                            </span>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-900 text-sm leading-tight">
                                              {slot.title}
                                            </h4>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.badgeColor} ${config.textColor}`}>
                                            {slot.startTime} – {slot.endTime}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Location */}
                                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <span>📌</span> {slot.location}
                                      </p>

                                      {/* Description */}
                                      <p className="text-sm text-gray-700 block mb-2 line-clamp-2 pr-2">{slot.description}</p>

                                      {/* Tip */}
                                      {slot.tip && (
                                        <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2 flex items-start gap-1">
                                          <span>💡</span> {slot.tip}
                                        </p>
                                      )}

                                      {/* Travel to next */}
                                      {slot.travelToNext && (
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                          <span>🚶</span> {slot.travelToNext}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}

                                {(!day.slots || day.slots.length === 0) && (
                                    <div className="text-center py-8 text-slate-400 italic">
                                        Free day for leisure and exploration.
                                    </div>
                                )}
                            </div>

                            {/* Daily Note Footer */}
                            {day.daySummary && (
                                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                                    <Coffee className="w-3.5 h-3.5 shrink-0" />
                                    {day.daySummary}
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
                                    {selectedActivity?.title}
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
                                    {selectedActivity.startTime} - {selectedActivity.endTime}
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Commute To Next</div>
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Navigation className="w-4 h-4 text-emerald-500" />
                                    {selectedActivity.travelToNext || 'N/A'}
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
                            {selectedActivity?.tip && (
                            <div className="mt-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30 text-cyan-800 dark:text-cyan-300 text-sm font-medium">
                                <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Planner Tip</span>
                                {selectedActivity.tip}
                            </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
