/**
 * Schema generado con `drizzle-kit pull` a partir de la base existente en Neon y revisado a mano:
 * - `.default('')` corregido (pull lo genera con un bug de comillas)
 * - `gallery` tipado como string[]; `platform` y `category` tipados según sus CHECK
 * - eliminados los `.op("int4_ops")` incorrectos de los índices
 *
 * La base ya existe: NO usar `drizzle-kit push` ni `migrate` sobre este schema.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const SOCIAL_PLATFORMS = ["instagram", "whatsapp", "github", "linkedin"] as const;
export const TECH_CATEGORIES = ["frontend", "backend", "base_de_datos", "devops", "herramientas", "otros"] as const;

export const socialLinks = pgTable(
  "social_links",
  {
    id: serial().primaryKey().notNull(),
    platform: text({ enum: SOCIAL_PLATFORMS }).notNull(),
    url: text().notNull(),
    label: text(),
    sortOrder: integer("sort_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
  },
  (table) => [
    unique("social_links_platform_key").on(table.platform),
    check(
      "social_links_platform_check",
      sql`platform = ANY (ARRAY['instagram'::text, 'whatsapp'::text, 'github'::text, 'linkedin'::text])`,
    ),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: serial().primaryKey().notNull(),
    slug: text().notNull(),
    title: text().notNull(),
    summary: text().default("").notNull(),
    description: text().default("").notNull(),
    coverUrl: text("cover_url"),
    previewVideoUrl: text("preview_video_url"),
    gallery: jsonb().$type<string[]>().default([]).notNull(),
    repoUrl: text("repo_url"),
    liveUrl: text("live_url"),
    year: smallint().default(sql`(EXTRACT(year FROM now()))`).notNull(),
    accentColor: text("accent_color").default("#c8ff3d").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    // Lo actualiza el trigger trg_projects_updated.
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_projects_public").using("btree", table.isPublished.asc().nullsLast(), table.sortOrder.asc().nullsLast()),
    unique("projects_slug_key").on(table.slug),
  ],
);

export const technologies = pgTable(
  "technologies",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    category: text({ enum: TECH_CATEGORIES }).default("otros").notNull(),
    icon: text(),
    color: text(),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [
    unique("technologies_name_key").on(table.name),
    unique("technologies_slug_key").on(table.slug),
    check(
      "technologies_category_check",
      sql`category = ANY (ARRAY['frontend'::text, 'backend'::text, 'base_de_datos'::text, 'devops'::text, 'herramientas'::text, 'otros'::text])`,
    ),
  ],
);

export const profile = pgTable(
  "profile",
  {
    id: smallint().default(1).primaryKey().notNull(),
    fullName: text("full_name").notNull(),
    role: text().notNull(),
    headline: text(),
    bio: text(),
    email: text(),
    location: text(),
    avatarUrl: text("avatar_url"),
    cvUrl: text("cv_url"),
    isAvailable: boolean("is_available").default(true).notNull(),
    // Lo actualiza el trigger trg_profile_updated.
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  () => [check("profile_id_check", sql`id = 1`)],
);

export const projectTechnologies = pgTable(
  "project_technologies",
  {
    projectId: integer("project_id").notNull(),
    technologyId: integer("technology_id").notNull(),
  },
  (table) => [
    index("idx_pt_technology").using("btree", table.technologyId.asc().nullsLast()),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "project_technologies_project_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.technologyId],
      foreignColumns: [technologies.id],
      name: "project_technologies_technology_id_fkey",
    }).onDelete("cascade"),
    primaryKey({ columns: [table.technologyId, table.projectId], name: "project_technologies_pkey" }),
  ],
);
