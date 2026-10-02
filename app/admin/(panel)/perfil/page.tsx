import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { getAdminProfile } from "@/lib/data/admin";

export const metadata = { title: "Perfil" };

export default async function AdminProfilePage() {
  const profile = await getAdminProfile();
  return (
    <>
      <PageHeader title="Perfil" description="Datos que aparecen en el Hero, Sobre mí, Contacto y SEO." />
      <ProfileForm profile={profile} />
    </>
  );
}
