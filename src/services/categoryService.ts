import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  onSnapshot,
  Unsubscribe,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Category } from '../types';
import { CATEGORIES } from '../mockData/products';
import { sanitizeForFirestore } from './firebaseService';

const COLLECTION_NAME = 'categories';

/**
 * Legacy compatibility helper. Shared categories are loaded from Firestore.
 */
export function getLocalCategories(): Category[] {
  return [];
}

/**
 * Legacy compatibility helper. Firestore snapshots update consumers directly.
 */
export function setLocalCategories(categories: Category[]): void {
  void categories;
}

/**
 * Fetch all categories from Firestore. An empty collection is valid production state.
 */
export async function fetchCategoriesFromFirestore(): Promise<Category[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const items: Category[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as Category);
    });

    return items;
  } catch (err) {
    console.error('[CategoryService] Firestore fetch failed:', err);
    handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
  }
}

/**
 * Seed initial categories to Firestore
 */
export async function seedDefaultCategories(): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const cat of CATEGORIES) {
      const ref = doc(db, COLLECTION_NAME, cat.id);
      batch.set(ref, sanitizeForFirestore(cat), { merge: true });
    }
    await batch.commit();
    console.log('[CategoryService] Categories seeded to Firestore.');
  } catch (err) {
    console.warn('[CategoryService] Notice: Could not seed categories to Firestore:', err);
  }
}

/**
 * Sync single category to Firestore
 */
export async function syncCategoryToFirestore(category: Category): Promise<void> {
  const path = `${COLLECTION_NAME}/${category.id}`;
  try {
    const payload = sanitizeForFirestore(category);
    await setDoc(doc(db, COLLECTION_NAME, category.id), payload, { merge: true });
    console.log(`[CategoryService] Synced category ${category.id} to Firestore`);
  } catch (err) {
    console.error(`[CategoryService] Error syncing category ${category.id}:`, err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Update category image specifically
 */
export async function updateCategoryImageInFirestore(categoryId: string, imageUrl: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${categoryId}`;
  try {
    await setDoc(doc(db, COLLECTION_NAME, categoryId), { image: imageUrl }, { merge: true });
    console.log(`[CategoryService] Updated category image for ${categoryId}`);
  } catch (err) {
    console.error(`[CategoryService] Error updating image for category ${categoryId}:`, err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to realtime updates for categories
 */
export function subscribeToCategories(
  onData: (categories: Category[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION_NAME));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const items: Category[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      onData(items);
    },
    (err) => {
      console.warn('[CategoryService] Realtime categories notice:', err.message);
      if (onError) onError(err);
    }
  );
}
