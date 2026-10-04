import Link from "next/link";
import type { PostSummary } from "@/lib/content";
import { formatDate, topics } from "@/lib/site";
import { Icon } from "./icon";
export function PostList({ posts, descriptions = false }: { posts: PostSummary[]; descriptions?: boolean }) {
  return <div className="post-list">{posts.map(post => <article className="post-row" key={post.path}><time dateTime={post.published}>{formatDate(post.published)}</time><div><div className="post-row-meta"><span>{topics.find(t => post.topics.includes(t.slug))?.name || "Personal"}</span>{post.order && <span>Part {post.order} / 6</span>}</div><h3><Link href={post.path}>{post.title}</Link></h3>{descriptions && <p>{post.summary || post.description}</p>}</div><div className="post-row-tail"><span>{post.readingMinutes} min read</span><Icon name="arrow" /></div></article>)}</div>;
}
