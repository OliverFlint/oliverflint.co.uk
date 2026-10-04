import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, getSeriesPosts } from "@/lib/content";
import { site, topics, formatDate } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { ArticleTools } from "@/components/article-tools";
import { PostList } from "@/components/post-list";
type Params = { year: string; month: string; day: string; slug: string };
export const dynamicParams = false;
export function generateStaticParams() {
  return posts.flatMap(post => [...new Set([post.path, post.legacyPath].filter(Boolean))].map(route => {
    const [year, month, day, slug] = route!.split("/").filter(Boolean); return { year, month, day, slug };
  }));
}
const route = (p: Params) => `/${p.year}/${p.month}/${p.day}/${p.slug}/`;
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const post = getPost(route(await params)); if (!post) return {};
  const metadata = pageMetadata(post.title, post.description, post.path, `/generated/${post.slug}-social.png`);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: post.published, ...(post.updated ? { modifiedTime: post.updated } : {}), authors: [site.name], tags: post.tags } };
}
export default async function Article({ params }: { params: Promise<Params> }) {
  const post = getPost(route(await params)); if (!post) notFound();
  const topic = topics.find(t => post.topics.includes(t.slug));
  const series = getSeriesPosts(); const index = series.findIndex(p => p.path === post.path);
  const related = posts.filter(p => p.path !== post.path && p.topics.some(t => post.topics.includes(t))).slice(0, 3);
  const structured = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, datePublished: post.published, ...(post.updated ? { dateModified: post.updated } : {}), url: site.url + post.path, mainEntityOfPage: site.url + post.path, author: { "@type": "Person", name: site.name, url: site.url + "/about/" }, image: site.url + `/generated/${post.slug}-social.png` };
  return <div className="container article-page"><header className="article-heading"><div className="article-breadcrumb"><Link href="/blog/">Writing</Link><span>/</span>{topic ? <Link href={`/topics/${topic.slug}/`}>{topic.name}</Link> : <span>Personal</span>}</div>{post.series && <Link className="pill series-pill" href="/series/d365-typescript/">TypeScript for Dynamics 365 · Part {post.order} of 6</Link>}<h1>{post.title}</h1><p className="article-description">{post.summary || post.description}</p><div className="article-meta"><Link href="/about/">Oliver Flint</Link><span>·</span><time dateTime={post.published}>{formatDate(post.published)}</time><span>·</span><span>{post.readingMinutes} min read</span>{post.updated && <span>Updated {formatDate(post.updated)}</span>}</div><div className="article-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div></header>
  <div className="article-layout"><div><article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} /><ArticleTools postPath={post.path} />{post.series && <div className="series-navigation"><Link className="series-overview" href="/series/d365-typescript/">← Back to the six-part series</Link><div>{index > 0 && <Link href={series[index - 1].path}><span>Previous / Part {series[index - 1].order}</span><strong>{series[index - 1].title.replace(/^.* - Part \d - /, "")}</strong></Link>}{index < series.length - 1 && <Link href={series[index + 1].path}><span>Next / Part {series[index + 1].order}</span><strong>{series[index + 1].title.replace(/^.* - Part \d - /, "")} →</strong></Link>}</div></div>}<div className="article-end"><span className="eyebrow">Thanks for reading</span><p>More notes, fewer lost discoveries.</p><div><a href="/rss.xml">Follow via RSS ↗</a><a href={site.github}>Find me on GitHub ↗</a></div></div></div>
  {post.headings.length > 0 && <aside className="contents-rail"><details open><summary>On this page</summary><nav aria-label="Article contents">{post.headings.map(h => <a key={h.id} className={h.depth === 3 ? "contents-nested" : undefined} href={`#${h.id}`}>{h.text}</a>)}</nav></details><Link className="contents-back" href="/blog/">← All writing</Link></aside>}</div>
  {related.length > 0 && <section className="related-section"><div className="section-heading"><h2><span>↳</span> Keep exploring</h2></div><PostList posts={related} /></section>}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} /></div>;
}
