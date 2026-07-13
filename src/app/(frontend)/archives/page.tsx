import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
  const payload = await getPayloadClient();
  const { docs: posts } = await payload.find({
    collection: "posts",
    sort: "-date",
    limit: 500,
    depth: 0,
  });

  const byYear: Record<string, typeof posts> = {};
  for (const post of posts) {
    const year = new Date(post.date).getFullYear().toString();
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(post);
  }

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <h1>Archive</h1>
      {years.length === 0 ? (
        <p className="empty">No posts yet.</p>
      ) : (
        years.map((year) => (
          <section key={year} className="archive-year">
            <h2>{year}</h2>
            <ul className="archive-list">
              {byYear[year].map((post) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  <time dateTime={post.date}>
                    {" "}
                    — {formatDateShort(post.date)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
