import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Free Range Democracy",
  description:
    "Learn about Free Range Democracy — our mission, our voice, and why independent civic discourse matters.",
};

async function getWelcomePage() {
  const filePath = path.join(process.cwd(), "content/pages/welcome-page.md");
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

// Simple markdown-to-HTML converter
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
      // Headings
      if (block.startsWith("### ")) return `<h3 class="text-xl font-bold text-gold mt-8 mb-3">${block.slice(4)}</h3>`;
      if (block.startsWith("## ")) return `<h2 class="text-2xl font-bold text-gold mt-10 mb-4">${block.slice(3)}</h2>`;
      if (block.startsWith("# ")) return `<h1 class="text-3xl font-bold text-gold mt-12 mb-6">${block.slice(2)}</h1>`;
      if (block.startsWith("---")) return '<hr class="border-navy-light my-8" />';
      if (block.startsWith("> ")) {
        const inner = block.slice(2);
        return `<blockquote class="border-l-4 border-gold pl-6 italic text-gray-300 my-6">${inner}</blockquote>`;
      }

      // Inline formatting
      let html = block
        .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="post-image" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="post-link">$1</a>');

      return `<p class="text-gray-200 leading-relaxed mb-4">${html}</p>`;
    })
    .join("\n");
}

export default async function HomePage() {
  const { data, content } = await getWelcomePage();

  return (
    <div className="min-h-screen bg-navy">
      {/* Hero */}
      <section className="relative py-24 bg-deep-navy border-b border-navy-light">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
            Welcome
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            {data.title || "Welcome to Free Range Democracy"}
          </h1>
          {data.excerpt && (
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {data.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {data.image && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <Image
                src={data.image}
                alt={data.title || "Welcome"}
                width={900}
                height={500}
                className="w-full object-cover"
              />
            </div>
          )}
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
          />
          <div className="mt-16 pt-8 border-t border-navy-light flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="px-8 py-3 bg-red text-white font-semibold rounded-lg hover:bg-red/90 transition-colors"
            >
              Read Our Posts
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-navy transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
