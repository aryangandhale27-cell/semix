import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../lib/firebase';

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, encoded] = dataUrl.split(',');
  if (!header || !encoded || !header.startsWith('data:')) {
    throw new Error('Invalid image data.');
  }
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/webp';
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

export async function uploadImageDataUrl(
  dataUrl: string,
  options: { folder: string; resourceId: string; filename: string }
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('You must be signed in to upload product images.');
  }

  const blob = dataUrlToBlob(dataUrl);
  const safeFilename = options.filename.replace(/[^a-zA-Z0-9._-]/g, '-');
  const uniqueId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  const storagePath = `${options.folder}/${options.resourceId}/${Date.now()}-${uniqueId}-${safeFilename}`;
  const imageRef = ref(storage, storagePath);

  await uploadBytes(imageRef, blob, {
    contentType: blob.type,
    customMetadata: {
      uploadedBy: auth.currentUser.uid,
      resourceId: options.resourceId,
    },
  });

  return getDownloadURL(imageRef);
}
