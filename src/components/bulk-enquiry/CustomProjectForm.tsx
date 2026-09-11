import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Upload, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Send, 
  Cpu, 
  Layers, 
  AlertCircle, 
  DollarSign, 
  Boxes, 
  FileUp, 
  Paperclip,
  Wrench,
  HelpCircle,
  Hash
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CustomProjectCategory, 
  CustomProjectQuantity, 
  CustomProjectBudget, 
  CustomProjectTimeline,
  AttachedFile,
  CustomProjectSubmission 
} from '../../types';

interface CustomProjectFormProps {
  onSuccess: (project: CustomProjectSubmission) => void;
}

const CATEGORY_OPTIONS: { label: string; value: CustomProjectCategory; desc: string }[] = [
  { 
    label: 'Embedded Systems & IoT', 
    value: 'Embedded Systems & IoT', 
    desc: 'Smart sensors, wireless telemetry, MCU boards, battery-powered edge hardware' 
  },
  { 
    label: 'PCB Design & Prototyping', 
    value: 'PCB Design & Prototyping', 
    desc: 'Multilayer HDI routing, high-current power boards, RF impedance matching' 
  },
  { 
    label: 'Firmware & Software Development', 
    value: 'Firmware & Software Development', 
    desc: 'RTOS, bare-metal C/C++, device drivers, BLE/Wi-Fi/LoRa stacks, Linux BSP' 
  },
  { 
    label: 'Turnkey Manufacturing', 
    value: 'Turnkey Manufacturing', 
    desc: 'Component procurement, SMT assembly, testing jigs, custom enclosure molding' 
  },
  { 
    label: 'Robotics & Automation', 
    value: 'Robotics & Automation', 
    desc: 'Motor control, autonomous navigation, AGVs, machine vision carriers' 
  },
  { 
    label: 'Other Custom Engineering', 
    value: 'Other', 
    desc: 'Reverse engineering, lab instrumentation, custom test fixtures' 
  }
];

const QUANTITY_OPTIONS: CustomProjectQuantity[] = [
  'Prototype (1-5 units)',
  'Pilot Run (10-50 units)',
  'Batch Production (50-200 units)',
  'Mass Production (500+ units)',
  'Custom Volume'
];

const BUDGET_OPTIONS: CustomProjectBudget[] = [
  '< ₹50,000',
  '₹50,000 – ₹2,00,000',
  '₹2,00,000 – ₹10,00,000',
  '> ₹10,00,000',
  'Custom / Open for Discussion'
];

const TIMELINE_OPTIONS: CustomProjectTimeline[] = [
  'Urgent (< 2 weeks)',
  'Standard (3-4 weeks)',
  'Extended (2-3 months)',
  'Flexible / Roadmap planning'
];

const SUGGESTED_COMPONENTS = [
  'ESP32-S3',
  'STM32F4/G4',
  'Raspberry Pi CM4',
  'nRF52840 BLE',
  'LoRa SX1262',
  'CAN-FD Transceiver',
  'DRV8305 FOC Driver',
  'INA240 Current Shunt'
];

