import { deleteApp, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseConfig, handleFirestoreError, OperationType } from '../lib/firebase';
import { AuthUser, CreateUserPayload } from '../types';

export async function createAdminManagedUser(
  payload: CreateUserPayload
): Promise<AuthUser> {
  const secondaryApp = initializeApp(firebaseConfig, `admin-user-create-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const secondaryAuth = getAuth(secondaryApp);
  let uid: string | undefined;

  try {
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      payload.email.trim().toLowerCase(),
      payload.password
    );
    uid = credential.user.uid;

    try {
      await sendEmailVerification(credential.user);
    } catch (error) {
      console.warn('[AdminUserService] Verification email could not be sent:', error);
    }

    const userRecord: AuthUser = {
      id: uid,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      role: payload.role,
      status: payload.status || 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      businessName: payload.businessName?.trim(),
      gstin: payload.gstin?.trim(),
      warehouseHub: payload.warehouseHub?.trim(),
      commissionRate: payload.commissionRate?.trim(),
      settlementTerms: payload.settlementTerms?.trim(),
      department: payload.department?.trim(),
      designation: payload.designation?.trim(),
      permissionLevel: payload.permissionLevel,
      shippingAddress: payload.shippingAddress?.trim(),
      city: payload.city?.trim(),
      state: payload.state?.trim(),
      pincode: payload.pincode?.trim(),
    };

    const userData = {
      uid,
      name: userRecord.name,
      displayName: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone || '',
      role: userRecord.role,
      status: userRecord.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      businessName: userRecord.businessName || '',
      gstin: userRecord.gstin || '',
      warehouseHub: userRecord.warehouseHub || '',
      commissionRate: userRecord.commissionRate || '',
      settlementTerms: userRecord.settlementTerms || '',
      department: userRecord.department || '',
      designation: userRecord.designation || '',
      permissionLevel: userRecord.permissionLevel || '',
      shippingAddress: userRecord.shippingAddress || '',
      city: userRecord.city || '',
      state: userRecord.state || '',
      pincode: userRecord.pincode || '',
    };

    try {
      await setDoc(doc(db, 'users', uid), userData, { merge: true });
      if (payload.role === 'team') {
        await setDoc(doc(db, 'staff', uid), {
          uid,
          email: userRecord.email,
          name: userRecord.name,
          role: 'team',
          department: userRecord.department || 'Warehouse & Fulfillment',
          active: userRecord.status === 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      await deleteDoc(doc(db, 'users', uid)).catch(() => undefined);
      if (payload.role === 'team') {
        await deleteDoc(doc(db, 'staff', uid)).catch(() => undefined);
      }
      await credential.user.delete().catch(() => undefined);
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }

    return userRecord;
  } finally {
    await signOut(secondaryAuth).catch(() => undefined);
    await deleteApp(secondaryApp).catch(() => undefined);
  }
}
