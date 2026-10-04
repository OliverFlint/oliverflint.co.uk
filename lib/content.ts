import compiled from "../.generated/posts.json";
import { series } from "./site";

export type Post = {
  title: string; slug: string; published: string; updated?: string; path: string;
  description: string; summary?: string; topics: string[]; tags: string[]; legacyPath?: string;
  series?: string; order?: number; readingMinutes: number; html: string;
  headings: { id: string; text: string; depth: number }[];
};
export type PostSummary = Omit<Post, "html" | "headings">;
export const posts = compiled as Post[];
export function getPost(route: string) { return posts.find(p => p.path.toLowerCase() === route.toLowerCase()); }
export function getTopicPosts(slug: string) { return posts.filter(p => p.topics.includes(slug)); }
export function getSeriesPosts(slug: string) { return posts.filter(p => p.series === slug).sort((a, b) => (a.order || 0) - (b.order || 0)); }
export function getSeries(slug: string) { return series.find(item => item.slug === slug); }
export function summaries(items: Post[]): PostSummary[] { return items.map(({ html, headings, ...p }) => p); }
