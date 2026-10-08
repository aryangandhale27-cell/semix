import { 
  collection, 
  doc, 
  getDoc,
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
  startAt,
  endAt,
  getCountFromServer,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import type { QueryConstraint, QueryDocumentSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Product,
  Order,
  CustomProjectSubmission,
  AuthUser,
  UserRole,
  StaffMember,
} from '../types';

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
 * Products Firestore Sync & Realtime Listener
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

export async function fetchProductByIdFromFirestore(productId: string): Promise<Product | null> {
  try {
    if (!productId) return null;
    const snapshot = await getDoc(doc(db, 'products', productId));
    if (!snapshot.exists()) return null;
    return { ...snapshot.data(), id: snapshot.id } as Product;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `products/${productId}`);
  }
}

export async function fetchInitialProductsFromFirestore(options: {
  category?: string;
  productId?: string;
  limitCount?: number;
} = {}): Promise<Product[]> {
  try {
    if (options.productId) {
      const single = await fetchProductByIdFromFirestore(options.productId);
      return single ? [single] : [];
    }

    const productsRef = collection(db, 'products');
    const batchLimit = options.limitCount || 24;

    const initialQuery = options.category
      ? query(productsRef, where('category', '==', options.category), limit(batchLimit))
      : query(productsRef, orderBy('createdAt', 'desc'), limit(batchLimit));

    const snapshot = await getDocs(initialQuery);
    const products: Product[] = [];
    snapshot.forEach((productDoc) => {
      products.push({ ...productDoc.data(), id: productDoc.id } as Product);
    });

    return products.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'products');
  }
}

export async function fetchProductCountFromFirestore(category?: string): Promise<number> {
  try {
    const productsRef = collection(db, 'products');
    const q = category && category !== 'All'
      ? query(productsRef, where('category', '==', category))
      : productsRef;
    const countSnapshot = await getCountFromServer(q);
    return countSnapshot.data().count;
  } catch (error) {
    console.warn('[Firestore] fetchProductCount notice:', error);
    return 0;
  }
}

export interface PaginatedProductsResult {
  products: Product[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
  totalCount: number;
}

export async function fetchPaginatedProductsFromFirestore(options: {
  category?: string;
  pageSize?: number;
  startAfterDoc?: QueryDocumentSnapshot | null;
  sortBy?: string;
  inStockOnly?: boolean;
}): Promise<PaginatedProductsResult> {
  try {
    const productsRef = collection(db, 'products');
    const pageSize = options.pageSize || 24;
    const category = options.category && options.category !== 'All' ? options.category : undefined;

    // Build constraints
    const constraints: QueryConstraint[] = [];
    if (category) {
      constraints.push(where('category', '==', category));
    }
    if (options.inStockOnly) {
      constraints.push(where('inStock', '==', true));
    }

    // Sort constraints
    if (!category && !options.inStockOnly) {
      if (options.sortBy === 'newest') {
        constraints.push(orderBy('createdAt', 'desc'));
      } else if (options.sortBy === 'price-low') {
        constraints.push(orderBy('price', 'asc'));
      } else if (options.sortBy === 'price-high') {
        constraints.push(orderBy('price', 'desc'));
      } else {
        constraints.push(orderBy('createdAt', 'desc'));
      }
    }

    if (options.startAfterDoc) {
      constraints.push(startAfter(options.startAfterDoc));
    }

    // Request 1 extra item to accurately detect hasMore
    constraints.push(limit(pageSize + 1));

    const q = query(productsRef, ...constraints);
    const snapshot = await getDocs(q);

    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;
    const resultDocs = hasMore ? docs.slice(0, pageSize) : docs;
    const lastDoc = resultDocs.length > 0 ? resultDocs[resultDocs.length - 1] : null;

    const products: Product[] = resultDocs.map((docSnap) => ({
      ...docSnap.data(),
      id: docSnap.id,
    } as Product));

    return {
      products,
      lastDoc,
      hasMore,
      totalCount: 0,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'products');
  }
}

const PRODUCT_SEARCH_CACHE_TTL_MS = 5_000;
const productSearchCache = new Map<string, { expiresAt: number; request: Promise<Product[]> }>();

export function searchProductsInFirestore(term: string, limitCount = 10): Promise<Product[]> {
  const cleanTerm = term.trim();
  if (!cleanTerm || cleanTerm.length < 2) return Promise.resolve([]);

  const cacheKey = `${cleanTerm.toLocaleLowerCase()}|${limitCount}`;
  const cached = productSearchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.request;

  const request = (async () => {
    try {
      const productsRef = collection(db, 'products');
      const titleCase = cleanTerm.charAt(0).toUpperCase() + cleanTerm.slice(1);
      const lowerCase = cleanTerm.toLowerCase();
      const upperCase = cleanTerm.toUpperCase();
      const variations = Array.from(new Set([titleCase, cleanTerm, lowerCase, upperCase]));
      const perQueryLimit = Math.max(1, Math.ceil(limitCount / variations.length));

      const queries = variations.map((prefix) =>
        query(
          productsRef,
          orderBy('name'),
          startAt(prefix),
          endAt(prefix + '\uf8ff'),
          limit(perQueryLimit)
        )
      );

      const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
      const productMap = new Map<string, Product>();

      snapshots.forEach((snap) => {
        snap.forEach((docSnap) => {
          productMap.set(docSnap.id, { ...docSnap.data(), id: docSnap.id } as Product);
        });
      });

      return Array.from(productMap.values()).slice(0, limitCount);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'products');
    }
  })();

