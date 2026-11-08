import React, { useState } from 'react';
import { Flame, LoaderCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { HomepageProductSection, Product } from '../../types';

interface HomepageSectionActionsProps {
  product: Product;
  compact?: boolean;
  className?: string;
}

export const HomepageSectionActions: React.FC<HomepageSectionActionsProps> = ({
  product,
  compact = false,
  className = '',
}) => {
  const { user } = useAuth();
  const { assignHomepageProduct } = useApp();
  const [pendingSection, setPendingSection] = useState<HomepageProductSection | null>(null);

  if (user?.role !== 'admin') return null;

  const assign = async (section: HomepageProductSection) => {
    setPendingSection(section);
    await assignHomepageProduct(product.id, section);
    setPendingSection(null);
  };

  const buttonClass = compact
    ? 'inline-flex h-7 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-bold text-slate-700 shadow-sm hover:border-orange-300 hover:text-orange-700 disabled:opacity-50'
    : 'inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-50';

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => void assign('trending')}
        disabled={pendingSection !== null}
        aria-label="Add product to Trending and Best Sellers"
        title="Add to Trending & Best Sellers"
        className={buttonClass}
      >
        {pendingSection === 'trending' ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Flame className="h-3.5 w-3.5" />}
        {!compact && <span>Trending</span>}
      </button>
      <button
        type="button"
        onClick={() => void assign('fresh')}
        disabled={pendingSection !== null}
        aria-label="Add product to Fresh Silicon and New Arrivals"
        title="Add to Fresh Silicon & New Arrivals"
        className={buttonClass}
      >
        {pendingSection === 'fresh' ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {!compact && <span>New arrivals</span>}
      </button>
    </div>
  );
};