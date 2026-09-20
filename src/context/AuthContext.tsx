import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AuthUser, UserRole, CreateUserPayload } from '../types';
import { useApp } from './AppContext';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser,
  signInWithEmailPassword,
  registerWithEmailPassword,
  sendPasswordReset
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { syncUserToFirestore, fetchUsersFromFirestore, deleteUserFromFirestore } from '../services/firebaseService';
import { createAdminManagedUser } from '../services/adminUserService';
import { sendWelcomeEmail } from '../services/emailService';

export interface DemoCredential {
  role: UserRole;
  roleTitle: string;
  email: string;
  password: string;
  name: string;
  department?: string;
  defaultRedirect: string;
  description: string;
  badgeColor: string;
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoCredential> = {
  customer: {
    role: 'customer',
    roleTitle: 'Customer / Maker',
    email: 'customer@semixlabs.com',
    password: 'Customer@123',
    name: 'Aryan Gandhale',
    defaultRedirect: '/customer/dashboard',
    description: 'Hardware maker, ordering components & tracking prototype orders',
    badgeColor: 'bg-[#FF6B00] text-white',
  },
  seller: {
    role: 'seller',
    roleTitle: 'Seller / Fulfilment Staff',
    email: 'seller@semixlabs.com',
    password: 'Seller@123',
    name: 'Seller Hub',
    department: 'Seller Fulfilment & Vendor Dispatch',
    defaultRedirect: '/seller',
    description: 'Component merchant, packing lists, order dispatches & revenue analytics',
    badgeColor: 'bg-emerald-600 text-white',
  },
  team: {
    role: 'team',
    roleTitle: 'Inventory & Dispatch Team',
    email: 'team@semixlabs.com',
    password: 'Team@123',
    name: 'Sanjay Verma',
    department: 'Warehouse & Fulfillment',
    defaultRedirect: '/team/fulfillment?tab=stock',
    description: 'Warehouse packing desk, inventory edits & stock discrepancies',
    badgeColor: 'bg-[#561269] text-white',
  },
  admin: {
    role: 'admin',
    roleTitle: 'System Administrator',
    email: 'admin@semixlabs.com',
    password: 'Admin@123',
    name: 'Admin Controller',
    department: 'Operations Command',
    defaultRedirect: '/admin/dashboard',
    description: 'Full catalog control, pricing tiers, staff management & escalations',
    badgeColor: 'bg-purple-700 text-white',
  },
};

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'register';
  authRedirectUrl: string | null;
  authNoticeMessage: string | null;
  openAuthModal: (tab?: 'signin' | 'register', redirectUrl?: string, notice?: string) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string, redirectTo?: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  demoCredentials: typeof DEMO_CREDENTIALS;
  autoLoginAs: (role: UserRole) => void;

