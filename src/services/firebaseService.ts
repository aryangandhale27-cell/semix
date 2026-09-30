import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc,
  updateDoc,
  deleteDoc, 
  query, 
  where,
  orderBy, 
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Product,
  Order,
  CustomProjectSubmission,
  AuthUser,
  UserRole,
  StaffMember,
} from '../types';

const PRODUCTS_CACHE_KEY = 'semix-cache-products-v1';
const LEGACY_PRODUCTS_CACHE_KEY = 'semix_products_cache_v1';
const CATEGORY_PRODUCTS_CACHE_PREFIX = 'semix-cache-cat-';
const CATEGORY_PRODUCTS_FRESH_MS = 30_000;
const categoryProductRequests = new Map<string, Promise<CategoryProductsPage | null>>();
const categoryProductCursors = new Map<string, QueryDocumentSnapshot<DocumentData> | null>();
const categoryProductFetchedAt = new Map<string, number>();

export interface CategoryProductsPage {
  products: Product[];
  hasMore: boolean;
}

/**
 * Helper to remove undefined values so Firestore doesn't throw 'Unsupported field value: undefined'
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  return JSON.parse(JSON.stringify(data, (_, v) => (v === undefined ? null : v)));
}

export async function syncRecordToFirestore(
  collectionName: string,
  recordId: string,
  data: Record<string, unknown>
): Promise<void> {
  const path = `${collectionName}/${recordId}`;
  try {
    await setDoc(doc(db, collectionName, recordId), sanitizeForFirestore(data), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Products Firestore Sync & Operations
 */
