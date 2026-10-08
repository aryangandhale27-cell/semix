import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Product } from '../../types';
import { searchProducts } from '../../services/searchEngine';
import { 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  ChevronLeft,
  ChevronRight,
  X, 
  Check, 
  Search, 
  RotateCcw,
  Sparkles,
  Zap,
  ImageOff
} from 'lucide-react';

const PRODUCTS_PER_PAGE = 24;

const parsePriceParam = (value: string | null): number | null => {
  if (value === null || value === '') {
    return null;
  }
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const ShopPage: React.FC = () => {
  const { products, categories, searchQuery, setSearchQuery, isProductsLoading } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get('category') || 'All';
  });

  const [inStockOnly, setInStockOnly] = useState(() => searchParams.get('inStock') === 'true');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => searchParams.getAll('brand'));
  const [selectedVoltages, setSelectedVoltages] = useState<string[]>(() => searchParams.getAll('voltage'));
  const [minPrice, setMinPrice] = useState<number | null>(() => parsePriceParam(searchParams.get('minPrice')));
  const [maxPrice, setMaxPrice] = useState<number | null>(() => parsePriceParam(searchParams.get('maxPrice')));
  const [minPriceDraft, setMinPriceDraft] = useState('');
  const [maxPriceDraft, setMaxPriceDraft] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    setSelectedCategory(cat || 'All');

    const q = searchParams.get('q');
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }

    const maxPriceParam = parsePriceParam(searchParams.get('maxPrice'));
    if (maxPriceParam !== null) {
      setMaxPrice(maxPriceParam);
    }

    const filter = searchParams.get('filter');
    if (filter === 'new') {
      setSortBy('newest');
    }
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (inStockOnly) nextParams.set('inStock', 'true');
    else nextParams.delete('inStock');

    nextParams.delete('brand');
    selectedBrands.forEach((brand) => nextParams.append('brand', brand));

    nextParams.delete('voltage');
    selectedVoltages.forEach((voltage) => nextParams.append('voltage', voltage));

    if (minPrice !== null) nextParams.set('minPrice', String(minPrice));
    else nextParams.delete('minPrice');

    if (maxPrice !== null) nextParams.set('maxPrice', String(maxPrice));
    else nextParams.delete('maxPrice');

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    inStockOnly,
    selectedBrands,
    selectedVoltages,
    minPrice,
    maxPrice,
    searchParams,
    setSearchParams,
  ]);

  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
  }, [products]);

  const allVoltages = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.voltage))).filter(Boolean) as string[];
  }, [products]);

  const maxPriceLimit = useMemo(() => {
    const highestPrice = products.reduce((highest, product) => Math.max(highest, product.price), 0);
    return Math.max(10000, Math.ceil(highestPrice / 1000) * 1000);
  }, [products]);

  const applyMinPrice = () => {
    if (!minPriceDraft.trim()) {
      setMinPrice(null);
      return;
    }
    const parsedValue = Number(minPriceDraft);
    if (!Number.isFinite(parsedValue)) {
      setMinPriceDraft(String(minPrice ?? 0));
      return;
    }
    const value = Math.min(maxPriceLimit, Math.max(0, parsedValue));
    setMinPrice(value);
    setMinPriceDraft(String(value));
    if (maxPrice !== null && value > maxPrice) {
      setMaxPrice(value);
      setMaxPriceDraft(String(value));
    }
  };

  const applyMaxPrice = () => {
    if (!maxPriceDraft.trim()) {
      setMaxPrice(null);
      return;
    }
    const parsedValue = Number(maxPriceDraft);
    if (!Number.isFinite(parsedValue)) {
      setMaxPriceDraft(String(maxPrice ?? maxPriceLimit));
      return;
    }
    const value = Math.min(maxPriceLimit, Math.max(minPrice ?? 0, parsedValue));
    setMaxPrice(value);
    setMaxPriceDraft(String(value));
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleVoltage = (v: string) => {
    setSelectedVoltages((prev) =>
      prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setInStockOnly(false);
    setSelectedBrands([]);
    setSelectedVoltages([]);
    setMinPrice(null);
    setMaxPrice(null);
    setMinPriceDraft('');
    setMaxPriceDraft('');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  const searchEngineResult = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchProducts(products, searchQuery, {
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      limit: undefined,
    });
  }, [products, searchQuery, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let candidateList: { product: Product; searchScore: number }[] = [];

    if (searchEngineResult) {
      candidateList = searchEngineResult.results.map((hit) => ({
        product: hit.product,
        searchScore: hit.score,
      }));
    } else {
      candidateList = products
        .filter((product) => {
          if (selectedCategory !== 'All' && product.category !== selectedCategory) {
            return false;
          }
          return true;
        })
        .map((p) => ({ product: p, searchScore: 0 }));
    }

    const filtered = candidateList.filter(({ product }) => {
      if (inStockOnly && (!product.inStock || product.stockCount <= 0)) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      if (selectedVoltages.length > 0 && (!product.voltage || !selectedVoltages.includes(product.voltage))) {
        return false;
      }
      if (minPrice !== null && product.price < minPrice) {
        return false;
      }
      if (maxPrice !== null && product.price > maxPrice) {
        return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'price-low') return a.product.price - b.product.price;
      if (sortBy === 'price-high') return b.product.price - a.product.price;
      if (sortBy === 'rating') return b.product.rating - a.product.rating;
      if (sortBy === 'newest') return (b.product.isNew ? 1 : 0) - (a.product.isNew ? 1 : 0);
      
      if (searchEngineResult) {
        return b.searchScore - a.searchScore;
      }
      return 0;
    });

    return filtered.map((item) => item.product);
  }, [
    products,
    searchEngineResult,
    selectedCategory,
    inStockOnly,
    selectedBrands,
    selectedVoltages,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const firstVisibleProduct = filteredProducts.length === 0
    ? 0
    : (activePage - 1) * PRODUCTS_PER_PAGE + 1;
  const lastVisibleProduct = Math.min(activePage * PRODUCTS_PER_PAGE, filteredProducts.length);
  const visibleProducts = filteredProducts.slice(firstVisibleProduct - 1, lastVisibleProduct);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    inStockOnly,
    selectedBrands,
    selectedVoltages,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    selectedBrands.length +
    selectedVoltages.length +
    (searchQuery ? 1 : 0) +
    ((minPrice !== null && minPrice > 0) || (maxPrice !== null && maxPrice < maxPriceLimit) ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#561269] font-semibold">Shop Hardware</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="font-bold text-[#FF6B00]">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#561269]">
            {selectedCategory === 'All' ? 'Complete Electronics Catalog' : selectedCategory}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {firstVisibleProduct}-{lastVisibleProduct} of {filteredProducts.length}{' '}
            {isProductsLoading ? 'loaded products · Syncing full catalog...' : 'verified electronic parts & compute modules'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            id="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300"
          >
            <Filter className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="hidden sm:inline text-slate-500">Sort by:</span>
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products by"
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#561269] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">New Arrivals First</option>
            </select>
          </div>

          <div className="hidden sm:inline-flex rounded-xl border border-slate-300 bg-slate-50 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#561269] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#561269] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-[#561269] flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#FF6B00]" />
              <span>Filter Catalog</span>
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
              Categories
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-[#561269] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-80">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-[#561269] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] opacity-80">
                    {products.filter((p) => p.category === cat.name).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#561269] focus:ring-[#561269]"
              />
              <span className="text-xs font-bold text-slate-800">In-Stock Ready to Ship</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span>Min Price</span>
              <label htmlFor="desktop-min-price" className="flex items-center gap-1 font-mono text-[#561269]">
                ₹
                <input
                  id="desktop-min-price"
                  type="number"
                  min="0"
                  max={maxPrice ?? maxPriceLimit}
                  step="50"
                  value={minPriceDraft || (minPrice ?? 0)}
                  onChange={(e) => setMinPriceDraft(e.target.value)}
                  onBlur={applyMinPrice}
                  className="w-24 bg-transparent text-right outline-none focus:ring-1 focus:ring-[#FF6B00] rounded"
                />
              </label>
            </div>
            <input
              type="range"
              min="0"
              max={maxPrice ?? maxPriceLimit}
              step="50"
              value={minPrice ?? 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMinPrice(value);
                setMinPriceDraft(String(value));
                if (maxPrice !== null && value > maxPrice) {
                  setMaxPrice(value);
                  setMaxPriceDraft(String(value));
                }
              }}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mt-3 mb-2">
              <span>Max Price</span>
              <label htmlFor="desktop-max-price" className="flex items-center gap-1 font-mono text-[#561269]">
                ₹
                <input
                  id="desktop-max-price"
                  type="number"
                  min={minPrice ?? 0}
                  max={maxPriceLimit}
                  step="50"
                  value={maxPriceDraft || (maxPrice ?? maxPriceLimit)}
                  onChange={(e) => setMaxPriceDraft(e.target.value)}
                  onBlur={applyMaxPrice}
                  className="w-24 bg-transparent text-right outline-none focus:ring-1 focus:ring-[#FF6B00] rounded"
                />
              </label>
            </div>
            <input
              type="range"
              min={minPrice ?? 0}
              max={maxPriceLimit}
              step="50"
              value={maxPrice ?? maxPriceLimit}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMaxPrice(value);
                setMaxPriceDraft(String(value));
                if (minPrice !== null && value < minPrice) setMinPrice(value);
              }}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹0</span>
              <span>₹{maxPriceLimit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {allVoltages.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
                Logic / Operating Voltage
              </span>
              <div className="space-y-1.5">
                {allVoltages.map((v) => (
                  <label key={v} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedVoltages.includes(v)}
                      onChange={() => toggleVoltage(v)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#561269]"
                    />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
              Manufacturer / Brand
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#561269]"
                  />
                  <span className="truncate">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9">
          {searchEngineResult?.didYouMean && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Showing verified catalog results. Did you mean{' '}
                  <button
                    onClick={() => setSearchQuery(searchEngineResult.didYouMean!)}
                    className="font-bold underline text-[#561269] hover:text-[#FF6B00] cursor-pointer"
                  >
                    {searchEngineResult.didYouMean}
                  </button>
                  ?
                </span>
              </div>
            </div>
          )}

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Active Filters:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#561269] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-rose-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-[#FF6B00] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-amber-200">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-emerald-200">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {b}
                  <button onClick={() => toggleBrand(b)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-[#FF6B00] hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* SKELETON LOADER WHEN FETCHING FROM FIREBASE */}
          {isProductsLoading && filteredProducts.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4">
                  <div className="bg-slate-100 h-48 rounded-xl w-full" />
                  <div className="space-y-2">
                    <div className="bg-slate-100 h-4 rounded w-3/4" />
                    <div className="bg-slate-100 h-3 rounded w-1/2" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="bg-slate-100 h-6 rounded w-1/3" />
                    <div className="bg-slate-100 h-8 rounded-xl w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No matching hardware found</h3>
              <p className="text-xs text-slate-500 mb-4">
                We couldn't find components matching your specific filters or keyword.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#561269] hover:bg-[#460e56] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#561269]/40 hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4"
                >
                  {product.images?.[0] || product.image ? (
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-24 h-24 object-contain mix-blend-multiply bg-slate-50 p-2 rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-50 text-slate-300 rounded-lg shrink-0" aria-label="Product image unavailable">
                      <ImageOff className="w-6 h-6" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-bold text-[#561269]">{product.brand}</span>
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {product.sku}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 hover:text-[#561269]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {product.shortDescription}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <div>
                      <span className="text-lg font-extrabold text-slate-900 font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">+18% GST</span>
                    </div>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-[#561269] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#460e56]"
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isProductsLoading && filteredProducts.length > PRODUCTS_PER_PAGE && (
            <nav aria-label="Product result pages" className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row">
              <p className="text-xs font-medium text-slate-500">
                Showing {firstVisibleProduct}-{lastVisibleProduct} of {filteredProducts.length}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={activePage === 1}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:border-[#561269] hover:text-[#561269] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span aria-live="polite" className="min-w-20 text-center text-xs font-bold text-slate-600">
                  Page {activePage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={activePage === totalPages}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:border-[#561269] hover:text-[#561269] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </nav>
          )}
        </main>
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-80 max-w-full h-full p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-sm text-[#561269]">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              <div>
                <label htmlFor="mobile-min-price" className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                  Min Price
                  <span className="font-mono text-[#561269] flex items-center gap-1">
                    ₹
                    <input
                      id="mobile-min-price"
                      type="number"
                      min="0"
                      max={maxPrice ?? maxPriceLimit}
                      step="50"
                      value={minPriceDraft || (minPrice ?? 0)}
                      onChange={(e) => setMinPriceDraft(e.target.value)}
                      onBlur={applyMinPrice}
                      className="w-24 bg-transparent text-right outline-none focus:ring-1 focus:ring-[#FF6B00] rounded"
                    />
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice ?? maxPriceLimit}
                  step="50"
                  value={minPrice ?? 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setMinPrice(value);
                    setMinPriceDraft(String(value));
                    if (maxPrice !== null && value > maxPrice) {
                      setMaxPrice(value);
                      setMaxPriceDraft(String(value));
                    }
                  }}
                  className="w-full"
                />
                <label htmlFor="mobile-max-price" className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1 mt-3">
                  Max Price
                  <span className="font-mono text-[#561269] flex items-center gap-1">
                    ₹
                    <input
                      id="mobile-max-price"
                      type="number"
                      min={minPrice ?? 0}
                      max={maxPriceLimit}
                      step="50"
                      value={maxPriceDraft || (maxPrice ?? maxPriceLimit)}
                      onChange={(e) => setMaxPriceDraft(e.target.value)}
                      onBlur={applyMaxPrice}
                      className="w-24 bg-transparent text-right outline-none focus:ring-1 focus:ring-[#FF6B00] rounded"
                    />
                  </span>
                </label>
                <input
                  type="range"
                  min={minPrice ?? 0}
                  max={maxPriceLimit}
                  step="50"
                  value={maxPrice ?? maxPriceLimit}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setMaxPrice(value);
                    setMaxPriceDraft(String(value));
                    if (minPrice !== null && value < minPrice) setMinPrice(value);
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold text-xs mt-6"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};