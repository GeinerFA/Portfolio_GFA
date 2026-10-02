import { notFound } from "next/navigation";
import { DeleteTechButton } from "@/components/admin/DeleteTechButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { TechForm } from "@/components/admin/TechForm";
import { getAdminTechnologies } from "@/lib/data/admin";

export const metadata = { title: "Editar tecnología" };

type Props = { params: Promise<{ id: string }> };

export default async function EditTechnologyPage({ params }: Props) {
  const { id } = await params;
  const techId = Number(id);
  if (!Number.isInteger(techId) || techId <= 0) notFound();

  const technology = (await getAdminTechnologies()).find((t) => t.id === techId);
  if (!technology) notFound();

  return (
    <>
      <PageHeader
        title={technology.name}
        description={`Usada en ${technology.projectCount} ${technology.projectCount === 1 ? "proyecto" : "proyectos"}.`}
        actions={
          <DeleteTechButton
            id={technology.id}
            name={technology.name}
            projectCount={technology.projectCount}
            redirectTo="/admin/tecnologias"
          />
        }
      />
      <TechForm key={technology.id} technology={technology} />
    </>
  );
}
