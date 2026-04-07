'use client';

import { useEffect, useState, useMemo } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getAdminEvents, deleteAdminEvent } from '@/lib/admin/firestore';
import { AdminEvent } from '@/types/admin';
import { Plus, Pencil, Trash2, Search, Loader2, Calendar, MapPin, Filter, Star } from 'lucide-react';
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

export default function AdminEventsPage() {
    const { isAdmin, isLoading: authLoading } = useAdminAuth();
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAdmin) return;
        getAdminEvents().then(items => { setEvents(items); setLoading(false); });
    }, [isAdmin]);

    const categories = useMemo(() => {
        const cats = [...new Set(events.map(e => e.category))];
        return ['all', ...cats.sort()];
    }, [events]);

    const filtered = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                event.location.toLowerCase().includes(search.toLowerCase());
            const matchesCat = filterCategory === 'all' || event.category === filterCategory;
            return matchesSearch && matchesCat;
        });
    }, [events, search, filterCategory]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await deleteAdminEvent(id);
            setEvents(prev => prev.filter(e => e.id !== id));
            toast.success(`"${title}" deleted`);
        } catch {
            toast.error('Failed to delete event');
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
            <AdminHeader title="Events Management" subtitle={`${events.length} total events`} />

            <main className="flex-1 p-6 space-y-5">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search events..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <select
                            value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                    </div>

                    <Link href="/admin/events/add">
                        <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-violet-500/20">
                            <Plus className="w-4 h-4 mr-2" />Add Event
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {loading ? <TableSkeleton /> : filtered.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-semibold">{search ? 'No events match your search' : 'No events added yet'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Event</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden lg:table-cell">Details</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden sm:table-cell">Interest</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                    {filtered.map(event => (
                                        <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                                        {event.image && <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{event.title}</p>
                                                        <p className="text-xs text-slate-400 md:hidden capitalize">{event.category} • {event.type}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 hidden md:table-cell">
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="secondary" className="w-fit capitalize">{event.category}</Badge>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{event.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 hidden lg:table-cell">
                                                <div className="text-xs space-y-0.5">
                                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{event.date}</p>
                                                    <p className="text-slate-400 truncate max-w-[200px]">{event.location}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                                                {event.interested}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/events/edit/${event.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                        onClick={() => handleDelete(event.id, event.title)}
                                                        disabled={deletingId === event.id}
                                                    >
                                                        {deletingId === event.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
            </main>
        </div>
    );
}
