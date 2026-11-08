import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Crawlers, including the AI search and answer engines (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...), may read every
 * page, so the team can be found and quoted correctly. The API routes are private plumbing and stay out of the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
