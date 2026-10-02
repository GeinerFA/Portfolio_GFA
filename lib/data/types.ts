/** Tipos de dominio usados por la UI. Independientes del schema de Drizzle. */

import type { SOCIAL_PLATFORMS, TECH_CATEGORIES } from "@/lib/db/schema";

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type TechCategory = (typeof TECH_CATEGORIES)[number];

export const TECH_CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  base_de_datos: "Base de datos",
  devops: "DevOps",
  herramientas: "Herramientas",
  otros: "Otros",
};

export interface Profile {
  fullName: string;
  role: string;
  headline: string | null;
  bio: string | null;
  email: string | null;
  location: string | null;
  avatarUrl: string | null;
  cvUrl: string | null;
  isAvailable: boolean;
}

export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  url: string;
  label: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export interface Technology {
  id: number;
  name: string;
  slug: string;
  category: TechCategory;
  icon: string | null;
  color: string | null;
  sortOrder: number;
}

export interface TechnologyWithCount extends Technology {
  projectCount: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverUrl: string | null;
  previewVideoUrl: string | null;
  gallery: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  /** Captura automática de la home de liveUrl (calculada, no se guarda en la base). */
  sitePreviewUrl: string | null;
  year: number;
  accentColor: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  technologies: Technology[];
}

export interface SiteData {
  profile: Profile;
  socials: SocialLink[];
  technologies: TechnologyWithCount[];
  projects: Project[];
}
