'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TransitForm } from '@/components/admin/TransitForm';
import { Loader2 } from 'lucide-react';

export default function AddTransitPage() {
    const { isAdmin, isLoading } = useAdminAuth();

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
    }
    if (!isAdmin) return null;

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Add Transport" subtitle="Create a new rental, cab, or public transport entry" />
            <main className="flex-1 p-6 max-w-4xl">
                <TransitForm mode="add" />
            </main>
        </div>
    );
}
