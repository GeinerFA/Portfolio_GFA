import "server-only";
import { cache } from "react";
import { hasDatabase } from "@/lib/env";
import { defaultSiteData } from "./defaults";
import { loadSiteData } from "./load";
import type { Project, SiteData } from "./types";

/**
 * Datos públicos del sitio. Si no hay base de datos (o falla), devuelve los datos por defecto
 * para que el sitio nunca se rompa. `cache` evita consultas duplicadas en un mismo render.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  if (!hasDatabase) return defaultSiteData;
  try {
    return await loadSiteData();
  } catch (error) {
    const reason = error instanceof Error ? (error.cause instanceof Error ? error.cause.message : error.message) : String(error);
    console.error(`[data] No se pudo leer la base de datos; usando datos por defecto. Motivo: ${reason}`);
    return defaultSiteData;
  }
});

export async function getProjectBySlug(
  slug: string,
): Promise<{ project: Project; next: Project | null } | null> {
  const { projects } = await getSiteData();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) return null;
  const next = projects.length > 1 ? (projects[(index + 1) % projects.length] ?? null) : null;
  return { project, next };
}

export function computeStats(data: SiteData) {
  const years = data.projects.map((p) => p.year).filter((y): y is number => typeof y === "number");
  const firstYear = years.length ? Math.min(...years) : new Date().getFullYear();
  return {
    projects: data.projects.length,
    technologies: data.technologies.length,
    years: Math.max(1, new Date().getFullYear() - firstYear + 1),
  };
}
