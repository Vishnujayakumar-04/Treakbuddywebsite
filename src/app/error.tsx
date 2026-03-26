'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TrekBuddy boundary caught an error:', error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-md w-full"
      >
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Something went wrong!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">
          We encountered an unexpected error while preparing this section. Our team has been notified.
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full h-12 rounded-xl text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25"
          >
            <RefreshCw className="w-5 h-5 mr-2" /> Try Again
          </Button>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Home className="w-5 h-5 mr-2" /> Go back Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
