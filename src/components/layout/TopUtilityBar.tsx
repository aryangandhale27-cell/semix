import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Phone, 
  Mail, 
  Shield, 
  User, 
  Users, 
  RefreshCw, 
  LogIn, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  UserCheck,
  Sparkles,
  Store
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const TopUtilityBar: React.FC = () => {
  const { resetDemoData } = useApp();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'seller') return '/seller';
    if (user.role === 'team') return '/team/fulfillment';
    return '/customer/dashboard';
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          badgeClass: 'bg-purple-600/90 text-purple-100 border border-purple-400/30',
          icon: Shield,
        };
      case 'seller':
        return {
          label: 'Seller',
          badgeClass: 'bg-emerald-600/90 text-emerald-100 border border-emerald-400/30',
          icon: Store,
        };
      case 'team':
        return {
          label: 'Team',
          badgeClass: 'bg-[#561269]/90 text-purple-100 border border-[#561269]/40/30',
          icon: Users,
        };
      default:
        return {
          label: 'Customer',
          badgeClass: 'bg-amber-600/90 text-amber-100 border border-amber-400/30',
          icon: User,
        };
    }
  };

  const roleInfo = user ? getRoleBadge(user.role) : null;
  const RoleIcon = roleInfo ? roleInfo.icon : User;

  return (
    <div id="top-utility-bar" className="bg-[#380847] text-slate-200 text-xs border-b border-[#561269]/30/60 select-none relative z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 sm:h-9 flex items-center justify-between">
        {/* Left info */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="hidden sm:inline text-slate-400">Customer Support:</span>
            <a href="tel:+917666601086" className="hover:text-white font-semibold transition-colors">
              +91 7666601086
            </a>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-[#FF6B00]" />
            <a href="mailto:office@semixlabs.com" className="hover:text-white transition-colors">
              office@semixlabs.com
            </a>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full text-[11px] font-medium border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Same Day Dispatch before 4 PM
          </div>
        </div>

        {/* Right Authentication & Tools */}
        <div className="flex items-center gap-3 sm:gap-4">
          {!isAuthenticated ? (
            /* Sleek Login / Register Action Button */
            <button
              id="top-bar-login-btn"
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/15 cursor-pointer shadow-xs group"
            >
              <User className="w-3.5 h-3.5 text-[#FF6B00] group-hover:scale-110 transition-transform" />
              <span>Login / Register</span>
            </button>
          ) : (
            /* Logged In User Dropdown */
            <div className="relative" ref={menuRef}>
              <button
                id="top-bar-user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#380847]/80 hover:bg-[#460e56] border border-[#561269]/30/60 text-white transition-all cursor-pointer shadow-inner"
              >
                {/* User Avatar Initials Badge */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#561269] to-[#561269] flex items-center justify-center text-[10px] font-bold text-white shrink-0 border border-white/20 shadow-xs">
                  {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </div>

                <span className="font-semibold text-xs max-w-[110px] truncate text-slate-100 hidden sm:inline">
                  {user?.name.split(' ')[0]}
                </span>

                {/* Role Badge */}
                {roleInfo && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm ${roleInfo.badgeClass}`}>
                    {roleInfo.label}
                  </span>
                )}

                <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    id="user-profile-dropdown"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-1.5 w-64 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 origin-top-right divide-y divide-slate-100"
                  >
                    {/* User Header Profile */}
                    <div className="px-4 py-2.5 bg-slate-50/80">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded-full bg-[#561269] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-[#561269]/30/20">
                          {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user?.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate font-mono">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-slate-500 font-medium">Access Level:</span>
                        <span className={`font-bold uppercase px-2 py-0.5 rounded-full ${roleInfo?.badgeClass}`}>
                          {user?.role} Portal
                        </span>
                      </div>
                    </div>

                    {/* Nav Links */}
                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#561269]/5 hover:text-[#561269] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#FF6B00]" />
                        <span>Dashboard ({roleInfo?.label})</span>
                      </Link>

                      <Link
                        to="/customer/dashboard?tab=profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#561269]/5 hover:text-[#561269] transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-[#561269]" />
                        <span>My Profile & Settings</span>
                      </Link>

                    </div>

                    {/* Logout Action */}
                    <div className="py-1">
                      <button
                        id="user-menu-logout-btn"
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
