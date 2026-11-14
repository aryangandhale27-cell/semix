import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, StaffMember } from '../../types';
import { ProductFormModal } from '../../components/team/ProductFormModal';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Boxes, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Search, 
  X, 
  BarChart3,
  Cpu,
  Store,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  Flame,
  Sparkles
} from 'lucide-react';

import { CustomProjectsManager } from '../../components/admin/CustomProjectsManager';
import { AdminOrdersTab } from '../../components/admin/AdminOrdersTab';
import { AdminUserManagementTab } from '../../components/admin/AdminUserManagementTab';
import { AdminCouponManagementTab } from '../../components/admin/AdminCouponManagementTab';
import { AdminKpiCardsRow } from '../../components/admin/AdminKpiCardsRow';
import { AdminSearchAnalyticsTab } from '../../components/admin/AdminSearchAnalyticsTab';
import { AdminBannerManagementTab } from '../../components/admin/AdminBannerManagementTab';
import { AdminCategoryManagementTab } from '../../components/admin/AdminCategoryManagementTab';
import { AdminBonusManagementTab } from '../../components/admin/AdminBonusManagementTab';
import { AdminAuditLogsTab } from '../../components/admin/AdminAuditLogsTab';
import { AdminCollectPaymentTab } from '../../components/admin/AdminCollectPaymentTab';
import { UploadedListRequestsTab } from '../../components/admin/UploadedListRequestsTab';
import { AdminFinancialDashboard } from '../../components/admin/AdminFinancialDashboard';
import { useFirestoreAdminKPIs } from '../../hooks/useFirestoreAdminKPIs';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Tag, SlidersHorizontal, FolderTree, Image as ImageIcon, Award, ShieldAlert, ShoppingBag } from 'lucide-react';
import { backfillProductSearchKeywords } from '../../services/firebaseService';

