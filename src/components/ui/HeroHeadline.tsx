import { motion } from 'framer-motion';

export function HeroHeadline({ subtitle, title }: { subtitle: string, title: string }) {
  return (
    <motion.h1 
      initial={{ opacity: 0, filter: 'blur(24px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 4, ease: "easeOut" }}
      className="text-display font-display uppercase text-bone leading-[0.85] tracking-[0.025em] mix-blend-screen"
    >
      <motion.span 
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        animate={{ opacity: 0.6, filter: 'blur(0px)' }}
        transition={{ duration: 4, delay: 0.5, ease: 'easeOut' }}
        className="block text-4xl md:text-5xl lg:text-6xl text-copper mb-6 tracking-[0.25em] font-sans font-extralight opacity-60"
      >
        {subtitle}
      </motion.span>
      <motion.span 
        className="block opacity-90"
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        animate={{ opacity: 0.9, filter: 'blur(0px)', textShadow: "0px 0px 5px rgba(237,231,221,0.1)" }}
        transition={{ duration: 6, ease: "easeInOut" }}
      >
        {title}
      </motion.span>
    </motion.h1>
  );
}
