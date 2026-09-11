import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileSpreadsheet,
  PieChart,
  BarChart3,
  Filter
} from 'lucide-react';
import { PayoutRecord } from '../../mockData/sellerData';
import { SellerBonusCard } from './SellerBonusCard';

interface RevenueAnalyticsTabProps {
  payouts: PayoutRecord[];
  dateRange: 'Today' | 'Last 7 Days' | 'This Month' | 'All Time';
  onDateRangeChange: (range: 'Today' | 'Last 7 Days' | 'This Month' | 'All Time') => void;
  onExportCsv: () => void;
  sellerId?: string;
}

export const RevenueAnalyticsTab: React.FC<RevenueAnalyticsTabProps> = ({
  payouts,
  dateRange,
  onDateRangeChange,
  onExportCsv,
  sellerId,
}) => {
  const [selectedChartPoint, setSelectedChartPoint] = useState<number | null>(null);

  // Compute aggregated stats based on date range from live payouts
  const filteredPayouts = React.useMemo(() => {
    const now = new Date();
    if (dateRange === 'Today') {
      const todayStr = now.toISOString().slice(0, 10);
      return payouts.filter((p) => p.date === todayStr);
    } else if (dateRange === 'Last 7 Days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      return payouts.filter((p) => p.date >= sevenDaysAgo);
    } else if (dateRange === 'This Month') {
      const monthPrefix = now.toISOString().slice(0, 7);
      return payouts.filter((p) => p.date.startsWith(monthPrefix));
    }
    return payouts;
  }, [payouts, dateRange]);

  const totalGross = filteredPayouts.reduce((sum, p) => sum + p.grossAmount, 0);
  const totalCommission = Math.round(totalGross * 0.03); // 3% SEMIX LABS platform fee
  const totalNetPayout = totalGross - totalCommission;

  // Visual trend chart data points calculated from live payouts
  const trendData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const buckets: Record<string, { revenue: number; orders: number }> = {
      Mon: { revenue: 0, orders: 0 },
      Tue: { revenue: 0, orders: 0 },
      Wed: { revenue: 0, orders: 0 },
      Thu: { revenue: 0, orders: 0 },
      Fri: { revenue: 0, orders: 0 },
      Sat: { revenue: 0, orders: 0 },
      Sun: { revenue: 0, orders: 0 },
    };

    filteredPayouts.forEach((p) => {
      const d = new Date(p.date);
      const dayName = days[isNaN(d.getDay()) ? 0 : d.getDay()];
      if (buckets[dayName]) {
        buckets[dayName].revenue += p.grossAmount;
        buckets[dayName].orders += 1;
      }
    });

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
      label: day,
      revenue: buckets[day].revenue,
      orders: buckets[day].orders,
    }));
  }, [filteredPayouts]);

  const maxRevenue = Math.max(...trendData.map((d) => d.revenue), 100);

  // Category distribution
  const categories = [
    { name: 'Development Boards (ESP32 / RPi)', percentage: 38, amount: Math.round(totalGross * 0.38), color: 'bg-violet-600' },
    { name: 'Batteries & Drone Power Packs', percentage: 26, amount: Math.round(totalGross * 0.26), color: 'bg-emerald-600' },
    { name: 'Precision Sensors & Modules', percentage: 18, amount: Math.round(totalGross * 0.18), color: 'bg-[#561269]' },
    { name: 'Motor Drivers & Servos', percentage: 12, amount: Math.round(totalGross * 0.12), color: 'bg-amber-500' },
    { name: 'Passive Components & Breadboards', percentage: 6, amount: Math.round(totalGross * 0.06), color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Seller Performance Incentive & Festival Bonus Banner */}
      {sellerId && (
        <SellerBonusCard sellerId={sellerId} variant="banner" />
      )}

      {/* Top Filter and Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['Today', 'Last 7 Days', 'This Month', 'All Time'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onDateRangeChange(range)}
              id={`range-tab-${range.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                dateRange === range
                  ? 'bg-[#561269] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* CSV Export Button */}
        <button
          onClick={onExportCsv}
          id="export-payout-csv-btn"
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export Payout Statement (CSV)</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Gross Fulfilled Value</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold text-[10px] flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">₹{totalGross.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-400 mt-1">Based on {dateRange.toLowerCase()} dispatch volume</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">SEMIX LABS Platform Commission (3%)</span>
            <span className="text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded font-bold text-[10px]">
              Flat Rate
            </span>
          </div>
          <p className="text-2xl font-black text-violet-900 font-mono">₹{totalCommission.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-400 mt-1">Escrow, payment gateway & logistics handling fee</p>
        </div>

        <div className="bg-gradient-to-br from-[#561269] to-violet-950 text-white p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between text-xs text-violet-200 mb-1">
            <span className="font-semibold">Net Seller Bank Payout</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300">
              Direct Transfer
            </span>
          </div>
          <p className="text-2xl font-black text-white font-mono">₹{totalNetPayout.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-violet-200/80 mt-1">Settled automatically every Tuesday & Friday</p>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend SVG Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-violet-700" />
                <span>Weekly Fulfilment Earnings & Volume</span>
              </h3>
              <p className="text-xs text-slate-500">Daily gross turnover with completed shipments</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#561269]" /> Revenue (₹)
              </span>
            </div>
          </div>

          {/* SVG Bar Chart with Hover States */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
            {trendData.map((d, idx) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              const isSelected = selectedChartPoint === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setSelectedChartPoint(idx)}
                  onMouseLeave={() => setSelectedChartPoint(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on Hover */}
                  <div
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white mb-1.5 transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    ₹{(d.revenue / 1000).toFixed(1)}k
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[38px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className={`w-full rounded-t-lg transition-colors ${
                        isSelected ? 'bg-violet-700' : 'bg-[#561269] group-hover:bg-violet-800'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-semibold text-slate-500 mt-2 font-mono">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Revenue Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <PieChart className="w-4 h-4 text-violet-700" />
              <span>Category Share</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Top earning component segments</p>

            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 truncate pr-2">{cat.name}</span>
                    <span className="font-mono font-bold text-slate-900">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
            Microcontrollers and battery systems lead repeat order volume this month.
          </div>
        </div>
      </div>

      {/* Itemized Payout Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Completed Order Payout Records</h4>
            <p className="text-xs text-slate-500">Settled disbursements & escrow queue</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {payouts.length} Disbursements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Payout Ref</th>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Components Summary</th>
                <th className="py-3 px-4">Gross Value</th>
                <th className="py-3 px-4">Platform Fee (3%)</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-violet-900">
                    {pay.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-800 block">{pay.orderId}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{pay.date}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 max-w-xs truncate">
                    {pay.itemsSummary}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    ₹{pay.grossAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    -₹{pay.commissionFee.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-700">
                    ₹{pay.netPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
                    {pay.payoutStatus === 'Paid' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    )}
                    {pay.payoutStatus === 'In Escrow' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3" /> In Escrow
                      </span>
                    )}
                    {pay.payoutStatus === 'Processing' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#561269]/10 text-[#561269] border border-[#561269]/20">
                        <TrendingUp className="w-3 h-3" /> Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
