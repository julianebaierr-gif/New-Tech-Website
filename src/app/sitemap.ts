import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { articles } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl;

  // 1. Static Root & Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 2. Category Silos
  const categoryRoutes: MetadataRoute.Sitemap = siteConfig.categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 3. Articles (High Priority)
  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/articles/${art.slug}`,
    lastModified: new Date(art.updatedAt),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
