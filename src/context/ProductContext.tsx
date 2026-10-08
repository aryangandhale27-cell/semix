import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import {
  fetchPaginatedProductsFromFirestore,
  fetchProductByIdFromFirestore,
} from '../services/firebaseService';
import { normalizeProduct, readQueuedProductWrites, writeQueuedProductWrites } from '../utils/productStorage';

interface ProductCatalogValue {
  products: Product[];
  isProductsLoading: boolean;
  isLoadingMoreProducts: boolean;
  hasMoreProducts: boolean;
  productLoadError: string | null;
  isFirebaseLive: boolean;
  productQueryCategory?: string;
  isProductPageInitialized: boolean;
  loadMoreProducts: (category?: string) => Promise<void>;
}

interface ProductCommands {
  getProduct: (productId: string) => Product | undefined;
  getProducts: () => Product[];
  updateProducts: (update: React.SetStateAction<Product[]>) => void;
}

const ProductCatalogContext = createContext<ProductCatalogValue | undefined>(undefined);
const ProductCommandsContext = createContext<ProductCommands | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSearchParams = new URLSearchParams(window.location.search);
  const initialProductCategory = window.location.pathname === '/shop'
    ? initialSearchParams.get('category') || undefined
    : undefined;
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [productLoadError, setProductLoadError] = useState<string | null>(null);
  const [isFirebaseLive, setIsFirebaseLive] = useState(true);
  const [productQueryCategory, setProductQueryCategory] = useState<string | undefined>(initialProductCategory);
  const [isProductPageInitialized, setIsProductPageInitialized] = useState(false);

  const productsRef = useRef(products);
  const productCursorRef = useRef<QueryDocumentSnapshot | null>(null);
  const productQueryCategoryRef = useRef(initialProductCategory);
  const productPageInitializedRef = useRef(false);
  const productPageRequestRef = useRef(false);
  const queuedCategoryRequestRef = useRef<{ category?: string } | null>(null);
  const hasMoreProductsRef = useRef(false);
  const initialProductRequestRef = useRef<Promise<{
    products: Product[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> | null>(null);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  const updateProducts = useCallback((update: React.SetStateAction<Product[]>) => {
    const nextProducts = typeof update === 'function' ? update(productsRef.current) : update;
    productsRef.current = nextProducts;
    setProducts(nextProducts);
  }, []);

  const getProduct = useCallback(
    (productId: string) => productsRef.current.find((product) => product.id === productId),
    []
  );
  const getProducts = useCallback(() => productsRef.current, []);

  const loadMoreProducts = useCallback(async (category?: string) => {
    const requestedCategory = category && category !== 'All' ? category : undefined;
    const isNewCategory = productQueryCategoryRef.current !== requestedCategory;
    if (productPageRequestRef.current) {
      if (isNewCategory) queuedCategoryRequestRef.current = { category: requestedCategory };
      return;
    }
    if (!isNewCategory && productPageInitializedRef.current && !hasMoreProductsRef.current) return;

    productPageRequestRef.current = true;
    setIsLoadingMoreProducts(true);
    setProductLoadError(null);
    try {
      const page = await fetchPaginatedProductsFromFirestore({
        category: requestedCategory,
        pageSize: 24,
        startAfterDoc: isNewCategory ? null : productCursorRef.current,
      });
      const normalizedPage = page.products.map(normalizeProduct);
      const loadedIds = new Set(normalizedPage.map((product) => product.id));
      writeQueuedProductWrites(
        readQueuedProductWrites().filter((product) => !loadedIds.has(product.id))
      );
      const nextProducts = isNewCategory
        ? normalizedPage
        : Array.from(new Map(
            [...productsRef.current, ...normalizedPage].map((product) => [product.id, product])
          ).values());

      productCursorRef.current = page.lastDoc;
      productQueryCategoryRef.current = requestedCategory;
      productPageInitializedRef.current = true;
      hasMoreProductsRef.current = page.hasMore;
      updateProducts(nextProducts);
      setHasMoreProducts(page.hasMore);
      setProductQueryCategory(requestedCategory);
      setIsProductPageInitialized(true);
      setIsFirebaseLive(true);
    } catch (error) {
      console.error('[Firestore] Could not load the next product page:', error);
      setProductLoadError('Products could not be loaded. Please try again.');
      setIsFirebaseLive(false);
    } finally {
      productPageRequestRef.current = false;
      setIsLoadingMoreProducts(false);
      const queuedRequest = queuedCategoryRequestRef.current;
      queuedCategoryRequestRef.current = null;
      if (queuedRequest && queuedRequest.category !== productQueryCategoryRef.current) {
        void loadMoreProducts(queuedRequest.category);
      }
    }
  }, [updateProducts]);

  useEffect(() => {
    let isMounted = true;
    const routeProductId = window.location.pathname.startsWith('/product/')
      ? decodeURIComponent(window.location.pathname.slice('/product/'.length))
      : undefined;

    if (!initialProductRequestRef.current) {
      initialProductRequestRef.current = routeProductId
        ? fetchProductByIdFromFirestore(routeProductId).then((product) => ({
            products: product ? [product] : [],
            lastDoc: null,
            hasMore: false,
          }))
        : fetchPaginatedProductsFromFirestore({
            category: initialProductCategory,
            pageSize: 24,
          });
    }

    initialProductRequestRef.current
      .then((page) => {
        if (!isMounted) return;
        const normalizedPage = page.products.map(normalizeProduct);
        const loadedIds = new Set(normalizedPage.map((product) => product.id));
        writeQueuedProductWrites(
          readQueuedProductWrites().filter((product) => !loadedIds.has(product.id))
        );
        const mergedProducts = [...readQueuedProductWrites(), ...normalizedPage];
        const nextProducts = Array.from(new Map(
          mergedProducts.map((product) => [product.id, normalizeProduct(product)])
        ).values());

        productCursorRef.current = page.lastDoc;
        productPageInitializedRef.current = !routeProductId;
        hasMoreProductsRef.current = page.hasMore;
        productQueryCategoryRef.current = initialProductCategory;
        updateProducts(nextProducts);
        setHasMoreProducts(page.hasMore);
        setIsProductPageInitialized(!routeProductId);
        setIsFirebaseLive(true);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('[Firestore] Initial product request failed:', error);
        setProductLoadError('Products could not be loaded. Please try again.');
        setIsFirebaseLive(false);
      })
      .finally(() => {
        if (isMounted) setIsProductsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialProductCategory, updateProducts]);

  const catalogValue = useMemo(() => ({
    products,
    isProductsLoading,
    isLoadingMoreProducts,
    hasMoreProducts,
    productLoadError,
    isFirebaseLive,
    productQueryCategory,
    isProductPageInitialized,
    loadMoreProducts,
  }), [
    products,
    isProductsLoading,
    isLoadingMoreProducts,
    hasMoreProducts,
    productLoadError,
    isFirebaseLive,
    productQueryCategory,
    isProductPageInitialized,
    loadMoreProducts,
  ]);
  const commandValue = useMemo(() => ({
    getProduct,
    getProducts,
    updateProducts,
  }), [getProduct, getProducts, updateProducts]);

  return (
    <ProductCommandsContext.Provider value={commandValue}>
      <ProductCatalogContext.Provider value={catalogValue}>
        {children}
      </ProductCatalogContext.Provider>
    </ProductCommandsContext.Provider>
  );
};

export function useProductCatalog(): ProductCatalogValue {
  const context = useContext(ProductCatalogContext);
  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductProvider');
  }
  return context;
}

export function useProductCommands(): ProductCommands {
  const context = useContext(ProductCommandsContext);
  if (!context) {
    throw new Error('useProductCommands must be used within a ProductProvider');
  }
  return context;
}
