import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMetadata("Workbench", site.description, "/"),
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s — Oliver Flint" },
  authors: [{ name: site.name, url: site.url }],
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
};
const themeScript = `try{var t=localStorage.getItem('workbench-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /></body></html>;
}
