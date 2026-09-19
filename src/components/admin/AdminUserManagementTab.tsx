import React, { useState, useMemo } from 'react';
import { AuthUser, UserRole, AccountStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { 
  Users, 
  UserPlus, 
  Store, 
  User, 
  ShieldCheck, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Power, 
  LogIn, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  Briefcase,
  AlertTriangle,
  ArrowUpDown,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

export const AdminUserManagementTab: React.FC = () => {
  const { 
    registeredUsers, 
    user: currentUser, 
    toggleUserStatus, 
    deleteUser, 
    switchUser 
  } = useAuth();
  const { availableSellers, showToast } = useApp();

  // Modal controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialRole, setCreateInitialRole] = useState<'team' | 'seller' | 'customer'>('seller');
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AuthUser | null>(null);

  // Filters and search
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    showToast('Copied to Clipboard', text, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u) => {
      // Role
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      // Status
      if (statusFilter !== 'all' && (u.status || 'active') !== statusFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesPhone = (u.phone || '').toLowerCase().includes(q);
        const matchesBusiness = (u.businessName || '').toLowerCase().includes(q);
        const matchesDept = (u.department || '').toLowerCase().includes(q);
        const matchesHub = (u.warehouseHub || '').toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesPhone || matchesBusiness || matchesDept || matchesHub;
      }
      return true;
    });
  }, [registeredUsers, roleFilter, statusFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    const total = registeredUsers.length;
    const customers = registeredUsers.filter((u) => u.role === 'customer').length;
    const sellers = registeredUsers.filter((u) => u.role === 'seller').length;
    const team = registeredUsers.filter((u) => u.role === 'team').length;
    const admins = registeredUsers.filter((u) => u.role === 'admin').length;
    const suspended = registeredUsers.filter((u) => u.status === 'suspended').length;
    return { total, customers, sellers, team, admins, suspended };
  }, [registeredUsers]);

  const openCreateForRole = (role: 'team' | 'seller' | 'customer') => {
    setCreateInitialRole(role);
    setIsCreateOpen(true);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3 text-purple-700" />
            Admin
          </span>
        );
      case 'team':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Users className="w-3 h-3 text-indigo-700" />
            Team Member
          </span>
        );
      case 'seller':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Store className="w-3 h-3 text-emerald-700" />
            Seller / Vendor
          </span>
        );
      case 'customer':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#FF6B00] border border-orange-200">
            <User className="w-3 h-3 text-[#FF6B00]" />
            Customer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-[#561269] rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                User Management & Accounts
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage all customer profiles, registered vendor dispatch hubs, and operations team members.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => openCreateForRole('seller')}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Add Seller</span>
          </button>

          <button
            onClick={() => openCreateForRole('team')}
            className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>+ Add Team Member</span>
          </button>

          <button
            onClick={() => {
              setCreateInitialRole('seller');
              setIsCreateOpen(true);
            }}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#E65100] hover:to-[#BF360C] rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Create User</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => { setRoleFilter('all'); setStatusFilter('all'); }}
          className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer ${
            roleFilter === 'all' && statusFilter === 'all' 
              ? 'border-[#561269] shadow-sm ring-1 ring-[#561269]' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Accounts</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{counts.total}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">All directory users</div>
        </div>

        <div 
          onClick={() => { setRoleFilter('customer'); setStatusFilter('all'); }}
          className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer ${
            roleFilter === 'customer' 
              ? 'border-[#FF6B00] shadow-sm ring-1 ring-[#FF6B00]' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-[#FF6B00] uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3" /> Customers
          </div>
          <div className="text-2xl font-black text-gray-900 mt-1">{counts.customers}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Hardware makers</div>
        </div>

        <div 
          onClick={() => { setRoleFilter('seller'); setStatusFilter('all'); }}
          className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer ${
            roleFilter === 'seller' 
              ? 'border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <Store className="w-3 h-3" /> Sellers / Vendors
          </div>
          <div className="text-2xl font-black text-gray-900 mt-1">{counts.sellers}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">{availableSellers.length} active in routing</div>
        </div>

        <div 
          onClick={() => { setRoleFilter('team'); setStatusFilter('all'); }}
          className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer ${
            roleFilter === 'team' 
              ? 'border-indigo-500 shadow-sm ring-1 ring-indigo-500' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3 h-3" /> Team Staff
          </div>
          <div className="text-2xl font-black text-gray-900 mt-1">{counts.team}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Warehouse & QA</div>
        </div>

        <div 
          onClick={() => { setRoleFilter('admin'); setStatusFilter('all'); }}
          className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer ${
            roleFilter === 'admin' 
              ? 'border-purple-600 shadow-sm ring-1 ring-purple-600' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Admins
          </div>
          <div className="text-2xl font-black text-gray-900 mt-1">{counts.admins}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Platform controllers</div>
        </div>

        <div 
          onClick={() => { setStatusFilter('suspended'); }}
          className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'suspended' 
              ? 'border-rose-500 shadow-sm ring-1 ring-rose-500' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Suspended
          </div>
          <div className="text-2xl font-black text-gray-900 mt-1">{counts.suspended}</div>
          <div className="text-[10px] text-rose-500 mt-0.5">Access disabled</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Role Filter Tabs */}
          <div className="flex items-center flex-wrap gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Users', count: counts.total },
              { id: 'customer', label: 'Customers', count: counts.customers },
              { id: 'seller', label: 'Sellers / Vendors', count: counts.sellers },
              { id: 'team', label: 'Team Members', count: counts.team },
              { id: 'admin', label: 'Admins', count: counts.admins },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  roleFilter === tab.id
                    ? 'bg-[#561269] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  roleFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Status Dropdown & Search */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#561269]"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>

            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, email, phone, hub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#561269] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Summary Table */}
      <div id="admin-user-directory-table" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">User Profile</th>
                <th className="py-3.5 px-4">Role Badge</th>
                <th className="py-3.5 px-4">Contact Information</th>
                <th className="py-3.5 px-4">Role Parameters / Logistics</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-3 bg-gray-100 text-gray-400 rounded-full mb-2">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">No accounts found</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Try adjusting your filters or search terms, or create a new user.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setRoleFilter('all');
                          setStatusFilter('all');
                        }}
                        className="mt-3 text-xs font-semibold text-[#561269] hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuspended = user.status === 'suspended';
                  const isCurrentSession = currentUser?.id === user.id || currentUser?.email === user.email;
                  const isRootAdmin = user.email === 'admin@semixlabs.com';

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-purple-50/20 transition-colors ${
                        isSuspended ? 'bg-gray-50/60 opacity-80' : ''
                      }`}
                    >
                      {/* 1. User Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs select-none ${
                            user.role === 'admin' ? 'bg-purple-700 text-white' :
                            user.role === 'team' ? 'bg-[#561269] text-white' :
                            user.role === 'seller' ? 'bg-emerald-600 text-white' :
                            'bg-[#FF6B00] text-white'
                          }`}>
                            {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900">{user.name}</span>
                              {isCurrentSession && (
                                <span className="text-[10px] font-bold text-[#561269] bg-purple-100 px-1.5 py-0.2 rounded-md">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              {user.businessName && (
                                <span className="font-medium text-emerald-800 flex items-center gap-1">
                                  <Building className="w-3 h-3 text-emerald-600" />
                                  {user.businessName}
                                </span>
                              )}
                              {user.department && !user.businessName && (
                                <span className="text-gray-600 flex items-center gap-1">
                                  <Briefcase className="w-3 h-3 text-gray-400" />
                                  {user.department}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Role Badge */}
                      <td className="py-3.5 px-4">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* 3. Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium group">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{user.email}</span>
                            <button
                              onClick={() => handleCopy(user.email, `email-${user.id}`)}
                              className="text-gray-400 hover:text-gray-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy email"
                            >
                              {copiedField === `email-${user.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 4. Role Details / Logistics */}
                      <td className="py-3.5 px-4">
                        {user.role === 'seller' && (
                          <div className="text-xs space-y-0.5">
                            {user.warehouseHub && (
                              <div className="text-gray-700 flex items-center gap-1 font-medium line-clamp-1" title={user.warehouseHub}>
                                <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">{user.warehouseHub}</span>
                              </div>
                            )}
                            <div className="text-[11px] text-gray-500 flex items-center gap-2">
                              {user.commissionRate && <span>{user.commissionRate}</span>}
                              {user.gstin && (
                                <span className="font-mono text-[10px] bg-gray-100 px-1 rounded text-gray-600">
                                  GST: {user.gstin}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {user.role === 'team' && (
                          <div className="text-xs space-y-0.5">
                            <div className="font-medium text-gray-800">
                              {user.designation || 'Specialist'}
                            </div>
                            <div className="text-[11px] text-purple-700 font-semibold">
                              {user.permissionLevel || 'Standard Operator'}
                            </div>
                          </div>
                        )}

                        {user.role === 'customer' && (
                          <div className="text-xs space-y-0.5">
                            <div className="text-gray-700 truncate max-w-[200px]" title={user.shippingAddress || 'Bengaluru'}>
                              {user.shippingAddress || 'Delivery Address Registered'}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {user.city || 'Bengaluru'}, {user.state || 'Karnataka'} {user.pincode ? `(${user.pincode})` : ''}
                            </div>
                          </div>
                        )}

                        {user.role === 'admin' && (
                          <div className="text-xs text-purple-900 font-medium">
                            Full Operations & Escalations Authority
                          </div>
                        )}
                      </td>

                      {/* 5. Account Status */}
                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* 6. Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Switch to User */}
                          <button
                            onClick={() => switchUser(user)}
                            disabled={isSuspended}
                            className="px-2 py-1 text-xs font-semibold text-[#561269] hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Sign in as this user immediately"
                          >
                            <LogIn className="w-3.5 h-3.5 text-[#561269]" />
                            <span className="hidden sm:inline">Switch</span>
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit user details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Toggle Suspend / Active */}
                          {!isRootAdmin && (
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isSuspended
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-amber-600 hover:bg-amber-50'
                              }`}
                              title={isSuspended ? 'Reactivate account' : 'Suspend account'}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          {!isRootAdmin && !isCurrentSession && (
                            <button
                              onClick={() => setUserToDelete(user)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete user account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary Bar */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div>
            Showing <strong className="text-gray-900">{filteredUsers.length}</strong> of{' '}
            <strong className="text-gray-900">{registeredUsers.length}</strong> registered accounts
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All created sellers automatically route into order assignments
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete User Account</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to permanently delete account{' '}
              <strong className="text-gray-900">{userToDelete.name}</strong> ({userToDelete.email})?{' '}
              {userToDelete.role === 'seller' && 'This seller will also be removed from available dispatch hubs.'}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  void deleteUser(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        initialRole={createInitialRole}
      />

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
      />
    </div>
  );
};
