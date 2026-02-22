'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PlaceForm } from '@/components/admin/PlaceForm';
import { Loader2 } from 'lucide-react';

export default function AddPlacePage() {
    const { isAdmin, isLoading } = useAdminAuth();

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
    }
    if (!isAdmin) return null;

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Add New Place" subtitle="Fill in the details below to add a new place" />
            <main className="flex-1 p-6 max-w-4xl">
                <PlaceForm mode="add" />
            </main>
        </div>
    );
}
