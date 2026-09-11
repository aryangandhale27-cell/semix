import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  X, 
  User, 
  ShieldAlert, 
  Building2, 
  Copy, 
  Check, 
  Eye, 
  Code, 
  Sparkles,
  ExternalLink,
  Clock,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  SentEmailRecord, 
  getLocalSentEmails,
  getGmailComposeUrl,
  downloadEmailAsEml,
  checkServerEmailStatus
} from '../../services/emailService';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: SentEmailRecord | null;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  initialEmail,
}) => {
  const sentEmails = getLocalSentEmails();
  const [selectedEmail, setSelectedEmail] = useState<SentEmailRecord | null>(
    initialEmail || (sentEmails.length > 0 ? sentEmails[0] : null)
  );
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);
  const [showDeliveryGuide, setShowDeliveryGuide] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<{ configured: boolean; user?: string | null; message?: string } | null>(null);

  // Query server SMTP status on open
  useEffect(() => {
    if (isOpen) {
      checkServerEmailStatus().then(setSmtpStatus);
    }
  }, [isOpen]);

  // Sync selected email if initialEmail changes
  useEffect(() => {
    if (initialEmail) {
      setSelectedEmail(initialEmail);
    } else if (sentEmails.length > 0 && !selectedEmail) {
      setSelectedEmail(sentEmails[0]);
    }
  }, [initialEmail, sentEmails]);

  if (!isOpen) return null;

  const currentEmail = selectedEmail || (sentEmails.length > 0 ? sentEmails[0] : null);

  const handleCopyHtml = () => {
    if (!currentEmail) return;
    navigator.clipboard.writeText(currentEmail.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInGmail = () => {
    if (!currentEmail) return;
    const url = getGmailComposeUrl(currentEmail);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadEml = () => {
    if (!currentEmail) return;
    downloadEmailAsEml(currentEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#561269] text-white shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Transactional Email Center
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider bg-violet-100 text-violet-800 uppercase">
                  Live Branded Templates
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated email dispatcher for Customers, Sellers, and Admins (SEMIX LABS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rendered</span>
              </button>
              <button
                onClick={() => setViewMode('html')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'html'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>

            {/* Open in Gmail */}
            <button
              onClick={handleOpenInGmail}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#ea4335] text-white hover:bg-[#d93025] rounded-xl transition-all shadow-xs"
              title="Open this pre-filled draft directly in Gmail"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Gmail</span>
            </button>

            {/* Download EML */}
            <button
              onClick={handleDownloadEml}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              title="Download as .eml email file"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Download .eml</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              title="Copy Raw HTML to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              aria-label="Close email preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: List of Queued / Sent Emails */}
          <div className="w-72 sm:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 overflow-y-auto p-3 space-y-2">
            <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sent & Queued Emails ({sentEmails.length})
            </div>

            {sentEmails.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                <Sparkles className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                No emails triggered yet. Place an order or assign a seller to see real-time emails!
              </div>
            ) : (
              sentEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isCustomer = email.recipientType === 'customer';
                const isAdmin = email.recipientType === 'admin';
                const isSeller = email.recipientType === 'seller';

                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all text-left ${
                      isSelected
                        ? 'bg-white border-[#561269] shadow-sm ring-1 ring-violet-300'
                        : 'bg-white/70 hover:bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          email.orderId === 'REGISTRATION'
                            ? 'bg-fuchsia-100 text-fuchsia-800'
                            : isCustomer
                            ? 'bg-emerald-100 text-emerald-800'
                            : isAdmin
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {email.orderId === 'REGISTRATION' ? (
                          <>
                            <Sparkles className="w-2.5 h-2.5" />
                            WELCOME
                          </>
                        ) : (
                          <>
                            {isCustomer && <User className="w-2.5 h-2.5" />}
                            {isAdmin && <ShieldAlert className="w-2.5 h-2.5" />}
                            {isSeller && <Building2 className="w-2.5 h-2.5" />}
                            {email.recipientType}
                          </>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {email.orderId === 'REGISTRATION' ? 'NEW USER' : `#${email.orderId}`}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {email.subject}
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      To: <span className="font-medium text-slate-700">{email.to.join(', ')}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-emerald-600 font-semibold uppercase">
                        Queued in Firestore
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Pane: Rendered Preview or HTML Code */}
          <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
            {currentEmail ? (
              <div className="flex flex-col h-full">
                {/* Email Metadata Top Ribbon */}
                <div className="bg-white px-6 py-3 border-b border-slate-200 shrink-0 text-xs text-slate-600 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800 w-16">Subject:</strong>
                        <span className="font-bold text-slate-900">{currentEmail.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800 w-16">Recipient:</strong>
                        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {currentEmail.recipientName} &lt;{currentEmail.to.join(', ')}&gt;
                        </span>
                        <span className="text-slate-400">• Firestore: <code className="text-violet-700 font-bold">mail/</code></span>
                      </div>
                    </div>

                    {/* Why not in Gmail? Guide Button */}
                    <button
                      onClick={() => setShowDeliveryGuide(!showDeliveryGuide)}
                      className="flex items-center gap-1.5 self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      <span>Why haven't I received this in my real Gmail?</span>
                      {showDeliveryGuide ? (
                        <ChevronUp className="w-3 h-3 text-amber-700" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-amber-700" />
                      )}
                    </button>
                  </div>

                  {/* Expandable Explanation & Setup Guide */}
                  {showDeliveryGuide && (
                    <div className="p-4 mt-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-slate-800 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wide">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>How Live Gmail Delivery Works</span>
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-900">
                          Target: {currentEmail.to.join(', ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {/* Option 1: 1-Click Draft */}
                        <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-2xs space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-700 text-[10px] font-black">1</span>
                            Instant Web Draft (No Setup)
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Click the red <strong className="text-red-700">"Open in Gmail"</strong> button at the top right. A compose window opens in your personal Gmail with the recipient and email draft pre-filled!
                          </p>
                        </div>

                        {/* Option 2: Live SMTP App Password */}
                        <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-2xs space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black">2</span>
                            Real Gmail SMTP Delivery
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            To send physical emails automatically over the internet, add your 16-character Google App Password in Settings as <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono">SMTP_PASS</code> (generated at <span className="font-mono text-blue-700">myaccount.google.com/apppasswords</span>).
                          </p>
                        </div>

                        {/* Option 3: Firebase Trigger Email */}
                        <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-2xs space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black">3</span>
                            Firebase Cloud Extension
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Every email is already queued in Firestore's <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono">mail/</code> collection. In your Firebase Console, install the official <strong>"Trigger Email from Firestore"</strong> extension.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email View (Iframe Render or Code View) */}
                <div className="flex-1 overflow-auto p-4 flex justify-center">
                  {viewMode === 'preview' ? (
                    <div className="w-full max-w-[660px] bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                      <iframe
                        title="Email HTML Preview"
                        srcDoc={currentEmail.html}
                        className="w-full h-full min-h-[620px] border-none"
                        sandbox="allow-same-origin allow-popups"
                      />
                    </div>
                  ) : (
                    <div className="w-full bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-auto">
                      <pre className="whitespace-pre-wrap">{currentEmail.html}</pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Select an email from the left sidebar to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
