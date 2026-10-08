/**
 * Trayectoria, formación y servicios (contenido estático).
 * La base de datos no tiene tablas para esto, así que se edita aquí directamente.
 */

export type TimelineEntry = {
  kind: "trabajo" | "estudio";
  title: string;
  org: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights: string[];
};

/** Año en que empezó tu experiencia laboral (para la estadística "Años de experiencia"). */
export const CAREER_START_YEAR = 2019;

export const timeline: TimelineEntry[] = [
  {
    kind: "trabajo",
    title: "Técnico y Analista de Datos I",
    org: "Caja Costarricense de Seguro Social (CCSS)",
    period: "Abr 2026 — Actualidad",
    current: true,
    summary:
      "Soporte y asistencia técnica en el área de Tecnologías de Información para asegurar que equipos, sistemas y servicios institucionales funcionen sin interrupciones.",
    highlights: [
      "Soporte técnico presencial y remoto a usuarios institucionales.",
      "Diagnóstico y resolución de incidentes de software y hardware.",
      "Administración de usuarios, perfiles, permisos y accesos a sistemas.",
      "Configuración y soporte de certificados y firma digital.",
      "Registro, seguimiento y documentación de incidencias en la Mesa de Servicio.",
    ],
  },
  {
    kind: "estudio",
    title: "Bachillerato en Ingeniería Informática",
    org: "Universidad Castro Carazo",
    period: "2026",
    summary:
      "Formación en análisis, diseño, desarrollo e implementación de soluciones informáticas.",
    highlights: [
      "Ingeniería de software y análisis de requerimientos.",
      "Desarrollo web Frontend y Backend.",
      "Diseño y administración de bases de datos.",
      "Redes, sistemas operativos y seguridad informática.",
      "Auditoría de TI y gestión de proyectos tecnológicos.",
    ],
  },
  {
    kind: "trabajo",
    title: "Asistente Técnico de Atención Primaria (ATAP)",
    org: "Caja Costarricense de Seguro Social (CCSS)",
    period: "May 2019 — Abr 2026",
    summary:
      "Siete años en el sector salud gestionando información institucional, atendiendo usuarios y coordinando procesos con equipos multidisciplinarios.",
    highlights: [
      "Registro, actualización y sistematización de información institucional.",
      "Elaboración y seguimiento de reportes.",
      "Coordinación de actividades con equipos multidisciplinarios.",
      "Manejo responsable y confidencial de información.",
    ],
  },
];

export type Service = { title: string; description: string; tags: string[] };

export const services: Service[] = [
  {
    title: "Desarrollo web Full Stack",
    description:
      "Sitios y aplicaciones web rápidos, accesibles y fáciles de mantener, desde el diseño de la interfaz hasta la base de datos.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
  },
  {
    title: "Paneles administrativos",
    description:
      "Sistemas privados para gestionar contenido, usuarios, roles y permisos, con autenticación segura y registro de actividad.",
    tags: ["Auth.js", "Google OAuth", "Roles", "Auditoría"],
  },
  {
    title: "Bases de datos y despliegue",
    description:
      "Modelado de datos, migraciones y puesta en producción: dominios, DNS, variables de entorno y correo empresarial.",
    tags: ["PostgreSQL", "MongoDB", "Vercel", "Google Workspace"],
  },
  {
    title: "Soporte e infraestructura TI",
    description:
      "Diagnóstico y resolución de incidencias, administración de accesos, mantenimiento de equipos y soporte a usuarios.",
    tags: ["Mesa de servicio", "Accesos", "Firma digital", "Redes"],
  },
];
