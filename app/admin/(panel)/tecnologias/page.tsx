import { CheckCircle2, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader, primaryButton } from "@/components/admin/PageHeader";
import { DeleteTechButton } from "@/components/admin/DeleteTechButton";
import { TechIcon } from "@/components/site/TechIcon";
import { getAdminTechnologies } from "@/lib/data/admin";
import { TECH_CATEGORY_LABELS } from "@/lib/data/types";

export const metadata = { title: "Tecnologías" };

type Props = { searchParams: Promise<{ creada?: string }> };

export default async function AdminTechnologiesPage({ searchParams }: Props) {
  const [technologies, { creada }] = await Promise.all([getAdminTechnologies(), searchParams]);

  return (
    <>
      <PageHeader
        title="Tecnologías"
        description="Aparecen en el marquee, en la sección Tecnologías y como filtros de proyectos."
        actions={
          <Link href="/admin/tecnologias/nueva" className={primaryButton}>
            <Plus className="size-4" aria-hidden />
            Nueva tecnología
          </Link>
        }
      />

      {creada && (
        <p className="mb-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          <CheckCircle2 className="size-4" aria-hidden />
          Tecnología creada.
        </p>
      )}

      {technologies.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">Aún no hay tecnologías.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line bg-ink-2/60 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Tecnología</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Color</th>
                <th className="px-4 py-3 font-medium">Proyectos</th>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {technologies.map((t) => (
                <tr key={t.id} className="border-b border-line last:border-0 hover:bg-paper/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg border border-line" style={{ color: t.color ?? undefined }}>
                        <TechIcon name={t.name} icon={t.icon} className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="font-mono text-xs text-muted">{t.icon || "sin ícono"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-paper/80">{TECH_CATEGORY_LABELS[t.category]}</td>
                  <td className="px-4 py-3">
                    {t.color ? (
                      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase">
                        <span className="size-3.5 rounded-full border border-line" style={{ background: t.color }} />
                        {t.color}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{t.projectCount}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{t.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/tecnologias/${t.id}`}
                        className="rounded-lg p-2 text-muted hover:bg-paper/10 hover:text-paper"
                        aria-label={`Editar ${t.name}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteTechButton id={t.id} name={t.name} projectCount={t.projectCount} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
