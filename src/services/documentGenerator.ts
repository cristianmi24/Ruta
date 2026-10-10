import jsPDF from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType
} from 'docx';
import { AnalysisResult } from '../types';
import { CLOSING_MESSAGE } from '../data/closingMessage';

export interface DocumentOptions {
  includeAdminSection?: boolean;
}

// ---------- PDF con la plantilla "Informe de orientación investigativa" ----------

/** Logo oficial de LabSIE (PNG, servido por /api/logo) reducido para que el PDF no pese de más. */
async function loadLabsieLogo(): Promise<{ data: string; white: string; ratio: number } | null> {
  try {
    const blob = await fetch('/api/logo').then(r => (r.ok ? r.blob() : Promise.reject(new Error('logo'))));
    const url = URL.createObjectURL(blob);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const w = 300;
    const h = Math.round((img.naturalHeight / img.naturalWidth) * w);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, w, h);
    const data = canvas.toDataURL('image/png');
    // Versión blanca del logo para ponerlo directamente sobre el encabezado verde
    const px = ctx.getImageData(0, 0, w, h);
    for (let k = 0; k < px.data.length; k += 4) {
      px.data[k] = 255;
      px.data[k + 1] = 255;
      px.data[k + 2] = 255;
    }
    ctx.putImageData(px, 0, 0);
    const white = canvas.toDataURL('image/png');
    URL.revokeObjectURL(url);
    return { data, white, ratio: h / w };
  } catch {
    return null;
  }
}

/** Logo oficial de EduTLAN para la firma discreta de la última página. */
async function loadEduTlanLogo(): Promise<{ data: string; ratio: number } | null> {
  let url = '';
  try {
    const blob = await fetch('/api/logo-edutlan').then(r => (r.ok ? r.blob() : Promise.reject(new Error('logo'))));
    url = URL.createObjectURL(blob);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    const width = 600;
    const height = Math.round((img.naturalHeight / img.naturalWidth) * width);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
    return { data: canvas.toDataURL('image/png'), ratio: height / width };
  } catch {
    return null;
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}

/** Renderiza la plantilla fuera de pantalla y espera fuentes e imágenes. */
async function renderTemplate(analysis: AnalysisResult, logo: string | null, logoWhite: string | null, includeAdminSection: boolean) {
  const [{ createElement }, { createRoot }, { ReportTemplate }, { storageService }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('../components/ReportTemplate'),
    import('./storageService')
  ]);
  const projectQuestions: Record<string, string> = {};
  storageService.getProjects().forEach(p => {
    if (p.question) projectQuestions[p.code] = p.question;
  });

  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;z-index:-1;pointer-events:none;';
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(createElement(ReportTemplate, { analysis, logoSrc: logo, logoWhiteSrc: logoWhite, projectQuestions, includeAdminSection }));

  await new Promise(r => setTimeout(r, 80));
  await (document as any).fonts?.ready;
  await Promise.all(
    Array.from(host.querySelectorAll('img')).map(img => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined)))
  );
  return { host, root };
}

