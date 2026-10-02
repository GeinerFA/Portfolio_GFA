import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { toDownloadUrl } from "@/lib/utils";
import { profile, projects, socialLinks, technologies } from "@/lib/db/schema";
import { defaultProfile } from "./defaults";
import { toProfile, toProject, toSocial, toTechnology } from "./mappers";
import type { Profile, SiteData } from "./types";

const withDownloadableCv = (p: Profile): Profile => ({ ...p, cvUrl: p.cvUrl ? toDownloadUrl(p.cvUrl) : null });

/** Lee los datos públicos desde Neon (solo proyectos publicados y redes visibles). */
export async function loadSiteData(): Promise<SiteData> {
  if (!db) throw new Error("Base de datos no configurada");

  const [profileRows, socialRows, techRows, projectRows] = await Promise.all([
    db.select().from(profile).where(eq(profile.id, 1)).limit(1),
    db.select().from(socialLinks).where(eq(socialLinks.isVisible, true)).orderBy(asc(socialLinks.sortOrder)),
    db.select().from(technologies).orderBy(asc(technologies.sortOrder), asc(technologies.name)),
    db.query.projects.findMany({
      where: eq(projects.isPublished, true),
      orderBy: [asc(projects.sortOrder), desc(projects.year)],
      with: { projectTechnologies: { with: { technology: true } } },
    }),
  ]);

  const projectList = projectRows.map((row) =>
    toProject(
      row,
      row.projectTechnologies.map((pt) => pt.technology),
    ),
  );

  // Conteo de proyectos publicados por tecnología.
  const usage = new Map<number, number>();
  for (const p of projectList) for (const t of p.technologies) usage.set(t.id, (usage.get(t.id) ?? 0) + 1);

  return {
    profile: withDownloadableCv(profileRows[0] ? toProfile(profileRows[0]) : defaultProfile),
    socials: socialRows.filter((s) => s.url.trim()).map(toSocial),
    technologies: techRows.map((t) => ({ ...toTechnology(t), projectCount: usage.get(t.id) ?? 0 })),
    projects: projectList,
  };
}
