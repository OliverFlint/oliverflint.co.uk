import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeries, getSeriesPosts } from "@/lib/content";
import { series } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { Icon } from "@/components/icon";

export const dynamicParams = false;
export function generateStaticParams() { return series.map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSeries(slug);
  return item ? pageMetadata(item.title, item.description, `/series/${item.slug}/`) : {};
}
export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSeries(slug);
  if (!item) notFound();
  const posts = getSeriesPosts(slug);
  return <div className="container page-content"><header className="page-heading"><Link href="/series/" className="eyebrow breadcrumb">← All series</Link><h1>{item.title}<span>.</span></h1><p>{item.intro}</p><div className="page-heading-meta"><span>{posts.length} {posts.length === 1 ? "part" : "parts"}</span><span>{posts.reduce((sum, post) => sum + post.readingMinutes, 0)} min total reading</span></div></header>{item.context?.length ? <div className="series-context">{item.context.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div> : null}<div className="series-list">{posts.map(post => <article key={post.path}><span className="series-order">{String(post.order).padStart(2, "0")}</span><div><span className="eyebrow">Part {post.order} / {post.readingMinutes} min read</span><h2><Link href={post.path}>{post.title.replace(/^D365 TypeScript Web Resources - Part \d - /, "")}</Link></h2><p>{post.summary || post.description}</p></div><Icon name="arrow" /></article>)}</div></div>;
}
