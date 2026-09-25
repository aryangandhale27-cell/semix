import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  className?: string;
  priority?: boolean;
}

// Curated high-resolution cutout product images for electronics categories
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'cat-electronic-components': 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80',
  'cat-electronic-modules-dev-boards': 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80',
  'cat-batteries-power-supply': 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80',
  'cat-smd-sample-books-kits': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'cat-cables-connectors': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'cat-hardware-tools': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  'cat-displays': 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80',
  'cat-robotics-diy-kits': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
  'cat-motors': 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
  'cat-sensors': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'cat-physics-instruments': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
  'cat-smd-components': 'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=600&q=80',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className = '', priority = false }) => {
  const [imageError, setImageError] = useState(false);

  const displayImage = category.image;
  const shouldPrioritizeImage = priority;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`h-full ${className}`}
    >
      <Link
        to={`/shop?category=${encodeURIComponent(category.name)}`}
        id={`category-card-${category.id}`}
        className="group flex h-full min-h-[220px] flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-slate-950 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/15 sm:min-h-[270px] sm:rounded-2xl"
      >
        {/* Full-bleed image treatment keeps the admin-managed image as the visual focus. */}
        <div className="relative min-h-[220px] flex-1 overflow-hidden bg-slate-900 sm:min-h-[270px]">
          {!imageError && (
            <img
              src={displayImage}
              alt={category.name}
              onError={() => setImageError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading={shouldPrioritizeImage ? 'eager' : 'lazy'}
              fetchPriority={shouldPrioritizeImage ? 'high' : 'auto'}
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/5" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_62%,rgba(255,255,255,0.12)_62%,transparent_63%)] opacity-60" />

          {/* Fallback graphic when an admin-managed image cannot be loaded. */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#561269] to-slate-950 text-white">
              <Cpu className="h-12 w-12 opacity-80 sm:h-16 sm:w-16" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
            <h3 className="line-clamp-3 min-h-[2.7rem] font-mono text-[11px] font-black normal-case leading-snug tracking-[0.03em] text-[#FFF1DF] drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)] transition-colors group-hover:text-[#FFB45C] sm:line-clamp-2 sm:min-h-[2.75rem] sm:text-base sm:uppercase sm:leading-tight sm:tracking-wide">
              {category.name}
            </h3>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};
