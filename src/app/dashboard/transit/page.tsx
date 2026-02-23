'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bike, Car, Bus, Train } from 'lucide-react';
import { seedTransitData } from '@/services/transitService';

// Import sub-page components
import RentalsPage from './rentals/page';
import CabsPage from './cabs/page';
import BusPage from './bus/page';
import TrainPage from './train/page';

const TAB_CONFIG = [
    { value: 'rentals', label: 'Vehicle Rentals', icon: Bike },
    { value: 'cabs', label: 'Auto & Cabs', icon: Car },
    { value: 'bus', label: 'Bus Services', icon: Bus },
    { value: 'train', label: 'Train', icon: Train },
];

export default function TransitPage() {
    const [activeTab, setActiveTab] = useState('rentals');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-2 pb-8 sm:pt-4 sm:pb-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-12 space-y-4"
                >
                    <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                        <Bus className="w-4 h-4 mr-2 inline-block" />
                        Transport Guide
                    </Badge>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Getting Around <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">Puducherry</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Your complete guide to bikes, buses, trains, and cabs
                    </p>

                    {/* Smart Route Planner Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="pt-4"
                    >
                        <a href="/dashboard/transit/route-planner">
                            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <span>Smart Route Planner - Find Best Transport</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </a>
                    </motion.div>
                </motion.div>

                {/* Main Navigation Tabs */}
                <Tabs defaultValue="rentals" value={activeTab} onValueChange={setActiveTab} className="w-full">

                    {/* Tab Navigation - Centered */}
                    <div className="flex justify-center mb-8 sm:mb-10">
                        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-lg inline-flex">
                            {TAB_CONFIG.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.value;
                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-2
                                            ${isActive
                                                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    {/* Content Areas */}
                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TabsContent value="rentals" className="mt-0 focus-visible:ring-0">
                                    <RentalsPage embedded={true} />
                                </TabsContent>
                                <TabsContent value="cabs" className="mt-0 focus-visible:ring-0">
                                    <CabsPage embedded={true} />
                                </TabsContent>
                                <TabsContent value="bus" className="mt-0 focus-visible:ring-0">
                                    <BusPage embedded={true} />
                                </TabsContent>
                                <TabsContent value="train" className="mt-0 focus-visible:ring-0">
                                    <TrainPage embedded={true} />
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
