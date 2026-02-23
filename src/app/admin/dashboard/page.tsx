'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getDashboardStats } from '@/lib/admin/firestore';
import { DashboardStats } from '@/types/admin';
import { MapPin, FolderOpen, Star, Clock, Loader2, Calendar, Bus, Plus, List, ArrowUpRight, Database } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AdminSeeder } from '@/components/admin/AdminSeeder';

function SkeletonCard() {
    return <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />;
}

export default function AdminDashboardPage() {
    const { isAdmin, isLoading: authLoading } = useAdminAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) return;
        getDashboardStats().then(s => { setStats(s); setLoading(false); });
    }, [isAdmin]);

    if (authLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Dashboard" subtitle="Welcome back to TrekBuddy Admin" />

            <main className="flex-1 p-6 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
                    ) : (
                        <>
                            <>
                                <StatsCard title="Total Places" value={stats?.totalPlaces ?? 0} icon={MapPin} color="cyan" description="All locations" />
                                <StatsCard title="Events" value={stats?.totalEvents ?? 0} icon={Calendar} color="violet" description="Music, Festivals, etc" />
                                <StatsCard title="Transit" value={stats?.totalTransit ?? 0} icon={Bus} color="emerald" description="Rentals & Transport" />
                                <StatsCard title="Featured" value={stats?.featuredPlaces ?? 0} icon={Star} color="amber" description="Home page spotlights" />
                            </>
                        </>
                    )}
                </div>

                {/* Recent Places */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="font-black text-slate-900 dark:text-white">Recently Added Places</h2>
                        <Link href="/admin/places" className="text-sm font-semibold text-cyan-600 hover:text-cyan-500">View all →</Link>
                    </div>

                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                        </div>
                    ) : stats?.recentPlaces.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No places added yet</p>
                            <Link href="/admin/add-place" className="text-sm text-cyan-600 mt-2 block">Add your first place →</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {stats?.recentPlaces.map(place => (
                                <div key={place.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                                        {place.image && (
                                            <Image src={place.image} alt={place.name} fill className="object-cover" unoptimized />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 dark:text-white truncate">{place.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{place.location}</p>
                                    </div>
                                    <Badge className="capitalize shrink-0">{place.category}</Badge>
                                    {place.isFeatured && (
                                        <Badge className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 shrink-0">
                                            <Star className="w-3 h-3 mr-1" />Featured
                                        </Badge>
                                    )}
                                    <Link href={`/admin/edit-place/${place.id}`} className="text-xs text-slate-400 hover:text-cyan-500 transition-colors shrink-0 font-semibold">
                                        Edit
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="font-black text-slate-900 dark:text-white mb-4">Quick Management</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Manage Places', href: '/admin/places', icon: MapPin, color: 'bg-cyan-600 hover:bg-cyan-700' },
                            { label: 'Manage Events', href: '/admin/events', icon: Calendar, color: 'bg-violet-600 hover:bg-violet-700' },
                            { label: 'Manage Transit', href: '/admin/transit', icon: Bus, color: 'bg-emerald-600 hover:bg-emerald-700' },
                            { label: 'Categories', href: '/admin/categories', icon: FolderOpen, color: 'bg-slate-800 hover:bg-slate-700' },
                        ].map(({ label, href, color, icon: Icon }) => (
                            <Link key={href} href={href}
                                className={`${color} rounded-2xl p-6 text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group`}>
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-black text-sm uppercase tracking-wider">{label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/admin/add-place" className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-cyan-500 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 rounded-xl group-hover:rotate-12 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Add New Place</h3>
                                <p className="text-sm text-slate-500">Create a new location entry</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-500" />
                    </Link>

                    <Link href="/admin/places" className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-violet-500 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-50 dark:bg-violet-900/20 text-violet-600 rounded-xl group-hover:rotate-12 transition-transform">
                                <List className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">View Inventory</h3>
                                <p className="text-sm text-slate-500">Manage all existing data</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500" />
                    </Link>
                </div>

                {/* Database Seeder Utility */}
                <AdminSeeder />
            </main>
        </div>
    );
}
