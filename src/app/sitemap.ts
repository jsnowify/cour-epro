import type { MetadataRoute } from "next";
import { PAGES, abs } from "@/lib/site";

/** Every public page, for Google Search Console and other crawlers. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-08");
  return PAGES.map((p) => ({
    url: p.path === "/" ? abs("/") || "/" : abs(p.path),
    lastModified,
    changeFrequency: p.path === "/" || p.path === "/news" || p.path === "/tryouts" ? "weekly" : "monthly",
    priority: p.priority,
  }));
}
