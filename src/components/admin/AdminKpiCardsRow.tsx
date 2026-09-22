import React from 'react';
import { 
  DollarSign, 
  Package, 
  Boxes, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { FirestoreAdminKPIs } from '../../hooks/useFirestoreAdminKPIs';

interface AdminKpiCardsRowProps {
  kpis: FirestoreAdminKPIs;
  onOpenAddProduct?: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToCatalog?: () => void;
}

export const AdminKpiCardsRow: React.FC<AdminKpiCardsRowProps> = ({
  kpis,
  onNavigateToOrders,
  onNavigateToCatalog
}) => {
  const {
    formattedGrossRevenue,
    momChangePercent,
    momSubtext,
    activeOrdersCount,
    pendingOrdersCount,
    totalSkusCount,
    totalStockUnits,
    lowStockSkusCount,
    isLowStockWarning,
    isLoading,
    lastUpdated,
  } = kpis;

  return (
    <div className="space-y-2">
      {/* Live Firestore indicator */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Real-Time Firestore Metrics
          </span>
        </div>
        {lastUpdated && (
          <span className="text-[10px] text-slate-400">
            Synced: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Sales Revenue */}
        <div 
          id="kpi-card-gross-revenue"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-[#561269]/30 transition-all"
        >
          <div className="space-y-1 w-full mr-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Gross Sales Revenue
            </span>
            
            {isLoading ? (
              <div className="space-y-2 py-1">
                <div className="h-7 bg-slate-200 rounded-lg animate-pulse w-32"></div>
                <div className="h-3 bg-slate-100 rounded-md animate-pulse w-24"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {formattedGrossRevenue}
                </p>
                
                <div className="flex items-center gap-1 text-[11px]">
                  {momChangePercent !== null ? (
                    momChangePercent >= 0 ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {momSubtext}
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-0.5">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {momSubtext}
                      </span>
                    )
                  ) : (
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-600" />
                      {momSubtext}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="w-12 h-12 rounded-xl bg-[#561269]/5 text-[#561269] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Active Orders */}
        <div 
          id="kpi-card-active-orders"
          onClick={onNavigateToOrders}
          className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between transition-all ${
            onNavigateToOrders ? 'cursor-pointer hover:border-orange-300 hover:shadow-sm' : ''
          }`}
        >
          <div className="space-y-1 w-full mr-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Orders
            </span>

            {isLoading ? (
              <div className="space-y-2 py-1">
                <div className="h-7 bg-slate-200 rounded-lg animate-pulse w-16"></div>
                <div className="h-3 bg-slate-100 rounded-md animate-pulse w-28"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">
                  {activeOrdersCount}
                </p>
                
                {pendingOrdersCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/60">
                    <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                    {pendingOrdersCount} Pending Assignment
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    All orders dispatched
                  </span>
                )}
              </>
            )}
          </div>

          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Total Silicon SKUs */}
        <div 
          id="kpi-card-total-skus"
          onClick={onNavigateToCatalog}
          className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between transition-all ${
            onNavigateToCatalog ? 'cursor-pointer hover:border-cyan-300 hover:shadow-sm' : ''
          }`}
        >
          <div className="space-y-1 w-full mr-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Silicon SKUs
            </span>

            {isLoading ? (
              <div className="space-y-2 py-1">
                <div className="h-7 bg-slate-200 rounded-lg animate-pulse w-16"></div>
                <div className="h-3 bg-slate-100 rounded-md animate-pulse w-28"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">
                  {totalSkusCount}
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {totalStockUnits.toLocaleString()} physical units in bins
                </span>
              </>
            )}
          </div>

          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Low Stock Alerts */}
        <div 
          id="kpi-card-low-stock"
          onClick={onNavigateToCatalog}
          className={`p-5 rounded-2xl border shadow-xs flex items-center justify-between transition-all ${
            onNavigateToCatalog ? 'cursor-pointer hover:shadow-sm' : ''
          } ${
            isLowStockWarning 
              ? 'bg-rose-50/50 border-rose-200' 
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-1 w-full mr-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Low Stock Alerts
            </span>

            {isLoading ? (
              <div className="space-y-2 py-1">
                <div className="h-7 bg-slate-200 rounded-lg animate-pulse w-16"></div>
                <div className="h-3 bg-slate-100 rounded-md animate-pulse w-28"></div>
              </div>
            ) : (
              <>
                <p className={`text-2xl font-extrabold font-mono ${
                  isLowStockWarning ? 'text-rose-600' : 'text-slate-900'
                }`}>
                  {lowStockSkusCount} {lowStockSkusCount === 1 ? 'SKU' : 'SKUs'}
                </p>
                
                {isLowStockWarning ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3 text-rose-600 animate-bounce" />
                    Under 10 units threshold
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Healthy inventory levels
                  </span>
                )}
              </>
            )}
          </div>

          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isLowStockWarning 
              ? 'bg-rose-100 text-rose-600' 
              : 'bg-slate-100 text-slate-500'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
