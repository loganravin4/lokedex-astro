import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel serverless function (Node runtime). Lives in /api (outside src/) so Vercel
// deploys it as a function and it stays out of the Vite client bundle and tsconfig.
//
// Secrets never reach the browser: SPOTIFY_CLIENT_ID / SECRET / REFRESH_TOKEN are
// read from process.env, exchanged for a short-lived access token, and only the
// normalized track is returned. On ANY failure it returns 200 + null so the widget
// shows NOT PLAYING instead of surfacing an error.
//
// @vercel/node is a type-only import (erased at build), provided by Vercel's build;
// for local editor types run `npm i -D @vercel/node`.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  const nothing = () => res.status(200).json(null);

  if (!clientId || !clientSecret || !refreshToken) return nothing();

  try {
    // Refresh-token grant → short-lived access token.
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    if (!tokenRes.ok) return nothing();

    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const playingRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    // 204 = nothing playing; any non-OK → fall back to NOT PLAYING.
    if (playingRes.status === 204 || !playingRes.ok) return nothing();

    const data = (await playingRes.json()) as any;
    if (!data?.item) return nothing();

    const track = {
      id: data.item.id,
      name: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(', '),
      album: data.item.album.name,
      albumArt: data.item.album.images?.[0]?.url || '',
      url: data.item.external_urls.spotify,
      isPlaying: data.is_playing,
      progressMs: data.progress_ms || 0,
      durationMs: data.item.duration_ms || 0,
      releaseDate: data.item.album.release_date || '',
    };

    res.setHeader('Cache-Control', 'public, max-age=5');
    return res.status(200).json(track);
  } catch {
    return nothing();
  }
}
