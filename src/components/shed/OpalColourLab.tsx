import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCcw } from 'lucide-react';

/**
 * Educational, idealised close-packed silica lattice — not a digital twin of a real opal.
 * First-order (111) Bragg/photonic-stop-band approximation, with:
 *   d111 = sqrt(2/3) * D
 *   lambda = 2 * d111 * sqrt(nEffective^2 - sin(thetaExternal)^2)
 *
 * nEffective = 1.33 is an illustrative effective refractive index for a
 * silica-sphere/void system. Natural opals have variable geometry, void fillings
 * and domain orientations; this module must never be used to grade a stone.
 *
 * Background:
 * https://australian.museum/learn/minerals/gemstones/opal/
 * https://energymining.sa.gov.au/industry/minerals-and-mining/mineral-commodities/opal
 */
const EFFECTIVE_INDEX = 1.33;
const CLOSE_PACKED_LAYER_FACTOR = Math.sqrt(2 / 3);

type Sphere = { x: number; y: number; key: string; depth: number };

function sphereField(ordered: boolean): Sphere[] {
  const spheres: Sphere[] = [];
  // Three close-packed layers; offsets only become irregular when order is lost.
  for (let layer = 0; layer < 3; layer += 1) {
    for (let row = 0; row < 6; row += 1) {
      for (let column = 0; column < 8; column += 1) {
        const index = layer * 48 + row * 8 + column;
        const jitterX = ordered ? 0 : Math.sin(index * 14.17) * 19;
        const jitterY = ordered ? 0 : Math.cos(index * 9.71) * 17;
        spheres.push({
          key: `${layer}-${row}-${column}`,
          x: 150 + column * 43 + (row % 2) * 21.5 + layer * 21 + jitterX,
          y: 100 + row * 39 - layer * 20 + jitterY,
          depth: layer,
        });
      }
    }
  }
  return spheres;
}

function peakWavelength(diameter: number, angle: number): number {
  const radians = (angle * Math.PI) / 180;
  const internal = Math.sqrt(EFFECTIVE_INDEX ** 2 - Math.sin(radians) ** 2);
  return 2 * CLOSE_PACKED_LAYER_FACTOR * diameter * internal;
}

/** Approximate display colour, not a spectrum or a measurement of a specimen. */
function lightColour(nm: number): string {
  if (nm < 380 || nm > 750) return '#9da4aa';
  const stops: Array<[number, [number, number, number]]> = [
    [380, [129, 73, 209]], [440, [63, 87, 239]], [485, [28, 160, 231]],
    [515, [34, 201, 169]], [550, [88, 207, 86]], [580, [219, 210, 60]],
    [605, [247, 155, 49]], [645, [234, 74, 47]], [750, [155, 36, 34]],
  ];
  for (let i = 0; i < stops.length - 1; i += 1) {
    const [a, first] = stops[i];
    const [b, second] = stops[i + 1];
    if (nm <= b) {
      const t = (nm - a) / (b - a);
      return `rgb(${first.map((v, ch) => Math.round(v + (second[ch] - v) * t)).join(',')})`;
    }
  }
  return '#9da4aa';
}

function colourName(nm: number): string {
  if (nm < 380) return 'Beyond visible violet';
  if (nm < 450) return 'Violet';
  if (nm < 490) return 'Blue';
  if (nm < 520) return 'Blue-green';
  if (nm < 570) return 'Green';
  if (nm < 590) return 'Yellow';
  if (nm < 620) return 'Orange';
  if (nm <= 750) return 'Red';
  return 'Beyond visible red';
}

