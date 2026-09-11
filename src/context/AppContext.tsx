import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { INITIAL_PRODUCTS, CATEGORIES } from '../mockData/products';
import { INITIAL_HOMEPAGE_BANNERS } from '../mockData/banners';
import { INITIAL_ORDERS, INITIAL_ESCALATIONS, INITIAL_STAFF } from '../mockData/orders';
import { AVAILABLE_SELLERS } from '../mockData/sellerData';
import { 
  INITIAL_CUSTOM_PROJECTS, 
  INITIAL_ADMIN_NOTIFICATIONS, 
  submitCustomProjectInquiry,
  CustomProjectInquiryPayload 
} from '../services/projectService';
import { 
  syncProductToFirestore, 
  deleteProductFromFirestore, 
  fetchProductsFromFirestore,
  subscribeToProducts,
  syncAllProductsToFirestore,
  syncOrderToFirestore, 
  fetchOrdersFromFirestore,
  subscribeToOrders,
  syncCustomProjectToFirestore 
} from '../services/firebaseService';
import {
  fetchBannersFromFirestore,
  subscribeToBanners,
  syncBannerToFirestore,
  deleteBannerFromFirestore,
  getLocalBanners,
  setLocalBanners,
  seedInitialBanners
} from '../services/bannerService';
import {
  fetchCategoriesFromFirestore,
  subscribeToCategories,
  syncCategoryToFirestore,
  updateCategoryImageInFirestore,
  getLocalCategories,
  setLocalCategories
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
  getLocalBonuses,
  formatInrBonus
} from '../services/bonusService';
import { recordActivityLog } from '../services/auditService';
import { testFirestoreConnection } from '../lib/firebase';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Products
  products: Product[];
  categories: Category[];
  updateCategoryImage: (categoryId: string, imageUrl: string) => Promise<void>;
  resetCategoryImage: (categoryId: string) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  isProductSyncing: boolean;
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
  assignSellerToOrder: (orderId: string, sellerId: string, sellerName: string, notes?: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string, updatedBy?: string, courierInfo?: { courier?: string; courierTrackingId?: string; packedBy?: string }) => void;
  adminOverrideOrder: (orderId: string, updates: Partial<Order>) => void;

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
  showToast: (title: string, message?: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;

  // Reset to initial demo data
  resetDemoData: () => void;

  // Firebase Live Sync Status
  isFirebaseLive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

const INITIAL_BULK_ENQUIRIES: BulkEnquirySubmission[] = [
  {
    id: 'ENQ-2026-4821',
    fullName: 'Rahul Sharma',
    email: 'rahul.s@techinnovations.in',
    phone: '+91 98765 43210',
    companyName: 'IIT Tech Incubator',
    targetDeliveryDate: '2026-09-15',
    projectNotes: 'Need bulk reels for IoT smart meter pilot run.',
    items: [
      { id: 'item-1', partNumber: 'ESP32-WROOM-32D', category: 'Microcontroller', quantity: 500, targetPrice: '₹240' },
      { id: 'item-2', partNumber: 'AMS1117-3.3V SOT-223', category: 'Power IC', quantity: 1000, targetPrice: '₹4.50' },
      { id: 'item-3', partNumber: '10k Ohm 0805 SMD Resistor', category: 'Passives', quantity: 5000, targetPrice: '₹0.40' },
    ],
    totalDistinctItems: 3,
    totalQuantity: 6500,
    status: 'under_review',
    createdAt: '2026-08-25',
  }
];

// Normalization helper for backwards compatibility with single image products
export const normalizeProduct = (p: Partial<Product> & Record<string, any>): Product => {
  let imagesList: string[] = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imagesList = p.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
  }
  if (imagesList.length === 0 && typeof p.image === 'string' && p.image.trim().length > 0) {
    imagesList = [p.image.trim()];
  }
  if (imagesList.length === 0) {
    imagesList = ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'];
  }
  return {
    ...(p as Product),
    image: imagesList[0],
    images: imagesList,
  };
};

