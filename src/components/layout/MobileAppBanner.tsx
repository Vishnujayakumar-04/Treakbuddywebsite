'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone } from 'lucide-react';

/**
 * A sticky bottom banner shown on mobile devices promoting the app download.
 * Dismissed state is saved to localStorage so it doesn't show again during the session.
 */
export function MobileAppBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('trekbuddy_banner_dismissed');
        if (!dismissed && window.innerWidth < 768) {
            // Delay showing by 3 seconds to avoid disrupting initial page load
            const timer = setTimeout(() => setVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setVisible(false);
        localStorage.setItem('trekbuddy_banner_dismissed', 'true');
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 safe-area-inset-bottom"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                            <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Get TrekBuddy App</p>
                            <p className="text-xs text-slate-400 truncate">Better experience on mobile</p>
                        </div>
                        <a
                            href="/download"
                            className="shrink-0 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                        >
                            Download
                        </a>
                        <button
                            onClick={dismiss}
                            className="shrink-0 text-slate-400 hover:text-white transition-colors p-1"
                            aria-label="Dismiss banner"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
