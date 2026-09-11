import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { fetchSellerBonus, formatInrBonus } from '../../services/bonusService';
import { SellerBonusRecord } from '../../types';
import { Award, ShieldCheck, Sparkles, Clock, UserCheck, AlertCircle } from 'lucide-react';

interface SellerBonusCardProps {
  sellerId: string;
  sellerName?: string;
  variant?: 'card' | 'banner';
}

export const SellerBonusCard: React.FC<SellerBonusCardProps> = ({
  sellerId,
  sellerName,
  variant = 'card',
}) => {
  const { sellerBonuses, getSellerBonus } = useApp();
  const { user } = useAuth();
  const [remoteRecord, setRemoteRecord] = useState<SellerBonusRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get bonus from centralized context (reacts immediately to admin edits)
  const contextBonusAmount = getSellerBonus(sellerId);
  const contextRecord = sellerBonuses[sellerId];

  // Also query read-only seller API endpoint to verify backend enforcement
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetchSellerBonus(sellerId, user?.role || 'seller', sellerId)
      .then((record) => {
        if (!isCancelled && record) {
          setRemoteRecord(record);
        }
      })
      .catch((err) => {
        console.warn('[SellerBonusCard] Error loading seller bonus:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [sellerId, user?.role]);

  // The active bonus amount to display
  const effectiveBonus =
    contextRecord?.bonusAmount !== undefined
      ? contextRecord.bonusAmount
      : remoteRecord?.bonusAmount !== undefined
      ? remoteRecord.bonusAmount
      : contextBonusAmount;

  const lastUpdated = contextRecord?.updatedAt || remoteRecord?.updatedAt;
  const updatedBy = contextRecord?.updatedBy || remoteRecord?.updatedBy || 'Admin';

  if (variant === 'banner') {
    return (
      <div
        id="seller-bonus-banner"
        className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-15 pointer-events-none">
          <Award className="w-36 h-36 text-white" />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-orange-100">
                MY BONUS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
                Read-only
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5 font-mono">
              {formatInrBonus(effectiveBonus)}
            </div>
            <p className="text-xs text-orange-100 mt-0.5">
              Bonus assigned by Admin • Disbursed with regular settlement cycle
            </p>
          </div>
        </div>

        <div className="text-right relative z-10 sm:self-center shrink-0">
          <div className="text-[11px] text-orange-100/90 flex items-center gap-1 sm:justify-end">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Admin Allocation</span>
          </div>
          {lastUpdated && (
            <div className="text-[10px] text-orange-200 mt-0.5 font-mono">
              Updated: {new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard Box/Card format matching user's ASCII mockup:
  // ┌─────────────────────────┐
  // │       MY BONUS          │
  // │                         │
  // │        ₹5,000           │
  // │                         │
  // │   Bonus assigned by     │
  // │       Admin             │
  // └─────────────────────────┘
  return (
    <div
      id="seller-bonus-display-card"
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:border-orange-300 relative overflow-hidden group"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

      {/* Card Header: MY BONUS */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold text-xs">
            <Award className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800 tracking-wider text-xs uppercase">
            MY BONUS
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Read-only
        </span>
      </div>

      {/* Bonus Amount Display */}
      <div className="my-3 relative z-10">
        {isLoading ? (
          <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-md" />
        ) : (
          <p
            id="seller-bonus-amount-text"
            className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight"
          >
            {formatInrBonus(effectiveBonus)}
          </p>
        )}
      </div>

      {/* Card Footer: Bonus assigned by Admin */}
      <div className="pt-2 border-t border-slate-100 text-slate-500 relative z-10">
        <p className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
          <span>Bonus assigned by <strong>Admin</strong></span>
        </p>
        {lastUpdated ? (
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              Updated {new Date(lastUpdated).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </p>
        ) : (
          <p className="text-[10px] text-slate-400 mt-0.5">
            Active merchant performance incentive
          </p>
        )}
      </div>
    </div>
  );
};
