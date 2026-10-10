import jsPDF from 'jspdf';

type PdfValue = string | number | null | undefined;
type RGB = [number, number, number];

const COLORS = {
  navy: [10, 37, 64] as RGB,
  blue: [14, 107, 168] as RGB,
  green: [5, 150, 105] as RGB,
  greenPale: [239, 248, 244] as RGB,
  bluePale: [239, 246, 250] as RGB,
  gold: [217, 119, 6] as RGB,
  ink: [23, 50, 59] as RGB,
  body: [64, 90, 98] as RGB,
  muted: [104, 123, 128] as RGB,
  line: [217, 228, 229] as RGB,
  white: [255, 255, 255] as RGB
};

const hasValue = (value: unknown): boolean => value !== null && value !== undefined && value !== '' && value !== '—';
const asItems = (value: unknown): any[] => Array.isArray(value) ? value : [];
const plainText = (value: unknown): string => String(value ?? '')
  .replace(/\*\*(.*?)\*\*/gs, '$1')
  .replace(/\*([^*]+)\*/g, '$1')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/<[^>]*>/g, '')
  .replace(/\r\n?/g, '\n');

/** PDF administrativo vectorial, con texto seleccionable y bloques que fluyen entre páginas. */
export function getPdfBuffer(data: any): ArrayBuffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const bodyBottom = pageHeight - margin - 11;
  let y = margin;
  let page = 1;

  doc.setProperties({
    title: `Informe LabSIE · ${plainText(data?.usuario?.nombre || 'Estudiante')}`,
    subject: 'Dossier de orientación investigativa',
    author: 'Semillero LabSIE · Grupo EduTLAN',
    creator: 'Ruta'
  });

  const addPage = () => {
    doc.addPage();
    page += 1;
    y = margin + 8;
  };
  const ensureSpace = (height: number) => {
    if (y + height > bodyBottom) addPage();
  };
  const drawSection = (number: number, title: string, followingContentSpace = 8) => {
    ensureSpace(10 + followingContentSpace);
    doc.setFillColor(...COLORS.greenPale);
    doc.setDrawColor(139, 189, 179);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, y - 4.2, 8, 8, 2.5, 2.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.green);
    doc.text(String(number).padStart(2, '0'), margin + 4, y + 0.6, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(...COLORS.navy);
    doc.text(title, margin + 11, y + 0.7);
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.35);
    doc.line(margin + 11, y + 3.3, pageWidth - margin, y + 3.3);
    y += 8.5;
  };
  const drawParagraph = (
    value: unknown,
    options: { fontSize?: number; bold?: boolean; italic?: boolean; color?: RGB; indent?: number; after?: number } = {}
  ) => {
    if (!hasValue(value)) return;
    const fontSize = options.fontSize ?? 9.4;
    const lineHeight = fontSize * 0.46;
    const indent = options.indent ?? 0;
    const paragraphs = plainText(value).split('\n');
    doc.setFont('helvetica', options.bold ? 'bold' : options.italic ? 'italic' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(...(options.color ?? COLORS.body));

    for (const paragraph of paragraphs) {
      const source = paragraph.trim();
      if (!source) {
        y += lineHeight * 0.5;
        continue;
      }
      const bulletMatch = source.match(/^[-*•]\s+(.+)$/);
      const numberedMatch = source.match(/^(\d{1,2})[.)]\s+(.+)$/);
      const formatted = bulletMatch ? `•  ${bulletMatch[1]}` : numberedMatch ? `${numberedMatch[1]}.  ${numberedMatch[2]}` : source;
      const lines = doc.splitTextToSize(formatted, contentWidth - indent - (bulletMatch || numberedMatch ? 2 : 0)) as string[];
      for (const line of lines) {
        if (y + lineHeight > bodyBottom) addPage();
        doc.setFont('helvetica', options.bold ? 'bold' : options.italic ? 'italic' : 'normal');
        doc.setFontSize(fontSize);
        doc.setTextColor(...(options.color ?? COLORS.body));
        doc.text(line, margin + indent, y);
        y += lineHeight;
      }
      y += 0.5;
    }
    y += options.after ?? 1.5;
  };
  const drawField = (label: string, value: PdfValue) => {
    if (!hasValue(value)) return;
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...COLORS.green);
    doc.text(label.toLocaleUpperCase('es-CO'), margin, y);
    y += 3.4;
    drawParagraph(value, { fontSize: 9.2, after: 1.5 });
  };
  const drawStory = (label: string, value: PdfValue) => {
    if (!hasValue(value)) return;
    ensureSpace(9);
    doc.setDrawColor(139, 189, 179);
    doc.setLineWidth(0.8);
    doc.line(margin, y - 2.5, margin, y + 3.4);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...COLORS.muted);
    doc.text(label.toLocaleUpperCase('es-CO'), margin + 3, y);
    y += 4.1;
    drawParagraph(value, { fontSize: 9.4, indent: 3, after: 2.2 });
  };
  const drawFactGrid = (facts: Array<[string, PdfValue]>) => {
    const entries = facts.filter(([, value]) => hasValue(value));
    const gap = 4;
    const columnWidth = (contentWidth - gap) / 2;
    for (let index = 0; index < entries.length; index += 2) {
      const row = entries.slice(index, index + 2).map(([label, value]) => {
        const lines = doc.splitTextToSize(plainText(value), columnWidth - 7) as string[];
        return { label, lines, height: Math.max(15, 9 + lines.length * 3.8) };
      });
      const rowHeight = Math.max(...row.map(item => item.height));
      if (rowHeight > bodyBottom - y) addPage();
      row.forEach((item, column) => {
        const x = margin + column * (columnWidth + gap);
        doc.setFillColor(248, 251, 250);
        doc.setDrawColor(...COLORS.line);
        doc.setLineWidth(0.25);
        doc.roundedRect(x, y, columnWidth, rowHeight, 1.8, 1.8, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.7);
        doc.setTextColor(...COLORS.muted);
        doc.text(item.label.toLocaleUpperCase('es-CO'), x + 3.5, y + 4.3);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.6);
        doc.setTextColor(...COLORS.ink);
        doc.text(item.lines, x + 3.5, y + 9, { lineHeightFactor: 1.12 });
      });
      y += rowHeight + 2.5;
    }
  };
  const drawBulletList = (values: unknown) => {
    const entries = asItems(values).filter(hasValue);
    if (!entries.length) return;
    entries.forEach(entry => drawParagraph(`•  ${plainText(entry)}`, { indent: 2, fontSize: 9.2, after: 1 }));
  };
  const drawProject = (title: unknown, code: unknown, description: unknown, affinity?: unknown) => {
    if (!hasValue(title) && !hasValue(description)) return;
    ensureSpace(16);
    const heading = `${hasValue(code) ? `[${plainText(code)}]  ` : ''}${plainText(title || 'Proyecto de investigación')}`;
    drawParagraph(heading, { bold: true, fontSize: 10.2, color: COLORS.navy, after: 1 });
    if (hasValue(affinity)) drawField('Afinidad estimada', `${plainText(affinity)}%`);
    if (hasValue(description)) drawParagraph(description, { indent: 3, fontSize: 9.2, after: 4 });
    else y += 2;
  };

  const user = data?.usuario ?? {};
  const profile = data?.perfil ?? {};
  const archetype = profile.arquetipo ?? {};
  const interests = data?.intereses ?? {};
  const concern = data?.inquietud ?? {};
  const analysis = data?.analisis ?? {};
  const personalized = data?.reporte_personalizado ?? {};
  const score = Number(profile.puntaje_global);

  // Cabecera institucional compacta que fluye según el nombre y los metadatos.
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const titleLines = doc.splitTextToSize(plainText(user.nombre || 'Estudiante'), contentWidth - 16) as string[];
  const metadata = [user.programa, hasValue(user.semestre) ? `Semestre ${user.semestre}` : null, data?.id_evaluacion, data?.fecha]
    .filter(hasValue)
    .map(plainText)
    .join('  ·  ');
  const metadataLines = doc.splitTextToSize(metadata, contentWidth - 16) as string[];
  const headerHeight = Math.max(43, 23 + titleLines.length * 7 + metadataLines.length * 4);
  doc.setFillColor(...COLORS.navy);
  doc.roundedRect(margin, y, contentWidth, headerHeight, 3, 3, 'F');
  doc.setFillColor(...COLORS.green);
  doc.roundedRect(margin, y, 2.2, headerHeight, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...COLORS.white);
  doc.text('LabSIE', margin + 7, y + 10);
  const labsieWidth = doc.getTextWidth('LabSIE');
  doc.setTextColor(121, 204, 177);
  doc.setFontSize(7.2);
  doc.text('GRUPO EDUTLAN  ·  UNIVERSIDAD DE CÓRDOBA', margin + 7 + labsieWidth + 3, y + 10);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.line(margin + 7, y + 13.5, margin + 28, y + 13.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.white);
  doc.text(titleLines, margin + 7, y + 22, { lineHeightFactor: 1.08 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(211, 224, 230);
  doc.text(metadataLines, margin + 7, y + 25 + titleLines.length * 7, { lineHeightFactor: 1.08 });
  y += headerHeight + 7;

  drawSection(1, 'Tu perfil investigador');
  if (hasValue(profile.puntaje_global) && Number.isFinite(score)) {
    ensureSpace(18);
    doc.setFillColor(...COLORS.greenPale);
    doc.setDrawColor(191, 222, 211);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y - 2, contentWidth, 15, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(...COLORS.green);
    doc.text(`${score}%`, margin + 4, y + 7.5);
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text('AFINIDAD CON LABSIE', margin + 26, y + 3.3);
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.ink);
    doc.text(plainText(profile.nivel_correspondencia || 'Perfil en exploración'), margin + 26, y + 8.5);
    y += 17;
  }
  if (hasValue(archetype.nombre)) {
    drawField('Arquetipo identificado', archetype.nombre);
    drawParagraph(archetype.descripcion, { fontSize: 9.2, after: 3 });
  }
  drawFactGrid([
    ['Correo', user.correo],
    ['Teléfono', user.telefono],
    ['Programa', user.programa],
    ['Semestre', user.semestre],
    ['Vinculación', user.vinculacion]
  ]);
  drawField('Experiencia previa', profile.experiencia_previa);
  drawField('Formación técnica', profile.formacion_tecnica);
  drawField('Familiaridad con IA', profile.familiaridad_ia);

  if (asItems(interests.curiosidades).some(hasValue) || asItems(interests.formas_de_investigar).some(hasValue) || hasValue(interests.continuidad)) {
    drawSection(2, 'Intereses y formas de investigar', 14);
    if (asItems(interests.curiosidades).some(hasValue)) {
      drawField('Áreas de curiosidad', asItems(interests.curiosidades).filter(hasValue).map(plainText).join('  ·  '));
    }
    if (asItems(interests.formas_de_investigar).some(hasValue)) {
      drawField('Formas preferidas', asItems(interests.formas_de_investigar).filter(hasValue).map(plainText).join('  ·  '));
    }
    drawField('Preferencia de continuidad', interests.continuidad);
  }

  if (hasValue(concern.problema) || hasValue(concern.investigacion_sonada) || hasValue(concern.meta_6_meses) || hasValue(concern.idea_divergente)) {
    drawSection(3, 'Ideas e inquietudes', 14);
    drawStory('Problema o pregunta principal', concern.problema);
    drawStory('Investigación soñada', concern.investigacion_sonada);
    drawStory('Meta a seis meses', concern.meta_6_meses);
    drawStory('Idea divergente', concern.idea_divergente);
  }

  drawSection(4, 'Proyectos sugeridos', 14);
  const projects = asItems(data?.investigaciones_relacionadas);
  if (projects.length) {
    projects.forEach(project => drawProject(project?.titulo, project?.codigo, project?.porque_se_relaciona, project?.afinidad));
  } else {
    drawParagraph('No se encontraron proyectos relacionados para este perfil.', { italic: true, color: COLORS.muted });
  }

  if (asItems(analysis.parrafos).some(hasValue)) {
    drawSection(5, 'Lectura de tu perfil', 14);
    asItems(analysis.parrafos).filter(hasValue).forEach(paragraph => drawStory('Análisis', paragraph));
  }
  if (hasValue(analysis.ruta)) {
    drawSection(6, 'Una posible ruta para empezar', 14);
    drawField('Ruta estratégica sugerida', analysis.ruta);
    drawStory('Punto de partida', analysis.descripcion_ruta);
  }
  if (hasValue(data?.linea_sugerida)) {
    drawSection(7, 'Línea de investigación sugerida');
    drawParagraph(data.linea_sugerida, { bold: true, fontSize: 11, color: COLORS.blue, after: 3 });
  }

  const recommendedProjects = asItems(personalized.proyectos_participar);
  if (hasValue(personalized.saludo) || hasValue(personalized.donde_entrar) || recommendedProjects.length) {
    drawSection(8, 'Recomendación personalizada', 20);
    drawParagraph(personalized.saludo, { bold: true, fontSize: 10, color: COLORS.navy });
    drawStory('Punto de partida sugerido', personalized.donde_entrar);
    recommendedProjects.forEach(project => drawProject(project?.projectTitle, project?.projectCode, project?.whatYouCanDo));
  }
  if (asItems(data?.proximos_pasos).some(hasValue)) {
    drawSection(9, 'Próximos pasos', 12);
    drawBulletList(data.proximos_pasos);
  }

  // Encabezados de continuación y pies recurrentes fuera del área de contenido.
  const totalPages = doc.getNumberOfPages();
  for (let current = 1; current <= totalPages; current += 1) {
    doc.setPage(current);
    if (current > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.muted);
      doc.text('LABSIE  ·  INFORME DE ORIENTACIÓN INVESTIGATIVA', margin, 8);
      doc.setDrawColor(...COLORS.line);
      doc.setLineWidth(0.3);
      doc.line(margin, 11, pageWidth - margin, 11);
    }
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...COLORS.muted);
    doc.text('Semillero LabSIE  ·  Grupo EduTLAN', margin, pageHeight - 7);
    doc.text(`Página ${current} de ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  return doc.output('arraybuffer') as ArrayBuffer;
}
