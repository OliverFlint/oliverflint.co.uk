import Link from "next/link";
import { topics } from "@/lib/site";
import { getTopicPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Icon } from "@/components/icon";
export const metadata = pageMetadata("Topics", "Explore Power Platform, Dynamics 365, TypeScript and Azure development notes by subject.", "/topics/");
export default function Topics() {
  return <div className="container page-content"><header className="page-heading"><span className="eyebrow">Find your thread</span><h1>Topics<span>.</span></h1><p>A few areas I keep coming back to.<br />Pick a subject and see what I've learned.</p></header><div className="topic-index">{topics.map(t => <Link href={`/topics/${t.slug}/`} key={t.slug}><span className="topic-index-number">{t.number}</span><div><h2>{t.name}</h2><p>{t.description}</p><span className="eyebrow">{getTopicPosts(t.slug).length} articles</span></div><Icon name="arrow" /></Link>)}</div></div>;
}
