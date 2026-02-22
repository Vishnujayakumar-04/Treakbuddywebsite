'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getAdminCategories, addAdminCategory, updateAdminCategory, deleteAdminCategory } from '@/lib/admin/firestore';
import { AdminCategory } from '@/types/admin';
import { Plus, Pencil, Trash2, Loader2, FolderOpen, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ICON_OPTIONS = ['🏖️', '🏛️', '🛕', '⛪', '🕌', '🧘', '🍽️', '🏨', '🌿', '🏄', '🛍️', '🗺️', '🌊', '🎭', '🏥'];

function CategoryRow({
    cat, onEdit, onDelete, saving
}: {
    cat: AdminCategory;
    onEdit: (c: AdminCategory) => void;
    onDelete: (id: string, name: string) => void;
    saving: boolean;
}) {
    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{cat.name}</p>
                        <p className="text-xs text-slate-400">/{cat.slug}</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4 hidden md:table-cell text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{cat.description}</td>
            <td className="px-5 py-4 hidden sm:table-cell text-sm text-slate-500">#{cat.order}</td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white" onClick={() => onEdit(cat)}>
                        <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => onDelete(cat.id, cat.name)} disabled={saving}>
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

interface CategoryFormData {
    name: string;
    slug: string;
    icon: string;
    description: string;
    order: number;
}

const EMPTY_FORM: CategoryFormData = { name: '', slug: '', icon: '🗺️', description: '', order: 0 };

export default function CategoriesPage() {
    const { isAdmin, isLoading: authLoading } = useAdminAuth();
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CategoryFormData>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        getAdminCategories().then(c => { setCategories(c); setLoading(false); });
    }, [isAdmin]);

    const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

    const openAdd = () => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM, order: categories.length + 1 });
        setShowForm(true);
    };

    const openEdit = (cat: AdminCategory) => {
        setEditingId(cat.id);
        setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description, order: cat.order });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.slug) { toast.error('Name and slug are required'); return; }
        setSaving(true);
        try {
            if (editingId) {
                await updateAdminCategory(editingId, form);
                setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
                toast.success('Category updated!');
            } else {
                const id = await addAdminCategory(form as any);
                setCategories(prev => [...prev, { id, ...form, createdAt: null as any }]);
                toast.success('Category added!');
            }
            setShowForm(false);
        } catch {
            toast.error('Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        setSaving(true);
        try {
            await deleteAdminCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success(`"${name}" deleted`);
        } catch {
            toast.error('Failed to delete');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
    if (!isAdmin) return null;

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500";

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Categories" subtitle={`${categories.length} categories`} />

            <main className="flex-1 p-6 space-y-5">
                <div className="flex justify-end">
                    <Button onClick={openAdd} className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/20">
                        <Plus className="w-4 h-4 mr-2" />Add Category
                    </Button>
                </div>

                {/* Inline Form */}
                {showForm && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-black text-slate-900 dark:text-white">{editingId ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Name</label>
                                <input className={inputClass} value={form.name} onChange={e => { set('name', e.target.value); set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }} placeholder="e.g. Beaches" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Slug</label>
                                <input className={inputClass} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. beaches" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {ICON_OPTIONS.map(icon => (
                                        <button key={icon} type="button" onClick={() => set('icon', icon)}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.icon === icon ? 'bg-cyan-100 dark:bg-cyan-900/30 ring-2 ring-cyan-500' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Order</label>
                                <input type="number" className={inputClass} value={form.order} onChange={e => set('order', parseInt(e.target.value))} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                                <textarea className={inputClass} rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
                            <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-2" />Save</>}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {loading ? (
                        <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
                    ) : categories.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-semibold">No categories yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Category</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden md:table-cell">Description</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden sm:table-cell">Order</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                    {categories.map(cat => (
                                        <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} saving={saving} />
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
