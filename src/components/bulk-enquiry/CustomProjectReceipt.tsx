import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
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
  Cpu,
  Layers,
  Paperclip,
  Sparkles,
  DollarSign,
  Boxes,
  FileCheck
} from 'lucide-react';
import { CustomProjectSubmission } from '../../types';
import { SemixLabsLogo } from '../common/SemixLabsLogo';

interface CustomProjectReceiptProps {
  project: CustomProjectSubmission;
  onReset: () => void;
  onCopyId: (id: string) => void;
  onSwitchToBOM?: () => void;
}

export const CustomProjectReceipt: React.FC<CustomProjectReceiptProps> = ({
  project,
  onReset,
  onCopyId,
  onSwitchToBOM
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Top Success Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-[#561269] to-[#380847] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 print:hidden border border-purple-500/20">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-orange-300 border border-white/20 shrink-0 shadow-inner">
            <Cpu className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-200 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Project Blueprint Routed to Admin</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Custom Project Request Logged!
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Your engineering specifications have been dispatched to our Chief Technical Officer and Hardware Sourcing Desk. Technical review turnaround: <strong className="text-white">within 4 business hours</strong>.
            </p>
          </div>
        </div>

        {/* Reference ID Pill */}
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto shadow-md">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Submission Reference ID
          </span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="font-mono text-xl sm:text-2xl font-black text-[#FF6B00] tracking-wider">
              {project.id}
            </span>
            <button
              onClick={() => onCopyId(project.id)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Copy ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            ● Status: {project.status}
          </span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Submit Another Project</span>
        </button>

        <div className="flex items-center gap-3">
          {onSwitchToBOM && (
            <button
              onClick={onSwitchToBOM}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-[#561269] hover:bg-purple-100 text-xs font-bold transition-all cursor-pointer"
            >
              <Boxes className="w-4 h-4" />
              <span>Bulk Component Procurement</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Receipt</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div 
        ref={printableRef}
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none"
      >
        {/* Header Branding */}
        <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SemixLabsLogo variant="full" size="md" />
            <div className="border-l border-slate-200 pl-3">
              <span className="text-xs font-black text-[#561269] tracking-wider uppercase block">
                Engineering & Prototyping Bureau
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Project Spec Docket • ISO 9001:2015 Compliant
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Date Logged
            </span>
            <span className="text-xs font-mono font-bold text-slate-800">
              {project.createdAt}
            </span>
          </div>
        </div>

        {/* Project Key Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Category</span>
            <span className="text-xs font-extrabold text-[#561269] block mt-0.5">
              {project.category}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Quantity</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              {project.quantity}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Budget</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">
              {project.budgetRange}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Timeline</span>
            <span className="text-xs font-bold text-amber-700 block mt-0.5">
              {project.timeline}
            </span>
          </div>
        </div>

        {/* Project Overview & Scope */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileCheck className="w-5 h-5 text-[#561269]" />
            <span>Project Scope & Specifications</span>
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Title</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{project.projectName}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scope of Work & Requirements</span>
              <div className="mt-1 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </div>
            </div>

            {project.preferredComponents && (
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Components & Silicon</span>
                <p className="text-xs font-medium text-slate-800 mt-1 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                  {project.preferredComponents}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Attached Files Section */}
        {project.attachedFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-slate-400" />
              <span>Attached Schematics / Documents ({project.attachedFiles.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.attachedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-4 h-4 text-[#561269] shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                      <span className="text-[10px] text-slate-400">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    Uploaded
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client & Organization Details */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Client & Institutional Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Principal Contact</span>
              <span className="font-bold text-slate-800 block mt-0.5">{project.clientName}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Organization / Lab</span>
              <span className="font-bold text-slate-800 block mt-0.5">{project.companyName}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Contact Email</span>
              <span className="font-bold text-slate-800 block mt-0.5">{project.clientEmail}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Phone / WhatsApp</span>
              <span className="font-bold text-slate-800 block mt-0.5">{project.clientPhone}</span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Official inquiry logged with SEMIX LABS Admin Queue. Non-Disclosure Agreement (NDA) guaranteed.</span>
          <span className="font-mono">Document Hash: {project.id}</span>
        </div>
      </div>
    </motion.div>
  );
};
