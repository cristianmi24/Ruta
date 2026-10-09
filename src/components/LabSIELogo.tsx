import React from 'react';

export interface LabSIELogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
}

/**
 * Logotipo Oficial de LabSIE (Laboratorio de Sistemas Inteligentes en Educación)
 * Universidad de Córdoba.
 * Renderizado de alta definición y escala ampliada para máxima visibilidad.
 */
export const LabSIELogo: React.FC<LabSIELogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  // Alturas ampliadas para garantizar que el logo de LabSIE se aprecie grande y nítido
  const heightPx = {
    sm: 52,  // Header sticky bar (grande y bien visible)
    md: 80,  // Tarjetas o paneles medianos
    lg: 125, // Paneles destacados
    xl: 170, // Pantalla de bienvenida / Hero principal
    '2xl': 220 // Máximo impacto visual
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      role="img"
      aria-label="Logotipo oficial de LabSIE - Laboratorio de Sistemas Inteligentes en Educación"
    >
      <img
        src="https://pub-1ec8494dfebf4d9d96fdb25fd581ca63.r2.dev/logo%20labsie%20sin%20fondo.png"
        alt="Logotipo Oficial LabSIE"
        style={{ height: `${heightPx}px`, width: 'auto', maxHeight: 'none' }}
        className="object-contain transition-transform duration-200 drop-shadow-sm"
        loading="eager"
      />
    </div>
  );
};
