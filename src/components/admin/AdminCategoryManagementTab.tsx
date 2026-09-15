import React, { useState } from 'react';
import { 
  FolderTree, 
  Upload, 
  RotateCcw, 
  Search, 
  Check, 
  ExternalLink, 
  Eye, 
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../mockData/products';
import { ImageUploadModal } from './ImageUploadModal';

export const AdminCategoryManagementTab: React.FC = () => {
  const { 
    categories, 
    updateCategoryImage, 
    resetCategoryImage, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [previewCategory, setPreviewCategory] = useState<{ name: string; image: string } | null>(null);

  // Filtered categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCat = categories.find((c) => c.id === selectedCategoryId);

  const handleSaveUploadedImage = async (
    imageUrl: string,
    metadata?: { width: number; height: number; filename: string }
  ) => {
    if (!selectedCategoryId) return;
    await updateCategoryImage(selectedCategoryId, imageUrl);
    setSelectedCategoryId(null);
  };

  const handleResetAll = async () => {
    if (window.confirm('Reset all 12 categories to factory default showcase images?')) {
      for (const cat of CATEGORIES) {
        if (cat.image) {
          await updateCategoryImage(cat.id, cat.image);
        }
      }
      showToast('Categories Reset', 'All category images restored to original stock photos', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-[#561269]">
            <FolderTree className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Category Image Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Category Showcase Images ({categories.length})
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Update and customize showcase photography for all product categories. Changes automatically reflect across the homepage "Explore Categories" section and category navigation cards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetAll}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset all category images to default stock photos"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset All to Defaults</span>
          </button>
        </div>
      </div>

      {/* Specifications Notice */}
      <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-950">
        <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 block">Category Image Standards:</span>
          <p className="text-slate-600 leading-relaxed">
            Recommended Resolution: <strong className="text-purple-900">800 × 800 px (1:1 Square Ratio)</strong>. Category cards on the homepage display with rounded borders and gradient overlays. Clean product-centered photography with high contrast yields optimal results.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Search category by name or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => {
          const defaultCat = CATEGORIES.find((c) => c.id === cat.id);
          const isCustom = defaultCat && defaultCat.image !== cat.image;

          return (
            <div
              key={cat.id}
              id={`category-image-card-${cat.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between group"
            >
              {/* Category Image Header */}
              <div className="relative aspect-4/3 sm:aspect-square bg-slate-900 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-300 font-bold border border-white/10">
                      {cat.count} items
                    </span>

                    {isCustom && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FF6B00] text-white text-[10px] font-extrabold uppercase shadow-xs">
                        Custom Image
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setPreviewCategory({ name: cat.name, image: cat.image })}
                      className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 transition-colors cursor-pointer"
                      title="View full preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="w-full py-2 px-3 rounded-xl bg-[#561269] hover:bg-[#430d52] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Change Image</span>
                  </button>

                  {isCustom && (
                    <button
                      onClick={() => resetCategoryImage(cat.id)}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>Reset to Factory Default</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal from Device */}
      {selectedCat && (
        <ImageUploadModal
          isOpen={true}
          onClose={() => setSelectedCategoryId(null)}
          onSave={handleSaveUploadedImage}
          title={`Upload Image for "${selectedCat.name}"`}
          subtitle="Choose high-resolution product photography to showcase this category"
          recommendedSize="800 × 800 px (Square 1:1)"
          aspectRatioHint="1:1 ratio"
          aspectRatioType="category"
          folder="categories"
          currentImageUrl={selectedCat.image}
          resourceId={selectedCat.id}
        />
      )}

      {/* Full Preview Modal */}
      {previewCategory && (
        <div 
          onClick={() => setPreviewCategory(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">{previewCategory.name}</h3>
              <button 
                onClick={() => setPreviewCategory(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 rounded-xl overflow-hidden bg-slate-900 aspect-square">
              <img
                src={previewCategory.image}
                alt={previewCategory.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
