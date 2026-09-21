import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  ChevronDown, 
  Sparkles, 
  Layers, 
  PhoneCall, 
  PackageCheck,
  Flame,
  ArrowRight,
  User,
  ShieldCheck,
  Boxes,
  FileText,
  Home,
  Store,
  Info
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { categories } = useApp();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav id="primary-navbar" className="bg-gradient-to-r from-[#351044] via-[#561269] to-[#3b0a50] text-white text-xs sm:text-sm font-medium border-t border-violet-300/20 shadow-lg shadow-violet-950/30 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Left Categories Dropdown */}
          <div className="relative py-1 sm:py-1.5 shrink-0" ref={dropdownRef}>
            <motion.button
              id="all-categories-toggle-btn"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              whileTap={{ scale: 0.97 }}
              className="bg-[#FF6B00] hover:bg-[#e05e00] text-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg font-bold flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm transition-colors shadow-md shadow-orange-950/30 cursor-pointer whitespace-nowrap"
            >
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>All Categories</span>
              <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Mega Dropdown Menu */}
            <AnimatePresence>
              {categoriesOpen && (
                <motion.div
                  id="mega-categories-dropdown"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-1 w-72 sm:w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 origin-top-left"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Product Categories ({categories.length})
                    </span>
                    <Link
                      to="/categories"
                      onClick={() => setCategoriesOpen(false)}
                      className="text-[11px] font-bold text-[#561269] hover:text-[#FF6B00] flex items-center gap-0.5"
                    >
                      View All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="max-h-96 overflow-y-auto py-1 divide-y divide-slate-50">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/shop?category=${encodeURIComponent(category.name)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 hover:text-[#561269] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold text-xs group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
                            {category.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-[#561269]">
                              {category.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-normal line-clamp-1">
                              {category.popularItems.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#561269]/5 group-hover:text-[#561269]">
                          {category.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center Links */}
          <div className="hidden lg:flex flex-1 min-w-0 items-center justify-start gap-0.5 xl:gap-1 overflow-hidden">
            <Link
              to="/"
              id="nav-link-home"
              className={`px-2.5 xl:px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-purple-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-orange-300" />
              Home
            </Link>

            <Link
              to="/shop"
              id="nav-link-shop"
              className={`px-2.5 xl:px-3 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                isActive('/shop')
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-purple-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Shop Catalog
            </Link>

            <Link
              to="/services"
              id="nav-link-services"
              className={`px-2.5 xl:px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isActive('/services')
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-purple-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>PCB & 3D Print</span>
            </Link>

            <Link
              to="/bulk-enquiry"
              id="nav-link-bulk"
              className={`px-2.5 xl:px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isActive('/bulk-enquiry')
                  ? 'bg-[#FF6B00] text-white font-bold shadow-xs'
                  : 'text-purple-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Bulk Enquiry / Custom Projects</span>
            </Link>

            <Link
              to="/shop?filter=new"
              id="nav-link-new-arrivals"
              className="px-2.5 xl:px-3 py-2 rounded-lg font-semibold text-purple-100 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>New Arrivals</span>
            </Link>

            <Link
              to="/about"
              id="nav-link-about"
              className={`px-2.5 xl:px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                location.pathname === '/about' || location.hash === '#about'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-purple-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-orange-300" />
              <span>About Us</span>
            </Link>

            <Link
              to="/contact#contact-desk"
              id="nav-link-contact"
              className={`px-2.5 xl:px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isActive('/contact') && location.pathname !== '/about'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-purple-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
              <span>Contact Us</span>
            </Link>
          </div>

          <div id="mobile-service-links" className="lg:hidden flex flex-1 items-center justify-between gap-0.5 min-w-0 overflow-hidden no-scrollbar">
            <Link
              to="/bulk-enquiry"
              className={`flex min-w-0 items-center gap-0.5 px-1 py-1.5 rounded-md font-semibold text-[10px] whitespace-nowrap transition-colors ${
                isActive('/bulk-enquiry')
                  ? 'bg-white/15 text-white'
                  : 'text-purple-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileText className="w-2.5 h-2.5 text-amber-300" />
              Bulk
            </Link>
            <Link
              to="/bulk-enquiry?mode=custom-project"
              className="flex min-w-0 items-center gap-0.5 px-1 py-1.5 rounded-md font-semibold text-[10px] whitespace-nowrap text-purple-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Layers className="w-2.5 h-2.5 text-cyan-300" />
              Projects
            </Link>
            <Link
              to="/contact#contact-desk"
              className={`flex shrink-0 items-center gap-0.5 px-1 py-1.5 rounded-md font-semibold text-[10px] whitespace-nowrap transition-colors ${
                isActive('/contact')
                  ? 'bg-white/15 text-white'
                  : 'text-purple-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <PhoneCall className="w-2.5 h-2.5 text-emerald-300" />
              Contact Us
            </Link>
          </div>

          {/* Right Highlights & Portal Switcher based on authenticated role */}
          <div className="flex items-center gap-2 sm:gap-3 py-1.5 shrink-0">
            {!isAuthenticated ? (
              <button
                id="nav-signin-btn"
                type="button"
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Join</span>
              </button>
            ) : (
              <>
                {user?.role === 'customer' && (
                  <Link
                    to="/customer/dashboard"
                    id="nav-customer-dashboard-link"
                    className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>My Account & Orders</span>
                  </Link>
                )}

                {user?.role === 'team' && (
                  <Link
                    to="/team/fulfillment?tab=stock"
                    id="nav-team-desk-link"
                    className="flex items-center gap-1.5 bg-[#561269] hover:bg-[#460e56] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    <Boxes className="w-3.5 h-3.5 text-white" />
                    <span>Fulfillment Portal</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    id="nav-admin-desk-link"
                    className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-400 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-violet-950/30 transition-colors whitespace-nowrap"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-200" />
                    <span>Admin Console</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Quick Navigation Bar - Compact & Non-Bulky */}
      <div className="lg:hidden bg-[#380847] border-t border-[#561269]/40 px-2.5 py-1 overflow-x-auto no-scrollbar flex items-center gap-1 text-[11px] whitespace-nowrap">
        <Link
          to="/"
          className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition-colors ${
            isActive('/') && location.pathname === '/'
              ? 'bg-[#FF6B00] text-white font-bold'
              : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-3 h-3" />
          Home
        </Link>
        <Link
          to="/shop"
          className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
            isActive('/shop')
              ? 'bg-[#FF6B00] text-white font-bold'
              : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
        >
          Shop Catalog
        </Link>
        <Link
          to="/services"
          className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
            isActive('/services')
              ? 'bg-[#FF6B00] text-white font-bold'
              : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
        >
          PCB & 3D Print
        </Link>
        <Link
          to="/bulk-enquiry"
          className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
            isActive('/bulk-enquiry')
              ? 'bg-[#FF6B00] text-white font-bold'
              : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
        >
          Bulk Enquiry
        </Link>
        <Link
          to="/shop?filter=new"
          className="px-2 py-0.5 rounded-md font-semibold text-purple-200 hover:text-white hover:bg-white/5 transition-colors"
        >
          New Arrivals
        </Link>
        <Link
          to="/about"
          className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
            location.pathname === '/about' || location.hash === '#about'
              ? 'bg-[#FF6B00] text-white font-bold'
              : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
        >
          About Us
        </Link>
        <Link
          to="/contact#contact-desk"
          className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
            isActive('/contact') && location.pathname !== '/about'
              ? 'bg-[#FF6B00] text-white font-bold'
              : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
        >
          Contact Us
        </Link>
      </div>
    </nav>
  );
};
