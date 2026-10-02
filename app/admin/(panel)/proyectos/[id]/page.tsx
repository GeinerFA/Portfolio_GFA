import { CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteProjectButton } from "@/components/admin/ProjectRowActions";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getAdminProject, getAdminTechnologies } from "@/lib/data/admin";

export const metadata = { title: "Editar proyecto" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ creado?: string }> };

export default async function EditProjectPage({ params, searchParams }: Props) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) notFound();

  const [project, technologies, { creado }] = await Promise.all([
    getAdminProject(projectId),
    getAdminTechnologies(),
    searchParams,
  ]);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        description={`/${project.slug}`}
        actions={
          <>
            {project.isPublished && (
              <Link
                href={`/proyectos/${project.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:bg-paper/5"
              >
                <ExternalLink className="size-4" aria-hidden />
                Ver en el sitio
              </Link>
            )}
            <DeleteProjectButton id={project.id} title={project.title} redirectTo="/admin/proyectos" />
          </>
        }
      />
      {creado && (
        <p className="mb-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          <CheckCircle2 className="size-4" aria-hidden />
          Proyecto creado. Puedes seguir editándolo.
        </p>
      )}
      <ProjectForm key={project.id} project={project} technologies={technologies} uploadEnabled={isCloudinaryConfigured()} />
    </>
  );
}
