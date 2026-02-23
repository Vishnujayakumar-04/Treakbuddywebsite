import Image from 'next/image';

interface EventCardProps {
    title: string;
    date: string;
    location: string;
    interested: string;
    imageSrc: string;
}

export function EventCard({ title, date, location, interested, imageSrc }: EventCardProps) {
    return (
        <div className="group cursor-pointer">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                />

                {/* Save 'star' button */}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/-2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
            </div>

            <p className="text-[#0284c7] dark:text-sky-400 text-xs font-semibold mb-1 uppercase tracking-wide">
                {date}
            </p>
            <h3 className="font-bold text-gray-900 dark:text-white leading-tight text-[15px] mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-[13px] mb-1 truncate">
                {location}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
                <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full border border-white dark:border-slate-950 overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[8px] font-bold text-blue-600 dark:text-blue-300">
                        U1
                    </div>
                    <div className="w-5 h-5 rounded-full border border-white dark:border-slate-950 overflow-hidden bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-[8px] font-bold text-amber-600 dark:text-amber-300">
                        U2
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    {interested}
                </p>
            </div>
        </div>
    );
}
