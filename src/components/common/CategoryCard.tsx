import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Cpu } from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  className?: string;
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

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  // Determine display image: prioritize category.image or fall back to curated map
  const displayImage = category.image || CATEGORY_IMAGE_MAP[category.id] || CATEGORY_IMAGE_MAP['cat-electronic-components'];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`h-full ${className}`}
    >
      <Link
        to={`/shop?category=${encodeURIComponent(category.name)}`}
        id={`category-card-${category.id}`}
        className="group flex flex-col h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-300 transition-all duration-300"
      >
        {/* Upper Area: Vibrant Orange Image Showcase with Watermark Pattern & Cutout */}
        <div className="relative aspect-square sm:aspect-4/3 w-full bg-gradient-to-br from-[#FF6A00] via-[#FF5F00] to-[#E55500] flex items-center justify-center overflow-hidden p-2 sm:p-4">
          {/* Subtle Circuit Board Watermark Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 160"
            preserveAspectRatio="none"
          >
            <path
              d="M10 20 h30 l20 20 v40 l20 20 h60 M180 30 h-40 l-20 20 v30 M30 140 h50 l20 -20 v-20 M140 140 l20 -20 h30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 3"
            />
            <circle cx="60" cy="40" r="3" fill="currentColor" />
            <circle cx="80" cy="100" r="3" fill="currentColor" />
            <circle cx="120" cy="50" r="3" fill="currentColor" />
            <circle cx="100" cy="120" r="3" fill="currentColor" />
          </svg>

          {/* Radial Center Highlight for depth */}
          <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/10 pointer-events-none" />

          {/* Top-Right Diagonal Arrow Icon (hidden on mobile to match clean reference screenshot) */}
          <div className="hidden sm:flex absolute top-3 right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/25 backdrop-blur-xs border border-white/35 text-white items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-[#FF5F00] group-hover:shadow-md">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Centered Product Cutout Image */}
          <div className="relative z-1 w-full h-full flex items-center justify-center">
            {!imageError ? (
              <img
                src={displayImage}
                alt={category.name}
                onError={() => setImageError(true)}
                className="w-full h-full max-h-[78%] sm:max-h-[82%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] rounded-lg transition-transform duration-300 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/25 backdrop-blur-xs flex items-center justify-center text-white border border-white/40 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Cpu className="w-7 h-7 sm:w-10 sm:h-10 drop-shadow-md" />
              </div>
            )}
          </div>
        </div>

        {/* Lower Area: Clean White Details & Centered Typography Panel matching reference image */}
        <div className="p-2 sm:p-4 bg-white flex flex-col justify-center flex-1 border-t border-slate-100 text-center">
          <h3 className="font-bold text-[11px] sm:text-sm md:text-base text-slate-800 leading-tight group-hover:text-[#FF5F00] transition-colors line-clamp-2 min-h-[1.8rem] sm:min-h-[2.75rem] flex items-center justify-center">
            {category.name}
          </h3>

          <div className="hidden sm:flex mt-2.5 pt-2 border-t border-slate-100 items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100/90 px-2.5 py-0.5 rounded-full border border-slate-200/60 group-hover:bg-orange-50 group-hover:text-[#FF5F00] group-hover:border-orange-200 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F00] animate-pulse" />
              {category.count}+ Components
            </span>

            <span className="text-[11px] font-bold text-[#FF5F00] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
