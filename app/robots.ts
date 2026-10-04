import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import buildInfo from "../.generated/build-info.json";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return buildInfo.preview ? { rules: { userAgent: "*", disallow: "/" } } : { rules: { userAgent: "*", allow: "/" }, sitemap: site.url + "/sitemap.xml" };
}
