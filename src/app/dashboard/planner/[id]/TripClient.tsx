'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GeneratedTrip } from '@/types/planner';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Wallet, ArrowLeft, Sun, Moon, Coffee, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TripClientProps {
    id: string;
}

export default function TripClient({ id }: TripClientProps) {
    const router = useRouter();
    const [trip, setTrip] = useState<GeneratedTrip | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            if (!db) return;
            try {
                const docRef = doc(db, 'trips', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTrip({ id: docSnap.id, ...docSnap.data() } as GeneratedTrip);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trip:", error);
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

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
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 text-9xl font-bold select-none">
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
                                        <li key={i} className="mb-4 ml-6">
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

                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                <div>
                                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                        {activity.placeName}
                                                        <span className="bg-slate-100 text-slate-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3 dark:bg-slate-700 dark:text-slate-300">
                                                            {activity.timeRange}
                                                        </span>
                                                    </h3>
                                                    <p className="block mb-2 text-sm font-normal leading-none text-slate-400 dark:text-slate-500">
                                                        {activity.description}
                                                    </p>
                                                    {activity.tips && (
                                                        <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded w-fit mt-2">
                                                            <Sparkles className="w-3 h-3" />
                                                            Tip: {activity.tips}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs text-slate-500 whitespace-nowrap bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                                    <Clock className="w-3 h-3 mr-1" />
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
                                    <Coffee className="w-3 h-3" />
                                    {day.notes}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
