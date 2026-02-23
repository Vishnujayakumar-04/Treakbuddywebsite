'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminTransit } from '@/types/admin';
import { addAdminTransit, updateAdminTransit } from '@/lib/admin/firestore';
import { Plus, Trash2, MapPin, Clock, Phone, Info, Car, Bike, Bus, Train, LayoutGrid } from 'lucide-react';

interface TransitFormProps {
    initialData?: Partial<AdminTransit>;
    transitId?: string;
    mode: 'add' | 'edit';
}

const CATEGORIES = [
    { id: 'rentals', label: 'Rentals', icon: Bike },
    { id: 'cabs', label: 'Cabs', icon: Car },
    { id: 'bus', label: 'Buses', icon: Bus },
    { id: 'train', label: 'Trains', icon: Train },
];

export function TransitForm({ initialData, transitId, mode }: TransitFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        category: initialData?.category ?? 'rentals',
        subCategory: initialData?.subCategory ?? '',
        type: initialData?.type ?? '',
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        price: initialData?.price ?? '',
        availability: initialData?.availability ?? '',
        image: initialData?.image ?? '',
        rating: initialData?.rating ?? 4.5,
        contact: initialData?.contact ?? '',
        location: initialData?.location ?? '',
        // Bus/Train
        from: initialData?.from ?? '',
        to: initialData?.to ?? '',
        number: initialData?.number ?? '',
        departure: initialData?.departure ?? '',
        arrival: initialData?.arrival ?? '',
        duration: initialData?.duration ?? '',
        frequency: initialData?.frequency ?? '',
        baseFare: initialData?.baseFare ?? 0,
        farePerStop: initialData?.farePerStop ?? 0,
        // Cabs
        baseRate: initialData?.baseRate ?? '',
        perKm: initialData?.perKm ?? '',
        tips: initialData?.tips ?? '',
        // Rentals
        mapUrl: initialData?.mapUrl ?? '',
        openHours: initialData?.openHours ?? '',
        about: initialData?.about ?? '',
        securityDeposit: initialData?.securityDeposit ?? '',
    });

    const [via, setVia] = useState<string[]>(initialData?.via ?? []);
    const [stops, setStops] = useState<string[]>(initialData?.routeStops ?? []);
    const [vehicles, setVehicles] = useState<{ category: string; models: string }[]>(initialData?.vehicles ?? []);
    const [terms, setTerms] = useState<{ title: string; desc: string }[]>(initialData?.terms ?? []);

    const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.category) {
            toast.error('Please fill in required fields');
            return;
        }

        setSaving(true);
        try {
            const data: Omit<AdminTransit, 'id' | 'updatedAt'> = {
                ...form,
                via,
                routeStops: stops,
                vehicles,
                terms,
                category: form.category as any,
            };

            if (mode === 'edit' && transitId) {
                await updateAdminTransit(transitId, data);
                toast.success('Transit item updated!');
            } else {
                await addAdminTransit(data);
                toast.success('Transit item added!');
            }
            router.push('/admin/transit');
        } catch (err: any) {
            toast.error(err.message || 'Operation failed');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all";
    const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";
    const sectionClass = "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">

            {/* Category Selector */}
            <div className={sectionClass}>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-emerald-500" /> Transport Category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id} type="button"
                            onClick={() => set('category', id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${form.category === id
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                : 'border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Basic Info */}
            <div className={sectionClass}>
                <h2 className="text-base font-black text-slate-900 dark:text-white">General Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                        <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Royal Enfield Rentals or Route 1A" required />
                    </div>
                    <div>
                        <label className={labelClass}>Sub Category</label>
                        <select className={inputClass} value={form.subCategory} onChange={e => set('subCategory', e.target.value)}>
                            <option value="">Select sub-category</option>
                            <option value="Bike">Bike (Rental)</option>
                            <option value="Scooty">Scooty (Rental)</option>
                            <option value="Car">Car (Rental)</option>
                            <option value="Cycle">Cycle (Rental)</option>
                            <option value="local">Local (Bus)</option>
                            <option value="interstate">Interstate (Bus)</option>
                            <option value="Express">Express (Train)</option>
                            <option value="service">Ride Service (Cab)</option>
                            <option value="operator">Local Operator (Cab)</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Type / Provider</label>
                        <input className={inputClass} value={form.type} onChange={e => set('type', e.target.value)} placeholder="e.g. PRTC, TNSTC, Private" />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea rows={2} className={inputClass} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief display description..." />
                    </div>
                    <div>
                        <label className={labelClass}>Display Price / Range</label>
                        <input className={inputClass} value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. ₹300/day or ₹10 - ₹15" />
                    </div>
                    <div>
                        <label className={labelClass}>Availability</label>
                        <input className={inputClass} value={form.availability} onChange={e => set('availability', e.target.value)} placeholder="e.g. 24/7 or 6AM - 10PM" />
                    </div>
                    <div>
                        <label className={labelClass}>Image URL / Emoji</label>
                        <input className={inputClass} value={form.image} onChange={e => set('image', e.target.value)} placeholder="URL or single emoji" />
                    </div>
                    <div>
                        <label className={labelClass}>Rating</label>
                        <input type="number" step="0.1" className={inputClass} value={form.rating} onChange={e => set('rating', parseFloat(e.target.value))} />
                    </div>
                    {['rentals', 'cabs'].includes(form.category) && (
                        <>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input className={inputClass} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Mission Street" />
                            </div>
                            <div>
                                <label className={labelClass}>Contact</label>
                                <input className={inputClass} value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="Phone number" />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Cab Specifics */}
            {form.category === 'cabs' && (
                <div className={sectionClass}>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">Cab Service Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Base Rate (₹)</label>
                            <input className={inputClass} value={form.baseRate} onChange={e => set('baseRate', e.target.value)} placeholder="e.g. ₹30" />
                        </div>
                        <div>
                            <label className={labelClass}>Rate Per KM (₹)</label>
                            <input className={inputClass} value={form.perKm} onChange={e => set('perKm', e.target.value)} placeholder="e.g. ₹15/km" />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Booking Tips / Info</label>
                            <input className={inputClass} value={form.tips} onChange={e => set('tips', e.target.value)} placeholder="e.g. Negotiate fare before starting." />
                        </div>
                    </div>
                </div>
            )}

            {/* Rental Specifics */}
            {form.category === 'rentals' && (
                <div className={sectionClass}>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">Rental Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className={labelClass}>About</label>
                            <textarea rows={3} className={inputClass} value={form.about} onChange={e => set('about', e.target.value)} placeholder="Short bio of the shop..." />
                        </div>
                        <div>
                            <label className={labelClass}>Open Hours</label>
                            <input className={inputClass} value={form.openHours} onChange={e => set('openHours', e.target.value)} placeholder="e.g. 9 AM - 9 PM" />
                        </div>
                        <div>
                            <label className={labelClass}>Security Deposit</label>
                            <input className={inputClass} value={form.securityDeposit} onChange={e => set('securityDeposit', e.target.value)} placeholder="e.g. ₹1000 + ID Proof" />
                        </div>
                    </div>
                </div>
            )}

            {/* Bus/Train Specifics */}
            {(form.category === 'bus' || form.category === 'train') && (
                <div className={sectionClass}>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">Route & Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className={labelClass}>From</label>
                            <input className={inputClass} value={form.from} onChange={e => set('from', e.target.value)} placeholder="Start point" />
                        </div>
                        <div>
                            <label className={labelClass}>To</label>
                            <input className={inputClass} value={form.to} onChange={e => set('to', e.target.value)} placeholder="Destination" />
                        </div>
                        <div>
                            <label className={labelClass}>Number / Code</label>
                            <input className={inputClass} value={form.number} onChange={e => set('number', e.target.value)} placeholder="e.g. TN-01-1234 or PDY" />
                        </div>
                        <div>
                            <label className={labelClass}>Departure</label>
                            <input className={inputClass} value={form.departure} onChange={e => set('departure', e.target.value)} placeholder="e.g. 08:30 AM" />
                        </div>
                        <div>
                            <label className={labelClass}>Arrival</label>
                            <input className={inputClass} value={form.arrival} onChange={e => set('arrival', e.target.value)} placeholder="e.g. 10:00 AM" />
                        </div>
                        <div>
                            <label className={labelClass}>Frequency</label>
                            <input className={inputClass} value={form.frequency} onChange={e => set('frequency', e.target.value)} placeholder="e.g. Every 30 mins" />
                        </div>
                        <div>
                            <label className={labelClass}>Base Fare (₹)</label>
                            <input type="number" className={inputClass} value={form.baseFare} onChange={e => set('baseFare', parseInt(e.target.value))} />
                        </div>
                        <div>
                            <label className={labelClass}>Fare Per Stop (₹)</label>
                            <input type="number" className={inputClass} value={form.farePerStop} onChange={e => set('farePerStop', parseInt(e.target.value))} />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className={labelClass}>Route Stops (in order)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="newStop"
                                className={inputClass}
                                placeholder="Add a stop..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value;
                                        if (val) {
                                            setStops([...stops, val]);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                            />
                            <Button type="button" onClick={() => {
                                const input = document.getElementById('newStop') as HTMLInputElement;
                                if (input.value) {
                                    setStops([...stops, input.value]);
                                    input.value = '';
                                }
                            }}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stops.map((stop, idx) => (
                                <Badge key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                    {stop}
                                    <Trash2 className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setStops(stops.filter((_, i) => i !== idx))} />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between gap-4 sticky bottom-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-10">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/transit')} className="rounded-xl px-6">
                    Cancel
                </Button>
                <Button
                    type="submit" disabled={saving}
                    className="rounded-xl px-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-500/20"
                >
                    {saving ? 'Processing...' : mode === 'add' ? 'Add Transport' : 'Save Changes'}
                </Button>
            </div>

        </form>
    );
}
