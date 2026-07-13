import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { PostList } from "@/components/PostList";

export const dynamic = "force-dynamic";

type Args = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Args) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const { docs: categories } = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const category = categories[0];
  if (!category) notFound();

  const { docs: posts } = await payload.find({
    collection: "posts",
    where: { categories: { equals: category.id } },
    sort: "-date",
    limit: 100,
    depth: 1,
  });

  return (
    <>
      <h1>Category: {category.title}</h1>
      <PostList posts={posts} />
    </>
  );
}
