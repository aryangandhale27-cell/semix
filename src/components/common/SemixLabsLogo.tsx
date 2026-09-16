import React from 'react';
import logoImage from '../../assets/images/logo semix.png';

interface SemixLabsLogoProps {
  variant?: 'dark' | 'light' | 'icon' | 'full';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const SemixLabsLogo: React.FC<SemixLabsLogoProps> = ({
  variant = 'dark',
  className = '',
  size = 'lg', // Increased default from 'md' to 'lg'
}) => {
  const isIconOnly = variant === 'icon';

  // Scaled up to align cleanly with standard 40px-48px search inputs
  const sizeClasses = {
    sm: isIconOnly ? 'h-8 w-8' : 'h-8',
    md: isIconOnly ? 'h-10 w-10' : 'h-10 md:h-11',
    lg: isIconOnly ? 'h-12 w-12' : 'h-12 md:h-14',
    xl: isIconOnly ? 'h-16 w-16' : 'h-16 md:h-20',
  };

  return (
    <img
      src={logoImage}
      alt="SEMIX LABS"
      style={{ height: '56px', width: 'auto', minWidth: '180px', objectFit: 'cover', objectPosition: 'center' }}
      className={`${sizeClasses[size]} shrink-0 ${className}`}
    />
  );
};