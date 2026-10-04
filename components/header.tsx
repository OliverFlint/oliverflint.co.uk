"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Icon } from "./icon";

export function Header() {
  const path = usePathname();
  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/" aria-label="Oliver Flint home"><span className="brand-mark">of<span>.</span></span><span>Oliver Flint<span className="brand-caption"> / workbench</span></span></Link>
    <nav aria-label="Main navigation">{[["Writing", "/blog/"], ["Topics", "/topics/"], ["Series", "/series/"], ["About", "/about/"]].map(([name, href]) => <Link key={href} href={href} aria-current={path.startsWith(href) || name === "Writing" && /^\/\d{4}\//.test(path) ? "page" : undefined}>{name}</Link>)}</nav>
    <div className="header-tools"><Link className="icon-button" href="/blog/#search" aria-label="Search writing" title="Search writing"><Icon name="search" /></Link><span className="tool-divider" /><ThemeToggle /></div>
  </div></header>;
}
