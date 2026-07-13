import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "categories"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Used in the URL, e.g. /posts/my-post",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        date: {
          displayFormat: "yyyy-MM-dd",
        },
      },
    },
    {
      name: "author",
      type: "text",
      defaultValue: "Oliver Flint",
    },
    {
      name: "excerpt",
      type: "textarea",
      admin: {
        description: "Short summary shown on listing pages.",
      },
    },
    {
      name: "content",
      type: "code",
      admin: {
        language: "markdown",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
  ],
};
