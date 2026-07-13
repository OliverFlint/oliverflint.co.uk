import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import config from "@/payload.config";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export { generatePageMetadata as generateMetadata };

export default async function Page({ params, searchParams }: Args) {
  return (
    <RootPage
      config={config}
      importMap={importMap}
      params={params}
      searchParams={searchParams}
    />
  );
}
