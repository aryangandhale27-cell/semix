import React from 'react';
import { OrderStatus, StatusTimelineEntry } from '../../types';
import { CheckCircle2, Circle, Clock, PackageCheck, Truck, Home, AlertCircle } from 'lucide-react';

interface StatusTimelineProps {
  status: OrderStatus;
  timeline: StatusTimelineEntry[];
  trackingNumber?: string;
  courier?: string;
  courierTrackingId?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  status,
  timeline,
  trackingNumber,
  courier,
  courierTrackingId
}) => {
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      icon: <Clock className="w-4 h-4" />,
      desc: 'Payment received & verified'
    },
    {
      key: 'packed',
      label: 'Packed & QA Verified',
      icon: <PackageCheck className="w-4 h-4" />,
      desc: 'ESD anti-static boxing'
    },
    {
      key: 'shipped',
      label: 'Dispatched & Shipped',
      icon: <Truck className="w-4 h-4" />,
      desc: 'Handed over to express courier'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: <Home className="w-4 h-4" />,
      desc: 'Signed by recipient'
    }
  ];

  const getStepIndex = (st: OrderStatus): number => {
    switch (st) {
      case 'placed': return 0;
      case 'packed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  if (status === 'cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs text-rose-600">This order was cancelled and a refund has been initiated.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="order-status-timeline-container" className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      {/* Top Tracking details */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Shipment Reference</span>
          <p className="text-sm sm:text-base font-bold font-mono text-[#561269] mt-0.5">
            {trackingNumber || 'RTZ-IN-EXP-8902'}
          </p>
        </div>

        {courier && (
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Carrier Partner</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              {courier} {courierTrackingId && <span className="font-mono text-slate-500 font-normal">({courierTrackingId})</span>}
            </p>
          </div>
        )}
      </div>

      {/* Visual Stepper Progress Bar */}
      <div className="py-8 px-2">
        <div className="relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0"></div>

          {/* Active Colored Line */}
          <div
            className="absolute top-5 left-6 h-1 bg-gradient-to-r from-[#561269] to-[#FF6B00] transition-all duration-500 -z-0"
            style={{ width: `${Math.min(100, Math.max(0, (currentIndex / (steps.length - 1)) * 100))}%` }}
          ></div>

          {/* Stepper Nodes */}
          <div className="flex items-start justify-between relative z-10">
            {steps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center text-center max-w-[100px] sm:max-w-[130px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#FF6B00] text-white ring-4 ring-orange-100 shadow-md shadow-orange-500/20'
                        : isCompleted
                        ? 'bg-[#561269] text-white shadow-xs'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isCompleted ? step.icon : <Circle className="w-3.5 h-3.5" />}
                  </div>

                  <span
                    className={`text-xs font-bold mt-2.5 leading-tight ${
                      isCurrent
                        ? 'text-[#FF6B00]'
                        : isCompleted
                        ? 'text-[#561269]'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>

                  <span className="text-[10px] text-slate-500 hidden sm:block mt-1 font-normal">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Activity Logs */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#561269]" />
          <span>Fulfillment & Dispatch Activity Log</span>
        </h5>

        <div className="space-y-3">
          {timeline.slice().reverse().map((entry, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100"
            >
              <div className="mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                    {entry.status}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{entry.timestamp}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{entry.note}</p>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  Logged by: {entry.updatedBy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
