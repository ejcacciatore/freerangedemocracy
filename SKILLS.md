# SKILLS.md — Technical Reference for FreeRangeDemocracy

> Quick-reference guide for the technologies and patterns used in this project.
> Use this as a cheat sheet when building new features.

---

## Next.js 15 — App Router

### Core Patterns

```typescript
// Server Component (default — preferred for data fetching)
export default async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}

// Client Component (use only when needed)
"use client";
import { useState } from "react";
export default function Interactive() {
  const [open, setOpen] = useState(false);
  return <button onClick={() => setOpen(!open)}>Toggle</button>;
}

// Dynamic route
// File: src/app/blog/[slug]/page.tsx
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;  // Params are async in Next.js 15
  ...
}

// Static params generation
export async function generateStaticParams() {
  return [{ slug: 'post-1' }, { slug: 'post-2' }];
}

// Metadata
export const metadata: Metadata = { title: "Page Title" };
// OR dynamic:
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: "Dynamic Title" };
}
```

### File Conventions

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared layout wrapper |
| `page.tsx` | Route page component |
| `loading.tsx` | Loading skeleton |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |
| `route.ts` | API route handler |

### Routing

| URL Pattern | File Path |
|------------|-----------|
| `/` | `src/app/page.tsx` |
| `/home` | `src/app/home/page.tsx` |
| `/blog/my-post` | `src/app/blog/[slug]/page.tsx` |
| `/blog/category/the-coop` | `src/app/blog/category/[category]/page.tsx` |

---

## TypeScript 5

### Common Patterns

```typescript
// Interface for post data
interface Post {
  slug: string;
  title: string;
  date: string;
  author?: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  image?: string;
  content?: string;
}

// Async function with return type
async function getPost(slug: string): Promise<Post | null> { ... }

// Props with children
interface LayoutProps {
  children: React.ReactNode;
}

// Generic type
type Awaited<T> = T extends Promise<infer U> ? U : T;
```

---

## React 19

### Key Features Used

```typescript
// Server Actions (for future forms)
"use server";
async function submitForm(formData: FormData) {
  const name = formData.get("name") as string;
}

// Suspense boundaries
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>

// use() hook for async resources
import { use } from "react";
const data = use(fetchPromise);
```

---

## Tailwind CSS v4

### Key Differences from v3

- CSS-first config: define design tokens in `globals.css` not `tailwind.config.js`
- Use `@import "tailwindcss"` instead of the three @tailwind directives
- Arbitrary values: `bg-[#1b2235]`, `text-[1.25rem]`
- Dark mode via CSS: `@variant dark { ... }`

### In This Project

We use **minimal Tailwind utilities** — most styling is done with custom CSS classes in `globals.css`.  
This gives full design control without class-name clutter in TSX files.

---

## gray-matter

Parses YAML frontmatter from markdown files.

```typescript
import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";

const raw = await fs.readFile(filePath, "utf-8");
const { data, content } = matter(raw);
// data = frontmatter object { title, date, author, ... }
// content = markdown body without frontmatter
```

---

## next/image

```typescript
import Image from "next/image";

// Local image (in /public)
<Image src="/images/posts/photo.jpg" alt="Description" width={1200} height={600} />

// Priority loading for hero/LCP images
<Image src="..." alt="..." width={...} height={...} priority />

// Fill mode (parent must be position: relative with defined height)
<div style={{ position: "relative", height: "400px" }}>
  <Image src="..." alt="..." fill style={{ objectFit: "cover" }} />
</div>
```

**Important:** Add external domains to `next.config.ts`:

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "freerangedemocracy.com" },
    ],
  },
};
```

---

## next/link

```typescript
import Link from "next/link";

<Link href="/blog/my-post">Read more</Link>
<Link href="/blog/category/the-coop" className="category-link">The Coop</Link>
// Prefetches on hover automatically
```

---

## next/font

```typescript
// In layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## File System (Node.js — Server Only)

```typescript
import { promises as fs } from "fs";
import path from "path";

// Read a file
const filePath = path.join(process.cwd(), "content/posts/my-post.md");
const content = await fs.readFile(filePath, "utf-8");

// Read directory
const files = await fs.readdir(path.join(process.cwd(), "content/posts"));
// Returns: ["post-1.md", "post-2.md"]
```

---

## Markdown Rendering

### Current Approach (Custom Function)

A custom `markdownToHtml()` function handles basic markdown-to-HTML conversion.
Supports: h1-h3, bold, italic, images, links, blockquotes, hr, paragraphs.

### Future Upgrade (remark + rehype)

```bash
npm install remark remark-html remark-gfm
```

```typescript
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
```

---

## Vercel Deployment

### Steps

1. Push to GitHub (already done)
2. Go to vercel.com → Import Project → Select repo
3. Framework: Next.js (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)
6. Click Deploy

### Environment Variables

No env vars required for current setup (static markdown-based site).

### Domain Setup

After deploying:
- Vercel assigns: `freerangedemocracy.vercel.app`
- To use custom domain: Add `freerangedemocracy.com` in Vercel dashboard → Update DNS records at domain registrar

---

## Common Gotchas

| Gotcha | Solution |
|--------|---------|
| `params` in Next.js 15 are async | `const { slug } = await params;` |
| `gray-matter` not installed | `npm install gray-matter` |
| Images show 404 | Download from IMAGES.md → put in `public/images/posts/` |
| Inter font not loading | Check `className={inter.variable}` is on `<html>` tag |
| CSS not applying | Make sure class exists in `globals.css` |
| Build fails: cannot find module | Run `npm install` after cloning |
