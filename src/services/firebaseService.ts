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
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Order, CustomProjectSubmission, AuthUser } from '../types';

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

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const path = 'products';
  try {
    const q = query(collection(db, path), limit(100));
    const snapshot = await getDocs(q);
    const items: Product[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as Product);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeToProducts(onData: (products: Product[]) => void, onError?: (err: any) => void): Unsubscribe {
  const q = query(collection(db, 'products'), limit(100));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Product);
      });
      onData(items);
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
    await setDoc(doc(db, 'orders', order.id), order, { merge: true });
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
      orders.push(docSnap.data() as Order);
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
        orders.push(docSnap.data() as Order);
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

export async function fetchUsersFromFirestore(): Promise<AuthUser[]> {
  const path = 'users';
  try {
    const q = query(collection(db, path), limit(100));
    const snapshot = await getDocs(q);
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
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
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
