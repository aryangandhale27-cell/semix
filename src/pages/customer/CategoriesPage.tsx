import React, { useMemo, useState } from 'react';
import { CategoryCard } from '../../components/common/CategoryCard';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../mockData/products';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

const PUBLIC_CATEGORY_IDS = new Set(CATEGORIES.slice(0, 12).map((category) => category.id));

export const CategoriesPage: React.FC = () => {
  const { categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const publicCategories = categories.filter((category) => PUBLIC_CATEGORY_IDS.has(category.id));
  const visibleCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return publicCategories;
    return publicCategories.filter((category) =>
      [category.name, category.description, category.slug].some((value) => value.toLowerCase().includes(query))
    );
  }, [publicCategories, searchQuery]);

  return (
    <section className="min-h-screen bg-[#f7f8fb] py-5 sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-[#24102d] px-5 py-7 text-white shadow-xl sm:mb-8 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#ff6b00]/25 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb45c]">
              <Sparkles className="h-3.5 w-3.5" />
              Semix Labs Catalog
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Find the right hardware for your next build.</h1>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-purple-100 sm:text-sm">
              Browse curated electronics, development boards, power systems, tools, and lab hardware.
            </p>
          </div>
          <div className="relative z-10 mt-6 flex flex-wrap gap-2 text-[11px] font-bold sm:absolute sm:bottom-8 sm:right-8 sm:mt-0">
            <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-2">{publicCategories.length} categories</span>
            <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-2">Verified components</span>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#561269]">
              <SlidersHorizontal className="h-4 w-4 text-[#ff6b00]" />
              <h2 className="text-lg font-black tracking-tight sm:text-xl">Explore categories</h2>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Select a category to open its complete catalog.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search categories"
              aria-label="Search categories"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-slate-800 shadow-2xs outline-none transition focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/10"
            />
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 px-3 sm:grid-cols-2 sm:gap-4 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={`categories-loading-${index}`}
              className="min-h-[220px] animate-pulse rounded-xl border border-slate-200 bg-slate-200 sm:min-h-[270px] sm:rounded-2xl"
              aria-label="Loading category"
            />
          ))}
        </div>
      ) : visibleCategories.length === 0 ? (
        <div className="mx-auto max-w-7xl rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-2xs">
          No categories match your search.
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 px-3 sm:grid-cols-2 sm:gap-4 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 lg:px-8">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              priority={visibleCategories.indexOf(category) < 4}
            />
          ))}
        </div>
      )}
    </section>
  );
};