'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import {
    LayoutDashboard, MapPin, Plus, FolderOpen,
    LogOut, ChevronRight, Compass, Users, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/places', label: 'All Places', icon: MapPin },
    { href: '/admin/add-place', label: 'Add Place', icon: Plus },
    { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
    // Scalability slots — future features:
    { href: '/admin/users', label: 'Users', icon: Users, disabled: true },
    { href: '/admin/reviews', label: 'Reviews', icon: Star, disabled: true },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthContext();

    return (
        <aside className="h-full w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Compass className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-none">TrekBuddy</p>
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ href, label, icon: Icon, disabled }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={disabled ? '#' : href}
                            onClick={e => disabled && e.preventDefault()}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                                disabled
                                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                                    : isActive
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            )}
                        >
                            <Icon className={cn('w-4 h-4 shrink-0', isActive && 'text-cyan-400')} />
                            <span className="flex-1">{label}</span>
                            {disabled && (
                                <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md font-bold uppercase">
                                    Soon
                                </span>
                            )}
                            {isActive && <ChevronRight className="w-3 h-3 text-cyan-400/60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="px-3 py-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-slate-800/50">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.email?.[0]?.toUpperCase() ?? 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{user?.displayName || 'Admin'}</p>
                        <p className="text-slate-400 text-[10px] truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
