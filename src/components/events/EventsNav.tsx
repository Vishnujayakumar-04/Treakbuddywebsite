import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = [
    { name: 'All', active: true },
    {
        name: 'Entertainment',
        hasDropdown: true,
        dropdownItems: ['Music', 'Concerts', 'Parties & Nightlife', 'Performances', 'Comedy', 'Dance']
    },
    { name: 'Art & Theatre', hasDropdown: true },
    { name: 'Food & Drinks', hasDropdown: false },
    { name: 'Business', hasDropdown: false },
    { name: 'Festivals', hasDropdown: false },
    { name: 'Today', hasDropdown: false },
    { name: 'This Weekend', hasDropdown: false },
    { name: 'More', hasDropdown: true },
];

export function EventsNav() {
    return (
        <div className="w-full border-b border-gray-200 bg-white dark:bg-slate-950 dark:border-slate-800 sticky top-0 z-40 relative">
            <div className="container max-w-[1280px] mx-auto px-4">
                <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
                    {CATEGORIES.map((cat, idx) => (
                        <div key={idx} className="relative group shrink-0">
                            {cat.hasDropdown ? (
                                <button className={`flex items-center gap-1 px-4 py-3 text-[14px] font-medium transition-colors whitespace-nowrap ${cat.active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'} group-hover:text-blue-600`}>
                                    {cat.name}
                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                                </button>
                            ) : (
                                <Link
                                    href="#"
                                    className={`block px-4 py-3 text-[14px] font-medium transition-colors whitespace-nowrap ${cat.active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                >
                                    {cat.name}
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {cat.dropdownItems && (
                                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 py-3 min-w-[220px]">
                                        {cat.dropdownItems.map((item, i) => (
                                            <Link
                                                key={i}
                                                href="#"
                                                className="block px-5 py-2.5 text-[15px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}

// Global no-scrollbar style block to hide scrollbars cleanly
export const NoScrollbarStyles = () => (
    <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    `}</style>
);
