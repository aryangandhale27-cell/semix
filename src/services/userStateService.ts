import { doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CartItem } from '../types';

export interface UserAppState {
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  checkoutDraft?: Record<string, unknown> | null;
  profile?: Record<string, unknown> | null;
}

const emptyState: UserAppState = { cart: [], wishlist: [], compareList: [], checkoutDraft: null };

export function subscribeToUserAppState(
  userId: string,
  onData: (state: UserAppState) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'users', userId, 'private', 'appState'),
    (snapshot) => onData({ ...emptyState, ...(snapshot.data() as Partial<UserAppState> || {}) }),
    (error) => {
      console.error('[UserState] Firestore subscription failed:', error);
      onError?.(error);
    }
  );
}

export async function saveUserAppState(
  userId: string,
  state: Partial<UserAppState>
): Promise<void> {
  if (auth.currentUser?.uid !== userId) {
    throw new Error('Cannot write another user\'s private state.');
  }
  try {
    await setDoc(doc(db, 'users', userId, 'private', 'appState'), state, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/private/appState`);
  }
}
