'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Loader2, Route, AlertCircle, Bus, Building2, Navigation } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';
import { cn } from '@/lib/utils';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.3 } }
};

export default function BusPage({ embedded = false }: { embedded?: boolean }) {
    const [buses, setBuses] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fromFilter, setFromFilter] = useState('');
    const [toFilter, setToFilter] = useState('');

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('bus');
                if (mounted) {
                    setBuses(data);
                    setError(null);
                }
            } catch (err: unknown) {
                if (mounted) {
                    setError((err instanceof Error) ? err.message : String(err));
                    console.error("Failed to load bus schedules:", err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, []);

    // Filter buses based on from/to inputs
    const filterBuses = (busList: TransitItem[]) => {
        return busList.filter(bus => {
            const fromMatch = !fromFilter ||
                bus.from?.toLowerCase().includes(fromFilter.toLowerCase()) ||
                bus.via?.some(v => v.toLowerCase().includes(fromFilter.toLowerCase()));

            const toMatch = !toFilter ||
                bus.to?.toLowerCase().includes(toFilter.toLowerCase()) ||
                bus.via?.some(v => v.toLowerCase().includes(toFilter.toLowerCase()));

            return fromMatch && toMatch;
        });
    };

    const localBuses = filterBuses(buses.filter(b => b.subCategory === 'local'));
    const interBuses = filterBuses(buses.filter(b => b.subCategory === 'interstate'));

    const renderBusCard = (bus: TransitItem) => {
        const isGovernment = bus.type === 'Government' || bus.type === 'PRTC' || bus.type === 'Tourism';

        // --- Dynamic Fare Engine ---
        let calculatedFare: number | null = null;
        let calculatedStops: number | null = null;
        let journeyTime: number | null = null;
        let matchedFromStop = '';
        let matchedToStop = '';
        let intermediateStops: string[] = [];
        let isExpanded = false;

        const fromSearch = fromFilter.toLowerCase().trim();
        const toSearch = toFilter.toLowerCase().trim();

        if (fromSearch && toSearch && bus.routeStops && bus.baseFare !== undefined && bus.farePerStop !== undefined) {
            const fromIdx = bus.routeStops.findIndex(s => s.toLowerCase().includes(fromSearch));
            const toIdx = bus.routeStops.findIndex(s => s.toLowerCase().includes(toSearch));

            if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
                calculatedStops = toIdx - fromIdx;
                calculatedFare = bus.baseFare + (calculatedStops * bus.farePerStop);
                journeyTime = calculatedStops * 4; // Approx 4 mins per stop
                matchedFromStop = bus.routeStops[fromIdx];
                matchedToStop = bus.routeStops[toIdx];
                intermediateStops = bus.routeStops.slice(fromIdx + 1, toIdx);
                isExpanded = true;
            }
        }
        // ------------------------

        return (
            <motion.div
                key={bus.id}
                variants={cardVariants}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
            >
                {/* Top Row: Title, Badge, Price, Frequency */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                                {bus.name}
                            </h3>
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border",
                                isGovernment
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                    : "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
                            )}>
                                <Building2 className="w-3.5 h-3.5" />
                                {bus.type || 'Private'}
                            </span>
                            {bus.subCategory === 'local' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-xs font-bold font-mono">
                                    <Bus className="w-3 h-3" />
                                    {bus.id.toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-900 dark:text-white font-semibold">{bus.from}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300" />
                            <span className="text-slate-900 dark:text-white font-semibold">{bus.to}</span>
                        </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 justify-between md:justify-start">
                        {isExpanded && calculatedFare !== null ? (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-500 dark:border-emerald-800/50 shadow-sm">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg flex items-center gap-1">
                                    ₹{calculatedFare}
                                </span>
                            </div>
                        ) : bus.price && (
                            <div className="bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1.5 rounded-lg border border-cyan-100 dark:border-cyan-800/50">
                                <span className="text-cyan-700 dark:text-cyan-400 font-bold text-lg flex items-center gap-1">
                                    {bus.price}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>{isExpanded && journeyTime ? `~${journeyTime} mins` : bus.frequency}</span>
                        </div>
                    </div>
                </div>

                {/* Divider with Stops Info */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col md:flex-row gap-4 md:items-center text-sm md:text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 min-w-fit">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            {bus.availability || 'Daily Service'}
                        </span>
                    </div>

                    <div className="hidden md:block w-px h-4 bg-slate-200 dark:bg-slate-700" />

                    <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                        <span className="font-medium shrink-0">Main Stops:</span>
                        <div className="flex flex-wrap gap-2">
                            {(bus.routeStops && bus.routeStops.length > 2 ? bus.routeStops.slice(1, -1) : bus.via)?.map((stop, i) => (
                                <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium text-xs">
                                    {stop}
                                </span>
                            ))}
                        </div>
                    </div>

                    {bus.subCategory === 'interstate' && (
                        <div className="md:ml-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 w-full md:w-auto">
                            <a
                                href="https://www.tnstc.in/OTRSOnline/jqreq.do?hiddenAction=PackageSearch"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow active:scale-95"
                            >
                                Book Ticket
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    )}
                </div>

                {/* Expanded Journey Timeline */}
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-5 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <Route className="w-4 h-4" />
                                Journey Route
                            </h4>
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-800/50 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-700/50">
                                {calculatedStops} stops away
                            </span>
                        </div>

                        <div className="relative pl-6 space-y-6 border-l-[3px] border-emerald-200 dark:border-emerald-800 ml-2">
                            {/* Origin */}
                            <div className="relative">
                                <div className="absolute -left-[32px] w-5 h-5 rounded-full bg-emerald-500 border-4 border-emerald-100 dark:border-slate-900 flex items-center justify-center shadow-sm" />
                                <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{matchedFromStop}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">Boarding Point</p>
                            </div>

                            {/* Intermediate Stops */}
                            {intermediateStops.length > 0 && (
                                <div className="py-2">
                                    <div className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <div className="flex flex-wrap gap-x-2.5 gap-y-1.5">
                                            {intermediateStops.map((stop, idx) => (
                                                <span key={idx} className="flex items-center gap-2.5">
                                                    <span>{stop}</span>
                                                    {idx !== intermediateStops.length - 1 && <span className="text-slate-300 dark:text-slate-600">•</span>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Destination */}
                            <div className="relative">
                                <div className="absolute -left-[32px] w-5 h-5 rounded-full bg-orange-500 border-4 border-orange-100 dark:border-slate-900 flex items-center justify-center shadow-sm" />
                                <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{matchedToStop}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">Drop Point • <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{calculatedFare} ticket</span></p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    return (
        <div className={embedded ? "space-y-8" : "container mx-auto py-8 px-4 max-w-5xl space-y-8"}>
            {!embedded && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-6 bg-blue-600 rounded-full" />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Schedules</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Bus Routes & Timetables
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        Town buses & inter-city routes connecting Puducherry to major cities.
                    </p>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading routes...</p>
                </div>
            ) : error ? (
                <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 text-red-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>{error}</p>
                </div>
            ) : (
                <Tabs defaultValue="local" className="space-y-8">
                    {/* Centered Category Tabs */}
                    <div className="flex justify-center">
                        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-lg inline-flex gap-2">
                            <TabsTrigger
                                value="local"
                                className="rounded-xl px-10 py-5 font-bold text-xl transition-all duration-300 flex items-center gap-3
                                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 
                                    data-[state=active]:text-white data-[state=active]:shadow-md
                                    text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                <Bus className="w-6 h-6" />
                                <span>Town Bus (Local)</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="interstate"
                                className="rounded-xl px-10 py-5 font-bold text-xl transition-all duration-300 flex items-center gap-3
                                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 
                                    data-[state=active]:text-white data-[state=active]:shadow-md
                                    text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                <Building2 className="w-6 h-6" />
                                <span>Inter-city (Outstation)</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* From/To Search Fields */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">
                                    From
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                                    <input
                                        type="text"
                                        value={fromFilter}
                                        onChange={(e) => setFromFilter(e.target.value)}
                                        placeholder="Enter origin station or stop..."
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">
                                    To
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
                                    <input
                                        type="text"
                                        value={toFilter}
                                        onChange={(e) => setToFilter(e.target.value)}
                                        placeholder="Filter by destination or via..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        {(fromFilter || toFilter) && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing filtered routes
                                </p>
                                <button
                                    onClick={() => { setFromFilter(''); setToFilter(''); }}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Routes Count Badge - Centered */}
                    <div className="flex justify-center">
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 px-4 py-2 text-sm font-semibold">
                            {buses.length} routes available
                        </Badge>
                    </div>

                    <TabsContent value="local">
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                            {localBuses.map(renderBusCard)}
                        </motion.div>
                    </TabsContent>
                    <TabsContent value="interstate">
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                            {interBuses.map(renderBusCard)}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
