import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Cpu, 
  Radio, 
  Layers, 
  Zap 
} from 'lucide-react';

interface BannerProps {
  onCopyCoupon?: (code: string) => void;
}

export const BannerTopBrands: React.FC<BannerProps> = ({ onCopyCoupon }) => {
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
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-gradient-to-br from-[#1e052c] via-[#3d0d52] to-[#140220] text-white overflow-hidden select-none">
      {/* Subtle geometric grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center flex-1 my-auto">
        {/* Left Column: Brand Headings, Value Propositions & Coupon */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-2.5 sm:space-y-3.5">
          {/* Top Brand Tag */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-purple-400/40">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#1e052c] rounded-xs flex items-center justify-center">
                  <div className="w-2 h-2 rounded-xs bg-cyan-300" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wider text-white font-mono">SEMIX<span className="text-cyan-400">LABS</span></span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-purple-300 uppercase hidden xs:inline">
              COMPONENTS TODAY. BIGGER TOMORROW.
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-0.5">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
              TOP BRANDS
            </h2>
            <div className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-cyan-400 via-purple-300 to-[#FF6B00] bg-clip-text text-transparent">
              LOWEST PRICES
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-lg leading-snug">
            Get genuine electronics components at the best prices, delivered fast across India.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs">
            <span className="flex items-center gap-1 bg-purple-950/80 border border-purple-400/50 px-2.5 py-1 rounded-full text-purple-200 shadow-xs">
              <Tag className="w-3 h-3 text-[#FF6B00]" /> Lowest Prices
            </span>
            <span className="flex items-center gap-1 bg-purple-950/80 border border-purple-400/50 px-2.5 py-1 rounded-full text-cyan-200 shadow-xs">
              <Truck className="w-3 h-3 text-cyan-400" /> Fast Delivery
            </span>
            <span className="flex items-center gap-1 bg-purple-950/80 border border-purple-400/50 px-2.5 py-1 rounded-full text-emerald-200 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Genuine Components
            </span>
          </div>

          {/* Coupon & CTA Block */}
          <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
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

            <Link
              to="/catalog"
              className="bg-gradient-to-r from-cyan-600 via-purple-600 to-[#FF6B00] hover:from-cyan-500 hover:to-[#FF6B00] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg shadow-purple-950/80 border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200" />
            </Link>
          </div>
        </div>

        {/* Right Column: 4 Top Brands on Stepped Pedestals */}
        <div className="lg:col-span-6 relative flex items-center justify-center pt-2 lg:pt-0">
          <div className="w-full max-w-lg grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {/* 1. Raspberry Pi Podium Card */}
            <div className="relative group p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-900/90 to-purple-950/90 border border-purple-500/30 hover:border-emerald-400/60 transition-all shadow-lg hover:shadow-emerald-950/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg">🍓</span>
                  <span className="text-[11px] sm:text-xs font-bold font-mono text-white">Raspberry Pi</span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">Official</span>
              </div>

              {/* Hardware Silhouette Representation */}
              <div className="h-16 sm:h-20 w-full rounded-lg bg-emerald-950/40 border border-emerald-500/20 p-2 flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-transform">
                <div className="w-14 h-10 rounded bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center relative">
                  <div className="w-4 h-4 bg-slate-800 rounded-xs flex items-center justify-center text-[7px] font-mono text-slate-300">ARM</div>
                  <div className="absolute top-1 right-1 w-2.5 h-3 bg-slate-300 rounded-xs" />
                  <div className="absolute bottom-1 left-1 w-8 h-1 bg-yellow-400 rounded-xs" />
                </div>
              </div>

              <p className="mt-1.5 text-[9px] sm:text-[10px] text-slate-300 font-medium truncate">
                Explore. Innovate. Grow.
              </p>
            </div>

            {/* 2. Arduino Podium Card */}
            <div className="relative group p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-900/90 to-purple-950/90 border border-purple-500/30 hover:border-cyan-400/60 transition-all shadow-lg hover:shadow-cyan-950/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg text-cyan-400">♾️</span>
                  <span className="text-[11px] sm:text-xs font-bold font-mono text-white">Arduino</span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">Standard</span>
              </div>

              <div className="h-16 sm:h-20 w-full rounded-lg bg-cyan-950/40 border border-cyan-500/20 p-2 flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-transform">
                <div className="w-14 h-10 rounded bg-cyan-700/80 border border-cyan-400/40 flex items-center justify-center relative">
                  <div className="w-6 h-2.5 bg-slate-900 rounded-xs text-[6px] font-mono text-cyan-300 flex items-center justify-center">ATMEGA</div>
                  <div className="absolute top-1 left-1 w-3 h-2 bg-slate-300 rounded-xs" />
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-slate-800 rounded-xs" />
                </div>
              </div>

              <p className="mt-1.5 text-[9px] sm:text-[10px] text-slate-300 font-medium truncate">
                Build Without Limits
              </p>
            </div>

            {/* 3. ESP32 Podium Card */}
            <div className="relative group p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-900/90 to-purple-950/90 border border-purple-500/30 hover:border-orange-400/60 transition-all shadow-lg hover:shadow-orange-950/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span className="text-[11px] sm:text-xs font-bold font-mono text-white">ESP32</span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono text-orange-400 bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-500/30">WiFi+BLE</span>
              </div>

              <div className="h-16 sm:h-20 w-full rounded-lg bg-orange-950/30 border border-orange-500/20 p-2 flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-transform">
                <div className="w-12 h-11 rounded bg-slate-900 border border-slate-700 flex flex-col items-center justify-center relative p-1">
                  <div className="w-7 h-5 bg-slate-300 rounded-xs flex items-center justify-center text-[5px] font-mono text-slate-900 font-bold">WROOM</div>
                  <div className="w-full flex justify-between mt-1 px-1">
                    <div className="w-1 h-1 rounded-full bg-orange-500" />
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                  </div>
                </div>
              </div>

              <p className="mt-1.5 text-[9px] sm:text-[10px] text-slate-300 font-medium truncate">
                Connect to the Future
              </p>
            </div>

            {/* 4. STM32 Podium Card */}
            <div className="relative group p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-900/90 to-purple-950/90 border border-purple-500/30 hover:border-purple-400/60 transition-all shadow-lg hover:shadow-purple-950/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[11px] sm:text-xs font-bold font-mono text-white">STM</span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">32-Bit ARM</span>
              </div>

              <div className="h-16 sm:h-20 w-full rounded-lg bg-purple-950/40 border border-purple-500/20 p-2 flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-transform">
                <div className="w-14 h-10 rounded bg-slate-100 border border-purple-400/40 flex items-center justify-center relative">
                  <div className="w-5 h-5 bg-slate-900 rounded-xs flex items-center justify-center text-[6px] font-mono text-purple-300 font-bold">STM32</div>
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
              </div>

              <p className="mt-1.5 text-[9px] sm:text-[10px] text-slate-300 font-medium truncate">
                Engineered for Tomorrow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Category Spectrum Bar */}
      <div className="relative z-10 pt-2 border-t border-purple-500/30 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-slate-300 font-mono">
          <span className="hover:text-cyan-300 transition-colors">Microcontrollers</span>
          <span>•</span>
          <span className="hover:text-cyan-300 transition-colors">Sensors & Modules</span>
          <span>•</span>
          <span className="hover:text-cyan-300 transition-colors">Passive Components</span>
          <span>•</span>
          <span className="hover:text-cyan-300 transition-colors hidden sm:inline">Connectors & Cables</span>
          <span className="hidden sm:inline">•</span>
          <span className="hover:text-cyan-300 transition-colors hidden md:inline">Power Supplies</span>
          <span className="hidden md:inline">•</span>
          <span className="hover:text-cyan-300 transition-colors hidden lg:inline">Displays & Motors</span>
        </div>

        <div className="text-purple-300 font-mono text-[9px] sm:text-[11px] font-bold flex items-center gap-1">
          <span>Same Components. Smarter Possibilities.</span>
          <span>🇮🇳</span>
        </div>
      </div>
    </div>
  );
};
