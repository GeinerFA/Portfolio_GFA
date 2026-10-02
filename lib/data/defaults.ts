import type { Profile, TechCategory, Project, SiteData, SocialLink, Technology, TechnologyWithCount } from "./types";

/** Datos de respaldo cuando DATABASE_URL no existe o la base no responde. */

export const defaultProfile: Profile = {
  fullName: "Tu Nombre",
  role: "Desarrollador Full Stack",
  headline: "Diseño y construyo productos digitales rápidos, accesibles y con atención al detalle.",
  bio: "Soy desarrollador enfocado en crear experiencias web modernas. Me gusta convertir ideas en productos reales, cuidando el rendimiento, la accesibilidad y cada interacción. Trabajo de punta a punta: desde la base de datos hasta la última animación.",
  email: "hola@ejemplo.com",
  location: "Costa Rica",
  avatarUrl: null,
  cvUrl: null,
  isAvailable: true,
};

export const defaultSocials: SocialLink[] = [
  { id: 1, platform: "github", url: "https://github.com", label: "GitHub", sortOrder: 1, isVisible: true },
  { id: 2, platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn", sortOrder: 2, isVisible: true },
  { id: 3, platform: "instagram", url: "https://instagram.com", label: "Instagram", sortOrder: 3, isVisible: true },
  { id: 4, platform: "whatsapp", url: "https://wa.me/50600000000", label: "WhatsApp", sortOrder: 4, isVisible: true },
];

const tech = (
  id: number,
  name: string,
  slug: string,
  category: TechCategory,
  icon: string,
  color: string,
  sortOrder: number,
): Technology => ({ id, name, slug, category, icon, color, sortOrder });

const t = {
  next: tech(1, "Next.js", "nextjs", "frontend", "SiNextdotjs", "#ffffff", 1),
  react: tech(2, "React", "react", "frontend", "SiReact", "#61dafb", 2),
  ts: tech(3, "TypeScript", "typescript", "frontend", "SiTypescript", "#3178c6", 3),
  tailwind: tech(4, "Tailwind CSS", "tailwind-css", "frontend", "SiTailwindcss", "#38bdf8", 4),
  node: tech(5, "Node.js", "nodejs", "backend", "SiNodedotjs", "#5fa04e", 5),
  postgres: tech(6, "PostgreSQL", "postgresql", "base_de_datos", "SiPostgresql", "#4169e1", 6),
  figma: tech(7, "Figma", "figma", "herramientas", "SiFigma", "#f24e1e", 7),
};

export const defaultProjects: Project[] = [
  {
    id: 1,
    slug: "proyecto-ejemplo-uno",
    title: "Proyecto Uno",
    summary: "Plataforma web con panel administrativo y contenido dinámico.",
    description:
      "Este es un proyecto de ejemplo. Conecta tu base de datos de Neon para mostrar tus proyectos reales.\n\nDesde el panel administrativo puedes crear, editar, ordenar y publicar proyectos.",
    coverUrl: null,
    previewVideoUrl: null,
    gallery: [],
    repoUrl: "https://github.com",
    liveUrl: "https://vercel.com",
    year: 2026,
    accentColor: "#c6ff3d",
    isFeatured: true,
    isPublished: true,
    sortOrder: 1,
    technologies: [t.next, t.ts, t.tailwind, t.postgres],
  },
  {
    id: 2,
    slug: "proyecto-ejemplo-dos",
    title: "Proyecto Dos",
    summary: "Aplicación con API propia y autenticación.",
    description: "Proyecto de ejemplo para mostrar el diseño del portafolio.",
    coverUrl: null,
    previewVideoUrl: null,
    gallery: [],
    repoUrl: "https://github.com",
    liveUrl: null,
    year: 2025,
    accentColor: "#7c5cff",
    isFeatured: true,
    isPublished: true,
    sortOrder: 2,
    technologies: [t.react, t.node, t.postgres],
  },
  {
    id: 3,
    slug: "proyecto-ejemplo-tres",
    title: "Proyecto Tres",
    summary: "Sistema de diseño y sitio de marketing.",
    description: "Proyecto de ejemplo para mostrar el diseño del portafolio.",
    coverUrl: null,
    previewVideoUrl: null,
    gallery: [],
    repoUrl: null,
    liveUrl: "https://vercel.com",
    year: 2024,
    accentColor: "#ff6b3d",
    isFeatured: false,
    isPublished: true,
    sortOrder: 3,
    technologies: [t.figma, t.next, t.tailwind],
  },
];

export const defaultTechnologies: TechnologyWithCount[] = Object.values(t).map((tech) => ({
  ...tech,
  projectCount: defaultProjects.filter((p) => p.technologies.some((pt) => pt.id === tech.id)).length,
}));

export const defaultSiteData: SiteData = {
  profile: defaultProfile,
  socials: defaultSocials,
  technologies: defaultTechnologies,
  projects: defaultProjects,
};
