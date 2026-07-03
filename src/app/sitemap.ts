import type { MetadataRoute } from "next";
import { getActiveOutfitsForSitemap } from "@/server/outfits/outfit.service";
import { buildOutfitCanonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl || "/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/outfits`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const outfits = await getActiveOutfitsForSitemap();
  const outfitPages: MetadataRoute.Sitemap = outfits.map((outfit) => ({
    url: buildOutfitCanonicalUrl(outfit),
    lastModified: outfit.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...outfitPages];
}
