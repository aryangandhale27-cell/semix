import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Tag, 
  Truck, 
  Check, 
  Boxes,
  Sparkles,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useApp();
  const { user } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setIsApplying(true);
    try {
      const res = await applyCoupon(code, user?.id || 'guest_user');
      if (!res.isValid) {
        setCouponError(res.error || 'Invalid coupon code.');
      } else {
        setCouponInput('');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const taxableAmount = Math.max(0, cartSubtotal - couponDiscount);
  const gstTax = 0;
  const isFreeShipping = taxableAmount > 500;
  const shippingFee = cart.length === 0 || isFreeShipping ? 0 : 70;
  const grandTotal = taxableAmount + shippingFee;
  const amountNeededForFreeShipping = Math.max(0, 500 - taxableAmount);

  if (cart.length === 0) {
    return (
      <div id="empty-cart-state" className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Your Component Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
          Explore our extensive catalog of microcontrollers, sensors, drone parts, and custom fabrication services.
        </p>
        <Link
          to="/shop"
          className="bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-md transition-colors"
        >
          <span>Browse Hardware Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#561269] flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#FF6B00]" />
            <span>Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review technical components, volume discounts, and prepare for dispatch
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Item List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs divide-y divide-slate-100">
          {cart.map((item) => {
            const isDiscounted = item.appliedUnitPrice < item.product.price;
            const lineTotal = item.appliedUnitPrice * item.quantity;

            return (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Thumb */}
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                    <span className="font-bold text-[#561269]">{item.product.brand}</span>
                    <span>•</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                      {item.product.sku}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 font-mono">Bin: {item.product.locationBin}</span>
                  </div>

                  <Link
                    to={`/product/${item.product.id}`}
                    className="font-bold text-xs sm:text-sm text-slate-900 hover:text-[#561269] line-clamp-1 block"
                  >
                    {item.product.name}
                  </Link>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      ₹{item.appliedUnitPrice.toLocaleString('en-IN')}/pc
                    </span>
                    {isDiscounted && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                        Bulk Tier Applied
                      </span>
                    )}
                  </div>
                </div>

                {/* Qty & Line total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                  {/* Stepper */}
                  <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 items-center overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-1 text-xs font-bold text-slate-900 min-w-7 text-center font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-sm font-extrabold text-slate-900 font-mono block">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      (excl. GST)
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-[#561269] uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-[11px] font-mono font-normal text-slate-500">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
            </h3>

            {/* Interactive Coupon Box */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                Have a coupon?
              </label>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter Code (e.g. ORDER10)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          if (couponError) setCouponError(null);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#561269] focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Validating...</span>
                        </>
                      ) : (
                        <span>Apply</span>
                      )}
                    </button>
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold">Try:</span>
                    {['ORDER10', 'SEMIX100', 'MAKER50'].map((suggestedCode) => (
                      <button
                        key={suggestedCode}
                        type="button"
                        onClick={() => {
                          setCouponInput(suggestedCode);
                          setCouponError(null);
                        }}
                        className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        {suggestedCode}
                      </button>
                    ))}
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl p-3 text-xs space-y-1 shadow-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold font-mono text-emerald-950">
                          {appliedCoupon.code}
                        </span>
                        <span className="ml-1.5 text-[11px] font-bold text-emerald-700">
                          {appliedCoupon.discountType === 'percentage'
                            ? `(${appliedCoupon.discountValue}% OFF)`
                            : `(₹${appliedCoupon.discountValue} FLAT)`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium pl-8">
                    Voucher active! You save <strong className="font-mono font-bold">₹{Math.round(couponDiscount).toLocaleString('en-IN')}</strong> on this order.
                  </p>
                </div>
              )}

              {/* Error Banner Tailored to Failure */}
              {couponError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-900 leading-tight">{couponError}</p>
                  </div>
                  <button
                    onClick={() => setCouponError(null)}
                    className="text-rose-400 hover:text-rose-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Free Delivery Micro-banner / Progress Hint */}
            {taxableAmount <= 500 ? (
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Add <strong className="font-mono text-amber-950 font-bold">₹{amountNeededForFreeShipping.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong> more to get <strong className="text-emerald-700">FREE Delivery</strong>!
                    </span>
                  </span>
                </div>
                <div className="w-full bg-amber-200/80 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FF6B00] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (taxableAmount / 500) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-amber-700">
                  <span>Orders &gt; ₹500 get Free Express Shipping</span>
                  <span className="font-mono font-bold">₹{taxableAmount.toFixed(0)} / ₹500</span>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-emerald-900 flex items-center gap-1">
                    <span>Unlocked FREE Express Delivery!</span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-800 font-bold px-1.5 rounded">
                      ₹0 Shipping
                    </span>
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Your order qualifies for complimentary express courier dispatch.
                  </p>
                </div>
              </div>
            )}

            {/* Breakdown calculations */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal (Catalog items):</span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/70 px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-emerald-600" />
                    <span>Coupon ({appliedCoupon?.code}):</span>
                  </span>
                  <span className="font-bold font-mono text-emerald-800">
                    -₹{couponDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST (18% Standard):</span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{gstTax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span>Express Courier:</span>
                  {isFreeShipping && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                      FREE
                    </span>
                  )}
                </span>
                <span className={`font-bold font-mono ${isFreeShipping ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="font-mono text-xl text-[#561269]">
                  ₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="w-full text-center text-xs font-bold text-slate-500 hover:text-[#561269] flex items-center justify-center gap-1 pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Hardware Shopping</span>
            </Link>
          </div>

          {/* Trust note */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>GST Input Credit Available</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tax invoice with HSN codes & your GSTIN provided automatically for business expense filing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
