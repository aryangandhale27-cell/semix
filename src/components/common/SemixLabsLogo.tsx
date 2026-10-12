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

  const sizeClasses = {
    sm: isIconOnly ? 'h-8 w-8' : 'h-8 w-[120px]',
    md: isIconOnly ? 'h-10 w-10' : 'h-10 w-[140px] md:h-11 md:w-[154px]',
    lg: isIconOnly ? 'h-12 w-12' : 'h-12 w-[160px] md:h-14 md:w-[180px]',
    xl: isIconOnly ? 'h-16 w-16' : 'h-16 w-[180px] md:h-20 md:w-[220px]',
  };

  return (
    <img
      src={logoImage}
      alt="SEMIX LABS"
      className={`${sizeClasses[size]} shrink-0 object-cover object-center ${className}`}
    />
  );
};