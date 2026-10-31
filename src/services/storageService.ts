import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../lib/firebase';

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  if (!dataUrl.startsWith('data:')) {
    throw new Error('Invalid image data.');
  }

  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error('Could not prepare image data.');
  }

  return response.blob();
}

export async function uploadImageDataUrl(
  dataUrl: string,
  options: { folder: string; resourceId: string; filename: string }
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('You must be signed in to upload product images.');
  }

  const blob = await dataUrlToBlob(dataUrl);
  const safeFilename = options.filename.replace(/[^a-zA-Z0-9._-]/g, '-');
  const uniqueId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  const storagePath = `${options.folder}/${options.resourceId}/${Date.now()}-${uniqueId}-${safeFilename}`;
  const imageRef = ref(storage, storagePath);

  await uploadBytes(imageRef, blob, {
    contentType: blob.type,
    cacheControl: 'public, max-age=31536000, immutable',
    customMetadata: {
      uploadedBy: auth.currentUser.uid,
      resourceId: options.resourceId,
    },
  });

  return getDownloadURL(imageRef);
}

export async function uploadCustomerListFile(file: File, requestId: string): Promise<{ fileUrl: string; storagePath: string }> {
  const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const storagePath = `customer-list-uploads/${requestId}/${safeFilename}`;
  const fileRef = ref(storage, storagePath);
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeTypeByExtension: Record<string, string> = {
    csv: 'text/csv',
    tsv: 'text/tab-separated-values',
    txt: 'text/plain',
    pdf: 'application/pdf',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    odt: 'application/vnd.oasis.opendocument.text',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    heic: 'image/heic',
  };
  const contentType = file.type || mimeTypeByExtension[extension || ''] || 'application/octet-stream';

  await uploadBytes(fileRef, file, {
    contentType,
    customMetadata: { requestId },
  });

  return { fileUrl: await getDownloadURL(fileRef), storagePath };
}
