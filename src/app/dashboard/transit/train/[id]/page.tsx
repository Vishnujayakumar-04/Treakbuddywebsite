'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Train, Clock, ArrowRight, Calendar, CheckCircle2, ChevronLeft, ExternalLink, Loader2 } from 'lucide-react';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';
import Link from 'next/link';

export default function TrainDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const trainId = resolvedParams.id;

    const [train, setTrain] = useState<TransitItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedQuota, setSelectedQuota] = useState<'General' | 'Senior Citizen' | 'Ladies'>('General');

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('train');
                const foundTrain = data.find(t => t.id === trainId);
                if (isMounted) {
                    if (foundTrain) {
                        setTrain(foundTrain);
                        if (foundTrain.classes && foundTrain.classes.length > 0) {
                            setSelectedClass(foundTrain.classes[0]);
                        }
                    } else {
                        setError("Train not found.");
                    }
                }
            } catch (err: any) {
                if (isMounted) setError(err.message || "Failed to load");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, [trainId]);

    // Generating realistic mock availability dates based on class and quota
    const availabilityDates = useMemo(() => {
        if (!train) return [];
        const dates = [];
        const today = new Date();
        const quotasMultiplier = selectedQuota === 'General' ? 1 : selectedQuota === 'Senior Citizen' ? 0.3 : 0.2;

        for (let i = 1; i <= 5; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + (i * 7));

            const rand = Math.random();
            let status = 'AVL';
            let seats = Math.floor(Math.random() * 100 * quotasMultiplier) + (i * 20);
            let colorClass = 'text-emerald-700 dark:text-emerald-500';
            let isNotAvailable = false;

            if (selectedQuota === 'Ladies' && rand > 0.2) {
                isNotAvailable = true;
            } else if (i < 3) {
                if (rand > 0.7) {
                    status = 'WL';
                    seats = Math.floor(Math.random() * 50) + 1;
                    colorClass = 'text-amber-600 dark:text-amber-500';
                } else if (rand > 0.4) {
                    status = 'RAC';
                    seats = Math.floor(Math.random() * 30) + 1;
                    colorClass = 'text-orange-600 dark:text-orange-500';
                }
            }

            let basePrice = 450;
            if (selectedClass === '1A') basePrice = 2800;
            if (selectedClass === '2A') basePrice = 1600;
            if (selectedClass === '3A' || selectedClass === '3E') basePrice = 1100;
            if (selectedClass === 'CC') basePrice = 850;
            if (selectedClass === 'SL') basePrice = 450;
            if (selectedClass === '2S') basePrice = 250;

            const finalPrice = Math.floor(basePrice + (Math.random() * 50));

            const dayNum = nextDate.toLocaleDateString('en-GB', { day: '2-digit' });
            const monthStr = nextDate.toLocaleDateString('en-GB', { month: 'short' });
            const weekdayStr = nextDate.toLocaleDateString('en-GB', { weekday: 'short' });

            dates.push({
                dateObj: nextDate,
                dateTop: `${dayNum} ${monthStr}`,
                dateBottom: weekdayStr,
                status,
                seats,
                price: finalPrice,
                colorClass,
                isNotAvailable
            });
        }
        return dates;
    }, [train, selectedClass, selectedQuota]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-purple-600">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Loading train details...</span>
                </div>
            </div>
        );
    }

    if (error || !train) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full text-center border border-red-100 dark:border-red-900/30">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Train className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Internal Error</h2>
                    <p className="text-slate-500 mb-6">{error || 'Train not found'}</p>
                    <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                        <Link href="/dashboard/transit/train">Back to Trains</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Minimal Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard/transit/train" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Search
                    </Link>
                    <div className="font-bold text-slate-800 dark:text-slate-200 hidden sm:block">
                        {train.from?.split(' ')[0]} to {train.to?.split(' ')[0]}
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Train Info Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-5 md:p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex-1 space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 flex items-center justify-center">
                                    <Train className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">{train.name}</h1>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Badge variant="outline" className="text-xs font-mono tracking-wider border-slate-200 dark:border-slate-700">{train.number}</Badge>
                                        <Badge className={`text-xs font-bold ${train.subCategory === 'Express' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0'}`}>
                                            {train.subCategory || 'Train'}
                                        </Badge>
                                        <span className="text-sm text-slate-500 dark:text-slate-400 ml-2 flex items-center gap-1.5 font-medium">
                                            <Clock className="w-4 h-4" /> {train.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl w-fit">
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{train.departure}</span>
                                    <span className="text-slate-500 text-sm font-medium">{train.from}</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <div className="w-16 md:w-32 h-[2px] bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-slate-800/40 px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">{train.duration}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{train.arrival}</span>
                                    <span className="text-slate-500 text-sm font-medium">{train.to}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-5 lg:pt-0 lg:pl-8 justify-center min-w-[200px]">
                            <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/15 rounded-xl px-4 py-3 border border-orange-100/50 dark:border-orange-800/30">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-orange-600/70 dark:text-orange-400/70 font-bold uppercase tracking-wider">Runs On</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{train.frequency}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmtkt Style Details Block */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm pt-6">

                    {/* Class Scroller */}
                    <div className="px-5 md:px-6">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Select Class</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {train.classes?.map((c) => {
                                const isSelected = selectedClass === c;
                                let basePrice = 450;
                                if (c === '1A') basePrice = 2800;
                                if (c === '2A') basePrice = 1600;
                                if (c === '3A' || c === '3E') basePrice = 1100;
                                if (c === 'CC') basePrice = 850;
                                if (c === '2S') basePrice = 250;

                                const randStatus = Math.random() > 0.4 ? 'AVL' : 'WL';
                                const updateTexts = ['Just now', '41 mins ago', '1 day ago', '16 mins ago'];
                                const updateTextIndex = (c.charCodeAt(0) + c.charCodeAt(c.length - 1)) % updateTexts.length;
                                const updateText = updateTexts[updateTextIndex];

                                return (
                                    <div key={c} className="flex flex-col gap-1.5 snap-start">
                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 pl-1">{updateText}</span>
                                        <button
                                            onClick={() => setSelectedClass(c)}
                                            className={`min-w-[140px] flex flex-col p-3.5 rounded-xl border text-left transition-all relative ${isSelected
                                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-500 ring-inset'
                                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'
                                                }`}
                                        >
                                            {c === '1A' && isSelected && (
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-1 whitespace-nowrap">
                                                    <span className="text-[9px] font-bold text-emerald-600 tracking-wide">Confirm or 3X Refund*</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center w-full mb-1.5 border-b border-transparent pb-1">
                                                <span className={`font-bold text-base ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{c}</span>
                                                <span className={`font-semibold text-sm ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>₹{basePrice}</span>
                                            </div>
                                            <span className={`text-[14px] font-bold leading-tight flex items-center gap-1.5 ${randStatus === 'AVL' ? 'text-emerald-600 dark:text-emerald-500' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                                {randStatus} {Math.floor(Math.random() * 50) + 1}
                                                {randStatus !== 'AVL' && <div className="w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[8px]"><CheckCircle2 className="w-2.5 h-2.5" /></div>}
                                            </span>
                                            <span className={`text-xs mt-0.5 capitalize leading-none ${randStatus === 'AVL' ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {randStatus === 'AVL' ? 'Available' : 'Waitlist'}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quota Tabs */}
                    <div className="flex border-b border-t border-slate-200 dark:border-slate-800 mt-2">
                        {(['General', 'Senior Citizen', 'Ladies'] as const).map(quota => (
                            <button
                                key={quota}
                                onClick={() => setSelectedQuota(quota)}
                                className={`flex-1 py-4 px-2 text-[15px] font-bold transition-colors relative ${selectedQuota === quota
                                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50/30'
                                    }`}
                            >
                                {quota}
                                {selectedQuota === quota && (
                                    <motion.div layoutId="activeQuotaExpanded" className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-600 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Calendar List */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex flex-col bg-white dark:bg-slate-900">
                        {availabilityDates.map((dateObj, idx) => (
                            <div key={idx} className="flex flex-col">
                                {idx === 1 && (
                                    <div className="py-2.5 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center shadow-inner">
                                        Following Weeks
                                    </div>
                                )}
                                <div className={`flex items-center justify-between py-5 px-5 md:px-8 transition-colors ${idx === 0 ? 'bg-emerald-50/20 dark:bg-emerald-900/5' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/30`}>
                                    {/* Left: Date */}
                                    <div className="flex flex-col min-w-[80px]">
                                        <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{dateObj.dateTop}</span>
                                        <span className="text-[13px] font-medium text-slate-500">{dateObj.dateBottom}</span>
                                    </div>

                                    {/* Middle: Availability Status */}
                                    <div className="flex-1 flex flex-col items-start px-4 md:px-8">
                                        {dateObj.isNotAvailable ? (
                                            <span className="font-bold text-[14px] text-red-500">Not Available</span>
                                        ) : (
                                            <>
                                                <span className={`font-black text-[16px] tracking-tight ${dateObj.colorClass}`}>
                                                    {dateObj.status} {dateObj.seats}
                                                </span>
                                                <span className={`text-[13px] font-medium mt-0.5 ${dateObj.status === 'AVL' ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-slate-500'}`}>
                                                    {dateObj.status === 'AVL' ? 'Available' : 'Waitlist'}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Right: Book Button */}
                                    <div>
                                        <Button
                                            disabled={dateObj.isNotAvailable}
                                            onClick={() => {
                                                if (!dateObj.isNotAvailable) {
                                                    window.open('https://www.irctc.co.in', '_blank', 'noopener,noreferrer');
                                                }
                                            }}
                                            className={`font-bold text-[14px] border-2 rounded-xl h-auto py-2.5 px-6 md:px-8 flex flex-col shadow-sm transition-all
                                                ${dateObj.isNotAvailable
                                                    ? 'border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500 bg-transparent opacity-80 cursor-not-allowed shadow-none'
                                                    : 'border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white bg-white dark:bg-slate-900 hover:shadow-emerald-600/20'
                                                }`}
                                        >
                                            <span className="leading-tight">Book Now</span>
                                            <span className="text-[12px] opacity-90 font-medium">₹{dateObj.price}</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </main>
        </div>
    );
}
