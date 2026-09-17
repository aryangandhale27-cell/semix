import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ProductCard } from '../../components/common/ProductCard';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import { 
  ShoppingCart, 
  Heart, 
  GitCompare, 
  FileText, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Check, 
  ExternalLink, 
  Zap, 
  Boxes, 
  Info, 
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Download,
  Maximize2,
  Trash2,
  Edit3,
  ShieldAlert,
  X
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist, addToCompare, isComparing, calculateAppliedPrice, deleteProduct } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'datasheet' | 'tiers' | 'reviews'>('specs');
  const [added, setAdded] = useState(false);

  // Keyboard navigation for gallery & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, product]);

  // Mock Reviews
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Aniket V.',
      rating: 5,
      date: '2 days ago',
      verified: true,
      title: 'Works flawlessly with PlatformIO & Arduino IDE',
      comment: 'Excellent packaging with antistatic bag. Tested GPIO pins, ADC reading is steady and clean with 3.3V logic level.'
    },
    {
      id: 'rev-2',
      author: 'Prof. S. Ranganathan',
      rating: 5,
      date: '1 week ago',
      verified: true,
      title: 'Bulk ordered 30 units for Robotics Lab batch',
      comment: 'The volume discount was automatically applied. All 30 pieces tested 100% operational. Fast courier dispatch to Chennai.'
    }
  ]);

  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText || !newReviewAuthor) return;
    setReviews((prev) => [
      {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor,
        rating: newReviewRating,
        date: 'Just now',
        verified: true,
        title: 'Verified Customer Review',
        comment: newReviewText
      },
      ...prev
    ]);
    setNewReviewText('');
    setNewReviewAuthor('');
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Component not found</h2>
        <Link to="/shop" className="text-[#561269] font-bold underline mt-2 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const inWish = isInWishlist(product.id);
  const inComp = isComparing(product.id);

  // Calculate current unit price based on qty
  const unitPrice = calculateAppliedPrice(product, selectedQty);
  const totalPrice = unitPrice * selectedQty;
  const standardTotal = product.price * selectedQty;
  const savings = standardTotal - totalPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedQty);
    navigate('/checkout');
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin / Team Staff Quick Management Bar */}
      {(user?.role === 'admin' || user?.role === 'team') && (
        <div className="bg-gradient-to-r from-[#561269] to-[#3b0b49] text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between flex-wrap gap-3 border border-purple-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6B00]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black flex items-center gap-1.5">
                <span>Staff Hardware Control</span>
                <span className="text-[10px] uppercase font-bold bg-[#FF6B00] text-white px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </p>
              <p className="text-[11px] text-purple-200">
                SKU: <span className="font-mono font-bold text-white">{product.sku}</span> • Stock: <span className="font-mono font-bold text-white">{product.stockCount}</span> • Bin: <span className="font-mono font-bold text-white">{product.locationBin || 'BIN-A01'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={user.role === 'admin' ? '/admin' : '/team'}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Open in {user.role === 'admin' ? 'Admin' : 'Team'} Dashboard</span>
            </Link>

            <button
              type="button"
              id="admin-delete-product-btn"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Product</span>
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-slate-800">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-800">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden aspect-square flex items-center justify-center">
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-cyan-600 text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs z-10">
                New Arrival
              </span>
            )}

            {/* Counter Badge */}
            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs z-10">
                {selectedImgIdx + 1} / {images.length} Photos
              </span>
            )}

            {/* Lightbox Trigger Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-[#561269] shadow-xs border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
              title="Click to expand high-resolution photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-200 text-slate-800 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-200 text-slate-800 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Main Image with Animated Transition */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImgIdx}
                src={images[selectedImgIdx] || product.image}
                alt={`${product.name} - View ${selectedImgIdx + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsLightboxOpen(true)}
                className="max-h-80 w-full object-contain mix-blend-multiply cursor-zoom-in transition-all"
              />
            </AnimatePresence>
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-2.5 justify-center overflow-x-auto py-1 px-2">
              {images.map((img, idx) => {
                const isActive = selectedImgIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden p-1 bg-white cursor-pointer transition-all shrink-0 ${
                      isActive
                        ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/30 scale-105 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                    {idx === 0 && (
                      <span className="absolute bottom-0.5 inset-x-0 bg-[#FF6B00] text-white text-[8px] font-extrabold uppercase py-0.5 text-center leading-none">
                        Cover
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Verification Badges */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Silicon</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>ESD Sealed Packing</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-600 shrink-0" />
              <span>7-Day Replacement</span>
            </div>
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#FF6B00] shrink-0" />
              <span>Bin: {product.locationBin}</span>
            </div>
          </div>
        </div>

        {/* Right Product Buy Box & Specs Summary */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-extrabold text-[#561269] uppercase tracking-wider">{product.brand}</span>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">SKU: {product.sku}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock info */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} customer reviews)</span>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  product.stockCount > 10
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : product.stockCount > 0
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {product.stockCount > 10
                  ? `In Stock (${product.stockCount} units available)`
                  : product.stockCount > 0
                  ? `Low Stock: Only ${product.stockCount} units remaining`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing Calculation Display */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                ₹{unitPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ piece (+18% GST)</span>

              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  MRP: ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}

              {unitPrice < product.price && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Volume Tier Active (Saved ₹{savings.toLocaleString('en-IN')})
                </span>
              )}
            </div>

            {/* Bulk Pricing Tier Table */}
            {product.bulkTiers && product.bulkTiers.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
                  Multi-Tier Volume Pricing (Instant Discount)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.bulkTiers.map((tier, idx) => {
                    const isCurrentTier = selectedQty >= tier.minQty && (idx === product.bulkTiers.length - 1 || selectedQty < product.bulkTiers[idx + 1].minQty);
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedQty(tier.minQty)}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                          isCurrentTier
                            ? 'bg-[#561269] text-white border-[#561269] shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-[10px] block uppercase font-semibold ${isCurrentTier ? 'text-purple-200' : 'text-slate-400'}`}>
                          {tier.minQty}+ pieces
                        </span>
                        <span className="text-sm font-extrabold font-mono block">
                          ₹{tier.unitPrice}
                        </span>
                        {tier.discountPercent > 0 && (
                          <span className={`text-[9px] font-bold ${isCurrentTier ? 'text-[#FF6B00]' : 'text-emerald-600'}`}>
                            Save {tier.discountPercent}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity counter */}
              <div className="inline-flex rounded-xl border border-slate-300 bg-white items-center overflow-hidden h-12 shrink-0">
                <button
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  className="px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 h-full cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stockCount}
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(Math.max(1, Math.min(product.stockCount, parseInt(e.target.value) || 1)))}
                  className="w-14 text-center font-bold text-slate-900 text-sm focus:outline-hidden font-mono"
                />
                <button
                  onClick={() => setSelectedQty((q) => Math.min(product.stockCount, q + 1))}
                  className="px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 h-full cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                id="pdp-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock || product.stockCount <= 0}
                className={`w-full sm:flex-1 h-12 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#561269] hover:bg-[#460e56] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {selectedQty} pcs to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-[#FF6B00]" />
                    <span>Add to Cart (₹{totalPrice.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                id="pdp-buy-now-btn"
                onClick={handleBuyNow}
                disabled={!product.inStock || product.stockCount <= 0}
                className="w-full sm:w-auto h-12 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 rounded-xl transition-colors cursor-pointer shadow-md shadow-orange-950/10"
              >
                Buy Now
              </button>

              {/* Wishlist & Compare */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    inWish ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-300 hover:text-rose-600'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => addToCompare(product.id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    inComp ? 'bg-[#561269] text-white border-[#561269]' : 'bg-white text-slate-600 border-slate-300 hover:text-[#561269]'
                  }`}
                  title="Compare"
                >
                  <GitCompare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Short description & datasheet quick download */}
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>{product.shortDescription}</p>
            {product.datasheetUrl && (
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#561269] hover:text-[#FF6B00] font-bold pt-1"
              >
                <FileText className="w-4 h-4 text-[#FF6B00]" />
                <span>Download Official Engineering Datasheet (PDF)</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section: Technical Specs, Full Description, Datasheet, Reviews */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-[#561269] text-[#561269] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-[#FF6B00]" />
            <span>Technical Specifications</span>
          </button>

          <button
            onClick={() => setActiveTab('datasheet')}
            className={`px-5 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'datasheet'
                ? 'border-[#561269] text-[#561269] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-600" />
            <span>Datasheet & Pinouts</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#561269] text-[#561269] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>Verified Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3">Electrical & Hardware Specifications</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {product.specifications?.map((spec, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-3 text-xs p-3">
                      <span className="font-bold text-slate-600 bg-slate-50/50 sm:bg-transparent -m-3 sm:m-0 p-3 sm:p-0">
                        {spec.name}
                      </span>
                      <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-2">Detailed Product Overview</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'datasheet' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Official Datasheet PDF & Pin Configuration</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete schematic, register map, timing diagrams, and application circuits directly from {product.brand}.
                  </p>
                </div>
                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Datasheet</span>
                  </a>
                )}
              </div>

              {/* Pinout cheat sheet */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Operating Logic & Recommended Power Supply
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Supply Input</span>
                    <span className="font-bold text-slate-800">{product.voltage || '5V Standard'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">ESD Protection Level</span>
                    <span className="font-bold text-emerald-700">Class 2 (2000V HBM)</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Warehouse Storage Bin</span>
                    <span className="font-bold font-mono text-[#561269]">{product.locationBin}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rev.author}</span>
                        {rev.verified && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <h5 className="font-bold text-xs text-slate-800 mb-1">{rev.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Write a Technical Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name / Institution"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    required
                    className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-semibold">Rating:</span>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                      <option value="2">⭐⭐ (2 Stars)</option>
                      <option value="1">⭐ (1 Star)</option>
                    </select>
                  </div>
                </div>

                <textarea
                  placeholder="Share details on pin testing, firmware support, operating temperatures, or project use..."
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs"
                />

                <button
                  type="submit"
                  className="bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-5 py-2 rounded-lg cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Components */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-[#561269]">Related Hardware & Components</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* FULL-SCREEN ZOOM LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            id="product-lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lightbox Header Bar */}
            <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
              <div>
                <p className="text-sm font-semibold truncate max-w-md text-white/90">{product.name}</p>
                <p className="text-xs text-slate-400">
                  Photo {selectedImgIdx + 1} of {images.length} • Use Arrow Keys or click to navigate
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Center Stage */}
            <div 
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImgIdx}
                  src={images[selectedImgIdx] || product.image}
                  alt={`${product.name} view ${selectedImgIdx + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[75vh] max-w-[85vw] object-contain rounded-lg drop-shadow-2xl select-none"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Lightbox Bottom Thumbnails */}
            {images.length > 1 && (
              <div 
                className="flex items-center justify-center gap-2.5 overflow-x-auto py-2 z-10" 
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-14 h-14 rounded-lg border-2 overflow-hidden p-1 bg-white cursor-pointer transition-all shrink-0 ${
                      selectedImgIdx === idx
                        ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/50 scale-110'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal for Staff */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteProduct(product.id);
          setIsDeleteModalOpen(false);
          navigate('/shop');
        }}
        title="Delete Component From Catalog"
        itemName={product.name}
        sku={product.sku}
        description="Are you sure you want to permanently delete this hardware component? It will be removed from the catalog, shopping carts, and inventory lists."
        confirmLabel="Delete Component"
      />
    </div>
  );
};
