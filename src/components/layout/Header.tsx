import React, { useState } from 'react';
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

  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

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
          <div className="flex-1 max-w-2xl hidden md:flex items-center">
            <SearchAutocomplete 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory} 
            />
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
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
              <span className="text-[11px] font-semibold mt-1 hidden sm:inline">Compare</span>
            </Link>

            {/* Orders Tracker */}
            <Link
              to="/orders"
              id="header-orders-link"
              className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg text-slate-700 hover:text-[#561269] hover:bg-slate-100/70 transition-colors group"
              title="Track Orders"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[11px] font-semibold mt-1 hidden sm:inline">Orders</span>
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
              <span className="text-[11px] font-semibold mt-1 hidden sm:inline">Wishlist</span>
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
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Cart</span>
                <span className="text-xs font-bold text-slate-900 font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
            </Link>

            {/* Role-Specific Portal Button (Only when authenticated with specific role) */}
            {isAuthenticated && user?.role === 'seller' && (
              <Link
                to="/seller"
                id="header-seller-desk-btn"
                className="hidden lg:flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-emerald-300" />
                <span>Seller Dashboard</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'team' && (
              <Link
                to="/team/fulfillment"
                id="header-team-desk-btn"
                className="hidden lg:flex items-center gap-1.5 bg-[#561269] hover:bg-[#460e56] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Boxes className="w-3.5 h-3.5 text-purple-300" />
                <span>Fulfillment Desk</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                id="header-admin-desk-btn"
                className="hidden lg:flex items-center gap-1.5 bg-purple-900 hover:bg-purple-950 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Admin Master</span>
              </Link>
            )}

            {!isAuthenticated && (
              <button
                id="header-login-btn"
                type="button"
                onClick={() => openAuthModal('signin')}
                className="md:hidden flex items-center justify-center p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#561269]"
                title="Login / Register"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search input with Intelligent Autocomplete */}
        <div className="mt-1.5 md:hidden">
          <SearchAutocomplete isMobile={true} />
        </div>
      </div>
    </header>
  );
};
