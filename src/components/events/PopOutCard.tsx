import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PopOutCardProps {
    title: string;
    bgColor?: string;   
    textColor?: string; 
    imageSrc: string;
    href?: string;
    priority?: boolean;
}

export function PopOutCard({ title, imageSrc, href = "#", priority = false }: PopOutCardProps) {
    return (
        <Link href={href} className="group block h-[280px] w-full relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/10 dark:border-slate-800">
            {/* Background Image */}
            <Image
                src={imageSrc}
                alt={title}
                fill
                priority={priority}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                unoptimized
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content Container */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-2xl font-black text-white mb-2 leading-none tracking-tight drop-shadow-lg">
                        {title}
                    </h3>
                    <div className="h-1 w-12 bg-blue-500 mb-4 transform origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out">
                        Explore Events <ArrowRight className="w-4 h-4 text-blue-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
