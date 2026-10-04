import Link from "next/link";
export default function NotFound() {
  return <div className="container not-found"><span className="eyebrow">404 / Off the beaten path</span><h1>This page isn't<br />on the workbench.</h1><p>The link may have moved. There are plenty of notes<br className="desktop-break" /> to explore in the writing archive.</p><div><Link className="button button-primary" href="/blog/">Find an article →</Link><Link className="text-link" href="/">Back home →</Link></div></div>;
}
