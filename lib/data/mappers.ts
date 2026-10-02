import { sitePreviewPath } from "@/lib/preview";
import type { projects, profile, socialLinks, technologies } from "@/lib/db/schema";
import type { Profile, Project, SocialLink, Technology } from "./types";

type ProfileRow = typeof profile.$inferSelect;
type SocialRow = typeof socialLinks.$inferSelect;
type TechRow = typeof technologies.$inferSelect;
type ProjectRow = typeof projects.$inferSelect;

const blankToNull = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null);

export function toProfile(row: ProfileRow): Profile {
  return {
    fullName: row.fullName,
    role: row.role,
    headline: blankToNull(row.headline),
    bio: blankToNull(row.bio),
    email: blankToNull(row.email),
    location: blankToNull(row.location),
    avatarUrl: blankToNull(row.avatarUrl),
    cvUrl: blankToNull(row.cvUrl),
    isAvailable: row.isAvailable,
  };
}

export function toSocial(row: SocialRow): SocialLink {
  return { ...row };
}

export function toTechnology(row: TechRow): Technology {
  return { ...row, icon: blankToNull(row.icon), color: blankToNull(row.color) };
}

export function toProject(row: ProjectRow, techs: TechRow[]): Project {
  const liveUrl = blankToNull(row.liveUrl);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    coverUrl: blankToNull(row.coverUrl),
    previewVideoUrl: blankToNull(row.previewVideoUrl),
    gallery: Array.isArray(row.gallery) ? row.gallery.filter((u): u is string => typeof u === "string" && !!u.trim()) : [],
    repoUrl: blankToNull(row.repoUrl),
    liveUrl,
    sitePreviewUrl: liveUrl && /^https?:\/\//i.test(liveUrl) ? sitePreviewPath(row.slug) : null,
    year: row.year,
    accentColor: row.accentColor,
    isFeatured: row.isFeatured,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
    technologies: techs.map(toTechnology).sort((a, b) => a.sortOrder - b.sortOrder),
  };
}
