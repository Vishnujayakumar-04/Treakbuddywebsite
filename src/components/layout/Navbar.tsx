'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, User, LogOut, Map, Heart, Compass, Settings, MessageCircle, X, Star } from 'lucide-react';
import { useState, useEffect } from 'react';


const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Famous Places', href: '/dashboard/places/famous', variant: 'featured' },
    { label: 'Explore', href: '/dashboard/categories' },
    { label: 'Planner', href: '/dashboard/planner' },
    { label: 'Events', href: '/dashboard/events' },
    { label: 'Transit', href: '/dashboard/transit' },
    { label: 'Emergency', href: '/dashboard/emergency' },
    { label: 'My Trips', href: '/dashboard/trips', variant: 'highlight' },
];

const MOBILE_LINKS = [
    { label: 'Home', href: '/', icon: Compass },
    { label: 'Famous Places', href: '/dashboard/places/famous', icon: Star },
    { label: 'Explore', href: '/dashboard/categories', icon: Map },
    { label: 'Trip Planner', href: '/dashboard/planner', icon: Map },
    { label: 'AI Guide', href: '/dashboard/chat', icon: MessageCircle },
];

export function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);
    const isTransitPage = pathname?.startsWith('/dashboard/transit');
    const isHeroPage = pathname === '/' || pathname === '/about';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setIsOpen(false); }, [pathname]);

    if (isAuthPage || isTransitPage) return null;

    const isTransparent = isHeroPage && !scrolled;

    return (
        <>
            <header className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500",
                isTransparent
                    ? "bg-transparent border-transparent"
                    : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
            )}>
                <div className="container h-20 flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                    {/* Left: Mobile Menu + Logo */}
                    <div className="flex items-center gap-4">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className={cn(
                                "lg:hidden p-2 rounded-xl transition-colors",
                                isTransparent
                                    ? "text-white/80 hover:bg-white/10"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-lg transition-all group-hover:scale-105",
                                isTransparent
                                    ? "bg-white/10 backdrop-blur-xl text-white border border-white/10"
                                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                            )}>
                                TB
                            </div>
                            <span className={cn(
                                "font-bold text-xl tracking-tight transition-colors",
                                isTransparent
                                    ? "text-white"
                                    : "text-slate-900 dark:text-white"
                            )}>
                                TrekBuddy
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <nav className="hidden lg:flex items-center justify-center flex-1 px-4">
                        <div className="flex items-center gap-1 xl:gap-6 px-6 py-2.5 rounded-full bg-slate-50/10 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/20 dark:border-slate-700/30 shadow-sm transition-all duration-300">

                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

                                if (link.variant === 'featured') {
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-1.5 px-3 xl:px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300 mx-0.5 xl:mx-1 whitespace-nowrap"
                                        >
                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                            {link.label}
                                        </Link>
                                    );
                                }

                                if (link.variant === 'highlight') {
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="px-3 xl:px-5 py-2 rounded-full text-sm font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-300 mx-0.5 xl:mx-1 whitespace-nowrap"
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                }

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "relative px-2 xl:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                                            isActive
                                                ? isTransparent
                                                    ? "text-white bg-white/20"
                                                    : "text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow-sm"
                                                : isTransparent
                                                    ? "text-white/70 hover:text-white hover:bg-white/10"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Right: Auth */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className={cn(
                                        "relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 transition-all",
                                        isTransparent
                                            ? "ring-white/20 hover:ring-white/40"
                                            : "ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600"
                                    )}>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-base">
                                                {user.displayName?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 rounded-xl shadow-xl border-slate-200/80 dark:border-slate-800" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal py-3">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold">{user.displayName}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                                        <Link href="/dashboard/profile">
                                            <User className="mr-2 h-4 w-4" /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                                        <Link href="/dashboard/settings">
                                            <Settings className="mr-2 h-4 w-4" /> Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild className={cn(
                                    "hidden sm:flex font-semibold rounded-full px-5 h-10 transition-all",
                                    isTransparent
                                        ? "text-white/80 hover:text-white hover:bg-white/10"
                                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                )}>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button asChild className={cn(
                                    "font-bold rounded-full px-6 h-10 shadow-lg transition-all hover:scale-105",
                                    isTransparent
                                        ? "bg-white text-slate-900 hover:bg-white/90 shadow-white/10"
                                        : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-cyan-500/15"
                                )}>
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div >
            </header >

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {
                    isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[60]"
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed left-0 top-0 bottom-0 w-[300px] bg-white dark:bg-slate-950 z-[70] shadow-2xl"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-base">TB</div>
                                            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">TrekBuddy</span>
                                        </div>
                                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                        {MOBILE_LINKS.map((link, i) => {
                                            const isActive = pathname === link.href;
                                            return (
                                                <motion.div
                                                    key={link.href}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                                                            isActive
                                                                ? "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 text-cyan-700 dark:text-cyan-400 font-bold"
                                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                        )}
                                                    >
                                                        <link.icon className="w-5 h-5" />
                                                        {link.label}
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </nav>

                                    {!user && (
                                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                            <Button asChild className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold">
                                                <Link href="/signup">Sign Up</Link>
                                            </Button>
                                            <Button variant="outline" asChild className="w-full h-11 rounded-xl font-semibold">
                                                <Link href="/login">Log In</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )
                }
            </AnimatePresence >
        </>
    );
}
