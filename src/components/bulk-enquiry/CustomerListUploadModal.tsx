import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileText, Phone, Upload, UserRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { submitUploadedListRequest } from '../../services/uploadedListService';

interface CustomerListUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayMode?: 'modal' | 'page';
}

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic',
  'pdf', 'xls', 'xlsx', 'csv', 'tsv', 'txt',
  'doc', 'docx', 'odt', 'ods',
]);

export const CustomerListUploadModal: React.FC<CustomerListUploadModalProps> = ({ isOpen, onClose, displayMode = 'modal' }) => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectFile = (selected: File | undefined) => {
    if (!selected) return;
    const extension = selected.name.split('.').pop()?.toLowerCase() || '';
    if (!ACCEPTED_EXTENSIONS.has(extension)) {
      setFile(null);
      setErrorMessage('Choose an image, Excel/CSV, PDF, Word, or text document.');
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setErrorMessage('The file must be 15 MB or smaller.');
      return;
    }
    setErrorMessage('');
    setFile(selected);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (!customerName.trim()) {
      setErrorMessage('Enter your name.');
      return;
    }
    if (digits.length < 7 || digits.length > 15) {
      setErrorMessage('Enter a valid mobile number.');
      return;
    }
    if (!file) {
      setErrorMessage('Choose your electronics list file.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const request = await submitUploadedListRequest(customerName, phone, file);
      showToast('List Submitted', `Request ${request.id} was submitted. Our team will contact you on ${phone}.`, 'success');
      navigate('/');
    } catch (error) {
      console.error('[UploadedList] Could not submit customer list:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Your list could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (displayMode === 'modal' && !isOpen) return null;

  const isPage = displayMode === 'page';

  return (
    <AnimatePresence>
      <div className={isPage ? 'mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12' : 'fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm'}>
        <motion.section
          {...(!isPage ? { role: 'dialog', 'aria-modal': true } : {})}
          aria-labelledby="upload-list-title"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          className={`${isPage ? 'w-full' : 'my-auto w-full max-w-lg'} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl`}
        >
          <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#561269] to-[#380847] px-5 py-5 text-white sm:px-6">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-200">Customer component list</p>
              <h2 id="upload-list-title" className="mt-1 text-xl font-black">Upload Electronics Component List</h2>
              <p className="mt-1 text-xs text-purple-100">Our team will review your file and contact you with pricing.</p>
            </div>
            {isPage ? null : (
              <button type="button" onClick={handleClose} aria-label="Close upload form" className="rounded-lg p-2 text-purple-100 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4 p-5 sm:p-6">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Your name *</span>
                <span className="relative block"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#561269] focus:ring-2 focus:ring-violet-100" placeholder="Enter your name" /></span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Mobile number *</span>
                <span className="relative block"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#561269] focus:ring-2 focus:ring-violet-100" placeholder="+91 mobile number" /></span>
              </label>

              <div>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Electronics list file *</span>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf,.xls,.xlsx,.csv,.tsv,.txt,.doc,.docx,.odt,.ods" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-28 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-4 text-center hover:border-violet-400">
                  {file ? (
                    <>
                      <FileText className="mb-2 h-6 w-6 text-[#561269]" />
                      <span className="max-w-full truncate text-sm font-bold text-slate-800">{file.name}</span>
                      <span className="mt-1 text-[11px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB · Tap to change</span>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-2 h-6 w-6 text-[#561269]" />
                      <span className="text-sm font-bold text-slate-800">Tap to choose your list</span>
                      <span className="mt-1 text-[11px] text-slate-500">Images, Excel, PDF, Word, CSV, or text · Up to 15 MB</span>
                    </>
                  )}
                </button>
              </div>

              {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">{errorMessage}</p>}

              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#FF6B00] px-5 py-3.5 text-sm font-extrabold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? 'Uploading your list…' : 'Place Order'}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-slate-500">This sends your list to our team for review. We’ll add the price and create your order after contacting you.</p>
          </form>
        </motion.section>
      </div>
    </AnimatePresence>
  );
};
