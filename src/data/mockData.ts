export type Stone = {
  id: string;
  name: string;
  carat: number;
  origin: string;
  miner: string;
  price: number;
  treatment: string;
  type?: string;
  heroImage: string;
  hasProvenance: boolean;
};

export const stones: Stone[] = [
  {
    id: "obj_01",
    name: "Lunatic Matrix",
    carat: 24.5,
    origin: "Lunatic field, Andamooka",
    miner: "Cozza",
    price: 45000,
    treatment: "Traditional Sugar/Acid Carbonization",
    type: "High-grade hard matrix",
    heroImage: "/src/assets/images/LunaticMatrix1.png",
    hasProvenance: true
  },
  {
    id: "obj_02",
    name: "The Dead Horse Seam",
    carat: 12.2,
    origin: "Dead Horse Gully, Andamooka",
    miner: "Macca",
    price: 18500,
    treatment: "Untreated",
    type: "Seam Opal",
    heroImage: "/src/assets/images/Matrix.png",
    hasProvenance: false
  }
];

export const merch = [
  {
    id: "merch_01",
    name: "The Cobra Cuff",
    category: "Artifacts",
    tagline: "Engineered from earth. Built to endure.",
    price: 2570,
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
    price: 49,
    images: [
      "/src/assets/images/merch/beanie1.png",
      "/src/assets/images/merch/beanie2.png",
      "/src/assets/images/merch/beanie3.png"
    ],
    details: "Heavyweight 400 GSM+ premium yarn. Born in opal country."
  },
  {
    id: "merch_06",
    name: "Not-Trucker-Hats",
    category: "Apparel",
    tagline: "Light it up.",
    price: 40,
    images: [
      "/src/assets/images/merch/hat1.png",
      "/src/assets/images/merch/hat2.png"
    ],
    details: "Purpose-built UV lighting systems and apparel. Reveal what daylight can't."
  }
];

export const articles = [
  {
    id: "art_01",
    title: "The Dirt and the Dream",
    category: "History",
    excerpt: "What it takes to pull color from the Australian outback.",
    image: "/src/assets/images/DigitalMine.png"
  }
];
