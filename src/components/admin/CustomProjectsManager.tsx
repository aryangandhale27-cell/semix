import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Cpu, 
  Search, 
  Filter, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink, 
  Send, 
  Paperclip, 
  Download, 
  Boxes, 
  ShieldAlert, 
  Edit3, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Hash
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  CustomProjectSubmission, 
  CustomProjectStatus, 
  CustomProjectCategory 
} from '../../types';

export const CustomProjectsManager: React.FC = () => {
  const { 
    customProjects, 
    updateCustomProjectStatus, 
    addCustomProjectReply, 
    showToast,
    adminNotifications,
    markAdminNotificationRead
  } = useApp();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal Review State
  const [selectedProject, setSelectedProject] = useState<CustomProjectSubmission | null>(null);
  const [newStatus, setNewStatus] = useState<CustomProjectStatus>('Pending Review');
  const [adminNotes, setAdminNotes] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Statistics
  const pendingCount = customProjects.filter(p => p.status === 'Pending Review').length;
  const inDiscussionCount = customProjects.filter(p => p.status === 'In Discussion').length;
  const quotedCount = customProjects.filter(p => p.status === 'Quoted').length;

  // Filter projects
  const filteredProjects = customProjects.filter((project) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      project.projectName.toLowerCase().includes(q) ||
      project.id.toLowerCase().includes(q) ||
      project.clientName.toLowerCase().includes(q) ||
      project.companyName.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenReview = (project: CustomProjectSubmission) => {
    setSelectedProject(project);
    setNewStatus(project.status);
    setAdminNotes(project.adminNotes || '');
    setQuoteAmount(project.quoteAmount || '');
    setReplyMessage('');

    // Mark any unread notification for this project as read
    const relatedNotif = adminNotifications.find(n => n.projectId === project.id && !n.read);
    if (relatedNotif) {
      markAdminNotificationRead(relatedNotif.id);
    }
  };

  const handleUpdateStatusAndNotes = () => {
    if (!selectedProject) return;
    updateCustomProjectStatus(selectedProject.id, newStatus, adminNotes);
    
    setSelectedProject((prev) => prev ? { ...prev, status: newStatus, adminNotes } : null);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    if (!replyMessage.trim() && !quoteAmount.trim()) {
      showToast('Input Required', 'Please enter a quote amount or reply message.', 'warning');
      return;
    }

    setIsSendingReply(true);

    setTimeout(() => {
      addCustomProjectReply(selectedProject.id, replyMessage.trim(), quoteAmount.trim() || undefined);
      
      const now = new Date();
      const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      const newReply = {
        id: 'rep-' + Date.now(),
        sender: 'admin' as const,
        senderName: 'SEMIX LABS Engineering Admin',
        message: replyMessage.trim(),
        quotedAmount: quoteAmount.trim() || undefined,
        timestamp: dateStr
      };

      setSelectedProject((prev) => prev ? {
        ...prev,
        status: quoteAmount.trim() ? 'Quoted' : 'In Discussion',
        quoteAmount: quoteAmount.trim() || prev.quoteAmount,
        replies: [...(prev.replies || []), newReply]
      } : null);

      setNewStatus(quoteAmount.trim() ? 'Quoted' : 'In Discussion');
      setReplyMessage('');
      setIsSendingReply(false);
    }, 400);
  };

  const handleDownloadAttachment = (fileName: string) => {
    // Simulated file download
    const blob = new Blob([`[SEMIX LABS PROJECT DOCKET: ${fileName}]\nConfidential Engineering Document.\nGenerated for project specification review.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download Started', `Downloading ${fileName}`, 'info');
  };

  const getStatusBadge = (status: CustomProjectStatus) => {
    switch (status) {
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending Review
          </span>
        );
      case 'In Discussion':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-[#561269] border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#561269]"></span>
            In Discussion
          </span>
        );
      case 'Quoted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Quoted
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <CheckCircle2 className="w-3 h-3 text-cyan-500" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <X className="w-3 h-3 text-slate-500" />
            Rejected
          </span>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Custom Inquiries</span>
            <p className="text-2xl font-black text-slate-900 font-mono mt-1">
              {customProjects.length}
            </p>
            <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">
              Direct Engineering Inquiries
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Awaiting Specification Review</span>
            <p className="text-2xl font-black text-amber-600 font-mono mt-1">
              {pendingCount}
            </p>
            <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
              {pendingCount > 0 ? 'Requires Engineer Assignment' : 'All tickets evaluated'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Technical Discussions</span>
            <p className="text-2xl font-black text-[#561269] font-mono mt-1">
              {inDiscussionCount}
            </p>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
              BOM & Schematic Iteration
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Official Commercial Quotes</span>
            <p className="text-2xl font-black text-emerald-700 font-mono mt-1">
              {quotedCount}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
              Quotes Delivered to Client
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project, client, ID, company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#561269]"
          >
            <option value="all">All Statuses</option>
            <option value="Pending Review">Pending Review ({pendingCount})</option>
            <option value="In Discussion">In Discussion ({inDiscussionCount})</option>
            <option value="Quoted">Quoted ({quotedCount})</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#561269]"
          >
            <option value="all">All Categories</option>
            <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
            <option value="PCB Design & Prototyping">PCB Design & Prototyping</option>
            <option value="Firmware & Software Development">Firmware & Software Development</option>
            <option value="Turnkey Manufacturing">Turnkey Manufacturing</option>
            <option value="Robotics & Automation">Robotics & Automation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Submission ID & Date</th>
                <th className="py-3.5 px-4">Client & Organization</th>
                <th className="py-3.5 px-4">Project Title & Category</th>
                <th className="py-3.5 px-4">Quantity & Timeline</th>
                <th className="py-3.5 px-4">Target Budget</th>
                <th className="py-3.5 px-4 text-center">Files</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Cpu className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-slate-600">No custom project submissions match your filter.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Submit a project from the Bulk Enquiry / Custom Projects desk.</p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#561269] text-xs block">
                        {project.id}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {project.createdAt}
                      </span>
                    </td>

                    {/* Client & Org */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{project.clientName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{project.companyName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {project.clientEmail}
                      </div>
                    </td>

                    {/* Project Title & Category */}
                    <td className="py-4 px-4 max-w-[240px]">
                      <span className="font-bold text-slate-800 block truncate" title={project.projectName}>
                        {project.projectName}
                      </span>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                        {project.category}
                      </span>
                    </td>

                    {/* Quantity & Timeline */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">
                        {project.quantity}
                      </span>
                      <span className="text-[11px] text-amber-600 font-medium block mt-0.5">
                        {project.timeline}
                      </span>
                    </td>

                    {/* Target Budget */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono font-bold text-slate-900">
                      {project.budgetRange}
                    </td>

                    {/* Attached Files */}
                    <td className="py-4 px-4 text-center">
                      {project.attachedFiles.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200" title={`${project.attachedFiles.length} file(s) attached`}>
                          <Paperclip className="w-3 h-3 text-slate-500" />
                          {project.attachedFiles.length}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenReview(project)}
                        className="px-3 py-1.5 rounded-lg bg-[#561269] hover:bg-[#380847] text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Review & Quote</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Action Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#561269] to-[#380847] p-6 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#FF6B00] bg-black/30 px-2 py-0.5 rounded">
                      {selectedProject.id}
                    </span>
                    <span className="text-xs text-purple-200">
                      Logged on {selectedProject.createdAt}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {selectedProject.projectName}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Status & Quick Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                    <span className="text-xs font-bold text-[#561269] block mt-0.5">
                      {selectedProject.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Quantity Target</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      {selectedProject.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">
                      {selectedProject.budgetRange}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Timeline</span>
                    <span className="text-xs font-bold text-amber-700 block mt-0.5">
                      {selectedProject.timeline}
                    </span>
                  </div>
                </div>

                {/* Client Details Section */}
                <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Client Organization & Point of Contact</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Client Name</span>
                      <span className="font-bold text-slate-800 block">{selectedProject.clientName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Company / Lab</span>
                      <span className="font-bold text-slate-800 block">{selectedProject.companyName}</span>
                      {selectedProject.gstin && (
                        <span className="text-[10px] font-mono text-purple-700 block mt-0.5">
                          GST: {selectedProject.gstin}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Email</span>
                      <a 
                        href={`mailto:${selectedProject.clientEmail}?subject=Regarding ${selectedProject.projectName} (${selectedProject.id})`}
                        className="font-bold text-[#561269] hover:underline block truncate"
                      >
                        {selectedProject.clientEmail}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Phone</span>
                      <a 
                        href={`tel:${selectedProject.clientPhone}`}
                        className="font-bold text-slate-800 hover:text-[#561269] block"
                      >
                        {selectedProject.clientPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Description & Scope of Work */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Detailed Scope of Work & Requirements
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedProject.description}
                  </div>
                </div>

                {/* Preferred Components */}
                {selectedProject.preferredComponents && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Client Preferred Components / Microcontrollers
                    </h3>
                    <p className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs font-medium text-slate-800">
                      {selectedProject.preferredComponents}
                    </p>
                  </div>
                )}

                {/* Attached Files List */}
                {selectedProject.attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-slate-400" />
                      <span>Attached Specifications & Schematics ({selectedProject.attachedFiles.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.attachedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-[#561269] shrink-0" />
                            <div className="truncate">
                              <span className="font-bold text-slate-800 block truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-400">{formatFileSize(file.size)}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadAttachment(file.name)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 text-[#561269] border border-purple-200 font-semibold text-[11px] transition-colors cursor-pointer shrink-0 ml-2"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status & Internal Admin Notes Editor */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-[#561269]" />
                    <span>Administrative Status & Internal Engineering Notes</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lifecycle Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as CustomProjectStatus)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-[#561269]"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Internal Review Notes (Only visible to Admin & Staff)
                      </label>
                      <input
                        type="text"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="e.g. PCB stackup verified; pending quotation from component distributor"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#561269]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleUpdateStatusAndNotes}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Save Status & Notes
                    </button>
                  </div>
                </div>

                {/* Discussion / Quote Reply Composer */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-[#FF6B00]" />
                      <span>Issue Official Quote & Dispatch Email Reply to Client</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Target: {selectedProject.clientEmail}
                    </span>
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-3 bg-purple-50/40 p-5 rounded-2xl border border-purple-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Commercial Quotation Amount (Optional or when ready)
                      </label>
                      <input
                        type="text"
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(e.target.value)}
                        placeholder="e.g. ₹85,000 + 18% GST (Includes 5 prototype assembled boards + tooling)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-[#561269]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Message / Specification Feedback to Client
                      </label>
                      <textarea
                        rows={3}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Enter email response to client regarding lead times, DFM feedback, component availability, or payment terms..."
                        className="w-full p-3 rounded-xl border border-purple-200 bg-white text-xs font-sans focus:outline-hidden focus:border-[#561269]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-500">
                        Dispatches automated email notification with quotation details.
                      </span>

                      <button
                        type="submit"
                        disabled={isSendingReply}
                        className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSendingReply ? (
                          <span>Sending Quote...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Quote / Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Previous Communication History */}
                  {selectedProject.replies && selectedProject.replies.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Communication History ({selectedProject.replies.length}):
                      </span>

                      <div className="space-y-2">
                        {selectedProject.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#561269]">{reply.senderName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{reply.timestamp}</span>
                            </div>
                            {reply.quotedAmount && (
                              <div className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Quoted: {reply.quotedAmount}
                              </div>
                            )}
                            <p className="text-slate-700 text-xs whitespace-pre-wrap">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-100 p-4 sm:px-8 bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Docket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
