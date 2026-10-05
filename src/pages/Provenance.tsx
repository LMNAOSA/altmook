import { motion } from 'framer-motion';
import { HeroHeadline } from '../components/ui/HeroHeadline';

export function Provenance() {
  return (
    <div className="w-full bg-pit-black min-h-screen pt-40 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        
        <header className="mb-24 text-center">
          <HeroHeadline subtitle="Every Stone" title="Has A Story." />
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
            className="font-sans text-sm uppercase tracking-[0.2em] text-bone/50 mt-12"
          >
            The Mooka Boys Provenance Philosophy
          </motion.p>
        </header>

        <div className="space-y-4 font-sans text-sm uppercase tracking-[0.2em] text-bone/50 mb-32 text-center">
          <p>Where it came from.</p>
          <p>Who found it.</p>
          <p>What happened to it.</p>
          <p>How it changed.</p>
          <p>What proves it.</p>
        </div>

        <div className="bg-void border border-bone/10 p-12 text-center">
          <h2 className="text-micro text-bone/50 mb-6">Introducing</h2>
          <h3 className="font-display text-4xl uppercase tracking-widest text-bone mb-8">Provenance OS™</h3>
          <p className="font-sans text-base text-bone/70 max-w-lg mx-auto mb-12 leading-relaxed font-light">
            A radical new interaction model for interrogating high-value physical objects. Stop browsing grids and start verifying evidence.
          </p>
          
          <a href="/shop" className="inline-block px-8 py-5 border border-copper text-copper hover:bg-copper hover:text-pit-black transition-all duration-500 font-mono text-micro tracking-[0.3em]">
            EXAMINE AN ARTIFACT
          </a>
        </div>
      </div>
    </div>
  );
}
