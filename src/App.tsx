import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import { TopUtilityBar } from './components/layout/TopUtilityBar';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { CompareDrawer } from './components/common/CompareDrawer';
import { AuthModal } from './components/common/AuthModal';
import { ProtectedRoute } from './components/common/ProtectedRoute';

const HomePage = lazy(() => import('./pages/customer/HomePage').then((module) => ({ default: module.HomePage })));
const CategoriesPage = lazy(() => import('./pages/customer/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const ShopPage = lazy(() => import('./pages/customer/ShopPage').then((module) => ({ default: module.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/customer/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/customer/CartPage').then((module) => ({ default: module.CartPage })));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage').then((module) => ({ default: module.CheckoutPage })));
const BomToolPage = lazy(() => import('./pages/customer/BomToolPage').then((module) => ({ default: module.BomToolPage })));
const ServicesPage = lazy(() => import('./pages/customer/ServicesPage').then((module) => ({ default: module.ServicesPage })));
const BulkEnquiryPage = lazy(() => import('./pages/customer/BulkEnquiryPage').then((module) => ({ default: module.BulkEnquiryPage })));
const ContactPage = lazy(() => import('./pages/customer/ContactPage').then((module) => ({ default: module.ContactPage })));
const CustomerDashboardPage = lazy(() => import('./pages/customer/CustomerDashboardPage').then((module) => ({ default: module.CustomerDashboardPage })));
const TeamPortalPage = lazy(() => import('./pages/team/TeamPortalPage').then((module) => ({ default: module.TeamPortalPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));
const SellerDashboardPage = lazy(() => import('./pages/seller/SellerDashboardPage').then((module) => ({ default: module.SellerDashboardPage })));

function PageRouteFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 rounded bg-slate-200" />
        <div className="h-64 w-full rounded-2xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-52 rounded-xl bg-slate-200" />
          <div className="h-52 rounded-xl bg-slate-200" />
          <div className="h-52 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

// Helper component to scroll to top on route change, or to hash if present
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }
  }, [pathname, search, hash]);

  return null;
}

// Animated routes container for smooth page transitions
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0 }}
        className="w-full"
      >
        <Suspense fallback={<PageRouteFallback />}>
          <Routes location={location}>
            {/* Public Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/bom-tool" element={<BomToolPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/bulk-enquiry" element={<BulkEnquiryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<ContactPage />} />

            {/* Protected Customer Dashboard */}
            <Route 
              path="/customer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'team', 'admin']}>
                  <CustomerDashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Team Fulfillment & Inventory Routes */}
            <Route 
              path="/team" 
              element={
                <ProtectedRoute allowedRoles={['team', 'admin']}>
                  <TeamPortalPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team/portal" 
              element={
                <ProtectedRoute allowedRoles={['team', 'admin']}>
                  <TeamPortalPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team/fulfillment" 
              element={
                <ProtectedRoute allowedRoles={['team', 'admin']}>
                  <TeamPortalPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fulfillment" 
              element={
                <ProtectedRoute allowedRoles={['team', 'admin']}>
                  <TeamPortalPage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Master Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Seller Dashboard Routes */}
            <Route 
              path="/seller" 
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/seller/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerDashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Utility / Customer Redirects */}
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'team', 'admin', 'seller']}>
                  <CustomerDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/compare" element={<ShopPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-[#FF6B00] selection:text-white">
            {/* Top Bar with Auth State & Support Info */}
            <TopUtilityBar />

            {/* Main Brand Header */}
            <Header />

            {/* Categorized Sticky Navbar */}
            <Navbar />

            {/* Page Routing Container */}
            <main className="flex-1 overflow-x-hidden">
              <AnimatedRoutes />
            </main>

            {/* Footer with Service Value Props & Links */}
            <Footer />

            {/* Global Modals & Notifications */}
            <AuthModal />
            <ToastContainer />
            <CompareDrawer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

