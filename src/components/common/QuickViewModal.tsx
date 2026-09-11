import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  FileText, 
  Check, 
  Star, 
  Zap, 
  ExternalLink,
  ShieldCheck,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setActiveImgIndex(0);
    setSelectedQty(1);
  }, [product?.id]);

  const inWish = product ? isInWishlist(product.id) : false;
  const images = product ? (product.images && product.images.length > 0 ? product.images : [product.image]) : [];

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, selectedQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          id="quick-view-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="quick-view-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              id="close-quickview-btn"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Gallery */}
              <div className="bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
                <div className="group relative aspect-4/3 flex items-center justify-center p-4 bg-white/50 rounded-xl border border-slate-200/80 overflow-hidden">
                  {/* Photo Counter */}
                  {images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                      {activeImgIndex + 1} / {images.length}
                    </span>
                  )}

                  {/* Prev / Next overlay arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xs border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                        title="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xs border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                        title="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImgIndex}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      src={images[activeImgIndex] || product.image}
                      alt={product.name}
                      className="max-h-52 w-full object-contain mix-blend-multiply transition-all duration-200"
                    />
                  </AnimatePresence>
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 justify-center mt-3 overflow-x-auto py-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIndex(idx)}
                        className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden p-1 bg-white cursor-pointer transition-all shrink-0 ${
                          activeImgIndex === idx 
                            ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/30 scale-105 shadow-xs' 
                            : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">BIN: {product.locationBin}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Silicon
                  </span>
                </div>
              </div>

              {/* Right Info */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-bold text-[#561269] uppercase">{product.brand}</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">{product.sku}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-800 border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {product.stockCount} Units in Stock
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">+18% GST</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {product.shortDescription}
                  </p>

                  {/* Bulk Tier Quick view */}
                  {product.bulkTiers && product.bulkTiers.length > 0 && (
                    <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Volume Tier Discount
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                        {product.bulkTiers.map((tier, idx) => (
                          <div key={idx} className="bg-white p-1.5 rounded-lg border border-slate-200/80">
                            <span className="text-slate-500 text-[10px] block">{tier.minQty}+ pcs</span>
                            <span className="font-bold text-slate-900 font-mono">₹{tier.unitPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-xl border border-slate-300 bg-slate-50 items-center overflow-hidden">
                      <button
                        onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                        className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-2 text-xs font-bold text-slate-900 min-w-8 text-center font-mono">
                        {selectedQty}
                      </span>
                      <button
                        onClick={() => setSelectedQty((q) => Math.min(product.stockCount, q + 1))}
                        className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>

                    <motion.button
                      id="quickview-add-cart-btn"
                      onClick={handleAdd}
                      whileTap={{ scale: 0.97 }}
                      disabled={!product.inStock || product.stockCount <= 0}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        added
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#561269] hover:bg-[#460e56] text-white'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 text-[#FF6B00]" />
                          <span>Add to Cart (₹{(product.price * selectedQty).toLocaleString('en-IN')})</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        inWish
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-slate-50 text-slate-600 hover:text-rose-600 border-slate-300'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    {product.datasheetUrl ? (
                      <a
                        href={product.datasheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#561269] hover:text-[#FF6B00] font-bold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Technical Datasheet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span></span>
                    )}

                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="font-bold text-[#FF6B00] hover:underline"
                    >
                      Full Specs Page →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
