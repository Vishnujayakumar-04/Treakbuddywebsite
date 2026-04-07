'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PlaceForm } from '@/components/admin/PlaceForm';
import { getAdminPlaceById } from '@/lib/admin/firestore';
import { AdminPlace } from '@/types/admin';
import { Loader2, AlertCircle } from 'lucide-react';

export default function EditPlacePage() {
    const { id } = useParams<{ id: string }>();
    const { isAdmin, isLoading: authLoading } = useAdminAuth();
    const [place, setPlace] = useState<AdminPlace | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!isAdmin || !id) return;
        getAdminPlaceById(id).then(p => {
            if (!p) setNotFound(true);
            else setPlace(p);
            setLoading(false);
        });
    }, [isAdmin, id]);

    if (authLoading || loading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
    }
    if (!isAdmin) return null;
    if (notFound) {
        return (
            <div className="flex-1 flex flex-col">
                <AdminHeader title="Edit Place" />
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <AlertCircle className="w-12 h-12" />
                    <p className="font-semibold text-lg">Place not found</p>
                    <p className="text-sm">The place with ID "{id}" does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <AdminHeader title="Edit Place" subtitle={place?.name} />
            <main className="flex-1 p-6 max-w-4xl">
                {place && <PlaceForm mode="edit" placeId={id} initialData={place} />}
            </main>
        </div>
    );
}
