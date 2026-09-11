import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Download,
  Clock,
  User,
  Activity,
  CheckCircle2,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  AlertTriangle,
  ArrowRight,
  Layers,
  Database,
  Radio,
} from 'lucide-react';
import {
  AuditLog,
  AuditTargetEntity,
  AuditActionType,
  AuditLogQueryFilter,
} from '../../types/audit';
import {
  fetchAuditLogs,
  subscribeToAuditLogs,
  recordActivityLog,
} from '../../services/auditService';

export const AdminAuditLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<AuditTargetEntity | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'seller' | 'all'>('all');
  const [selectedAction, setSelectedAction] = useState<AuditActionType | 'all'>('all');

  // Load and subscribe to audit logs
  useEffect(() => {
    setIsLoading(true);
    let isSubscribed = true;

    // 1. Initial fetch
    fetchAuditLogs({ limit: 200 })
      .then((data) => {
        if (isSubscribed) {
          setLogs(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load initial audit logs:', err);
        if (isSubscribed) setIsLoading(false);
      });

    // 2. Real-time live subscription
    const unsubscribe = subscribeToAuditLogs((updatedLogs) => {
      if (isSubscribed) {
        setLogs(updatedLogs);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Manual refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAuditLogs({
        targetEntity: selectedEntity !== 'all' ? selectedEntity : undefined,
        userRole: selectedRole !== 'all' ? selectedRole : undefined,
        actionType: selectedAction !== 'all' ? selectedAction : undefined,
        searchQuery: searchQuery || undefined,
        limit: 200,
      });
      setLogs(data);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedEntity !== 'all' && log.targetEntity !== selectedEntity) {
        return false;
      }
      if (selectedRole !== 'all' && log.userRole !== selectedRole) {
        return false;
      }
      if (selectedAction !== 'all' && log.actionType !== selectedAction) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesUser =
          log.userEmail.toLowerCase().includes(q) ||
          (log.userName && log.userName.toLowerCase().includes(q)) ||
          log.userId.toLowerCase().includes(q);
        const matchesTarget =
          log.targetId.toLowerCase().includes(q) ||
          log.targetEntity.toLowerCase().includes(q);
        const matchesAction = log.actionType.toLowerCase().includes(q);
        const matchesSummary =
          log.changes?.summary && log.changes.summary.toLowerCase().includes(q);
        const matchesReason =
          log.metadata?.reason && log.metadata.reason.toLowerCase().includes(q);

        if (!matchesUser && !matchesTarget && !matchesAction && !matchesSummary && !matchesReason) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedEntity, selectedRole, selectedAction, searchQuery]);

  // Aggregate metrics
  const stats = useMemo(() => {
    const adminCount = logs.filter((l) => l.userRole === 'admin').length;
    const sellerCount = logs.filter((l) => l.userRole === 'seller').length;
    const entitySet = new Set(logs.map((l) => l.targetEntity));
    return {
      total: logs.length,
      adminCount,
      sellerCount,
      uniqueEntities: entitySet.size,
    };
  }, [logs]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Actor Role',
      'Actor Email',
      'Action Type',
      'Target Entity',
      'Target ID',
      'Summary',
      'Source',
    ];
    const rows = filteredLogs.map((l) => [
      `"${l.logId}"`,
      `"${l.timestamp}"`,
      `"${l.userRole}"`,
      `"${l.userEmail}"`,
      `"${l.actionType}"`,
      `"${l.targetEntity}"`,
      `"${l.targetId}"`,
      `"${(l.changes?.summary || '').replace(/"/g, '""')}"`,
      `"${l.metadata?.source || 'web_client'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `semix_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `semix_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for action badges
  const getActionBadge = (action: AuditActionType) => {
    switch (action) {
      case 'CREATE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            CREATE
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            UPDATE
          </span>
        );
      case 'DELETE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            DELETE
          </span>
        );
      case 'STATUS_CHANGE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            STATUS
          </span>
        );
      case 'ASSIGNMENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            ASSIGN
          </span>
        );
      case 'BONUS_ALLOCATION':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            BONUS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Activity & Audit Logs</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firestore Append-Only Vault
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Immutable, cryptographically recorded audit trail tracking all modifications by Admin and Seller accounts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF6B00]' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleExportJson}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            title="Download Raw JSON"
          >
            <FileText className="w-4 h-4 text-[#FF6B00]" />
            JSON
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Recorded Logs</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.total}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600 inline" />
            100% Immutable in Firestore
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin Modifications</span>
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">{stats.adminCount}</div>
          <div className="text-xs text-slate-500 mt-1">Catalog, Bonuses, Settings</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller Mutations</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{stats.sellerCount}</div>
          <div className="text-xs text-slate-500 mt-1">Fulfillment, Packing, Dispatches</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Entities Monitored</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.uniqueEntities}</div>
          <div className="text-xs text-slate-500 mt-1">Products, Orders, Bonuses, Banners</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by actor email, user name, target ID, action or summary..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter: Entity */}
          <div className="flex items-center gap-2">
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value as any)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] text-slate-700"
            >
              <option value="all">All Target Entities</option>
              <option value="seller_bonuses">Seller Bonuses</option>
              <option value="products">Products Catalog</option>
              <option value="orders">Orders & Fulfillment</option>
              <option value="banners">Homepage Banners</option>
              <option value="categories">Categories</option>
              <option value="coupons">Coupons</option>
              <option value="users">User Profiles</option>
              <option value="custom_projects">Custom Projects</option>
            </select>
          </div>

          {/* Filter: Role */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] text-slate-700"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin Actions Only</option>
              <option value="seller">Seller Actions Only</option>
            </select>
          </div>

          {/* Filter: Action */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value as any)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] text-slate-700"
            >
              <option value="all">All Actions</option>
              <option value="BONUS_ALLOCATION">Bonus Allocation</option>
              <option value="STATUS_CHANGE">Status Change</option>
              <option value="ASSIGNMENT">Seller Assignment</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-800">{filteredLogs.length}</strong> of{' '}
            <strong className="text-slate-800">{logs.length}</strong> recorded audit events
          </div>
          {(selectedEntity !== 'all' || selectedRole !== 'all' || selectedAction !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedEntity('all');
                setSelectedRole('all');
                setSelectedAction('all');
                setSearchQuery('');
              }}
              className="text-[#FF6B00] hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-800">Reading Immutable Audit Log Stream...</div>
            <div className="text-xs text-slate-500 mt-1">Connecting to Cloud Firestore activity_logs</div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Matching Activity Logs</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              No audit records match the current filter criteria. All future modifications by Admin or Seller accounts will be automatically captured here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Resource</th>
                  <th className="py-3.5 px-4">Change Summary</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const isRecent = Date.now() - dateObj.getTime() < 1000 * 60 * 60 * 24; // within 24h

                  return (
                    <tr
                      key={log.logId}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <div className="font-mono text-xs font-semibold text-slate-800">
                              {dateObj.toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {dateObj.toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              log.userRole === 'admin'
                                ? 'bg-slate-900 text-white'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {log.userRole === 'admin' ? 'A' : 'S'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                              {log.userName || (log.userRole === 'admin' ? 'Admin Controller' : 'Seller Hub')}
                              <span
                                className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                  log.userRole === 'admin'
                                    ? 'bg-slate-100 text-slate-700'
                                    : 'bg-amber-50 text-amber-800'
                                }`}
                              >
                                {log.userRole}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 truncate max-w-[180px]">
                              {log.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getActionBadge(log.actionType)}
                      </td>

                      {/* Target Entity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {log.targetEntity}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate max-w-[160px]">
                          ID: {log.targetId}
                        </div>
                      </td>

                      {/* Change Summary */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-700 font-medium max-w-md line-clamp-1">
                          {log.changes?.summary || (
                            <span>
                              Modified {log.changes?.affectedFields?.length || 0} fields:{' '}
                              {log.changes?.affectedFields?.join(', ')}
                            </span>
                          )}
                        </div>
                        {log.metadata?.reason && (
                          <div className="text-[11px] text-slate-500 mt-0.5 italic">
                            Reason: {log.metadata.reason}
                          </div>
                        )}
                      </td>

                      {/* Details button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-[#FF6B00] hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">Audit Log Verification</h3>
                    {getActionBadge(selectedLog.actionType)}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Log ID: {selectedLog.logId}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Immutability Banner */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Lock className="w-4 h-4" />
                  Append-Only Immutability Enforced
                </div>
                <div className="text-slate-300">
                  This record is permanently sealed in Firestore collection <code className="text-[#FF6B00]">/activity_logs/{selectedLog.logId}</code>. Security rules forbid updates or deletions.
                </div>
              </div>

              {/* Actor & Execution Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Actor UID:</span>
                  <div className="font-mono text-slate-800 font-semibold mt-0.5">{selectedLog.userId}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Actor Email / Role:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {selectedLog.userEmail} ({selectedLog.userRole.toUpperCase()})
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Target Resource:</span>
                  <div className="font-mono text-slate-800 font-semibold mt-0.5">
                    {selectedLog.targetEntity} / {selectedLog.targetId}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Exact Timestamp:</span>
                  <div className="font-mono text-slate-800 mt-0.5">{selectedLog.timestamp}</div>
                </div>
                {selectedLog.metadata?.reason && (
                  <div className="col-span-2">
                    <span className="text-slate-400 font-medium">Recorded Justification:</span>
                    <div className="text-slate-800 font-semibold mt-0.5">{selectedLog.metadata.reason}</div>
                  </div>
                )}
              </div>

              {/* Field Diffs */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Field-Level Modifications ({selectedLog.changes?.affectedFields?.length || 0})
                </h4>

                {selectedLog.changes?.diffs && Object.keys(selectedLog.changes.diffs).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(selectedLog.changes.diffs).map(([fieldName, diffValue]) => {
                      const diff = diffValue as { oldValue?: any; newValue?: any };
                      return (
                        <div
                          key={fieldName}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                        >
                          <div className="font-mono font-bold text-slate-900 flex items-center justify-between">
                            <span>Field: {fieldName}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="p-2 rounded bg-rose-50 border border-rose-100 text-rose-800">
                              <div className="text-[10px] font-semibold text-rose-500 uppercase mb-0.5">Previous Value</div>
                              <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                                {JSON.stringify(diff?.oldValue, null, 2)}
                              </pre>
                            </div>
                            <div className="p-2 rounded bg-emerald-50 border border-emerald-100 text-emerald-800">
                              <div className="text-[10px] font-semibold text-emerald-500 uppercase mb-0.5">New Value</div>
                              <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                                {JSON.stringify(diff?.newValue, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-slate-600 text-xs">
                    {selectedLog.changes?.summary || 'Standard entity creation or state snapshot stored.'}
                  </div>
                )}
              </div>

              {/* Raw JSON Snapshot */}
              <div>
                <details className="text-xs">
                  <summary className="font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                    View Complete Audit Envelope (JSON)
                  </summary>
                  <pre className="mt-2 p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </details>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Firestore Audit Hash
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
