# FreeRangeDemocracy

> "Unleashing Democracy, Empowering Freedom"

A Next.js website migrated from freerangedemocracy.com - exploring the interplay of government and business for a freer society.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: Markdown files with frontmatter (MDX-compatible)
- **Hosting**: Vercel

## Project Structure

```
freerangedemocracy/
|-- content/
|   |-- posts/           # Blog posts as Markdown files
|   |   |-- welcome-to-freerangedemocracy.md
|   |   |-- part1-the-chicken.md
|   |   |-- part2-the-egg.md
|   |-- pages/           # Static page content
|       |-- welcome-page.md
|-- public/
|   |-- images/
|       |-- logo/        # Site logo files
|       |-- posts/       # Post images
|-- src/
    |-- app/             # Next.js App Router pages
        |-- globals.css
        |-- layout.tsx
        |-- page.tsx
```

## Site Content

### Pages
- **Welcome Page** (/home) - Introduction to FreeRangeDemocracy

### Blog Posts (Category: The Coop)
1. **Welcome to FreeRangeDemocracy** (May 14, 2023) - Introduction post
2. **Part 1: The Chicken or the Egg: Government or Corporations** (May 15, 2023)
3. **Part 2: The Egg - Corporate Influence, Technological Innovation, and the Backbone of Americas Economy** (May 15, 2023)

### Categories
- Introduction and Background
- The coop

## Images

All original images from the WordPress site are stored in `public/images/posts/`:

| Filename | Used In |
|----------|---------|
| cropped-freerangedemocracy_imagine2.jpg | Site logo/header (1280x418) |
| 06371a4f-c2df-45b9-af7d-73885ee93dc1.png | Welcome post header image |
| roosters-5599141.jpg | Welcome post bottom image |
| d7f5b6e1-140f-450f-9336-9f47396f896a.png | Part 1 post image |
| 039a42c6-ccb6-4c4e-82ce-b4c7d782b862.png | Part 2 post hero image |
| statue-of-liberty-267948.jpg | Part 2 post bottom image |
| 2d91e2e3-2a1b-46ff-a185-5937244e6e8c.png | Welcome page image |
| 8b8858bd-06e8-4dcd-bc7d-2cda8103416e.png | Welcome page image |

> **Note**: Download these images from the original WordPress uploads at:
> https://freerangedemocracy.com/wp-content/uploads/2023/05/[filename]

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

## Deployment

This site is deployed on Vercel. Connect your GitHub repository to Vercel for automatic deployments on every push to main.

## Original Site

Migrated from: https://freerangedemocracy.com (WordPress / Twenty Twenty-One theme)
- Site tagline: "Unleashing Democracy, Empowering Freedom"
- Author: Rooster
- Original posts published: May 2023
np
