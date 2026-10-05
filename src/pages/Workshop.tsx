import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

function UVRevealText() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "center center"]
  });

  const color = useTransform(scrollYProgress, [0, 1], ["rgba(237, 231, 221, 0.05)", "rgba(79, 209, 197, 1)"]);
  const textShadow = useTransform(scrollYProgress, [0, 1], ["0px 0px 0px rgba(79, 209, 197, 0)", "0px 0px 20px rgba(79, 209, 197, 0.8)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <motion.div ref={ref} style={{ opacity }} className="mt-12 p-8 border border-copper/20 bg-pit-black/50 backdrop-blur-sm">
      <h4 className="text-micro text-copper tracking-[0.3em] mb-4">UV EXPOSURE</h4>
      <motion.p 
        style={{ color, textShadow }}
        className="font-display text-2xl lg:text-3xl leading-relaxed transition-colors duration-100"
      >
        Under high-intensity UV lighting, hidden seams of gem material ignite with a brilliant fluorescent glow, revealing what daylight cannot. The invisible architecture of the stone exposes itself.
      </motion.p>
    </motion.div>
  );
}

export function Workshop() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="w-full bg-pit-black min-h-screen text-bone">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden border-b border-bone/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-pit-black/40 to-transparent z-10 pointer-events-none" />
          <motion.img 
            initial={{ scale: 1.05, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            src="/src/assets/images/Workshop2.png" 
            alt="Mooka Boys Partners" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        <div className="relative z-20 max-w-[1400px] mx-auto w-full px-6 text-center pt-32">
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-micro text-copper tracking-[0.4em] mb-6"
          >
            PRECISION LAPIDARY
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="font-display text-6xl md:text-8xl xl:text-[10rem] text-bone leading-[0.85] tracking-tight uppercase"
          >
            THE WORKSHOP
          </motion.h1>
        </div>
      </section>

      {/* THE LEVEL */}
      <section className="py-40 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden group border border-bone/5 bg-iron">
              <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-transparent to-pit-black opacity-50 z-10 pointer-events-none" />
              <img 
                src="/src/assets/images/opal wall.jpg" 
                alt="The Level"
                className="w-full h-full object-cover mix-blend-luminosity grayscale group-hover:scale-105 group-hover:grayscale-[0.5] transition-all duration-[3000ms] ease-out"
              />
            </div>
          </div>
          
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-8">
              <span className="font-mono text-xs tracking-widest text-copper">01</span>
              <div className="w-16 h-[1px] bg-copper" />
              <h2 className="font-display text-5xl lg:text-6xl tracking-tight text-bone uppercase">The Level</h2>
            </div>
            
            <p className="font-sans text-xl text-bone/60 leading-relaxed font-light mb-8">
              Looking for opal in Andamooka requires patience and an understanding of the deep geological stratification of the Eromanga Basin. The "level" is a distinct band of clay and sandstone, an ancient seabed compressed over 100 million years.
            </p>
            <p className="font-sans text-xl text-bone/60 leading-relaxed font-light mb-8">
              The matrix itself holds complex trace elements—iron (Fe), zirconium (Zr), and barium (Ba)—binding the precious silica structure in a dense, heavy host rock. Mining these depths requires precision to avoid fracturing the seams before they even see the light.
            </p>

            <UVRevealText />
          </div>
        </div>
      </section>

      {/* THE BLADE & THE WHEEL */}
      <section className="py-40 px-6 lg:px-12 max-w-[1600px] mx-auto border-t border-bone/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            
            <div className="mb-24">
              <div className="flex items-center gap-6 mb-8">
                <span className="font-mono text-xs tracking-widest text-copper">02</span>
                <div className="w-16 h-[1px] bg-copper" />
                <h2 className="font-display text-5xl lg:text-6xl tracking-tight text-bone uppercase">The Blade</h2>
              </div>
              <p className="font-sans text-xl text-bone/60 leading-relaxed font-light">
                Cutting an opal is a negotiation between what you want and what the stone will yield. We plan cuts meticulously, analyzing the stone's color bars, fault lines, and sand spots. We use Highland Park trim saws for the initial block-out. Built with an uncompromising devotion to heavy-duty reliability, Highland Park machinery ensures minimal waste and maximizes the potential of the gem-class material hidden within.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-6 mb-8">
                <span className="font-mono text-xs tracking-widest text-copper">03</span>
                <div className="w-16 h-[1px] bg-copper" />
                <h2 className="font-display text-5xl lg:text-6xl tracking-tight text-bone uppercase">The Wheel</h2>
              </div>
              <p className="font-sans text-xl text-bone/60 leading-relaxed font-light">
                Once blocked, the material moves to our cabbing stages. Here, rough shapes are refined into calibrated cabs or freeform organic designs. We partner with Flatlap, utilizing their precision lapidary equipment to strip away the potch layer by layer. It is a tactile, rhythmic process where the cutter relies entirely on sound, feel, and the precise mechanical feedback of the machine, until the fire is perfectly exposed.
              </p>
            </div>

          </div>

          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] overflow-hidden group border border-bone/5 bg-iron">
              <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-transparent to-pit-black opacity-50 z-10 pointer-events-none" />
              <img 
                src="/src/assets/images/Workshop2.png" 
                alt="The Workshop Blade and Wheel"
                className="w-full h-full object-cover mix-blend-luminosity grayscale group-hover:scale-105 group-hover:grayscale-[0.5] transition-all duration-[3000ms] ease-out"
              />
              
              {/* Interactive Hotspot Pulses (Aesthetic) */}
              <div className="absolute top-[40%] left-[30%] z-20 group-hover:opacity-100 opacity-0 transition-opacity duration-1000">
                 <div className="relative flex items-center justify-center w-8 h-8">
                    <div className="absolute inset-0 bg-copper/40 rounded-full animate-ping" />
                    <div className="relative w-2 h-2 bg-copper rounded-full" />
                 </div>
                 <span className="absolute top-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-copper whitespace-nowrap">THE BLADE</span>
              </div>

              <div className="absolute top-[65%] left-[70%] z-20 group-hover:opacity-100 opacity-0 transition-opacity duration-1000 delay-300">
                 <div className="relative flex items-center justify-center w-8 h-8">
                    <div className="absolute inset-0 bg-copper/40 rounded-full animate-ping" />
                    <div className="relative w-2 h-2 bg-copper rounded-full" />
                 </div>
                 <span className="absolute top-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-copper whitespace-nowrap">THE WHEEL</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* THE BURN */}
      <section className="py-40 px-6 lg:px-12 max-w-[1600px] mx-auto border-t border-bone/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/9] overflow-hidden group border border-bone/5 bg-iron">
              <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-transparent to-pit-black opacity-50 z-10 pointer-events-none" />
              <img 
                src="/src/assets/images/Matrix.png" 
                alt="The Burn"
                className="w-full h-full object-cover mix-blend-luminosity grayscale group-hover:scale-105 group-hover:grayscale-[0.5] transition-all duration-[3000ms] ease-out"
              />
            </div>
          </div>
          
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-8">
              <span className="font-mono text-xs tracking-widest text-copper">04</span>
              <div className="w-16 h-[1px] bg-copper" />
              <h2 className="font-display text-5xl lg:text-6xl tracking-tight text-bone uppercase">The Burn</h2>
            </div>
            
            <p className="font-sans text-xl text-bone/60 leading-relaxed font-light mb-8">
              Andamooka matrix opal is uniquely porous. To reveal its vibrant play-of-color, it undergoes a traditional sugar and acid carbonization treatment. The stone is soaked in a sugar solution, then submerged in heated sulfuric acid.
            </p>
            <p className="font-sans text-xl text-bone/60 leading-relaxed font-light">
              This process carbonizes the sugar trapped within the stone's pores, darkening the background to a deep, resonant black. The high-contrast canvas allows the electric pinfire of the opal to detonate visually. It is alchemy—a strictly controlled scientific process that relies on heat, time, and instinct.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
