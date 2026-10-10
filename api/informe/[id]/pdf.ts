import { db, decryptPII, handle, HttpError, requireCoordinator } from '../../_lib/server.js';
import { getPdfBuffer } from '../../_lib/pdfTemplate.js';

export const GET = handle(async req => {
  // Solo los coordinadores/administradores pueden descargar el informe
  requireCoordinator(req);
  
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) throw new HttpError(400, 'Falta el ID del informe.');

  // Obtener datos de la base de datos
  const rows = (await db()`
    SELECT payload, email_enc, phone_enc FROM analyses WHERE id = ${id}`) as any[];
  if (!rows.length) throw new HttpError(404, 'Informe no encontrado.');

  const r = rows[0];
  const payload = r.payload || {};
  const profile = payload.studentProfile || {};
  const qwen = payload.qwenAnalysis || {};
  const answers = payload.studentAnswers || {};
  const score = payload.correspondenceScore ?? 80;
  const toStringArray = (value: unknown, separator: string): string[] => Array.isArray(value)
    ? value.map(entry => String(entry ?? '').trim()).filter(Boolean)
    : String(value ?? '').split(separator).map(entry => entry.trim()).filter(Boolean);
  const relatedProjects = Array.isArray(qwen.projectsYouCanDo) ? qwen.projectsYouCanDo : [];
  
  // Transformar al esquema JSON esperado por la plantilla
  const data = {
    id_evaluacion: id,
    fecha: new Date().toLocaleDateString('es-ES'),
    usuario: {
      nombre: profile.name,
      programa: profile.program,
      semestre: profile.semester,
      correo: decryptPII(r.email_enc),
      telefono: decryptPII(r.phone_enc),
      vinculacion: 'Estudiante' // Asumido por defecto
    },
    perfil: {
      arquetipo: {
        nombre: qwen.model || 'Analista',
        emoji: '🧠',
        subtitulo: 'Perfil detectado por IA',
        descripcion: qwen.contrastingNarrative || 'Perfil técnico con altas capacidades'
      },
      puntaje_global: score,
      nivel_correspondencia: score > 75 ? 'Alta correspondencia' : 'Media correspondencia',
      experiencia_previa: profile.researchExperience,
      formacion_tecnica: profile.techExperience,
      familiaridad_ia: profile.aiExperience
    },
    intereses: {
      curiosidades: toStringArray(answers.curiosityQuestions, '\n'),
      formas_de_investigar: toStringArray(answers.preferredActivities, ','),
      continuidad: answers.continuationPreference
    },
    inquietud: {
      problema: answers.problemToInvestigate,
      investigacion_sonada: answers.dreamResearch,
      meta_6_meses: answers.sixMonthsDiscovery,
      idea_divergente: answers.divergentProjectIdea
    },
    investigaciones_relacionadas: relatedProjects.map((p: any) => ({
      codigo: p.projectCode,
      titulo: p.projectTitle,
      afinidad: 85, // Mocked for template
      porque_se_relaciona: p.whatYouCanDo
    })),
    analisis: {
      parrafos: [qwen.programmingAffinityNote, qwen.internationalDimensionNote].filter(Boolean),
      ruta: payload.routeType || 'EXPLORAR',
      descripcion_ruta: qwen.whereYouCanEnter
    },
    reporte_personalizado: {
      saludo: `Hola ${profile.name?.split(' ')[0] || ''}, revisamos tu perfil`,
      donde_entrar: qwen.whereYouCanEnter,
      proyectos_participar: relatedProjects
    },
    linea_sugerida: payload.primaryLineName,
    proximos_pasos: [
      "Revisar el informe detalladamente.",
      "Asistir al horario de atención del Director Manuel Caro (Martes de 3 a 4 pm).",
      "Definir el proyecto a iniciar."
    ]
  };

  const pdfBuffer = await getPdfBuffer(data);
  const safeName = String(data.usuario.nombre || 'LabSIE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'LabSIE';
  const date = new Date().toISOString().slice(0, 10);

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Informe_Admin_${safeName}_${date}.pdf"`
    }
  });
});
