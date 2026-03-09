'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Account {
  username: string;
  name: string;
  followers_count: number;
  media_count: number;
  profile_picture_url?: string;
}

interface TokenInfo {
  is_valid: boolean;
  expires_at: number;
  scopes: string[];
}

interface IgPost {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface StatusData {
  configured: boolean;
  account?: Account;
  token?: TokenInfo;
  recentPosts?: IgPost[];
  error?: string;
}

// ─── Site images available for posting ───────────────────────────────────────

const SITE_IMAGES = [
  { src: '/images/Gemini_Generated_Image_p5hih6p5hih6p5hi.png', label: 'The Rooster' },
  { src: '/images/Gemini_Generated_Image_nvinornvinornvin.png', label: 'Rooster Guard' },
  { src: '/images/Gemini_Generated_Image_q59986q59986q599.png', label: 'Hero Scene' },
  { src: '/images/grok-image-0ec0b9b2-8831-4c25-b7a8-bb3437c043b0.png', label: 'Guardian of Nest Egg' },
  { src: '/images/grok-image-618e2f04-4963-4fee-974f-c108c84e7cfd.png', label: 'Watchful Chick' },
  { src: '/images/grok-image-0eeadfcd-b17b-4705-b227-83e99053458c.png', label: 'FRD Banner' },
  { src: '/images/grok-image-19177d63-f7d6-4ad7-b4b8-d9b3bf81b84b.png', label: 'Introduction BG' },
  { src: '/images/grok-image-25e5994f-95d2-40ed-8376-9fa8e463fbdc.png', label: 'The Coop BG' },
  { src: '/images/grok-image-54a17304-97f1-4b28-99be-5bfe7ff4c637.png', label: 'The Food BG' },
  { src: '/images/grok-image-2d7f3690-3950-439d-92df-d6c5da1e5822.png', label: 'Editorial Art' },
  { src: '/images/grok-image-940a83a6-f140-4a62-a4a7-34cc3a647af0.png', label: 'Art 2' },
  { src: '/images/grok-image-f783dc3e-4914-4831-9759-f24dc16a2540.png', label: 'Art 3' },
];

const SUGGESTED_HASHTAGS = [
  '#FreeRangeDemocracy', '#Liberty', '#Democracy', '#Freedom',
  '#CivicEngagement', '#IndependentMedia', '#Politics',
  '#SmallGovernment', '#Constitution', '#PatriotVoice',
  '#WeThePeople', '#AmericaFirst', '#CivicDuty',
];

const MAX_CAPTION = 2200;
const MAX_HASHTAGS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(unixSec: number) {
  return Math.max(0, Math.floor((unixSec * 1000 - Date.now()) / 86_400_000));
}

function countHashtags(text: string) {
  return (text.match(/#\w+/g) ?? []).length;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  siteUrl: string;
  adminKey: string;
}

export default function InstagramPublisher({ siteUrl, adminKey }: Props) {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');

  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ permalink?: string; error?: string } | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<string | null>(null);

  // Load status on mount
  useEffect(() => {
    fetch('/api/instagram/status')
      .then((r) => r.json())
      .then((d) => setStatus(d))
      .catch(() => setStatus({ configured: false, error: 'Failed to reach API' }))
      .finally(() => setLoading(false));
  }, []);

  // Build the full caption
  const fullCaption = [caption, hashtagInput].filter(Boolean).join('\n\n');
  const hashtagCount = countHashtags(fullCaption);
  const charCount = fullCaption.length;
  const isOverLimit = charCount > MAX_CAPTION || hashtagCount > MAX_HASHTAGS;

  // Resolve the image URL to post
  const imagePathToPost = customUrl || selectedImage;
  const imageUrlToPost = imagePathToPost
    ? imagePathToPost.startsWith('http')
      ? imagePathToPost
      : `${siteUrl}${imagePathToPost}`
    : null;
  const isDevUrl = imageUrlToPost?.includes('localhost');

  async function handlePublish() {
    if (!imageUrlToPost || isOverLimit || isDevUrl) return;
    setPublishing(true);
    setResult(null);
    try {
      const res = await fetch('/api/instagram/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminKey,
        },
        body: JSON.stringify({ imageUrl: imageUrlToPost, caption: fullCaption }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ permalink: data.permalink });
        setCaption('');
        setHashtagInput('');
        setSelectedImage(null);
        setCustomUrl('');
        // Reload status to show new post
        fetch('/api/instagram/status').then((r) => r.json()).then(setStatus);
      } else {
        setResult({ error: data.error });
      }
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setPublishing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    setRefreshResult(null);
    try {
      const res = await fetch('/api/instagram/refresh', {
        method: 'POST',
        headers: { 'x-admin-secret': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        setRefreshResult(`✓ New token (expires in ${data.expiresInDays} days): ${data.newToken}`);
      } else {
        setRefreshResult(`✗ ${data.error}`);
      }
    } finally {
      setRefreshing(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="ig-admin-loading">
        <span className="ig-spinner" />
        Connecting to Instagram API…
      </div>
    );
  }

  return (
    <div className="ig-admin">
      {/* ── Account Status ───────────────────────────────────────── */}
      <div className="ig-status-bar">
        <div className="ig-status-left">
          {status?.account?.profile_picture_url && (
            <Image
              src={status.account.profile_picture_url}
              alt={status.account.username}
              width={40}
              height={40}
              className="ig-avatar"
            />
          )}
          <div className="ig-account-info">
            {status?.configured && status.account ? (
              <>
                <span className="ig-username">@{status.account.username}</span>
                <span className="ig-stats">
                  {status.account.followers_count.toLocaleString()} followers
                  &nbsp;·&nbsp;
                  {status.account.media_count.toLocaleString()} posts
                </span>
              </>
            ) : (
              <span className="ig-not-configured">
                {status?.error ?? 'Instagram not configured'}
              </span>
            )}
          </div>
        </div>

        <div className="ig-status-right">
          {status?.token && (
            <span className={`ig-token-badge ${status.token.is_valid ? 'valid' : 'expired'}`}>
              {status.token.is_valid
                ? `● Token valid · ${daysUntil(status.token.expires_at)}d left`
                : '● Token expired'}
            </span>
          )}
          {status?.configured && (
            <button
              className="ig-btn-sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? '…' : '↻ Refresh Token'}
            </button>
          )}
        </div>
      </div>

      {refreshResult && (
        <div className={`ig-refresh-result ${refreshResult.startsWith('✓') ? 'success' : 'error'}`}>
          {refreshResult}
        </div>
      )}

      {!status?.configured && (
        <div className="ig-setup-notice">
          <strong>Setup required.</strong> Add these to your <code>.env.local</code>:
          <pre>{`INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
INSTAGRAM_USER_ID=your_ig_user_id
INSTAGRAM_APP_ID=your_meta_app_id
INSTAGRAM_APP_SECRET=your_meta_app_secret
ADMIN_SECRET=your_chosen_admin_password`}</pre>
        </div>
      )}

      {/* ── Publisher ────────────────────────────────────────────── */}
      <div className="ig-publisher">

        {/* Left: Compose */}
        <div className="ig-compose">

          {/* 1. Image picker */}
          <section className="ig-section">
            <h2 className="ig-section-title">
              <span className="ig-step">01</span> Select Image
            </h2>
            <div className="ig-image-grid">
              {SITE_IMAGES.map((img) => (
                <button
                  key={img.src}
                  className={`ig-image-btn ${selectedImage === img.src ? 'selected' : ''}`}
                  onClick={() => { setSelectedImage(img.src); setCustomUrl(''); }}
                  title={img.label}
                >
                  <Image
                    src={img.src}
                    alt={img.label}
                    width={120}
                    height={80}
                    className="ig-image-thumb"
                  />
                  <span className="ig-image-label">{img.label}</span>
                </button>
              ))}
            </div>

            <div className="ig-custom-url">
              <label className="ig-label">Or use a custom image URL</label>
              <input
                type="url"
                className="ig-input"
                placeholder="https://freerangedemocracy.com/images/..."
                value={customUrl}
                onChange={(e) => { setCustomUrl(e.target.value); setSelectedImage(null); }}
              />
            </div>

            {isDevUrl && (
              <p className="ig-warn">
                ⚠ Localhost URLs can&apos;t be fetched by Instagram. Deploy to production or use a public URL.
              </p>
            )}
          </section>

          {/* 2. Caption */}
          <section className="ig-section">
            <h2 className="ig-section-title">
              <span className="ig-step">02</span> Write Caption
            </h2>
            <textarea
              className="ig-textarea"
              rows={6}
              placeholder={"The Rooster's back. 🐓\n\nNew site. New look. Same mission.\n\n→ Link in bio"}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </section>

          {/* 3. Hashtags */}
          <section className="ig-section">
            <h2 className="ig-section-title">
              <span className="ig-step">03</span> Hashtags
              <span className="ig-hashtag-count">
                {hashtagCount}/{MAX_HASHTAGS}
              </span>
            </h2>
            <textarea
              className="ig-textarea ig-textarea-sm"
              rows={3}
              placeholder="#FreeRangeDemocracy #Liberty #Democracy"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
            />
            <div className="ig-hashtag-suggestions">
              {SUGGESTED_HASHTAGS.map((tag) => (
                <button
                  key={tag}
                  className="ig-tag-pill"
                  onClick={() => {
                    if (!hashtagInput.includes(tag)) {
                      setHashtagInput((h) => h ? `${h} ${tag}` : tag);
                    }
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Char count + publish */}
          <div className="ig-publish-bar">
            <span className={`ig-char-count ${charCount > MAX_CAPTION * 0.9 ? 'warning' : ''}`}>
              {charCount.toLocaleString()} / {MAX_CAPTION.toLocaleString()} chars
            </span>
            <button
              className="ig-publish-btn"
              onClick={handlePublish}
              disabled={!imageUrlToPost || !status?.configured || publishing || isOverLimit || isDevUrl}
            >
              {publishing ? (
                <><span className="ig-spinner-sm" /> Publishing…</>
              ) : (
                '📸 Publish to Instagram'
              )}
            </button>
          </div>

          {result?.permalink && (
            <div className="ig-result success">
              ✓ Posted!{' '}
              <a href={result.permalink} target="_blank" rel="noopener noreferrer">
                View on Instagram →
              </a>
            </div>
          )}
          {result?.error && (
            <div className="ig-result error">✗ {result.error}</div>
          )}
        </div>

        {/* Right: Preview + Recent Posts */}
        <div className="ig-sidebar">

          {/* Preview */}
          <section className="ig-section">
            <h2 className="ig-section-title">Preview</h2>
            <div className="ig-preview">
              <div className="ig-preview-image">
                {(selectedImage || customUrl) ? (
                  <Image
                    src={selectedImage || customUrl}
                    alt="Preview"
                    fill
                    className="ig-preview-img"
                    unoptimized={customUrl.startsWith('http')}
                  />
                ) : (
                  <div className="ig-preview-placeholder">Select an image</div>
                )}
              </div>
              {fullCaption && (
                <div className="ig-preview-caption">
                  <span className="ig-preview-handle">@freerangedemocracy</span>
                  <p>{fullCaption.slice(0, 200)}{fullCaption.length > 200 ? '…' : ''}</p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Posts */}
          {status?.recentPosts && status.recentPosts.length > 0 && (
            <section className="ig-section">
              <h2 className="ig-section-title">Recent Posts</h2>
              <div className="ig-recent-grid">
                {status.recentPosts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-recent-item"
                    title={post.caption?.slice(0, 60)}
                  >
                    {(post.media_url || post.thumbnail_url) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.thumbnail_url ?? post.media_url}
                        alt=""
                        className="ig-recent-img"
                      />
                    )}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
