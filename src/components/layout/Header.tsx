import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SemixLabsLogo } from '../common/SemixLabsLogo';
import { SearchAutocomplete } from '../common/SearchAutocomplete';
import { 
  Search, 
  GitCompare, 
  Package, 
  Heart, 
  ShoppingCart, 
  SlidersHorizontal,
  ChevronDown,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Boxes,
  Store
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cartItemCount, 
    cartSubtotal, 
    wishlist, 
    compareList, 
    searchQuery, 
    setSearchQuery,
    categories,
  } = useApp();

  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileAccountMenuOpen, setMobileAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mobileAccountMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const accountPath = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'seller'
      ? '/seller'
      : user?.role === 'team'
        ? '/team/fulfillment?tab=stock'
        : '/customer/dashboard';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (mobileAccountMenuRef.current && !mobileAccountMenuRef.current.contains(event.target as Node)) {
        setMobileAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory !== 'all') {
      navigate(`/shop?category=${encodeURIComponent(selectedCategory)}&q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header id="main-header" className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center py-1" title="SEMIX LABS">
            <SemixLabsLogo variant="dark" size="lg" className="group-hover:opacity-90 transition-opacity hidden sm:block" />
            <SemixLabsLogo variant="dark" size="md" className="group-hover:opacity-90 transition-opacity sm:hidden" />
          </Link>

          {/* Search Bar - Wide with Deep Violet CTA & Intelligent Autocomplete */}
          <div className="flex-1 max-w-2xl hidden xl:flex items-center">
            <SearchAutocomplete 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory} 
            />
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 md:gap-2 lg:gap-4 shrink-0">
            {/* Compare */}
            <Link
              to="/compare"
              id="header-compare-link"
              className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg text-slate-700 hover:text-[#561269] hover:bg-slate-100/70 transition-colors relative group"
              title="Compare Products"
            >
              <div className="relative">
                <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
                {compareList.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF6B00] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs">
                    {compareList.length}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold mt-1 hidden xl:inline">Compare</span>
            </Link>

            {/* Orders Tracker */}
            <Link
              to="/orders"
              id="header-orders-link"
              className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg text-slate-700 hover:text-[#561269] hover:bg-slate-100/70 transition-colors group"
              title="Track Orders"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[11px] font-semibold mt-1 hidden xl:inline">Orders</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/customer/dashboard?tab=wishlist"
              id="header-wishlist-link"
              className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg text-slate-700 hover:text-[#561269] hover:bg-slate-100/70 transition-colors relative group"
              title="Saved Components"
            >
              <div className="relative">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF6B00] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold mt-1 hidden xl:inline">Wishlist</span>
            </Link>

            {/* Cart with Live Badge & Subtotal */}
            <Link
              to="/cart"
              id="header-cart-link"
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group"
            >
              <div className="relative flex items-center justify-center text-[#561269]">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1.5 -right-2 bg-[#FF6B00] text-white text-[9px] sm:text-[10px] font-bold min-w-3.5 h-3.5 sm:min-w-4 sm:h-4 px-0.5 sm:px-1 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              </div>
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Cart</span>
                <span className="text-xs font-bold text-slate-900 font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
            </Link>

            {isAuthenticated && user?.role !== 'customer' ? (
              <Link
                to={accountPath}
                id="header-console-link"
                className="flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-purple-200 bg-purple-50 p-1.5 text-[#561269] shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-100 sm:px-3 sm:py-2"
                title="Open Console"
              >
                {user?.role === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : user?.role === 'team' ? (
                  <Boxes className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="hidden xl:inline text-[11px] font-bold">Console</span>
              </Link>
            ) : (
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  id="header-account-link"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 p-1.5 text-[#561269] shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-100 sm:rounded-xl sm:px-3 sm:py-2"
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  title="Account menu"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xl:inline text-[11px] font-bold">Account</span>
                </button>

                {accountMenuOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 text-slate-800 shadow-xl"
                  role="menu"
                >
                  <Link
                    to={accountPath}
                    id="header-account-view-link"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold hover:bg-purple-50 hover:text-[#561269]"
                    role="menuitem"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#561269]" />
                    View Account
                  </Link>
                  <Link
                    to="/orders"
                    id="header-account-orders-link"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold hover:bg-purple-50 hover:text-[#561269]"
                    role="menuitem"
                  >
                    <Package className="h-4 w-4 text-[#561269]" />
                    View Orders
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        openAuthModal('signin');
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-bold text-[#561269] hover:bg-purple-50"
                      role="menuitem"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </button>
                  )}
                </div>
                )}
              </div>
            )}

            {isAuthenticated && user?.role !== 'customer' && (
              <div ref={mobileAccountMenuRef} className="relative sm:hidden">
                <button
                  type="button"
                  id="header-mobile-account-link"
                  onClick={() => setMobileAccountMenuOpen((open) => !open)}
                  className="flex items-center justify-center rounded-lg border border-purple-200 bg-purple-50 p-1.5 text-[#561269] shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-100"
                  aria-expanded={mobileAccountMenuOpen}
                  aria-haspopup="menu"
                  title="Account menu"
                >
                  <User className="h-4 w-4" />
                </button>

                {mobileAccountMenuOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 text-slate-800 shadow-xl"
                    role="menu"
                  >
                    <Link
                      to={accountPath}
                      onClick={() => setMobileAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold hover:bg-purple-50 hover:text-[#561269]"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#561269]" />
                      View Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileAccountMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Role-Specific Portal Button (Only when authenticated with specific role) */}
            {isAuthenticated && user?.role === 'seller' && (
              <Link
                to="/seller"
                id="header-seller-desk-btn"
                className="hidden xl:flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-emerald-300" />
                <span>Seller Dashboard</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'team' && (
              <Link
                to="/team/fulfillment"
                id="header-team-desk-btn"
                className="hidden xl:flex items-center gap-1.5 bg-[#561269] hover:bg-[#460e56] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Boxes className="w-3.5 h-3.5 text-purple-300" />
                <span>Fulfillment Desk</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                id="header-admin-desk-btn"
                className="hidden xl:flex items-center gap-1.5 bg-purple-900 hover:bg-purple-950 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Admin Master</span>
              </Link>
            )}

          </div>
        </div>

        {/* Mobile Search input with Intelligent Autocomplete */}
        <div className="mt-1.5 xl:hidden">
          <SearchAutocomplete
            isMobile={true}
          />
        </div>
      </div>
    </header>
  );
};
