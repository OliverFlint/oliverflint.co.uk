import compiled from "../.generated/posts.json";

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
export function getSeriesPosts() { return posts.filter(p => p.series === "d365-typescript").sort((a, b) => (a.order || 0) - (b.order || 0)); }
export function summaries(items: Post[]): PostSummary[] { return items.map(({ html, headings, ...p }) => p); }
