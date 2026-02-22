'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SmartImagePicker } from '@/components/admin/SmartImagePicker';
import { AdminPlace } from '@/types/admin';
import { addAdminPlace, updateAdminPlace } from '@/lib/admin/firestore';
import { Tag, X } from 'lucide-react';

const CATEGORIES = [
    'beaches', 'heritage', 'temples', 'churches', 'mosques',
    'spiritual', 'restaurants', 'hotels', 'pg', 'nature', 'parks',
    'adventure', 'shopping', 'museums', 'nightlife', 'emergency'
];

interface PlaceFormProps {
    initialData?: Partial<AdminPlace>;
    placeId?: string;
    mode: 'add' | 'edit';
}

export function PlaceForm({ initialData, placeId, mode }: PlaceFormProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        category: initialData?.category ?? 'beaches',
        location: initialData?.location ?? '',
        rating: initialData?.rating ?? 4.0,
        openTime: initialData?.openTime ?? '',
        entryFee: initialData?.entryFee ?? '',
        bestTime: initialData?.bestTime ?? '',
        timeSlot: initialData?.timeSlot ?? '',
        isFeatured: initialData?.isFeatured ?? false,
    });

    const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
    const [tagInput, setTagInput] = useState('');

    // Image state — managed by SmartImagePicker, kept here for form submission
    const [resolvedCover, setResolvedCover] = useState<string>(initialData?.image ?? '');
    const [resolvedGallery, setResolvedGallery] = useState<string[]>(initialData?.gallery ?? []);

    // Stable placeId for storage folder (generated once for new places)
    const [stablePlaceId] = useState(() => placeId || `place_${Date.now()}`);

    const [saving, setSaving] = useState(false);

    const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
        setTagInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.description || !form.location) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const placeData: Omit<AdminPlace, 'id' | 'createdAt' | 'updatedAt'> = {
                ...form,
                tags,
                image: resolvedCover,
                gallery: resolvedGallery,
            };

            if (mode === 'edit' && placeId) {
                await updateAdminPlace(placeId, placeData);
                toast.success('Place updated successfully!');
            } else {
                await addAdminPlace(placeData);
                toast.success('Place added successfully!');
            }

            router.push('/admin/places');
        } catch (err: any) {
            toast.error(err.message || 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Basic Information ───────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-base font-black text-slate-900 dark:text-white mb-5">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                        <input
                            className={inputClass} value={form.name}
                            onChange={e => set('name', e.target.value)}
                            placeholder="e.g. Promenade Beach" required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                        <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Location <span className="text-red-500">*</span></label>
                        <input
                            className={inputClass} value={form.location}
                            onChange={e => set('location', e.target.value)}
                            placeholder="e.g. White Town, Puducherry" required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Rating (0–5)</label>
                        <input
                            type="number" min="0" max="5" step="0.1"
                            className={inputClass} value={form.rating}
                            onChange={e => set('rating', parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                        <textarea
                            rows={3} className={inputClass} value={form.description}
                            onChange={e => set('description', e.target.value)}
                            placeholder="Describe this place..." required
                        />
                    </div>
                </div>
            </div>

            {/* ── Smart Image Picker ──────────────────────────────────────────── */}
            {/* 
        Renders AFTER name+location so SearchImagePicker can read them.
        Placement matters: re-renders as name/location change, enabling live search. 
      */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <SmartImagePicker
                    placeName={form.name}
                    location={form.location}
                    placeId={stablePlaceId}
                    existingCover={resolvedCover}
                    existingGallery={resolvedGallery}
                    onCoverReady={setResolvedCover}
                    onGalleryReady={setResolvedGallery}
                />

                {/* Show what's currently saved */}
                {(resolvedCover || resolvedGallery.length > 0) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Saved to Firebase Storage
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            {resolvedCover && (
                                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                                    ✅ Cover image ready
                                </span>
                            )}
                            {resolvedGallery.length > 0 && (
                                <span className="flex items-center gap-1 text-cyan-600 font-semibold">
                                    ✅ {resolvedGallery.length} gallery image{resolvedGallery.length > 1 ? 's' : ''} ready
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Details ─────────────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-base font-black text-slate-900 dark:text-white mb-5">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className={labelClass}>Opening Hours</label>
                        <input className={inputClass} value={form.openTime} onChange={e => set('openTime', e.target.value)} placeholder="e.g. 8 AM – 6 PM" />
                    </div>
                    <div>
                        <label className={labelClass}>Entry Fee</label>
                        <input className={inputClass} value={form.entryFee} onChange={e => set('entryFee', e.target.value)} placeholder="e.g. Free or ₹50" />
                    </div>
                    <div>
                        <label className={labelClass}>Best Time to Visit</label>
                        <input className={inputClass} value={form.bestTime} onChange={e => set('bestTime', e.target.value)} placeholder="e.g. Morning" />
                    </div>
                    <div>
                        <label className={labelClass}>Time Slot</label>
                        <select className={inputClass} value={form.timeSlot} onChange={e => set('timeSlot', e.target.value)}>
                            {['', 'Morning', 'Afternoon', 'Evening', 'Night'].map(s => (
                                <option key={s} value={s}>{s || 'Select...'}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 md:col-span-2 pt-6">
                        <input
                            type="checkbox" id="isFeatured" checked={form.isFeatured}
                            onChange={e => set('isFeatured', e.target.checked)}
                            className="w-4 h-4 rounded accent-cyan-500"
                        />
                        <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Mark as Featured Place
                        </label>
                    </div>
                </div>

                {/* Tags */}
                <div className="mt-5">
                    <label className={labelClass}>Tags</label>
                    <div className="flex gap-2">
                        <input
                            className={inputClass} value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Type a tag and press Enter"
                        />
                        <Button type="button" onClick={addTag} variant="outline" className="shrink-0 rounded-xl">
                            <Tag className="w-4 h-4" />
                        </Button>
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    {tag}
                                    <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))} className="text-cyan-400 hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Form Actions ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                    {resolvedCover ? '✅ Images ready' : '⚠️ No cover image selected — you can still save'}
                </p>
                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/places')} className="rounded-xl px-6">
                        Cancel
                    </Button>
                    <Button
                        type="submit" disabled={saving}
                        className="rounded-xl px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/20"
                    >
                        {saving ? 'Saving...' : mode === 'add' ? 'Add Place' : 'Save Changes'}
                    </Button>
                </div>
            </div>

        </form>
    );
}
