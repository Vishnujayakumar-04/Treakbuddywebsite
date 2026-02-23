'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Since I cannot import types easily if they don't exist in the file system yet (though I created it), 
// I will define it inline or import if I trust the previous step succeeded.
// I created src/types/auth.ts, so I will import from it.
import { UserProfile } from '@/types/auth';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Listen for Auth State Changes
    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // If no user, we can stop loading immediately
            if (!currentUser) {
                setLoading(false);
                setUserProfile(null);
            }
            // If user exists, the second useEffect will handle profile fetching and loading state
        });

        return () => unsubscribeAuth();
    }, []);

    // 2. Listen for Firestore Profile Changes (depend on user)
    useEffect(() => {
        if (!user || !db) {
            // No user or no DB, nothing to fetch
            return;
        }

        setLoading(true); // Start loading while we fetch profile

        const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
            if (docSnap.exists()) {
                setUserProfile(docSnap.data() as UserProfile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
            setLoading(false);
        });

        return () => unsubscribeProfile();
    }, [user]);

    const logout = async () => {
        if (auth) {
            await firebaseSignOut(auth);
            setUser(null);
            setUserProfile(null);
            // Clear admin session marker so middleware redirects correctly
            document.cookie = 'admin_session=; path=/; max-age=0';
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
