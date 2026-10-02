import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { Hero } from "@/components/site/Hero";
import { ProjectList } from "@/components/site/ProjectList";
import { TechMarquee } from "@/components/site/TechMarquee";
import { TechSection } from "@/components/site/TechSection";
import { computeStats, getSiteData } from "@/lib/data/queries";

// Se regenera al guardar desde el admin (revalidatePath) y, como respaldo, cada hora.
export const revalidate = 3600;

export default async function HomePage() {
  const data = await getSiteData();
  const { profile, socials, technologies, projects } = data;
  const featured = projects.filter((p) => p.isFeatured);

  return (
    <>
      <Hero profile={profile} socials={socials} />
      <TechMarquee technologies={technologies} />
      <TechSection technologies={technologies} />
      <FeaturedProjects projects={featured} />
      <ProjectList projects={projects} />
      <About profile={profile} stats={computeStats(data)} />
      <Contact profile={profile} socials={socials} />
    </>
  );
}
