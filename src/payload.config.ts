import sharp from "sharp";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import { Categories } from "./collections/Categories.ts";
import { Media } from "./collections/Media.ts";
import { Pages } from "./collections/Pages.ts";
import { Posts } from "./collections/Posts.ts";

const isProduction = process.env.NODE_ENV === "production";

export default buildConfig({
  admin: {
    importMap: {
      importMapFile: "./src/app/(payload)/admin/importMap.ts",
    },
  },
  collections: [Posts, Categories, Pages, Media],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "oliverflint-payload-dev-secret",
  sharp,
  typescript: {
    outputFile: "./src/payload-types.ts",
  },
  // Keep the dev database in sync automatically; production uses migrations.
  ...(isProduction ? {} : {}),
});
