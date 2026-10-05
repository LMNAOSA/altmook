const fs = require('fs');

const appContent = `import React, { useState } from "react";
import { MINING_NODES, PRODUCTS, Product, MiningNode } from "./data/miningData";
import MapCanvas from "./components/MapCanvas";
import HUD from "./components/HUD";
import JournalOverlay from "./components/JournalOverlay";
import SatchelCart from "./components/SatchelCart";
import { AnimatePresence, motion } from "framer-motion";
import mbmcLogo from "./assets/images/MBMCLogoWhite.svg";

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MiningNode | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSatchelOpen, setIsSatchelOpen] = useState(false);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [zoomToTrigger, setZoomToTrigger] = useState<{ x: number; y: number; zoom: number; id: string } | null>(null);

  const handleNodeSelect = (node: MiningNode) => {
    setSelectedNode(node);
    setSelectedProduct(null);
  };

  const handleClaimItem = (product: Product) => {
    if (!claimedIds.includes(product.id)) {
      setClaimedIds([...claimedIds, product.id]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setClaimedIds(claimedIds.filter((itemId) => itemId !== id));
  };

  const handleClearSatchel = () => {
    setClaimedIds([]);
  };

  const claimedProducts = claimedIds
    .map((id) => PRODUCTS[id])
    .filter(Boolean) as Product[];

  return (
    <div className="w-screen h-screen relative bg-[var(--color-blackened-steel)] select-none overflow-hidden font-sans text-[var(--color-survey-paper)]">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="intro"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-blackened-steel)] z-50 p-6"
          >
            <div className="flex flex-col items-center max-w-xl text-center">
              {/* Logo placeholder if actual asset is missing/broken */}
              <div className="mb-12">
                <img src={mbmcLogo} alt="Mooka Boys" className="w-64 h-auto logo-white" />
              </div>
              <p className="font-serif text-[length:var(--text-step-0)] text-[var(--color-survey-paper)]/70 leading-[1.6] max-w-md mb-12">
                Wander through the coordinate archives of Australia's premier locations. Discover deep-seam geological data and claim bespoke specimens directly from the field.
              </p>
              <button
                onClick={() => setHasEntered(true)}
                className="px-10 py-5 bg-[var(--color-survey-paper)] text-[var(--color-blackened-steel)] hover:bg-[var(--color-burnished-copper)] hover:text-[var(--color-survey-paper)] font-sans font-medium text-[length:var(--text-step-minus-1)] tracking-[0.25em] uppercase transition-colors rounded-[4px]"
              >
                Enter Andamooka
              </button>
            </div>
            
            <div className="absolute bottom-12 flex flex-col items-center gap-2">
              <span className="font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-survey-paper)]/40">
                Andamooka Station • South Australia
              </span>
              <span className="font-mono text-[length:var(--text-step-minus-2)] uppercase tracking-widest text-[var(--color-survey-paper)]/30">
                30.4501° S, 137.1643° E
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-stretch bg-survey-texture text-[var(--color-blackened-steel)]"
          >
            <div className="flex-1 relative w-full h-full overflow-hidden">
              <MapCanvas
                onNodeSelect={handleNodeSelect}
                selectedNode={selectedNode}
                zoomToTrigger={zoomToTrigger}
              />
              
              <HUD
                onOpenSatchel={() => {
                  setIsSatchelOpen(true);
                  setSelectedNode(null);
                }}
                satchelCount={claimedIds.length}
                selectedNode={selectedNode}
              />

              <AnimatePresence>
                {selectedNode && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-50 w-full h-full bg-survey-texture"
                  >
                    <JournalOverlay
                      node={selectedNode}
                      onClose={() => {
                        setSelectedNode(null);
                        setSelectedProduct(null);
                      }}
                      onClaimItem={handleClaimItem}
                      claimedIds={claimedIds}
                      selectedProduct={selectedProduct}
                      setSelectedProduct={setSelectedProduct}
                      onProductSelectDirect={setSelectedProduct}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isSatchelOpen && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 right-0 z-50 w-full max-w-md h-full shadow-2xl"
                  >
                    <SatchelCart
                      isOpen={isSatchelOpen}
                      onClose={() => setIsSatchelOpen(false)}
                      claimedItems={claimedProducts}
                      onRemoveItem={handleRemoveItem}
                      onClearSatchel={handleClearSatchel}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;
fs.writeFileSync('src/App.tsx', appContent);
