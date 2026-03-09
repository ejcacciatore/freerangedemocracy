import { redirect } from 'next/navigation';
import InstagramPublisher from './InstagramPublisher';

export const metadata = {
  title: 'Instagram Publisher — Admin',
  robots: 'noindex, nofollow',
};

export default function InstagramAdminPage() {
  // Block access if ADMIN_SECRET is set and this is a server render
  // (client-side auth is handled by InstagramPublisher via API calls)
  const adminKey = process.env.ADMIN_SECRET ?? '';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://freerangedemocracy.com';

  // Redirect to home if no admin secret is configured in production
  if (!adminKey && process.env.NODE_ENV === 'production') {
    redirect('/');
  }

  return (
    <div className="ig-admin-page">
      <header className="ig-admin-header">
        <h1 className="ig-admin-title">
          <span className="ig-admin-icon">📸</span>
          Instagram Publisher
        </h1>
        <p className="ig-admin-subtitle">
          Post images to @freerangedemocracy directly from the site
        </p>
      </header>

      <InstagramPublisher siteUrl={siteUrl} adminKey={adminKey} />
    </div>
  );
}
