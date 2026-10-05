import { motion } from 'framer-motion';
import { HeroHeadline } from '../components/ui/HeroHeadline';

export function About() {
  return (
    <div className="w-full bg-pit-black min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        
        <header className="mb-24 text-center">
          <HeroHeadline subtitle="Truth in the Stone" title="About" />
        </header>

        <div className="space-y-16 font-sans text-lg text-bone/60 leading-relaxed font-light">
          <p>
            Mooka Boys is an operation built on a very simple premise: the Australian opal industry is broken, opaque, and disconnected from its origins.
          </p>
          <p>
            We are working to build a new standard for provenance. We believe that an object's value is inseparable from its history. The earth it came from, the hands that pulled it from the dirt, the science of its formation, and the evidence of its journey—all of this matters.
          </p>
          <p>
            Our objective is not just to sell opal, but to restore the dignity of the extraction process and build technological primitives that prove authenticity beyond a shadow of a doubt.
          </p>
        </div>
      </div>
    </div>
  );
}
