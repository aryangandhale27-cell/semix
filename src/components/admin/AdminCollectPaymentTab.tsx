import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, CreditCard, LoaderCircle, ReceiptText } from 'lucide-react';
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: any) => void) => void;
}

interface PaymentCollection {
  amount: number;
  currency: 'INR';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purpose: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  collectedByEmail: string;
  createdAt?: { toDate?: () => Date };
}

function loadRazorpayCheckout(): Promise<void> {
  if (getRazorpayConstructor()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

function getRazorpayConstructor(): (new (options: RazorpayOptions) => RazorpayInstance) | undefined {
  return (window as Window & { Razorpay?: new (options: RazorpayOptions) => RazorpayInstance }).Razorpay;
}

function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export const AdminCollectPaymentTab: React.FC = () => {
  const [form, setForm] = useState({ amount: '', customerName: '', customerEmail: '', customerPhone: '', purpose: '' });
  const [recentCollections, setRecentCollections] = useState<Array<PaymentCollection & { id: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unsavedCollection, setUnsavedCollection] = useState<PaymentCollection | null>(null);
  const [status, setStatus] = useState<{ kind: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    const collectionsQuery = query(collection(db, 'payment_collections'), orderBy('createdAt', 'desc'), limit(10));
    return onSnapshot(
      collectionsQuery,
      (snapshot) => {
        setRecentCollections(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as PaymentCollection & { id: string })));
        setHistoryError('');
      },
      () => setHistoryError('Payment history is unavailable for this Firebase account.')
    );
  }, []);

  const persistCollection = async (payment: PaymentCollection) => {
    const paymentRef = doc(db, 'payment_collections', payment.razorpayPaymentId);
    const existingPayment = await getDoc(paymentRef);
    if (existingPayment.exists()) return;
    await setDoc(paymentRef, { ...payment, createdAt: serverTimestamp() });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(form.amount);
    const customerName = form.customerName.trim();
    const customerEmail = form.customerEmail.trim();
    const purpose = form.purpose.trim();

    if (!Number.isFinite(amount) || amount < 1 || Number(amount.toFixed(2)) !== amount) {
      setStatus({ kind: 'error', message: 'Enter an amount of at least ₹1 with no more than two decimal places.' });
      return;
    }
    if (!customerName || !customerEmail || !purpose) {
      setStatus({ kind: 'error', message: 'Payer name, email, and payment purpose are required.' });
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      const orderResponse = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt: `collect_${Date.now()}` }),
      });
      const orderPayload = await orderResponse.json();
      if (!orderResponse.ok || !orderPayload.success) {
        throw new Error(orderPayload.error || 'Unable to start Razorpay checkout.');
      }

      await loadRazorpayCheckout();
      const RazorpayConstructor = getRazorpayConstructor();
      if (!RazorpayConstructor) throw new Error('Razorpay checkout did not initialize.');

      const checkout = new RazorpayConstructor({
        key: orderPayload.keyId,
        amount: orderPayload.order.amount,
        currency: orderPayload.order.currency,
        name: 'SEMIX LABS',
        description: purpose.slice(0, 255),
        order_id: orderPayload.order.id,
        prefill: { name: customerName, email: customerEmail, contact: form.customerPhone.trim() },
        theme: { color: '#561269' },
        handler: async (response) => {
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

            const payment: PaymentCollection = {
              amount,
              currency: 'INR',
              customerName,
              customerEmail,
              customerPhone: form.customerPhone.trim(),
              purpose,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              collectedByEmail: auth.currentUser?.email || '',
            };

            try {
              await persistCollection(payment);
              setUnsavedCollection(null);
              setStatus({ kind: 'success', message: `Payment of ${formatRupees(amount)} verified and recorded.` });
            } catch {
              setUnsavedCollection(payment);
              setStatus({
                kind: 'warning',
                message: `Payment verified (${response.razorpay_payment_id}), but the ledger could not be saved. Retry the save below.`,
              });
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Payment verification failed.';
            setStatus({ kind: 'error', message: `Payment was not confirmed: ${message}` });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });

      checkout.on('payment.failed', (response) => {
        setIsProcessing(false);
        setStatus({ kind: 'error', message: response.error?.description || 'Razorpay payment failed.' });
      });
      checkout.open();
    } catch (error) {
      setIsProcessing(false);
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Could not start payment.' });
    }
  };

  const retryLedgerSave = async () => {
    if (!unsavedCollection) return;
    try {
      await persistCollection(unsavedCollection);
      setUnsavedCollection(null);
      setStatus({ kind: 'success', message: `Payment of ${formatRupees(unsavedCollection.amount)} recorded.` });
    } catch {
      setStatus({
        kind: 'warning',
        message: `Payment is verified (${unsavedCollection.razorpayPaymentId}), but the ledger is still unavailable.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Collect a payment</h2>
              <p className="mt-1 text-sm text-slate-500">Enter the charge details, then hand checkout to the payer.</p>
            </div>
            <CreditCard className="h-5 w-5 shrink-0 text-[#561269]" aria-hidden="true" />
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Amount (INR)</span>
            <div className="flex items-center rounded-lg border border-slate-300 focus-within:border-[#561269] focus-within:ring-2 focus-within:ring-violet-100">
              <span className="border-r border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-500">₹</span>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                placeholder="0.00"
                className="min-w-0 flex-1 rounded-r-lg px-3 py-2.5 text-sm text-slate-900 outline-none"
              />
            </div>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700">Payer name</span>
              <input required value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#561269] focus:ring-2 focus:ring-violet-100" autoComplete="name" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700">Payer email</span>
              <input type="email" required value={form.customerEmail} onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#561269] focus:ring-2 focus:ring-violet-100" autoComplete="email" />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700">Phone <span className="font-normal text-slate-400">(optional)</span></span>
              <input type="tel" value={form.customerPhone} onChange={(event) => setForm((current) => ({ ...current, customerPhone: event.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#561269] focus:ring-2 focus:ring-violet-100" autoComplete="tel" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700">Payment purpose</span>
              <input required maxLength={255} value={form.purpose} onChange={(event) => setForm((current) => ({ ...current, purpose: event.target.value }))} placeholder="Order, invoice, or service" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#561269] focus:ring-2 focus:ring-violet-100" />
            </label>
          </div>

          {status && (
            <div role="status" className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${status.kind === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : status.kind === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              {status.kind === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <Activity className="mt-0.5 h-4 w-4 shrink-0" />}
              <span className="min-w-0 flex-1">{status.message}</span>
              {unsavedCollection && <button type="button" onClick={retryLedgerSave} className="shrink-0 font-bold underline underline-offset-2">Retry save</button>}
            </div>
          )}

          <button type="submit" disabled={isProcessing} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#561269] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6c1a80] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            {isProcessing ? 'Waiting for payment...' : 'Continue to secure payment'}
          </button>
          <p className="text-xs leading-5 text-slate-500">Payments are processed by Razorpay. Card and UPI details are never stored in this portal.</p>
        </form>

        <aside className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div>
            <div className="flex items-center gap-2 text-slate-700">
              <ReceiptText className="h-4 w-4 text-[#561269]" />
              <h2 className="text-sm font-bold">Payment details</h2>
            </div>
            <dl className="mt-5 divide-y divide-slate-200 text-sm">
              <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Gateway</dt><dd className="font-semibold text-slate-800">Razorpay</dd></div>
              <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Currency</dt><dd className="font-semibold text-slate-800">INR</dd></div>
              <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Confirmation</dt><dd className="text-right font-semibold text-slate-800">Signature verified on server</dd></div>
              <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Ledger</dt><dd className="text-right font-semibold text-slate-800">Admin payment history</dd></div>
            </dl>
          </div>
          <p className="border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">The payer completes the transaction in Razorpay Checkout. Only verified payments are added to the admin ledger.</p>
        </aside>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent collected payments</h2>
            <p className="mt-1 text-xs text-slate-500">Latest 10 verified transactions</p>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{recentCollections.length}</span>
        </div>
        {historyError ? (
          <p className="px-5 py-6 text-sm text-amber-700">{historyError}</p>
        ) : recentCollections.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No collected payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                <tr><th className="px-5 py-3">Payer</th><th className="px-5 py-3">Purpose</th><th className="px-5 py-3">Payment ID</th><th className="px-5 py-3 text-right">Amount</th><th className="px-5 py-3">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCollections.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-3"><p className="font-semibold text-slate-800">{payment.customerName}</p><p className="text-xs text-slate-500">{payment.customerEmail}</p></td>
                    <td className="max-w-56 truncate px-5 py-3 text-slate-600" title={payment.purpose}>{payment.purpose}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{payment.razorpayPaymentId}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-slate-900">{formatRupees(payment.amount)}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{payment.createdAt?.toDate?.().toLocaleString('en-IN') || 'Just now'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};