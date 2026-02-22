'use client';

import { useEffect, useState, useMemo } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getAdminPlaces, deleteAdminPlace } from '@/lib/admin/firestore';
import { AdminPlace } from '@/types/admin';
import { Plus, Pencil, Trash2, Search, Star, Loader2, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

function TableSkeleton() {
    return (
        <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
        </div>
    );
}

export default function AdminPlacesPage() {
    const { isAdmin, isLoading: authLoading } = useAdminAuth();
    const [places, setPlaces] = useState<AdminPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAdmin) return;
        getAdminPlaces().then(p => { setPlaces(p); setLoading(false); });
    }, [isAdmin]);

    const categories = useMemo(() => {
        const cats = [...new Set(places.map(p => p.category))];
        return ['all', ...cats.sort()];
    }, [places]);

    const filtered = useMemo(() => {
        return places.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.location.toLowerCase().includes(search.toLowerCase());
            const matchesCat = filterCategory === 'all' || p.category === filterCategory;
            return matchesSearch && matchesCat;
        });
    }, [places, search, filterCategory]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await deleteAdminPlace(id);
            setPlaces(prev => prev.filter(p => p.id !== id));
            toast.success(`"${name}" deleted`);
        } catch {
            toast.error('Failed to delete place');
        } finally {
            setDeletingId(null);
        }
    };

    if (authLoading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
    }
    if (!isAdmin) return null;

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Places" subtitle={`${places.length} total places`} />

            <main className="flex-1 p-6 space-y-5">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search places..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        {/* Category Filter */}
                        <select
                            value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                    </div>

                    <Link href="/admin/add-place">
                        <Button className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/20">
                            <Plus className="w-4 h-4 mr-2" />Add Place
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {loading ? <TableSkeleton /> : filtered.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                            <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-semibold">{search ? 'No places match your search' : 'No places added yet'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Place</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden lg:table-cell">Location</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden sm:table-cell">Rating</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                    {filtered.map(place => (
                                        <tr key={place.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                                        {place.image && <Image src={place.image} alt={place.name} fill className="object-cover" unoptimized />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-slate-900 dark:text-white">{place.name}</p>
                                                            {place.isFeatured && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                                        </div>
                                                        <p className="text-xs text-slate-400 md:hidden capitalize">{place.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 hidden md:table-cell">
                                                <Badge variant="secondary" className="capitalize">{place.category}</Badge>
                                            </td>
                                            <td className="px-5 py-3.5 hidden lg:table-cell text-slate-500 dark:text-slate-400">{place.location}</td>
                                            <td className="px-5 py-3.5 hidden sm:table-cell">
                                                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{place.rating}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/edit-place/${place.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                        onClick={() => handleDelete(place.id, place.name)}
                                                        disabled={deletingId === place.id}
                                                    >
                                                        {deletingId === place.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {filtered.length > 0 && (
                    <p className="text-xs text-slate-400 text-right">Showing {filtered.length} of {places.length} places</p>
                )}
            </main>
        </div>
    );
}
