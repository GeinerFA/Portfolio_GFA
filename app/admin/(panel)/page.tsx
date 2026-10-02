import { ArrowRight, Cpu, FileEdit, Globe, Plus, Star } from "lucide-react";
import Link from "next/link";
import { PageHeader, primaryButton } from "@/components/admin/PageHeader";
import { getDashboardStats, getRecentProjects } from "@/lib/data/admin";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([getDashboardStats(), getRecentProjects()]);

  const cards = [
    { label: "Publicados", value: stats?.published ?? 0, icon: Globe, tone: "text-accent" },
    { label: "Borradores", value: stats?.drafts ?? 0, icon: FileEdit, tone: "text-amber-200" },
    { label: "Destacados", value: stats?.featured ?? 0, icon: Star, tone: "text-paper" },
    { label: "Tecnologías", value: stats?.technologies ?? 0, icon: Cpu, tone: "text-paper" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`${stats?.total ?? 0} proyectos en total.`}
        actions={
          <Link href="/admin/proyectos/nuevo" className={primaryButton}>
            <Plus className="size-4" aria-hidden />
            Nuevo proyecto
          </Link>
        }
      />

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <li key={label} className="rounded-2xl border border-line bg-ink-2/40 p-5">
            <div className="flex items-center justify-between text-sm text-muted">
              {label}
              <Icon className={`size-4 ${tone}`} aria-hidden />
            </div>
            <p className={`text-display mt-4 text-5xl tabular-nums ${tone}`}>{value}</p>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-2xl border border-line bg-ink-2/40">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-medium">Editados recientemente</h2>
          <Link href="/admin/proyectos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-paper">
            Ver todos <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">Aún no hay proyectos.</p>
        ) : (
          <ul>
            {recent.map((p) => (
              <li key={p.id} className="border-b border-line last:border-0">
                <Link href={`/admin/proyectos/${p.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-paper/5">
                  <span>{p.title}</span>
                  <span className="flex items-center gap-4 text-xs text-muted">
                    <span className={p.isPublished ? "text-accent" : "text-amber-200"}>
                      {p.isPublished ? "Publicado" : "Borrador"}
                    </span>
                    <time dateTime={p.updatedAt}>
                      {new Date(p.updatedAt).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
