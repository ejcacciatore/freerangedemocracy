'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export interface NavItem {
  label: string;
  href: string;
  posts?: { title: string; slug: string }[];
}

interface HeaderProps {
  navItems: NavItem[];
}

export default function Header({ navItems }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  function handleMouseEnter(label: string) {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  }

  function handleMouseLeave() {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 200);
  }

  return (
    <header className="site-header">
      {/* Logo video */}
      <div className="logo-bar">
        <Link href="/" aria-label="FreeRangeDemocracy home" className="logo-link">
          <video autoPlay muted loop playsInline className="site-logo-video">
            <source src="/images/logo-animation.mp4" type="video/mp4" />
          </video>
        </Link>
      </div>

      {/* Nav bar */}
      <nav className="nav-bar" aria-label="Primary navigation">
        <span className="tagline">&ldquo;Unleashing Democracy, Empowering Freedom&rdquo;</span>

        {/* Desktop nav */}
        <ul className="nav-links" role="list">
          <li><Link href="/" className="nav-link">Home</Link></li>
          <li><Link href="/home" className="nav-link">Welcome Page</Link></li>
          {navItems.map((item) => (
            <li
              key={item.label}
              className="nav-dropdown-wrap"
              onMouseEnter={() => item.posts && item.posts.length > 0 ? handleMouseEnter(item.label) : undefined}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={item.href} className="nav-link">
                {item.label}
                {item.posts && item.posts.length > 0 && (
                  <span className="nav-chevron" aria-hidden="true">&#9662;</span>
                )}
              </Link>
              {item.posts && item.posts.length > 0 && openDropdown === item.label && (
                <ul className="nav-dropdown" role="list">
                  {item.posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="nav-dropdown-link"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                  <li className="nav-dropdown-divider" />
                  <li>
                    <Link
                      href={item.href}
                      className="nav-dropdown-link nav-dropdown-all"
                      onClick={() => setOpenDropdown(null)}
                    >
                      View all &rarr;
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          ))}
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
          <li>
            <Link href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link href="/home" className="nav-link" onClick={() => setMenuOpen(false)}>Welcome Page</Link>
          </li>
          {navItems.map((item) => (
            <li key={item.label} className="mobile-dropdown-wrap">
              <div className="mobile-dropdown-header">
                <Link
                  href={item.href}
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.posts && item.posts.length > 0 && (
                  <button
                    className="mobile-dropdown-toggle"
                    aria-label={`Expand ${item.label}`}
                    onClick={() =>
                      setMobileExpanded((v) => (v === item.label ? null : item.label))
                    }
                  >
                    <span className={mobileExpanded === item.label ? 'mobile-chevron mobile-chevron-open' : 'mobile-chevron'}>
                      &#9662;
                    </span>
                  </button>
                )}
              </div>
              {item.posts && mobileExpanded === item.label && (
                <ul className="mobile-sub-menu" role="list">
                  {item.posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mobile-sub-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
