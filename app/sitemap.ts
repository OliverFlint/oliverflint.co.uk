import type { MetadataRoute } from "next";
import { posts } from "@/lib/content";
import { topics, site } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [...["/", "/blog/", "/topics/", "/series/", "/series/d365-typescript/", "/about/", ...topics.map(t => `/topics/${t.slug}/`)].map(path => ({ url: site.url + path })), ...posts.map(p => ({ url: site.url + p.path, lastModified: p.updated || p.published }))];
}
