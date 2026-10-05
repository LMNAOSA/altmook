import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { stones } from '../data/mockData';
import { HeroHeadline } from '../components/ui/HeroHeadline';

export function Opal() {
  return (
    <div className="w-full flex flex-col items-center bg-void min-h-screen pt-40 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        
        <header className="mb-40 flex flex-col items-center text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-micro text-bone/50 mb-8"
          >
            {stones.length} ARTIFACTS
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mb-12"
          >
            <HeroHeadline subtitle="The" title="Stones" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="w-[1px] h-24 bg-bone/20"
          />
        </header>

        <div className="space-y-[30vh]">
          {stones.map((stone, i) => (
            <motion.div 
              key={stone.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              
              {/* IMAGE (Anchor) - Massive scale */}
              <div className={`lg:col-span-8 ${i % 2 !== 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <Link to={`/opal/${stone.id}`} className="block relative aspect-[4/5] group w-full cursor-pointer">
                   <div className="absolute inset-0 image-glow opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                   <img 
                     src={stone.heroImage} 
                     alt={stone.name} 
                     className="w-full h-full object-cover cinematic-image group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                    referrerPolicy="no-referrer"
                   />
                   {stone.hasProvenance && (
                     <div className="absolute top-6 left-6 mix-blend-difference">
                       <span className="text-micro text-optic-white/80 border border-optic-white/30 px-3 py-1.5 backdrop-blur-md">
                         PROVENANCE OS™
                       </span>
                     </div>
                   )}
                </Link>
              </div>
              
              {/* METADATA (Orbit) */}
              <div className={`lg:col-span-4 flex flex-col justify-center ${i % 2 !== 0 ? 'lg:order-1 items-end text-right' : 'lg:order-2 items-start text-left'}`}>
                <p className="text-micro text-bone/40 mb-4">{stone.id}</p>
                
                <Link to={`/opal/${stone.id}`}>
                  <h2 className="font-display text-5xl lg:text-6xl uppercase tracking-[0.025em] text-bone leading-none mb-12 hover:text-optic-white transition-colors">
                    {stone.name.split(' ').map((word, idx) => (
                      <span key={idx} className="block">{word}</span>
                    ))}
                  </h2>
                </Link>

                <div className="space-y-6 w-full max-w-xs border-y border-bone/10 py-8 mb-12">
                   <div className="flex justify-between items-center">
                     <span className="text-micro text-bone/40">WEIGHT</span>
                     <span className="font-mono text-xs text-bone">{stone.carat}ct</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-micro text-bone/40">ORIGIN</span>
                     <span className="font-mono text-xs text-bone">{stone.origin}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-micro text-bone/40">VALUE</span>
                     <span className="font-mono text-xs text-bone">${stone.price.toLocaleString()}</span>
                   </div>
                </div>

                <Link 
                  to={`/opal/${stone.id}`}
                  className="text-micro text-bone/60 hover:text-optic-white transition-colors flex items-center gap-4 group"
                >
                  <span className={`h-[1px] w-8 bg-bone/30 group-hover:bg-optic-white transition-colors ${i % 2 !== 0 ? 'order-2' : 'order-1'}`} />
                  <span className={i % 2 !== 0 ? 'order-1' : 'order-2'}>EXAMINE</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