  for (const [key, entry] of productSearchCache) {
    if (entry.expiresAt <= Date.now()) productSearchCache.delete(key);
  }
  if (productSearchCache.size >= 50) {
    const oldestKey = productSearchCache.keys().next().value;
    if (oldestKey) productSearchCache.delete(oldestKey);
  }
  productSearchCache.set(cacheKey, { expiresAt: Date.now() + PRODUCT_SEARCH_CACHE_TTL_MS, request });
  void request.catch(() => {
    if (productSearchCache.get(cacheKey)?.request === request) {
      productSearchCache.delete(cacheKey);
    }
  });
  return request;
}

export async function fetchProductsFromFirestore(limitCount = 50): Promise<Product[]> {
  const path = 'products';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    const items: Product[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ ...docSnap.data(), id: docSnap.id } as Product);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export interface ProductSnapshotChange {
  type: 'added' | 'modified' | 'removed';
  product: Product;
}

export function subscribeToProducts(
  onData: (products: Product[], fromCache: boolean) => void,
  onError?: (err: any) => void,
  onChanges?: (changes: ProductSnapshotChange[], fromCache: boolean) => void,
  limitCount = 24
): Unsubscribe {
  // CRITICAL: Bound query to prevent streaming 11,000+ documents on startup
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(limitCount));
  let hasInitialSnapshot = false;
  let hasInitialServerSnapshot = false;

  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      if (!hasInitialSnapshot) {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => items.push({ ...docSnap.data(), id: docSnap.id } as Product));
        hasInitialSnapshot = true;
        hasInitialServerSnapshot = !snapshot.metadata.fromCache;
        onData(items, snapshot.metadata.fromCache);
        return;
      }

      if (!snapshot.metadata.fromCache && !hasInitialServerSnapshot) {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => items.push({ ...docSnap.data(), id: docSnap.id } as Product));
        hasInitialServerSnapshot = true;
        onData(items, false);
        return;
      }

      const changes = snapshot.docChanges().map((change) => ({
        type: change.type,
        product: { id: change.doc.id, ...change.doc.data() } as Product,
      }));
      if (changes.length > 0) onChanges?.(changes, snapshot.metadata.fromCache);
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
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
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
  }
}

