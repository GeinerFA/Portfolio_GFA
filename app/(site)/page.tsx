import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Experience } from "@/components/site/Experience";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { Hero } from "@/components/site/Hero";
import { ProjectList } from "@/components/site/ProjectList";
import { Services } from "@/components/site/Services";
import { TechIconSprite } from "@/components/site/TechIcon";
import { TechMarquee } from "@/components/site/TechMarquee";
import { TechSection } from "@/components/site/TechSection";
import { computeStats, getSiteData } from "@/lib/data/queries";

// Se regenera al guardar desde el admin (revalidatePath) y, como respaldo, cada hora.
export const revalidate = 3600;

export default async function HomePage() {
  const data = await getSiteData();
  const { profile, socials, technologies, projects } = data;
  const featured = projects.filter((p) => p.isFeatured);
  // La lista muestra solo los que no están destacados, para no repetirlos.
  const others = projects.filter((p) => !p.isFeatured);

  // Numeración de secciones según las que realmente se muestran.
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  const featuredIndex = featured.length > 0 ? next() : "";
  const listIndex = others.length > 0 ? next() : "";
  const servicesIndex = next();
  const techIndex = technologies.length > 0 ? next() : "";
  const aboutIndex = next();
  const experienceIndex = next();
  const contactIndex = next();

  return (
    <>
      {/* Íconos de tecnologías una sola vez; el marquee y la sección de tecnologías los reutilizan. */}
      <TechIconSprite technologies={technologies} />
      <Hero profile={profile} socials={socials} />
      <TechMarquee technologies={technologies} />
      <div id="proyectos" className="scroll-mt-16">
        <FeaturedProjects projects={featured} index={featuredIndex} />
        <ProjectList
          projects={others}
          index={listIndex}
          title={featured.length > 0 ? "Más proyectos" : "Proyectos"}
        />
      </div>
      <Services index={servicesIndex} />
      <TechSection technologies={technologies} index={techIndex} />
      <About profile={profile} stats={computeStats(data)} index={aboutIndex} />
      <Experience index={experienceIndex} />
      <Contact profile={profile} socials={socials} index={contactIndex} />
    </>
  );
}
