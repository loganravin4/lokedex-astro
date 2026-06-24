import { useEffect, useRef, useState } from 'react';
import type { AnimationState } from '../../types/pokedex';
import { usePokedex } from '../../hooks/usePokedex';
import { useSanityData } from '../../hooks/useSanityData';
import { buildEntries } from '../../lib/buildEntries';
import ClosedCover from './ClosedCover';
import HingeAnimation from './HingeAnimation';
import BootSequence from './BootSequence';
import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';
import ListPanel from '../screens/ListPanel';
import DetailPanel from '../screens/DetailPanel';

// Outer plastic housing. Centers the device on the dark backdrop and renders
// one of the four animationState views (Section 7 / Section 8):
//   'closed'  → <ClosedCover />, which owns the open interaction + sound
//   'opening' → <HingeAnimation />, the 3D fold (Section 9 "Opening fold")
//   'booting' → open shell with the boot sequence (wired up in Task 8)
//   'ready'   → open shell, fully interactive (Task 9+)
// The static open layout (booting/ready) mirrors HingeAnimation's final frame
// exactly so there is no layout jump when the fold settles.
//
// animationState stays local here — it is view/animation state, not the shared
// content state that lives in usePokedex.
export default function PokedexShell() {
  const [animationState, setAnimationState] = useState<AnimationState>('closed');
  const { isMuted, toggleMute, activeSection, selectedEntry, setSelectedEntry } =
    usePokedex();

  // Single Sanity fetch for the whole app, intentionally hoisted here.
  // Section 12 mandates the data is "fetched once on mount" — do NOT move this
  // into ListPanel/RightHalf as a per-component useSanityData call. Both the
  // list (ListPanel) and the hardware selection (RightHalf) must index into the
  // SAME entries array for focusedIndex to line up, and two callers would mean
  // two fetches. The fetch kicks off while the cover is still closed, so data
  // is ready by the time the boot sequence finishes.
  const { projects, experiences, loading, error } = useSanityData();
  const entries = buildEntries(activeSection, projects, experiences);

  // Hash resolution (Task 9 NOTE / usePokedex parseHash): the hash parser stores
  // the raw segment as selectedEntry, which for a hand-authored/shared
  // #projects/<slug> link is a slug, not an _id. Once data lands, resolve a
  // slug to its _id exactly once. Experiences have no slug field, so their hash
  // segment is always already an _id and needs no resolution.
  const resolvedSlugRef = useRef(false);
  useEffect(() => {
    if (loading || resolvedSlugRef.current) return;
    resolvedSlugRef.current = true;

    if (!selectedEntry) return;
    // Already a known _id? nothing to resolve.
    const isKnownId =
      projects.some((p) => p._id === selectedEntry) ||
      experiences.some((e) => e._id === selectedEntry);
    if (isKnownId) return;

    const bySlug = projects.find((p) => p.slug?.current === selectedEntry);
    if (bySlug) setSelectedEntry(bySlug._id);
  }, [loading, projects, experiences, selectedEntry, setSelectedEntry]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--page-bg)]">
      <div className="relative">
        {animationState === 'closed' && (
          <ClosedCover onOpen={() => setAnimationState('opening')} isMuted={isMuted} />
        )}

        {animationState === 'opening' && (
          <HingeAnimation onComplete={() => setAnimationState('booting')} />
        )}

        {(animationState === 'booting' || animationState === 'ready') && (
          <div className="pokedex-shell w-[var(--device-width)] h-[var(--device-height)] flex flex-row items-stretch">
            <LeftHalf
              listContent={
                animationState === 'booting' ? (
                  <BootSequence
                    onComplete={() => setAnimationState('ready')}
                    isMuted={isMuted}
                  />
                ) : (
                  <ListPanel entries={entries} loading={loading} error={error} />
                )
              }
            />
            <Hinge />
            {/* isReady gates D-pad input so arrow keys / arm clicks during the
                boot sequence don't move the (not-yet-visible) list cursor.
                detailContent is the right-screen DetailPanel — only mounted once
                ready; the boot render leaves the right screen empty. */}
            <RightHalf
              isReady={animationState === 'ready'}
              entries={entries}
              detailContent={
                animationState === 'ready' ? (
                  <DetailPanel projects={projects} experiences={experiences} />
                ) : undefined
              }
            />
          </div>
        )}

        {/* Global mute toggle (Section 7 / Section 10): lives on the shell,
            top-right of the device. Hidden on the closed cover — no controls
            there. */}
        {animationState !== 'closed' && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="absolute top-[14px] right-[14px] z-20 cursor-pointer bg-transparent text-[length:var(--text-hw-xs)] text-[color:var(--detail-muted)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
            style={{ fontFamily: 'var(--font-family-pokemon)' }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        )}
      </div>
    </div>
  );
}
