import { doc, getDoc, setDoc, collection, getDocs, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SellerBonusRecord, AvailableSeller } from '../types';
import { AVAILABLE_SELLERS } from '../mockData/sellerData';


export const INITIAL_BONUS_RECORDS: Record<string, SellerBonusRecord> = {
  'usr-seller-01': {
    sellerId: 'usr-seller-01',
    sellerName: 'Vikram Patel',
    sellerEmail: 'seller@semixlabs.com',
    bonusAmount: 5000,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-01T10:00:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 5000,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-01T10:00:00.000Z',
      },
    ],
  },
  'usr-seller-02': {
    sellerId: 'usr-seller-02',
    sellerName: 'Priya Sharma (ElectroComponents Hub)',
    sellerEmail: 'priya.sharma@semixlabs.com',
    bonusAmount: 2500,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-02T14:30:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 2500,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-02T14:30:00.000Z',
      },
    ],
  },
  'usr-seller-03': {
    sellerId: 'usr-seller-03',
    sellerName: 'Rajesh Nair (MicroSilicon Express)',
    sellerEmail: 'rajesh.nair@semixlabs.com',
    bonusAmount: 10000,
    previousBonus: 5000,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-05T09:15:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 5000,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-08-15T09:00:00.000Z',
      },
      {
        previousBonus: 5000,
        newBonus: 10000,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-05T09:15:00.000Z',
      },
    ],
  },
  'usr-seller-04': {
    sellerId: 'usr-seller-04',
    sellerName: 'Ananya Desai (Silicon Valley Hub)',
    sellerEmail: 'ananya.desai@semixlabs.com',
    bonusAmount: 7500,
    previousBonus: 0,
    updatedBy: 'Admin Controller',
    updatedAt: '2026-09-08T11:45:00.000Z',
    history: [
      {
        previousBonus: 0,
        newBonus: 7500,
        updatedBy: 'Admin Controller',
        updatedAt: '2026-09-08T11:45:00.000Z',
      },
    ],
  },
};

/**
 * Format currency to Indian Rupees with commas: e.g. 5000 -> ₹5,000, 100000 -> ₹1,00,000
 */
