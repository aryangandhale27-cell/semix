import React, { useState } from 'react';
import { CreateUserPayload, UserRole, AccountStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  UserPlus, 
  Store, 
  Users, 
  User, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Building, 
  FileText, 
  MapPin, 
  Percent, 
  Calendar, 
  Briefcase, 
  Compass, 
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (createdId: string) => void;
  initialRole?: 'team' | 'seller' | 'customer';
}

const DISPATCH_HUBS = [
  'SEMIX LABS Central Hub, Electronic City, Bengaluru',
  'Outer Ring Road Tech Hub, Bellandur, Bengaluru',
  'West Zone Hub, Pune Solapur Road, Pune',
  'South Central Hub, Hitec City, Hyderabad',
  'North-West Hub, SG Highway, Ahmedabad',
  'North Hub, Okhla Industrial Area Phase 3, New Delhi',
  'East Hub, Salt Lake Sector V, Kolkata'
];

const DEPARTMENTS = [
  'Warehouse & Fulfillment',
  'Inventory QA & Inwarding',
  'Component Testing & Certification',
  'Technical Prototyping Support',
  'Custom Fabrication & PCB Desk',
  'Customer Success & Desk Support'
];

const COMMISSION_RATES = [
  { label: '5.0% Standard Tier • Net 14 Settlement', rate: '5.0% Platform Fee', terms: 'Net 14 Bi-weekly' },
  { label: '7.5% Preferred Merchant • Net 7 Weekly Settlement', rate: '7.5% Platform Fee', terms: 'Net 7 Weekly Cycle' },
  { label: '8.0% High-Density Stock Hub • Net 7 Settlement', rate: '8.0% Platform Fee', terms: 'Net 7 Weekly Cycle' },
  { label: '6.5% Enterprise Partner • T+3 Express Settlement', rate: '6.5% Platform Fee', terms: 'T+3 Business Days' }
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
  initialRole = 'seller',
}) => {
  const { createUser, switchUser, registeredUsers } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'team' | 'seller' | 'customer'>(initialRole);

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Semix@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<AccountStatus>('active');

  // Seller Fields
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [warehouseHub, setWarehouseHub] = useState(DISPATCH_HUBS[0]);
  const [selectedCommission, setSelectedCommission] = useState(COMMISSION_RATES[1]);

  // Team Fields
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [designation, setDesignation] = useState('Fulfillment Specialist');
  const [permissionLevel, setPermissionLevel] = useState<string>('Standard Operator');

  // Customer Fields
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560001');

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when opened or role changed
  React.useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const generateRandomPassword = () => {
    const prefixes = ['Semix', 'Makers', 'Silicon', 'Hardware', 'Volt'];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    setPassword(`${randomPrefix}@${randomNum}`);
  };

  const handleCreate = async (e: React.FormEvent, autoSwitch = false) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    // Build payload
    const payload: CreateUserPayload = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim(),
      role: selectedRole,
      status,
      // Seller
      businessName: selectedRole === 'seller' ? businessName.trim() : undefined,
      gstin: selectedRole === 'seller' ? gstin.trim().toUpperCase() : undefined,
      warehouseHub: selectedRole === 'seller' ? warehouseHub : undefined,
      commissionRate: selectedRole === 'seller' ? selectedCommission.rate : undefined,
      settlementTerms: selectedRole === 'seller' ? selectedCommission.terms : undefined,
      // Team
      department: selectedRole === 'team' ? department : undefined,
      designation: selectedRole === 'team' ? designation.trim() : undefined,
      permissionLevel: selectedRole === 'team' ? permissionLevel : undefined,
      // Customer
      shippingAddress: selectedRole === 'customer' ? shippingAddress.trim() : undefined,
      city: selectedRole === 'customer' ? city.trim() : undefined,
      state: selectedRole === 'customer' ? state.trim() : undefined,
      pincode: selectedRole === 'customer' ? pincode.trim() : undefined,
    };

    const res = await createUser(payload);

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create user account.');
      return;
    }

    if (res.user && autoSwitch) {
      switchUser(res.user);
    }

    if (res.user && onUserCreated) {
      onUserCreated(res.user.id);
    }

    onClose();
  };

  // Quick email check
  const isEmailTaken = registeredUsers.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-2xl overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#561269] to-[#7B1FA2] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-xl border border-white/20">
              <UserPlus className="w-6 h-6 text-[#FFB300]" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Create New User Account</h2>
              <p className="text-xs text-purple-100 mt-0.5">
                Manually provision Team Members, Sellers/Vendors, or Customer Maker profiles
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={(e) => handleCreate(e, false)} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Account Role Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Seller */}
              <button
                type="button"
                onClick={() => setSelectedRole('seller')}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                  selectedRole === 'seller'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-400'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 rounded-lg ${selectedRole === 'seller' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    <Store className="w-4 h-4" />
                  </span>
                  {selectedRole === 'seller' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="mt-1 font-bold text-sm text-gray-900">Seller / Vendor</div>
                <div className="text-[11px] text-gray-500 line-clamp-1">Fulfillment merchant hub</div>
              </button>

              {/* Team Member */}
              <button
                type="button"
                onClick={() => setSelectedRole('team')}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                  selectedRole === 'team'
                    ? 'border-[#561269] bg-purple-50/50 shadow-sm ring-1 ring-purple-400'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 rounded-lg ${selectedRole === 'team' ? 'bg-[#561269] text-white' : 'bg-gray-200 text-gray-700'}`}>
                    <Users className="w-4 h-4" />
                  </span>
                  {selectedRole === 'team' && <CheckCircle2 className="w-4 h-4 text-[#561269]" />}
                </div>
                <div className="mt-1 font-bold text-sm text-gray-900">Team Member</div>
                <div className="text-[11px] text-gray-500 line-clamp-1">Warehouse, QA & dispatch</div>
              </button>

              {/* Customer */}
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                  selectedRole === 'customer'
                    ? 'border-[#FF6B00] bg-orange-50/50 shadow-sm ring-1 ring-orange-400'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 rounded-lg ${selectedRole === 'customer' ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-700'}`}>
                    <User className="w-4 h-4" />
                  </span>
                  {selectedRole === 'customer' && <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />}
                </div>
                <div className="mt-1 font-bold text-sm text-gray-900">Customer</div>
                <div className="text-[11px] text-gray-500 line-clamp-1">Hardware buyer / maker</div>
              </button>
            </div>
          </div>

          {/* Section 1: Common Credentials */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#561269]" />
                Primary Account Information
              </span>
              <span className="text-[11px] text-slate-500">Required credentials for sign-in</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'seller' ? 'e.g. Vikram Patel' : selectedRole === 'team' ? 'e.g. Rahul Sharma' : 'e.g. Aryan Gandhale'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269] focus:border-transparent transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Email Address <span className="text-rose-500">*</span></span>
                  {email && isEmailTaken && (
                    <span className="text-[11px] text-rose-600 font-medium">Already taken</span>
                  )}
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. partner@semixlabs.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    isEmailTaken 
                      ? 'border-rose-400 focus:ring-rose-400' 
                      : 'border-gray-300 focus:ring-[#561269] focus:border-transparent'
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile / Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-medium text-gray-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269] focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">10-digit Indian mobile number for dispatch alerts</p>
              </div>

              {/* Initial Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Initial Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] text-[#561269] hover:underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269] focus:border-transparent font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Can be used immediately to sign in</p>
              </div>
            </div>

            {/* Account Status Option */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Initial Account Status:</span>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-700 font-semibold">Active</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'suspended'}
                    onChange={() => setStatus('suspended')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-rose-700 font-medium">Suspended</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Role-Specific Configurations */}

          {/* === SELLER SPECIFIC === */}
          {selectedRole === 'seller' && (
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/60">
                <Store className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Vendor & Warehouse Details
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store / Business Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Store / Business Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Silicon Technologies & Microelectronics"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">This name will appear on packing slips and in order routing</p>
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    GSTIN / Tax Identification
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">15-digit GSTIN (optional)</p>
                </div>

                {/* Dispatch Hub Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fulfillment & Dispatch Hub <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <select
                      value={warehouseHub}
                      onChange={(e) => setWarehouseHub(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {DISPATCH_HUBS.map((hub) => (
                        <option key={hub} value={hub}>{hub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Commission & Settlement Tier */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Commission Rate & Settlement Schedule
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMMISSION_RATES.map((tier, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedCommission(tier)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedCommission.rate === tier.rate
                            ? 'border-emerald-600 bg-white font-semibold text-emerald-900 shadow-xs'
                            : 'border-emerald-200/80 bg-white/60 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{tier.rate}</span>
                          <span className="text-[10px] text-emerald-700 font-normal">{tier.terms}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 bg-emerald-100/60 p-2.5 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  <strong>Immediate Routing:</strong> This vendor will instantly be available in the admin "Assign Seller" modal for pending orders.
                </span>
              </div>
            </div>
          )}

          {/* === TEAM SPECIFIC === */}
          {selectedRole === 'team' && (
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-purple-200/60">
                <Users className="w-4 h-4 text-[#561269]" />
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Internal Team & Designation Settings
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Department Unit <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269]"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Designation / Role Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Designation / Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead QA & Dispatch Specialist"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269]"
                  />
                </div>

                {/* Permission Level */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Permission Scope & Authority
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Standard Operator', 'Lead Technician', 'Operations Supervisor', 'Full Access'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPermissionLevel(lvl)}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          permissionLevel === lvl
                            ? 'border-[#561269] bg-[#561269] text-white shadow-xs'
                            : 'border-purple-200 bg-white text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-purple-900 bg-purple-100/70 p-2.5 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#561269] flex-shrink-0" />
                <span>
                  <strong>Staff Directory:</strong> Automatically synced with the Operations staff roster and packing desk access.
                </span>
              </div>
            </div>
          )}

          {/* === CUSTOMER SPECIFIC === */}
          {selectedRole === 'customer' && (
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-orange-200/60">
                <User className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs font-bold text-orange-900 uppercase tracking-wider">
                  Maker / Customer Delivery Address
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shipping Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Default Shipping Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lab 204, Hardware Innovation Wing, 100ft Road"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>

                {/* State & Pincode */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                disabled={isSubmitting || isEmailTaken}
                onClick={(e) => handleCreate(e, true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-[#561269] bg-purple-100 hover:bg-purple-200 border border-purple-200 rounded-xl transition-all disabled:opacity-50"
                title="Creates account and switches session to it immediately for testing"
              >
                Create & Switch To User
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isEmailTaken}
                className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#E65100] hover:to-[#BF360C] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
