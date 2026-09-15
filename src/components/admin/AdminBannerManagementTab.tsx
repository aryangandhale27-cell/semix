import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Upload, 
  Monitor, 
  Smartphone, 
  Sliders, 
  RotateCcw, 
  ExternalLink,
  Check,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HomepageBanner } from '../../types';
import { ImageUploadModal } from './ImageUploadModal';

export const AdminBannerManagementTab: React.FC = () => {
  const { 
    banners, 
    addBanner, 
    updateBanner, 
    deleteBanner, 
    reorderBanners, 
    toggleBannerActive, 
    resetBannersToDefault,
    showToast 
  } = useApp();

  // Active upload modal state
  const [uploadTarget, setUploadTarget] = useState<{
    bannerId: string;
    type: 'desktop' | 'mobile';
  } | null>(null);

  // Edit details modal state
  const [editingBanner, setEditingBanner] = useState<HomepageBanner | null>(null);

  // Add new banner modal state
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [newBannerForm, setNewBannerForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    tabLabel: '',
    shortLabel: '',
    linkUrl: '/shop',
    badge: 'NEW PROMO',
    telemetry: 'SPECIAL LAUNCH • HIGH SPEED DISPATCH',
    desktopImage: '',
    mobileImage: '',
    isActive: true,
  });

  // Responsive live preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewIndex, setPreviewIndex] = useState(0);

  // Move banner up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index - 1];
    newBanners[index - 1] = temp;
    reorderBanners(newBanners);
  };

  // Move banner down
  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index + 1];
    newBanners[index + 1] = temp;
    reorderBanners(newBanners);
  };

  // Handle image uploaded from device
  const handleImageUploaded = async (
    imageUrl: string,
    metadata?: { width: number; height: number; filename: string }
  ) => {
    if (!uploadTarget) return;

    const banner = banners.find((b) => b.id === uploadTarget.bannerId);
    if (!banner) return;

    const updated = {
      ...banner,
      ...(uploadTarget.type === 'desktop' ? { desktopImage: imageUrl } : { mobileImage: imageUrl }),
      updatedAt: new Date().toISOString()
    };

    await updateBanner(updated);
    showToast(
      'Banner Image Applied',
      `Updated ${uploadTarget.type === 'desktop' ? 'Laptop/Desktop' : 'Mobile'} image for "${banner.title}"`,
      'success'
    );
    setUploadTarget(null);
  };

  // Handle saving edited banner details
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    await updateBanner(editingBanner);
    setEditingBanner(null);
  };

  // Handle creating a new banner
  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerForm.title.trim()) {
      showToast('Validation Error', 'Please enter a banner title', 'error');
      return;
    }
    if (!newBannerForm.desktopImage.trim()) {
      showToast('Validation Error', 'Please upload or provide a desktop banner image', 'error');
      return;
    }

    await addBanner({
      title: newBannerForm.title.trim(),
      subtitle: newBannerForm.subtitle.trim(),
      description: newBannerForm.description.trim(),
      tabLabel: newBannerForm.tabLabel.trim() || newBannerForm.title.substring(0, 15),
      shortLabel: newBannerForm.shortLabel.trim() || String(banners.length + 1).padStart(2, '0'),
      linkUrl: newBannerForm.linkUrl.trim() || '/shop',
      badge: newBannerForm.badge.trim() || 'FEATURED',
      telemetry: newBannerForm.telemetry.trim(),
      desktopImage: newBannerForm.desktopImage.trim(),
      mobileImage: newBannerForm.mobileImage.trim() || newBannerForm.desktopImage.trim(),
      isActive: newBannerForm.isActive,
      type: 'custom',
    });

    setIsAddingBanner(false);
    setNewBannerForm({
      title: '',
      subtitle: '',
      description: '',
      tabLabel: '',
      shortLabel: '',
      linkUrl: '/shop',
      badge: 'NEW PROMO',
      telemetry: 'SPECIAL LAUNCH • HIGH SPEED DISPATCH',
      desktopImage: '',
      mobileImage: '',
      isActive: true,
    });
  };

  // Active banners for preview
  const activeBanners = banners.filter((b) => b.isActive !== false);

  return (
    <div className="space-y-6">
      {/* Top Banner Control Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-[#561269]">
            <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Homepage Front Banner Controller</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Homepage Hero Banners ({banners.length})
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Manage front hero slides on the homepage. Change images for both laptop and mobile aspect ratios, reorder sequences, enable or disable slides, or add custom brand promotions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Preview how banners appear on Desktop & Mobile"
          >
            <Eye className="w-4 h-4 text-[#561269]" />
            <span>Responsive Preview</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all banners back to factory default slides?')) {
                resetBannersToDefault();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Restore initial 6 slides"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={() => setIsAddingBanner(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Dual Aspect Ratio Specification Card */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-[#380847] text-white rounded-2xl p-5 border border-purple-900/40 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 text-cyan-300 shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                Dual Device Aspect Ratio Support
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-[#FF6B00] text-white">
                Desktop &amp; Mobile
              </span>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed max-w-4xl">
              The homepage dynamically switches between distinct aspect ratio formats depending on the visitor's screen width. You can configure both images per banner for crisp, unclipped presentation:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-start gap-2.5">
                <Monitor className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Laptop / Desktop View:</span>
                  <span className="text-purple-200 font-mono text-[11px] block mt-0.5">
                    Recommended: 1920 × 600 px (~16:5 to 16:9 ratio)
                  </span>
                  <span className="text-slate-300 text-[10px] block mt-0.5">
                    Rendered across desktop screens with high horizontal breadth.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Mobile View:</span>
                  <span className="text-purple-200 font-mono text-[11px] block mt-0.5">
                    Recommended: 800 × 600 px (~4:3 or 1:1 ratio)
                  </span>
                  <span className="text-slate-300 text-[10px] block mt-0.5">
                    Specially framed for portrait smartphone displays (falls back to desktop if not provided).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            id={`admin-banner-card-${banner.id}`}
            className={`bg-white rounded-2xl border transition-all overflow-hidden ${
              banner.isActive !== false
                ? 'border-slate-200 shadow-xs hover:border-purple-300'
                : 'border-slate-200/60 opacity-70 bg-slate-50'
            }`}
          >
            <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
              {/* Left Column: Order controls & Banner Info */}
              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                {/* Reorder Buttons */}
                <div className="flex flex-col items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={`p-1.5 rounded-lg text-slate-700 transition-colors ${
                      index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-xs cursor-pointer'
                    }`}
                    title="Move slide up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-extrabold text-xs text-slate-700 px-1">
                    #{index + 1}
                  </span>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === banners.length - 1}
                    className={`p-1.5 rounded-lg text-slate-700 transition-colors ${
                      index === banners.length - 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-white hover:shadow-xs cursor-pointer'
                    }`}
                    title="Move slide down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Banner Metadata & Content */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                        banner.isActive !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {banner.isActive !== false ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active on Homepage</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Disabled / Draft</span>
                        </>
                      )}
                    </span>

                    {banner.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-[#561269]">
                        {banner.badge}
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-slate-400">
                      Tab: <strong className="text-slate-700">{banner.tabLabel}</strong>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                    {banner.title}
                  </h3>

                  {banner.subtitle && (
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-slate-500">
                    {banner.linkUrl && (
                      <span className="flex items-center gap-1 text-[#FF6B00] font-semibold text-[11px]">
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{banner.linkUrl}</span>
                      </span>
                    )}
                    {banner.telemetry && (
                      <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                        {banner.telemetry}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column: Visual Preview of Desktop & Mobile Images */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {/* Desktop Image Box */}
                <div className="flex-1 sm:flex-none flex flex-col items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between w-full px-1">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-[#561269]" />
                      <span>Desktop (16:5)</span>
                    </span>
                  </div>
                  <div className="w-36 h-14 rounded-lg bg-slate-900 overflow-hidden relative group border border-slate-300">
                    <img
                      src={banner.desktopImage}
                      alt={`${banner.title} desktop`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setUploadTarget({ bannerId: banner.id, type: 'desktop' })}
                    className="w-full text-center px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] font-bold text-[#561269] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-[#FF6B00]" />
                    <span>Replace Image</span>
                  </button>
                </div>

                {/* Mobile Image Box */}
                <div className="flex-1 sm:flex-none flex flex-col items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between w-full px-1">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-[#FF6B00]" />
                      <span>Mobile (4:3)</span>
                    </span>
                  </div>
                  <div className="w-20 h-14 rounded-lg bg-slate-900 overflow-hidden relative group border border-slate-300">
                    <img
                      src={banner.mobileImage || banner.desktopImage}
                      alt={`${banner.title} mobile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setUploadTarget({ bannerId: banner.id, type: 'mobile' })}
                    className="w-full text-center px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] font-bold text-[#561269] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-[#FF6B00]" />
                    <span>Replace Image</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                <button
                  onClick={() => toggleBannerActive(banner.id)}
                  className={`p-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    banner.isActive !== false
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                  title={banner.isActive !== false ? 'Disable banner' : 'Enable banner'}
                >
                  {banner.isActive !== false ? (
                    <>
                      <EyeOff className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">Disable</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">Enable</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setEditingBanner(banner)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Edit banner text, link and telemetry"
                >
                  <Edit3 className="w-4 h-4 text-[#561269]" />
                  <span className="hidden sm:inline">Edit Details</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete banner "${banner.title}"?`)) {
                      deleteBanner(banner.id);
                    }
                  }}
                  className="p-2 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Delete banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Upload Modal from Device */}
      {uploadTarget && (
        <ImageUploadModal
          isOpen={true}
          onClose={() => setUploadTarget(null)}
          onSave={handleImageUploaded}
          title={
            uploadTarget.type === 'desktop'
              ? 'Upload Laptop / Desktop Banner Image'
              : 'Upload Mobile Banner Image'
          }
          subtitle={
            uploadTarget.type === 'desktop'
              ? 'Wide banner format displayed on laptops, notebooks, and desktop monitors'
              : 'Compact aspect ratio format displayed on mobile smartphones'
          }
          recommendedSize={
            uploadTarget.type === 'desktop'
              ? '1920 × 600 px (or 1600 × 500 px)'
              : '800 × 600 px (or 750 × 750 px)'
          }
          aspectRatioHint={uploadTarget.type === 'desktop' ? '~16:5 ratio' : '~4:3 ratio'}
          aspectRatioType={uploadTarget.type === 'desktop' ? 'desktop-banner' : 'mobile-banner'}
          folder="banners"
          currentImageUrl={
            banners.find((b) => b.id === uploadTarget.bannerId)?.[
              uploadTarget.type === 'desktop' ? 'desktopImage' : 'mobileImage'
            ]
          }
          resourceId={uploadTarget.bannerId}
        />
      )}

      {/* Edit Banner Details Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#561269] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-300" />
                <h3 className="font-bold text-base">Edit Banner Details</h3>
              </div>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subtitle / Promo Text
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Navigation Tab Label
                  </label>
                  <input
                    type="text"
                    value={editingBanner.tabLabel}
                    onChange={(e) => setEditingBanner({ ...editingBanner, tabLabel: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Badge Tag (e.g. SEMIX EXCLUSIVE)
                  </label>
                  <input
                    type="text"
                    value={editingBanner.badge || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Destination URL
                </label>
                <input
                  type="text"
                  value={editingBanner.linkUrl || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, linkUrl: e.target.value })}
                  placeholder="/shop or /bulk-enquiry"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Telemetry / Banner Ticker Text
                </label>
                <input
                  type="text"
                  value={editingBanner.telemetry || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, telemetry: e.target.value })}
                  placeholder="ALL-INDIA DISPATCH • 10% OFF CODE: 10ELECTRO"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-banner-active"
                  checked={editingBanner.isActive !== false}
                  onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF6B00] focus:ring-[#FF6B00]"
                />
                <label htmlFor="edit-banner-active" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Display this banner actively on the homepage hero carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-orange-600 shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Banner Modal */}
      {isAddingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-[#561269] to-[#380847] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-300" />
                <div>
                  <h3 className="font-bold text-base">Add New Homepage Hero Banner</h3>
                  <p className="text-xs text-purple-200">Configure slide copy and upload images for desktop & mobile</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddingBanner(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Festival Silicon Blowout • Up to 40% OFF"
                  value={newBannerForm.title}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subtitle / Explainer
                </label>
                <input
                  type="text"
                  placeholder="e.g., Authentic dev boards, microcontrollers and robotics chassis with next-day dispatch"
                  value={newBannerForm.subtitle}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                />
              </div>

              {/* Image Inputs */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  Banner Images
                </span>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Laptop / Desktop Image URL (1920 × 600 px recommended) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /uploads/banners/..."
                    value={newBannerForm.desktopImage}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, desktopImage: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile View Image URL (800 × 600 px recommended, optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty to automatically use desktop image"
                    value={newBannerForm.mobileImage}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, mobileImage: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Navigation Tab Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mega Sale"
                    value={newBannerForm.tabLabel}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, tabLabel: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Destination Link URL
                  </label>
                  <input
                    type="text"
                    value={newBannerForm.linkUrl}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, linkUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-[#561269] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="new-banner-active"
                  checked={newBannerForm.isActive}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF6B00] focus:ring-[#FF6B00]"
                />
                <label htmlFor="new-banner-active" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Activate banner immediately on the homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingBanner(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-orange-600 shadow-md cursor-pointer"
                >
                  Add Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[95vh]">
            {/* Header with Device Toggles */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Homepage Front Banner Live Preview
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch device ratios to see how customer view looks on laptop vs mobile
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    previewDevice === 'desktop'
                      ? 'bg-[#561269] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span>Laptop (16:5)</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    previewDevice === 'mobile'
                      ? 'bg-[#561269] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#FF6B00]" />
                  <span>Mobile (4:3)</span>
                </button>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Preview Stage */}
            <div className="p-4 sm:p-8 flex items-center justify-center overflow-y-auto flex-1 bg-slate-950/60">
              {activeBanners.length === 0 ? (
                <div className="text-center p-8 text-slate-400 text-xs">
                  No active banners to preview. Please enable at least one banner.
                </div>
              ) : (
                <div
                  className={`transition-all duration-300 overflow-hidden rounded-2xl border border-slate-700 shadow-2xl bg-black relative ${
                    previewDevice === 'desktop'
                      ? 'w-full max-w-4xl aspect-16/6'
                      : 'w-80 aspect-4/3'
                  }`}
                >
                  {/* Current Active Slide Image */}
                  <img
                    src={
                      previewDevice === 'mobile'
                        ? activeBanners[previewIndex % activeBanners.length]?.mobileImage ||
                          activeBanners[previewIndex % activeBanners.length]?.desktopImage
                        : activeBanners[previewIndex % activeBanners.length]?.desktopImage
                    }
                    alt={activeBanners[previewIndex % activeBanners.length]?.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Text Overlay for Custom Banners */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white pointer-events-none">
                    {activeBanners[previewIndex % activeBanners.length]?.badge && (
                      <span className="inline-block self-start px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#FF6B00] text-white mb-1.5">
                        {activeBanners[previewIndex % activeBanners.length]?.badge}
                      </span>
                    )}
                    <h4 className="font-black text-sm sm:text-xl text-white leading-tight drop-shadow-md">
                      {activeBanners[previewIndex % activeBanners.length]?.title}
                    </h4>
                    {activeBanners[previewIndex % activeBanners.length]?.subtitle && (
                      <p className="text-[11px] sm:text-xs text-slate-200 mt-0.5 line-clamp-1">
                        {activeBanners[previewIndex % activeBanners.length]?.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Slide Navigator Controls */}
            {activeBanners.length > 1 && (
              <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Slide {((previewIndex % activeBanners.length) + 1)} of {activeBanners.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPreviewIndex(
                        (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                      )
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setPreviewIndex((prev) => (prev + 1) % activeBanners.length)
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
