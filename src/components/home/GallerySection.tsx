'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';

const GALLERY_ITEMS = [
    {
        id: 1,
        src: '/assets/spot/aayi mandapam.jfif',
        alt: 'Aayi Mandapam',
        className: 'md:col-span-1 md:row-span-2',
        location: 'White Town'
    },
    {
        id: 2,
        src: '/assets/spot/white town walks.jfif',
        alt: 'French Quarter Streets',
        className: 'md:col-span-1 md:row-span-1',
        location: 'Rue Romain Rolland'
    },
    {
        id: 3,
        src: '/assets/spot/french wa rmemorial.jfif',
        alt: 'Colonial Architecture',
        className: 'md:col-span-1 md:row-span-1',
        location: 'French Colony'
    },
    {
        id: 4,
        src: '/assets/beaches/paradise beach.jpeg',
        alt: 'Paradise Beach Sunrise',
        className: 'md:col-span-2 md:row-span-1',
        location: 'Paradise Beach'
    },
    {
        id: 5,
        src: '/assets/spot/museum.jfif',
        alt: 'Sacred Heart Basilica',
        className: 'md:col-span-1 md:row-span-2',
        location: 'Subbaiah Salai'
    },
    {
        id: 6,
        src: '/assets/beaches/auroville beach.jpg',
        alt: 'Matrimandir Auroville',
        className: 'md:col-span-1 md:row-span-1',
        location: 'Auroville'
    },
];

// Parallax Columns
const COLUMN_1 = [...GALLERY_ITEMS, ...GALLERY_ITEMS, ...GALLERY_ITEMS];
const COLUMN_2 = [...GALLERY_ITEMS.slice().reverse(), ...GALLERY_ITEMS.slice().reverse(), ...GALLERY_ITEMS.slice().reverse()];
const COLUMN_3 = [...GALLERY_ITEMS, ...GALLERY_ITEMS, ...GALLERY_ITEMS];

function GalleryCard({ item, index }: { item: typeof GALLERY_ITEMS[0], index: number }) {
    return (
        <div className="relative w-full h-[320px] rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
                sizes="(max-width: 768px) 100vw, 320px"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute bottom-0 left-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-white z-10">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-1.5 text-violet-300">
                    <Camera className="w-3 h-3" />
                    {item.location}
                </div>
                <h3 className="font-bold text-lg leading-tight text-white mb-2">{item.alt}</h3>
            </div>
        </div>
    );
}

export function GallerySection() {
    return (
        <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden font-sans">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Badge className="bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800 px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
                            Photo Gallery
                        </Badge>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display"
                    >
                        Glimpses of <span className="font-serif italic text-violet-500">Paradise</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto"
                    >
                        Immerse yourself in the beauty of Pondicherry through our curated collection of stunning photographs.
                    </motion.p>
                </div>
            </div>

            {/* Parallax Marquee Grid */}
            <div className="relative h-[800px] -mt-10 overflow-hidden">
                {/* Gradient Fades Top & Bottom */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent z-10 pointer-events-none" />

                {/* Tilted Grid Container */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 transform rotate-[-6deg] scale-110 -translate-y-24 md:-mx-12 opacity-90 hover:opacity-100 transition-opacity duration-500">

                    {/* Column 1: Upward Scroll */}
                    <div className="flex flex-col gap-6 animate-marquee-vertical">
                        {COLUMN_1.map((item, i) => (
                            <GalleryCard key={`c1-${i}`} item={item} index={i} />
                        ))}
                    </div>

                    {/* Column 2: Downward Scroll (Offset) */}
                    <div className="flex flex-col gap-6 animate-marquee-vertical-reverse pt-24">
                        {COLUMN_2.map((item, i) => (
                            <GalleryCard key={`c2-${i}`} item={item} index={i} />
                        ))}
                    </div>

                    {/* Column 3: Upward Scroll (Hidden on Mobile) */}
                    <div className="hidden md:flex flex-col gap-6 animate-marquee-vertical pt-12">
                        {COLUMN_3.map((item, i) => (
                            <GalleryCard key={`c3-${i}`} item={item} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
