import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  runTransaction,
  increment,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Coupon, CouponUsage, CouponValidationResult, Order } from '../types';
import { sanitizeForFirestore } from './firebaseService';

/**
 * Initial standard coupons pre-seeded if the Firestore collection is empty
 */
export const DEFAULT_INITIAL_COUPONS: Coupon[] = [
  {
    code: 'ORDER10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 300,
    maxDiscount: 500,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    totalUsageLimit: 100,
    perCustomerLimit: 2,
    timesUsed: 0,
    status: 'active',
  },
  {
    code: 'SEMIX100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 500,
    maxDiscount: null,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    totalUsageLimit: 200,
    perCustomerLimit: 1,
    timesUsed: 0,
    status: 'active',
  },
  {
    code: 'MAKER50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 200,
    maxDiscount: null,
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    totalUsageLimit: 500,
    perCustomerLimit: 3,
    timesUsed: 0,
    status: 'active',
  },
  {
    code: 'ELECTRONICS20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 1000,
    maxDiscount: 1000,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalUsageLimit: 50,
    perCustomerLimit: 1,
    timesUsed: 0,
    status: 'active',
  },
  {
    code: '10ELECTRO',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500,
    maxDiscount: 500,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    totalUsageLimit: 5000,
    perCustomerLimit: 5,
    timesUsed: 0,
    status: 'active',
  }
];

