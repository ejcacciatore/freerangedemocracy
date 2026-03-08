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

// Simple markdown-to-HTML for the welcome page
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/***(.+?)***/g, '<strong><em>$1</em></strong>')
    .replace(/**(.+?)**/g, '<strong>$1</strong>')
    .replace(/*(.+?)*/g, '<em>$1</em>')
    .replace(/![([^]]*)](([^)]+))/g, '<img src="$2" alt="$1" class="post-image" />')
    .replace(/[([^]]+)](([^)]+))/g, '<a href="$2" class="post-link">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr />')
    .split(/

+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') ||
          trimmed.startsWith('<hr') || trimmed.startsWith('<img')) {
        return trimmed;
      }
      return '<p>' + trimmed.replace(/
/g, '<br />') + '</p>';
    })
    .filter(Boolean)
    .join('
');
}

export default async function WelcomePage() {
  const { data, content } = await getWelcomePage();
  const htmlContent = markdownToHtml(content);

  return (
    <div className="welcome-page">
      {/* ── Page Header ─────────────────────────────────── */}
      <header className="welcome-header">
        {data.image && (
          <div className="welcome-hero-image">
            <Image
              src={data.image}
              alt={data.title || "Welcome"}
              width={1200}
              height={500}
              className="welcome-hero-img"
              priority
            />
          </div>
        )}
        <div className="welcome-header-content">
          <h1 className="welcome-title">{data.title || "Welcome to Free Range Democracy"}</h1>
          {data.excerpt && (
            <p className="welcome-excerpt">{data.excerpt}</p>
          )}
        </div>
      </header>

      {/* ── Page Body ───────────────────────────────────── */}
      <div
        className="welcome-body post-body"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* ── CTA ─────────────────────────────────────────── */}
      <div className="welcome-cta">
        <Link href="/" className="btn-primary">
          Read the Latest Posts
        </Link>
        <Link href="/blog/category/introduction-and-background" className="btn-secondary">
          Introduction &amp; Background
        </Link>
      </div>
    </div>
  );
}
