import React, { useEffect, useState } from 'react';
import { CheckCircle2, Download, FileText, IndianRupee, LoaderCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UploadedListRequest } from '../../types';
import {
  claimUploadedListRequest,
  markUploadedListRequestConverted,
  releaseUploadedListRequest,
  subscribeToUploadedListRequests,
} from '../../services/uploadedListService';

export const UploadedListRequestsTab: React.FC = () => {
  const { createOfflineOrder, showToast } = useApp();
  const [requests, setRequests] = useState<UploadedListRequest[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => subscribeToUploadedListRequests(
    (records) => {
      setRequests(records);
      setIsLoading(false);
      setLoadError(null);
    },
    (error) => {
      console.error('[UploadedLists] Could not load customer requests:', error);
      setIsLoading(false);
      setLoadError('Uploaded list requests could not be loaded. Please check your connection and permissions.');
    }
  ), []);

  const handleCreateOrder = async (request: UploadedListRequest) => {
    const totalAmount = Number(prices[request.id]);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      showToast('Enter a Price', 'Add a total price greater than ₹0 before creating the order.', 'error');
      return;
    }

    setProcessingId(request.id);
    let claimedRequest: UploadedListRequest | null = null;
    try {
      claimedRequest = await claimUploadedListRequest(request.id);
      const order = await createOfflineOrder({
        customer: {
          fullName: claimedRequest.customerName,
          phone: claimedRequest.phone,
          email: '',
          street: 'Uploaded list order — delivery address to be confirmed',
          city: 'To be confirmed',
          state: 'To be confirmed',
          pincode: '—',
        },
        items: [{
          productId: 'offline-component-list',
          name: `Uploaded component list (${claimedRequest.fileName})`,
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
        paymentMethod: 'UPI',
        paymentStatus: 'Pending',
        amountPaid: 0,
        balanceDue: totalAmount,
        packingNotes: `Customer uploaded list request ${claimedRequest.id}. Review the attached file before fulfillment.`,
        assignedSellerId: null,
        assignedSellerName: null,
        assignedAt: null,
      }, '', claimedRequest.fileName, claimedRequest.fileUrl);

      try {
        await markUploadedListRequestConverted(claimedRequest.id, order.id);
      } catch (error) {
        console.error('[UploadedLists] Order created but request status could not be updated:', error);
        showToast('Order Created; Request Update Failed', `${order.id} was created, but the request still needs to be marked converted.`, 'error');
        return;
      }

    } catch (error) {
      console.error('[UploadedLists] Could not convert request to order:', error);
      if (claimedRequest) {
        try {
          await releaseUploadedListRequest(claimedRequest.id);
        } catch (releaseError) {
          console.error('[UploadedLists] Could not release the request after conversion failed:', releaseError);
        }
      }
      showToast('Order Creation Failed', error instanceof Error ? error.message : 'The uploaded list could not be converted into an order.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-10 text-sm font-semibold text-slate-600"><LoaderCircle className="h-5 w-5 animate-spin" />Loading uploaded lists…</div>;
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-[#561269] to-[#380847] p-5 text-white sm:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-200">Customer submissions</p>
        <h2 className="mt-1 text-xl font-black">Uploaded Electronics Lists</h2>
        <p className="mt-1 text-xs text-purple-100">Review each attachment, enter the quoted total, and create an offline order for fulfillment.</p>
      </div>

      {loadError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{loadError}</p>}
      {!loadError && requests.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No customer lists have been uploaded yet.</div>
      )}

      <div className="space-y-4">
        {requests.map((request) => (
          <article key={request.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{request.customerName}</h3>
                <a className="mt-1 block text-sm font-semibold text-[#561269] hover:underline" href={`tel:${request.phone}`}>{request.phone}</a>
                <p className="mt-1 text-xs text-slate-500">Submitted {new Date(request.createdAt).toLocaleString()}</p>
              </div>
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                request.status === 'converted' ? 'bg-emerald-100 text-emerald-800' :
                  request.status === 'converting' ? 'bg-amber-100 text-amber-800' : 'bg-violet-100 text-violet-800'
              }`}>
                {request.status === 'converted' ? <CheckCircle2 className="h-3.5 w-3.5" /> : request.status === 'converting' ? <RefreshCw className="h-3.5 w-3.5" /> : null}
                {request.status === 'converted' ? `Order ${request.convertedOrderId}` : request.status === 'converting' ? 'Creating order…' : 'Awaiting price'}
              </span>
            </div>

            <a href={request.fileUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-[#561269] hover:bg-violet-50">
              <FileText className="h-5 w-5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{request.fileName}<span className="mt-0.5 block text-[11px] font-medium text-slate-500">{(request.fileSize / (1024 * 1024)).toFixed(2)} MB · {request.fileType || 'Document'}</span></span>
              <Download className="h-4 w-4 shrink-0" />
            </a>

            {request.status === 'submitted' && (
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
                <label className="block flex-1">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Quoted order total *</span>
                  <span className="relative block"><IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={prices[request.id] ?? ''} onChange={(event) => setPrices((current) => ({ ...current, [request.id]: event.target.value }))} type="number" min="0.01" step="0.01" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#561269] focus:ring-2 focus:ring-violet-100" placeholder="Enter total price in ₹" /></span>
                </label>
                <button type="button" disabled={processingId !== null} onClick={() => void handleCreateOrder(request)} className="rounded-xl bg-[#561269] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#460e56] disabled:cursor-not-allowed disabled:opacity-60">
                  {processingId === request.id ? 'Creating order…' : 'Create Offline Order'}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
