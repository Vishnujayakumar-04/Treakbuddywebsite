'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AdminEvent } from '@/types/admin';
import { addAdminEvent, updateAdminEvent } from '@/lib/admin/firestore';
import { Calendar, MapPin, Info, LayoutGrid, Star, Users, Clock } from 'lucide-react';

interface EventFormProps {
    initialData?: Partial<AdminEvent>;
    eventId?: string;
    mode: 'add' | 'edit';
}

const CATEGORIES = [
    'music', 'concerts', 'festivals', 'dance', 'health-wellness', 'theatre', 'adventure'
];

const TYPES = [
    { id: 'active', label: 'Active', color: 'bg-emerald-500' },
    { id: 'nearby', label: 'Nearby', color: 'bg-blue-500' },
    { id: 'trending', label: 'Trending', color: 'bg-amber-500' },
];

export function EventForm({ initialData, eventId, mode }: EventFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        category: initialData?.category ?? 'music',
        date: initialData?.date ?? '',
        location: initialData?.location ?? '',
        interested: initialData?.interested ?? '',
        image: initialData?.image ?? '',
        type: initialData?.type ?? 'active',
        isFeatured: initialData?.isFeatured ?? false,
    });

    const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.date || !form.location) {
            toast.error('Please fill in required fields');
            return;
        }

        setSaving(true);
        try {
            if (mode === 'edit' && eventId) {
                await updateAdminEvent(eventId, form as any);
                toast.success('Event updated successfully!');
            } else {
                await addAdminEvent(form as any);
                toast.success('Event added successfully!');
            }
            router.push('/admin/events');
        } catch (err: any) {
            toast.error(err.message || 'Operation failed');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all";
    const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";
    const sectionClass = "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">

            {/* Event Details */}
            <div className={sectionClass}>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-500" /> Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Event Title <span className="text-red-500">*</span></label>
                        <input className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Rock Beach Festival 2026" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea rows={3} className={inputClass} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Tell people about this event..." />
                    </div>
                    <div>
                        <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                        <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' & ')}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Image URL / Source</label>
                        <input className={inputClass} value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
                    </div>
                </div>
            </div>

            {/* Logistics */}
            <div className={sectionClass}>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-500" /> Date & Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Date/Time <span className="text-red-500">*</span></label>
                        <input className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} placeholder="e.g. Fri, 06 Mar, 2026 - 05:00 PM" required />
                    </div>
                    <div>
                        <label className={labelClass}>Location <span className="text-red-500">*</span></label>
                        <input className={inputClass} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Rock Beach, White Town" required />
                    </div>
                    <div>
                        <label className={labelClass}>Interested Count Text</label>
                        <input className={inputClass} value={form.interested} onChange={e => set('interested', e.target.value)} placeholder="e.g. 500+ Interested" />
                    </div>
                    <div>
                        <label className={labelClass}>Event Placement Type</label>
                        <div className="flex gap-2">
                            {TYPES.map(({ id, label, color }) => (
                                <button
                                    key={id} type="button"
                                    onClick={() => set('type', id)}
                                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all border-2 ${form.type === id
                                            ? `border-slate-900 dark:border-white ${color} text-white`
                                            : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-400'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between gap-4 sticky bottom-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-10">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox" id="isFeatured" checked={form.isFeatured}
                        onChange={e => set('isFeatured', e.target.checked)}
                        className="w-4 h-4 rounded accent-violet-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Featured Event
                    </label>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/events')} className="rounded-xl px-6">
                        Cancel
                    </Button>
                    <Button
                        type="submit" disabled={saving}
                        className="rounded-xl px-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-violet-500/20"
                    >
                        {saving ? 'Processing...' : mode === 'add' ? 'Add Event' : 'Save Changes'}
                    </Button>
                </div>
            </div>

        </form>
    );
}
