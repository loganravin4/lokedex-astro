import { useEffect, useState } from 'react';
import type { SpotifyTrack } from '../../lib/spotify';

// Compact now-playing readout for the trainer card (DATA screen).

const NOW_PLAYING_ENDPOINT = '/api/spotify/now-playing';
const BAR_COUNT = 4;

// Returns the normalized track, or null on anything that isn't active playback
function fetchNowPlaying(): Promise<SpotifyTrack | null> {
  return fetch(NOW_PLAYING_ENDPOINT)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
}

// CSS equalizer -- BAR_COUNT bars. Animating (per-bar height + stagger) while
// playing, flat and short when idle. Animation lives in inline style because a
// custom keyframe with per-bar timing isn't expressible as a Tailwind class
function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div className="flex h-[12px] items-end gap-[2px]" aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <span
          key={i}
          className="equalizer-bar w-[3px] bg-[var(--color-poke-grass)]"
          style={
            playing
              ? {
                  height: '100%',
                  animation: `equalizer ${0.6 + i * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }
              : { height: '30%' }
          }
        />
      ))}
    </div>
  );
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);

  // Initial fetch on mount
  useEffect(() => {
    let active = true;
    fetchNowPlaying().then((t) => {
      if (active) setTrack(t);
    });
    return () => {
      active = false;
    };
  }, []);

  const isPlaying = !!track?.isPlaying;

  // While playing: refresh as the current track is about to end (so the next
  // song appears promptly), capped at 30s to also catch manual skips. Skipped
  // while the tab is hidden
  useEffect(() => {
    if (!isPlaying || document.hidden) return;
    const remaining = (track?.durationMs ?? 0) - (track?.progressMs ?? 0);
    const delay = Math.min((remaining > 0 ? remaining : 30_000) + 2_000, 30_000);
    const id = setTimeout(() => {
      if (document.hidden) return;
      fetchNowPlaying().then(setTrack);
    }, delay);
    return () => clearTimeout(id);
  }, [isPlaying, track?.id, track?.progressMs, track?.durationMs]);

  // While idle: poll every 60s so playback that starts later gets picked up
  useEffect(() => {
    if (isPlaying) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      fetchNowPlaying().then((t) => {
        if (t?.isPlaying) setTrack(t);
      });
    }, 60_000);
    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <div style={{ fontFamily: 'var(--font-family-mono)' }}>
      <div className="my-3 h-px bg-[var(--detail-divider)]" />

      <div className="flex items-center gap-2">
        <Equalizer playing={isPlaying} />
        <span
          className="text-[length:var(--text-screen-xs)] tracking-[0.05em] text-[color:var(--detail-heading)]"
          style={{ fontFamily: 'var(--font-family-pokemon)' }}
        >
          {isPlaying ? 'NOW PLAYING' : 'SPOTIFY'}
        </span>
      </div>

      <div className="mt-1">
        {isPlaying && track ? (
          <>
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-[length:var(--text-screen-sm)] text-[color:var(--list-name)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
            >
              {track.name}
            </a>
            <span className="block truncate text-[length:var(--text-screen-xs)] text-[color:var(--detail-muted)]">
              {track.artist}
            </span>
          </>
        ) : (
          <span className="text-[length:var(--text-screen-sm)] text-[color:var(--detail-muted)]">
            NOT PLAYING
          </span>
        )}
      </div>
    </div>
  );
}
