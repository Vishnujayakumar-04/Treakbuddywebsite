'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Zap, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { seedTransitData } from '@/utils/seedTransitData';
import { seedEventData } from '@/utils/seedEventData';
import { toast } from 'sonner';

export function AdminSeeder() {
    const [seeding, setSeeding] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSeed = async () => {
        if (!confirm('This will populate Transit and Events collections with mock data. Existing items might be duplicated or replaced. Proceed?')) return;

        setSeeding(true);
        try {
            await Promise.all([
                seedTransitData(),
                seedEventData()
            ]);
            setSuccess(true);
            toast.success('Database seeded successfully!');
        } catch (err: any) {
            toast.error(`Seeding failed: ${err.message}`);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Database Seeder</h3>
                    <p className="text-sm text-slate-500">Initialize your live database with TrekBuddy mock data</p>
                </div>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                    Use this for first-time setup only. It will seed the <code className="font-bold">transit</code> and <code className="font-bold">events</code> collections in Firestore.
                </p>
            </div>

            {success ? (
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 className="w-5 h-5" />
                    Collections seeded successfully! Refresh dashboard to see stats.
                </div>
            ) : (
                <Button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold h-12 hover:opacity-90 transition-opacity"
                >
                    {seeding ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Seeding Database...</>
                    ) : (
                        <><Zap className="w-5 h-5 mr-2 fill-current" /> Initialize Mock Data</>
                    )}
                </Button>
            )}
        </div>
    );
}
