import { lazy, Suspense, useCallback, useState } from 'react';

// The 3D viewer (three.js, the shader, the decoder) is a separate chunk. It only downloads
// when a stone with a digital twin is opened, so every other page stays light.
const ThreeOpalViewer = lazy(() =>
  import('./ThreeOpalViewer').then((m) => ({ default: m.ThreeOpalViewer }))
);

type StoneTwinProps = {
  /** URL of the twin's .glb. Its two flash images sit beside it: <name>_flash.png and <name>_domain.png */
  model: string;
  /** Still photo of the stone. Shown while the model loads, and kept if 3D is not possible. */
  poster: string;
  alt: string;
  /**
   * 'none': full turn-and-tilt with a finger, but a swipe on the stone will not scroll the page.
   * 'pan-y': a vertical swipe scrolls the page, a sideways swipe turns the stone.
   */
  touchAction?: 'none' | 'pan-y';
  /** Allow wheel / pinch zoom. Off by default so the page still scrolls under the pointer. */
  enableZoom?: boolean;
  /** Show the small "drag to turn" line until the first touch. */
  hint?: boolean;
  className?: string;
};

/**
 * A digital twin on a shop or detail page: the real photo first, the live stone fading in
 * over it once it is ready. If WebGL is missing, the model will not load, or the phone drops
 * the graphics context, the photo simply stays.
 */
export function StoneTwin({
  model,
  poster,
  alt,
  touchAction = 'none',
  enableZoom = false,
  hint = true,
  className = '',
}: StoneTwinProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => setFailed(true), []);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onPointerDown={() => setTouched(true)}
    >
      {/* Photo: the first thing seen, and the fallback */}
      <img
        src={poster}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-contain cinematic-image drop-shadow-2xl mix-blend-lighten transition-opacity duration-[1400ms] ease-out ${
          ready && !failed ? 'opacity-0' : 'opacity-100'
        }`}
        referrerPolicy="no-referrer"
        draggable={false}
      />

      {/* Live stone */}
      {!failed && (
        <div
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          role="img"
          aria-label={`${alt}. Drag to turn the stone and watch the play of colour move.`}
        >
          <Suspense fallback={null}>
            <ThreeOpalViewer
              modelUrl={model}
              showInstruments={false}
              proceduralFallback={false}
              enableZoom={enableZoom}
              touchAction={touchAction}
              fitWidth
              onReady={handleReady}
              onLoadError={handleError}
            />
          </Suspense>
        </div>
      )}

      {/* One quiet line telling people the stone can be handled */}
      {hint && ready && !failed && (
        <p
          className={`pointer-events-none absolute bottom-0 left-0 right-0 text-center font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 transition-opacity duration-1000 ${
            touched ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Drag to turn the stone &middot; one lamp, held still
        </p>
      )}
    </div>
  );
}
