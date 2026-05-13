import type {
  ContentPlanRow,
  ContentPlatform,
  ContentStatus,
  ContentType,
} from '../../src/types';
import { iso, isoDate, mondayOf, addDays } from '../lib/dates';
import { SeededRandom } from '../lib/random';

export type SeedContentPost = ContentPlanRow;

interface PostSpec {
  dayOffset: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Mon=0
  platform: ContentPlatform;
  content_type: ContentType;
  topic: string;
  hook: string;
  copy_primary: string;
  copy_variation_2: string;
  copy_variation_3: string;
  hashtags: string[];
  cta: string;
  visual_idea: string;
  reference_links: string[];
  ai_reasoning: string;
}

const POSTS: PostSpec[] = [
  // ============ LUNES — LinkedIn ============
  {
    dayOffset: 0,
    platform: 'linkedin',
    content_type: 'build_in_public',
    topic: 'Lanzamiento de Smart Inbox con captura WhatsApp',
    hook: 'Esta semana resolvimos el dolor #1 de las agencias creativas mexicanas: dónde quedó el OK.',
    copy_primary: `Esta semana resolvimos el dolor #1 de las agencias creativas mexicanas: dónde quedó el OK.

En FlorioIn lanzamos Smart Inbox con captura WhatsApp Business: cada mensaje del cliente cae automáticamente en el timeline del proyecto. No más capturas manuales. No más "creo que aprobaron por WhatsApp" sin evidencia.

Para una agencia de 15 personas que vimos esta semana, eso son ~6 horas/semana recuperadas solo en coordinación interna.

Build-in-public desde México. Sin equipo de marketing. Sin ronda. Solo construir lo que las agencias mexicanas estaban esperando.

Si manejas approvals entre WhatsApp y email todos los días: DM para acceso a la beta.`,
    copy_variation_2: `Llevo 8 meses construyendo FlorioIn solo desde México. La feature que más me han pedido las agencias creativas: capturar approvals de WhatsApp automáticamente.

Esta semana la entregamos.

Ahora cada "va, perfecto" del cliente queda en el timeline del proyecto, con timestamp, sin que nadie tenga que copiar y pegar. La diferencia entre tener evidencia y depender de memoria humana.

Tres meses de trabajo. Vale la pena cada noche corta.`,
    copy_variation_3: `Pregunta para founders de agencias creativas en LATAM:

¿Cuántas horas a la semana pierden tu equipo coordinando feedback de clientes entre WhatsApp, email y reuniones?

En FlorioIn medimos esto con los primeros equipos beta. Promedio: 6.4 horas/semana por person. Eso es un día de trabajo perdido por semana.

Esta semana lanzamos Smart Inbox con captura WhatsApp para que ese día regrese.

¿Te interesa probarlo? DM.`,
    hashtags: [
      '#startupmx',
      '#saas',
      '#agenciascreativas',
      '#productividad',
      '#buildinpublic',
      '#latam',
      '#mexico',
    ],
    cta: 'DM para acceso a la beta privada',
    visual_idea:
      'Screenshot del Smart Inbox capturando 3 channels (WhatsApp + email + comentarios) en un solo timeline. Anotaciones marcando cada captura con timestamp.',
    reference_links: ['https://florioin.app/smart-inbox'],
    ai_reasoning:
      'LinkedIn lunes 8am: ICP agencias scrollean en mañana antes de standups. Build-in-public con feature concreto da credibilidad. Lanzamiento real = momento perfecto. Hook con dolor específico ("dónde quedó el OK") resuena más que feature description.',
  },

  // ============ LUNES — Instagram ============
  {
    dayOffset: 0,
    platform: 'instagram',
    content_type: 'feature_spotlight',
    topic: 'Smart Inbox visual showcase',
    hook: 'WhatsApp + email + comentarios. Todo en un timeline.',
    copy_primary: `Tu cliente te aprobó por WhatsApp el viernes.
Tu director creativo lo vio en una llamada el lunes.
Tu cuenta lo dio por hecho en un email del martes.

¿Quién tiene la versión correcta?

Smart Inbox de FlorioIn captura cada mensaje en el timeline del proyecto. Sin que tu equipo copie y pegue. Sin perderte detalles.

Acceso a beta en bio.`,
    copy_variation_2: `Esto es lo que estuvimos construyendo los últimos tres meses.

Smart Inbox: cada feedback de cliente — venga de WhatsApp, email o comentario en un archivo — cae en el timeline del proyecto. Automático.

No es magia. Es respeto por las horas de tu equipo.

Beta abierta para 30 agencias mexicanas. Link en bio.`,
    copy_variation_3: `Una pregunta para founders de agencias:

¿Cuánto cuesta perder un approval entre WhatsApp y email?

Para una de las agencias que probó FlorioIn: 1 cliente quemado + 2 días de re-trabajo + una conversación incómoda.

Smart Inbox previene eso. Captura automática cross-channel. En el timeline correcto siempre.

DM para acceso.`,
    hashtags: [
      '#agenciacreativa',
      '#diseñadoresmexicanos',
      '#productividad',
      '#startupmx',
      '#saas',
      '#cdmx',
      '#guadalajara',
      '#monterrey',
      '#agenciadigital',
      '#productivity',
    ],
    cta: 'Link en bio para beta',
    visual_idea:
      'Carrousel 5 slides: (1) hook visual, (2) caos de canales actual, (3) Smart Inbox unifica, (4) timeline final limpio, (5) CTA. Estilo Florioin Liquid Glass — cream + obsidian + brand gradient.',
    reference_links: ['https://florioin.app/smart-inbox'],
    ai_reasoning:
      'Instagram lunes mediodía: alta visualidad necesaria. Carrousel funciona mejor que single image. Mismo lanzamiento que LinkedIn pero traducido a visual storytelling.',
  },

  // ============ MIÉRCOLES — LinkedIn ============
  {
    dayOffset: 2,
    platform: 'linkedin',
    content_type: 'educational',
    topic: 'Cómo medir si tu agencia necesita workspace dedicado',
    hook: '3 preguntas para saber si tu agencia ya tocó el techo de Notion + WhatsApp + Slack.',
    copy_primary: `3 preguntas para saber si tu agencia ya tocó el techo de su stack actual:

1. ¿Cuántas veces a la semana alguien pregunta "¿el cliente aprobó esto o no?" — y la respuesta requiere buscar en 2+ herramientas?

2. ¿Tu Project Manager pasa más de 4 horas a la semana solo copiando feedback de clientes a documentos internos?

3. ¿Has perdido un proyecto (parcial o totalmente) por miscomunicación de approvals en los últimos 6 meses?

Si la respuesta a cualquiera es sí, ya no es problema de disciplina. Es problema de herramienta.

No te recomiendo ninguna específica — depende de tu contexto. Pero deja de pelearte con un workflow que ya no escala.

Si quieres ver cómo FlorioIn lo aborda específico para agencias creativas: link en perfil.`,
    copy_variation_2: `Llevo 8 meses hablando con founders de agencias creativas en México. Patrón claro:

Las agencias de 5-15 personas funcionan bien con Notion + WhatsApp + Drive.
Las agencias de 16-40 personas empiezan a romperse en approvals cross-channel.
Las agencias de 40+ ya tienen un PM dedicado solo a "buscar dónde quedó la decisión".

Si tu agencia está en el segundo grupo: el problema no es tu equipo. Es que ningún workspace genérico está construido para creative ops.

Comento ejemplos en respuestas.`,
    copy_variation_3: `Reflexión de founder a founder de agencia:

La mejor agencia con la que trabajé tenía 8 personas y operaba como reloj suizo. La menos eficiente tenía 35 y vivían en caos.

¿Qué cambió? No fue herramientas — ambas usaban más o menos lo mismo. Fue claridad sobre quién decidía qué, cuándo, en qué canal.

Las herramientas pueden ayudar a reforzar esa claridad. No la pueden crear.

Construir cultura primero. Después automatizar.`,
    hashtags: [
      '#agenciascreativas',
      '#operations',
      '#productividad',
      '#startupmx',
      '#liderazgo',
      '#mexico',
      '#latam',
    ],
    cta: 'Comenta cuál de las 3 te aplica',
    visual_idea:
      'Imagen simple: las 3 preguntas en cards apiladas, estilo Liquid Glass. Cream background.',
    reference_links: [],
    ai_reasoning:
      'LinkedIn miércoles: educational beats build-in-public mid-week. 3 preguntas estructura facil de escanear. CTA suave (comentar) genera engagement orgánico que ayuda el reach del próximo viernes.',
  },

  // ============ MIÉRCOLES — Instagram ============
  {
    dayOffset: 2,
    platform: 'instagram',
    content_type: 'behind_the_scenes',
    topic: 'Día en la vida construyendo solo desde México',
    hook: '06:30 AM CDMX. Otra semana construyendo solo.',
    copy_primary: `06:30 AM CDMX.

Café, terminal abierta, claude code corriendo.

Esta semana: 12 features pequeñas, 2 bugs críticos, 8 conversaciones con founders de agencias.

Construyo FlorioIn solo. Sin equipo. Sin oficina. Sin ronda de inversión.

Solo escuchando a las agencias mexicanas que aceptaron probar el producto y construyendo lo que dicen que necesitan.

Es lento. Es honesto. Es mío.

Beta en bio para agencias 5-200 personas.`,
    copy_variation_2: `Lo que no se ve cuando un founder dice "estoy construyendo":

- 4:30 AM despertarme con un bug en producción
- 7:00 AM hablar con un cliente que no entendió onboarding
- 11:00 AM dudar si todo esto vale la pena
- 14:00 PM una agencia dice "esto es exactamente lo que necesitábamos"
- 22:00 PM regresar a código porque mañana hay demo

Vale la pena.`,
    copy_variation_3: `Solo founder. Solo en México. Sin marketing budget.

Mi único secreto: cada semana hablo con 5-10 agencias creativas reales y construyo lo que me dicen que rompe sus días.

Sin ron de la verdad. Sin pitch deck preparado.

Solo: ¿qué te está costando trabajo esta semana?

Esa pregunta vale más que cualquier estrategia.`,
    hashtags: [
      '#solofounder',
      '#startupmx',
      '#buildinpublic',
      '#mexicocity',
      '#cdmx',
      '#emprendedormexicano',
      '#saas',
      '#agenciascreativas',
      '#productividad',
      '#latam',
    ],
    cta: 'Beta link en bio',
    visual_idea:
      'Foto real del setup de Carlos en casa: laptop, café, libreta. Filtro warm. Ventana de fondo si hay luz natural.',
    reference_links: [],
    ai_reasoning:
      'Instagram miércoles tarde: behind-the-scenes humaniza, contrarresta tono más educacional del LinkedIn del mismo día. Auténtico = engagement orgánico mayor. Foto real > stock.',
  },

  // ============ JUEVES — TikTok ============
  {
    dayOffset: 3,
    platform: 'tiktok',
    content_type: 'feature_spotlight',
    topic: 'Demo Smart Inbox en 30 segundos',
    hook: 'Cuando tu cliente te aprueba por WhatsApp y a las 2 semanas dice "yo no aprobé eso"...',
    copy_primary: `POV: tu cliente te aprueba por WhatsApp y a las 2 semanas dice "yo no aprobé eso".

Esto es lo que construí para que eso nunca te pase.

Smart Inbox captura cada WhatsApp del cliente directo al timeline del proyecto. Con timestamp. Con evidencia. Para que cuando alguien dude, abras FlorioIn y digas "está aquí, mira".

Para agencias creativas en México que están cansadas de pelearse con stack mental.

Beta abierta. DM "florioin" y te paso acceso.`,
    copy_variation_2: `Las agencias creativas mexicanas pierden 6 horas/semana solo coordinando approvals entre WhatsApp y email.

Eso es un día de trabajo. Por persona. Por semana.

Construí FlorioIn solo desde CDMX para que recuperen ese día.

Si manejas una agencia 5-50 personas: DM "florioin".`,
    copy_variation_3: `Pregunta para creative directors:

¿Cuántas veces a la semana abres WhatsApp para confirmar un approval que ya no recuerdas si fue oral, escrito o asumido?

Si la respuesta es más de 0, FlorioIn fue construido literalmente para tu equipo.

DM "florioin" para acceso beta.`,
    hashtags: [
      '#agenciacreativa',
      '#productividad',
      '#startupmx',
      '#saas',
      '#emprendedormexicano',
    ],
    cta: 'DM "florioin" para beta',
    visual_idea:
      'Video vertical 30 seg: (1) 3 seg hook con texto grande "POV: tu cliente dice yo no aprobé esto", (2) 10 seg pantalla mostrando WhatsApp + email + comentarios caos, (3) 10 seg transición al timeline FlorioIn ordenado, (4) 7 seg call to action en cámara con la cara del founder.',
    reference_links: [],
    ai_reasoning:
      'TikTok jueves: POV format funciona en LATAM. Hook claro en 3 segundos crítico. Tono mexicano coloquial (no formal SaaS USA). Video corto > carrousel en TikTok.',
  },

  // ============ VIERNES — LinkedIn ============
  {
    dayOffset: 4,
    platform: 'linkedin',
    content_type: 'thought_leadership',
    topic: 'Por qué construir desde LATAM contra herramientas masivas',
    hook: 'Las herramientas de productividad más usadas del mundo no fueron construidas para nosotros.',
    copy_primary: `Las herramientas de productividad más usadas del mundo no fueron construidas para nosotros.

No para los founders de agencias creativas en CDMX que coordinan clientes por WhatsApp.
No para los equipos en Monterrey que mezclan español e inglés en el mismo proyecto.
No para las agencias en Guadalajara que necesitan facturar en pesos pero cobrar en dólares.

Fueron construidas para teams remotos en San Francisco con stack USA-centric, cliente USA-centric, workflow USA-centric.

Y son excelentes en eso.

Pero hay un hueco: el equipo creativo LATAM que necesita su propia herramienta diseñada con cómo trabajamos aquí.

Eso es FlorioIn. Hecha en México. Para agencias creativas LATAM. Con WhatsApp como ciudadano de primera clase. Con español natural. Con pricing en USD pero pensada para márgenes locales.

Construyo solo, sin ronda, porque creo que esta historia se cuenta mejor desde aquí.

Si tu agencia opera en LATAM y se siente forzada a usar herramientas que claramente no fueron diseñadas para ustedes: DM, te paso acceso a la beta.`,
    copy_variation_2: `Founders de agencias en LATAM:

¿Cuántas veces has sentido que tu workspace fue diseñado para alguien que no eres tú?

Notas en inglés cuando tu equipo habla español.
Pricing en USD que no considera tu margen local.
WhatsApp como integración de segunda clase cuando es tu canal principal.
Soporte que vive en zonas horarias que no son las tuyas.

Construyo FlorioIn solo desde México porque creo que merece existir una herramienta diseñada AQUÍ, para AGENCIAS CREATIVAS, en NUESTRO contexto.

DM si quieres ver la beta.`,
    copy_variation_3: `Realidad incómoda:

El 90% de las herramientas de productividad B2B que usan las agencias latinoamericanas no fueron diseñadas en LATAM, ni para LATAM, ni con LATAM en mente.

Eso no es necesariamente malo. Pero significa que estamos siempre forzando workflows que no son los nuestros.

Mi tesis con FlorioIn: si construimos desde aquí, para nosotros, con nuestro contexto — el producto se siente diferente. Más natural. Más respetuoso.

Beta privada abierta. Si te late la tesis, DM.`,
    hashtags: [
      '#latam',
      '#mexico',
      '#startupmx',
      '#agenciascreativas',
      '#emprendedorlatino',
      '#productividad',
      '#saas',
    ],
    cta: 'DM para beta',
    visual_idea:
      'Mapa LATAM minimalista con punto en CDMX iluminado con el brand gradient. Texto overlay: "Hecho aquí".',
    reference_links: ['https://florioin.app'],
    ai_reasoning:
      'LinkedIn viernes 9am: thought leadership cierra la semana con tono fuerte. Tesis founder-to-founder. CDMX/MTY/GDL específicos resuenan con LATAM. Sin mencionar competidores por nombre (rule estricta).',
  },

  // ============ VIERNES — Instagram ============
  {
    dayOffset: 4,
    platform: 'instagram',
    content_type: 'testimonial',
    topic: 'Testimonial agencia beta (cuando exista — placeholder con dato real)',
    hook: '"Recuperamos 6 horas/semana solo en coordinación interna."',
    copy_primary: `"Recuperamos 6 horas/semana solo en coordinación interna."

— Founder de agencia creativa, 15 personas, CDMX.

Eso es lo que está pasando con los primeros equipos beta de FlorioIn.

No es magia. Es Smart Inbox unificando approvals cross-channel. Es decisiones documentadas automáticamente. Es timeline por proyecto que respeta cómo trabajan las agencias creativas en México.

Beta abierta para 20 agencias más. Link en bio.`,
    copy_variation_2: `Lo que escuché esta semana de una agencia beta:

"Antes pasábamos los lunes en la mañana reconstruyendo qué aprobó cada cliente en el weekend. Ahora abrimos FlorioIn y está todo ahí. Recuperamos los lunes."

Eso vale más que cualquier feature spec.

Beta privada — link en bio.`,
    copy_variation_3: `Una agencia creativa de CDMX me dijo esta semana:

"Lo que más me sorprende no es que funcione. Es que se siente como nosotros lo hubiéramos construido. WhatsApp como ciudadano de primera. Pricing en USD pero sin gringocentrismo. Español que se siente natural."

Eso vale el año que llevo en esto.

Beta — link en bio.`,
    hashtags: [
      '#agenciascreativas',
      '#testimonio',
      '#startupmx',
      '#productividad',
      '#cdmx',
      '#emprendedormexicano',
      '#saas',
      '#buildinpublic',
      '#latam',
      '#mexico',
    ],
    cta: 'Link en bio para beta',
    visual_idea:
      'Quote card con la frase grande, cream background + brand gradient como acento. Footer "— Founder de agencia creativa, 15 personas, CDMX."',
    reference_links: [],
    ai_reasoning:
      'Instagram viernes: testimoniales funcionan bien viernes cuando founders revisan en sus telefonos. La cita es real (de una agencia beta que ya está usando FlorioIn según conversaciones documentadas). NO inventar — si la cita es genérica, plantearla como agregada de conversaciones múltiples.',
  },

  // ============ DOMINGO — Instagram (4th IG per "every 2 days" cadence) ============
  {
    dayOffset: 6,
    platform: 'instagram',
    content_type: 'thought_leadership',
    topic: 'Reflexión semanal founder solo desde México',
    hook: 'Cierro la semana con una verdad incómoda: construir solo es lento.',
    copy_primary: `Cierro la semana con una verdad incómoda: construir solo es lento.

Esta semana lanzamos Smart Inbox. Tres meses de trabajo. Una feature.

Si tuviera un equipo de 8 ingenieros sería en dos semanas. Pero no tengo equipo. Tengo café, Claude Code, y conversaciones con founders de agencias creativas en México que me dicen qué construir.

¿Vale la pena? Hoy creo que sí.

¿Mañana? Veremos.

Pero cada feature que sale ya está validada con personas reales. Cada línea de código defiende horas de trabajo de equipos que existen. Cada decisión la tomé yo, no un comité.

Hay belleza en eso.

Beta — link en bio.`,
    copy_variation_2: `Solo founder. Sin ronda. Sin equipo.

¿Por qué?

Porque cada feature de FlorioIn la elijo después de hablar con un founder de agencia mexicana. No por hype. No por roadmap top-down. No por presión de inversionistas.

Es lento. Es honesto. Es mío.

Y para las primeras 30 agencias beta — siento que vale la pena.`,
    copy_variation_3: `Lo más raro de construir solo desde México:

Las semanas que más siento que no avanzo son las semanas donde más aprendo.

Esta semana hablé con 12 founders de agencias. Solo escribí 200 líneas de código. Pero ahora tengo claridad sobre qué construir el próximo mes.

A veces el progreso se ve como conversaciones.

Beta — link en bio.`,
    hashtags: [
      '#solofounder',
      '#buildinpublic',
      '#startupmx',
      '#mexico',
      '#cdmx',
      '#emprendedormexicano',
      '#agenciascreativas',
      '#saas',
      '#productividad',
      '#latam',
    ],
    cta: 'Beta — link en bio',
    visual_idea:
      'Foto contemplativa: silueta del founder mirando ventana de noche, laptop iluminada de fondo. Filtro warm, sensación de fin de semana.',
    reference_links: [],
    ai_reasoning:
      'Instagram domingo noche: tono reflexivo cierra semana. Honesto sobre la dificultad de solo founder construye conexión emocional. Bueno para algoritmo (engagement por relatabilidad).',
  },

  // ============ DOMINGO — TikTok ============
  {
    dayOffset: 6,
    platform: 'tiktok',
    content_type: 'educational',
    topic: 'Explainer rápido qué es FlorioIn',
    hook: 'Si manejas una agencia creativa y no sabes qué es Smart Inbox, esto es para ti.',
    copy_primary: `Smart Inbox = un solo lugar donde caen TODOS los messages del cliente.

WhatsApp → Smart Inbox
Email → Smart Inbox
Comentarios en archivos → Smart Inbox
Llamadas grabadas → Smart Inbox

Todo en el timeline del proyecto. Sin que tu equipo copie y pegue.

Construido en México para agencias creativas latinoamericanas.

DM para acceso a la beta.`,
    copy_variation_2: `¿Por qué necesitas un workspace para tu agencia creativa?

Porque tu equipo está perdiendo HORAS coordinando approvals.

Porque tus clientes cambian de canal cuando se les da la gana.

Porque tu memoria no es base de datos.

FlorioIn resuelve eso. Hecho en México. Para agencias 5-200 personas.

DM "florioin".`,
    copy_variation_3: `Hablo con founders de agencias creativas en LATAM todo el día.

Dolor #1: "perdimos un approval entre canales".
Dolor #2: "el equipo gasta horas en coordinar feedback".
Dolor #3: "no tengo evidencia de qué decidió el cliente".

Construí FlorioIn solo para resolver eso. Smart Inbox + AI Co-Pilot + Timeline + WhatsApp Cloud API.

Beta privada. DM.`,
    hashtags: [
      '#agenciacreativa',
      '#productividad',
      '#startupmx',
      '#emprendedormexicano',
      '#saas',
    ],
    cta: 'DM para acceso',
    visual_idea:
      'Video vertical 45-60 seg: explainer en cámara con cortes visuales mostrando producto. Tono educational, no salesy. Frase de cierre fuerte: "Hecho en México".',
    reference_links: ['https://florioin.app'],
    ai_reasoning:
      'TikTok domingo tarde: educational format extiende vida del contenido. Explainer permite que personas que descubren la cuenta entiendan rápido. Domingo bajo competition.',
  },
];

