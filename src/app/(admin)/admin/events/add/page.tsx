'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EventForm } from '@/components/admin/EventForm';
import { Loader2 } from 'lucide-react';

export default function AddEventPage() {
    const { isAdmin, isLoading } = useAdminAuth();

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>;
    }
    if (!isAdmin) return null;

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Add New Event" subtitle="Create a new event listing for TrekBuddy" />
            <main className="flex-1 p-6 max-w-4xl">
                <EventForm mode="add" />
            </main>
        </div>
    );
}
