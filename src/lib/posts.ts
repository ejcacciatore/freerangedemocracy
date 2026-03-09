import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  image: string;
  video?: string;
}

export interface Post extends PostFrontmatter {
  content: string;
  readingTime: number;
}

export interface PostMeta extends PostFrontmatter {
  readingTime: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  return {
    ...fm,
    content,
    readingTime: calcReadingTime(content),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns all posts sorted by date descending */
export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const { content, ...meta } = parsePost(path.join(POSTS_DIR, file));
      void content;
      return meta as PostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Returns a single post by its slug, or null if not found */
export function getPostBySlug(slug: string): Post | null {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const post = parsePost(path.join(POSTS_DIR, file));
    if (post.slug === slug) return post;
  }
  return null;
}

/** Returns all slugs — used for generateStaticParams */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** Returns posts filtered by category */
export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

/** Returns all unique categories */
export function getAllCategories(): string[] {
  const cats = getAllPosts().map((p) => p.category);
  return [...new Set(cats)];
}
