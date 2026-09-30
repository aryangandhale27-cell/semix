import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  EscalationIssue, 
  StaffMember, 
  UserRole, 
  OrderStatus, 
  AvailableSeller,
  BulkEnquirySubmission,
  CustomProjectSubmission,
  CustomProjectStatus,
  AdminProjectNotification,
  Coupon,
  CouponValidationResult,
  Category,
  HomepageBanner,
  SellerBonusRecord
} from '../types';
import { CATEGORIES } from '../mockData/products';
import { INITIAL_HOMEPAGE_BANNERS } from '../mockData/banners';
import { 
  submitCustomProjectInquiry,
  CustomProjectInquiryPayload 
} from '../services/projectService';
import { 
  syncProductToFirestore, 
  deleteProductFromFirestore, 
  subscribeToProducts,
  fetchInitialProducts,
  ProductSnapshotChange,
  syncAllProductsToFirestore,
  syncOrderToFirestore, 
  deleteOrderFromFirestore,
  subscribeToOrders,
  syncCustomProjectToFirestore,
  syncRecordToFirestore,
  fetchStaffFromFirestore,
  subscribeToStaff,
  subscribeToRecords
} from '../services/firebaseService';
import {
  subscribeToBanners,
  syncBannerToFirestore,
  deleteBannerFromFirestore,
  seedInitialBanners
} from '../services/bannerService';
import {
  subscribeToCategories,
  updateCategoryImageInFirestore,
} from '../services/categoryService';
import {
  validateAndCalculateCoupon,
  placeOrderWithCouponTransaction
} from '../services/couponService';
import {
  sendOrderPlacedEmails,
  sendSellerAssignmentEmail
} from '../services/emailService';
import {
  fetchAllSellerBonuses,
  saveSellerBonus,
  subscribeToSellerBonuses,
  formatInrBonus
} from '../services/bonusService';
import { recordActivityLog } from '../services/auditService';
import { auth, onAuthStateChanged, testFirestoreConnection } from '../lib/firebase';
import { saveUserAppState, subscribeToUserAppState } from '../services/userStateService';

const APP_DATA_CACHE_KEYS = {
  categories: 'semix-cache-categories-v1',
  banners: 'semix-cache-banners-v1',
  products: 'semix-cache-products-v1',
} as const;

const PRODUCT_WRITE_QUEUE_KEY = 'semix-product-write-queue-v1';

function readQueuedProductWrites(): Product[] {
  try {
    const cached = localStorage.getItem(PRODUCT_WRITE_QUEUE_KEY);
    if (!cached) return [];
    const parsed = JSON.parse(cached) as Product[];
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : [];
  } catch {
    return [];
  }
}

function writeQueuedProductWrites(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCT_WRITE_QUEUE_KEY, JSON.stringify(products));
  } catch {
    // Ignore storage write failures.
  }
}

function readCachedData<T>(key: string, fallback: T): T {
  try {
    const cached = localStorage.getItem(key);
    return cached ? (JSON.parse(cached) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeCachedData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Continue using live Firestore data when browser storage is unavailable.
  }
}

function clearCachedData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage cleanup failures.
  }
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  durationMs?: number;
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Products
  products: Product[];
  categories: Category[];
  updateCategoryImage: (categoryId: string, imageUrl: string) => Promise<void>;
  resetCategoryImage: (categoryId: string) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  isProductSyncing: boolean;
  isProductsLoading: boolean;
  syncAllProductsToFirebase: () => Promise<void>;

  // Homepage Banners
  banners: HomepageBanner[];
  addBanner: (bannerData: Omit<HomepageBanner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<HomepageBanner>;
  updateBanner: (banner: HomepageBanner) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
  reorderBanners: (orderedBanners: HomepageBanner[]) => Promise<void>;
  toggleBannerActive: (bannerId: string) => Promise<void>;
  resetBannersToDefault: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  calculateAppliedPrice: (product: Product, quantity: number) => number;

  // Coupon & Discounts
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string, userId?: string) => Promise<CouponValidationResult>;
  removeCoupon: () => void;
  placeOrderWithCoupon: (orderData: Omit<Order, 'id' | 'trackingNumber' | 'statusTimeline' | 'createdAt'>, userId?: string) => Promise<{ success: boolean; order: Order; error?: string }>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: string[];
  addToCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isComparing: (productId: string) => boolean;

  // Orders
  orders: Order[];
  availableSellers: AvailableSeller[];
  addAvailableSeller: (seller: AvailableSeller) => void;
  updateAvailableSeller: (id: string, updates: Partial<AvailableSeller>) => void;
  removeAvailableSeller: (id: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'trackingNumber' | 'statusTimeline' | 'createdAt'>) => Order;
  deleteOrder: (orderId: string) => Promise<void>;
  assignSellerToOrder: (orderId: string, sellerId: string, sellerName: string, notes?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string, updatedBy?: string, courierInfo?: { courier?: string; courierTrackingId?: string; packedBy?: string }) => void;
  adminOverrideOrder: (orderId: string, updates: Partial<Order>) => void;
  flagMissingOrderItems: (orderId: string, missingItems: Array<{ productId: string; sku: string; name: string; quantity: number; reason?: string }>, note?: string) => void;

  // Escalations
  escalations: EscalationIssue[];
  reportEscalation: (issue: Omit<EscalationIssue, 'id' | 'createdAt' | 'status'>) => void;
  resolveEscalation: (id: string, resolutionNote: string, resolvedBy: string) => void;

  // Seller Bonuses
  sellerBonuses: Record<string, SellerBonusRecord>;
  updateSellerBonus: (sellerId: string, amount: number, sellerName?: string, sellerEmail?: string) => Promise<{ success: boolean; error?: string }>;
  getSellerBonus: (sellerId: string) => number;

  // Staff
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  toggleStaffStatus: (id: string) => void;

  // Bulk Enquiries
  bulkEnquiries: BulkEnquirySubmission[];
  submitBulkEnquiry: (enquiry: Omit<BulkEnquirySubmission, 'id' | 'createdAt' | 'status'>) => BulkEnquirySubmission;

  // Custom Project Development
  customProjects: CustomProjectSubmission[];
  submitCustomProject: (payload: CustomProjectInquiryPayload) => Promise<CustomProjectSubmission>;
  updateCustomProjectStatus: (id: string, status: CustomProjectStatus, adminNotes?: string) => void;
  addCustomProjectReply: (id: string, message: string, quoteAmount?: string) => void;
  adminNotifications: AdminProjectNotification[];
  markAdminNotificationRead: (id: string) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: ToastItem['type'], durationMs?: number) => void;
  removeToast: (id: string) => void;

  resetDemoData: () => void;
  isFirebaseLive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mergeCategoriesWithDefaults(remoteCategories: Category[]): Category[] {
  const remoteById = new Map(remoteCategories.map((category) => [category.id, category]));
  const defaultIds = new Set(CATEGORIES.map((category) => category.id));

  return [
    ...CATEGORIES.map((defaultCategory) => ({
      ...defaultCategory,
      ...remoteById.get(defaultCategory.id),
      name: defaultCategory.name,
      slug: defaultCategory.slug,
    })),
    ...remoteCategories.filter((category) => !defaultIds.has(category.id)),
  ];
}

