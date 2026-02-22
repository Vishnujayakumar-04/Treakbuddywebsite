import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export type UploadProgressCallback = (progress: number) => void;

/**
 * Upload a single image to Firebase Storage under placeImages/{placeId}/{folder}/{filename}
 */
export async function uploadPlaceImage(
    placeId: string,
    file: File,
    folder: 'cover' | 'gallery',
    onProgress?: UploadProgressCallback
): Promise<string> {
    if (!storage) throw new Error('Firebase Storage not initialized');

    const extension = file.name.split('.').pop() || 'jpg';
    const filename = folder === 'cover'
        ? `cover.${extension}`
        : `${Date.now()}_${Math.random().toString(36).slice(2)}.${extension}`;

    const storageRef = ref(storage, `placeImages/${placeId}/${folder}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress?.(Math.round(progress));
            },
            reject,
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
            }
        );
    });
}

/**
 * Delete an image from Firebase Storage by its full download URL
 */
export async function deletePlaceImage(downloadUrl: string): Promise<void> {
    if (!storage) return;
    try {
        const imageRef = ref(storage, downloadUrl);
        await deleteObject(imageRef);
    } catch {
        // Ignore not-found errors (image may have already been deleted)
    }
}

/**
 * Upload multiple gallery images and return all download URLs
 */
export async function uploadGalleryImages(
    placeId: string,
    files: File[],
    onProgress?: UploadProgressCallback
): Promise<string[]> {
    let completed = 0;
    const urls = await Promise.all(
        files.map(file =>
            uploadPlaceImage(placeId, file, 'gallery', () => {
                completed++;
                onProgress?.(Math.round((completed / files.length) * 100));
            })
        )
    );
    return urls;
}
