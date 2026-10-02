import { PageHeader } from "@/components/admin/PageHeader";
import { SocialsForm } from "@/components/admin/SocialsForm";
import { getAdminSocials } from "@/lib/data/admin";
import { SOCIAL_PLATFORMS } from "@/lib/db/schema";

export const metadata = { title: "Redes sociales" };

export default async function AdminSocialsPage() {
  const socials = await getAdminSocials();
  return (
    <>
      <PageHeader
        title="Redes sociales"
        description="Se muestran en el Hero y en Contacto. Una red sin URL o no visible se oculta."
      />
      <SocialsForm socials={socials} platforms={SOCIAL_PLATFORMS} />
    </>
  );
}
