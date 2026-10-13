import { 
  collection, 
  doc, 
  writeBatch,
  getDoc,
  getDocs, 
  getAggregateFromServer,
  count,
  sum,
  setDoc, 
  addDoc,
  updateDoc,
  deleteDoc, 
  query, 
  where,
  orderBy, 
  limit,
  startAfter,
  documentId,
  onSnapshot,
  Unsubscribe,
  QueryConstraint
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
      searchKeywords: generateProductSearchKeywords(product),
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'products', product.id), payload, { merge: true });
    console.log(`[Firestore] Product synced successfully to 'products/${product.id}': ${product.name}`);
  } catch (error) {
    console.error(`[Firestore] Error syncing product ${product.id}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

const normalizeProductSearchValue = (value: string) =>
  value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export function generateProductSearchKeywords(product: Product): string[] {
  const values = [
    product.name,
    product.sku,
    product.brand,
    product.category,
    product.subcategory,
    product.shortDescription,
    product.description,
    product.voltage,
    product.protocol,
    ...(product.tags || []),
    ...(product.specifications || []).flatMap((specification) => [specification.name, specification.value]),
  ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
  const keywords = new Set<string>();

  values.forEach((value) => {
    const normalized = normalizeProductSearchValue(value);
    normalized.split(/\s+/).forEach((word) => {
      if (word.length >= 2) keywords.add(word);
      word.match(/[a-z]+|\d+/g)?.forEach((part) => {
        if (part.length >= 2) keywords.add(part);
      });
    });
  });

  return Array.from(keywords).slice(0, 1000);
}

export async function backfillProductSearchKeywords(
  products: Product[],
  onProgress?: (completed: number, total: number) => void
): Promise<number> {
  const batchSize = 400;
  let completed = 0;

  try {
    for (let offset = 0; offset < products.length; offset += batchSize) {
      const batch = writeBatch(db);
      const batchProducts = products.slice(offset, offset + batchSize);
      batchProducts.forEach((product) => {
        batch.update(doc(db, 'products', product.id), {
          searchKeywords: generateProductSearchKeywords(product),
        });
      });
      await batch.commit();
      completed += batchProducts.length;
      onProgress?.(completed, products.length);
    }
    return completed;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'products.searchKeywords');
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

export async function fetchInitialProductsFromFirestore(options: {
  category?: string;
  productId?: string;
} = {}): Promise<Product[]> {
  try {
    if (options.productId) {
      const snapshot = await getDoc(doc(db, 'products', options.productId));
      return snapshot.exists()
        ? [{ ...snapshot.data(), id: snapshot.id } as Product]
        : [];
    }

    const productsRef = collection(db, 'products');
    const initialQuery = options.category
      ? query(productsRef, where('category', '==', options.category), limit(24))
      : query(productsRef, orderBy('createdAt', 'desc'), limit(24));
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

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const path = 'products';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
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

export async function fetchProductsByIdsFromFirestore(productIds: string[]): Promise<Product[]> {
  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));
  if (uniqueIds.length === 0) return [];

  try {
    const batches: string[][] = [];
    for (let index = 0; index < uniqueIds.length; index += 30) {
      batches.push(uniqueIds.slice(index, index + 30));
    }

    const snapshots = await Promise.all(batches.map((ids) => getDocs(query(
      collection(db, 'products'),
      where(documentId(), 'in', ids)
    ))));
    return snapshots.flatMap((snapshot) =>
      snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as Product)
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'products');
  }
}

export interface ProductPageCursor {
  id: string;
  value: string | number;
}

export interface ProductPageOptions {
  after?: ProductPageCursor | null;
  category?: string;
  pageSize?: number;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface ProductPage {
  products: Product[];
  nextCursor: ProductPageCursor | null;
  hasMore: boolean;
}

export async function fetchProductsPageFromFirestore({
  after,
  category,
  pageSize = 24,
  sortBy = 'featured',
}: ProductPageOptions = {}): Promise<ProductPage> {
  const productsRef = collection(db, 'products');
  const pageLimit = Math.max(1, Math.min(500, Math.floor(pageSize)));
  const constraints: QueryConstraint[] = [];

  if (category && category !== 'All' && category !== 'all') {
    constraints.push(where('category', '==', category));
    constraints.push(orderBy(documentId(), 'asc'));
    if (after) constraints.push(startAfter(after.id));
  } else {
    const sortField = sortBy === 'price-low' || sortBy === 'price-high'
      ? 'price'
      : sortBy === 'rating'
        ? 'rating'
        : 'createdAt';
    const direction = sortBy === 'price-high' || sortBy === 'rating' ? 'desc' : 'asc';
    constraints.push(orderBy(sortField, sortField === 'createdAt' ? 'desc' : direction));
    constraints.push(orderBy(documentId(), sortField === 'createdAt' || direction === 'desc' ? 'desc' : 'asc'));
    if (after) constraints.push(startAfter(after.value, after.id));
  }

  constraints.push(limit(pageLimit + 1));

  try {
    const snapshot = await getDocs(query(productsRef, ...constraints));
    const docs = snapshot.docs.slice(0, pageLimit);
    const products = docs.map((item) => ({ ...item.data(), id: item.id }) as Product);
    const last = docs[docs.length - 1];
    const lastProduct = products[products.length - 1];
    const hasMore = snapshot.docs.length > pageLimit;
    const cursorValue = category && category !== 'All' && category !== 'all'
      ? last?.id
      : sortBy === 'price-low' || sortBy === 'price-high'
        ? lastProduct?.price
        : sortBy === 'rating'
          ? lastProduct?.rating
          : lastProduct?.createdAt;

    return {
      products,
      hasMore,
      nextCursor: hasMore && last && lastProduct && cursorValue !== undefined
        ? { id: last.id, value: cursorValue }
        : null,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'products');
  }
}

export async function fetchFlaggedProductsFromFirestore(
  flag: 'isBestSeller' | 'isNew',
  pageSize: number
): Promise<Product[]> {
  const boundedPageSize = Math.max(1, Math.min(100, Math.floor(pageSize)));
  try {
    const snapshot = await getDocs(query(
      collection(db, 'products'),
      where(flag, '==', true),
      limit(boundedPageSize)
    ));
    return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as Product);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `products.${flag}`);
  }
}

export interface ProductSearchCursor {
  field: 'name' | 'sku' | 'searchKeywords';
  value: string;
  id: string;
}

export interface ProductSearchPage {
  products: Product[];
  nextCursor: ProductSearchCursor | null;
  hasMore: boolean;
}

// Reuse autocomplete results briefly when the same query is submitted or revisited.
const productSearchCache = new Map<string, { expiresAt: number; page: ProductSearchPage }>();
const productSearchRequests = new Map<string, Promise<ProductSearchPage>>();
const PRODUCT_SEARCH_CACHE_TTL_MS = 10_000;
const PRODUCT_SEARCH_CACHE_LIMIT = 50;

export async function searchProductsPageFromFirestore(
  rawQuery: string,
  after?: ProductSearchCursor | null,
  pageSize = 24
): Promise<ProductSearchPage> {
  const trimmedQuery = rawQuery.trim();
  if (!trimmedQuery) return { products: [], nextCursor: null, hasMore: false };

  const pageLimit = Math.max(1, Math.min(100, Math.floor(pageSize)));
  const cursorKey = after ? `${after.field}:${after.value}:${after.id}` : '';
  const cacheKey = `${trimmedQuery}|${cursorKey}|${pageLimit}`;
  const cached = productSearchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.page;
  if (cached) productSearchCache.delete(cacheKey);

  const pendingRequest = productSearchRequests.get(cacheKey);
  if (pendingRequest) return pendingRequest;

  const request = fetchProductsSearchPageFromFirestore(trimmedQuery, after, pageLimit);
  productSearchRequests.set(cacheKey, request);
  try {
    const page = await request;
    productSearchCache.set(cacheKey, { expiresAt: Date.now() + PRODUCT_SEARCH_CACHE_TTL_MS, page });
    if (productSearchCache.size > PRODUCT_SEARCH_CACHE_LIMIT) {
      const oldestKey = productSearchCache.keys().next().value;
      if (oldestKey) productSearchCache.delete(oldestKey);
    }
    return page;
  } finally {
    productSearchRequests.delete(cacheKey);
  }
}

async function fetchProductsSearchPageFromFirestore(
  trimmedQuery: string,
  after: ProductSearchCursor | null | undefined,
  pageLimit: number
): Promise<ProductSearchPage> {
  try {
    const normalizeSearchText = (value: string) =>
      value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
    const normalizedQuery = normalizeSearchText(trimmedQuery);
    const queryTokens = Array.from(new Set(
      trimmedQuery.toLowerCase().split(/\s+/).map(normalizeSearchText).filter((token) => token.length >= 2)
    ));
    const searchTokenVariants = (token: string): string[] => {
      let singular = token;
      if (token.length > 4) {
        if (token.endsWith('ies')) {
          singular = `${token.slice(0, -3)}y`;
        } else if (/(ches|shes|xes|zes|sses)$/.test(token)) {
          singular = token.slice(0, -2);
        } else if (token.endsWith('s') && !token.endsWith('ss')) {
          singular = token.slice(0, -1);
        }
      }
      return singular === token ? [token] : [token, singular];
    };
    const namePrefixes = new Set([
      trimmedQuery,
      trimmedQuery.toLowerCase(),
      trimmedQuery.toUpperCase(),
      `${trimmedQuery.charAt(0).toUpperCase()}${trimmedQuery.slice(1)}`,
    ]);
    const namePrefixSnapshots = await Promise.all(Array.from(namePrefixes).map((prefix) => {
      const constraints: QueryConstraint[] = [
        where('name', '>=', prefix),
        where('name', '<=', `${prefix}\uf8ff`),
        orderBy('name'),
        orderBy(documentId()),
      ];
      if (after?.field === 'name') constraints.push(startAfter(after.value, after.id));
      constraints.push(limit(pageLimit + 1));
      return getDocs(query(collection(db, 'products'), ...constraints));
    }));
    const namePrefixProducts = new Map<string, Product>();
    namePrefixSnapshots.flatMap((snapshot) => snapshot.docs).forEach((item) => {
      const product = { ...item.data(), id: item.id } as Product;
      const searchableText = normalizeSearchText([
        product.name,
        product.sku,
        product.brand,
        product.category,
        product.subcategory,
        product.shortDescription,
        product.description,
        product.voltage,
        product.protocol,
        ...(product.tags || []),
        ...(product.specifications || []).flatMap((specification) => [specification.name, specification.value]),
      ].filter((value): value is string => typeof value === 'string').join(' '));
      if (searchableText.includes(normalizedQuery) ||
        queryTokens.every((token) => searchableText.includes(normalizeSearchText(token)))) {
        namePrefixProducts.set(product.id, product);
      }
    });

    if (namePrefixProducts.size > 0) {
      const products = Array.from(namePrefixProducts.values())
        .sort((left, right) => left.name.localeCompare(right.name))
        .slice(0, pageLimit);
      const hasMore = namePrefixSnapshots.some((snapshot) => snapshot.docs.length > pageLimit);
      const cursorSnapshot = namePrefixSnapshots.find((snapshot) => snapshot.docs.length > pageLimit);
      const cursorProduct = cursorSnapshot?.docs[Math.min(pageLimit - 1, cursorSnapshot.docs.length - 1)];
      return {
        products,
        hasMore,
        nextCursor: cursorProduct
          ? { field: 'name', value: String(cursorProduct.get('name') || ''), id: cursorProduct.id }
          : null,
      };
    }

    if (after?.field === 'name') {
      return { products: [], nextCursor: null, hasMore: false };
    }

    const keywordConstraintsFor = (token: string): QueryConstraint[] => {
      const constraints: QueryConstraint[] = [
        where('searchKeywords', 'array-contains-any', searchTokenVariants(token)),
        orderBy(documentId()),
      ];
      if (after?.field === 'searchKeywords') constraints.push(startAfter(after.id));
      constraints.push(limit(pageLimit + 1));
      return constraints;
    };
    const keywordSnapshots = await Promise.all(queryTokens.map((token) =>
      getDocs(query(collection(db, 'products'), ...keywordConstraintsFor(token)))
    ));
    const matchedKeywordIds = keywordSnapshots.length === 0
      ? new Set<string>()
      : keywordSnapshots.slice(1).reduce(
        (ids, snapshot) => {
          const snapshotIds = new Set(snapshot.docs.map((product) => product.id));
          return new Set(Array.from(ids).filter((id) => snapshotIds.has(id)));
        },
        new Set(keywordSnapshots[0].docs.map((product) => product.id))
      );
    const keywordProducts = keywordSnapshots.length > 0
      ? keywordSnapshots[0].docs
        .filter((item) => matchedKeywordIds.has(item.id))
        .map((item) => ({ ...item.data(), id: item.id } as Product))
      : [];

    if (after?.field === 'searchKeywords' || keywordProducts.length > 0) {
      const hasMore = keywordSnapshots.some((snapshot) => snapshot.docs.length > pageLimit);
      const pageProducts = keywordProducts.slice(0, pageLimit);
      const cursorProduct = hasMore
        ? keywordSnapshots[0]?.docs[Math.min(pageLimit - 1, (keywordSnapshots[0]?.docs.length || 1) - 1)]
        : undefined;
      return {
        products: pageProducts,
        hasMore,
        nextCursor: cursorProduct
          ? { field: 'searchKeywords', value: queryTokens[0], id: cursorProduct.id }
          : null,
      };
    }

    const prefixQuery = trimmedQuery.split(/\s+/)[0];
    const searchFields: Array<'name' | 'sku'> = after ? [after.field] : ['name', 'sku'];
    const rawPrefixes = new Set([
      prefixQuery,
      prefixQuery.toLowerCase(),
      prefixQuery.toUpperCase(),
      `${prefixQuery.charAt(0).toUpperCase()}${prefixQuery.slice(1)}`,
    ]);
    const searchablePrefixes = Array.from(rawPrefixes);
    const prefixQueries = searchFields.flatMap((field) => searchablePrefixes.map((prefix) => {
      const constraints: QueryConstraint[] = [
        where(field, '>=', prefix),
        where(field, '<=', `${prefix}\uf8ff`),
        orderBy(field),
        orderBy(documentId()),
      ];
      if (after?.field === field && after.value.toLowerCase().startsWith(prefix.toLowerCase())) {
        constraints.push(startAfter(after.value, after.id));
      }
      constraints.push(limit(pageLimit + 1));
      return { field, prefix, request: getDocs(query(collection(db, 'products'), ...constraints)) };
    }));
    const queryResults = await Promise.all(prefixQueries.map(({ request }) => request));
    const snapshotsByField = new Map(searchFields.map((field) => [
      field,
      queryResults.filter((_, index) => prefixQueries[index].field === field),
    ]));
    const docs = queryResults.flatMap((snapshot) => snapshot.docs);
    const matched = new Map<string, Product>();
    docs.forEach((item) => {
      const product = { ...item.data(), id: item.id } as Product;
      const fields = [
        product.name,
        product.sku,
        product.brand,
        product.category,
        product.subcategory,
        product.shortDescription,
        product.description,
        product.voltage,
        product.protocol,
        ...(product.tags || []),
        ...(product.specifications || []).flatMap((specification) => [specification.name, specification.value]),
      ].filter((value): value is string => typeof value === 'string');
      const searchableText = normalizeSearchText(fields.join(' '));
      const matches = Boolean(normalizedQuery) &&
        (searchableText.includes(normalizedQuery) ||
          queryTokens.every((token) => searchableText.includes(normalizeSearchText(token))));
      if (matches) matched.set(product.id, product);
    });

    if (!after) {
      const [tagSnapshots, brandSnapshots] = await Promise.all([
        Promise.all(searchablePrefixes.map((prefix) => getDocs(query(
          collection(db, 'products'),
          where('tags', 'array-contains', prefix),
          limit(pageLimit + 1)
        )))),
        Promise.all(searchablePrefixes.map((prefix) => getDocs(query(
          collection(db, 'products'),
          where('brand', '>=', prefix),
          where('brand', '<=', `${prefix}\uf8ff`),
          limit(pageLimit + 1)
        )))),
      ]);
      [...tagSnapshots, ...brandSnapshots].flatMap((snapshot) => snapshot.docs).forEach((item) => {
        const product = { ...item.data(), id: item.id } as Product;
        const values = [
          product.brand,
          ...(product.tags || []),
          product.name,
          product.sku,
          product.category,
          product.subcategory,
          product.shortDescription,
          product.description,
          product.voltage,
          product.protocol,
          ...(product.specifications || []).flatMap((specification) => [specification.name, specification.value]),
        ].filter((value): value is string => typeof value === 'string');
        const searchableText = normalizeSearchText(values.join(' '));
        if (searchableText.includes(normalizedQuery) ||
          queryTokens.every((token) => searchableText.includes(normalizeSearchText(token)))) {
          matched.set(product.id, product);
        }
      });
    }

    const products = Array.from(matched.values())
      .sort((left, right) => {
        const score = (product: Product) => {
          const name = normalizeSearchText(product.name);
          const sku = normalizeSearchText(product.sku);
          const brand = normalizeSearchText(product.brand);
          const tags = normalizeSearchText((product.tags || []).join(' '));
          if (name.startsWith(normalizedQuery)) return 4;
          if (sku.startsWith(normalizedQuery)) return 3;
          if (brand.includes(normalizedQuery) || tags.includes(normalizedQuery)) return 2;
          return 1;
        };
        return score(right) - score(left) || left.name.localeCompare(right.name);
      })
      .slice(0, pageLimit);
    const nextField = searchFields.find((field) =>
      (snapshotsByField.get(field) || []).some((snapshot) => snapshot.docs.length > pageLimit)
    );
    const nextSnapshot = nextField
      ? (snapshotsByField.get(nextField) || []).find((snapshot) => snapshot.docs.length > pageLimit)
      : undefined;
    const last = nextSnapshot?.docs.at(-1);
    return {
      products,
      hasMore: searchFields.some((field) =>
        (snapshotsByField.get(field) || []).some((snapshot) => snapshot.docs.length > pageLimit)
      ),
      nextCursor: nextField && last
        ? { field: nextField, value: String(last.get(nextField) || ''), id: last.id }
        : null,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'products.search');
  }
}

export interface ProductSnapshotChange {
  type: 'added' | 'modified' | 'removed';
  product: Product;
}

export interface ProductInventorySummary {
  totalSkusCount: number;
  totalStockUnits: number;
  lowStockSkusCount: number;
}

export async function fetchProductInventorySummaryFromFirestore(): Promise<ProductInventorySummary> {
  try {
    const productsQuery = query(collection(db, 'products'));
    const lowStockQuery = query(collection(db, 'products'), where('stockCount', '<=', 10));
    const [inventorySnapshot, lowStockSnapshot] = await Promise.all([
      getAggregateFromServer(productsQuery, {
        totalSkusCount: count(),
        totalStockUnits: sum('stockCount'),
      }),
      getAggregateFromServer(lowStockQuery, { lowStockSkusCount: count() }),
    ]);

    const inventory = inventorySnapshot.data();
    return {
      totalSkusCount: inventory.totalSkusCount,
      totalStockUnits: inventory.totalStockUnits,
      lowStockSkusCount: lowStockSnapshot.data().lowStockSkusCount,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'products/aggregate-summary');
  }
}

export function subscribeToProducts(
  onData: (products: Product[], fromCache: boolean) => void,
  onError?: (err: any) => void,
  onChanges?: (changes: ProductSnapshotChange[], fromCache: boolean) => void,
  options: { pageSize?: number; category?: string } = {}
): Unsubscribe {
  const constraints = options.category
    ? [where('category', '==', options.category), orderBy(documentId(), 'asc'), limit(options.pageSize || 24)]
    : [orderBy('createdAt', 'desc'), orderBy(documentId(), 'desc'), ...(options.pageSize ? [limit(options.pageSize)] : [])];
  const q = query(collection(db, 'products'), ...constraints);
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
