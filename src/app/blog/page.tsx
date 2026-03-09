import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Free Range Democracy",
  description:
    "All posts from Free Range Democracy. Commentary, analysis, and civic discourse.",
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="category-page">
      <header className="category-header">
        <div className="category-header-content">
          <div className="category-breadcrumb">
            <Link href="/" className="breadcrumb-link">
              Home
            </Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span className="breadcrumb-current">Blog</span>
          </div>
          <h1 className="category-title">All Posts</h1>
          <p className="category-subtitle">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </header>

      <section className="posts-section">
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
    </div>
  );
}
