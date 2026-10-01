import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { motion, useIsPresent } from 'motion/react';
import { SemixLabsLogo } from './SemixLabsLogo';

const DesktopElectronicsScene: React.FC = () => (
  <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 960 420" fill="none">
    <defs>
      <linearGradient id="desktop-resistor" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#b66bd0" />
        <stop offset="0.52" stopColor="#6d3784" />
        <stop offset="1" stopColor="#351541" />
      </linearGradient>
      <linearGradient id="desktop-capacitor" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#32143f" />
        <stop offset="0.45" stopColor="#8a4aa3" />
        <stop offset="1" stopColor="#351541" />
      </linearGradient>
      <linearGradient id="desktop-led" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#ffca78" />
        <stop offset="1" stopColor="#ff7628" />
      </linearGradient>
      <filter id="desktop-component-shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="#05020a" floodOpacity="0.55" />
      </filter>
    </defs>

    <motion.g filter="url(#desktop-component-shadow)" animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M104 118H207M353 118H456" stroke="#d8d0df" strokeWidth="5" strokeLinecap="round" />
      <rect x="207" y="91" width="146" height="54" rx="24" fill="url(#desktop-resistor)" stroke="#e2c2eb" strokeWidth="2" />
      <path d="M231 92V144M255 92V144M304 92V144M329 92V144" stroke="#ffb05b" strokeWidth="7" />
      <path d="M217 101H343" stroke="#f1dff4" strokeOpacity="0.45" strokeWidth="3" />
    </motion.g>

    <motion.g filter="url(#desktop-component-shadow)" animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }} transition={{ duration: 3, delay: 0.35, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M570 119V180M614 119V180" stroke="#d8d0df" strokeWidth="5" strokeLinecap="round" />
      <path d="M558 94C558 84 626 84 626 94V165C626 178 558 178 558 165V94Z" fill="url(#desktop-capacitor)" stroke="#dfb5e9" strokeWidth="2" />
      <ellipse cx="592" cy="94" rx="34" ry="10" fill="#b66bd0" stroke="#f0d7f5" strokeWidth="2" />
      <path d="M592 87V101M585 94H599" stroke="#ffe0a5" strokeWidth="3" />
      <path d="M566 112V155" stroke="#e8c8ef" strokeOpacity="0.44" strokeWidth="3" />
    </motion.g>

    <motion.g filter="url(#desktop-component-shadow)" animate={{ y: [0, -6, 0], rotate: [0, 1, 0] }} transition={{ duration: 3.2, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}>
      <rect x="508" y="247" width="174" height="105" rx="13" fill="#100a16" stroke="#dcb0e7" strokeWidth="3" />
      <rect x="524" y="261" width="142" height="77" rx="8" fill="#281237" stroke="#8f51a7" strokeWidth="2" />
      <path d="M541 277H649M541 291H649M541 305H649M541 319H627" stroke="#b66bd0" strokeOpacity="0.68" strokeWidth="3" />
      <circle cx="650" cy="274" r="4" fill="#ff9b4a" />
      <path d="M493 263H508M493 281H508M493 299H508M493 317H508M493 335H508M682 263H697M682 281H697M682 299H697M682 317H697M682 335H697M532 232V247M552 232V247M572 232V247M592 232V247M612 232V247M632 232V247M652 232V247M532 352V367M552 352V367M572 352V367M592 352V367M612 352V367M632 352V367M652 352V367" stroke="#ded5e5" strokeWidth="4" strokeLinecap="round" />
    </motion.g>

    <motion.g filter="url(#desktop-component-shadow)" animate={{ y: [0, -7, 0], rotate: [-3, 2, -3] }} transition={{ duration: 2.9, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M292 270L282 330M316 270L316 334M340 270L350 330" stroke="#d8d0df" strokeWidth="5" strokeLinecap="round" />
      <path d="M278 275C278 231 354 231 354 275V293H278V275Z" fill="#724087" stroke="#dfb5e9" strokeWidth="2.5" />
      <path d="M283 274C283 239 349 239 349 274" stroke="#f1dff4" strokeOpacity="0.45" strokeWidth="3" />
    </motion.g>

    <motion.g filter="url(#desktop-component-shadow)" animate={{ y: [0, 7, 0], rotate: [3, -2, 3] }} transition={{ duration: 3.1, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M784 270V327M816 270V327" stroke="#d8d0df" strokeWidth="5" strokeLinecap="round" />
      <path d="M766 270C766 222 834 222 834 270V288H766V270Z" fill="url(#desktop-led)" stroke="#ffe0a5" strokeWidth="2" />
      <path d="M773 269C773 237 827 237 827 269" stroke="#fff1d1" strokeOpacity="0.65" strokeWidth="3" />
    </motion.g>
  </svg>
);

const MobileElectronicsScene: React.FC = () => (
  <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 420 560" fill="none">
    <defs>
      <linearGradient id="mobile-metal" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ffe0a5" />
        <stop offset="1" stopColor="#ff8a37" />
      </linearGradient>
      <linearGradient id="mobile-resistor" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#b66bd0" />
        <stop offset="0.52" stopColor="#6d3784" />
        <stop offset="1" stopColor="#351541" />
      </linearGradient>
      <linearGradient id="mobile-capacitor" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#32143f" />
        <stop offset="0.45" stopColor="#8a4aa3" />
        <stop offset="1" stopColor="#351541" />
      </linearGradient>
      <linearGradient id="mobile-led" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#ffca78" />
        <stop offset="1" stopColor="#ff7628" />
      </linearGradient>
      <filter id="mobile-component-shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#05020a" floodOpacity="0.58" />
      </filter>
    </defs>

    <motion.g filter="url(#mobile-component-shadow)" animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M52 139H116M275 139H339" stroke="#d8d0df" strokeWidth="4" strokeLinecap="round" />
      <rect x="116" y="116" width="159" height="46" rx="21" fill="url(#mobile-resistor)" stroke="#e2c2eb" strokeWidth="2" />
      <path d="M142 117V161M169 117V161M221 117V161M248 117V161" stroke="#ffb05b" strokeWidth="6" />
      <path d="M127 124H265" stroke="#f1dff4" strokeOpacity="0.45" strokeWidth="3" />
    </motion.g>

    <motion.g filter="url(#mobile-component-shadow)" animate={{ y: [0, 7, 0], rotate: [2, -2, 2] }} transition={{ duration: 2.8, delay: 0.25, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M102 251V297M139 251V297" stroke="#d8d0df" strokeWidth="4" strokeLinecap="round" />
      <path d="M92 226C92 217 149 217 149 226V282C149 295 92 295 92 282V226Z" fill="url(#mobile-capacitor)" stroke="#dfb5e9" strokeWidth="2" />
      <ellipse cx="120.5" cy="226" rx="28.5" ry="8" fill="#b66bd0" stroke="#f0d7f5" strokeWidth="2" />
      <path d="M120 220V232M114 226H126" stroke="#ffe0a5" strokeWidth="2.5" />
      <path d="M99 241V275" stroke="#e8c8ef" strokeOpacity="0.45" strokeWidth="3" />
    </motion.g>

    <motion.g filter="url(#mobile-component-shadow)" animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M274 247V292M309 247V292M344 247V292" stroke="#d8d0df" strokeWidth="4" strokeLinecap="round" />
      <path d="M263 243C263 211 355 211 355 243V264H263V243Z" fill="#724087" stroke="#dfb5e9" strokeWidth="2.5" />
      <path d="M270 241C270 218 348 218 348 241" stroke="#f1dff4" strokeOpacity="0.46" strokeWidth="3" />
    </motion.g>

    <motion.g filter="url(#mobile-component-shadow)" animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }} transition={{ duration: 3.1, delay: 0.55, repeat: Infinity, ease: 'easeInOut' }}>
      <rect x="125" y="355" width="170" height="100" rx="13" fill="#100a16" stroke="#dcb0e7" strokeWidth="3" />
      <rect x="141" y="369" width="138" height="72" rx="8" fill="#281237" stroke="#8f51a7" strokeWidth="2" />
      <path d="M158 385H263M158 399H263M158 413H263M158 427H241" stroke="#b66bd0" strokeOpacity="0.68" strokeWidth="3" />
      <circle cx="264" cy="382" r="4" fill="#ff9b4a" />
      <path d="M110 371H125M110 389H125M110 407H125M110 425H125M295 371H310M295 389H310M295 407H310M295 425H310M149 340V355M169 340V355M189 340V355M209 340V355M229 340V355M249 340V355M269 340V355M149 455V470M169 455V470M189 455V470M209 455V470M229 455V470M249 455V470M269 455V470" stroke="#ded5e5" strokeWidth="4" strokeLinecap="round" />
    </motion.g>

    <motion.g filter="url(#mobile-component-shadow)" animate={{ y: [0, 7, 0], rotate: [3, -2, 3] }} transition={{ duration: 2.9, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M92 489V535M119 489V535M146 489V535" stroke="#d8d0df" strokeWidth="4" strokeLinecap="round" />
      <path d="M83 488C83 454 155 454 155 488V510H83V488Z" fill="#724087" stroke="#dfb5e9" strokeWidth="2.5" />
      <path d="M89 486C89 462 149 462 149 486" stroke="#f1dff4" strokeOpacity="0.5" strokeWidth="3" />
    </motion.g>
  </svg>
);

export const StoreLoadingScreen: React.FC = () => {
  const isPresent = useIsPresent();

  return (
    <motion.div
    key="store-loading-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, y: -8, scale: 1.01 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    role="status"
    aria-live="polite"
    aria-label="Loading the SEMIX component catalogue"
    aria-hidden={!isPresent}
    style={{ pointerEvents: isPresent ? 'auto' : 'none' }}
    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#170b24] px-4 py-8 text-white"
    >
    <div className="relative z-10 w-full max-w-6xl">
      <header className="flex justify-center sm:justify-start">
        <SemixLabsLogo
          variant="dark"
          size="xl"
          className="!h-[70px] !w-[220px] !min-w-0 !object-cover brightness-0 invert sm:!h-[114px] sm:!w-[360px]"
        />
      </header>

      <main className="mt-3 grid items-center gap-2 sm:mt-5 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] sm:order-2 sm:mx-0 sm:aspect-[16/7] sm:max-w-none">
          <div className="absolute inset-0 sm:hidden">
            <MobileElectronicsScene />
          </div>
          <div className="absolute inset-0 hidden sm:block">
            <DesktopElectronicsScene />
          </div>
        </div>

        <section className="text-center sm:order-1 sm:text-left">
          <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#d4a0e4] sm:text-sm">SEMIX LABS</p>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            India&apos;s Largest Electronics Component Store
          </h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-[#dfc6e8] sm:justify-start sm:text-base">
            <LoaderCircle className="h-4 w-4 animate-spin text-[#ff9b4a]" strokeWidth={2.5} />
            Loading
          </div>
        </section>
      </main>
    </div>
    </motion.div>
  );
};