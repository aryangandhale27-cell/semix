import React from 'react';

interface SemixLabsLogoProps {
  /**
   * 'dark' -> Deep violet brand colors for light backgrounds (default)
   * 'light' -> Crisp white typography with glowing violet accents for dark backgrounds
   * 'icon' -> Only the signature circuit microchip emblem
   * 'full' -> Standard full brand logo
   */
  variant?: 'dark' | 'light' | 'icon' | 'full';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const SemixLabsLogo: React.FC<SemixLabsLogoProps> = ({
  variant = 'dark',
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const isLight = variant === 'light';
  const isIconOnly = variant === 'icon';

  // Sizing heights and scaling
  const sizeClasses = {
    sm: isIconOnly ? 'h-7 w-7' : 'h-8',
    md: isIconOnly ? 'h-9 w-9' : 'h-10',
    lg: isIconOnly ? 'h-12 w-12' : 'h-12',
    xl: isIconOnly ? 'h-16 w-16' : 'h-16',
  };

  const primaryColor = isLight ? '#FFFFFF' : '#360655';
  const traceColor = isLight ? '#E2E8F0' : '#360655';
  const chipBg = isLight ? '#6B21A8' : '#360655';
  const screwCrossColor = isLight ? '#6B21A8' : '#360655';

  if (isIconOnly) {
    return (
      <svg
        viewBox="0 0 150 150"
        className={`${sizeClasses[size]} ${className} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SEMIX LABS emblem"
      >
        <defs>
          <linearGradient id={`semixIconCoreGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#E9D5FF' : '#C084FC'} />
            <stop offset="100%" stopColor={isLight ? '#A855F7' : '#9333EA'} />
          </linearGradient>
        </defs>

        {/* Pin Leads (Short Stubs) */}
        <g stroke={traceColor} strokeWidth="2.5" strokeLinecap="butt">
          {/* Top */}
          <line x1="44" y1="39" x2="44" y2="33" />
          <line x1="60" y1="39" x2="60" y2="33" />
          <line x1="82" y1="39" x2="82" y2="33" />
          <line x1="98" y1="39" x2="98" y2="33" />
          {/* Bottom */}
          <line x1="44" y1="111" x2="44" y2="117" />
          <line x1="60" y1="111" x2="60" y2="117" />
          <line x1="82" y1="111" x2="82" y2="117" />
          <line x1="98" y1="111" x2="98" y2="117" />
          {/* Left */}
          <line x1="39" y1="44" x2="33" y2="44" />
          <line x1="39" y1="60" x2="33" y2="60" />
          <line x1="39" y1="82" x2="33" y2="82" />
          <line x1="39" y1="98" x2="33" y2="98" />
          {/* Right */}
          <line x1="111" y1="44" x2="117" y2="44" />
          <line x1="111" y1="60" x2="117" y2="60" />
          <line x1="111" y1="82" x2="117" y2="82" />
          <line x1="111" y1="98" x2="117" y2="98" />
        </g>

        {/* Circuit Traces with Round Pads */}
        <g stroke={traceColor} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Top */}
          <path d="M 52 39 L 52 28 L 34 28 L 34 14" />
          <circle cx="34" cy="14" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 68 39 L 68 18" />
          <circle cx="68" cy="18" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 76 39 L 76 18" />
          <circle cx="76" cy="18" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 90 39 L 90 28 L 108 28 L 108 14" />
          <circle cx="108" cy="14" r="3.8" fill={traceColor} stroke="none" />

          {/* Bottom */}
          <path d="M 52 111 L 52 122 L 34 122 L 34 136" />
          <circle cx="34" cy="136" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 68 111 L 68 132" />
          <circle cx="68" cy="132" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 76 111 L 76 132" />
          <circle cx="76" cy="132" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 90 111 L 90 122 L 108 122 L 108 136" />
          <circle cx="108" cy="136" r="3.8" fill={traceColor} stroke="none" />

          {/* Left */}
          <path d="M 39 52 L 28 52 L 28 34 L 14 34" />
          <circle cx="14" cy="34" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 39 68 L 18 68" />
          <circle cx="18" cy="68" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 39 76 L 18 76" />
          <circle cx="18" cy="76" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 39 90 L 28 90 L 28 108 L 14 108" />
          <circle cx="14" cy="108" r="3.8" fill={traceColor} stroke="none" />

          {/* Right */}
          <path d="M 111 52 L 122 52 L 122 34 L 136 34" />
          <circle cx="136" cy="34" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 111 68 L 132 68" />
          <circle cx="132" cy="68" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 111 76 L 132 76" />
          <circle cx="132" cy="76" r="3.8" fill={traceColor} stroke="none" />
          <path d="M 111 90 L 122 90 L 122 108 L 136 108" />
          <circle cx="136" cy="108" r="3.8" fill={traceColor} stroke="none" />
        </g>

        {/* Chip Body */}
        <rect x="39" y="39" width="72" height="72" rx="13" ry="13" fill={chipBg} />

        {/* 4 Screws */}
        <circle cx="51" cy="51" r="4.2" fill="#FFFFFF" />
        <path d="M 49 51 L 53 51 M 51 49 L 51 53" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

        <circle cx="99" cy="51" r="4.2" fill="#FFFFFF" />
        <path d="M 97 51 L 101 51 M 99 49 L 99 53" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

        <circle cx="51" cy="99" r="4.2" fill="#FFFFFF" />
        <path d="M 49 99 L 53 99 M 51 97 L 51 101" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

        <circle cx="99" cy="99" r="4.2" fill="#FFFFFF" />
        <path d="M 97 99 L 101 99 M 99 97 L 99 101" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

        {/* Glowing Center */}
        <rect x="58" y="58" width="34" height="34" rx="7" ry="7" fill={`url(#semixIconCoreGrad-${variant})`} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 540 160"
      className={`${sizeClasses[size]} w-auto ${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SEMIX LABS"
    >
      <defs>
        <linearGradient id={`semixCoreGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#E9D5FF' : '#C084FC'} />
          <stop offset="100%" stopColor={isLight ? '#A855F7' : '#9333EA'} />
        </linearGradient>
        <linearGradient id={`semixXGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isLight ? '#C084FC' : '#360655'} />
          <stop offset="35%" stopColor={isLight ? '#E879F9' : '#7E22CE'} />
          <stop offset="70%" stopColor={isLight ? '#F472B6' : '#A855F7'} />
          <stop offset="100%" stopColor={isLight ? '#F9A8D4' : '#D946EF'} />
        </linearGradient>
      </defs>

      {/* ================= MICROCHIP SYMBOL ================= */}
      {/* Pin Leads (Short Stubs) */}
      <g stroke={traceColor} strokeWidth="2.5" strokeLinecap="butt">
        {/* Top */}
        <line x1="44" y1="39" x2="44" y2="33" />
        <line x1="60" y1="39" x2="60" y2="33" />
        <line x1="82" y1="39" x2="82" y2="33" />
        <line x1="98" y1="39" x2="98" y2="33" />
        {/* Bottom */}
        <line x1="44" y1="111" x2="44" y2="117" />
        <line x1="60" y1="111" x2="60" y2="117" />
        <line x1="82" y1="111" x2="82" y2="117" />
        <line x1="98" y1="111" x2="98" y2="117" />
        {/* Left */}
        <line x1="39" y1="44" x2="33" y2="44" />
        <line x1="39" y1="60" x2="33" y2="60" />
        <line x1="39" y1="82" x2="33" y2="82" />
        <line x1="39" y1="98" x2="33" y2="98" />
        {/* Right */}
        <line x1="111" y1="44" x2="117" y2="44" />
        <line x1="111" y1="60" x2="117" y2="60" />
        <line x1="111" y1="82" x2="117" y2="82" />
        <line x1="111" y1="98" x2="117" y2="98" />
      </g>

      {/* Traces with Round Pads */}
      <g stroke={traceColor} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Top Traces */}
        <path d="M 52 39 L 52 28 L 34 28 L 34 14" />
        <circle cx="34" cy="14" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 68 39 L 68 18" />
        <circle cx="68" cy="18" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 76 39 L 76 18" />
        <circle cx="76" cy="18" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 90 39 L 90 28 L 108 28 L 108 14" />
        <circle cx="108" cy="14" r="3.8" fill={traceColor} stroke="none" />

        {/* Bottom Traces */}
        <path d="M 52 111 L 52 122 L 34 122 L 34 136" />
        <circle cx="34" cy="136" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 68 111 L 68 132" />
        <circle cx="68" cy="132" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 76 111 L 76 132" />
        <circle cx="76" cy="132" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 90 111 L 90 122 L 108 122 L 108 136" />
        <circle cx="108" cy="136" r="3.8" fill={traceColor} stroke="none" />

        {/* Left Traces */}
        <path d="M 39 52 L 28 52 L 28 34 L 14 34" />
        <circle cx="14" cy="34" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 39 68 L 18 68" />
        <circle cx="18" cy="68" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 39 76 L 18 76" />
        <circle cx="18" cy="76" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 39 90 L 28 90 L 28 108 L 14 108" />
        <circle cx="14" cy="108" r="3.8" fill={traceColor} stroke="none" />

        {/* Right Traces */}
        <path d="M 111 52 L 122 52 L 122 34 L 136 34" />
        <circle cx="136" cy="34" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 111 68 L 132 68" />
        <circle cx="132" cy="68" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 111 76 L 132 76" />
        <circle cx="132" cy="76" r="3.8" fill={traceColor} stroke="none" />
        <path d="M 111 90 L 122 90 L 122 108 L 136 108" />
        <circle cx="136" cy="108" r="3.8" fill={traceColor} stroke="none" />
      </g>

      {/* Main Chip Body */}
      <rect x="39" y="39" width="72" height="72" rx="13" ry="13" fill={chipBg} />

      {/* 4 Corner Screws */}
      <circle cx="51" cy="51" r="4.2" fill="#FFFFFF" />
      <path d="M 49 51 L 53 51 M 51 49 L 51 53" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

      <circle cx="99" cy="51" r="4.2" fill="#FFFFFF" />
      <path d="M 97 51 L 101 51 M 99 49 L 99 53" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

      <circle cx="51" cy="99" r="4.2" fill="#FFFFFF" />
      <path d="M 49 99 L 53 99 M 51 97 L 51 101" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

      <circle cx="99" cy="99" r="4.2" fill="#FFFFFF" />
      <path d="M 97 99 L 101 99 M 99 97 L 99 101" stroke={screwCrossColor} strokeWidth="1.2" strokeLinecap="round" />

      {/* Center Glowing Core */}
      <rect x="58" y="58" width="34" height="34" rx="7" ry="7" fill={`url(#semixCoreGrad-${variant})`} />

      {/* ================= TYPOGRAPHY ================= */}
      {/* "SEMI" */}
      <text
        x="162"
        y="105"
        fill={primaryColor}
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="76"
        letterSpacing="-1px"
      >
        SEMI
      </text>

      {/* "X" with rounded-pill ends and radiant violet-magenta gradient */}
      <g stroke={`url(#semixXGrad-${variant})`} strokeWidth="15.5" strokeLinecap="round">
        <line x1="384" y1="46" x2="438" y2="105" />
        <line x1="384" y1="105" x2="438" y2="46" />
      </g>

      {/* Registered Trademark Symbol "®" */}
      <g transform="translate(452, 43)">
        <circle cx="5" cy="5" r="5" fill="none" stroke={primaryColor} strokeWidth="1.2" />
        <text
          x="5"
          y="7.2"
          fill={primaryColor}
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontSize="6.5"
          fontWeight="800"
          textAnchor="middle"
        >
          R
        </text>
      </g>

      {/* "LABS" Subtitle */}
      {showSubtitle && (
        <text
          x="320"
          y="134"
          fill={primaryColor}
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="9px"
        >
          LABS
        </text>
      )}
    </svg>
  );
};
