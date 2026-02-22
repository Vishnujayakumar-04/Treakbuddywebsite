'use client';

import { useState, useCallback } from 'react';
import {
    Sparkles, Search, AlertCircle, Upload, RefreshCw,
    Crown, Images, CheckCircle2, Loader2, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageSearchGrid, ImageSearchGridSkeleton } from '@/components/admin/ImageSearchGrid';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { searchPlaceImages, uploadFromUrl, uploadFromFile } from '@/lib/admin/imageUtils';
import { ImageResult, ImageSearchResponse } from '@/types/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SmartImagePickerProps {
    placeName: string;
    location: string;
    placeId: string;
    onCoverReady: (url: string) => void;
    onGalleryReady: (urls: string[]) => void;
    existingCover?: string;
    existingGallery?: string[];
}

type PickerTab = 'search' | 'upload';
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export function SmartImagePicker({
    placeName,
    location,
    placeId,
    onCoverReady,
    onGalleryReady,
    existingCover = '',
    existingGallery = [],
}: SmartImagePickerProps) {

    const [tab, setTab] = useState<PickerTab>('search');
    const [searchResult, setSearchResult] = useState<ImageSearchResponse | null>(null);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Selection state
    const [selectedCover, setSelectedCover] = useState<string>(existingCover);
    const [selectedGallery, setSelectedGallery] = useState<string[]>(existingGallery);

    // Upload state
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Manual upload files
    const [coverFiles, setCoverFiles] = useState<File[]>([]);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    // Collapsed state for selected summary
    const [showSelected, setShowSelected] = useState(true);

    const handleSearch = useCallback(async () => {
        if (!placeName.trim()) { toast.error('Enter a place name first'); return; }
        setSearching(true);
        setSearchError(null);
        setSearchResult(null);
        try {
            const result = await searchPlaceImages(placeName, location);
            setSearchResult(result);
            if (result.images.length === 0) {
                setSearchError('No images found. Try the manual upload tab.');
                setTab('upload');
            } else if (result.cached) {
                toast.success(`${result.images.length} images loaded (cached)`, { icon: '⚡' });
            } else {
                toast.success(`${result.images.length} images found from ${result.source}`);
            }
        } catch (err: any) {
            setSearchError(err.message || 'Search failed');
            setTab('upload');
        } finally {
            setSearching(false);
        }
    }, [placeName, location]);

    const toggleGallery = useCallback((url: string) => {
        setSelectedGallery(prev =>
            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
        );
    }, []);

    const setCover = useCallback((url: string) => {
        setSelectedCover(url);
    }, []);

    const totalSelected = (selectedCover ? 1 : 0) + selectedGallery.length;

    const handleConfirmSelection = async () => {
        if (!selectedCover && selectedGallery.length === 0) {
            toast.error('Select at least one image');
            return;
        }
        setIsUploading(true);
        setUploadStatus('uploading');
        try {
            let coverUrl = '';
            const galleryUrls: string[] = [];
            const total = (selectedCover ? 1 : 0) + selectedGallery.length;
            let done = 0;

            // Upload cover
            if (selectedCover) {
                const url = await uploadFromUrl(placeId, selectedCover, 'cover', (p) => {
                    setUploadProgress(Math.round((done / total) * 100 + p / total));
                });
                coverUrl = url;
                done++;
                setUploadProgress(Math.round((done / total) * 100));
            }

            // Upload gallery images
            for (const imgUrl of selectedGallery) {
                const url = await uploadFromUrl(placeId, imgUrl, 'gallery', (p) => {
                    setUploadProgress(Math.round((done / total) * 100 + p / total));
                });
                galleryUrls.push(url);
                done++;
                setUploadProgress(Math.round((done / total) * 100));
            }

            onCoverReady(coverUrl);
            onGalleryReady(galleryUrls);
            setUploadStatus('done');
            toast.success('Images uploaded to Firebase Storage! ✅');
        } catch (err: any) {
            setUploadStatus('error');
            toast.error(`Upload failed: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleManualUpload = async () => {
        if (coverFiles.length === 0 && galleryFiles.length === 0) {
            toast.error('Select at least one file to upload');
            return;
        }
        setIsUploading(true);
        setUploadStatus('uploading');
        try {
            let coverUrl = existingCover;
            const galleryUrls = [...existingGallery];
            const total = coverFiles.length + galleryFiles.length;
            let done = 0;

            for (const file of coverFiles) {
                const url = await uploadFromFile(placeId, file, 'cover', (p) => {
                    setUploadProgress(Math.round((done / total) * 100 + p / total));
                });
                coverUrl = url;
                done++;
            }

            for (const file of galleryFiles) {
                const url = await uploadFromFile(placeId, file, 'gallery', (p) => {
                    setUploadProgress(Math.round((done / total) * 100 + p / total));
                });
                galleryUrls.push(url);
                done++;
            }

            onCoverReady(coverUrl);
            onGalleryReady(galleryUrls);
            setUploadStatus('done');
            toast.success('Images compressed & uploaded! ✅');
        } catch (err: any) {
            setUploadStatus('error');
            toast.error(`Upload failed: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const hasApiKeys = true; // Server checks this; show search UI always

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Smart Image Picker</h3>
                    <p className="text-[11px] text-slate-400">Auto-fetch from Google Places & Pexels, or upload manually</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                {(['search', 'upload'] as PickerTab[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={cn(
                            'px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5',
                            tab === t
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        )}
                    >
                        {t === 'search' ? <><Search className="w-3 h-3" />Auto Search</> : <><Upload className="w-3 h-3" />Manual Upload</>}
                    </button>
                ))}
            </div>

            {/* ── AUTO SEARCH TAB ── */}
            {tab === 'search' && (
                <div className="space-y-5">
                    {/* Search trigger */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {placeName ? `"${placeName}${location ? `, ${location}` : ''}"` : 'Enter place name above first'}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Will search Google Places + Pexels</p>
                        </div>
                        <Button
                            type="button"
                            onClick={handleSearch}
                            disabled={searching || !placeName}
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold shrink-0 shadow-lg shadow-violet-500/20"
                        >
                            {searching
                                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Searching...</>
                                : <><Sparkles className="w-4 h-4 mr-2" />Find Images</>
                            }
                        </Button>
                    </div>

                    {/* Error state */}
                    {searchError && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-700 dark:text-red-400">{searchError}</p>
                                <p className="text-xs text-red-500 mt-0.5">API keys may not be configured. Use manual upload.</p>
                            </div>
                            <button onClick={() => setSearchError(null)} className="text-red-400 hover:text-red-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {searching && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </div>
                            <ImageSearchGridSkeleton count={8} />
                        </div>
                    )}

                    {/* Results grid */}
                    {!searching && searchResult && searchResult.images.length > 0 && (
                        <div className="space-y-3">
                            {/* Result meta */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-semibold">{searchResult.images.length} images</span>
                                    <span>from</span>
                                    <span className={cn('font-bold capitalize px-2 py-0.5 rounded-full text-[10px]',
                                        searchResult.source === 'google' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                            searchResult.source === 'pexels' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
                                    )}>
                                        {searchResult.source}
                                    </span>
                                    {searchResult.cached && <span className="text-violet-500 font-semibold">⚡ cached</span>}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 font-medium"
                                >
                                    <RefreshCw className="w-3 h-3" /> Refresh
                                </button>
                            </div>

                            {/* Instruction */}
                            <p className="text-xs text-slate-400">
                                <span className="text-amber-500 font-bold">Click once</span> → set as cover &nbsp;|&nbsp;
                                <span className="text-cyan-500 font-bold">Click again</span> → add to gallery
                            </p>

                            <ImageSearchGrid
                                images={searchResult.images}
                                selectedCover={selectedCover}
                                selectedGallery={selectedGallery}
                                onSelectCover={setCover}
                                onToggleGallery={toggleGallery}
                            />
                        </div>
                    )}

                    {/* Selected summary + upload CTA */}
                    {totalSelected > 0 && (
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowSelected(v => !v)}
                                    className="flex items-center gap-2 text-sm font-black text-violet-700 dark:text-violet-400"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {totalSelected} image{totalSelected > 1 ? 's' : ''} selected
                                    {showSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    {selectedCover && <span className="flex items-center gap-1 text-amber-600"><Crown className="w-3 h-3" />1 cover</span>}
                                    {selectedGallery.length > 0 && <span className="flex items-center gap-1 text-cyan-600"><Images className="w-3 h-3" />{selectedGallery.length} gallery</span>}
                                </div>
                            </div>

                            {showSelected && uploadStatus === 'uploading' && (
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Compressing & uploading to Firebase Storage...</span>
                                        <span className="font-bold">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-violet-100 dark:bg-violet-900/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {uploadStatus === 'done' ? (
                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Uploaded to Firebase Storage successfully!
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleConfirmSelection}
                                    disabled={isUploading}
                                    className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold shadow-lg"
                                >
                                    {isUploading
                                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading {uploadProgress}%...</>
                                        : <><Upload className="w-4 h-4 mr-2" />Upload Selected to Firebase Storage</>
                                    }
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── MANUAL UPLOAD TAB ── */}
            {tab === 'upload' && (
                <div className="space-y-5">
                    <ImageUploader
                        label="Cover Image"
                        value={existingCover}
                        onFileSelect={files => setCoverFiles(files)}
                        onRemoveExisting={() => onCoverReady('')}
                        uploading={isUploading && coverFiles.length > 0}
                        progress={uploadProgress}
                    />
                    <ImageUploader
                        label="Gallery Images"
                        multiple
                        values={existingGallery}
                        onFileSelect={files => setGalleryFiles(files)}
                        onRemoveExisting={url => onGalleryReady(existingGallery.filter(u => u !== url))}
                        uploading={isUploading && galleryFiles.length > 0}
                        progress={uploadProgress}
                    />

                    {(coverFiles.length > 0 || galleryFiles.length > 0) && uploadStatus !== 'done' && (
                        <Button
                            type="button"
                            onClick={handleManualUpload}
                            disabled={isUploading}
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold shadow-lg"
                        >
                            {isUploading
                                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Compressing & Uploading {uploadProgress}%...</>
                                : <><Upload className="w-4 h-4 mr-2" />Compress & Upload to Firebase Storage</>
                            }
                        </Button>
                    )}

                    {uploadStatus === 'done' && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            Images uploaded & saved!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
