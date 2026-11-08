import React from 'react';
import { OrderStatus, StatusTimelineEntry } from '../../types';
import { CheckCircle2, Clock, PackageCheck, Truck, Home, AlertCircle } from 'lucide-react';

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
    <div id="order-status-timeline-container" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Top Tracking details */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-[#561269]/[0.04] via-white to-white px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#561269]/10 text-[#561269]">
            <PackageCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Shipment reference</span>
            <p className="mt-0.5 font-mono text-sm font-bold text-[#561269] sm:text-base">
              {trackingNumber || 'RTZ-IN-EXP-8902'}
            </p>
          </div>
        </div>

        {courier && (
          <div className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-right">
            <span className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Carrier partner</span>
            <p className="mt-0.5 text-xs font-semibold text-slate-800 sm:text-sm">
              {courier} {courierTrackingId && <span className="font-mono text-slate-500 font-normal">({courierTrackingId})</span>}
            </p>
          </div>
        )}
      </div>

      {/* Visual Stepper Progress Bar */}
      <div className="px-4 py-8 sm:px-6 sm:py-9">
        <div className="relative">
          {/* Background Connecting Line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 rounded-full bg-slate-100"></div>

          {/* Active Colored Line */}
          <div
            className="absolute left-[12.5%] top-5 h-1 rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 75)}%` }}
          ></div>

          {/* Stepper Nodes */}
          <div className="relative z-10 grid grid-cols-4">
            {steps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex && status !== 'delivered';
              const isPast = index < currentIndex || status === 'delivered';

              return (
                <div key={step.key} className="flex min-w-0 flex-col items-center px-1 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#561269] text-white ring-4 ring-[#561269]/10 shadow-md shadow-[#561269]/20'
                        : isPast
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                          : 'border-2 border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
                  </div>

                  <span
                    className={`mt-3 text-[11px] font-extrabold leading-tight sm:text-xs ${
                      isCurrent
                        ? 'text-[#561269]'
                        : isPast
                          ? 'text-emerald-700'
                          : isCompleted
                            ? 'text-emerald-700'
                          : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>

                  <span className="mt-1 hidden max-w-[150px] text-[10px] font-normal leading-relaxed text-slate-500 sm:block">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Activity Logs */}
      <div className="mx-5 mb-5 mt-1 border-t border-slate-100 pt-4 sm:mx-6 sm:mb-6">
        <h5 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">
          <Clock className="h-4 w-4 text-[#561269]" />
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
