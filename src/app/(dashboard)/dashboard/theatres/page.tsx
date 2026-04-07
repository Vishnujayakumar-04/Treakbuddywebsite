'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Film, Star, Navigation, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

interface Theatre {
    id: string;
    name: string;
    category: string;
    type: string;
    rating: number;
    location: string;
    image: string;
    features?: string[];
}

// Fallback seed data if the Firestore collection is entirely empty for demonstration
const SEED_DATA = [
  { name: "PVR Cinemas - Providence Mall", category: "theatre", location: "Providence Mall, Puducherry", type: "Multiplex", rating: 4.6, image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&fit=crop", features: ["AC", "Food Court", "Parking"] },
  { name: "Jeeva Rukmani Cinemas", category: "theatre", location: "Anna Salai, Puducherry", type: "Multiplex", rating: 4.3, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&fit=crop", features: ["Dolby Sound", "Parking"] },
  { name: "Rathna Theatre", category: "theatre", location: "MG Road, Puducherry", type: "Single Screen", rating: 4.1, image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=400&fit=crop", features: ["Affordable", "Local Favorite"] },
  { name: "Balaji Theatre 70MM", category: "theatre", location: "Reddiarpalayam, Puducherry", type: "Single Screen", rating: 4.0, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&fit=crop", features: ["Budget Friendly"] },
  { name: "Shanmuga Cinemas", category: "theatre", location: "Lawspet, Puducherry", type: "Multiplex", rating: 4.2, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&fit=crop", features: ["AC", "Snacks"] },
  { name: "Ashok Theatre", category: "theatre", location: "Villiyanur, Puducherry", type: "Single Screen", rating: 3.9, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400&fit=crop", features: ["Budget"] }
];

export default function TheatresPage() {
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const q = query(
                collection(db, 'places'),
                where('category', '==', 'theatre')
            );
            
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Theatre[];
            
            // Client-side sort by rating (High to Low) avoids complex Firestore indexing requirements
            data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setTheatres(data);
        } catch (error) {
            console.error("Error fetching theatres:", error);
            toast.error("Failed to load theatres.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTheatres = theatres.filter(t => {
        if (filterCategory === 'all') return true;
        if (filterCategory === 'multiplex') return t.type === 'Multiplex';
        if (filterCategory === 'single') return t.type === 'Single Screen';
        return true;
    });

    const handleGenerateDemoData = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Seeding demo data...");
        try {
            for (const item of SEED_DATA) {
                await addDoc(collection(db, 'places'), item);
            }
            toast.success("Demo data injected successfully!", { id: loadingToast });
            await fetchData();
        } catch(e) {
            toast.error("You don't have permission to write to this database natively.", { id: loadingToast });
            console.error(e);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
            </div>
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container px-4 md:px-6 max-w-6xl mx-auto pt-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                            <Film className="w-3 h-3 mr-1.5" />
                            Entertainment
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                            Cinemas & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-600">Theatres</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg">
                            Catch the latest movies in Puducherry across premium multiplexes and budget single screens.
                        </p>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
                >
                    <Tabs defaultValue="all" onValueChange={setFilterCategory} className="w-full">
                        <TabsList className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 h-12 p-1 rounded-xl">
                            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all px-6">
                                All Theatres
                            </TabsTrigger>
                            <TabsTrigger value="multiplex" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all px-6">
                                Multiplex
                            </TabsTrigger>
                            <TabsTrigger value="single" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all px-6">
                                Single Screen
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </motion.div>

                {/* Content Grid */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-[340px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse" />
                            ))}
                        </motion.div>
                    ) : filteredTheatres.length > 0 ? (
                        <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTheatres.map((theatre, idx) => {
                                // Smart Tag Logic
                                const isTopRated = theatre.rating > 4.3;
                                const isPremium = theatre.type === 'Multiplex';
                                const isBudget = theatre.type === 'Single Screen';

                                return (
                                    <motion.div
                                        key={theatre.id || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 relative flex flex-col"
                                    >
                                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            {theatre.image && (
                                                <Image 
                                                    src={theatre.image} 
                                                    alt={theatre.name} 
                                                    fill 
                                                    unoptimized
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                                            
                                            {/* Top Overlay Badges */}
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                                <Badge className="bg-black/40 backdrop-blur-md text-white border-white/10 hover:bg-black/60 shadow-lg">
                                                    {theatre.type}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white px-2.5 py-1 rounded-lg font-bold shadow-xl backdrop-blur-md text-sm">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                    {theatre.rating}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                {theatre.name}
                                            </h3>
                                            
                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed mb-4">
                                                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                {theatre.location}
                                            </p>

                                            {/* Smart Tags Array & Features */}
                                            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                                {isTopRated && <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">🌟 Top Rated</Badge>}
                                                {isPremium && <Badge variant="outline" className="text-violet-600 border-violet-200 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-900">✨ Premium</Badge>}
                                                {isBudget && <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900">💰 Budget</Badge>}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty" 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-sm"
                        >
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <AlertCircle className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Theatres Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                We couldn&apos;t find any cinemas matching your criteria, or the database hasn&apos;t been populated yet.
                            </p>
                            {theatres.length === 0 && (
                                <Button 
                                    onClick={handleGenerateDemoData}
                                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 transition-all"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Seed Demo Data
                                </Button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
