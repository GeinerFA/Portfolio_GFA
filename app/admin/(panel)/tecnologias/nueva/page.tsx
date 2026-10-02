import { PageHeader } from "@/components/admin/PageHeader";
import { TechForm } from "@/components/admin/TechForm";

export const metadata = { title: "Nueva tecnología" };

export default function NewTechnologyPage() {
  return (
    <>
      <PageHeader title="Nueva tecnología" />
      <TechForm />
    </>
  );
}
