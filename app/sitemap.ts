import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data/queries";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getSiteData();
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${siteUrl}/proyectos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: p.isFeatured ? 0.9 : 0.7,
    })),
  ];
}
