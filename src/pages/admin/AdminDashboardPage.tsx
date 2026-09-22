import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, StaffMember } from '../../types';
import { SemixLabsLogo } from '../../components/common/SemixLabsLogo';
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
  Sliders, 
  BarChart3,
  Cpu,
  Store,
  RefreshCw,
  Cloud,
  CheckCircle2,
  ChevronDown,
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
import { useFirestoreAdminKPIs } from '../../hooks/useFirestoreAdminKPIs';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import { EmailPreviewModal } from '../../components/common/EmailPreviewModal';
import { getLocalSentEmails } from '../../services/emailService';
import { Tag, Mail, SlidersHorizontal, FolderTree, Image as ImageIcon, Award, ShieldAlert } from 'lucide-react';
import { CATEGORIES } from '../../mockData/products';
import { generateProductDescription } from '../../services/aiService';
import { getProductPriceBreakdown } from '../../utils/pricing';

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
    deleteProduct, 
    isProductSyncing,
    syncAllProductsToFirebase,
    addStaff, 
    toggleStaffStatus, 
    customProjects,
    adminNotifications,
    showToast,
    isFirebaseLive
  } = useApp();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const pendingOrdersCount = orders.filter(
    (o) => !o.assignedSellerId || o.status === 'pending_assignment'
  ).length;

  const [activeTab, setActiveTab] = useState<'orders' | 'coupons' | 'users' | 'bonuses' | 'banners' | 'categories' | 'audit_logs' | 'analytics' | 'catalog' | 'staff' | 'custom_projects'>(() => {
    return pendingOrdersCount > 0 ? 'orders' : 'orders';
  });
  const [productSearch, setProductSearch] = useState('');
  const [visibleProductCount, setVisibleProductCount] = useState(ADMIN_PRODUCT_BATCH_SIZE);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [trendingProductId, setTrendingProductId] = useState('');
  const [freshProductId, setFreshProductId] = useState('');
  const [trendingProductSearch, setTrendingProductSearch] = useState('');
  const [freshProductSearch, setFreshProductSearch] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    sku: '',
    brand: 'SEMIX LABS',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontrollers',
    semixPrice: 399,
    price: 499,
    originalPrice: 650,
    stockCount: 50,
    minOrderQty: 1,
    shortDescription: '',
    description: '',
    voltage: '5V & 3.3V',
    locationBin: 'BIN-A05',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'],
    tags: ['electronics', 'iot'],
    rating: 4.8,
    reviewCount: 1,
    inStock: true
  });

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
  const firestoreKPIs = useFirestoreAdminKPIs(orders, products);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [adminSectionsOpen, setAdminSectionsOpen] = useState(false);
  const sentEmailsList = getLocalSentEmails();

  const handleSaveNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name?.trim() || !newProduct.sku?.trim() || !newProduct.category?.trim()) {
      showToast('Validation Error', 'Name, SKU, and category are required.', 'error');
      return;
    }

    const semixEntryPrice = Number(newProduct.semixPrice ?? newProduct.price ?? 299);
    const calculatedPrice = getProductPriceBreakdown(semixEntryPrice);

    const fullProduct: Omit<Product, 'id'> = {
      name: newProduct.name!,
      sku: newProduct.sku!.toUpperCase(),
      brand: newProduct.brand || 'SEMIX LABS',
      category: newProduct.category || 'Electronic Modules and Development Boards',
      subcategory: newProduct.subcategory || 'Microcontrollers',
      semixPrice: semixEntryPrice,
      price: Number(newProduct.price) || calculatedPrice.sellingPrice,
      originalPrice: Number(newProduct.originalPrice) || calculatedPrice.mrp,
      stockCount: Number(newProduct.stockCount) || 25,
      minOrderQty: 1,
      inStock: (Number(newProduct.stockCount) || 0) > 0,
      image: newProduct.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      images: [newProduct.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'],
      shortDescription: newProduct.shortDescription || 'High-performance engineering silicon module.',
      description: newProduct.description || 'Full technical specifications and reference design available in attached datasheet.',
      rating: 4.9,
      reviewCount: 4,
      locationBin: newProduct.locationBin || 'BIN-A01',
      voltage: newProduct.voltage || '3.3V / 5V',
      tags: ['electronics', 'hardware'],
      specifications: [
        { name: 'Supply Voltage', value: newProduct.voltage || '5V DC' },
        { name: 'Package', value: 'SMD / Breakout' }
      ],
      bulkTiers: [
        { minQty: 1, unitPrice: Number(newProduct.price) || 299, discountPercent: 0 },
        { minQty: 5, unitPrice: Math.round((Number(newProduct.price) || 299) * 0.95), discountPercent: 5 },
        { minQty: 25, unitPrice: Math.round((Number(newProduct.price) || 299) * 0.88), discountPercent: 12 }
      ]
    };

    try {
      await addProduct(fullProduct);
      setIsAddProductOpen(false);
    } catch (error) {
      console.error('[Admin] Product creation failed:', error);
      showToast('Product Save Failed', 'Firestore rejected the product. Check your account permissions and try again.', 'error');
    }
  };

  const handleGenerateDescription = async () => {
    const productName = newProduct.name?.trim() || '';
    const productCategory = newProduct.category?.trim() || '';
    if (!productName || !productCategory) {
      showToast('Product Name and Category Required', 'Enter both fields before generating a description.', 'warning');
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const description = await generateProductDescription(productName, productCategory);
      setNewProduct((current) => ({ ...current, description }));
      showToast('Description Generated', 'Review and edit the description before saving.', 'success');
    } catch (error) {
      showToast('AI Description Failed', error instanceof Error ? error.message : 'Please try again.', 'error');
    } finally {
      setIsGeneratingDescription(false);
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
        value.toLowerCase().includes(normalizedQuery)
      )
    );
  };

  const addProductToHomepageSection = async (productId: string, section: 'trending' | 'fresh') => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    try {
      await updateProduct({
        ...product,
        ...(section === 'trending' ? { isBestSeller: true } : { isNew: true }),
      });
      showToast(
        section === 'trending' ? 'Added to Trending' : 'Added to Fresh Silicon',
        `${product.name} will now appear on the homepage section.`,
        'success'
      );
      if (section === 'trending') {
        setTrendingProductId('');
        setTrendingProductSearch('');
      } else {
        setFreshProductId('');
        setFreshProductSearch('');
      }
    } catch (error) {
      console.error('[Admin] Homepage section assignment failed:', error);
      showToast('Assignment Failed', 'Could not update the product in Firestore.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#561269] via-[#380847] to-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg border border-[#561269]/30">
        <div className="flex items-center gap-4">
          <SemixLabsLogo variant="icon" size="lg" className="h-12 w-12 bg-white/10 p-1.5 rounded-xl border border-white/10 hidden sm:block shrink-0" />
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FF6B00] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Master Administration Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              SEMIX LABS Platform Controller
            </h1>
            <p className="text-xs text-purple-200 mt-0.5">
              Full control over silicon catalogs, revenue analytics, staff RBAC permissions, and store config
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/10 rounded-xl border border-white/15 text-xs text-white/90">
            <Cloud className={`w-4 h-4 ${isFirebaseLive ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="font-semibold">{isFirebaseLive ? 'Cloud Firestore Live' : 'Offline State'}</span>
          </div>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="bg-white/15 hover:bg-white/25 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-white/20 shadow-xs cursor-pointer transition-all"
            title="View Automated Customer, Seller & Admin Transactional Emails"
          >
            <Mail className="w-4 h-4 text-purple-200" />
            <span>Emails</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-400 text-slate-950">
              {sentEmailsList.length}
            </span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-[#FF6B00] hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Component</span>
          </button>
        </div>
      </div>

      {/* Real-time Dynamic Firestore KPI Cards Row */}
      <AdminKpiCardsRow
        kpis={firestoreKPIs}
        onNavigateToOrders={() => setActiveTab('orders')}
        onNavigateToCatalog={() => setActiveTab('catalog')}
      />

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-purple-50 p-2 shadow-sm">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-500">Admin Sections</p>
          <p className="truncate text-sm font-black text-slate-800">
            {activeTab === 'orders' ? 'Orders & Seller Assignment' :
              activeTab === 'coupons' ? 'Coupons & Discounts' :
              activeTab === 'users' ? 'User Management' :
              activeTab === 'bonuses' ? 'Sellers → Bonuses' :
              activeTab === 'banners' ? 'Homepage Banners' :
              activeTab === 'categories' ? 'Category Images' :
              activeTab === 'audit_logs' ? 'Audit & Activity Logs' :
              activeTab === 'analytics' ? 'Analytics & Sales Breakdown' :
              activeTab === 'catalog' ? 'Catalog & Product Management' :
              activeTab === 'staff' ? 'Staff & Role Access' : 'Custom Project Requests'}
          </p>
        </div>
        <div className="relative shrink-0">
          <button
            type="button"
            aria-expanded={adminSectionsOpen}
            aria-label="Open admin section"
            onClick={() => setAdminSectionsOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg border border-violet-300 bg-[#561269] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-violet-950/20 transition-colors hover:bg-[#6c1a80] focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <span>Open Section</span>
            <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-extrabold">
              {activeTab === 'orders' ? 'Orders' :
                activeTab === 'coupons' ? 'Coupons' :
                activeTab === 'users' ? 'Users' :
                activeTab === 'bonuses' ? 'Bonuses' :
                activeTab === 'banners' ? 'Banners' :
                activeTab === 'categories' ? 'Categories' :
                activeTab === 'audit_logs' ? 'Audit' :
                activeTab === 'analytics' ? 'Analytics' :
                activeTab === 'catalog' ? 'Catalog' :
                activeTab === 'staff' ? 'Staff' : 'Projects'}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-violet-200 transition-transform ${adminSectionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {adminSectionsOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-violet-200 bg-white p-1.5 shadow-xl shadow-violet-950/20">
              {[
                ['orders', 'Orders & Seller Assignment'],
                ['coupons', 'Coupons & Discounts'],
                ['users', 'User Management'],
                ['bonuses', 'Sellers → Bonuses'],
                ['banners', 'Homepage Banners'],
                ['categories', 'Category Images'],
                ['audit_logs', 'Audit & Activity Logs'],
                ['analytics', 'Analytics & Sales Breakdown'],
                ['catalog', 'Catalog & Product Management'],
                ['staff', 'Staff & Role Access'],
                ['custom_projects', 'Custom Project Requests'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setActiveTab(value as typeof activeTab);
                    setAdminSectionsOpen(false);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors ${
                    activeTab === value
                      ? 'bg-violet-100 text-[#561269]'
                      : 'text-slate-700 hover:bg-violet-50 hover:text-[#561269]'
                  }`}
                >
                  {label}
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
        <AdminOrdersTab />
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

      {/* Tab 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Revenue by Category Chart Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#561269]">Category Revenue Volume</h3>
            <div className="space-y-3 pt-2">
              {categories.map((cat) => {
                const catProducts = products.filter((p) => p.category === cat.name);
                const percent = Math.min(100, Math.max(15, (catProducts.length / products.length) * 100));
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat.name}</span>
                      <span className="font-mono text-slate-900">{catProducts.length} components ({Math.round(percent)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#561269] to-[#FF6B00] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-[#561269]">Component Catalog Directory</h3>
              <p className="text-xs text-slate-500">Edit prices, update tiered discounts, or remove discontinued parts</p>
            </div>

            <div className="flex items-center gap-3">
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
                    onChange={(event) => setTrendingProductSearch(event.target.value)}
                    placeholder="Search by name, SKU, or brand"
                    aria-label="Search trending products"
                    className="w-full rounded-lg border border-orange-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={trendingProductId}
                  onChange={(event) => setTrendingProductId(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-medium text-slate-800"
                >
                  <option value="">Select an existing product</option>
                  {filterHomepageProducts(trendingProductSearch).map((product) => (
                    <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>
                  ))}
                </select>
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
                    onChange={(event) => setFreshProductSearch(event.target.value)}
                    placeholder="Search by name, SKU, or brand"
                    aria-label="Search new-arrival products"
                    className="w-full rounded-lg border border-violet-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={freshProductId}
                  onChange={(event) => setFreshProductId(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-medium text-slate-800"
                >
                  <option value="">Select an existing product</option>
                  {filterHomepageProducts(freshProductSearch).map((product) => (
                    <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>
                  ))}
                </select>
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
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-8 h-8 object-contain mix-blend-multiply bg-slate-50 rounded p-1 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
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

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#561269]">Add New Electronic Component</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1 rounded-lg bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Component Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raspberry Pi Pico 2 W"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RPI-PICO-2W"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                    className="w-full h-10 appearance-auto bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="" disabled>Select a category</option>
                    {(categories.length > 0 ? categories : CATEGORIES).map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturer Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operating Logic Voltage</label>
                  <input
                    type="text"
                    value={newProduct.voltage}
                    onChange={(e) => setNewProduct({ ...newProduct, voltage: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Warehouse Bin</label>
                  <input
                    type="text"
                    value={newProduct.locationBin}
                    onChange={(e) => setNewProduct({ ...newProduct, locationBin: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={newProduct.shortDescription}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  placeholder="Summary for catalog card"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <label className="block font-bold text-slate-700">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#561269]/30 bg-purple-50 px-2.5 py-1.5 text-[11px] font-bold text-[#561269] transition-colors hover:bg-purple-100 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Sparkles className={`h-3.5 w-3.5 text-[#FF6B00] ${isGeneratingDescription ? 'animate-pulse' : ''}`} />
                    {isGeneratingDescription ? 'Generating...' : 'Generate AI Description'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  placeholder="Professional product description"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#FF6B00] text-white font-bold cursor-pointer"
                >
                  Publish Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Email Preview and Verification Center */}
      <EmailPreviewModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};
