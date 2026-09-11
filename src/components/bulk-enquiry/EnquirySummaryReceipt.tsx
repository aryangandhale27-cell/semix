import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  Copy, 
  ArrowLeft, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Clock, 
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BulkEnquirySubmission } from '../../types';
import { Link } from 'react-router-dom';
import { SemixLabsLogo } from '../common/SemixLabsLogo';

interface EnquirySummaryReceiptProps {
  enquiry: BulkEnquirySubmission;
  onReset: () => void;
  onCopyId: (id: string) => void;
}

export const EnquirySummaryReceipt: React.FC<EnquirySummaryReceiptProps> = ({
  enquiry,
  onReset,
  onCopyId
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Top Success Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-[#561269] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-emerald-300 border border-white/30 shrink-0 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Bulk Request Queued</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enquiry Submitted Successfully!
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              Our enterprise hardware sourcing desk is generating your discounted volume quotation. Expected turnaround: <strong className="text-white">within 2 to 4 business hours</strong>.
            </p>
          </div>
        </div>

        {/* Reference ID Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center shrink-0 w-full sm:w-auto">
          <p className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">Enquiry Reference ID</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider">
              {enquiry.id}
            </span>
            <button
              onClick={() => onCopyId(enquiry.id)}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Copy Reference ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Submit Another Enquiry</span>
          </button>
          <Link
            to="/shop"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>Back to Shop</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrintOrDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#561269] hover:bg-[#460e56] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={handlePrintOrDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Enquiry PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt / Summary Card */}
      <div
        ref={printableRef}
        id="enquiry-print-receipt"
        className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <SemixLabsLogo variant="dark" size="md" />
            <span className="hidden sm:inline-block h-6 w-px bg-slate-200 ml-1"></span>
            <p className="hidden sm:block text-xs text-slate-500 font-medium">B2B Volume Hardware & Electronics Procurement</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 rounded-md bg-[#561269]/5 border border-[#561269]/20 text-[#561269] font-mono text-xs font-bold">
              OFFICIAL QUOTATION ENQUIRY
            </span>
            <p className="text-xs text-slate-500 mt-1">Generated: {enquiry.createdAt}</p>
            <p className="text-sm font-mono font-extrabold text-slate-900 mt-0.5">{enquiry.id}</p>
          </div>
        </div>

        {/* Customer & Company Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#561269]" />
              <span>Customer & Company Info</span>
            </h3>
            <div className="space-y-1 text-xs">
              <p className="text-slate-900 font-bold text-sm">{enquiry.companyName}</p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-800">Attn: {enquiry.fullName}</span>
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{enquiry.email}</span>
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{enquiry.phone}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Logistics & Project Notes</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Target Delivery Date:</span>
                <span className="font-bold text-slate-800">
                  {enquiry.targetDeliveryDate || 'Standard Urgent Dispatch (3-5 Days)'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Enquiry Status:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">
                  Under Commercial Review
                </span>
              </div>
              {enquiry.projectNotes && (
                <div className="pt-1">
                  <span className="text-slate-500 block mb-0.5">Project Notes:</span>
                  <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200 text-[11px] leading-relaxed">
                    {enquiry.projectNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Component Breakdown Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#561269]" />
              <span>Requested Component Bill of Materials ({enquiry.items.length} Line Items)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Total Volume: <strong className="text-[#561269]">{enquiry.totalQuantity.toLocaleString()} Units</strong>
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Component Name / Part Number</th>
                  <th className="py-3 px-4">Category / Spec</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Target Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {enquiry.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.partNumber}
                      {item.notes && <span className="block text-[11px] font-normal text-slate-500">{item.notes}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {item.category || 'General Electronics'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-mono text-[#561269]">
                      {item.quantity.toLocaleString()} pcs
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {item.targetPrice ? item.targetPrice : <span className="text-slate-400 italic">Best Market Quote</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                  <td colSpan={3} className="py-3 px-4 text-right">
                    Total Procurement Items:
                  </td>
                  <td className="py-3 px-4 text-center text-[#561269] font-mono font-black text-sm">
                    {enquiry.totalQuantity.toLocaleString()} pcs
                  </td>
                  <td className="py-3 px-4 text-right text-[11px] text-slate-500">
                    Tier: Bulk Enterprise
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* SLA & Terms Footer */}
        <div className="border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">100% Genuine Silicon</p>
              <p className="text-[11px]">Direct factory sourcing with traceability certificate & reel tape packaging.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Rapid Turnaround SLA</p>
              <p className="text-[11px]">Quotation with GST invoice breakdown delivered via Email & WhatsApp.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-[#561269] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">B2B Helpdesk</p>
              <p className="text-[11px]">Support hotline: +91 7666601086 / office@semixlabs.com</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
