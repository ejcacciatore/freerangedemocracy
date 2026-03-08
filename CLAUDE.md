# CLAUDE.md — AI Coding Context for FreeRangeDemocracy

> This file provides context for Claude (or any AI coding assistant) working on this codebase.
> Keep it updated as the project evolves.

---

## Project Overview

**Site:** FreeRangeDemocracy.com  
**Tagline:** "Unleashing Democracy, Empowering Freedom"  
**Description:** Independent political commentary and civic analysis blog. Explores the interplay of government, business, and civic life in America.  
**Author persona:** "Rooster"  
**Migrated from:** WordPress (freerangedemocracy.com) → Next.js + Vercel  

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 + custom CSS classes |
| Content | Markdown files with gray-matter frontmatter |
| Fonts | Inter (Google Fonts via next/font) |
| Images | next/image with local + remote sources |
| Hosting | Vercel |
| Repo | GitHub — ejcacciatore/freerangedemocracy |

---

## Project Structure

```
freerangedemocracy/
├── content/
│   ├── posts/                    # Blog post markdown files
│   │   ├── welcome-to-freerangedemocracy.md
│   │   ├── part1-the-chicken.md
│   │   └── part2-the-egg.md
│   └── pages/                    # Static page markdown files
│       └── welcome-page.md
├── public/
│   └── images/
│       └── posts/                # Post images (see IMAGES.md for downloads)
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout: Header + Footer + metadata
│   │   ├── page.tsx              # Homepage: hero + post grid + categories
│   │   ├── globals.css           # Full dark navy design system CSS
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Dynamic post pages
│   │   │   └── category/
│   │   │       └── [category]/
│   │   │           └── page.tsx  # Category archive pages
│   │   └── home/
│   │       └── page.tsx          # Welcome Page (/home route)
│   ├── components/
│   │   ├── Header.tsx            # Site header: logo, nav, mobile menu
│   │   ├── Footer.tsx            # Site footer: nav + copyright
│   │   └── PostCard.tsx          # Post card: image, category, title, excerpt, CTA
│   └── lib/
│       └── posts.ts              # Data layer: getAllPosts, getPostBySlug, etc.
├── CLAUDE.md                     # This file — AI coding context
├── SKILLS.md                     # Technical skills and stack reference
├── README.md                     # Project documentation
├── package.json
├── next.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

---

## Design System

### Color Palette

```css
--color-navy:       #1b2235   /* Primary background */
--color-navy-deep:  #141927   /* Deepest backgrounds */
--color-navy-light: #252f47   /* Cards, elevated surfaces */
--color-navy-border:#2d3a57   /* Borders, dividers */
--color-red:        #c0392b   /* Accent — buttons, highlights */
--color-red-hover:  #a93226   /* Hover state for red */
--color-gold:       #c9a84c   /* Secondary accent — badges, links */
--color-gold-light: #e8c96e   /* Hover state for gold */
--color-white:      #ffffff
--color-text-muted: #8892a4   /* Secondary text */
--color-text-body:  #c8d0de   /* Body copy */
```

### Typography

- **Headings:** Georgia serif (defined in CSS as font-family: Georgia)
- **Body:** Inter sans-serif (loaded via next/font/google, CSS variable: --font-inter)
- **Title scale:** 3.5rem → 2.5rem → 2rem → 1.5rem → 1.25rem

### CSS Class Conventions

CSS classes are defined in `src/app/globals.css`. All classes are semantic — no Tailwind utility classes in TSX files (except legacy). Examples:

- Layout: `.page-shell`, `.page-main`
- Hero: `.hero`, `.hero-content`, `.hero-title`, `.hero-tagline`
- Posts: `.posts-section`, `.posts-grid`, `.post-card`
- Blog post: `.post-page`, `.post-header`, `.post-body`, `.post-title`
- Welcome: `.welcome-page`, `.welcome-header`, `.welcome-body`
- Category: `.category-page`, `.category-header`, `.category-card`
- Buttons: `.btn-primary`, `.btn-secondary`
- Header: `.site-header`, `.nav-link`, `.mobile-menu`
- Footer: `.site-footer`, `.footer-nav`

---

## Content Layer

### Post Frontmatter Schema

```yaml
---
title: "Post Title"
date: "2023-05-15"
author: "Rooster"
category: "Introduction and Background"
tags:
  - democracy
  - politics
excerpt: "Short description for SEO and post cards."
image: "/images/posts/filename.jpg"
slug: "post-slug"
---
```

### Data Layer Functions (src/lib/posts.ts)

- `getAllPosts()` — Returns all posts sorted by date descending
- `getPostBySlug(slug)` — Returns a single post by slug
- `getAllSlugs()` — Returns all post slugs (for generateStaticParams)
- `getPostsByCategory(category)` — Returns posts filtered by category
- `getAllCategories()` — Returns unique list of all categories

---

## Key Conventions

1. **Always use async Server Components** for data fetching — no client-side fetching for content
2. **Path alias `@/`** maps to `./src/` (defined in tsconfig.json)
3. **Markdown rendering** — Currently uses a custom `markdownToHtml()` function in each page. Consider upgrading to `remark` + `rehype` for production.
4. **Images** — Use `next/image` with explicit width/height. Images live in `public/images/posts/`.
5. **No client components** unless strictly necessary (hamburger menu in Header uses `"use client"`)
6. **Metadata** — Every page exports a `metadata` object or `generateMetadata` function
7. **CSS** — Add new CSS classes to `globals.css` — keep all styles in one design system file

---

## Images

Images need to be manually downloaded and placed in `public/images/posts/`.  
See `public/images/posts/IMAGES.md` for the full list of WordPress URLs to download from.

---

## Dependencies to Install

Run this after cloning:

```bash
npm install
npm install gray-matter
```

### Dev Commands

```bash
npm run dev     # Start development server at localhost:3000
npm run build   # Production build
npm run lint    # ESLint check
```

---

## Current Status

- [x] Content migration complete (3 posts + 1 welcome page)
- [x] Design system CSS complete (dark navy theme)
- [x] Header, Footer, PostCard components built
- [x] Data layer (posts.ts) complete
- [x] All page routes built
- [ ] Images need to be downloaded (see IMAGES.md)
- [ ] Deploy to Vercel (connect GitHub repo)
- [ ] Add `gray-matter` to package.json dependencies

---

## Original Site Reference

The original WordPress site at **freerangedemocracy.com** is the source of truth for all content.  
All three blog posts and the welcome page were migrated from that site.

Categories: "Introduction and Background", "The coop"  
Author: "Rooster"  
Primary image: The logo header `cropped-freerangedemocracy_imagine2.jpg`
