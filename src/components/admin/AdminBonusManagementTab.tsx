import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AvailableSeller, SellerBonusRecord } from '../../types';
import { formatInrBonus } from '../../services/bonusService';
import {
  Award,
  Search,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Store,
  ArrowRight,
  TrendingUp,
  X,
  History,
  ShieldCheck,
  Building,
  RefreshCw,
  Info
} from 'lucide-react';

export const AdminBonusManagementTab: React.FC = () => {
  const { availableSellers, sellerBonuses, updateSellerBonus, showToast } = useApp();
  const { user: currentAdmin } = useAuth();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editingSeller, setEditingSeller] = useState<AvailableSeller | null>(null);
  const [bonusInput, setBonusInput] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState<AvailableSeller | null>(null);

  // Quick preset amounts in INR
  const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

  // Merge availableSellers with sellerBonuses record
  const sellersWithBonuses = useMemo(() => {
    return availableSellers.map((seller) => {
      const record = sellerBonuses[seller.id];
      const currentAmount = record ? record.bonusAmount : seller.bonusAmount || 0;
      const updatedAt = record?.updatedAt || seller.bonusUpdatedAt;
      const updatedBy = record?.updatedBy || seller.bonusUpdatedBy || 'Admin Controller';
      const history = record?.history || [];
      return {
        ...seller,
        effectiveBonus: currentAmount,
        lastUpdatedAt: updatedAt,
        lastUpdatedBy: updatedBy,
        bonusHistory: history,
      };
    });
  }, [availableSellers, sellerBonuses]);

  // Filtered sellers
  const filteredSellers = useMemo(() => {
    if (!searchQuery.trim()) return sellersWithBonuses;
    const q = searchQuery.toLowerCase().trim();
    return sellersWithBonuses.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.warehouseHub && s.warehouseHub.toLowerCase().includes(q)) ||
        (s.gstin && s.gstin.toLowerCase().includes(q))
    );
  }, [sellersWithBonuses, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalBonus = sellersWithBonuses.reduce((acc, s) => acc + s.effectiveBonus, 0);
    const sellersWithActiveBonus = sellersWithBonuses.filter((s) => s.effectiveBonus > 0).length;
    const avgBonus = sellersWithBonuses.length > 0 ? Math.round(totalBonus / sellersWithBonuses.length) : 0;
    return { totalBonus, sellersWithActiveBonus, avgBonus, count: sellersWithBonuses.length };
  }, [sellersWithBonuses]);

  // Open Edit Modal
  const handleOpenEdit = (seller: AvailableSeller & { effectiveBonus: number }) => {
    setEditingSeller(seller);
    setBonusInput(String(seller.effectiveBonus || ''));
    setInputError(null);
  };

  // Close Modal
  const handleCloseEdit = () => {
    if (isSaving) return;
    setEditingSeller(null);
    setBonusInput('');
    setInputError(null);
  };

  // Handle Save
  const handleSaveBonus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingSeller) return;

    const trimmed = bonusInput.trim();

    // Validation: cannot be empty
    if (trimmed === '') {
      setInputError('Please enter a valid bonus amount.');
      return;
    }

    // Validation: regex for positive integer or 2 decimal currency
    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      setInputError('Please enter a valid bonus amount.');
      return;
    }

    const numAmount = Number(trimmed);
    if (isNaN(numAmount) || !isFinite(numAmount) || numAmount < 0) {
      setInputError('Please enter a valid bonus amount.');
      return;
    }

    if (numAmount > 10000000) {
      setInputError('Bonus amount cannot exceed ₹1,00,00,000 per seller.');
      return;
    }

    setIsSaving(true);
    setInputError(null);

    try {
      const adminName = currentAdmin?.name || 'Admin Controller';
      const result = await updateSellerBonus(
        editingSeller.id,
        numAmount,
        editingSeller.name,
        editingSeller.email
      );

      if (result.success) {
        handleCloseEdit();
      } else {
        setInputError(result.error || 'Unable to update bonus. Please try again.');
      }
    } catch (err: any) {
      console.error('[AdminBonus] Save failed:', err);
      setInputError('Unable to update bonus. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="admin-bonus-management-section">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            <span>Admin Panel</span>
            <span>→</span>
            <span>Sellers</span>
            <span>→</span>
            <span className="text-[#FF6B00]">Bonuses</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00]">
              <Award className="w-5 h-5" />
            </div>
            Seller Bonus Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Assign, adjust, and audit performance incentives and festival bonuses across platform sellers.
          </p>
        </div>

        {/* Aggregate KPI Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Total Allocated</div>
            <div className="text-xl font-black text-gray-900 mt-0.5">{formatInrBonus(metrics.totalBonus)}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Incentivized Sellers</div>
            <div className="text-xl font-black text-gray-900 mt-0.5">
              {metrics.sellersWithActiveBonus} <span className="text-xs font-medium text-gray-400">/ {metrics.count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              BONUSES ({filteredSellers.length} Sellers)
            </span>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="admin-bonus-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seller by name, ID, email..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bonuses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="admin-seller-bonuses-table">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Seller</th>
                <th className="py-3.5 px-6">Seller ID / Hub</th>
                <th className="py-3.5 px-6">Current Bonus</th>
                <th className="py-3.5 px-6">Last Updated</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Store className="w-8 h-8 text-gray-300" />
                      <p className="font-medium text-gray-600">No sellers matched your search.</p>
                      <p className="text-xs text-gray-400">Try clearing the search query to see all registered sellers.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => {
                  return (
                    <tr
                      key={seller.id}
                      className="hover:bg-orange-50/30 transition-colors group"
                      id={`seller-bonus-row-${seller.id}`}
                    >
                      {/* Seller Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm border border-gray-200 group-hover:border-orange-200 group-hover:bg-orange-100 group-hover:text-[#FF6B00] transition-colors">
                            {seller.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{seller.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <span>{seller.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Seller ID / Hub Column */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            {seller.id}
                          </span>
                          {seller.warehouseHub && (
                            <div className="text-xs text-gray-500 truncate max-w-xs flex items-center gap-1" title={seller.warehouseHub}>
                              <Building className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{seller.warehouseHub}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Current Bonus Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1.5 rounded-xl font-bold text-base border inline-flex items-center gap-1.5 ${
                            seller.effectiveBonus > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            <span>{formatInrBonus(seller.effectiveBonus)}</span>
                          </div>
                          {seller.bonusHistory && seller.bonusHistory.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowHistoryModal(seller)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View bonus audit history"
                            >
                              <History className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Last Updated Column */}
                      <td className="py-4 px-6">
                        {seller.lastUpdatedAt ? (
                          <div className="text-xs text-gray-500">
                            <div className="font-medium text-gray-700 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {new Date(seller.lastUpdatedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">by {seller.lastUpdatedBy}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Default Allocation</span>
                        )}
                      </td>

                      {/* Edit Button Column */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          id={`btn-edit-bonus-${seller.id}`}
                          onClick={() => handleOpenEdit(seller)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-gray-800 border border-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-orange-50/50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Access Control: Only authorized administrators can assign or alter seller bonuses. Sellers have read-only visibility.</span>
          </div>
          <div className="text-gray-400">
            Currency: <span className="font-semibold text-gray-600">INR (₹)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ADD / SET BONUS MODAL                                                  */}
      {/* ========================================================================= */}
      {editingSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden animate-scaleIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-bonus-title"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="modal-bonus-title" className="text-base font-bold text-gray-900">
                    Edit Seller Bonus
                  </h3>
                  <p className="text-xs text-gray-500">Manage incentive amount for seller</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={isSaving}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBonus} className="p-6 space-y-5">
              {/* Seller Details Card */}
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-sm">
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Seller</div>
                <div className="font-bold text-gray-900 text-base">{editingSeller.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{editingSeller.email} • ID: {editingSeller.id}</div>
                {editingSeller.warehouseHub && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Building className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{editingSeller.warehouseHub}</span>
                  </div>
                )}
              </div>

              {/* Bonus Amount Input */}
              <div>
                <label htmlFor="bonus-amount-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bonus Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 font-bold text-base">
                    ₹
                  </div>
                  <input
                    type="number"
                    id="bonus-amount-input"
                    name="bonusAmount"
                    min="0"
                    step="1"
                    autoFocus
                    disabled={isSaving}
                    value={bonusInput}
                    onChange={(e) => {
                      setBonusInput(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="Enter amount (e.g. 5000)"
                    className={`w-full pl-8 pr-4 py-2.5 bg-white border rounded-xl text-base font-bold text-gray-900 focus:outline-none transition-colors ${
                      inputError
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20'
                    }`}
                  />
                </div>

                {/* Quick Presets */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-gray-400 mr-1">Presets:</span>
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={isSaving}
                      onClick={() => {
                        setBonusInput(String(preset));
                        if (inputError) setInputError(null);
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-orange-100 hover:text-[#FF6B00] text-gray-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {formatInrBonus(preset)}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setBonusInput('0');
                      if (inputError) setInputError(null);
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Reset (₹0)
                  </button>
                </div>

                {/* Inline Error Message */}
                {inputError && (
                  <div className="mt-2.5 text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{inputError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  id="btn-cancel-bonus-modal"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-bonus-modal"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BONUS AUDIT HISTORY MODAL                                              */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Bonus Audit History</h3>
                  <p className="text-xs text-gray-500">{showHistoryModal.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto space-y-3">
              {showHistoryModal.bonusHistory && showHistoryModal.bonusHistory.length > 0 ? (
                showHistoryModal.bonusHistory.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-gray-400 line-through">{formatInrBonus(item.previousBonus)}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {formatInrBonus(item.newBonus)}
                        </span>
                      </div>
                      <span className="text-gray-400">
                        {new Date(item.updatedAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span>Updated by: <strong className="text-gray-700">{item.updatedBy}</strong></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No modification records found for this seller.
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
