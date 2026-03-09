import { NextRequest, NextResponse } from 'next/server';
import { isConfigured, publishImagePost, publishCarouselPost } from '@/lib/instagram';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // No secret set — open in dev
  const header = req.headers.get('x-admin-secret');
  const query = new URL(req.url).searchParams.get('key');
  return header === secret || query === secret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'Instagram API is not configured. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID.' },
      { status: 503 }
    );
  }

  let body: { imageUrl?: string; imageUrls?: string[]; caption?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { imageUrl, imageUrls, caption = '' } = body;

  if (!imageUrl && (!imageUrls || imageUrls.length === 0)) {
    return NextResponse.json({ error: 'imageUrl or imageUrls is required' }, { status: 400 });
  }

  // Validate URLs are HTTPS
  const urls = imageUrls ?? (imageUrl ? [imageUrl] : []);
  for (const url of urls) {
    if (!url.startsWith('https://')) {
      return NextResponse.json(
        { error: `Image URL must be HTTPS and publicly accessible: ${url}` },
        { status: 400 }
      );
    }
  }

  try {
    const result =
      urls.length === 1
        ? await publishImagePost(urls[0], caption)
        : await publishCarouselPost(urls, caption);

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
