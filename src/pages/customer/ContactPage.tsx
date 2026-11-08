import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Truck,
  Layers,
  Package,
  Users,
  Award,
  Wrench,
  Cpu,
  Boxes,
  FileSpreadsheet,
  Info,
  PhoneCall,
  ArrowRight,
  HelpCircle,
  Copy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { OurTeamSection } from '../../components/about/OurTeamSection';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'about' | 'contact'>(() => {
    if (location.pathname === '/about' || location.hash === '#about' || location.hash === '#about-us') {
      return 'about';
    }
    return 'contact';
  });

  // Sync tab with URL changes
  useEffect(() => {
    const isAbout = location.pathname === '/about' || location.hash.startsWith('#about');
    setActiveTab(isAbout ? 'about' : 'contact');

    const targetId = location.hash === '#about' ? 'about-us'
      : location.hash === '#contact' ? 'contact-desk'
        : location.hash.slice(1);
    if (targetId && targetId !== 'about-us' && targetId !== 'contact-desk') {
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.pathname, location.hash]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Incomplete Form', 'Please fill in all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Message Sent', 'Our engineering team will respond within 24 hours.', 'success');
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('office@semixlabs.com');
      showToast('Email Copied', 'office@semixlabs.com copied to clipboard.', 'success');
    } catch {
      showToast('Copy Failed', 'Select the email address and copy it manually.', 'error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-3 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-10">
        
        {/* Navigation Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-4 border-b border-slate-200 pb-6 sm:pb-4">
          <div className="flex items-center gap-3">
            <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white shadow-md sm:h-12 sm:w-12 ${
              activeTab === 'about'
                ? 'bg-gradient-to-br from-[#561269] via-[#7e22ce] to-[#c084fc] shadow-purple-900/20'
                : 'bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fdba74] shadow-orange-900/20'
            }`}>
              <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full border border-white/30" />
              {activeTab === 'about'
                ? <Cpu className="relative h-5 w-5 sm:h-6 sm:w-6" />
                : <PhoneCall className="relative h-5 w-5 sm:h-6 sm:w-6" />}
            </span>
            <span className="block">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'about' ? 'About Semix Labs' : 'Contact & Engineering Desk'}
            </h1>
              <span className={`mt-1 block h-1 w-12 rounded-full bg-gradient-to-r ${
                activeTab === 'about' ? 'from-[#561269] to-[#c084fc]' : 'from-[#ea580c] to-[#fdba74]'
              }`} />
            </span>
          </div>

          <div className="flex w-full items-center gap-1.5 p-1 bg-slate-200/80 rounded-lg sm:w-auto sm:gap-0 sm:p-1 sm:rounded-xl">
            <button
              onClick={() => {
                navigate('/about');
              }}
              className={`flex-1 justify-center px-3 py-2.5 rounded-md text-xs leading-tight sm:flex-none sm:px-3.5 sm:py-1.5 sm:rounded-lg sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-[#561269] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
              <span>About Us</span>
            </button>
            <button
              onClick={() => {
                navigate('/contact');
              }}
              className={`flex-1 justify-center px-3 py-2.5 rounded-md text-xs leading-tight sm:flex-none sm:px-3.5 sm:py-1.5 sm:rounded-lg sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-1.5 ${
                activeTab === 'contact'
                  ? 'bg-[#FF6B00] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ABOUT SEMIX LABS SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'about' && (
          <section id="about-us" className="space-y-6 sm:space-y-10 scroll-mt-20">
            
            {/* Quick Company Stats / Milestones Strip */}
            <div id="about-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-2 sm:mb-3">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  15,000+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  Components & Boards in Stock
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Ready-to-dispatch microcontrollers, sensors, ICs & development kits.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center mb-2 sm:mb-3">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  24-48 Hours
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  Express Dispatch Guarantee
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Same-day processing before 4 PM with pan-India express courier partners.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 sm:mb-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  10,000+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  Engineers & Teams Powered
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Trusted by university labs, IoT innovators, and robotics clubs nationwide.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 sm:mb-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  99.8%
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  Quality Assurance Rating
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  ESD-safe handling, certified batch testing, and genuine manufacturer traceability.
                </p>
              </div>
            </div>

            {/* Core Features / Value Highlights Grid */}
            <div id="about-features" className="space-y-4 sm:space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#561269] text-xs font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5 text-[#561269]" />
                  <span>Why Hardware Innovators Choose Us</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Built by Engineers, for Engineers
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Every component in our warehouse undergoes multi-point inspection to ensure your prototypes function reliably from bench to field.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {/* Feature 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:border-[#FF6B00]/40 hover:shadow-md transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] text-[10px] font-bold uppercase tracking-wide">
                      100% Original
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Certified &amp; Genuine Components
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      100% verified original ICs, microcontrollers, sensors, and passives sourced directly from authorized Tier-1 distributors.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Zero counterfeit guarantee</span>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:border-[#561269]/40 hover:shadow-md transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center">
                      <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-[#561269] text-[10px] font-bold uppercase tracking-wide">
                      Rapid Turnaround
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Rapid Prototyping &amp; Custom Fab
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      High-density PCB fabrication, SMD assembly, 3D enclosures, and turnkey hardware integration delivered in record turnaround times.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Gerber &amp; STL Instant DFM</span>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                      Express Shipping
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Pan-India Express Dispatch
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Multi-hub dispatch network with automated ESD-safe packaging and same-day dispatch for critical project milestones.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Real-time courier tracking</span>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wide">
                      Expert Guidance
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Technical Engineering Support
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Expert hardware engineers assisting with datasheets, alternative component sourcing, and design-for-manufacturing (DFM) reviews.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Live hardware support desk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership & Core Team Section */}
            <OurTeamSection />
          </section>
        )}

        {/* ========================================================================= */}
        {/* CONTACT & SUPPORT DESK SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <section id="contact-desk" className="space-y-6 sm:space-y-10 scroll-mt-20">
            
            {/* Header if only contact tab is active */}
            {activeTab === 'contact' && (
              <div className="bg-gradient-to-br from-[#561269] via-[#380847] to-slate-950 rounded-2xl sm:rounded-3xl p-4 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-[#561269]/40">
                <div className="relative z-10 max-w-3xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Engineering Support & Sourcing Desk</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                    Get in Touch with <span className="text-[#FF6B00]">SEMIX LABS</span>
                  </h2>
                  <p className="text-xs sm:text-base text-purple-200 leading-relaxed max-w-2xl">
                    Have questions about component availability, custom fabrication, bulk sourcing, or your orders? Our technical team is ready to assist you.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Direct Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              {/* Card 1: Direct Support */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4 hover:border-[#561269]/40 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Direct Phone / WhatsApp</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Mon - Sat: 9:00 AM – 7:30 PM IST</p>
                </div>
                <div className="space-y-1 text-xs font-semibold text-slate-700">
                  <a href="tel:+917666601086" className="text-[#561269] font-bold text-base hover:underline block font-mono">
                    +91 7666601086
                  </a>
                  <p className="text-slate-500">Toll-Free Hardware Helpline</p>
                </div>
                <a
                  href="https://wa.me/917666601086"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Card 2: Email Inquiries */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4 hover:border-[#561269]/40 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#561269]/5 text-[#561269] flex items-center justify-center">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Email Desks</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Response within 2-4 business hours</p>
                </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="mailto:office@semixlabs.com"
                      className="font-bold text-[#561269] hover:underline text-sm font-mono"
                    >
                      office@semixlabs.com
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-[#561269]/40 hover:text-[#561269]"
                      aria-label="Copy office@semixlabs.com"
                      title="Copy email address"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>
                </div>

              {/* Card 3: Central Warehouse & Hub */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4 hover:border-[#561269]/40 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Central Hub & Logistics</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Fulfillment & Quality Dispatch</p>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">SEMIX LABS Electronics HQ</p>
                  <p>G35 Towers, PCMC Chowk,</p>
                  <p>Pimpri Chinchwad, Pune</p>
                </div>
              </div>
            </div>

            {/* Warehouse details and bulk enquiry shortcut */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Clock className="h-4 w-4 text-[#561269]" />
                  <span>Warehouse Timings</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Monday – Friday:</span>
                    <span className="font-semibold text-slate-800">8:30 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Saturday:</span>
                    <span className="font-semibold text-slate-800">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Sunday:</span>
                    <span className="font-semibold text-amber-600">Dispatch Only</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-gradient-to-br from-[#561269] to-[#380847] p-4 text-white shadow-md sm:p-6">
                <h4 className="flex items-center gap-2 text-base font-bold text-white">
                  <Sparkles className="h-4 w-4 text-[#FF6B00]" />
                  <span>Need Bulk Components?</span>
                </h4>
                <p className="text-xs leading-relaxed text-purple-200">
                  Source multiple components for your bill of materials with CSV upload and volume pricing.
                </p>
                <Link
                  to="/bulk-enquiry"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#e05e00]"
                >
                  <span>Launch Bulk Enquiry Desk</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Engineering Message Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us an Engineering Message</h3>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-lg font-bold text-slate-900">Message Received!</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Thank you for reaching out. We have logged your request and an engineer will get back to you shortly at <strong className="text-slate-900">{formData.email}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-5 py-2.5 bg-[#561269] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#460e56] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#561269] focus:ring-1 focus:ring-[#561269] outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#561269] focus:ring-1 focus:ring-[#561269] outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#561269] focus:ring-1 focus:ring-[#561269] outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#561269] focus:ring-1 focus:ring-[#561269] outline-hidden bg-white"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Order Tracking">Order Tracking & Dispatch</option>
                          <option value="Component Technical Specs">Component Technical Specs</option>
                          <option value="PCB & 3D Fabrication">PCB & 3D Fabrication</option>
                          <option value="Bulk Procurement">Bulk Procurement</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Message / Project Details *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#561269] focus:ring-1 focus:ring-[#561269] outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </div>
          </section>
        )}
      </div>
    </div>
  );
};
