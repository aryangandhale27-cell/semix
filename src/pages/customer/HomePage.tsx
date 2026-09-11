import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { ExploreCategories } from '../../components/home/ExploreCategories';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { HeroCircuitAnimation } from '../../components/home/HeroCircuitAnimation';
import { BannerIndiaLargest } from '../../components/home/banners/BannerIndiaLargest';
import { BannerTopBrands } from '../../components/home/banners/BannerTopBrands';
import { BannerProjectsReady } from '../../components/home/banners/BannerProjectsReady';
import { INITIAL_HOMEPAGE_BANNERS } from '../../mockData/banners';
import { Product, HomepageBanner } from '../../types';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Cpu, 
  FileSpreadsheet, 
  ShieldCheck, 
  Zap, 
  Truck,
  CheckCircle2,
  Activity,
  Radio,
  Wifi,
  Gauge
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, banners, addToCart } = useApp();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [couponToast, setCouponToast] = useState<string | null>(null);

  // Active banners from AppContext (synced with Firestore & local persistence)
  const activeBanners: HomepageBanner[] = (banners && banners.length > 0 ? banners : INITIAL_HOMEPAGE_BANNERS).filter(
    (b) => b.isActive !== false
  );

  const currentSlideIndex = activeBanners.length > 0 ? heroSlide % activeBanners.length : 0;

  // Auto rotate hero slides
  useEffect(() => {
    if (isHovered || activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered]);

  const handleCopyCouponNotification = (code: string) => {
    setCouponToast(`Coupon code ${code} copied! Apply at checkout for 10% OFF.`);
    setTimeout(() => setCouponToast(null), 3500);
  };

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-12 pb-8 sm:pb-12">
      {/* Toast Notification for Coupon Copy */}
      <AnimatePresence>
        {couponToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-purple-500 flex items-center gap-2 max-w-sm"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-xs font-mono">{couponToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Layout: Main Banner Carousel (Total 6 Banners) */}
      <section id="hero-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        {/* Main Banner Carousel with Cinematic Electronic Theme Animation */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-[#561269]/40 min-h-[360px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-between group bg-slate-950"
        >
            {/* Animated PCB Circuit Background */}
            <HeroCircuitAnimation />

            {/* Electronic Laser Scan Sweep Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent skew-x-12"
              />
            </div>

            {activeBanners.map((slide, idx) => {
              const isActive = currentSlideIndex === idx;

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 flex flex-col justify-between transition-all duration-700 ${
                    isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-98 z-0 pointer-events-none'
                  }`}
                >
                  {slide.type === 'banner-india-largest' && (!slide.desktopImage || !slide.desktopImage.startsWith('/uploads/')) ? (
                    <BannerIndiaLargest onCopyCoupon={handleCopyCouponNotification} />
                  ) : slide.type === 'banner-top-brands' && (!slide.desktopImage || !slide.desktopImage.startsWith('/uploads/')) ? (
                    <BannerTopBrands onCopyCoupon={handleCopyCouponNotification} />
                  ) : slide.type === 'banner-projects-ready' && (!slide.desktopImage || !slide.desktopImage.startsWith('/uploads/')) ? (
                    <BannerProjectsReady />
                  ) : slide.type === 'product' && slide.highlights && (!slide.desktopImage || !slide.desktopImage.startsWith('/uploads/')) ? (
                    /* Preserved Flagship Product Banner (Raspberry Pi, Arduino, ESP32) */
                    <div className={`relative w-full h-full bg-gradient-to-r ${slide.bgGradient || 'from-[#380847] via-[#561269] to-[#250530]'} p-3.5 sm:p-10 flex flex-col justify-between`}>
                      {/* Responsive Image Backdrop: mobileImage for mobile screens, desktopImage for laptop */}
                      <picture className="absolute inset-0 w-full h-full pointer-events-none">
                        {slide.mobileImage && (
                          <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                        )}
                        <img
                          src={slide.desktopImage || slide.mobileImage}
                          alt={slide.title}
                          className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
                        />
                      </picture>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-[#380847]/60 to-slate-950/80 pointer-events-none" />

                      {/* Central Cinematic Electronic Content */}
                      <div className="relative z-10 flex flex-col items-center text-center justify-center flex-1 max-w-3xl mx-auto my-auto py-2 sm:py-6">
                        {/* Top Floating Glass Pill */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold tracking-wider sm:tracking-widest uppercase mb-2 sm:mb-4 shadow-lg shadow-cyan-950/50"
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-ping"></span>
                          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF6B00]" />
                          <span>{slide.badge || 'FLAGSHIP COMPUTE'} • 2026 OFFICIAL LAUNCH</span>
                        </motion.div>

                        {/* Main Display Title */}
                        <motion.div
                          key={`title-block-${currentSlideIndex}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="space-y-0.5 sm:space-y-1 mb-1.5 sm:mb-3"
                        >
                          <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white tracking-tight uppercase font-sans drop-shadow-lg">
                            ENGINEERED FOR 2026
                          </h1>
                          <div className="text-lg sm:text-2xl md:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-purple-400 to-[#FF6B00] bg-clip-text text-transparent uppercase drop-shadow-md">
                            {slide.title}
                          </div>
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                          key={`sub-tag-${currentSlideIndex}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="text-[11px] sm:text-sm text-slate-300 font-medium max-w-lg mb-3 sm:mb-6 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none px-2"
                        >
                          {slide.subtitle} {slide.description ? `— ${slide.description}` : ''}
                        </motion.p>

                        {/* High-Tech Spec Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-6">
                          {slide.highlights?.map((h, i) => (
                            <span
                              key={i}
                              className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-[9px] sm:text-[11px] font-mono font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-md border border-slate-700/60 flex items-center gap-1 sm:gap-1.5 shadow-xs"
                            >
                              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                              {h}
                            </span>
                          ))}
                          {slide.price && (
                            <span className="bg-[#FF6B00]/20 text-orange-300 text-[9px] sm:text-[11px] font-mono font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-md border border-[#FF6B00]/40 flex items-center gap-1">
                              {slide.price}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons styled compactly on mobile */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                          <Link
                            to={slide.productId ? `/product/${slide.productId}` : slide.linkUrl || '/shop'}
                            className="bg-gradient-to-r from-cyan-600 via-[#561269] to-[#561269] hover:from-cyan-500 hover:to-[#561269] text-white font-extrabold text-[11px] sm:text-sm tracking-wider uppercase px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg shadow-cyan-950/60 border border-cyan-400/40 flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <span>EXPLORE SILICON PRESTIGE</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200" />
                          </Link>

                          <Link
                            to="/services?tab=pcb-manufacturing"
                            className="bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white font-bold text-[11px] sm:text-sm tracking-wider uppercase px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border border-slate-700/80 hover:border-cyan-400/60 transition-all backdrop-blur-md shadow-md"
                          >
                            CUSTOMIZE FABRICATION
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Custom or Uploaded Banner Managed from Admin Panel */
                    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden">
                      {/* Responsive Picture: Laptop view loads desktopImage (16:5 ratio), Mobile view loads mobileImage (4:3 ratio) */}
                      <picture className="absolute inset-0 w-full h-full">
                        {slide.mobileImage && (
                          <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                        )}
                        <img
                          src={slide.desktopImage || slide.mobileImage}
                          alt={slide.title}
                          className="w-full h-full object-cover object-center"
                        />
                      </picture>

                      {/* Readability Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/50 sm:to-transparent pointer-events-none" />

                      {/* Foreground Content */}
                      <div className="relative z-10 p-5 sm:p-10 md:p-12 flex flex-col justify-end sm:justify-center h-full max-w-2xl">
                        {slide.badge && (
                          <span className="self-start px-3 py-1 rounded-full bg-[#FF6B00] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-3 shadow-md">
                            {slide.badge}
                          </span>
                        )}

                        <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg tracking-tight">
                          {slide.title}
                        </h2>

                        {slide.subtitle && (
                          <p className="text-xs sm:text-sm text-slate-200 mt-1 sm:mt-2 line-clamp-2 max-w-xl font-medium leading-relaxed drop-shadow-md">
                            {slide.subtitle}
                          </p>
                        )}

                        {slide.linkUrl && (
                          <div className="pt-3 sm:pt-5">
                            <Link
                              to={slide.linkUrl}
                              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#561269] hover:bg-[#430d52] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-purple-950/50 border border-purple-400/40 transition-all hover:scale-105 active:scale-95"
                            >
                              <span>Explore Now</span>
                              <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Slider Controls Bottom with Live Spec Indicators */}
            <div className="relative z-20 px-3 py-2 sm:px-6 sm:py-3.5 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-between pointer-events-auto">
              {/* Dynamic Banner Navigation Chips */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-[65%] sm:max-w-none">
                {activeBanners.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => setHeroSlide(i)}
                    className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-mono transition-all duration-300 cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                      currentSlideIndex === i
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-xs'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${currentSlideIndex === i ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span className="hidden sm:inline">{slide.tabLabel}</span>
                    <span className="sm:hidden">{slide.shortLabel}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Telemetry & Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 hidden md:inline truncate max-w-xs">
                  {activeBanners[currentSlideIndex]?.telemetry || 'LIVE TELEMETRY: ACTIVE'}
                </span>
                <div className="flex gap-1 sm:gap-1.5">
                  <button
                    onClick={() => setHeroSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                    title="Previous Banner"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setHeroSlide((prev) => (prev + 1) % activeBanners.length)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                    title="Next Banner"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* 2. Featured Categories Section - Split-Card Vibrant Orange Grid */}
      <ExploreCategories categories={categories} />

      {/* 3. BOM Tool Teaser Banner - Compact on mobile */}
      <section id="bom-tool-teaser" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#561269] via-[#380847] to-[#380847] rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden shadow-lg border border-[#561269]/30">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-orange-500/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-[#FF6B00] text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md mb-1.5 sm:mb-2">
                <FileSpreadsheet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Engineer & Maker Tool</span>
              </div>
              <h3 className="text-base sm:text-2xl font-extrabold text-white tracking-tight">
                Bill of Materials (BOM) Auto-Matcher
              </h3>
              <p className="text-[11px] sm:text-sm text-purple-200 mt-1 sm:mt-1.5 leading-snug sm:leading-relaxed">
                Paste your project parts list or upload CSV. Our algorithmic engine instantly maps part codes to stock inventory, calculates multi-tier volume discounts, and adds all components with 1-click.
              </p>
            </div>

            <div className="flex flex-row items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/bulk-enquiry"
                id="launch-bulk-enquiry-banner-btn"
                className="flex-1 sm:flex-initial justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
              >
                <span>Bulk Enquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/bom-tool"
                id="launch-bom-tool-btn"
                className="flex-1 sm:flex-initial justify-center bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg shadow-orange-950/30 flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>BOM Tool</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending & Best Selling Components */}
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-6 pb-1.5 sm:pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-base sm:text-2xl font-extrabold text-[#561269] flex items-center gap-1.5 sm:gap-2">
              <Flame className="w-4 h-4 sm:w-6 sm:h-6 text-[#FF6B00]" />
              <span>Trending & Best Sellers</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
              High-demand development boards, drivers, and sensor kits ready for dispatch
            </p>
          </div>

          <Link
            to="/shop"
            className="text-[11px] sm:text-xs font-bold text-[#561269] hover:text-[#FF6B00] flex items-center gap-0.5 sm:gap-1 shrink-0 ml-2"
          >
            <span>Catalog ({products.length})</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. New Arrivals Showcase */}
      <section id="new-arrivals-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-6 pb-1.5 sm:pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-base sm:text-2xl font-extrabold text-[#561269] flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-amber-500" />
              <span>Fresh Silicon & New Arrivals</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
              Newly stocked microcontrollers, breakout modules, and bundles
            </p>
          </div>

          <Link
            to="/shop?filter=new"
            className="text-[11px] sm:text-xs font-bold text-[#561269] hover:text-[#FF6B00] flex items-center gap-0.5 sm:gap-1 shrink-0 ml-2"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. Why Choose SEMIX LABS Section */}
      <section id="why-semixlabs" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#FF6B00] block mb-0.5 sm:mb-1">
              Engineered For Makers & Industry
            </span>
            <h3 className="text-lg sm:text-2xl font-extrabold text-[#561269]">
              Why Technical Teams Choose SEMIX LABS
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
              We eliminate counterfeit ICs and supply chain delays so your prototypes work on the first power-up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-white p-3.5 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold mb-2 sm:mb-3">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">100% Verified Silicon & Datasheets</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-snug sm:leading-relaxed">
                Direct procurement from authorized manufacturers. Technical pinout sheets and verified voltage ratings.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold mb-2 sm:mb-3">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">Same-Day Dispatch Desk</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-snug sm:leading-relaxed">
                Orders placed before 4:00 PM are picked from designated warehouse bins, ESD sealed, and dispatched.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-2 sm:mb-3">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">Tiered Pricing & GST Invoicing</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-snug sm:leading-relaxed">
                Automated bulk discounts for universities and startups with instant B2B GST tax invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
