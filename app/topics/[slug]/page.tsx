import { notFound } from "next/navigation";
import Link from "next/link";
import { topics } from "@/lib/site";
import { getTopicPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PostList } from "@/components/post-list";
export const dynamicParams = false;
export function generateStaticParams() { return topics.map(t => ({ slug: t.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const topic = topics.find(t => t.slug === slug);
  return topic ? pageMetadata(topic.name, topic.description, `/topics/${slug}/`) : {};
}
export default async function Topic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const topic = topics.find(t => t.slug === slug);
  if (!topic) notFound();
  return <div className="container page-content"><header className="page-heading"><Link className="eyebrow breadcrumb" href="/topics/">← All topics</Link><h1>{topic.name}<span>.</span></h1><p>{topic.description}</p></header>{slug === "dynamics-typescript" && <div className="inline-series"><span className="eyebrow">New to the subject?</span><Link href="/series/d365-typescript/">Follow the TypeScript series in order <span>→</span></Link></div>}<PostList posts={getTopicPosts(slug)} descriptions /></div>;
}
