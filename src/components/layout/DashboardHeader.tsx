'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
    showHome?: boolean;
    showBack?: boolean;
    children?: React.ReactNode;
}

export function DashboardHeader({
    title,
    subtitle,
    backHref,
    backLabel = 'Back',
    showHome = false,
    showBack = true,
    children
}: DashboardHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (backHref) {
            router.push(backHref);
        } else {
            router.back();
        }
    };

    return (
        <div className="space-y-6 mb-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group gap-2 pl-0 pr-4 hover:bg-transparent hover:text-cyan-600 dark:hover:text-cyan-400 transition-all text-slate-500 dark:text-slate-400 font-semibold p-0"
                            onClick={handleBack}
                        >
                            <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/30 transition-colors">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            </div>
                            <span className="text-sm">{backLabel}</span>
                        </Button>
                    )}

                    {showHome && (
                        <>
                            {showBack && <span className="text-slate-300 dark:text-slate-700">/</span>}
                            <Button variant="ghost" size="sm" asChild className="gap-2 text-slate-500 hover:text-cyan-600 transition-colors">
                                <Link href="/">
                                    <Home className="w-4 h-4" />
                                    <span className="hidden sm:inline">Home</span>
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Actions slot */}
                {children && (
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        {children}
                    </div>
                )}
            </div>

            {/* Title Section with Glass effect */}
            <div className="relative">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent dark:from-slate-800 dark:via-slate-900" />
        </div>
    );
}
