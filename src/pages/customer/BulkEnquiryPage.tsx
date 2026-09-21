import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Send, 
  Layers, 
  AlertCircle, 
  Zap,
  HelpCircle,
  Download,
  Boxes,
  FileSpreadsheet,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BulkEnquiryComponentItem, BulkEnquirySubmission, CustomProjectSubmission } from '../../types';
import { CsvImportModal } from '../../components/bulk-enquiry/CsvImportModal';
import { EnquirySummaryReceipt } from '../../components/bulk-enquiry/EnquirySummaryReceipt';
import { CustomProjectForm } from '../../components/bulk-enquiry/CustomProjectForm';
import { CustomProjectReceipt } from '../../components/bulk-enquiry/CustomProjectReceipt';

const CATEGORY_OPTIONS = [
  'Electronic Components',
  'Electronic Modules and Development Boards',
  'Batteries and Power Supply',
  'SMD Sample Books and Kits',
  'Cables and Connectors',
  'Hardware and Tools',
  'Displays',
  'Robotics and DIY Kits',
  'Motors',
  'Sensors',
  'Physics Instruments',
  'SMD Components',
  'Other Electronic Component'
];

const POPULAR_SUGGESTIONS = [
  'ESP32-WROOM-32D',
  'Raspberry Pi 5 8GB',
  'Arduino Uno R4 WiFi',
  'AMS1117-3.3V SOT-223',
  'STM32F401CCU6 BlackPill',
  '10k Ohm 0805 SMD Resistor',
  '0.1uF 50V 0805 Capacitor',
  'MPU-6050 Accelerometer',
  'L298N Motor Driver Module',
  'OLED 0.96 inch I2C Display'
];

