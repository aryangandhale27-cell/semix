import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingCart, 
  Heart, 
  GitCompare, 
  Eye, 
  Star, 
  Check, 
  Zap,
  Layers
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuickView, 
  compact = false 
}) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    addToCompare, 
    isComparing 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const inWish = isInWishlist(product.id);
  const inComp = isComparing(product.id);

  // Best tier savings
  const bestTier = product.bulkTiers && product.bulkTiers.length > 1 
    ? product.bulkTiers[product.bulkTiers.length - 1] 
    : null;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-[#561269]/40 hover:shadow-xl hover:shadow-indigo-950/5 transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Top Badges */}
      <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-0.5 sm:gap-1">
        {discountPercent > 0 && (
          <span className="bg-[#FF6B00] text-white text-[8px] sm:text-[10px] font-extrabold px-1 sm:px-2 py-0.5 rounded-sm sm:rounded-md shadow-2xs uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="bg-cyan-600 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded-sm sm:rounded-md shadow-2xs uppercase tracking-wider">
            New
          </span>
        )}
        {product.isBestSeller && !product.isNew && (
          <span className="bg-[#561269] text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded-sm sm:rounded-md shadow-2xs uppercase tracking-wider">
            Popular
          </span>
        )}
      </div>

      {/* Floating Action Icons (Wishlist always, Compare & QuickView on sm+) */}
      <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 flex flex-col gap-1 sm:gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        <motion.button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlist}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center transition-all shadow-2xs ${
            inWish
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
          }`}
        >
          <Heart className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${inWish ? 'fill-current' : ''}`} />
        </motion.button>

        <motion.button
          id={`compare-btn-${product.id}`}
          onClick={handleCompare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title={inComp ? 'Remove from Compare' : 'Add to Compare'}
          className={`hidden sm:flex w-7 h-7 rounded-lg items-center justify-center transition-all shadow-xs ${
            inComp
              ? 'bg-[#561269] text-white'
              : 'bg-white/90 text-slate-600 hover:bg-[#561269]/5 hover:text-[#561269] border border-slate-200'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
        </motion.button>

        {onQuickView && (
          <motion.button
            id={`quickview-btn-${product.id}`}
            onClick={handleQuickViewClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            title="Quick View Technical Specs"
            className="hidden sm:flex w-7 h-7 rounded-lg bg-white/90 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 items-center justify-center transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* Image Thumbnail - square on mobile, 4/3 on tablet/desktop */}
      <Link
        to={`/product/${product.id}`}
        className="block bg-slate-50 relative p-2 sm:p-4 pt-3.5 sm:pt-6 overflow-hidden border-b border-slate-100 aspect-square sm:aspect-4/3 flex items-center justify-center"
      >
        <img
          src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80')}
          alt={product.name}
          loading="lazy"
          className="w-full h-full max-h-[90%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-slate-900/60 backdrop-blur-xs text-white text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 sm:gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <Layers className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#FF6B00]" />
            {product.images.length}
          </span>
        )}
      </Link>

      {/* Card Content Body */}
      <div className="p-2 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-500 mb-0.5 sm:mb-1 gap-1 sm:gap-2">
            <span className="font-semibold text-[#561269] truncate">{product.brand}</span>
            <span className="font-mono text-[8px] sm:text-[10px] text-slate-400 bg-slate-100 px-1 sm:px-1.5 py-0.5 rounded shrink-0">
              {product.sku}
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-[11px] sm:text-sm font-semibold sm:font-bold text-slate-900 hover:text-[#561269] line-clamp-2 leading-tight mb-1 sm:mb-2 group-hover:underline min-h-[1.8rem] sm:min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating & In-Stock status */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[11px] font-bold text-amber-800 border border-amber-200/60">
              <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal hidden sm:inline">({product.reviewCount})</span>
            </div>

            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.stockCount > 10
                    ? 'bg-emerald-500'
                    : product.stockCount > 0
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              ></span>
              <span
                className={`text-[9px] sm:text-[11px] font-semibold truncate ${
                  product.stockCount > 10
                    ? 'text-emerald-700'
                    : product.stockCount > 0
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {product.stockCount > 10
                  ? 'In Stock'
                  : product.stockCount > 0
                  ? `Only ${product.stockCount}`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Key Specs tags (hidden on compact mobile to maintain clean height) */}
          <div className="hidden sm:flex flex-wrap gap-1 mb-3">
            {product.voltage && (
              <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 text-[#FF6B00]" />
                {product.voltage}
              </span>
            )}
            {product.category && (
              <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded truncate max-w-[120px]">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-1 sm:pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between gap-1 mb-1 sm:mb-1.5">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-xs sm:text-lg font-extrabold text-slate-900 font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[9px] sm:text-xs text-slate-400 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium">+18% GST</span>
          </div>

          {/* Bulk Tier Hint */}
          {bestTier && (
            <div className="hidden sm:flex text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold mb-2.5 items-center justify-between border border-emerald-200/50">
              <span>Bulk Tier: {bestTier.minQty}+ pcs</span>
              <span className="font-mono font-bold">₹{bestTier.unitPrice}/pc</span>
            </div>
          )}

          {/* CTA Buttons - full width on mobile, with quantity stepper on sm+ */}
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:inline-flex rounded-lg border border-slate-200 bg-slate-50 items-center overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity((q) => Math.max(1, q - 1));
                }}
                className="px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="px-1.5 py-1 text-xs font-bold text-slate-800 min-w-5 text-center font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity((q) => Math.min(product.stockCount || 99, q + 1));
                }}
                className="px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            <motion.button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              whileTap={{ scale: 0.96 }}
              disabled={!product.inStock || product.stockCount <= 0}
              className={`w-full sm:flex-1 font-bold text-[11px] sm:text-xs py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-md sm:rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-2xs cursor-pointer ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : !product.inStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#561269] hover:bg-[#460e56] text-white'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF6B00]" />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
