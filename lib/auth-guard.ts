import "server-only";
import { redirect } from "next/navigation";
import { auth, isAdminEmail } from "@/lib/auth";

export type AdminStatus =
  | { state: "anonymous" }
  | { state: "denied"; email: string | null }
  | { state: "admin"; email: string; name: string | null; image: string | null };

/** Estado de acceso para el layout del admin (no lanza errores). */
export async function getAdminStatus(): Promise<AdminStatus> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!session?.user) return { state: "anonymous" };
  if (!email || !isAdminEmail(email)) return { state: "denied", email };
  return { state: "admin", email, name: session.user.name ?? null, image: session.user.image ?? null };
}

export class UnauthorizedError extends Error {
  constructor() {
    super("No autorizado");
    this.name = "UnauthorizedError";
  }
}

/** Uso obligatorio al inicio de cada Server Action del admin. */
export async function requireAdmin(): Promise<string> {
  const status = await getAdminStatus();
  if (status.state !== "admin") throw new UnauthorizedError();
  return status.email;
}

/** Para lecturas en páginas del admin: si no es el admin, redirige al login (que muestra "Acceso denegado"). */
export async function requireAdminPage(): Promise<string> {
  const status = await getAdminStatus();
  if (status.state !== "admin") redirect("/admin/login");
  return status.email;
}
