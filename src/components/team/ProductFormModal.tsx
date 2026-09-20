import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductSpec } from '../../types';
import { useApp } from '../../context/AppContext';
import { TechnicalSpecificationManager } from './TechnicalSpecificationManager';
import { CATEGORIES } from '../../mockData/products';
import { uploadImageDataUrl } from '../../services/storageService';
import { generateProductDescription } from '../../services/aiService';
import { validateImageFile } from '../../utils/imageOptimizer';
import { getProductPriceBreakdown } from '../../utils/pricing';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Save, 
  Trash2, 
  Sparkles, 
  Layers, 
  Cpu, 
  Tag, 
  DollarSign, 
  Package, 
  MapPin, 
  Building2,
  CheckCircle2,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  onSave: (productData: Omit<Product, 'id'> | Product) => void | Promise<void>;
  onDelete?: (productId: string) => void;
}

const PRESET_SILICON_IMAGES = [
  { label: 'Raspberry Pi 5', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' },
  { label: 'Arduino / MCU', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=400&q=80' },
  { label: 'ESP32 / Wireless', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80' },
  { label: 'Sensor Module', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
  { label: 'Power / Regulator', url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Display Module', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80' }
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  onSave,
  onDelete
}) => {
  const { categories, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!initialProduct;

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [semixPrice, setSemixPrice] = useState<number | ''>(0);
  const [price, setPrice] = useState<number | ''>(0);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(0);
  const [stockCount, setStockCount] = useState<number | ''>(10);
  const [locationBin, setLocationBin] = useState('BIN-A01');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);
  const [specifications, setSpecifications] = useState<ProductSpec[]>([]);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setSku(initialProduct.sku);
      setBrand(initialProduct.brand);
      setCategory(initialProduct.category);
      setSubcategory(initialProduct.subcategory || '');
      setSemixPrice(initialProduct.semixPrice ?? initialProduct.price ?? 0);
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice || initialProduct.price);
      setStockCount(initialProduct.stockCount);
      setLocationBin(initialProduct.locationBin || 'BIN-A01');
      setShortDescription(initialProduct.shortDescription || '');
      setDescription(initialProduct.description || '');
      const initialImages = Array.isArray(initialProduct.images) && initialProduct.images.length > 0
        ? initialProduct.images
        : (initialProduct.image ? [initialProduct.image] : [PRESET_SILICON_IMAGES[0].url]);
      setImages(initialImages);
      setActivePreviewIdx(0);
      setUrlInput('');
      setSpecifications(initialProduct.specifications ? [...initialProduct.specifications] : []);
      setErrors({});
    } else {
      // Default initial state for Add Product
      setName('');
      setSku('');
      setBrand('');
      setCategory('');
      setSubcategory('');
      setSemixPrice('');
      setPrice('');
      setOriginalPrice('');
      setStockCount(50);
      setLocationBin(`BIN-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(10 + Math.random() * 20)}`);
      setShortDescription('');
      setDescription('');
      setImages([]);
      setActivePreviewIdx(0);
      setUrlInput('');
      setSpecifications([]);
      setErrors({});
    }
  }, [initialProduct, isOpen]);

  // Handle multiple file uploads
  const handleMultipleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        showToast('Invalid Image', validation.error || 'Please select a valid image.', 'warning');
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) {
      showToast('Invalid Files', 'Please select valid image files (PNG, JPG, WebP)', 'warning');
      return;
    }

    let loadedCount = 0;
    const newBase64s: string[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newBase64s.push(e.target.result as string);
        }
        loadedCount += 1;
        if (loadedCount === validFiles.length) {
          setImages((prev) => [...prev, ...newBase64s]);
          setErrors((errs) => {
            const next = { ...errs };
            delete next.images;
            return next;
          });
          showToast('Images Added', `Added ${newBase64s.length} product image(s)`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = (urlToAdd?: string) => {
    const url = (urlToAdd || urlInput).trim();
    if (!url) {
      showToast('URL Required', 'Please enter a valid image URL', 'warning');
      return;
    }
    setImages((prev) => [...prev, url]);
    setUrlInput('');
    setActivePreviewIdx(images.length);
    setErrors((errs) => {
      const next = { ...errs };
      delete next.images;
      return next;
    });
    showToast('Image Added', 'New product image added to gallery', 'success');
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length <= 1) {
      showToast('Warning', 'A product must have at least one image', 'warning');
      return;
    }
    const filtered = images.filter((_, i) => i !== idx);
    setImages(filtered);
    if (activePreviewIdx >= filtered.length) {
      setActivePreviewIdx(Math.max(0, filtered.length - 1));
    }
    showToast('Image Removed', 'Photo removed from gallery', 'info');
  };

  const handleMakePrimary = (idx: number) => {
    if (idx === 0) return;
    const target = images[idx];
    const rest = images.filter((_, i) => i !== idx);
    setImages([target, ...rest]);
    setActivePreviewIdx(0);
    showToast('Primary Cover Set', 'Updated primary thumbnail for catalog listings', 'success');
  };

  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages(updated);
    setActivePreviewIdx(targetIdx);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleFiles(e.dataTransfer.files);
    }
  };

  const derivedPriceInfo = semixPrice !== '' && Number(semixPrice) >= 0
    ? getProductPriceBreakdown(Number(semixPrice))
    : null;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!sku.trim()) errs.sku = 'SKU is required';
    if (!category.trim()) errs.category = 'Category is required';
    if (semixPrice === '' || Number(semixPrice) < 0) errs.price = 'Valid Semix price is required';
    if (stockCount === '' || stockCount < 0) errs.stockCount = 'Valid stock count is required';
    if (images.length === 0) errs.images = 'At least one product image is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Validation Error', 'Please complete all required fields', 'error');
      return;
    }

    const numSemixPrice = Number(semixPrice);
    const computedPricing = getProductPriceBreakdown(numSemixPrice);
    const numPrice = Number(price) || computedPricing.sellingPrice;
    const numStock = Number(stockCount);
    const numOriginal = Number(originalPrice) || computedPricing.mrp;
    const validImages = images.filter((img) => img.trim().length > 0);
    const coverImage = validImages[0] || PRESET_SILICON_IMAGES[0].url;

    const productPayload = {
      ...(initialProduct ? { id: initialProduct.id } : {}),
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      brand: brand.trim(),
      category: category.trim(),
      subcategory: subcategory.trim() || 'Components',
      semixPrice: numSemixPrice,
      price: numPrice,
      originalPrice: numOriginal > numPrice ? numOriginal : numPrice,
      inStock: numStock > 0,
      stockCount: numStock,
      minOrderQty: 1,
      rating: initialProduct?.rating || 4.8,
      reviewCount: initialProduct?.reviewCount || 12,
      image: coverImage,
      images: validImages.length > 0 ? validImages : [coverImage],
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      specifications: specifications.filter((s) => s.name.trim() && s.value.trim()),
      bulkTiers: initialProduct?.bulkTiers || [
        { minQty: 10, discountPercent: 8, unitPrice: Math.round(numPrice * 0.92) },
        { minQty: 50, discountPercent: 15, unitPrice: Math.round(numPrice * 0.85) }
      ],
      tags: initialProduct?.tags || ['Electronics', category],
      locationBin: locationBin.trim().toUpperCase() || 'BIN-A01'
    };

    try {
      setIsUploadingImages(true);
      const permanentImages = await Promise.all(validImages.map((image, index) => {
        if (!image.startsWith('data:image/')) return Promise.resolve(image);
        return uploadImageDataUrl(image, {
          folder: 'products',
          resourceId: initialProduct?.id || sku.trim().toUpperCase(),
          filename: `${sku.trim().toUpperCase()}-${index}.${image.startsWith('data:image/png') ? 'png' : 'webp'}`,
        });
      }));
      const permanentCoverImage = permanentImages[0] || coverImage;
      await onSave({
        ...productPayload,
        image: permanentCoverImage,
        images: permanentImages.length > 0 ? permanentImages : [permanentCoverImage],
      } as any);
      onClose();
    } catch (error) {
      console.error('[Team] Product save failed:', error);
      showToast('Product Save Failed', error instanceof Error ? error.message : 'Image upload or Firestore save failed.', 'error');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!name.trim() || !category.trim()) {
      showToast('Product Name and Category Required', 'Enter both fields before generating a description.', 'warning');
      return;
    }

    setIsGeneratingDescription(true);
    try {
      setDescription(await generateProductDescription(name, category));
      showToast('Description Generated', 'Review and edit the description before saving.', 'success');
    } catch (error) {
      showToast('AI Description Failed', error instanceof Error ? error.message : 'Please try again.', 'error');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="product-form-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="product-form-modal-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#561269] text-white flex items-center justify-center font-bold">
                  {isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {isEditMode ? `Edit Product: ${initialProduct?.name}` : 'Add New Hardware Product'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isEditMode 
                      ? 'Update pricing, bin coordinates, inventory levels, and technical specs'
                      : 'Create a new SKU entry in the SEMIX LABS inventory database'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
              {/* Section 1: Basic Product Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#561269] border-b border-slate-100 pb-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>1. Basic Product Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Raspberry Pi 5 Single Board Computer (8GB RAM)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all ${
                        errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* SKU */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product SKU / ID <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. RPI-5-8GB-ORIG"
                        value={sku}
                        onChange={(e) => setSku(e.target.value.toUpperCase())}
                        className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all ${
                          errors.sku ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.sku && <p className="text-[11px] text-rose-500 mt-1">{errors.sku}</p>}
                  </div>

                  {/* Category */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full h-10 appearance-auto bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                    >
                      <option value="" disabled>Select a category</option>
                      {(categories.length > 0 ? categories : CATEGORIES).map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand / Manufacturer */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brand / Manufacturer
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. STMicroelectronics / Arduino"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                    />
                  </div>

                  {/* Warehouse Bin Location */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Warehouse Location Bin
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BIN-C04"
                      value={locationBin}
                      onChange={(e) => setLocationBin(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Stock Inventory */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#561269] border-b border-slate-100 pb-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>2. Price & Inventory Levels</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Semix Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Semix Price (₹ INR) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs font-mono">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="300"
                        value={semixPrice}
                        onChange={(e) => {
                          const nextValue = e.target.value === '' ? '' : Number(e.target.value);
                          setSemixPrice(nextValue);
                          if (nextValue !== '') {
                            const nextPricing = getProductPriceBreakdown(Number(nextValue));
                            setPrice(nextPricing.sellingPrice);
                            setOriginalPrice(nextPricing.mrp);
                          }
                        }}
                        className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-extrabold text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all ${
                          errors.price ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selling Price (₹ INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs font-mono">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="420"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-100 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-extrabold text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                        readOnly={semixPrice !== '' && Number(semixPrice) >= 0}
                      />
                    </div>
                  </div>

                  {/* MRP / Original Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      MRP / Original Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs font-mono">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="488"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-100 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                        readOnly={semixPrice !== '' && Number(semixPrice) >= 0}
                      />
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Available Stock (Units) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="50"
                      value={stockCount}
                      onChange={(e) => setStockCount(e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-mono font-extrabold text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all ${
                        errors.stockCount ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.stockCount && <p className="text-[11px] text-rose-500 mt-1">{errors.stockCount}</p>}
                  </div>
                </div>

                {derivedPriceInfo && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold uppercase tracking-wide">Derived pricing</span>
                    <span>Semix ₹{derivedPriceInfo.semixPrice.toLocaleString('en-IN')} → Selling ₹{derivedPriceInfo.sellingPrice.toLocaleString('en-IN')} → MRP ₹{derivedPriceInfo.mrp.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Section 3: Product Image Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#561269]">
                    <ImageIcon className="w-4 h-4" />
                    <span>3. Product Images & Gallery ({images.length})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Cover thumbnail is <span className="font-bold text-[#FF6B00]">Image #1</span>
                  </span>
                </div>

                {errors.images && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.images}</span>
                  </div>
                )}

                {/* Upper row: Active preview + Add new images (URL & File Upload) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Left: Active Large Preview with controls */}
                  <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    {images[activePreviewIdx] ? (
                      <div className="space-y-3 w-full">
                        <div className="relative w-full h-44 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 overflow-hidden">
                          <img
                            src={images[activePreviewIdx]}
                            alt={`Preview ${activePreviewIdx + 1}`}
                            className="max-h-full object-contain mix-blend-multiply transition-transform hover:scale-105"
                          />
                          {activePreviewIdx === 0 ? (
                            <span className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" /> Cover Image
                            </span>
                          ) : (
                            <span className="absolute top-2 left-2 bg-slate-800/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                              Photo {activePreviewIdx + 1} of {images.length}
                            </span>
                          )}

                          {images.length > 1 && (
                            <div className="absolute bottom-2 right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setActivePreviewIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                                className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                                title="Previous photo"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setActivePreviewIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                                className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                                title="Next photo"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          {activePreviewIdx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleMakePrimary(activePreviewIdx)}
                              className="text-[11px] font-bold text-[#FF6B00] bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>Set as Primary Cover</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(activePreviewIdx)}
                            className="text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 border-slate-300 bg-white">
                        <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-xs font-semibold text-slate-700">No images added yet</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Add Methods & Presets */}
                  <div className="md:col-span-7 space-y-3">
                    {/* Direct URL input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Add Image by URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddUrl();
                            }
                          }}
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddUrl()}
                          className="px-3 py-2 bg-[#561269] hover:bg-[#460e56] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Image</span>
                        </button>
                      </div>
                    </div>

                    {/* Drag & Drop / Upload files */}
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-3 flex items-center justify-between transition-colors ${
                        dragActive ? 'border-[#561269] bg-[#561269]/5' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#561269]">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Upload Photos (Multi-select enabled)</p>
                          <p className="text-[10px] text-slate-500">Drag & drop files here or browse device</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-slate-500" />
                        <span>Browse Files</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={(e) => e.target.files && handleMultipleFiles(e.target.files)}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    {/* Quick Silicon Asset Presets */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Add from Hardware Presets
                        </span>
                        <span className="text-[10px] text-slate-400">Click to append to gallery</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_SILICON_IMAGES.map((preset) => {
                          const isAlreadyAdded = images.includes(preset.url);
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                if (isAlreadyAdded) {
                                  const idx = images.indexOf(preset.url);
                                  setActivePreviewIdx(idx);
                                } else {
                                  handleAddUrl(preset.url);
                                }
                              }}
                              className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                                isAlreadyAdded
                                  ? 'border-[#561269]/40 bg-[#561269]/5 ring-1 ring-[#561269]/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                className="w-6 h-6 object-contain rounded bg-slate-50 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-slate-700 block truncate">
                                  {preset.label}
                                </span>
                                <span className="text-[9px] text-slate-400 block">
                                  {isAlreadyAdded ? 'Added' : '+ Add'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lower row: Grid of all added images with Reordering, Cover Badge, and Removal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      Product Gallery ({images.length} photos)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Drag or use arrows to reorder. First slot is the primary thumbnail.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {images.map((imgUrl, idx) => {
                      const isCover = idx === 0;
                      const isSelected = activePreviewIdx === idx;
                      return (
                        <div
                          key={`${idx}-${imgUrl.slice(-15)}`}
                          onClick={() => setActivePreviewIdx(idx)}
                          className={`group relative bg-white border-2 rounded-xl p-1.5 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#561269] shadow-sm ring-2 ring-[#561269]/20'
                              : isCover
                              ? 'border-orange-300 bg-orange-50/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Image preview */}
                          <div className="relative aspect-square w-full bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-1 mb-1.5">
                            <img
                              src={imgUrl}
                              alt={`Thumbnail ${idx + 1}`}
                              className="max-h-full max-w-full object-contain mix-blend-multiply"
                            />
                            {isCover && (
                              <span className="absolute top-1 left-1 bg-[#FF6B00] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                                <Star className="w-2 h-2 fill-current" /> Cover
                              </span>
                            )}
                          </div>

                          {/* Controls bar */}
                          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 text-[10px]">
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveImage(idx, 'left');
                                }}
                                title="Move Earlier"
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 cursor-pointer"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === images.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveImage(idx, 'right');
                                }}
                                title="Move Later"
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 cursor-pointer"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMakePrimary(idx);
                                  }}
                                  title="Make Primary Cover"
                                  className="p-1 rounded hover:bg-orange-50 text-slate-500 hover:text-[#FF6B00] transition-colors cursor-pointer"
                                >
                                  <Star className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                title="Delete Photo"
                                className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 4: Descriptions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#561269] border-b border-slate-100 pb-1.5">
                  <Tag className="w-4 h-4" />
                  <span>4. Product Description</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Description (Card Summary)
                    </label>
                    <input
                      type="text"
                      placeholder="Brief one-line summary for product cards and quickview..."
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Full Technical Description
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDescription}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#561269]/30 bg-purple-50 px-2.5 py-1.5 text-[11px] font-bold text-[#561269] transition-colors hover:bg-purple-100 disabled:cursor-wait disabled:opacity-60"
                      >
                        <Sparkles className={`h-3.5 w-3.5 text-[#FF6B00] ${isGeneratingDescription ? 'animate-pulse' : ''}`} />
                        {isGeneratingDescription ? 'Generating...' : 'Generate AI Description'}
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive technical details, operating guidelines, and pinout notes..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#561269] focus:border-[#561269] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Technical Specifications */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#561269] border-b border-slate-100 pb-1.5">
                  <Layers className="w-4 h-4" />
                  <span>5. Hardware Technical Specifications Manager</span>
                </div>

                <TechnicalSpecificationManager
                  specifications={specifications}
                  onChange={setSpecifications}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                {isEditMode && onDelete && initialProduct ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete "${initialProduct.name}" from inventory?`)) {
                        onDelete(initialProduct.id);
                        onClose();
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Product</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isUploadingImages}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    id="save-product-submit-btn"
                    disabled={isUploadingImages}
                    className="bg-[#561269] hover:bg-[#460e56] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#FF6B00]" />
                    <span>{isUploadingImages ? 'Uploading & Saving...' : isEditMode ? 'Save Changes' : 'Create & Publish Product'}</span>
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
