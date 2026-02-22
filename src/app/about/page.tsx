'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Globe, Sun, MapPin, Anchor, GraduationCap, Landmark, Coffee, Sparkles, ArrowRight,
    Utensils, Music, BookOpen, Users, Heart, Compass, Ship, ChevronRight
} from 'lucide-react';

const TIMELINE = [
    { year: '1st Century', title: 'Ancient Trade Port', desc: 'Poduke, a Roman trade destination mentioned in the Periplus of the Erythraean Sea.', icon: Anchor, color: 'from-amber-400 to-orange-500' },
    { year: '1674', title: 'French Arrival', desc: 'Establishment of the French East India Company in Pondicherry.', icon: Ship, color: 'from-blue-400 to-indigo-500' },
    { year: '1954', title: 'Merger with India', desc: 'Transfer of power from French to Indian administration.', icon: GraduationCap, color: 'from-emerald-400 to-teal-500' },
    { year: 'Today', title: 'Modern Puducherry', desc: 'A bustling Union Territory known for tourism, spirituality, and education.', icon: Sparkles, color: 'from-violet-400 to-purple-500' },
];

const CULTURE = [
    { title: 'French Architecture', desc: 'Yellow colonial houses, tree-lined boulevards, and the enchanting White Town quarter.', icon: Landmark, image: '/images/culture-arch.jpg', color: 'from-amber-400 to-orange-500' },
    { title: 'Spiritual Heritage', desc: "Home to Sri Aurobindo Ashram and Auroville — the city of dawn.", icon: BookOpen, image: '/images/culture-spirit.jpg', color: 'from-violet-400 to-purple-500' },
    { title: 'Vibrant Festivals', desc: 'Bastille Day, Pongal, and the iconic International Yoga Festival.', icon: Music, image: '/images/culture-fest.jpg', color: 'from-rose-400 to-pink-500' },
    { title: 'Coastal Living', desc: 'An easy-going lifestyle with fisherman villages and gorgeous sunrise spots.', icon: Users, image: '/images/culture-life.jpg', color: 'from-cyan-400 to-blue-500' },
];

const FOOD = [
    { title: 'French Cafés', desc: 'Authentic bakeries serving croissants, quiches, and coffee in heritage settings.', icon: Coffee, color: 'from-amber-400 to-orange-500' },
    { title: 'Creole Cuisine', desc: 'French cooking techniques blended with local Tamil spices — a flavor explosion.', icon: Utensils, color: 'from-rose-400 to-pink-500' },
    { title: 'Street Food', desc: 'Mutton samosas, beach-side sundal, wood-fired pizzas, and fresh seafood.', icon: Sparkles, color: 'from-violet-400 to-purple-500' },
];

const QUICK_FACTS = [
    { icon: Landmark, title: 'Former Colony', desc: 'French rule until 1954', color: 'from-blue-400 to-indigo-500' },
    { icon: Globe, title: 'Languages', desc: 'Tamil, French, English', color: 'from-violet-400 to-purple-500' },
    { icon: Sun, title: 'Best Time', desc: 'Oct to March (Winter)', color: 'from-amber-400 to-orange-500' },
    { icon: MapPin, title: 'Territory', desc: 'Union Territory of India', color: 'from-emerald-400 to-teal-500' },
];

export default function AboutPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">

            {/* ═══════════════ HERO ═══════════════ */}
            <section ref={heroRef} className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
                    <div className="absolute inset-0 bg-slate-900" />
                    <Image src="/images/about-hero.jpg" alt="Puducherry Promenade Beach" fill className="object-cover object-center" priority />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-slate-950/80 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent z-[1]" />
                <div className="absolute inset-0 z-[2] shadow-[inset_0_0_120px_40px_rgba(0,0,0,0.3)]" />

                <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="space-y-6"
                    >
                        <Badge className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 text-sm uppercase tracking-[0.3em] backdrop-blur-xl border-white/10 font-medium rounded-full">
                            <Compass className="w-3.5 h-3.5 mr-2" />
                            Explore the Unexplored
                        </Badge>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]">
                            <span className="block">The French Riviera</span>
                            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">of the East</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                            Where colonial French heritage meets spiritual Tamil culture, creating a coastal paradise unlike anywhere else.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════ QUICK FACTS (Overlapping) ═══════════════ */}
            <section className="relative z-20 -mt-20 pb-24">
                <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {QUICK_FACTS.map((fact, i) => (
                            <motion.div
                                key={fact.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: 'spring', bounce: 0.2 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${fact.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                                    <fact.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{fact.title}</h3>
                                <p className="text-sm text-slate-500">{fact.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ TIMELINE ═══════════════ */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <Badge className="bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                            History
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            A Journey Through
                            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Time</span>
                        </h2>
                    </motion.div>

                    {/* Vertical timeline */}
                    <div className="relative">
                        {/* Center line */}
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-violet-500/50 md:-translate-x-px" />

                        <div className="space-y-12">
                            {TIMELINE.map((item, i) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, type: 'spring', bounce: 0.2 }}
                                    className={`relative flex items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg ring-4 ring-slate-50 dark:ring-slate-900`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pl-20 md:pl-0 md:w-1/2">
                                        <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-lg transition-shadow ${i % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                                            <Badge variant="outline" className="mb-3 border-slate-300 dark:border-slate-600 text-xs font-bold">
                                                {item.year}
                                            </Badge>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block md:w-1/2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ CULTURE GRID ═══════════════ */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14 space-y-4"
                    >
                        <Badge className="bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                            Culture & Lifestyle
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Experience the
                            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> Blend</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl">
                            Tamil traditions and French aesthetics create something entirely unique.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {CULTURE.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: 'spring', bounce: 0.2 }}
                                className="group relative h-[340px] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800" />
                                <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />

                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-white/70 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ FOOD ═══════════════ */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <Badge className="bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                            <Heart className="w-3 h-3 mr-1.5 fill-rose-500" />
                            Culinary Journey
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            A Culinary
                            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"> Paradise</span>
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-lg">
                            From crispy baguettes to spicy Chettinad curries — your taste buds will thank you.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {FOOD.map((food, i) => (
                            <motion.div
                                key={food.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, type: 'spring', bounce: 0.2 }}
                                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${food.color} flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <food.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{food.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{food.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA ═══════════════ */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-slate-950" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-slate-950 to-violet-950/50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px]" />

                <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                            Ready to Explore
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Puducherry?</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Let TrekBuddy be your intelligent companion — from planning to exploring.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <Link href="/dashboard/planner">
                                <Button size="lg" className="group rounded-full px-10 h-16 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-2xl shadow-cyan-500/20 transition-all duration-500 hover:scale-105">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Planning
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/dashboard/categories">
                                <Button variant="outline" size="lg" className="rounded-full px-8 h-16 text-lg font-semibold border-slate-700 text-white hover:text-white hover:bg-white/5">
                                    Browse Categories
                                    <ChevronRight className="ml-1 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
