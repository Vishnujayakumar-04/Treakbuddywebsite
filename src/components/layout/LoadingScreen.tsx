'use client';

import { motion } from 'framer-motion';
import { Compass, MapPin, Map, Plane } from 'lucide-react';

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950" />

            {/* Decorative Map Grid Lines */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[size:50px_50px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />

            {/* Central Animated Illustration */}
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">

                {/* 1. Orbiting Plane Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full rounded-full border border-dashed border-slate-800"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-1 rounded-full">
                        <Plane className="w-6 h-6 text-cyan-400 rotate-90" fill="currentColor" />
                    </div>
                </motion.div>

                {/* 2. Inner Pulse Ring */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute w-40 h-40 rounded-full bg-cyan-500/10 blur-xl"
                />

                {/* 3. Central Map Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 w-24 h-24 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl rotate-6 shadow-2xl shadow-cyan-500/20 flex items-center justify-center border border-white/10"
                >
                    <Map className="w-12 h-12 text-white/90" strokeWidth={1.5} />

                    {/* Bouncing Pin */}
                    <motion.div
                        animate={{ y: [-8, 0, -8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-5 -right-5 drop-shadow-lg"
                    >
                        <MapPin className="w-12 h-12 text-rose-500 fill-rose-500 stroke-rose-600" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Typography */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 text-center space-y-3"
            >
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                    Trek<span className="text-cyan-400">Buddy</span>
                </h1>

                <div className="flex items-center justify-center gap-2 text-cyan-200/80 font-medium text-sm uppercase tracking-widest">
                    <Compass className="w-4 h-4 animate-[spin_3s_linear_infinite]" />
                    <span>Discovering Puducherry</span>
                </div>
            </motion.div>

            {/* Modern Loading Bar */}
            <div className="absolute bottom-12 w-64 h-1.5 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                />
            </div>
        </div>
    );
}
