import "server-only";

function readDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return undefined;
  if (!/^postgres(ql)?:\/\//.test(url)) {
    console.warn(
      "[env] DATABASE_URL no es una cadena de conexión de Postgres (debe empezar con postgresql://). Se usarán datos por defecto.",
    );
    return undefined;
  }
  return url;
}

/** Lectura centralizada de variables de entorno del servidor. */
export const env = {
  databaseUrl: readDatabaseUrl(),
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() || undefined,
  authConfigured: Boolean(
    process.env.AUTH_SECRET && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  ),
};

export const hasDatabase = Boolean(env.databaseUrl);
