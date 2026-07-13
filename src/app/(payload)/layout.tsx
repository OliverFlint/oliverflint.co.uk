import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import type { ServerFunctionClientArgs } from "payload";
import config from "@/payload.config";
import { importMap } from "./admin/importMap";
import "./custom.scss";

async function serverFunction(args: ServerFunctionClientArgs) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
