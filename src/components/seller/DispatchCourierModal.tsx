import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, Hash, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { Order } from '../../types';

interface DispatchCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmDispatch: (orderId: string, courierName: string, trackingNumber: string, note?: string) => void;
}

export const DispatchCourierModal: React.FC<DispatchCourierModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirmDispatch,
}) => {
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState(() => {
    return `BLUEDART-${Math.floor(100000000 + Math.random() * 900000000)}`;
  });
  const [note, setNote] = useState('Handed over to carrier at loading bay with anti-static security seals.');

  if (!isOpen || !order) return null;

  const handleCourierChange = (newCourier: string) => {
    setCourierName(newCourier);
    const prefix = newCourier.split(' ')[0].toUpperCase();
    setTrackingNumber(`${prefix}-${Math.floor(100000000 + Math.random() * 900000000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDispatch(order.id, courierName, trackingNumber, note);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#561269] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-800/80 border border-violet-400/30 flex items-center justify-center text-violet-200">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Handover to Courier / Dispatch</h3>
                <p className="text-[11px] text-violet-200 font-mono">Order ID: {order.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="dispatch-modal-close-btn"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-violet-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl text-xs text-violet-950">
              <span className="font-bold block">Destination:</span>
              <p className="text-slate-600 mt-0.5">
                {order.customer.fullName} • {order.customer.city}, {order.customer.state} ({order.customer.pincode})
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                {order.items.length} items ({order.items.reduce((acc, i) => acc + i.quantity, 0)} total pcs)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carrier / Logistics Provider</label>
              <select
                value={courierName}
                onChange={(e) => handleCourierChange(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
              >
                <option value="BlueDart Express">BlueDart Express (Air Priority)</option>
                <option value="Delhivery Air">Delhivery Air Direct</option>
                <option value="DTDC Priority">DTDC Priority Express</option>
                <option value="Speed Post India">Speed Post (India Post EMS)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Courier AWB / Tracking ID</label>
                <button
                  type="button"
                  onClick={() => {
                    const prefix = courierName.split(' ')[0].toUpperCase();
                    setTrackingNumber(`${prefix}-${Math.floor(100000000 + Math.random() * 900000000)}`);
                  }}
                  className="text-[11px] text-violet-700 hover:text-violet-900 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate AWB</span>
                </button>
              </div>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  className="w-full text-xs font-mono font-semibold pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch & Security Note</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#561269] focus:ring-1 focus:ring-[#561269]"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="confirm-dispatch-btn"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-violet-800 hover:bg-violet-900 rounded-xl transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Carrier Handover</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
