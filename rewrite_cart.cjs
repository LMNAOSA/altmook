const fs = require('fs');

const cartContent = `import React, { useState } from "react";
import { Product } from "../data/miningData";
import { X } from "lucide-react";

interface SatchelCartProps {
  isOpen: boolean;
  onClose: () => void;
  claimedItems: Product[];
  onRemoveItem: (id: string) => void;
  onClearSatchel: () => void;
}

export default function SatchelCart({
  isOpen,
  onClose,
  claimedItems,
  onRemoveItem,
  onClearSatchel,
}: SatchelCartProps) {
  const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "success">("idle");

  const totalValue = claimedItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    setCheckoutState("processing");
    setTimeout(() => {
      setCheckoutState("success");
      setTimeout(() => {
        onClearSatchel();
        setCheckoutState("idle");
        onClose();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-survey-texture flex flex-col shadow-2xl border-l border-[var(--color-blackened-steel)]/20 text-[var(--color-blackened-steel)]">
      <header className="px-8 md:px-12 py-10 flex items-center justify-between border-b border-[var(--color-blackened-steel)]/20">
        <h2 className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-bold">
          Your Satchel
        </h2>
        <button onClick={onClose} className="hover:text-[var(--color-burnished-copper)] transition-colors cursor-pointer p-2 -mr-2">
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10">
        {claimedItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <span className="font-mono text-[length:var(--text-step-minus-1)] uppercase tracking-widest text-[var(--color-iron-ore)]">
              Satchel Empty
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {claimedItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-8 items-start pb-10 border-b border-[var(--color-blackened-steel)]/20">
                <div className="w-24 h-32 bg-[var(--color-blackened-steel)] flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-90 mix-blend-luminosity" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-serif font-bold text-[length:var(--text-step-0)] uppercase leading-tight">
                      {item.name}
                    </h3>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[var(--color-iron-ore)] hover:text-[var(--color-burnished-copper)] font-mono text-[10px] uppercase tracking-widest cursor-pointer mt-1 border-b border-transparent hover:border-[var(--color-burnished-copper)] pb-1 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="font-sans text-[length:var(--text-step-minus-2)] text-[var(--color-iron-ore)] uppercase tracking-widest mt-4">
                    {item.weight !== "N/A" ? item.weight : "Equipment"}
                  </p>
                  <p className="font-serif font-bold text-[length:var(--text-step-1)] mt-6 text-[var(--color-blackened-steel)]">
                    \${item.price.toLocaleString()} AUD
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {claimedItems.length > 0 && (
        <div className="px-8 md:px-12 py-10 bg-survey-texture border-t border-[var(--color-blackened-steel)]/20">
          <div className="flex justify-between items-baseline mb-10">
            <span className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-bold text-[var(--color-iron-ore)]">
              Total Value
            </span>
            <span className="font-serif font-bold text-[length:var(--text-step-2)]">
              \${totalValue.toLocaleString()} AUD
            </span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={checkoutState !== "idle"}
            className="w-full py-5 bg-[var(--color-blackened-steel)] hover:bg-[var(--color-burnished-copper)] text-[var(--color-survey-paper)] font-sans font-medium uppercase tracking-[0.2em] text-[length:var(--text-step-minus-1)] transition-colors cursor-pointer rounded-[4px]"
          >
            {checkoutState === "idle" ? "Finalize Exchange" : checkoutState === "processing" ? "Processing..." : "Exchange Complete"}
          </button>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/components/SatchelCart.tsx', cartContent);
