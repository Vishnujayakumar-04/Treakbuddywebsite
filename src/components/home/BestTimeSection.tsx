'use client';

import { motion } from 'framer-motion';
import { Sun, CloudRain, ThermometerSun, Leaf, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SEASONS = [
    {
        title: "Peak Season",
        months: "October – March",
        description: "Delightfully cool and comfortable. Ideal for exploring the French Quarter, water sports, and cycling.",
        temp: "15°C – 30°C",
        icon: Sun,
        color: "bg-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-200 dark:border-amber-800",
        highlights: ["International Yoga Festival", "Pongal", "Heritage Festival"]
    },
    {
        title: "Shoulder Season",
        months: "July – September",
        description: "Lush green landscapes with moderate rainfall. Quieter vibe and fewer crowds.",
        temp: "31°C – 34°C",
        icon: CloudRain,
        color: "bg-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-200 dark:border-emerald-800",
        highlights: ["Sri Aurobindo’s Birthday", "Lush Landscapes", "Peaceful Vibe"]
    },
    {
        title: "Off-Season",
        months: "April – June",
        description: "Hot and humid summer. Great for budget travelers looking for discounted stays.",
        temp: "30°C – 40°C",
        icon: ThermometerSun,
        color: "bg-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-200 dark:border-rose-800",
        highlights: ["Villianur Temple Car Festival", "Discounted Stays", "Indoor Activities"]
    }
];

const WEATHER_DATA = [
    { period: "Jan – Feb", temp: "27°C / 22°C", rain: "1 – 2 days", verdict: "Best Time (Cool & Clear)" },
    { period: "Mar – June", temp: "30°C – 37°C", rain: "0 – 9 days", verdict: "Avoid (Harsh Summer)" },
    { period: "July – Sept", temp: "31°C – 34°C", rain: "9 – 20 days", verdict: "Moderate (Lush Greenery)" },
    { period: "Oct – Dec", temp: "27°C – 31°C", rain: "12 – 23 days", verdict: "Best Time (Festive Season)" },
];

export function BestTimeSection() {
    return (
        <section className="py-12 bg-white dark:bg-slate-950 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Introduction & Seasons */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <Badge className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                                <Calendar className="w-3 h-3 mr-1.5" />
                                Travel Guide
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-loose">
                                Best Time to Visit<br />
                                <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Puducherry</span>
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                Plan your trip perfectly with our seasonal breakdown. Whether you seek festive vibes or quiet retreats, we have you covered.
                            </p>
                        </motion.div>

                        <div className="space-y-6">
                            {SEASONS.map((season, i) => (
                                <motion.div
                                    key={season.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-6 rounded-2xl border ${season.border} ${season.bg} hover:shadow-lg transition-all duration-300 group`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${season.color} text-white shadow-lg`}>
                                            <season.icon className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center flex-wrap gap-2">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{season.title}</h3>
                                                <Badge variant="outline" className="border-slate-300 dark:border-slate-700 font-mono text-xs">
                                                    {season.months}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                {season.description}
                                            </p>

                                            {/* Highlights Tags */}
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {season.highlights.map(tag => (
                                                    <span key={tag} className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md">
                                                        <Leaf className="w-3 h-3 mr-1 opacity-50" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Weather Table & CTA */}
                    <div className="space-y-10 lg:pt-20">
                        {/* Weather Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <ThermometerSun className="w-6 h-6 text-amber-500" />
                                Weather at a Glance
                            </h3>

                            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Period</th>
                                            <th className="px-4 py-3">Temp</th>
                                            <th className="px-4 py-3">Verdict</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
                                        {WEATHER_DATA.map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{row.period}</td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.temp}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${row.verdict.includes("Best") ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                        row.verdict.includes("Avoid") ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                                                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                        }`}>
                                                        {row.verdict.split('(')[0].trim()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-800/50 flex gap-3">
                                <div className="shrink-0 p-2 bg-cyan-100 dark:bg-cyan-800 rounded-lg text-cyan-600 dark:text-cyan-300">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Planning Tip</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                        For a detailed itinerary tailored to the season, try our AI Planner.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/dashboard/planner" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full h-14 rounded-full font-bold text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity">
                                    Plan My Trip
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
