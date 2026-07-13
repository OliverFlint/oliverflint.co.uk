import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-header__title">
        A Blog by Oliver Flint
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/categories">Categories</Link>
          </li>
          <li>
            <Link href="/archives">Archive</Link>
          </li>
          <li>
            <Link href="/me">Me</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
