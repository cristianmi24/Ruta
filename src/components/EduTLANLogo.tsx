import React from 'react';

interface EduTLANLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCategoryBadge?: boolean;
}

/**
 * Logotipo Oficial del Grupo de Investigación EduTLAN
 * (Categoría A MinCiencias · Universidad de Córdoba).
 */
export const EduTLANLogo: React.FC<EduTLANLogoProps> = ({
  className = '',
  size = 'md',
  showCategoryBadge = true
}) => {
  const heightPx = {
    sm: 44,
    md: 68,
    lg: 100,
    xl: 135,
    '2xl': 175
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      role="img"
      aria-label="Logotipo oficial de EduTLAN - Grupo de Investigación"
    >
      <img
        src="https://pub-1ec8494dfebf4d9d96fdb25fd581ca63.r2.dev/logo%20edutlan%20sin%20fondo%20(1).png"
        alt="Logotipo Oficial Grupo EduTLAN"
        style={{ height: `${heightPx}px`, width: 'auto', maxHeight: 'none' }}
        className="object-contain transition-transform duration-200 drop-shadow-sm"
        loading="eager"
      />
      {showCategoryBadge && (
        <span
          className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] shadow-xs shrink-0"
          title="Grupo de Investigación Categoría A MinCiencias"
        >
          Cat. A MinCiencias
        </span>
      )}
    </div>
  );
};
