import { motion } from 'framer-motion';
import { HeroHeadline } from '../components/ui/HeroHeadline';

export function People() {
  const people = [
    {
      id: "per_01",
      name: "Colin 'Cozza' Kathagen",
      role: "OPAL MINER | OPAL CUTTER",
      image: "/src/assets/images/Cozz_Bw.jpg",
      story: "Mining. Digging. Drilling. All the same to Cozza... If he can smell diesel and see colour, he's happy.",
      associates: ["HORSE PADDOCK CLAIM"]
    },
    {
      id: "per_02",
      name: "Mathew Kathagen",
      role: "OPAL MINER | OPAL CUTTER",
      image: "/src/assets/images/Matt_Bw.jpg",
      story: "Decades in the fields with his big brother. A lifetime of stories, ideas and lessons taught from the ground. Even after you'd think he'd heard it all – Mat's still listening.",
      associates: ["MOOKA BOYS LUNATIC CLAIM"]
    }
  ];

  return (
    <div className="w-full bg-pit-black min-h-screen pt-40 pb-40">
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <HeroHeadline subtitle="The Dirt" title="And The Blood." />
          <p className="font-sans text-xl md:text-2xl text-bone/60 leading-relaxed font-light max-w-2xl mt-12">
            Without the miner, the stone remains in the dark. These are the people who pull color from the earth today.
          </p>
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="space-y-48">
          {people.map((person, i) => (
            <motion.div 
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
            >
              
              {/* IMAGE PORTRAIT */}
              <div className={`lg:col-span-6 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[3/4] bg-iron overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-pit-black via-transparent to-pit-black opacity-80 z-10 pointer-events-none" />
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-full h-full object-cover mix-blend-luminosity grayscale group-hover:scale-105 group-hover:grayscale-[0.5] transition-all duration-[2000ms] ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              
              {/* TYPOGRAPHY */}
              <div className={`lg:col-span-5 ${i % 2 !== 0 ? 'lg:order-1 lg:col-start-1 items-end text-right' : 'lg:col-start-8 items-start text-left'} flex flex-col justify-center`}>
                <p className="text-micro text-copper tracking-[0.4em] mb-6">{person.role}</p>
                <h2 className="font-display text-6xl md:text-8xl text-bone mb-12 leading-none tracking-tight">{person.name}</h2>
                <p className="font-sans text-xl text-bone/60 leading-relaxed font-light mb-16 max-w-lg">
                  {person.story}
                </p>
                
                <div className={`flex flex-col gap-6 ${i % 2 !== 0 ? 'items-end' : 'items-start'}`}>
                  <span className="text-micro text-bone/30 tracking-[0.3em]">FAVOURITE FIELD</span>
                  <div className={`flex flex-col gap-3 ${i % 2 !== 0 ? 'items-end' : 'items-start'}`}>
                    {person.associates.map((assoc) => (
                      <span key={assoc} className="text-bone font-mono text-sm tracking-widest">{assoc}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
