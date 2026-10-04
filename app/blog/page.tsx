import { posts, summaries } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { WritingSearch } from "@/components/writing-search";
export const metadata = pageMetadata("Writing", "Code, experiments and practical notes from Oliver Flint. Browse the complete archive by topic or search for a technology.", "/blog/");
export default function Blog() {
  return <div className="container page-content"><header className="page-heading"><span className="eyebrow">The notebook</span><h1>Writing<span>.</span></h1><p>Things I've built, problems I've worked through,<br className="desktop-break" /> and useful discoveries along the way.</p></header><WritingSearch posts={summaries(posts)} /></div>;
}
