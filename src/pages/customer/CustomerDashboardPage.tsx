import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { Order, EscalationType, EscalationPriority } from '../../types';
import { 
  Package, 
  Heart, 
  MapPin, 
  AlertCircle, 
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
  Mail
} from 'lucide-react';
import { EmailPreviewModal } from '../../components/common/EmailPreviewModal';

export const CustomerDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, wishlist, products, addToCart, toggleWishlist, reportEscalation, showToast, bulkEnquiries } = useApp();
  const { user } = useAuth();

  const activeTab = searchParams.get('tab') || 'orders';
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<EscalationType>('defective_batch');
  const [ticketPriority, setTicketPriority] = useState<EscalationPriority>('medium');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketOrderId, setTicketOrderId] = useState<string>(orders[0]?.id || '');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-[#561269] to-[#380847] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg border border-[#561269]/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6B00] text-white font-extrabold text-xl flex items-center justify-center shadow-md border border-orange-400/30 shrink-0 select-none">
            {userInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{userName}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {user?.role || 'Customer'} Account
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              {userEmail} • Mobile: {userPhone} • Maker ID: RTZ-{user?.id?.slice(-4) || '8042'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all shadow-xs cursor-pointer"
            title="Preview and export confirmation & welcome emails"
          >
            <Mail className="w-4 h-4 text-[#FF6B00]" />
            <span>Order & Welcome Emails</span>
          </button>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center border border-white/15">
            <span className="text-[10px] text-purple-200 block uppercase font-bold">Total Orders</span>
            <span className="text-lg font-bold font-mono text-white">{orders.length}</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center border border-white/15">
            <span className="text-[10px] text-purple-200 block uppercase font-bold">Wishlist Parts</span>
            <span className="text-lg font-bold font-mono text-[#FF6B00]">{wishlist.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-1 rounded-xl gap-1 overflow-x-auto">
        <button
          onClick={() => setSearchParams({ tab: 'orders' })}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#561269] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-[#FF6B00]" />
          <span>Orders & Live Tracking ({orders.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'wishlist' })}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-[#561269] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Saved Components ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'support' })}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'support'
              ? 'bg-[#561269] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>Technical Support & RMA Escalation</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'bulk' })}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bulk'
              ? 'bg-[#561269] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Bulk Enquiries & Quotes ({bulkEnquiries.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'address' })}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'address'
              ? 'bg-[#561269] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Shipping & GST Profile</span>
        </button>
      </div>

      {/* Tab 1: Orders & Live Tracking */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order Selector List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
              Select Shipment to Track
            </h3>

            {orders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#561269] bg-[#561269]/5/50 shadow-sm ring-1 ring-[#561269]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
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

                  <p className="text-xs text-slate-500 font-medium">
                    Placed on {ord.createdAt.slice(0, 10)} • {ord.items.length} component line(s)
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-slate-100 font-mono">
                    <span className="text-slate-500">Amount: ₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[#561269] font-bold flex items-center gap-0.5">
                      Track Live <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Timeline & Invoice View */}
          <div className="lg:col-span-7 space-y-6">
            {selectedOrder ? (
              <div className="space-y-6">
                <StatusTimeline
                  status={selectedOrder.status}
                  timeline={selectedOrder.statusTimeline}
                  trackingNumber={selectedOrder.trackingNumber}
                  courier={selectedOrder.courier}
                  courierTrackingId={selectedOrder.courierTrackingId}
                />

                {/* Order Items Breakdown */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Components in Shipment #{selectedOrder.id}
                    </h4>
                    <button
                      onClick={() => showToast('Invoice Downloaded', `Tax invoice for ${selectedOrder.id} saved as PDF`, 'info')}
                      className="text-xs font-bold text-[#561269] hover:text-[#FF6B00] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download GST Tax Invoice (PDF)</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-10 h-10 object-contain mix-blend-multiply bg-slate-50 rounded p-1 border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{it.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {it.sku} • Qty: {it.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-slate-900 font-mono">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs">Select an order to track.</p>
            )}
          </div>
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
                    {orders.map((o) => (
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-4">
          <h3 className="font-extrabold text-sm text-[#561269]">Saved Billing & Delivery Information</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
            <p className="font-bold text-slate-900 text-sm">Vikramaditya Sharma (Primary Prototyping Lab)</p>
            <p>Flat 402, Prithvi Silicon Heights, Outer Ring Road, Near Marathahalli Bridge</p>
            <p>Bengaluru, Karnataka - 560037</p>
            <p className="font-mono text-slate-500 pt-1">Phone: +91 98451 23098</p>
            <p className="font-mono text-emerald-700 font-bold">GSTIN: 29AABCR8902P1Z5 (Registered for B2B Invoicing)</p>
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
