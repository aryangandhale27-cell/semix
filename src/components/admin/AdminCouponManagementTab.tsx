import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  Power,
  RotateCw,
  Copy,
  Check,
  TrendingUp,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  ShieldCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Coupon, CouponDiscountType, CouponStatus } from '../../types';
import {
  fetchAllCoupons,
  subscribeToCoupons,
  saveCouponToFirestore,
  toggleCouponStatus,
  deleteCouponFromFirestore,
  seedInitialCoupons,
  DEFAULT_INITIAL_COUPONS
} from '../../services/couponService';
import { useApp } from '../../context/AppContext';

export const AdminCouponManagementTab: React.FC = () => {
  const { showToast } = useApp();
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_INITIAL_COUPONS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteConfirmCode, setDeleteConfirmCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<CouponDiscountType>('percentage');
  const [formValue, setFormValue] = useState<number | ''>(10);
  const [formMinOrder, setFormMinOrder] = useState<number | ''>(300);
  const [formMaxDiscount, setFormMaxDiscount] = useState<number | ''>(500);
  const [formStartDate, setFormStartDate] = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formTotalLimit, setFormTotalLimit] = useState<number | ''>(100);
  const [formPerCustomerLimit, setFormPerCustomerLimit] = useState<number | ''>(1);
  const [formStatus, setFormStatus] = useState<CouponStatus>('active');

  // Realtime Firestore Subscription
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToCoupons(
      (data) => {
        setCoupons(data);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Coupon subscription error:', err);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Format dates for input helper
  const toDatetimeLocal = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    } catch {
      return '';
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormCode('');
    setFormType('percentage');
    setFormValue(10);
    setFormMinOrder(300);
    setFormMaxDiscount(500);
    const now = new Date();
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    setFormStartDate(toDatetimeLocal(now.toISOString()));
    setFormExpiryDate(toDatetimeLocal(expiry.toISOString()));
    setFormTotalLimit(100);
    setFormPerCustomerLimit(1);
    setFormStatus('active');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cp: Coupon) => {
    setEditingCoupon(cp);
    setFormCode(cp.code);
    setFormType(cp.discountType);
    setFormValue(cp.discountValue);
    setFormMinOrder(cp.minOrderValue);
    setFormMaxDiscount(cp.maxDiscount !== null ? cp.maxDiscount : '');
    setFormStartDate(toDatetimeLocal(cp.startDate));
    setFormExpiryDate(toDatetimeLocal(cp.expiryDate));
    setFormTotalLimit(cp.totalUsageLimit);
    setFormPerCustomerLimit(cp.perCustomerLimit);
    setFormStatus(cp.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Form submission with rigorous validation
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = formCode.trim().toUpperCase();
    if (!cleanCode) {
      setFormError('Coupon code is required.');
      return;
    }

    if (!/^[A-Z0-9_-]{3,20}$/.test(cleanCode)) {
      setFormError('Code must be 3-20 alphanumeric characters (hyphens and underscores allowed).');
      return;
    }

    const numValue = Number(formValue);
    if (isNaN(numValue) || numValue <= 0) {
      setFormError('Discount value must be a positive number.');
      return;
    }

    if (formType === 'percentage' && numValue > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    const numMinOrder = Number(formMinOrder);
    if (isNaN(numMinOrder) || numMinOrder < 0) {
      setFormError('Minimum order value must be 0 or greater.');
      return;
    }

    let numMaxDiscount: number | null = null;
    if (formType === 'percentage' && formMaxDiscount !== '' && formMaxDiscount !== null) {
      numMaxDiscount = Number(formMaxDiscount);
      if (isNaN(numMaxDiscount) || numMaxDiscount <= 0) {
        setFormError('Maximum discount cap must be a positive number.');
        return;
      }
    }

    if (!formStartDate || !formExpiryDate) {
      setFormError('Please select both start date and expiry date.');
      return;
    }

    const start = new Date(formStartDate);
    const end = new Date(formExpiryDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setFormError('Invalid date format provided.');
      return;
    }

    if (end <= start) {
      setFormError('Expiry date must be strictly after the start date.');
      return;
    }

    const numTotalLimit = Number(formTotalLimit);
    if (isNaN(numTotalLimit) || numTotalLimit <= 0) {
      setFormError('Total usage limit must be at least 1.');
      return;
    }

    const numPerCustomerLimit = Number(formPerCustomerLimit);
    if (isNaN(numPerCustomerLimit) || numPerCustomerLimit <= 0) {
      setFormError('Per-customer usage limit must be at least 1.');
      return;
    }

    setIsSubmitting(true);
    try {
      const couponPayload: Coupon = {
        code: cleanCode,
        discountType: formType,
        discountValue: numValue,
        minOrderValue: numMinOrder,
        maxDiscount: numMaxDiscount,
        startDate: start.toISOString(),
        expiryDate: end.toISOString(),
        totalUsageLimit: numTotalLimit,
        perCustomerLimit: numPerCustomerLimit,
        timesUsed: editingCoupon ? editingCoupon.timesUsed : 0,
        status: formStatus,
        createdAt: editingCoupon?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveCouponToFirestore(couponPayload);
      showToast(
        editingCoupon ? 'Coupon Updated' : 'Coupon Created',
        `Coupon ${cleanCode} has been saved to Firebase Firestore.`,
        'success'
      );
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await toggleCouponStatus(coupon.code, coupon.status);
      showToast(
        'Status Updated',
        `Coupon ${coupon.code} is now ${coupon.status === 'active' ? 'Inactive' : 'Active'}.`,
        'info'
      );
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      await deleteCouponFromFirestore(code);
      setDeleteConfirmCode(null);
      showToast('Coupon Deleted', `Coupon ${code} removed from Firestore.`, 'warning');
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to delete coupon', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
    showToast('Copied', `Coupon code "${text}" copied to clipboard`, 'info');
  };

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((cp) => {
      const matchesSearch =
        cp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cp.discountType.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const now = new Date();
      const isExpired = new Date(cp.expiryDate) < now;

      if (statusFilter === 'active') {
        return cp.status === 'active' && !isExpired;
      }
      if (statusFilter === 'inactive') {
        return cp.status === 'inactive';
      }
      if (statusFilter === 'expired') {
        return isExpired;
      }
      return true;
    });
  }, [coupons, searchQuery, statusFilter]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = coupons.length;
    const now = new Date();
    const active = coupons.filter((c) => c.status === 'active' && new Date(c.expiryDate) >= now).length;
    const totalUses = coupons.reduce((acc, c) => acc + (c.timesUsed || 0), 0);
    const expired = coupons.filter((c) => new Date(c.expiryDate) < now).length;
    return { total, active, totalUses, expired };
  }, [coupons]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#561269] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Coupons & Discount Management
              </h2>
              <p className="text-xs text-slate-500">
                Configure promotional codes, percentage or flat discounts, and per-user limits on Firestore
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              seedInitialCoupons()
                .then(() => showToast('Coupons Restored', 'Standard store vouchers seeded to Firebase', 'success'))
                .catch((e) => showToast('Error', e.message, 'error'));
            }}
            title="Reset standard coupons in Firestore"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Coupons</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {stats.active}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Out of {stats.total} total vouchers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Redemptions</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-[#561269]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#561269] mt-2 font-mono">
            {stats.totalUses}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Orders with applied coupons</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Expired Vouchers</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2 font-mono">
            {stats.expired}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Passed expiry date</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Firestore Sync</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">coupons/* & /usages/*</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by coupon code (e.g. ORDER10)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#561269] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {(['all', 'active', 'inactive', 'expired'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors shrink-0 ${
                statusFilter === filter
                  ? 'bg-[#561269] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Type & Value</th>
                <th className="py-3 px-4">Order Req.</th>
                <th className="py-3 px-4">Max Cap</th>
                <th className="py-3 px-4">Validity Period</th>
                <th className="py-3 px-4">Usage Limits</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Tag className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No coupons found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery ? 'Try adjusting your search query' : 'Click "Create Coupon" to add your first promotion'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const now = new Date();
                  const isExpired = new Date(coupon.expiryDate) < now;
                  const isNotStarted = new Date(coupon.startDate) > now;
                  const usageRatio = coupon.totalUsageLimit > 0 ? (coupon.timesUsed / coupon.totalUsageLimit) * 100 : 0;
                  const isLimitReached = coupon.timesUsed >= coupon.totalUsageLimit;

                  return (
                    <tr key={coupon.code} className="hover:bg-slate-50/60 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-[#561269] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            title="Copy code"
                            className="text-slate-400 hover:text-slate-600 p-1"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Type & Value */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold">
                          {coupon.discountType === 'percentage' ? (
                            <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                              <Percent className="w-3 h-3" />
                              <span>{coupon.discountValue}% OFF</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              <IndianRupee className="w-3 h-3" />
                              <span>₹{coupon.discountValue} Flat</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Min Order */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue.toLocaleString('en-IN')}` : 'No Min.'}
                      </td>

                      {/* Max Cap */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {coupon.discountType === 'percentage' && coupon.maxDiscount
                          ? `₹${coupon.maxDiscount.toLocaleString('en-IN')}`
                          : <span className="text-slate-400 italic">None</span>}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="text-slate-400">Start:</span>
                            <span>{new Date(coupon.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${isExpired ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                            <span className="text-slate-400">Exp:</span>
                            <span>{new Date(coupon.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            {isExpired && <span className="text-[10px] bg-rose-100 text-rose-700 px-1 rounded font-bold">Expired</span>}
                            {isNotStarted && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded font-bold">Upcoming</span>}
                          </div>
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 w-28">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="font-bold text-slate-800">{coupon.timesUsed}</span>
                            <span className="text-slate-400">/ {coupon.totalUsageLimit}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isLimitReached
                                  ? 'bg-rose-500'
                                  : usageRatio > 70
                                  ? 'bg-amber-500'
                                  : 'bg-purple-600'
                              }`}
                              style={{ width: `${Math.min(100, usageRatio)}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Limit: {coupon.perCustomerLimit}/customer
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          title={`Click to ${coupon.status === 'active' ? 'Deactivate' : 'Activate'}`}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-all hover:scale-105 ${
                            coupon.status === 'active' && !isExpired
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              coupon.status === 'active' && !isExpired ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                          />
                          <span>{coupon.status === 'active' && !isExpired ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(coupon)}
                            title="Edit coupon"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#561269] hover:bg-purple-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmCode(coupon.code)}
                            title="Delete coupon"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Guide Box for Firebase Structure */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-[#561269]" />
          <span>Firebase Firestore Architecture Specification</span>
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          Coupons are stored under collection <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-purple-900 font-bold">coupons/&#123;COUPON_CODE&#125;</code>.
          Customer redemption tracking occurs transactionally under subcollection <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-purple-900 font-bold">coupons/&#123;code&#125;/usages/&#123;userId&#125;</code>,
          enforcing the 8-rule validation atomically at order placement.
        </p>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#561269] flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promotional Coupon'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coupon Code (Auto-Uppercase) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={!!editingCoupon}
                    placeholder="e.g. ORDER10, SUMMER50"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm text-[#561269] uppercase focus:ring-2 focus:ring-[#561269] focus:outline-none disabled:bg-slate-100"
                  />
                  {formCode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Preview: {formCode.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Discount Type Radio / Select */}
              <div className="grid grid-cols-2 gap-3">
                <label
                  onClick={() => setFormType('percentage')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    formType === 'percentage'
                      ? 'border-[#561269] bg-purple-50/50 text-[#561269] ring-2 ring-purple-200'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    <span className="text-xs font-bold">Percentage (%)</span>
                  </div>
                  <input
                    type="radio"
                    name="discountType"
                    checked={formType === 'percentage'}
                    onChange={() => setFormType('percentage')}
                    className="accent-[#561269]"
                  />
                </label>

                <label
                  onClick={() => setFormType('fixed')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    formType === 'fixed'
                      ? 'border-[#561269] bg-purple-50/50 text-[#561269] ring-2 ring-purple-200'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-xs font-bold">Fixed Amount (₹)</span>
                  </div>
                  <input
                    type="radio"
                    name="discountType"
                    checked={formType === 'fixed'}
                    onChange={() => setFormType('fixed')}
                    className="accent-[#561269]"
                  />
                </label>
              </div>

              {/* Value & Minimum Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Value {formType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formType === 'percentage' ? '100' : '99999'}
                    placeholder={formType === 'percentage' ? '10' : '100'}
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min. Order Value (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="300"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                </div>
              </div>

              {/* Max Discount Cap (only for percentage) */}
              {formType === 'percentage' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Maximum Discount Cap (₹)
                    <span className="text-slate-400 font-normal ml-1">(Optional cap for percentage discount)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    value={formMaxDiscount}
                    onChange={(e) => setFormMaxDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                </div>
              )}

              {/* Validity Period */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiry Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                </div>
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Global Total Limit *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="100"
                    value={formTotalLimit}
                    onChange={(e) => setFormTotalLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Per-Customer Limit *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1"
                    value={formPerCustomerLimit}
                    onChange={(e) => setFormPerCustomerLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800">Coupon Status</span>
                  <p className="text-[11px] text-slate-500">Enable or disable redemption on checkout</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormStatus((s) => (s === 'active' ? 'inactive' : 'active'))}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    formStatus === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${formStatus === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                  <span>{formStatus === 'active' ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#561269] hover:bg-[#460e56] text-white text-xs font-extrabold shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to Firestore...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmCode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Delete Coupon {deleteConfirmCode}?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                This will permanently delete this coupon from Firestore. Customers will no longer be able to apply this code.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmCode(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCoupon(deleteConfirmCode)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
