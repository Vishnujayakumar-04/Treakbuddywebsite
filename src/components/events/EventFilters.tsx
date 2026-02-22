'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function EventFilters({ activeCategory }: { activeCategory: string }) {
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    const toggleFilter = (filter: string) => {
        setOpenFilter(openFilter === filter ? null : filter);
    };

    return (
        <div className="container max-w-[1280px] mx-auto px-4 py-2 relative z-30">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 md:pb-0 relative">

                {/* Category Filter */}
                <div className="relative">
                    <button
                        onClick={() => toggleFilter('category')}
                        className={`flex items-center justify-between min-w-[130px] border ${openFilter === 'category' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-slate-700'} bg-white dark:bg-slate-900 rounded-full px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all whitespace-nowrap`}
                    >
                        {activeCategory}
                        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-2 transition-transform duration-200 ${openFilter === 'category' ? 'rotate-180' : ''}`} />
                    </button>
                    {openFilter === 'category' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2">
                            {['Music', 'Concerts', 'Festivals', 'Dance', 'Theatre'].map((cat) => (
                                <button key={cat} onClick={() => setOpenFilter(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Filter */}
                <div className="relative">
                    <button
                        onClick={() => toggleFilter('date')}
                        className={`flex items-center justify-between min-w-[130px] border ${openFilter === 'date' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-slate-700'} bg-white dark:bg-slate-900 rounded-full px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all whitespace-nowrap`}
                    >
                        Date
                        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-2 transition-transform duration-200 ${openFilter === 'date' ? 'rotate-180' : ''}`} />
                    </button>
                    {openFilter === 'date' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2">
                            {['Today', 'Tomorrow', 'This Weekend', 'Next Week'].map((date) => (
                                <button key={date} onClick={() => setOpenFilter(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    {date}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Filter */}
                <div className="relative">
                    <button
                        onClick={() => toggleFilter('price')}
                        className={`flex items-center justify-between min-w-[130px] border ${openFilter === 'price' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-slate-700'} bg-white dark:bg-slate-900 rounded-full px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all whitespace-nowrap`}
                    >
                        Price
                        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-2 transition-transform duration-200 ${openFilter === 'price' ? 'rotate-180' : ''}`} />
                    </button>
                    {openFilter === 'price' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2">
                            {['Free', 'Paid', 'Under ₹500', '₹500 - ₹2000'].map((price) => (
                                <button key={price} onClick={() => setOpenFilter(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    {price}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
