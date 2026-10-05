const fs = require('fs');
const content = fs.readFileSync('src/data/mockData.ts', 'utf-8');

const updated = content.replace(/export const merch = \[[\s\S]*?\];/, `export const merch = [
  {
    id: "merch_01",
    name: "The Cobra Cuff",
    category: "Artifacts",
    tagline: "Engineered from earth. Built to endure.",
    price: 350,
    images: [
      "/src/assets/images/merch/CobraCuffB1.png",
      "/src/assets/images/merch/CobraCurffBR2.png",
      "/src/assets/images/merch/CobraCuffKH1.png"
    ],
    details: "Hand-braided paracord. Black steel. Andamooka matrix opal. This is not jewellery. It's a ritual. Only 20 are being made."
  },
  {
    id: "merch_02",
    name: "Original Drifters",
    category: "Apparel",
    tagline: "The Andamooka Standard.",
    price: 140,
    images: [
      "/src/assets/images/merch/Crew-jumper-1.png",
      "/src/assets/images/merch/MookaBoysHood_sun.png"
    ],
    details: "Heavyweight hoodies and jackets. Built for the cold, backed by brothers."
  },
  {
    id: "merch_03",
    name: "Sol Survivor Mission",
    category: "Equipment",
    tagline: "Prepare. Protect. Prevail.",
    price: 280,
    images: [
      "/src/assets/images/merch/SolSurvivor1.png"
    ],
    details: "Expedition first aid kit. Developed in partnership with the Royal Flying Doctor Service."
  },
  {
    id: "merch_05",
    name: "Cold Snap Beanies",
    category: "Apparel",
    tagline: "Built for the cold.",
    price: 45,
    images: [
      "/src/assets/images/merch/beanie1.png",
      "/src/assets/images/merch/beanie2.png",
      "/src/assets/images/merch/beanie3.png"
    ],
    details: "Heavyweight 400 GSM+ premium yarn. Born in opal country."
  },
  {
    id: "merch_06",
    name: "SolSearch UV",
    category: "Apparel",
    tagline: "Light it up.",
    price: 40,
    images: [
      "/src/assets/images/merch/hat1.png",
      "/src/assets/images/merch/hat2.png"
    ],
    details: "Purpose-built UV lighting systems and apparel. Reveal what daylight can't."
  }
];`);

fs.writeFileSync('src/data/mockData.ts', updated);
