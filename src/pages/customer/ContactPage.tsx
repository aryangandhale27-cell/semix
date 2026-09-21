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
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { OurTeamSection } from '../../components/about/OurTeamSection';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Active view tab: 'all' | 'about' | 'contact'
  const [activeTab, setActiveTab] = useState<'all' | 'about' | 'contact'>(() => {
    if (location.pathname === '/about' || location.hash === '#about' || location.hash === '#about-us') {
      return 'about';
    }
    if (location.hash === '#contact' || location.hash === '#contact-desk') {
      return 'contact';
    }
    return 'all';
  });

  // Sync tab with URL changes
  useEffect(() => {
    if (location.pathname === '/about' || location.hash === '#about' || location.hash === '#about-us') {
      setActiveTab('about');
      const el = document.getElementById('about-us');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (location.hash === '#contact' || location.hash === '#contact-desk') {
      setActiveTab('contact');
      const el = document.getElementById('contact-desk');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setActiveTab('all');
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span className="text-[#561269]">SEMIX LABS</span>
              <span>/</span>
              <span>Hardware Desk & Company Info</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'about' ? 'About Semix Labs' : activeTab === 'contact' ? 'Contact & Engineering Desk' : 'About Us & Contact Desk'}
            </h1>
          </div>

          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('all');
                navigate('/contact');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#561269] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Full Desk
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                scrollToSection('about-us');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-[#561269] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Us</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('contact');
                scrollToSection('contact-desk');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'contact'
                  ? 'bg-[#FF6B00] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ABOUT SEMIX LABS SECTION (Visible when tab is 'about' or 'all')           */}
        {/* ========================================================================= */}
        {(activeTab === 'about' || activeTab === 'all') && (
          <section id="about-us" className="space-y-10 scroll-mt-20">
            
            {/* 1. Company Overview Banner */}
            <div className="bg-gradient-to-br from-[#561269] via-[#380847] to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden border border-[#561269]/40">
              {/* Subtle Ambient Decorative Circles */}
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-4xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                  <span>About Semix Labs</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Empowering Next-Gen <span className="text-[#FF6B00]">Hardware Innovation</span>
                </h2>
                
                <p className="text-sm sm:text-base lg:text-lg text-purple-100 leading-relaxed max-w-3xl">
                  Semix Labs is a premier one-stop destination for electronic components, high-density PCB prototyping, 3D printing, and engineering development tools for makers, startups, and industrial R&D. We empower the creators of tomorrow with authentic hardware, lightning-fast turnaround, and dedicated technical expertise.
                </p>

                {/* Quick Action Navigation Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/shop"
                    className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
                  >
                    <Package className="w-4 h-4" />
                    <span>Explore 1,000+ Components</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/services"
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all"
                  >
                    <Layers className="w-4 h-4 text-cyan-300" />
                    <span>Rapid PCB & 3D Prototyping</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => scrollToSection('meet-our-team')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span>Meet Our Team</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact-desk')}
                    className="px-4 py-2.5 text-purple-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Talk to an Engineer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Quick Company Stats / Milestones Strip */}
            <div id="about-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-3">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  1,000+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  Components & Boards in Stock
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Ready-to-dispatch microcontrollers, sensors, ICs & development kits.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  24-48 Hours
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  Express Dispatch Guarantee
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Same-day processing before 4 PM with pan-India express courier partners.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  10,000+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  Engineers & Teams Powered
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Trusted by university labs, IoT innovators, and robotics clubs nationwide.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#561269]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
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

            {/* 3. Core Features / Value Highlights Grid */}
            <div id="about-features" className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Feature 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#FF6B00]/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
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
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#561269]/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center">
                      <Layers className="w-6 h-6" />
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
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Truck className="w-6 h-6" />
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
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Wrench className="w-6 h-6" />
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

            {/* 4. Leadership & Core Team Section */}
            <OurTeamSection />
          </section>
        )}

        {/* Divider if showing both */}
        {activeTab === 'all' && (
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Support & Contact Desk
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONTACT & SUPPORT DESK SECTION (Visible when tab is 'contact' or 'all')    */}
        {/* ========================================================================= */}
        {(activeTab === 'contact' || activeTab === 'all') && (
          <section id="contact-desk" className="space-y-10 scroll-mt-20">
            
            {/* Header if only contact tab is active */}
            {activeTab === 'contact' && (
              <div className="bg-gradient-to-br from-[#561269] via-[#380847] to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-[#561269]/40">
                <div className="relative z-10 max-w-3xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Engineering Support & Sourcing Desk</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                    Get in Touch with <span className="text-[#FF6B00]">SEMIX LABS</span>
                  </h2>
                  <p className="text-sm sm:text-base text-purple-200 leading-relaxed max-w-2xl">
                    Have questions about component availability, custom fabrication, bulk sourcing, or your orders? Our technical team is ready to assist you.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Direct Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Direct Support */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-[#561269]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center">
                  <Phone className="w-6 h-6" />
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
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-[#561269]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#561269]/5 text-[#561269] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Email Desks</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Response within 2-4 business hours</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">B2B & Bulk Quotations:</span>
                    <a href="mailto:office@semixlabs.com" className="font-bold text-[#561269] hover:underline text-sm font-mono">
                      office@semixlabs.com
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Orders & Technical Support:</span>
                    <a href="mailto:office@semixlabs.com" className="font-bold text-slate-700 hover:underline font-mono">
                      office@semixlabs.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3: Central Warehouse & Hub */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-[#561269]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#561269] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Central Hub & Logistics</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Fulfillment & Quality Dispatch</p>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">SEMIX LABS Electronics HQ</p>
                  <p>Crystal Towers, Govind Nagar,</p>
                  <p>Pune Solapur Road, Pune, Maharashtra - 411028</p>
                </div>
              </div>
            </div>

            {/* Contact Form & Quick Sourcing Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us an Engineering Message</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Fill out the form below and an applications engineer will review your project specifications.
                </p>

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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Patil"
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
                          placeholder="e.g. rahul@example.com"
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
                          placeholder="e.g. +91 98765 43210"
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
                        placeholder="Tell us what you're working on or what components you are looking for..."
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

              {/* Quick Hub Links & Timings */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#561269] to-[#380847] text-white rounded-2xl p-6 shadow-md space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                    <span>Need Bulk Components?</span>
                  </h4>
                  <p className="text-xs text-purple-200 leading-relaxed">
                    If you have a multi-component bill of materials, use our dedicated Bulk Enquiry desk to upload CSVs and get discounted reel volume pricing.
                  </p>
                  <Link
                    to="/bulk-enquiry"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  >
                    <span>Launch Bulk Enquiry Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#561269]" />
                    <span>Warehouse Timings</span>
                  </h4>
                  <div className="text-xs text-slate-600 space-y-2">
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
                      <span className="text-amber-600 font-semibold">Dispatch Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
