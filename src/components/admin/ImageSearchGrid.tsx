'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ImageResult } from '@/types/admin';
import { Crown, CheckCircle2, Images, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageSearchGridProps {
    images: ImageResult[];
    selectedCover: string | null;
    selectedGallery: string[];
    onSelectCover: (url: string) => void;
    onToggleGallery: (url: string) => void;
}

export function ImageSearchGrid({
    images,
    selectedCover,
    selectedGallery,
    onSelectCover,
    onToggleGallery,
}: ImageSearchGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const getState = useCallback(
        (img: ImageResult) => {
            if (img.url === selectedCover) return 'cover';
            if (selectedGallery.includes(img.url)) return 'gallery';
            return 'none';
        },
        [selectedCover, selectedGallery]
    );

    const handleClick = (img: ImageResult) => {
        const state = getState(img);
        if (state === 'none') {
            // First click → set as cover (if no cover), else add to gallery
            if (!selectedCover) {
                onSelectCover(img.url);
            } else {
                onToggleGallery(img.url);
            }
        } else if (state === 'cover') {
            // Click cover → deselect
            onSelectCover('');
        } else {
            // Click gallery → remove from gallery
            onToggleGallery(img.url);
        }
    };

    const galleryIndex = (url: string) => selectedGallery.indexOf(url) + 1;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => {
                const state = getState(img);
                const isCover = state === 'cover';
                const isGallery = state === 'gallery';
                const isSelected = isCover || isGallery;

                return (
                    <div
                        key={img.id}
                        onClick={() => handleClick(img)}
                        onMouseEnter={() => setHoveredId(img.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={cn(
                            'relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 select-none',
                            isSelected
                                ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg scale-[1.02]'
                                : 'hover:scale-[1.02] hover:shadow-md',
                            isCover && 'ring-amber-400',
                            isGallery && 'ring-cyan-500',
                            !isSelected && 'ring-1 ring-slate-200 dark:ring-slate-700'
                        )}
                    >
                        {/* Image */}
                        <Image
                            src={img.thumb || img.url}
                            alt={img.alt}
                            fill
                            className="object-cover"
                            unoptimized
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />

                        {/* Hover overlay */}
                        <div className={cn(
                            'absolute inset-0 transition-opacity duration-200',
                            hoveredId === img.id || isSelected ? 'opacity-100' : 'opacity-0',
                            isCover
                                ? 'bg-amber-950/30'
                                : isGallery
                                    ? 'bg-cyan-950/30'
                                    : 'bg-slate-900/20'
                        )} />

                        {/* Selection badges */}
                        {isCover && (
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                                <Crown className="w-3 h-3" />
                                COVER
                            </div>
                        )}
                        {isGallery && (
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-cyan-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                                <Images className="w-3 h-3" />
                                #{galleryIndex(img.url)}
                            </div>
                        )}

                        {/* Checkmark */}
                        {isSelected && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className={cn(
                                    'w-5 h-5 drop-shadow',
                                    isCover ? 'text-amber-400' : 'text-cyan-400'
                                )} />
                            </div>
                        )}

                        {/* Source badge */}
                        <div className={cn(
                            'absolute bottom-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md',
                            img.source === 'google'
                                ? 'bg-blue-600/80 text-white'
                                : 'bg-emerald-600/80 text-white'
                        )}>
                            {img.source}
                        </div>

                        {/* Photographer credit */}
                        {img.photographer && hoveredId === img.id && (
                            <div className="absolute bottom-2 left-2 right-10 text-[9px] text-white/80 truncate">
                                📷 {img.photographer}
                            </div>
                        )}

                        {/* Action hint on hover */}
                        {!isSelected && hoveredId === img.id && (
                            <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3 gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onSelectCover(img.url); }}
                                    className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg hover:bg-amber-300 transition-colors"
                                >
                                    Set Cover
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleGallery(img.url); }}
                                    className="bg-cyan-500 text-white text-[10px] font-black px-2 py-1 rounded-lg hover:bg-cyan-400 transition-colors"
                                >
                                    + Gallery
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Skeleton Loading Grid ─────────────────────────────────────────────────────
export function ImageSearchGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="aspect-[4/3] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                />
            ))}
        </div>
    );
}
