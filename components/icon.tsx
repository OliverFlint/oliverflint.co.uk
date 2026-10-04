import type { SVGProps } from "react";
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: "arrow" | "search" | "sun" | "moon" | "code" | "grid" | "github" | "rss" }) {
  const paths = {
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    moon: <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z" />,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    github: <><path d="M9 20c-5 1-5-3-7-3m14 5v-4c0-1-.4-2-1-2.5 3-.4 6-1.5 6-6a5 5 0 0 0-1.4-3.5A5 5 0 0 0 19.5 2S18 1.5 15 3a13 13 0 0 0-6 0C6 1.5 4.5 2 4.5 2a5 5 0 0 0-.1 4A5 5 0 0 0 3 9.5c0 4.5 3 5.6 6 6C8.4 16 8 17 8 18v4" /></>,
    rss: <><circle cx="5" cy="19" r="1" /><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" /></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
