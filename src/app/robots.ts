import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.baseUrl;

  // Staging protection: If siteConfig.isStaging is true, protect from indexing
  if (siteConfig.isStaging) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/search/",
          "/*?*", // Avoid query string parameter crawl loops
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/search/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/search/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
