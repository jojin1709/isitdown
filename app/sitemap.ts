import { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://isitdown-live.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.8,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((svc) => ({
    url: `${baseUrl}/status/${svc.id}`,
    lastModified: now,
    changeFrequency: "always",
    priority: 0.9,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
