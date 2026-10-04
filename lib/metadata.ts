import type { Metadata } from "next";
import { site } from "./site";
export function pageMetadata(title: string, description: string, path: string, image = "/generated/social-card.png"): Metadata {
  return { title, description, alternates: { canonical: path, types: { "application/rss+xml": "/rss.xml" } }, openGraph: { title, description, url: path, siteName: site.title, type: "website", locale: "en_GB", images: [{ url: image, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description, images: [image] } };
}
