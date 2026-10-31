import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { UploadedListRequest } from '../types';
import { uploadCustomerListFile } from './storageService';

export async function submitUploadedListRequest(
  customerName: string,
  phone: string,
  file: File
): Promise<UploadedListRequest> {
  const requestRef = doc(collection(db, 'uploaded_list_requests'));
  const { fileUrl, storagePath } = await uploadCustomerListFile(file, requestRef.id);
  const request: UploadedListRequest = {
    id: requestRef.id,
    customerName: customerName.trim(),
    phone: phone.trim(),
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    fileSize: file.size,
    fileUrl,
    storagePath,
    createdAt: new Date().toISOString(),
    status: 'submitted',
  };

  try {
    await setDoc(requestRef, request);
  } catch (error) {
    try {
      await deleteObject(ref(storage, storagePath));
    } catch (cleanupError) {
      console.error('[UploadedList] Could not clean up an unlinked file:', cleanupError);
    }
    throw error;
  }

  return request;
}

export function subscribeToUploadedListRequests(
  onData: (requests: UploadedListRequest[]) => void,
  onError: (error: Error) => void
) {
  return onSnapshot(
    query(collection(db, 'uploaded_list_requests'), orderBy('createdAt', 'desc'), limit(200)),
    (snapshot) => onData(snapshot.docs.map((entry) => entry.data() as UploadedListRequest)),
    onError
  );
}

export async function claimUploadedListRequest(requestId: string): Promise<UploadedListRequest> {
  const requestRef = doc(db, 'uploaded_list_requests', requestId);
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(requestRef);
    if (!snapshot.exists()) throw new Error('This uploaded list request no longer exists.');
    const request = snapshot.data() as UploadedListRequest;
    if (request.status !== 'submitted') throw new Error('This request is already being processed or has been converted.');
    transaction.update(requestRef, { status: 'converting' });
    return request;
  });
}

export async function markUploadedListRequestConverted(requestId: string, orderId: string): Promise<void> {
  await updateDoc(doc(db, 'uploaded_list_requests', requestId), {
    status: 'converted',
    convertedOrderId: orderId,
  });
}

export async function releaseUploadedListRequest(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'uploaded_list_requests', requestId), { status: 'submitted' });
}
