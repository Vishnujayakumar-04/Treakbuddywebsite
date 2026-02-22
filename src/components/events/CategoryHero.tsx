'use client';

import { Bell, Share, Wand2, Home, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryHeroProps {
    title: string;
    description: string;
    imageSrc: string;
    followersCount: string;
}

export function CategoryHero({ title, description, imageSrc, followersCount }: CategoryHeroProps) {
    return (
        <div className="container max-w-[1280px] mx-auto px-4 py-6 md:py-8">
            <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 min-h-[350px] shadow-2xl">

                {/* Background Image layer with Gradient fade to black on the left */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover object-center md:object-right mix-blend-overlay opacity-60"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 md:via-[#0f172a]/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-between p-6 md:p-10 lg:p-12 w-full md:w-[70%] xl:w-[60%] text-white">
                    <div>
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
                            <Link href="/" className="hover:text-white transition-colors">
                                <Home className="w-4 h-4" />
                            </Link>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                            <Link href="/dashboard/events" className="hover:text-white transition-colors">
                                Pondicherry
                            </Link>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-white">{title}</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-medium mb-6">
                            in Pondicherry
                        </p>

                        {/* Description */}
                        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-4 mt-auto justify-end">
                        <button
                            onClick={() => alert('Opening AI Event Planner...')}
                            className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500 backdrop-blur-md text-white rounded-full px-5 py-2.5 font-bold text-sm flex items-center shadow-lg border border-white/20 transition-transform hover:scale-105 active:scale-95"
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Ask AI to plan for you
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
