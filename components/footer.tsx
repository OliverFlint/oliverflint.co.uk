import { site } from "@/lib/site";
import { Icon } from "./icon";
export function Footer() {
  return <footer className="site-footer container"><div className="footer-top"><a className="brand" href="/"><span className="brand-mark">of<span>.</span></span><span>Oliver Flint</span></a><p>Practical notes. Shared openly.</p><a className="footer-rss" href="/rss.xml"><Icon name="rss" /> Follow via RSS</a></div><div className="footer-bottom"><span>© {new Date().getUTCFullYear()} Oliver Flint</span><div><a href={site.github}>GitHub ↗</a><a href={site.linkedin}>LinkedIn ↗</a><a href={site.twitter}>X / Twitter ↗</a></div><span className="footer-colophon">Built with curiosity<span className="status-dot" /></span></div></footer>;
}
