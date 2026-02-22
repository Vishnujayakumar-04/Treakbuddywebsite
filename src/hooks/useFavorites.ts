import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export interface SavedPlace {
    id: string;
    name: string;
    image: string;
    location: string;
    category: string;
    rating: number;
}

export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<SavedPlace[]>([]);
    const LOCAL_KEY = 'trekbuddy_favorites';

    useEffect(() => {
        let unsubscribe = () => { };

        if (user) {
            // Firestore Logic
            if (db) {
                const favoritesRef = collection(db, 'users', user.uid, 'favorites');

                unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
                    const data = snapshot.docs.map(doc => doc.data() as SavedPlace);
                    setFavorites(data);
                }, (error) => {
                    console.error("Error fetching favorites:", error);
                    // toast.error("Failed to sync favorites"); // Suppressed per user request
                });
            }
        } else {
            // LocalStorage Logic (Guest)
            const safeParse = (str: string | null) => {
                if (!str) return [];
                try {
                    return JSON.parse(str);
                } catch {
                    return [];
                }
            };

            setFavorites(safeParse(localStorage.getItem(LOCAL_KEY)));

            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === LOCAL_KEY) {
                    setFavorites(safeParse(e.newValue));
                }
            };

            // Custom event listener for same-tab updates
            const handleLocalUpdate = () => {
                setFavorites(safeParse(localStorage.getItem(LOCAL_KEY)));
            };

            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('local-favorites-update', handleLocalUpdate);

            unsubscribe = () => {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('local-favorites-update', handleLocalUpdate);
            };
        }

        return () => unsubscribe();
    }, [user]);

    const isFavorite = (id: string) => favorites.some(p => p.id === id);

    const toggleFavorite = async (place: SavedPlace) => {
        const exists = isFavorite(place.id);

        if (user) {
            // Firestore Toggle
            if (!db) {
                toast.error("Database connection failed");
                return;
            }
            try {
                const favDocRef = doc(db, 'users', user.uid, 'favorites', place.id);
                if (exists) {
                    await deleteDoc(favDocRef);
                    toast.success('Removed from favorites');
                } else {
                    await setDoc(favDocRef, place);
                    toast.success('Saved to favorites');
                }
            } catch (error) {
                console.error("Error updating favorite:", error);
                toast.error("Failed to update favorite");
            }
        } else {
            // LocalStorage Toggle
            let newFavorites;
            if (exists) {
                newFavorites = favorites.filter(p => p.id !== place.id);
                toast.success('Removed from favorites');
            } else {
                newFavorites = [...favorites, place];
                toast.success('Saved to favorites');
            }

            localStorage.setItem(LOCAL_KEY, JSON.stringify(newFavorites));
            setFavorites(newFavorites);

            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new Event('local-favorites-update'));
        }
    };

    return { favorites, isFavorite, toggleFavorite };
}
