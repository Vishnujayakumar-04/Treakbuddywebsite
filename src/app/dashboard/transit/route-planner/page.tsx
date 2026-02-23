'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, ArrowRight, Loader2, IndianRupee, Route, Clock, TrendingUp, X } from 'lucide-react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { PLACES_DATA, Place } from '@/services/data/places';

interface RouteResult {
    transportType: string;
    fare: string;
    distance: string;
    duration: string;
    route: string;
    icon: string;
    color: string;
}

export default function RoutePlannerPage() {
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<RouteResult[]>([]);
    const [fromSuggestions, setFromSuggestions] = useState<Place[]>([]);
    const [toSuggestions, setToSuggestions] = useState<Place[]>([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);

    const filterPlaces = (query: string) => {
        if (!query || query.length < 1) return [];
        const lowerQuery = query.toLowerCase();
        return PLACES_DATA.filter(place =>
            place.name.toLowerCase().includes(lowerQuery) ||
            place.location.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
    };

    const handleFromChange = (value: string) => {
        setFromLocation(value);
        const suggestions = filterPlaces(value);
        setFromSuggestions(suggestions);
        setShowFromSuggestions(suggestions.length > 0);
    };

    const handleToChange = (value: string) => {
        setToLocation(value);
        const suggestions = filterPlaces(value);
        setToSuggestions(suggestions);
        setShowToSuggestions(suggestions.length > 0);
    };

    const selectFromSuggestion = (place: string) => {
        setFromLocation(place);
        setShowFromSuggestions(false);
    };

    const selectToSuggestion = (place: string) => {
        setToLocation(place);
        setShowToSuggestions(false);
    };

    const detectCurrentLocation = async () => {
        setDetectingLocation(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // For demo, set to a common location in Pondicherry
                    setFromLocation('White Town, Pondicherry');
                    setDetectingLocation(false);
                },
                (error) => {
                    console.error('Error detecting location:', error);
                    setFromLocation('Current Location');
                    setDetectingLocation(false);
                }
            );
        } else {
            setFromLocation('Current Location');
            setDetectingLocation(false);
        }
    };

    const analyzeRoute = async () => {
        if (!fromLocation || !toLocation) return;

        setAnalyzing(true);

        // Simulate AI analysis with realistic data
        await new Promise(resolve => setTimeout(resolve, 2000));

        const distance = Math.floor(Math.random() * 15) + 3; // 3-18 km
        const baseTime = Math.floor(distance * 4); // ~4 min per km average

        const transportOptions: RouteResult[] = [
            {
                transportType: 'Auto Rickshaw',
                fare: `₹${30 + (distance * 15)}`,
                distance: `${distance} km`,
                duration: `${baseTime - 5} mins`,
                route: `${fromLocation} → ${toLocation}`,
                icon: '🛺',
                color: 'from-yellow-500 to-orange-500'
            },
            {
                transportType: 'Bike Taxi (Rapido)',
                fare: `₹${20 + (distance * 10)}`,
                distance: `${distance} km`,
                duration: `${baseTime - 10} mins`,
                route: `${fromLocation} → ${toLocation}`,
                icon: '🏍️',
                color: 'from-blue-500 to-cyan-500'
            },
            {
                transportType: 'City Taxi',
                fare: `₹${100 + (distance * 18)}`,
                distance: `${distance} km`,
                duration: `${baseTime} mins`,
                route: `${fromLocation} → ${toLocation}`,
                icon: '🚕',
                color: 'from-emerald-500 to-teal-500'
            },
            {
                transportType: 'Town Bus',
                fare: `₹${distance < 5 ? '8' : distance < 10 ? '12' : '20'}`,
                distance: `${distance} km`,
                duration: `${baseTime + 15} mins`,
                route: `${fromLocation} → ${toLocation}`,
                icon: '🚌',
                color: 'from-purple-500 to-pink-500'
            }
        ];

        // Sort by fare (cheapest first)
        setResults(transportOptions.sort((a, b) =>
            parseInt(a.fare.replace('₹', '')) - parseInt(b.fare.replace('₹', ''))
        ));
        setAnalyzing(false);
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
            <DashboardHeader
                title="Smart Route Planner"
                subtitle="Find the best transport option for your journey"
                backHref="/dashboard/transit"
                backLabel="Transit"
            />

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
            >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Plan Your Journey</h2>

                <div className="space-y-4">
                    {/* From Location */}
                    <div className="relative">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">
                            From
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 z-10" />
                                <input
                                    type="text"
                                    value={fromLocation}
                                    onChange={(e) => handleFromChange(e.target.value)}
                                    onFocus={() => fromLocation.length >= 2 && setShowFromSuggestions(true)}
                                    placeholder="Enter starting point..."
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                />

                                {/* From Suggestions Dropdown */}
                                {showFromSuggestions && fromSuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</span>
                                            <button onClick={() => setShowFromSuggestions(false)} className="text-slate-400 hover:text-slate-600">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {fromSuggestions.map((place) => (
                                            <button
                                                key={place.id}
                                                onClick={() => selectFromSuggestion(place.name)}
                                                className="w-full px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 dark:text-white font-bold text-sm">{place.name}</p>
                                                    <p className="text-slate-500 text-xs">{place.location}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                            <Button
                                onClick={detectCurrentLocation}
                                disabled={detectingLocation}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 px-6"
                            >
                                {detectingLocation ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Detect
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex justify-center">
                        <ArrowRight className="w-6 h-6 text-slate-400" />
                    </div>

                    {/* To Location */}
                    <div className="relative">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">
                            To
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600 z-10" />
                            <input
                                type="text"
                                value={toLocation}
                                onChange={(e) => handleToChange(e.target.value)}
                                onFocus={() => toLocation.length >= 2 && setShowToSuggestions(true)}
                                placeholder="Enter destination (landmark or place)..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                            />

                            {/* To Suggestions Dropdown */}
                            {showToSuggestions && toSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                                >
                                    <div className="flex justify-between items-center px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</span>
                                        <button onClick={() => setShowToSuggestions(false)} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {toSuggestions.map((place) => (
                                        <button
                                            key={place.id}
                                            onClick={() => selectToSuggestion(place.name)}
                                            className="w-full px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
                                                <MapPin className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-bold text-sm">{place.name}</p>
                                                <p className="text-slate-500 text-xs">{place.location}</p>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Analyze Button */}
                    <Button
                        onClick={analyzeRoute}
                        disabled={!fromLocation || !toLocation || analyzing}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg py-6 text-lg font-semibold"
                    >
                        {analyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing Best Routes...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Find Best Transport Options
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Results Section */}
            {results.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Options</h2>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
                            {results.length} options found
                        </Badge>
                    </div>

                    {results.map((result, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${result.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {result.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{result.transportType}</h3>
                                        {index === 0 && (
                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mt-1">
                                                💰 Cheapest
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{result.fare}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Estimated Fare</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Route className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Distance</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{result.distance}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{result.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IndianRupee className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Per Km</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            ₹{(parseInt(result.fare.replace('₹', '')) / parseInt(result.distance)).toFixed(0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <span className="text-emerald-600 dark:text-emerald-400">●</span>
                                    {result.route}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Empty State */}
            {results.length === 0 && !analyzing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700"
                >
                    <Route className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Plan Your Journey</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        Enter your starting point and destination to get the best transport recommendations
                    </p>
                </motion.div>
            )}
        </div>
    );
}
