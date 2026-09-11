import React, { useState, useEffect } from 'react';
import { AuthUser, AccountStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  UserCheck, 
  Store, 
  Users, 
  User, 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff, 
  Building, 
  FileText, 
  MapPin, 
  Briefcase, 
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface EditUserModalProps {
  user: AuthUser | null;
  isOpen: boolean;
  onClose: () => void;
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
  'Customer Success & Desk Support',
  'Executive Operations'
];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { updateUser, registeredUsers } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<AccountStatus>('active');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Seller
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [warehouseHub, setWarehouseHub] = useState(DISPATCH_HUBS[0]);
  const [commissionRate, setCommissionRate] = useState('7.5% Platform Fee');
  const [settlementTerms, setSettlementTerms] = useState('Net 7 Weekly Cycle');

  // Team
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [designation, setDesignation] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('Standard Operator');

  // Customer
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setStatus(user.status || 'active');
      setNewPassword('');
      setErrorMessage(null);

      // Seller
      setBusinessName(user.businessName || '');
      setGstin(user.gstin || '');
      setWarehouseHub(user.warehouseHub || DISPATCH_HUBS[0]);
      setCommissionRate(user.commissionRate || '7.5% Platform Fee');
      setSettlementTerms(user.settlementTerms || 'Net 7 Weekly Cycle');

      // Team
      setDepartment(user.department || DEPARTMENTS[0]);
      setDesignation(user.designation || 'Specialist');
      setPermissionLevel(user.permissionLevel || 'Standard Operator');

      // Customer
      setShippingAddress(user.shippingAddress || '');
      setCity(user.city || 'Bengaluru');
      setState(user.state || 'Karnataka');
      setPincode(user.pincode || '560001');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const updates: Partial<AuthUser & { passwordHash?: string }> = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      status,
      // Seller
      businessName: user.role === 'seller' ? businessName.trim() : undefined,
      gstin: user.role === 'seller' ? gstin.trim().toUpperCase() : undefined,
      warehouseHub: user.role === 'seller' ? warehouseHub : undefined,
      commissionRate: user.role === 'seller' ? commissionRate : undefined,
      settlementTerms: user.role === 'seller' ? settlementTerms : undefined,
      // Team
      department: user.role === 'team' || user.role === 'admin' ? department : undefined,
      designation: user.role === 'team' || user.role === 'admin' ? designation.trim() : undefined,
      permissionLevel: user.role === 'team' || user.role === 'admin' ? permissionLevel : undefined,
      // Customer
      shippingAddress: user.role === 'customer' ? shippingAddress.trim() : undefined,
      city: user.role === 'customer' ? city.trim() : undefined,
      state: user.role === 'customer' ? state.trim() : undefined,
      pincode: user.role === 'customer' ? pincode.trim() : undefined,
    };

    if (newPassword.trim()) {
      updates.passwordHash = newPassword.trim();
    }

    const res = await updateUser(user.id, updates);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update account.');
      return;
    }

    onClose();
  };

  const isEmailConflict = registeredUsers.some(
    (u) => u.id !== user.id && u.email.toLowerCase() === email.trim().toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <UserCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Edit User Profile</h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' :
                  user.role === 'team' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30' :
                  user.role === 'seller' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                  'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                }`}>
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Update credentials, contact records and role parameters for {user.name}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleUpdate} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Account Status Control */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-800">Account Access Status</span>
              <p className="text-[11px] text-gray-500">Suspended accounts cannot sign in or receive dispatches</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="edit-status"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-emerald-700 font-bold">Active</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="edit-status"
                  checked={status === 'suspended'}
                  onChange={() => setStatus('suspended')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="text-rose-700 font-bold">Suspended</span>
              </label>
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  isEmailConflict ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-[#561269]'
                }`}
              />
              {isEmailConflict && <p className="text-[10px] text-rose-600 mt-1">Email already assigned to another account</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Reset Password <span className="text-gray-400 font-normal">(Leave blank to keep existing)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#561269]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Seller Specific */}
          {user.role === 'seller' && (
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-4">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Vendor Logistics & Terms
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Store / Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Dispatch Hub</label>
                  <select
                    value={warehouseHub}
                    onChange={(e) => setWarehouseHub(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  >
                    {DISPATCH_HUBS.map((hub) => (
                      <option key={hub} value={hub}>{hub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Commission Rate</label>
                  <input
                    type="text"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Settlement Terms</label>
                  <input
                    type="text"
                    value={settlementTerms}
                    onChange={(e) => setSettlementTerms(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Team Specific */}
          {(user.role === 'team' || user.role === 'admin') && (
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-4">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                Department & Permissions
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Department Unit</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Permission Level</label>
                  <select
                    value={permissionLevel}
                    onChange={(e) => setPermissionLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  >
                    <option value="Standard Operator">Standard Operator</option>
                    <option value="Lead Technician">Lead Technician</option>
                    <option value="Operations Supervisor">Operations Supervisor</option>
                    <option value="Full Access">Full Access</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Customer Specific */}
          {user.role === 'customer' && (
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200 space-y-4">
              <span className="text-xs font-bold text-orange-900 uppercase tracking-wider block">
                Default Delivery Address
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-2 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-2 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isEmailConflict}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#561269] hover:bg-[#430e52] rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
