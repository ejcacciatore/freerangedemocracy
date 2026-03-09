import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Free Range Democracy",
  description:
    "Exploring the Interplay of Government and Business for a Freer Society. Learn about Free Range Democracy — our mission, our voice, and why independent civic discourse matters.",
};

async function getWelcomePage() {
  const filePath = path.join(process.cwd(), "content/pages/welcome-page.md");
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

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
      if (block.startsWith("### ")) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith("# ")) return `<h1>${block.slice(2)}</h1>`;
      if (block.startsWith("---")) return "<hr />";
      if (block.startsWith("> ")) {
        return `<blockquote>${block.slice(2)}</blockquote>`;
      }

      let html = block
        .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

      return `<p>${html}</p>`;
    })
    .join("\n");
}

export default async function WelcomePage() {
  const { data, content } = await getWelcomePage();

  return (
    <>
      {/* ── Welcome Hero ──────────────────────────────────── */}
      <section className="welcome-hero-section">
        <div className="welcome-hero-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="welcome-hero-bg-video"
          >
            <source src="/images/grok-video-63ef1f0a-0cc3-4654-bd6f-d0e743127845.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="welcome-hero-content">
          <span className="section-eyebrow">// Welcome</span>
          <h1 className="welcome-hero-title">Welcome Page</h1>
          <p className="welcome-hero-subtitle">
            &ldquo;Exploring the Interplay of Government and Business
            for a Freer Society&rdquo;
          </p>
        </div>
      </section>

      {/* ── Main Content with sidebar images ───────────────── */}
      <section className="welcome-content-section">
        <div className="welcome-content-inner">
          {/* Left sidebar — mascot */}
          <aside className="welcome-sidebar">
            <Image
              src="/images/posts/Gemini_Generated_Image_jo9c9fjo9c9fjo9c.png"
              alt="The Rooster — guardian of democracy"
              width={320}
              height={420}
              className="welcome-sidebar-img"
            />
          </aside>

          {/* Center — written content */}
          <div className="welcome-body">
            {/* Logo banner */}
            <div className="welcome-banner-wrap">
              <Image
                src="/images/grok-image-0eeadfcd-b17b-4705-b227-83e99053458c.png"
                alt="FreeRangeDemocracy.com banner"
                width={800}
                height={250}
                className="welcome-banner-img"
              />
            </div>

            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
            />

            {/* Wolves guarding the henhouse image */}
            <div className="welcome-feature-image">
              <Image
                src="/images/grok-image-f783dc3e-4914-4831-9759-f24dc16a2540.png"
                alt="Wolves guarding the henhouse — the rooster stands between them"
                width={900}
                height={520}
                className="welcome-feature-img"
              />
              <p className="welcome-feature-caption">
                The Rooster stands guard — keeping the wolves from the henhouse
              </p>
            </div>

            <div className="welcome-actions">
              <Link href="/#latest-posts" className="btn-primary">
                Read Our Posts
              </Link>
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>

          {/* Right sidebar — compass video + democracy image */}
          <aside className="welcome-sidebar">
            <div className="welcome-sidebar-video-wrap">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="welcome-sidebar-video"
              >
                <source src="/images/grok-video-28e6e0ab-14db-4fdd-8ce9-ba1b5ddffa0c.mp4" type="video/mp4" />
              </video>
            </div>
            <Image
              src="/images/posts/8b8858bd-06e8-4dcd-bc7d-2cda8103416e.png"
              alt="Democracy illustration"
              width={320}
              height={576}
              className="welcome-sidebar-img"
            />
          </aside>
        </div>
      </section>
    </>
  );
}
