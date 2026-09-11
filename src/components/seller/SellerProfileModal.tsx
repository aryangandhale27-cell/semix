import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Phone, Mail, ShieldCheck, Truck, Bell, Check, Save } from 'lucide-react';
import { SellerProfile } from '../../types';

interface SellerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SellerProfile;
  onSave: (updated: SellerProfile) => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<SellerProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#561269] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-800/80 border border-violet-400/30 flex items-center justify-center text-violet-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">Seller Profile & Hub Settings</h3>
                <p className="text-xs text-violet-200">Configure warehouse info, GSTIN, and dispatch alerts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="seller-profile-close-btn"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-violet-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Full Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seller / Staff Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Role</label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full text-xs font-medium pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full text-xs font-semibold pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
                  />
                </div>
              </div>
            </div>

            {/* Warehouse Hub */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fulfilment Hub / Warehouse Address</label>
              <textarea
                rows={2}
                value={formData.warehouseHub}
                onChange={(e) => setFormData({ ...formData, warehouseHub: e.target.value })}
                required
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
              />
            </div>

            {/* GSTIN & Preferred Courier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Merchant GSTIN</label>
                <div className="relative">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    required
                    className="w-full text-xs font-mono font-semibold pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Courier Partner</label>
                <div className="relative">
                  <Truck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.preferredCourier}
                    onChange={(e) => setFormData({ ...formData, preferredCourier: e.target.value })}
                    className="w-full text-xs font-semibold pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
                  >
                    <option value="BlueDart Express">BlueDart Express</option>
                    <option value="Delhivery Air">Delhivery Air</option>
                    <option value="DTDC Priority">DTDC Priority</option>
                    <option value="Speed Post India">Speed Post India</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dispatch & Stock Alert Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <span className="block text-xs font-bold text-slate-800">Dispatch & Inventory Notifications</span>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-violet-700" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Instant Alert on New Pack Assignment</p>
                    <p className="text-[11px] text-slate-500">Trigger banner and sound when order is queued</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifyOnNewOrder}
                  onChange={(e) => setFormData({ ...formData, notifyOnNewOrder: e.target.checked })}
                  className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Low Stock Bin Warnings</p>
                    <p className="text-[11px] text-slate-500">Flag items with fewer than 15 units remaining</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifyOnLowStock}
                  onChange={(e) => setFormData({ ...formData, notifyOnLowStock: e.target.checked })}
                  className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="seller-profile-save-btn"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#561269] hover:bg-violet-900 rounded-xl transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Hub Profile</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