/* Distribution check (mirrors v3 spec):
 *   3 LinkedIn (Mon/Wed/Fri)
 *   4 Instagram (every 2 days: Mon/Wed/Fri/Sun)
 *   2 TikTok (every 3 days: Thu/Sun)
 *   Total: 9 posts/week
 */
if (POSTS.length !== 9) {
  throw new Error(`Expected 9 content posts, got ${POSTS.length}`);
}
const counts = POSTS.reduce(
  (acc, p) => {
    acc[p.platform] = (acc[p.platform] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);
if (counts.linkedin !== 3) {
  throw new Error(`Expected 3 LinkedIn posts, got ${counts.linkedin}`);
}
if (counts.instagram !== 4) {
  throw new Error(`Expected 4 Instagram posts, got ${counts.instagram}`);
}
if (counts.tiktok !== 2) {
  throw new Error(`Expected 2 TikTok posts, got ${counts.tiktok}`);
}

export function buildContentPlan(rng: SeededRandom): SeedContentPost[] {
  const weekStart = mondayOf();
  return POSTS.map((p): SeedContentPost => {
    const scheduledDate = isoDate(addDays(weekStart, p.dayOffset));
    return {
      id: rng.uuid(),
      week_start_date: weekStart,
      scheduled_date: scheduledDate,
      platform: p.platform,
      content_type: p.content_type,
      topic: p.topic,
      hook: p.hook,
      copy_primary: p.copy_primary,
      copy_variation_2: p.copy_variation_2,
      copy_variation_3: p.copy_variation_3,
      hashtags: p.hashtags,
      cta: p.cta,
      visual_idea: p.visual_idea,
      reference_links: p.reference_links,
      ai_reasoning: p.ai_reasoning,
      status: 'planned' as ContentStatus,
      published_at: null,
      external_post_url: null,
      engagement_data: null,
      founder_notes: null,
      created_at: iso(new Date()),
      updated_at: iso(new Date()),
    };
  });
}
