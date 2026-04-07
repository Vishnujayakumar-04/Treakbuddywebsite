import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
                <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading TrekBuddy...</p>
            </div>
        </div>
    );
}
