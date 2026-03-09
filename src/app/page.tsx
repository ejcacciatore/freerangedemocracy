import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Image from "next/image";
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
        <div className="hero-bg-image">
          <Image
            src="/images/Gemini_Generated_Image_q59986q59986q599.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-bg-img"
          />
        </div>
        <div className="hero-content">
          <span className="hero-site-name">FreeRangeDemocracy.com</span>

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

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator">
          <span className="hero-scroll-line" />
        </div>
      </section>

      {/* ── Meet the Rooster ──────────────────────────────────── */}
      <section className="mascot-section">
        <div className="mascot-inner">
          <div className="mascot-text">
            <span className="section-eyebrow">// The Voice</span>
            <h2 className="mascot-title">Meet the Rooster</h2>
            <p className="mascot-description">
              Part revolutionary, part guardian — the Rooster stands watch over
              democracy&apos;s fragile balance. Armed with truth and an unwavering
              commitment to liberty, he crows at dawn to wake a nation.
            </p>
            <p className="mascot-description">
              From the battlefields of civic discourse to the halls of power,
              the Rooster fights for transparency, accountability, and the
              freedoms that define us.
            </p>
            <Link href="/home" className="btn-primary">
              Our Mission
            </Link>
          </div>
          <div className="mascot-image-wrap">
            <div className="mascot-image-glow" />
            <Image
              src="/images/Gemini_Generated_Image_p5hih6p5hih6p5hi.png"
              alt="The Rooster — Revolutionary War patriot mascot"
              width={500}
              height={750}
              className="mascot-img"
            />
          </div>
        </div>
      </section>

      {/* ── Editorial Illustrations ───────────────────────────── */}
      <section className="illustrations-section">
        <div className="illustrations-inner">
          <div className="illustrations-header">
            <span className="section-eyebrow">// Editorial Art</span>
            <h2 className="illustrations-title">The Rooster&apos;s View</h2>
            <p className="illustrations-subtitle">
              Satirical illustrations inspired by the golden age of American political cartoons
            </p>
          </div>
          <div className="illustrations-grid">
            <div className="illustration-card">
              <Image
                src="/images/grok-image-0ec0b9b2-8831-4c25-b7a8-bb3437c043b0.png"
                alt="The Vigilant Guardian of the Nest Egg — vintage political cartoon"
                width={700}
                height={400}
                className="illustration-img"
              />
              <div className="illustration-caption">
                <span className="illustration-label">The Vigilant Guardian of the Nest Egg</span>
                <span className="illustration-desc">Watching over taxpayer interests against bureaucratic overreach</span>
              </div>
            </div>
            <div className="illustration-card">
              <Image
                src="/images/grok-image-618e2f04-4963-4fee-974f-c108c84e7cfd.png"
                alt="The Watchful Chick — vintage political cartoon"
                width={700}
                height={400}
                className="illustration-img"
              />
              <div className="illustration-caption">
                <span className="illustration-label">The Watchful Chick</span>
                <span className="illustration-desc">Keeping an eye on trusts, monopolies, and corporate influence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner ────────────────────────────────────────────── */}
      <section className="banner-section">
        <div className="banner-inner">
          <Image
            src="/images/grok-image-0eeadfcd-b17b-4705-b227-83e99053458c.png"
            alt="FreeRangeDemocracy.com — patriotic banner"
            width={1200}
            height={375}
            className="banner-img"
          />
        </div>
      </section>

      {/* ── Latest Posts ─────────────────────────────────────── */}
      <section id="latest-posts" className="posts-section">
        <div className="posts-section-header">
          <span className="section-eyebrow">// Dispatches</span>
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
            <span className="section-eyebrow">// Explore</span>
            <h2 className="categories-section-title">Browse by Topic</h2>
          </div>

          <div className="categories-grid">
            <Link
              href="/blog/category/introduction-and-background"
              className="category-card category-card-has-image"
            >
              <div className="category-card-bg">
                <Image
                  src="/images/grok-image-19177d63-f7d6-4ad7-b4b8-d9b3bf81b84b.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="category-card-bg-img"
                />
              </div>
              <div className="category-card-content">
                <span className="category-card-name">
                  Introduction &amp; Background
                </span>
                <span className="category-card-desc">
                  Start here — who we are and why we write
                </span>
                <span className="category-card-cta">Explore &rarr;</span>
              </div>
            </Link>

            <Link href="/blog/category/the-coop" className="category-card category-card-has-image">
              <div className="category-card-bg">
                <Image
                  src="/images/grok-image-25e5994f-95d2-40ed-8376-9fa8e463fbdc.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="category-card-bg-img"
                />
              </div>
              <div className="category-card-content">
                <span className="category-card-name">The Coop</span>
                <span className="category-card-desc">
                  Dispatches from inside the political barnyard
                </span>
                <span className="category-card-cta">Explore &rarr;</span>
              </div>
            </Link>

            <Link href="/blog/category/the-food" className="category-card category-card-has-image">
              <div className="category-card-bg">
                <Image
                  src="/images/grok-image-54a17304-97f1-4b28-99be-5bfe7ff4c637.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="category-card-bg-img"
                />
              </div>
              <div className="category-card-content">
                <span className="category-card-name">The Food</span>
                <span className="category-card-desc">
                  Big Corp vs. the common citizen — who guards the golden egg?
                </span>
                <span className="category-card-cta">Explore &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA with Video Background ─────────────────────────── */}
      <section className="cta-section">
        <div className="cta-video-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="cta-video"
          >
            <source src="/images/grok-video-c75a3701-b9a8-43d2-93d2-cc901ea8c6de.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="cta-inner">
          <div className="cta-image-wrap">
            <Image
              src="/images/Gemini_Generated_Image_nvinornvinornvin.png"
              alt="The Rooster stands guard"
              width={400}
              height={600}
              className="cta-img"
            />
          </div>
          <div className="cta-text">
            <span className="section-eyebrow">// Join the Flock</span>
            <h2 className="cta-title">Stay Informed. Stay Free.</h2>
            <p className="cta-description">
              Get the latest analysis on government, business, and civic
              accountability delivered straight from the Rooster&apos;s perch.
            </p>
            <div className="cta-actions">
              <Link href="/home" className="btn-primary">
                Read Our Mission
              </Link>
              <Link href="#latest-posts" className="btn-secondary">
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
