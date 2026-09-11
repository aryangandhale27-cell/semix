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

const STORAGE_KEY = 'semix_homepage_banners_v2';
const COLLECTION_NAME = 'banners';

/**
 * Get cached banners from localStorage or fall back to INITIAL_HOMEPAGE_BANNERS
 */
export function getLocalBanners(): HomepageBanner[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch (e) {
    console.warn('[BannerService] Failed to read local banners:', e);
  }
  return INITIAL_HOMEPAGE_BANNERS;
}

/**
 * Save banners to localStorage
 */
export function setLocalBanners(banners: HomepageBanner[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
  } catch (e) {
    console.warn('[BannerService] Failed to save local banners:', e);
  }
}

/**
 * Fetch all banners from Firestore, or initialize with initial banners if empty
 */
export async function fetchBannersFromFirestore(): Promise<HomepageBanner[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('[BannerService] No banners in Firestore. Seeding initial banners...');
      await seedInitialBanners();
      return INITIAL_HOMEPAGE_BANNERS;
    }

    const banners: HomepageBanner[] = [];
    snapshot.forEach((docSnap) => {
      banners.push({ id: docSnap.id, ...docSnap.data() } as HomepageBanner);
    });

    const sorted = banners.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setLocalBanners(sorted);
    return sorted;
  } catch (err) {
    console.warn('[BannerService] Firestore fetch error, falling back to local/initial:', err);
    return getLocalBanners();
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
        onData(getLocalBanners());
        return;
      }
      const items: HomepageBanner[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as HomepageBanner);
      });
      const sorted = items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setLocalBanners(sorted);
      onData(sorted);
    },
    (err) => {
      console.warn('[BannerService] Realtime banner subscription notice:', err.message);
      if (onError) onError(err);
      onData(getLocalBanners());
    }
  );
}
