import { useState, useEffect } from 'react';
import { Order, Product } from '../types';
import {
  fetchProductInventorySummaryFromFirestore,
  ProductInventorySummary,
} from '../services/firebaseService';

export interface FirestoreAdminKPIs {
  // 1. Gross Sales Revenue
  grossRevenue: number;
  formattedGrossRevenue: string;
  thisMonthRevenue: number;
  prevMonthRevenue: number;
  momChangePercent: number | null; // e.g. +14.2% or -5.1%
  momSubtext: string;

  // 2. Active Orders
  activeOrdersCount: number;
  pendingOrdersCount: number;
  totalOrdersCount: number;

  // 3. Total Silicon SKUs / Inventory
  totalSkusCount: number;
  totalStockUnits: number;

  // 4. Low Stock Alerts
  lowStockSkusCount: number;
  isLowStockWarning: boolean;

  // Analytics Helpers
  averageOrderValue: number;
  formattedAOV: string;

  // State
  isLoading: boolean;
  isOrdersLoaded: boolean;
  isProductsLoaded: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const DEFAULT_KPIS: FirestoreAdminKPIs = {
  grossRevenue: 0,
  formattedGrossRevenue: '₹0.00',
  thisMonthRevenue: 0,
  prevMonthRevenue: 0,
  momChangePercent: null,
  momSubtext: '₹0.00 this month',
  activeOrdersCount: 0,
  pendingOrdersCount: 0,
  totalOrdersCount: 0,
  totalSkusCount: 0,
  totalStockUnits: 0,
  lowStockSkusCount: 0,
  isLowStockWarning: false,
  averageOrderValue: 0,
  formattedAOV: '₹0.00',
  isLoading: true,
  isOrdersLoaded: false,
  isProductsLoaded: false,
  error: null,
  lastUpdated: null,
};

/**
 * Hook to aggregate real-time admin KPIs directly from Cloud Firestore collections
 * Queries 'orders' and 'products' collections with real-time listeners.
 */
export function useFirestoreAdminKPIs(
  orders: Order[],
  products: Product[],
  productsLoaded = true
): FirestoreAdminKPIs {
  const [kpis, setKpis] = useState<FirestoreAdminKPIs>(DEFAULT_KPIS);
  const [aggregateProductSummary, setAggregateProductSummary] = useState<ProductInventorySummary | null>(null);
  const [aggregateProductSummaryError, setAggregateProductSummaryError] = useState<string | null>(null);

  useEffect(() => {
    if (productsLoaded) return;

    let isCurrent = true;
    fetchProductInventorySummaryFromFirestore()
      .then((summary) => {
        if (isCurrent) {
          setAggregateProductSummary(summary);
          setAggregateProductSummaryError(null);
        }
      })
      .catch((error: unknown) => {
        console.error('[Admin KPIs] Could not load product inventory summary:', error);
        if (isCurrent) {
          setAggregateProductSummaryError('Product inventory summary could not be loaded.');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [productsLoaded]);

  // Compute metrics from the existing AppContext snapshots instead of opening duplicate listeners.
  useEffect(() => {
    const currentOrders = orders;
    const currentProducts = products;

    // --- Order Calculations ---
    // Rule: status != 'cancelled'
    const validOrders = currentOrders.filter((o) => o.status !== 'cancelled');

    // Sum of finalTotal (or totalAmount, or subtotal)
    const grossRevenue = validOrders.reduce((sum, o) => {
      const amt = Number(o.finalTotal ?? o.totalAmount ?? o.subtotal ?? 0);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    // Format Indian Rupee (₹xx,xxx.xx)
    const formattedGrossRevenue = `₹${grossRevenue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    // MoM Percentage Calculation
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 to 11

    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevMonthYear = prevMonthDate.getFullYear();

    let thisMonthRevenue = 0;
    let prevMonthRevenue = 0;

    validOrders.forEach((o) => {
      let orderDate: Date | null = null;
      if (o.createdAt) {
        if (typeof (o.createdAt as any)?.toDate === 'function') {
          orderDate = (o.createdAt as any).toDate();
        } else {
          orderDate = new Date(o.createdAt);
        }
      }

      if (orderDate && !isNaN(orderDate.getTime())) {
        const amt = Number(o.finalTotal ?? o.totalAmount ?? o.subtotal ?? 0);
        const validAmt = isNaN(amt) ? 0 : amt;
        if (orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth) {
          thisMonthRevenue += validAmt;
        } else if (orderDate.getFullYear() === prevMonthYear && orderDate.getMonth() === prevMonth) {
          prevMonthRevenue += validAmt;
        }
      }
    });

    let momChangePercent: number | null = null;
    let momSubtext = '';

    if (prevMonthRevenue > 0) {
      momChangePercent = ((thisMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
      const sign = momChangePercent >= 0 ? '+' : '';
      momSubtext = `${sign}${momChangePercent.toFixed(1)}% vs last month`;
    } else if (thisMonthRevenue > 0) {
      momSubtext = `₹${thisMonthRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} this month`;
    } else {
      momSubtext = '₹0.00 this month';
    }

    // Active Orders: status in ['pending', 'processing', 'dispatched', 'in_transit', 'pending_assignment', 'assigned', 'packed', 'shipped']
    // (i.e. status != 'delivered' && status != 'completed' && status != 'cancelled')
    const activeOrders = currentOrders.filter(
      (o) => o.status !== 'delivered' && o.status !== 'completed' && o.status !== 'cancelled'
    );
    const activeOrdersCount = activeOrders.length;

    // Sub-badge: Count of orders marked specifically with status 'pending' or 'pending_assignment'
    const pendingOrders = currentOrders.filter(
      (o) => !o.assignedSellerId || o.status === 'pending_assignment'
    );
    const pendingOrdersCount = pendingOrders.length;

    // Average Order Value
    const totalOrdersCount = validOrders.length;
    const averageOrderValue = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;
    const formattedAOV = `₹${averageOrderValue.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`;

    // --- Product Calculations ---
    const productSummary = productsLoaded
      ? {
          totalSkusCount: currentProducts.length,
          totalStockUnits: currentProducts.reduce((sum, p) => {
            const stock = Number((p as any).stockQuantity ?? p.stockCount ?? (p as any).stock ?? 0);
            return sum + (isNaN(stock) ? 0 : stock);
          }, 0),
          lowStockSkusCount: currentProducts.filter((p) => {
            const stock = Number((p as any).stockQuantity ?? p.stockCount ?? (p as any).stock ?? 0);
            return stock <= 10;
          }).length,
        }
      : aggregateProductSummary;

    const totalSkusCount = productSummary?.totalSkusCount ?? 0;

    // Sum of stockQuantity (or stockCount, or stock)
    const totalStockUnits = productSummary?.totalStockUnits ?? 0;
    const lowStockSkusCount = productSummary?.lowStockSkusCount ?? 0;

    const isLowStockWarning = lowStockSkusCount > 0;

    const isOrdersLoaded = true;
    const isProductsLoaded = productsLoaded || aggregateProductSummary !== null;
    const isLoading = false;

    setKpis({
      grossRevenue,
      formattedGrossRevenue,
      thisMonthRevenue,
      prevMonthRevenue,
      momChangePercent,
      momSubtext,
      activeOrdersCount,
      pendingOrdersCount,
      totalOrdersCount,
      totalSkusCount,
      totalStockUnits,
      lowStockSkusCount,
      isLowStockWarning,
      averageOrderValue,
      formattedAOV,
      isLoading,
      isOrdersLoaded,
      isProductsLoaded,
      error: aggregateProductSummaryError,
      lastUpdated: new Date(),
    });
  }, [orders, products, productsLoaded, aggregateProductSummary, aggregateProductSummaryError]);

  return kpis;
}
