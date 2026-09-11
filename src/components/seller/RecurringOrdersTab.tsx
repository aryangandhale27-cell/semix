import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Repeat, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Building, 
  Boxes, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Filter, 
  Sparkles,
  ExternalLink,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { RecurringOrder } from '../../types';

interface RecurringOrdersTabProps {
  recurringOrders: RecurringOrder[];
  onPrepareKit: (id: string) => void;
  onAdvanceSchedule: (id: string) => void;
}

export const RecurringOrdersTab: React.FC<RecurringOrdersTabProps> = ({
  recurringOrders,
  onPrepareKit,
  onAdvanceSchedule,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(recurringOrders.map((r) => r.category)))];

  const filtered = recurringOrders.filter((r) => {
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesPriority && matchesCategory;

    const matchesName = r.subscriberName.toLowerCase().includes(query) || r.organization.toLowerCase().includes(query);
    const matchesItem = r.items.some((i) => i.name.toLowerCase().includes(query) || i.sku?.toLowerCase().includes(query));
    return matchesPriority && matchesCategory && (matchesName || matchesItem);
  });

  const totalMonthlyVolume = recurringOrders.reduce((sum, r) => sum + r.totalAmount, 0);

  const getPriorityBadge = (priority: RecurringOrder['priority']) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            Critical Priority
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#561269]/10 text-[#561269] border border-[#561269]/20">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {priority}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Recurring Cadence Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-[#561269] flex items-center justify-center font-bold">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Subscriptions</p>
            <p className="text-lg font-black text-slate-900">{recurringOrders.length} Recurring Batches</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Monthly Recurring Value (MRR)</p>
            <p className="text-lg font-black text-slate-900 font-mono">₹{totalMonthlyVolume.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Next Scheduled Dispatch</p>
            <p className="text-lg font-black text-slate-900">Tomorrow, 10:00 AM</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Priority Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['all', 'critical', 'high', 'medium'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                priorityFilter === p
                  ? 'bg-[#561269] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {p === 'all' ? 'All Priorities' : `${p} Priority`}
            </button>
          ))}
        </div>

        {/* Category & Search */}
        <div className="flex items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#561269]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs, parts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#561269]"
            />
          </div>
        </div>
      </div>

      {/* Recurring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            id={`recurring-order-card-${item.id}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#561269]">{item.id}</span>
                    {getPriorityBadge(item.priority)}
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 capitalize">
                      {item.frequency}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{item.organization}</h4>
                  <p className="text-xs text-slate-500">Contact: {item.subscriberName}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cadence Value</span>
                  <span className="font-mono font-black text-sm text-slate-900">
                    ₹{item.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Schedule Info Banner */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs mb-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-violet-700 shrink-0" />
                  <span>
                    Next Pack Due:{' '}
                    <strong className="text-slate-900 font-mono">{item.nextScheduledDate}</strong>
                  </span>
                </div>
                <span className="text-slate-500 font-medium font-mono text-[11px]">
                  Staging Bin: <strong className="text-violet-800">{item.locationBin}</strong>
                </span>
              </div>

              {/* Itemized Component Kit */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Pre-configured Kit Components:
                </span>
                <div className="space-y-1.5">
                  {item.items.map((prod, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50/70 border border-slate-100"
                    >
                      <span className="font-medium text-slate-800 truncate pr-2">
                        {prod.name}
                      </span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {prod.quantity} pcs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">
                Status:{' '}
                <strong className={item.status === 'preparing' ? 'text-amber-700' : 'text-emerald-700'}>
                  {item.status.toUpperCase()}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdvanceSchedule(item.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Reschedule next dispatch cycle"
                >
                  Adjust Date
                </button>
                <button
                  onClick={() => onPrepareKit(item.id)}
                  id={`prepare-kit-btn-${item.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#561269] hover:bg-violet-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>{item.status === 'preparing' ? 'Mark Kit Ready' : 'Prepare Kit'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
