import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { CustomerAddress, Order, EscalationType, EscalationPriority } from '../../types';
import { CustomerAddressEntry, getEmptyCustomerAddress, readSavedCustomerAddresses, writeSavedCustomerAddresses } from '../../utils/customerAddress';
import { 
  Package, 
  Heart, 
  MapPin, 
  AlertCircle, 
  ChevronDown,
  ChevronRight, 
  Download, 
  MessageSquare,
  CheckCircle2,
  Trash2,
  ShoppingCart,
  Send,
  User,
  FileText,
  Building2,
  Clock,
  Mail,
  Smartphone
} from 'lucide-react';
import { EmailPreviewModal } from '../../components/common/EmailPreviewModal';

export const CustomerDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, wishlist, products, addToCart, toggleWishlist, reportEscalation, showToast, bulkEnquiries, loadProductsByIds } = useApp();
  const { user } = useAuth();
  const wishlistProductIds = wishlist.join('|');

  useEffect(() => {
    if (!wishlistProductIds) return;
    void loadProductsByIds(wishlist).catch((error) => {
      console.error('[Customer] Could not load saved products:', error);
      showToast('Saved Products Unavailable', 'Some saved products could not be loaded.', 'error');
    });
  }, [loadProductsByIds, showToast, wishlist, wishlistProductIds]);

  const customerOrders = user
    ? orders.filter((order) => {
        const orderUserId = String(order.userId || '').trim();
        const orderCustomerEmail = String(order.customer?.email || '').trim().toLowerCase();
        const currentUserEmail = String(user.email || '').trim().toLowerCase();
        const currentUserId = String(user.id || '').trim();

        return (
          orderUserId === currentUserId ||
          orderUserId === currentUserEmail ||
          orderCustomerEmail === currentUserEmail ||
          orderCustomerEmail === String(user.email || '').trim().toLowerCase()
        );
      })
    : [];

  const activeTab = searchParams.get('tab') || 'orders';
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddressEntry[]>(() => readSavedCustomerAddresses());
  const [addressForm, setAddressForm] = useState<CustomerAddress>(() =>
    getEmptyCustomerAddress({
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    })
  );
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    setSavedAddresses(readSavedCustomerAddresses());
  }, [activeTab]);

  useEffect(() => {
    setAddressForm((previous) => ({
      ...previous,
      fullName: user?.name || previous.fullName || '',
      phone: user?.phone || previous.phone || '',
      email: user?.email || previous.email || '',
    }));
  }, [user]);

  const defaultAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0];

  const saveAddress = () => {
    if (!addressForm.fullName.trim() || !addressForm.phone.trim() || !addressForm.street.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.pincode.trim()) {
      showToast('Address Required', 'Please fill in all required address fields before saving.', 'warning');
      return;
    }

    const nextEntries = editingAddressId
      ? savedAddresses.map((item) => item.id === editingAddressId ? { ...item, ...addressForm } : item)
      : [...savedAddresses, { ...(addressForm as CustomerAddress & { id?: string }), id: `addr-${Date.now()}` }];

    const normalized = nextEntries.map((item) => ({
      ...item,
      isDefault: item.id === editingAddressId ? item.isDefault : item.id === (nextEntries.find((entry) => entry.isDefault)?.id || nextEntries[0]?.id),
    }));

    const finalEntries = normalized.map((item) => ({
      ...item,
      isDefault: editingAddressId ? item.id === (nextEntries.find((entry) => entry.isDefault)?.id || nextEntries[0]?.id) : item.id === (nextEntries[nextEntries.length - 1]?.id || item.id),
    }));

    if (editingAddressId) {
      const selected = finalEntries.find((item) => item.id === editingAddressId) || finalEntries[0];
      const updated = finalEntries.map((item) => ({ ...item, isDefault: item.id === (selected?.id || item.id) }));
      setSavedAddresses(updated);
      writeSavedCustomerAddresses(updated);
    } else {
      const newEntry = { ...addressForm, id: `addr-${Date.now()}`, isDefault: savedAddresses.length === 0 } as CustomerAddressEntry;
      const updated = [...savedAddresses, newEntry];
      setSavedAddresses(updated);
      writeSavedCustomerAddresses(updated);
    }

    setAddressForm(getEmptyCustomerAddress({ fullName: user?.name || '', phone: user?.phone || '', email: user?.email || '' }));
    setEditingAddressId(null);
    showToast('Address Saved', 'Your delivery address has been updated successfully.', 'success');
  };

  const deleteAddress = (id: string) => {
    const remaining = savedAddresses.filter((address) => address.id !== id);
    const next = remaining.map((entry, index) => ({ ...entry, isDefault: index === 0 && remaining.length > 0 ? true : false }));
    setSavedAddresses(next);
    writeSavedCustomerAddresses(next);
    showToast('Address Removed', 'The selected address was deleted from your saved list.', 'info');
  };

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<EscalationType>('defective_batch');
  const [ticketPriority, setTicketPriority] = useState<EscalationPriority>('medium');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketOrderId, setTicketOrderId] = useState<string>(customerOrders[0]?.id || '');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  useEffect(() => {
    const selectedStillBelongsToCustomer = selectedOrder && customerOrders.some((order) => order.id === selectedOrder.id);
    if (selectedOrder && !selectedStillBelongsToCustomer) {
      setSelectedOrder(null);
      setShowOrderDetails(false);
    }
    if (!customerOrders.some((order) => order.id === ticketOrderId)) {
      setTicketOrderId(customerOrders[0]?.id || '');
    }
  }, [customerOrders, selectedOrder, ticketOrderId]);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const userName = user?.name || 'Aryan Gandhale';
  const userEmail = user?.email || 'customer@semixlabs.com';
  const userPhone = user?.phone || '+91 98765 43210';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    reportEscalation({
      reportedBy: userName,
      orderId: ticketOrderId || 'SMX-GENERAL',
      type: ticketCategory,
      priority: ticketPriority,
      description: `${ticketSubject}: ${ticketDescription}`
    });

    setTicketSubmitted(true);
    showToast('Support Ticket Raised', 'Fulfillment engineering team notified in portal', 'success');
    setTicketSubject('');
    setTicketDescription('');
    setTimeout(() => setTicketSubmitted(false), 3000);
  };

  const renderOrderTracking = (order: Order) => (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tracking details</p>
          <p className="truncate font-mono text-sm font-extrabold text-slate-800">{order.id}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
          {order.status}
        </span>
      </div>
      <StatusTimeline
        status={order.status}
        timeline={order.statusTimeline}
        trackingNumber={order.trackingNumber}
        courier={order.courier}
        courierTrackingId={order.courierTrackingId}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setShowOrderDetails((isOpen) => !isOpen)}
          aria-expanded={showOrderDetails}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
        >
          <span>
            <span className="block text-xs font-extrabold text-slate-800">Order details</span>
            <span className="mt-0.5 block text-[11px] text-slate-500">
              {order.items.length} component line(s) <span className="mx-1">·</span> ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#561269]">
            {showOrderDetails ? 'Hide details' : 'View order details'}
            <ChevronDown className={`h-4 w-4 transition-transform ${showOrderDetails ? 'rotate-180' : ''}`} />
          </span>
        </button>
        {showOrderDetails && (
          <div className="border-t border-slate-100 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Components in Shipment #{order.id}
              </h4>
              <button
                onClick={() => showToast('Invoice Downloaded', `Tax invoice for ${order.id} saved as PDF`, 'info')}
                className="flex items-center gap-1 text-xs font-bold text-[#561269] hover:text-[#FF6B00] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download GST Tax Invoice (PDF)</span>
              </button>
            </div>
            <div className="mt-2 divide-y divide-slate-100">
              {order.items.map((item, index) => (
                <div key={`${order.id}-${item.sku}-${index}`} className="flex items-center justify-between gap-3 py-2.5 text-xs">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 shrink-0 rounded border border-slate-200 bg-slate-50 p-1 object-contain mix-blend-multiply"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="font-mono text-[11px] text-slate-400">SKU: {item.sku} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setSelectedOrder(null);
            setShowOrderDetails(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-100 cursor-pointer"
        >
          Close tracking
          <ChevronDown className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
      {/* Header Profile Banner */}
      <div id="customer-dashboard-profile" className="relative flex min-h-52 flex-col justify-between gap-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_12px_30px_rgba(27,31,42,0.08)] sm:min-h-56 sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#561269] via-[#8b5b95] to-[#d7bd81]" />
        <div className="customer-profile-identity relative flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="relative flex h-14 w-14 shrink-0 select-none items-center justify-center rounded-xl border border-[#e7d8eb] bg-gradient-to-br from-[#fbf7fc] to-[#f0e7f2] text-lg font-extrabold text-[#561269] shadow-sm sm:h-16 sm:w-16 sm:text-xl">
            {userInitials}
            <span className="absolute bottom-1.5 h-0.5 w-5 rounded-full bg-[#c4a767]" />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8b6b91]">Account overview</p>
            <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
              <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{userName}</h1>
              <span className="shrink-0 rounded-full border border-[#e8d8ec] bg-[#faf6fb] px-2 py-0.5 text-[9px] font-bold uppercase text-[#561269]">
                {user?.role || 'Customer'} Account
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Mail className="h-3 w-3 shrink-0 text-[#8b6b91]" />
                <span className="truncate">{userEmail}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="h-3 w-3 shrink-0 text-[#8b6b91]" />
                <span>{userPhone}</span>
              </span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <User className="h-3 w-3 shrink-0 text-[#8b6b91]" />
                <span>Maker ID: RTZ-{user?.id?.slice(-4) || '8042'}</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="customer-email-button ml-auto flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#561269] bg-[#561269] text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#460e56] cursor-pointer sm:h-auto sm:w-auto sm:px-3 sm:py-2.5"
            title="Preview and export confirmation & welcome emails"
            aria-label="Order and welcome emails"
          >
            <Mail className="w-4 h-4 text-[#ead8a7]" />
            <span className="hidden sm:inline">Order &amp; Welcome Emails</span>
          </button>
        </div>

        <div className="customer-profile-stats relative grid w-full grid-cols-2 gap-2.5 sm:gap-3">
          <div className="customer-profile-stat flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f2eaf4] text-[#561269]">
              <Package className="h-4 w-4" />
            </span>
            <div className="text-left">
              <span className="block text-[9px] font-bold uppercase tracking-wide text-slate-500">Total orders</span>
              <span className="text-base font-extrabold font-mono text-slate-900">{customerOrders.length}</span>
            </div>
          </div>
          <div className="customer-profile-stat flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f0df] text-[#96763d]">
              <Heart className="h-4 w-4" />
            </span>
            <div className="text-left">
              <span className="block text-[9px] font-bold uppercase tracking-wide text-slate-500">Wishlist parts</span>
              <span className="text-base font-extrabold font-mono text-slate-900">{wishlist.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div id="customer-dashboard-tabs" className="grid grid-cols-2 border border-slate-200/80 bg-white p-1.5 rounded-2xl gap-1.5 shadow-sm sm:flex sm:flex-wrap sm:gap-1">
        <button
          onClick={() => setSearchParams({ tab: 'orders' })}
          title="Orders & Live Tracking"
          aria-label="Orders & Live Tracking"
          className={`min-w-0 px-2.5 sm:px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-left sm:whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#561269] text-white shadow-sm shadow-purple-950/15'
              : 'text-slate-600 hover:bg-purple-50 hover:text-[#561269]'
          }`}
        >
          <Package className={`h-4 w-4 shrink-0 ${activeTab === 'orders' ? 'text-orange-300' : 'text-[#FF6B00]'}`} />
          <span className="truncate">Orders &amp; Live Tracking ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'wishlist' })}
          title="Saved Components"
          aria-label="Saved Components"
          className={`min-w-0 px-2.5 sm:px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-left sm:whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-[#561269] text-white shadow-sm shadow-purple-950/15'
              : 'text-slate-600 hover:bg-purple-50 hover:text-[#561269]'
          }`}
        >
          <Heart className={`h-4 w-4 shrink-0 ${activeTab === 'wishlist' ? 'text-rose-200' : 'text-rose-400'}`} />
          <span className="truncate">Saved Components ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'support' })}
          title="Technical Support & RMA Escalation"
          aria-label="Technical Support & RMA Escalation"
          className={`min-w-0 px-2.5 sm:px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-left sm:whitespace-nowrap ${
            activeTab === 'support'
              ? 'bg-[#561269] text-white shadow-sm shadow-purple-950/15'
              : 'text-slate-600 hover:bg-purple-50 hover:text-[#561269]'
          }`}
        >
          <MessageSquare className={`h-4 w-4 shrink-0 ${activeTab === 'support' ? 'text-purple-200' : 'text-purple-500'}`} />
          <span className="truncate">Technical Support &amp; RMA</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'bulk' })}
          title="Bulk Enquiries & Quotes"
          aria-label="Bulk Enquiries & Quotes"
          className={`min-w-0 px-2.5 sm:px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-left sm:whitespace-nowrap ${
            activeTab === 'bulk'
              ? 'bg-[#561269] text-white shadow-sm shadow-purple-950/15'
              : 'text-slate-600 hover:bg-purple-50 hover:text-[#561269]'
          }`}
        >
          <FileText className={`h-4 w-4 shrink-0 ${activeTab === 'bulk' ? 'text-amber-200' : 'text-amber-500'}`} />
          <span className="truncate">Bulk Enquiries &amp; Quotes ({bulkEnquiries.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'address' })}
          title="Shipping & GST Profile"
          aria-label="Shipping & GST Profile"
          className={`col-span-2 min-w-0 px-2.5 sm:px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-left sm:col-span-1 sm:whitespace-nowrap ${
            activeTab === 'address'
              ? 'bg-[#561269] text-white shadow-sm shadow-purple-950/15'
              : 'text-slate-600 hover:bg-purple-50 hover:text-[#561269]'
          }`}
        >
          <MapPin className={`h-4 w-4 shrink-0 ${activeTab === 'address' ? 'text-cyan-200' : 'text-cyan-500'}`} />
          <span className="truncate">Shipping &amp; GST Profile</span>
        </button>
      </div>

      {/* Tab 1: Orders & Live Tracking */}
      {activeTab === 'orders' && (
        <div className="mx-auto max-w-4xl space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
              Select Shipment to Track
            </h3>

            {customerOrders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <React.Fragment key={ord.id}>
                  <div
                    className={`rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-slate-500 bg-slate-50 shadow-md shadow-slate-950/5 ring-1 ring-slate-400/70'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-orange-50 p-1.5">
                        {ord.items[0]?.image && (
                          <img src={ord.items[0].image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate font-mono font-bold text-slate-900">{ord.id}</span>
                          <span
                            className={`shrink-0 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.status === 'packed'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                          {ord.createdAt.slice(0, 10)} <span className="mx-1 text-slate-300">•</span> {ord.items.length} component line(s)
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 font-mono text-xs">
                      <span className="text-slate-500">Amount: ₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedOrder(null);
                            setShowOrderDetails(false);
                          } else {
                            setSelectedOrder(ord);
                            setShowOrderDetails(false);
                          }
                        }}
                        aria-expanded={isSelected}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-[#561269] text-white hover:bg-[#460e56]'
                        }`}
                      >
                        {isSelected ? 'Close tracking' : 'Track Order'}
                        {isSelected
                          ? <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                          : <ChevronRight className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  {isSelected && renderOrderTracking(ord)}
                </React.Fragment>
              );
            })}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
              <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Your Component Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Click the heart icon on any development board or sensor to save it for your next lab build.
              </p>
              <Link
                to="/shop"
                className="bg-[#561269] text-white px-5 py-2.5 rounded-xl font-bold text-xs inline-block"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
                  <div>
                    <img src={p.image} alt={p.name} className="w-full h-36 object-contain mix-blend-multiply mb-3" />
                    <span className="text-[10px] font-bold text-[#561269] uppercase">{p.brand}</span>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mt-0.5">{p.name}</h4>
                    <span className="text-sm font-extrabold text-slate-900 font-mono block mt-2">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        toggleWishlist(p.id);
                        showToast('Moved to Cart', `${p.name} moved to cart`, 'success');
                      }}
                      className="flex-1 bg-[#561269] hover:bg-[#460e56] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Technical Support & RMA Tickets */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertCircle className="w-5 h-5 text-[#FF6B00]" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Open RMA / Technical Support Escalation
                </h3>
                <p className="text-xs text-slate-500">
                  Direct ticket submission to warehouse fulfillment and applications engineers
                </p>
              </div>
            </div>

            {ticketSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Ticket registered in queue! A support engineer will inspect within 2 hours.</span>
              </div>
            ) : null}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Related Order Reference</label>
                  <select
                    value={ticketOrderId}
                    onChange={(e) => setTicketOrderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  >
                    {customerOrders.map((o) => (
                      <option key={o.id} value={o.id}>{o.id} ({o.createdAt.slice(0, 10)})</option>
                    ))}
                    <option value="GENERAL">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as EscalationType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="defective_batch">Defective / Pinout Inconsistency</option>
                    <option value="damaged_stock">Damaged in Transit / Crushed</option>
                    <option value="count_discrepancy">Missing Components / Count Discrepancy</option>
                    <option value="missing_label">Missing Datasheet / Label Error</option>
                    <option value="supplier_delay">Shipping / Dispatch Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Issue Summary</label>
                <input
                  type="text"
                  placeholder="e.g. ESP32-S3 board GPIO14 not responding to 3.3V logic"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Observation & Description</label>
                <textarea
                  rows={4}
                  placeholder="Detail test conditions, multimeter readings, power source (e.g. 5V 2A regulator), and steps taken..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketPriority(p)}
                      className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase cursor-pointer ${
                        ticketPriority === p
                          ? 'bg-[#561269] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket to Team Fulfillment Queue</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-6 text-xs space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Technical RMA Guarantee Policy
            </h4>
            <div className="space-y-2.5 text-slate-600 leading-relaxed">
              <p>
                • <strong>7-Day Dead-On-Arrival (DOA) Replacement:</strong> If an IC, motor driver, or development board fails electrical sanity checks, we dispatch a replacement within 24 hours.
              </p>
              <p>
                • <strong>Anti-Counterfeit Assurance:</strong> All semiconductor batches are traceable to reel lot numbers and authorized silicon distributors.
              </p>
              <p>
                • <strong>Role Switcher Notice:</strong> Switch to the <em>Team Fulfillment</em> or <em>Admin</em> role in the top bar to inspect how your ticket appears in the internal staff ticketing console!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bulk Enquiries */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-base text-[#561269] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF6B00]" />
                <span>Submitted Bulk Component Enquiries</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Track formal commercial quotations and B2B Bill of Materials submissions.
              </p>
            </div>
            <Link
              to="/bulk-enquiry"
              className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-center"
            >
              + Create New Bulk Enquiry
            </Link>
          </div>

          {bulkEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Bulk Enquiries Submitted Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Need volume component reels, cut-tape semiconductors, or institutional bill of materials pricing?
              </p>
              <Link
                to="/bulk-enquiry"
                className="inline-block mt-2 px-5 py-2.5 bg-[#561269] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Open Bulk Enquiry Desk
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bulkEnquiries.map((enq) => (
                <div key={enq.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#561269] bg-[#561269]/5 px-2.5 py-1 rounded-lg border border-[#561269]/15">
                        {enq.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{enq.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{enq.createdAt}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                        {enq.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                      <span className="font-bold text-slate-800">{enq.fullName}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Line Items</span>
                      <span className="font-bold text-slate-800">{enq.items.length} Distinct Parts</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Volume</span>
                      <span className="font-bold text-[#FF6B00]">{enq.totalQuantity.toLocaleString()} pcs</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Date</span>
                      <span className="font-bold text-slate-800">{enq.targetDeliveryDate || 'Standard'}</span>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-50 px-3 py-1.5 font-bold text-slate-700 text-[11px]">
                      Component Breakdown
                    </div>
                    <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                      {enq.items.map((item, idx) => (
                        <div key={idx} className="px-3 py-2 flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{item.partNumber} ({item.category})</span>
                          <span className="font-mono text-slate-600">{item.quantity.toLocaleString()} pcs {item.targetPrice ? `• ${item.targetPrice}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Address */}
      {activeTab === 'address' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-extrabold text-sm text-[#561269]">Saved Billing & Delivery Information</h3>
            <button
              onClick={() => {
                setEditingAddressId(null);
                setAddressForm(getEmptyCustomerAddress({ fullName: user?.name || '', phone: user?.phone || '', email: user?.email || '' }));
              }}
              className="flex items-center gap-2 bg-[#561269] text-white px-3 py-2 rounded-xl text-[11px] font-bold cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              Add New Address
            </button>
          </div>

          {savedAddresses.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-2xl bg-slate-50 p-6 text-center">
              <p className="text-sm font-bold text-slate-700">No saved address yet</p>
              <p className="text-xs text-slate-500 mt-1">Add your shipping or billing address to continue checkout.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedAddresses.map((addressEntry) => (
                <div
                  key={addressEntry.id}
                  className={`rounded-2xl border p-4 text-xs space-y-2 ${addressEntry.isDefault ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{addressEntry.fullName}</p>
                      <p>{addressEntry.street}</p>
                      <p>{addressEntry.landmark ? `${addressEntry.landmark}, ` : ''}{addressEntry.city}, {addressEntry.state} - {addressEntry.pincode}</p>
                      <p className="font-mono text-slate-500 pt-1">Phone: {addressEntry.phone}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {addressEntry.isDefault && (
                        <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-bold">Default</span>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAddressId(addressEntry.id);
                            setAddressForm(addressEntry);
                          }}
                          className="text-[#561269] font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAddress(addressEntry.id)}
                          className="text-rose-600 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  {!addressEntry.isDefault && (
                    <button
                      onClick={() => {
                        const updated = savedAddresses.map((entry) => ({ ...entry, isDefault: entry.id === addressEntry.id }));
                        setSavedAddresses(updated);
                        writeSavedCustomerAddresses(updated);
                      }}
                      className="text-[#561269] font-bold text-[10px] uppercase tracking-wide cursor-pointer"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wide text-slate-700 mb-3">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} placeholder="Full name" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs" />
              <input value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs" />
              <input value={addressForm.email} onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })} placeholder="Email" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs md:col-span-2" />
              <input value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} placeholder="Street / Flat / Building" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs md:col-span-2" />
              <input value={addressForm.landmark || ''} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} placeholder="Landmark (optional)" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs md:col-span-2" />
              <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs" />
              <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs" />
              <input value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} placeholder="Pincode" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs md:col-span-2" />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              {editingAddressId && (
                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm(getEmptyCustomerAddress({ fullName: user?.name || '', phone: user?.phone || '', email: user?.email || '' }));
                  }}
                  className="text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={saveAddress}
                className="bg-[#561269] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactional Email Preview Modal */}
      <EmailPreviewModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};
