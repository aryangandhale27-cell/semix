import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Store, 
  Package, 
  Clock, 
  Truck, 
  TrendingUp, 
  Bell, 
  Edit, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Printer, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  X, 
  ArrowUpRight,
  Filter,
  Check,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { saveUserAppState, subscribeToUserAppState } from '../../services/userStateService';
import { Order, OrderStatus, SellerProfile, SellerNotification } from '../../types';
import { 
  INITIAL_SELLER_PROFILE, 
  INITIAL_SELLER_NOTIFICATIONS, 
  INITIAL_PAYOUT_HISTORY,
  PayoutRecord 
} from '../../mockData/sellerData';
import { PackListTab } from '../../components/seller/PackListTab';
import { RevenueAnalyticsTab } from '../../components/seller/RevenueAnalyticsTab';
import { SellerProfileModal } from '../../components/seller/SellerProfileModal';
import { PackingSlipModal } from '../../components/seller/PackingSlipModal';
import { DispatchCourierModal } from '../../components/seller/DispatchCourierModal';
import { EmailPreviewModal } from '../../components/common/EmailPreviewModal';
import { useFirestoreSellerKPIs, SellerDateRange } from '../../hooks/useFirestoreSellerKPIs';
import { SellerKpiCardsRow } from '../../components/seller/SellerKpiCardsRow';
import { createOrderInFirestore } from '../../services/firebaseService';
import { sendSellerAssignmentEmail, getLocalSentEmails } from '../../services/emailService';