/**
 * Fetch orders filtered specifically for the logged-in user
 */
export async function fetchUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Real-time listener for orders
 */
export function subscribeToOrders(onData: (orders: Order[]) => void, onError?: (err: any) => void): Unsubscribe {
  const q = query(collection(db, 'orders'), limit(100));
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

/**
 * Real-time listener for user-specific orders
 */
export function subscribeToUserOrders(userId: string, onData: (orders: Order[]) => void, onError?: (err: any) => void): Unsubscribe {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), limit(50));
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
    console.log(`[Firestore] Synced user ${user.email} (${user.id}) to collection 'users' in semix-ai-stdio`);
  } catch (error) {
    console.error(`[Firestore] Failed to sync user ${user.email}:`, error);
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
    // Fetch both users and staff records.
    // Staff records are authoritative for Team members.
    const [usersSnapshot, staffSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'users'), limit(100))),
      getDocs(query(collection(db, 'staff'), limit(100))),
    ]);

    // Build a map of staff members by UID/email.
    const staffMap = new Map<string, any>();

    staffSnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.uid) {
        staffMap.set(String(data.uid), data);
      }

      if (data.email) {
        staffMap.set(String(data.email).toLowerCase(), data);
      }
    });

    const users: AuthUser[] = [];

    usersSnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const uid = data.uid || docSnap.id;
      const email = (data.email || '').toLowerCase();

      // If this account exists in Staff, Staff determines the role.
      const staffRecord =
        staffMap.get(String(uid)) ||
        staffMap.get(email);

      const resolvedRole: UserRole =
        staffRecord?.role === 'team'
          ? 'team'
          : data.role || 'customer';

      users.push({
        id: uid,
        name: data.name || staffRecord?.name || '',
        email: data.email || staffRecord?.email || '',
        phone: data.phone || staffRecord?.phone || '',
        role: resolvedRole,
        status:
          data.status ||
          (staffRecord?.active === false ? 'suspended' : 'active'),
        department:
          data.department ||
          staffRecord?.department ||
          undefined,
        businessName: data.businessName || undefined,
        createdAt:
          data.createdAt ||
          new Date().toISOString().slice(0, 10),
      });
    });

    // Also include Team members that exist in Staff
    // but don't yet have a users document.
    staffSnapshot.forEach((docSnap) => {
      const staff = docSnap.data();

      if (staff.role !== 'team') {
        return;
      }

      const uid = staff.uid || docSnap.id;
      const email = (staff.email || '').toLowerCase();

      const alreadyExists = users.some(
        (u) =>
          u.id === uid ||
          u.email.toLowerCase() === email
      );

      if (!alreadyExists) {
        users.push({
          id: uid,
          name: staff.name || '',
          email,
          phone: staff.phone || '',
          role: 'team',
          status:
            staff.active === false ? 'suspended' : 'active',
          department:
            staff.department || 'Warehouse & Fulfillment',
          createdAt:
            new Date().toISOString().slice(0, 10),
        });
      }
    });

    return users;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.GET,
      'users + staff'
    );

    return [];
  }
}

export function subscribeToUsers(onData: (users: AuthUser[]) => void, onError?: (err: any) => void): Unsubscribe {
  const q = query(collection(db, 'users'), limit(100));
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
  const snapshot = await getDocs(query(collection(db, 'staff'), limit(100)));
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
    query(collection(db, 'staff'), limit(100)),
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
    query(collection(db, collectionName), limit(200)),
    (snapshot) => onData(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))),
    (err) => {
      console.warn(`[Firestore] ${collectionName} real-time listener notice:`, err.message);
      onError?.(err);
    }
  );
}

/**
 * Custom Projects Firestore Sync
 */
export async function syncCustomProjectToFirestore(project: CustomProjectSubmission): Promise<void> {
  const path = `customProjects/${project.id}`;
  try {
    await setDoc(doc(db, 'customProjects', project.id), project, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
