import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tether-platform-sigma.vercel.app";

  
  const routes = [
    "/",
    "/login",
    "/register",
    "/terms",
    "/privacy",
  ];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.6,
  }));
}
