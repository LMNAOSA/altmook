import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { ChevronRight, Compass, ArrowDownRight, MapPin, Sparkles } from 'lucide-react';

import { HeroHeadline } from '../components/ui/HeroHeadline';
import { DigitalTown3D } from '../components/DigitalTown3D';
import { TOWN_BUILDINGS, TownBuildingData } from '../data/townData';

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zDepthDisplay, setZDepthDisplay] = useState(0);
  const [elevationDisplay, setElevationDisplay] = useState('78.4m ASL');
  const [currentSector, setCurrentSector] = useState('HISTORIC TOWNSHIP');
  const [activeBuildingIndex, setActiveBuildingIndex] = useState(0);

  // Track scroll across the scrollytelling container
  const { scrollYProgress } = useScroll({
    target: scrollyRef,
    offset: ["start start", "end end"]
  });

  // Track mouse for 3D camera parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update real-time HUD telemetry and active building based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const depth = Math.round(v * 1400);
      setZDepthDisplay(depth);

      // Determine active building based on progress ranges
      let foundIdx = 0;
      if (v < 0.22) {
        foundIdx = 0;
      } else if (v < 0.35) {
        foundIdx = 1;
      } else if (v < 0.48) {
        foundIdx = 2;
      } else if (v < 0.62) {
        foundIdx = 3;
      } else if (v < 0.76) {
        foundIdx = 4;
      } else if (v < 0.88) {
        foundIdx = 5;
      } else {
        foundIdx = 6;
      }

      setActiveBuildingIndex(foundIdx);
      const activeB = TOWN_BUILDINGS[foundIdx];
      if (activeB) {
        setElevationDisplay(activeB.elevation);
        setCurrentSector(activeB.name);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Phase 1: Titles dissolve and scale on Z-axis (0 -> 0.16)
  const titleOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.18], [1, 1.4]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.14], ['blur(0px)', 'blur(16px)']);

  // Invitation prompt dissolves
  const invitationOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const invitationY = useTransform(scrollYProgress, [0, 0.1], [0, 25]);

  // Phase 2: Historical Map zooms deeply into town (0 -> 0.32)
  const mapScale = useTransform(scrollYProgress, [0, 0.32], [1, 4.5]);
  const mapOpacity = useTransform(scrollYProgress, [0.12, 0.28], [0.85, 0]);

  // Phase 3: Digital 3D Town materializes and camera flies through (0.16 -> 0.94)
  const town3DOpacity = useTransform(scrollYProgress, [0.14, 0.24, 0.88, 0.98], [0, 1, 1, 0]);
  const hudOpacity = useTransform(scrollYProgress, [0.16, 0.24, 0.88, 0.96], [0, 1, 1, 0]);

  // Scroll Progress mapped directly to 3D Camera progression
  const sceneProgress = useTransform(scrollYProgress, [0.16, 0.92], [0, 1]);
  const [currentSceneProgress, setCurrentSceneProgress] = useState(0);

  useEffect(() => {
    const unsub = sceneProgress.on('change', (v) => {
      setCurrentSceneProgress(Math.max(0, Math.min(1, v)));
    });
    return () => unsub();
  }, [sceneProgress]);

  // Smoothly glide camera to a specific building in the 3D town
  const scrollToBuilding = (index: number) => {
    if (!scrollyRef.current) return;
    const targetB = TOWN_BUILDINGS[index];
    if (!targetB) return;

    const top = scrollyRef.current.offsetTop;
    const height = scrollyRef.current.offsetHeight;
    
    // Convert building target scene progress back to page scroll position
    const targetScrollYProgress = 0.16 + targetB.progressTarget * (0.92 - 0.16);
    
    window.scrollTo({
      top: top + height * targetScrollYProgress,
      behavior: 'smooth'
    });
    setActiveBuildingIndex(index);
  };

  const handleSelectBuildingFrom3D = (building: TownBuildingData) => {
    navigate(building.route);
  };

  const activeBuilding = TOWN_BUILDINGS[activeBuildingIndex] || TOWN_BUILDINGS[0];

  return (
    <div className="w-full flex flex-col items-center bg-pit-black" ref={containerRef}>
      
      {/* SCROLLYTELLING TRACK - PINNED Z-AXIS HERO & DIGITAL 3D TOWN ZOOM */}
      <section ref={scrollyRef} className="relative w-full h-[450vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-pit-black">
          
          {/* LAYER 1: 2D HISTORICAL MAP ZOOMING ON Z-AXIS */}
          <motion.div 
            style={{ 
              scale: mapScale, 
              opacity: mapOpacity,
              transformOrigin: '50% 52%'
            }} 
            className="absolute inset-0 z-0 w-full h-full pointer-events-none"
          >
            <img 
              src="/src/assets/images/Andamookamap-1.jpeg"
              className="w-full h-full object-cover object-center cinematic-image mix-blend-luminosity grayscale contrast-125"
              alt="Historical Map of Andamooka"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* LAYER 2: DIGITAL 3D VERSION OF ANDAMOOKA WITH 7 SOLID TEXTURED BUILDINGS */}
          <motion.div 
            style={{ opacity: town3DOpacity }}
            className="absolute inset-0 z-10 w-full h-full"
          >
            <DigitalTown3D 
              scrollProgress={currentSceneProgress} 
              mousePos={mousePos} 
              activeBuildingIndex={activeBuildingIndex}
              onSelectBuilding={handleSelectBuildingFrom3D}
            />
          </motion.div>

          {/* Deep Vignette & Atmosphere Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-pit-black/30 to-pit-black z-15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-transparent to-pit-black/60 z-15 pointer-events-none" />

          {/* LAYER 3: 3D HUD & ACTIVE BUILDING SPOTLIGHT CARD */}
          <motion.div 
            style={{ opacity: hudOpacity }}
            className="absolute inset-0 z-25 pointer-events-none p-4 md:p-8 flex flex-col justify-between"
          >
            {/* Top HUD Datum & Explorer Status */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-copper animate-ping" />
                  <p className="font-mono text-micro text-copper tracking-[0.3em]">
                    DIGITAL TOWN SURVEY // 7 HISTORIC SITES
                  </p>
                </div>
                <p className="font-mono text-[11px] text-bone/60 tracking-wider">
                  COORDS: 30°27'01"S 137°09'56"E // INTERACTIVE EXPLORATION
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="font-mono text-micro text-bone/40 tracking-[0.25em]">
                  EXPLORATION MODE
                </p>
                <p className="font-mono text-[11px] text-copper tracking-widest flex items-center justify-end gap-1.5">
                  <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
                  MAIN STREET TRAVERSAL
                </p>
              </div>
            </div>

            {/* Bottom HUD: Active Building Spotlight Card & Street Directory */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 w-full pointer-events-auto">
              
              {/* Active Building Spotlight Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBuilding.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-md w-full p-5 rounded-xl border border-copper/40 bg-pit-black/90 backdrop-blur-xl shadow-2xl space-y-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Building Thumbnail (1.png to 7.png) */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-copper/30 shrink-0 bg-stone-900">
                      <img
                        src={activeBuilding.image}
                        alt={activeBuilding.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-pit-black/80 font-mono text-[9px] text-copper font-bold">
                        {activeBuilding.number}
                      </div>
                    </div>

                    {/* Building Details */}
                    <div className="space-y-1 min-w-0">
                      <p className="font-mono text-micro text-copper tracking-[0.25em]">
                        {activeBuilding.historicDatum}
                      </p>
                      <h3 className="font-sans text-base md:text-lg text-bone font-medium tracking-tight truncate">
                        {activeBuilding.name}
                      </h3>
                      <p className="font-sans text-xs text-bone/60 leading-relaxed line-clamp-2">
                        {activeBuilding.description}
                      </p>
                    </div>
                  </div>

                  {/* Direct Navigation Button */}
                  <div className="pt-1 flex items-center justify-between gap-3 border-t border-bone/10">
                    <div className="flex items-center gap-2 font-mono text-micro text-bone/50">
                      <MapPin className="w-3 h-3 text-copper" />
                      <span>{activeBuilding.elevation}</span>
                    </div>

                    <Link
                      to={activeBuilding.route}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-copper hover:bg-copper-light text-pit-black font-mono text-micro font-bold tracking-widest uppercase transition-all duration-300 shadow-md group"
                    >
                      <span>{activeBuilding.routeLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Interactive Street Directory / Waypoint Selector Bar */}
              <div className="flex flex-col items-end gap-2 max-w-full">
                <p className="font-mono text-micro text-bone/40 tracking-[0.25em] uppercase">
                  TOWNSHIP SECTORS (CLICK TO VISIT)
                </p>
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-bone/10 bg-pit-black/80 backdrop-blur-md overflow-x-auto max-w-full">
                  {TOWN_BUILDINGS.map((b, idx) => {
                    const isSelected = activeBuildingIndex === idx;
                    return (
                      <button
                        key={b.id}
                        onClick={() => scrollToBuilding(idx)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-copper text-pit-black font-bold shadow-lg scale-105'
                            : 'text-bone/60 hover:text-bone hover:bg-bone/5'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-pit-black' : 'bg-copper/60'}`} />
                        <span>{b.number} {b.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>

          {/* LAYER 4: HERO HEADLINE & INVITATION (DISSOLVES AS USER ZOOMS IN) */}
          <motion.div 
            style={{ 
              opacity: titleOpacity,
              scale: titleScale,
              filter: titleBlur
            }}
            className="relative z-30 text-center px-6 flex flex-col items-center mt-12 max-w-4xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mb-8"
            >
              <HeroHeadline subtitle="Welcome To" title="Andamooka." />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="font-sans font-extralight text-xs md:text-sm tracking-[0.25em] uppercase text-bone/60 max-w-sm mx-auto leading-relaxed"
            >
              THE PEOPLE. THE PLACE. THE OPAL.
            </motion.p>
          </motion.div>

          {/* INVITATION TO COME INSIDE (Z-AXIS SCROLL PROMPT) */}
          <motion.div 
            style={{ 
              opacity: invitationOpacity,
              y: invitationY
            }}
            className="absolute bottom-12 z-35 flex flex-col items-center cursor-pointer group"
            onClick={() => scrollToBuilding(0)}
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.6 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Tactical Badge */}
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-copper/30 bg-pit-black/80 backdrop-blur-md group-hover:border-copper group-hover:bg-pit-black transition-all duration-500 shadow-2xl">
                <span className="w-1.5 h-1.5 rounded-full bg-copper animate-ping" />
                <span className="font-mono text-micro tracking-[0.3em] text-copper group-hover:text-optic-white transition-colors">
                  EXPLORE THE 3D TOWN
                </span>
                <span className="text-copper/60 font-mono text-xs">↓</span>
              </div>

              {/* Sub-label & Animated Depth Arrow */}
              <div className="flex flex-col items-center gap-1 mt-1">
                <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase">
                  SCROLL TO TRAVEL THROUGH SITES
                </p>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-px h-6 bg-gradient-to-b from-copper/60 to-transparent"
                />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* THE PROVENANCE MANIFESTO */}
      <section className="w-full py-48 px-6 relative z-20 bg-pit-black">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <h2 className="font-sans text-3xl md:text-5xl lg:text-6xl text-bone leading-tight font-light tracking-wide">
            We don't just sell opal.<br />
            <span className="italic text-copper">We sell the physical evidence of its discovery.</span>
          </h2>
          <p className="font-sans text-lg md:text-xl text-bone/60 leading-relaxed font-light max-w-2xl mx-auto">
            Every stone has somewhere it came from. Mooka Boys is building a new standard for provenance—where the extraction record, the miner's identity, and the gemological science are inseparable from the object itself.
          </p>
          <div className="pt-12">
            <Link 
              to="/provenance"
              className="text-micro tracking-[0.3em] text-copper hover:text-bone transition-colors inline-block border-b border-copper/30 pb-2 hover:border-bone duration-500"
            >
              INTRODUCING PROVENANCE OS™
            </Link>
          </div>
        </div>
      </section>

      {/* SINGLE ANCHOR FEATURE - NO CARDS, PURE SCALE */}
      <section className="w-full min-h-screen py-32 px-6 relative z-20 bg-pit-black flex items-center justify-center border-t border-bone/5">
        <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Metadata Left */}
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col justify-end h-full"> 
             <div className="space-y-12">
                <div className="space-y-2">
                  <p className="text-micro text-bone/30">IDENTIFIER</p>
                  <p className="font-mono text-sm tracking-widest text-bone">OBJ_01</p>
                </div>
                <div className="space-y-2">
                  <p className="text-micro text-bone/30">ORIGIN</p>
                  <p className="font-mono text-sm tracking-widest text-bone">LUNATIC FIELD, ANDAMOOKA</p>
                </div>
                <div className="space-y-2">
                  <p className="text-micro text-bone/30">TYPE</p>
                  <p className="font-mono text-sm tracking-widest text-bone">HIGH-GRADE HARD MATRIX</p>
                </div>
             </div>
          </div>

          {/* Massive Center Anchor */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <Link to="/opal/obj_01" className="block relative aspect-square group w-full cursor-pointer">
              <div className="absolute inset-0 image-glow opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
              <img 
                src="/src/assets/images/LunaticMatrix1.png" 
                alt="The Fire of the Basin" 
                className="w-full h-full object-cover mix-blend-lighten grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Title Right */}
          <div className="lg:col-span-3 order-3 lg:order-3 pt-12 lg:pt-0 text-right">
             <h2 className="font-display text-6xl lg:text-7xl xl:text-8xl tracking-tighter text-bone leading-[0.85] mb-12">
               Lunatic<br/><span className="text-copper">Matrix</span>
             </h2>
             <Link 
                to="/opal/obj_01"
                className="inline-flex items-center gap-4 text-micro text-bone/60 hover:text-optic-white transition-colors group"
              >
                EXAMINE ARTIFACT
                <span className="w-8 h-[1px] bg-bone/30 group-hover:bg-optic-white group-hover:w-12 transition-all duration-300" />
              </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
