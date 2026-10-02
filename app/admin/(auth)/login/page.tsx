import { ShieldX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";
import { signInWithGoogle } from "@/lib/actions/auth";
import { getAdminStatus } from "@/lib/auth-guard";
import { env } from "@/lib/env";

export const metadata = { title: "Iniciar sesión" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const status = await getAdminStatus();
  if (status.state === "admin") redirect("/admin");

  const { error } = await searchParams;
  const denied = error === "AccessDenied" || status.state === "denied";

  return (
    <main className="container-x flex min-h-svh items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-display text-2xl">
          Admin<span className="text-accent">.</span>
        </Link>

        {denied ? (
          <div className="mt-10 rounded-2xl border border-red-400/30 bg-red-400/5 p-6">
            <ShieldX className="size-8 text-red-400" aria-hidden />
            <h1 className="mt-4 text-2xl font-medium">Acceso denegado</h1>
            <p className="mt-2 text-sm text-muted">
              Esta cuenta de Google no tiene permiso para entrar al panel. Inicia sesión con el correo autorizado.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-display mt-10 text-5xl">Iniciar sesión</h1>
            <p className="mt-3 text-sm text-muted">Acceso exclusivo para el administrador del portafolio.</p>
            {error && (
              <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                No se pudo iniciar sesión ({error}). Inténtalo de nuevo.
              </p>
            )}
          </>
        )}

        {env.authConfigured ? (
          <form action={signInWithGoogle} className="mt-8">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-paper px-5 py-3 font-medium text-ink transition-colors hover:bg-accent"
            >
              <FaGoogle className="size-4" aria-hidden />
              {denied ? "Usar otra cuenta de Google" : "Continuar con Google"}
            </button>
          </form>
        ) : (
          <p className="mt-8 rounded-xl border border-line p-4 text-sm text-muted">
            Faltan variables de entorno de Auth.js (AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET).
          </p>
        )}

        <Link href="/" className="mt-6 block text-center text-sm text-muted hover:text-paper">
          ← Volver al sitio
        </Link>
      </div>
    </main>
  );
}
