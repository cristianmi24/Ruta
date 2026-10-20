export function getPdfHtml(data: any, assetBase = ''): string {
  const escapeHtml = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]!);
  const hasValue = (value: unknown): boolean => value !== null && value !== undefined && value !== '' && value !== '—';
  const text = (value: unknown, fallback = '—'): string => hasValue(value) ? escapeHtml(value) : fallback;
  const items = (value: unknown): any[] => Array.isArray(value) ? value : [];
  const inlineMarkdown = (value: unknown): string => escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  const markdown = (value: unknown): string => String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => {
      if (!line.trim()) return '<span class="md-spacer" aria-hidden="true"></span>';
      const heading = line.match(/^\s*#{1,3}\s+(.+)$/);
      if (heading) return `<strong class="md-heading">${inlineMarkdown(heading[1])}</strong>`;
      const bullet = line.match(/^\s*[-*•]\s+(.+)$/);
      if (bullet) return `<span class="md-bullet" aria-hidden="true">•</span> ${inlineMarkdown(bullet[1])}`;
      const numbered = line.match(/^\s*(\d{1,2})[.)]\s+(.+)$/);
      if (numbered) return `<span class="md-number">${escapeHtml(numbered[1])}.</span> ${inlineMarkdown(numbered[2])}`;
      return inlineMarkdown(line);
    })
    .join('<br>');
  const prose = (value: unknown, className = ''): string => hasValue(value)
    ? `<div class="prose ${className}">${markdown(value)}</div>`
    : '';
  const list = (value: unknown, className = 'content-list'): string => {
    const entries = items(value).filter(hasValue);
    return entries.length
      ? `<ul class="${className}">${entries.map(entry => `<li>${markdown(entry)}</li>`).join('')}</ul>`
      : '<p class="empty-state">No se registró información en este apartado.</p>';
  };
  const fact = (label: string, value: unknown, className = ''): string => hasValue(value)
    ? `<div class="fact ${className}"><dt>${escapeHtml(label)}</dt><dd>${markdown(value)}</dd></div>`
    : '';
  const sectionHeading = (number: string, title: string): string => `
    <div class="section-heading">
      <span class="section-number">${number}</span>
      <h2>${escapeHtml(title)}</h2>
      <span class="section-rule" aria-hidden="true"></span>
    </div>`;

  const user = data?.usuario ?? {};
  const profile = data?.perfil ?? {};
  const archetype = profile.arquetipo ?? {};
  const interests = data?.intereses ?? {};
  const concern = data?.inquietud ?? {};
  const analysis = data?.analisis ?? {};
  const personalized = data?.reporte_personalizado ?? {};
  const qwen = data?.qwen_analysis ?? {};
  const closingMessage = data?.mensaje_final ?? {};
  const perspectives = items(data?.perspectivas).filter(Boolean);
  const refinedProject = data?.propuesta_afinada ?? {};
  const projects = items(data?.investigaciones_relacionadas).filter(hasValue);
  const recommendedProjects = items(personalized.proyectos_participar).filter(hasValue);
  const nextSteps = items(data?.proximos_pasos).filter(hasValue);
  const interestAreas = items(interests.curiosidades).filter(hasValue);
  const researchMethods = items(interests.formas_de_investigar).filter(hasValue);
  const score = Number(profile.puntaje_global);
  const showScore = hasValue(profile.puntaje_global) && Number.isFinite(score);
  const date = text(data?.fecha, '');
  const scoreGauge = showScore ? Math.max(0, Math.min(100, score)) : 0;
  const gaugeCircumference = 2 * Math.PI * 34;
  const gaugeOffset = gaugeCircumference * (1 - scoreGauge / 100);
  const detailText = (label: string, value: unknown): string => hasValue(value)
    ? `<p class="project-detail"><strong>${escapeHtml(label)}:</strong> ${markdown(value)}</p>`
    : '';
  const renderProposalDetails = (proposal: any): string => {
    if (!proposal) return '';
    const concepts = items(proposal.centralConcepts ?? proposal.concepts).filter(hasValue);
    const next = items(proposal.nextSteps).filter(hasValue);
    const methodology = proposal.methodology ?? {};
    return [
      detailText('Pregunta de investigación', proposal.tentativeQuestion ?? proposal.question),
      detailText('Objetivo', proposal.tentativeObjective ?? proposal.objective),
      concepts.length ? `<p class="project-detail"><strong>Conceptos centrales:</strong> ${concepts.map(markdown).join(' · ')}</p>` : '',
      detailText('Contexto y población', proposal.possibleContextPopulation ?? proposal.population),
      detailText('Metodología', methodology.name),
      detailText('Descripción metodológica', methodology.description),
      detailText('Aporte esperado', proposal.possibleContribution ?? proposal.contribution),
      next.length ? `<div class="project-detail"><strong>Próximos pasos:</strong>${list(next, 'content-list')}</div>` : ''
    ].join('');
  };
  const hasQwenContent = [
    qwen.contrastingNarrative,
    qwen.programmingAffinityNote,
    qwen.internationalDimensionNote,
    qwen.newMemberIntegrationAdvice,
    qwen.whereYouCanEnter,
    qwen.closingNote
  ].some(hasValue) || items(qwen.warmLetter).some(hasValue) || items(qwen.topMatchingProjects).length > 0 || items(qwen.projectsYouCanDo).length > 0;
  const assetRoot = assetBase ? `${assetBase.replace(/\/+$/, '')}/` : '/';
  const logoUrl = `${assetRoot}api/logo`;
  const edutlanLogoUrl = `${assetRoot}api/logo-edutlan`;
  const metadata = [hasValue(user.semestre) ? `Semestre ${user.semestre}` : null, data?.id_evaluacion]
    .filter(hasValue)
    .map(value => escapeHtml(value))
    .join(' <span class="meta-separator">·</span> ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="language" content="es">
  <title>Informe LabSIE · ${text(user.nombre, 'Estudiante')}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@500;600;700&display=swap');
    :root {
      --ink: #17323b;
      --ink-soft: #405a62;
      --muted: #687b80;
      --blue: #0e6ba8;
      --blue-deep: #0a2540;
      --green: #16836c;
      --green-pale: #edf7f3;
      --blue-pale: #eff6fa;
      --gold: #d97706;
      --rose: #c2185b;
      --line: #d9e4e5;
      --paper: #fffdf9;
      --white: #ffffff;
    }
    @page {
      size: A4;
      margin: 16mm 16mm 18mm;
      @bottom-left {
        content: "LabSIE · Grupo EduTLAN";
        font-family: 'DM Sans', Arial, sans-serif;
        font-size: 7.5pt;
        color: #687b80;
      }
      @bottom-right {
        content: "Página " counter(page);
        font-family: 'DM Sans', Arial, sans-serif;
        font-size: 7.5pt;
        color: #687b80;
      }
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      background: var(--white);
      color: var(--ink);
      font-family: 'DM Sans', Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.58;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    main { width: 100%; }
    .report-hero {
      display: grid;
      grid-template-columns: 43mm minmax(0, 1fr);
      align-items: center;
      gap: 7mm;
      padding: 6mm 7mm;
      margin: 0 0 9mm;
      border: 1px solid var(--line);
      border-top: 3px solid var(--blue);
      border-radius: 4mm;
      background: linear-gradient(100deg, #f5faf9 0%, #ffffff 72%);
      break-inside: avoid-page;
      page-break-inside: avoid;
    }
    .hero-brand {
      display: flex;
      min-height: 31mm;
      align-items: center;
      justify-content: center;
      padding-right: 6mm;
      border-right: 1px solid var(--line);
    }
    .hero-brand img { display: block; width: 31mm; height: 31mm; object-fit: contain; }
    .hero-copy { min-width: 0; }
    .eyebrow {
      margin: 0 0 1.5mm;
      color: var(--green);
      font-size: 7.2pt;
      font-weight: 700;
      letter-spacing: 1.15px;
      line-height: 1.35;
      text-transform: uppercase;
    }
    h1, h2, h3, p { margin-top: 0; }
    h1 {
      margin-bottom: 2mm;
      color: var(--blue-deep);
      font-family: 'Lora', Georgia, serif;
      font-size: 23pt;
      font-weight: 700;
      line-height: 1.12;
      overflow-wrap: anywhere;
    }
    .hero-subtitle { margin: 0 0 2mm; color: var(--ink-soft); font-size: 9pt; }
    .hero-meta { margin: 0; color: var(--muted); font-size: 7.6pt; overflow-wrap: anywhere; }
    .meta-separator { padding: 0 1.5mm; color: var(--gold); }
    .report-section { margin: 8mm 0 9mm; }
    .report-section:last-of-type { margin-bottom: 1mm; }
    .section-heading {
      display: flex;
      align-items: center;
      gap: 3mm;
      margin: 0 0 4mm;
      break-inside: avoid-page;
      page-break-inside: avoid;
      break-after: avoid-page;
      page-break-after: avoid;
    }
    .section-number {
      display: inline-flex;
      flex: 0 0 7mm;
      width: 7mm;
      height: 7mm;
      align-items: center;
      justify-content: center;
      border: 1px solid #8bbdb3;
      border-radius: 50%;
      color: var(--green);
      font-size: 7.5pt;
      font-weight: 700;
      line-height: 1;
    }
    .section-heading h2 {
      flex: 0 0 auto;
      margin: 0;
      color: var(--blue-deep);
      font-family: 'Lora', Georgia, serif;
      font-size: 14pt;
      font-weight: 600;
      line-height: 1.22;
    }
    .section-rule { flex: 1 1 auto; height: 1px; background: var(--line); }
    .score-panel {
      display: flex;
      align-items: center;
      gap: 4mm;
      margin: 0 0 4mm;
      padding: 3.5mm 4mm;
      border: 1px solid #bfded3;
      border-left: 3px solid var(--green);
      border-radius: 2.5mm;
      background: #f6fbf8;
      break-inside: avoid-page;
      page-break-inside: avoid;
    }
    .score-gauge { position: relative; flex: 0 0 25mm; width: 25mm; height: 25mm; }
    .score-gauge svg { display: block; width: 100%; height: 100%; transform: rotate(-90deg); }
    .score-track, .score-progress { fill: none; stroke-width: 8; }
    .score-track { stroke: #dcebe5; }
    .score-progress { stroke: var(--green); stroke-linecap: round; }
    .score-gauge .score-value {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: var(--green);
      font-family: 'Lora', Georgia, serif;
      font-size: 15pt;
      font-weight: 700;
      line-height: 1;
    }
    .score-caption { margin: 0; color: var(--muted); font-size: 7pt; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; }
    .score-level { margin: 1mm 0 0; color: var(--ink); font-size: 9pt; font-weight: 600; }
    .archetype-card {
      margin: 0 0 4mm;
      padding: 4mm 4.5mm;
      border: 1px solid var(--line);
      border-left: 3px solid var(--blue);
      border-radius: 2.5mm;
      background: #fbfdfe;
    }
    .archetype-title { display: flex; align-items: baseline; gap: 2mm; margin: 0 0 1.5mm; }
    .archetype-title h3 { margin: 0; color: var(--blue-deep); font-size: 11pt; font-weight: 700; overflow-wrap: anywhere; }
    .archetype-emoji { color: var(--rose); font-size: 11pt; }
    .contact-grid, .experience-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2.5mm 3mm;
      margin: 0;
    }
    .fact {
      min-width: 0;
      padding: 2.5mm 3mm;
      border: 1px solid #e2e9e8;
      border-radius: 2mm;
      background: #fff;
      break-inside: avoid-page;
      page-break-inside: avoid;
    }
    .fact dt { margin: 0 0 1mm; color: var(--muted); font-size: 6.7pt; font-weight: 700; letter-spacing: .75px; text-transform: uppercase; }
    .fact dd { margin: 0; color: var(--ink); font-size: 8.6pt; font-weight: 500; overflow-wrap: anywhere; word-break: break-word; }
    .subheading { margin: 5mm 0 2mm; color: var(--ink-soft); font-size: 8pt; font-weight: 700; letter-spacing: .45px; break-after: avoid-page; page-break-after: avoid; }
    .tag-list { display: flex; flex-wrap: wrap; gap: 1.6mm; margin: 0; padding: 0; list-style: none; }
    .tag-list li {
      max-width: 100%;
      padding: 1.2mm 2.5mm;
      border: 1px solid #c9e1d8;
      border-radius: 8mm;
      background: var(--green-pale);
      color: #17664f;
      font-size: 8pt;
      overflow-wrap: anywhere;
      break-inside: avoid-page;
      page-break-inside: avoid;
    }
    .story-card, .route-card, .recommendation-card {
      margin: 2.5mm 0;
      padding: 3.5mm 4mm;
      border: 1px solid var(--line);
      border-radius: 2.5mm;
      background: #fff;
      overflow-wrap: anywhere;
    }
    .story-card { border-left: 3px solid #8bbdb3; }
    .story-label { display: block; margin-bottom: 1.2mm; color: var(--muted); font-size: 6.8pt; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; }
    .prose { min-width: 0; color: var(--ink-soft); font-size: 9pt; line-height: 1.55; overflow-wrap: anywhere; word-break: break-word; orphans: 3; widows: 3; }
    .prose > :last-child { margin-bottom: 0; }
    .prose strong { color: var(--ink); font-weight: 700; }
    .prose em { color: var(--ink-soft); }
    .prose code { padding: .2mm 1mm; border-radius: 1mm; background: #eef3f3; font-family: 'DejaVu Sans Mono', monospace; font-size: 8pt; overflow-wrap: anywhere; }
    .md-heading { color: var(--blue-deep); font-weight: 700; }
    .md-bullet { color: var(--green); font-weight: 800; }
    .md-number { color: var(--green); font-weight: 700; }
    .md-spacer { display: block; height: 1.4mm; }
    .project-list { display: block; }
    .project-card {
      margin: 0 0 3mm;
      padding: 3.5mm 4mm;
      border: 1px solid var(--line);
      border-radius: 2.5mm;
      background: #fff;
      break-inside: auto;
      page-break-inside: auto;
    }
    .project-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 3mm; margin: 0 0 1.5mm; break-after: avoid-page; page-break-after: avoid; }
    .project-title { min-width: 0; margin: 0; color: var(--blue-deep); font-size: 10pt; font-weight: 700; line-height: 1.35; overflow-wrap: anywhere; }
    .project-code { flex: 0 0 auto; padding: .8mm 2mm; border: 1px solid #d7e7ee; border-radius: 1.5mm; color: var(--blue); background: var(--blue-pale); font-size: 7pt; font-weight: 700; overflow-wrap: anywhere; }
    .project-affinity { margin: 0 0 1.5mm; color: #7a5a28; font-size: 7.5pt; font-weight: 600; }
    .project-detail { margin: 1.5mm 0; color: var(--ink-soft); font-size: 8.3pt; line-height: 1.5; overflow-wrap: anywhere; }
    .project-detail strong { color: var(--ink); }
    .perspective-card { margin: 0 0 4mm; padding: 4mm; border: 1px solid var(--line); border-top: 2px solid var(--green); border-radius: 2.5mm; background: #fff; }
    .perspective-title { margin: 0 0 1mm; color: var(--blue-deep); font-family: 'Lora', Georgia, serif; font-size: 12pt; font-weight: 700; }
    .qwen-meta { margin: -2mm 0 3mm; color: var(--muted); font-size: 7pt; }
    .closing-message { margin: 8mm 0 5mm; padding: 5mm; border: 1px solid #ead8b8; border-left: 3px solid var(--gold); border-radius: 2.5mm; background: #fffaf1; }
    .closing-message h2 { margin: 0 0 2mm; color: var(--blue-deep); font-family: 'Lora', Georgia, serif; font-size: 15pt; line-height: 1.25; }
    .closing-message .eyebrow { color: var(--green); }
    .closing-message blockquote { margin: 3mm 0; padding-left: 3.5mm; border-left: 2px solid var(--gold); color: #7a5a28; font-family: 'Lora', Georgia, serif; font-size: 10pt; font-style: italic; }
    .closing-message .closing-emphasis { margin: 3mm 0 0; color: var(--blue-deep); font-weight: 700; }
    .route-card { border-left: 3px solid var(--gold); background: #fffdfa; }
    .route-name { margin: 0 0 1.5mm; color: var(--blue-deep); font-family: 'Lora', Georgia, serif; font-size: 13pt; font-weight: 700; overflow-wrap: anywhere; }
    .line-card { margin: 3mm 0; padding: 3mm 4mm; border: 1px solid #ead8b8; border-left: 3px solid var(--gold); border-radius: 2mm; background: #fffaf1; }
    .line-card .story-label { color: #8a642b; }
    .line-name { margin: 0; color: var(--blue-deep); font-family: 'Lora', Georgia, serif; font-size: 11pt; font-weight: 700; overflow-wrap: anywhere; }
    .recommendation-card { border-left: 3px solid var(--green); background: #f8fbf8; break-inside: avoid-page; page-break-inside: avoid; }
    .recommendation-greeting { margin: 0 0 2mm; color: var(--blue-deep); font-family: 'Lora', Georgia, serif; font-size: 11pt; font-weight: 600; break-after: avoid-page; page-break-after: avoid; }
    .content-list { margin: 1mm 0 0; padding-left: 5mm; color: var(--ink-soft); }
    .content-list li { margin: 0 0 1.8mm; padding-left: 1mm; overflow-wrap: anywhere; orphans: 3; widows: 3; }
    .content-list li::marker { color: var(--green); }
    .empty-state { margin: 0; color: var(--muted); font-size: 8.5pt; font-style: italic; }
    .report-end { margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--line); color: var(--muted); font-size: 7.2pt; text-align: center; break-inside: avoid-page; page-break-inside: avoid; }
    .signature-logo { display: block; width: 24mm; max-height: 15mm; object-fit: contain; margin: 1.5mm auto 0; opacity: .68; }
    @media print {
      body { background: #fff; }
      .report-hero, .score-panel, .tag-list li, .story-card, .route-card, .recommendation-card, .line-card { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .report-end { display: none; }
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  <main>
    <header class="report-hero">
      <div class="hero-brand">
        <img src="${escapeHtml(logoUrl)}" alt="Logotipo oficial de LabSIE">
      </div>
      <div class="hero-copy">
        <p class="eyebrow">Dossier de orientación investigativa · ${date}</p>
        <h1>${text(user.nombre, 'Estudiante')}</h1>
        ${hasValue(user.programa) ? `<p class="hero-subtitle">${text(user.programa, '')}</p>` : ''}
        <p class="hero-meta">${metadata || 'Informe personalizado'}${hasValue(data?.id_evaluacion) ? '' : ''}</p>
      </div>
    </header>

    <section class="report-section">
      ${sectionHeading('01', 'Tu perfil investigador')}
      ${showScore ? `<div class="score-panel">
        <div class="score-gauge" role="img" aria-label="Afinidad con LabSIE: ${escapeHtml(score)} por ciento">
          <svg viewBox="0 0 80 80" aria-hidden="true" focusable="false">
            <circle class="score-track" cx="40" cy="40" r="34"></circle>
            <circle class="score-progress" cx="40" cy="40" r="34" stroke-dasharray="${gaugeCircumference.toFixed(2)}" stroke-dashoffset="${gaugeOffset.toFixed(2)}"></circle>
          </svg>
          <span class="score-value">${escapeHtml(score)}%</span>
        </div>
        <div><p class="score-caption">Afinidad con LabSIE</p><p class="score-level">${text(profile.nivel_correspondencia, 'Perfil en exploración')}</p></div>
      </div>` : ''}
      ${hasValue(archetype.nombre) || hasValue(archetype.descripcion) ? `<article class="archetype-card">
        <p class="eyebrow">Arquetipo identificado</p>
        <div class="archetype-title"><h3>${text(archetype.nombre, 'Perfil investigador')}</h3>${hasValue(archetype.emoji) ? `<span class="archetype-emoji" aria-hidden="true">${text(archetype.emoji, '')}</span>` : ''}</div>
        ${prose(archetype.descripcion)}
      </article>` : ''}
      <dl class="contact-grid">
        ${fact('Correo', user.correo)}
        ${fact('Teléfono', user.telefono)}
        ${fact('Programa', user.programa)}
        ${fact('Semestre', user.semestre)}
        ${fact('Vinculación', user.vinculacion)}
      </dl>
      <div class="experience-grid" style="margin-top:2.5mm;">
        ${fact('Experiencia previa', profile.experiencia_previa)}
        ${fact('Formación técnica', profile.formacion_tecnica)}
        ${fact('Familiaridad con IA', profile.familiaridad_ia)}
      </div>
    </section>

    ${(interestAreas.length || researchMethods.length || hasValue(interests.continuidad)) ? `<section class="report-section">
      ${sectionHeading('02', 'Intereses y formas de investigar')}
      ${interestAreas.length ? `<h3 class="subheading">Áreas de curiosidad</h3><ul class="tag-list">${interestAreas.map(item => `<li>${markdown(item)}</li>`).join('')}</ul>` : ''}
      ${researchMethods.length ? `<h3 class="subheading">Formas preferidas de investigar</h3><ul class="tag-list">${researchMethods.map(item => `<li>${markdown(item)}</li>`).join('')}</ul>` : ''}
      ${hasValue(interests.continuidad) ? `<article class="story-card"><span class="story-label">Preferencia de continuidad</span>${prose(interests.continuidad)}</article>` : ''}
    </section>` : ''}

    ${(hasValue(concern.problema) || hasValue(concern.investigacion_sonada) || hasValue(concern.meta_6_meses) || hasValue(concern.idea_divergente)) ? `<section class="report-section">
      ${sectionHeading('03', 'Ideas e inquietudes')}
      ${hasValue(concern.problema) ? `<article class="story-card"><span class="story-label">Problema o pregunta principal</span>${prose(concern.problema)}</article>` : ''}
      ${hasValue(concern.investigacion_sonada) ? `<article class="story-card"><span class="story-label">Investigación soñada</span>${prose(concern.investigacion_sonada)}</article>` : ''}
      ${hasValue(concern.meta_6_meses) ? `<article class="story-card"><span class="story-label">Meta a seis meses</span>${prose(concern.meta_6_meses)}</article>` : ''}
      ${hasValue(concern.idea_divergente) ? `<article class="story-card"><span class="story-label">Idea divergente</span>${prose(concern.idea_divergente)}</article>` : ''}
    </section>` : ''}

    <section class="report-section">
      ${sectionHeading('04', 'Proyectos sugeridos')}
      ${projects.length ? `<div class="project-list">${projects.map((project: any) => `<article class="project-card">
        <div class="project-title-row"><h3 class="project-title">${text(project?.titulo, 'Proyecto de investigación')}</h3>${hasValue(project?.codigo) ? `<span class="project-code">${text(project.codigo, '')}</span>` : ''}</div>
        ${hasValue(project?.afinidad) ? `<p class="project-affinity">Afinidad estimada: ${text(project.afinidad, '')}%</p>` : ''}
        ${prose(project?.porque_se_relaciona)}
      </article>`).join('')}</div>` : '<p class="empty-state">No se encontraron proyectos relacionados para este perfil.</p>'}
    </section>

    ${items(analysis.parrafos).some(hasValue) ? `<section class="report-section">
      ${sectionHeading('05', 'Lectura de tu perfil')}
      ${items(analysis.parrafos).filter(hasValue).map((paragraph: unknown) => `<article class="story-card">${prose(paragraph)}</article>`).join('')}
    </section>` : ''}

    ${hasValue(analysis.ruta) ? `<section class="report-section">
      ${sectionHeading('06', 'Una posible ruta para empezar')}
      <article class="route-card">
        <p class="eyebrow">Ruta estratégica sugerida</p>
        <h3 class="route-name">${text(analysis.ruta, '')}</h3>
        ${prose(analysis.descripcion_ruta)}
      </article>
    </section>` : ''}

    ${hasValue(data?.linea_sugerida) ? `<article class="line-card"><span class="story-label">Línea de investigación sugerida</span><p class="line-name">${text(data.linea_sugerida, '')}</p></article>` : ''}

    ${hasQwenContent ? `<section class="report-section">
      ${sectionHeading('07', 'Análisis completo de Qwen')}
      ${hasValue(qwen.model) || hasValue(qwen.analysisTimestamp) ? `<p class="qwen-meta">Generado por ${text(qwen.model, 'Qwen')}${hasValue(qwen.analysisTimestamp) ? ` · ${text(new Date(qwen.analysisTimestamp).toLocaleString('es-CO'), '')}` : ''}</p>` : ''}
      ${items(qwen.warmLetter).filter(hasValue).map((paragraph: unknown) => `<article class="story-card">${prose(paragraph)}</article>`).join('')}
      ${hasValue(qwen.contrastingNarrative) ? `<article class="story-card"><span class="story-label">Contraste con los proyectos de LabSIE</span>${prose(qwen.contrastingNarrative)}</article>` : ''}
      ${hasValue(qwen.whereYouCanEnter) ? `<article class="story-card"><span class="story-label">Dónde puedes entrar</span>${prose(qwen.whereYouCanEnter)}</article>` : ''}
      ${items(qwen.topMatchingProjects).filter(hasValue).length ? `<h3 class="subheading">Proyectos más afines</h3><ul class="content-list">${items(qwen.topMatchingProjects).filter(hasValue).map((project: any) => `<li><strong>${text(project?.projectCode, '')}${hasValue(project?.projectTitle) ? ` · ${text(project.projectTitle, '')}` : ''}</strong>${hasValue(project?.matchRationale) ? `: ${markdown(project.matchRationale)}` : ''}</li>`).join('')}</ul>` : ''}
      ${hasValue(qwen.programmingAffinityNote) ? `<article class="story-card"><span class="story-label">Afinidad con la programación</span>${prose(qwen.programmingAffinityNote)}</article>` : ''}
      ${hasValue(qwen.internationalDimensionNote) ? `<article class="story-card"><span class="story-label">Dimensión internacional</span>${prose(qwen.internationalDimensionNote)}</article>` : ''}
      ${items(qwen.projectsYouCanDo).filter(hasValue).length ? `<h3 class="subheading">Proyectos que puedes realizar</h3><div class="project-list">${items(qwen.projectsYouCanDo).filter(hasValue).map((project: any) => `<article class="project-card"><div class="project-title-row"><h3 class="project-title">${text(project?.projectTitle, 'Proyecto')}</h3>${hasValue(project?.projectCode) ? `<span class="project-code">${text(project.projectCode, '')}</span>` : ''}</div>${prose(project?.whatYouCanDo)}</article>`).join('')}</div>` : ''}
      ${hasValue(qwen.newMemberIntegrationAdvice) ? `<article class="recommendation-card"><span class="story-label">Recomendación para el tutor</span>${prose(qwen.newMemberIntegrationAdvice)}</article>` : ''}
      ${hasValue(qwen.closingNote) ? `<article class="story-card"><span class="story-label">Mensaje de cierre</span>${prose(qwen.closingNote)}</article>` : ''}
    </section>` : ''}

    ${['tentativeTitle', 'tentativeQuestion', 'tentativeObjective', 'possibleContribution'].some(key => hasValue(refinedProject[key])) ? `<section class="report-section">
      ${sectionHeading('08', 'Propuesta de investigación afinada')}
      <article class="recommendation-card">
        ${hasValue(refinedProject.tentativeTitle) ? `<h3 class="project-title">${text(refinedProject.tentativeTitle, '')}</h3>` : ''}
        ${renderProposalDetails(refinedProject)}
      </article>
    </section>` : ''}

    ${perspectives.length ? `<section class="report-section">
      ${sectionHeading('09', 'Enfoques de investigación generados')}
      ${perspectives.map((perspective: any, index: number) => `<article class="perspective-card">
        <h3 class="perspective-title">${text(perspective.title, `Enfoque ${index + 1}`)}</h3>
        ${hasValue(perspective.badge) ? `<p class="eyebrow">${text(perspective.badge, '')}</p>` : ''}
        <dl class="contact-grid">
          ${fact('Área de enfoque', perspective.focusArea)}
          ${fact('Arquetipo', perspective.archetype)}
          ${fact('Ruta sugerida', perspective.routeType)}
          ${hasValue(perspective.correspondenceScore) ? fact('Afinidad', `${text(perspective.correspondenceScore, '')}/100`) : ''}
          ${fact('Línea de investigación', perspective.primaryLineName)}
          ${fact('Metodología', perspective.methodologyFocus?.type)}
        </dl>
        ${hasValue(perspective.methodologyFocus?.description) ? `<p class="project-detail">${markdown(perspective.methodologyFocus.description)}</p>` : ''}
        ${items(perspective.whyExplanation).filter(hasValue).map((paragraph: unknown) => `<article class="story-card">${prose(paragraph)}</article>`).join('')}
        ${items(perspective.keyStrengths).filter(hasValue).length ? `<h4 class="subheading">Fortalezas identificadas</h4>${list(perspective.keyStrengths)}` : ''}
        ${items(perspective.relatedProjects).filter(hasValue).length ? `<h4 class="subheading">Proyectos relacionados</h4><div class="project-list">${items(perspective.relatedProjects).filter(hasValue).map((project: any) => `<article class="project-card"><div class="project-title-row"><h3 class="project-title">${text(project?.projectTitle, 'Proyecto')}</h3>${hasValue(project?.projectCode) ? `<span class="project-code">${text(project.projectCode, '')}</span>` : ''}</div>${hasValue(project?.affinity) ? `<p class="project-affinity">Afinidad: ${text(project.affinity, '')}%</p>` : ''}${prose(project?.connectionReason)}</article>`).join('')}</div>` : ''}
        ${perspective.proposedProject ? `<h4 class="subheading">Propuesta de este enfoque</h4>${hasValue(perspective.proposedProject.tentativeTitle) ? `<h3 class="project-title">${text(perspective.proposedProject.tentativeTitle, '')}</h3>` : ''}${renderProposalDetails(perspective.proposedProject)}` : ''}
      </article>`).join('')}
    </section>` : ''}

    ${(hasValue(personalized.saludo) || hasValue(personalized.donde_entrar) || recommendedProjects.length) ? `<section class="report-section">
      ${sectionHeading('10', 'Recomendación personalizada')}
      ${hasValue(personalized.saludo) ? `<p class="recommendation-greeting">${text(personalized.saludo, '')}</p>` : ''}
      ${hasValue(personalized.donde_entrar) ? `<article class="recommendation-card"><span class="story-label">Punto de partida</span>${prose(personalized.donde_entrar)}</article>` : ''}
      ${recommendedProjects.length ? `<h3 class="subheading">Proyectos en los que podrías participar</h3><div class="project-list">${recommendedProjects.map((project: any) => `<article class="project-card">
        <div class="project-title-row"><h3 class="project-title">${text(project?.projectTitle, 'Proyecto')}</h3>${hasValue(project?.projectCode) ? `<span class="project-code">${text(project.projectCode, '')}</span>` : ''}</div>
        ${prose(project?.whatYouCanDo)}
        ${renderProposalDetails(project)}
      </article>`).join('')}</div>` : ''}
    </section>` : ''}

    ${nextSteps.length ? `<section class="report-section">
      ${sectionHeading('11', 'Próximos pasos')}
      ${list(nextSteps, 'content-list')}
    </section>` : ''}

    ${[closingMessage.kicker, closingMessage.title, closingMessage.intro, closingMessage.quote, closingMessage.closing].some(hasValue) || items(closingMessage.paragraphs).some(hasValue) ? `<section class="closing-message">
      ${hasValue(closingMessage.kicker) ? `<p class="eyebrow">${text(closingMessage.kicker, '')}</p>` : ''}
      ${hasValue(closingMessage.title) ? `<h2>${text(closingMessage.title, '')}</h2>` : ''}
      ${hasValue(closingMessage.intro) ? prose(closingMessage.intro) : ''}
      ${hasValue(closingMessage.quote) ? `<blockquote>${markdown(closingMessage.quote)}</blockquote>` : ''}
      ${items(closingMessage.paragraphs).filter(hasValue).map((paragraph: unknown) => prose(paragraph, 'closing-paragraph')).join('')}
      ${hasValue(closingMessage.closing) ? `<p class="closing-emphasis">${markdown(closingMessage.closing)}</p>` : ''}
    </section>` : ''}

    <footer class="report-end">
      Un punto de partida para explorar, preguntar y construir.
      <img class="signature-logo" src="${escapeHtml(edutlanLogoUrl)}" alt="EduTLAN">
    </footer>
  </main>
</body>
</html>`;
}
