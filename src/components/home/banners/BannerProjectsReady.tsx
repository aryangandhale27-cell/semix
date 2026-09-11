import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Lightbulb, 
  GraduationCap, 
  Cpu, 
  Users, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Sparkles,
  Bot,
  Wifi,
  Eye,
  Radio
} from 'lucide-react';

export const BannerProjectsReady: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-gradient-to-br from-[#160026] via-[#2f074a] to-[#0f001c] text-white overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#d946ef_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center flex-1 my-auto">
        {/* Left Column: Heading, Project Verticals, and Get Started CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-2.5 sm:space-y-3.5">
          {/* Top Brand Tag */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-purple-400/40">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#160026] rounded-xs flex items-center justify-center">
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
            <p className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-cyan-300 uppercase">
              GET YOUR
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-md">
              <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">ELECTRONICS PROJECTS</span><br />
              READY FROM US!
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-purple-200 font-semibold tracking-wide uppercase">
            CUSTOMISED & READY-MADE PROJECTS AVAILABLE
          </p>

          {/* Project Types Grid */}
          <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-purple-950/70 border border-purple-500/40 text-slate-200">
              <div className="w-5 h-5 rounded bg-purple-800/80 flex items-center justify-center text-amber-300 shrink-0">
                <Lightbulb className="w-3 h-3" />
              </div>
              <span className="font-semibold truncate">Final Year Projects</span>
            </div>

            <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-purple-950/70 border border-purple-500/40 text-slate-200">
              <div className="w-5 h-5 rounded bg-purple-800/80 flex items-center justify-center text-cyan-300 shrink-0">
                <GraduationCap className="w-3 h-3" />
              </div>
              <span className="font-semibold truncate">Academic Projects</span>
            </div>

            <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-purple-950/70 border border-purple-500/40 text-slate-200">
              <div className="w-5 h-5 rounded bg-purple-800/80 flex items-center justify-center text-emerald-300 shrink-0">
                <Cpu className="w-3 h-3" />
              </div>
              <span className="font-semibold truncate">IoT & Automation</span>
            </div>

            <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-purple-950/70 border border-purple-500/40 text-slate-200">
              <div className="w-5 h-5 rounded bg-purple-800/80 flex items-center justify-center text-purple-300 shrink-0">
                <Users className="w-3 h-3" />
              </div>
              <span className="font-semibold truncate">Prototype Development</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-1 flex items-center gap-3">
            <Link
              to="/services?tab=custom-projects"
              className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg shadow-purple-950/80 border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Get Your Project Started</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200" />
            </Link>

            <Link
              to="/services?tab=component-sourcing"
              className="text-xs sm:text-sm text-purple-300 hover:text-white font-mono font-bold tracking-wider underline underline-offset-4 transition-colors"
            >
              View Finished Kits
            </Link>
          </div>
        </div>

        {/* Right Column: 4-Wheel Smart Robotic Rover & Hardware Satellites */}
        <div className="lg:col-span-6 relative flex items-center justify-center pt-2 lg:pt-0">
          {/* Floating Discount Burst Badge */}
          <div className="absolute -top-3 -right-2 sm:top-0 sm:right-2 z-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#FF6B00] via-amber-400 to-[#FF6B00] text-slate-950 rounded-full flex flex-col items-center justify-center p-1 text-center font-black shadow-xl shadow-orange-950/60 rotate-12 border-2 border-yellow-200 animate-pulse">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-tighter leading-none">UP TO</span>
              <span className="text-xs sm:text-base font-black leading-tight">25% OFF</span>
              <span className="text-[6px] sm:text-[7px] uppercase leading-none font-bold">ON SELECT ITEMS</span>
            </div>
          </div>

          {/* Graphical Robot Platform and Satellites */}
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-[4/3] flex items-center justify-center">
            {/* Ambient Circular Neon Ring Pedestal */}
            <div className="absolute bottom-4 w-64 sm:w-80 h-20 bg-gradient-to-r from-purple-500/30 via-cyan-500/40 to-purple-500/30 rounded-full blur-xl border-2 border-cyan-400/40" />

            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="roverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Glowing Pedestal Surface */}
              <ellipse cx="200" cy="245" rx="140" ry="35" fill="#1e1035" stroke="#a855f7" strokeWidth="2" />
              <ellipse cx="200" cy="245" rx="110" ry="25" fill="#2d1254" stroke="#22d3ee" strokeWidth="1.5" />

              {/* Central 4-Wheel Smart Robotic Rover Car */}
              <g transform="translate(110, 110)">
                {/* Back Left Wheel */}
                <rect x="0" y="30" width="22" height="48" rx="6" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
                <rect x="3" y="34" width="16" height="40" rx="3" fill="#1e293b" />

                {/* Back Right Wheel */}
                <rect x="158" y="30" width="22" height="48" rx="6" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
                <rect x="161" y="34" width="16" height="40" rx="3" fill="#1e293b" />

                {/* Main Clear/Yellow Acrylic Chassis */}
                <rect x="18" y="45" width="144" height="65" rx="10" fill="url(#roverGrad)" stroke="#fef08a" strokeWidth="2" opacity="0.95" />

                {/* Front Left Wheel */}
                <rect x="0" y="70" width="22" height="48" rx="6" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
                <rect x="3" y="74" width="16" height="40" rx="3" fill="#1e293b" />

                {/* Front Right Wheel */}
                <rect x="158" y="70" width="22" height="48" rx="6" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
                <rect x="161" y="74" width="16" height="40" rx="3" fill="#1e293b" />

                {/* Upper Deck Electronic Stack */}
                <rect x="35" y="20" width="110" height="50" rx="6" fill="url(#chassisGrad)" stroke="#38bdf8" strokeWidth="1.5" />

                {/* Arduino / Motor Shield Board */}
                <rect x="42" y="25" width="45" height="38" rx="3" fill="#0369a1" />
                <rect x="48" y="30" width="12" height="12" fill="#0f172a" />
                <circle cx="50" cy="50" r="2" fill="#22c55e" />

                {/* Sensor Breadboard / Shield */}
                <rect x="92" y="25" width="45" height="38" rx="3" fill="#334155" />

                {/* Ultrasonic Dual Eyes HC-SR04 mounted on front */}
                <g transform="translate(62, -15)">
                  <rect x="0" y="0" width="56" height="26" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="15" cy="13" r="9" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
                  <circle cx="15" cy="13" r="4" fill="#0284c7" />
                  <circle cx="41" cy="13" r="9" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
                  <circle cx="41" cy="13" r="4" fill="#0284c7" />
                  {/* Mounting Bracket */}
                  <rect x="25" y="26" width="6" height="10" fill="#94a3b8" />
                </g>

                {/* Colorful Wiring Harness */}
                <path d="M 50,45 Q 65,10 90,35" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 55,50 Q 75,15 100,40" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M 60,45 Q 85,20 110,35" fill="none" stroke="#eab308" strokeWidth="2" />

                {/* "Your Project Here" Floating Tag */}
                <g transform="translate(45, 80)">
                  <rect width="90" height="20" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
                  <text x="45" y="14" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">YOUR PROJECT HERE</text>
                </g>
              </g>

              {/* Floating Peripheral 1: Raspberry Pi */}
              <g transform="translate(20, 20)">
                <rect width="95" height="34" rx="6" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1" />
                <text x="8" y="15" fill="#f43f5e" fontSize="9" fontWeight="bold">🍓 Raspberry Pi</text>
                <text x="8" y="26" fill="#c7d2fe" fontSize="7">SBCs for Bigger Ideas</text>
              </g>

              {/* Floating Peripheral 2: Arduino */}
              <g transform="translate(20, 70)">
                <rect width="90" height="32" rx="6" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1" />
                <text x="8" y="14" fill="#38bdf8" fontSize="8.5" fontWeight="bold">♾️ Arduino</text>
                <text x="8" y="24" fill="#bae6fd" fontSize="7">Build Without Limits</text>
              </g>

              {/* Floating Peripheral 3: ESP32 */}
              <g transform="translate(20, 120)">
                <rect width="90" height="32" rx="6" fill="#1e1b4b" stroke="#f97316" strokeWidth="1" />
                <text x="8" y="14" fill="#f97316" fontSize="8.5" fontWeight="bold">📶 ESP32</text>
                <text x="8" y="24" fill="#fed7aa" fontSize="7">Connect to Future</text>
              </g>

              {/* Floating Peripheral 4: 16x2 I2C Display */}
              <g transform="translate(285, 45)">
                <rect width="105" height="42" rx="4" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
                <rect x="8" y="8" width="89" height="26" rx="2" fill="#064e3b" />
                <text x="14" y="20" fill="#a7f3d0" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Ideas Into</text>
                <text x="14" y="29" fill="#a7f3d0" fontSize="7" fontFamily="monospace">Reality</text>
              </g>

              {/* Floating Peripheral 5: Sensors & Modules */}
              <g transform="translate(285, 110)">
                <rect width="105" height="34" rx="6" fill="#1e1b4b" stroke="#22d3ee" strokeWidth="1" />
                <text x="8" y="15" fill="#22d3ee" fontSize="8.5" fontWeight="bold">📡 Sensors & Modules</text>
                <text x="8" y="26" fill="#e0f2fe" fontSize="7">Sense. Build. Innovate.</text>
              </g>

              {/* Curved "From Idea to Implementation" Script */}
              <text x="310" y="25" fill="#d946ef" fontSize="11" fontWeight="bold" fontFamily="sans-serif" fontStyle="italic">
                From Idea to Implementation
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Service Assurance Strip */}
      <div className="relative z-10 pt-2 border-t border-purple-500/30 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
        <div className="flex items-center gap-2 sm:gap-3 text-slate-300 font-mono">
          <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-cyan-400" /> Fast Delivery</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Genuine Components</span>
          <span className="flex items-center gap-1"><Headphones className="w-3 h-3 text-purple-300" /> Expert Support</span>
          <span className="hidden md:flex items-center gap-1 text-[#FF6B00] font-bold"><Sparkles className="w-3 h-3" /> Build Innovate Grow</span>
        </div>

        <div className="flex items-center gap-1 text-purple-300 font-mono text-[9px] sm:text-[11px] font-bold">
          <span>Proudly Serving Makers Across India 🇮🇳</span>
        </div>
      </div>
    </div>
  );
};