  // Admin User Management
  registeredUsers: Array<AuthUser & { passwordHash: string }>;
  createUser: (payload: CreateUserPayload) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  updateUser: (id: string, updates: Partial<AuthUser & { passwordHash?: string }>) => Promise<{ success: boolean; error?: string }>;
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => { success: boolean; error?: string };
  switchUser: (targetUserOrId: string | AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEYS = {
  CURRENT_USER: 'rietz_auth_user_v6',
  REGISTERED_USERS: 'rietz_registered_accounts_v6',
};

const DEFAULT_USERS: Array<AuthUser & { passwordHash: string }> = [
  {
    id: 'usr-admin-01',
    name: 'Admin Controller',
    email: 'admin@semixlabs.com',
    passwordHash: 'Admin@123',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 99999 88888',
    department: 'Executive Operations',
    designation: 'Chief Platform Controller',
    permissionLevel: 'Full Access',
    status: 'active',
    createdAt: '2025-08-01',
  },
  {
    id: 'usr-team-01',
    name: 'Sanjay Verma',
    email: 'team@semixlabs.com',
    passwordHash: 'Team@123',
    password: 'Team@123',
    role: 'team',
    phone: '+91 98234 56789',
    department: 'Warehouse & Fulfillment',
    designation: 'Dispatch Lead & QA',
    permissionLevel: 'Operations Supervisor',
    status: 'active',
    createdAt: '2025-11-20',
  },

  {
    id: 'usr-cust-01',
    name: 'Aryan Gandhale',
    email: 'customer@semixlabs.com',
    passwordHash: 'Customer@123',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 98765 43210',
    status: 'active',
    createdAt: '2026-01-10',
  },
  {
    id: 'usr-cust-02',
    name: 'Aryan Gandhale',
    email: 'aryangandhale27@gmail.com',
    passwordHash: 'Customer@123',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 98765 43210',
    status: 'active',
    createdAt: '2026-01-10',
  },
];

// Helper to reliably evaluate demo credentials with flexible matching
const matchDemoUser = (inputEmail: string, inputPass: string): AuthUser | null => {
  const cleanEmail = inputEmail.trim().toLowerCase();
  const cleanPass = inputPass.trim();
  const lowerPass = cleanPass.toLowerCase();

  // 1. Customer Match (including Aryan's email and alias names)
  const isCustomer = 
    ['customer@semixlabs.com', 'customer@rietzz.com', 'customer', 'maker', 'aryan', 'aryangandhale27@gmail.com'].includes(cleanEmail);
  const isCustomerPass = 
    ['customer@123', 'customer123', 'aryan@123', 'aryan123', '123456', 'password', 'customer'].includes(lowerPass) ||
    cleanPass === 'Customer@123';

  if (isCustomer && isCustomerPass) {
    return {
      id: 'usr-cust-01',
      name: 'Aryan Gandhale',
      email: cleanEmail.includes('@') ? cleanEmail : 'customer@semixlabs.com',
      role: 'customer',
      phone: '+91 98765 43210',
      department: 'Hardware Prototyping',
      createdAt: '2026-01-10',
    };
  }

  // 2. Admin Match
  const isAdmin = 
    ['admin@semixlabs.com', 'admin@rietzz.com', 'admin', 'administrator', 'admin@semix.com'].includes(cleanEmail);
  const isAdminPass = 
    ['admin@123', 'admin123', 'admin@1234', 'admin', '123456'].includes(lowerPass) ||
    cleanPass === 'Admin@123';

  if (isAdmin && isAdminPass) {
    return {
      id: 'usr-admin-01',
      name: 'Admin Controller',
      email: 'admin@semixlabs.com',
      role: 'admin',
      phone: '+91 99999 88888',
      department: 'Executive Operations',
      createdAt: '2025-08-01',
    };
  }

  // 3. Team Match
  const isTeam = 
    ['team@semixlabs.com', 'team@rietzz.com', 'team', 'warehouse', 'fulfillment'].includes(cleanEmail);
  const isTeamPass = 
    ['team@123', 'team123', 'team@1234', 'team', '123456'].includes(lowerPass) ||
    cleanPass === 'Team@123';

  if (isTeam && isTeamPass) {
    return {
      id: 'usr-team-01',
      name: 'Sanjay Verma',
      email: 'team@semixlabs.com',
      role: 'team',
      phone: '+91 98234 56789',
      department: 'Warehouse Fulfillment',
      createdAt: '2025-11-20',
    };
  }

  // 4. Seller Match
  const isSeller = 
    ['seller@semixlabs.com', 'seller@rietzz.com', 'seller', 'merchant', 'vendor'].includes(cleanEmail);
  const isSellerPass = 
    ['seller@123', 'seller123', 'seller@1234', 'seller1234', 'seller', '123456'].includes(lowerPass) ||
    cleanPass === 'Seller@123' || cleanPass === 'Seller@1234';

  if (isSeller && isSellerPass) {
    return {
      id: 'usr-seller-demo',
      name: 'Seller Hub',
      email: 'seller@semixlabs.com',
      role: 'seller',
      phone: '',
      department: 'Seller Fulfilment & Vendor Dispatch',
      createdAt: '2026-02-01',
    };
  }

  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast, setCurrentRole, addAvailableSeller, updateAvailableSeller, removeAvailableSeller, addStaff } = useApp();

  // Keep only the root admin as a local fallback; other accounts must come from Firestore.
  const [registeredUsers, setRegisteredUsers] = useState<Array<AuthUser & { passwordHash: string }>>(() => {
  const map = new Map<string, AuthUser & { passwordHash: string }>();

  DEFAULT_USERS
    .filter((u) => u.role === 'admin')
    .forEach((u) => map.set(u.email.toLowerCase(), u));

  return Array.from(map.values());
});

const [usersLoaded, setUsersLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<NonNullable<typeof auth.currentUser>>(null);

  // Current session user
  const [user, setUser] = useState<AuthUser | null>(null);
  const isSigningOutRef = useRef(false);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'register'>('signin');
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | null>(null);
  const [authNoticeMessage, setAuthNoticeMessage] = useState<string | null>(null);

  // Firebase rules require an authenticated request, so wait for Auth to finish
  // restoring the session before reading the users and staff directories.
  useEffect(() => {
    if (!authReady || !firebaseAuthUser) return;

    fetchUsersFromFirestore()
      .then((remoteUsers) => {
        if (remoteUsers && remoteUsers.length > 0) {
          setRegisteredUsers((prev) => {
            const map = new Map<string, AuthUser & { passwordHash: string }>();
            prev.forEach((u) => map.set(u.id, u));
            remoteUsers.forEach((ru) => {
              const previousEntry = Array.from(map.entries()).find(
                ([, existing]) => existing.email.toLowerCase() === ru.email.toLowerCase()
              );
              if (previousEntry) map.delete(previousEntry[0]);
              map.set(ru.id, {
                ...ru,
                passwordHash: '',
                password: '',
              });
            });
            return Array.from(map.values());
          });

          remoteUsers
            .filter((user) => user.role === 'seller')
            .forEach((seller) => {
              addAvailableSeller({
                id: seller.id,
                name: seller.businessName ? `${seller.name} (${seller.businessName})` : seller.name,
                email: seller.email,
                phone: seller.phone || '',
                warehouseHub: seller.warehouseHub || 'Warehouse Hub',
                gstin: seller.gstin || '',
                rating: 5.0,
                status: seller.status || 'active',
                businessName: seller.businessName,
                commissionRate: seller.commissionRate,
                settlementTerms: seller.settlementTerms,
              });
            });
        }
      })
          .catch((err) => {
      console.log('[Firestore] User initial fetch status:', err?.message || err);
    })
    .finally(() => {
      setUsersLoaded(true);
    });

  }, [authReady, firebaseAuthUser]);

  // Listen to Firebase Auth state changes and rehydrate the current user after refresh.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthReady(true);
      setFirebaseAuthUser(firebaseUser);

      if (isSigningOutRef.current && firebaseUser) return;
      if (!firebaseUser) {
        isSigningOutRef.current = false;
        setUser(null);
        return;
      }

      const cleanEmail = firebaseUser.email?.toLowerCase() || '';
      const isAryanAdmin = cleanEmail === 'aryangandhale27@gmail.com' || cleanEmail.includes('admin@');
      const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      const assignedRole: UserRole = matchedUser?.role || (isAryanAdmin ? 'admin' : 'customer');

      const authPayload: AuthUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || matchedUser?.name || cleanEmail.split('@')[0].replace(/[._]/g, ' '),
        email: cleanEmail,
        role: assignedRole,
        phone: firebaseUser.phoneNumber || matchedUser?.phone || '',
        department: matchedUser?.department || (assignedRole === 'admin' ? 'Executive Operations' : undefined),
        status: matchedUser?.status || 'active',
        createdAt: matchedUser?.createdAt || new Date().toISOString().slice(0, 10),
      };

      setUser((prev) => {
        const sameUser = prev && prev.id === authPayload.id && prev.role === authPayload.role && prev.email === authPayload.email;
        return sameUser ? prev : authPayload;
      });
    });

    return () => unsubscribe();
  }, [registeredUsers]);

  // Firebase Auth owns session persistence; React only mirrors the current session.
  useEffect(() => {
    if (user) {
      setCurrentRole(user.role);
    } else {
      setCurrentRole('customer');
    }
  }, [user]);

  const openAuthModal = (tab: 'signin' | 'register' = 'signin', redirectUrl?: string, notice?: string) => {
    setAuthModalTab(tab);
    setAuthRedirectUrl(redirectUrl || null);
    setAuthNoticeMessage(notice || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthNoticeMessage(null);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { 
        success: false, 
        error: 'Please enter both your email address and password.' 
      };
    }

    // 1. Guaranteed Demo Account Matching (handles aliases, lowercase passwords, shorthand role names)
    const demoUser = null;
    if (demoUser) {
      try {
        let firebaseUser;
        try {
          firebaseUser = await signInWithEmailPassword(demoUser.email, cleanPass);
        } catch (demoSignInError: any) {
          if (demoSignInError?.code !== 'auth/user-not-found' || cleanPass.length < 6) {
            throw demoSignInError;
          }
          firebaseUser = await registerWithEmailPassword(demoUser.email, cleanPass, demoUser.name);
        }

        const authPayload: AuthUser = {
          ...demoUser,
          id: firebaseUser.uid,
          email: demoUser.email,
        };
        setUser(authPayload);
        setIsAuthModalOpen(false);
        setAuthNoticeMessage(null);
        await syncUserToFirestore(authPayload);
        showToast(
          `Welcome back, ${authPayload.name}!`,
          `Signed in via Firebase Auth (${authPayload.role.toUpperCase()})`,
          'success'
        );
        return { success: true, role: authPayload.role };
      } catch (demoAuthError: any) {
        console.error('[Auth] Demo role Firebase sign-in failed:', demoAuthError);
        return {
          success: false,
          error: 'This role must be signed in through Firebase Authentication before it can manage catalog data.',
        };
      }
    }

    // 2. Try Firebase Authentication using Email/Gmail and Password
    try {
      const fbUser = await signInWithEmailPassword(cleanEmail, cleanPass);
      if (fbUser) {
        const isAryanAdmin =
  cleanEmail === 'aryangandhale27@gmail.com' ||
  cleanEmail.includes('admin@');

let matchedUser = registeredUsers.find(
  (u) => u.email.toLowerCase() === cleanEmail
);

if (!matchedUser) {
  const remoteUsers = await fetchUsersFromFirestore();
  matchedUser = remoteUsers.find(
    (remoteUser) => remoteUser.email.toLowerCase() === cleanEmail
  ) as (AuthUser & { passwordHash: string }) | undefined;

  if (matchedUser) {
    setRegisteredUsers((prev) => {
      const map = new Map<string, AuthUser & { passwordHash: string }>();
      prev.forEach((existingUser) => map.set(existingUser.id, existingUser));
      map.set(matchedUser!.id, {
        ...matchedUser!,
        passwordHash: '',
        password: '',
      });
      return Array.from(map.values());
    });
  }
}

if (!matchedUser && !isAryanAdmin) {
  return {
    success: false,
    error: 'Your account profile could not be found. Please contact the administrator.'
  };
}

const assignedRole: UserRole =
  matchedUser?.role || 'admin';

        const authPayload: AuthUser = {
          id: fbUser.uid,
          name: fbUser.displayName || matchedUser?.name || cleanEmail.split('@')[0].replace(/[._]/g, ' '),
          email: cleanEmail,
          role: assignedRole,
          phone: fbUser.phoneNumber || matchedUser?.phone || '',
          department: matchedUser?.department || (assignedRole === 'admin' ? 'Executive Operations' : undefined),
          status: 'active',
          createdAt: matchedUser?.createdAt || new Date().toISOString().slice(0, 10),
        };

        setUser(authPayload);
setIsAuthModalOpen(false);
setAuthNoticeMessage(null);
        showToast(
          `Welcome back, ${authPayload.name}!`,
          `Signed in via Firebase Auth (${authPayload.role.toUpperCase()})`,
          'success'
        );
        return { success: true, role: assignedRole };
      }
    } catch (fbErr: any) {
      const fbCode = fbErr?.code || '';
      console.log('Firebase signInWithEmailPassword status:', fbCode);

      if (fbCode === 'auth/user-not-found') {
  return {
    success: false,
    error: 'You are not registered. Please sign up first or create an account.'
  };
} else if (fbCode === 'auth/wrong-password') {
  return {
    success: false,
    error: 'Wrong password. Please check your password and try again.'
  };
} else if (fbCode === 'auth/invalid-credential') {
  const emailExists =
    registeredUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail
    ) ||
    cleanEmail === 'admin@semixlabs.com' ||
    cleanEmail === 'aryangandhale27@gmail.com';

  if (emailExists) {
    return {
      success: false,
      error: 'Wrong password. Please check your password and try again.'
    };
  }

  return {
    success: false,
    error: 'You are not registered. Please sign up first or create an account.'
  };
}else if (fbCode === 'auth/invalid-email') {
        return {
          success: false,
          error: 'The email address is badly formatted. Please enter a valid email or Gmail address.'
        };
      } else if (fbCode === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Access temporarily disabled due to multiple failed login attempts. Please reset your password or try again later.'
        };
      } else if (fbCode === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password provider not enabled in Firebase Console. Falling back to internal/Firestore verification.');
      }
    }

    // 3. Normalize domain if needed (@rietzz.com -> @semixlabs.com)
    const normalizedEmail = cleanEmail.replace('@rietzz.com', '@semixlabs.com');

    // 4. Check registered accounts from state (case-insensitive on password for ease-of-use)
    const matched = registeredUsers.find(
      (u) => 
        (u.email.toLowerCase() === cleanEmail || u.email.toLowerCase() === normalizedEmail) && 
        (u.passwordHash === cleanPass || u.passwordHash.toLowerCase() === cleanPass.toLowerCase() || u.password === cleanPass)
    );

    if (matched) {
      if (matched.status === 'suspended') {
        return {
          success: false,
          error: 'This account has been suspended by the platform administrator. Please contact support at office@semixlabs.com.',
        };
      }

      const authPayload: AuthUser = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        phone: matched.phone,
        department: matched.department,
        createdAt: matched.createdAt,
        status: matched.status || 'active',
        businessName: matched.businessName,
        gstin: matched.gstin,
        warehouseHub: matched.warehouseHub,
        commissionRate: matched.commissionRate,
        settlementTerms: matched.settlementTerms,
        designation: matched.designation,
        permissionLevel: matched.permissionLevel,
        shippingAddress: matched.shippingAddress,
        city: matched.city,
        state: matched.state,
        pincode: matched.pincode,
      };

      setUser(authPayload);
      setIsAuthModalOpen(false);
      setAuthNoticeMessage(null);
      syncUserToFirestore(authPayload).catch(() => {});
      return { success: true, role: authPayload.role };
    }

    

    // 6. Helpful error guidance if email is recognizable but password didn't match
    const isKnownRole = 
      cleanEmail.includes('admin') || 
      cleanEmail.includes('seller') || 
      cleanEmail.includes('team') || 
      cleanEmail.includes('customer') || 
      cleanEmail.includes('aryan');

    if (isKnownRole) {
      return { 
        success: false, 
        error: 'Password does not match. Tip: For demo roles, use password "<Role>@123" (e.g. Customer@123, Admin@123, Team@123, Seller@123) or click any 1-Click Demo card below.' 
      };
    }

    return { 
      success: false, 
      error: 'Invalid email or password. Please check your credentials or sign in with your Gmail and password.' 
    };
  };

  const loginWithGoogle = async (redirectTo?: string): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
    try {
      const fbUser = await signInWithGoogle();
      if (!fbUser) {
        return { success: false, error: 'Google sign-in was cancelled or aborted.' };
      }

      const email = fbUser.email?.toLowerCase() || '';
      const name = fbUser.displayName || 'Google User';

      // Check if user is known admin or has existing record
      const matched = registeredUsers.find((u) => u.email.toLowerCase() === email);
      const isAryanAdmin = email === 'aryangandhale27@gmail.com' || email.includes('admin@');
      const assignedRole: UserRole = matched?.role || (isAryanAdmin ? 'admin' : 'customer');

      const authPayload: AuthUser = {
        id: fbUser.uid,
        name: matched?.name || name,
        email: email,
        role: assignedRole,
        phone: fbUser.phoneNumber || matched?.phone || '',
        department: matched?.department || (assignedRole === 'admin' ? 'Executive Operations' : undefined),
        status: matched?.status || 'active',
        createdAt: matched?.createdAt || new Date().toISOString().slice(0, 10),
      };

      setUser(authPayload);
      setIsAuthModalOpen(false);
      setAuthNoticeMessage(null);

      // Persist profile to Firestore
      syncUserToFirestore(authPayload).catch((e) => console.warn('Could not sync user to Firestore:', e));

      showToast(
        `Signed in with Google!`,
        `Welcome ${authPayload.name} (${authPayload.role.toUpperCase()})`,
        'success'
      );

      return { success: true, role: assignedRole };
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      const msg = error?.message || 'Google sign-in encountered an issue.';
      showToast('Google Sign-In Error', msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (payload: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanName = payload.name.trim();

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!payload.password || payload.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Check if email already registered in local cache
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    let resolvedId = `usr-cust-${Date.now().toString().slice(-4)}`;

    // Create user in Firebase Auth with Email and Password
    try {
      const fbUser = await registerWithEmailPassword(cleanEmail, payload.password, cleanName);
      if (fbUser?.uid) {
        resolvedId = fbUser.uid;
      }
    } catch (fbErr: any) {
      const fbCode = fbErr?.code || '';
      console.warn('Firebase registration notice:', fbCode);
      if (fbCode === 'auth/email-already-in-use') {
        return { 
          success: false, 
          error: 'An account with this Gmail or email address already exists in Firebase. Please sign in with your password.' 
        };
      }
    }

    const newUserRecord: AuthUser & { passwordHash: string } = {
      id: resolvedId,
      name: cleanName,
      email: cleanEmail,
      phone: payload.phone.trim() || '+91 90000 00000',
      role: 'customer', // Self-registration is strictly for customer role
      passwordHash: payload.password,
      password: payload.password,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRegisteredUsers((prev) => [newUserRecord, ...prev]);

    const authPayload: AuthUser = {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
      role: newUserRecord.role,
      phone: newUserRecord.phone,
      status: 'active',
      createdAt: newUserRecord.createdAt,
    };

    setUser(authPayload);
    setIsAuthModalOpen(false);
    setAuthNoticeMessage(null);
    syncUserToFirestore(authPayload).catch(() => {});
    
    // Dispatch Welcome Email to user's registered Gmail / Email
    sendWelcomeEmail({ name: authPayload.name, email: authPayload.email }).catch((err) => {
      console.warn('[AuthContext] Welcome email dispatch deferred:', err);
    });

    showToast(
      'Account Created Successfully!',
      `Welcome to SEMIX LABS, ${authPayload.name}. Welcome email dispatched to ${authPayload.email}.`,
      'success'
    );

    return { success: true };
  };

  // Admin User Management implementations
  const createUser = async (payload: CreateUserPayload): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanName = payload.name.trim();
    const cleanPhone = payload.phone.trim();
    const cleanPassword = payload.password.trim();

    if (!cleanName) {
      return { success: false, error: 'Full Name is required.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address (e.g. name@domain.com).' };
    }

    // Unique email check
    const emailExists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: `An account with email "${cleanEmail}" already exists. Email must be unique.` };
    }

    // Phone number 10 digits check
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return { success: false, error: 'Phone number must contain at least 10 valid digits.' };
    }
    const formattedPhone = cleanPhone.startsWith('+91')
      ? cleanPhone
      : `+91 ${phoneDigits.slice(-10, -5)} ${phoneDigits.slice(-5)}`;

    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Role-specific validations
    if (payload.role === 'seller' && !payload.businessName?.trim()) {
      return { success: false, error: 'Store / Business Name is required for seller accounts.' };
    }

    if (payload.role === 'customer' && !payload.shippingAddress?.trim()) {
      return { success: false, error: 'Shipping Address is required for customer accounts.' };
    }

    let newUserRecord: AuthUser;
    try {
      newUserRecord = await createAdminManagedUser({
        ...payload,
        email: cleanEmail,
        name: cleanName,
        phone: formattedPhone,
        password: cleanPassword,
      });
    } catch (error: any) {
      console.error('[AuthContext] Admin user creation failed:', error);
      const code = error?.code || '';
      if (code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this email already exists in Firebase Authentication.' };
      }
      if (code === 'auth/weak-password') {
        return { success: false, error: 'Firebase rejected the password because it is too weak.' };
      }
      if (code === 'permission-denied' || error?.message?.includes('permission-denied')) {
        return { success: false, error: 'Firebase Auth succeeded, but Firestore denied the user profile write. Verify deployed rules and Admin permissions.' };
      }
      return { success: false, error: error?.message || 'Firebase could not create this user account.' };
    }

    const userId = newUserRecord.id;
    const newUserRecordWithPassword: AuthUser & { passwordHash: string } = {
      ...newUserRecord,
      passwordHash: cleanPassword,
      password: cleanPassword,
    };

    setRegisteredUsers((prev) => [newUserRecordWithPassword, ...prev]);

    // If Seller: add to availableSellers immediately for order assignments
    if (payload.role === 'seller') {
      const displayName = payload.businessName
        ? `${cleanName} (${payload.businessName})`
        : cleanName;
      addAvailableSeller({
        id: userId,
        name: displayName,
        email: cleanEmail,
        phone: formattedPhone,
        warehouseHub: newUserRecord.warehouseHub || 'Central Hub, Bengaluru',
        gstin: newUserRecord.gstin || '29AAECS0000Z1Z1',
        rating: 5.0,
        activeOrdersCount: 0,
        businessName: newUserRecord.businessName,
        commissionRate: newUserRecord.commissionRate,
        settlementTerms: newUserRecord.settlementTerms,
        status: newUserRecord.status,
      });
    }

    // If Team: add to staff in AppContext
    if (payload.role === 'team') {
      addStaff({
        name: cleanName,
        email: cleanEmail,
        role: 'team',
        department: newUserRecord.department || 'Warehouse & Fulfillment',
        active: true,
      });
    }

    if (payload.role === 'customer') {
      sendWelcomeEmail({ name: cleanName, email: cleanEmail }).catch(() => {});
    }

    showToast(
      'Account Created',
      `${cleanName} has been created as ${payload.role.toUpperCase()}. Welcome email dispatched & saved to Firestore!`,
      'success'
    );

    return { success: true, user: newUserRecord };
  };

  const updateUser = async (
    id: string,
    updates: Partial<AuthUser & { passwordHash?: string }>
  ): Promise<{ success: boolean; error?: string }> => {
    if (updates.email) {
      const cleanEmail = updates.email.trim().toLowerCase();
      const conflict = registeredUsers.some(
        (u) => u.id !== id && u.email.toLowerCase() === cleanEmail
      );
      if (conflict) {
        return { success: false, error: `Email address "${cleanEmail}" is already registered to another account.` };
      }
    }

    if (updates.phone) {
      const digits = updates.phone.replace(/\D/g, '');
      if (digits.length < 10) {
        return { success: false, error: 'Phone number must contain at least 10 valid digits.' };
      }
    }

    let targetUpdated: (AuthUser & { passwordHash: string }) | null = null;

    setRegisteredUsers((prev) => {
      const next = prev.map((u) => {
        if (u.id === id) {
          const nextUser = { ...u, ...updates };
          if (updates.passwordHash) {
            nextUser.password = updates.passwordHash;
            nextUser.passwordHash = updates.passwordHash;
          }
          targetUpdated = nextUser;
          return nextUser;
        }
        return u;
      });
      return next;
    });

    // Update active user session if this is the currently logged-in account
    if (user && user.id === id && targetUpdated) {
      setUser(targetUpdated);
    }

    // Sync with availableSellers if role is seller
    if (targetUpdated && (targetUpdated as AuthUser).role === 'seller') {
      const updatedSeller = targetUpdated as AuthUser;
      const displayName = updatedSeller.businessName
        ? `${updatedSeller.name} (${updatedSeller.businessName})`
        : updatedSeller.name;
      updateAvailableSeller(id, {
        name: displayName,
        email: updatedSeller.email,
        phone: updatedSeller.phone,
        warehouseHub: updatedSeller.warehouseHub,
        gstin: updatedSeller.gstin,
        status: updatedSeller.status,
        businessName: updatedSeller.businessName,
        commissionRate: updatedSeller.commissionRate,
        settlementTerms: updatedSeller.settlementTerms,
      });
    }

      showToast('Account Updated', 'User profile information updated successfully.', 'success');
      if (targetUpdated) {
        syncUserToFirestore(targetUpdated).catch(() => {});
      }
      return { success: true };
    };

    const toggleUserStatus = (id: string) => {
      const target = registeredUsers.find((u) => u.id === id);
      if (!target) return;

      if (target.email === 'admin@semixlabs.com') {
        showToast('Action Blocked', 'Primary Root Administrator account cannot be suspended.', 'error');
        return;
      }

      const nextStatus = target.status === 'suspended' ? 'active' : 'suspended';
      const updatedRecord = { ...target, status: nextStatus };

      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === id ? updatedRecord : u))
      );

      // Sync status change to Firestore
      syncUserToFirestore(updatedRecord).catch(() => {});

    if (target.role === 'seller') {
      updateAvailableSeller(id, { status: nextStatus });
    }

    // If current logged-in user got suspended, inform them
    if (user && user.id === id) {
      setUser({ ...user, status: nextStatus });
    }

    showToast(
      `Account ${nextStatus === 'active' ? 'Activated' : 'Suspended'}`,
      `${target.name} (${target.email}) is now marked as ${nextStatus.toUpperCase()}.`,
      nextStatus === 'active' ? 'success' : 'info'
    );
  };

  const deleteUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = registeredUsers.find((u) => u.id === id);
    if (!target) {
      return { success: false, error: 'User account not found.' };
    }

    if (target.email === 'admin@semixlabs.com') {
      showToast('Action Blocked', 'Primary Root Administrator account cannot be deleted.', 'error');
      return { success: false, error: 'Cannot delete primary root administrator account.' };
    }

    if (user && user.id === id) {
      showToast('Action Blocked', 'You cannot delete the account you are currently logged into.', 'error');
      return { success: false, error: 'Cannot delete currently active account.' };
    }

    try {
      await deleteUserFromFirestore(id);
    } catch (error) {
      console.error('[AuthContext] User deletion failed:', error);
      showToast('Delete Failed', 'Firebase could not remove this user profile.', 'error');
      return { success: false, error: 'Could not delete user from Firestore.' };
    }

    setRegisteredUsers((prev) => prev.filter((u) => u.id !== id));

    if (target.role === 'seller') {
      removeAvailableSeller(id);
    }

    showToast('Account Deleted', `${target.name} (${target.email}) has been removed.`, 'info');
    return { success: true };
  };

  const switchUser = (targetUserOrId: string | AuthUser) => {
    const target = typeof targetUserOrId === 'string'
      ? registeredUsers.find((u) => u.id === targetUserOrId || u.email.toLowerCase() === targetUserOrId.toLowerCase())
      : targetUserOrId;

    if (!target) {
      showToast('User Not Found', 'Could not locate account to switch.', 'error');
      return;
    }

    if (target.status === 'suspended') {
      showToast('Account Suspended', `Cannot log into suspended user ${target.name}.`, 'error');
      return;
    }

    const authPayload: AuthUser = {
      id: target.id,
      name: target.name,
      email: target.email,
      role: target.role,
      phone: target.phone,
      department: target.department,
      createdAt: target.createdAt,
      status: target.status || 'active',
      businessName: target.businessName,
      gstin: target.gstin,
      warehouseHub: target.warehouseHub,
      commissionRate: target.commissionRate,
      settlementTerms: target.settlementTerms,
      designation: target.designation,
      permissionLevel: target.permissionLevel,
      shippingAddress: target.shippingAddress,
      city: target.city,
      state: target.state,
      pincode: target.pincode,
    };

    setUser(authPayload);
    setCurrentRole(target.role);
    setIsAuthModalOpen(false);
    setAuthNoticeMessage(null);
  };

  const logout = () => {
    isSigningOutRef.current = true;
    setCurrentRole('customer');
    setUser(null);
    void signOutUser().finally(() => {
      isSigningOutRef.current = false;
    });
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Attempt Firebase password reset email
    try {
      await sendPasswordReset(cleanEmail);
      showToast('Password Reset Dispatched', `Firebase password reset link sent to ${cleanEmail}`, 'success');
      return {
        success: true,
        message: `Password reset email dispatched to ${cleanEmail}. Please check your Gmail or email inbox.`
      };
    } catch (fbErr: any) {
      console.warn('Firebase sendPasswordReset notice:', fbErr?.code || fbErr?.message);
    }

    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    
    if (exists || cleanEmail.includes('@')) {
      showToast('Password Reset Instructions', `Reset instructions prepared for ${cleanEmail}`, 'info');
      return {
        success: true,
        message: `Password reset instructions sent to ${cleanEmail}. If using demo accounts, you can use the default demo password.`
      };
    }

    return {
      success: false,
      message: `No account found with email ${cleanEmail}. Please create a customer account or use demo credentials.`
    };
  };

  const autoLoginAs = (role: UserRole) => {
    const demo = DEMO_CREDENTIALS[role];
    login(demo.email, demo.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalTab,
        authRedirectUrl,
        authNoticeMessage,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithGoogle,
        register,
        logout,
        forgotPassword,
        demoCredentials: DEMO_CREDENTIALS,
        autoLoginAs,
        registeredUsers,
        createUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
