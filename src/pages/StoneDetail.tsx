import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { stones } from '../data/mockData';

export function StoneDetail() {
  const { id } = useParams();
  const stone = stones.find(s => s.id === id);
  const containerRef = useRef(null);
  
  const [osMode, setOsMode] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (osMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [osMode]);

  if (!stone) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-micro text-bone/50 tracking-widest uppercase">Artifact missing from records.</div>;
  }

  return (
    <>
      <div className={`w-full bg-pit-black min-h-screen relative transition-opacity duration-1000 ${osMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} ref={containerRef}>
        
        {/* THE ANCHOR - Fixed and dominant */}
        <div className="fixed inset-0 w-full h-[100vh] z-0 pointer-events-none flex items-center justify-center px-6 pt-24 pb-12">
          <motion.div 
            style={{ scale: imageScale, opacity: imageOpacity, y: imageY }} 
            className="w-full max-w-5xl aspect-square relative"
          >
            <div className="absolute inset-0 image-glow opacity-30" />
            <AnimatePresence>
              {!osMode && (
                <motion.img 
                  layoutId={`stone-image-${stone.id}`}
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  src={stone.heroImage} 
                  alt={stone.name} 
                  className="w-full h-full object-contain cinematic-image drop-shadow-2xl mix-blend-lighten"
                  referrerPolicy="no-referrer"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* METADATA OVERLAY - Bare, no boxes, extreme negative space */}
        <div className="relative z-10 w-full min-h-[150vh] pointer-events-none pt-[50vh]">
          
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 pointer-events-auto items-end">
            
            {/* Scientific Context */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3 space-y-16 pb-24"
            >
              <div className="space-y-2">
                <p className="text-micro text-bone/30">IDENTIFIER</p>
                <p className="font-mono text-sm tracking-widest text-bone">{stone.id}</p>
              </div>
              
              <div className="space-y-12 border-l border-copper/30 pl-6">
                <div className="space-y-2">
                  <p className="text-micro text-bone/30">WEIGHT</p>
                  <p className="font-mono text-lg tracking-widest text-bone">{stone.carat}ct</p>
                </div>
                <div className="space-y-2">
                  <p className="text-micro text-bone/30">ORIGIN</p>
                  <p className="font-mono text-sm tracking-widest text-bone uppercase">{stone.origin}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-micro text-bone/30">MINER</p>
                  <p className="font-mono text-sm tracking-widest text-bone uppercase">{stone.miner}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-micro text-bone/30">TREATMENT</p>
                  <p className="font-mono text-xs tracking-widest text-bone/70 uppercase leading-relaxed max-w-[200px]">{stone.treatment}</p>
                </div>
              </div>
            </motion.div>

            {/* Core Title and Acquisition */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 lg:col-start-7 flex flex-col items-end text-right pb-24"
            >
              <h1 className="font-display text-6xl md:text-8xl xl:text-9xl tracking-tight text-bone leading-[0.85] mb-16 max-w-3xl">
                {stone.name}
              </h1>
              
              <div className="text-2xl md:text-3xl font-mono text-bone/90 tracking-widest mb-16">
                ${stone.price.toLocaleString()} AUD
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                {stone.hasProvenance && (
                  <button 
                    onClick={() => setOsMode(true)}
                    className="px-12 py-5 border border-copper text-copper text-micro tracking-[0.3em] hover:bg-copper hover:text-pit-black transition-all duration-500 text-center"
                  >
                    EXAMINE PROVENANCE
                  </button>
                )}
                <button className={`px-12 py-5 border ${stone.hasProvenance ? 'border-bone/20 text-bone' : 'border-bone text-bone hover:bg-bone hover:text-pit-black'} text-micro tracking-[0.3em] transition-all duration-500 text-center`}>
                  ACQUIRE
                </button>
              </div>
            </motion.div>
          </div>

          {/* Cinematic Narrative Below Fold */}
          <div className="w-full bg-pit-black z-20 relative pt-40 pb-40 px-6 border-t border-bone/5 pointer-events-auto">
            <div className="max-w-4xl mx-auto space-y-40">
              <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-4">
                  <h3 className="text-micro text-copper">EXTRACTION CONTEXT</h3>
                </div>
                <div className="md:col-span-8">
                  <p className="font-sans font-light text-2xl md:text-3xl text-bone/90 leading-relaxed">
                    Pulled from the dirt at {stone.origin}. The structural integrity of the matrix required careful extraction before treatment could begin.
                  </p>
                </div>
              </section>
              
              <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-4">
                  <h3 className="text-micro text-copper">HUMAN ELEMENT</h3>
                </div>
                <div className="md:col-span-8">
                  <p className="font-sans font-light text-2xl md:text-3xl text-bone/90 leading-relaxed">
                    Mined by {stone.miner}. Decades of experience on the Andamooka fields means understanding when to stop digging and start preserving.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* PROVENANCE OS EXAMINATION ROOM */}
      <AnimatePresence>
        {osMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#020202] flex items-center justify-center overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent opacity-50" />
            
            {/* Close / Return Button */}
            <button 
              onClick={() => setOsMode(false)}
              className="absolute top-12 left-12 z-50 flex items-center gap-4 text-bone/30 hover:text-bone transition-colors duration-500 group"
            >
              <span className="w-8 h-[1px] bg-bone/30 group-hover:bg-bone transition-colors duration-500" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase">EXIT ROOM</span>
            </button>

            {/* The Object (Anchor) */}
            <motion.div 
              className="w-full max-w-7xl aspect-square relative z-20 cursor-crosshair"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img 
                layoutId={`stone-image-${stone.id}`}
                src={stone.heroImage} 
                alt={stone.name} 
                className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(194,94,34,0.15)] mix-blend-lighten"
                referrerPolicy="no-referrer"
                drag
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                whileDrag={{ scale: 1.05 }}
              />
              
              {/* Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[120%] h-[1px] bg-bone/5 absolute" />
                <div className="h-[120%] w-[1px] bg-bone/5 absolute" />
                <div className="w-16 h-16 border border-copper/30 rounded-full flex items-center justify-center absolute">
                  <div className="w-1 h-1 bg-copper rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* HUD Grammar Elements */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute inset-0 pointer-events-none z-30"
            >
              {/* Top Right: System Status */}
              <div className="absolute top-12 right-12 text-right space-y-1">
                <p className="font-mono text-[10px] tracking-[0.4em] text-copper uppercase">PROVENANCE OS™ // ACTIVE</p>
                <p className="font-mono text-[10px] tracking-widest text-bone/40 uppercase">OBJ: {stone.id}</p>
                <p className="font-mono text-[10px] tracking-widest text-bone/40 uppercase">LOC: {stone.origin}</p>
              </div>

              {/* Bottom Right: Acquire */}
              <div className="absolute bottom-12 right-12 flex flex-col items-end pointer-events-auto">
                <div className="font-mono text-2xl tracking-widest text-bone mb-6">
                  ${stone.price.toLocaleString()}
                </div>
                <button className="px-10 py-4 border border-bone text-bone hover:bg-bone hover:text-pit-black transition-all duration-500 font-mono text-[10px] tracking-[0.3em] uppercase">
                  ACQUIRE
                </button>
              </div>

              {/* Orbit / Focus / Trace Controls (Left Edge) */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col space-y-12 pointer-events-auto">
                {['ANCHOR', 'FOCUS', 'ORBIT', 'PIVOT'].map((action, i) => (
                  <button key={action} className="group flex items-center gap-4 text-bone/30 hover:text-copper transition-colors duration-500">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{action}</span>
                    <span className={`w-2 h-2 border border-bone/30 rounded-full group-hover:border-copper group-hover:bg-copper/20 transition-all duration-500 ${i === 0 ? 'border-copper bg-copper' : ''}`} />
                  </button>
                ))}
              </div>

              {/* Verify / Trace Controls (Right Edge) */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-12 pointer-events-auto">
                {['TRACE', 'VERIFY'].map((action) => (
                  <button key={action} className="group flex items-center gap-4 text-bone/30 hover:text-copper transition-colors duration-500">
                    <span className="w-2 h-2 border border-bone/30 rounded-full group-hover:border-copper group-hover:bg-copper/20 transition-all duration-500" />
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{action}</span>
                  </button>
                ))}
              </div>

              {/* Bottom Left: Evidence Metric */}
              <div className="absolute bottom-12 left-12">
                <p className="font-mono text-[10px] tracking-[0.3em] text-bone/50 uppercase mb-2">EVIDENCE COMPILED</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="w-4 h-1 bg-copper/80" />
                  ))}
                  <div className="w-4 h-1 bg-bone/10" />
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
