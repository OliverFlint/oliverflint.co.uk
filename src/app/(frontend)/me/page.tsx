import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { Markdown } from "@/components/Markdown";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "pages",
    where: { slug: { equals: "me" } },
    limit: 1,
    depth: 0,
  });
  const page = docs[0];
  if (!page) notFound();

  return (
    <article className="page">
      <h1>{page.title}</h1>
      {page.content ? <Markdown content={page.content} /> : null}
    </article>
  );
}
