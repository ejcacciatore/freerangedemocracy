import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";
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

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: titleToSlug(category),
  }));
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

  if (!matchedCategory) {
    notFound();
  }

  const posts = await getPostsByCategory(matchedCategory);

  return (
    <div className="category-page">
      {/* ── Category Header ──────────────────────────────── */}
      <header className="category-header">
        <div className="category-header-content">
          <div className="category-breadcrumb">
            <Link href="/" className="breadcrumb-link">
              Home
            </Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Category</span>
          </div>
          <h1 className="category-title">{displayName}</h1>
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
              ← Back to all posts
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
          <Link
            href="/blog/category/introduction-and-background"
            className="category-card"
          >
            <span className="category-card-icon">🗽</span>
            <span className="category-card-name">Introduction &amp; Background</span>
          </Link>
          <Link href="/blog/category/the-coop" className="category-card">
            <span className="category-card-icon">🐓</span>
            <span className="category-card-name">The Coop</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
