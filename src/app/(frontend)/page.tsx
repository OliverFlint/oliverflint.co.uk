import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { PostList } from "@/components/PostList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const payload = await getPayloadClient();
  const { docs: posts } = await payload.find({
    collection: "posts",
    sort: "-date",
    limit: 50,
    depth: 1,
  });

  return (
    <>
      <section className="about">
        <p>
          Oliver Flint’s musings on the subject of Power Platform, Power Apps,
          Dynamics 365, Dataverse and Azure
        </p>
        <p className="about__social">
          Find me on{" "}
          <a
            href="https://github.com/oliverflint"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          ,{" "}
          <a
            href="https://twitter.com/oliver_flint"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>{" "}
          and{" "}
          <a
            href="https://linkedin.com/in/oliverflint"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          .
        </p>
      </section>
      <section className="writing">
        <span className="h1">
          <Link href="/">Writing</Link>
        </span>
        <PostList posts={posts} />
      </section>
    </>
  );
}
