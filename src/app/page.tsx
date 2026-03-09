import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Range Democracy — Unleashing Democracy, Empowering Freedom",
  description:
    "Independent political analysis and civic commentary. Exploring the interplay of government, business, and civic life in America.",
};

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Free Range Democracy</span>

          <h1 className="hero-title">
            Unleashing Democracy,<br />
            Empowering Freedom
          </h1>

          <p className="hero-tagline">
            &ldquo;Independent analysis for a free society&rdquo;
          </p>

          <p className="hero-description">
            Exploring the interplay of government, business, and civic life
            in America. Advocating for individual freedom, balanced governance,
            and civic accountability.
          </p>

          <div className="hero-actions">
            <Link href="/home" className="btn-primary">
              Welcome
            </Link>
            <Link href="#latest-posts" className="btn-secondary">
              Latest Posts
            </Link>
          </div>

          {/* Mission-control stats readout */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">03</span>
              <span className="hero-stat-label">Articles</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">02</span>
              <span className="hero-stat-label">Categories</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">2023</span>
              <span className="hero-stat-label">Est.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Posts ─────────────────────────────────────── */}
      <section id="latest-posts" className="posts-section">
        <div className="posts-section-header">
          <h2 className="posts-section-title">Latest Posts</h2>
          <p className="posts-section-subtitle">
            Commentary · Analysis · Civic Discourse
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="posts-empty">
            <p>No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ── Browse by Topic ───────────────────────────────────── */}
      <section className="categories-section">
        <div className="categories-inner">
          <div className="categories-header">
            <h2 className="categories-title">// Browse by Topic</h2>
          </div>

          <div className="categories-grid">
            <Link
              href="/blog/category/introduction-and-background"
              className="category-card"
            >
              <span className="category-card-icon">🗽</span>
              <span className="category-card-name">
                Introduction &amp; Background
              </span>
              <span className="category-card-desc">
                Start here — who we are and why we write
              </span>
            </Link>

            <Link href="/blog/category/the-coop" className="category-card">
              <span className="category-card-icon">🐓</span>
              <span className="category-card-name">The Coop</span>
              <span className="category-card-desc">
                Dispatches from inside the political barnyard
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
