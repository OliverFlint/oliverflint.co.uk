import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { getSeriesPosts } from "@/lib/content";
import { series } from "@/lib/site";
import { Icon } from "@/components/icon";
export const metadata = pageMetadata("Series", "Follow a structured learning path through TypeScript development for Dynamics 365 web resources.", "/series/");
export default function Series() {
  return <div className="container page-content"><header className="page-heading"><span className="eyebrow">Go a little deeper</span><h1>Learning paths<span>.</span></h1><p>Some subjects take more than one post.<br />Start at the beginning and build on what you learn.</p></header>{series.map(item => { const posts = getSeriesPosts(item.slug); return <Link key={item.slug} className="series-index-card" href={`/series/${item.slug}/`}><div><span className="eyebrow">{posts.length} {posts.length === 1 ? "part" : "parts"}</span><h2>{item.title}</h2><p>{item.description}</p><span className="text-link">Explore the series <span>→</span></span></div><div className="series-illustration" aria-hidden="true"><Icon name="code" width="64" height="64" /><span>01 — {String(posts.length).padStart(2, "0")}</span></div></Link>; })}</div>;
}