const STORAGE_KEYS = {
  ROLE: 'rietz_user_role',
  PRODUCTS: 'rietz_products_v1',
  CART: 'rietz_cart_v1',
  WISHLIST: 'rietz_wishlist_v1',
  COMPARE: 'rietz_compare_v1',
  ORDERS: 'rietz_orders_v1',
  SELLERS: 'rietz_available_sellers_v3',
  ESCALATIONS: 'rietz_escalations_v1',
  STAFF: 'rietz_staff_v2',
  BULK_ENQUIRIES: 'rietz_bulk_enquiries_v1',
  CUSTOM_PROJECTS: 'rietz_custom_projects_v1',
  ADMIN_NOTIFICATIONS: 'rietz_admin_notifications_v1',
};

export const normalizeProduct = (p: Partial<Product> & Record<string, any>): Product => {
  let imagesList: string[] = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imagesList = p.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
  }
  if (imagesList.length === 0 && typeof p.image === 'string' && p.image.trim().length > 0) {
    imagesList = [p.image.trim()];
  }
  if (imagesList.length === 0) {
    imagesList = ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=70'];
  }
  return {
    ...(p as Product),
    image: imagesList[0],
    images: imagesList,
  };
};

export const normalizeOrder = (o: Partial<Order> & Record<string, any>): Order => {
  const isAssigned = Boolean(o.assignedSellerId);
  const rawStatus = (o.status || 'pending_assignment') as OrderStatus;
  const computedStatus: OrderStatus = isAssigned && rawStatus === 'pending_assignment'
    ? 'assigned'
    : rawStatus;

  const status: OrderStatus = !isAssigned && (computedStatus === 'placed' || !computedStatus)
    ? 'pending_assignment'
    : computedStatus;

  return {
    id: o.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    trackingNumber: o.trackingNumber || `RTZ-IN-${Math.floor(10000 + Math.random() * 90000)}`,
    customer: o.customer || {
      fullName: 'Customer',
      phone: '+91 99999 88888',
      email: 'customer@example.com',
      street: 'Makers Street',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001'
    },
    items: o.items || [],
    subtotal: o.subtotal || 0,
    shippingFee: o.shippingFee || 0,
    tax: o.tax || 0,
    discount: o.discount || 0,
    totalAmount: o.totalAmount || 0,
    status,
    statusTimeline: o.statusTimeline || [],
    createdAt: o.createdAt || new Date().toISOString(),
    paymentMethod: o.paymentMethod || 'UPI',
    paymentStatus: o.paymentStatus || 'Paid',
    packingNotes: o.packingNotes,
    courier: o.courier,
    courierTrackingId: o.courierTrackingId,
    packedBy: o.packedBy,
    assignedSellerId: o.assignedSellerId ?? null,
    assignedSellerName: o.assignedSellerName ?? null,
    assignedAt: o.assignedAt ?? null,
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFirebaseLive, setIsFirebaseLive] = useState(true);

  useEffect(() => {
    const scheduleConnectionCheck = window.setTimeout(() => {
      testFirestoreConnection()
        .then(() => setIsFirebaseLive(true))
        .catch(() => setIsFirebaseLive(false));
    }, 2500);

    return () => window.clearTimeout(scheduleConnectionCheck);
  }, []);

  const [currentRole, setCurrentRoleState] = useState<UserRole>('customer');

  const setCurrentRole = useCallback((role: UserRole) => {
    setCurrentRoleState(role);
  }, []);

  // INSTANT PRODUCTS LOAD: Window data -> LocalStorage Cache -> Empty array
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined' && (window as any).__INITIAL_PRODUCTS__) {
      return ((window as any).__INITIAL_PRODUCTS__ as Product[]).map(normalizeProduct);
    }
    const cached = readCachedData<Product[]>(APP_DATA_CACHE_KEYS.products, []);
    return cached.length > 0 ? cached.map(normalizeProduct) : [];
  });
  
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && (window as any).__INITIAL_PRODUCTS__) return false;
    const cached = readCachedData<Product[]>(APP_DATA_CACHE_KEYS.products, []);
    return cached.length === 0;
  });

  const productsRef = useRef(products);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  const [isProductSyncing, setIsProductSyncing] = useState(false);

  // Fast Bounded Initial Fetch + Non-blocking Background Sync
  useEffect(() => {
    let isMounted = true;

    // 1. Execute direct, bounded single-request fetch immediately (Fast initial paint)
    fetchInitialProducts(25)
      .then((initialProducts) => {
        if (!isMounted || initialProducts.length === 0) return;
        const normalized = initialProducts.map(normalizeProduct);
        setProducts(normalized);
        setIsProductsLoading(false);
        writeCachedData(APP_DATA_CACHE_KEYS.products, normalized);
      })
      .catch((err) => {
        console.warn('[Firestore] Initial product fetch notice:', err?.message || err);
      });

    // 2. Attach bounded realtime listener for background updates
    const unsubscribe = subscribeToProducts((remoteProducts) => {
      if (!isMounted) return;
      const normalizedProducts = remoteProducts.map(normalizeProduct);
      const queuedProducts = readQueuedProductWrites();
      const deduped = new Map<string, Product>();
      
      [...queuedProducts, ...normalizedProducts].forEach((product) => {
        deduped.set(product.id, normalizeProduct(product));
      });

      const nextProducts = Array.from(deduped.values()).sort((a, b) => 
        (b.createdAt || '').localeCompare(a.createdAt || '')
      );

      setProducts(nextProducts);
      setIsProductsLoading(false);
      writeCachedData(APP_DATA_CACHE_KEYS.products, nextProducts);
      
      const remainingQueued = nextProducts.filter(
        (p) => !normalizedProducts.some((lp) => lp.id === p.id)
      );
      writeQueuedProductWrites(remainingQueued);
    }, (err) => {
      console.warn('[Firestore] Product live listener notice:', err?.message || err);
      setIsProductsLoading(false);
    }, (changes: ProductSnapshotChange[]) => {
      if (!isMounted || changes.length === 0) return;

      const changedIds = new Set(changes.map((change) => change.product.id));
      const productsById = new Map<string, Product>(
        productsRef.current.map((product) => [product.id, product])
      );

      changes.forEach((change) => {
        const normalized = normalizeProduct(change.product);
        if (change.type === 'removed') {
          productsById.delete(normalized.id);
          return;
        }
        productsById.set(normalized.id, normalized);
      });

      const nextProducts = Array.from(productsById.values()).sort((a, b) => 
        (b.createdAt || '').localeCompare(a.createdAt || '')
      );
      productsRef.current = nextProducts;
      setProducts(nextProducts);
      setIsProductsLoading(false);
      writeCachedData(APP_DATA_CACHE_KEYS.products, nextProducts);
      writeQueuedProductWrites(readQueuedProductWrites().filter((p) => !changedIds.has(p.id)));
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Cart, Wishlist, Compare
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userStateReady, setUserStateReady] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    let unsubscribeState: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeState?.();
      setCart([]);
      setWishlist([]);
      setCompareList([]);
      setUserStateReady(!firebaseUser);
      if (!firebaseUser) return;
      unsubscribeState = subscribeToUserAppState(firebaseUser.uid, (state) => {
        setCart(state.cart || []);
        setWishlist(state.wishlist || []);
        setCompareList(state.compareList || []);
        setUserStateReady(true);
      });
    });
    return () => {
      unsubscribeState?.();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId && userStateReady) {
      void saveUserAppState(userId, { cart, wishlist, compareList }).catch((error) => {
        console.error('[UserState] Could not save customer state:', error);
      });
    }
  }, [cart, wishlist, compareList, userStateReady]);

  // Categories
  const [categories, setCategories] = useState<Category[]>(() =>
    readCachedData<Category[]>(APP_DATA_CACHE_KEYS.categories, CATEGORIES)
  );

  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeToCategories((data) => {
      if (isMounted) {
        const mergedCategories = data.length > 0 ? mergeCategoriesWithDefaults(data) : [];
        setCategories(mergedCategories);
        writeCachedData(APP_DATA_CACHE_KEYS.categories, mergedCategories);
      }
    }, (err) => console.warn('[CategoryService] Listener error:', err));

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const updateCategoryImage = useCallback(async (categoryId: string, imageUrl: string) => {
    await updateCategoryImageInFirestore(categoryId, imageUrl);
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, image: imageUrl } : c)));
  }, []);

  const resetCategoryImage = useCallback(async (categoryId: string) => {
    const defaultCat = CATEGORIES.find((c) => c.id === categoryId);
    const defaultImg = defaultCat?.image || '';
    if (defaultImg) {
      await updateCategoryImage(categoryId, defaultImg);
    }
  }, [updateCategoryImage]);

  // Homepage Banners
  const [banners, setBanners] = useState<HomepageBanner[]>(() =>
    readCachedData<HomepageBanner[]>(APP_DATA_CACHE_KEYS.banners, INITIAL_HOMEPAGE_BANNERS)
  );

  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeToBanners((data) => {
      if (isMounted) {
        const nextBanners = data || [];
        setBanners(nextBanners);
        writeCachedData(APP_DATA_CACHE_KEYS.banners, nextBanners);
      }
    }, (err) => console.warn('[BannerService] Listener error:', err));

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const addBanner = useCallback(async (bannerData: Omit<HomepageBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<HomepageBanner> => {
    const newBanner: HomepageBanner = {
      ...bannerData,
      id: `banner-${Date.now()}`,
      order: banners.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await syncBannerToFirestore(newBanner);
    const nextBanners = [...banners, newBanner].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setBanners(nextBanners);
    writeCachedData(APP_DATA_CACHE_KEYS.banners, nextBanners);
    return newBanner;
  }, [banners]);

  const updateBanner = useCallback(async (updatedBanner: HomepageBanner) => {
    const withTimestamp = {
      ...updatedBanner,
      updatedAt: new Date().toISOString(),
    };
    await syncBannerToFirestore(withTimestamp);
    const nextBanners = banners.map((b) => (b.id === updatedBanner.id ? withTimestamp : b));
    setBanners(nextBanners);
    writeCachedData(APP_DATA_CACHE_KEYS.banners, nextBanners);
  }, [banners]);

  const deleteBanner = useCallback(async (bannerId: string) => {
    await deleteBannerFromFirestore(bannerId);
    const nextBanners = banners.filter((b) => b.id !== bannerId);
    setBanners(nextBanners);
    writeCachedData(APP_DATA_CACHE_KEYS.banners, nextBanners);
  }, [banners]);

  const reorderBanners = useCallback(async (orderedBanners: HomepageBanner[]) => {
    const updatedWithOrder = orderedBanners.map((banner, index) => ({
      ...banner,
      order: index + 1,
      updatedAt: new Date().toISOString(),
    }));
    await Promise.all(updatedWithOrder.map((b) => syncBannerToFirestore(b)));
    setBanners(updatedWithOrder);
    writeCachedData(APP_DATA_CACHE_KEYS.banners, updatedWithOrder);
  }, []);

  const toggleBannerActive = useCallback(async (bannerId: string) => {
    const target = banners.find((b) => b.id === bannerId);
    if (!target) return;
    const updated = { ...target, isActive: !target.isActive, updatedAt: new Date().toISOString() };
    await updateBanner(updated);
  }, [banners, updateBanner]);

  const resetBannersToDefault = useCallback(async () => {
    await seedInitialBanners();
  }, []);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableSellers, setAvailableSellers] = useState<AvailableSeller[]>([]);

  useEffect(() => {
    clearCachedData(STORAGE_KEYS.ORDERS);
    clearCachedData(STORAGE_KEYS.SELLERS);
  }, []);

  const addAvailableSeller = useCallback((seller: AvailableSeller) => {
    setAvailableSellers((prev) => {
      const exists = prev.some((s) => s.id === seller.id || s.email.toLowerCase() === seller.email.toLowerCase());
      if (exists) {
        return prev.map((s) => (s.id === seller.id || s.email.toLowerCase() === seller.email.toLowerCase() ? { ...s, ...seller } : s));
      }
      return [...prev, seller];
    });
  }, []);

  const updateAvailableSeller = useCallback((id: string, updates: Partial<AvailableSeller>) => {
    setAvailableSellers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const removeAvailableSeller = useCallback((id: string) => {
    setAvailableSellers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Seller Bonuses & Auth Guards
  const [sellerBonuses, setSellerBonuses] = useState<Record<string, SellerBonusRecord>>({});

  useEffect(() => {
    let isMounted = true;
    let unsubscribeBonuses: (() => void) | undefined;
    const applyBonuses = (map: Record<string, SellerBonusRecord>) => {
      setSellerBonuses(map);
      setAvailableSellers((prev) =>
        prev.map((s) => ({
          ...s,
          bonusAmount: map[s.id]?.bonusAmount || 0,
          bonusUpdatedAt: map[s.id]?.updatedAt,
          bonusUpdatedBy: map[s.id]?.updatedBy,
        }))
      );
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeBonuses?.();
      unsubscribeBonuses = undefined;
      const email = firebaseUser?.email?.trim().toLowerCase() || '';
      const isStaffOrAdmin = email.includes('admin@') || email.includes('seller@') || email.includes('team@');
      if (!firebaseUser || !isStaffOrAdmin) return;

      fetchAllSellerBonuses()
        .then((remoteBonuses) => {
          if (!isMounted) return;
          const map: Record<string, SellerBonusRecord> = {};
          (remoteBonuses || []).forEach((b) => {
            map[b.sellerId] = b;
          });
          applyBonuses(map);
        })
        .catch((err) => console.warn('[Bonuses] Initial fetch error:', err));

      unsubscribeBonuses = subscribeToSellerBonuses((updatedMap) => {
        if (!isMounted) return;
        setSellerBonuses(updatedMap);
        applyBonuses(updatedMap);
      });
    });

    return () => {
      isMounted = false;
      unsubscribeBonuses?.();
      unsubscribeAuth();
    };
  }, []);

  const updateSellerBonus = useCallback(async (
    sellerId: string,
    amount: number,
    sellerName?: string,
    sellerEmail?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await saveSellerBonus(sellerId, amount, sellerName, sellerEmail);
    if (result.success && result.data) {
      const rec = result.data;
      setSellerBonuses((prev) => ({ ...prev, [sellerId]: rec }));
      setAvailableSellers((prev) =>
        prev.map((s) =>
          s.id === sellerId
            ? { ...s, bonusAmount: amount, bonusUpdatedAt: rec.updatedAt, bonusUpdatedBy: rec.updatedBy }
            : s
        )
      );
      
      recordActivityLog({
        userId: 'usr-admin-01',
        userEmail: 'aryangandhale27@gmail.com',
        userName: 'Admin Controller',
        userRole: 'admin',
        actionType: 'BONUS_ALLOCATION',
        targetEntity: 'seller_bonuses',
        targetId: sellerId,
        changes: {
          diffs: { bonusAmount: { oldValue: rec.previousBonus, newValue: amount } },
          affectedFields: ['bonusAmount'],
          summary: `Admin set bonus for ${sellerName || sellerId} to ${formatInrBonus(amount)}`,
        },
        metadata: { source: 'web_client', route: '/admin' },
      }).catch((e) => console.warn('[AuditService] bonus log deferred:', e));

      return { success: true };
    }
    return { success: false, error: result.error || 'Please enter a valid bonus amount.' };
  }, []);

  const getSellerBonus = useCallback((sellerId: string): number => {
    if (sellerBonuses[sellerId] && typeof sellerBonuses[sellerId].bonusAmount === 'number') {
      return sellerBonuses[sellerId].bonusAmount;
    }
    const found = availableSellers.find((s) => s.id === sellerId);
    return found?.bonusAmount || 0;
  }, [sellerBonuses, availableSellers]);

  // Orders live sync (Authenticated users only)
  useEffect(() => {
    let isMounted = true;
    let unsubscribeOrders: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeOrders?.();
      unsubscribeOrders = undefined;

      if (!firebaseUser) {
        setOrders([]);
        return;
      }

      unsubscribeOrders = subscribeToOrders((remoteOrders) => {
        if (!isMounted) return;
        const nextOrders = (remoteOrders || []).map(normalizeOrder);
        setOrders(nextOrders);
      }, (err) => {
        console.warn('[Firestore] Orders live listener notice:', err?.message || err);
      });
    });

    return () => {
      isMounted = false;
      unsubscribeOrders?.();
      unsubscribeAuth();
    };
  }, []);

  const [escalations, setEscalations] = useState<EscalationIssue[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeStaff: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeStaff?.();
      unsubscribeStaff = undefined;

      const email = firebaseUser?.email?.trim().toLowerCase() || '';
      if (!firebaseUser || !email.includes('admin@')) {
        setStaff([]);
        return;
      }

      fetchStaffFromFirestore()
        .then((remoteStaff) => {
          if (isMounted) setStaff(remoteStaff);
        })
        .catch((err) => console.warn('[Firestore] Staff load notice:', err?.message || err));

      unsubscribeStaff = subscribeToStaff((remoteStaff) => {
        if (isMounted) setStaff(remoteStaff);
      });
    });

    return () => {
      isMounted = false;
      unsubscribeStaff?.();
      unsubscribeAuth();
    };
  }, []);

  const [bulkEnquiries, setBulkEnquiries] = useState<BulkEnquirySubmission[]>([]);

  useEffect(() => {
    let unsubscribeEnquiries: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeEnquiries?.();
      unsubscribeEnquiries = undefined;

      const email = firebaseUser?.email?.trim().toLowerCase() || '';
      if (!firebaseUser || !email.includes('admin@')) {
        setBulkEnquiries([]);
        return;
      }

      unsubscribeEnquiries = subscribeToRecords(
        'bulk_enquiries',
        (records) => setBulkEnquiries(records as BulkEnquirySubmission[]),
        (err) => console.warn('[Firestore] Bulk enquiry listener notice:', err?.message || err)
      );
    });

    return () => {
      unsubscribeEnquiries?.();
      unsubscribeAuth();
    };
  }, []);

  const submitBulkEnquiry = useCallback((enquiryData: Omit<BulkEnquirySubmission, 'id' | 'createdAt' | 'status'>): BulkEnquirySubmission => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `ENQ-2026-${randomSuffix}`;
    const newEnquiry: BulkEnquirySubmission = {
      ...enquiryData,
      id: newId,
      status: 'submitted',
      createdAt: new Date().toISOString().split('T')[0],
      userId: auth.currentUser?.uid || '',
    };
    setBulkEnquiries((prev) => [newEnquiry, ...prev]);
    void syncRecordToFirestore('bulk_enquiries', newId, newEnquiry as unknown as Record<string, unknown>);
    return newEnquiry;
  }, []);

  const [customProjects, setCustomProjects] = useState<CustomProjectSubmission[]>([]);

  useEffect(() => {
    let unsubscribeProjects: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeProjects?.();
      unsubscribeProjects = undefined;

      const email = firebaseUser?.email?.trim().toLowerCase() || '';
      if (!firebaseUser || !email.includes('admin@')) {
        setCustomProjects([]);
        return;
      }

      unsubscribeProjects = subscribeToRecords(
        'customProjects',
        (records) => setCustomProjects(records as CustomProjectSubmission[]),
        (err) => console.warn('[Firestore] Custom project listener notice:', err?.message || err)
      );
    });

    return () => {
      unsubscribeProjects?.();
      unsubscribeAuth();
    };
  }, []);

  const [adminNotifications, setAdminNotifications] = useState<AdminProjectNotification[]>([]);

  const submitCustomProject = useCallback(async (payload: CustomProjectInquiryPayload): Promise<CustomProjectSubmission> => {
    const newSubmission = await submitCustomProjectInquiry({
      ...payload,
      userId: auth.currentUser?.uid || undefined,
    } as CustomProjectInquiryPayload & { userId?: string });
    const ownedSubmission = {
      ...newSubmission,
      userId: auth.currentUser?.uid || undefined,
    } as CustomProjectSubmission;
    setCustomProjects((prev) => [ownedSubmission, ...prev]);

    const notifId = 'notif-' + Date.now();
    const newNotification: AdminProjectNotification = {
      id: notifId,
      projectId: ownedSubmission.id,
      projectTitle: ownedSubmission.projectName,
      clientName: ownedSubmission.clientName,
      timestamp: ownedSubmission.createdAt,
      read: false,
      message: `New custom engineering project "${newSubmission.projectName}" (${newSubmission.category}) submitted by ${newSubmission.clientName} (${newSubmission.companyName}).`
    };
    setAdminNotifications((prev) => [newNotification, ...prev]);

    await syncCustomProjectToFirestore(ownedSubmission);
    return ownedSubmission;
  }, []);

  const updateCustomProjectStatus = useCallback((id: string, status: CustomProjectStatus, adminNotes?: string) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const project = customProjects.find((item) => item.id === id);
    setCustomProjects((prev) =>
      prev.map((proj) =>
        proj.id === id
          ? {
              ...proj,
              status,
              updatedAt: dateStr,
              ...(adminNotes !== undefined ? { adminNotes } : {})
            }
          : proj
      )
    );
    if (project) void syncRecordToFirestore('customProjects', id, { ...project, status, updatedAt: dateStr, ...(adminNotes !== undefined ? { adminNotes } : {}) });
  }, [customProjects]);

  const addCustomProjectReply = useCallback((id: string, message: string, quoteAmount?: string) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const replyItem = {
      id: 'rep-' + Date.now(),
      sender: 'admin' as const,
      senderName: 'SEMIX LABS Engineering Admin',
      message,
      quotedAmount: quoteAmount,
      timestamp: dateStr
    };

    const project = customProjects.find((item) => item.id === id);
    setCustomProjects((prev) =>
      prev.map((proj) =>
        proj.id === id
          ? {
              ...proj,
              status: quoteAmount ? 'Quoted' : 'In Discussion',
              quoteAmount: quoteAmount || proj.quoteAmount,
              updatedAt: dateStr,
              replies: [...(proj.replies || []), replyItem]
            }
          : proj
      )
    );
    if (project) void syncRecordToFirestore('customProjects', id, { ...project, replies: [...(project.replies || []), replyItem], status: quoteAmount ? 'Quoted' : 'In Discussion', quoteAmount: quoteAmount || project.quoteAmount, updatedAt: dateStr });
  }, [customProjects]);

  const markAdminNotificationRead = useCallback((id: string) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastItem['type'] = 'success', durationMs = 1300) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const visibleDuration = Math.min(durationMs, 1300);
    setToasts((prev) => [...prev, { id, title, message, type, durationMs: visibleDuration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, visibleDuration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const calculateAppliedPrice = useCallback((product: Product, quantity: number): number => {
    if (!product.bulkTiers || product.bulkTiers.length === 0) {
      return product.price;
    }
    const sorted = [...product.bulkTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sorted) {
      if (quantity >= tier.minQty) {
        return tier.unitPrice;
      }
    }
    return product.price;
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const appliedUnitPrice = calculateAppliedPrice(product, newQty);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, appliedUnitPrice }
            : item
        );
      } else {
        const appliedUnitPrice = calculateAppliedPrice(product, quantity);
        return [...prev, { product, quantity, appliedUnitPrice }];
      }
    });
    showToast('Added to Cart', `${quantity} × ${product.name}`, 'success');
  }, [calculateAppliedPrice, showToast]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const appliedUnitPrice = calculateAppliedPrice(item.product, quantity);
          return { ...item, quantity, appliedUnitPrice };
        }
        return item;
      })
    );
  }, [calculateAppliedPrice]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item Removed', 'Product removed from your cart', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.appliedUnitPrice * item.quantity, 0), [cart]);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  useEffect(() => {
    if (appliedCoupon) {
      if (cartSubtotal < appliedCoupon.minOrderValue) {
        setCouponDiscount(0);
      } else {
        let raw = 0;
        if (appliedCoupon.discountType === 'percentage') {
          raw = (cartSubtotal * appliedCoupon.discountValue) / 100;
          if (appliedCoupon.maxDiscount && appliedCoupon.maxDiscount > 0) {
            raw = Math.min(raw, appliedCoupon.maxDiscount);
          }
        } else {
          raw = appliedCoupon.discountValue;
        }
        setCouponDiscount(Math.min(cartSubtotal, Math.max(0, raw)));
      }
    } else {
      setCouponDiscount(0);
    }
  }, [cartSubtotal, appliedCoupon]);

  const applyCoupon = useCallback(async (code: string, userId?: string): Promise<CouponValidationResult> => {
    const res = await validateAndCalculateCoupon(code, cartSubtotal, userId || 'guest_user');
    if (res.isValid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponDiscount(res.discount);
      showToast(
        'Coupon Applied!',
        `Voucher ${res.coupon.code} applied. Saved ₹${Math.round(res.discount).toLocaleString('en-IN')}`,
        'success'
      );
    } else {
      showToast('Coupon Not Applied', res.error || 'Invalid coupon code.', 'error');
    }
    return res;
  }, [cartSubtotal, showToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon Removed', 'Standard item pricing restored.', 'info');
  }, [showToast]);

  const toggleWishlist = useCallback((productId: string) => {
    const prod = productsRef.current.find((p) => p.id === productId);
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist', prod ? prod.name : '', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', prod ? prod.name : '', 'success');
        return [...prev, productId];
      }
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addToCompare = useCallback((productId: string): boolean => {
    if (compareList.includes(productId)) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
      return false;
    }
    if (compareList.length >= 4) {
      showToast('Compare Limit Reached', 'You can compare up to 4 components at once', 'warning');
      return false;
    }
    setCompareList((prev) => [...prev, productId]);
    const prod = productsRef.current.find((p) => p.id === productId);
    showToast('Added to Comparison', prod ? prod.name : '', 'info');
    return true;
  }, [compareList, showToast]);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isComparing = useCallback((productId: string) => compareList.includes(productId), [compareList]);

  const updateProductStock = useCallback(async (productId: string, newStock: number) => {
    const current = productsRef.current.find((p) => p.id === productId);
    if (!current) throw new Error('Product not found');
    const updated = { ...current, stockCount: Math.max(0, newStock), inStock: newStock > 0 };
    await syncProductToFirestore(updated);
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
    showToast('Inventory Updated', `Stock count updated to ${newStock} units`, 'success');
  }, [showToast]);

  const updateProduct = useCallback(async (updated: Product) => {
    const nowIso = new Date().toISOString();
    const normalized = normalizeProduct({
      ...updated,
      updatedAt: nowIso,
    });
    await syncProductToFirestore(normalized);
    setProducts((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
    showToast('Product Updated', `${normalized.name} changes synced to Firebase`, 'success');
  }, [showToast]);

  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    const id = productData.sku 
      ? `prod-${productData.sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}` 
      : `prod-${Date.now().toString().slice(-6)}`;

    const nowIso = new Date().toISOString();
    const authUserName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0]?.replace(/[._]/g, ' ') || 'Team Member';
    const authUserEmail = auth.currentUser?.email || '';

    const normalized = normalizeProduct({ 
      ...productData, 
      id,
      createdAt: nowIso,
      updatedAt: nowIso,
      addedBy: authUserName,
      addedByEmail: authUserEmail,
      addedByRole: currentRole || 'team',
    });

    setProducts((prev) => [normalized, ...prev.filter((p) => p.id !== id)]);

    try {
      await syncProductToFirestore(normalized);
      showToast('Product Stored in Firebase', `${normalized.name} successfully published to catalog & Firestore`, 'success');
    } catch (error) {
      console.warn('[AppContext] Product sync failed:', error);
      const queuedProducts = [normalized, ...readQueuedProductWrites().filter((qp) => qp.id !== normalized.id)];
      writeQueuedProductWrites(queuedProducts);
      showToast('Product Saved Locally', `${normalized.name} preserved locally until sync resumes.`, 'warning');
    }
  }, [currentRole, showToast]);

  const syncAllProductsToFirebase = useCallback(async () => {
    setIsProductSyncing(true);
    try {
      const result = await syncAllProductsToFirestore(productsRef.current);
      showToast('Firebase Catalog Sync', `Synced ${result.count} products to Cloud Firestore`, 'success');
    } catch (err: any) {
      showToast('Sync Error', err?.message || 'Could not sync all products to Firebase', 'warning');
    } finally {
      setIsProductSyncing(false);
    }
  }, [showToast]);

  const deleteProduct = useCallback(async (productId: string) => {
    await deleteProductFromFirestore(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    setCompareList((prev) => prev.filter((id) => id !== productId));
    showToast('Product Removed', 'Component permanently deleted from catalog', 'warning');
  }, [showToast]);

  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'trackingNumber' | 'statusTimeline' | 'createdAt'>): Order => {
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const id = `ORD-${orderNum}`;
    const trackingNumber = `RTZ-IN-${orderNum}${Math.floor(10 + Math.random() * 90)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const initialStatus: OrderStatus = orderData.status || 'pending_assignment';

    const newOrder: Order = {
      ...orderData,
      id,
      trackingNumber,
      status: initialStatus,
      assignedSellerId: orderData.assignedSellerId ?? null,
      assignedSellerName: orderData.assignedSellerName ?? null,
      assignedAt: orderData.assignedAt ?? null,
      userId: auth.currentUser?.uid || orderData.customer.email,
      createdAt: now.toISOString(),
      confirmationEmailSent: false,
      statusTimeline: [
        {
          status: initialStatus,
          timestamp: formattedDate,
          note: `Order placed via ${orderData.paymentMethod}. Awaiting Admin seller allocation.`,
          updatedBy: 'System Gateway'
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    syncOrderToFirestore(newOrder).catch((err) => console.warn('Firestore Order sync deferred:', err));

    setCart([]);
    sendOrderPlacedEmails(newOrder).catch((e) => console.warn('[EmailService] Order emails deferred:', e));
    return newOrder;
  }, []);

  const deleteOrder = useCallback(async (orderId: string) => {
    await deleteOrderFromFirestore(orderId);
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    showToast('Order Deleted', `Order ${orderId} was permanently removed.`, 'warning');
  }, [showToast]);

  const placeOrderWithCoupon = useCallback(async (
    orderData: Omit<Order, 'id' | 'trackingNumber' | 'statusTimeline' | 'createdAt'>,
    userId?: string
  ): Promise<{ success: boolean; order: Order; error?: string }> => {
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const id = `ORD-${orderNum}`;
    const trackingNumber = `RTZ-IN-${orderNum}${Math.floor(10 + Math.random() * 90)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const initialStatus: OrderStatus = orderData.status || 'pending_assignment';

    const preparedOrder: Order = {
      ...orderData,
      id,
      trackingNumber,
      status: initialStatus,
      assignedSellerId: orderData.assignedSellerId ?? null,
      assignedSellerName: orderData.assignedSellerName ?? null,
      assignedAt: orderData.assignedAt ?? null,
      createdAt: now.toISOString(),
      confirmationEmailSent: false,
      statusTimeline: [
        {
          status: initialStatus,
          timestamp: formattedDate,
          note: `Order placed via ${orderData.paymentMethod}. Awaiting Admin seller allocation.`,
          updatedBy: 'System Gateway'
        }
      ]
    };

    const txResult = await placeOrderWithCouponTransaction({
      order: preparedOrder,
      couponCode: appliedCoupon?.code,
      userId: userId || orderData.customer.email || 'guest_checkout'
    });

    if (!txResult.success) {
      return { success: false, order: preparedOrder, error: txResult.error };
    }

    const finalizedOrder: Order = {
      ...preparedOrder,
      discount: couponDiscount,
      discountAmount: couponDiscount,
      couponCode: appliedCoupon?.code,
      finalTotal: preparedOrder.totalAmount,
      userId: userId || orderData.customer.email,
    };

    setOrders((prev) => [finalizedOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    sendOrderPlacedEmails(finalizedOrder).catch((e) => console.warn('[EmailService] Order emails deferred:', e));

    return { success: true, order: finalizedOrder };
  }, [appliedCoupon, couponDiscount]);

  const assignSellerToOrder = useCallback(async (
    orderId: string,
    sellerId: string,
    sellerName: string,
    notes?: string
  ): Promise<void> => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const currentOrder = orders.find((order) => order.id === orderId);

    if (!currentOrder) {
      throw new Error(`Order ${orderId} could not be found.`);
    }

    const isCurrentPending = !currentOrder.assignedSellerId || currentOrder.status === 'pending_assignment' || currentOrder.status === 'placed';
    const nextStatus: OrderStatus = isCurrentPending || (currentOrder.assignedSellerId && currentOrder.status === 'pending_assignment') ? 'assigned' : currentOrder.status;
    const newTimelineEntry = {
      status: nextStatus,
      timestamp: formattedDate,
      note: notes ? `Assigned to ${sellerName} by Admin. Note: ${notes}` : `Assigned to fulfillment seller: ${sellerName} by Admin.`,
      updatedBy: 'Admin Operations'
    };
    const updatedOrder = {
      ...currentOrder,
      status: nextStatus,
      assignedSellerId: sellerId,
      assignedSellerName: sellerName,
      assignedAt: now.toISOString(),
      statusTimeline: [...currentOrder.statusTimeline, newTimelineEntry]
    };

    await syncOrderToFirestore(updatedOrder);
    setOrders((prev) => prev.map((order) => order.id === orderId ? updatedOrder : order));

    const matchedSeller = availableSellers.find((s) => s.id === sellerId) || {
      id: sellerId,
      name: sellerName,
      email: 'seller@semixlabs.com',
      phone: '+91 98765 43210',
      warehouseHub: 'Regional Warehouse Hub',
      gstin: '29ABCDE1234F1Z5',
      rating: 4.9,
    };
    sendSellerAssignmentEmail(updatedOrder, matchedSeller, notes).catch((e) => console.warn('[EmailService] error:', e));
    showToast('Seller Assigned', `Order ${orderId} assigned to ${sellerName}.`, 'success');
  }, [orders, availableSellers, showToast]);

  const updateOrderStatus = useCallback((
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    updatedBy?: string,
    courierInfo?: { courier?: string; courierTrackingId?: string; packedBy?: string }
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const defaultNote = newStatus === 'packed' ? 'Packaged into secure carton.' : newStatus === 'shipped' ? 'Handed over to carrier.' : 'Status updated.';
          const newTimeline = [
            ...order.statusTimeline,
            {
              status: newStatus,
              timestamp: formattedDate,
              note: note || defaultNote,
              updatedBy: updatedBy || 'Team Fulfillment'
            }
          ];

          const updatedOrder = {
            ...order,
            status: newStatus,
            statusTimeline: newTimeline,
            ...(courierInfo?.courier && { courier: courierInfo.courier }),
            ...(courierInfo?.courierTrackingId && { courierTrackingId: courierInfo.courierTrackingId }),
            ...(courierInfo?.packedBy && { packedBy: courierInfo.packedBy })
          };
          syncOrderToFirestore(updatedOrder).catch((e) => console.warn('Firestore sync deferred:', e));
          return updatedOrder;
        }
        return order;
      })
    );

    showToast('Order Status Advanced', `Order ${orderId} marked as ${newStatus.toUpperCase()}`, 'success');
  }, [showToast]);

  const adminOverrideOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, ...updates };
          syncOrderToFirestore(updated).catch((e) => console.warn('Firestore sync deferred:', e));
          return updated;
        }
        return o;
      })
    );
    showToast('Order Overridden', `Admin changes applied to ${orderId}`, 'info');
  }, [showToast]);

  const flagMissingOrderItems = useCallback((
    orderId: string,
    missingItems: Array<{ productId: string; sku: string; name: string; quantity: number; reason?: string }>,
    note?: string
  ) => {
    if (!missingItems.length) return;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedOrder: Order = {
          ...order,
          missingItems: missingItems.map((item) => ({
            productId: item.productId,
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            reason: item.reason || 'Marked unavailable',
          })),
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: order.status,
              timestamp: new Date().toISOString(),
              note: note || `Items flagged unavailable at hub.`,
              updatedBy: order.assignedSellerName || 'Seller Hub',
            },
          ],
        };

        syncOrderToFirestore(updatedOrder).catch((e) => console.warn('Shortage sync error:', e));
        return updatedOrder;
      })
    );

    showToast('Shortage Reported', `${missingItems.length} component(s) flagged as unavailable.`, 'warning');
  }, [showToast]);

  const reportEscalation = useCallback((issueData: Omit<EscalationIssue, 'id' | 'createdAt' | 'status'>) => {
    const id = `ESC-${Math.floor(400 + Math.random() * 500)}`;
    const newIssue: EscalationIssue = {
      ...issueData,
      id,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setEscalations((prev) => [newIssue, ...prev]);
    showToast('Discrepancy Escalated', `Ticket #${id} dispatched to Admin queue`, 'warning');
  }, [showToast]);

  const resolveEscalation = useCallback((id: string, resolutionNote: string, resolvedBy: string) => {
    setEscalations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'resolved',
              resolutionNote,
              resolvedAt: new Date().toISOString(),
              resolvedBy
            }
          : item
      )
    );
    showToast('Escalation Resolved', `Ticket #${id} marked as resolved`, 'success');
  }, [showToast]);

  const addStaff = useCallback((memberData: Omit<StaffMember, 'id' | 'lastActive'>) => {
    const id = `STF-${Math.floor(10 + Math.random() * 90)}`;
    const newMember: StaffMember = {
      ...memberData,
      id,
      lastActive: 'Just added'
    };
    setStaff((prev) => [...prev, newMember]);
    void syncRecordToFirestore('staff', id, newMember as unknown as Record<string, unknown>);
    showToast('Staff Access Granted', `${newMember.name} added as ${newMember.role.toUpperCase()}`, 'success');
  }, [showToast]);

  const toggleStaffStatus = useCallback((id: string) => {
    setStaff((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
    const member = staff.find((item) => item.id === id);
    if (member) void syncRecordToFirestore('staff', id, { ...member, active: !member.active });
  }, [staff]);

  const resetDemoData = useCallback(() => {
    setCart([]);
    setWishlist([]);
    setCompareList([]);
    showToast('Reset Complete', 'Default hardware catalog & projects restored', 'info');
  }, [showToast]);

  const contextValue = useMemo(() => ({
    currentRole,
    setCurrentRole,
    products,
    categories,
    updateCategoryImage,
    resetCategoryImage,
    updateProductStock,
    updateProduct,
    addProduct,
    deleteProduct,
    isProductSyncing,
    isProductsLoading,
    syncAllProductsToFirebase,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    toggleBannerActive,
    resetBannersToDefault,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartItemCount,
    cartSubtotal,
    calculateAppliedPrice,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    placeOrderWithCoupon,
    wishlist,
    toggleWishlist,
    isInWishlist,
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isComparing,
    orders,
    availableSellers,
    addAvailableSeller,
    updateAvailableSeller,
    removeAvailableSeller,
    sellerBonuses,
    updateSellerBonus,
    getSellerBonus,
    createOrder,
    deleteOrder,
    assignSellerToOrder,
    updateOrderStatus,
    adminOverrideOrder,
    flagMissingOrderItems,
    escalations,
    reportEscalation,
    resolveEscalation,
    staff,
    addStaff,
    toggleStaffStatus,
    bulkEnquiries,
    submitBulkEnquiry,
    customProjects,
    submitCustomProject,
    updateCustomProjectStatus,
    addCustomProjectReply,
    adminNotifications,
    markAdminNotificationRead,
    searchQuery,
    setSearchQuery,
    toasts,
    showToast,
    removeToast,
    resetDemoData,
    isFirebaseLive
  }), [
    currentRole,
    setCurrentRole,
    products,
    categories,
    updateCategoryImage,
    resetCategoryImage,
    updateProductStock,
    updateProduct,
    addProduct,
    deleteProduct,
    isProductSyncing,
    isProductsLoading,
    syncAllProductsToFirebase,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    toggleBannerActive,
    resetBannersToDefault,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartItemCount,
    cartSubtotal,
    calculateAppliedPrice,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    placeOrderWithCoupon,
    wishlist,
    toggleWishlist,
    isInWishlist,
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isComparing,
    orders,
    availableSellers,
    addAvailableSeller,
    updateAvailableSeller,
    removeAvailableSeller,
    sellerBonuses,
    updateSellerBonus,
    getSellerBonus,
    createOrder,
    deleteOrder,
    assignSellerToOrder,
    updateOrderStatus,
    adminOverrideOrder,
    flagMissingOrderItems,
    escalations,
    reportEscalation,
    resolveEscalation,
    staff,
    addStaff,
    toggleStaffStatus,
    bulkEnquiries,
    submitBulkEnquiry,
    customProjects,
    submitCustomProject,
    updateCustomProjectStatus,
    addCustomProjectReply,
    adminNotifications,
    markAdminNotificationRead,
    searchQuery,
    toasts,
    showToast,
    removeToast,
    resetDemoData,
    isFirebaseLive
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};