import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { ExploreCategories } from '../../components/home/ExploreCategories';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Product, HomepageBanner } from '../../types';
import { 
  ArrowRight, 
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
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);

  // Active banners from AppContext (synced with Firestore & local persistence)
  const activeBanners: HomepageBanner[] = (banners || []).filter(
    (b) => b.isActive !== false
  );

  const currentSlideIndex = activeBanners.length > 0 ? heroSlide % activeBanners.length : 0;
  const currentSlide = activeBanners[currentSlideIndex];
  const [displayedSlide, setDisplayedSlide] = useState<HomepageBanner | null>(null);

  useEffect(() => {
    if (!displayedSlide && currentSlide) {
      setDisplayedSlide(currentSlide);
    }
  }, [currentSlide, displayedSlide]);

  useEffect(() => {
    activeBanners.forEach((banner) => {
      [banner.desktopImage, banner.mobileImage].filter(Boolean).forEach((imageUrl) => {
        const image = new Image();
        image.src = imageUrl;
      });
    });
  }, [banners]);

  // Auto rotate hero slides
  useEffect(() => {
    if (isHovered || activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered]);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  const handleHeroTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    isSwiping.current = false;
  };

  const handleHeroTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current || activeBanners.length <= 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    isSwiping.current = true;
    setHeroSlide((prev) => (
      deltaX < 0
        ? (prev + 1) % activeBanners.length
        : (prev - 1 + activeBanners.length) % activeBanners.length
    ));

    window.setTimeout(() => {
      isSwiping.current = false;
    }, 0);
  };

  return (
    <div className="space-y-6 sm:space-y-12 pb-8 sm:pb-12">
      {/* 1. Hero Layout: Main Banner Carousel (Total 6 Banners) */}
      <section id="hero-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        {/* Main Banner Carousel with Cinematic Electronic Theme Animation */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
          className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-[#561269]/40 group touch-pan-y"
        >
            {!displayedSlide && (
              <div className="aspect-[1600/700] w-full animate-pulse bg-slate-200" aria-label="Loading homepage banner" />
            )}

            {displayedSlide && (
              <div className="relative z-10">
                <Link
                  to={displayedSlide.linkUrl || '/shop'}
                  onClick={(event) => {
                    if (isSwiping.current) event.preventDefault();
                  }}
                  className="block w-full"
                >
                  <picture className="block w-full">
                    {displayedSlide.mobileImage && (
                      <source media="(max-width: 640px)" srcSet={displayedSlide.mobileImage} />
                    )}
                    <img
                      key={displayedSlide.id}
                      src={displayedSlide.desktopImage || displayedSlide.mobileImage}
                      alt={displayedSlide.title}
                      loading="eager"
                      fetchPriority={currentSlideIndex === 0 ? 'high' : 'auto'}
                      decoding="async"
                      width={1600}
                      height={700}
                      sizes="100vw"
                      className="block w-full h-auto"
                    />
                  </picture>
                </Link>
              </div>
            )}

            {currentSlide && currentSlide.id !== displayedSlide?.id && (
              <img
                src={currentSlide.desktopImage || currentSlide.mobileImage}
                alt=""
                aria-hidden="true"
                onLoad={() => setDisplayedSlide(currentSlide)}
                className="pointer-events-none absolute h-px w-px opacity-0"
              />
            )}

            {activeBanners.length > 1 && (
              <div className="flex items-center justify-center gap-2 py-3" aria-label="Homepage banner slides">
                {activeBanners.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setHeroSlide(index)}
                    aria-label={`Show banner ${index + 1}`}
                    aria-current={currentSlideIndex === index ? 'true' : undefined}
                    className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlideIndex === index
                        ? 'w-8 bg-[#c4005a]'
                        : 'w-3 bg-slate-400 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            )}

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
