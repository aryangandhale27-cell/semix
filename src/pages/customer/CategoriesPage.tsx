import React from 'react';
import { CategoryCard } from '../../components/common/CategoryCard';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../mockData/products';

const PUBLIC_CATEGORY_IDS = new Set(CATEGORIES.slice(0, 12).map((category) => category.id));

export const CategoriesPage: React.FC = () => {
  const { categories } = useApp();
  const publicCategories = categories.filter((category) => PUBLIC_CATEGORY_IDS.has(category.id));

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8 border-b border-slate-200 pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">Semix Labs</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#561269]">CATEGORIES</h1>
      </div>

      {publicCategories.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          Categories are temporarily unavailable. Please try again shortly.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {publicCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
};