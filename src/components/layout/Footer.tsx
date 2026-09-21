import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { SemixLabsLogo } from '../common/SemixLabsLogo';

// External Privacy Policy / Document Link (opens in a new tab with target="_blank" rel="noopener noreferrer")
export const PRIVACY_POLICY_URL = 'https://udyamregistration.gov.in';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-[#0a0410] text-slate-300 border-t border-white/10 mt-16 font-sans">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-8">
          
          {/* Column 1: Semix Labs branding and contact details */}
          <div className="lg:col-span-5 sm:col-span-2 lg:pr-8 space-y-4 sm:space-y-6">
            <div className="flex items-center min-h-12 sm:min-h-20">
              <Link to="/" aria-label="SEMIX LABS home" className="inline-flex rounded-xl bg-white p-1.5 sm:p-2 shadow-lg shadow-black/20 hover:bg-slate-100 transition-colors">
                <SemixLabsLogo variant="full" size="xl" className="max-w-full" />
              </Link>
            </div>

            {/* Description / Subtext */}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              <strong className="text-slate-200 font-semibold">SEMIX LABS</strong> is a specialized electronics engineering, turnkey IoT prototyping, and verified component procurement platform — an initiative powered by <strong className="text-purple-300 font-semibold">RIETZZ</strong> Prime Ventures.
            </p>

            {/* Outlined Contact Info with Purple/Violet Accents */}
            <div className="space-y-2.5 sm:space-y-3.5 text-sm pt-0.5 sm:pt-1">
              {/* Corporate HQ Address */}
              <div className="flex items-start gap-3 text-slate-300 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#561269]/20 border border-[#a855f7]/40 text-[#c084fc] flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:border-[#a855f7] group-hover:bg-[#561269]/30">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
                </div>
                <div className="leading-snug text-xs sm:text-sm text-slate-300">
                  <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider mb-0.5 text-[#dfb5e9]">
                    Corporate HQ / Office Address
                  </span>
                  Crystal Towers, Govind Nagar,<br />
                  Pune Solapur Road, Pune
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#561269]/20 border border-[#a855f7]/40 text-[#c084fc] flex items-center justify-center shrink-0 transition-colors group-hover:border-[#a855f7] group-hover:bg-[#561269]/30">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
                </div>
                <a 
                  href="tel:+917666601086" 
                  className="text-xs sm:text-sm font-mono text-slate-200 hover:text-white transition-colors"
                >
                  +91 7666601086
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#561269]/20 border border-[#a855f7]/40 text-[#c084fc] flex items-center justify-center shrink-0 transition-colors group-hover:border-[#a855f7] group-hover:bg-[#561269]/30">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
                </div>
                <a 
                  href="mailto:office@semixlabs.com" 
                  className="text-xs sm:text-sm font-mono font-semibold text-[#c084fc] hover:text-white hover:underline transition-all"
                >
                  office@semixlabs.com
                </a>
              </div>
            </div>

            {/* Official MSME Enterprise Verification Tag (from Udyam Registration Certificate) */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Govt. of India Registered MSME: <span className="font-mono text-slate-300">UDYAM-MH-26-0828789</span></span>
            </div>
          </div>

          {/* Column 2: COMPANY (lg:col-span-2) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
              COMPANY
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/about#about-features" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  Our Capabilities
                </Link>
              </li>
              <li>
                <Link to="/about#about-stats" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  Why Semix Labs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  Contact Us & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: INFORMATION (lg:col-span-3) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
              INFORMATION
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  Support
                </Link>
              </li>
              <li>
                {/* Privacy Policy external link with target="_blank" rel="noopener noreferrer" */}
                <a 
                  href={PRIVACY_POLICY_URL}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#c084fc] transition-colors inline-flex items-center gap-1.5 group/privacy"
                >
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#a855f7] opacity-70 group-hover/privacy:opacity-100 group-hover/privacy:translate-x-0.5 group-hover/privacy:-translate-y-0.5 transition-all" />
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-[#c084fc] transition-colors block">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT (lg:col-span-2) */}
          <div className="lg:col-span-2 sm:col-span-2 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
              CONTACT
            </h4>
            <ul className="space-y-2 sm:space-y-3.5 text-sm">
              <li>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
                  Phone
                </span>
                <a 
                  href="tel:+917666601086"
                  className="text-xs sm:text-sm font-mono text-slate-300 hover:text-[#c084fc] transition-colors block"
                >
                  +91 7666601086
                </a>
              </li>
              <li>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
                  Email
                </span>
                <a 
                  href="mailto:office@semixlabs.com"
                  className="text-xs sm:text-sm font-mono text-[#c084fc] hover:text-white transition-colors block break-all font-medium"
                >
                  office@semixlabs.com
                </a>
              </li>
              <li>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
                  Office Location
                </span>
                <span className="text-xs sm:text-sm text-slate-300 block">
                  Crystal Towers, Govind Nagar, Pune Solapur Road, Pune
                </span>
              </li>
              <li className="pt-1">
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#561269]/30 border border-[#a855f7]/50 text-[#c084fc] hover:bg-[#561269] hover:text-white transition-all shadow-sm group"
                >
                  <span>Contact Support</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="border-t border-white/10 bg-[#06020b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left text-slate-400">
            © 2026 <strong className="text-slate-300 font-medium">SEMIX LABS</strong> — An Initiative Powered by <strong className="text-purple-300 font-medium">RIETZZ</strong> Prime Ventures. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <a 
              href={PRIVACY_POLICY_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Privacy</span>
              <ArrowUpRight className="w-3 h-3 text-[#a855f7] opacity-60" />
            </a>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Customer Care</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
