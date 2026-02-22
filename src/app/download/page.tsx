'use client';

import { motion } from 'framer-motion';
import { Smartphone, QrCode, Star, Shield, Zap, MapPin, Wifi, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { Metadata } from 'next';

const FEATURES = [
    { icon: Zap, label: 'AI Itineraries', desc: 'Get day-wise trip plans in seconds powered by Groq AI.' },
    { icon: MapPin, label: 'Offline Maps', desc: 'Access 50+ places even without an internet connection.' },
    { icon: Wifi, label: 'Real-time Routes', desc: 'Live bus routes, auto fares, and rental info.' },
    { icon: Bell, label: 'SOS Alerts', desc: 'Emergency contacts and safety features built-in.' },
    { icon: Shield, label: 'Privacy First', desc: 'No data selling. Your trips are yours.' },
    { icon: Star, label: 'Local Insights', desc: 'Curated tips from people who live in Puducherry.' },
];

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* Grid BG */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

                {/* Hero */}
                <div className="text-center mb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="mb-6 bg-cyan-950/50 border-cyan-800 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                            <Smartphone className="w-3 h-3 mr-1.5" />
                            Available on Android & iOS
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6"
                    >
                        Travel Smarter with
                        <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">TrekBuddy</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Your AI-powered companion for exploring Puducherry — from hidden beaches to local flavours. Download the app and unlock the real Puducherry.
                    </motion.p>
                </div>

                {/* Download Buttons + QR */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
                >
                    <a
                        href="https://play.google.com/store"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl px-6 py-4 min-w-[220px] transition-all shadow-2xl hover:shadow-white/10 hover:scale-105"
                    >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" fill="currentColor">
                            <path d="M3.18 23.65a2 2 0 001.92-.21l11.38-6.57-2.79-2.78zm13.3-10.65L4.1.56A2 2 0 003.18.35l10.51 10.5zm3.24-1.86l-2.6-1.5-3.14 3.14 3.14 3.14 2.6-1.5A2 2 0 0020 12a2 2 0 00-.72-1.52l-.56-.34zM4.1 23.44l12.42-7.17-2.79-2.78z" />
                        </svg>
                        <div className="text-left">
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Get it on</p>
                            <p className="text-lg font-black">Google Play</p>
                        </div>
                    </a>

                    <a
                        href="https://apps.apple.com"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl px-6 py-4 min-w-[220px] transition-all shadow-2xl hover:shadow-white/10 hover:scale-105"
                    >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        <div className="text-left">
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Download on the</p>
                            <p className="text-lg font-black">App Store</p>
                        </div>
                    </a>

                    <div className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <QrCode className="w-20 h-20 text-cyan-400" />
                        <p className="text-xs text-slate-400">Scan to download</p>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div className="mb-24">
                    <h2 className="text-3xl font-black text-center mb-12">Why Travelers Love TrekBuddy</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feat, i) => {
                            const Icon = feat.icon;
                            return (
                                <motion.div
                                    key={feat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                                        <Icon className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{feat.label}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="text-center p-10 rounded-3xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-800/30"
                >
                    <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <p className="text-2xl font-black mb-2">4.8 / 5 Stars</p>
                    <p className="text-slate-400">Rated by early travelers across Puducherry</p>
                </motion.div>
            </div>
        </div>
    );
}
