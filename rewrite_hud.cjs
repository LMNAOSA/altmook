const fs = require('fs');

const hudContent = `import React from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { MiningNode } from "../data/miningData";

import mbmcLogo from "../assets/images/MBMCLogoWhite.svg";

interface HUDProps {
  onOpenSatchel: () => void;
  satchelCount: number;
  selectedNode: MiningNode | null;
}

export default function HUD({
  onOpenSatchel,
  satchelCount,
}: HUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none p-6 md:p-12 flex flex-col justify-between z-40 mix-blend-multiply">
      <header className="w-full flex items-start justify-between pointer-events-auto mix-blend-normal">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[var(--color-blackened-steel)] flex items-center justify-center p-4">
             <img src={mbmcLogo} alt="Mooka Boys" className="w-full h-auto logo-white" />
          </div>
          <div className="pt-2 hidden sm:block">
            <h1 className="font-serif font-black text-[length:var(--text-step-2)] uppercase tracking-widest text-[var(--color-blackened-steel)] leading-none mb-2">
              Andamooka
            </h1>
            <p className="font-sans font-medium text-[length:var(--text-step-minus-1)] uppercase tracking-[0.3em] text-[var(--color-iron-ore)]">
              South Australia
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-10 bg-[var(--color-survey-paper)] px-8 py-5 border border-[var(--color-blackened-steel)]/20 shadow-sm">
          <button className="font-sans font-medium text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] text-[var(--color-blackened-steel)] hover:text-[var(--color-burnished-copper)] transition-colors cursor-pointer">
            Explore
          </button>
          <button className="font-sans font-medium text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] text-[var(--color-blackened-steel)] hover:text-[var(--color-burnished-copper)] transition-colors cursor-pointer">
            Chronicle
          </button>
          <button className="font-sans font-medium text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] text-[var(--color-blackened-steel)] hover:text-[var(--color-burnished-copper)] transition-colors cursor-pointer">
            Post Office
          </button>
        </nav>
      </header>

      <footer className="w-full flex items-end justify-between pointer-events-none mix-blend-normal">
        <div className="bg-[var(--color-survey-paper)] px-6 py-4 border border-[var(--color-blackened-steel)]/20 pointer-events-auto hidden md:block">
          <p className="font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-iron-ore)]">
            Loc // 30.4501° S, 137.1643° E
          </p>
        </div>

        <motion.button
          onClick={onOpenSatchel}
          className="pointer-events-auto flex items-center gap-4 bg-[var(--color-blackened-steel)] hover:bg-[var(--color-burnished-copper)] text-[var(--color-survey-paper)] px-8 py-5 transition-colors cursor-pointer rounded-[4px]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {satchelCount > 0 && (
              <span className="absolute -top-2 -right-3 text-[var(--color-burnished-copper)] font-sans font-bold text-[0.65rem] tracking-tighter">
                [{satchelCount}]
              </span>
            )}
          </div>
          <span className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-widest font-medium">
            {satchelCount === 0 ? "Satchel Empty" : "View Collection"}
          </span>
        </motion.button>
      </footer>
    </div>
  );
}
`;
fs.writeFileSync('src/components/HUD.tsx', hudContent);
