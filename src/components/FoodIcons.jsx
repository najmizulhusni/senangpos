import React from 'react';

// Custom food icons as SVG components
export const NasiLemakIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="24" r="20" fill="#FEF3C7"/>
    <ellipse cx="24" cy="26" rx="14" ry="10" fill="#FEFCE8"/>
    <path d="M14 24c2-4 6-6 10-6s8 2 10 6" stroke="#92400E" strokeWidth="2" fill="#FEF9C3"/>
    <circle cx="20" cy="22" r="3" fill="#DC2626"/>
    <circle cx="28" cy="20" r="2" fill="#16A34A"/>
    <path d="M18 28c0 0 2 2 6 2s6-2 6-2" stroke="#78350F" strokeWidth="1.5"/>
  </svg>
);

export const ChickenIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="28" rx="14" ry="12" fill="#FBBF24"/>
    <ellipse cx="24" cy="26" rx="12" ry="10" fill="#F59E0B"/>
    <path d="M16 24c2-3 5-4 8-4s6 1 8 4" stroke="#92400E" strokeWidth="2"/>
    <circle cx="20" cy="22" r="2" fill="#78350F"/>
    <ellipse cx="28" cy="30" rx="4" ry="3" fill="#D97706"/>
  </svg>
);

export const NoodleIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="30" rx="16" ry="10" fill="#FEF3C7"/>
    <path d="M12 28c4 0 4-4 8-4s4 4 8 4s4-4 8-4" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <path d="M10 32c4 0 4-4 8-4s4 4 8 4s4-4 8-4" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="32" cy="24" r="3" fill="#DC2626"/>
    <circle cx="18" cy="26" r="2" fill="#16A34A"/>
  </svg>
);

export const SoupIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="32" rx="16" ry="8" fill="#FEF3C7"/>
    <ellipse cx="24" cy="28" rx="14" ry="10" fill="#FDE68A"/>
    <path d="M14 26c0-6 4-10 10-10s10 4 10 10" stroke="#92400E" strokeWidth="2" fill="#FEFCE8"/>
    <circle cx="20" cy="28" r="2" fill="#16A34A"/>
    <circle cx="28" cy="26" r="2" fill="#DC2626"/>
    <path d="M22 20v-4M26 20v-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const RiceBoxIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <rect x="8" y="16" width="32" height="24" rx="4" fill="#FEF3C7"/>
    <rect x="10" y="18" width="28" height="20" rx="3" fill="#FEFCE8"/>
    <line x1="24" y1="18" x2="24" y2="38" stroke="#E5E7EB" strokeWidth="1"/>
    <ellipse cx="17" cy="28" rx="5" ry="4" fill="#FEF9C3"/>
    <ellipse cx="31" cy="28" rx="5" ry="4" fill="#F59E0B"/>
    <circle cx="31" cy="26" r="2" fill="#16A34A"/>
  </svg>
);

export const EggIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="26" rx="12" ry="14" fill="#FEFCE8"/>
    <ellipse cx="24" cy="26" rx="10" ry="12" fill="#FEF3C7"/>
    <circle cx="24" cy="26" r="6" fill="#FBBF24"/>
  </svg>
);

export const BoiledEggIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="26" rx="12" ry="14" fill="#FEFCE8"/>
    <ellipse cx="24" cy="28" rx="10" ry="10" fill="#FEF3C7"/>
    <circle cx="24" cy="28" r="5" fill="#FBBF24"/>
  </svg>
);

export const MeatIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="26" rx="14" ry="10" fill="#DC2626"/>
    <ellipse cx="24" cy="24" rx="12" ry="8" fill="#EF4444"/>
    <path d="M16 24c2-2 5-3 8-3s6 1 8 3" stroke="#991B1B" strokeWidth="2"/>
    <ellipse cx="20" cy="26" rx="3" ry="2" fill="#FCA5A5"/>
  </svg>
);

export const ChiliIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <path d="M24 8c-2 0-4 2-4 4v2h8v-2c0-2-2-4-4-4z" fill="#16A34A"/>
    <path d="M16 14c0 0-4 8-4 16c0 6 5 10 12 10s12-4 12-10c0-8-4-16-4-16H16z" fill="#DC2626"/>
    <path d="M20 18c0 0-2 6-2 12c0 4 3 6 6 6" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CrackerIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="24" rx="16" ry="8" fill="#FBBF24"/>
    <ellipse cx="24" cy="22" rx="14" ry="6" fill="#FCD34D"/>
    <circle cx="18" cy="22" r="2" fill="#F59E0B"/>
    <circle cx="26" cy="21" r="2" fill="#F59E0B"/>
    <circle cx="30" cy="23" r="1.5" fill="#F59E0B"/>
  </svg>
);

// Icon mapping for menu items
export const FOOD_ICONS = {
  'nasi-lemak': NasiLemakIcon,
  'chicken': ChickenIcon,
  'noodle': NoodleIcon,
  'soup': SoupIcon,
  'rice-box': RiceBoxIcon,
  'egg': EggIcon,
  'boiled-egg': BoiledEggIcon,
  'meat': MeatIcon,
  'chili': ChiliIcon,
  'cracker': CrackerIcon,
};

export const getFoodIcon = (iconKey, size = 40) => {
  const IconComponent = FOOD_ICONS[iconKey];
  if (IconComponent) {
    return <IconComponent size={size} />;
  }
  return <NasiLemakIcon size={size} />;
};
