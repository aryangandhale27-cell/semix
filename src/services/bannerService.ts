import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { HomepageBanner } from '../types';
import { INITIAL_HOMEPAGE_BANNERS } from '../mockData/banners';
import { sanitizeForFirestore } from './firebaseService';

const COLLECTION_NAME = 'banners';

/**
 * Legacy compatibility helper. Shared banners are loaded from Firestore.
 */
export function getLocalBanners(): HomepageBanner[] {
  return [];
}

/**
 * Legacy compatibility helper. Firestore snapshots update consumers directly.
 */
export function setLocalBanners(banners: HomepageBanner[]): void {
  void banners;
}

/**
 * Fetch all banners from Firestore. An empty collection is valid production state.
 */
export async function fetchBannersFromFirestore(): Promise<HomepageBanner[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const banners: HomepageBanner[] = [];
    snapshot.forEach((docSnap) => {
      banners.push({ id: docSnap.id, ...docSnap.data() } as HomepageBanner);
    });

    const sorted = banners.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted;
  } catch (err) {
    console.error('[BannerService] Firestore fetch failed:', err);
    handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
  }
}

/**
 * Seed initial banners to Firestore
 */
export async function seedInitialBanners(): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const banner of INITIAL_HOMEPAGE_BANNERS) {
      const ref = doc(db, COLLECTION_NAME, banner.id);
      batch.set(ref, sanitizeForFirestore(banner), { merge: true });
    }
    await batch.commit();
    console.log('[BannerService] Initial banners successfully seeded to Firestore.');
  } catch (err) {
    console.warn('[BannerService] Notice: Could not seed to Firestore:', err);
  }
}

/**
 * Save or update a banner in Firestore and local storage
 */
export async function syncBannerToFirestore(banner: HomepageBanner): Promise<void> {
  const path = `${COLLECTION_NAME}/${banner.id}`;
  try {
    const payload = sanitizeForFirestore({
      ...banner,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, COLLECTION_NAME, banner.id), payload, { merge: true });
    console.log(`[BannerService] Synced banner ${banner.id} to Firestore`);
  } catch (err) {
    console.error(`[BannerService] Error syncing banner ${banner.id}:`, err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Delete a banner from Firestore
 */
export async function deleteBannerFromFirestore(bannerId: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${bannerId}`;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, bannerId));
    console.log(`[BannerService] Deleted banner ${bannerId} from Firestore`);
  } catch (err) {
    console.error(`[BannerService] Error deleting banner ${bannerId}:`, err);
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to realtime updates for banners
 */
export function subscribeToBanners(
  onData: (banners: HomepageBanner[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const items: HomepageBanner[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as HomepageBanner);
      });
      const sorted = items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      onData(sorted);
    },
    (err) => {
      console.warn('[BannerService] Realtime banner subscription notice:', err.message);
      if (onError) onError(err);
    }
  );
}
