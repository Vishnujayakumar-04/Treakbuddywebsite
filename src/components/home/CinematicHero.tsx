'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// --- Image Assets (Verified Unsplash — Pondicherry-themed) ---
const COLUMN_1 = [
    "/assets/beaches/promenade beach.jpg",
    "/assets/spot/white town walks.jfif",
    "/assets/stay/villa shanti.webp",
];

const COLUMN_2 = [
    "/assets/beaches/serenity beach.jpg",
    "/assets/stay/hotel atithi.jfif",
    "/assets/beaches/paradise beach.jpeg",
];

const COLUMN_3 = [
    "/assets/spot/aayi mandapam.jfif",
    "/assets/beaches/auroville beach.jpg",
    "/assets/stay/accord.jfif",
];



export function CinematicHero() {
    const router = useRouter();
    const { user } = useAuth();

    const handleNavigation = (path: string) => {
        if (user) {
            router.push(path);
        } else {
            router.push(`/login?redirect=${encodeURIComponent(path)}`);
        }
    };

    return (
        <section className="relative w-full h-screen min-h-[800px] overflow-hidden bg-slate-950 flex flex-col justify-start">

            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 z-10 grid lg:grid-cols-2 gap-8 h-full items-center">

                {/* Left: Content */}
                <div className="w-full pt-32 lg:pt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-medium mb-6 uppercase tracking-wider shadow-lg shadow-cyan-900/20"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>Your Personal Travel Companion</span>
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 font-display">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="block font-serif italic"
                        >
                            Discover
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="block text-white"
                        >
                            Puducherry's
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-serif italic"
                        >
                            Hidden Gems
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed"
                    >
                        Experience the perfect blend of French heritage, spiritual serenity, pristine beaches, and vibrant culture with AI-powered trip planning.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button
                            onClick={() => handleNavigation('/dashboard/categories')}
                            size="lg"
                            className="h-14 px-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-lg shadow-xl shadow-cyan-900/20 group transition-all duration-300"
                        >
                            Start Exploring
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            onClick={() => handleNavigation('/dashboard/planner')}
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 rounded-full bg-transparent border-white/30 text-white hover:bg-white/10 font-medium text-lg backdrop-blur-md transition-all duration-300"
                        >
                            <MapPin className="mr-2 w-5 h-5 text-cyan-400" />
                            Plan Your Trip
                        </Button>
                    </motion.div>

                    {/* Stats or Social Proof (Optional) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-12 flex gap-8 border-t border-slate-800/50 pt-8"
                    >
                        <div>
                            <p className="text-2xl font-bold text-white">50+</p>
                            <p className="text-sm text-slate-400">Hidden Spots</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">24/7</p>
                            <p className="text-sm text-slate-400">AI Guide</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Visual Columns */}
                <div className="relative h-[120%] -my-20 w-full hidden lg:grid grid-cols-3 gap-6 overflow-hidden mask-vertical-fade rotate-[-5deg] opacity-80 hover:opacity-100 transition-opacity duration-700">
                    <ParallaxColumn images={COLUMN_1} yPercent={-50} duration={25} />
                    <ParallaxColumn images={COLUMN_2} yPercent={-50} duration={35} reverse />
                    <ParallaxColumn images={COLUMN_3} yPercent={-50} duration={28} />
                </div>
            </div>

            {/* Bottom Fade for Seamless Integration */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />
        </section>
    );
}

function ParallaxColumn({ images, yPercent, duration, reverse = false }: { images: string[], yPercent: number, duration: number, reverse?: boolean }) {
    // Duplicate images for seamless loop
    const displayImages = [...images, ...images];

    return (
        <motion.div
            initial={{ y: reverse ? yPercent + "%" : "0%" }}
            animate={{ y: reverse ? "0%" : yPercent + "%" }}
            transition={{
                duration: duration,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
            }}
            className="flex flex-col gap-6 will-change-transform"
        >
            {displayImages.map((src, i) => (
                <div key={i} className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src={src}
                        alt="Puducherry scenery"
                        fill
                        unoptimized
                        className="object-cover hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                </div>
            ))}
        </motion.div>
    );
}
