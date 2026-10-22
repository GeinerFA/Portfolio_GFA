import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { BackToTop } from "@/components/site/BackToTop";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ServiceWorker } from "@/components/site/ServiceWorker";
import type { Metadata } from "next";
import { getSiteData } from "@/lib/data/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  const title = `${profile.fullName} — ${profile.role}`;
  const description = profile.headline ?? profile.bio?.slice(0, 160) ?? `Portafolio de ${profile.fullName}.`;
  return {
    title: { default: title, template: `%s — ${profile.fullName}` },
    description,
    authors: [{ name: profile.fullName }],
    alternates: { canonical: "/" },
    openGraph: { type: "website", locale: "es_ES", siteName: profile.fullName, title, description, url: "/" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { profile, socials } = await getSiteData();

  return (
    <SmoothScroll>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Saltar al contenido
      </a>
      <Navbar name={profile.fullName} cvUrl={profile.cvUrl} />
      <main id="contenido">{children}</main>
      <Footer profile={profile} socials={socials} />
      <BackToTop />
      <ServiceWorker />
    </SmoothScroll>
  );
}
