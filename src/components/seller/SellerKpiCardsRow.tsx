import React from 'react';
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { FirestoreSellerKPIs, SellerDateRange } from '../../hooks/useFirestoreSellerKPIs';
import { SellerBonusCard } from './SellerBonusCard';

interface SellerKpiCardsRowProps {
  kpis: FirestoreSellerKPIs;
  dateRange: SellerDateRange;
  onDateRangeChange: (range: SellerDateRange) => void;
  onSelectTab?: (tab: 'packlist' | 'analytics') => void;
  sellerId?: string;
  sellerName?: string;
}

export const SellerKpiCardsRow: React.FC<SellerKpiCardsRowProps> = ({
  kpis,
  dateRange,
  onDateRangeChange,
  onSelectTab,
  sellerId,
  sellerName,
}) => {
  const {
    isLoading,
    formattedRevenue,
    revenueChangeText,
    isPositiveChange,
    todayPackListCount,
    pendingHandoverCount,
    onTimeDispatchRate,
    unitsPackedCount,
    sellerRating,
  } = kpis;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${sellerId ? 'xl:grid-cols-5' : 'xl:grid-cols-4'} gap-3 sm:gap-4`}
      id="seller-kpi-cards-row"
    >
      {/* Card 1: Gross Revenue with Dropdown Selector */}
      <div 
        id="seller-kpi-gross-revenue"
        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:border-violet-300"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#561269]/10 text-[#561269] flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <span className="font-bold text-slate-700">Gross Revenue</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as SellerDateRange)}
            id="seller-kpi-daterange-select"
            className="text-[10px] font-bold text-violet-800 bg-violet-50 rounded-lg px-2 py-1 border border-violet-200 focus:outline-hidden cursor-pointer hover:bg-violet-100 transition-colors"
          >
            <option value="This Month">This Month</option>
            <option value="All Time">All Time</option>
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
          </select>
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-md" />
          ) : (
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              {formattedRevenue}
            </p>
          )}

          {isLoading ? (
            <div className="h-4 w-24 bg-slate-100 animate-pulse rounded-md mt-1.5" />
          ) : (
            <p className={`text-[11px] font-semibold mt-1.5 flex items-center gap-1 ${
              isPositiveChange ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {isPositiveChange ? (
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{revenueChangeText}</span>
            </p>
          )}
        </div>
      </div>

      {/* Card 2: Today's Pack List ("To Pack / Picking") */}
      <div 
        id="seller-kpi-todays-packlist"
        onClick={() => onSelectTab?.('packlist')}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between cursor-pointer transition-all hover:border-amber-300 group"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Package className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-700">Today's Pack List</span>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Picking Queue
          </span>
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-md" />
          ) : (
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {todayPackListCount} <span className="text-sm font-bold text-slate-500">Orders</span>
            </p>
          )}
          <p className="text-[11px] text-amber-700 font-medium mt-1.5 flex items-center gap-1">
            <span>Scheduled for same-day dispatch</span>
          </p>
        </div>
      </div>

      {/* Card 3: Pending Courier Handover */}
      <div 
        id="seller-kpi-pending-handover"
        onClick={() => onSelectTab?.('packlist')}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between cursor-pointer transition-all hover:border-[#561269]/40 group"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-[#561269]/5 text-[#561269] group-hover:bg-[#561269]/10 transition-colors">
              <Truck className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-700">Pending Courier Handover</span>
          </div>
          <span className="text-[10px] font-bold text-[#561269] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            Awaiting Carrier
          </span>
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-md" />
          ) : (
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {pendingHandoverCount} <span className="text-sm font-bold text-slate-500">Ready</span>
            </p>
          )}
          <p className="text-[11px] text-[#561269] font-medium mt-1.5">
            Packed &amp; sealed in anti-static boxes
          </p>
        </div>
      </div>

      {/* Card 4: Fulfillment SLA Quality */}
      <div 
        id="seller-kpi-fulfillment-sla"
        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:border-emerald-300"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-700">Fulfillment SLA Quality</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ★ {sellerRating.toFixed(2)}
          </span>
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-md" />
          ) : (
            <div className="flex items-baseline gap-2">
              <p className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                {onTimeDispatchRate}%
              </p>
              <span className="text-xs font-bold text-slate-500">On-Time</span>
            </div>
          )}
          {isLoading ? (
            <div className="h-4 w-36 bg-slate-100 animate-pulse rounded-md mt-1.5" />
          ) : (
            <p className="text-[11px] text-slate-500 font-medium mt-1.5">
              <span className="font-bold text-slate-700">{unitsPackedCount}</span> units packed • Rating: <strong>★ {sellerRating.toFixed(2)}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Card 5: My Bonus (Strictly Read-Only assigned by Admin) */}
      {sellerId && (
        <SellerBonusCard sellerId={sellerId} sellerName={sellerName} />
      )}
    </div>
  );
};
