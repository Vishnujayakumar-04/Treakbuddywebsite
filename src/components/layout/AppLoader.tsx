'use client';

import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';

export function AppLoader({ children }: { children: React.ReactNode }) {
    const { loading } = useAuthContext();
    const pathname = usePathname();

    const normalizedPath = pathname?.replace(/\/$/, '') || '/';
    // Public routes that should never block on auth loading
    // Using normalized path for comparison
    const isPublicRoute = ['/', '/login', '/signup'].some(route =>
        normalizedPath === route || (route !== '/' && normalizedPath.startsWith(route))
    );
    const isLoading = loading && !isPublicRoute;

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="splash-screen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100]"
                    >
                        <LoadingScreen />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </div>
        </>
    );
}
