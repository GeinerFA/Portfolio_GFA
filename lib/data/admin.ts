import "server-only";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import { requireAdminPage } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { profile, projectTechnologies, projects, socialLinks, technologies } from "@/lib/db/schema";
import { defaultProfile } from "./defaults";
import { toProfile, toProject, toTechnology } from "./mappers";
import type { Profile, Project, SocialLink, TechnologyWithCount } from "./types";

/**
 * Lecturas del panel. Cada función valida al admin (o redirige al login): los layouts y las páginas se renderizan en paralelo,
 * así que la validación del layout no basta para proteger los datos.
 */

export async function getDashboardStats() {
  await requireAdminPage();
  if (!db) return null;
  const [row] = await db
    .select({
      total: count(),
      published: sql<number>`count(*) filter (where ${projects.isPublished})::int`,
      featured: sql<number>`count(*) filter (where ${projects.isFeatured})::int`,
    })
    .from(projects);
  const [techs] = await db.select({ total: count() }).from(technologies);
  const total = row?.total ?? 0;
  const published = row?.published ?? 0;
  return { total, published, drafts: total - published, featured: row?.featured ?? 0, technologies: techs?.total ?? 0 };
}

export async function getAdminProjects(): Promise<Project[]> {
  await requireAdminPage();
  if (!db) return [];
  const rows = await db.query.projects.findMany({
    orderBy: [asc(projects.sortOrder), asc(projects.id)],
    with: { projectTechnologies: { with: { technology: true } } },
  });
  return rows.map((row) => toProject(row, row.projectTechnologies.map((pt) => pt.technology)));
}

export async function getAdminProject(id: number): Promise<Project | null> {
  await requireAdminPage();
  if (!db) return null;
  const row = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { projectTechnologies: { with: { technology: true } } },
  });
  return row ? toProject(row, row.projectTechnologies.map((pt) => pt.technology)) : null;
}

export async function getAdminTechnologies(): Promise<TechnologyWithCount[]> {
  await requireAdminPage();
  if (!db) return [];
  const rows = await db
    .select({ tech: technologies, projectCount: sql<number>`count(${projectTechnologies.projectId})::int` })
    .from(technologies)
    .leftJoin(projectTechnologies, eq(projectTechnologies.technologyId, technologies.id))
    .groupBy(technologies.id)
    .orderBy(asc(technologies.sortOrder), asc(technologies.name));
  return rows.map((r) => ({ ...toTechnology(r.tech), projectCount: r.projectCount }));
}

export async function getAdminProfile(): Promise<Profile> {
  await requireAdminPage();
  if (!db) return defaultProfile;
  const [row] = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
  return row ? toProfile(row) : defaultProfile;
}

export async function getAdminSocials(): Promise<SocialLink[]> {
  await requireAdminPage();
  if (!db) return [];
  return db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
}

export async function getRecentProjects(limit = 5) {
  await requireAdminPage();
  if (!db) return [];
  return db
    .select({ id: projects.id, title: projects.title, isPublished: projects.isPublished, updatedAt: projects.updatedAt })
    .from(projects)
    .orderBy(desc(projects.updatedAt))
    .limit(limit);
}
