import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  CheckSquare, 
  Square, 
  Printer, 
  Truck, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus, SellerProfile } from '../../types';
import { getBinLocationForSku } from '../../mockData/sellerData';

interface PackListTabProps {
  orders: Order[];
  profile: SellerProfile;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onOpenDispatchModal: (order: Order) => void;
  onOpenPackingSlip: (order: Order) => void;
  onFlagMissingItems?: (orderId: string, missingItems: Array<{ productId: string; sku: string; name: string; quantity: number; reason?: string }>) => void;
  onPrintMasterManifest: () => void;
}

export const PackListTab: React.FC<PackListTabProps> = ({
  orders,
  profile,
  onUpdateStatus,
  onOpenDispatchModal,
  onOpenPackingSlip,
  onFlagMissingItems,
  onPrintMasterManifest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'to_pack' | 'packed' | 'shipped' | 'delivered'>('all');
  const [flaggedMissingItems, setFlaggedMissingItems] = useState<Record<string, Record<string, boolean>>>({});

  // Picking verification checkboxes: { [orderId]: { [sku_or_id]: boolean } }
  const [pickedItems, setPickedItems] = useState<Record<string, Record<string, boolean>>>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    orders.forEach((o) => {
      initial[o.id] = {};
      o.items.forEach((item) => {
        // If already packed or shipped, default to checked
        initial[o.id][item.productId || item.sku] = o.status === 'packed' || o.status === 'shipped' || o.status === 'delivered';
      });
    });
    return initial;
  });

  const toggleItemCheck = (orderId: string, itemKey: string) => {
    setPickedItems((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemKey]: !prev[orderId]?.[itemKey],
      },
    }));
  };

  const toggleMissingItem = (orderId: string, itemKey: string) => {
    setFlaggedMissingItems((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemKey]: !prev[orderId]?.[itemKey],
      },
    }));
  };

  const submitMissingItemsReport = (order: Order) => {
    const missing = order.items
      .filter((item) => {
        const itemKey = item.productId || item.sku;
        return !!flaggedMissingItems[order.id]?.[itemKey];
      })
      .map((item) => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        reason: 'Not available at this seller hub',
      }));

    if (!missing.length) return;
    onFlagMissingItems?.(order.id, missing);
  };

  const markAllOrderItemsPicked = (order: Order) => {
    setPickedItems((prev) => {
      const orderChecks: Record<string, boolean> = {};
      order.items.forEach((i) => {
        orderChecks[i.productId || i.sku] = true;
      });
      return {
        ...prev,
        [order.id]: orderChecks,
      };
    });
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    let matchesStatus = true;
    if (statusFilter === 'to_pack') {
      matchesStatus = ['assigned', 'placed', 'processing', 'to_pack', 'picking'].includes(o.status);
    } else if (statusFilter === 'packed') {
      matchesStatus = ['packed', 'ready_for_pickup', 'manifested'].includes(o.status);
    } else if (statusFilter === 'shipped') {
      matchesStatus = ['shipped', 'in_transit'].includes(o.status);
    } else if (statusFilter !== 'all') {
      matchesStatus = o.status === statusFilter;
    }

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesId = o.id.toLowerCase().includes(query);
    const matchesCustomer = o.customer?.fullName.toLowerCase().includes(query) || o.customer?.city.toLowerCase().includes(query);
    const matchesItem = o.items.some((i) => i.name.toLowerCase().includes(query) || (i.sku && i.sku.toLowerCase().includes(query)));

    return matchesStatus && (matchesId || matchesCustomer || matchesItem);
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'assigned':
      case 'to_pack' as any:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Assigned (Ready for Packing)</span>
          </span>
        );
      case 'processing':
      case 'picking' as any:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Layers className="w-3 h-3 text-indigo-600" />
            <span>Picking in Progress</span>
          </span>
        );
      case 'placed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Assigned to Hub (Pick Items)</span>
          </span>
        );
      case 'packed':
      case 'ready_for_pickup' as any:
      case 'manifested' as any:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#561269]/10 text-[#561269] border border-[#561269]/20">
            <Package className="w-3 h-3" />
            <span>Packed (Ready for Dispatch)</span>
          </span>
        );
      case 'shipped':
      case 'in_transit' as any:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3" />
            <span>Shipped (In Transit)</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Status Tabs, and Manifest Print */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { 
              id: 'all', 
              label: 'All Assigned Orders', 
              count: orders.filter((o) => o.status !== 'cancelled').length 
            },
            { 
              id: 'to_pack', 
              label: "To Pack / Picking", 
              count: orders.filter((o) => ['assigned', 'placed', 'processing', 'to_pack', 'picking'].includes(o.status)).length 
            },
            { 
              id: 'packed', 
              label: 'Pending Dispatch', 
              count: orders.filter((o) => ['packed', 'ready_for_pickup', 'manifested'].includes(o.status)).length 
            },
            { 
              id: 'shipped', 
              label: 'In Transit', 
              count: orders.filter((o) => ['shipped', 'in_transit'].includes(o.status)).length 
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              id={`filter-tab-${tab.id}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-[#561269] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusFilter === tab.id ? 'bg-violet-800 text-violet-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Master Print */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, SKU, city..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
            />
          </div>
          <button
            onClick={onPrintMasterManifest}
            id="print-master-manifest-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shrink-0"
            title="Print master summary for all today dispatches"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Daily Manifest</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No orders matching criteria</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting search or switching status tabs above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const checksForOrder = pickedItems[order.id] || {};
            const checkedCount = order.items.filter((item) => checksForOrder[item.productId || item.sku]).length;
            const totalItemsCount = order.items.length;
            const isAllPicked = checkedCount === totalItemsCount;

            return (
              <div
                key={order.id}
                id={`seller-order-card-${order.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black font-mono text-[#561269]">{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Ordered: {order.createdAt?.replace('T', ' ').slice(0, 16) || '2026-09-03 09:30'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Recipient & Total Amount */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-slate-800 flex items-center justify-end gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{order.customer.fullName}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {order.customer.city}, {order.customer.state}
                      </p>
                    </div>

                    <div className="text-right pl-3 border-l border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Order Value</span>
                      <span className="text-sm font-bold font-mono text-slate-900">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Print Packing Slip */}
                    <button
                      onClick={() => onOpenPackingSlip(order)}
                      id={`print-slip-btn-${order.id}`}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors"
                      title="View & Print Packing Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Items & Picking Verification Table */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-violet-700" />
                      <span>Components to Pick & Pack</span>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-medium text-slate-500">
                        Picking Progress:{' '}
                        <strong className={isAllPicked ? 'text-emerald-700' : 'text-amber-700'}>
                          {checkedCount}/{totalItemsCount} SKUs verified
                        </strong>
                      </span>
                      {!isAllPicked && (
                        <button
                          onClick={() => markAllOrderItemsPicked(order)}
                          className="text-[11px] text-violet-700 hover:text-violet-900 font-bold underline"
                        >
                          Check All
                        </button>
                      )}
                      <button
                        onClick={() => submitMissingItemsReport(order)}
                        className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline"
                      >
                        Notify Missing Components
                      </button>
                    </div>
                  </div>

                  {/* Components List */}
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {order.items.map((item, idx) => {
                      const itemKey = item.productId || item.sku || `item-${idx}`;
                      const isPicked = !!checksForOrder[itemKey];
                      const binLocation = getBinLocationForSku(item.sku);

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleItemCheck(order.id, itemKey)}
                          className={`p-3 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                            isPicked ? 'bg-emerald-50/30 hover:bg-emerald-50/60' : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="text-slate-400 hover:text-violet-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItemCheck(order.id, itemKey);
                                }}
                              >
                                {isPicked ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                              <button
                                type="button"
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                                  flaggedMissingItems[order.id]?.[itemKey]
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMissingItem(order.id, itemKey);
                                }}
                              >
                                {flaggedMissingItems[order.id]?.[itemKey] ? 'Missing' : 'Not in Hub'}
                              </button>
                            </div>

                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 object-contain rounded-lg border border-slate-200 bg-white"
                                referrerPolicy="no-referrer"
                              />
                            )}

                            <div>
                              <p className={`font-semibold ${isPicked ? 'text-slate-800 line-through text-slate-400' : 'text-slate-900'}`}>
                                {item.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                SKU: {item.sku || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Bin Location & Quantity */}
                          <div className="flex items-center gap-3">
                            {/* Bin Location Highlighted Badge */}
                            <div className="text-right">
                              <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                                Shelf / Location
                              </span>
                              <span className="px-2 py-0.5 rounded-lg bg-violet-100 text-violet-900 border border-violet-200 font-mono font-bold text-xs">
                                {binLocation}
                              </span>
                            </div>

                            <div className="text-right min-w-[50px]">
                              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Qty</span>
                              <span className="font-mono font-black text-sm text-slate-900">
                                {item.quantity} pcs
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Actions & State Transition Workflow (FR-5.2) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500">
                      {(order.status === 'assigned' || order.status === 'placed') && (
                        <span>Order allocated to your hub. Verify components, pack into ESD anti-static pouch, then mark as packed.</span>
                      )}
                      {order.status === 'processing' && (
                        <span>Picking in progress. Verify component counts and packaging seals.</span>
                      )}
                      {order.status === 'packed' && (
                        <span>Box sealed and ready. Awaiting handover to courier pickup van.</span>
                      )}
                      {order.status === 'shipped' && (
                        <span>Tracking: <strong className="font-mono text-violet-800">{order.trackingNumber || order.courierTrackingId || 'In Transit'}</strong></span>
                      )}
                      {order.status === 'delivered' && (
                        <span className="text-emerald-700 font-semibold">Delivery completed and acknowledged by recipient.</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'assigned' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(order.id, 'processing')}
                            id={`start-packing-btn-${order.id}`}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Start Picking</span>
                          </button>
                          <button
                            onClick={() => onUpdateStatus(order.id, 'packed')}
                            id={`mark-packed-btn-${order.id}`}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#561269] hover:bg-violet-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Mark as Packed</span>
                          </button>
                        </>
                      )}

                      {(order.status === 'processing' || order.status === 'placed') && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'packed')}
                          id={`mark-packed-btn-${order.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#561269] hover:bg-violet-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Mark as Packed</span>
                        </button>
                      )}

                      {order.status === 'packed' && (
                        <button
                          onClick={() => onOpenDispatchModal(order)}
                          id={`mark-shipped-btn-${order.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#561269] hover:bg-[#460e56] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Handover to Courier / Ship →</span>
                        </button>
                      )}

                      {order.status === 'shipped' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'delivered')}
                          id={`mark-delivered-btn-${order.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
