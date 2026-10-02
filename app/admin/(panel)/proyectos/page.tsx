import { ExternalLink, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader, primaryButton } from "@/components/admin/PageHeader";
import { DeleteProjectButton, MoveButtons, ToggleButtons } from "@/components/admin/ProjectRowActions";
import { accentOf } from "@/lib/color";
import { getAdminProjects } from "@/lib/data/admin";

export const metadata = { title: "Proyectos" };

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <>
      <PageHeader
        title="Proyectos"
        description="Ordena con las flechas; el orden se refleja en el sitio."
        actions={
          <Link href="/admin/proyectos/nuevo" className={primaryButton}>
            <Plus className="size-4" aria-hidden />
            Nuevo proyecto
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="text-muted">Aún no hay proyectos.</p>
          <Link href="/admin/proyectos/nuevo" className={`${primaryButton} mt-6`}>
            <Plus className="size-4" aria-hidden />
            Crear el primero
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((p, i) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-ink-2/40 p-3 pr-4 md:flex-nowrap"
            >
              <MoveButtons id={p.id} isFirst={i === 0} isLast={i === projects.length - 1} />
              <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: accentOf(p.accentColor) }} />
              <div className="min-w-0 flex-1">
                <Link href={`/admin/proyectos/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <p className="truncate font-mono text-xs text-muted">
                  /{p.slug} · {p.year} · {p.technologies.length} tecnologías
                </p>
              </div>
              <ToggleButtons id={p.id} isPublished={p.isPublished} isFeatured={p.isFeatured} />
              <div className="flex items-center gap-1">
                {p.isPublished && (
                  <Link
                    href={`/proyectos/${p.slug}`}
                    target="_blank"
                    className="rounded-lg p-2 text-muted hover:bg-paper/10 hover:text-paper"
                    aria-label={`Ver ${p.title} en el sitio`}
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                )}
                <Link
                  href={`/admin/proyectos/${p.id}`}
                  className="rounded-lg p-2 text-muted hover:bg-paper/10 hover:text-paper"
                  aria-label={`Editar ${p.title}`}
                >
                  <Pencil className="size-4" />
                </Link>
                <DeleteProjectButton id={p.id} title={p.title} compact />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
