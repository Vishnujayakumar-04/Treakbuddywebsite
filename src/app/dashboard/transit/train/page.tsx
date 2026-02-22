'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Train, Clock, MapPin, Calendar, ExternalLink, Loader2, ArrowRight, Sparkles, Navigation, CreditCard, ChevronDown, CheckCircle2, ChevronUp, Users, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';
import Link from 'next/link';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.03 } // drastically reduced stagger
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.2, duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

// Define Train Classes matching standard Indian Railways codes with display labels
const TRAIN_CLASSES = [
    { label: 'All Classes', id: 'all', matches: [] },
    { label: 'Sleeper', id: 'sleeper', matches: ['SL'] },
    { label: 'Seater', id: 'seater', matches: ['CC', '2S', 'UR'] },
    { label: 'AC', id: 'ac', matches: ['1A', '2A', '3A', '3E', 'CC'] },
    { label: 'Non AC', id: 'non-ac', matches: ['SL', '2S', 'UR'] },
    { label: '1st Class', id: '1st', matches: ['1A'] },
    { label: '2nd Class', id: '2nd', matches: ['2A', '2S'] },
    { label: '3rd Class', id: '3rd', matches: ['3A', '3E'] },
];
export default function TrainPage({ embedded = false }: { embedded?: boolean }) {
    const [transitData, setTransitData] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trainFilter, setTrainFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
    const [fromFilter, setFromFilter] = useState('');
    const [toFilter, setToFilter] = useState('');
    const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
    const [toDropdownOpen, setToDropdownOpen] = useState(false);
    const [classFilter, setClassFilter] = useState<string>('all');

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('train');
                if (isMounted) {
                    setTransitData(data);
                    setError(null);
                }
            } catch (err: unknown) {
                console.error("Failed to load train schedules:", err);
                if (isMounted) {
                    setError((err instanceof Error) ? err.message : String(err));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, []);

    const station = useMemo(() => transitData.find(d => d.type === 'station'), [transitData]);
    const allRoutes = useMemo(() => transitData.filter(d => d.type === 'route' && (d.subCategory === 'Express' || d.subCategory === 'Passenger')), [transitData]);

    const allStations = useMemo(() => {
        const stations = new Set<string>();
        allRoutes.forEach(r => {
            if (r.from) stations.add(r.from);
            if (r.to) stations.add(r.to);
        });
        return Array.from(stations).sort();
    }, [allRoutes]);

    // Filter routes by direction
    const incomingRoutes = useMemo(() => allRoutes.filter(route =>
        route.to?.toLowerCase().includes('pondi') || route.to?.toLowerCase().includes('pdy')
    ), [allRoutes]);

    const outgoingRoutes = useMemo(() => allRoutes.filter(route =>
        route.from?.toLowerCase().includes('pondi') || route.from?.toLowerCase().includes('pdy')
    ), [allRoutes]);

    const filteredRoutes = useMemo(() => {
        let routes = allRoutes;
        if (trainFilter === 'incoming') routes = incomingRoutes;
        if (trainFilter === 'outgoing') routes = outgoingRoutes;

        return routes.filter(route => {
            const fromMatch = !fromFilter || route.from?.toLowerCase().includes(fromFilter.toLowerCase());
            const toMatch = !toFilter || route.to?.toLowerCase().includes(toFilter.toLowerCase());

            let classMatch = true;
            if (classFilter !== 'all') {
                const selectedClass = TRAIN_CLASSES.find(c => c.id === classFilter);
                if (selectedClass && route.classes) {
                    classMatch = route.classes.some(c => selectedClass.matches.includes(c));
                } else if (selectedClass && !route.classes) {
                    classMatch = false; // Filter out if no classes and we are asking for a specific class
                }
            }

            return fromMatch && toMatch && classMatch;
        });
    }, [allRoutes, incomingRoutes, outgoingRoutes, trainFilter, fromFilter, toFilter, classFilter]);

    const handleLocateMe = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const knownLocations = [
                    { name: 'Puducherry', lat: 11.9266, lng: 79.8253 },
                    { name: 'Villupuram', lat: 11.9401, lng: 79.4861 },
                    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
                    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
                    { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
                    { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
                    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
                    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
                    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
                    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 }
                ];

                const nearest = knownLocations.reduce((prev, curr) => {
                    const getDist = (loc: typeof knownLocations[0]) => Math.sqrt(Math.pow(loc.lat - latitude, 2) + Math.pow(loc.lng - longitude, 2));
                    return getDist(curr) < getDist(prev) ? curr : prev;
                });

                if (nearest) {
                    setFromFilter(nearest.name);
                }
            }, (error) => {
                console.error("Geolocation error:", error);
                alert("Could not get your location. Please ensure location services are enabled.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className={embedded ? "space-y-10" : "container mx-auto py-8 px-4 max-w-5xl space-y-10"}>
            {!embedded && (
                <DashboardHeader
                    title="Train Services"
                    subtitle="Railway schedules from Puducherry"
                    backHref="/dashboard/transit"
                    backLabel="Transit"
                />
            )}

            {/* Section Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-8 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full" />
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Railways</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Train Services & Schedules
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
                    Express & passenger trains connecting Puducherry to major Indian cities.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 flex items-center justify-center">
                            <Loader2 className="w-7 h-7 text-purple-600 dark:text-purple-400 animate-spin" />
                        </div>
                        <div className="absolute inset-0 bg-purple-400/20 rounded-2xl blur-xl animate-pulse" />
                    </div>
                    <p className="text-slate-500 font-medium">Loading train schedules...</p>
                </div>
            ) : error ? (
                <div className="text-center py-16 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400">{error}</div>
            ) : transitData.length > 0 ? (
                <>
                    {/* Station Info Card */}
                    {station && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden rounded-2xl border border-purple-200/50 dark:border-purple-800/30"
                        >
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50/50 to-indigo-50 dark:from-purple-950/40 dark:via-violet-950/20 dark:to-indigo-950/30" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

                            <div className="relative p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                                            <Train className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{station.name}</h2>
                                            <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2 mt-2 text-sm">
                                                <MapPin className="w-4 h-4 text-purple-500" />
                                                {station.address}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {station.facilities?.map((f) => (
                                                    <Badge key={f} variant="secondary" className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm text-slate-600 dark:text-slate-300 border-0 font-medium rounded-lg text-xs px-3 py-1.5 shadow-sm">
                                                        {f}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {station.code && (
                                        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-purple-200/30 dark:border-purple-800/30 shadow-sm">
                                            <div className="text-center">
                                                <p className="text-[10px] text-purple-500 uppercase tracking-widest font-bold">Station Code</p>
                                                <p className="text-3xl font-black text-purple-700 dark:text-purple-400 tracking-wide mt-1">{station.code}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Train Routes */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-6 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full" />
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular Routes</h2>
                                </div>
                                <Badge variant="secondary" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium text-xs rounded-lg border-0">
                                    {filteredRoutes.length} trains
                                </Badge>
                            </div>



                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Button
                                        variant={trainFilter === 'all' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTrainFilter('all')}
                                        className={`rounded-lg font-semibold text-xs transition-all ${trainFilter === 'all'
                                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800'
                                            }`}
                                    >
                                        All Trains
                                    </Button>
                                    <Button
                                        variant={trainFilter === 'incoming' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTrainFilter('incoming')}
                                        className={`rounded-lg font-semibold text-xs transition-all ${trainFilter === 'incoming'
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                                            }`}
                                    >
                                        Incoming
                                    </Button>
                                    <Button
                                        variant={trainFilter === 'outgoing' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTrainFilter('outgoing')}
                                        className={`rounded-lg font-semibold text-xs transition-all ${trainFilter === 'outgoing'
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800'
                                            }`}
                                    >
                                        Outgoing
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="class-filter" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:block">
                                        Class Filter
                                    </label>
                                    <select
                                        id="class-filter"
                                        value={classFilter}
                                        onChange={(e) => setClassFilter(e.target.value)}
                                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold focus:ring-2 focus:ring-purple-500/20 outline-none transition-all cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                                    >
                                        {TRAIN_CLASSES.map(tc => (
                                            <option key={tc.id} value={tc.id}>{tc.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>


                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`${trainFilter}-${fromFilter}-${toFilter}`}
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                className="space-y-4"
                            >
                                {filteredRoutes.map((train) => (
                                    <TrainItem key={train.id} train={train} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-900 dark:to-purple-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
                >
                    <div className="text-4xl mb-4">🚆</div>
                    <p className="text-slate-500 font-medium text-lg">Transit data under preparation</p>
                    <p className="text-slate-400 text-sm mt-2">Check back soon for updates</p>
                </motion.div>
            )}

            {/* Book Tickets CTA */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="relative overflow-hidden rounded-2xl border border-cyan-200/50 dark:border-cyan-800/30"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/5 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />

                <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Book Train Tickets</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mt-0.5">Book online via IRCTC or visit the station counter</p>
                        </div>
                    </div>
                    <Button
                        asChild
                        className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 px-6 py-3 font-semibold"
                    >
                        <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            Visit IRCTC
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

// ------------------------------------------------------------------------------------------------
// NEW COMPONENT: TrainItem
// Handles the expanded state, class tabs, and availability calendar for a single Train route
// ------------------------------------------------------------------------------------------------

function TrainItem({ train }: { train: TransitItem }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-200/60 dark:hover:border-purple-800/40 hover:shadow-xl hover:shadow-purple-500/5 rounded-2xl overflow-hidden transition-all duration-400`}
        >
            <Link
                href={`/dashboard/transit/train/${train.id}`}
                target="_blank"
                className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center gap-6 cursor-pointer block"
            >
                <div className="flex-1 space-y-4">
                    {/* Train name and badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/10 transition-all duration-300">
                            <Train className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{train.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[10px] font-mono tracking-wider border-slate-200 dark:border-slate-700">{train.number}</Badge>
                                <Badge className={`text-[10px] font-bold ${train.subCategory === 'Express' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0'}`}>
                                    {train.subCategory || 'Train'}
                                </Badge>
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {train.duration}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Journey route */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-800/20 p-3 rounded-xl w-fit">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg shadow-sm">{train.departure} <span className="text-slate-500 text-xs ml-1">{train.from}</span></span>
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <div className="w-8 md:w-16 h-[2px] bg-gradient-to-r from-purple-400 to-violet-400 rounded-full" />
                        <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
                        <div className="w-8 md:w-16 h-[2px] bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg shadow-sm">{train.arrival} <span className="text-slate-500 text-xs ml-1">{train.to}</span></span>
                    </div>
                </div>

                {/* Right info panel */}
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/60 pt-4 lg:pt-0 lg:pl-6 items-end lg:items-start xl:items-center justify-between min-w-[200px]">
                    <div className="space-y-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2.5 bg-orange-50 dark:bg-orange-900/15 rounded-xl px-3.5 py-2.5 border border-orange-100/50 dark:border-orange-800/30">
                            <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{train.frequency}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <Button
                            variant="link"
                            className="font-semibold text-purple-600 dark:text-purple-400 transition-colors text-xs flex items-center gap-1"
                            asChild
                        >
                            <span>Check Schedule <ExternalLink className="w-3 h-3" /></span>
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
