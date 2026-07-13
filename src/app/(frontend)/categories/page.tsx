import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const payload = await getPayloadClient();
  const { docs: categories } = await payload.find({
    collection: "categories",
    sort: "title",
    limit: 100,
    depth: 0,
  });

  return (
    <>
      <h1>Categories</h1>
      {categories.length === 0 ? (
        <p className="empty">No categories yet.</p>
      ) : (
        <ul className="cat-list">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/categories/${category.slug}`}>{category.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
