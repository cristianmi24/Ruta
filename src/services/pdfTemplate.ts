export function getPdfHtml(data: any): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe de Orientación Investigativa</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
    :root {
      --primary: #0f172a;
      --secondary: #334155;
      --accent: #3b82f6;
      --accent-light: #eff6ff;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
    }
    @page {
      size: A4;
      margin: 20mm;
      @bottom-right {
        content: "Página " counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: var(--text-muted);
      }
    }
    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: 'Playfair Display', serif;
      color: var(--primary);
      margin-top: 1.8em;
      margin-bottom: 0.8em;
      line-height: 1.2;
    }
    h1 { font-size: 24pt; margin-top: 0; letter-spacing: -0.5px; }
    h2 { 
      font-size: 16pt; 
      border-bottom: 2px solid var(--accent); 
      padding-bottom: 8px; 
      display: inline-block;
    }
    .header {
      background: var(--primary);
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }
    .header::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 50%;
      height: 200%;
      background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.05));
      transform: rotate(15deg);
    }
    .header-logo { font-size: 10pt; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 10px; }
    .header-title { font-size: 22pt; font-family: 'Playfair Display', serif; font-weight: 700; margin-bottom: 5px; }
    .header-subtitle { font-size: 11pt; color: #cbd5e1; font-weight: 400; }
    
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      break-inside: avoid;
    }
    .card-title { font-family: 'Inter', sans-serif; font-weight: 600; color: var(--secondary); font-size: 10pt; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    
    .badge { 
      display: inline-block; 
      background: var(--accent-light); 
      color: var(--accent);
      padding: 6px 12px; 
      border-radius: 20px; 
      font-size: 8.5pt; 
      font-weight: 600;
      margin: 4px 4px 4px 0; 
      border: 1px solid #bfdbfe; 
    }
    
    .score-box {
      text-align: center;
      padding: 20px;
      background: var(--primary);
      color: white;
      border-radius: 10px;
    }
    .score-number { font-size: 36pt; font-family: 'Playfair Display', serif; font-weight: 700; color: var(--accent); line-height: 1; margin-bottom: 10px; }
    .score-label { font-size: 9pt; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
    
    .quote-box {
      border-left: 4px solid var(--accent);
      padding: 15px 20px;
      background: white;
      font-style: italic;
      font-size: 11pt;
      color: var(--secondary);
      border-radius: 0 8px 8px 0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .project-item {
      padding: 15px;
      border: 1px solid var(--border);
      border-radius: 8px;
      margin-bottom: 15px;
      background: white;
    }
    .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .project-code { font-family: monospace; color: var(--accent); font-weight: 600; background: var(--accent-light); padding: 4px 8px; border-radius: 4px; font-size: 9pt; }
    .project-title { font-weight: 600; font-size: 11pt; color: var(--primary); }
    
    .route-highlight {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border: 1px solid #93c5fd;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }
    .route-name { font-size: 18pt; font-family: 'Playfair Display', serif; font-weight: 700; color: var(--accent); margin-bottom: 10px; }
    
    .page-break { break-before: page; }
    ul { padding-left: 20px; margin-top: 5px; }
    li { margin-bottom: 8px; }
    p { margin-top: 0; margin-bottom: 1em; }
  </style>
</head>
<body>
  <div id="report-container">
    <script>
      const data = ${JSON.stringify(data)};

      const md = (t) => {
        if (!t) return '';
        return t.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\*(.*?)\\*/g, '<em>$1</em>');
      };
      const isVal = (v) => v !== null && v !== undefined && v !== "" && v !== "—";

      let html = '';

      // Header
      html += \`
        <div class="header">
          <div class="header-logo">LabSIE · Dossier de Análisis Estudiantil</div>
          <div class="header-title">\${data.usuario?.nombre || 'Estudiante'}</div>
          <div class="header-subtitle">\${data.usuario?.programa || ''} | \${data.id_evaluacion || ''} | \${data.fecha || ''}</div>
        </div>
      \`;

      // Seccion 1: Perfil
      html += \`<h2>Perfil Investigativo</h2>\`;
      html += \`<div class="grid">\`;
      
      // Info basica
      html += \`<div class="card">
        <div class="card-title">Datos Personales</div>
        <p><strong>Correo:</strong> \${data.usuario?.correo || 'N/A'}</p>
        <p><strong>Teléfono:</strong> \${data.usuario?.telefono || 'N/A'}</p>
        <p><strong>Semestre:</strong> \${data.usuario?.semestre || 'N/A'}</p>
        <p><strong>Vinculación:</strong> \${data.usuario?.vinculacion || 'N/A'}</p>
      </div>\`;

      // Score
      if (isVal(data.perfil)) {
        html += \`<div class="score-box">
          <div class="score-number">\${data.perfil.puntaje_global || 0}%</div>
          <div class="score-label">Nivel de Afinidad LabSIE</div>
          <div style="margin-top:10px; font-weight:600;">\${data.perfil.nivel_correspondencia || ''}</div>
        </div>\`;
      }
      html += \`</div>\`;

      // Arquetipo
      if (isVal(data.perfil) && isVal(data.perfil.arquetipo)) {
        const arq = data.perfil.arquetipo;
        html += \`
          <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--accent);">
            <div class="card-title">Arquetipo Identificado: \${arq.nombre || ''} \${arq.emoji || ''}</div>
            <p style="font-size:11pt;">\${md(arq.descripcion)}</p>
          </div>
        \`;
      }

      // Experiencia
      if (isVal(data.perfil)) {
        html += \`<div class="grid grid-3">\`;
        if (isVal(data.perfil.experiencia_previa)) {
          html += \`<div class="card"><div class="card-title">Exp. Previa</div><p class="text-sm">\${md(data.perfil.experiencia_previa)}</p></div>\`;
        }
        if (isVal(data.perfil.formacion_tecnica)) {
          html += \`<div class="card"><div class="card-title">Técnica</div><p class="text-sm">\${md(data.perfil.formacion_tecnica)}</p></div>\`;
        }
        if (isVal(data.perfil.familiaridad_ia)) {
          html += \`<div class="card"><div class="card-title">IA</div><p class="text-sm">\${md(data.perfil.familiaridad_ia)}</p></div>\`;
        }
        html += \`</div>\`;
      }

      // Intereses
      if (isVal(data.intereses)) {
        html += \`<div class="grid" style="margin-top:20px;">\`;
        if (Array.isArray(data.intereses.curiosidades)) {
          html += \`<div class="card">
            <div class="card-title">Áreas de Curiosidad</div>
            <ul>\${data.intereses.curiosidades.map(c => \`<li>\${md(c)}</li>\`).join('')}</ul>
          </div>\`;
        }
        if (Array.isArray(data.intereses.formas_de_investigar)) {
          html += \`<div class="card">
            <div class="card-title">Formas Preferidas</div>
            <div>\${data.intereses.formas_de_investigar.map(f => \`<span class="badge">\${f}</span>\`).join('')}</div>
          </div>\`;
        }
        html += \`</div>\`;
      }

      html += \`<div class="page-break"></div>\`;
      
      // Seccion 2: Inquietud
      html += \`<h2>Idea e Inquietudes</h2>\`;
      if (isVal(data.inquietud)) {
        if (isVal(data.inquietud.problema)) {
          html += \`<div class="quote-box" style="margin-bottom:20px;">\${md(data.inquietud.problema)}</div>\`;
        }
        html += \`<div class="grid">\`;
        if (isVal(data.inquietud.investigacion_sonada)) {
          html += \`<div class="card"><div class="card-title">Investigación Soñada</div><p>\${md(data.inquietud.investigacion_sonada)}</p></div>\`;
        }
        if (isVal(data.inquietud.meta_6_meses)) {
          html += \`<div class="card"><div class="card-title">Meta a 6 Meses</div><p>\${md(data.inquietud.meta_6_meses)}</p></div>\`;
        }
        html += \`</div>\`;
      }

      // Proyectos relacionados
      html += \`<h2 style="margin-top:30px;">Proyectos Sugeridos</h2>\`;
      if (Array.isArray(data.investigaciones_relacionadas) && data.investigaciones_relacionadas.length > 0) {
        data.investigaciones_relacionadas.forEach(inv => {
          html += \`
            <div class="project-item">
              <div class="project-header">
                <div class="project-title">\${inv.titulo || ''}</div>
                <div class="project-code">\${inv.codigo || ''}</div>
              </div>
              <p style="font-size:9.5pt; color:var(--text-muted);">\${md(inv.porque_se_relaciona)}</p>
            </div>
          \`;
        });
      }

      // Ruta Propuesta
      html += \`<h2 style="margin-top:30px;">Ruta a Seguir</h2>\`;
      if (isVal(data.analisis) && isVal(data.analisis.ruta)) {
        html += \`
          <div class="route-highlight">
            <div class="card-title" style="margin-bottom:5px;">Ruta Estratégica Asignada</div>
            <div class="route-name">\${data.analisis.ruta}</div>
            <p style="color:var(--secondary);">\${md(data.analisis.descripcion_ruta || '')}</p>
          </div>
        \`;
      }

      if (isVal(data.linea_sugerida)) {
        html += \`
          <div class="card" style="margin-top:20px; background:var(--primary); color:white; border:none; text-align:center;">
            <div style="font-size:9pt; text-transform:uppercase; color:#94a3b8; margin-bottom:5px;">Línea de Investigación Sugerida</div>
            <div style="font-family:'Playfair Display', serif; font-size:14pt; font-weight:700;">\${data.linea_sugerida}</div>
          </div>
        \`;
      }

      document.write(html);
    </script>
  </div>
</body>
</html>`;
}</body>
</html>`;
}
