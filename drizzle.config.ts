import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida. Agrégala a .env.local antes de usar drizzle-kit.");
}

// Solo se usa `drizzle-kit pull` (introspección). La base ya existe: NO usar `push` ni `migrate`.
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle", // salida de pull (no versionada): copiar cambios a lib/db/schema.ts tras revisarlos
  dbCredentials: { url: process.env.DATABASE_URL },
  tablesFilter: ["profile", "social_links", "technologies", "projects", "project_technologies"],
});
