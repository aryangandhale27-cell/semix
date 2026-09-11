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

const STORAGE_KEY = 'semix_categories_v2';
const COLLECTION_NAME = 'categories';

/**
 * Get cached categories from localStorage or fall back to CATEGORIES
 */
export function getLocalCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[CategoryService] Failed to read local categories:', e);
  }
  return CATEGORIES;
}

/**
 * Save categories to localStorage
 */
export function setLocalCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.warn('[CategoryService] Failed to save local categories:', e);
  }
}

/**
 * Fetch all categories from Firestore or seed if empty
 */
export async function fetchCategoriesFromFirestore(): Promise<Category[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('[CategoryService] No categories in Firestore. Seeding defaults...');
      await seedDefaultCategories();
      return CATEGORIES;
    }

    const items: Category[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as Category);
    });

    setLocalCategories(items);
    return items;
  } catch (err) {
    console.warn('[CategoryService] Firestore fetch error, falling back to local/defaults:', err);
    return getLocalCategories();
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
        onData(getLocalCategories());
        return;
      }
      const items: Category[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      setLocalCategories(items);
      onData(items);
    },
    (err) => {
      console.warn('[CategoryService] Realtime categories notice:', err.message);
      if (onError) onError(err);
      onData(getLocalCategories());
    }
  );
}
