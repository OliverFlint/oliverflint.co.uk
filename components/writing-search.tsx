"use client";
import { useEffect, useState } from "react";
import { PostList } from "./post-list";
import type { PostSummary } from "@/lib/content";
import { topics } from "@/lib/site";
import { Icon } from "./icon";

export function WritingSearch({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  useEffect(() => { if (window.location.hash === "#search") document.getElementById("search")?.focus(); }, []);
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filtered = posts.filter(p => (topic === "all" || p.topics.includes(topic)) && words.every(word => `${p.title} ${p.description} ${p.summary || ""} ${p.tags.join(" ")}`.toLowerCase().includes(word)));
  return <><div className="search-bar"><label htmlFor="search"><Icon name="search" /><span className="sr-only">Search writing by title, description or tag</span><input id="search" type="search" placeholder="Search notes, technologies, ideas…" value={query} onChange={e => setQuery(e.target.value)} /></label><span className="search-hint">Find something useful</span></div><div className="filter-bar" aria-label="Filter writing by topic"><button onClick={() => setTopic("all")} aria-pressed={topic === "all"}>All writing <span>{posts.length}</span></button>{topics.map(t => <button key={t.slug} onClick={() => setTopic(t.slug)} aria-pressed={topic === t.slug}>{t.name} <span>{posts.filter(p => p.topics.includes(t.slug)).length}</span></button>)}</div><p className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "article" : "articles"}{query && ` matching “${query}”`}</p><h2 className="sr-only">Articles</h2><PostList posts={filtered} descriptions />{!filtered.length && <div className="empty-state"><Icon name="search" /><h2>No notes found</h2><p>Try a different keyword or browse all the writing.</p><button className="button" onClick={() => { setQuery(""); setTopic("all"); }}>Clear search and filters</button></div>}</>;
}
