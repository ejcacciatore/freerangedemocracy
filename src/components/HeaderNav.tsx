import { getPostsByCategory } from '@/lib/posts';
import Header from './Header';
import type { NavItem } from './Header';

function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const NAV_CATEGORIES = [
  { label: 'The Coop', category: 'The Coop', slug: 'the-coop' },
  { label: 'Introduction', category: 'Introduction and Background', slug: 'introduction-and-background' },
];

export default function HeaderNav() {
  const navItems: NavItem[] = NAV_CATEGORIES.map(({ label, category, slug }) => {
    const posts = getPostsByCategory(category).slice(0, 5);
    return {
      label,
      href: `/blog/category/${slug}`,
      posts: posts.map((p) => ({ title: p.title, slug: p.slug })),
    };
  });

  return <Header navItems={navItems} />;
}
