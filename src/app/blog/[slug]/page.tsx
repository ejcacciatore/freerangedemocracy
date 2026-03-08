import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Rooster"],
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

// Very simple markdown-to-HTML converter for basic formatting
function markdownToHtml(markdown: string): string {
  return markdown
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/***(.+?)***/g, '<strong><em>$1</em></strong>')
    .replace(/**(.+?)**/g, '<strong>$1</strong>')
    .replace(/*(.+?)*/g, '<em>$1</em>')
    // Images
    .replace(/![([^]]*)](([^)]+))/g, '<img src="$2" alt="$1" class="post-image" />')
    // Links
    .replace(/[([^]]+)](([^)]+))/g, '<a href="$2" class="post-link">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Paragraphs (double newlines → paragraph breaks)
    .split(/

+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') ||
          trimmed.startsWith('<hr') || trimmed.startsWith('<img')) {
        return trimmed;
      }
      // Convert single newlines within a paragraph to <br>
      return '<p>' + trimmed.replace(/
/g, '<br />') + '</p>';
    })
    .filter(Boolean)
    .join('
');
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = markdownToHtml(post.content || '');

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="post-page">
      {/* ── Post Header ────────────────────────────────── */}
      <header className="post-header">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="post-category-badge"
          >
            {post.category}
          </Link>
        )}
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-author">By {post.author || "Rooster"}</span>
          <span className="post-meta-divider">·</span>
          <time className="post-date" dateTime={post.date}>
            {formattedDate}
          </time>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="post-meta-divider">·</span>
              <div className="post-tags">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="post-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Hero Image ─────────────────────────────────── */}
      {post.image && (
        <div className="post-hero-image">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={600}
            className="post-hero-img"
            priority
          />
        </div>
      )}

      {/* ── Post Body ──────────────────────────────────── */}
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* ── Post Footer ────────────────────────────────── */}
      <footer className="post-footer">
        <div className="post-footer-nav">
          <Link href="/" className="post-back-link">
            ← Back to all posts
          </Link>
          {post.category && (
            <Link
              href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="post-category-link"
            >
              More in {post.category} →
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