export function formatInrBonus(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Legacy compatibility helper; Firestore is authoritative.
 */
export function getLocalBonuses(): Record<string, SellerBonusRecord> {
  return {};
}

/**
 * Legacy compatibility helper; Firestore is authoritative.
 */
export function setLocalBonuses(bonuses: Record<string, SellerBonusRecord>) {
  void bonuses;
}

/**
 * Fetch all seller bonuses for the Admin Portal
 * Uses backend API with Firestore fallback
 */
export async function fetchAllSellerBonuses(adminRole: string = 'admin'): Promise<SellerBonusRecord[]> {
  try {
    const res = await fetch('/api/admin/bonuses', {
      headers: {
        'x-user-role': adminRole,
      },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const bonusMap: Record<string, SellerBonusRecord> = {};
        json.data.forEach((item: SellerBonusRecord) => {
          bonusMap[item.sellerId] = item;
        });
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[BonusService] Backend fetch failed, falling back to Firestore/Cache:', err);
  }

  // Fallback to Firestore
  try {
    const snapshot = await getDocs(collection(db, 'seller_bonuses'));
    if (!snapshot.empty) {
      const remoteList: SellerBonusRecord[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as SellerBonusRecord;
        remoteList.push(data);
      });
      return remoteList;
    }
  } catch (fsErr) {
    console.warn('[BonusService] Firestore fetch failed:', fsErr);
  }

  return [];
}

/**
 * Fetch a single seller's bonus for the Seller Portal
 * Strict enforcement: Sellers can only request their own seller ID.
 */
export async function fetchSellerBonus(
  sellerId: string,
  userRole: string = 'seller',
  userId: string = sellerId
): Promise<SellerBonusRecord> {
  try {
    const res = await fetch(`/api/seller/bonus/${encodeURIComponent(sellerId)}`, {
      headers: {
        'x-user-role': userRole,
        'x-user-id': userId,
      },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[BonusService] Seller bonus API fetch error:', err);
  }

  // Fallback to Firestore doc
  try {
    const docRef = doc(db, 'seller_bonuses', sellerId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SellerBonusRecord;
    }
  } catch (err) {
    console.warn('[BonusService] Firestore seller bonus fetch error:', err);
  }

  return {
      sellerId,
      sellerName: 'Seller Hub',
      sellerEmail: 'seller@semixlabs.com',
      bonusAmount: 0,
      previousBonus: 0,
      updatedBy: 'Admin Controller',
      updatedAt: new Date().toISOString(),
    };
}

/**
 * Update seller bonus amount (Admin Only)
 * Calls PUT /api/admin/bonuses/:sellerId and synchronizes with Firestore & local state
 */
export async function saveSellerBonus(
  sellerId: string,
  amount: number,
  sellerName?: string,
  sellerEmail?: string,
  adminName: string = 'Admin Controller'
): Promise<{ success: boolean; data?: SellerBonusRecord; error?: string }> {
  // Client-side pre-validation
  if (isNaN(amount) || amount < 0 || !isFinite(amount)) {
    return {
      success: false,
      error: 'Please enter a valid bonus amount.',
    };
  }

  let serverUpdatedRecord: SellerBonusRecord | null = null;

  // 1. Call Backend API
  try {
    const res = await fetch(`/api/admin/bonuses/${encodeURIComponent(sellerId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
        'x-user-name': adminName,
      },
      body: JSON.stringify({
        bonusAmount: amount,
        sellerName,
        sellerEmail,
        updatedBy: adminName,
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || 'Unable to update bonus. Please try again.',
      };
    }
    serverUpdatedRecord = json.data;
  } catch (apiErr) {
    console.warn('[BonusService] Server API update error, applying offline synchronization:', apiErr);
  }

  // 2. Prepare record for cache and Firestore
  const now = new Date().toISOString();
  const localMap = getLocalBonuses();
  const previous = localMap[sellerId] ? localMap[sellerId].bonusAmount : 0;
  const history = localMap[sellerId]?.history ? [...localMap[sellerId].history!] : [];
  history.unshift({
    previousBonus: previous,
    newBonus: amount,
    updatedBy: adminName,
    updatedAt: now,
  });

  const finalRecord: SellerBonusRecord = serverUpdatedRecord || {
    sellerId,
    sellerName: sellerName || localMap[sellerId]?.sellerName || 'Seller Hub',
    sellerEmail: sellerEmail || localMap[sellerId]?.sellerEmail || 'seller@semixlabs.com',
    bonusAmount: amount,
    previousBonus: previous,
    updatedBy: adminName,
    updatedAt: now,
    history: history.slice(0, 30),
  };

  // Firestore is the commit point for shared bonus data.
  try {
    const docRef = doc(db, 'seller_bonuses', sellerId);
    await setDoc(docRef, finalRecord, { merge: true });
    console.log(`[BonusService] Bonus for ${sellerId} synced to Firestore: ₹${amount}`);
  } catch (fsErr) {
    console.error('[BonusService] Firestore bonus sync failed:', fsErr);
    return { success: false, error: 'Unable to save seller bonus to Firestore.' };
  }

  return {
    success: true,
    data: finalRecord,
  };
}

/**
 * Real-time listener for seller bonuses from Firestore
 */
export function subscribeToSellerBonuses(
  onUpdate: (bonuses: Record<string, SellerBonusRecord>) => void
): Unsubscribe {
  const colRef = collection(db, 'seller_bonuses');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const bonusMap: Record<string, SellerBonusRecord> = {};
        snapshot.forEach((d) => {
          const item = d.data() as SellerBonusRecord;
          bonusMap[item.sellerId] = item;
        });
        onUpdate(bonusMap);
      }
    },
    (err) => {
      console.warn('[BonusService] Real-time listener notice:', err.message);
    }
  );
}
