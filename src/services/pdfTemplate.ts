export function getPdfHtml(data: any): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe de Orientación Investigativa</title>
  <style>
    :root {
      --c-green: #0F5132;
      --c-gold: #B8860B;
      --c-magenta: #C2185B;
      --c-cream: #FFFCF7;
      --c-text: #1F2933;
      --c-gray: #E2E8F0;
      --c-gray-dark: #4A5568;
    }
    @page {
      size: A4;
      margin: 14mm;
      @bottom-left {
        content: "Semillero LabSIE · Grupo EduTLAN · edutlan.online";
        font-family: sans-serif;
        font-size: 8pt;
        color: #718096;
      }
      @bottom-right {
        content: "Página " counter(page) " de " counter(pages);
        font-family: sans-serif;
        font-size: 8pt;
        color: #718096;
      }
    }
    body {
      background-color: var(--c-cream);
      color: var(--c-text);
      font-family: sans-serif;
      font-size: 10pt;
      line-height: 1.45;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: serif;
      break-after: avoid;
      color: var(--c-green);
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { font-size: 18pt; margin-top: 0; }
    h2 { font-size: 14pt; border-bottom: 1px solid var(--c-gold); padding-bottom: 4px; display: flex; align-items: baseline; gap: 8px;}
    h2 .num { color: var(--c-gold); font-size: 12pt; }
    h3 { font-size: 12pt; }
    .code { font-family: monospace; }
    
    .header {
      background: linear-gradient(135deg, var(--c-green), #146c43);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      break-inside: avoid;
    }
    .header-logo { font-family: serif; font-size: 14pt; font-weight: bold; }
    .header-chip { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; font-size: 9pt; font-family: monospace; }
    
    .card {
      background: white;
      border: 1px solid var(--c-gray);
      border-radius: 8px;
      padding: 15px;
      break-inside: avoid;
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }
    .card-title { font-family: serif; font-weight: bold; color: var(--c-green); font-size: 11pt; margin-bottom: 8px; }
    
    .flex-grid { display: flex; gap: 15px; flex-wrap: wrap; align-items: stretch; }
    .col { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .col-2 { flex: 0 0 calc(50% - 7.5px); }
    .col-3 { flex: 0 0 calc(33.333% - 10px); }
    
    .badge { display: inline-block; background: #EDF2F7; padding: 4px 10px; border-radius: 4px; font-size: 9pt; margin: 3px 3px 3px 0; border: 1px solid var(--c-gray); }
    
    .score-ring { width: 70px; height: 70px; position: relative; margin: 0 auto; }
    .score-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    .score-ring circle { fill: none; stroke-width: 8; }
    .score-ring .bg { stroke: var(--c-gray); }
    .score-ring .progress { stroke: var(--c-gold); stroke-linecap: round; }
    .score-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; font-family: serif; font-size: 14pt; color: var(--c-green); }
    
    .quote { border-left: 4px solid var(--c-gold); padding-left: 15px; font-style: italic; font-size: 11pt; color: var(--c-gray-dark); margin: 15px 0; break-inside: avoid; }
    
    .progress-bar-container { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 10px;}
    .progress-bar { background: var(--c-gray); height: 8px; border-radius: 4px; overflow: hidden; flex: 1; }
    .progress-fill { background: var(--c-green); height: 100%; }
    .progress-label { font-family: monospace; font-size: 9pt; font-weight: bold; color: var(--c-green); white-space: nowrap; }
    
    .route-selector { display: flex; gap: 10px; margin: 20px 0; break-inside: avoid; }
    .route-step { flex: 1; text-align: center; padding: 12px 8px; border: 2px solid var(--c-gray); border-radius: 8px; color: var(--c-gray-dark); font-weight: bold; font-family: monospace; font-size: 9pt;}
    .route-step.active { border-color: var(--c-green); background: #F0FDF4; color: var(--c-green); }
    .route-desc { padding: 15px; background: #F0FDF4; border-left: 4px solid var(--c-green); border-radius: 0 8px 8px 0; break-inside: avoid; margin-bottom: 15px; }
    
    .stamp { display: inline-block; border: 2px solid var(--c-magenta); color: var(--c-magenta); padding: 4px 10px; font-size: 8pt; font-weight: bold; text-transform: uppercase; border-radius: 4px; transform: rotate(-2deg); margin-bottom: 15px; break-inside: avoid;}
    
    .page-break { break-before: page; }
    
    .cat-tecnologico { border-top: 4px solid var(--c-green); }
    .cat-didactico { border-top: 4px solid var(--c-gold); }
    .cat-social { border-top: 4px solid var(--c-magenta); }
    .cat-default { border-top: 4px solid var(--c-gray-dark); }
    
    ul { padding-left: 20px; margin-top: 5px; }
    li { margin-bottom: 5px; }
    p { margin-top: 0; margin-bottom: 0.8em; }
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

      const formatTitle = (title) => {
        if (!title) return '';
        if (title.length > 90) {
          const w = title.split(' ');
          return w.length > 12 ? w.slice(0, 12).join(' ') + '...' : title;
        }
        return title;
      };

      const getCatClass = (cat) => {
        const c = (cat || '').toLowerCase();
        if (c.includes('tecnológic') || c.includes('tecnologic')) return 'cat-tecnologico';
        if (c.includes('didáctic') || c.includes('didactic') || c.includes('pedagógic')) return 'cat-didactico';
        if (c.includes('social')) return 'cat-social';
        return 'cat-default';
      };

      let html = '';

      html += \`
        <div class="header">
          <div class="header-logo">LabSIE | Grupo EduTLAN</div>
          <div class="header-chip">\${data.id_evaluacion || 'ID'} • \${data.fecha || ''}</div>
        </div>
      \`;

      html += \`<h2><span class="num">01.</span> Perfil del Investigador</h2>\`;
      
      if (isVal(data.usuario)) {
        html += \`
          <div class="card flex-grid">
            <div class="col" style="flex: 2;">
              <div style="font-family:serif; font-size:16pt; font-weight:bold; color:var(--c-green); margin-bottom:5px;">\${data.usuario.nombre || ''}</div>
              <div><strong>Programa:</strong> \${data.usuario.programa || ''} \${isVal(data.usuario.semestre) ? \`(\${data.usuario.semestre})\` : ''}</div>
              \${isVal(data.usuario.vinculacion) ? \`<div><strong>Vinculación:</strong> \${data.usuario.vinculacion}</div>\` : ''}
              <div class="code" style="font-size:9pt; margin-top:10px; color:var(--c-gray-dark);">
                \${isVal(data.usuario.correo) ? data.usuario.correo : ''}
                \${isVal(data.usuario.correo) && isVal(data.usuario.telefono) ? ' • ' : ''}
                \${isVal(data.usuario.telefono) ? data.usuario.telefono : ''}
              </div>
            </div>
            \${isVal(data.perfil) ? \`
            <div class="col" style="flex: 1; align-items: center; justify-content: center; text-align: center; border-left: 1px solid var(--c-gray); padding-left: 15px;">
              <div class="score-ring">
                <svg viewBox="0 0 100 100">
                  <circle class="bg" cx="50" cy="50" r="45"></circle>
                  <circle class="progress" cx="50" cy="50" r="45" stroke-dasharray="\${(data.perfil.puntaje_global || 0) * 2.827} 282.7"></circle>
                </svg>
                <div class="score-text">\${data.perfil.puntaje_global || 0}</div>
              </div>
              <div style="font-weight:bold; color:var(--c-gold); margin-top:8px; font-size:9pt;">\${data.perfil.nivel_correspondencia || ''}</div>
            </div>
            \` : ''}
          </div>
        \`;
      }

      if (isVal(data.perfil)) {
        const arq = data.perfil.arquetipo;
        if (isVal(arq)) {
          html += \`
            <div class="card" style="background-color: var(--c-green); color: white; border: none;">
              <div style="font-family:serif; font-size:14pt; margin-bottom:5px;">
                \${arq.emoji || ''} \${arq.nombre || ''}
              </div>
              <div style="font-style:italic; font-size:11pt; margin-bottom:10px; color: #D1E7DD;">\${arq.subtitulo || ''}</div>
              <p style="color: #F8F9FA; margin:0;">\${md(arq.descripcion)}</p>
            </div>
          \`;
        }
        
        html += \`<div class="flex-grid" style="margin-bottom:15px;">\`;
        if (isVal(data.perfil.experiencia_previa)) {
          html += \`<div class="card col"><div class="card-title">Experiencia Previa</div><p style="margin:0;">\${md(data.perfil.experiencia_previa)}</p></div>\`;
        }
        if (isVal(data.perfil.formacion_tecnica)) {
          html += \`<div class="card col"><div class="card-title">Formación Técnica</div><p style="margin:0;">\${md(data.perfil.formacion_tecnica)}</p></div>\`;
        }
        if (isVal(data.perfil.familiaridad_ia)) {
          html += \`<div class="card col"><div class="card-title">Familiaridad con IA</div><p style="margin:0;">\${md(data.perfil.familiaridad_ia)}</p></div>\`;
        }
        html += \`</div>\`;
      }

      if (isVal(data.intereses)) {
        html += \`<div class="flex-grid">\`;
        if (Array.isArray(data.intereses.curiosidades) && data.intereses.curiosidades.length > 0) {
          html += \`
            <div class="card col" style="flex:2">
              <div class="card-title">Curiosidades e Intereses</div>
              <ul style="margin-bottom:0;">
                \${data.intereses.curiosidades.map(c => \`<li>\${md(c)}</li>\`).join('')}
              </ul>
            </div>
          \`;
        }
        if (Array.isArray(data.intereses.formas_de_investigar) && data.intereses.formas_de_investigar.length > 0) {
          html += \`
            <div class="card col" style="flex:1">
              <div class="card-title">Formas de Investigar</div>
              <div>
                \${data.intereses.formas_de_investigar.map(f => \`<span class="badge">\${f}</span>\`).join('')}
              </div>
            </div>
          \`;
        }
        html += \`</div>\`;
      }

      html += \`<div class="page-break"></div>\`;
      html += \`<h2><span class="num">02.</span> Tu Inquietud y Proyectos Relacionados</h2>\`;

      if (isVal(data.inquietud)) {
        if (isVal(data.inquietud.problema)) {
          html += \`<div class="quote">\${md(data.inquietud.problema)}</div>\`;
        }
        
        const hasDiv = isVal(data.inquietud.idea_divergente);
        html += \`<div class="flex-grid" style="margin-bottom:15px;">\`;
        if (isVal(data.inquietud.investigacion_sonada)) {
          html += \`<div class="card col \${!hasDiv ? 'col-2' : 'col-3'}">
            <div class="card-title">Investigación Soñada</div>
            <p style="margin:0;">\${md(data.inquietud.investigacion_sonada)}</p>
          </div>\`;
        }
        if (isVal(data.inquietud.meta_6_meses)) {
          html += \`<div class="card col \${!hasDiv ? 'col-2' : 'col-3'}">
            <div class="card-title">Meta a 6 meses</div>
            <p style="margin:0;">\${md(data.inquietud.meta_6_meses)}</p>
          </div>\`;
        }
        if (hasDiv) {
          html += \`<div class="card col col-3">
            <div class="card-title">Idea Divergente</div>
            <p style="margin:0;">\${md(data.inquietud.idea_divergente)}</p>
          </div>\`;
        }
        html += \`</div>\`;
      }

      if (Array.isArray(data.investigaciones_relacionadas) && data.investigaciones_relacionadas.length > 0) {
        const invs = [...data.investigaciones_relacionadas].sort((a,b) => (b.afinidad || 0) - (a.afinidad || 0));
        html += \`<div class="flex-grid">\`;
        invs.forEach(inv => {
          html += \`
            <div class="card col col-2">
              <div class="code" style="font-size:9pt; color:var(--c-gold); font-weight:bold; margin-bottom:5px;">\${inv.codigo || ''}</div>
              <div class="card-title">\${formatTitle(inv.titulo)}</div>
              \${inv.pregunta_guia ? \`<p style="font-style:italic; font-size:9.5pt;">"\${md(inv.pregunta_guia)}"</p>\` : ''}
              <p style="font-size:9.5pt; margin-bottom:0;">\${md(inv.porque_se_relaciona)}</p>
              
              <div class="progress-bar-container">
                <div class="progress-bar"><div class="progress-fill" style="width: \${inv.afinidad || 0}%;"></div></div>
                <div class="progress-label">\${inv.afinidad || 0}%</div>
              </div>
            </div>
          \`;
        });
        html += \`</div>\`;
      }

      html += \`<div class="page-break"></div>\`;
      html += \`<h2><span class="num">03.</span> Análisis y Ruta Propuesta</h2>\`;

      if (isVal(data.analisis)) {
        if (Array.isArray(data.analisis.parrafos) && data.analisis.parrafos.length > 0) {
          data.analisis.parrafos.forEach(p => {
            html += \`<p>\${md(p)}</p>\`;
          });
        }

        if (isVal(data.analisis.ruta)) {
          const rutas = ['HEREDAR', 'CONECTAR', 'TRASCENDER', 'EXPLORAR'];
          const activeRuta = data.analisis.ruta.toUpperCase();
          
          html += \`<div class="route-selector">\`;
          rutas.forEach(r => {
            const isActive = r === activeRuta;
            html += \`<div class="route-step \${isActive ? 'active' : ''}">\${r}</div>\`;
          });
          html += \`</div>\`;
          
          if (isVal(data.analisis.descripcion_ruta)) {
            html += \`<div class="route-desc">
              <strong style="color:var(--c-green); display:block; margin-bottom:5px;">Ruta: \${activeRuta}</strong>
              \${md(data.analisis.descripcion_ruta)}
            </div>\`;
          }
        }
      }

      document.write(html);
    </script>
  </div>
</body>
</html>`;
}
