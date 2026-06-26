import { useEffect, useRef, useState } from 'react';
import type { AnimationState } from '../../types/pokedex';
import { usePokedex } from '../../hooks/usePokedex';
import { useSynth } from '../../hooks/useSynth';
import { useSanityData } from '../../hooks/useSanityData';
import { buildEntries } from '../../lib/buildEntries';
import ClosedCover from './ClosedCover';
import HingeAnimation from './HingeAnimation';
import CloseAnimation from './CloseAnimation';
import BootSequence from './BootSequence';
import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';
import ListPanel from '../screens/ListPanel';
import DetailPanel from '../screens/DetailPanel';

// Outer plastic housing; renders the active animationState view. The static open
// layout (booting/ready) mirrors HingeAnimation's final frame so there's no layout jump.
export default function PokedexShell() {
  // Mobile (< 768px) skips the closed cover + fold and boots straight in. innerWidth
  // is read once at mount (orientation is fixed on load, no resize listener needed).
  // openFold never fires on mobile, so the boot arpeggio stays silent (autoplay blocks it).
  const [animationState, setAnimationState] = useState<AnimationState>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'booting' : 'closed',
  );
  const {
    isMuted,
    toggleMute,
    activeSection,
    selectedEntry,
    setSelectedEntry,
    setFocusedIndex,
  } = usePokedex();
  const synth = useSynth(isMuted);

  // Play the confirmation blip BEFORE flipping state so the user always hears it;
  // muteToggle bypasses the mute gate, so it sounds even while muted.
  const handleMuteToggle = () => {
    void synth.muteToggle(isMuted);
    toggleMute();
  };

  // Close gesture (× / Escape): reset cursor/selection so the device reopens fresh, then fold.
  const handleClose = () => {
    synth.back();
    setSelectedEntry(null);
    setFocusedIndex(0);
    setAnimationState('closing');
  };

  // Escape closes the device when open; the ref keeps animationState fresh so the
  // once-registered handler never goes stale.
  const animationStateRef = useRef(animationState);
  animationStateRef.current = animationState;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const state = animationStateRef.current;
      if (state === 'booting' || state === 'ready') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Single Sanity fetch for the whole app, hoisted here on purpose. Do NOT move it
  // into ListPanel/RightHalf as per-component calls: both must index into the SAME
  // entries array for focusedIndex to line up, and two callers would mean two fetches.
  const { projects, experiences, loading, error } = useSanityData();
  const entries = buildEntries(activeSection, projects, experiences);

  // A shared #projects/<slug> link stores a slug (not an _id) as selectedEntry;
  // resolve it to an _id once data loads. Experience hashes are already _ids.
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

        {animationState === 'closing' && (
          <CloseAnimation onComplete={() => setAnimationState('closed')} />
        )}

        {(animationState === 'booting' || animationState === 'ready') && (
          <div className="pokedex-shell flex items-stretch flex-col md:flex-row w-[100vw] h-[100vh] md:w-[var(--device-width)] md:h-[var(--device-height)]">
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
            {/* isReady gates D-pad input during boot so stray keys don't move the
                hidden cursor; detailContent mounts only once ready. */}
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

        {/* Close button, top-left, kept clear of the sensor eye. */}
        {(animationState === 'booting' || animationState === 'ready') && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-[14px] left-[34px] z-20 cursor-pointer bg-transparent text-[length:var(--text-hw-xs)] text-[color:var(--detail-muted)] transition-colors duration-100 hover:text-[var(--color-poke-yellow)]"
            style={{ fontFamily: 'var(--font-family-pokemon)' }}
          >
            ×
          </button>
        )}

        {/* Global mute toggle. Hidden on the closed cover. */}
        {animationState !== 'closed' && (
          <button
            type="button"
            onClick={handleMuteToggle}
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
