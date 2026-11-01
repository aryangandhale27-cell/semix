import React, { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileImage, IndianRupee, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { optimizeAndProcessImage, validateImageFile, type OptimizedImageResult } from '../../utils/imageOptimizer';

interface AdminOfflineOrdersTabProps {
  onViewOrders: () => void;
}

const getInitialForm = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');

  return {
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    componentList: '',
    orderDateTime: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`,
    totalAmount: '',
    amountPaid: '0',
    paymentMethod: 'UPI' as 'UPI' | 'COD',
  };
};

export const AdminOfflineOrdersTab: React.FC<AdminOfflineOrdersTabProps> = ({ onViewOrders }) => {
  const { createOfflineOrder, showToast } = useApp();
  const [form, setForm] = useState(getInitialForm);
  const [attachment, setAttachment] = useState<OptimizedImageResult | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const isSubmissionInProgress = useRef(false);
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast('Invalid Component List Image', validation.error || 'Choose a supported image file.', 'error');
      return;
    }

    setIsPreparingImage(true);
    try {
      const processedImage = await optimizeAndProcessImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.9,
        targetFormat: 'image/webp',
      });
      setAttachment(processedImage);
    } catch (error) {
      console.error('[AdminOfflineOrders] Image processing failed:', error);
      showToast('Image Processing Failed', error instanceof Error ? error.message : 'The selected image could not be processed.', 'error');
    } finally {
      setIsPreparingImage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const totalAmount = Number(form.totalAmount);
    const amountPaid = Number(form.amountPaid);
    const orderDateTime = new Date(form.orderDateTime);

    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim()) {
      showToast('Customer Details Required', 'Enter the customer name, mobile number, and email.', 'error');
      return;
    }
    if (!form.orderDateTime || !Number.isFinite(orderDateTime.getTime())) {
      showToast('Invalid Order Date and Time', 'Enter a valid order date and time.', 'error');
      return;
    }
    if (!form.componentList.trim() || !attachment) {
      showToast('Component List Required', 'Describe the requested components and upload the customer list image.', 'error');
      return;
    }
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      showToast('Invalid Order Total', 'Enter an order total greater than zero.', 'error');
      return;
    }
    if (!Number.isFinite(amountPaid) || amountPaid < 0 || amountPaid > totalAmount) {
      showToast('Invalid Initial Payment', 'Payment collected must be between ₹0 and the order total.', 'error');
      return;
    }

    if (isSubmissionInProgress.current) return;
    isSubmissionInProgress.current = true;
    setIsSubmitting(true);
    try {
      const order = await createOfflineOrder({
        createdAt: orderDateTime.toISOString(),
        customer: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          street: form.street.trim() || 'Offline order — contact customer',
          city: form.city.trim() || 'To be confirmed',
          state: form.state.trim() || 'To be confirmed',
          pincode: form.pincode.trim() || '—',
        },
        items: [{
          productId: 'offline-component-list',
          name: 'Customer component list (see attachment)',
          sku: 'OFFLINE-LIST',
          price: totalAmount,
          quantity: 1,
          image: '',
        }],
        subtotal: totalAmount,
        shippingFee: 0,
        tax: 0,
        discount: 0,
        totalAmount,
        status: 'pending_assignment',
        paymentMethod: form.paymentMethod,
        paymentStatus: amountPaid === totalAmount ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Pending',
        amountPaid,
        balanceDue: totalAmount - amountPaid,
        packingNotes: `Customer component list: ${form.componentList.trim()}`,
        assignedSellerId: null,
        assignedSellerName: null,
        assignedAt: null,
      }, attachment.dataUrl, attachment.filename);
      setCreatedOrderId(order.id);
      setForm(getInitialForm());
      setAttachment(null);
    } catch (error) {
      console.error('[AdminOfflineOrders] Could not create offline order:', error);
      showToast('Offline Order Failed', error instanceof Error ? error.message : 'The order could not be saved.', 'error');
    } finally {
      isSubmissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/15';
  const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700';

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#561269] to-[#380847] px-5 py-5 text-white sm:px-7">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-200">Admin order entry</p>
          <h2 className="mt-1 text-xl font-black">Create Offline Order</h2>
          <p className="mt-1 text-xs text-purple-100">Create a standard order ID and send it into the usual seller assignment and fulfillment workflow.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          {createdOrderId && (
            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Order {createdOrderId} created and ready for seller assignment.
              </p>
              <button type="button" onClick={onViewOrders} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800">
                Open Orders &amp; Assign Seller
              </button>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#561269]">Customer details</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label><span className={labelClass}>Customer name *</span><input required autoComplete="name" className={inputClass} value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></label>
              <label><span className={labelClass}>Mobile number *</span><input required type="tel" autoComplete="tel" className={inputClass} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
              <label><span className={labelClass}>Email address *</span><input required type="email" autoComplete="email" className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#561269]">Delivery details <span className="font-medium normal-case text-slate-400">— optional, can be confirmed later</span></h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="sm:col-span-2"><span className={labelClass}>Street / delivery address</span><input autoComplete="street-address" className={inputClass} value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} /></label>
              <label><span className={labelClass}>City</span><input autoComplete="address-level2" className={inputClass} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label>
              <label><span className={labelClass}>State</span><input autoComplete="address-level1" className={inputClass} value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} /></label>
              <label><span className={labelClass}>PIN code</span><input autoComplete="postal-code" className={inputClass} value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} /></label>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#561269]">Customer component list</h3>
              <label className="block">
                <span className={labelClass}>List details for the fulfillment seller</span>
                <textarea required rows={4} className={`${inputClass} resize-y`} placeholder="Part names, SKUs, quantities, or handling instructions" value={form.componentList} onChange={(event) => setForm({ ...form, componentList: event.target.value })} />
              </label>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-4 text-center hover:border-violet-400">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => void handleImageChange(event)} />
                {isPreparingImage ? <div className="text-xs font-bold text-violet-800">Preparing image…</div> : attachment ? (
                  <div className="flex items-center gap-3 text-left">
                    <img src={attachment.dataUrl} alt="Component list preview" className="h-16 w-16 rounded-lg border border-slate-200 bg-white object-contain" />
                    <span className="text-xs font-bold text-emerald-800">{attachment.filename}<span className="mt-1 block font-medium text-slate-500">Click to replace image</span></span>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-5 w-5 text-[#561269]" />
                    <span className="text-xs font-bold text-slate-800">Upload list image from device *</span>
                    <span className="mt-1 text-[10px] text-slate-500">JPG, PNG, or WEBP up to 5 MB</span>
                  </>
                )}
              </label>
              {attachment && <p className="flex items-center gap-1 text-[11px] text-slate-500"><FileImage className="h-3.5 w-3.5" /> Image will be attached to the order for seller fulfillment.</p>}
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#561269]">Order total &amp; payment collection</h3>
              <label className="block">
                <span className={labelClass}>Order date and time *</span>
                <input required type="datetime-local" className={inputClass} value={form.orderDateTime} onChange={(event) => setForm({ ...form, orderDateTime: event.target.value })} />
              </label>
              <label className="block">
                <span className={labelClass}>Total order amount (₹) *</span>
                <span className="relative block"><IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required min="0.01" step="0.01" type="number" className={`${inputClass} pl-9`} value={form.totalAmount} onChange={(event) => setForm({ ...form, totalAmount: event.target.value })} /></span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className={labelClass}>Payment method</span><select className={inputClass} value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value as 'UPI' | 'COD' })}><option value="UPI">UPI (collected offline)</option><option value="COD">Cash on delivery</option></select></label>
                <label><span className={labelClass}>Amount already collected (₹)</span><input min="0" step="0.01" type="number" className={inputClass} value={form.amountPaid} onChange={(event) => setForm({ ...form, amountPaid: event.target.value })} /></label>
              </div>
              <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Any remaining balance is recorded on the standard order and must be collected before delivery can be completed.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500">An ORD- order ID and tracking number are assigned automatically.</p>
            <button type="submit" disabled={isSubmitting || isPreparingImage || !attachment} className="rounded-xl bg-[#561269] px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-[#460e56] disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? 'Saving order…' : 'Create Offline Order'}
            </button>
          </div>
        </form>
      </section>

    </div>
  );
};
