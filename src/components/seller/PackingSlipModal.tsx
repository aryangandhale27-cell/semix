import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, CheckSquare, ShieldCheck, Cpu, PackageCheck } from 'lucide-react';
import { Order, SellerProfile } from '../../types';
import { getBinLocationForSku } from '../../mockData/sellerData';
import { SemixLabsLogo } from '../common/SemixLabsLogo';

interface PackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  profile: SellerProfile;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({
  isOpen,
  onClose,
  order,
  profile,
}) => {
  if (!isOpen || !order) return null;

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Action Top Bar (Hidden during print) */}
          <div className="bg-[#561269] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-violet-300" />
              <div>
                <h3 className="text-sm font-bold">Standard Warehouse Packing Slip</h3>
                <p className="text-xs text-violet-200 font-mono">Order Ref: {order.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                id="print-packing-slip-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Packing Slip</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-violet-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Packing Document Area */}
          <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans space-y-6">
            {/* Header / Brand */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <SemixLabsLogo variant="dark" size="sm" />
                </div>
                <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                  <p className="font-semibold text-slate-800">{profile.warehouseHub}</p>
                  <p>GSTIN: <span className="font-mono">{profile.gstin}</span> • Phone: {profile.phone}</p>
                  <p>Fulfilment Merchant: <span className="font-semibold">{profile.name}</span></p>
                </div>
              </div>

              {/* Order Meta & Barcode simulation */}
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold font-mono uppercase mb-2">
                  PACKING SLIP
                </span>
                <p className="text-base font-black font-mono text-slate-900">{order.id}</p>
                <p className="text-xs text-slate-500">Date: {order.createdAt?.split('T')[0] || '2026-09-03'}</p>

                {/* Simulated Barcode */}
                <div className="mt-2 inline-flex flex-col items-end">
                  <div className="flex items-end h-8 gap-0.5 opacity-85">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 2, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 3].map((w, i) => (
                      <div
                        key={i}
                        className="bg-slate-900 h-full"
                        style={{ width: `${w * 1.5}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 tracking-widest block mt-0.5">
                    *{order.id.replace('-', '')}*
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Shipping Address */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                  SHIP TO RECIPIENT
                </span>
                <p className="font-bold text-slate-900 text-sm">{order.customer.fullName}</p>
                <p className="text-slate-600 mt-0.5">{order.customer.street}</p>
                {order.customer.landmark && <p className="text-slate-500">Landmark: {order.customer.landmark}</p>}
                <p className="font-medium text-slate-800 mt-0.5">
                  {order.customer.city}, {order.customer.state} - <span className="font-mono font-bold">{order.customer.pincode}</span>
                </p>
                <p className="text-slate-600 mt-1">Phone: <span className="font-mono">{order.customer.phone}</span></p>
              </div>

              <div className="border-l border-slate-200 pl-4">
                <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                  DISPATCH DETAILS
                </span>
                <p className="text-slate-700">Courier Partner: <span className="font-bold text-slate-900">{profile.preferredCourier}</span></p>
                <p className="text-slate-700 mt-1">Status: <span className="font-bold uppercase text-violet-700 font-mono">{order.status}</span></p>
                <p className="text-slate-700 mt-1">Carrier Tracking: <span className="font-mono font-bold text-slate-900">{order.trackingNumber}</span></p>
                <p className="text-slate-700 mt-1">Total Items: <span className="font-bold">{order.items.length} SKUs ({totalQuantity} units)</span></p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-2.5 px-2">Bin / Shelf</th>
                    <th className="py-2.5 px-2">SKU Part No.</th>
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-center">ESD Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-2 font-mono font-bold text-violet-800">
                        <span className="px-1.5 py-0.5 rounded bg-violet-100/70 border border-violet-200 text-xs">
                          {getBinLocationForSku(item.sku)}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-600 text-[11px]">
                        {item.sku || 'SKU-COMP-001'}
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-900 max-w-xs">
                        {item.name}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-900 font-mono text-sm">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="w-4 h-4 rounded border-2 border-slate-400 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sign-off & Quality Assurance block */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-900 block">Quality & ESD Packaging Standard:</span>
                <p className="text-[11px] text-amber-800">
                  All semiconductor components, MOSFETs, and development boards must be secured in conductive ESD-shielding bags with moisture desiccant.
                </p>
              </div>

              <div className="flex flex-col justify-end space-y-2">
                <div className="border-b border-slate-400 pb-1 flex justify-between items-end">
                  <span className="text-[11px] text-slate-500">Packed By Signature:</span>
                  <span className="font-mono text-xs font-bold text-slate-800">{profile.name}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Inspector ID: STAFF-VKR-01</span>
                  <span>Seal Verification: PASS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
