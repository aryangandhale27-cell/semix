import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  ChevronRight, 
  Tag, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { searchProducts, SearchHit } from '../../services/searchEngine';
import { recordSearchQuery } from '../../services/searchConfig';
import { Product } from '../../types';

interface SearchAutocompleteProps {
  isMobile?: boolean;
  onSearchSubmit?: (query: string, category?: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  isMobile = false,
  onSearchSubmit,
  selectedCategory = 'all',
  onCategoryChange,
  placeholder,
  className = '',
}) => {
  const { products, categories, searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState(searchQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external searchQuery changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounce input updates with 250ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
    }, 250);

    return () => clearTimeout(handler);
  }, [inputValue]);

  // Execute intelligent search on actual catalog products
  const searchResult = useMemo(() => {
    if (!debouncedQuery) {
      return null;
    }
    return searchProducts(products, debouncedQuery, {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      limit: isMobile ? 5 : 8,
    });
  }, [products, debouncedQuery, selectedCategory, isMobile]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format price in Indian Rupee
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Submit full search navigation
  const executeSearch = (queryToSearch: string, cat: string = selectedCategory) => {
    const q = queryToSearch.trim();
    if (!q) return;

    setSearchQuery(q);
    setIsOpen(false);

    recordSearchQuery(
      q,
      searchResult?.normalizedQuery || q.toLowerCase(),
      searchResult?.total || 0
    );

    if (onSearchSubmit) {
      onSearchSubmit(q, cat);
      return;
    }

    if (cat && cat !== 'all') {
      navigate(`/shop?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/shop?q=${encodeURIComponent(q)}`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If an item in the suggestions list is selected via arrow keys
    if (selectedIndex >= 0 && searchResult && searchResult.results[selectedIndex]) {
      handleProductSelect(searchResult.results[selectedIndex].product);
      return;
    }
    executeSearch(inputValue);
  };

  const handleProductSelect = (product: Product) => {
    recordSearchQuery(
      inputValue,
      searchResult?.normalizedQuery || inputValue.toLowerCase(),
      searchResult?.total || 0,
      product.id,
      product.name
    );
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  };

  const handleCategorySelect = (categoryName: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryName);
    }
    executeSearch(inputValue, categoryName);
  };

  // Keyboard navigation through suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !searchResult || searchResult.results.length === 0) {
      if (e.key === 'Escape') setIsOpen(false);
      return;
    }

    const totalItems = searchResult.results.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Text highlighting helper for matches
  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return text;

    // Build regex pattern safely
    const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 text-[#561269] font-bold px-0.5 rounded-xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const clearInput = () => {
    setInputValue('');
    setSearchQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Mobile vs Desktop search container */}
      {isMobile ? (
        <form onSubmit={handleFormSubmit} className="flex w-full items-center">
          <div className="flex w-full rounded-lg border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#561269] overflow-hidden shadow-2xs transition-colors">
            {onCategoryChange && (
              <div className="relative flex shrink-0 items-center border-r border-slate-200 bg-slate-100/70 px-2">
                <select
                  id="mobile-search-category-filter"
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  aria-label="Filter search by category"
                  className="w-[5.75rem] appearance-none bg-transparent pr-3 text-[10px] font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 h-1.5 w-1.5 -translate-y-0.5 rotate-45 border-r border-b border-slate-400" />
              </div>
            )}

            <div className="relative flex-1 flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={inputRef}
                id="mobile-search-autocomplete-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsOpen(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => {
                  if (inputValue.trim().length > 0) setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || 'Search components, ICs, sensors...'}
                className="w-full pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                autoComplete="off"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={clearInput}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              type="submit"
              id="mobile-search-submit-btn"
              className="bg-[#561269] hover:bg-[#460e56] text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-center transition-colors"
              aria-label="Submit search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFormSubmit} className="flex w-full items-center">
          <div className="flex w-full rounded-xl border-2 border-[#561269]/20 focus-within:border-[#561269] bg-slate-50/50 hover:bg-white focus-within:bg-white transition-all overflow-hidden shadow-xs">
            {/* Category Dropdown Filter */}
            {onCategoryChange && (
              <div className="relative border-r border-slate-200 bg-slate-100/70 hidden sm:flex items-center px-3">
                <select
                  id="search-category-filter"
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  aria-label="Filter search by category"
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer pr-4 appearance-none py-2"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 absolute right-2 pointer-events-none -translate-y-0.5" />
              </div>
            )}

            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                id="search-autocomplete-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsOpen(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => {
                  if (inputValue.trim().length > 0) setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  placeholder ||
                  'Search 1,000+ components, ICs, sensors (e.g. Arduino, ESP32, 5V relay, 8 ohm)...'
                }
                className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                autoComplete="off"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={clearInput}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              id="search-submit-btn"
              type="submit"
              className="bg-[#561269] hover:bg-[#460e56] text-white font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Search</span>
            </button>
          </div>
        </form>
      )}

      {/* Autocomplete Dropdown Panel */}
      {isOpen && inputValue.trim().length > 0 && searchResult && (
        <div
          id="search-autocomplete-dropdown"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Typo Correction / "Did you mean?" Banner */}
          {searchResult.didYouMean && (
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Did you mean:{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue(searchResult.didYouMean!);
                      executeSearch(searchResult.didYouMean!);
                    }}
                    className="font-bold underline text-[#561269] hover:text-[#FF6B00] cursor-pointer"
                  >
                    {searchResult.didYouMean}
                  </button>
                  ?
                </span>
              </div>
              <span className="text-[11px] text-amber-700/80 hidden sm:inline">
                Showing best matching components
              </span>
            </div>
          )}

          {/* If 0 products found */}
          {searchResult.results.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                No matching components found for &ldquo;{inputValue}&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Only components actually in the verified catalog are suggested. Try checking for
                typos or searching by generic keyword (e.g. <span className="font-mono text-slate-700">relay</span>, <span className="font-mono text-slate-700">microcontroller</span>, <span className="font-mono text-slate-700">32-bit</span>).
              </p>
            </div>
          ) : (
            <div>
              {/* Matching Categories & Brands Quick Chips */}
              {(searchResult.matchingCategories.length > 0 || searchResult.matchingBrands.length > 0) && (
                <div className="px-3 sm:px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
                    <Layers className="w-3 h-3 text-slate-400" /> Filter:
                  </span>
                  {searchResult.matchingCategories.slice(0, 2).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className="inline-flex items-center gap-1 bg-white hover:bg-[#561269]/10 text-slate-700 hover:text-[#561269] border border-slate-200 px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer"
                    >
                      <Tag className="w-2.5 h-2.5 text-[#561269]" />
                      <span>{cat}</span>
                    </button>
                  ))}
                  {searchResult.matchingBrands.slice(0, 2).map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => {
                        navigate(`/shop?brand=${encodeURIComponent(brand)}`);
                        setIsOpen(false);
                      }}
                      className="inline-flex items-center gap-1 bg-white hover:bg-[#FF6B00]/10 text-slate-700 hover:text-[#FF6B00] border border-slate-200 px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer"
                    >
                      <Cpu className="w-2.5 h-2.5 text-[#FF6B00]" />
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Product Suggestion List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 py-1">
                {searchResult.results.map((hit, idx) => {
                  const p = hit.product;
                  const isSelected = selectedIndex === idx;

                  return (
                    <div
                      key={p.id}
                      id={`search-item-${idx}`}
                      onClick={() => handleProductSelect(p)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-purple-50/70 text-[#561269]' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center p-0.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover rounded-sm"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-xs border border-slate-200">
                            {p.sku}
                          </span>
                          {p.brand && (
                            <span className="text-[10px] text-slate-400 truncate">
                              {p.brand}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate mt-0.5">
                          {highlightMatch(p.name, inputValue)}
                        </h4>

                        {/* Specification snippet if match occurred on specs */}
                        {hit.snippet && (
                          <p className="text-[10px] text-emerald-700 bg-emerald-50 inline-block px-1.5 py-0.5 rounded-xs mt-0.5 truncate max-w-full">
                            {hit.snippet}
                          </p>
                        )}
                      </div>

                      {/* Price and Stock Status */}
                      <div className="text-right shrink-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900">
                          {formatPrice(p.price)}
                        </div>
                        {p.inStock && p.stockCount > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>In Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-slate-400">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action Footer */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => executeSearch(inputValue)}
                  className="font-semibold text-[#561269] hover:text-[#FF6B00] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View all {searchResult.total} verified results for &ldquo;{inputValue}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Press <kbd className="font-mono bg-white px-1 py-0.5 border border-slate-200 rounded-xs text-slate-600">Enter</kbd> to search
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
