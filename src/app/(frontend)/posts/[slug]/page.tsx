import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { Markdown } from "@/components/Markdown";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Args = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const post = docs[0];
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function PostPage({ params }: Args) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  const post = docs[0];
  if (!post) notFound();

  return (
    <article className="post">
      <header className="post__header">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <h1>{post.title}</h1>
        {Array.isArray(post.categories) && post.categories.length > 0 ? (
          <p className="post__cats">
            {post.categories.map((category) => {
              if (typeof category === "number" || typeof category === "string") {
                return null;
              }
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="tag"
                >
                  {category.title}
                </Link>
              );
            })}
          </p>
        ) : null}
      </header>
      {post.content ? <Markdown content={post.content} /> : null}
    </article>
  );
}