/**
 * Fetch a single coupon document by uppercase code
 */
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const formattedCode = code.trim().toUpperCase();
  const path = `coupons/${formattedCode}`;
  try {
    const couponSnap = await getDoc(doc(db, 'coupons', formattedCode));
    if (!couponSnap.exists()) {
      return null;
    }
    return couponSnap.data() as Coupon;
  } catch (error) {
    console.error(`[Firestore] Error fetching coupon ${formattedCode}:`, error);
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Fetch a customer's specific usage for a coupon
 */
export async function getCouponCustomerUsage(
  couponCode: string,
  userId: string
): Promise<CouponUsage | null> {
  const formattedCode = couponCode.trim().toUpperCase();
  const path = `coupons/${formattedCode}/usages/${userId}`;
  try {
    const usageSnap = await getDoc(doc(db, 'coupons', formattedCode, 'usages', userId));
    if (!usageSnap.exists()) {
      return null;
    }
    return usageSnap.data() as CouponUsage;
  } catch (error) {
    console.error(`[Firestore] Error fetching coupon usage for ${userId}:`, error);
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * STRICT 8-RULE VALIDATION FUNCTION
 * validateAndCalculateCoupon(couponCode, cartSubtotal, userId)
 */
export async function validateAndCalculateCoupon(
  couponCode: string,
  cartSubtotal: number,
  userId: string
): Promise<CouponValidationResult> {
  const formattedCode = couponCode ? couponCode.trim().toUpperCase() : '';

  // Rule 1: Code Exists
  if (!formattedCode) {
    return {
      isValid: false,
      discount: 0,
      finalTotal: cartSubtotal,
      error: 'Invalid coupon code.'
    };
  }

  const coupon = await getCouponByCode(formattedCode);
  if (!coupon) {
    return {
      isValid: false,
      discount: 0,
      finalTotal: cartSubtotal,
      error: 'Invalid coupon code.'
    };
  }

  // Rule 2: Status is 'active'
  if (coupon.status !== 'active') {
    return {
      isValid: false,
      coupon,
      discount: 0,
      finalTotal: cartSubtotal,
      error: 'This coupon is no longer active.'
    };
  }

  // Rule 3: Dates validity window
  const now = new Date();
  const startDate = new Date(coupon.startDate);
  const expiryDate = new Date(coupon.expiryDate);

  if (now < startDate) {
    return {
      isValid: false,
      coupon,
      discount: 0,
      finalTotal: cartSubtotal,
      error: 'This coupon is not active yet.'
    };
  }

  if (now > expiryDate) {
    return {
      isValid: false,
      coupon,
      discount: 0,
      finalTotal: cartSubtotal,
      error: 'This coupon has expired.'
    };
  }

  // Rule 4: Minimum Order Value
  if (cartSubtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      coupon,
      discount: 0,
      finalTotal: cartSubtotal,
      error: `This coupon is valid only on orders of ₹${coupon.minOrderValue} or more.`
    };
  }

  // Rule 5: Total Usage Limit
  if (coupon.timesUsed >= coupon.totalUsageLimit) {
    return {
      isValid: false,
      coupon,
      discount: 0,
      finalTotal: cartSubtotal,
      error: 'This coupon has reached its maximum global usage limit.'
    };
  }

  // Rule 6: Per-Customer Limit
  if (userId) {
    const customerUsage = await getCouponCustomerUsage(formattedCode, userId);
    if (customerUsage && customerUsage.usageCount >= coupon.perCustomerLimit) {
      return {
        isValid: false,
        coupon,
        discount: 0,
        finalTotal: cartSubtotal,
        error: 'You have already reached the maximum usage limit for this coupon.'
      };
    }
  }

  // Rule 7: Discount Calculation
  let rawDiscount = 0;
  if (coupon.discountType === 'percentage') {
    rawDiscount = (cartSubtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount !== null && coupon.maxDiscount !== undefined && coupon.maxDiscount > 0) {
      rawDiscount = Math.min(rawDiscount, coupon.maxDiscount);
    }
  } else {
    // Fixed amount
    rawDiscount = coupon.discountValue;
  }

  // Rule 8: No Negative Totals
  const calculatedDiscount = Math.min(cartSubtotal, Math.max(0, rawDiscount));
  const finalTotal = Math.max(0, cartSubtotal - calculatedDiscount);

  return {
    isValid: true,
    coupon,
    discount: calculatedDiscount,
    finalTotal,
  };
}

/**
 * CHECKOUT RE-VALIDATION & ATOMIC WRITE TRANSACTION
 * Executes atomic write on Firestore:
 * 1. Re-validates the coupon in the transaction
 * 2. Increments `timesUsed` on the coupon doc
 * 3. Sets or increments `usageCount` in `coupons/{code}/usages/{userId}`
 * 4. Creates the final order document in `orders`
 */
export async function placeOrderWithCouponTransaction({
  order,
  couponCode,
  userId,
}: {
  order: Order;
  couponCode?: string;
  userId: string;
}): Promise<{ success: boolean; orderId: string; error?: string }> {
  const orderRef = doc(db, 'orders', order.id);
  const formattedCode = couponCode ? couponCode.trim().toUpperCase() : null;

  try {
    await runTransaction(db, async (transaction) => {
      let finalDiscount = order.discount || 0;
      let finalCouponCode: string | null = null;

      if (formattedCode) {
        const couponRef = doc(db, 'coupons', formattedCode);
        const couponSnap = await transaction.get(couponRef);

        // 1. Code Exists
        if (!couponSnap.exists()) {
          throw new Error('Invalid coupon code.');
        }

        const couponData = couponSnap.data() as Coupon;

        // 2. Status
        if (couponData.status !== 'active') {
          throw new Error('This coupon is no longer active.');
        }

        // 3. Dates
        const now = new Date();
        const start = new Date(couponData.startDate);
        const expiry = new Date(couponData.expiryDate);
        if (now < start) {
          throw new Error('This coupon is not active yet.');
        }
        if (now > expiry) {
          throw new Error('This coupon has expired.');
        }

        // 4. Minimum Order Value
        if (order.subtotal < couponData.minOrderValue) {
          throw new Error(`This coupon is valid only on orders of ₹${couponData.minOrderValue} or more.`);
        }

        // 5. Total Usage Limit
        if (couponData.timesUsed >= couponData.totalUsageLimit) {
          throw new Error('This coupon has reached its maximum global usage limit.');
        }

        // 6. Per-Customer Limit
        const effectiveUserId = userId || order.customer.email || 'guest_checkout';
        const usageRef = doc(db, 'coupons', formattedCode, 'usages', effectiveUserId);
        const usageSnap = await transaction.get(usageRef);

        if (usageSnap.exists()) {
          const usageData = usageSnap.data() as CouponUsage;
          if (usageData.usageCount >= couponData.perCustomerLimit) {
            throw new Error('You have already reached the maximum usage limit for this coupon.');
          }
        }

        // 7. Calculate Discount
        let rawDiscount = 0;
        if (couponData.discountType === 'percentage') {
          rawDiscount = (order.subtotal * couponData.discountValue) / 100;
          if (couponData.maxDiscount !== null && couponData.maxDiscount !== undefined && couponData.maxDiscount > 0) {
            rawDiscount = Math.min(rawDiscount, couponData.maxDiscount);
          }
        } else {
          rawDiscount = couponData.discountValue;
        }

        // 8. No Negative Totals
        finalDiscount = Math.min(order.subtotal, Math.max(0, rawDiscount));
        finalCouponCode = formattedCode;

        // Atomic write 1: Increment timesUsed on coupon doc
        transaction.update(couponRef, {
          timesUsed: increment(1),
          updatedAt: new Date().toISOString(),
        });

        // Atomic write 2: Record/increment customer usage
        if (usageSnap.exists()) {
          transaction.update(usageRef, {
            orderId: order.id,
            usageCount: increment(1),
            lastUsedAt: new Date().toISOString(),
          });
        } else {
          transaction.set(usageRef, {
            userId: effectiveUserId,
            orderId: order.id,
            usageCount: 1,
            lastUsedAt: new Date().toISOString(),
          });
        }
      }

      // Compute final total amounts
      const calculatedFinalTotal = Math.max(0, order.subtotal - finalDiscount) + (order.shippingFee || 0) + (order.tax || 0);

      const completeOrderPayload: Order = {
        ...order,
        discount: finalDiscount,
        discountAmount: finalDiscount,
        totalAmount: calculatedFinalTotal,
        finalTotal: calculatedFinalTotal,
        couponCode: finalCouponCode || undefined,
        userId: userId || order.customer.email || undefined,
      };

      // Atomic write 3: Create final order document in `orders`
      transaction.set(orderRef, sanitizeForFirestore(completeOrderPayload));
    });

    console.log(`[Firestore] Order #${order.id} placed atomically with coupon ${formattedCode || 'none'}.`);
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error(`[Firestore] Transaction failed while placing order #${order.id}:`, error);
    return { success: false, orderId: order.id, error: error.message || 'Transaction failed' };
  }
}

/**
 * Fetch all coupons for Admin management
 */
export async function fetchAllCoupons(): Promise<Coupon[]> {
  const path = 'coupons';
  try {
    const q = query(collection(db, 'coupons'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const list: Coupon[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Coupon);
    });

    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.error('[Firestore] Error fetching coupons:', error);
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Real-time listener for coupons in Admin Dashboard
 */
export function subscribeToCoupons(
  onData: (coupons: Coupon[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const q = query(collection(db, 'coupons'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const list: Coupon[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Coupon);
      });
      onData(list);
    },
    (err) => {
      console.warn('[Firestore] Realtime coupons listener error:', err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Create or update a coupon
 */
export async function saveCouponToFirestore(coupon: Coupon): Promise<void> {
  const formattedCode = coupon.code.trim().toUpperCase();
  const path = `coupons/${formattedCode}`;

  const payload: Coupon = sanitizeForFirestore({
    ...coupon,
    code: formattedCode,
    updatedAt: new Date().toISOString(),
    createdAt: coupon.createdAt || new Date().toISOString(),
  });

  try {
    await setDoc(doc(db, 'coupons', formattedCode), payload, { merge: true });
    console.log(`[Firestore] Coupon ${formattedCode} saved successfully.`);
  } catch (error) {
    console.error(`[Firestore] Error saving coupon ${formattedCode}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Toggle coupon status between 'active' and 'inactive'
 */
export async function toggleCouponStatus(code: string, currentStatus: 'active' | 'inactive'): Promise<void> {
  const formattedCode = code.trim().toUpperCase();
  const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
  const path = `coupons/${formattedCode}`;

  try {
    await updateDoc(doc(db, 'coupons', formattedCode), {
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });
    console.log(`[Firestore] Coupon ${formattedCode} status updated to ${nextStatus}.`);
  } catch (error) {
    console.error(`[Firestore] Error updating status for ${formattedCode}:`, error);
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Delete a coupon document
 */
export async function deleteCouponFromFirestore(code: string): Promise<void> {
  const formattedCode = code.trim().toUpperCase();
  const path = `coupons/${formattedCode}`;

  try {
    await deleteDoc(doc(db, 'coupons', formattedCode));
    console.log(`[Firestore] Coupon ${formattedCode} deleted.`);
  } catch (error) {
    console.error(`[Firestore] Error deleting coupon ${formattedCode}:`, error);
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Helper to seed initial default coupons if needed
 */
export async function seedInitialCoupons(): Promise<void> {
  try {
    for (const cp of DEFAULT_INITIAL_COUPONS) {
      await setDoc(
        doc(db, 'coupons', cp.code),
        sanitizeForFirestore({
          ...cp,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        { merge: true }
      );
    }
  } catch (err) {
    console.warn('[Firestore] Failed seeding default coupons:', err);
  }
}
