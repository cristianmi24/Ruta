import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { ResearchLine } from '../types';

interface AdminLineModalProps {
  line?: ResearchLine | null;
  onSave: (line: ResearchLine) => void;
  onClose: () => void;
}

export const AdminLineModal: React.FC<AdminLineModalProps> = ({
  line,
  onSave,
  onClose
}) => {
  const isEditing = !!line;

  const [name, setName] = useState(line?.name || '');
  const [description, setDescription] = useState(line?.description || '');
  const [keywordsStr, setKeywordsStr] = useState(line?.keywords.join(', ') || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(line?.status || 'active');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre de la línea es obligatorio.');
      return;
    }

    const savedLine: ResearchLine = {
      id: line?.id || `line-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      keywords: keywordsStr.split(',').map(k => k.trim()).filter(Boolean),
      status,
      createdAt: line?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSave(savedLine);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2624]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border-2 border-[#CCD4CF] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative z-60">
        <div className="flex items-center justify-between border-b-2 border-[#CCD4CF] pb-3">
          <div>
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
              Líneas de Investigación
            </span>
            <h2 className="font-serif text-lg font-bold text-[#1C2624]">
              {isEditing ? 'Editar Línea' : 'Nueva Línea de Investigación'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#1C2624] hover:bg-[#F7F3ED] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#B65C5C]/10 border border-[#B65C5C]/30 text-[#B65C5C] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Nombre de la Línea:</label>
            <input
              type="text"
              required
              placeholder="Ej. IA Educativa y Tutores"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Descripción:</label>
            <textarea
              rows={3}
              placeholder="Ámbito conceptual y propósitos de la línea..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Palabras clave (separadas por coma):</label>
            <input
              type="text"
              placeholder="Knowledge Tracing, ITS, Modelado"
              value={keywordsStr}
              onChange={e => setKeywordsStr(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#24302F]">Estado:</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full px-3 py-2 bg-[#F7F3ED] border border-[#DDE2DE] rounded-lg"
            >
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[#DDE2DE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-[#6F7976] hover:bg-[#F7F3ED] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] text-[#FFFDF9] text-xs font-bold hover:bg-[#059669] transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Línea</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