export async function generatePDFReport(analysis: AnalysisResult, options: DocumentOptions = {}): Promise<void> {
  const [logo, signatureLogo] = await Promise.all([loadLabsieLogo(), loadEduTlanLogo()]);
  const { host, root } = await renderTemplate(analysis, logo?.data || null, logo?.white || null, !!options.includeAdminSection);

  try {
    const html2canvas = (await import('html2canvas')).default;
    const el = host.firstElementChild as HTMLElement;
    const scale = 1.5;
    const canvas = await html2canvas(el, { scale, backgroundColor: '#FFFDF9', useCORS: true, logging: false });

    // Geometría A4 (mm) ↔ píxeles de la plantilla (794 px de ancho)
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const mmPerPx = pageW / 794;
    const footerMm = 28;
    const topMm = 10;
    const base0 = el.getBoundingClientRect().top;
    const lastNode = el.querySelector('.lr-page')?.lastElementChild as HTMLElement | null;
    const totalPx = Math.min(el.scrollHeight, lastNode ? Math.ceil(lastNode.getBoundingClientRect().bottom - base0) + 16 : el.scrollHeight);

    // Cortes de página: preferir los bordes de secciones y tarjetas para no partirlas
    const base = el.getBoundingClientRect().top;
    const marks = new Set<number>();
    el.querySelectorAll('[data-break]').forEach(node => {
      const r = (node as HTMLElement).getBoundingClientRect();
      marks.add(Math.round(r.top - base) - 8);
      marks.add(Math.round(r.bottom - base) + 4);
    });
    // Nunca cortar justo después de un título de sección (el título viaja con su contenido)
    const heads = Array.from(el.querySelectorAll('[data-keep-next]')).map(node => {
      const r = (node as HTMLElement).getBoundingClientRect();
      return [r.top - base, r.bottom - base + 60] as [number, number];
    });
    const allowed = (v: number) => !heads.some(([t, b]) => v > t + 2 && v < b);
    const candidates = [...marks].filter(v => v > 0 && allowed(v)).sort((x, y) => x - y);
    // Puntos de corte finos (entre párrafos) para bloques más altos que una página
    const fine = Array.from(el.querySelectorAll('p, li, blockquote, h3, h4, .lr-label'))
      .map(node => Math.round((node as HTMLElement).getBoundingClientRect().bottom - base) + 3)
      .filter(allowed)
      .sort((x, y) => x - y);

    const slices: [number, number][] = [];
    let start = 0;
    while (start < totalPx - 2) {
      const capacity = (pageH - footerMm - (slices.length ? topMm : 0)) / mmPerPx;
      const limit = start + capacity;
      if (limit >= totalPx) {
        slices.push([start, totalPx]);
        break;
      }
      const fit = candidates.filter(v => v > start + capacity * 0.35 && v <= limit);
      const fineFit = fine.filter(v => v > start + capacity * 0.5 && v <= limit);
      const end = fit.length ? fit[fit.length - 1] : fineFit.length ? fineFit[fineFit.length - 1] : Math.floor(limit);
      slices.push([start, end]);
      start = end;
    }

    slices.forEach(([s, e], i) => {
      if (i > 0) doc.addPage();
      doc.setFillColor(255, 253, 249);
      doc.rect(0, 0, pageW, pageH, 'F');
      const part = document.createElement('canvas');
      part.width = canvas.width;
      part.height = Math.ceil((e - s) * scale);
      const ctx = part.getContext('2d')!;
      ctx.fillStyle = '#FFFDF9';
      ctx.fillRect(0, 0, part.width, part.height);
      ctx.drawImage(canvas, 0, Math.floor(s * scale), canvas.width, part.height, 0, 0, canvas.width, part.height);
      doc.addImage(part.toDataURL('image/jpeg', 0.82), 'JPEG', 0, i ? topMm : 0, pageW, (e - s) * mmPerPx, undefined, 'FAST');
    });

    // Pie recurrente; la firma EduTLAN aparece solamente al final.
    const total = doc.getNumberOfPages();
    const GState = (doc as any).GState;
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setDrawColor(229, 224, 214);
      doc.setLineWidth(0.3);
      doc.line(14, pageH - 11, pageW - 14, pageH - 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(82, 96, 102);
      doc.text('Semillero LabSIE · Grupo EduTLAN · edutlan.online', 14, pageH - 6.5);
      doc.text(`Página ${i} de ${total}`, pageW - 14, pageH - 6.5, { align: 'right' });
      if (i === total && signatureLogo) {
        try {
          if (GState) doc.setGState(new GState({ opacity: 0.65 }));
          const width = 24;
          const height = width * signatureLogo.ratio;
          const x = (pageW - width) / 2;
          const y = pageH - 11 - height - 2;
          doc.addImage(signatureLogo.data, 'PNG', x, y, width, height, 'edutlan-signature', 'SLOW');
        } finally {
          if (GState) doc.setGState(new GState({ opacity: 1 }));
        }
      }
    }

    const safeName = analysis.studentProfile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    doc.save(`LabSIE_Informe_${safeName}_${analysis.id.slice(-6)}.pdf`);
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function generateDOCXReport(
  analysis: AnalysisResult,
  options: DocumentOptions = {}
): Promise<void> {
  const children: any[] = [];

  // Helper paragraph creator
  const createP = (text: string, isBold = false, isItalic = false, spaceAfter = 120) =>
    new Paragraph({
      spacing: { after: spaceAfter, line: 276 },
      children: [
        new TextRun({
          text,
          bold: isBold,
          italics: isItalic,
          font: 'DM Sans',
          size: 22, // 11pt
          color: '24302F'
        })
      ]
    });

  const createHeading = (text: string, level: any) =>
    new Paragraph({
      heading: level,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text,
          bold: true,
          font: 'Lora',
          size: level === HeadingLevel.HEADING_1 ? 32 : 26,
          color: '315B55'
        })
      ]
    });

  // Title / Portada
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({
          text: 'SEMILLERO DE INVESTIGACIÓN LABSIE · GRUPO EDUTLAN',
          bold: true,
          font: 'Lora',
          size: 34,
          color: '477A72'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: '"De tus intereses a una posible investigación."',
          italics: true,
          font: 'DM Sans',
          size: 24,
          color: '6F7976'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'Semillero de Investigación LabSIE · Grupo EduTLAN · Universidad de Córdoba',
          font: 'DM Sans',
          size: 20,
          color: '6F7976'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'DOSSIER DE ANÁLISIS ESTUDIANTIL',
          bold: true,
          font: 'Playfair Display',
          size: 32,
          color: '0F172A'
        })
      ]
    })
  );

  // Student Info Table
  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'DDE2DE' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDE2DE' },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'EFEFEF' },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [createP(`Estudiante: ${analysis.studentProfile.name}`, true)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [createP(`Correo: ${analysis.studentProfile.email}`)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [createP(`Programa: ${analysis.studentProfile.program}`)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [createP(`Semestre: ${analysis.studentProfile.semester}`)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [createP(`Teléfono: ${analysis.studentProfile.phone || 'No registrado'}`)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [createP(`Vinculación: Semillero LabSIE (Ruta Activada)`)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [createP(`Fecha de emisión: ${new Date(analysis.timestamp).toLocaleDateString('es-CO')}`)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [createP(`ID Informe: ${analysis.id}`)],
            width: { size: 50, type: WidthType.PERCENTAGE }
          })
        ]
      })
    ]
  });
  children.push(infoTable);
  children.push(createP(' ', false, false, 200));

  // Section 01: Perfil
  children.push(createHeading('01. Perfil investigativo', HeadingLevel.HEADING_2));
  children.push(createP(`Arquetipo: ${analysis.profileArchetype}`, true));
  children.push(
    createP(`Puntuación de Correspondencia: ${analysis.correspondenceScore}/100 (${analysis.correspondenceLevel}).`)
  );
  children.push(
    createP(
      `Experiencia investigativa: ${analysis.studentProfile.researchExperience}. Experiencia tecnológica: ${analysis.studentProfile.techExperience}. Dominio de IA: ${analysis.studentProfile.aiExperience}.`
    )
  );

  // Section 02: Intereses
  children.push(createHeading('02. Intereses identificados', HeadingLevel.HEADING_2));
  analysis.whyBreakdown.matchingInterests.forEach(item => {
    children.push(createP(`• ${item}`));
  });

  // Section 03: Formas de investigar
  children.push(createHeading('03. Preferencias investigativas', HeadingLevel.HEADING_2));
  analysis.dominantResearchWays.forEach(item => {
    children.push(createP(`• ${item}`));
  });

  // Section 04: Idea propia
  children.push(createHeading('04. Inquietud o idea propia', HeadingLevel.HEADING_2));
  const docxIdea =
    analysis.studentAnswers.problemToInvestigate ||
    analysis.studentAnswers.studentResearchIdea ||
    'Sin especificar';
  children.push(createP(`Problema a investigar: "${docxIdea}"`, false, true));
  if (analysis.studentAnswers.dreamResearch) {
    children.push(createP(`Investigación soñada: "${analysis.studentAnswers.dreamResearch}"`, false, true));
  }
  if (analysis.studentAnswers.sixMonthsDiscovery) {
    children.push(createP(`Meta a seis meses: "${analysis.studentAnswers.sixMonthsDiscovery}"`, false, true));
  }
  if (analysis.studentAnswers.divergentProjectIdea) {
    children.push(createP(`Idea divergente: "${analysis.studentAnswers.divergentProjectIdea}"`, false, true));
  }
  if (analysis.studentAnswers.continuationPreference) {
    children.push(createP(`Preferencia declarada: ${analysis.studentAnswers.continuationPreference}`, true));
  }

  // Section 05: Proyectos LabSIE relacionados
  children.push(createHeading('05. Investigaciones LabSIE relacionadas', HeadingLevel.HEADING_2));
  analysis.relatedProjects.forEach((p, i) => {
    children.push(createP(`${i + 1}. [${p.projectCode}] ${p.projectTitle} (Afinidad: ${p.affinity}%)`, true));
    children.push(createP(`Razón de correspondencia: ${p.connectionReason}`, false, true));
  });

  // Section 06: Análisis
  children.push(createHeading('06. Análisis de correspondencia', HeadingLevel.HEADING_2));
  analysis.whyExplanation.forEach(p => {
    children.push(createP(p));
  });

  // Section 07: Ruta sugerida
  children.push(createHeading('07. Ruta investigativa sugerida', HeadingLevel.HEADING_2));
  children.push(createP(`MODALIDAD DE RUTA: ${analysis.routeType}`, true));

  // Section 08: Posible proyecto
  children.push(createHeading('08. Posible proyecto preliminar', HeadingLevel.HEADING_2));
  children.push(createP(`[ ${analysis.proposedProject.statusLabel} ]`, true));
  children.push(createP(`Título tentativo: ${analysis.proposedProject.tentativeTitle}`, true));
  children.push(createP(`Pregunta de investigación: ${analysis.proposedProject.tentativeQuestion}`));
  children.push(createP(`Objetivo general: ${analysis.proposedProject.tentativeObjective}`));
  children.push(createP(`Conceptos centrales: ${analysis.proposedProject.centralConcepts.join(', ')}`));
  children.push(createP(`Población y contexto: ${analysis.proposedProject.possibleContextPopulation}`));
  children.push(createP(`Posible aporte: ${analysis.proposedProject.possibleContribution}`));

  // Section 08-B: Síntesis de los 3 Puntos de Vista Analizados
  if (analysis.perspectives && analysis.perspectives.length > 0) {
    children.push(createHeading('08-B. Síntesis de los 3 Puntos de Vista Analizados', HeadingLevel.HEADING_2));
    analysis.perspectives.forEach(p => {
      children.push(createP(`• ${p.title} (${p.correspondenceScore}% afinidad):`, true));
      children.push(createP(`Enfoque: ${p.shortDescription}`));
      children.push(createP(`Metodología: ${p.methodologyFocus.type} - ${p.methodologyFocus.description}`));
    });
  }

  // Section 08-C: 3 Opciones de Proyectos Nuevos Formuladas
  if (analysis.proposedProjectOptions && analysis.proposedProjectOptions.length > 0) {
    children.push(createHeading('08-C. 3 Opciones de Proyectos Nuevos Formuladas a partir del Análisis', HeadingLevel.HEADING_2));
    analysis.proposedProjectOptions.forEach(opt => {
      children.push(createP(`[${opt.badge}]`, true));
      children.push(createP(`Título tentativo: ${opt.tentativeTitle}`));
      children.push(createP(`Pregunta de investigación: "${opt.tentativeQuestion}"`));
      children.push(createP(`Objetivo general: ${opt.tentativeObjective}`));
      children.push(createP(`Metodología: ${opt.methodology.name}`));
    });
  }

  // Section 09: Línea
  children.push(createHeading('09. Línea de investigación sugerida', HeadingLevel.HEADING_2));
  children.push(createP(`Línea: ${analysis.primaryLineName}`));

  // Admin section
  if (options.includeAdminSection && analysis.adminReview) {
    children.push(createHeading('10. Decisión administrativa (Coordinación)', HeadingLevel.HEADING_2));
    children.push(createP(`Estado: ${analysis.adminReview.status}`));
    children.push(createP(`Decisión: ${analysis.adminReview.decision}`));
    if (analysis.adminReview.assignedTutor) {
      children.push(createP(`Tutor asignado: ${analysis.adminReview.assignedTutor}`));
    }
    children.push(createHeading('11. Observaciones del administrador', HeadingLevel.HEADING_2));
    children.push(createP(analysis.adminReview.adminComments || 'Sin observaciones registradas.'));
  }

  // Section 12: Pasos
  children.push(createHeading('12. Próximos pasos recomendados', HeadingLevel.HEADING_2));
  analysis.proposedProject.nextSteps.forEach(step => {
    children.push(createP(`→ ${step}`));
  });

  // Section 13: Reporte personal
  const qa = analysis.qwenAnalysis;
  if (qa) {
    children.push(createHeading('13. Tu reporte de ruta investigativa', HeadingLevel.HEADING_2));
    (qa.warmLetter || []).forEach(parr => children.push(createP(parr)));
    if (qa.whereYouCanEnter) children.push(createP(`Dónde puedes entrar: ${qa.whereYouCanEnter}`));
    (qa.projectsYouCanDo || []).forEach(pr => children.push(createP(`• ${pr.projectCode} · ${pr.projectTitle}: ${pr.whatYouCanDo}`)));
    children.push(createP(qa.closingNote || 'Más información en edutlan.online.'));
  }

  // Antes de irte, lee esto
  children.push(createHeading(CLOSING_MESSAGE.kicker, HeadingLevel.HEADING_2));
  children.push(createP(CLOSING_MESSAGE.title, true));
  children.push(createP(CLOSING_MESSAGE.intro));
  children.push(createP(CLOSING_MESSAGE.quote, false, true));
  CLOSING_MESSAGE.paragraphs.forEach(p => children.push(createP(p)));
  children.push(createP(CLOSING_MESSAGE.closing, true));

  // Final Methodological Note
  children.push(
    createP(' ', false, false, 180),
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text:
            'Nota metodológica: Este documento constituye una orientación inicial basada en las respuestas proporcionadas por el estudiante y en la información disponible sobre las investigaciones del semillero. No representa por sí mismo la aprobación, asignación o validación definitiva de un proyecto de investigación.',
          italics: true,
          font: 'DM Sans',
          size: 18,
          color: '6F7976'
        })
      ]
    })
  );

  const docxDoc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  const blob = await Packer.toBlob(docxDoc);
  const safeName = analysis.studentProfile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LabSIE_Informe_${safeName}_${analysis.id.slice(-6)}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
