import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Image as ImageIcon, 
  Smartphone, 
  Monitor, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  validateImageFile, 
  optimizeAndProcessImage, 
  OptimizedImageResult 
} from '../../utils/imageOptimizer';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string, metadata?: { width: number; height: number; filename: string }) => Promise<void>;
  title: string;
  subtitle?: string;
  recommendedSize: string;
  aspectRatioHint: string;
  aspectRatioType?: 'desktop-banner' | 'mobile-banner' | 'category';
  folder?: 'banners' | 'categories';
  currentImageUrl?: string;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  subtitle,
  recommendedSize,
  aspectRatioHint,
  aspectRatioType = 'desktop-banner',
  folder = 'banners',
  currentImageUrl
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [optimized, setOptimized] = useState<OptimizedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validate
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file.');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      // Configure max bounds based on aspect ratio type
      let maxWidth = 1920;
      let maxHeight = 1080;
      if (aspectRatioType === 'mobile-banner') {
        maxWidth = 1080;
        maxHeight = 1080;
      } else if (aspectRatioType === 'category') {
        maxWidth = 800;
        maxHeight = 800;
      }

      const result = await optimizeAndProcessImage(file, {
        maxWidth,
        maxHeight,
        quality: 0.9,
        targetFormat: 'image/webp'
      });

      setOptimized(result);
    } catch (err: any) {
      console.error('Image processing error:', err);
      setErrorMessage(err.message || 'Failed to process selected image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleSave = async () => {
    if (!optimized) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      // 1. Attempt upload to server endpoint
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin'
        },
        body: JSON.stringify({
          imageBase64: optimized.dataUrl,
          filename: optimized.filename,
          folder
        })
      });

      let finalUrl = optimized.dataUrl; // Fallback to base64 if server unavailable
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.url) {
          finalUrl = json.url;
        }
      }

      // 2. Call parent onSave
      await onSave(finalUrl, {
        width: optimized.width,
        height: optimized.height,
        filename: optimized.filename
      });

      // Close modal
      handleClose();
    } catch (err: any) {
      console.error('Error saving image:', err);
      // Even if network fails, fallback to local base64
      try {
        await onSave(optimized.dataUrl, {
          width: optimized.width,
          height: optimized.height,
          filename: optimized.filename
        });
        handleClose();
      } catch (fallbackErr: any) {
        setErrorMessage(fallbackErr.message || 'Failed to apply image.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setOptimized(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#561269] to-[#380847] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-cyan-300">
              {aspectRatioType === 'mobile-banner' ? (
                <Smartphone className="w-5 h-5" />
              ) : aspectRatioType === 'desktop-banner' ? (
                <Monitor className="w-5 h-5" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {title}
              </h3>
              <p className="text-xs text-purple-200">
                {subtitle || 'Upload high-resolution asset directly from your device'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Specifications Notice */}
          <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-purple-950">
            <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block">Recommended Specifications:</span>
              <p className="text-slate-600 leading-relaxed">
                <span className="font-semibold text-purple-900">{recommendedSize}</span> • Ratio:{' '}
                <span className="font-semibold text-purple-900">{aspectRatioHint}</span>
              </p>
              <p className="text-slate-500 text-[11px]">
                Supported formats: <strong className="text-slate-700">JPG, JPEG, PNG, WEBP</strong> (Max 5MB). High-resolution files are automatically optimized for instant web loading without loss of detail.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Upload Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Upload Area / Preview */}
          {!optimized ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragOver 
                  ? 'border-[#FF6B00] bg-orange-50/50 scale-[1.01]' 
                  : 'border-slate-300 hover:border-[#561269] hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#561269] flex items-center justify-center shadow-xs">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-[#FF6B00]" />
                ) : (
                  <Upload className="w-6 h-6 text-[#561269]" />
                )}
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm block">
                  {isProcessing ? 'Processing Image...' : 'Click to Browse Device Files or Drag & Drop'}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Supports JPG, PNG, and WEBP up to 5MB
                </span>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-orange-600 shadow-sm transition-all"
              >
                Choose File from Device
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview Container */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 p-2 relative shadow-inner">
                <div className="relative w-full max-h-72 flex items-center justify-center overflow-hidden rounded-lg bg-black/40">
                  <img
                    src={optimized.dataUrl}
                    alt="Uploaded Preview"
                    className={`max-h-72 object-contain w-full rounded-md ${
                      aspectRatioType === 'desktop-banner' ? 'aspect-16/5 sm:aspect-3/1' : 
                      aspectRatioType === 'mobile-banner' ? 'aspect-4/3' : 'aspect-square'
                    }`}
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                    {optimized.width} × {optimized.height} px
                  </div>
                </div>
              </div>

              {/* Optimization Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Original Size</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {(optimized.originalSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-700 text-[10px] uppercase font-bold block">Optimized Size</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {(optimized.optimizedSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Format</span>
                  <span className="font-mono font-semibold text-purple-700 uppercase">
                    {optimized.mimeType.replace('image/', '')}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Aspect Ratio</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {optimized.aspectRatio.toFixed(2)}:1
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setOptimized(null);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Different Image</span>
                </button>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready to upload and apply
                </span>
              </div>
            </div>
          )}

          {/* Current Image Comparison (if available) */}
          {currentImageUrl && !optimized && (
            <div className="border-t border-slate-200 pt-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Currently Live Image
              </span>
              <div className="h-20 w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 bg-slate-100 p-1 flex items-center justify-center">
                <img
                  src={currentImageUrl}
                  alt="Current Live Image"
                  className="h-full w-full object-cover rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!optimized || isUploading}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer ${
              !optimized || isUploading
                ? 'bg-slate-400 opacity-60 cursor-not-allowed'
                : 'bg-[#FF6B00] hover:bg-orange-600 hover:scale-[1.02]'
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading & Applying...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save & Apply Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
