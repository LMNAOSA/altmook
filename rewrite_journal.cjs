const fs = require('fs');

const journalContent = `import React from "react";
import { Product, PRODUCTS, MiningNode } from "../data/miningData";

interface JournalOverlayProps {
  node: MiningNode;
  onClose: () => void;
  onClaimItem: (product: Product) => void;
  claimedIds: string[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  onProductSelectDirect: (product: Product) => void;
}

export default function JournalOverlay({
  node,
  onClose,
  onClaimItem,
  claimedIds,
  selectedProduct,
  setSelectedProduct,
}: JournalOverlayProps) {
  if (!node) return null;

  const isProductView = selectedProduct !== null;
  const nodeProducts = (node.products || [])
    .map((id) => PRODUCTS[id])
    .filter(Boolean) as Product[];

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-survey-texture text-[var(--color-blackened-steel)]">
      <header className="sticky top-0 z-10 w-full px-6 md:px-16 py-10 flex items-center justify-between bg-survey-texture border-b border-[var(--color-blackened-steel)]/10">
        <button
          onClick={isProductView ? () => setSelectedProduct(null) : onClose}
          className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-medium hover:text-[var(--color-burnished-copper)] transition-colors cursor-pointer"
        >
          {isProductView ? "← Return to " + node.name : "← Exit to Map"}
        </button>
        
        <span className="font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-iron-ore)]">
          {isProductView ? "Provenance Ledger" : \`Sector // \${node.type}\`}
        </span>
      </header>

      <main className="flex-1 px-6 md:px-16 max-w-7xl mx-auto w-full pb-32">
        {!isProductView ? (
          <div className="flex flex-col mt-20">
            <section className="flex flex-col gap-8 max-w-[65ch]">
              <h1 className="font-serif font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight uppercase">
                {node.name}
              </h1>
              <p className="font-sans text-[length:var(--text-step-1)] leading-[1.6] text-[var(--color-iron-ore)]">
                {node.tagline}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 border-t border-[var(--color-blackened-steel)]/20 pt-20 mt-24">
              <div className="md:col-span-4">
                <h2 className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-bold">
                  The History
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="font-serif text-[length:var(--text-step-1)] leading-[1.7] max-w-[65ch]">
                  {node.history}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 border-t border-[var(--color-blackened-steel)]/20 pt-20 mt-20">
              <div className="md:col-span-4">
                <h2 className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-bold">
                  The Dirt
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="font-sans text-[length:var(--text-step-0)] leading-[1.7] max-w-[65ch] text-[var(--color-iron-ore)]">
                  {node.theDirt}
                </p>
                <blockquote className="mt-12 pl-8 border-l border-[var(--color-blackened-steel)]/30 font-serif italic text-[length:var(--text-step-1)] text-[var(--color-blackened-steel)] max-w-[55ch] leading-[1.6]">
                  "{node.minersNote}"
                </blockquote>
              </div>
            </section>

            {nodeProducts.length > 0 && (
              <section className="border-t border-[var(--color-blackened-steel)]/20 pt-20 mt-24">
                <h2 className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-bold mb-16">
                  Available Objects
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                  {nodeProducts.map((product) => {
                    const isClaimed = claimedIds.includes(product.id);
                    return (
                      <div 
                        key={product.id}
                        className="group cursor-pointer flex flex-col"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="w-full aspect-[4/3] bg-[var(--color-blackened-steel)] overflow-hidden mb-8">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                          />
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-iron-ore)] mb-3">
                              {product.weight !== "N/A" ? product.weight : "Handcrafted Gear"}
                            </span>
                            <h3 className="font-serif font-bold text-[length:var(--text-step-2)] leading-tight uppercase group-hover:text-[var(--color-burnished-copper)] transition-colors">
                              {product.name}
                            </h3>
                          </div>
                          {isClaimed && (
                            <span className="font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-survey-paper)] bg-[var(--color-blackened-steel)] px-3 py-2 border border-[var(--color-blackened-steel)]">
                              Acquired
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col mt-12">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <div className="lg:col-span-6 w-full aspect-[4/5] bg-[var(--color-blackened-steel)] overflow-hidden">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover filter brightness-90 contrast-110"
                />
              </div>
              
              <div className="lg:col-span-6 flex flex-col justify-center">
                <span className="font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-iron-ore)] mb-6">
                  {selectedProduct.weight !== "N/A" ? selectedProduct.weight : "Handcrafted Gear"}
                </span>
                
                <h1 className="font-serif font-bold text-5xl md:text-6xl leading-[1.05] tracking-tight uppercase mb-10 max-w-[15ch]">
                  {selectedProduct.name}
                </h1>
                
                <p className="font-sans text-[length:var(--text-step-0)] leading-[1.7] text-[var(--color-iron-ore)] mb-16 max-w-[55ch]">
                  {selectedProduct.description}
                </p>

                <div className="border-t border-[var(--color-blackened-steel)]/20 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  <div>
                    <span className="block font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-iron-ore)] mb-2">
                      Exchange Value
                    </span>
                    <span className="font-serif font-bold text-[length:var(--text-step-3)] text-[var(--color-blackened-steel)]">
                      \${selectedProduct.price.toLocaleString()} AUD
                    </span>
                  </div>

                  {claimedIds.includes(selectedProduct.id) ? (
                    <button disabled className="px-10 py-5 bg-[var(--color-iron-ore)] text-[var(--color-survey-paper)] font-sans font-medium uppercase tracking-[0.2em] text-[length:var(--text-step-minus-1)] cursor-not-allowed rounded-[4px]">
                      Claim Secured
                    </button>
                  ) : (
                    <button 
                      onClick={() => onClaimItem(selectedProduct)}
                      className="px-10 py-5 bg-[var(--color-blackened-steel)] hover:bg-[var(--color-burnished-copper)] text-[var(--color-survey-paper)] font-sans font-medium uppercase tracking-[0.2em] text-[length:var(--text-step-minus-1)] transition-colors cursor-pointer rounded-[4px]"
                    >
                      Acquire Object
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 border-t border-[var(--color-blackened-steel)]/20 pt-20 mt-24">
              <div className="md:col-span-4">
                <h2 className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-bold">
                  The Provenance
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="font-serif text-[length:var(--text-step-1)] leading-[1.7] max-w-[65ch]">
                  {selectedProduct.narrative}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 border-t border-[var(--color-blackened-steel)]/20 pt-20 mt-20">
              <div className="md:col-span-4">
                <h2 className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-bold">
                  Assayer's Report
                </h2>
              </div>
              <div className="md:col-span-8">
                <ul className="flex flex-col border-t border-[var(--color-blackened-steel)]/20 max-w-[65ch]">
                  {selectedProduct.characteristics.map((char, idx) => (
                    <li key={idx} className="py-6 border-b border-[var(--color-blackened-steel)]/20 flex justify-between items-baseline">
                      <span className="font-sans text-[length:var(--text-step-minus-1)] text-[var(--color-iron-ore)] uppercase tracking-[0.1em]">
                        {char.label}
                      </span>
                      <span className="font-serif font-bold text-[length:var(--text-step-0)] text-right">
                        {char.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
`;
fs.writeFileSync('src/components/JournalOverlay.tsx', journalContent);
