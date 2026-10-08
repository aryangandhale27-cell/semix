import { Product } from '../types';

const PRODUCT_WRITE_QUEUE_KEY = 'semix-product-write-queue-v1';

export const normalizeProduct = (product: Partial<Product>): Product => {
  let images: string[] = [];
  if (Array.isArray(product.images)) {
    images = product.images.filter((image): image is string => (
      typeof image === 'string' && image.trim().length > 0
    ));
  }
  if (images.length === 0 && typeof product.image === 'string' && product.image.trim()) {
    images = [product.image.trim()];
  }

  return {
    ...(product as Product),
    image: images[0] || '',
    images,
  };
};

export function readQueuedProductWrites(): Product[] {
  try {
    const cached = localStorage.getItem(PRODUCT_WRITE_QUEUE_KEY);
    if (!cached) return [];
    const parsed = JSON.parse(cached) as Product[];
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : [];
  } catch {
    return [];
  }
}

export function writeQueuedProductWrites(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCT_WRITE_QUEUE_KEY, JSON.stringify(products));
  } catch {
    // Ignore storage write failures.
  }
}
