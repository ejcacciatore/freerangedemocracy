import { NextRequest, NextResponse } from 'next/server';
import { isConfigured, refreshLongLivedToken } from '@/lib/instagram';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const header = req.headers.get('x-admin-secret');
  const query = new URL(req.url).searchParams.get('key');
  return header === secret || query === secret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isConfigured()) {
    return NextResponse.json({ error: 'Instagram API is not configured.' }, { status: 503 });
  }

  try {
    const result = await refreshLongLivedToken();
    return NextResponse.json({
      success: true,
      message: 'Token refreshed. Update your INSTAGRAM_ACCESS_TOKEN env var with the new token.',
      newToken: result.access_token,
      expiresInDays: Math.floor(result.expires_in / 86400),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
