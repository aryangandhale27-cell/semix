import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  GraduationCap, 
  Users, 
  Building2, 
  Briefcase,
  Zap
} from 'lucide-react';

interface BannerProps {
  onCopyCoupon?: (code: string) => void;
}

export const BannerIndiaLargest: React.FC<BannerProps> = ({ onCopyCoupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('10Electro');
    setCopied(true);
    if (onCopyCoupon) onCopyCoupon('10Electro');
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-gradient-to-br from-[#1b0324] via-[#380847] to-[#12001c] text-white overflow-hidden select-none">
      {/* Background ambient lighting and laser beams */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* Main Banner Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center flex-1 my-auto">
        {/* Left Column: Brand, Headline, Promo Offer & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-2.5 sm:space-y-3.5">
          {/* Top Brand Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-purple-400/40">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-[#1b0324] rounded-xs flex items-center justify-center">
                  <div className="w-2 h-2 rounded-xs bg-cyan-300" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wider text-white font-mono">SEMIX<span className="text-cyan-400">LABS</span></span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-purple-300 uppercase hidden xs:inline">
              COMPONENTS TODAY. BIGGER TOMORROW.
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-0.5">
            <p className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-cyan-300 uppercase">
              INDIA'S LARGEST
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
              COMPONENT <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">BRAND</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-lg leading-snug">
            Everything you need to Build, Innovate and Create.
          </p>

          {/* Categories Pill Bar */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-purple-200 font-mono">
            <span className="bg-purple-950/70 border border-purple-500/40 px-2 py-0.5 rounded-md">Components</span>
            <span className="text-purple-400">•</span>
            <span className="bg-purple-950/70 border border-purple-500/40 px-2 py-0.5 rounded-md">Modules</span>
            <span className="text-purple-400">•</span>
            <span className="bg-purple-950/70 border border-purple-500/40 px-2 py-0.5 rounded-md">Tools</span>
            <span className="text-purple-400">•</span>
            <span className="bg-purple-950/70 border border-purple-500/40 px-2 py-0.5 rounded-md">Accessories</span>
            <span className="text-purple-400">•</span>
            <span className="text-cyan-300 font-bold">And More</span>
          </div>

          {/* Coupon & CTA Block */}
          <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Coupon Box */}
            <div className="flex items-center gap-2 bg-[#12001c]/80 border border-purple-500/60 rounded-xl p-1.5 sm:p-2 backdrop-blur-md shadow-lg shadow-purple-950/40">
              <div className="px-1.5">
                <span className="block text-[8px] sm:text-[9px] font-mono text-purple-300 uppercase tracking-wider">USE CODE</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs sm:text-sm font-mono font-extrabold text-white bg-purple-900/60 hover:bg-purple-800/80 px-2 py-0.5 rounded border border-purple-400/40 transition-colors cursor-pointer"
                  title="Click to copy coupon code"
                >
                  <span>10Electro</span>
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-300" />}
                </button>
              </div>

              <div className="border-l border-purple-500/40 pl-2 pr-1">
                <span className="block text-[8px] sm:text-[9px] font-mono text-purple-300 uppercase">TO GET</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm sm:text-base font-black text-white">10% OFF*</span>
                </div>
                <span className="block text-[7px] sm:text-[8px] text-purple-300/80">*Orders above ₹500</span>
              </div>
            </div>

            {/* Shop Now CTA Button */}
            <Link
              to="/catalog"
              className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg shadow-purple-950/80 border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200" />
            </Link>
          </div>
        </div>

        {/* Right Column: Exploding Component Box & Badges Showcase */}
        <div className="lg:col-span-5 relative flex items-center justify-center pt-2 lg:pt-0">
          {/* Floating Starburst Promo Badge */}
          <div className="absolute -top-3 -right-2 sm:top-0 sm:right-2 z-20">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#FF6B00] via-amber-400 to-[#FF6B00] text-slate-950 rounded-full flex flex-col items-center justify-center p-1 text-center font-black shadow-xl shadow-orange-950/60 rotate-12 border-2 border-yellow-200 animate-pulse">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-tighter leading-none">UP TO</span>
                <span className="text-xs sm:text-base font-black leading-tight">25% OFF</span>
                <span className="text-[6px] sm:text-[7px] uppercase leading-none font-bold">ON SELECT ITEMS</span>
              </div>
            </div>
          </div>

          {/* Exploding Hardware Kit Box Visual */}
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center">
            {/* Radiant Laser Burst Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-cyan-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Central Exploding Box Illustration */}
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="piGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#166534" />
                </linearGradient>
                <linearGradient id="unoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient id="laserRays" x1="50%" y1="50%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Laser Energy Rays */}
              <g stroke="url(#laserRays)" strokeWidth="2" strokeDasharray="4 4" opacity="0.6">
                <line x1="200" y1="220" x2="60" y2="80" />
                <line x1="200" y1="220" x2="120" y2="40" />
                <line x1="200" y1="220" x2="200" y2="30" />
                <line x1="200" y1="220" x2="280" y2="40" />
                <line x1="200" y1="220" x2="340" y2="80" />
                <line x1="200" y1="220" x2="370" y2="160" />
                <line x1="200" y1="220" x2="30" y2="160" />
              </g>

              {/* Floating Arduino Uno Board (Left) */}
              <g transform="translate(70, 110) rotate(-15)">
                <rect width="90" height="60" rx="4" fill="url(#unoGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="6" y="8" width="18" height="14" fill="#94a3b8" rx="2" />
                <rect x="60" y="8" width="14" height="20" fill="#0f172a" rx="1" />
                <rect x="30" y="28" width="30" height="10" fill="#0f172a" rx="1" />
                <text x="32" y="20" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">UNO R3</text>
                {/* Header Pins */}
                <circle cx="8" cy="52" r="1.5" fill="#facc15" />
                <circle cx="16" cy="52" r="1.5" fill="#facc15" />
                <circle cx="24" cy="52" r="1.5" fill="#facc15" />
                <circle cx="32" cy="52" r="1.5" fill="#facc15" />
                <circle cx="40" cy="52" r="1.5" fill="#facc15" />
                <circle cx="48" cy="52" r="1.5" fill="#facc15" />
              </g>

              {/* Floating Raspberry Pi Board (Center Top) */}
              <g transform="translate(160, 60) rotate(5)">
                <rect width="85" height="55" rx="4" fill="url(#piGrad)" stroke="#4ade80" strokeWidth="1.5" />
                <rect x="60" y="10" width="20" height="15" fill="#94a3b8" rx="2" />
                <rect x="60" y="30" width="20" height="15" fill="#94a3b8" rx="2" />
                <rect x="25" y="18" width="22" height="22" fill="#cbd5e1" rx="2" />
                <circle cx="36" cy="29" r="6" fill="#166534" />
                <text x="12" y="14" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">Pi 5</text>
                {/* 40 Pin GPIO Header */}
                <rect x="8" y="4" width="46" height="4" fill="#0f172a" stroke="#facc15" strokeWidth="0.5" />
              </g>

              {/* Ultrasonic Sensor HC-SR04 (Top Left) */}
              <g transform="translate(130, 30) rotate(-8)">
                <rect width="55" height="28" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="16" cy="14" r="9" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                <circle cx="16" cy="14" r="4" fill="#0f172a" />
                <circle cx="39" cy="14" r="9" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                <circle cx="39" cy="14" r="4" fill="#0f172a" />
              </g>

              {/* 0.96" OLED Display (Top Right) */}
              <g transform="translate(260, 45) rotate(15)">
                <rect width="50" height="40" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <rect x="6" y="8" width="38" height="24" rx="1" fill="#083344" />
                <text x="10" y="22" fill="#22d3ee" fontSize="6" fontFamily="monospace" fontWeight="bold">Ideas Build</text>
                <text x="10" y="29" fill="#22d3ee" fontSize="5" fontFamily="monospace">Tomorrow</text>
              </g>

              {/* Stepper Motor & NEMA (Right) */}
              <g transform="translate(270, 130) rotate(-10)">
                <rect width="45" height="45" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="22.5" cy="22.5" r="14" fill="#475569" />
                <circle cx="22.5" cy="22.5" r="4" fill="#e2e8f0" />
                <rect x="20" y="4" width="5" height="6" fill="#cbd5e1" />
              </g>

              {/* Breadboard & Discrete Components (Right Bottom) */}
              <g transform="translate(250, 175) rotate(18)">
                <rect width="70" height="35" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="10" y1="8" x2="60" y2="8" stroke="#ef4444" strokeWidth="1" />
                <line x1="10" y1="27" x2="60" y2="27" stroke="#3b82f6" strokeWidth="1" />
              </g>

              {/* Glowing LEDs & Jumper Wires */}
              <circle cx="110" cy="180" r="5" fill="#22c55e" filter="drop-shadow(0 0 6px #22c55e)" />
              <circle cx="230" cy="165" r="5" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
              <circle cx="180" cy="120" r="6" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)" />

              {/* Semix Parcel Delivery Box */}
              <g transform="translate(100, 210)">
                {/* Back flap */}
                <polygon points="40,20 160,20 180,0 20,0" fill="#92400e" opacity="0.8" />
                {/* Main Box Body */}
                <rect x="20" y="20" width="160" height="110" rx="4" fill="url(#boxGrad)" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Left Open Flap */}
                <polygon points="20,20 0,0 20,-10 40,20" fill="#b45309" />
                {/* Right Open Flap */}
                <polygon points="180,20 200,0 180,-10 160,20" fill="#b45309" />
                {/* Front Semix Box Brand Print */}
                <rect x="45" y="45" width="110" height="60" rx="4" fill="#78350f" opacity="0.6" />
                {/* Chip Emblem on Box */}
                <rect x="55" y="55" width="20" height="20" rx="2" fill="#1b0324" stroke="#a855f7" strokeWidth="1" />
                <rect x="62" y="62" width="6" height="6" fill="#22d3ee" />
                <text x="82" y="68" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">SEMIX</text>
                <text x="82" y="78" fill="#cbd5e1" fontSize="7" fontWeight="bold" fontFamily="sans-serif">LABS</text>
                <text x="55" y="94" fill="#fde68a" fontSize="5.5" fontWeight="bold" fontFamily="monospace">COMPONENTS TODAY. BIGGER TOMORROW.</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Demographics & Trust Assurance Strip */}
      <div className="relative z-10 pt-2 border-t border-purple-500/30 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
        {/* Audience Badges */}
        <div className="flex items-center gap-2 sm:gap-3 text-purple-200">
          <span className="flex items-center gap-1 font-medium"><GraduationCap className="w-3 h-3 text-cyan-400" /> Students</span>
          <span className="flex items-center gap-1 font-medium"><Users className="w-3 h-3 text-purple-300" /> Makers</span>
          <span className="flex items-center gap-1 font-medium"><Building2 className="w-3 h-3 text-cyan-300" /> Engineers</span>
          <span className="flex items-center gap-1 font-medium hidden sm:flex"><Briefcase className="w-3 h-3 text-amber-400" /> Businesses</span>
        </div>

        {/* Indian Flag & Service Promise */}
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Genuine
          </span>
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            <Truck className="w-3 h-3 text-cyan-400" /> Fast Delivery
          </span>
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[#FF6B00] font-bold">
            🇮🇳 India's Maker Hub
          </span>
        </div>
      </div>
    </div>
  );
};
