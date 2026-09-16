import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Layers,
  KeyRound,
  Boxes,
  ShieldAlert,
  Store
} from 'lucide-react';
import { UserRole } from '../../types';
import { SemixLabsLogo } from './SemixLabsLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    openAuthModal, 
    login, 
    loginWithGoogle,
    register, 
    forgotPassword,
    demoCredentials,
    authRedirectUrl,
    authNoticeMessage 
  } = useAuth();

  const navigate = useNavigate();

  // Active tab inside modal
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In Form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSubmittingSignIn, setIsSubmittingSignIn] = useState(false);
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);

  // Sign-In Provider selection ('password' | 'google')
  const [signInProvider, setSignInProvider] = useState<'password' | 'google'>('password');
  const [regProvider, setRegProvider] = useState<'password' | 'google'>('password');

  // Forgot password sub-state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  // Register Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Synchronize modal open tab
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalTab);
      setSignInError(null);
      setRegError(null);
      setShowForgotPassword(false);
      setForgotStatus(null);
      setSignInProvider('password');
      setRegProvider('password');
    }
  }, [isAuthModalOpen, authModalTab]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Quick fill handler
  const handleQuickFill = (role: UserRole) => {
    const demo = demoCredentials[role];
    setSignInEmail(demo.email);
    setSignInPassword(demo.password);
    setSignInError(null);
  };

  // Direct 1-click demo login
  const handleDirectDemoLogin = async (role: UserRole) => {
    const demo = demoCredentials[role];
    setIsSubmittingSignIn(true);
    setSignInError(null);
    
    try {
      const res = await login(demo.email, demo.password);
      if (res.success) {
        const destination = authRedirectUrl || demo.defaultRedirect;
        navigate(destination);
      } else {
        setSignInError(res.error || 'Authentication failed');
      }
    } finally {
      setIsSubmittingSignIn(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setSignInError('Please enter both your email address and password.');
      return;
    }

    setIsSubmittingSignIn(true);
    setSignInError(null);

    try {
      const res = await login(signInEmail, signInPassword);
      if (res.success) {
        // Direct redirect based on matched role or saved redirect
        if (authRedirectUrl) {
          navigate(authRedirectUrl);
        } else if (res.role === 'admin' || signInEmail.toLowerCase().includes('admin')) {
          navigate('/admin/dashboard');
        } else if (res.role === 'seller' || signInEmail.toLowerCase().includes('seller')) {
          navigate('/seller');
        } else if (res.role === 'team' || signInEmail.toLowerCase().includes('team')) {
          navigate('/team/fulfillment');
        } else {
          navigate('/customer/dashboard');
        }
      } else {
        setSignInError(res.error || 'Invalid credentials');
      }
    } finally {
      setIsSubmittingSignIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmittingGoogle(true);
    setSignInError(null);
    setRegError(null);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        if (authRedirectUrl) {
          navigate(authRedirectUrl);
        } else if (res.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.role === 'seller') {
          navigate('/seller');
        } else if (res.role === 'team') {
          navigate('/team/fulfillment');
        } else {
          navigate('/customer/dashboard');
        }
      } else {
        setSignInError(res.error || 'Google sign-in was cancelled.');
      }
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmittingReg(true);
    setRegError(null);

    try {
      const res = await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });

      if (res.success) {
        navigate(authRedirectUrl || '/customer/dashboard');
      } else {
        setRegError(res.error || 'Registration failed');
      }
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotStatus({ type: 'error', message: 'Please enter your registered email address.' });
      return;
    }

    setIsSubmittingForgot(true);
    setForgotStatus(null);

    try {
      const res = await forgotPassword(forgotEmail);
      setForgotStatus({
        type: res.success ? 'success' : 'error',
        message: res.message,
      });
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div 
      id="auth-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <motion.div
        id="auth-modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#561269] via-[#561269] to-[#380847] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SemixLabsLogo variant="icon" size="sm" className="h-9 w-9 bg-white/10 p-1 rounded-xl border border-white/10" />
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                SEMIX LABS Portal Access
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#FF6B00] text-white rounded-full">
                  Secure Auth
                </span>
              </h3>
              <p className="text-xs text-purple-200">
                Makers, Engineers & Staff Operations
              </p>
            </div>
          </div>

          <button
            id="btn-close-auth-modal"
            onClick={closeAuthModal}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Message Banner (if redirected from ProtectedRoute) */}
        {authNoticeMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-start gap-2.5 text-amber-900 text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">
              {authNoticeMessage}
            </div>
          </div>
        )}

        {/* Tabs Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            id="tab-btn-signin"
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setShowForgotPassword(false);
            }}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'signin'
                ? 'border-[#561269] text-[#561269]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            id="tab-btn-register"
            type="button"
            onClick={() => {
              setActiveTab('register');
              setShowForgotPassword(false);
            }}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'register'
                ? 'border-[#561269] text-[#561269]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Create Customer Account</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* ===================== SIGN IN TAB ===================== */}
          {activeTab === 'signin' && (
            <div>
              {!showForgotPassword ? (
                <>
                  {/* Explicit Sign-In Provider Selection */}
                  <div className="mb-5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Select Sign-In Provider
                      </span>
                      <span className="text-[10px] font-semibold text-[#561269] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Firebase Auth
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="provider-select-email"
                        onClick={() => {
                          setSignInProvider('password');
                          setSignInError(null);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          signInProvider === 'password'
                            ? 'bg-[#561269] text-white shadow-xs ring-2 ring-[#561269]/20'
                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Mail className={`w-3.5 h-3.5 ${signInProvider === 'password' ? 'text-white' : 'text-slate-500'}`} />
                        <span>Email & Password</span>
                      </button>

                      <button
                        type="button"
                        id="provider-select-google"
                        onClick={() => {
                          setSignInProvider('google');
                          setSignInError(null);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          signInProvider === 'google'
                            ? 'bg-white text-slate-900 shadow-xs border border-slate-300 ring-2 ring-purple-500/20'
                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                        </svg>
                        <span>Google Provider</span>
                      </button>
                    </div>
                  </div>

                  {signInError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{signInError}</span>
                    </motion.div>
                  )}

                  {/* Sign-In via Email & Password Provider */}
                  {signInProvider === 'password' && (
                    <form onSubmit={handleSignInSubmit} className="space-y-4">
                      {/* Email / Username */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address or Gmail
                        </label>
                        <div className="relative rounded-xl border border-slate-300 focus-within:border-[#561269] focus-within:ring-2 focus-within:ring-[#561269]/10 bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all overflow-hidden">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            id="signin-email-input"
                            type="email"
                            autoComplete="email"
                            value={signInEmail}
                            onChange={(e) => {
                              setSignInEmail(e.target.value);
                              setSignInError(null);
                            }}
                            placeholder="e.g. aryangandhale27@gmail.com, customer@semixlabs.com, or admin"
                            required
                            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(true);
                              setForgotEmail(signInEmail);
                            }}
                            className="text-[11px] font-semibold text-[#FF6B00] hover:underline cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative rounded-xl border border-slate-300 focus-within:border-[#561269] focus-within:ring-2 focus-within:ring-[#561269]/10 bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all overflow-hidden">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            id="signin-password-input"
                            type={showSignInPassword ? 'text' : 'password'}
                            value={signInPassword}
                            onChange={(e) => {
                              setSignInPassword(e.target.value);
                              setSignInError(null);
                            }}
                            placeholder="Enter account password"
                            required
                            className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Sign In Submit Button */}
                      <button
                        id="btn-submit-signin"
                        type="submit"
                        disabled={isSubmittingSignIn}
                        className="w-full py-3 px-4 bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      >
                        {isSubmittingSignIn ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>Authenticating Email & Password...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In with Email & Password</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setSignInProvider('google')}
                          className="text-xs text-slate-500 hover:text-[#561269] font-medium transition-colors cursor-pointer"
                        >
                          Or authenticate with <span className="font-bold underline">Google Provider</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Sign-In via Google Provider */}
                  {signInProvider === 'google' && (
                    <div className="space-y-4 py-2">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">
                          Firebase Google Provider
                        </h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                          Sign in securely using Google OAuth (<span className="font-mono text-[11px]">GoogleAuthProvider</span>). Your account details will sync directly to Firestore.
                        </p>

                        <button
                          type="button"
                          id="btn-google-signin"
                          onClick={handleGoogleSignIn}
                          disabled={isSubmittingGoogle}
                          className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                        >
                          {isSubmittingGoogle ? (
                            <>
                              <span className="w-4 h-4 border-2 border-slate-300 border-t-purple-700 rounded-full animate-spin"></span>
                              <span>Connecting Google account...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                              </svg>
                              <span>Sign In with Google</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setSignInProvider('password')}
                          className="text-xs text-slate-500 hover:text-[#561269] font-medium transition-colors cursor-pointer"
                        >
                          Switch to <span className="font-bold underline">Email & Password Provider</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1-Click Quick-Fill Demo Credentials Card */}
                  <div className="hidden mt-6 pt-5 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Verified Demo Credentials
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Click card to instant sign in, or use Autofill</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {/* Customer Demo */}
                      <div
                        id="demo-card-customer"
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#FF6B00] bg-slate-50/70 hover:bg-orange-50/40 text-left transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6B00]">
                              Customer
                            </span>
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate">Aryan Gandhale</p>
                          <p className="text-[10px] text-slate-600 font-mono truncate">customer@semixlabs.com</p>
                          <div className="mt-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700 flex items-center justify-between">
                            <span className="text-slate-400">Pass:</span>
                            <span className="font-bold text-[#FF6B00]">Customer@123</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickFill('customer')}
                            className="flex-1 py-1 px-2 text-[10px] font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center"
                          >
                            Autofill
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectDemoLogin('customer')}
                            className="flex-1 py-1 px-2 text-[10px] font-bold text-white bg-[#FF6B00] hover:bg-[#e05e00] rounded-lg transition-colors text-center"
                          >
                            Sign In →
                          </button>
                        </div>
                      </div>

                      {/* Seller Demo */}
                      <div
                        id="demo-card-seller"
                        className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50/70 hover:bg-emerald-50/40 text-left transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Seller
                            </span>
                            <Store className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate">Vikram Patel</p>
                          <p className="text-[10px] text-slate-600 font-mono truncate">seller@semixlabs.com</p>
                          <div className="mt-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700 flex items-center justify-between">
                            <span className="text-slate-400">Pass:</span>
                            <span className="font-bold text-emerald-700">Seller@123</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickFill('seller')}
                            className="flex-1 py-1 px-2 text-[10px] font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center"
                          >
                            Autofill
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectDemoLogin('seller')}
                            className="flex-1 py-1 px-2 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors text-center"
                          >
                            Sign In →
                          </button>
                        </div>
                      </div>

                      {/* Team Demo */}
                      <div
                        id="demo-card-team"
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#561269] bg-slate-50/70 hover:bg-[#561269]/5 text-left transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-[#561269]">
                              Team
                            </span>
                            <Boxes className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate">Sanjay Verma</p>
                          <p className="text-[10px] text-slate-600 font-mono truncate">team@semixlabs.com</p>
                          <div className="mt-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700 flex items-center justify-between">
                            <span className="text-slate-400">Pass:</span>
                            <span className="font-bold text-[#561269]">Team@123</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickFill('team')}
                            className="flex-1 py-1 px-2 text-[10px] font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center"
                          >
                            Autofill
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectDemoLogin('team')}
                            className="flex-1 py-1 px-2 text-[10px] font-bold text-white bg-[#561269] hover:bg-[#460e56] rounded-lg transition-colors text-center"
                          >
                            Sign In →
                          </button>
                        </div>
                      </div>

                      {/* Admin Demo */}
                      <div
                        id="demo-card-admin"
                        className="p-3 rounded-xl border border-slate-200 hover:border-purple-600 bg-slate-50/70 hover:bg-purple-50/40 text-left transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              Admin
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate">Admin Controller</p>
                          <p className="text-[10px] text-slate-600 font-mono truncate">admin@semixlabs.com</p>
                          <div className="mt-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700 flex items-center justify-between">
                            <span className="text-slate-400">Pass:</span>
                            <span className="font-bold text-purple-700">Admin@123</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickFill('admin')}
                            className="flex-1 py-1 px-2 text-[10px] font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center"
                          >
                            Autofill
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectDemoLogin('admin')}
                            className="flex-1 py-1 px-2 text-[10px] font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors text-center"
                          >
                            Sign In →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Switch to Register link */}
                  <div className="mt-5 text-center text-xs text-slate-600">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="font-bold text-[#FF6B00] hover:underline"
                    >
                      Sign Up for Customer Account
                    </button>
                  </div>
                </>
              ) : (
                /* Forgot Password View */
                <div className="space-y-4">
                  <div className="p-3 bg-[#561269]/5 border border-[#561269]/15 rounded-xl text-xs text-[#561269]">
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-[#561269]" />
                      Reset Your Password
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      Enter your account email below. We'll simulate sending a secure password recovery link.
                    </p>
                  </div>

                  {forgotStatus && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                        forgotStatus.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border border-rose-200 text-rose-800'
                      }`}
                    >
                      {forgotStatus.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span>{forgotStatus.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Registered Email
                      </label>
                      <div className="relative rounded-xl border border-slate-300 bg-white">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="e.g. customer@semixlabs.com"
                          required
                          className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        Back to Sign In
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingForgot}
                        className="flex-1 py-2.5 px-4 bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-70"
                      >
                        {isSubmittingForgot ? 'Dispatching...' : 'Send Reset Link'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ===================== CREATE ACCOUNT (REGISTER) TAB ===================== */}
          {activeTab === 'register' && (
            <div>
              {/* Notice that team/admin are created by Admin */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Customer Self-Registration:</span> Sign up here to order hardware, save wishlists, and track shipments. 
                  <span className="text-slate-600 block mt-0.5 text-[11px]">
                    *Note: In accordance with SRS FR-1.5, Seller, Team, and Admin accounts cannot self-register; they are created internally or loaded via authorized credentials.
                  </span>
                </div>
              </div>

              {/* Registration Provider Selection */}
              <div className="mb-5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Registration Provider
                  </span>
                  <span className="text-[10px] font-semibold text-[#561269] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    Firebase Auth
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="reg-provider-select-email"
                    onClick={() => {
                      setRegProvider('password');
                      setRegError(null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      regProvider === 'password'
                        ? 'bg-[#561269] text-white shadow-xs ring-2 ring-[#561269]/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Mail className={`w-3.5 h-3.5 ${regProvider === 'password' ? 'text-white' : 'text-slate-500'}`} />
                    <span>Email & Password</span>
                  </button>

                  <button
                    type="button"
                    id="reg-provider-select-google"
                    onClick={() => {
                      setRegProvider('google');
                      setRegError(null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      regProvider === 'google'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-300 ring-2 ring-purple-500/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Google Provider</span>
                  </button>
                </div>
              </div>

              {/* Fast Registration via Google */}
              {regProvider === 'google' ? (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Instant Sign Up with Google
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                      Create your SEMIX LABS customer profile in one click using your Google Account credentials.
                    </p>

                    <button
                      type="button"
                      id="btn-google-register"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmittingGoogle}
                      className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmittingGoogle ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-300 border-t-purple-700 rounded-full animate-spin"></span>
                          <span>Connecting Google account...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span>Sign up instantly with Google</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setRegProvider('password')}
                      className="text-xs text-slate-500 hover:text-[#561269] font-medium transition-colors cursor-pointer"
                    >
                      Or register with <span className="font-bold underline">Email & Password Provider</span>
                    </button>
                  </div>
                </div>
              ) : (

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </motion.div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-slate-300 focus-within:border-[#561269] bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-name-input"
                      type="text"
                      value={regName}
                      onChange={(e) => {
                        setRegName(e.target.value);
                        setRegError(null);
                      }}
                      placeholder="e.g. Aryan Gandhale"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gmail or Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-slate-300 focus-within:border-[#561269] bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-email-input"
                      type="email"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        setRegError(null);
                      }}
                      placeholder="e.g. aryangandhale27@gmail.com, yourname@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (for Shipping & SMS OTP)
                  </label>
                  <div className="relative rounded-xl border border-slate-300 focus-within:border-[#561269] bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-phone-input"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password in 2 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-xl border border-slate-300 focus-within:border-[#561269] bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          setRegError(null);
                        }}
                        placeholder="Min 6 chars"
                        required
                        className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-xl border border-slate-300 focus-within:border-[#561269] bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-confirm-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          setRegError(null);
                        }}
                        placeholder="Re-enter password"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Register */}
                <button
                  id="btn-submit-register"
                  type="submit"
                  disabled={isSubmittingReg}
                  className="w-full py-3 px-4 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-4"
                >
                  {isSubmittingReg ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account with Email & Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              )}

              {/* Switch to Sign In */}
              <div className="mt-4 text-center text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="font-bold text-[#561269] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
