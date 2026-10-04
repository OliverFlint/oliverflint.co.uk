import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { getSeriesPosts } from "@/lib/content";
import { Icon } from "@/components/icon";
export const metadata = pageMetadata("Series", "Follow a structured learning path through TypeScript development for Dynamics 365 web resources.", "/series/");
export default function Series() {
  return <div className="container page-content"><header className="page-heading"><span className="eyebrow">Go a little deeper</span><h1>Learning paths<span>.</span></h1><p>Some subjects take more than one post.<br />Start at the beginning and build on what you learn.</p></header><Link className="series-index-card" href="/series/d365-typescript/"><div><span className="eyebrow">{getSeriesPosts().length} parts / Dynamics 365</span><h2>TypeScript for<br />Dynamics 365</h2><p>Web resources, types, bundling, modules, testing and telemetry. A practical guide to a more maintainable codebase.</p><span className="text-link">Explore the series <span>→</span></span></div><div className="series-illustration" aria-hidden="true"><Icon name="code" width="64" height="64" /><span>01 — 06</span></div></Link></div>;
}