export async function syncProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const payload = sanitizeForFirestore({
      ...product,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'products', product.id), payload, { merge: true });
    console.log(`[Firestore] Product synced successfully to 'products/${product.id}': ${product.name}`);
  } catch (error) {
    console.error(`[Firestore] Error syncing product ${product.id}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncAllProductsToFirestore(products: Product[]): Promise<{ count: number; failed: number }> {
  let count = 0;
  let failed = 0;
  for (const product of products) {
    try {
      await syncProductToFirestore(product);
      count++;
    } catch (err) {
      failed++;
      console.warn(`[Firestore] Bulk sync failed for product ${product.id}:`, err);
    }
  }
  return { count, failed };
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fast direct fetch for the catalog.
 * Uses a single getDocs network request bounded to 25 documents.
 */
export async function fetchInitialProducts(limitCount = 25): Promise<Product[]> {
  const path = 'products';

  // 1. Instant local storage retrieval (0ms)
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY)
      || localStorage.getItem(LEGACY_PRODUCTS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch {}

  // 2. Fast single-hop read from Firestore
  try {
    const q = query(
      collection(db, path), 
      orderBy('createdAt', 'desc'), 
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const items: Product[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });

    if (items.length > 0) {
      try {
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(items));
      } catch {}
    }

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

function getCategoryProductsCacheKey(category: string): string {
  return `${CATEGORY_PRODUCTS_CACHE_PREFIX}${encodeURIComponent(category)}-v1`;
}

export function readCachedProductsByCategory(category: string): Product[] | null {
  try {
    const cached = localStorage.getItem(getCategoryProductsCacheKey(category));
    if (cached === null) return null;
    const parsed: unknown = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed as Product[] : null;
  } catch {
    return null;
  }
}

function mergeCategoryProducts(existing: Product[], incoming: Product[]): Product[] {
  const productsById = new Map(existing.map((product) => [product.id, product]));
  incoming.forEach((product) => productsById.set(product.id, product));
  return Array.from(productsById.values()).sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || '')
  );
}

export function fetchProductsByCategory(category: string, limitCount = 25): Promise<CategoryProductsPage | null> {
  const requestKey = `${category}:first`;
  const activeRequest = categoryProductRequests.get(requestKey);
  if (activeRequest) return activeRequest;
  const cachedProducts = readCachedProductsByCategory(category);
  const fetchedAt = categoryProductFetchedAt.get(category);
  if (cachedProducts && fetchedAt && Date.now() - fetchedAt < CATEGORY_PRODUCTS_FRESH_MS) {
    return Promise.resolve({
      products: cachedProducts,
      hasMore: Boolean(categoryProductCursors.get(category)),
    });
  }

  const request = (async () => {
    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        limit(limitCount)
      );
      const snapshot = await getDocs(productsQuery);
      const freshProducts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as Product));
      const products = mergeCategoryProducts(
        readCachedProductsByCategory(category) ?? [],
        freshProducts
      );
      const hasMore = snapshot.size === limitCount;
      categoryProductFetchedAt.set(category, Date.now());
      categoryProductCursors.set(
        category,
        hasMore ? snapshot.docs[snapshot.docs.length - 1] : null
      );

      try {
        localStorage.setItem(getCategoryProductsCacheKey(category), JSON.stringify(products));
      } catch {
        // Keep the network result usable when browser storage is unavailable.
      }
      return { products, hasMore };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.GET, `products(category=${category})`);
      } catch {
        return null;
      }
    } finally {
      categoryProductRequests.delete(requestKey);
    }
    return null;
  })();

  categoryProductRequests.set(requestKey, request);
  return request;
}

export function fetchNextProductsByCategory(
  category: string,
  existingProducts: Product[],
  limitCount = 25
): Promise<CategoryProductsPage | null> {
  const requestKey = `${category}:next`;
  const activeRequest = categoryProductRequests.get(requestKey);
  if (activeRequest) return activeRequest;

  const cursor = categoryProductCursors.get(category);
  if (!cursor) return Promise.resolve(null);

  const request = (async () => {
    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        startAfter(cursor),
        limit(limitCount)
      );
      const snapshot = await getDocs(productsQuery);
      const nextProducts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as Product));
      const products = mergeCategoryProducts(existingProducts, nextProducts);
      const hasMore = snapshot.size === limitCount;
      categoryProductFetchedAt.set(category, Date.now());
      categoryProductCursors.set(
        category,
        hasMore ? snapshot.docs[snapshot.docs.length - 1] : null
      );

      try {
        localStorage.setItem(getCategoryProductsCacheKey(category), JSON.stringify(products));
      } catch {
        // Keep the network result usable when browser storage is unavailable.
      }
      return { products, hasMore };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.GET, `products(category=${category})`);
      } catch {
        return null;
      }
    } finally {
      categoryProductRequests.delete(requestKey);
    }
    return null;
  })();

  categoryProductRequests.set(requestKey, request);
  return request;
}

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  return fetchInitialProducts(50);
}

export interface ProductSnapshotChange {
  type: 'added' | 'modified' | 'removed';
  product: Product;
}

/**
 * Lightweight listener for real-time catalog syncing.
 * Bounded strictly to 25 documents to prevent runaway read counts.
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: any) => void,
  onChanges?: (changes: ProductSnapshotChange[]) => void
): Unsubscribe {
  // 1. Instant Cache Dispatch
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onData(parsed);
      }
    }
  } catch {}

  // 2. Real-time query bounded to 25 items
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(25));
  let hasInitialSnapshot = false;

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() } as Product));

      if (!hasInitialSnapshot) {
        hasInitialSnapshot = true;
        onData(items);
        try {
          localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(items));
        } catch {}
        return;
      }

      const changes = snapshot.docChanges().map((change) => ({
        type: change.type,
        product: { id: change.doc.id, ...change.doc.data() } as Product,
      }));
      if (changes.length > 0) onChanges?.(changes);
      
      onData(items);
      try {
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(items));
      } catch {}
    },
    (err) => {
      console.warn('[Firestore] Products real-time listener notice:', err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Orders Firestore Sync, Queries, and Real-time Listeners
 */
export async function syncOrderToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), sanitizeForFirestore(order), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createOrderInFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderInFirestore(orderId: string, updates: Partial<Order>): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      const raw = docSnap.data() as Partial<Order> & Record<string, any>;
      orders.push({
        ...raw,
        id: raw.id || docSnap.id,
        status: raw.status || 'pending_assignment',
        assignedSellerId: raw.assignedSellerId ?? null,
        assignedSellerName: raw.assignedSellerName ?? null,
        assignedAt: raw.assignedAt ?? null,
      } as Order);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export async function fetchUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      limit(30)
    );
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export function subscribeToOrders(onData: (orders: Order[]) => void, onError?: (err: any) => void): Unsubscribe {
  const q = query(collection(db, 'orders'), limit(50));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const raw = docSnap.data() as Partial<Order> & Record<string, any>;
        orders.push({
          ...raw,
          id: raw.id || docSnap.id,
          status: raw.status || 'pending_assignment',
          assignedSellerId: raw.assignedSellerId ?? null,
          assignedSellerName: raw.assignedSellerName ?? null,
          assignedAt: raw.assignedAt ?? null,
        } as Order);
      });
      onData(orders);
    },
    (err) => {
      console.warn('[Firestore] Orders real-time listener notice:', err.message);
      if (onError) onError(err);
    }
  );
}

export function subscribeToUserOrders(userId: string, onData: (orders: Order[]) => void, onError?: (err: any) => void): Unsubscribe {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), limit(30));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as Order);
      });
      onData(orders);
    },
    (err) => {
      console.warn('[Firestore] User orders real-time listener notice:', err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Users Firestore Sync & Queries
 */
export async function syncUserToFirestore(user: AuthUser): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), {
      uid: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status || 'active',
      department: user.department || '',
      businessName: user.businessName || '',
      createdAt: user.createdAt || new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  const path = `users/${userId}`;
  try {
    await deleteDoc(doc(db, 'users', userId));
    await deleteDoc(doc(db, 'staff', userId)).catch(() => undefined);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function fetchUsersFromFirestore(): Promise<AuthUser[]> {
  try {
    const [usersSnapshot, staffSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'users'), limit(50))),
      getDocs(query(collection(db, 'staff'), limit(50))),
    ]);

    const staffMap = new Map<string, any>();
    staffSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.uid) staffMap.set(String(data.uid), data);
      if (data.email) staffMap.set(String(data.email).toLowerCase(), data);
    });

    const users: AuthUser[] = [];
    usersSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const uid = data.uid || docSnap.id;
      const email = (data.email || '').toLowerCase();
      const staffRecord = staffMap.get(String(uid)) || staffMap.get(email);
      const resolvedRole: UserRole = staffRecord?.role === 'team' ? 'team' : data.role || 'customer';

      users.push({
        id: uid,
        name: data.name || staffRecord?.name || '',
        email: data.email || staffRecord?.email || '',
        phone: data.phone || staffRecord?.phone || '',
        role: resolvedRole,
        status: data.status || (staffRecord?.active === false ? 'suspended' : 'active'),
        department: data.department || staffRecord?.department || undefined,
        businessName: data.businessName || undefined,
        createdAt: data.createdAt || new Date().toISOString().slice(0, 10),
      });
    });

    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'users + staff');
    return [];
  }
}

export function subscribeToUsers(onData: (users: AuthUser[]) => void, onError?: (err: any) => void): Unsubscribe {
  const q = query(collection(db, 'users'), limit(50));
  return onSnapshot(
    q,
    (snapshot) => {
      const users: AuthUser[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        users.push({
          id: data.uid || docSnap.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'customer',
          status: data.status || 'active',
          department: data.department || undefined,
          businessName: data.businessName || undefined,
          createdAt: data.createdAt || new Date().toISOString().slice(0, 10),
        });
      });
      onData(users);
    },
    (err) => {
      console.warn('[Firestore] Users real-time listener notice:', err.message);
      if (onError) onError(err);
    }
  );
}

export async function fetchStaffFromFirestore(): Promise<StaffMember[]> {
  const snapshot = await getDocs(query(collection(db, 'staff'), limit(50)));
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: data.uid || docSnap.id,
      name: data.name || '',
      email: data.email || '',
      role: data.role === 'admin' ? 'admin' : 'team',
      department: data.department || '',
      active: data.active !== false,
      lastActive: data.lastActive || 'Recently updated',
    } as StaffMember;
  });
}

export function subscribeToStaff(onData: (staff: StaffMember[]) => void, onError?: (err: any) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'staff'), limit(50)),
    (snapshot) => {
      onData(snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: data.uid || docSnap.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role === 'admin' ? 'admin' : 'team',
          department: data.department || '',
          active: data.active !== false,
          lastActive: data.lastActive || 'Recently updated',
        } as StaffMember;
      }));
    },
    (err) => {
      console.warn('[Firestore] Staff real-time listener notice:', err.message);
      onError?.(err);
    }
  );
}

export function subscribeToRecords(
  collectionName: string,
  onData: (records: Array<Record<string, any>>) => void,
  onError?: (err: any) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, collectionName), limit(50)),
    (snapshot) => onData(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))),
    (err) => {
      console.warn(`[Firestore] ${collectionName} real-time listener notice:`, err.message);
      onError?.(err);
    }
  );
}

export async function syncCustomProjectToFirestore(project: CustomProjectSubmission): Promise<void> {
  const path = `customProjects/${project.id}`;
  try {
    await setDoc(doc(db, 'customProjects', project.id), project, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}