import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getAdminTechnologies } from "@/lib/data/admin";

export const metadata = { title: "Nuevo proyecto" };

export default async function NewProjectPage() {
  const technologies = await getAdminTechnologies();
  return (
    <>
      <PageHeader title="Nuevo proyecto" description="Se crea como borrador salvo que marques «Publicado»." />
      <ProjectForm technologies={technologies} />
    </>
  );
}
