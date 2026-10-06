import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { merch } from '../data/mockData';
import { HeroHeadline } from '../components/ui/HeroHeadline';
import { useCatalogue, useAcquire, formatPrice, type LiveProduct } from '../lib/shopify';

function ProductDetail({ product, live, loaded, onClose }: { product: typeof merch[0], live: LiveProduct | undefined, loaded: boolean, onClose: () => void }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // Live price, stock and checkout from Shopify, when a product with this handle exists there
  const buy = useAcquire(live, loaded, 'Acquire Artifact');
  const price = buy.price ?? product.price;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-pit-black flex flex-col overflow-y-auto"
    >
      {/* Header / Nav */}
      <div className="fixed top-0 left-0 w-full p-6 lg:p-12 z-50 flex justify-between items-start pointer-events-none">
        <div />
        <button 
          onClick={onClose}
          className="pointer-events-auto group flex items-center gap-4 text-bone/50 hover:text-bone transition-colors"
        >
          <span className="font-mono text-xs tracking-widest uppercase">Return</span>
          <span className="w-8 h-[1px] bg-bone/30 group-hover:bg-bone transition-colors" />
        </button>
      </div>

      <div className="flex-1 w-full flex flex-col lg:flex-row min-h-screen">
        {/* Left: Product Images Stage */}
        <div className="w-full lg:w-7/12 relative flex flex-col items-center justify-center p-8 lg:p-24 min-h-[60vh] lg:min-h-screen bg-pit-black">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-iron/20 via-pit-black to-pit-black z-0 pointer-events-none" />
           
           <div className="relative z-10 w-full max-w-4xl aspect-square flex items-center justify-center">
              <AnimatePresence mode="wait">
                  <motion.img
                  key={product.images[activeImageIndex]}
                  src={product.images[activeImageIndex]}
                  alt={`${product.name} detail`}
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-contain p-4 lg:p-12 drop-shadow-2xl mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
           </div>

           {/* Controls */}
           {product.images.length > 1 && (
              <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-6 z-20">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`transition-all duration-700 h-[1px] ${activeImageIndex === idx ? 'w-24 bg-copper' : 'w-8 bg-bone/20 hover:bg-bone/60'}`}
                  />
                ))}
              </div>
           )}
        </div>

        {/* Right: Info & Actions */}
        <div className="w-full lg:w-5/12 p-8 lg:p-24 flex flex-col justify-center bg-pit-black relative border-t lg:border-t-0 lg:border-l border-bone/5">
           
           <motion.div 
             initial={{ opacity: 0, x: 40 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
           >
             <div className="flex items-center gap-4 mb-12">
               <span className="w-8 h-[1px] bg-copper" />
               <p className="text-micro text-copper tracking-[0.4em] uppercase">{product.category}</p>
             </div>
             
             <h2 className="font-display text-5xl lg:text-7xl xl:text-8xl text-bone leading-[0.85] tracking-tight mb-12">
               {product.name}
             </h2>
             <div className="flex items-end gap-2 mb-16">
               <span className="font-mono text-3xl tracking-widest text-bone">${formatPrice(price)}</span>
               <span className="font-mono text-xs tracking-widest text-bone/50 pb-1">AUD</span>
             </div>

             <h3 className="font-sans text-2xl text-bone/80 leading-relaxed font-light mb-8">
               {product.tagline}
             </h3>
             <p className="font-sans text-lg text-bone/50 leading-relaxed font-light mb-20 max-w-md">
               {product.details}
             </p>

             {/* Sizes or other options, only when Shopify has more than one */}
             {buy.variants.length > 1 && (
               <div className="flex flex-wrap gap-3 mb-8">
                 {buy.variants.map((v) => (
                   <button
                     key={v.id}
                     onClick={() => buy.selectVariant(v.id)}
                     disabled={!v.available}
                     className={`min-w-[3.5rem] px-4 py-3 border font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-500 ${
                       v.id === buy.variantId
                         ? 'border-copper text-copper'
                         : v.available
                           ? 'border-bone/20 text-bone/70 hover:border-bone/60'
                           : 'border-bone/10 text-bone/20 line-through cursor-not-allowed'
                     }`}
                   >
                     {v.title}
                   </button>
                 ))}
               </div>
             )}

             {buy.disabled ? (
               <button
                 disabled
                 className="relative w-full inline-flex items-center justify-between px-8 py-6 bg-transparent border border-bone/10 cursor-not-allowed"
               >
                 <span className="font-mono text-xs tracking-[0.4em] uppercase text-bone/40">
                   {buy.label}
                 </span>
               </button>
             ) : (
               <button
                 onClick={buy.acquire}
                 className="group relative w-full inline-flex items-center justify-between px-8 py-6 bg-transparent border border-bone/20 hover:border-copper transition-colors duration-700 overflow-hidden"
               >
                  <div className="absolute inset-0 bg-copper translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <span className="relative z-10 font-mono text-xs tracking-[0.4em] uppercase text-bone group-hover:text-pit-black transition-colors duration-500">
                    {buy.label}
                  </span>
                  <svg className="relative z-10 w-4 h-4 text-bone group-hover:text-pit-black transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
               </button>
             )}
             {buy.error && (
               <p className="mt-4 font-mono text-[10px] tracking-widest uppercase text-ember" role="alert">{buy.error}</p>
             )}
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function Shop() {
  const [selectedProduct, setSelectedProduct] = useState<typeof merch[0] | null>(null);
  const { catalogue, loaded } = useCatalogue(merch.map((m) => m.handle));
  // The price Shopify will charge, once the product is in Shopify; the sample price until then
  const listPrice = (item: typeof merch[0]) => {
    const live = catalogue[item.handle];
    return live ? Math.min(...live.variants.map((v) => v.price)) : item.price;
  };

  return (
    <div className="w-full bg-pit-black min-h-screen text-bone relative pt-32 pb-40">
      
      {/* HERO SECTION */}
      <section className="relative w-full px-6 lg:px-12 max-w-[1600px] mx-auto mb-40">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
         >
            <HeroHeadline subtitle="Built For" title="The Dirt." />
             
               
             
            <p className="font-sans text-xl md:text-2xl text-bone/50 leading-relaxed font-light max-w-2xl mt-8">
              Engineered from earth. Every product carrying the Mooka Boys name is a reflection of the people, places and stories that built Australia's opal fields.
            </p>
         </motion.div>
      </section>

      {/* EDITORIAL LISTING */}
      <section className="px-6 lg:px-12 max-w-[1600px] mx-auto">
         <div className="flex flex-col space-y-40">
            {merch.map((item, i) => (
               <motion.div
                 key={item.id}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center group cursor-pointer`}
                 onClick={() => setSelectedProduct(item)}
               >
                 {/* Image Container */}
                 <div className={`lg:col-span-7 relative aspect-[4/3] bg-iron overflow-hidden border border-bone/5 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-pit-black/80 via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
                    
                    <img 
                      src={item.images[0]} 
                      alt={item.name}
                      className="w-full h-full object-contain p-12 lg:p-24 mix-blend-luminosity grayscale-[0.8] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[3000ms] ease-out z-0"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover Overlay Action */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-pit-black/20 backdrop-blur-[2px]">
                       <div className="flex items-center gap-4 border border-bone/20 px-8 py-4 bg-pit-black/60 backdrop-blur-md">
                         <span className="w-4 h-[1px] bg-copper" />
                         <span className="font-mono text-xs tracking-[0.4em] uppercase text-bone">
                           Examine
                         </span>
                       </div>
                    </div>
                 </div>

                 {/* Meta */}
                 <div className={`lg:col-span-5 flex flex-col justify-center ${i % 2 !== 0 ? 'lg:order-1 items-end text-right' : 'items-start text-left'}`}>
                    <div className={`flex items-center gap-4 mb-8 ${i % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
                      <span className="w-8 h-[1px] bg-copper" />
                      <p className="text-micro text-copper tracking-[0.4em] uppercase">{item.category}</p>
                    </div>
                    
                    <h3 className="font-display text-5xl lg:text-7xl text-bone leading-[0.9] tracking-tight mb-8 group-hover:text-copper transition-colors duration-700">
                      {item.name}
                    </h3>
                    
                    <p className="font-sans text-xl text-bone/50 leading-relaxed font-light mb-12 max-w-md">
                      {item.tagline}
                    </p>
                    
                    <div className="font-mono text-2xl tracking-widest text-bone">
                       ${formatPrice(listPrice(item))} <span className="text-xs text-bone/50">AUD</span>
                    </div>
                 </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            live={catalogue[selectedProduct.handle]}
            loaded={loaded}
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
