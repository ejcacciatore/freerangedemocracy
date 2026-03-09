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

// Safe markdown-to-HTML converter (no regex with literal newlines)
function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (current.length > 0) {
        blocks.push(current.join("\n"));
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) blocks.push(current.join("\n"));

  return blocks
    .map((block) => {
      if (block.startsWith("### "))
        return `<h3 class="text-xl font-bold text-gold mt-8 mb-3">${block.slice(4)}</h3>`;
      if (block.startsWith("## "))
        return `<h2 class="text-2xl font-bold text-gold mt-10 mb-4">${block.slice(3)}</h2>`;
      if (block.startsWith("# "))
        return `<h1 class="text-3xl font-bold text-gold mt-12 mb-6">${block.slice(2)}</h1>`;
      if (block.startsWith("---"))
        return '<hr class="border-navy-light my-8" />';
      if (block.startsWith("> ")) {
        const inner = block.slice(2);
        return `<blockquote class="border-l-4 border-gold pl-6 italic text-gray-300 my-6">${inner}</blockquote>`;
      }
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block
          .split("\n")
          .filter((l) => l.startsWith("- ") || l.startsWith("* "))
          .map((l) => `<li class="mb-1">${l.slice(2)}</li>`)
          .join("");
        return `<ul class="list-disc list-inside text-gray-200 mb-4 space-y-1">${items}</ul>`;
      }

      let html = block
        .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-6" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold hover:underline">$1</a>');

      return `<p class="text-gray-200 leading-relaxed mb-4">${html}</p>`;
    })
    .join("\n");
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-navy">
      {/* Hero */}
      <section className="relative py-20 bg-deep-navy border-b border-navy-light">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/blog"
              className="text-gold text-sm hover:underline font-medium"
            >
              ← All Posts
            </Link>
            {post.category && (
              <>
                <span className="text-gray-500">/</span>
                <Link
                  href={`/blog/category/${post.category.toLowerCase()}`}
                  className="text-gold text-sm hover:underline capitalize"
                >
                  {post.category}
                </Link>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            {post.author && (
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs">
                  {post.author[0]}
                </span>
                {post.author}
              </span>
            )}
            {post.date && (
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-navy-light text-gray-300 rounded-full text-xs border border-navy-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Video or Image */}
      {post.video ? (
        <div className="container mx-auto px-6 max-w-4xl -mt-0 pt-10">
          <div className="post-video-wrap">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="post-video"
            >
              <source src={post.video} type="video/mp4" />
            </video>
          </div>
        </div>
      ) : post.image ? (
        <div className="container mx-auto px-6 max-w-4xl -mt-0 pt-10">
          <div className="rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={900}
              height={500}
              className="w-full object-cover"
            />
          </div>
        </div>
      ) : null}

      {/* Article Body */}
      <article className="py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />

          {/* Footer Nav */}
          <div className="mt-16 pt-8 border-t border-navy-light">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gold hover:underline font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
