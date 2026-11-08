import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { ExploreCategories } from '../../components/home/ExploreCategories';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Product, HomepageBanner } from '../../types';
import { fetchFlaggedProductsFromFirestore } from '../../services/firebaseService';
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Cpu, 
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
  const { categories, banners, addToCart } = useApp();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchFlaggedProductsFromFirestore('isBestSeller', 8),
      fetchFlaggedProductsFromFirestore('isNew', 4),
    ])
      .then(([bestSellerProducts, newProducts]) => {
        if (!isMounted) return;
        setBestSellers(bestSellerProducts);
        setNewArrivals(newProducts);
      })
      .catch((error) => {
        console.error('[Home] Could not load featured products:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
    if (!currentSlide) return;

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const currentImageUrl = isMobile
      ? currentSlide.mobileImage || currentSlide.desktopImage
      : currentSlide.desktopImage || currentSlide.mobileImage;
    if (!currentImageUrl) return;

    const image = new Image();
    image.decoding = 'async';
    image.src = currentImageUrl;
  }, [currentSlide]);

  // Auto rotate hero slides
  useEffect(() => {
    if (isHovered || activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered]);

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
              <picture className="pointer-events-none absolute h-px w-px opacity-0" aria-hidden="true">
                {currentSlide.mobileImage && (
                  <source media="(max-width: 640px)" srcSet={currentSlide.mobileImage} />
                )}
                <img
                  src={currentSlide.desktopImage || currentSlide.mobileImage}
                  alt=""
                  onLoad={() => setDisplayedSlide(currentSlide)}
                />
              </picture>
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

      {/* 3. College Project Callout */}
      <section id="college-projects-teaser" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[#561269]/20 bg-gradient-to-br from-[#561269] via-[#461052] to-[#260831] p-4 text-white shadow-lg shadow-purple-950/10 sm:rounded-3xl sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-fuchsia-400/15 blur-3xl sm:h-64 sm:w-64" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/4 h-24 w-24 rounded-full bg-orange-400/10 blur-2xl" />

          <div className="relative flex items-center gap-3 sm:gap-5">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-orange-300 shadow-inner sm:flex">
              <Cpu className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-orange-200/20 bg-orange-400/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-orange-200 sm:text-[10px]">
                <Sparkles className="h-3 w-3" />
                <span>For students & makers</span>
              </div>
              <h3 className="text-base font-extrabold tracking-tight sm:text-2xl">
                Building a college project?
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-purple-100 sm:mt-1.5 sm:text-sm">
                Turn your idea into a working prototype with the right components and expert support.
              </p>
            </div>
            <Link
              to="/bulk-enquiry?mode=custom-project"
              id="explore-college-projects-btn"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#FF6B00] px-3 py-2.5 text-[11px] font-extrabold text-white shadow-md shadow-orange-950/25 transition-colors hover:bg-orange-600 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
            >
              <span className="sm:hidden">Explore</span>
              <span className="hidden sm:inline">Explore Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
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
            <span>Browse all products</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {bestSellers.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
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
          {newArrivals.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
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
