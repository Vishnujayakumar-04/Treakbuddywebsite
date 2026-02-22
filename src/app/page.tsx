'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Waves, Landmark, Utensils, Flower2, Umbrella,
  Star, Sparkles, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BestTimeSection } from '@/components/home/BestTimeSection';
import { CinematicHero } from '@/components/home/CinematicHero';
import { GallerySection } from '@/components/home/GallerySection';

// ... (existing imports)

import { Footer } from '@/components/layout/Footer';

/* ─────────── DATA ─────────── */

const CATEGORIES = [
  { id: 'beaches', title: 'Beaches', image: 'https://images.unsplash.com/photo-1543362906-ac1b4526c1d0?q=80&w=800', icon: Waves, count: '5 Spots', color: 'from-cyan-400 to-blue-500' },
  { id: 'heritage', title: 'Heritage', image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=60', icon: Landmark, count: '12 Sites', color: 'from-amber-400 to-orange-500' },
  { id: 'food', title: 'Food & Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', icon: Utensils, count: '20+ Cafes', color: 'from-rose-400 to-pink-500' },
  { id: 'spiritual', title: 'Spiritual', image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800&q=80', icon: Flower2, count: '4 Centers', color: 'from-violet-400 to-purple-500' },
  { id: 'nature', title: 'Nature', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', icon: Umbrella, count: '8 Parks', color: 'from-emerald-400 to-teal-500' },
];

const STATS = [
  { label: 'Places to Explore', value: 50, suffix: '+' },
  { label: 'AI Itineraries', value: 1200, suffix: '+' },
  { label: 'Happy Travelers', value: 3400, suffix: '+' },
  { label: 'Local Insights', value: 100, suffix: '%' },
];

const TESTIMONIALS = [
  { name: 'Aditi Sharma', role: 'Solo Traveler', text: 'TrekBuddy helped me discover hidden gems I would have never found. The AI planner created a perfect 3-day itinerary!', avatar: '🧳' },
  { name: 'Rahul Menon', role: 'Family Trip', text: 'We used the transit feature to navigate the entire city by local buses. Saved us so much time and money!', avatar: '👨‍👩‍👧' },
  { name: 'Sophie Laurent', role: 'Heritage Enthusiast', text: 'As a French history lover, the heritage trails recommended by the AI were absolutely insightful.', avatar: '🏛️' },
];

/* ─────────── COUNTER HOOK ─────────── */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}



const StatCard = ({ stat, index }: { stat: typeof STATS[0], index: number }) => {
  const { count, ref } = useCounter(stat.value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all duration-300"
    >
      <div className="text-4xl md:text-5xl font-black text-white mb-3 tabular-nums tracking-tight">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-slate-400 font-medium tracking-wide uppercase group-hover:text-white transition-colors">{stat.label}</div>
    </motion.div>
  );
};

/* ─────────── MAIN PAGE ─────────── */
export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const handleStartPlanning = () => {
    if (loading) return;
    router.push(user ? '/dashboard/planner' : '/login?redirect=/dashboard/planner');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">

      <CinematicHero />


      {/* ═══════════════ 3. ANIMATED STATS BAR ═══════════════ */}
      <section className="py-20 bg-slate-950 dark:bg-slate-900 relative overflow-hidden">
        {/* Animated bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════ 5. BEST TIME TO VISIT ═══════════════ */}
      <BestTimeSection />

      {/* ═══════════════ GALERY SECTION ═══════════════ */}
      <GallerySection />

      {/* ═══════════════ 5. TESTIMONIALS ═══════════════ */}
      <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <Badge className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
              <Star className="w-3 h-3 mr-1.5 fill-amber-500" />
              Loved by Travelers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Stories from the Road
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring', bounce: 0.2 }}
                className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-700/50 hover:border-cyan-200 dark:hover:border-cyan-800 transition-all hover:shadow-lg"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-sm">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 6. CINEMATIC CTA ═══════════════ */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-slate-950 to-violet-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.08),transparent_60%)]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/20 mx-auto">
                <Sparkles className="w-10 h-10" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Experience Puducherry
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              TrekBuddy combines local insights with AI intelligence to craft your perfect itinerary. Don&apos;t just visit — explore smarter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                size="lg"
                onClick={handleStartPlanning}
                className="group rounded-full px-10 h-16 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-500 hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Plan Your Trip with AI
              </Button>
              <Link href="/dashboard/chat">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-16 text-lg font-semibold bg-transparent border-2 border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500 hover:text-white transition-all shadow-lg shadow-black/20"
                >
                  Ask AI a Question
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
