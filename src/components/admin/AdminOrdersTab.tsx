import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { AdminOrderAssignmentModal } from './AdminOrderAssignmentModal';
import { 
  Store, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  AlertTriangle, 
  UserCheck, 
  MapPin, 
  Calendar,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  ShieldAlert,
  ArrowRight,
  Layers,
  ShoppingBag,
  ExternalLink,
  TrendingUp,
  Database,
  Tag,
  Mail
} from 'lucide-react';
import { EmailPreviewModal } from '../common/EmailPreviewModal';
import { 
  getLocalSentEmails, 
  generateCustomerOrderEmailHtml, 
  SentEmailRecord 
} from '../../services/emailService';

export const AdminOrdersTab: React.FC = () => {
  const { orders, availableSellers, products } = useApp();
  const [viewMode, setViewMode] = useState<'orders' | 'ordered_products'>('orders');
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productSortBy, setProductSortBy] = useState<'units' | 'revenue' | 'name'>('units');
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [emailModalRecord, setEmailModalRecord] = useState<SentEmailRecord | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handlePreviewOrderEmail = (order: Order) => {
    const existing = getLocalSentEmails().find((e) => e.orderId === order.id);
    if (existing) {
      setEmailModalRecord(existing);
    } else {
      const generatedHtml = generateCustomerOrderEmailHtml(order);
      setEmailModalRecord({
        id: `email-cust-${order.id}`,
        recipientType: 'customer',
        to: [order.customer.email],
        recipientName: order.customer.fullName,
        subject: `⚡ Order Confirmed: #${order.id} - SEMIX LABS`,
        html: generatedHtml,
        orderId: order.id,
        status: 'sent',
        timestamp: order.createdAt || new Date().toISOString()
      });
    }
    setIsEmailModalOpen(true);
  };

  // Statistics
  const pendingOrders = useMemo(
    () => orders.filter((o) => !o.assignedSellerId || o.status === 'pending_assignment'),
    [orders]
  );

  const activeAssignedOrders = useMemo(
    () => orders.filter((o) => o.assignedSellerId && (o.status === 'assigned' || o.status === 'processing' || o.status === 'packed' || o.status === 'shipped')),
    [orders]
  );

  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === 'delivered' || o.status === 'completed'),
    [orders]
  );

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    let list = orders;

    if (filter === 'pending') {
      list = pendingOrders;
    } else if (filter === 'active') {
      list = activeAssignedOrders;
    } else if (filter === 'delivered') {
      list = deliveredOrders;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((o) => 
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.city.toLowerCase().includes(q) ||
        (o.assignedSellerName && o.assignedSellerName.toLowerCase().includes(q)) ||
        o.items.some((i) => i.name.toLowerCase().includes(q) || (i.sku && i.sku.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [orders, filter, pendingOrders, activeAssignedOrders, deliveredOrders, searchQuery]);

  // Aggregated Information about products ordered across all customer orders
  const orderedProductsSummary = useMemo(() => {
    const summaryMap = new Map<string, {
      productId: string;
      name: string;
      sku: string;
      image: string;
      category: string;
      unitPrice: number;
      totalUnitsOrdered: number;
      totalRevenue: number;
      orderCount: number;
      orderIds: string[];
      recentOrderDate: string;
      recentCustomerName: string;
      availableStock: number;
      locationBin?: string;
    }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.sku || item.id || item.name;
        const existing = summaryMap.get(key);

        const matchingCatalogProduct = products.find(
          (p) => p.id === item.id || (p.sku && item.sku && p.sku.toLowerCase() === item.sku.toLowerCase())
        );

        const category = matchingCatalogProduct?.category || (item as any).category || 'Electronic Components';
        const availableStock = matchingCatalogProduct?.stockCount ?? 0;
        const locationBin = matchingCatalogProduct?.locationBin;

        if (existing) {
          existing.totalUnitsOrdered += item.quantity;
          existing.totalRevenue += item.price * item.quantity;
          if (!existing.orderIds.includes(order.id)) {
            existing.orderCount += 1;
            existing.orderIds.push(order.id);
          }
          if (new Date(order.createdAt).getTime() > new Date(existing.recentOrderDate).getTime()) {
            existing.recentOrderDate = order.createdAt;
            existing.recentCustomerName = order.customer.fullName;
          }
        } else {
          summaryMap.set(key, {
            productId: item.id,
            name: item.name,
            sku: item.sku || item.id || 'N/A',
            image: item.image || matchingCatalogProduct?.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80',
            category,
            unitPrice: item.price,
            totalUnitsOrdered: item.quantity,
            totalRevenue: item.price * item.quantity,
            orderCount: 1,
            orderIds: [order.id],
            recentOrderDate: order.createdAt,
            recentCustomerName: order.customer.fullName,
            availableStock,
            locationBin,
          });
        }
      });
    });

    let result = Array.from(summaryMap.values());

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (productSortBy === 'units') {
      result.sort((a, b) => b.totalUnitsOrdered - a.totalUnitsOrdered);
    } else if (productSortBy === 'revenue') {
      result.sort((a, b) => b.totalRevenue - a.totalRevenue);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [orders, products, searchQuery, productSortBy]);

  const totalUnitsOrderedAll = useMemo(
    () => orderedProductsSummary.reduce((sum, p) => sum + p.totalUnitsOrdered, 0),
    [orderedProductsSummary]
  );

  const totalOrderedRevenueAll = useMemo(
    () => orderedProductsSummary.reduce((sum, p) => sum + p.totalRevenue, 0),
    [orderedProductsSummary]
  );

  const topDemandedProduct = useMemo(
    () => orderedProductsSummary.length > 0 ? orderedProductsSummary[0] : null,
    [orderedProductsSummary]
  );

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const renderStatusBadge = (order: Order) => {
    const isUnassigned = !order.assignedSellerId || order.status === 'pending_assignment';

    if (isUnassigned) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          <span>Pending Seller Assignment</span>
        </span>
      );
    }

    switch (order.status) {
      case 'assigned':
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Assigned to Seller</span>
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#561269]/10 text-[#561269] border border-[#561269]/20">
            <Package className="w-3.5 h-3.5" />
            <span>Packed / Ready</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped in Transit</span>
          </span>
        );
      case 'delivered':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {order.status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation View Switcher: Customer Orders vs Ordered Products Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('orders')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'orders'
                ? 'bg-[#561269] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Customer Shipments &amp; Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setViewMode('ordered_products')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'ordered_products'
                ? 'bg-[#561269] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ordered Products Overview ({orderedProductsSummary.length})</span>
            <span className="bg-[#FF6B00] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {totalUnitsOrderedAll} Units
            </span>
          </button>
        </div>

        {/* Firebase Live Database Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] text-slate-600">
            Source: <code className="font-mono text-slate-800 font-semibold">orders/{'{id}'}/items</code> in <strong className="text-[#561269]">semix-ai-stdio</strong>
          </span>
        </div>
      </div>

      {viewMode === 'ordered_products' ? (
        /* ================= ORDERED PRODUCTS OVERALL INFORMATION VIEW ================= */
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unique Products Ordered</span>
                <div className="p-2 rounded-xl bg-[#561269]/10 text-[#561269]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black font-mono text-slate-900">{orderedProductsSummary.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Distinct catalog components purchased</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Units Ordered</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black font-mono text-emerald-700">{totalUnitsOrderedAll}</p>
              <p className="text-[11px] text-slate-500 mt-1">Component units requested by customers</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders Volume</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black font-mono text-slate-900">₹{totalOrderedRevenueAll.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500 mt-1">Gross ordered product value</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top In-Demand Item</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Tag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-sm font-extrabold text-slate-900 truncate">
                {topDemandedProduct ? topDemandedProduct.name : 'None yet'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {topDemandedProduct ? `${topDemandedProduct.totalUnitsOrdered} units in ${topDemandedProduct.orderCount} orders` : 'Awaiting customer orders'}
              </p>
            </div>
          </div>

          {/* Search & Sort Controls for Ordered Products */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter ordered products by component name, SKU, or category..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#561269] focus:border-[#561269]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort By:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setProductSortBy('units')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    productSortBy === 'units' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Most Units Ordered
                </button>
                <button
                  onClick={() => setProductSortBy('revenue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    productSortBy === 'revenue' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Highest Revenue
                </button>
                <button
                  onClick={() => setProductSortBy('name')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    productSortBy === 'name' ? 'bg-[#561269] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Name
                </button>
              </div>
            </div>
          </div>

          {/* Aggregated Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Ordered Products Breakdown (Firebase Synced)
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated from customer checkout payloads in the <code className="font-mono text-slate-700">orders</code> collection
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600">
                Showing {orderedProductsSummary.length} products
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Component &amp; Visual</th>
                    <th className="p-3.5">SKU / Category</th>
                    <th className="p-3.5 text-center">Units Ordered</th>
                    <th className="p-3.5 text-center">Orders Count</th>
                    <th className="p-3.5">Unit Price</th>
                    <th className="p-3.5">Total Revenue</th>
                    <th className="p-3.5">Current Stock</th>
                    <th className="p-3.5">Associated Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderedProductsSummary.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                        No customer orders match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    orderedProductsSummary.map((prod, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        {/* Component Visual & Name */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-bold text-slate-900 leading-snug line-clamp-2">
                                {prod.name}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {prod.productId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* SKU / Category */}
                        <td className="p-3.5">
                          <span className="font-mono text-slate-800 font-semibold block text-[11px]">
                            {prod.sku}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5 max-w-[150px] truncate">
                            {prod.category}
                          </span>
                        </td>

                        {/* Total Units Ordered */}
                        <td className="p-3.5 text-center">
                          <span className="inline-flex items-center justify-center font-mono font-black text-sm px-3 py-1 rounded-xl bg-[#561269]/10 text-[#561269] border border-[#561269]/20">
                            {prod.totalUnitsOrdered}
                          </span>
                        </td>

                        {/* Orders Count */}
                        <td className="p-3.5 text-center">
                          <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                            {prod.orderCount} {prod.orderCount === 1 ? 'order' : 'orders'}
                          </span>
                        </td>

                        {/* Unit Price */}
                        <td className="p-3.5 font-mono font-semibold text-slate-700">
                          ₹{prod.unitPrice.toLocaleString('en-IN')}
                        </td>

                        {/* Total Revenue */}
                        <td className="p-3.5 font-mono font-extrabold text-slate-900">
                          ₹{prod.totalRevenue.toLocaleString('en-IN')}
                        </td>

                        {/* Warehouse Stock */}
                        <td className="p-3.5">
                          <div>
                            <span className={`font-mono font-bold text-xs ${
                              prod.availableStock < 20 ? 'text-amber-600' : 'text-slate-800'
                            }`}>
                              {prod.availableStock} in stock
                            </span>
                            {prod.locationBin && (
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {prod.locationBin}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Associated Order IDs */}
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {prod.orderIds.slice(0, 3).map((oid) => (
                              <span
                                key={oid}
                                className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                                title={`Included in Order: ${oid}`}
                              >
                                {oid}
                              </span>
                            ))}
                            {prod.orderIds.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center">
                                +{prod.orderIds.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Guide Card: How to inspect in Firebase Console */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400 shrink-0" />
              <h4 className="font-bold text-sm text-white">How to view this directly in the Firebase Console:</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Step 1: Collection</span>
                <p>Go to <strong>Firebase Console &gt; Firestore Database</strong> and click on the <strong><code>orders</code></strong> collection.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Step 2: Select Document</span>
                <p>Click any order document (e.g. <code>ord-1001</code>). Inspect the <strong><code>items</code></strong> array field.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Step 3: Component Fields</span>
                <p>Each item in the array displays the ordered <code>id</code>, <code>name</code>, <code>sku</code>, <code>quantity</code>, and <code>price</code>.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= INDIVIDUAL ORDERS LIST VIEW ================= */
        <div className="space-y-6">
      {/* Top Workflow Explanation & Action Alert */}
      {pendingOrders.length > 0 ? (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950">
                  {pendingOrders.length} Order{pendingOrders.length > 1 ? 's' : ''} Awaiting Seller Assignment
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  Action Needed
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 max-w-2xl">
                Newly placed customer orders require an Admin to allocate a regional fulfillment seller before components can be picked, packed, and dispatched.
              </p>
            </div>
          </div>

          <button
            onClick={() => setFilter('pending')}
            className="bg-[#561269] hover:bg-[#380847] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer transition-all hover:scale-105"
          >
            <span>View Pending Queue</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00]" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            <strong>All current orders assigned!</strong> Every active order has been allocated to a regional fulfillment hub seller.
          </p>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filter === 'all' 
              ? 'border-[#561269] bg-[#561269]/5 shadow-xs' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Orders</span>
          <span className="text-xl font-extrabold font-mono text-slate-900 mt-0.5 block">{orders.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">All registered orders</span>
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filter === 'pending' 
              ? 'border-amber-500 bg-amber-50 shadow-xs' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Pending Assignment</span>
          <span className={`text-xl font-extrabold font-mono mt-0.5 block ${pendingOrders.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {pendingOrders.length}
          </span>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">Requires seller allocation</span>
        </button>

        <button
          onClick={() => setFilter('active')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filter === 'active' 
              ? 'border-[#561269] bg-[#561269]/5 shadow-xs' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active / Assigned</span>
          <span className="text-xl font-extrabold font-mono text-slate-900 mt-0.5 block">{activeAssignedOrders.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">In fulfillment queue</span>
        </button>

        <button
          onClick={() => setFilter('delivered')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filter === 'delivered' 
              ? 'border-emerald-500 bg-emerald-50 shadow-xs' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Delivered</span>
          <span className="text-xl font-extrabold font-mono text-emerald-700 mt-0.5 block">{deliveredOrders.length}</span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Successfully completed</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer Name, City, or SKU..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#561269] focus:border-[#561269]"
          />
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'all' ? 'bg-[#561269] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'pending' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Assignment ({pendingOrders.length})</span>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'active' ? 'bg-[#561269] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active ({activeAssignedOrders.length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Delivered ({deliveredOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No orders found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No orders matched your current filter or search criteria.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isUnassigned = !order.assignedSellerId || order.status === 'pending_assignment';
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                id={`admin-order-card-${order.id}`}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  isUnassigned
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Card Main Row */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Identification & Customer Info */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#561269]">
                        {order.id}
                      </span>
                      {renderStatusBadge(order)}
                      <span className="text-[11px] text-slate-400 font-mono">
                        {order.createdAt.slice(0, 10)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">{order.customer.fullName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {order.customer.city}, {order.customer.state} ({order.customer.pincode})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono font-semibold text-slate-900">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Seller Assignment Indicator */}
                  <div className="lg:border-l lg:border-slate-200 lg:pl-6 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Fulfillment Seller
                    </span>
                    {order.assignedSellerName ? (
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {order.assignedSellerName}
                          </p>
                          {order.assignedAt && (
                            <p className="text-[10px] text-slate-400 font-mono">
                              Assigned {order.assignedAt.slice(0, 10)}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Unassigned / Pending</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      onClick={() => handlePreviewOrderEmail(order)}
                      className="px-2.5 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Preview automated transactional emails for this order"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Emails</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{order.items.length} Component{order.items.length > 1 ? 's' : ''}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isUnassigned ? (
                      <button
                        onClick={() => setSelectedOrderForAssignment(order)}
                        className="bg-[#FF6B00] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Assign Seller →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedOrderForAssignment(order)}
                        className="bg-white hover:bg-slate-50 text-[#561269] hover:text-[#380847] border border-[#561269]/30 hover:border-[#561269] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reassign Seller</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Component Breakdown & Timeline */}
                {isExpanded && (
                  <div className="bg-slate-50/70 border-t border-slate-200 p-4 sm:p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                        Ordered Components ({order.items.length} line items):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs"
                          >
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80'}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                SKU: {item.sku || 'N/A'} • Qty: {item.quantity}
                              </p>
                              <p className="text-xs font-mono font-bold text-slate-900">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Packing Notes */}
                    {order.packingNotes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                        <strong className="block font-bold">Special Packaging Instruction:</strong>
                        <p>{order.packingNotes}</p>
                      </div>
                    )}

                    {/* Recent Status Timeline Log */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Workflow &amp; Audit Trail:
                      </h4>
                      <div className="space-y-1.5">
                        {order.statusTimeline.map((step, idx) => (
                          <div key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
                              {step.timestamp}
                            </span>
                            <span className="font-bold text-slate-800 shrink-0 uppercase text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">
                              {step.status}
                            </span>
                            <span>{step.note}</span>
                            <span className="text-slate-400 italic">({step.updatedBy})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        </div>
      </div>
      )}

      {/* Assignment / Reassignment Modal */}
      <AdminOrderAssignmentModal
        order={selectedOrderForAssignment}
        isOpen={Boolean(selectedOrderForAssignment)}
        onClose={() => setSelectedOrderForAssignment(null)}
      />

      {/* Transactional Email Modal */}
      <EmailPreviewModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        initialEmail={emailModalRecord}
      />
    </div>
  );
};
