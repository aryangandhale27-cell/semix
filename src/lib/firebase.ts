import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  EmailAuthProvider,
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Explicit Firebase Project Configuration for semix-ai-stdio
export const firebaseConfig = {
  apiKey: "AIzaSyAVaZJB98FlMUDeuuO_qqIw3EukBGdcFxQ",
  authDomain: "semix-ai-stdio.firebaseapp.com",
  projectId: "semix-ai-stdio",
  storageBucket: "semix-ai-stdio.firebasestorage.app",
  messagingSenderId: "312890264856",
  appId: "1:312890264856:web:48517354007f37690ee26d",
  measurementId: "G-D4N1QLV5C6"
};

// Initialize Firebase App instance
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (default database in semix-ai-stdio)
export const db = getFirestore(app);

// Initialize Firebase Auth & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const emailAuthProvider = new EmailAuthProvider();
export { EmailAuthProvider, GoogleAuthProvider, onAuthStateChanged, fbSignOut as signOut };

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is offline or network constrained.');
    } else {
      console.log('Firebase connection ping executed.');
    }
  }
}

// Kick off initial connection test
testFirestoreConnection();

// Google Sign-In helper
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

// Firebase Sign-out helper
export async function signOutUser() {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

// Email/Gmail & Password Sign-In
export async function signInWithEmailPassword(email: string, pass: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return userCredential.user;
  } catch (error: any) {
    console.warn('Firebase signInWithEmailAndPassword result:', error?.code || error?.message);
    throw error;
  }
}

// Email/Gmail & Password Registration
export async function registerWithEmailPassword(email: string, pass: string, displayName?: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && userCredential.user) {
      try {
        await updateProfile(userCredential.user, { displayName });
      } catch (profileErr) {
        console.warn('Profile name update skipped:', profileErr);
      }
    }
    if (userCredential.user) {
      try {
        await sendEmailVerification(userCredential.user);
        console.log('[Firebase] Verification email dispatched to', email);
      } catch (verifyErr) {
        console.warn('[Firebase] Email verification dispatch notice:', verifyErr);
      }
    }
    return userCredential.user;
  } catch (error: any) {
    console.warn('Firebase createUserWithEmailAndPassword result:', error?.code || error?.message);
    throw error;
  }
}

// Password Reset Email
export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (error: any) {
    console.warn('Firebase sendPasswordResetEmail result:', error?.code || error?.message);
    throw error;
  }
}
