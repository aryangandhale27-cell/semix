import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Order } from '../../types';

type LedgerRange = 'Today' | 'This Month' | 'This Year' | 'All Time';

interface FinancialOrder {
  order: Order;
  date: Date;
  orderAmount: number;
  isCancelled: boolean;
}

interface PaymentMethodSummary {
  method: Order['paymentMethod'];
  count: number;
  sales: number;
}

interface ProductSummary {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  revenue: number;
}

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  orders: number;
  revenue: number;
}

const currency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const parseOrderDate = (value: string): Date | null => {
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date;

  const legacyTimestamp = value.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!legacyTimestamp) return null;
  const [, year, month, day, rawHours, minutes, meridiem] = legacyTimestamp;
  let hours = Number(rawHours);
  if (meridiem?.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (meridiem?.toUpperCase() === 'AM' && hours === 12) hours = 0;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day), hours, Number(minutes));
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDate = (date: Date) =>
  date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const PAYMENT_METHOD_COLORS: Record<Order['paymentMethod'], string> = {
  UPI: '#7c3aed',
  COD: '#f97316',
  Card: '#0f766e',
  NetBanking: '#2563eb',
  MakersCredit: '#64748b',
};

export const AdminFinancialDashboard: React.FC = () => {
  const { orders, products } = useApp();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [ledgerRange, setLedgerRange] = useState<LedgerRange>('All Time');

  const financialOrders = useMemo(
    () =>
      orders.flatMap((order): FinancialOrder[] => {
        const date = parseOrderDate(order.createdAt);
        if (!date) return [];
        const orderAmount = Math.max(0, Number(order.totalAmount) || 0);
        const isCancelled = order.status === 'cancelled';
        return [{
          order,
          date,
          orderAmount,
          isCancelled,
        }];
      }),
    [orders]
  );

  const activeOrders = useMemo(
    () => financialOrders.filter((entry) => !entry.isCancelled),
    [financialOrders]
  );

  const todaySales = activeOrders
    .filter((entry) => isSameDay(entry.date, currentDate))
    .reduce((sum, entry) => sum + entry.orderAmount, 0);
  const monthSales = activeOrders
    .filter((entry) =>
      entry.date.getFullYear() === selectedYear &&
      entry.date.getMonth() === selectedMonth
    )
    .reduce((sum, entry) => sum + entry.orderAmount, 0);
  const yearOrders = activeOrders.filter((entry) => entry.date.getFullYear() === selectedYear);
  const yearSales = yearOrders.reduce((sum, entry) => sum + entry.orderAmount, 0);
  const selectedMonthOrders = activeOrders.filter((entry) =>
    entry.date.getFullYear() === selectedYear && entry.date.getMonth() === selectedMonth
  );
  const todayOrderCount = activeOrders.filter((entry) => isSameDay(entry.date, currentDate)).length;
  const monthAverageOrderValue = selectedMonthOrders.length
    ? selectedMonthOrders.reduce((sum, entry) => sum + entry.orderAmount, 0) / selectedMonthOrders.length
    : 0;
  const periodOrders = selectedMonthOrders;

  const paymentMethods: PaymentMethodSummary[] = useMemo(() => {
    const methods: Order['paymentMethod'][] = ['UPI', 'COD', 'Card', 'NetBanking', 'MakersCredit'];
    return methods.map((method) => {
      const methodOrders = periodOrders.filter((entry) => entry.order.paymentMethod === method);
      return {
        method,
        count: methodOrders.length,
        sales: methodOrders.reduce((sum, entry) => sum + entry.orderAmount, 0),
      };
    });
  }, [periodOrders]);

  const productSummaries = useMemo(() => {
    const productsById = new Map(products.map((product) => [product.id, product]));
    const productTotals = new Map<string, ProductSummary>();
    periodOrders.forEach(({ order }) => {
      order.items.forEach((item) => {
        if (item.productId === 'offline-component-list') return;
        const key = item.productId || item.sku || item.name;
        const summary = productTotals.get(key) || {
          id: key,
          name: item.name,
          sku: item.sku,
          category: productsById.get(item.productId)?.category || 'Other',
          quantity: 0,
          revenue: 0,
        };
        summary.quantity += Math.max(0, Number(item.quantity) || 0);
        summary.revenue += Math.max(0, Number(item.price) || 0) * Math.max(0, Number(item.quantity) || 0);
        productTotals.set(key, summary);
      });
    });
    return Array.from(productTotals.values()).sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue);
  }, [periodOrders, products]);

  const categorySummaries = useMemo(() => {
    const categories = new Map<string, { name: string; quantity: number; revenue: number }>();
    productSummaries.forEach((product) => {
      const summary = categories.get(product.category) || { name: product.category, quantity: 0, revenue: 0 };
      summary.quantity += product.quantity;
      summary.revenue += product.revenue;
      categories.set(product.category, summary);
    });
    return Array.from(categories.values()).sort((a, b) => b.revenue - a.revenue);
  }, [productSummaries]);

  const customerSummaries = useMemo(() => {
    const customers = new Map<string, CustomerSummary>();
    periodOrders.forEach(({ order, orderAmount }) => {
      const email = order.customer.email.trim().toLowerCase();
      const id = email || order.customer.phone.trim() || order.customer.fullName.trim().toLowerCase();
      const summary = customers.get(id) || {
        id,
        name: order.customer.fullName,
        email: order.customer.email,
        orders: 0,
        revenue: 0,
      };
      summary.orders += 1;
      summary.revenue += orderAmount;
      customers.set(id, summary);
    });
    return Array.from(customers.values()).sort((a, b) => b.orders - a.orders || b.revenue - a.revenue);
  }, [periodOrders]);

  const monthlySummary = useMemo(
    () =>
      Array.from({ length: 12 }, (_, month) => {
        const monthOrders = yearOrders.filter((entry) => entry.date.getMonth() === month);
        return {
          month,
          label: new Date(selectedYear, month, 1).toLocaleString('en-IN', { month: 'short' }),
          orderCount: monthOrders.length,
          sales: monthOrders.reduce((sum, entry) => sum + entry.orderAmount, 0),
        };
      }),
    [selectedYear, yearOrders]
  );

  const dailySummary = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const dayOrders = periodOrders.filter(({ date }) => date.getDate() === day);
      return {
        day,
        sales: dayOrders.reduce((sum, entry) => sum + entry.orderAmount, 0),
      };
    });
  }, [selectedYear, selectedMonth, periodOrders]);

  const ledgerOrders = useMemo(() => {
    const filteredOrders = financialOrders.filter(({ date }) => {
      if (ledgerRange === 'Today') return isSameDay(date, currentDate);
      if (ledgerRange === 'This Month') {
        return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth();
      }
      if (ledgerRange === 'This Year') return date.getFullYear() === currentDate.getFullYear();
      return true;
    });
    return filteredOrders.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [financialOrders, ledgerRange, currentDate]);

  const years = useMemo(() => {
    const availableYears = financialOrders.map(({ date }) => date.getFullYear());
    return Array.from(new Set([currentDate.getFullYear(), ...availableYears]))
      .sort((a, b) => b - a);
  }, [currentDate, financialOrders]);

  const maxMonthlySales = Math.max(1, ...monthlySummary.map((month) => month.sales));
  const maxDailySales = Math.max(1, ...dailySummary.map((day) => day.sales));
  const maxProductSales = Math.max(1, ...productSummaries.map((product) => product.quantity));
  const totalMethodSales = paymentMethods.reduce((sum, method) => sum + method.sales, 0);
  let paymentDonutOffset = 0;
  const paymentDonutGradient = totalMethodSales > 0
    ? `conic-gradient(${paymentMethods.filter((method) => method.sales > 0).map((method) => {
      const start = paymentDonutOffset;
      paymentDonutOffset += (method.sales / totalMethodSales) * 100;
      return `${PAYMENT_METHOD_COLORS[method.method]} ${start}% ${paymentDonutOffset}%`;
    }).join(', ')})`
    : 'conic-gradient(#e2e8f0 0% 100%)';

  const exportLedger = () => {
    const csvRows = [
      ['Date', 'Order ID', 'Customer', 'Payment method', 'Order amount', 'Order status'],
      ...ledgerOrders.map(({ order, date, orderAmount, isCancelled }) => [
        date.toISOString(),
        order.id,
        order.customer.fullName,
        order.paymentMethod,
        orderAmount.toFixed(2),
        isCancelled ? 'cancelled (excluded from totals)' : order.status,
      ]),
    ];
    const csv = csvRows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `semix-sales-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-[#561269] to-[#380847] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-200">Admin finance</p>
          <h2 className="mt-1 text-2xl font-black">Financial Performance &amp; Business Analysis</h2>
          <p className="mt-1 text-xs text-purple-100">Sales by time period, payment method, product, category, customer, and order.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <label className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold">
            <span className="text-violet-100">Month</span>
            <select
              aria-label="Select financial month"
              className="rounded-lg border border-white/20 bg-[#561269] px-2 py-1 text-white outline-none focus:ring-2 focus:ring-white/50"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(Number(event.target.value))}
            >
              {Array.from({ length: 12 }, (_, month) => (
                <option key={month} value={month}>{new Date(2000, month, 1).toLocaleString('en-IN', { month: 'long' })}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold">
            <span className="text-violet-100">Year</span>
            <select
              aria-label="Select financial year"
              className="rounded-lg border border-white/20 bg-[#561269] px-2 py-1 text-white outline-none focus:ring-2 focus:ring-white/50"
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
            >
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
        </div>
      </header>

      <section aria-label="Financial summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <article className={cardClass}>
          <p className="text-xs font-semibold text-slate-500">Today's sales</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{currency(todaySales)}</p>
          <p className="mt-1 text-[11px] text-slate-400">{todayOrderCount} active orders placed today</p>
        </article>
        <article className={cardClass}>
          <p className="text-xs font-semibold text-slate-500">{new Date(selectedYear, selectedMonth, 1).toLocaleString('en-IN', { month: 'long' })} sales</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{currency(monthSales)}</p>
          <p className="mt-1 text-[11px] text-slate-400">{selectedMonthOrders.length} orders · AOV {currency(monthAverageOrderValue)}</p>
        </article>
        <article className={cardClass}>
          <p className="text-xs font-semibold text-slate-500">{selectedYear} sales</p>
          <p className="mt-2 text-2xl font-black text-[#561269]">{currency(yearSales)}</p>
          <p className="mt-1 text-[11px] text-slate-400">{yearOrders.length} active orders</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Monthly sales</h3>
            <p className="mt-1 text-xs text-slate-500">Sales by order date for {selectedYear}.</p>
          </div>
        </div>
        <div className="grid h-52 grid-cols-12 items-end gap-2 border-b border-slate-200 pb-2 sm:gap-4" role="img" aria-label={`Monthly sales bar chart for ${selectedYear}`}>
          {monthlySummary.map((month) => (
            <div key={month.month} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
              <div className="flex h-full w-full items-end justify-center">
                <div
                  title={`${month.label} sales: ${currency(month.sales)}`}
                  aria-label={`${month.label} sales ${currency(month.sales)}`}
                  className="w-3/5 max-w-8 rounded-t bg-gradient-to-t from-[#561269] to-[#a855f7] transition-all"
                  style={{ height: `${Math.max(month.sales ? 4 : 0, (month.sales / maxMonthlySales) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{month.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-slate-400">Cancelled orders are excluded from sales totals.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-extrabold text-slate-900">Daily sales</h3>
          <p className="mt-1 text-xs text-slate-500">
            Daily activity for {new Date(selectedYear, selectedMonth, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}.
          </p>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="grid h-44 min-w-[700px] items-end gap-1 border-b border-slate-200 px-1 pb-2" style={{ gridTemplateColumns: `repeat(${dailySummary.length}, minmax(16px, 1fr))` }} role="img" aria-label="Daily sales bar chart">
            {dailySummary.map((day) => (
              <div key={day.day} className="flex h-full flex-col items-center justify-end gap-1">
                <div className="flex h-full w-full items-end justify-center">
                  <div
                    title={`${day.day}: sales ${currency(day.sales)}`}
                    className="w-3/5 rounded-t-sm bg-[#561269]"
                    style={{ height: `${day.sales ? Math.max(3, (day.sales / maxDailySales) * 100) : 0}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[10px] font-semibold text-slate-500">Each bar represents the total value of orders created on that day.</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-extrabold text-slate-900">Payment method analysis</h3>
            <p className="mt-1 text-xs text-slate-500">Order value and payment count for the selected month.</p>
          </div>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative h-40 w-40 shrink-0 rounded-full" style={{ background: paymentDonutGradient }} role="img" aria-label="Donut chart showing sales share by payment method">
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white text-center">
                <span className="text-[10px] font-semibold text-slate-500">Period sales</span>
                <span className="mt-1 text-sm font-black text-slate-900">{currency(totalMethodSales)}</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.method} className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex min-w-0 items-center gap-2 font-bold text-slate-700">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: PAYMENT_METHOD_COLORS[method.method] }} />
                    {method.method}
                    <span className="font-medium text-slate-400">({method.count})</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <strong className="text-slate-900">{currency(method.sales)}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-extrabold text-slate-900">Best-selling components</h3>
            <p className="mt-1 text-xs text-slate-500">Ranked by units sold in the selected month; offline list placeholders excluded.</p>
          </div>
          {productSummaries.length ? (
            <div className="space-y-4">
              {productSummaries.slice(0, 7).map((product, index) => (
                <div key={product.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className="min-w-0 truncate font-bold text-slate-700">
                      <span className="mr-2 text-slate-400">{index + 1}.</span>{product.name}
                      <span className="ml-1 text-[10px] font-medium text-slate-400">{product.sku}</span>
                    </span>
                    <span className="shrink-0 font-extrabold text-[#561269]">{product.quantity} units · {currency(product.revenue)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#561269] to-[#FF6B00]" style={{ width: `${(product.quantity / maxProductSales) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="rounded-xl bg-slate-50 p-5 text-center text-xs text-slate-500">No item-level sales for this month.</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-extrabold text-slate-900">Sales by product category</h3>
            <p className="mt-1 text-xs text-slate-500">Revenue based on the item values recorded on orders in the selected month.</p>
          </div>
          {categorySummaries.length ? (
            <div className="space-y-4">
              {categorySummaries.slice(0, 7).map((category) => (
                <div key={category.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-bold text-slate-700">{category.name}</span>
                    <span className="shrink-0 font-extrabold text-slate-900">{currency(category.revenue)} <span className="font-medium text-slate-400">· {category.quantity} units</span></span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${(category.revenue / Math.max(1, categorySummaries[0].revenue)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="rounded-xl bg-slate-50 p-5 text-center text-xs text-slate-500">No category sales for this month.</p>}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-extrabold text-slate-900">Top customers</h3>
            <p className="mt-1 text-xs text-slate-500">Ranked by number of orders in the selected month; revenue is order value.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3 text-right">Orders</th><th className="px-4 py-3 text-right">Sales</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerSummaries.slice(0, 10).map((customer) => (
                  <tr key={customer.id} className="text-slate-700 hover:bg-violet-50/40">
                    <td className="max-w-56 px-4 py-3"><span className="block truncate font-bold">{customer.name}</span><span className="mt-0.5 block truncate text-[10px] text-slate-400">{customer.email}</span></td>
                    <td className="px-4 py-3 text-right font-semibold">{customer.orders}</td>
                    <td className="px-4 py-3 text-right font-semibold">{currency(customer.revenue)}</td>
                  </tr>
                ))}
                {customerSummaries.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">No customers in this month.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Monthly sales table</h3>
            <p className="mt-1 text-xs text-slate-500">Sales and order counts by month.</p>
          </div>
          <span className="self-start rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-[#561269]">{selectedYear}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">Month</th><th className="px-5 py-3 text-right">Orders</th><th className="px-5 py-3 text-right">Sales</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlySummary.map((month) => {
                return (
                  <tr key={month.month} className="text-slate-700 hover:bg-violet-50/40">
                    <td className="px-5 py-3 font-bold">{month.label} {selectedYear}</td>
                    <td className="px-5 py-3 text-right">{month.orderCount}</td>
                    <td className="px-5 py-3 text-right font-semibold">{currency(month.sales)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-extrabold text-slate-900">
              <tr><td className="px-5 py-3">Year total</td><td className="px-5 py-3 text-right">{yearOrders.length}</td><td className="px-5 py-3 text-right">{currency(yearSales)}</td></tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Sales ledger</h3>
            <p className="mt-1 text-xs text-slate-500">Order-level sales details. Cancelled orders are marked and excluded from totals.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter financial ledger by date"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#561269]"
              value={ledgerRange}
              onChange={(event) => setLedgerRange(event.target.value as LedgerRange)}
            >
              {(['Today', 'This Month', 'This Year', 'All Time'] as const).map((range) => <option key={range}>{range}</option>)}
            </select>
            <button type="button" onClick={exportLedger} className="flex items-center gap-1.5 rounded-lg bg-[#561269] px-3 py-2 text-xs font-bold text-white hover:bg-[#460e56]">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr><th className="px-4 py-3">Date &amp; time</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3 text-right">Order amount</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerOrders.slice(0, 100).map(({ order, date, orderAmount, isCancelled }) => (
                <tr key={order.id} className="text-slate-700 hover:bg-violet-50/40">
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(date)}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#561269]">{order.id}</td>
                  <td className="max-w-40 truncate px-4 py-3">{order.customer.fullName}</td>
                  <td className="px-4 py-3 font-semibold">{order.paymentMethod}</td>
                  <td className="px-4 py-3 text-right font-semibold">{currency(orderAmount)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${isCancelled ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{isCancelled ? 'Cancelled · excluded' : order.status.replace(/_/g, ' ')}</span></td>
                </tr>
              ))}
              {ledgerOrders.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">No orders found for this date range.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {ledgerOrders.length > 100 && <p className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500">Showing the latest 100 of {ledgerOrders.length} matching orders. Export CSV to download the full filtered ledger.</p>}
      </section>
    </div>
  );
};
