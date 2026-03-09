/**
 * Instagram Graph API client
 * Docs: https://developers.facebook.com/docs/instagram-api/
 *
 * Required env vars:
 *   INSTAGRAM_ACCESS_TOKEN  — Long-lived user access token
 *   INSTAGRAM_USER_ID       — Instagram Business/Creator user ID
 *   INSTAGRAM_APP_ID        — Meta App ID (for token debug)
 *   INSTAGRAM_APP_SECRET    — Meta App Secret (for token debug + refresh)
 *   NEXT_PUBLIC_SITE_URL    — Public site URL (for image URLs)
 */

const IG_API = 'https://graph.facebook.com/v21.0';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN is not set');
  return token;
}

function getUserId(): string {
  const id = process.env.INSTAGRAM_USER_ID;
  if (!id) throw new Error('INSTAGRAM_USER_ID is not set');
  return id;
}

async function igFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${IG_API}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts?.headers },
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `Instagram API error (${res.status})`);
  }
  return json;
}

// ─── Account ──────────────────────────────────────────────────────────────────

export interface IgAccount {
  id: string;
  username: string;
  name: string;
  followers_count: number;
  media_count: number;
  profile_picture_url?: string;
}

export async function getAccountInfo(): Promise<IgAccount> {
  const token = getToken();
  const userId = getUserId();
  return igFetch(
    `/${userId}?fields=id,username,name,followers_count,media_count,profile_picture_url&access_token=${token}`
  );
}

// ─── Token ────────────────────────────────────────────────────────────────────

export interface TokenDebug {
  app_id: string;
  is_valid: boolean;
  expires_at: number;
  scopes: string[];
  error?: { code: number; message: string };
}

export async function debugToken(): Promise<TokenDebug> {
  const token = getToken();
  const appId = process.env.INSTAGRAM_APP_ID ?? '';
  const appSecret = process.env.INSTAGRAM_APP_SECRET ?? '';
  const appToken = `${appId}|${appSecret}`;
  const data = await igFetch(`/debug_token?input_token=${token}&access_token=${appToken}`);
  return data.data as TokenDebug;
}

export interface RefreshResult {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/** Refreshes a long-lived token (valid for another 60 days). */
export async function refreshLongLivedToken(): Promise<RefreshResult> {
  const token = getToken();
  const appSecret = process.env.INSTAGRAM_APP_SECRET ?? '';
  const data = await igFetch(
    `/oauth/access_token?grant_type=ig_refresh_token&access_token=${token}&client_secret=${appSecret}`
  );
  return data as RefreshResult;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface IgPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export async function getRecentPosts(limit = 9): Promise<IgPost[]> {
  const token = getToken();
  const userId = getUserId();
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const data = await igFetch(
    `/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`
  );
  return (data.data as IgPost[]) ?? [];
}

// ─── Publishing ───────────────────────────────────────────────────────────────

export interface PublishResult {
  containerId: string;
  postId: string;
  permalink: string;
}

/**
 * Publishes a single image post to Instagram.
 * imageUrl must be a publicly accessible HTTPS URL.
 */
export async function publishImagePost(
  imageUrl: string,
  caption: string
): Promise<PublishResult> {
  const token = getToken();
  const userId = getUserId();

  // Step 1 — Create media container
  const container = await igFetch(`/${userId}/media`, {
    method: 'POST',
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
  });
  const containerId: string = container.id;

  // Step 2 — Poll container status until it's FINISHED
  await waitForContainer(containerId, token);

  // Step 3 — Publish the container
  const published = await igFetch(`/${userId}/media_publish`, {
    method: 'POST',
    body: JSON.stringify({ creation_id: containerId, access_token: token }),
  });
  const postId: string = published.id;

  // Step 4 — Fetch permalink
  const media = await igFetch(`/${postId}?fields=permalink&access_token=${token}`);

  return { containerId, postId, permalink: media.permalink };
}

/** Polls the container status until FINISHED or ERRORED (max 30 s). */
async function waitForContainer(containerId: string, token: string): Promise<void> {
  const maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(3000);
    const status = await igFetch(
      `/${containerId}?fields=status_code&access_token=${token}`
    );
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR') {
      throw new Error(`Media container processing failed: ${status.status_code}`);
    }
  }
  throw new Error('Media container timed out after 30s');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

/**
 * Publishes a carousel post (2–10 images).
 * imageUrls must all be publicly accessible HTTPS URLs.
 */
export async function publishCarouselPost(
  imageUrls: string[],
  caption: string
): Promise<PublishResult> {
  if (imageUrls.length < 2 || imageUrls.length > 10) {
    throw new Error('Carousel requires 2–10 images');
  }
  const token = getToken();
  const userId = getUserId();

  // Create individual item containers
  const itemIds = await Promise.all(
    imageUrls.map(async (url) => {
      const c = await igFetch(`/${userId}/media`, {
        method: 'POST',
        body: JSON.stringify({ image_url: url, is_carousel_item: true, access_token: token }),
      });
      return c.id as string;
    })
  );

  // Create carousel container
  const carousel = await igFetch(`/${userId}/media`, {
    method: 'POST',
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: itemIds.join(','),
      caption,
      access_token: token,
    }),
  });
  const containerId: string = carousel.id;

  await waitForContainer(containerId, token);

  const published = await igFetch(`/${userId}/media_publish`, {
    method: 'POST',
    body: JSON.stringify({ creation_id: containerId, access_token: token }),
  });
  const postId: string = published.id;

  const media = await igFetch(`/${postId}?fields=permalink&access_token=${token}`);
  return { containerId, postId, permalink: media.permalink };
}

// ─── Config check ─────────────────────────────────────────────────────────────

export function isConfigured(): boolean {
  return !!(
    process.env.INSTAGRAM_ACCESS_TOKEN &&
    process.env.INSTAGRAM_USER_ID
  );
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://freerangedemocracy.com'
  );
}
