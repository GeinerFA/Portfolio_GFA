import { DatabaseZap, ShieldX } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOutAction } from "@/lib/actions/auth";
import { getAdminStatus } from "@/lib/auth-guard";
import { hasDatabase } from "@/lib/env";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const status = await getAdminStatus();

  if (status.state === "anonymous") redirect("/admin/login");

  if (status.state === "denied") {
    return (
      <main className="container-x flex min-h-svh items-center justify-center">
        <div className="max-w-sm text-center">
          <ShieldX className="mx-auto size-10 text-red-400" aria-hidden />
          <h1 className="text-display mt-6 text-5xl">Acceso denegado</h1>
          <p className="mt-3 text-sm text-muted">
            {status.email ?? "Esta cuenta"} no tiene permiso para entrar al panel.
          </p>
          <form action={signOutAction} className="mt-8">
            <button type="submit" className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-accent">
              Cerrar sesión
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr]">
      <AdminNav email={status.email} name={status.name} image={status.image} signOut={signOutAction} />
      <div className="min-w-0">
        {!hasDatabase && (
          <div className="flex items-center gap-3 border-b border-amber-300/30 bg-amber-300/10 px-6 py-3 text-sm text-amber-200">
            <DatabaseZap className="size-4 shrink-0" aria-hidden />
            Base de datos no configurada: define una DATABASE_URL válida (postgresql://…). Los cambios no se pueden guardar.
          </div>
        )}
        <main className="px-4 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
