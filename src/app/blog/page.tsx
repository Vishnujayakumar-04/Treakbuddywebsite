'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PenTool, ArrowLeft } from 'lucide-react';
import { CinematicHero } from '@/components/home/CinematicHero';

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
            <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <PenTool className="w-12 h-12 text-cyan-500" />
                    </div>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white"
                >
                    Our Travel Blog is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Brewing</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
                >
                    We're carefully curating the best stories, hidden gems, and travel tips for your perfect Puducherry adventure. 
                    Check back soon for inspiring content!
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link href="/">
                        <Button className="rounded-full px-8 h-12 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