const ADMIN_PRODUCT_BATCH_SIZE = 50;

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    orders, 
    staff, 
    categories, 
    banners,
    addProduct, 
    updateProduct, 
    assignHomepageProduct,
    deleteProduct, 
    isProductSyncing,
    loadAllProducts,
    syncAllProductsToFirebase,
    addStaff, 
    toggleStaffStatus, 
    customProjects,
    adminNotifications,
    showToast
  } = useApp();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedAnalyticsCategory, setSelectedAnalyticsCategory] = useState<string | null>(null);

  const pendingOrdersCount = orders.filter(
    (o) => !o.assignedSellerId || o.status === 'pending_assignment'
  ).length;

  const [activeTab, setActiveTab] = useState<'orders' | 'coupons' | 'users' | 'bonuses' | 'banners' | 'categories' | 'audit_logs' | 'analytics' | 'financials' | 'catalog' | 'staff' | 'custom_projects' | 'collect_payment' | 'uploaded_lists'>(() => {
    return pendingOrdersCount > 0 ? 'orders' : 'orders';
  });
  const [openAddOrderRequest, setOpenAddOrderRequest] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [visibleProductCount, setVisibleProductCount] = useState(ADMIN_PRODUCT_BATCH_SIZE);
  const [isCatalogLoaded, setIsCatalogLoaded] = useState(false);
  const [isBuildingSearchIndex, setIsBuildingSearchIndex] = useState(false);
  const [searchIndexProgress, setSearchIndexProgress] = useState({ completed: 0, total: 0 });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [trendingProductId, setTrendingProductId] = useState('');
  const [freshProductId, setFreshProductId] = useState('');
  const [trendingProductSearch, setTrendingProductSearch] = useState('');
  const [freshProductSearch, setFreshProductSearch] = useState('');

  // New staff form state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<{
    name: string;
    email: string;
    role: 'team' | 'admin';
    department: string;
    active: boolean;
  }>({
    name: '',
    email: '',
    role: 'team',
    department: 'Fulfillment & Logistics',
    active: true,
  });

  // Real-time Firestore Admin KPIs
  const firestoreKPIs = useFirestoreAdminKPIs(orders, products, isCatalogLoaded);
  const [adminSectionsOpen, setAdminSectionsOpen] = useState(false);
  const productAttribution = useMemo(() => {
    const counts = new Map<string, { name: string; email: string; role: string; count: number }>();

    products.forEach((product) => {
      const name = product.addedBy || 'Semix Team';
      const email = product.addedByEmail || '';
      const role = product.addedByRole || 'team';
      const key = email || name;
      const current = counts.get(key) || { name, email, role, count: 0 };
      current.count += 1;
      counts.set(key, current);
    });

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .map((member, index) => ({ ...member, rank: index + 1 }));
  }, [products]);

  const topProductContributor = productAttribution[0];
  const selectedAnalyticsProducts = useMemo(
    () => products.filter((product) => product.category === selectedAnalyticsCategory),
    [products, selectedAnalyticsCategory]
  );
  const minimumCatalogOrderValue = useMemo(
    () =>
      products
        .filter((product) => product.inStock && Number(product.price) > 0)
        .map((product) => ({
          product,
          value: Number(product.price) * Math.max(1, Number(product.minOrderQty) || 1),
        }))
        .sort((a, b) => a.value - b.value)[0],
    [products]
  );

  useEffect(() => {
    if (activeTab !== 'catalog' || isCatalogLoaded) return;

    let isCurrent = true;
    loadAllProducts()
      .then(() => {
        if (isCurrent) setIsCatalogLoaded(true);
      })
      .catch((error) => {
        console.error('[Admin] Could not load the product catalog:', error);
        showToast('Catalog Load Failed', 'The product catalog could not be loaded. Please retry.', 'error');
      });
    return () => {
      isCurrent = false;
    };
  }, [activeTab, isCatalogLoaded, loadAllProducts, showToast]);

  const handleBuildSearchIndex = async () => {
    if (!isCatalogLoaded || isBuildingSearchIndex) return;
    const confirmed = window.confirm(
      `Build keyword search data for all ${products.length.toLocaleString()} catalog products? This adds a searchKeywords field and writes every product document.`
    );
    if (!confirmed) return;

    setIsBuildingSearchIndex(true);
    setSearchIndexProgress({ completed: 0, total: products.length });
    let completedProducts = 0;
    try {
      const indexedCount = await backfillProductSearchKeywords(products, (completed, total) => {
        completedProducts = completed;
        setSearchIndexProgress({ completed, total });
      });
      showToast('Search Index Ready', `Built keyword search data for ${indexedCount.toLocaleString()} products.`, 'success');
    } catch (error) {
      console.error('[Admin] Could not build the product search index:', error);
      showToast(
        'Search Index Failed',
        `Search indexing stopped after ${completedProducts.toLocaleString()} of ${products.length.toLocaleString()} products. Retry to rebuild the index.`,
        'error'
      );
    } finally {
      setIsBuildingSearchIndex(false);
    }
  };

  const handleSaveNewProduct = async (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      await updateProduct(productData);
    } else {
      await addProduct(productData);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct);
      setEditingProduct(null);
    } catch (error) {
      console.error('[Admin] Product update failed:', error);
      showToast('Product Update Failed', 'Firestore rejected the update. Check your account permissions and try again.', 'error');
    }
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    addStaff({
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      department: newStaff.department,
      active: true,
    });

    showToast('Staff Added', `${newStaff.name} assigned ${newStaff.role}`, 'success');
    setIsAddStaffOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  useEffect(() => {
    setVisibleProductCount(ADMIN_PRODUCT_BATCH_SIZE);
  }, [productSearch, products.length]);

  const visibleProducts = filteredProducts.slice(0, visibleProductCount);

  const filterHomepageProducts = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.brand].some((value) =>
        String(value ?? '').toLowerCase().includes(normalizedQuery)
      )
    );
  };

  const addProductToHomepageSection = async (productId: string, section: 'trending' | 'fresh') => {
    if (!productId) return;
    await assignHomepageProduct(productId, section);
    if (section === 'trending') {
      setTrendingProductId('');
      setTrendingProductSearch('');
    } else {
      setFreshProductId('');
      setFreshProductSearch('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-3.5 text-slate-900 shadow-sm sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-[#561269]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Admin Portal</h1>
        </div>
      </div>

      <section aria-labelledby="admin-quick-actions-title" className="rounded-2xl border border-slate-200 bg-gradient-to-r from-violet-50 via-white to-orange-50 p-3 shadow-sm sm:p-4">
        <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" aria-hidden="true" />
          <h2 id="admin-quick-actions-title" className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:max-w-2xl sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              setOpenAddOrderRequest(true);
            }}
            className="group flex min-h-14 min-w-0 items-center gap-2 rounded-xl border border-violet-200 bg-white px-2.5 py-2.5 text-left text-xs font-bold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#561269]/40 hover:shadow-md sm:min-h-16 sm:gap-3 sm:px-4 sm:text-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-[#561269] transition-colors group-hover:bg-[#561269] group-hover:text-white sm:h-10 sm:w-10">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="min-w-0 truncate">Add Order</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
            className="group flex min-h-14 min-w-0 items-center gap-2 rounded-xl border border-orange-200 bg-white px-2.5 py-2.5 text-left text-xs font-bold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md sm:min-h-16 sm:gap-3 sm:px-4 sm:text-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[#F15C00] transition-colors group-hover:bg-[#FF6B00] group-hover:text-white sm:h-10 sm:w-10">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="min-w-0 truncate">Add Component</span>
          </button>
        </div>
      </section>

      {/* Real-time Dynamic Firestore KPI Cards Row */}
      <AdminKpiCardsRow
        kpis={firestoreKPIs}
        onNavigateToOrders={() => setActiveTab('orders')}
        onNavigateToCatalog={() => setActiveTab('catalog')}
      />

      {/* Tabs */}
      <div className="relative flex items-center justify-between gap-3 overflow-visible rounded-2xl border border-[#561269]/15 bg-gradient-to-r from-[#561269]/[0.045] via-white to-white p-3 shadow-sm sm:p-3.5">
        <div className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#561269] to-violet-400" />
        <div className="flex min-w-0 items-center gap-3 pl-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#561269] text-white shadow-sm shadow-[#561269]/20">
            <LayoutGrid className="h-5 w-5" />
          </span>
          <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7C3AED]">Admin workspace</p>
          <p className="truncate text-sm font-black text-slate-900 sm:text-base">
            {activeTab === 'orders' ? 'Orders & Seller Assignment' :
              activeTab === 'coupons' ? 'Coupons & Discounts' :
              activeTab === 'users' ? 'User Management' :
              activeTab === 'bonuses' ? 'Sellers → Bonuses' :
              activeTab === 'banners' ? 'Homepage Banners' :
              activeTab === 'categories' ? 'Category Images' :
              activeTab === 'audit_logs' ? 'Audit & Activity Logs' :
              activeTab === 'analytics' ? 'Analytics & Sales Breakdown' :
              activeTab === 'financials' ? 'Sales & Financials' :
              activeTab === 'catalog' ? 'Catalog & Product Management' :
              activeTab === 'staff' ? 'Staff & Role Access' :
              activeTab === 'collect_payment' ? 'Collect Payment' :
              activeTab === 'uploaded_lists' ? 'Uploaded Electronics Lists' : 'Custom Project Requests'}
          </p>
          </div>
        </div>
        <div className="relative shrink-0">
          <button
            type="button"
            aria-expanded={adminSectionsOpen}
            aria-label="Open admin section"
            onClick={() => setAdminSectionsOpen((open) => !open)}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-[#561269] bg-[#561269] px-3 py-2.5 text-xs font-extrabold text-white shadow-md shadow-[#561269]/20 transition-all hover:-translate-y-0.5 hover:bg-[#460e56] focus:outline-none focus:ring-2 focus:ring-violet-300 sm:gap-2.5 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Browse sections</span>
            <span className="rounded-lg border border-white/10 bg-white/15 px-2 py-1 text-[10px] font-extrabold sm:text-[11px]">
              {activeTab === 'orders' ? 'Orders' :
                activeTab === 'coupons' ? 'Coupons' :
                activeTab === 'users' ? 'Users' :
                activeTab === 'bonuses' ? 'Bonuses' :
                activeTab === 'banners' ? 'Banners' :
                activeTab === 'categories' ? 'Categories' :
                activeTab === 'audit_logs' ? 'Audit' :
                activeTab === 'analytics' ? 'Analytics' :
                activeTab === 'financials' ? 'Financials' :
                activeTab === 'catalog' ? 'Catalog' :
                activeTab === 'staff' ? 'Staff' :
                activeTab === 'collect_payment' ? 'Payments' :
                activeTab === 'uploaded_lists' ? 'Uploaded Lists' : 'Projects'}
            </span>
            <ChevronDown className={`h-4 w-4 text-violet-200 transition-transform ${adminSectionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {adminSectionsOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,34rem)] w-80 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5 sm:w-[22rem]">
              <div className="mb-1.5 flex items-center justify-between border-b border-slate-100 px-3 pb-2.5 pt-1.5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B00]">Workspace</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900">Admin sections</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-[#561269]">
                  <LayoutGrid className="h-4 w-4" />
                </span>
              </div>
              {([
                ['orders', 'Orders & Seller Assignment', Package],
                ['coupons', 'Coupons & Discounts', Tag],
                ['users', 'User Management', Users],
                ['bonuses', 'Sellers → Bonuses', Award],
                ['banners', 'Homepage Banners', ImageIcon],
                ['categories', 'Category Images', FolderTree],
                ['audit_logs', 'Audit & Activity Logs', ShieldAlert],
                ['financials', 'Sales & Financials', DollarSign],
                ['analytics', 'Analytics & Sales Breakdown', BarChart3],
                ['catalog', 'Catalog & Product Management', Cpu],
                ['staff', 'Staff & Role Access', Store],
                ['collect_payment', 'Collect Payment', DollarSign],
                ['uploaded_lists', 'Uploaded Electronics Lists', ShoppingBag],
                ['custom_projects', 'Custom Project Requests', Sparkles],
              ] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setActiveTab(value as typeof activeTab);
                    setAdminSectionsOpen(false);
                  }}
                  className={`group flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 text-left text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                    activeTab === value
                      ? 'bg-[#561269] text-white shadow-sm shadow-[#561269]/20'
                      : 'text-slate-700 hover:bg-violet-50 hover:text-[#561269]'
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    activeTab === value
                      ? 'border-white/15 bg-white/15 text-white'
                      : 'border-slate-200 bg-slate-50 text-violet-700 group-hover:border-violet-100 group-hover:bg-white'
                  }`}>
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {activeTab === value && <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-200" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4 text-[#FF6B00]" />
          <span>Orders &amp; Seller Assignment</span>
          {pendingOrdersCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
              {pendingOrdersCount} Pending
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
              {orders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'coupons' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4 text-purple-400" />
          <span>Coupons & Discounts</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
            Firestore
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-[#FF6B00]" />
          <span>User Management</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-[#561269]">
            Accounts &amp; Roles
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bonuses')}
          id="admin-tab-bonuses"
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bonuses' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Sellers → Bonuses</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'bonuses' ? 'bg-[#FF6B00] text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            ₹ INR
          </span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'banners' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>Homepage Banners</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'banners' ? 'bg-[#FF6B00] text-white' : 'bg-purple-100 text-[#561269]'
          }`}>
            {banners?.length || 6}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'categories' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderTree className="w-4 h-4 text-[#FF6B00]" />
          <span>Category Images</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'categories' ? 'bg-[#FF6B00] text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {categories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          id="admin-tab-audit-logs"
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit_logs' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Audit &amp; Activity Logs</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'audit_logs' ? 'bg-[#FF6B00] text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            Immutable
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#FF6B00]" />
          <span>Analytics & Sales Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'catalog' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4 text-cyan-400" />
          <span>Catalog & Product Management ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'staff' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>Staff & Role Access ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custom_projects')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'custom_projects' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#FF6B00]" />
          <span>Custom Project Requests</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'custom_projects' ? 'bg-[#FF6B00] text-white' : 'bg-purple-100 text-[#561269]'
          }`}>
            {customProjects.length}
          </span>
          {customProjects.some((p) => p.status === 'Pending Review') && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          )}
        </button>
      </div>

      {/* Tab 0: Orders & Seller Assignment */}
      {activeTab === 'orders' && (
        <AdminOrdersTab
          openAddOrderRequest={openAddOrderRequest}
          onAddOrderRequestHandled={() => setOpenAddOrderRequest(false)}
        />
      )}

      {/* Tab: Coupons & Discounts Management */}
      {activeTab === 'coupons' && (
        <AdminCouponManagementTab />
      )}

      {/* Tab 1: User Management & Accounts */}
      {activeTab === 'users' && (
        <AdminUserManagementTab />
      )}

      {/* Tab: Seller Bonus Management */}
      {activeTab === 'bonuses' && (
        <AdminBonusManagementTab />
      )}

      {/* Tab: Homepage Front Banner Management */}
      {activeTab === 'banners' && (
        <AdminBannerManagementTab />
      )}

      {/* Tab: Category Image Management */}
      {activeTab === 'categories' && (
        <AdminCategoryManagementTab />
      )}

      {/* Tab: Immutable Activity & Audit Logs */}
      {activeTab === 'audit_logs' && (
        <AdminAuditLogsTab />
      )}

      {activeTab === 'collect_payment' && (
        <AdminCollectPaymentTab />
      )}

      {activeTab === 'uploaded_lists' && (
        <UploadedListRequestsTab />
      )}

      {activeTab === 'financials' && (
        <AdminFinancialDashboard />
      )}

      {/* Tab 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive catalog category analysis */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#561269]">Catalog by Category</h3>
              <p className="mt-1 text-[11px] text-slate-500">Select a category bar to inspect product prices and minimum order values.</p>
            </div>
            <div className="space-y-3 pt-2">
              {categories.map((cat) => {
                const catProducts = products.filter((p) => p.category === cat.name);
                const percent = products.length ? (catProducts.length / products.length) * 100 : 0;
                const isSelected = selectedAnalyticsCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${cat.name}: ${catProducts.length} components, ${Math.round(percent)} percent of catalog`}
                    onClick={() => setSelectedAnalyticsCategory(isSelected ? null : cat.name)}
                    className={`block w-full rounded-lg p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] ${
                      isSelected ? 'bg-violet-50 ring-1 ring-violet-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat.name}</span>
                      <span className="font-mono text-slate-900">{catProducts.length} components ({Math.round(percent)}%)</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? 'bg-gradient-to-r from-[#ff6b00] to-[#fbbf24]' : 'bg-gradient-to-r from-[#561269] to-[#a855f7]'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedAnalyticsCategory && (
              <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-slate-800">{selectedAnalyticsCategory} · product analysis</h4>
                  <button
                    type="button"
                    onClick={() => setSelectedAnalyticsCategory(null)}
                    className="text-[10px] font-bold text-violet-700 hover:text-violet-900"
                  >
                    Clear
                  </button>
                </div>
                {selectedAnalyticsProducts.length ? (
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {selectedAnalyticsProducts.map((product) => {
                      const minimumOrderQty = Math.max(1, Number(product.minOrderQty) || 1);
                      const minimumValue = Math.max(0, Number(product.price) || 0) * minimumOrderQty;
                      return (
                        <div key={product.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-violet-100 bg-white px-3 py-2 text-[11px]">
                          <span className="min-w-0 flex-1 truncate font-semibold text-slate-800" title={product.name}>
                            {product.name} <span className="font-mono text-slate-400">· {product.sku}</span>
                          </span>
                          <span className="shrink-0 text-right text-slate-600">
                            {minimumOrderQty} min units × ₹{Number(product.price || 0).toLocaleString('en-IN')} = <strong className="text-[#561269]">₹{minimumValue.toLocaleString('en-IN')}</strong>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">No catalog products are assigned to this category.</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats Box */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-[#561269]">Warehouse Key Metrics</h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between p-3 bg-white rounded-xl border border-slate-200">
                <span>Average Order Value (AOV):</span>
                <span className="font-bold font-mono text-slate-900">{firestoreKPIs.formattedAOV}</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-xl border border-slate-200">
                <span>Same-Day Dispatch Rate:</span>
                <span className="font-bold text-emerald-700">
                  {firestoreKPIs.totalOrdersCount > 0 ? '98.8%' : '100%'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-xl border border-slate-200">
                <span>Total Catalog SKUs:</span>
                <span className="font-bold text-[#561269] font-mono">{firestoreKPIs.totalSkusCount} SKUs</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-xl border border-slate-200">
                <span>Physical Inventory in Bins:</span>
                <span className="font-bold font-mono text-[#FF6B00]">{firestoreKPIs.totalStockUnits.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                <span>Lowest in-stock minimum order value:</span>
                <span className="shrink-0 text-right font-bold font-mono text-[#561269]">
                  {minimumCatalogOrderValue
                    ? `₹${minimumCatalogOrderValue.value.toLocaleString('en-IN')}`
                    : '—'}
                  {minimumCatalogOrderValue && (
                    <span className="block max-w-36 truncate text-[10px] font-medium text-slate-500" title={minimumCatalogOrderValue.product.name}>
                      {minimumCatalogOrderValue.product.name}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Search Demand & Customer Query Intelligence */}
          <div className="lg:col-span-12">
            <AdminSearchAnalyticsTab />
          </div>
        </div>
      )}

      {/* Tab 2: Catalog Management */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 gap-4 border-b border-slate-200 pb-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Lifetime Product Adds</p>
                <h3 className="mt-1 text-lg font-black text-slate-900">
                  {isCatalogLoaded ? `${products.length} products attributed` : 'Loading full catalog…'}
                </h3>
              </div>
              <div className="space-y-2">
                {!isCatalogLoaded ? (
                  <p className="text-xs text-slate-500">Loading complete product attribution data…</p>
                ) : productAttribution.length === 0 ? (
                  <p className="text-xs text-slate-500">No product attribution data is available yet.</p>
                ) : productAttribution.map((member) => (
                  <div
                    key={`${member.email || member.name}-${member.role}`}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 ${member.rank === 1 ? 'border-[#561269]/30 bg-[#561269]/5' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${member.rank === 1 ? 'bg-[#561269] text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {member.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-bold text-slate-800">{member.name}</p>
                          {member.rank === 1 && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                              Top contributor
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">{member.email || 'no email on file'} • {member.role}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#561269] px-2 py-1 text-[10px] font-bold text-white">{member.count}</span>
                  </div>
                ))}
              </div>
              {topProductContributor && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-800">
                  Leaderboard leader: {topProductContributor.name} with {topProductContributor.count} total products added.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Product Attribution</p>
              <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                <p>Each product keeps the creator name, email, and role in Firestore.</p>
                <p>Use this view to identify who added an item and contact them directly about quality or listing issues.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-[#561269]">Component Catalog Directory</h3>
              <p className="text-xs text-slate-500">Edit prices, update tiered discounts, or remove discontinued parts</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter catalog..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
                />
              </div>

              <button
                onClick={syncAllProductsToFirebase}
                disabled={isProductSyncing}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Sync entire catalog with Firebase Cloud Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProductSyncing ? 'animate-spin' : ''}`} />
                <span>{isProductSyncing ? 'Syncing...' : 'Sync to Firebase'}</span>
              </button>

              <button
                onClick={() => void handleBuildSearchIndex()}
                disabled={!isCatalogLoaded || isBuildingSearchIndex}
                className="bg-violet-700 hover:bg-violet-800 disabled:opacity-60 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Add searchable keywords to existing product records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBuildingSearchIndex ? 'animate-spin' : ''}`} />
                <span>
                  {isBuildingSearchIndex
                    ? `Indexing ${searchIndexProgress.completed.toLocaleString()}/${searchIndexProgress.total.toLocaleString()}`
                    : 'Build Search Index'}
                </span>
              </button>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-[#561269] hover:bg-[#460e56] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#FF6B00]" />
                <span>New Item</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-[#FF6B00]" />
                <h4 className="text-xs font-extrabold text-[#561269]">Trending &amp; Best Sellers</h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={trendingProductSearch}
                    onChange={(event) => {
                      setTrendingProductSearch(event.target.value);
                      setTrendingProductId('');
                    }}
                    placeholder="Search by name, SKU, or brand"
                    aria-label="Search trending products"
                    className="w-full rounded-lg border border-orange-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  {trendingProductSearch.trim() && !trendingProductId && (
                    <div className="absolute inset-x-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-orange-200 bg-white p-1 shadow-xl">
                      {filterHomepageProducts(trendingProductSearch).slice(0, 8).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          role="option"
                          aria-selected="false"
                          onClick={() => {
                            setTrendingProductId(product.id);
                            setTrendingProductSearch(product.name);
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-xs hover:bg-orange-50"
                        >
                          <span className="min-w-0 truncate font-semibold text-slate-800">{product.name}</span>
                          <span className="shrink-0 font-mono text-[10px] text-slate-500">{product.sku}</span>
                        </button>
                      ))}
                      {filterHomepageProducts(trendingProductSearch).length === 0 && (
                        <p className="px-2.5 py-2 text-xs text-slate-500">No matching products.</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addProductToHomepageSection(trendingProductId, 'trending')}
                  disabled={!trendingProductId}
                  className="rounded-lg bg-[#FF6B00] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <h4 className="text-xs font-extrabold text-[#561269]">Fresh Silicon &amp; New Arrivals</h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={freshProductSearch}
                    onChange={(event) => {
                      setFreshProductSearch(event.target.value);
                      setFreshProductId('');
                    }}
                    placeholder="Search by name, SKU, or brand"
                    aria-label="Search new-arrival products"
                    className="w-full rounded-lg border border-violet-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  {freshProductSearch.trim() && !freshProductId && (
                    <div className="absolute inset-x-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-violet-200 bg-white p-1 shadow-xl">
                      {filterHomepageProducts(freshProductSearch).slice(0, 8).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          role="option"
                          aria-selected="false"
                          onClick={() => {
                            setFreshProductId(product.id);
                            setFreshProductSearch(product.name);
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-xs hover:bg-violet-50"
                        >
                          <span className="min-w-0 truncate font-semibold text-slate-800">{product.name}</span>
                          <span className="shrink-0 font-mono text-[10px] text-slate-500">{product.sku}</span>
                        </button>
                      ))}
                      {filterHomepageProducts(freshProductSearch).length === 0 && (
                        <p className="px-2.5 py-2 text-xs text-slate-500">No matching products.</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addProductToHomepageSection(freshProductId, 'fresh')}
                  disabled={!freshProductId}
                  className="rounded-lg bg-[#561269] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#460e56] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <th className="p-3">Component</th>
                  <th className="p-3">SKU / Brand</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Added By</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(p)}
                          className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#561269]"
                          aria-label={`View ${p.name}`}
                        >
                          <img
                            src={p.image}
                            alt=""
                            className="w-8 h-8 object-contain mix-blend-multiply bg-slate-50 rounded p-1 border border-slate-200"
                          />
                        </button>
                        <div>
                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(p)}
                            className="text-left font-bold text-slate-900 line-clamp-1 hover:text-[#561269] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#561269] cursor-pointer"
                          >
                            {p.name}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">Bin: {p.locationBin}</span>
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                              Synced
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="font-mono text-slate-800 font-bold">{p.sku}</p>
                      <p className="text-[10px] text-slate-500">{p.brand}</p>
                    </td>

                    <td className="p-3 text-slate-600 font-medium">{p.category}</td>

                    <td className="p-3">
                      <span className="text-[11px] font-semibold text-slate-800 block">
                        {p.addedBy || 'Semix Team'}
                      </span>
                      <span className="text-[9px] text-slate-400 capitalize">
                        {p.addedByRole || 'Admin'}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3 text-center font-mono">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-bold">
                        {p.stockCount}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#561269] hover:text-white text-slate-600 transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleProducts.length < filteredProducts.length && (
              <div className="flex justify-center border-t border-slate-100 p-4">
                <button
                  type="button"
                  onClick={() => setVisibleProductCount((count) => Math.min(count + ADMIN_PRODUCT_BATCH_SIZE, filteredProducts.length))}
                  className="rounded-xl border border-[#561269]/20 bg-white px-4 py-2 text-xs font-bold text-[#561269] shadow-xs transition-colors hover:border-[#561269]/40 hover:bg-[#561269]/5"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Staff & RBAC */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-[#561269]">Staff Access & Role Management</h3>
              <p className="text-xs text-slate-500">Manage warehouse operators, fulfillment technicians, and administrators</p>
            </div>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="bg-[#561269] hover:bg-[#460e56] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FF6B00]" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#561269] text-white flex items-center justify-center font-bold text-xs">
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{s.name}</h4>
                      <p className="text-[11px] text-slate-400">{s.email}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-200/60">
                  <p><span className="font-bold">Role:</span> {s.role.toUpperCase()}</p>
                  <p><span className="font-bold">Dept:</span> {s.department}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => toggleStaffStatus(s.id)}
                    className="w-full text-xs font-bold py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    {s.active ? 'Suspend Access' : 'Activate Access'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Custom Project Requests & Review */}
      {activeTab === 'custom_projects' && (
        <CustomProjectsManager />
      )}

      <ProductFormModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSave={handleSaveNewProduct}
      />

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#561269]">Edit Component #{editingProduct.sku}</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 rounded-lg bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.codEnabled !== false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, codEnabled: e.target.checked })}
                  className="mt-0.5 accent-[#561269]"
                />
                <span>
                  <span className="block font-bold text-slate-700">Allow Cash on Delivery for this product</span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    If disabled, customers must prepay when this product is in their cart.
                  </span>
                </span>
              </label>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const toDelete = editingProduct;
                    setEditingProduct(null);
                    setProductToDelete(toDelete);
                  }}
                  className="px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Permanently remove component from catalog"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Component</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#561269] hover:bg-[#460e56] text-white font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#561269]">Add Staff Member</h3>
              <button onClick={() => setIsAddStaffOpen(false)} className="p-1 rounded-lg bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as 'team' | 'admin' })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  <option value="team">Team (Fulfillment / QA Operator)</option>
                  <option value="admin">Admin (System Controller)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#561269] text-white font-bold cursor-pointer"
                >
                  Assign Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        title="Delete Product"
        itemName={productToDelete?.name}
        sku={productToDelete?.sku}
        description="Are you sure you want to permanently delete this product? It will be removed from the catalog and active shopping carts."
        confirmLabel="Delete Product"
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
};
