'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
    label: string;
    value?: string; // existing URL
    multiple?: boolean;
    values?: string[]; // for gallery
    onFileSelect: (files: File[]) => void;
    onRemoveExisting?: (url: string) => void;
    accept?: string;
    maxSizeMB?: number;
    uploading?: boolean;
    progress?: number;
}

export function ImageUploader({
    label, value, multiple = false, values = [], onFileSelect,
    onRemoveExisting, accept = 'image/*', maxSizeMB = 5,
    uploading = false, progress = 0
}: ImageUploaderProps) {
    const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        const valid: File[] = [];
        const maxBytes = maxSizeMB * 1024 * 1024;
        setError(null);
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) { setError('Only image files allowed'); return; }
            if (file.size > maxBytes) { setError(`Max file size is ${maxSizeMB}MB`); return; }
            valid.push(file);
        });
        if (!valid.length) return;
        const newPreviews = valid.map(file => ({ url: URL.createObjectURL(file), file }));
        setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
        onFileSelect(valid);
    }, [maxSizeMB, multiple, onFileSelect]);

    const removePreview = (url: string) => {
        setPreviews(prev => prev.filter(p => p.url !== url));
        URL.revokeObjectURL(url);
    };

    const displayImages = [
        ...(value ? [{ url: value, isExisting: true }] : []),
        ...values.map(url => ({ url, isExisting: true })),
        ...previews.map(p => ({ url: p.url, isExisting: false })),
    ];

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>

            {/* Drop Zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={cn(
                    'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
                    dragOver ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                )}
            >
                <input
                    ref={inputRef} type="file" accept={accept}
                    multiple={multiple} className="hidden"
                    onChange={e => handleFiles(e.target.files)}
                />
                {uploading ? (
                    <div className="space-y-3">
                        <Loader2 className="w-8 h-8 mx-auto text-cyan-500 animate-spin" />
                        <p className="text-sm text-slate-500">Uploading... {progress}%</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div className="bg-cyan-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                ) : (
                    <>
                        <ImagePlus className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Drop images here or <span className="text-cyan-600">click to browse</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to {maxSizeMB}MB</p>
                    </>
                )}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* Preview Grid */}
            {displayImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {displayImages.map(({ url, isExisting }) => (
                        <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            <Image src={url} alt="preview" fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={e => { e.stopPropagation(); isExisting ? onRemoveExisting?.(url) : removePreview(url); }}
                                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {isExisting && (
                                <div className="absolute top-1.5 left-1.5 bg-cyan-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                                    Saved
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
