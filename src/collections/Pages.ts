import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
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
        description: "Used in the URL, e.g. /me",
      },
    },
    {
      name: "content",
      type: "code",
      admin: {
        language: "markdown",
      },
    },
  ],
};
