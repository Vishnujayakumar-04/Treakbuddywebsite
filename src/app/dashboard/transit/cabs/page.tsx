'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, Phone, MapPin, Clock, IndianRupee, Loader2, ArrowUpRight, Sparkles, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.3 } }
};

export default function CabsPage({ embedded = false }: { embedded?: boolean }) {
    const [transitData, setTransitData] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('cabs');
                setTransitData(data);
                setError(null);
            } catch (err: unknown) {
                console.error("Failed to load cab services:", err);
                setError((err instanceof Error) ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const cabTypes = transitData.filter(d => d.type === 'service');
    const operators = transitData.filter(d => d.type === 'operator');

    const renderCabCard = (cab: TransitItem) => (
        <motion.div
            key={cab.id}
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-400"
        >
            {/* Gradient accent top */}
            <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Icon */}
                <div className="relative">
                    <div className="text-5xl flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                        {cab.image || '🚕'}
                    </div>
                    <div className="absolute -inset-2 bg-amber-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{cab.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg">{cab.description}</p>
                        </div>
                        {cab.tips && (
                            <Badge className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30 hidden md:inline-flex font-medium rounded-lg px-3 py-1.5 text-xs">
                                <Sparkles className="w-3 h-3 mr-1.5" />
                                {cab.tips}
                            </Badge>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { icon: IndianRupee, label: 'Base Rate', value: cab.baseRate, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
                            { icon: MapPin, label: 'Per Km', value: cab.perKm, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
                            { icon: Clock, label: 'Available', value: cab.availability, color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' },
                            { icon: Phone, label: 'Booking', value: cab.bookingMethod, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
                        ].map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100/80 dark:border-slate-800/60 group/stat hover:shadow-md transition-all duration-300">
                                    <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{stat.label}</p>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{stat.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Book Now Buttons */}
                    {(cab.bookingUrls && cab.bookingUrls.length > 0) && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Book Online:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {cab.bookingUrls.map((booking, idx) => (
                                    <Button
                                        key={idx}
                                        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all duration-300 font-semibold rounded-xl py-2"
                                        asChild
                                    >
                                        <a href={booking.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                            <Car className="w-3.5 h-3.5" />
                                            {booking.name}
                                            <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className={embedded ? "space-y-8" : "container mx-auto py-8 px-4 max-w-5xl space-y-8"}>
            {!embedded && (
                <DashboardHeader
                    title="Cabs & Autos"
                    subtitle="On-demand local transport in Puducherry"
                    backHref="/dashboard/transit"
                    backLabel="Transit"
                />
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading cab services...</p>
                </div>
            ) : error ? (
                <div className="text-center py-16 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400">{error}</div>
            ) : (
                <Tabs defaultValue="services" className="space-y-8">
                    {/* Centered Category Tabs */}
                    <div className="flex justify-center">
                        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-lg inline-flex gap-2">
                            <TabsTrigger
                                value="services"
                                className="rounded-xl px-10 py-5 font-bold text-xl transition-all duration-300 flex items-center gap-3
                                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 
                                    data-[state=active]:text-white data-[state=active]:shadow-md
                                    text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                <Car className="w-6 h-6" />
                                <span>Ride Services</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="operators"
                                className="rounded-xl px-10 py-5 font-bold text-xl transition-all duration-300 flex items-center gap-3
                                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 
                                    data-[state=active]:text-white data-[state=active]:shadow-md
                                    text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                <Shield className="w-6 h-6" />
                                <span>Local Operators</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Service Count Badge - Centered */}
                    <div className="flex justify-center">
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 px-4 py-2 text-sm font-semibold">
                            {transitData.length} services available
                        </Badge>
                    </div>

                    <TabsContent value="services">
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                            {cabTypes.map(renderCabCard)}
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="operators">
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
                            {operators.map((operator) => (
                                <motion.div
                                    key={operator.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-200 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-400"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                            🚖
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{operator.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{operator.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold"
                                            asChild
                                        >
                                            <a href={`tel:${operator.contact}`} className="flex items-center justify-center gap-2">
                                                <Phone className="w-3.5 h-3.5" />
                                                Call Now
                                            </a>
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold"
                                            asChild
                                        >
                                            <a href="https://hurryupcabs.com/city/pondicherry" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                                <Car className="w-3.5 h-3.5" />
                                                Book Online
                                            </a>
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
