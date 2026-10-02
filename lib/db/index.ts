import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as relations from "./relations";
import * as schema from "./schema";

/**
 * Tag de caché de todas las consultas. El driver HTTP de Neon usa fetch, y Next guarda esas respuestas
 * en su Data Cache cuando la página es estática (ISR). Las Server Actions del admin llaman a
 * updateTag(DB_CACHE_TAG) al guardar, así el sitio nunca sirve datos viejos tras un cambio.
 * (Las páginas del admin son force-dynamic: siempre leen datos frescos.)
 */
export const DB_CACHE_TAG = "db";

function createDb(url: string) {
  const client = neon(url, { fetchOptions: { next: { tags: [DB_CACHE_TAG] } } });
  return drizzle({ client, schema: { ...schema, ...relations } });
}

export type Database = ReturnType<typeof createDb>;

/** Cliente de Drizzle sobre el driver HTTP de Neon. Es `null` si no hay DATABASE_URL válida. */
export const db: Database | null = env.databaseUrl ? createDb(env.databaseUrl) : null;

export { schema };