export const SellerDashboardPage: React.FC = () => {
  const { orders, availableSellers, updateOrderStatus, showToast, flagMissingOrderItems } = useApp();
  const { user } = useAuth();

  // Active Main Tabs: 'packlist' | 'analytics'
  const [activeTab, setActiveTab] = useState<'packlist' | 'analytics'>('packlist');

  // Analytics Date Range State (FR-5.4)
  const [analyticsDateRange, setAnalyticsDateRange] = useState<SellerDateRange>('This Month');

  // Active seller hub identifier defaults to the logged-in seller account and never falls back to hardcoded demo data.
  const defaultSellerId = availableSellers.find((s) => s.email === user?.email)?.id || (user?.role === 'seller' ? user.id : '') || availableSellers[0]?.id || '';
  const [selectedSellerId, setSelectedSellerId] = useState<string>(defaultSellerId);

  React.useEffect(() => {
    if (defaultSellerId) {
      setSelectedSellerId(defaultSellerId);
    }
  }, [defaultSellerId]);

  const currentSeller = useMemo(() => {
    return availableSellers.find((s) => s.id === selectedSellerId) || availableSellers.find((s) => s.email === user?.email) || {
      id: user?.id || 'seller-profile',
      name: user?.name || 'Seller Profile',
      email: user?.email || '',
      phone: user?.phone || '',
      warehouseHub: '',
      gstin: '',
      rating: 0,
    };
  }, [availableSellers, selectedSellerId, user]);

  // Real-time Firestore Seller KPIs and Scoped Data
  const sellerKpis = useFirestoreSellerKPIs(
    currentSeller.id,
    currentSeller.name,
    currentSeller.email,
    analyticsDateRange
  );

  // Seller Profile State (FR-5.5)
  const [profile, setProfile] = useState<SellerProfile>(INITIAL_SELLER_PROFILE);

  React.useEffect(() => {
    if (!user?.id) return;
    return subscribeToUserAppState(user.id, (state) => {
      if (state.profile) setProfile((current) => ({ ...current, ...state.profile } as SellerProfile));
    });
  }, [user?.id]);

  // Sync profile when currentSeller or real-time KPIs change
  React.useEffect(() => {
    if (currentSeller) {
      setProfile((prev) => ({
        ...prev,
        name: currentSeller.name,
        warehouseHub: currentSeller.warehouseHub,
        gstin: currentSeller.gstin,
        phone: currentSeller.phone,
        email: currentSeller.email,
        performanceRating: sellerKpis.sellerRating || currentSeller.rating || 4.92,
        onTimeDispatchRate: sellerKpis.onTimeDispatchRate ?? prev.onTimeDispatchRate,
        totalPackedThisWeek: sellerKpis.unitsPackedCount || prev.totalPackedThisWeek,
      }));
    }
  }, [currentSeller, sellerKpis.sellerRating, sellerKpis.onTimeDispatchRate, sellerKpis.unitsPackedCount]);

  // Filter orders strictly for this seller - unassigned orders NEVER appear in seller queue
  const sellerAssignedOrders = useMemo(() => {
    if (sellerKpis.sellerOrders && sellerKpis.sellerOrders.length > 0) {
      return sellerKpis.sellerOrders;
    }
    return orders.filter((o) => {
      if (!o.assignedSellerId || o.status === 'pending_assignment') return false;
      return (
        o.assignedSellerId === currentSeller.id ||
        (o.assignedSellerName && currentSeller.name && o.assignedSellerName.toLowerCase().includes(currentSeller.name.toLowerCase()))
      );
    });
  }, [sellerKpis.sellerOrders, orders, currentSeller]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Notifications State (FR-5.7)
  const [notifications, setNotifications] = useState<SellerNotification[]>(INITIAL_SELLER_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Packing Slip Modal State
  const [packingSlipOrder, setPackingSlipOrder] = useState<Order | null>(null);

  // Courier Dispatch Modal State
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null);

  // Email Preview Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Payout Records (fallback)
  const [payouts] = useState<PayoutRecord[]>(INITIAL_PAYOUT_HISTORY);

  // Unread notifications count
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Handle saving profile changes
  const handleSaveProfile = async (updated: SellerProfile) => {
    setProfile(updated);
    if (user?.id) {
      await saveUserAppState(user.id, { profile: updated as unknown as Record<string, unknown> });
    }
    showToast('Profile Updated', 'Warehouse hub & contact details saved successfully.', 'success');
  };

  // Status progression action
  const handleStatusProgression = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus, undefined, profile.name);
    showToast(`Order Updated: ${orderId}`, `Status changed to ${nextStatus.toUpperCase()}`, 'success');
  };

  // Confirm courier dispatch
  const handleConfirmDispatch = (orderId: string, courierName: string, trackingNumber: string, note?: string) => {
    updateOrderStatus(orderId, 'shipped', note || `Dispatched via ${courierName}`, profile.name, {
      courier: courierName,
      courierTrackingId: trackingNumber,
      packedBy: profile.name,
    });
    showToast('Order Handed Over', `AWB ${trackingNumber} assigned to ${courierName}`, 'success');
  };

  const handleMissingItemsAlert = (orderId: string, missingItems: Array<{ productId: string; sku: string; name: string; quantity: number; reason?: string }>) => {
    if (!missingItems.length) return;

    flagMissingOrderItems(orderId, missingItems, `Seller hub ${profile.name} cannot fulfill ${missingItems.length} component(s) in this order.`);

    const shortageNotification: SellerNotification = {
      id: `notif-shortage-${Date.now()}`,
      title: `Missing Components: ${missingItems.length} item(s)`,
      message: `${missingItems.map((item) => item.name).join(', ')} could not be located at ${profile.name}. Please reassign these items to another seller or fulfillment hub.`,
      timestamp: 'Just now',
      type: 'inventory',
      isRead: false,
      orderId,
      priority: 'urgent',
    };

    setNotifications((prev) => [shortageNotification, ...prev]);
  };


  // Export CSV statement (FR-5.4)
  const handleExportCsv = () => {
    const activePayouts = sellerKpis.sellerPayouts.length > 0 ? sellerKpis.sellerPayouts : payouts;
    const headers = ['Payout Ref,Order ID,Date,Components Summary,Gross Value (INR),Fee 3% (INR),Net Payout (INR),Status,Courier'];
    const rows = activePayouts.map(
      (p) =>
        `"${p.id}","${p.orderId}","${p.date}","${p.itemsSummary.replace(/"/g, '""')}","${p.grossAmount}","${p.commissionFee}","${p.netPayout}","${p.payoutStatus}","${p.courier}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SEMIX_LABS_Seller_Payouts_${profile.gstin}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', 'Financial payout CSV downloaded successfully.', 'success');
  };

  // Simulate new incoming order notification (FR-5.7)
  const handleSimulateIncomingOrder = async () => {
    const orderNum = Math.floor(89220 + Math.random() * 80);
    const newOrderId = `ORD-${orderNum}`;
    const newNotif: SellerNotification = {
      id: `notif-${Date.now().toString().slice(-4)}`,
      title: `⚡ Urgent New Order: ${newOrderId}`,
      message: `Priority same-day dispatch assigned for LiPo Battery & ESP32. Ready in Pack List.`,
      timestamp: 'Just now',
      type: 'order',
      isRead: false,
      orderId: newOrderId,
      priority: 'urgent',
    };

    setNotifications((prev) => [newNotif, ...prev]);

    try {
      const simulatedOrder: Order = {
        id: newOrderId,
        trackingNumber: `TRK-${orderNum}-BLUEDART`,
        customer: {
          fullName: 'Customer',
          email: 'customer@example.com',
          phone: '+91 90000 00000',
          street: 'Address will be saved here',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '000000',
        },
        items: [
          {
            productId: 'prod-002',
            name: 'ESP32-WROOM-32D Dual-Core Dev Board',
            sku: 'ESP-32-WROOM-32D',
            price: 245,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=300&q=80',
          },
          {
            productId: 'prod-010',
            name: 'Orange 3S 11.1V 2200mAh 30C LiPo Battery Pack',
            sku: 'BAT-LIPO-3S-2200-30C',
            price: 1450,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=300&q=80',
          },
        ],
        subtotal: 2185,
        totalAmount: 2185,
        finalTotal: 2185,
        discount: 0,
        tax: 393.3,
        shippingFee: 0,
        status: 'assigned',
        statusTimeline: [
          {
            status: 'assigned',
            timestamp: new Date().toISOString(),
            note: 'Order assigned to warehouse hub',
            updatedBy: currentSeller.name,
          },
        ],
        assignedSellerId: currentSeller.id,
        assignedSellerName: currentSeller.name,
        assignedAt: new Date().toISOString(),
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        createdAt: new Date().toISOString(),
      };
      await createOrderInFirestore(simulatedOrder);

      // Trigger attractive dispatch email notification to seller hub
      sendSellerAssignmentEmail(simulatedOrder, currentSeller).catch((e) => {
        console.warn('Seller assignment email deferred:', e);
      });
    } catch (e) {
      console.warn('Simulated order Firestore sync warning:', e);
    }

    showToast(
      'New Order Assigned!',
      `${newOrderId} added to today's packing queue with urgent dispatch priority.`,
      'info'
    );
  };

  // Mark all notifications as read
  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner / Seller Portal Header */}
      <div className="bg-[#561269] text-white pt-6 sm:pt-8 pb-12 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-violet-900/50 relative z-30 overflow-visible">
        {/* Subtle background circuit pattern */}
        <div className="absolute inset-0 rounded-[inherit] overflow-hidden opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            {/* Seller Identity & Hub Snapshot */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-violet-800 to-[#561269] border border-violet-400/40 shadow-lg flex items-center justify-center text-white shrink-0">
                <Store className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">{profile.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Active Merchant
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-800 text-violet-200 border border-violet-700">
                    GSTIN: {profile.gstin}
                  </span>
                </div>

                <p className="text-xs text-violet-200 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-violet-400" />
                    {profile.warehouseHub}
                  </span>
                  <span className="text-violet-400">•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-violet-400" />
                    Default: {profile.preferredCourier}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions: Edit Profile, Notifications Bell, Simulate Order */}
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 w-full lg:w-auto self-start lg:self-center">
              {/* Active Hub Switcher for testing/multi-seller management */}
              <div className="flex items-center gap-1.5 bg-violet-950/60 border border-violet-700/60 rounded-xl px-2.5 py-1.5 text-xs text-violet-100 shadow-xs max-w-full">
                <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] text-violet-300 font-medium hidden sm:inline">Seller Queue:</span>
                <select
                  value={selectedSellerId}
                  onChange={(e) => setSelectedSellerId(e.target.value)}
                  id="active-seller-hub-select"
                  className="bg-transparent font-bold text-white text-xs border-none focus:outline-hidden cursor-pointer max-w-[130px] sm:max-w-[180px]"
                >
                  {availableSellers.map((s) => (
                    <option key={s.id} value={s.id} className="text-slate-900 bg-white">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Simulate Incoming Order (Demo Feature) */}
              <button
                onClick={handleSimulateIncomingOrder}
                id="simulate-order-btn"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-violet-800 hover:bg-violet-700 text-violet-100 border border-violet-600/40 transition-colors shadow-xs w-full sm:w-auto justify-center"
                title="Simulate a new customer order placed to demo live notifications"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Simulate New Order</span>
              </button>

              {/* Hub Transactional Emails Button */}
              <button
                onClick={() => setIsEmailModalOpen(true)}
                id="seller-hub-emails-btn"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-violet-800/80 hover:bg-violet-700 text-violet-100 border border-violet-600/40 transition-colors shadow-xs w-full sm:w-auto justify-center"
                title="View Dispatch Emails sent to this Warehouse Hub"
              >
                <Mail className="w-3.5 h-3.5 text-purple-200" />
                <span className="hidden sm:inline">Hub Emails</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-400 text-slate-950">
                  {getLocalSentEmails().filter((e) => e.recipientType === 'seller').length}
                </span>
              </button>

              {/* Notification Bell Dropdown (FR-5.7) */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  id="seller-notif-bell-btn"
                  className="relative p-2.5 rounded-xl bg-violet-800/80 hover:bg-violet-700 text-violet-100 border border-violet-600/40 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 text-slate-900 overflow-hidden"
                    >
                      <div className="bg-[#561269] px-4 py-3 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-violet-300" />
                          <span className="text-xs font-bold">Dispatch & Packing Alerts</span>
                        </div>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={handleMarkAllNotifsRead}
                            className="text-[11px] text-violet-200 hover:text-white font-semibold underline"
                          >
                            Mark All Read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 text-xs transition-colors ${
                              notif.isRead ? 'bg-white' : 'bg-violet-50/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={`font-bold ${notif.isRead ? 'text-slate-800' : 'text-violet-950'}`}>
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                            {notif.orderId && (
                              <button
                                onClick={() => {
                                  setActiveTab('packlist');
                                  setIsNotificationOpen(false);
                                }}
                                className="mt-1.5 text-[10px] text-violet-700 font-bold hover:underline"
                              >
                                View in Pack List →
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Edit Profile Button (FR-5.5) */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                id="edit-seller-profile-btn"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#561269] hover:bg-violet-50 transition-colors shadow-xs w-full sm:w-auto justify-center"
              >
                <Edit className="w-3.5 h-3.5 text-violet-700" />
                <span>Edit Hub Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Stats Bar (Real-Time Cloud Firestore Scoped Seller KPIs & My Bonus) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
        <SellerKpiCardsRow
          kpis={sellerKpis}
          dateRange={analyticsDateRange}
          onDateRangeChange={(range) => setAnalyticsDateRange(range)}
          onSelectTab={(tab) => setActiveTab(tab)}
          sellerId={currentSeller.id}
          sellerName={currentSeller.name}
        />
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('packlist')}
            id="tab-btn-packlist"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'packlist'
                ? 'bg-[#561269] text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Today's Pack List & Dispatch</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'packlist' ? 'bg-violet-800 text-violet-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {sellerKpis.allAssignedCount}
            </span>
          </button>


          <button
            onClick={() => setActiveTab('analytics')}
            id="tab-btn-analytics"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#561269] text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Sales & Revenue Analytics</span>
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="mt-6">
          {activeTab === 'packlist' && (
            <PackListTab
              orders={sellerAssignedOrders}
              profile={profile}
              onUpdateStatus={handleStatusProgression}
              onOpenDispatchModal={(order) => setDispatchOrder(order)}
              onOpenPackingSlip={(order) => setPackingSlipOrder(order)}
              onFlagMissingItems={handleMissingItemsAlert}
              onPrintMasterManifest={() => {
                if (sellerAssignedOrders.length > 0) {
                  setPackingSlipOrder(sellerAssignedOrders[0]);
                } else {
                  showToast('No Orders', 'No orders in current manifest for this hub', 'info');
                }
              }}
            />
          )}


          {activeTab === 'analytics' && (
            <RevenueAnalyticsTab
              payouts={sellerKpis.sellerPayouts.length > 0 ? sellerKpis.sellerPayouts : payouts}
              dateRange={analyticsDateRange}
              onDateRangeChange={(range) => setAnalyticsDateRange(range as SellerDateRange)}
              onExportCsv={handleExportCsv}
              sellerId={currentSeller.id}
            />
          )}
        </div>
      </div>

      {/* Profile Edit Modal (FR-5.5) */}
      <SellerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Individual Order Packing Slip Modal (FR-5.1) */}
      <PackingSlipModal
        isOpen={!!packingSlipOrder}
        onClose={() => setPackingSlipOrder(null)}
        order={packingSlipOrder}
        profile={profile}
      />

      {/* Courier Dispatch Handover Modal (FR-5.2) */}
      <DispatchCourierModal
        isOpen={!!dispatchOrder}
        onClose={() => setDispatchOrder(null)}
        order={dispatchOrder}
        onConfirmDispatch={handleConfirmDispatch}
      />

      {/* Seller Hub Dispatch Emails Modal */}
      <EmailPreviewModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};