export function OpalColourLab() {
  const [diameter, setDiameter] = useState(245);
  const [angle, setAngle] = useState(12);
  const [ordered, setOrdered] = useState(true);
  const wavelength = peakWavelength(diameter, angle);
  const visible = wavelength >= 380 && wavelength <= 750;
  const hasFlash = ordered && visible;
  const hue = lightColour(wavelength);
  const spheres = useMemo(() => sphereField(ordered), [ordered]);
  const scale = 0.6 + (diameter / 245) * 0.4;

  const reset = () => {
    setDiameter(245);
    setAngle(12);
    setOrdered(true);
  };

  return (
    <section id="opal-colour-lab" aria-labelledby="opal-colour-title" className="relative isolate overflow-hidden border-y border-bone/10 bg-[#101213] px-5 py-20 text-bone sm:px-8 lg:px-12 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50" style={{
        background: 'radial-gradient(ellipse at 32% 42%, rgba(95,109,115,.12), transparent 55%), linear-gradient(155deg, rgba(194,94,34,.055), transparent 35%)',
      }} />
      <div className="relative mx-auto max-w-[1540px]">
        <div className="max-w-4xl pb-10 lg:pb-16">
          <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[.18em] text-copper">The Shed / Opal Education</p>
          <h2 id="opal-colour-title" className="font-display text-5xl uppercase leading-[.93] tracking-tight sm:text-6xl lg:text-8xl">
            Inside the <span className="text-copper">colour.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone/75 sm:text-xl">
            The flash isn't paint or pigment. It comes from light meeting an extraordinarily regular arrangement of microscopic silica spheres. Change the structure and watch what happens.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(330px,1fr)] lg:gap-6">
          <div className="relative overflow-hidden border border-bone/15 bg-[#090c0f]">
            <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[.12em] text-bone/65 sm:left-7 sm:top-7">
              <span>Silica sphere lattice</span>
              <span className="text-copper">Illustrative magnification</span>
            </div>
            <svg viewBox="0 0 680 440" role="img" aria-label={ordered
              ? `A regularly packed structure of silica spheres, with reflected light in the ${colourName(wavelength).toLowerCase()} range when visible.`
              : 'Silica spheres with an irregular arrangement; no coherent play-of-colour is indicated.'
            } className="block h-auto w-full" style={{ minHeight: 305 }}>
              <defs>
                <radialGradient id="shed-silica-sphere" cx="31%" cy="21%" r="83%">
                  <stop offset="0%" stopColor="#e6f5f5" stopOpacity=".94" />
                  <stop offset="27%" stopColor="#a9bbbe" stopOpacity=".69" />
                  <stop offset="68%" stopColor="#3f565f" stopOpacity=".83" />
                  <stop offset="100%" stopColor="#17252c" stopOpacity=".98" />
                </radialGradient>
                <radialGradient id="shed-lattice-aura">
                  <stop offset="0%" stopColor={hue} stopOpacity={hasFlash ? '.33' : '0'} />
                  <stop offset="100%" stopColor={hue} stopOpacity="0" />
                </radialGradient>
                <linearGradient id="shed-incident" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="70%" stopColor="#fff9ea" stopOpacity=".8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity=".13" />
                </linearGradient>
                <linearGradient id="shed-reflected" x1="0%" x2="100%">
                  <stop offset="0%" stopColor={hue} stopOpacity=".8" />
                  <stop offset="100%" stopColor={hue} stopOpacity="0" />
                </linearGradient>
              </defs>

              <g opacity=".13" stroke="#e4dacc" strokeWidth="1">
                <path d="M0 358H680 M0 400H680" />
                <path d="M44 0V440 M638 0V440" />
              </g>

              <ellipse cx="350" cy="205" rx="236" ry="145" fill="url(#shed-lattice-aura)" />
              {/* A directional diagram, not a physically traced light path. */}
              <path d={`M${60 + angle * 1.2} 68 L338 183`} stroke="#fffdf0" strokeWidth="22" strokeOpacity=".055" fill="none" />
              <path d={`M${60 + angle * 1.2} 68 L338 183`} stroke="url(#shed-incident)" strokeWidth="3" fill="none" />
              <path d={`M338 183 L${619 - angle * 1.0} ${68 + angle * 1.2}`} stroke={hue} strokeWidth="23" strokeOpacity={hasFlash ? '.075' : '0'} fill="none" />
              <path d={`M338 183 L${619 - angle * 1.0} ${68 + angle * 1.2}`} stroke="url(#shed-reflected)" strokeWidth="3" strokeOpacity={hasFlash ? '1' : '0'} fill="none" />

              <g transform={`translate(340 197) scale(${scale.toFixed(3)}) translate(-340 -197)`}>
                {spheres.map((s) => (
                  <g key={s.key}>
                    <circle cx={s.x} cy={s.y} r="20.4" fill="url(#shed-silica-sphere)" stroke="#d5e8e3" strokeOpacity={s.depth === 2 ? '.52' : '.2'} strokeWidth="1" />
                    {hasFlash && s.depth === 2 && (
                      <circle cx={s.x - 5} cy={s.y - 6} r="5.5" fill={hue} opacity=".26" />
                    )}
                  </g>
                ))}
              </g>

              <g fontFamily="sans-serif" fontSize="11" fill="#ddd8d0" opacity=".82">
                <text x="45" y="53">WHITE LIGHT</text>
                <text x="464" y="44">{hasFlash ? 'REFLECTED COLOUR' : 'NO REGULAR FLASH'}</text>
              </g>
              <g fontFamily="monospace" fontSize="12" letterSpacing="1" fill="#ddd8d0">
                <text x="40" y="417">SPHERE DIAMETER  {diameter} nm</text>
                <text x="459" y="417">LIGHT ANGLE  {angle}°</text>
              </g>
            </svg>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 px-5 py-5 sm:px-7">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-bone/50">Predicted dominant band</p>
                <p className="mt-1 text-xl font-medium text-bone" aria-live="polite">
                  {!ordered ? 'No coherent colour peak' : visible ? `${colourName(wavelength)} · ${Math.round(wavelength)} nm` : 'Outside visible spectrum'}
                </p>
              </div>
              <span aria-hidden="true" className="h-8 w-8 rounded-full border border-bone/30" style={{
                background: hasFlash ? hue : '#2b3134',
                boxShadow: hasFlash ? `0 0 36px ${hue}` : 'none',
              }} />
            </div>
          </div>

          <div className="flex flex-col border border-bone/15 bg-[#1c1c1b] p-6 sm:p-8 lg:p-9">
            <div className="mb-9">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-copper">Change the experiment</p>
              <h3 className="mt-3 font-display text-3xl uppercase leading-tight">Make the colour move.</h3>
            </div>

            <div className="space-y-10">
              <div>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <label htmlFor="shed-sphere-size" className="text-base font-medium">Sphere diameter</label>
                  <span className="font-mono text-sm text-copper">{diameter} nm</span>
                </div>
                <input id="shed-sphere-size" type="range" min="160" max="340" step="5" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#c25e22]" aria-describedby="shed-size-help" />
                <div className="mt-2 flex justify-between font-mono text-[10px] text-bone/50"><span>160 nm</span><span>340 nm</span></div>
                <p id="shed-size-help" className="mt-3 text-sm leading-relaxed text-bone/65">Larger spheres create wider layer spacing, generally shifting the reflected band towards red.</p>
              </div>

              <div>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <label htmlFor="shed-light-angle" className="text-base font-medium">Angle of incoming light</label>
                  <span className="font-mono text-sm text-copper">{angle}°</span>
                </div>
                <input id="shed-light-angle" type="range" min="0" max="65" step="1" value={angle} onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#c25e22]" aria-describedby="shed-angle-help" />
                <div className="mt-2 flex justify-between font-mono text-[10px] text-bone/50"><span>Head-on</span><span>65°</span></div>
                <p id="shed-angle-help" className="mt-3 text-sm leading-relaxed text-bone/65">Change the angle and the favoured wavelength shifts. Real opal also contains differently oriented colour domains.</p>
              </div>

              <fieldset>
                <legend className="mb-3 text-base font-medium">Packing of the spheres</legend>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" aria-pressed={ordered} onClick={() => setOrdered(true)}
                    className={`min-h-12 cursor-pointer border px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${ordered ? 'border-copper bg-copper/15 text-bone' : 'border-bone/20 text-bone/60 hover:border-bone/50'}`}>
                    Regular
                  </button>
                  <button type="button" aria-pressed={!ordered} onClick={() => setOrdered(false)}
                    className={`min-h-12 cursor-pointer border px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${!ordered ? 'border-copper bg-copper/15 text-bone' : 'border-bone/20 text-bone/60 hover:border-bone/50'}`}>
                    Irregular
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">
                  {ordered ? 'Regularly spaced layers reinforce particular wavelengths of light.' : 'Without sufficient long-range order, the distinctive directional flash disappears.'}
                </p>
              </fieldset>
            </div>

            <button type="button" onClick={reset} className="mt-9 inline-flex min-h-11 cursor-pointer items-center gap-2 self-start text-sm text-bone/70 transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper">
              <RotateCcw size={15} aria-hidden="true" /> Reset experiment
            </button>
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-between gap-6 border-t border-bone/15 pt-7 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <p className="text-base text-bone/90"><strong>What you're seeing:</strong> an idealised close-packed lattice and its approximate first-order optical response—not a microscopic recording of a real Andamooka specimen.</p>
            <p className="mt-2 text-xs leading-relaxed text-bone/55">
              The simple model assumes a fixed effective refractive index and ideal layering; actual colour depends on local packing, domain orientation and optical conditions. UV fluorescence is a different phenomenon.
              {' '}<a href="https://australian.museum/learn/minerals/gemstones/opal/" target="_blank" rel="noopener noreferrer" className="underline decoration-bone/40 underline-offset-4 hover:text-bone">Learn more at the Australian Museum</a>.
            </p>
          </div>
          <Link to="/opal/obj_01" className="inline-flex shrink-0 min-h-12 items-center justify-center gap-3 border border-copper px-5 py-3 text-sm font-medium text-bone transition-colors hover:bg-copper hover:text-pit-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper">
            Examine the Lunatic Matrix <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
