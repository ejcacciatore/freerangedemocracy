import { NextResponse } from 'next/server';
import { isConfigured, getAccountInfo, debugToken, getRecentPosts } from '@/lib/instagram';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({
      configured: false,
      error: 'INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID are not set.',
    });
  }

  try {
    const [account, token, recentPosts] = await Promise.allSettled([
      getAccountInfo(),
      debugToken(),
      getRecentPosts(6),
    ]);

    return NextResponse.json({
      configured: true,
      account: account.status === 'fulfilled' ? account.value : null,
      token: token.status === 'fulfilled' ? token.value : null,
      recentPosts: recentPosts.status === 'fulfilled' ? recentPosts.value : [],
      errors: {
        account: account.status === 'rejected' ? account.reason?.message : null,
        token: token.status === 'rejected' ? token.reason?.message : null,
        recentPosts: recentPosts.status === 'rejected' ? recentPosts.reason?.message : null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ configured: true, error: message }, { status: 500 });
  }
}
