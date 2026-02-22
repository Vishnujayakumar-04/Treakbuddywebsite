/**
 * imageUtils.ts — Client-side image utilities for Next.js admin panel
 * - Canvas-based compression (no external deps)
 * - Upload from URL → Firebase Storage (via CORS proxy)
 * - Upload from File → Firebase Storage (with compression)
 * - Image search (delegates to shared module → server API route)
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { ImageSearchResponse } from '@/types/admin';
import { searchImages } from '@/lib/admin/imageSearchShared';

// ─── Search: delegates to shared module (server-proxy mode) ───────────────────
// → hits /api/admin/images/search which calls Wikimedia (primary) + Pexels (fallback)
export async function searchPlaceImages(
    name: string,
    location: string,
): Promise<ImageSearchResponse> {
    const result = await searchImages({
        placeName: name,
        location: location || 'Puducherry',
        useServerProxy: true,
    });
    return result as unknown as ImageSearchResponse;
}

// ─── Canvas Compression ────────────────────────────────────────────────────────
export async function compressImageBlob(
    blob: Blob,
    maxWidth = 1200,
    maxHeight = 900,
    quality = 0.82,
): Promise<Blob> {
    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(blob);
        img.onload = () => {
            let { width, height } = img;
            const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (c) => { URL.revokeObjectURL(objectUrl); resolve(c || blob); },
                'image/jpeg',
                quality,
            );
        };
        img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(blob); };
        img.src = objectUrl;
    });
}

// ─── Fetch external image URL → Blob (via server CORS proxy) ─────────────────
async function urlToBlob(url: string): Promise<Blob> {
    const res = await fetch(`/api/admin/images/proxy?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`Proxy fetch failed: ${res.status}`);
    return res.blob();
}

// ─── Upload from external URL → Firebase Storage ──────────────────────────────
export async function uploadFromUrl(
    placeId: string,
    imageUrl: string,
    folder: 'cover' | 'gallery',
    onProgress?: (pct: number) => void,
): Promise<string> {
    if (!storage) throw new Error('Firebase Storage not initialized');
    onProgress?.(10);
    const blob = await urlToBlob(imageUrl);
    onProgress?.(40);
    const compressed = await compressImageBlob(blob);
    onProgress?.(60);

    const filename = folder === 'cover'
        ? 'cover.jpg'
        : `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

    const storageRef = ref(storage, `placeImages/${placeId}/${folder}/${filename}`);
    await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
    onProgress?.(90);
    const downloadUrl = await getDownloadURL(storageRef);
    onProgress?.(100);
    return downloadUrl;
}

// ─── Upload from File → Firebase Storage (with compression) ──────────────────
export async function uploadFromFile(
    placeId: string,
    file: File,
    folder: 'cover' | 'gallery',
    onProgress?: (pct: number) => void,
): Promise<string> {
    if (!storage) throw new Error('Firebase Storage not initialized');
    onProgress?.(20);
    const compressed = await compressImageBlob(file);
    onProgress?.(50);

    const filename = folder === 'cover'
        ? 'cover.jpg'
        : `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

    const storageRef = ref(storage, `placeImages/${placeId}/${folder}/${filename}`);
    await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
    onProgress?.(85);
    const url = await getDownloadURL(storageRef);
    onProgress?.(100);
    return url;
}

// ─── Generate blur placeholder (canvas gradient) ─────────────────────────────
export function generateBlurDataUrl(width = 40, height = 30): string {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#cbd5e1');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.1);
}
