import { deleteApp, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  auth,
  db,
  firebaseConfig,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';

import { AuthUser, CreateUserPayload } from '../types';

/**
 * Creates a Firebase Authentication account from the Admin panel
 * without replacing the currently logged-in Admin session.
 *
 * IMPORTANT:
 * - The secondary Firebase Auth instance is used ONLY to create the
 *   new Authentication account.
 * - Firestore writes are performed using the PRIMARY Firebase app,
 *   which keeps the currently logged-in Admin as request.auth.
 * - The new user's role is stored explicitly in users/{uid}.
 * - Team members are also stored in staff/{uid}.
 */
export async function createAdminManagedUser(
  payload: CreateUserPayload
): Promise<AuthUser> {
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanName = payload.name.trim();
  const cleanPhone = payload.phone.trim();

  /**
   * ---------------------------------------------------------------
   * 1. VERIFY PRIMARY ADMIN SESSION
   * ---------------------------------------------------------------
   *
   * The secondary Auth instance below must NEVER be used for
   * Firestore authorization.
   *
   * Firestore rules will see the authenticated user from the
   * primary Firebase app.
   */
  const currentAdmin = auth.currentUser;

  if (!currentAdmin) {
    throw new Error(
      'Admin session expired. Please sign in again before creating a user.'
    );
  }

  const adminEmail = currentAdmin.email?.trim().toLowerCase() || '';

  const isKnownAdmin =
    adminEmail === 'admin@semixlabs.com' ||
    adminEmail === 'aryangandhale27@gmail.com' ||
    adminEmail.includes('admin@');

  if (!isKnownAdmin) {
    throw new Error(
      'Only an authenticated SEMIX LABS administrator can create managed users.'
    );
  }

  /**
   * ---------------------------------------------------------------
   * 2. VALIDATE INPUT
   * ---------------------------------------------------------------
   */

  if (!cleanName) {
    throw new Error('Full Name is required.');
  }

  if (
    !cleanEmail ||
    !cleanEmail.includes('@') ||
    !cleanEmail.includes('.')
  ) {
    throw new Error(
      'Please enter a valid email address.'
    );
  }

  if (!cleanPhone) {
    throw new Error('Phone number is required.');
  }

  if (!payload.password || payload.password.length < 6) {
    throw new Error(
      'Password must be at least 6 characters long.'
    );
  }

  if (
    payload.role !== 'customer' &&
    payload.role !== 'seller' &&
    payload.role !== 'team' &&
    payload.role !== 'admin'
  ) {
    throw new Error(
      'Invalid user role. Please select Customer, Seller, Team or Admin.'
    );
  }

  /**
   * ---------------------------------------------------------------
   * 3. CREATE SECONDARY FIREBASE AUTH INSTANCE
   * ---------------------------------------------------------------
   *
   * This is intentionally separate from the Admin's primary
   * authentication session.
   *
   * Creating the new account here prevents Firebase from replacing
   * auth.currentUser with the newly created team member.
   */
  const secondaryApp = initializeApp(
    firebaseConfig,
    `admin-user-create-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`
  );

  const secondaryAuth = getAuth(secondaryApp);

  let uid: string | undefined;
  try {
    /**
     * -------------------------------------------------------------
     * 4. CREATE FIREBASE AUTH ACCOUNT
     * -------------------------------------------------------------
     */

    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      cleanEmail,
      payload.password
    );

    uid = credential.user.uid;
    console.log(
      '[AdminUserService] Firebase Auth account created:',
      {
        uid,
        email: cleanEmail,
        role: payload.role,
      }
    );

    /**
     * Send verification email.
     *
     * Failure here must NOT cancel account creation.
     */
    try {
      await sendEmailVerification(credential.user);
    } catch (error) {
      console.warn(
        '[AdminUserService] Verification email could not be sent:',
        error
      );
    }

    /**
     * -------------------------------------------------------------
     * 5. BUILD AUTHORITATIVE USER PROFILE
     * -------------------------------------------------------------
     */

    const userRecord: AuthUser = {
      id: uid,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
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

    /**
     * -------------------------------------------------------------
     * 6. USERS/{UID} FIRESTORE PROFILE
     * -------------------------------------------------------------
     *
     * This document is the authoritative application profile.
     *
     * Most importantly:
     *
     * role: userRecord.role
     *
     * Therefore a Team Member remains a Team Member after refresh.
     */

    const userData = {
      uid: uid,

      name: userRecord.name,
      displayName: userRecord.name,

      email: userRecord.email,
      phone: userRecord.phone || '',

      // AUTHORITATIVE ROLE
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

    /**
     * -------------------------------------------------------------
     * 7. WRITE USERS/{UID}
     * -------------------------------------------------------------
     *
     * IMPORTANT:
     * We use the PRIMARY db instance here.
     *
     * The primary auth session is still the Admin.
     */
    try {
      await setDoc(
        doc(db, 'users', uid),
        userData,
        { merge: true }
      );

      console.log(
        `[AdminUserService] users/${uid} created successfully with role: ${userRecord.role}`
      );
    } catch (error: any) {
      console.error(
        '[AdminUserService] FAILED writing users profile:',
        error
      );

      /**
       * Do NOT attempt deleteDoc() here.
       *
       * If the original write was permission-denied,
       * deleteDoc() will normally be permission-denied too and
       * would only hide the original error.
       */

      await credential.user
        .delete()
        .catch((deleteError) => {
          console.error(
            '[AdminUserService] Could not roll back Firebase Auth user:',
            deleteError
          );
        });

      const firestoreError = new Error(
        `Firestore rejected creation of users/${uid}. ` +
        `The authenticated Admin session does not currently have permission ` +
        `to create this user profile.`
      );

      (firestoreError as any).code =
        error?.code || 'permission-denied';

      throw firestoreError;
    }

    /**
     * -------------------------------------------------------------
     * 8. VERIFY USERS/{UID}
     * -------------------------------------------------------------
     *
     * This prevents the application from reporting success when
     * Firebase Auth exists but the application profile does not.
     */
    try {
      const savedUserSnapshot = await getDoc(
        doc(db, 'users', uid)
      );

      if (!savedUserSnapshot.exists()) {
        console.error(
          `[AdminUserService] users/${uid} does not exist after successful write.`
        );

        await credential.user
          .delete()
          .catch((deleteError) => {
            console.error(
              '[AdminUserService] Auth rollback failed:',
              deleteError
            );
          });

        throw new Error(
          `User profile verification failed for users/${uid}.`
        );
      }

      const savedUserData = savedUserSnapshot.data();

      /**
       * CRITICAL ROLE VERIFICATION
       */
      if (savedUserData.role !== userRecord.role) {
        console.error(
          '[AdminUserService] ROLE VERIFICATION FAILED:',
          {
            expected: userRecord.role,
            actual: savedUserData.role,
            uid,
          }
        );

        await credential.user
          .delete()
          .catch((deleteError) => {
            console.error(
              '[AdminUserService] Auth rollback failed:',
              deleteError
            );
          });

        await deleteDoc(
          doc(db, 'users', uid)
        ).catch(() => undefined);

        throw new Error(
          `User profile was created with the wrong role. Expected "${userRecord.role}" but Firestore contains "${savedUserData.role}".`
        );
      }

      console.log(
        `[AdminUserService] VERIFIED users/${uid} role = ${savedUserData.role}`
      );
    } catch (error: any) {
      /**
       * If this is already our explicit role/profile error,
       * propagate it.
       */
      if (
        error?.message?.includes('User profile verification failed') ||
        error?.message?.includes('wrong role')
      ) {
        throw error;
      }

      /**
       * If the verification read itself fails, do not silently
       * continue because the role cannot safely be trusted.
       */
      console.error(
        '[AdminUserService] Could not verify users profile:',
        error
      );

      throw new Error(
        `User account was created but the Firestore profile could not be verified. ${error?.message || ''}`
      );
    }

    /**
     * -------------------------------------------------------------
     * 9. TEAM MEMBER STAFF PROFILE
     * -------------------------------------------------------------
     *
     * Team members are stored in BOTH:
     *
     * users/{uid}
     * staff/{uid}
     *
     * The same UID is intentionally used in both places.
     */
    if (payload.role === 'team') {
      const staffData = {
        uid,

        email: userRecord.email,
        name: userRecord.name,

        // AUTHORITATIVE TEAM ROLE
        role: 'team',

        department:
          userRecord.department ||
          'Warehouse & Fulfillment',

        active:
          userRecord.status === 'active',

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(
          doc(db, 'staff', uid),
          staffData,
          { merge: true }
        );

        console.log(
          `[AdminUserService] staff/${uid} created successfully.`
        );
      } catch (error: any) {
        console.error(
          '[AdminUserService] FAILED writing staff profile:',
          error
        );

        /**
         * The users profile already exists.
         *
         * Do NOT delete users/{uid} here because the primary
         * problem is specifically the staff write.
         *
         * The AuthContext can still use users/{uid}.role = team,
         * which is the authoritative application role.
         */
        const staffError = new Error(
          `Team member account was created, but staff/${uid} could not be saved. ` +
          `Check Firestore permissions for the staff collection.`
        );

        (staffError as any).code =
          error?.code || 'permission-denied';

        throw staffError;
      }

      /**
       * Verify staff document.
       */
      try {
        const staffSnapshot = await getDoc(
          doc(db, 'staff', uid)
        );

        if (!staffSnapshot.exists()) {
          throw new Error(
            `staff/${uid} was not found after creation.`
          );
        }

        const savedStaffData = staffSnapshot.data();

        if (savedStaffData.role !== 'team') {
          throw new Error(
            `staff/${uid} contains an invalid role: ${savedStaffData.role}`
          );
        }

        console.log(
          `[AdminUserService] VERIFIED staff/${uid} role = team`
        );
      } catch (error: any) {
        console.error(
          '[AdminUserService] Staff verification failed:',
          error
        );

        throw new Error(
          `Team member was created but staff profile verification failed. ${error?.message || ''}`
        );
      }
    }

    /**
     * -------------------------------------------------------------
     * 10. FINAL SAFETY CHECK
     * -------------------------------------------------------------
     *
     * Confirm the Admin session is STILL the Admin session.
     *
     * The secondary account must never replace the primary session.
     */
    const adminAfterCreation = auth.currentUser;

    if (!adminAfterCreation) {
      throw new Error(
        'Admin session was lost during user creation. Please sign in again.'
      );
    }

    const adminAfterEmail =
      adminAfterCreation.email?.trim().toLowerCase() || '';

    if (
      adminAfterEmail !== adminEmail
    ) {
      console.error(
        '[AdminUserService] PRIMARY AUTH SESSION CHANGED:',
        {
          before: adminEmail,
          after: adminAfterEmail,
        }
      );

      throw new Error(
        'The Admin authentication session changed unexpectedly during user creation.'
      );
    }

    console.log(
      '[AdminUserService] Admin session preserved:',
      adminAfterEmail
    );

    /**
     * -------------------------------------------------------------
     * 11. RETURN COMPLETE USER RECORD
     * -------------------------------------------------------------
     */

    return userRecord;
  } catch (error) {
    console.error(
      '[AdminUserService] Admin managed user creation failed:',
      error
    );

    throw error;
  } finally {
    /**
     * -------------------------------------------------------------
     * 12. CLEAN UP SECONDARY AUTH INSTANCE
     * -------------------------------------------------------------
     *
     * This signs out ONLY the temporary secondary Auth instance.
     *
     * It does NOT sign out the Admin's primary Firebase session.
     */
    await signOut(secondaryAuth).catch(() => undefined);

    await deleteApp(secondaryApp).catch(() => undefined);

    console.log(
      '[AdminUserService] Secondary Firebase app cleaned up.'
    );
  }
}