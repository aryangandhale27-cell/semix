import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CustomerAddress, OrderItem } from '../../types';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building, 
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Package,
  Clock,
  Sparkles,
  Banknote,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Info,
  Tag,
  X,
  Loader2,
  Mail,
  ExternalLink
} from 'lucide-react';
import { EmailPreviewModal } from '../../components/common/EmailPreviewModal';
import { getLocalSentEmails, getGmailComposeUrl } from '../../services/emailService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    appliedCoupon, 
    couponDiscount, 
    applyCoupon, 
    removeCoupon, 
    placeOrderWithCoupon, 
    showToast, 
    updateCartQuantity, 
    removeFromCart 
  } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: user?.displayName || 'Vikramaditya Sharma',
    phone: '+91 98451 23098',
    email: user?.email || 'vikram.maker@gmail.com',
    street: 'Flat 402, Prithvi Silicon Heights, Outer Ring Road',
    landmark: 'Near Marathahalli Bridge',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560037',
    isDefault: true
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD' | 'MakersCredit'>('UPI');
  const [packingNotes, setPackingNotes] = useState('Please double tape antistatic bags.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Coupon checkout interaction
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Delivery & Payment Availability Rules:
  const taxableAmount = Math.max(0, cartSubtotal - couponDiscount);
  const isFreeShipping = taxableAmount > 500;
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 70);
  const tax = taxableAmount * 0.18;
  const totalAmount = Math.max(0, taxableAmount + tax + shippingFee);

  // COD Availability Condition: strictly Order Subtotal > ₹300
  const isCodAvailable = taxableAmount > 300;
  const amountNeededForFreeShipping = Math.max(0, 500 - taxableAmount);

  // Automatic Reversion: If taxable amount drops to <= 300 while COD was selected, revert to default 'UPI'
  useEffect(() => {
    if (!isCodAvailable && paymentMethod === 'COD') {
      setPaymentMethod('UPI');
      showToast(
        'Payment Method Reverted',
        'Cash on Delivery is only available for orders above ₹300. Switched to Instant UPI.',
        'info'
      );
    }
  }, [isCodAvailable, paymentMethod, showToast]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const res = await applyCoupon(code, user?.id || address.email);
      if (!res.isValid) {
        setCouponError(res.error || 'Invalid coupon code.');
      } else {
        setCouponInput('');
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (cart.length === 0) {
      showToast('Cart is Empty', 'Please add items before checkout', 'warning');
      return;
    }

    if (paymentMethod === 'COD' && !isCodAvailable) {
      showToast('COD Not Allowed', 'Cash on Delivery is only available for orders above ₹300.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.appliedUnitPrice,
        quantity: item.quantity,
        image: item.product.image
      }));

      const finalizeOrder = async () => {
        const result = await placeOrderWithCoupon(
          {
            customer: address,
            items: orderItems,
            subtotal: cartSubtotal,
            shippingFee,
            tax,
            discount: couponDiscount,
            discountAmount: couponDiscount,
            couponCode: appliedCoupon?.code,
            totalAmount,
            finalTotal: totalAmount,
            status: 'pending_assignment',
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
            packingNotes,
            assignedSellerId: null,
            assignedSellerName: null,
            assignedAt: null,
            userId: user?.id || address.email
          },
          user?.id || address.email
        );

        if (!result.success) {
          throw new Error(result.error || 'Order placement blocked due to coupon validation error.');
        }

        setConfirmedOrderId(result.order.id);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        showToast(
          'Order Placed Successfully!',
          paymentMethod === 'COD'
            ? `Order #${result.order.id} placed with Cash on Delivery (₹${Math.round(totalAmount).toLocaleString('en-IN')})`
            : `Order #${result.order.id} confirmed and queued for fulfillment`,
          'success'
        );
      };

      const usesRazorpay = ['UPI', 'Card', 'NetBanking'].includes(paymentMethod);
      if (!usesRazorpay) {
        await finalizeOrder();
        setIsProcessing(false);
        return;
      }

      const orderResponse = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, receipt: `checkout_${Date.now()}` }),
      });
      const orderPayload = await orderResponse.json();
      if (!orderResponse.ok || !orderPayload.success) {
        throw new Error(orderPayload.error || 'Unable to start Razorpay checkout.');
      }

      await loadRazorpayCheckout();
      const razorpay = new window.Razorpay({
        key: orderPayload.keyId,
        amount: orderPayload.order.amount,
        currency: orderPayload.order.currency,
        name: 'SEMIX LABS',
        description: 'Electronics and prototyping supplies',
        order_id: orderPayload.order.id,
        prefill: { name: address.fullName, email: address.email, contact: address.phone },
        theme: { color: '#561269' },
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyPayload = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyPayload.success) {
              throw new Error(verifyPayload.error || 'Razorpay payment verification failed.');
            }
            await finalizeOrder();
          } catch (err: any) {
            setOrderError(err.message || 'Payment verification failed.');
            showToast('Payment Not Confirmed', err.message || 'Payment verification failed.', 'error');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });
      razorpay.on('payment.failed', (response: any) => {
        setIsProcessing(false);
        setOrderError(response.error?.description || 'Razorpay payment failed.');
        showToast('Payment Failed', response.error?.description || 'Razorpay payment failed.', 'error');
      });
      razorpay.open();
    } catch (err: any) {
      setIsProcessing(false);
      setOrderError(err.message || 'An unexpected error occurred while finalizing your order.');
      showToast('Checkout Failed', err.message || 'Could not place order', 'error');
    }
  };

  if (confirmedOrderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
            paymentMethod === 'COD'
              ? 'text-amber-700 bg-amber-50 border-amber-200'
              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
          }`}>
            {paymentMethod === 'COD' ? 'Order Confirmed • Pay upon Delivery' : 'Payment Verified & Order Confirmed'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#561269] mt-3">
            Thank you for your order!
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-mono">
            Order Reference: <span className="font-bold text-slate-900">{confirmedOrderId}</span>
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {paymentMethod === 'COD'
              ? 'Your parcel will be dispatched via express courier. Please keep ₹' + Math.round(totalAmount).toLocaleString('en-IN') + ' ready upon delivery.'
              : 'Our warehouse technicians in Bengaluru will pick and ESD pack your components.'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-200">
            Dispatch Details
          </h4>
          <div className="flex justify-between text-slate-600">
            <span>Recipient:</span>
            <span className="font-bold text-slate-900">{address.fullName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Destination:</span>
            <span className="font-semibold text-slate-800 text-right">{address.city}, {address.state} - {address.pincode}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Mode:</span>
            <span className="font-bold text-[#561269]">
              {paymentMethod === 'COD' ? 'Cash on Delivery (Pending ₹' + Math.round(totalAmount).toLocaleString('en-IN') + ')' : paymentMethod}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Status:</span>
            <span className={`font-bold font-mono ${shippingFee === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
              {shippingFee === 0 ? 'FREE Express Delivery' : 'Standard Express (₹70)'}
            </span>
          </div>
        </div>

        {/* Email Notification Dispatch Status Banner */}
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#561269] text-white shrink-0 shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">
                  Order Confirmation Email Dispatched!
                </p>
                <p className="text-[11px] text-slate-500">
                  Prepared for <strong className="text-slate-800">{address.email}</strong> & stored in Firestore.
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
              Ready
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                const emails = getLocalSentEmails();
                const latest = emails.find(e => e.orderId === confirmedOrderId && e.recipientType === 'customer') || emails[0];
                if (latest) {
                  window.open(getGmailComposeUrl(latest), '_blank', 'noopener,noreferrer');
                } else {
                  setIsEmailModalOpen(true);
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#ea4335] text-white hover:bg-[#d93025] shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Gmail (1-Click)</span>
            </button>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#561269] bg-white hover:bg-violet-100/50 border border-violet-200 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Email Center / Guide ↗</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            Tip: To auto-send physical emails directly into your Gmail inbox, configure your Google App Password in Settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to={`/customer/dashboard?tab=orders`}
            className="w-full sm:w-auto bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Package className="w-4 h-4 text-[#FF6B00]" />
            <span>Track Order Live in Dashboard</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors"
          >
            Continue Hardware Shopping
          </Link>
        </div>

        <EmailPreviewModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#561269]">Secure Prototyping Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified dispatch pipeline for electronics and lab supplies
          </p>
        </div>

        <Link to="/cart" className="text-xs font-bold text-[#561269] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Address & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#561269] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-extrabold text-sm text-slate-900">
                Shipping Address & Delivery Contact
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name / Lab Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (for Courier SMS)</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Street Address / Building / Department</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-bold text-slate-700 text-xs mb-1">
                Special Warehouse Packaging / Handling Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Include dangerous goods label, fragile IC pins..."
                value={packingNotes}
                onChange={(e) => setPackingNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#561269] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Payment Method Selection
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                100% Encrypted & Secure
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* UPI */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-[#561269] bg-[#561269]/5 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 text-[#561269]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <QrCode className="w-4 h-4 text-[#FF6B00]" />
                    <span>Instant UPI / QR Code</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Google Pay, PhonePe, Paytm, BHIM with zero gateway fee.
                  </p>
                </div>
              </label>

              {/* Cards */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-[#561269] bg-[#561269]/5 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="mt-1 text-[#561269]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <CreditCard className="w-4 h-4 text-cyan-600" />
                    <span>Credit / Debit Card</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Visa, Mastercard, RuPay, Corporate Amex with 3D Secure.
                  </p>
                </div>
              </label>

              {/* NetBanking */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'NetBanking'
                    ? 'border-[#561269] bg-[#561269]/5 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="NetBanking"
                  checked={paymentMethod === 'NetBanking'}
                  onChange={() => setPaymentMethod('NetBanking')}
                  className="mt-1 text-[#561269]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>Net Banking / RTGS / NEFT</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All major Indian commercial & institutional banks.
                  </p>
                </div>
              </label>

              {/* Cash on Delivery (COD) Option */}
              <div
                id="payment-method-cod-card"
                onClick={() => {
                  if (isCodAvailable) {
                    setPaymentMethod('COD');
                  } else {
                    showToast(
                      'COD Unavailable',
                      `Cash on Delivery is only available for orders above ₹300 (current subtotal: ₹${cartSubtotal.toFixed(0)}).`,
                      'warning'
                    );
                  }
                }}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 transition-all relative ${
                  !isCodAvailable
                    ? 'border-slate-200 bg-slate-50/80 opacity-65 cursor-not-allowed'
                    : paymentMethod === 'COD'
                    ? 'border-[#561269] bg-[#561269]/5 shadow-xs cursor-pointer'
                    : 'border-slate-200 hover:border-slate-300 cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  disabled={!isCodAvailable}
                  checked={paymentMethod === 'COD'}
                  onChange={() => {
                    if (isCodAvailable) setPaymentMethod('COD');
                  }}
                  className="mt-1 text-[#561269] disabled:opacity-50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    {isCodAvailable ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Available
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                        Subtotal &gt; ₹300
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pay by Cash or UPI QR at your doorstep upon parcel delivery.
                  </p>

                  {/* Subtle Helper Note when COD is disabled */}
                  {!isCodAvailable && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-1.5 text-[11px] text-amber-900 font-medium leading-tight">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Cash on Delivery is only available for orders above ₹300.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Makers Line of Credit */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'MakersCredit'
                    ? 'border-[#561269] bg-[#561269]/5 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="MakersCredit"
                  checked={paymentMethod === 'MakersCredit'}
                  onChange={() => setPaymentMethod('MakersCredit')}
                  className="mt-1 text-[#561269]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <span>Maker Line Credit (Net 30)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Approved university labs and verified hardware startups.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-extrabold text-sm text-[#561269] uppercase tracking-wider">
              Order Items ({cart.length})
            </h3>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)} units
            </span>
          </div>

          {/* Micro-banner / Progress Hint for Free Delivery */}
          {cartSubtotal <= 500 ? (
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
                  style={{ width: `${Math.min(100, (cartSubtotal / 500) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-amber-700">
                <span>Orders &gt; ₹500 get Free Express Shipping</span>
                <span className="font-mono font-bold">₹{cartSubtotal.toFixed(0)} / ₹500</span>
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
                  Your subtotal exceeds ₹500. Complimentary courier shipping applied.
                </p>
              </div>
            </div>
          )}

          {/* Order Items with Quantity Controls & Removal */}
          <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="pt-2.5 first:pt-0 flex items-center gap-3 text-xs">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-10 h-10 object-contain mix-blend-multiply bg-white rounded-lg p-1 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                  
                  {/* Quantity +/- adjustment right in checkout */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="inline-flex items-center border border-slate-200 rounded-md bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-l cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-[11px] font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-r cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      × ₹{item.appliedUnitPrice}
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{(item.appliedUnitPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                    title="Remove item from checkout"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Coupon Box on Checkout */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#561269]" />
                <span>Promotional Voucher</span>
              </label>
              {appliedCoupon && (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. ORDER10)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      if (couponError) setCouponError(null);
                    }}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase font-bold focus:ring-2 focus:ring-[#561269] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
                  >
                    {isApplyingCoupon ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-slate-400">Available:</span>
                  {['ORDER10', 'SEMIX100'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCouponInput(code);
                        setCouponError(null);
                      }}
                      className="font-mono font-bold text-[#561269] bg-purple-50 hover:bg-purple-100 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-emerald-950 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-[11px] font-semibold">
                    {appliedCoupon.discountType === 'percentage'
                      ? `${appliedCoupon.discountValue}% discount applied`
                      : `₹${appliedCoupon.discountValue} flat discount applied`}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-800">
                  -₹{Math.round(couponDiscount).toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Error Banner for Coupon Failure */}
            {couponError && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 flex items-start gap-1.5 text-xs text-rose-800">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span className="flex-1 text-[11px] leading-tight font-medium">{couponError}</span>
                <button
                  type="button"
                  onClick={() => setCouponError(null)}
                  className="text-rose-400 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold font-mono text-slate-900">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/70 px-2 py-1 rounded-lg">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-600" />
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                </span>
                <span className="font-bold font-mono text-emerald-800">
                  -₹{couponDiscount.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>GST (18%):</span>
              <span className="font-bold font-mono text-slate-900">
                ₹{tax.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>Express Delivery:</span>
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

            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable:</span>
              <span className="font-mono text-xl text-[#561269]">
                ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Global Order Error Banner */}
          {orderError && (
            <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-900">Checkout Validation Error</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{orderError}</p>
              </div>
              <button
                type="button"
                onClick={() => setOrderError(null)}
                className="text-rose-400 hover:text-rose-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Submit / Authorize Button with dynamic amount */}
          <button
            id="place-order-submit-btn"
            type="submit"
            disabled={isProcessing || cart.length === 0}
            className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span>Securing Payment & Dispatching...</span>
            ) : (
              <>
                {paymentMethod === 'COD' ? (
                  <Banknote className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>
                  {paymentMethod === 'COD'
                    ? `Place Order & Authorize (₹${Math.round(totalAmount).toLocaleString('en-IN')}) • COD`
                    : `Place Order & Authorize (₹${Math.round(totalAmount).toLocaleString('en-IN')})`}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

