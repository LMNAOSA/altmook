import { motion } from 'framer-motion';
import { articles } from '../data/mockData';
import { HeroHeadline } from '../components/ui/HeroHeadline';

export function Journal() {
  return (
    <div className="w-full bg-pit-black min-h-screen pt-40 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <header className="mb-32 text-center">
          <HeroHeadline subtitle="The" title="Journal" />
          <p className="font-sans text-lg text-bone/60 max-w-md mx-auto leading-relaxed font-light mt-12">
            Stories, field notes, and dispatches from the edge of the Eromanga Basin.
          </p>
        </header>

        <div className="space-y-32">
          {articles.map((article) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              <div className="md:col-span-8">
                <div className="aspect-[16/9] bg-iron overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[2000ms] ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col justify-center space-y-6">
                <span className="text-support text-copper">{article.category}</span>
                <h2 className="text-hudson text-3xl lg:text-4xl text-bone group-hover:text-copper transition-colors">{article.title}</h2>
                <p className="font-sans text-base text-bone/70 leading-relaxed font-light">
                  {article.excerpt}
                </p>
                <div className="pt-4 text-micro text-bone/60 flex items-center gap-2 group-hover:text-bone transition-colors">
                  READ DISPATCH <span className="h-[1px] w-6 bg-bone/30 group-hover:bg-bone group-hover:w-10 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