export const CustomProjectForm: React.FC<CustomProjectFormProps> = ({ onSuccess }) => {
  const { submitCustomProject, showToast } = useApp();
  const { user } = useAuth();

  // 1. Project Overview State
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState<CustomProjectCategory>('Embedded Systems & IoT');
  const [quantity, setQuantity] = useState<CustomProjectQuantity>('Pilot Run (10-50 units)');
  const [customQuantity, setCustomQuantity] = useState('');
  const [timeline, setTimeline] = useState<CustomProjectTimeline>('Standard (3-4 weeks)');
  const [budgetRange, setBudgetRange] = useState<CustomProjectBudget>('₹50,000 – ₹2,00,000');
  const [customBudget, setCustomBudget] = useState('');

  // 2. Technical Specifications State
  const [description, setDescription] = useState('');
  const [preferredComponents, setPreferredComponents] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Client & Organization Details State (Pre-filled if logged in)
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState(user?.department || '');
  const [gstin, setGstin] = useState('');

  // Submission & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // File Upload Handlers
  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const allowedExtensions = ['pdf', 'zip', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'xlsx', 'csv', 'kicad_sch', 'kicad_pcb', 'step'];
    const newAttached: AttachedFile[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExtensions.includes(ext)) {
        showToast('Unsupported File Type', `${file.name} is not an allowed format (PDF, ZIP, DOCX, PNG, etc.)`, 'warning');
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        showToast('File Too Large', `${file.name} exceeds maximum size limit of 25MB.`, 'error');
        return;
      }

      newAttached.push({
        id: 'file-' + Date.now() + Math.random().toString(36).substring(2, 6),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString().split('T')[0]
      });
    });

    if (newAttached.length > 0) {
      setAttachedFiles((prev) => [...prev, ...newAttached]);
      showToast('File(s) Attached', `${newAttached.length} document(s) added to project submission`, 'success');
    }
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Preset Template Loader for Fast Testing
  const handleLoadIoTPreset = () => {
    setProjectName('Edge AI Predictive Vibration & Thermal Telemetry Node');
    setCategory('Embedded Systems & IoT');
    setQuantity('Pilot Run (10-50 units)');
    setTimeline('Standard (3-4 weeks)');
    setBudgetRange('₹50,000 – ₹2,00,000');
    setDescription('Design and prototype a battery-operated industrial IoT condition monitoring device. Requirements:\n1. 3-axis high-bandwidth accelerometer (ISM330DHCX) sampled at 6.6kHz for FFT frequency analysis.\n2. Ultra-low-power wireless mesh (BLE 5.2 or LoRaWAN 865MHz) uploading telemetry hourly or on spike detection.\n3. Primary lithium thionyl chloride (Li-SOCl2) cell with expected 3-year runtime.\n4. Custom IP68 machined aluminum or injection-molded enclosure with magnetic mount.');
    setPreferredComponents('STM32U575 / nRF5340, ISM330DHCX, SX1262 LoRa, TPS62840 nano-quiescent buck converter');
    setAttachedFiles([
      {
        id: 'file-demo-1',
        name: 'Vibration_Node_Architecture_v1.pdf',
        size: 1850000,
        type: 'application/pdf',
        uploadedAt: '2026-09-01'
      }
    ]);
    if (!clientName) setClientName('Kavita Deshmukh');
    if (!clientEmail) setClientEmail('kavita.d@pinnacle-automation.in');
    if (!clientPhone) setClientPhone('+91 98230 11984');
    if (!companyName) setCompanyName('Pinnacle Precision Automation');
    showToast('IoT Template Loaded', 'Pre-filled sample engineering specification', 'info');
  };

  const handleLoadPCBPreset = () => {
    setProjectName('6-Layer Rigid-Flex CAN-FD Gateway with Isolated Power');
    setCategory('PCB Design & Prototyping');
    setQuantity('Prototype (1-5 units)');
    setTimeline('Urgent (< 2 weeks)');
    setBudgetRange('₹50,000 – ₹2,00,000');
    setDescription('Need schematic capture review and 6-layer HDI rigid-flex layout for space-constrained automotive diagnostic tool. Key specs:\n1. Controlled impedance 100-ohm diff pairs for USB 2.0 High-Speed and 120-ohm CAN-FD.\n2. Galvanic 2.5kV isolation between vehicle 12V/24V bus and sensitive MCU side.\n3. Turnkey fabrication of 5 assembled boards with flying probe testing and conformal coating.');
    setPreferredComponents('NXP S32K144, TJA1051T isolated CAN, TI ISO7741, Microchip MCP25625');
    setAttachedFiles([
      {
        id: 'file-demo-2',
        name: 'Automotive_CAN_Gateway_Spec.docx',
        size: 920000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadedAt: '2026-09-01'
      }
    ]);
    if (!clientName) setClientName('Rohan Mehra');
    if (!clientEmail) setClientEmail('rohan.m@ev-dynamics.org');
    if (!clientPhone) setClientPhone('+91 97654 32190');
    if (!companyName) setCompanyName('EV Dynamics Tech Labs');
    showToast('PCB Template Loaded', 'Pre-filled automotive PCB engineering specification', 'info');
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!projectName.trim()) newErrors.projectName = 'Project Name / Title is required';
    if (!description.trim()) {
      newErrors.description = 'Please provide detailed specifications & scope of work (min 20 characters)';
    } else if (description.trim().length < 20) {
      newErrors.description = 'Description is too brief. Please describe requirements in detail.';
    }

    if (!clientName.trim()) newErrors.clientName = 'Full Name is required';
    if (!clientEmail.trim()) {
      newErrors.clientEmail = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }
    if (!clientPhone.trim()) newErrors.clientPhone = 'Mobile / WhatsApp number is required';
    if (!companyName.trim()) newErrors.companyName = 'Company / College / Laboratory name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Validation Incomplete', 'Please check the highlighted fields before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalQuantity = quantity === 'Custom Volume' && customQuantity.trim() ? customQuantity.trim() : quantity;
      const finalBudget = budgetRange === 'Custom / Open for Discussion' && customBudget.trim() ? customBudget.trim() : budgetRange;

      const submission = await submitCustomProject({
        projectName,
        category,
        quantity: finalQuantity,
        timeline,
        budgetRange: finalBudget,
        description,
        preferredComponents: preferredComponents || undefined,
        attachedFiles,
        clientName,
        clientEmail,
        clientPhone,
        companyName,
        gstin: gstin || undefined
      });

      setIsSubmitting(false);
      onSuccess(submission);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setIsSubmitting(false);
      showToast('Submission Failed', err?.message || 'Could not submit project inquiry', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Fast Preset Templates Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50/80 border border-purple-200/70">
        <div className="flex items-center gap-2 text-xs text-[#561269] font-bold">
          <Sparkles className="w-4 h-4 text-[#FF6B00]" />
          <span>Quick Specification Starters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadIoTPreset}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-[#561269] border border-purple-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            ⚡ Load IoT Telemetry Demo
          </button>
          <button
            type="button"
            onClick={handleLoadPCBPreset}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-[#561269] border border-purple-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            ⚡ Load Rigid-Flex PCB Demo
          </button>
        </div>
      </div>

      {/* SECTION 1: Project Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-[#561269]" />
              <span>1. Project Overview & Commercial Target</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your project category, production scope, deadline, and target budget range.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-[#561269] rounded-lg self-start sm:self-center border border-purple-200">
            Dedicated Engineering Lead Assigned
          </span>
        </div>

        <div className="space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <span>Project Title / Working Codename <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (errors.projectName) setErrors((prev) => ({ ...prev, projectName: '' }));
              }}
              placeholder="e.g. Multi-Gas Sensing Edge Node with LoRa & BLE"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                errors.projectName ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
              }`}
            />
            {errors.projectName && <p className="text-[11px] text-red-600 mt-1">{errors.projectName}</p>}
          </div>

          {/* Project Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Project Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#561269] bg-purple-50/60 ring-2 ring-[#561269]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#561269]' : 'text-slate-800'}`}>
                        {cat.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#561269] shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity, Timeline, and Budget Range Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            {/* Target Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Units / Quantity</span>
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value as CustomProjectQuantity)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20"
              >
                {QUANTITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {quantity === 'Custom Volume' && (
                <input
                  type="text"
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(e.target.value)}
                  placeholder="Specify target units (e.g. 2,500 pcs)"
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#561269]"
                />
              )}
            </div>

            {/* Expected Timeline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Expected Timeline / Urgency</span>
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value as CustomProjectTimeline)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20"
              >
                {TIMELINE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Target Budget Range */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Budget Range</span>
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value as CustomProjectBudget)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20 font-mono"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {budgetRange === 'Custom / Open for Discussion' && (
                <input
                  type="text"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="e.g. ₹1.5L – ₹3L approx"
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#561269]"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Technical Specifications & File Upload */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-[#561269]" />
            <span>2. Technical Specifications & File Upload</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe the functional requirements, preferred controllers, and attach block diagrams, schematics, or BOM documents.
          </p>
        </div>

        <div className="space-y-5">
          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Detailed Description & Scope of Work <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-slate-400 font-normal">Markdown / bullet points welcome</span>
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Outline project functions, operating voltages, environmental conditions (e.g. IP rating, temperature range), interface protocols (I2C, SPI, CAN, Ethernet), and specific deliverables required..."
              className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-sans transition-all focus:outline-hidden ${
                errors.description ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
              }`}
            />
            {errors.description && <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Preferred Components & Silicon */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Components / Microcontrollers (Optional)
            </label>
            <input
              type="text"
              value={preferredComponents}
              onChange={(e) => setPreferredComponents(e.target.value)}
              placeholder="e.g. ESP32-S3, STM32F401, nRF52840, Sensirion SCD41, DRV8305"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20"
            />
            
            {/* Quick Component Tag Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Quick suggestions:</span>
              {SUGGESTED_COMPONENTS.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => {
                    if (!preferredComponents.includes(comp)) {
                      setPreferredComponents(prev => prev ? `${prev}, ${comp}` : comp);
                    }
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-100 hover:text-[#561269] text-slate-600 transition-colors cursor-pointer"
                >
                  +{comp}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                <span>Attach Files (Schematics, Block Diagram, BOM, Requirements PDF/ZIP/DOCX)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Max 25MB each</span>
            </label>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#561269] bg-purple-50/50 scale-[1.01]'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.zip,.docx,.doc,.png,.jpg,.jpeg,.xlsx,.csv,.step"
                onChange={(e) => handleFilesAdded(e.target.files)}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-[#561269]/10 text-[#561269] flex items-center justify-center mx-auto mb-3">
                <FileUp className="w-6 h-6" />
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Drag and drop your engineering files here, or <span className="text-[#561269] underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supported formats: PDF, ZIP (KiCAD/Altium/Eagle archives), DOCX, XLSX BOM, PNG, JPG (up to 25MB)
              </p>
            </div>

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Attached Documents ({attachedFiles.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-[#561269] shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{formatFileSize(file.size)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Client & Organization Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[#561269]" />
              <span>3. Client & Organization Credentials</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide your details so our engineering project managers can schedule an NDA kickoff and dispatch quotes.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg self-start sm:self-center border border-emerald-200">
            Strict NDA Confidentiality
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
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                if (errors.clientName) setErrors((prev) => ({ ...prev, clientName: '' }));
              }}
              placeholder="e.g. Aryan Sharma"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                errors.clientName ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
              }`}
            />
            {errors.clientName && <p className="text-[11px] text-red-600 mt-1">{errors.clientName}</p>}
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Work / Business Email <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => {
                setClientEmail(e.target.value);
                if (errors.clientEmail) setErrors((prev) => ({ ...prev, clientEmail: '' }));
              }}
              placeholder="e.g. aryan@techinnovations.in"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                errors.clientEmail ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
              }`}
            />
            {errors.clientEmail && <p className="text-[11px] text-red-600 mt-1">{errors.clientEmail}</p>}
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone / WhatsApp Number <span className="text-red-500">*</span></span>
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => {
                setClientPhone(e.target.value);
                if (errors.clientPhone) setErrors((prev) => ({ ...prev, clientPhone: '' }));
              }}
              placeholder="e.g. +91 98765 43210"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                errors.clientPhone ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
              }`}
            />
            {errors.clientPhone && <p className="text-[11px] text-red-600 mt-1">{errors.clientPhone}</p>}
          </div>

          {/* Company / College / Lab */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Company / College / Laboratory <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }));
              }}
              placeholder="e.g. IIT Bombay ECE Lab / NexGen IoT Ltd"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                errors.companyName ? 'border-red-400 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-300 focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20'
              }`}
            />
            {errors.companyName && <p className="text-[11px] text-red-600 mt-1">{errors.companyName}</p>}
          </div>

          {/* GSTIN (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>GSTIN Number (Optional)</span>
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27AAAAA0000A1Z5"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-hidden focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20"
            />
          </div>
        </div>
      </div>

      {/* Submission Footer Card */}
      <div className="bg-gradient-to-r from-slate-900 to-[#380847] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-purple-500/20">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#FF6B00]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Admin Routing • Encrypted Specification Docket</span>
          </div>
          <p className="text-xs text-purple-200">
            Submissions are routed straight to our Admin Dashboard with instant email dispatch and audit logging.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Routing to Admin...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Custom Project Request</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
