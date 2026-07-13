import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        Copyright &copy; 2020–2026 Oliver Flint
      </div>
      <nav className="footer-right" aria-label="Footer">
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
    </footer>
  );
}