// Normalization helper for orders ensuring seller assignment fields
export const normalizeOrder = (o: Partial<Order> & Record<string, any>): Order => {
  const isAssigned = Boolean(o.assignedSellerId);
  const status: OrderStatus = !isAssigned && (o.status === 'placed' || !o.status) 
    ? 'pending_assignment' 
    : (o.status || 'pending_assignment');

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
  // Firebase Live Sync status
  const [isFirebaseLive, setIsFirebaseLive] = useState(true);

  useEffect(() => {
    testFirestoreConnection()
      .then(() => setIsFirebaseLive(true))
      .catch(() => setIsFirebaseLive(false));
  }, []);

  // Role state
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'customer';
  });

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    showToast(`Switched Role to ${role.toUpperCase()}`, `Now viewing workspace with ${role} permissions`, 'info');
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeProduct);
        }
      } catch {
        return INITIAL_PRODUCTS.map(normalizeProduct);
      }
    }
    return INITIAL_PRODUCTS.map(normalizeProduct);
  });

  const [isProductSyncing, setIsProductSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Synchronize products with Firebase Firestore (default database in semix-ai-stdio)
  useEffect(() => {
    let isMounted = true;

    // 1. Initial fetch from Firestore to merge with local catalog
    fetchProductsFromFirestore()
      .then(async (remoteProducts) => {
        if (!isMounted) return;
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts((prev) => {
            const productMap = new Map<string, Product>();
            prev.forEach((p) => productMap.set(p.id, p));
            remoteProducts.forEach((rp) => productMap.set(rp.id, normalizeProduct(rp)));
            return Array.from(productMap.values());
          });
        }
      })
      .catch((err) => {
        console.warn('[Firestore] Product load notice:', err?.message || err);
      });

    // 2. Real-time snapshot listener: any team member adding/updating products reflects immediately
    const unsubscribe = subscribeToProducts((remoteProducts) => {
      if (!isMounted || !remoteProducts || remoteProducts.length === 0) return;
      setProducts((prev) => {
        const productMap = new Map<string, Product>();
        prev.forEach((p) => productMap.set(p.id, p));
        remoteProducts.forEach((rp) => productMap.set(rp.id, normalizeProduct(rp)));
        return Array.from(productMap.values());
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (saved) {
      try { return JSON.parse(saved); } catch { return ['prod-001', 'prod-003']; }
    }
    return ['prod-001', 'prod-003'];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Compare List
  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPARE);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(compareList));
  }, [compareList]);

  // Categories State & Management
  const [categories, setCategories] = useState<Category[]>(() => getLocalCategories());

  useEffect(() => {
    let isMounted = true;
    fetchCategoriesFromFirestore()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => console.warn('[CategoryService] Init error:', err));

    const unsub = subscribeToCategories((data) => {
      if (isMounted && data && data.length > 0) {
        setCategories(data);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const updateCategoryImage = async (categoryId: string, imageUrl: string) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === categoryId ? { ...c, image: imageUrl } : c));
      setLocalCategories(updated);
      return updated;
    });

    try {
      await updateCategoryImageInFirestore(categoryId, imageUrl);
      showToast('Category Image Updated', 'New category image saved and live across store', 'success');
    } catch (err: any) {
      console.warn('[CategoryService] Remote sync notice, cached locally:', err);
      showToast('Category Image Saved', 'Saved locally in store catalog', 'info');
    }
  };

  const resetCategoryImage = async (categoryId: string) => {
    const defaultCat = CATEGORIES.find((c) => c.id === categoryId);
    const defaultImg = defaultCat?.image || '';
    if (defaultImg) {
      await updateCategoryImage(categoryId, defaultImg);
    }
  };

  // Homepage Banners State & Management
  const [banners, setBanners] = useState<HomepageBanner[]>(() => getLocalBanners());

  useEffect(() => {
    let isMounted = true;
    fetchBannersFromFirestore()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setBanners(data);
        }
      })
      .catch((err) => console.warn('[BannerService] Init error:', err));

    const unsub = subscribeToBanners((data) => {
      if (isMounted && data && data.length > 0) {
        setBanners(data);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const addBanner = async (bannerData: Omit<HomepageBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<HomepageBanner> => {
    const newBanner: HomepageBanner = {
      ...bannerData,
      id: `banner-${Date.now()}`,
      order: banners.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBanners((prev) => {
      const updated = [...prev, newBanner].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setLocalBanners(updated);
      return updated;
    });

    try {
      await syncBannerToFirestore(newBanner);
      showToast('Banner Added', `Added banner "${newBanner.title}" to homepage`, 'success');
    } catch (err) {
      showToast('Banner Added', `Saved banner locally`, 'info');
    }

    return newBanner;
  };

  const updateBanner = async (updatedBanner: HomepageBanner) => {
    const withTimestamp = {
      ...updatedBanner,
      updatedAt: new Date().toISOString(),
    };

    setBanners((prev) => {
      const updated = prev.map((b) => (b.id === updatedBanner.id ? withTimestamp : b));
      setLocalBanners(updated);
      return updated;
    });

    try {
      await syncBannerToFirestore(withTimestamp);
      showToast('Banner Updated', `Updated banner "${updatedBanner.title}"`, 'success');
    } catch (err) {
      showToast('Banner Updated', `Saved banner changes locally`, 'info');
    }
  };

  const deleteBanner = async (bannerId: string) => {
    setBanners((prev) => {
      const updated = prev.filter((b) => b.id !== bannerId);
      setLocalBanners(updated);
      return updated;
    });

    try {
      await deleteBannerFromFirestore(bannerId);
      showToast('Banner Deleted', 'Banner removed from homepage slides', 'info');
    } catch (err) {
      showToast('Banner Removed', 'Removed from local banner catalog', 'info');
    }
  };

  const reorderBanners = async (orderedBanners: HomepageBanner[]) => {
    const updatedWithOrder = orderedBanners.map((banner, index) => ({
      ...banner,
      order: index + 1,
      updatedAt: new Date().toISOString(),
    }));

    setBanners(updatedWithOrder);
    setLocalBanners(updatedWithOrder);

    for (const b of updatedWithOrder) {
      syncBannerToFirestore(b).catch(() => {});
    }
    showToast('Banners Reordered', 'New slide sequence saved', 'success');
  };

  const toggleBannerActive = async (bannerId: string) => {
    const target = banners.find((b) => b.id === bannerId);
    if (!target) return;
    const updated = { ...target, isActive: !target.isActive, updatedAt: new Date().toISOString() };
    await updateBanner(updated);
  };

  const resetBannersToDefault = async () => {
    setBanners(INITIAL_HOMEPAGE_BANNERS);
    setLocalBanners(INITIAL_HOMEPAGE_BANNERS);
    await seedInitialBanners();
    showToast('Banners Reset', 'Restored default homepage hero slides', 'info');
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeOrder);
        }
      } catch {
        return INITIAL_ORDERS.map(normalizeOrder);
      }
    }
    return INITIAL_ORDERS.map(normalizeOrder);
  });

  const [availableSellers, setAvailableSellers] = useState<AvailableSeller[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELLERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return AVAILABLE_SELLERS;
      }
    }
    return AVAILABLE_SELLERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(availableSellers));
  }, [availableSellers]);

  const addAvailableSeller = (seller: AvailableSeller) => {
    setAvailableSellers((prev) => {
      const exists = prev.some((s) => s.id === seller.id || s.email.toLowerCase() === seller.email.toLowerCase());
      if (exists) {
        return prev.map((s) => (s.id === seller.id || s.email.toLowerCase() === seller.email.toLowerCase() ? { ...s, ...seller } : s));
      }
      return [...prev, seller];
    });
  };

  const updateAvailableSeller = (id: string, updates: Partial<AvailableSeller>) => {
    setAvailableSellers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeAvailableSeller = (id: string) => {
    setAvailableSellers((prev) => prev.filter((s) => s.id !== id));
  };

  // Seller Bonuses state and persistence
  const [sellerBonuses, setSellerBonuses] = useState<Record<string, SellerBonusRecord>>(() => getLocalBonuses());

  useEffect(() => {
    let isMounted = true;

    fetchAllSellerBonuses()
      .then((remoteBonuses) => {
        if (!isMounted) return;
        if (remoteBonuses && remoteBonuses.length > 0) {
          const map: Record<string, SellerBonusRecord> = {};
          remoteBonuses.forEach((b) => {
            map[b.sellerId] = b;
          });
          setSellerBonuses((prev) => ({ ...prev, ...map }));
          setAvailableSellers((prev) =>
            prev.map((s) => ({
              ...s,
              bonusAmount: map[s.id] ? map[s.id].bonusAmount : s.bonusAmount || 0,
              bonusUpdatedAt: map[s.id] ? map[s.id].updatedAt : s.bonusUpdatedAt,
              bonusUpdatedBy: map[s.id] ? map[s.id].updatedBy : s.bonusUpdatedBy,
            }))
          );
        }
      })
      .catch((err) => console.warn('[Bonuses] Initial fetch error:', err));

    const unsub = subscribeToSellerBonuses((updatedMap) => {
      if (!isMounted) return;
      setSellerBonuses(updatedMap);
      setAvailableSellers((prev) =>
        prev.map((s) => ({
          ...s,
          bonusAmount: updatedMap[s.id] ? updatedMap[s.id].bonusAmount : s.bonusAmount || 0,
          bonusUpdatedAt: updatedMap[s.id] ? updatedMap[s.id].updatedAt : s.bonusUpdatedAt,
          bonusUpdatedBy: updatedMap[s.id] ? updatedMap[s.id].updatedBy : s.bonusUpdatedBy,
        }))
      );
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const updateSellerBonus = async (
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
      showToast('Bonus Updated Successfully', `Assigned ${formatInrBonus(amount)} to ${sellerName || 'seller'}`, 'success');
      
      // Record immutable audit log
      recordActivityLog({
        userId: 'usr-admin-01',
        userEmail: 'aryangandhale27@gmail.com',
        userName: 'Admin Controller',
        userRole: 'admin',
        actionType: 'BONUS_ALLOCATION',
        targetEntity: 'seller_bonuses',
        targetId: sellerId,
        changes: {
          diffs: {
            bonusAmount: { oldValue: rec.previousBonus, newValue: amount },
          },
          affectedFields: ['bonusAmount'],
          summary: `Admin set bonus for ${sellerName || sellerId} to ${formatInrBonus(amount)}`,
        },
        metadata: {
          source: 'web_client',
          route: '/admin',
        },
      }).catch((e) => console.warn('[AuditService] bonus log deferred:', e));

      return { success: true };
    } else {
      const errorMsg = result.error || 'Please enter a valid bonus amount.';
      showToast('Bonus Update Failed', errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const getSellerBonus = (sellerId: string): number => {
    if (sellerBonuses[sellerId] && typeof sellerBonuses[sellerId].bonusAmount === 'number') {
      return sellerBonuses[sellerId].bonusAmount;
    }
    const found = availableSellers.find((s) => s.id === sellerId);
    return found?.bonusAmount || 0;
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Synchronize orders with Firebase Firestore (initial load and realtime listener)
  useEffect(() => {
    let isMounted = true;

    fetchOrdersFromFirestore()
      .then((remoteOrders) => {
        if (!isMounted) return;
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders((prev) => {
            const orderMap = new Map<string, Order>();
            prev.forEach((o) => orderMap.set(o.id, o));
            remoteOrders.forEach((ro) => orderMap.set(ro.id, normalizeOrder(ro)));
            return Array.from(orderMap.values());
          });
        }
      })
      .catch((err) => {
        console.warn('[Firestore] Orders load notice:', err?.message || err);
      });

    const unsubscribe = subscribeToOrders((remoteOrders) => {
      if (!isMounted || !remoteOrders || remoteOrders.length === 0) return;
      setOrders((prev) => {
        const orderMap = new Map<string, Order>();
        prev.forEach((o) => orderMap.set(o.id, o));
        remoteOrders.forEach((ro) => orderMap.set(ro.id, normalizeOrder(ro)));
        return Array.from(orderMap.values());
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Escalations
  const [escalations, setEscalations] = useState<EscalationIssue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ESCALATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_ESCALATIONS; }
    }
    return INITIAL_ESCALATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(escalations));
  }, [escalations]);

  // Staff
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_STAFF; }
    }
    return INITIAL_STAFF;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  // Bulk Enquiries
  const [bulkEnquiries, setBulkEnquiries] = useState<BulkEnquirySubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BULK_ENQUIRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_BULK_ENQUIRIES; }
    }
    return INITIAL_BULK_ENQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BULK_ENQUIRIES, JSON.stringify(bulkEnquiries));
  }, [bulkEnquiries]);

  const submitBulkEnquiry = (enquiryData: Omit<BulkEnquirySubmission, 'id' | 'createdAt' | 'status'>): BulkEnquirySubmission => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `ENQ-2026-${randomSuffix}`;
    const newEnquiry: BulkEnquirySubmission = {
      ...enquiryData,
      id: newId,
      status: 'submitted',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBulkEnquiries((prev) => [newEnquiry, ...prev]);
    showToast('Bulk Enquiry Submitted!', `Quotation ticket #${newId} logged for priority evaluation.`, 'success');
    return newEnquiry;
  };

  // Custom Projects State & Actions
  const [customProjects, setCustomProjects] = useState<CustomProjectSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_PROJECTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_CUSTOM_PROJECTS; }
    }
    return INITIAL_CUSTOM_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PROJECTS, JSON.stringify(customProjects));
  }, [customProjects]);

  const [adminNotifications, setAdminNotifications] = useState<AdminProjectNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_ADMIN_NOTIFICATIONS; }
    }
    return INITIAL_ADMIN_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  const submitCustomProject = async (payload: CustomProjectInquiryPayload): Promise<CustomProjectSubmission> => {
    const newSubmission = await submitCustomProjectInquiry(payload);
    setCustomProjects((prev) => [newSubmission, ...prev]);

    // Create persistent Admin notification
    const notifId = 'notif-' + Date.now();
    const newNotification: AdminProjectNotification = {
      id: notifId,
      projectId: newSubmission.id,
      projectTitle: newSubmission.projectName,
      clientName: newSubmission.clientName,
      timestamp: newSubmission.createdAt,
      read: false,
      message: `New custom engineering project "${newSubmission.projectName}" (${newSubmission.category}) submitted by ${newSubmission.clientName} (${newSubmission.companyName}).`
    };
    setAdminNotifications((prev) => [newNotification, ...prev]);

    // Asynchronously sync to Firebase Firestore
    syncCustomProjectToFirestore(newSubmission).catch((err) => {
      console.warn('Firebase Custom Project sync deferred:', err);
    });

    showToast('Project Submitted to Admin', `Custom Project Ticket #${newSubmission.id} registered for technical review.`, 'success');
    return newSubmission;
  };

  const updateCustomProjectStatus = (id: string, status: CustomProjectStatus, adminNotes?: string) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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
    showToast('Project Status Updated', `Ticket #${id} status changed to ${status}`, 'info');
  };

  const addCustomProjectReply = (id: string, message: string, quoteAmount?: string) => {
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
    showToast('Quote / Communication Sent', `Quotation dispatched to client for #${id}`, 'success');
  };

  const markAdminNotificationRead = (id: string) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');

  // Toast System
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (title: string, message?: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper for tiered pricing
  const calculateAppliedPrice = (product: Product, quantity: number): number => {
    if (!product.bulkTiers || product.bulkTiers.length === 0) {
      return product.price;
    }
    // Find highest matching tier
    const sorted = [...product.bulkTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sorted) {
      if (quantity >= tier.minQty) {
        return tier.unitPrice;
      }
    }
    return product.price;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
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
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
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
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item Removed', 'Product removed from your cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.appliedUnitPrice * item.quantity, 0);

  // Coupon State & Validation Management
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Re-evaluate discount if cart items or quantities change
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

  const applyCoupon = async (code: string, userId?: string): Promise<CouponValidationResult> => {
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
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon Removed', 'Standard item pricing restored.', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist', prod ? prod.name : '', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', prod ? prod.name : '', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const addToCompare = (productId: string): boolean => {
    if (compareList.includes(productId)) {
      removeFromCompare(productId);
      return false;
    }
    if (compareList.length >= 4) {
      showToast('Compare Limit Reached', 'You can compare up to 4 components at once', 'warning');
      return false;
    }
    setCompareList((prev) => [...prev, productId]);
    const prod = products.find((p) => p.id === productId);
    showToast('Added to Comparison', prod ? prod.name : '', 'info');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isComparing = (productId: string) => compareList.includes(productId);

  // Product inventory updates
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stockCount: Math.max(0, newStock), inStock: newStock > 0 }
          : p
      )
    );
    showToast('Inventory Updated', `Stock count updated to ${newStock} units`, 'success');
  };

  const updateProduct = (updated: Product) => {
    const nowIso = new Date().toISOString();
    const normalized = normalizeProduct({
      ...updated,
      updatedAt: nowIso,
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === normalized.id ? normalized : p))
    );
    syncProductToFirestore(normalized)
      .then(() => {
        console.log(`[Firestore] Product "${normalized.name}" updated in Cloud Firestore`);
      })
      .catch((err) => {
        console.warn('Firestore product update deferred:', err);
      });
    showToast('Product Updated', `${normalized.name} changes synced to Firebase`, 'success');
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const id = productData.sku 
      ? `prod-${productData.sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}` 
      : `prod-${Date.now().toString().slice(-6)}`;
      
    const nowIso = new Date().toISOString();
    const teamAuthor = currentRole === 'admin' 
      ? 'Central Engineering Admin' 
      : currentRole === 'seller' 
      ? 'Verified Component Supplier' 
      : 'Hardware Ops Tech Team';

    const normalized = normalizeProduct({ 
      ...productData, 
      id,
      createdAt: (productData as any).createdAt || nowIso,
      updatedAt: nowIso,
      addedBy: (productData as any).addedBy || teamAuthor,
      addedByRole: (productData as any).addedByRole || currentRole,
    });

    setProducts((prev) => [normalized, ...prev.filter((p) => p.id !== id)]);
    
    syncProductToFirestore(normalized)
      .then(() => {
        console.log(`[Firestore] New hardware component "${normalized.name}" (${normalized.id}) saved to Firestore 'products'`);
      })
      .catch((err) => {
        console.warn('Firestore product creation deferred:', err);
      });

    showToast('Product Stored in Firebase', `${normalized.name} successfully published to catalog & Firestore`, 'success');
  };

  const syncAllProductsToFirebase = async () => {
    setIsProductSyncing(true);
    try {
      const result = await syncAllProductsToFirestore(products);
      showToast('Firebase Catalog Sync', `Synced ${result.count} products to Cloud Firestore in semix-ai-stdio`, 'success');
    } catch (err: any) {
      showToast('Sync Error', err?.message || 'Could not sync all products to Firebase', 'warning');
    } finally {
      setIsProductSyncing(false);
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving updated products after deletion:', err);
      }
      return updated;
    });
    deleteProductFromFirestore(productId).catch((err) => {
      console.warn('Firestore product deletion deferred:', err);
    });
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.product.id !== productId);
      try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updatedCart));
      } catch (err) {
        console.error(err);
      }
      return updatedCart;
    });
    setWishlist((prev) => prev.filter((id) => id !== productId));
    setCompareList((prev) => prev.filter((id) => id !== productId));
    showToast('Product Removed', 'Component permanently deleted from catalog and carts', 'warning');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'trackingNumber' | 'statusTimeline' | 'createdAt'>): Order => {
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
      createdAt: now.toISOString(),
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

    // Asynchronously synchronize order to Firebase Firestore
    syncOrderToFirestore(newOrder).catch((err) => {
      console.warn('Firestore Order sync deferred:', err);
    });

    // Decrement stock
    orderData.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId
            ? { ...p, stockCount: Math.max(0, p.stockCount - item.quantity), inStock: p.stockCount - item.quantity > 0 }
            : p
        )
      );
    });

    clearCart();

    // Trigger automated emails: Customer confirmation + Admin alert
    sendOrderPlacedEmails(newOrder).catch((e) => {
      console.warn('[EmailService] Order emails deferred:', e);
    });

    return newOrder;
  };

  const placeOrderWithCoupon = async (
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
      statusTimeline: [
        {
          status: initialStatus,
          timestamp: formattedDate,
          note: `Order placed via ${orderData.paymentMethod}. Awaiting Admin seller allocation.`,
          updatedBy: 'System Gateway'
        }
      ]
    };

    // Execute atomic Firestore transaction validating 8 rules and incrementing usage
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

    // Decrement stock
    orderData.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId
            ? { ...p, stockCount: Math.max(0, p.stockCount - item.quantity), inStock: p.stockCount - item.quantity > 0 }
            : p
        )
      );
    });

    clearCart();
    setAppliedCoupon(null);
    setCouponDiscount(0);

    // Trigger automated emails: Customer confirmation + Admin alert
    sendOrderPlacedEmails(finalizedOrder).catch((e) => {
      console.warn('[EmailService] Order emails deferred:', e);
    });

    return { success: true, order: finalizedOrder };
  };

  const assignSellerToOrder = (
    orderId: string,
    sellerId: string,
    sellerName: string,
    notes?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const isCurrentPending = !order.assignedSellerId || order.status === 'pending_assignment' || order.status === 'placed';
          const nextStatus: OrderStatus = isCurrentPending ? 'assigned' : order.status;

          const newTimelineEntry = {
            status: nextStatus,
            timestamp: formattedDate,
            note: notes 
              ? `Assigned to ${sellerName} by Admin. Note: ${notes}` 
              : `Assigned to fulfillment seller: ${sellerName} by Admin Operations.`,
            updatedBy: 'Admin Operations'
          };

          const updatedOrder = {
            ...order,
            status: nextStatus,
            assignedSellerId: sellerId,
            assignedSellerName: sellerName,
            assignedAt: now.toISOString(),
            statusTimeline: [...order.statusTimeline, newTimelineEntry]
          };
          syncOrderToFirestore(updatedOrder).catch((e) => console.warn('Firestore sync deferred:', e));

          // Trigger automated email: Seller Assignment notification
          const matchedSeller = availableSellers.find((s) => s.id === sellerId) || {
            id: sellerId,
            name: sellerName,
            email: 'seller@semixlabs.com',
            phone: '+91 98765 43210',
            warehouseHub: 'Regional Warehouse Hub',
            gstin: '29ABCDE1234F1Z5',
            rating: 4.9,
          };
          sendSellerAssignmentEmail(updatedOrder, matchedSeller, notes).catch((e) => {
            console.warn('[EmailService] Seller assignment email deferred:', e);
          });

          // Record immutable audit log
          recordActivityLog({
            userId: 'usr-admin-01',
            userEmail: 'aryangandhale27@gmail.com',
            userName: 'Admin Operations',
            userRole: 'admin',
            actionType: 'ASSIGNMENT',
            targetEntity: 'orders',
            targetId: orderId,
            changes: {
              diffs: {
                assignedSellerId: { oldValue: order.assignedSellerId || null, newValue: sellerId },
                assignedSellerName: { oldValue: order.assignedSellerName || null, newValue: sellerName },
                status: { oldValue: order.status, newValue: nextStatus },
              },
              affectedFields: ['assignedSellerId', 'assignedSellerName', 'status'],
              summary: `Assigned order ${orderId} to fulfillment seller ${sellerName}`,
            },
            metadata: {
              source: 'web_client',
              reason: notes || 'Fulfillment assignment',
              route: '/admin',
            },
          }).catch((e) => console.warn('[AuditService] assign log deferred:', e));

          return updatedOrder;
        }
        return order;
      })
    );

    showToast('Seller Assigned', `Order ${orderId} assigned to ${sellerName}. Dispatch email sent to hub!`, 'success');
  };

  const updateOrderStatus = (
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
          const defaultNote =
            newStatus === 'packed'
              ? 'Inspected, ESD bagged & packaged into secure shipping carton.'
              : newStatus === 'shipped'
              ? `Handed over to carrier (${courierInfo?.courier || 'Express Logistics'}).`
              : newStatus === 'delivered'
              ? 'Successfully delivered to customer.'
              : 'Status updated.';

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

          // Record immutable audit log
          recordActivityLog({
            userId: currentRole === 'admin' ? 'usr-admin-01' : 'usr-seller-01',
            userEmail: currentRole === 'admin' ? 'aryangandhale27@gmail.com' : 'seller@semixlabs.com',
            userName: updatedBy || (currentRole === 'admin' ? 'Central Admin' : 'Fulfillment Hub Seller'),
            userRole: currentRole === 'admin' ? 'admin' : 'seller',
            actionType: 'STATUS_CHANGE',
            targetEntity: 'orders',
            targetId: orderId,
            changes: {
              diffs: {
                status: { oldValue: order.status, newValue: newStatus },
              },
              affectedFields: ['status'],
              summary: `Order ${orderId} status changed from "${order.status}" to "${newStatus}" by ${currentRole}`,
            },
            metadata: {
              source: 'web_client',
              reason: note || defaultNote,
              route: currentRole === 'admin' ? '/admin' : '/seller',
            },
          }).catch((e) => console.warn('[AuditService] status log deferred:', e));

          return updatedOrder;
        }
        return order;
      })
    );

    showToast('Order Status Advanced', `Order ${orderId} marked as ${newStatus.toUpperCase()}`, 'success');
  };

  const adminOverrideOrder = (orderId: string, updates: Partial<Order>) => {
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
  };

  // Escalations
  const reportEscalation = (issueData: Omit<EscalationIssue, 'id' | 'createdAt' | 'status'>) => {
    const id = `ESC-${Math.floor(400 + Math.random() * 500)}`;
    const newIssue: EscalationIssue = {
      ...issueData,
      id,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setEscalations((prev) => [newIssue, ...prev]);
    showToast('Discrepancy Escalated', `Ticket #${id} dispatched to Admin queue`, 'warning');
  };

  const resolveEscalation = (id: string, resolutionNote: string, resolvedBy: string) => {
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
  };

  // Staff
  const addStaff = (memberData: Omit<StaffMember, 'id' | 'lastActive'>) => {
    const id = `STF-${Math.floor(10 + Math.random() * 90)}`;
    const newMember: StaffMember = {
      ...memberData,
      id,
      lastActive: 'Just added'
    };
    setStaff((prev) => [...prev, newMember]);
    showToast('Staff Access Granted', `${newMember.name} added as ${newMember.role.toUpperCase()}`, 'success');
  };

  const toggleStaffStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  // Reset
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SELLERS);
    localStorage.removeItem(STORAGE_KEYS.ESCALATIONS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    localStorage.removeItem(STORAGE_KEYS.COMPARE);
    localStorage.removeItem(STORAGE_KEYS.BULK_ENQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setAvailableSellers(AVAILABLE_SELLERS);
    setEscalations(INITIAL_ESCALATIONS);
    setStaff(INITIAL_STAFF);
    setBulkEnquiries(INITIAL_BULK_ENQUIRIES);
    setCustomProjects(INITIAL_CUSTOM_PROJECTS);
    setAdminNotifications(INITIAL_ADMIN_NOTIFICATIONS);
    setCart([]);
    setWishlist(['prod-001', 'prod-003']);
    setCompareList([]);
    showToast('Reset Complete', 'Default hardware catalog, projects & demo orders restored', 'info');
  };

  return (
    <AppContext.Provider
      value={{
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
        assignSellerToOrder,
        updateOrderStatus,
        adminOverrideOrder,
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
      }}
    >
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
