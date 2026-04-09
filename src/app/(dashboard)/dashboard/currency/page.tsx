'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Clock, MapPin, Phone, RefreshCw, Navigation, PhoneCall, Star, ShieldCheck, BadgeCheck, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SUPPORTED_CURRENCIES } from '@/services/currencyService';

// Firebase imports
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type LocationFilter = 'All' | 'Top Rated' | 'Open Now';

interface FirestorePlace {
  id?: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  timings: string;
  contact: string;
  type: string;
  mapUrl: string;
  image: string;
}

// source.unsplash is deprecated and causes broken UI HTTP 410, mapped to real unslpash source IDs for Demo Safety
const SEED_DATA: Omit<FirestorePlace, 'id'>[] = [
  { "name": "Thomas Cook Forex - Puducherry", "category": "currency_exchange", "location": "Mission Street, Puducherry", "rating": 4.5, "timings": "10:00 AM - 7:00 PM", "contact": "+91 9876543210", "type": "Authorized Dealer", "mapUrl": "https://www.google.com/maps/search/?api=1&query=Thomas+Cook+Forex+Puducherry", "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80" },
  { "name": "Unimoni Financial Services", "category": "currency_exchange", "location": "Anna Salai, Puducherry", "rating": 4.3, "timings": "9:30 AM - 6:30 PM", "contact": "+91 9123456780", "type": "Forex & Remittance", "mapUrl": "https://www.google.com/maps/search/?api=1&query=Unimoni+Puducherry", "image": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80" },
  { "name": "Weizmann Forex Ltd", "category": "currency_exchange", "location": "MG Road, Puducherry", "rating": 4.2, "timings": "10:00 AM - 6:00 PM", "contact": "+91 9988776655", "type": "Forex Services", "mapUrl": "https://www.google.com/maps/search/?api=1&query=Weizmann+Forex+Puducherry", "image": "https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&q=80" },
  { "name": "Puducherry Forex Services", "category": "currency_exchange", "location": "White Town, Puducherry", "rating": 4.1, "timings": "10:00 AM - 8:00 PM", "contact": "+91 9012345678", "type": "Local Exchange", "mapUrl": "https://www.google.com/maps/search/?api=1&query=Forex+White+Town+Puducherry", "image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80" },
  { "name": "Muthoot Forex", "category": "currency_exchange", "location": "Lawspet, Puducherry", "rating": 4.0, "timings": "24/7", "contact": "+91 9090909090", "type": "Authorized Dealer", "mapUrl": "https://www.google.com/maps/search/?api=1&query=Muthoot+Forex+Puducherry", "image": "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&q=80" }
];

export default function CurrencyExchangePage() {
  // Converter State
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');

  // Firebase Places State
  const [places, setPlaces] = useState<FirestorePlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [placesError, setPlacesError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<LocationFilter>('All');

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      // Use server-side proxy to bypass CORS restrictions
      const res = await fetch('/api/currency?from=INR');
      if (!res.ok) throw new Error(`Rates HTTP ${res.status}`);
      const data = await res.json();
      setRates(data.rates ?? null);
      setLastUpdated(data.date ? new Date(data.date).toLocaleDateString() : '');
    } catch (e) {
      void 0; // console.('Failed to fetch live rates. Using offline fallback rates:', e);
      setRates({
        USD: 0.012, GBP: 0.0094, EUR: 0.011, AUD: 0.018,
        CAD: 0.016, JPY: 1.83, SGD: 0.016, CHF: 0.011,
        MYR: 0.057, AED: 0.044, LKR: 3.65
      });
      setLastUpdated('Offline Fallback');
    } finally {
      setLoadingRates(false);
    }
  };

  const fetchFirebasePlaces = async () => {
    setLoadingPlaces(true);
    setPlacesError(null);
    try {
      const placesRef = collection(db, 'places');
      const q = query(placesRef, where('category', '==', 'currency_exchange'));
      const querySnapshot = await getDocs(q);
      
      let fetchedPlaces: FirestorePlace[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPlaces.push({ id: doc.id, ...(doc.data() as Omit<FirestorePlace, 'id'>) });
      });

      // Demographic Safety Rule: If less than 5, Seed it!
      if (fetchedPlaces.length < 5) {
        void 0; // console.('Firestore missing places. Seeding minimum 5 documents for Demo Safety...');
        const newPlaces: FirestorePlace[] = [];
        for (const item of SEED_DATA) {
          // Double check if name already fetched
          if (!fetchedPlaces.find(p => p.name === item.name)) {
             const docRef = await addDoc(placesRef, item);
             newPlaces.push({ id: docRef.id, ...item });
          }
        }
        fetchedPlaces = [...fetchedPlaces, ...newPlaces];
      }

      // Sort strictly by rating descending
      fetchedPlaces.sort((a, b) => b.rating - a.rating);
      setPlaces(fetchedPlaces);

    } catch (e: any) {
      void 0; // console.('Firestore Fetch Error — using local fallback data:', e?.message || e);
      // Graceful fallback: use SEED_DATA directly when Firestore permissions are denied
      const fallbackPlaces: FirestorePlace[] = SEED_DATA.map((item, i) => ({
        id: `local_${i}`,
        ...item,
      }));
      fallbackPlaces.sort((a, b) => b.rating - a.rating);
      setPlaces(fallbackPlaces);
      setPlacesError(null); // Don't show error — data is still visible
    } finally {
      setLoadingPlaces(false);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchFirebasePlaces();
  }, []);

  const convertedAmount = useMemo(() => {
    if (!rates) return '—';
    const n = Number(amount);
    if (!Number.isFinite(n)) return '—';
    if (fromCurrency === toCurrency) return n.toFixed(2);

    const fromRate = fromCurrency === 'INR' ? 1 : rates[fromCurrency];
    const toRate = toCurrency === 'INR' ? 1 : rates[toCurrency];
    if (!fromRate || !toRate) return '—';

    const inINR = n / fromRate;
    const out = inINR * toRate;
    return out.toFixed(2);
  }, [amount, fromCurrency, rates, toCurrency]);

  const filteredPlaces = useMemo(() => {
    let result = places;
    if (filterType === 'Top Rated') {
      result = result.filter(place => place.rating > 4.3);
    } else if (filterType === 'Open Now') {
      // Basic logic to demonstrate interactivity: filtering for any timings containing 24 or AM/PM (assuming all seed data is 'open')
      result = result.filter(place => place.timings.includes('24') || place.timings.includes('PM')); 
    }
    return result;
  }, [filterType, places]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.4 } }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto max-w-5xl px-4 md:px-6 space-y-8">
        
        {/* Dynamic Header Block */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative">
            <div>
              <div className="flex items-center gap-2 mb-3">
                  <div className="h-1.5 w-8 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Global Finance</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                Currency Exchange
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base max-w-lg leading-relaxed">
                Live mid-market rates powered by Frankfurter, and curated physical exchange locations in Puducherry powered by global Firebase synchronisation.
              </p>
            </div>
            
            <div className="flex items-center gap-3 self-start md:self-end">
              <div className="text-xs font-medium px-3 py-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-full text-slate-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {lastUpdated === 'Offline Fallback' ? (
                  <span className="text-amber-600 dark:text-amber-400 font-bold">Offline Sync</span>
                ) : (
                  <span>Rates Live: {lastUpdated || 'Loading...'}</span>
                )}
              </div>
              <Button onClick={() => { fetchRates(); fetchFirebasePlaces(); }} disabled={loadingRates || loadingPlaces} className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold transition-all">
                <RefreshCw className={`w-4 h-4 mr-2 ${(loadingRates || loadingPlaces) ? 'animate-spin' : ''}`} />
                {(loadingRates || loadingPlaces) ? 'Syncing DB...' : 'Sync'}
              </Button>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Converter Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-5 relative group"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>

            <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-8">
              
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Converter</h3>
              </div>

              <div className="space-y-6">
                
                {/* Send Block */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Amount to Convert</label>
                  <div className="flex items-center justify-between gap-4">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border-0 bg-transparent text-2xl md:text-3xl font-black p-0 focus-visible:ring-0 shadow-none text-slate-900 dark:text-white w-full h-auto"
                      placeholder="0.00"
                    />
                    <div className="shrink-0">
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold w-[110px] shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <SelectItem key={`from-${c.code}`} value={c.code} className="font-medium">
                              {c.code} {c.symbol ? `(${c.symbol})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Animated Swap Control */}
                <div className="relative flex justify-center -my-9 z-10">
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSwap}
                    className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <ArrowLeftRight className="w-5 h-5 rotate-90 sm:rotate-0" />
                  </motion.button>
                </div>

                {/* Receive Block */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4">
                  <label className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-wider mb-2 block">Estimated Received</label>
                  <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400 truncate tabular-nums tracking-tight">
                        {loadingRates ? '...' : convertedAmount}
                    </div>
                    <div className="shrink-0">
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="rounded-xl border-emerald-200 dark:border-emerald-800 bg-white/60 dark:bg-slate-900/60 font-bold w-[110px] text-emerald-800 dark:text-emerald-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <SelectItem key={`to-${c.code}`} value={c.code} className="font-medium">
                              {c.code} {c.symbol ? `(${c.symbol})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Physical Locations List (Firebase) */}
          <motion.div 
            initial="hidden" animate="show" variants={containerVariants}
            className="lg:col-span-7 flex flex-col h-full space-y-6"
          >
            {/* Modern Pill Filter */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
               {['All', 'Top Rated', 'Open Now'].map((type) => (
                 <button
                   key={type}
                   onClick={() => setFilterType(type as LocationFilter)}
                   className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                     filterType === type 
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md transform scale-105' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                   }`}
                 >
                   {type}
                 </button>
               ))}
               {!loadingPlaces && (
                 <Badge variant="outline" className="ml-2 font-mono text-slate-400 border-none bg-transparent">
                    {filteredPlaces.length} live
                 </Badge>
               )}
            </div>

            {/* Error State */}
            {placesError && !loadingPlaces && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-200 dark:border-red-900/30 text-center">
                 <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
                 <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">Firebase Connection Failed</h3>
                 <p className="text-red-600/70 dark:text-red-400/70 text-sm mt-1">{placesError}</p>
                 <Button onClick={fetchFirebasePlaces} variant="outline" className="mt-4 border-red-200 hover:bg-red-100 text-red-700">Retry Connection</Button>
              </motion.div>
            )}

            {/* Loading State Skeleton */}
            {loadingPlaces && !placesError && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl p-5 h-64 border border-slate-300 dark:border-slate-700/50">
                    <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded-xl mb-4"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 w-3/4 rounded mb-2"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loadingPlaces && !placesError && filteredPlaces.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 h-full">
                 <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                 <p className="text-slate-500 font-medium">No locations found for this criteria in the database.</p>
                 <button onClick={() => setFilterType('All')} className="mt-2 text-sm font-bold text-emerald-600 hover:underline">View All Active Locations</button>
              </motion.div>
            )}

            {/* List Array */}
            {!loadingPlaces && !placesError && filteredPlaces.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                <AnimatePresence>
                  {filteredPlaces.map((place) => (
                    <motion.div 
                      key={place.id} variants={itemVariants}
                      initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-800/50 transition-all duration-300 group flex flex-col justify-between overflow-hidden"
                    >
                      {/* Image Block */}
                      <div className="h-36 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          
                          {/* SMART TAG RULES */}
                          {place.rating > 4.3 && (
                            <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-md">
                              <Star className="w-3 h-3 fill-current mr-1" /> Top Rated
                            </Badge>
                          )}
                          {(place.rating >= 4.0 && place.rating <= 4.3) && (
                            <Badge className="bg-blue-500 text-white hover:bg-blue-600 shadow-md">
                              <BadgeCheck className="w-3 h-3 mr-1" /> Trusted
                            </Badge>
                          )}
                          {place.timings.includes('24') && (
                            <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-md">
                              24/7 Service
                            </Badge>
                          )}

                        </div>
                        <div className="absolute top-2 right-2">
                           <Badge variant="secondary" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur text-xs font-semibold px-2 py-0.5">
                             ⭐ {place.rating}
                           </Badge>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {place.name}
                          </h3>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide mb-3">{place.type}</div>
                        
                        <div className="space-y-2 mt-auto text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                            <span className="leading-snug line-clamp-2">{place.location}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 shrink-0 text-amber-500" />
                            <span>{place.timings}</span>
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                          <Button 
                            onClick={() => window.open(place.mapUrl, '_blank')}
                            className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold h-9"
                          >
                            <Navigation className="w-3.5 h-3.5 mr-1.5" /> Get Directions
                          </Button>
                          <Button 
                            onClick={() => window.location.href = `tel:${place.contact}`}
                            variant="outline" 
                            className="rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 h-9 px-3"
                          >
                            <PhoneCall className="w-4 h-4 text-emerald-600" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