export const BulkEnquiryPage: React.FC = () => {
  const { submitBulkEnquiry, showToast, products } = useApp();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Form State: Customer & Company Details
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState(user?.department || '');
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('');
  const [deliveryUrgency, setDeliveryUrgency] = useState<'standard' | 'urgent' | 'scheduled'>('standard');
  const [projectNotes, setProjectNotes] = useState('');

  // Form State: Component Item Rows
  const [items, setItems] = useState<BulkEnquiryComponentItem[]>([
    {
      id: 'row-1',
      partNumber: 'ESP32-WROOM-32D',
      category: 'Microcontroller & SoC',
      quantity: 250,
      targetPrice: '₹240',
      notes: ''
    },
    {
      id: 'row-2',
      partNumber: 'AMS1117-3.3V SOT-223',
      category: 'Power & Voltage Regulators',
      quantity: 1000,
      targetPrice: '₹4.50',
      notes: ''
    }
  ]);

  // Modal & Flow State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<BulkEnquirySubmission | null>(null);
  const [deskMode, setDeskMode] = useState<'bom' | 'custom_project'>(() =>
    searchParams.get('mode') === 'custom-project' ? 'custom_project' : 'bom'
  );
  const [submittedProject, setSubmittedProject] = useState<CustomProjectSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleResetProject = () => {
    setSubmittedProject(null);
  };

  // Helper for adding row
  const handleAddRow = () => {
    const newId = 'row-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        partNumber: '',
        category: 'Microcontroller & SoC',
        quantity: 100,
        targetPrice: '',
        notes: ''
      }
    ]);
  };

  // Helper for updating row field
  const handleUpdateRow = (id: string, field: keyof BulkEnquiryComponentItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
    // Clear errors if any
    if (errors['items']) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy['items'];
        return copy;
      });
    }
  };

  // Helper for removing row
  const handleRemoveRow = (id: string) => {
    if (items.length <= 1) {
      // Don't leave with 0 rows, just reset the single row
      setItems([{
        id: 'row-' + Date.now(),
        partNumber: '',
        category: 'Microcontroller & SoC',
        quantity: 100,
        targetPrice: '',
        notes: ''
      }]);
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Helper for CSV Import
  const handleCsvImport = (importedItems: Omit<BulkEnquiryComponentItem, 'id'>[]) => {
    const newRows: BulkEnquiryComponentItem[] = importedItems.map((item, idx) => ({
      ...item,
      id: 'row-imported-' + Date.now() + '-' + idx
    }));

    // Filter out completely empty initial rows if only 1 blank row existed
    const isFirstRowEmpty = items.length === 1 && !items[0].partNumber.trim();
    if (isFirstRowEmpty) {
      setItems(newRows);
    } else {
      setItems((prev) => [...prev, ...newRows]);
    }
    showToast('BOM List Imported', `${importedItems.length} component line items appended.`, 'success');
  };

  // Quick preset loader
  const handleLoadIoTTemplate = () => {
    setItems([
      { id: 'row-t1', partNumber: 'ESP32-WROOM-32D', category: 'Microcontroller & SoC', quantity: 500, targetPrice: '₹240', notes: 'Reel packaging preferred' },
      { id: 'row-t2', partNumber: 'AMS1117-3.3V SOT-223', category: 'Power & Voltage Regulators', quantity: 1000, targetPrice: '₹4.50', notes: 'Tape & Reel' },
      { id: 'row-t3', partNumber: '10k Ohm 0805 SMD Resistor', category: 'SMD Resistors & Capacitors', quantity: 5000, targetPrice: '₹0.40', notes: '5000pcs Reel' },
      { id: 'row-t4', partNumber: '0.1uF 50V Ceramic Cap 0805', category: 'SMD Resistors & Capacitors', quantity: 5000, targetPrice: '₹0.55', notes: '5000pcs Reel' },
      { id: 'row-t5', partNumber: 'DHT22 Temperature & Humidity Sensor', category: 'Sensors & Transducers', quantity: 200, targetPrice: '₹185', notes: 'Original AOSONG' }
    ]);
    showToast('Template Loaded', 'IoT Batch Production BOM loaded into table.', 'info');
  };

  // Summary Metrics
  const totalDistinctItems = items.filter(i => i.partNumber.trim().length > 0).length;
  const totalQuantity = items.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  // Form Validation & Submission
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!email.trim()) {
      newErrors.email = 'Work Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) newErrors.phone = 'Mobile / WhatsApp Number is required';
    if (!companyName.trim()) newErrors.companyName = 'Company / Institution / Lab name is required';

    const validItems = items.filter(i => i.partNumber.trim().length > 0 && i.quantity > 0);
    if (validItems.length === 0) {
      newErrors.items = 'Please add at least one electronic component with a part number and quantity >= 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Validation Incomplete', 'Please check the highlighted fields and component rows.', 'error');
      return;
    }

    setIsSubmitting(true);

    const validItems = items.filter(i => i.partNumber.trim().length > 0 && i.quantity > 0);

    setTimeout(() => {
      const enquiryResult = submitBulkEnquiry({
        fullName,
        email,
        phone,
        companyName,
        targetDeliveryDate: targetDeliveryDate || (deliveryUrgency === 'urgent' ? 'Immediate Urgent Dispatch (< 48 hrs)' : 'Standard Business Fulfillment'),
        projectNotes,
        items: validItems,
        totalDistinctItems: validItems.length,
        totalQuantity: validItems.reduce((acc, i) => acc + i.quantity, 0),
      });

      setIsSubmitting(false);
      setSubmittedEnquiry(enquiryResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleResetForm = () => {
    setSubmittedEnquiry(null);
    setItems([
      {
        id: 'row-1',
        partNumber: '',
        category: 'Microcontroller & SoC',
        quantity: 100,
        targetPrice: '',
        notes: ''
      }
    ]);
    setProjectNotes('');
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast('Enquiry ID Copied', `Ticket ${id} copied to clipboard`, 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Mode Selector Tabs: Option A: Bulk Component Procurement, Option B: Custom Project Development */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-2 sm:p-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeskMode('bom')}
              className={`flex items-center gap-3.5 p-4 rounded-2xl transition-all cursor-pointer text-left ${
                deskMode === 'bom'
                  ? 'bg-gradient-to-r from-[#561269] to-[#380847] text-white shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                deskMode === 'bom' ? 'bg-white/15 text-white' : 'bg-white text-[#561269] shadow-2xs border border-slate-200'
              }`}>
                <Boxes className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base leading-tight">
                    Option A: Bulk Component Procurement
                  </span>
                  {deskMode === 'bom' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00] text-white shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 truncate ${deskMode === 'bom' ? 'text-purple-200' : 'text-slate-500'}`}>
                  Multi-item BOM list, factory cut-tape/reels, volume tiered pricing
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeskMode('custom_project')}
              className={`flex items-center gap-3.5 p-4 rounded-2xl transition-all cursor-pointer text-left ${
                deskMode === 'custom_project'
                  ? 'bg-gradient-to-r from-[#561269] to-[#380847] text-white shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                deskMode === 'custom_project' ? 'bg-white/15 text-white' : 'bg-white text-[#561269] shadow-2xs border border-slate-200'
              }`}>
                <Cpu className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base leading-tight">
                    Option B: Custom Project Development
                  </span>
                  {deskMode === 'custom_project' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00] text-white shrink-0">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#561269] shrink-0">
                      New Flow
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 truncate ${deskMode === 'custom_project' ? 'text-purple-200' : 'text-slate-500'}`}>
                  Turnkey IoT hardware, PCB layout, firmware development & direct admin routing
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Flow Rendering Based on deskMode */}
        {deskMode === 'custom_project' ? (
          submittedProject ? (
            <CustomProjectReceipt
              project={submittedProject}
              onReset={handleResetProject}
              onCopyId={handleCopyId}
              onSwitchToBOM={() => setDeskMode('bom')}
            />
          ) : (
            <div className="space-y-8">
              {/* Custom Project Hero Banner */}
              <div className="bg-gradient-to-br from-[#561269] via-[#380847] to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-[#561269]/30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Direct Admin Routing & Turnkey Engineering</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    Custom Project <span className="text-[#FF6B00]">Development</span> Desk
                  </h1>

                  <p className="text-sm sm:text-base text-purple-200 leading-relaxed max-w-2xl">
                    Need turnkey embedded hardware, multilayer PCB layouts, or bare-metal firmware? Submit your project blueprint below. Inquiries are transmitted directly to our Chief Engineering Desk for confidential evaluation, DFM analysis, and rapid quotation.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">NDA Protected</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                      <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">Silicon to Code</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">&lt; 8hr Turnaround</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                      <Layers className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">Turnkey SMT & Fab</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Project Form */}
              <CustomProjectForm onSuccess={(project) => setSubmittedProject(project)} />
            </div>
          )
        ) : (
          /* Option A: Bulk Component Procurement */
          submittedEnquiry ? (
            <EnquirySummaryReceipt
              enquiry={submittedEnquiry}
              onReset={handleResetForm}
              onCopyId={handleCopyId}
            />
          ) : (
            <>
              {/* Top Hero Banner */}
            <div className="bg-gradient-to-br from-[#561269] via-[#380847] to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-[#561269]/30/60">
              {/* Background ambient accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Enterprise B2B Hardware Procurement</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Multi-Component <span className="text-[#FF6B00]">Bulk Enquiry</span> Desk
                </h1>

                <p className="text-sm sm:text-base text-purple-200 leading-relaxed max-w-2xl">
                  Procure electronic components, microcontrollers, passives, and silicon reels in volume. Submit your multi-item BOM list below for custom tiered volume pricing, factory traceability, and dedicated commercial quotes.
                </p>

                {/* Key Guarantee Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">100% Genuine</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                    <Boxes className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">Reel & Cut-Tape</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">&lt; 4hr Quote SLA</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                    <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">GST Invoice Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION A: Customer & Company Information Form */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                      <Building2 className="w-5 h-5 text-[#561269]" />
                      <span>1. Customer & Organization Details</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Provide contact details so our enterprise sourcing manager can dispatch the official quotation.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-[#561269]/5 text-[#561269] rounded-lg self-start sm:self-center border border-[#561269]/15">
                    Required for Commercial GST Quotation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Full Name <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                        errors.fullName ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
                      }`}
                    />
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Work Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Work / Business Email <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aryan@company.com or lab@univ.edu"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                        errors.email ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  {/* Mobile / WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mobile / WhatsApp Number <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                        errors.phone ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Company / Institution Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Company / Institution / Lab <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. NexGen Robotics Ltd / IIT Lab"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                        errors.companyName ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
                      }`}
                    />
                    {errors.companyName && <p className="text-[11px] text-red-600 mt-1">{errors.companyName}</p>}
                  </div>

                  {/* Target Delivery Date & Timeline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target Delivery Timeline</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={targetDeliveryDate}
                        onChange={(e) => setTargetDeliveryDate(e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20 focus:outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  {/* Quick Timeline Selector Shortcuts */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Urgency SLA
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => { setDeliveryUrgency('urgent'); setTargetDeliveryDate(''); }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          deliveryUrgency === 'urgent'
                            ? 'bg-amber-50 border-[#FF6B00] text-[#FF6B00]'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Urgent (&lt; 48h)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDeliveryUrgency('standard'); setTargetDeliveryDate(''); }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          deliveryUrgency === 'standard'
                            ? 'bg-[#561269]/5 border-[#561269] text-[#561269]'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Standard (3-5d)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDeliveryUrgency('scheduled'); }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          deliveryUrgency === 'scheduled'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Batch Run
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Project Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Additional Project Notes / Packaging / Reel Specifications (Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Specify special requirements e.g. 'RoHS Certificate needed', 'Reel packaging only', 'Alternate equivalent IC allowed if out of stock'..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* SECTION B: Dynamic Multi-Component Item List (Table / Row Builder) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                      <Layers className="w-5 h-5 text-[#FF6B00]" />
                      <span>2. Electronic Components Bill of Materials (BOM)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add individual parts or import multiple components in bulk via CSV / Excel.
                    </p>
                  </div>

                  {/* Toolbar actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCsvModalOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#561269]/5 hover:bg-[#561269]/10 text-[#561269] rounded-xl text-xs font-bold border border-[#561269]/20 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#561269]" />
                      <span>Import CSV / Excel</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLoadIoTTemplate}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-[#d95d00] rounded-xl text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Load Sample IoT BOM</span>
                    </button>
                  </div>
                </div>

                {errors.items && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.items}</span>
                  </div>
                )}

                {/* Dynamic Table / Row Builder */}
                <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                  <table className="w-full text-left border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                        <th className="py-3 px-3 w-10 text-center text-slate-400">#</th>
                        <th className="py-3 px-3 w-5/12">Component Name / Part Number <span className="text-red-500">*</span></th>
                        <th className="py-3 px-3 w-3/12">Category / Specification</th>
                        <th className="py-3 px-3 w-2/12 text-center">Required Qty <span className="text-red-500">*</span></th>
                        <th className="py-3 px-3 w-2/12">Target Price / Budget</th>
                        <th className="py-3 px-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {items.map((row, index) => (
                        <tr key={row.id} className="hover:bg-slate-50/60 transition-colors group">
                          {/* Row Index */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                            {index + 1}
                          </td>

                          {/* Part Number / Name */}
                          <td className="py-2.5 px-3">
                            <div className="relative">
                              <input
                                type="text"
                                value={row.partNumber}
                                onChange={(e) => handleUpdateRow(row.id, 'partNumber', e.target.value)}
                                placeholder="e.g. ESP32-WROOM-32D or 10k 0805"
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#561269] focus:ring-1 focus:ring-[#561269] font-semibold text-slate-900 text-xs outline-hidden bg-white"
                              />
                            </div>
                          </td>

                          {/* Category / Spec */}
                          <td className="py-2.5 px-3">
                            <select
                              value={row.category}
                              onChange={(e) => handleUpdateRow(row.id, 'category', e.target.value)}
                              className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:border-[#561269] focus:ring-1 focus:ring-[#561269] text-slate-700 text-xs outline-hidden bg-white cursor-pointer"
                            >
                              {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Required Quantity */}
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={(e) => handleUpdateRow(row.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#561269] focus:ring-1 focus:ring-[#561269] font-mono font-bold text-center text-[#561269] text-xs outline-hidden bg-white"
                            />
                          </td>

                          {/* Target Price / Budget */}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={row.targetPrice || ''}
                              onChange={(e) => handleUpdateRow(row.id, 'targetPrice', e.target.value)}
                              placeholder="e.g. ₹240 / Best Quote"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#561269] focus:ring-1 focus:ring-[#561269] text-slate-800 text-xs outline-hidden bg-white"
                            />
                          </td>

                          {/* Action (Remove Button) */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove component row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Row Button & Quick Suggestions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-[#561269]/5 hover:text-[#561269] border border-slate-300 hover:border-[#561269]/30 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                  >
                    <Plus className="w-4 h-4 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                    <span>+ Add Another Component Row</span>
                  </button>

                  {/* Popular Quick-Add Badges */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Add:</span>
                    {POPULAR_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          const newId = 'row-' + Date.now() + Math.random().toString(36).substring(2, 5);
                          setItems((prev) => [
                            ...prev,
                            {
                              id: newId,
                              partNumber: suggestion,
                              category: suggestion.includes('ESP') || suggestion.includes('Raspberry') ? 'Microcontroller & SoC' : 'Sensors & Transducers',
                              quantity: 100,
                              targetPrice: '',
                              notes: ''
                            }
                          ]);
                        }}
                        className="text-[10px] font-semibold bg-slate-100 hover:bg-orange-50 hover:text-[#FF6B00] text-slate-600 px-2 py-1 rounded-md transition-colors shrink-0 cursor-pointer"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Counter Bar */}
                <div className="bg-gradient-to-r from-slate-900 to-[#380847] text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-purple-300 font-semibold">Total Line Items</p>
                      <p className="text-xl font-extrabold font-mono text-white mt-0.5">
                        {items.length} {items.length === 1 ? 'Part' : 'Parts'}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-white/15"></div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-orange-300 font-semibold">Total Unit Quantity</p>
                      <p className="text-xl font-extrabold font-mono text-[#FF6B00] mt-0.5">
                        {totalQuantity.toLocaleString()} Units
                      </p>
                    </div>

                    <div className="h-8 w-px bg-white/15 hidden sm:block"></div>

                    <div className="hidden sm:block">
                      <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">Quotation SLA</p>
                      <p className="text-sm font-bold text-white mt-0.5">Under 4 Hours</p>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#FF6B00] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing BOM Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Bulk Enquiry for Quotation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </>
          )
        )}

        {/* CSV Import Modal */}
        <CsvImportModal
          isOpen={isCsvModalOpen}
          onClose={() => setIsCsvModalOpen(false)}
          onImport={handleCsvImport}
        />
      </div>
    </div>
  );
};
