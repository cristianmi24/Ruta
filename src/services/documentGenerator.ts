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

export interface DocumentOptions {
  includeAdminSection?: boolean;
}

export async function generatePDFReport(
  analysis: AnalysisResult,
  options: DocumentOptions = {}
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(111, 121, 118); // #6F7976
    doc.text('SEMILLERO DE INVESTIGACIÓN LABSIE · GRUPO EDUTLAN | UNIVERSIDAD DE CÓRDOBA', margin, y);
    doc.text(`ID: ${analysis.id}`, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(221, 226, 222);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  // --- PORTADA / HEADER INSTITUCIONAL ---
  drawHeader();

  // Decorative top bar
  doc.setFillColor(16, 185, 129); // #10B981 Primary Light Emerald
  doc.rect(margin, y, contentWidth, 3, 'F');
  y += 10;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(5, 150, 105); // #059669 Primary Dark
  doc.text('INFORME DE ORIENTACIÓN INVESTIGATIVA', margin, y);
  y += 7;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(111, 121, 118);
  doc.text('"De tus intereses a una posible investigación."', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Semillero de Investigación LabSIE · Grupo de Investigación EduTLAN', margin, y);
  y += 12;

  // Student Info Box
  doc.setFillColor(255, 253, 249); // #FFFDF9
  doc.setDrawColor(221, 226, 222);
  doc.rect(margin, y, contentWidth, 42, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(36, 48, 47);
  doc.text('DATOS DEL ESTUDIANTE · SEMILLERO LABSIE:', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${analysis.studentProfile.name}`, margin + 5, y + 14);
  doc.text(`Programa: ${analysis.studentProfile.program}`, margin + 5, y + 20);
  doc.text(`Semestre: ${analysis.studentProfile.semester}`, margin + 5, y + 26);
  doc.text(`Vinculación: Semillero de Inv. LabSIE (Ruta Activada)`, margin + 5, y + 32);

  doc.text(`Correo: ${analysis.studentProfile.email}`, margin + 95, y + 14);
  doc.text(`Teléfono: ${analysis.studentProfile.phone || 'No registrado'}`, margin + 95, y + 20);
  doc.text(`Grupo: EduTLAN (Categoría A MinCiencias)`, margin + 95, y + 26);
  doc.text(`Fecha de emisión: ${new Date(analysis.timestamp).toLocaleDateString('es-CO')}`, margin + 95, y + 32);
  y += 48;

  // Helper for Section Titles
  const addSectionTitle = (num: string, title: string) => {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text(`${num}. ${title.toUpperCase()}`, margin, y);
    y += 2;
    doc.setDrawColor(199, 154, 82); // #C79A52 Accent
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 45, y);
    y += 6;
  };

  // Helper for paragraphs
  const addParagraph = (text: string, fontSize = 9.5) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(36, 48, 47);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(lines.length * 4.5);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 3;
  };

  // SECCIÓN 01: Perfil investigativo
  addSectionTitle('01', 'Perfil investigativo');
  addParagraph(`Arquetipo identificado: ${analysis.profileArchetype}.`);
  addParagraph(
    `Nivel de Correspondencia Global: ${analysis.correspondenceScore}/100 (${analysis.correspondenceLevel}). Este cálculo sintetiza la correspondencia entre los intereses declarados, las preferencias de aproximación científica y el patrimonio histórico de LabSIE.`
  );
  addParagraph(
    `Experiencia previa: ${analysis.studentProfile.researchExperience} | Formación técnica: ${analysis.studentProfile.techExperience} | Familiaridad con IA: ${analysis.studentProfile.aiExperience}.`
  );

  // SECCIÓN 02: Intereses identificados
  addSectionTitle('02', 'Intereses y curiosidades científicas');
  const interestsList = analysis.whyBreakdown.matchingInterests.map(i => `• ${i}`).join('\n');
  addParagraph(interestsList);

  // SECCIÓN 03: Preferencias investigativas
  addSectionTitle('03', 'Formas de investigar');
  const waysList = analysis.dominantResearchWays.map(w => `• ${w}`).join('\n');
  addParagraph(waysList);

  // SECCIÓN 04: Idea propia
  addSectionTitle('04', 'Inquietud o idea propia del estudiante');
  const studentIdea =
    analysis.studentAnswers.problemToInvestigate ||
    analysis.studentAnswers.studentResearchIdea ||
    'No especificada en el test.';
  addParagraph(`Problema a investigar: "${studentIdea}"`);
  if (analysis.studentAnswers.dreamResearch) {
    addParagraph(`Investigación soñada: "${analysis.studentAnswers.dreamResearch}"`);
  }
  if (analysis.studentAnswers.sixMonthsDiscovery) {
    addParagraph(`Meta a seis meses: "${analysis.studentAnswers.sixMonthsDiscovery}"`);
  }
  if (analysis.studentAnswers.divergentProjectIdea) {
    addParagraph(`Idea divergente a partir de LabSIE: "${analysis.studentAnswers.divergentProjectIdea}"`);
  }
  if (analysis.studentAnswers.continuationPreference) {
    addParagraph(`Preferencia de continuidad declarada: ${analysis.studentAnswers.continuationPreference}`);
  }

  // SECCIÓN 05: Investigaciones LabSIE relacionadas
  addSectionTitle('05', 'Investigaciones de LabSIE relacionadas');
  analysis.relatedProjects.forEach((rp, idx) => {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 122, 114);
    doc.text(`${idx + 1}. [${rp.projectCode}] ${rp.projectTitle} (Afinidad: ${rp.affinity}%)`, margin, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 75, 74);
    const reasonLines = doc.splitTextToSize(`Razón de correspondencia: ${rp.connectionReason}`, contentWidth - 4);
    doc.text(reasonLines, margin + 4, y);
    y += reasonLines.length * 4.2 + 3;
  });

  // SECCIÓN 06: Análisis de correspondencia
  addSectionTitle('06', 'Análisis de correspondencia y trazabilidad');
  analysis.whyExplanation.forEach(p => {
    addParagraph(p);
  });

  // SECCIÓN 07: Ruta investigativa sugerida
  addSectionTitle('07', 'Ruta investigativa sugerida');
  checkPageBreak(16);
  doc.setFillColor(247, 243, 237); // #F7F3ED
  doc.setDrawColor(71, 122, 114);
  doc.rect(margin, y, contentWidth, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(49, 91, 85);
  doc.text(`MODALIDAD DE RUTA: ${analysis.routeType}`, margin + 5, y + 7.5);
  y += 18;

  // SECCIÓN 08: Posible proyecto preliminar
  addSectionTitle('08', 'Posibilidad de investigación para explorar');
  checkPageBreak(30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(195, 139, 74); // #C38B4A Warning / Accent
  doc.text(`[ ${analysis.proposedProject.statusLabel} ]`, margin, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(36, 48, 47);
  const titleLines = doc.splitTextToSize(`Título tentativo: ${analysis.proposedProject.tentativeTitle}`, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 5 + 3;

  addParagraph(`Pregunta de investigación tentativa: ${analysis.proposedProject.tentativeQuestion}`);
  addParagraph(`Objetivo general tentativo: ${analysis.proposedProject.tentativeObjective}`);
  addParagraph(`Conceptos centrales: ${analysis.proposedProject.centralConcepts.join(' · ')}`);
  addParagraph(`Contexto / Población sugerida: ${analysis.proposedProject.possibleContextPopulation}`);
  addParagraph(`Posible aporte al semillero: ${analysis.proposedProject.possibleContribution}`);

  // SECCIÓN 08-B: Síntesis de los 3 Puntos de Vista Analizados
  if (analysis.perspectives && analysis.perspectives.length > 0) {
    addSectionTitle('08-B', 'Síntesis de los 3 Puntos de Vista Analizados');
    analysis.perspectives.forEach(p => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(5, 150, 105);
      doc.text(`• ${p.title} (${p.correspondenceScore}% afinidad):`, margin, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(36, 48, 47);
      const descLines = doc.splitTextToSize(`Enfoque: ${p.shortDescription} | Metodología: ${p.methodologyFocus.type}`, contentWidth - 4);
      doc.text(descLines, margin + 4, y);
      y += descLines.length * 4.2 + 3;
    });
  }

  // SECCIÓN 08-C: 3 Opciones de Proyectos Nuevos Formuladas
  if (analysis.proposedProjectOptions && analysis.proposedProjectOptions.length > 0) {
    addSectionTitle('08-C', '3 Opciones de Proyectos Nuevos Formuladas');
    analysis.proposedProjectOptions.forEach(opt => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(36, 48, 47);
      doc.text(`[${opt.badge}]`, margin, y);
      y += 4.5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105);
      const titleLines = doc.splitTextToSize(`Título: ${opt.tentativeTitle}`, contentWidth - 4);
      doc.text(titleLines, margin + 4, y);
      y += titleLines.length * 4 + 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(70, 75, 74);
      const qLines = doc.splitTextToSize(`Pregunta: "${opt.tentativeQuestion}"`, contentWidth - 4);
      doc.text(qLines, margin + 4, y);
      y += qLines.length * 3.8 + 2;
      const objLines = doc.splitTextToSize(`Objetivo: ${opt.tentativeObjective}`, contentWidth - 4);
      doc.text(objLines, margin + 4, y);
      y += objLines.length * 3.8 + 3;
    });
  }

  // SECCIÓN 09: Línea de investigación sugerida
  addSectionTitle('09', 'Línea de investigación sugerida');
  addParagraph(`Línea sugerida: ${analysis.primaryLineName}.`);

  // SECCIÓN 10 & 11: Decisión y observaciones administrativas
  if (options.includeAdminSection && analysis.adminReview) {
    addSectionTitle('10', 'Decisión administrativa');
    addParagraph(`Estado de la revisión: ${analysis.adminReview.status}`);
    addParagraph(`Decisión institucional: ${analysis.adminReview.decision}`);
    if (analysis.adminReview.assignedTutor) {
      addParagraph(`Tutor asignado: ${analysis.adminReview.assignedTutor}`);
    }
    if (analysis.adminReview.priority) {
      addParagraph(`Nivel de prioridad: ${analysis.adminReview.priority}`);
    }

    addSectionTitle('11', 'Observaciones de la Coordinación LabSIE');
    addParagraph(analysis.adminReview.adminComments || 'Sin observaciones adicionales registradas.');
  }

  // SECCIÓN 12: Próximos pasos
  addSectionTitle('12', 'Próximos pasos recomendados');
  analysis.proposedProject.nextSteps.forEach(step => {
    addParagraph(`→ ${step}`);
  });

  // SECCIÓN 13: Reporte personal (carta, dónde entrar y proyectos que puede hacer)
  const qa = analysis.qwenAnalysis;
  if (qa) {
    addSectionTitle('13', 'Tu reporte de ruta investigativa');
    (qa.warmLetter || []).forEach(parr => addParagraph(parr));
    if (qa.whereYouCanEnter) addParagraph(`Dónde puedes entrar: ${qa.whereYouCanEnter}`);
    (qa.projectsYouCanDo || []).forEach(pr => addParagraph(`• ${pr.projectCode} · ${pr.projectTitle}: ${pr.whatYouCanDo}`));
    addParagraph(qa.closingNote || 'Más información en edutlan.online.');
  }

  // SECCIÓN FINAL: Nota metodológica
  checkPageBreak(25);
  y += 4;
  doc.setDrawColor(221, 226, 222);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(111, 121, 118);
  const disclaimer =
    'Nota metodológica: Este documento constituye una orientación inicial basada en las respuestas proporcionadas por el estudiante y en la información disponible sobre las investigaciones del semillero. No representa por sí mismo la aprobación, asignación o validación definitiva de un proyecto de investigación. La decisión final corresponde a la coordinación del semillero LabSIE y al Grupo EduTLAN.';
  const discLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(discLines, margin, y);

  // Trigger download
  const safeName = analysis.studentProfile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const fileName = `LabSIE_Informe_${safeName}_${analysis.id.slice(-6)}.pdf`;
  doc.save(fileName);
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
          text: 'INFORME DE ORIENTACIÓN INVESTIGATIVA',
          bold: true,
          font: 'Lora',
          size: 28,
          color: '315B55'
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
