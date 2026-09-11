import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order, OrderStatus } from '../types';
import { PayoutRecord } from '../mockData/sellerData';

export type SellerDateRange = 'This Month' | 'All Time' | 'Today' | 'Last 7 Days';

export interface FirestoreSellerKPIs {
  isLoading: boolean;
  error: string | null;
  // KPI 1: Gross Revenue
  grossRevenue: number;
  formattedRevenue: string;
  revenueChangePct: number;
  revenueChangeText: string;
  isPositiveChange: boolean;
  // KPI 2: Today's Pack List
  todayPackListCount: number;
  // KPI 3: Pending Courier Handover
  pendingHandoverCount: number;
  // KPI 4: Fulfillment SLA Quality
  onTimeDispatchRate: number;
  unitsPackedCount: number;
  sellerRating: number;
  // Tab badge counts
  allAssignedCount: number;
  toPackCount: number;
  pendingDispatchCount: number;
  inTransitCount: number;
  deliveredCount: number;
  // Real-time Scoped Data
  sellerOrders: Order[];
  sellerPayouts: PayoutRecord[];
}

/**
 * Safely parses an order's creation date into a JS Date instance.
 */
function parseOrderDate(createdAt: any): Date {
  if (!createdAt) return new Date();
  if (typeof createdAt?.toDate === 'function') {
    return createdAt.toDate();
  }
  if (createdAt?.seconds) {
    return new Date(createdAt.seconds * 1000);
  }
  const parsed = new Date(createdAt);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function useFirestoreSellerKPIs(
  sellerId: string,
  sellerName?: string,
  sellerEmail?: string,
  dateRange: SellerDateRange = 'This Month'
): FirestoreSellerKPIs {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [sellerDocRating, setSellerDocRating] = useState<number | null>(null);
  const [sellerDocSla, setSellerDocSla] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Subscribe to real-time orders in Cloud Firestore
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(docSnap.data() as Order);
        });
        setAllOrders(orders);
        setIsLoading(false);
      },
      (err) => {
        console.warn('[Firestore Seller KPIs] orders snapshot listener error:', err.message);
        setError(err.message);
        setIsLoading(false);
        handleFirestoreError(err, OperationType.GET, 'orders');
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to seller document in `users/{sellerId}` for live rating & performance
  useEffect(() => {
    if (!sellerId) return;

    try {
      const sellerDocRef = doc(db, 'users', sellerId);
      const unsubscribe = onSnapshot(
        sellerDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (typeof data?.rating === 'number') {
              setSellerDocRating(data.rating);
            }
            if (typeof data?.onTimeDispatchRate === 'number') {
              setSellerDocSla(data.onTimeDispatchRate);
            }
          }
        },
        (err) => {
          // Graceful fallback - users collection might not have all seller ids
          console.debug('[Firestore Seller KPIs] seller profile snapshot notice:', err.message);
        }
      );

      return () => unsubscribe();
    } catch {
      // Ignored if local or unconfigured
    }
  }, [sellerId]);

  // 3. Filter orders strictly for the current seller
  const sellerOrders = useMemo(() => {
    const sId = (sellerId || '').trim();
    const sName = (sellerName || '').trim().toLowerCase();
    const sEmail = (sellerEmail || '').trim().toLowerCase();

    return allOrders.filter((o) => {
      // Unassigned orders or pending assignment never belong to a seller queue
      if (o.status === 'pending_assignment' && !o.assignedSellerId) {
        return false;
      }

      // Check ID match
      if (o.assignedSellerId && o.assignedSellerId === sId) {
        return true;
      }

      // Check Name match
      if (sName && o.assignedSellerName && o.assignedSellerName.toLowerCase().includes(sName)) {
        return true;
      }

      // Check Email match
      if (sEmail && (o as any).assignedSellerEmail && (o as any).assignedSellerEmail.toLowerCase() === sEmail) {
        return true;
      }

      return false;
    }).sort((a, b) => {
      const timeA = parseOrderDate(a.createdAt).getTime();
      const timeB = parseOrderDate(b.createdAt).getTime();
      return timeB - timeA;
    });
  }, [allOrders, sellerId, sellerName, sellerEmail]);

  // 4. Compute Tab Badge Counts
  // - "All Assigned Orders (X)": Total active orders assigned to this seller
  // - "To Pack / Picking (X)": Status = to_pack / picking / assigned / processing / placed
  // - "Pending Dispatch (X)": Status = packed / manifested / ready_for_pickup
  // - "In Transit (X)": Status = in_transit / shipped
  const {
    allAssignedCount,
    toPackCount,
    pendingDispatchCount,
    inTransitCount,
    deliveredCount
  } = useMemo(() => {
    let allAssigned = 0;
    let toPack = 0;
    let pendingDispatch = 0;
    let inTransit = 0;
    let delivered = 0;

    const toPackStatuses = ['to_pack', 'picking', 'processing', 'assigned', 'placed'];
    const pendingDispatchStatuses = ['packed', 'ready_for_pickup', 'manifested'];
    const inTransitStatuses = ['in_transit', 'shipped'];
    const deliveredStatuses = ['delivered', 'completed'];

    sellerOrders.forEach((o) => {
      if (o.status === 'cancelled') return;

      allAssigned++;

      if (toPackStatuses.includes(o.status)) {
        toPack++;
      } else if (pendingDispatchStatuses.includes(o.status)) {
        pendingDispatch++;
      } else if (inTransitStatuses.includes(o.status)) {
        inTransit++;
      } else if (deliveredStatuses.includes(o.status)) {
        delivered++;
      }
    });

    return {
      allAssignedCount: allAssigned,
      toPackCount: toPack,
      pendingDispatchCount: pendingDispatch,
      inTransitCount: inTransit,
      deliveredCount: delivered,
    };
  }, [sellerOrders]);

  // 5. Compute KPI 1: Gross Revenue with Date Range & MoM Change
  const { grossRevenue, revenueChangePct, revenueChangeText, isPositiveChange } = useMemo(() => {
    const validOrders = sellerOrders.filter((o) => o.status !== 'cancelled');
    const now = new Date();

    let currentOrders: Order[] = [];
    let priorOrders: Order[] = [];

    if (dateRange === 'Today') {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0).getTime();
      const endOfYesterday = startOfToday - 1;

      currentOrders = validOrders.filter((o) => parseOrderDate(o.createdAt).getTime() >= startOfToday);
      priorOrders = validOrders.filter((o) => {
        const t = parseOrderDate(o.createdAt).getTime();
        return t >= startOfYesterday && t <= endOfYesterday;
      });
    } else if (dateRange === 'Last 7 Days') {
      const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
      const fourteenDaysAgo = now.getTime() - 14 * 24 * 60 * 60 * 1000;

      currentOrders = validOrders.filter((o) => parseOrderDate(o.createdAt).getTime() >= sevenDaysAgo);
      priorOrders = validOrders.filter((o) => {
        const t = parseOrderDate(o.createdAt).getTime();
        return t >= fourteenDaysAgo && t < sevenDaysAgo;
      });
    } else if (dateRange === 'This Month') {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const startOfThisMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0).getTime();
      const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0).getTime();
      const endOfLastMonth = startOfThisMonth - 1;

      currentOrders = validOrders.filter((o) => parseOrderDate(o.createdAt).getTime() >= startOfThisMonth);
      priorOrders = validOrders.filter((o) => {
        const t = parseOrderDate(o.createdAt).getTime();
        return t >= startOfLastMonth && t <= endOfLastMonth;
      });
    } else {
      // All Time
      currentOrders = validOrders;
      priorOrders = [];
    }

    const currentRevenue = currentOrders.reduce((sum, o) => {
      const orderVal = Number(o.finalTotal) || Number(o.totalAmount) || 0;
      return sum + orderVal;
    }, 0);

    const priorRevenue = priorOrders.reduce((sum, o) => {
      const orderVal = Number(o.finalTotal) || Number(o.totalAmount) || 0;
      return sum + orderVal;
    }, 0);

    let pct = 0;
    let text = '';
    let positive = true;

    if (dateRange === 'All Time') {
      text = `${currentOrders.length} total orders fulfilled`;
    } else if (priorRevenue > 0) {
      pct = Math.round(((currentRevenue - priorRevenue) / priorRevenue) * 1000) / 10;
      positive = pct >= 0;
      text = `${positive ? '+' : ''}${pct}% vs previous period`;
    } else if (currentRevenue > 0) {
      text = `${currentOrders.length} order${currentOrders.length === 1 ? '' : 's'} in this period`;
      positive = true;
    } else {
      text = '0% vs previous period';
      positive = true;
    }

    return {
      grossRevenue: currentRevenue,
      revenueChangePct: pct,
      revenueChangeText: text,
      isPositiveChange: positive,
    };
  }, [sellerOrders, dateRange]);

  // 6. Compute KPI 2: Today's Pack List ("To Pack / Picking")
  // Query orders where assignedSellerId == currentSellerId and status in ['to_pack', 'picking', 'processing', 'assigned', 'placed']
  // Filter: Only orders scheduled or created for dispatch today (createdAt >= startOfToday)
  const todayPackListCount = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    const eligibleStatuses = ['to_pack', 'picking', 'processing', 'assigned', 'placed'];

    return sellerOrders.filter((o) => {
      if (!eligibleStatuses.includes(o.status)) return false;
      const orderTime = parseOrderDate(o.createdAt).getTime();
      return orderTime >= startOfToday;
    }).length;
  }, [sellerOrders]);

  // 7. Compute KPI 3: Pending Courier Handover
  // Query orders where assignedSellerId == currentSellerId and status in ['packed', 'ready_for_pickup', 'manifested']
  const pendingHandoverCount = useMemo(() => {
    const eligibleStatuses = ['packed', 'ready_for_pickup', 'manifested'];
    return sellerOrders.filter((o) => eligibleStatuses.includes(o.status)).length;
  }, [sellerOrders]);

  // 8. Compute KPI 4: Fulfillment SLA Quality & Units Packed
  // On-Time %: (Total Orders dispatched within SLA / Total Completed Orders) * 100. Default to 100% if no historical orders exist.
  // Units Packed: Sum total quantity of individual product units packed across completed/packed/shipped/delivered orders for this seller.
  const { onTimeDispatchRate, unitsPackedCount } = useMemo(() => {
    const completedStatuses = ['shipped', 'in_transit', 'delivered', 'completed'];
    const packedOrCompletedStatuses = ['packed', 'ready_for_pickup', 'manifested', 'shipped', 'in_transit', 'delivered', 'completed'];

    const completedOrders = sellerOrders.filter((o) => completedStatuses.includes(o.status));
    const onTimeOrders = completedOrders.filter((o) => !(o as any).slaBreached);

    let rate = 100;
    if (sellerDocSla !== null) {
      rate = sellerDocSla;
    } else if (completedOrders.length > 0) {
      rate = Math.round((onTimeOrders.length / completedOrders.length) * 1000) / 10;
    }

    const unitsCount = sellerOrders
      .filter((o) => packedOrCompletedStatuses.includes(o.status))
      .reduce((sum, o) => {
        const orderUnits = o.items?.reduce((iSum, item) => iSum + (Number(item.quantity) || 1), 0) || 0;
        return sum + orderUnits;
      }, 0);

    return {
      onTimeDispatchRate: rate,
      unitsPackedCount: unitsCount,
    };
  }, [sellerOrders, sellerDocSla]);

  const sellerRating = sellerDocRating ?? 4.92;

  // 9. Derive realistic Payout Records from real Firestore orders
  const sellerPayouts: PayoutRecord[] = useMemo(() => {
    const validOrders = sellerOrders.filter((o) => o.status !== 'cancelled');

    return validOrders.map((o, index) => {
      const gross = Number(o.finalTotal) || Number(o.totalAmount) || 0;
      const fee = Math.round(gross * 0.03); // 3% platform fee
      const net = gross - fee;

      const itemsSummary = o.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ') || 'Electronic Components';
      const orderDate = parseOrderDate(o.createdAt).toISOString().slice(0, 10);

      let status: 'Paid' | 'In Escrow' | 'Processing' = 'Paid';
      if (['placed', 'assigned', 'processing', 'to_pack', 'picking'].includes(o.status)) {
        status = 'In Escrow';
      } else if (['packed', 'ready_for_pickup', 'manifested'].includes(o.status)) {
        status = 'Processing';
      }

      return {
        id: `PAY-${o.id}-${index + 1}`,
        orderId: o.id,
        date: orderDate,
        itemsSummary,
        grossAmount: gross,
        commissionFee: fee,
        netPayout: net,
        payoutStatus: status,
        courier: (o as any).courier || (o as any).carrierName || 'BlueDart Express',
      };
    });
  }, [sellerOrders]);

  const formattedRevenue = `₹${grossRevenue.toLocaleString('en-IN')}`;

  return {
    isLoading,
    error,
    grossRevenue,
    formattedRevenue,
    revenueChangePct,
    revenueChangeText,
    isPositiveChange,
    todayPackListCount,
    pendingHandoverCount,
    onTimeDispatchRate,
    unitsPackedCount,
    sellerRating,
    allAssignedCount,
    toPackCount,
    pendingDispatchCount,
    inTransitCount,
    deliveredCount,
    sellerOrders,
    sellerPayouts,
  };
}
