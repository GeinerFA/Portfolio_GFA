// Generado con `drizzle-kit pull`.
import { relations } from "drizzle-orm/relations";
import { projectTechnologies, projects, technologies } from "./schema";

export const projectTechnologiesRelations = relations(projectTechnologies, ({ one }) => ({
  project: one(projects, {
    fields: [projectTechnologies.projectId],
    references: [projects.id],
  }),
  technology: one(technologies, {
    fields: [projectTechnologies.technologyId],
    references: [technologies.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  projectTechnologies: many(projectTechnologies),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  projectTechnologies: many(projectTechnologies),
}));
