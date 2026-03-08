import Link from 'next/link';
import Image from 'next/image';
import type { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.date));

  return (
    <article className="post-card">
      {/* Hero image */}
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="post-card-image-link" tabIndex={-1}>
          <div className="post-card-image-wrap">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="post-card-img"
            />
          </div>
        </Link>
      )}

      {/* Body */}
      <div className="post-card-body">
        {/* Category badge */}
        <Link
          href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="post-card-category"
        >
          {post.category}
        </Link>

        {/* Title */}
        <h2 className="post-card-title">
          <Link href={`/blog/${post.slug}`} className="post-card-title-link">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="post-card-excerpt">{post.excerpt}</p>

        {/* Meta row */}
        <div className="post-card-meta">
          <time dateTime={post.date} className="post-card-date">
            {formattedDate}
          </time>
          <span className="post-card-dot" aria-hidden="true">&bull;</span>
          <span className="post-card-author">By {post.author}</span>
          <span className="post-card-dot" aria-hidden="true">&bull;</span>
          <span className="post-card-reading">{post.readingTime} min read</span>
        </div>

        {/* CTA */}
        <Link href={`/blog/${post.slug}`} className="post-card-cta">
          Continue reading &rarr;
        </Link>
      </div>
    </article>
  );
}
