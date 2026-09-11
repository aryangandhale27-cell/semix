import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Order, Product, EscalationIssue, OrderStatus, EscalationType, EscalationPriority } from '../../types';
import { ProductFormModal } from '../../components/team/ProductFormModal';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import { 
  PackageCheck, 
  Boxes, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  Search, 
  Printer, 
  ChevronRight, 
  Minus,
  Plus,
  Edit,
  Trash2,
  Filter,
  CheckSquare,
  Square,
  Send,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';

export const TeamPortalPage: React.FC = () => {
  const { 
    orders, 
    products, 
    escalations, 
    updateOrderStatus, 
    updateProductStock, 
    updateProduct,
    addProduct,
    deleteProduct,
    isProductSyncing,
    syncAllProductsToFirebase,
    reportEscalation,
    resolveEscalation, 
    categories,
    showToast 
  } = useApp();

  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Active Main Tab: 'stock' | 'fulfillment' | 'issues'
  const [activeTab, setActiveTab] = useState<'stock' | 'fulfillment' | 'issues'>(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'fulfillment' || location.pathname.includes('/fulfillment')) return 'fulfillment';
    if (tabParam === 'issues') return 'issues';
    return 'stock';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'fulfillment' || location.pathname.includes('/fulfillment')) {
      setActiveTab('fulfillment');
    } else if (tabParam === 'issues') {
      setActiveTab('issues');
    } else if (tabParam === 'stock') {
      setActiveTab('stock');
    }
  }, [location.pathname, searchParams]);

  // ==================== 1. STOCK MANAGEMENT STATE ====================
  const [stockSearch, setStockSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  
  // Product Modal (Add / Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string; sku?: string } | null>(null);

  // Inline Stock Editing state: { [productId]: number | null }
  const [inlineEditingStockId, setInlineEditingStockId] = useState<string | null>(null);
  const [inlineStockValue, setInlineStockValue] = useState<number>(0);

  // ==================== 2. FULFILLMENT DESK STATE ====================
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'placed' | 'packed' | 'shipped'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  
  // Component Checklist: { [orderId]: { [productId]: boolean } }
  const [checkedComponents, setCheckedComponents] = useState<Record<string, Record<string, boolean>>>(() => {
    // Default initial checked items for demo orders that are already packed or shipped
    const initialChecked: Record<string, Record<string, boolean>> = {};
    orders.forEach((ord) => {
      initialChecked[ord.id] = {};
      ord.items.forEach((item) => {
        initialChecked[ord.id][item.productId] = ord.status === 'packed' || ord.status === 'shipped' || ord.status === 'delivered';
      });
    });
    return initialChecked;
  });

  const [courierName, setCourierName] = useState('Blue Dart Express Air');
  const [courierTrackingId, setCourierTrackingId] = useState('');
  const [packingTechnicianNote, setPackingTechnicianNote] = useState('');
  const [printModalOrder, setPrintModalOrder] = useState<Order | null>(null);

  // ==================== 3. ISSUE ESCALATION STATE ====================
  const [issueType, setIssueType] = useState<EscalationType>('damaged_stock');
  const [issueProductId, setIssueProductId] = useState<string>(products[0]?.id || '');
  const [issueQuantity, setIssueQuantity] = useState<number>(1);
  const [issuePriority, setIssuePriority] = useState<EscalationPriority>('high');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueOrderId, setIssueOrderId] = useState('');
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // ----------------- DERIVED STATS (Today's Overview) -----------------
  const stats = useMemo(() => {
    const totalInventoryItems = products.length;
    const lowStockItems = products.filter((p) => p.stockCount <= 20).length;
    const ordersToPack = orders.filter((o) => o.status === 'placed').length;
    const packedToday = orders.filter((o) => o.status === 'packed').length;
    const shippedToday = orders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length;
    return { totalInventoryItems, lowStockItems, ordersToPack, packedToday, shippedToday };
  }, [products, orders]);

  // Filtered Products for Inventory Table
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategoryFilter !== 'All' && prod.category !== selectedCategoryFilter) {
        return false;
      }
      // Stock status filter
      if (stockStatusFilter === 'in_stock' && prod.stockCount <= 20) return false;
      if (stockStatusFilter === 'low_stock' && (prod.stockCount === 0 || prod.stockCount > 20)) return false;
      if (stockStatusFilter === 'out_of_stock' && prod.stockCount > 0) return false;
      // Search
      if (stockSearch.trim()) {
        const q = stockSearch.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesSku = prod.sku.toLowerCase().includes(q);
        const matchesBin = prod.locationBin?.toLowerCase().includes(q);
        const matchesBrand = prod.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBin && !matchesBrand) return false;
      }
      return true;
    });
  }, [products, selectedCategoryFilter, stockStatusFilter, stockSearch]);

  // Filtered Orders for Packing Queue
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (fulfillmentFilter !== 'all' && ord.status !== fulfillmentFilter) {
        return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesId = ord.id.toLowerCase().includes(q);
        const matchesCust = ord.customer.fullName.toLowerCase().includes(q);
        const matchesCity = ord.customer.city.toLowerCase().includes(q);
        if (!matchesId && !matchesCust && !matchesCity) return false;
      }
      return true;
    });
  }, [orders, fulfillmentFilter, orderSearch]);

  // Selected active order in packing desk
  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || orders[0] || null;
  }, [orders, selectedOrderId, filteredOrders]);

  // ----------------- HANDLERS -----------------

  // Inline stock editor
  const handleStartInlineEdit = (prod: Product) => {
    setInlineEditingStockId(prod.id);
    setInlineStockValue(prod.stockCount);
  };

  const handleSaveInlineStock = (productId: string) => {
    const validStock = Math.max(0, Math.floor(inlineStockValue));
    updateProductStock(productId, validStock);
    setInlineEditingStockId(null);
  };

  // Product modal save
  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProductConfirm = (productId: string, name: string, sku?: string) => {
    setProductToDelete({ id: productId, name, sku });
  };

  // Component Checklist toggle
  const handleToggleChecklistItem = (orderId: string, productId: string) => {
    setCheckedComponents((prev) => {
      const orderChecks = prev[orderId] || {};
      const currentVal = !!orderChecks[productId];
      return {
        ...prev,
        [orderId]: {
          ...orderChecks,
          [productId]: !currentVal
        }
      };
    });
  };

  // Validation: Check if all items in selected order are verified
  const isOrderFullyChecked = (order: Order): boolean => {
    const orderChecks = checkedComponents[order.id] || {};
    return order.items.every((item) => !!orderChecks[item.productId]);
  };

  // Advance Order to Packed
  const handleMarkAsPacked = (order: Order) => {
    if (!isOrderFullyChecked(order)) {
      showToast('Component Verification Required', 'Please verify and check off all components in the checklist before marking as packed', 'warning');
      return;
    }

    const note = packingTechnicianNote.trim() || 'ESD Anti-Static inspection verified. Components boxed into tamper-evident carton.';
    updateOrderStatus(order.id, 'packed', note, 'Rajesh Kumar (Senior Packing Lead)', {
      courier: courierName,
      courierTrackingId: courierTrackingId || undefined,
      packedBy: 'Rajesh Kumar'
    });

    setPackingTechnicianNote('');
  };

  // Advance Order to Shipped
  const handleMarkAsShipped = (order: Order) => {
    const tracking = courierTrackingId.trim() || `BD-BLR-${Math.floor(100000 + Math.random() * 900000)}`;
    const note = `Handed over to ${courierName}. Airway Bill / Tracking: ${tracking}`;
    
    updateOrderStatus(order.id, 'shipped', note, 'Logistics Dispatch Desk', {
      courier: courierName,
      courierTrackingId: tracking,
      packedBy: order.packedBy || 'Rajesh Kumar'
    });

    setCourierTrackingId('');
  };

  // Advance Order to Delivered
  const handleMarkAsDelivered = (order: Order) => {
    updateOrderStatus(order.id, 'delivered', 'Shipment successfully handed over to customer and verified.', 'Courier Delivery Agent');
  };

  // Submit Issue Report
  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      showToast('Description Required', 'Please provide details about the reported issue', 'error');
      return;
    }

    const matchedProd = products.find((p) => p.id === issueProductId);

    reportEscalation({
      reportedBy: 'Team Operations (BLR-BAY-03)',
      productId: issueProductId || undefined,
      productName: matchedProd ? matchedProd.name : 'General Inventory',
      affectedQuantity: issueQuantity > 0 ? issueQuantity : 1,
      orderId: issueOrderId.trim() || undefined,
      type: issueType,
      priority: issuePriority,
      description: issueDescription.trim()
    });

    // Reset Form
    setIssueDescription('');
    setIssueQuantity(1);
    setIssueOrderId('');
  };

  // Resolve escalation
  const handleResolveTicket = (ticketId: string) => {
    if (!resolutionText.trim()) {
      showToast('Resolution Note Required', 'Please describe the engineering action or replacement note', 'warning');
      return;
    }
    resolveEscalation(ticketId, resolutionText.trim(), 'Rajesh Kumar (QA Lead)');
    setResolvingTicketId(null);
    setResolutionText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="team-dashboard-portal">
      {/* Header Banner - Concept: Team Dashboard (Inventory & Fulfillment Portal) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-slate-900 via-[#380847] to-[#561269] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-[#561269]/30/60"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FF6B00] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full mb-2 tracking-wider shadow-xs">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Team Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inventory &amp; Fulfillment Portal
          </h1>
          <p className="text-xs text-purple-200 mt-1 flex items-center gap-2 flex-wrap">
            <span>Operator: <strong>Rajesh Kumar</strong> (Senior Operations Lead)</span>
            <span>•</span>
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">Station: BLR-WH-BAY-03</span>
            <span>•</span>
            <span className="text-emerald-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Real-time Warehouse Sync Active
            </span>
          </p>
        </div>

        {/* Quick Action in Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddProduct}
            id="header-add-product-btn"
            className="bg-[#FF6B00] hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </motion.div>

      {/* TODAY'S OVERVIEW: Compact Statistics Cards (Requirement #13) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Inventory */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Inventory</span>
            <Boxes className="w-4 h-4 text-[#561269]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">{stats.totalInventoryItems}</span>
            <span className="text-[10px] font-semibold text-slate-400">SKU Lines</span>
          </div>
        </motion.div>

        {/* Low Stock Items */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock Alert</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 font-mono">{stats.lowStockItems}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">≤ 20 pcs</span>
          </div>
        </motion.div>

        {/* Orders to Pack */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-2xl border border-[#561269]/20/80 bg-[#561269]/5/20 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#561269] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Orders to Pack</span>
            <PackageCheck className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#561269] font-mono">{stats.ordersToPack}</span>
            <span className="text-[10px] font-bold text-[#561269] bg-[#561269]/10 px-1.5 py-0.5 rounded">Placed</span>
          </div>
        </motion.div>

        {/* Packed Today */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-2xl border border-cyan-200/80 bg-cyan-50/20 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-cyan-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Packed Today</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-cyan-700 font-mono">{stats.packedToday}</span>
            <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-1.5 py-0.5 rounded">Ready</span>
          </div>
        </motion.div>

        {/* Shipped Today */}
        <motion.div
          whileHover={{ y: -2 }}
          className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dispatched / Shipped</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 font-mono">{stats.shippedToday}</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">In Transit</span>
          </div>
        </motion.div>
      </div>

      {/* THREE MAJOR WORKSPACE TABS */}
      <div className="flex border-b border-slate-200 bg-slate-100/80 p-1.5 rounded-2xl gap-1.5 overflow-x-auto shadow-inner">
        <button
          onClick={() => setActiveTab('stock')}
          id="tab-stock-management"
          className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'stock'
              ? 'bg-[#561269] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Boxes className={`w-4 h-4 ${activeTab === 'stock' ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
          <span>1. Stock Management ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fulfillment')}
          id="tab-fulfillment-desk"
          className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'fulfillment'
              ? 'bg-[#561269] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Truck className={`w-4 h-4 ${activeTab === 'fulfillment' ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
          <span>2. Fulfillment &amp; Packing Desk ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          id="tab-issue-escalation"
          className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'issues'
              ? 'bg-[#561269] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${activeTab === 'issues' ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>3. Issue Escalation ({escalations.length})</span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: STOCK MANAGEMENT (Workspace, Table, Inline Editor, Add/Edit)
          ========================================================= */}
      {activeTab === 'stock' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Controls Bar: Search, Category Filter, Stock Status Filter, + Add Product */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by SKU, name, brand, or bin (e.g. RPI-5, BIN-A01)..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269]"
                />
                {stockSearch && (
                  <button
                    onClick={() => setStockSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white"
              >
                <option value="All">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Stock Status Filter */}
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock (&gt;20 pcs)</option>
                <option value="low_stock">Low Stock (1-20 pcs)</option>
                <option value="out_of_stock">Out of Stock (0 pcs)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={syncAllProductsToFirebase}
                disabled={isProductSyncing}
                id="sync-catalog-firebase-btn"
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                title="Upload and synchronize entire product catalog to Firebase Cloud Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProductSyncing ? 'animate-spin' : ''}`} />
                <span>{isProductSyncing ? 'Syncing...' : 'Sync to Firebase'}</span>
              </button>

              <button
                onClick={handleOpenAddProduct}
                id="add-product-action-btn"
                className="bg-[#561269] hover:bg-[#460e56] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#FF6B00]" />
                <span>+ Add Product</span>
              </button>
            </div>
          </div>

          {/* Real-time Style Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-[#561269] flex items-center gap-2">
                  <span>Hardware Inventory &amp; Stock Calibration Matrix</span>
                  <span className="text-xs font-normal text-slate-500">
                    (Showing {filteredProducts.length} of {products.length} components)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Firebase Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Products added or updated by team members are automatically saved to Firebase Firestore (<code className="font-mono text-slate-600">semix-ai-stdio/products</code>).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" id="inventory-table">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <th className="p-3.5">Component &amp; Visual</th>
                    <th className="p-3.5">Product SKU / ID</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Added By / Team</th>
                    <th className="p-3.5">Bin Location</th>
                    <th className="p-3.5 text-center">Available Stock</th>
                    <th className="p-3.5">Stock Status</th>
                    <th className="p-3.5">Price (₹)</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                        No products match your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => {
                      const isLow = prod.stockCount > 0 && prod.stockCount <= 20;
                      const isOut = prod.stockCount === 0;
                      const isInline = inlineEditingStockId === prod.id;

                      return (
                        <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Image & Name */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              </div>
                              <div className="max-w-xs">
                                <p className="font-bold text-slate-900 leading-snug line-clamp-2">
                                  {prod.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-[#561269] font-bold uppercase">
                                    {prod.brand}
                                  </span>
                                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    Synced
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {prod.sku}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="p-3.5 text-slate-600 font-medium max-w-[140px] truncate">
                            {prod.category}
                          </td>

                          {/* Added By / Attribution */}
                          <td className="p-3.5">
                            <div className="max-w-[130px]">
                              <span className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                                {prod.addedBy || 'Semix Team'}
                              </span>
                              <span className="text-[9px] text-slate-400 capitalize">
                                {prod.addedByRole || 'Tech Lead'}
                              </span>
                            </div>
                          </td>

                          {/* Location Bin */}
                          <td className="p-3.5">
                            <span className="bg-[#561269] text-white font-mono font-extrabold px-2.5 py-1 rounded-lg text-xs">
                              {prod.locationBin || 'BIN-A01'}
                            </span>
                          </td>

                          {/* Available Stock & INLINE STOCK EDITOR (Requirement #1) */}
                          <td className="p-3.5 text-center">
                            {isInline ? (
                              <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-[#561269]/30">
                                <input
                                  type="number"
                                  min="0"
                                  value={inlineStockValue}
                                  onChange={(e) => setInlineStockValue(Number(e.target.value))}
                                  className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-extrabold text-center text-slate-900"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveInlineStock(prod.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setInlineEditingStockId(null)}
                                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleStartInlineEdit(prod)}
                                  title="Click to edit stock inline"
                                  className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#561269]/5 hover:text-[#561269] border border-slate-200 transition-colors cursor-pointer"
                                >
                                  {prod.stockCount}
                                </button>

                                {/* Quick +/- Steppers */}
                                <div className="inline-flex items-center gap-0.5">
                                  <button
                                    onClick={() => updateProductStock(prod.id, Math.max(0, prod.stockCount - 1))}
                                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                                    title="Decrease by 1"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => updateProductStock(prod.id, prod.stockCount + 5)}
                                    className="px-1.5 py-0.5 rounded bg-[#561269]/5 hover:bg-[#561269]/10 text-[#561269] font-bold text-[10px] cursor-pointer"
                                    title="Add 5 units (+5)"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Stock Status Badge */}
                          <td className="p-3.5">
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                In Stock
                              </span>
                            )}
                          </td>

                          {/* Price */}
                          <td className="p-3.5 font-mono font-extrabold text-slate-900 text-xs">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="bg-[#561269]/5 hover:bg-[#561269] text-[#561269] hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit product specifications and images"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProductConfirm(prod.id, prod.name, prod.sku)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* =========================================================
          TAB 2: FULFILLMENT & PACKING DESK (Queue, Checklist, Status Lifecycle)
          ========================================================= */}
      {activeTab === 'fulfillment' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Packing Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setFulfillmentFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  fulfillmentFilter === 'all'
                    ? 'bg-[#561269] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setFulfillmentFilter('placed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  fulfillmentFilter === 'placed'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                To Pack ({orders.filter((o) => o.status === 'placed').length})
              </button>
              <button
                onClick={() => setFulfillmentFilter('packed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  fulfillmentFilter === 'packed'
                    ? 'bg-cyan-700 text-white shadow-xs'
                    : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
                }`}
              >
                Packed ({orders.filter((o) => o.status === 'packed').length})
              </button>
              <button
                onClick={() => setFulfillmentFilter('shipped')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  fulfillmentFilter === 'shipped'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                Shipped ({orders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length})
              </button>
            </div>

            {/* Order Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Order ID, Customer Name, or City..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Daily Packing Queue (Left Column) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
                  Daily Packing Queue ({filteredOrders.length})
                </h3>
                <span className="text-[11px] text-slate-400">Select order to inspect</span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  No orders found in this fulfillment queue.
                </div>
              ) : (
                <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                  {filteredOrders.map((ord) => {
                    const isSelected = selectedOrder?.id === ord.id;
                    const isFullyChecked = isOrderFullyChecked(ord);

                    return (
                      <motion.div
                        key={ord.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#561269] bg-[#561269]/5/50 shadow-md ring-2 ring-[#561269]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            {ord.id}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.status === 'packed'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status === 'placed' ? 'Order Placed' : ord.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-900 font-bold">{ord.customer.fullName}</p>
                        <p className="text-[11px] text-slate-500">
                          {ord.customer.city}, {ord.customer.state} • {ord.items.length} component line(s)
                        </p>

                        <div className="flex items-center justify-between text-xs pt-2.5 mt-2.5 border-t border-slate-100">
                          <span className="font-mono text-slate-900 font-extrabold">
                            ₹{ord.totalAmount.toLocaleString('en-IN')}
                          </span>

                          <span className={`text-[11px] font-bold flex items-center gap-1 ${
                            ord.status === 'placed' && isFullyChecked
                              ? 'text-emerald-600'
                              : 'text-[#561269]'
                          }`}>
                            {ord.status === 'placed' && isFullyChecked ? 'Ready to Pack ✓' : 'Inspect & Pack'} 
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Packing Desk & Component Checklist (Right Column) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {selectedOrder ? (
                <div className="space-y-6">
                  {/* Order Top Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-[#561269] bg-[#561269]/5 border border-[#561269]/20 px-2 py-0.5 rounded uppercase tracking-wider">
                          Active Packing Desk
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Date: {selectedOrder.createdAt.slice(0, 10)}
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                        Order #{selectedOrder.id}
                      </h2>
                      <p className="text-xs text-slate-600">
                        Customer: <strong className="text-slate-900">{selectedOrder.customer.fullName}</strong> ({selectedOrder.customer.city}, {selectedOrder.customer.state})
                      </p>
                    </div>

                    <button
                      onClick={() => setPrintModalOrder(selectedOrder)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-[#561269]" />
                      <span>Print ESD Dispatch Slip</span>
                    </button>
                  </div>

                  {/* Customer Packing Notes */}
                  {selectedOrder.packingNotes && (
                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Customer Packaging Instruction:</span>
                        <p>{selectedOrder.packingNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* COMPONENT CHECKLIST (Requirement #8) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-[#561269]" />
                          <span>Component Checklist &amp; Bin Pick Verification</span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Verify each component physical count &amp; bin location before packing.
                        </p>
                      </div>

                      {/* Checklist Progress Indicator */}
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        isOrderFullyChecked(selectedOrder)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {Object.values(checkedComponents[selectedOrder.id] || {}).filter(Boolean).length} / {selectedOrder.items.length} Checked
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                      {selectedOrder.items.map((item) => {
                        const matchedProd = products.find((p) => p.id === item.productId);
                        const binLocation = matchedProd?.locationBin || 'BIN-A01';
                        const isChecked = !!(checkedComponents[selectedOrder.id]?.[item.productId]);

                        return (
                          <div
                            key={item.productId}
                            onClick={() => handleToggleChecklistItem(selectedOrder.id, item.productId)}
                            className={`p-3.5 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                              isChecked ? 'bg-emerald-50/40' : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className="text-[#561269]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleChecklistItem(selectedOrder.id, item.productId);
                                }}
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                ) : (
                                  <Square className="w-5 h-5 text-slate-400" />
                                )}
                              </button>

                              <span className="bg-[#561269] text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg shrink-0">
                                {binLocation}
                              </span>

                              <div>
                                <p className={`font-bold ${isChecked ? 'text-slate-900 line-through opacity-80' : 'text-slate-900'}`}>
                                  {item.quantity} × {item.name}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono">
                                  SKU: {item.sku} • ₹{item.price} each
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                isChecked
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {isChecked ? 'Verified ✓' : `Pick ${item.quantity} pcs`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ORDER STATUS FLOW LIFECYCLE CONTROLS (Requirements #9, #10, #11) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#FF6B00]" />
                      <span>Fulfillment Status Pipeline</span>
                    </h4>

                    {/* Step 1: Placed -> Mark as Packed */}
                    {selectedOrder.status === 'placed' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Technician Packing Observation / Note
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Verified IC pin straightness, ESD shielded bags sealed."
                            value={packingTechnicianNote}
                            onChange={(e) => setPackingTechnicianNote(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMarkAsPacked(selectedOrder)}
                          disabled={!isOrderFullyChecked(selectedOrder)}
                          id="mark-as-packed-btn"
                          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                            isOrderFullyChecked(selectedOrder)
                              ? 'bg-cyan-700 hover:bg-cyan-800 text-white'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>
                            {isOrderFullyChecked(selectedOrder)
                              ? 'Mark as Packed (ESD QA Passed)'
                              : 'Check all components above to Mark as Packed'}
                          </span>
                        </motion.button>
                      </div>
                    )}

                    {/* Step 2: Packed -> Mark as Shipped */}
                    {selectedOrder.status === 'packed' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Carrier Partner</label>
                            <input
                              type="text"
                              value={courierName}
                              onChange={(e) => setCourierName(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Airway Bill / Tracking ID</label>
                            <input
                              type="text"
                              placeholder="e.g. BD-BLR-904128912"
                              value={courierTrackingId}
                              onChange={(e) => setCourierTrackingId(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMarkAsShipped(selectedOrder)}
                          id="mark-as-shipped-btn"
                          className="w-full bg-[#561269] hover:bg-[#460e56] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <Truck className="w-4 h-4 text-[#FF6B00]" />
                          <span>Mark as Shipped (Handover to Carrier)</span>
                        </motion.button>
                      </div>
                    )}

                    {/* Step 3: Shipped -> Delivered */}
                    {selectedOrder.status === 'shipped' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                          <p className="font-bold">Shipment in Transit with {selectedOrder.courier || courierName}</p>
                          <p className="font-mono text-[11px] text-purple-700">AWB: {selectedOrder.courierTrackingId || selectedOrder.trackingNumber}</p>
                        </div>

                        <button
                          onClick={() => handleMarkAsDelivered(selectedOrder)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Final Delivery (Mark as Delivered)</span>
                        </button>
                      </div>
                    )}

                    {/* Step 4: Delivered */}
                    {selectedOrder.status === 'delivered' && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold block text-sm">Order Fulfillment Completed</span>
                          <span className="text-emerald-700">This package has been successfully delivered and signed for by the customer.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-xs">Select an order from the daily queue.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* =========================================================
          TAB 3: ISSUE ESCALATION (Report an Issue Form & Recent Reports List)
          ========================================================= */}
      {activeTab === 'issues' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Section: Report an Issue (Requirement #14) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Admin Escalation Channel</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Report an Inventory / Fulfillment Issue
              </h3>
              <p className="text-xs text-slate-500">
                Submit damaged silicon batches, bin count discrepancies, or missing components directly to the Admin management queue.
              </p>
            </div>

            <form onSubmit={handleSubmitIssue} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Issue Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as EscalationType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                  >
                    <option value="damaged_stock">Damaged Stock</option>
                    <option value="count_discrepancy">Stock Count Discrepancy</option>
                    <option value="missing_product">Missing Product</option>
                    <option value="incorrect_info">Incorrect Product Information</option>
                    <option value="defective_batch">Defective Batch</option>
                    <option value="missing_label">Missing Label</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Relevant Product */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relevant Product <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={issueProductId}
                    onChange={(e) => setIssueProductId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Affected Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Affected Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={issueQuantity}
                    onChange={(e) => setIssueQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={issuePriority}
                    onChange={(e) => setIssuePriority(e.target.value as EscalationPriority)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical / Halting</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue Description &amp; Observation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the physical condition, batch lot number, or discrepancy observed during bin inspection..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="submit-issue-report-btn"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Report to Admin</span>
                </motion.button>
              </div>
            </form>
          </div>

          {/* Section: Recent Reports & Issue History (Requirement #15) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#561269]">
                  Recent Reports &amp; Escalation History ({escalations.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Track pending admin reviews, root-cause investigations, and logged resolutions.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {escalations.map((esc) => (
                <div
                  key={esc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        #{esc.id}
                      </span>
                      <span className="font-bold text-slate-800">
                        {esc.type.replace('_', ' ').toUpperCase()}
                      </span>
                      {esc.affectedQuantity && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({esc.affectedQuantity} units affected)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          esc.priority === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : esc.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {esc.priority}
                      </span>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          esc.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : esc.status === 'investigating'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {esc.status === 'open' ? 'Pending Admin Review' : esc.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg">
                    {esc.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 flex-wrap gap-2">
                    <span>Reported by: <strong>{esc.reportedBy}</strong> • {esc.createdAt.slice(0, 10)}</span>
                    {esc.productName && <span>Product: <strong>{esc.productName}</strong></span>}
                  </div>

                  {esc.resolutionNote && (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs text-emerald-800 mt-2">
                      <span className="font-bold block">Resolution Logged:</span>
                      {esc.resolutionNote}
                    </div>
                  )}

                  {/* Option for QA Lead to mark resolved if currently open */}
                  {esc.status !== 'resolved' && (
                    <div className="pt-2">
                      {resolvingTicketId === esc.id ? (
                        <div className="space-y-2 bg-[#561269]/5/50 p-3 rounded-xl border border-[#561269]/15">
                          <label className="block text-xs font-bold text-[#561269]">Resolution Note</label>
                          <textarea
                            rows={2}
                            placeholder="Enter RMA credit reference or physical bin restock details..."
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResolveTicket(esc.id)}
                              className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              Save Resolution
                            </button>
                            <button
                              onClick={() => setResolvingTicketId(null)}
                              className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setResolvingTicketId(esc.id);
                            setResolutionText('');
                          }}
                          className="text-[11px] font-bold text-[#561269] hover:underline cursor-pointer"
                        >
                          + Log Resolution Note
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* REUSABLE PRODUCT FORM MODAL (Add / Edit Product) */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        onSave={handleSaveProduct}
        onDelete={(id) => {
          deleteProduct(id);
          setEditingProduct(null);
          setProductModalOpen(false);
        }}
      />

      {/* PRINTABLE ESD DISPATCH SLIP MODAL */}
      {printModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#561269]">SEMIX LABS WAREHOUSE DISPATCH SLIP</h2>
                <p className="text-xs text-slate-500 font-mono">ESD QA Pass • Station: BLR-WH-BAY-03</p>
              </div>
              <span className="text-sm font-bold font-mono bg-slate-100 p-2 rounded text-slate-900">
                {printModalOrder.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase block">Ship To:</span>
                <p className="font-bold text-slate-900">{printModalOrder.customer.fullName}</p>
                <p className="text-slate-600">{printModalOrder.customer.street}</p>
                <p className="text-slate-600">{printModalOrder.customer.city}, {printModalOrder.customer.state} - {printModalOrder.customer.pincode}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-400 uppercase block">Carrier &amp; Tracking:</span>
                <p className="font-bold text-[#561269]">{printModalOrder.courier || courierName}</p>
                <p className="font-mono text-slate-700">{printModalOrder.courierTrackingId || printModalOrder.trackingNumber}</p>
              </div>
            </div>

            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">Bin</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Item Description</th>
                  <th className="p-2 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {printModalOrder.items.map((it, idx) => {
                  const prod = products.find((p) => p.id === it.productId);
                  return (
                    <tr key={idx}>
                      <td className="p-2 font-mono font-bold text-[#561269]">{prod?.locationBin || 'BIN-A01'}</td>
                      <td className="p-2 font-mono text-slate-600">{it.sku}</td>
                      <td className="p-2 font-medium text-slate-900">{it.name}</td>
                      <td className="p-2 text-right font-bold font-mono">{it.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-[11px] text-slate-400 font-mono">ESD SEALED &amp; SCANNED OK</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast('Printing Slip', `Dispatched to Zebra thermal printer for #${printModalOrder.id}`, 'info');
                    setPrintModalOrder(null);
                  }}
                  className="bg-[#561269] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Print Slip
                </button>
                <button
                  onClick={() => setPrintModalOrder(null)}
                  className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
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
        title="Remove Product From Inventory"
        itemName={productToDelete?.name}
        sku={productToDelete?.sku}
        description="Are you sure you want to delete this component from inventory? This removes it permanently from the public catalog."
        confirmLabel="Remove Product"
      />
    </div>
  );
};
