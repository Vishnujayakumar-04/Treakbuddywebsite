'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Landmark, Church, TreePine, UtensilsCrossed, Building2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PLACES_DATA } from '@/services/data/places';

// Helper: find a matching place ID from PLACES_DATA by name (fuzzy)
function findPlaceId(name: string): string | null {
    const normalizedName = name.toLowerCase().trim();
    const match = PLACES_DATA.find(p =>
        p.name.toLowerCase().trim() === normalizedName ||
        p.name.toLowerCase().includes(normalizedName) ||
        normalizedName.includes(p.name.toLowerCase())
    );
    return match ? match.id : null;
}

const FAMOUS_PLACES = {
    historical: [
        { name: 'French War Memorial', location: 'Goubert Avenue', image: 'https://images.unsplash.com/photo-1590680687157-558661845f94?w=800&auto=format&fit=crop&q=80' },
        { name: 'Aayi Mandapam', location: 'White Town', image: 'https://images.unsplash.com/photo-1582510003544-5243789972d0?w=800&auto=format&fit=crop&q=80' },
        { name: 'Bharathi Park', location: 'White Town', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80' },
        { name: 'Arikamedu Archaeological Site', location: 'Arikamedu', image: 'https://images.unsplash.com/photo-1518012312832-96aea3c91144?w=800&auto=format&fit=crop&q=80' },
        { name: 'Kargil War Memorial', location: 'Shanmugha Vilasam', image: 'https://images.unsplash.com/photo-1590680687157-558661845f94?w=800&auto=format&fit=crop&q=80' },
        { name: 'Raj Niwas', location: 'White Town', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80' },
    ],
    temples: [
        { name: 'Manakula Vinayagar Temple', location: 'White Town', image: 'https://images.unsplash.com/photo-1582510003544-5243789972d0?w=800&auto=format&fit=crop&q=80' },
        { name: 'Varadaraja Perumal Temple', location: 'Near French Consulate', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80' },
        { name: 'Kamakshi Amman Temple', location: 'Near Beach', image: 'https://images.unsplash.com/photo-1582556263595-6541f6f6f964?w=800&auto=format&fit=crop&q=80' },
        { name: 'Vedapureeswarar Temple', location: 'Near Serenity Beach', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80' },
        { name: 'Arulmigu Kanniga Parameswari Temple', location: 'Kuruchikuppam', image: 'https://images.unsplash.com/photo-1582556263595-6541f6f6f964?w=800&auto=format&fit=crop&q=80' },
    ],
    nature: [
        { name: 'Paradise Beach', location: 'Chunnambar', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=80' },
        { name: 'Auroville Beach', location: 'Auroville', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
        { name: 'Serenity Beach', location: 'Auroville Road', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=80' },
        { name: 'Ousteri Lake', location: 'Ossudu', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=80' },
        { name: 'Botanical Gardens', location: 'Near Railway Station', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80' },
        { name: 'Pichavaram Mangroves', location: 'Near Chidambaram', image: 'https://images.unsplash.com/photo-1529315895786-9a25b16f3c15?w=800&auto=format&fit=crop&q=80' },
        { name: 'Bharathi Park', location: 'White Town', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80' },
    ],
    churches: [
        { name: 'Sacred Heart Basilica', location: 'Subbaiah Salai', image: 'https://images.unsplash.com/photo-1548625361-987747e70e3c?w=800&auto=format&fit=crop&q=80' },
        { name: 'Immaculate Conception Cathedral', location: 'Mission Street', image: 'https://images.unsplash.com/photo-1575402095034-7a0ad32152a5?w=800&auto=format&fit=crop&q=80' },
        { name: 'Our Lady of Angels Church', location: 'Rue Dumas', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80' },
        { name: "St. Andrew's Church", location: 'Church Street', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80' },
    ],
    popular: [
        { name: 'Promenade Beach', location: 'Beach Road', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
        { name: 'Sri Aurobindo Ashram', location: 'Marine Street', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&auto=format&fit=crop&q=80' },
        { name: 'Matrimandir', location: 'Auroville', image: 'https://images.unsplash.com/photo-1623083984360-15bd8434cc85?w=800&auto=format&fit=crop&q=80' },
        { name: 'Puducherry Museum', location: 'Bharathi Park', image: 'https://images.unsplash.com/photo-1566127444510-a8dc77cda928?w=800&auto=format&fit=crop&q=80' },
        { name: 'White Town Walks', location: 'French Quarter', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80' },
        { name: 'Chunnambar Backwater', location: 'Chunnambar', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80' },
        { name: 'Serenity Beach', location: 'Kottakuppam', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=80' },
        { name: 'Paradise Beach', location: 'Chunnambar', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=80' },
    ],
    food: [
        { name: 'Ratatouille', type: 'Vegetarian', restaurant: 'Various French Cafés' },
        { name: 'Crepes', type: 'Vegetarian', restaurant: 'Café des Arts' },
        { name: 'Masala Dosa', type: 'Vegetarian', restaurant: 'Surguru' },
        { name: 'Kadugu Yerra', type: 'Vegetarian', restaurant: 'Local Eateries' },
        { name: 'Idiyappam with Coconut Milk', type: 'Vegetarian', restaurant: 'Traditional Restaurants' },
        { name: 'Prawn Risotto', type: 'Non-Vegetarian', restaurant: 'Villa Shanti' },
        { name: 'Fish Vindaloo', type: 'Non-Vegetarian', restaurant: 'Coromandel Café' },
        { name: 'Chicken Chettinad', type: 'Non-Vegetarian', restaurant: 'Le Dupleix' },
        { name: 'Tandoori Prawns', type: 'Non-Vegetarian', restaurant: 'Various Restaurants' },
        { name: 'Mutton Curry', type: 'Non-Vegetarian', restaurant: 'Local Restaurants' },
    ],
    restaurants: [
        { name: 'Cafe des Arts', cuisine: 'French', location: 'White Town', rating: 4.5 },
        { name: 'Coromandel Cafe', cuisine: 'Seafood', location: 'Rue Suffren', rating: 4.4 },
        { name: 'Villa Shanti', cuisine: 'Multi-cuisine', location: 'Suffren Street', rating: 4.6 },
        { name: 'Baker Street', cuisine: 'Bakery', location: 'Bussy Street', rating: 4.5 },
        { name: 'Le Cafe', cuisine: 'Cafe', location: 'Beach Road', rating: 4.3 },
    ],
};

const CATEGORIES = [
    { id: 'historical', label: 'Historical Sites', icon: Landmark, count: FAMOUS_PLACES.historical.length },
    { id: 'temples', label: 'Temples', icon: Building2, count: FAMOUS_PLACES.temples.length },
    { id: 'nature', label: 'Nature & Wildlife', icon: TreePine, count: FAMOUS_PLACES.nature.length },
    { id: 'churches', label: 'Churches', icon: Church, count: FAMOUS_PLACES.churches.length },
    { id: 'popular', label: 'Popular Places', icon: MapPin, count: FAMOUS_PLACES.popular.length },
    { id: 'food', label: 'Famous Food', icon: UtensilsCrossed, count: FAMOUS_PLACES.food.length },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, count: FAMOUS_PLACES.restaurants.length },
];

// Component: clickable place card that navigates to detail page
function PlaceCard({ place, idx }: { place: { name: string; location: string; image: string }; idx: number }) {
    const placeId = findPlaceId(place.name);

    const cardContent = (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
        >
            {place.image && (
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Arrow indicator on hover */}
                    <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                </div>
            )}
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{place.name}</h3>
                {place.location && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {place.location}
                    </p>
                )}
            </div>
        </motion.div>
    );

    if (placeId) {
        return (
            <Link href={`/dashboard/places/${placeId}`} key={idx}>
                {cardContent}
            </Link>
        );
    }

    // No matching id found — still render the card but with a coming soon alert
    return (
        <div key={idx} onClick={() => alert(`Details for "${place.name}" coming soon!`)} role="button" tabIndex={0}>
            {cardContent}
        </div>
    );
}

function FamousPlacesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState(searchParams.get('tab') || 'historical');

    const handleTabChange = (value: string) => {
        setActiveCategory(value);
        router.replace(`?tab=${value}`, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8 lg:py-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-12 space-y-4"
                >
                    <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                        <MapPin className="w-4 h-4 mr-2 inline-block" />
                        Tourist Guide
                    </Badge>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Famous Places in <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">Puducherry</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        Discover the best tourist attractions, historical sites, and culinary delights
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <Tabs value={activeCategory} onValueChange={handleTabChange} className="space-y-8">
                    {/* Sticky Category Navigation */}
                    <div className="sticky top-20 z-30 px-2 pb-4 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent dark:from-slate-950 dark:via-slate-950 pt-2">
                        <TabsList className="h-auto bg-transparent dark:bg-transparent border-0 shadow-none p-0 w-full flex flex-nowrap justify-center gap-1 sm:gap-2">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <TabsTrigger
                                        key={cat.id}
                                        value={cat.id}
                                        className="whitespace-nowrap rounded-full px-2 py-2 sm:px-3 sm:py-2.5 font-bold text-[11px] sm:text-xs md:text-sm transition-all duration-300 flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm
                                            data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 
                                            data-[state=active]:text-white data-[state=active]:border-transparent
                                            data-[state=active]:shadow-md
                                            text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
                                    >
                                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{cat.label}</span>
                                        <span className="ml-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] sm:text-[10px] font-extrabold
                                            group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white text-slate-500">
                                            {cat.count}
                                        </span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    {/* Places Grid */}
                    {Object.keys(FAMOUS_PLACES).filter(key => key !== 'food' && key !== 'restaurants').map(category => (
                        <TabsContent key={category} value={category} className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {(FAMOUS_PLACES[category as keyof typeof FAMOUS_PLACES] as { name: string; location: string; image: string }[]).map((place, idx) => (
                                    <PlaceCard key={idx} place={place} idx={idx} />
                                ))}
                            </motion.div>
                        </TabsContent>
                    ))}

                    {/* Food List */}
                    <TabsContent value="food" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vegetarian */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                    <UtensilsCrossed className="w-6 h-6" />
                                    Vegetarian
                                </h3>
                                {FAMOUS_PLACES.food.filter(f => f.type === 'Vegetarian').map((food, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white">{food.name}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{food.restaurant}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Non-Vegetarian */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                    <UtensilsCrossed className="w-6 h-6" />
                                    Non-Vegetarian
                                </h3>
                                {FAMOUS_PLACES.food.filter(f => f.type === 'Non-Vegetarian').map((food, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white">{food.name}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{food.restaurant}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Restaurants */}
                    <TabsContent value="restaurants" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {FAMOUS_PLACES.restaurants.map((restaurant, idx) => {
                                const restaurantId = findPlaceId(restaurant.name);
                                const card = (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer"
                                    >
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{restaurant.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{restaurant.cuisine}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {restaurant.location}
                                            </p>
                                            <Badge className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200">
                                                ⭐ {restaurant.rating}
                                            </Badge>
                                        </div>
                                    </motion.div>
                                );
                                return restaurantId ? (
                                    <Link key={idx} href={`/dashboard/places/${restaurantId}`}>{card}</Link>
                                ) : (
                                    <div key={idx}>{card}</div>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default function FamousPlacesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
            <FamousPlacesContent />
        </Suspense>
    );
}
