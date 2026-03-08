'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      {/* Logo bar */}
      <div className="logo-bar">
        <Link href="/" aria-label="FreeRangeDemocracy home">
          <Image
            src="/images/logo/freerangedemocracy-logo.jpg"
            alt="FreeRangeDemocracy"
            width={640}
            height={209}
            priority
            className="site-logo"
          />
        </Link>
      </div>

      {/* Nav bar */}
      <nav className="nav-bar" aria-label="Primary navigation">
        <span className="tagline">&ldquo;Unleashing Democracy, Empowering Freedom&rdquo;</span>

        {/* Desktop nav */}
        <ul className="nav-links" role="list">
          <li><Link href="/" className="nav-link">Home</Link></li>
          <li><Link href="/home" className="nav-link">Welcome Page</Link></li>
          <li>
            <Link href="/blog/category/the-coop" className="nav-link">The Coop</Link>
          </li>
          <li>
            <Link href="/blog/category/introduction-and-background" className="nav-link">
              Introduction
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={menuOpen ? 'bar bar-open' : 'bar'} />
          <span className={menuOpen ? 'bar bar-open' : 'bar'} />
          <span className={menuOpen ? 'bar bar-open' : 'bar'} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <ul className="mobile-menu" role="list">
          <li><Link href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li>
            <Link href="/home" className="nav-link" onClick={() => setMenuOpen(false)}>
              Welcome Page
            </Link>
          </li>
          <li>
            <Link href="/blog/category/the-coop" className="nav-link" onClick={() => setMenuOpen(false)}>
              The Coop
            </Link>
          </li>
          <li>
            <Link href="/blog/category/introduction-and-background" className="nav-link" onClick={() => setMenuOpen(false)}>
              Introduction
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
