'use client';

import { useEffect, useState, use } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TransitForm } from '@/components/admin/TransitForm';
import { getAdminTransitById } from '@/lib/admin/firestore';
import { AdminTransit } from '@/types/admin';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EditTransitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { isAdmin, isLoading: authLoading } = useAdminAuth();
    const [item, setItem] = useState<AdminTransit | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) return;
        getAdminTransitById(id).then(res => {
            setItem(res);
            setLoading(false);
        });
    }, [isAdmin, id]);

    if (authLoading || loading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
    }

    if (!isAdmin) return null;

    if (!item) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Item Not Found</h2>
                <p className="text-slate-500 mb-6">The transport item you are looking for does not exist or has been deleted.</p>
                <Button onClick={() => router.push('/admin/transit')} className="rounded-xl">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Edit Transport" subtitle={`Editing ${item.name}`} />
            <main className="flex-1 p-6 max-w-4xl">
                <TransitForm mode="edit" initialData={item} transitId={id} />
            </main>
        </div>
    );
}
