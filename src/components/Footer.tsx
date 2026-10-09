import React from 'react';
import { ExternalLink } from 'lucide-react';
import { EduTLANLogo } from './EduTLANLogo';
import { LabSIELogo } from './LabSIELogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 relative z-10 bg-[#FFFDF9] border-t-2 border-[#CCD4CF] text-[#3F4E4C]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center text-center md:text-left">
        {/* Logos */}
        <div className="flex items-center justify-center md:justify-start gap-4">
          <LabSIELogo size="sm" />
          <div className="w-px h-10 bg-[#CCD4CF]" aria-hidden="true" />
          <EduTLANLogo size="sm" showCategoryBadge={false} />
        </div>

        {/* Institución */}
        <div className="space-y-1 md:border-l-2 md:border-[#CCD4CF] md:pl-6">
          <p className="font-serif text-sm sm:text-base font-bold text-[#1C2624]">Semillero de Investigación LabSIE · Grupo EduTLAN</p>
          <p className="text-xs">Laboratorio de Sistemas Inteligentes en Educación · Categoría A MinCiencias</p>
          <p className="text-xs">Facultad de Educación · Licenciatura en Informática · Universidad de Córdoba</p>
        </div>

        {/* Enlace */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="font-serif italic text-sm text-[#059669] font-bold max-w-xs md:text-right">
            "Investigar no es empezar de cero. Es saber desde dónde continuar."
          </p>
          <a
            href="https://edutlan.online"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] text-[#FFFDF9] text-xs font-bold hover:bg-[#047857] transition-colors"
          >
            Más información en edutlan.online
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="border-t border-[#CCD4CF] bg-[#FAF8F5]">
        <p className="max-w-7xl mx-auto px-4 md:px-8 py-3 text-[11px] sm:text-xs text-center font-semibold text-[#3F4E4C]">
          © {new Date().getFullYear()} LabSIE y EduTLAN. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
