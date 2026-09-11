import React, { useState } from 'react';
import { Order, AvailableSeller } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Store, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Package, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AdminOrderAssignmentModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrderAssignmentModal: React.FC<AdminOrderAssignmentModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { availableSellers, orders, assignSellerToOrder } = useApp();
  const [selectedSellerId, setSelectedSellerId] = useState<string>(() => {
    return order?.assignedSellerId || (availableSellers[0]?.id || '');
  });
  const [assignmentNote, setAssignmentNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Keep selected seller in sync if order changes
  React.useEffect(() => {
    if (order?.assignedSellerId) {
      setSelectedSellerId(order.assignedSellerId);
    } else if (availableSellers.length > 0) {
      setSelectedSellerId(availableSellers[0].id);
    }
    setAssignmentNote('');
  }, [order, availableSellers]);

  if (!isOpen || !order) return null;

  const isReassignment = Boolean(order.assignedSellerId);
  const selectedSeller = availableSellers.find((s) => s.id === selectedSellerId);

  // Compute active order workload for each seller
  const getSellerActiveLoad = (sellerId: string) => {
    return orders.filter(
      (o) => o.assignedSellerId === sellerId && o.status !== 'delivered' && o.status !== 'cancelled'
    ).length;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeller) return;

    setIsSubmitting(true);
    assignSellerToOrder(order.id, selectedSeller.id, selectedSeller.name, assignmentNote.trim() || undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="admin-assign-seller-modal"
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#561269] to-[#380847] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Store className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {isReassignment ? 'Reassign Fulfillment Seller' : 'Assign Seller & Fulfillment Hub'}
                </h3>
                <span className="text-[10px] font-extrabold font-mono uppercase bg-white/20 text-white px-2 py-0.5 rounded">
                  {order.id}
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                Allocate this order to an authorized regional partner for parts picking &amp; ESD packaging.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Order Summary Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destination Customer</span>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{order.customer.fullName}</span>
                <span className="text-slate-400">•</span>
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600 font-normal">{order.customer.city}, {order.customer.state}</span>
              </p>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Line Items &amp; Total</span>
              <p className="text-xs font-mono font-bold text-slate-900">
                {order.items.length} Component{order.items.length > 1 ? 's' : ''} (₹{order.totalAmount.toLocaleString('en-IN')})
              </p>
            </div>
          </div>

          {/* Current Assignment Notice (if reassigning) */}
          {isReassignment && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-blue-900">
              <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold">Currently Assigned To:</span>{' '}
                <span>{order.assignedSellerName || 'Unknown'}</span>{' '}
                {order.assignedAt && (
                  <span className="text-blue-700 font-mono text-[11px]">
                    (on {order.assignedAt.slice(0, 10)})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Seller Selection Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#561269]" />
                <span>Select Verified Seller / Regional Fulfillment Hub</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {availableSellers.length} Hubs Available
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {availableSellers.map((seller) => {
                const isSelected = selectedSellerId === seller.id;
                const activeLoad = getSellerActiveLoad(seller.id);
                const isCurrentSeller = order.assignedSellerId === seller.id;

                return (
                  <div
                    key={seller.id}
                    id={`seller-choice-${seller.id}`}
                    onClick={() => setSelectedSellerId(seller.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#561269] bg-[#561269]/5 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#561269] bg-[#561269]' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{seller.name}</h4>
                          {isCurrentSeller && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              Current Assignee
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-0.5 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {seller.rating.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{seller.warehouseHub}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                          <span>GSTIN: {seller.gstin}</span>
                          <span>•</span>
                          <span>Ph: {seller.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Queue Load Badge */}
                    <div className="sm:text-right shrink-0 pl-8 sm:pl-0 pt-1 sm:pt-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Active Queue
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        activeLoad === 0 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : activeLoad <= 3 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        <Package className="w-3 h-3" />
                        <span>{activeLoad} active order{activeLoad === 1 ? '' : 's'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Admin Assignment Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Internal Dispatch / Routing Instructions (Optional):
            </label>
            <textarea
              value={assignmentNote}
              onChange={(e) => setAssignmentNote(e.target.value)}
              placeholder="e.g., Priority packing requested. Verify calibration certificate for microcontroller..."
              rows={2}
              className="w-full text-xs rounded-xl border border-slate-300 p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#561269] focus:border-[#561269]"
            />
            <p className="text-[11px] text-slate-400">
              These notes will appear directly on the assigned seller's packing desk and dispatch checklist.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Updates order status to &quot;Assigned&quot; &amp; routes to seller queue</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedSeller || isSubmitting}
              className="bg-[#FF6B00] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isReassignment ? 'Update Seller Assignment' : 'Confirm Assignment'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
