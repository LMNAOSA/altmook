import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const PIONEERS = [
  {
    id: "minnie",
    name: "Minnie Berrington",
    role: "Frontier Pioneer",
    video: "/src/assets/video/MinnieBerrington.mp4",
    poster: null,
    story: "One of the first women on the Andamooka fields. She carved a life out of the dirt when survival itself was an achievement. Her presence remains woven into the harsh landscape."
  },
  {
    id: "jim",
    name: "Jim Shaw",
    role: "Early Miner",
    video: "/src/assets/video/JimShaw.mov",
    poster: "/src/assets/images/JimShaw.png",
    story: "A legend of the early strikes. Jim understood the levels of the matrix and pushed deep into the ironstone bands, extracting some of the region's most famous early parcels."
  }
];

function HoverVideo({ videoSrc, posterSrc, isHovered }: { videoSrc: string | null, posterSrc: string | null, isHovered: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered]);

  return (
    <div className="absolute inset-0 w-full h-full bg-iron">
      {posterSrc && (
        <img 
          src={posterSrc} 
          alt="Pioneer" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isHovered && videoSrc ? 'opacity-0' : 'opacity-100 mix-blend-luminosity grayscale-[0.8]'}`}
        />
      )}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isHovered || !posterSrc ? 'opacity-100 mix-blend-luminosity grayscale-[0.5]' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

export function Andamooka() {
  const [hoveredPioneer, setHoveredPioneer] = useState<string | null>(null);

  return (
    <div className="w-full bg-pit-black min-h-screen text-bone relative pt-32 pb-40">
      
      {/* HERO SECTION - Cinematic Eromanga Basin */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden mb-32 border-b border-bone/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-pit-black/20 to-pit-black z-10" />
          <motion.img 
            initial={{ scale: 1.1, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            src="/src/assets/images/EromangaAnda.png" 
            alt="Eromanga Basin" 
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
          />
        </div>
        
        <div className="relative z-20 max-w-[1400px] mx-auto w-full px-6 text-center">
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-micro text-copper tracking-[0.4em] mb-6"
          >
            30°26'S 137°09'E
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-hudson text-7xl md:text-9xl xl:text-[12rem] text-bone leading-[0.8]"
          >
            ANDAMOOKA
          </motion.h1>
        </div>
      </section>

      {/* THE HISTORY & MAP */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-micro text-copper tracking-[0.3em] uppercase">The Settlement</h2>
            <h3 className="font-display text-5xl lg:text-7xl leading-none tracking-tight">BORN FROM<br />ISOLATION.</h3>
            <div className="w-16 h-[1px] bg-copper/50 my-8" />
            <p className="font-sans text-xl text-bone/60 leading-relaxed font-light">
              Discovered in 1930, Andamooka was never a town built for comfort. It was a frontier settlement forged by extreme isolation, blistering heat, and the uncompromising pursuit of opal.
            </p>
            <p className="font-sans text-xl text-bone/60 leading-relaxed font-light">
              Without formal town planning, water supply, or permanent roads, the early miners carved their existence straight into the earth, relying on resilience and a deeply ingrained code of outback survival.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] bg-iron group overflow-hidden border border-bone/5">
              <div className="absolute inset-0 bg-copper/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10" />
              <img 
                src="/src/assets/images/Andamookamap-1.jpeg" 
                alt="Historical Map of Andamooka"
                className="w-full h-full object-cover mix-blend-luminosity grayscale group-hover:scale-105 transition-all duration-[3000ms] ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* THE PIONEERS - INTERACTIVE ARCHIVE */}
      <section className="w-full bg-pit-black py-40 border-y border-bone/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-iron/10 via-pit-black to-pit-black opacity-80 pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-micro text-copper tracking-[0.3em] uppercase mb-4">The Ancestors</h2>
            <h3 className="font-display text-5xl lg:text-7xl leading-none tracking-tight text-bone">THE PIONEERS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
            {PIONEERS.map((pioneer) => (
              <div 
                key={pioneer.id}
                className="group flex flex-col items-center text-center"
                onMouseEnter={() => setHoveredPioneer(pioneer.id)}
                onMouseLeave={() => setHoveredPioneer(null)}
              >
                {/* INTERACTIVE MEDIA STAGE */}
                <div className="w-full max-w-sm aspect-[3/4] relative overflow-hidden border border-bone/10 mb-12 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-transparent to-pit-black opacity-50 z-20 pointer-events-none" />
                  
                  <HoverVideo 
                    videoSrc={pioneer.video} 
                    posterSrc={pioneer.poster} 
                    isHovered={hoveredPioneer === pioneer.id} 
                  />
                  
                  {/* Focus reticle effect on hover */}
                  <div className="absolute inset-0 border border-copper/0 group-hover:border-copper/30 scale-105 group-hover:scale-100 transition-all duration-700 z-30 pointer-events-none" />
                </div>

                <p className="text-micro text-copper tracking-[0.4em] mb-4">{pioneer.role}</p>
                <h4 className="font-display text-4xl lg:text-5xl text-bone mb-6">{pioneer.name}</h4>
                <p className="font-sans text-lg text-bone/60 leading-relaxed font-light max-w-md">
                  {pioneer.story}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINER'S HUTS & ARCHITECTURE */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative aspect-[16/9] bg-iron group overflow-hidden border border-bone/5">
              <img 
                src="/src/assets/images/Minerhut1.jpg" 
                alt="Historical Miner's Hut"
                className="w-full h-full object-cover mix-blend-luminosity grayscale opacity-80 group-hover:scale-105 transition-all duration-[3000ms] ease-out"
              />
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-8 lg:pl-12">
            <h2 className="text-micro text-copper tracking-[0.3em] uppercase">Architecture of Survival</h2>
            <h3 className="font-display text-5xl lg:text-7xl leading-none tracking-tight">THE DIRT<br />DWELLERS.</h3>
            <div className="w-16 h-[1px] bg-copper/50 my-8" />
            <p className="font-sans text-xl text-bone/60 leading-relaxed font-light">
              To escape the 50°C summer heat, early settlers built their homes semi-underground ("dugouts") or constructed rudimentary huts from whatever materials could be scavenged—corrugated iron, mulga wood, and local stone. These structures stand today as monuments to human endurance.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
