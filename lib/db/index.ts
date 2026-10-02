import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as relations from "./relations";
import * as schema from "./schema";

function createDb(url: string) {
  return drizzle({ client: neon(url), schema: { ...schema, ...relations } });
}

export type Database = ReturnType<typeof createDb>;

/** Cliente de Drizzle sobre el driver HTTP de Neon. Es `null` si no hay DATABASE_URL válida. */
export const db: Database | null = env.databaseUrl ? createDb(env.databaseUrl) : null;

export { schema };
