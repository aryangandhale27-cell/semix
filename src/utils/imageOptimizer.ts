export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface OptimizedImageResult {
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
  aspectRatio: number;
  filename: string;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validates file format and file size
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file extension
  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
  const isExtensionValid = ALLOWED_EXTENSIONS.includes(ext);

  // Check MIME type
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) || isExtensionValid;

  if (!isMimeValid) {
    return {
      valid: false,
      error: 'Please upload a JPG, PNG, JPEG, or WEBP image.'
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image size (${sizeInMb}MB) exceeds the maximum allowed limit of 5MB.`
    };
  }

  return { valid: true };
}

/**
 * Optimizes an uploaded image using HTML5 Canvas:
 * - Downscales if greater than maxWidth
 * - Compresses to high-quality WebP (or JPEG fallback)
 * - Returns data URL, dimensions, and aspect ratio
 */
export async function optimizeAndProcessImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    targetFormat?: 'image/webp' | 'image/jpeg' | 'image/png';
  } = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.88,
    targetFormat = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file from device.'));
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Invalid or corrupted image file. Please upload a valid image.'));
      };

      img.onload = () => {
        try {
          let { width, height } = img;
          const originalAspect = width / height;

          // Scale dimensions if larger than bounds
          if (width > maxWidth) {
            width = maxWidth;
            height = Math.round(width / originalAspect);
          }
          if (height > maxHeight) {
            height = maxHeight;
            width = Math.round(height * originalAspect);
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback: return original file as dataUrl
            const fallbackData = event.target?.result as string;
            resolve({
              dataUrl: fallbackData,
              originalSize: file.size,
              optimizedSize: file.size,
              width: img.width,
              height: img.height,
              aspectRatio: originalAspect,
              filename: file.name,
              mimeType: file.type
            });
            return;
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image to canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Test if targetFormat (e.g. image/webp) is supported by canvas
          let formatToUse = targetFormat;
          let outputDataUrl = canvas.toDataURL(formatToUse, quality);

          // If browser doesn't support webp export, fallback to jpeg or png
          if (!outputDataUrl.startsWith(`data:${formatToUse}`)) {
            formatToUse = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            outputDataUrl = canvas.toDataURL(formatToUse, quality);
          }

          // Calculate approximate byte size of base64 string
          const base64Length = outputDataUrl.length - (outputDataUrl.indexOf(',') + 1);
          const estimatedBytes = Math.round((base64Length * 3) / 4);

          resolve({
            dataUrl: outputDataUrl,
            originalSize: file.size,
            optimizedSize: estimatedBytes,
            width,
            height,
            aspectRatio: originalAspect,
            filename: file.name.replace(/\.[^/.]+$/, '') + (formatToUse === 'image/webp' ? '.webp' : '.jpg'),
            mimeType: formatToUse
          });
        } catch (err) {
          reject(err);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
