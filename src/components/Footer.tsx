import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Category links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/blog/category/introduction-and-background" className="footer-link">
            Introduction &amp; Background
          </Link>
          <Link href="/blog/category/the-coop" className="footer-link">
            The Coop
          </Link>
          <Link href="/blog/category/the-food" className="footer-link">
            The Food
          </Link>
        </nav>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Bottom line */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} FreeRangeDemocracy. All rights reserved.
          </p>
          <p className="footer-tagline">
            &ldquo;Unleashing Democracy, Empowering Freedom&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
