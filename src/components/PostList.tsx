import Link from "next/link";
import type { Post } from "@/payload-types";
import { formatDate } from "@/lib/format";

export function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <p className="empty">
        No posts yet. Sign in to the{" "}
        <Link href="/admin">admin panel</Link> to add some.
      </p>
    );
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-item">
          <div className="meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <div className="post-content">
            <div>
              <Link href={`/posts/${post.slug}`} className="post-title">
                {post.title}
              </Link>
            </div>
            {post.excerpt ? (
              <div className="post-excerpt">{post.excerpt}</div>
            ) : null}
            {Array.isArray(post.categories) && post.categories.length > 0 ? (
              <p className="post__cats">
                {post.categories.map((category) => {
                  if (
                    typeof category === "number" ||
                    typeof category === "string"
                  ) {
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
          </div>
        </li>
      ))}
    </ul>
  );
}
