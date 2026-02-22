'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/context/AuthContext';

interface AdminAuthState {
    isAdmin: boolean;
    isLoading: boolean;
}

/**
 * Hook that checks if the current user has admin role in Firestore.
 * Redirects to /admin/login if not authenticated or not an admin.
 */
export function useAdminAuth(): AdminAuthState {
    const { user, loading } = useAuthContext();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace('/admin/login');
            setIsLoading(false);
            return;
        }

        const checkAdminRole = async () => {
            try {
                const userDoc = await getDoc(doc(db!, 'users', user.uid));
                const data = userDoc.data();
                const role = data?.role;
                if (role === 'admin' || role === 'superadmin') {
                    setIsAdmin(true);
                } else {
                    router.replace('/admin/login?error=unauthorized');
                }
            } catch {
                router.replace('/admin/login?error=unauthorized');
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminRole();
    }, [user, loading, router]);

    return { isAdmin, isLoading };
}
