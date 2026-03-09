import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ category: string }>;
}

// Convert slug to display name
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Convert display name to slug
function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Known categories — includes categories that may not have posts yet
const KNOWN_CATEGORIES = [
  "introduction-and-background",
  "the-coop",
  "the-food",
];

// Category header images
const CATEGORY_IMAGES: Record<string, string> = {
  "introduction-and-background":
    "/images/grok-image-19177d63-f7d6-4ad7-b4b8-d9b3bf81b84b.png",
  "the-coop":
    "/images/grok-image-25e5994f-95d2-40ed-8376-9fa8e463fbdc.png",
  "the-food":
    "/images/grok-image-54a17304-97f1-4b28-99be-5bfe7ff4c637.png",
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  const slugs = new Set(categories.map((c) => titleToSlug(c)));
  KNOWN_CATEGORIES.forEach((s) => slugs.add(s));
  return Array.from(slugs).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const displayName = slugToTitle(category);
  return {
    title: `${displayName} — Free Range Democracy`,
    description: `Browse all posts in the ${displayName} category on Free Range Democracy.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const displayName = slugToTitle(category);

  // Get posts matching this category slug
  const allCategories = await getAllCategories();
  const matchedCategory = allCategories.find(
    (c) => titleToSlug(c) === category
  );

  // Allow known categories even without posts
  if (!matchedCategory && !KNOWN_CATEGORIES.includes(category)) {
    notFound();
  }

  const posts = matchedCategory
    ? await getPostsByCategory(matchedCategory)
    : [];

  const headerImage = CATEGORY_IMAGES[category];

  return (
    <div className="category-page">
      {/* ── Category Hero Header ──────────────────────────── */}
      <header className="category-hero-header">
        {headerImage && (
          <div className="category-hero-bg">
            <Image
              src={headerImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="category-hero-bg-img"
            />
          </div>
        )}
        <div className="category-hero-content">
          <div className="category-breadcrumb">
            <Link href="/" className="breadcrumb-link">
              Home
            </Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <Link href="/blog" className="breadcrumb-link">
              Blog
            </Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span className="breadcrumb-current">Category</span>
          </div>
          <h1 className="category-hero-title">{displayName}</h1>
          <p className="category-subtitle">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this category
          </p>
        </div>
      </header>

      {/* ── Post Grid ───────────────────────────────────── */}
      <section className="posts-section">
        {posts.length === 0 ? (
          <div className="posts-empty">
            <p>No posts in this category yet. Check back soon.</p>
            <Link href="/" className="btn-primary">
              &larr; Back to all posts
            </Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ── Other Categories ────────────────────────────── */}
      <section className="categories-section">
        <h2 className="categories-title">Browse Other Topics</h2>
        <div className="categories-grid">
          {category !== "introduction-and-background" && (
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
                <span className="category-card-name">Introduction &amp; Background</span>
                <span className="category-card-cta">Explore &rarr;</span>
              </div>
            </Link>
          )}
          {category !== "the-coop" && (
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
                <span className="category-card-cta">Explore &rarr;</span>
              </div>
            </Link>
          )}
          {category !== "the-food" && (
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
                <span className="category-card-cta">Explore &rarr;</span>
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
