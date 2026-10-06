// Images are imported (not written as "/src/assets/..." strings) so Vite bundles them
// and gives them real URLs in the production build. The string form only works in the
// dev preview and returns 404 on the live site.
import lunaticMatrix1 from '../assets/images/LunaticMatrix1.png';
import matrixStone from '../assets/images/Matrix.png';
import digitalMine from '../assets/images/DigitalMine.png';

import cobraCuffB1 from '../assets/images/merch/CobraCuffB1.png';
import cobraCuffBR2 from '../assets/images/merch/CobraCurffBR2.png';
import cobraCuffKH1 from '../assets/images/merch/CobraCuffKH1.png';
import crewJumper1 from '../assets/images/merch/Crew-jumper-1.png';
import hoodSun from '../assets/images/merch/MookaBoysHood_sun.png';
import solSurvivor1 from '../assets/images/merch/SolSurvivor1.png';
import beanie1 from '../assets/images/merch/beanie1.png';
import beanie2 from '../assets/images/merch/beanie2.png';
import beanie3 from '../assets/images/merch/beanie3.png';
import hat1 from '../assets/images/merch/hat1.png';
import hat2 from '../assets/images/merch/hat2.png';

/**
 * A stone that has a 3D digital twin. The viewer works out its two baked flash images from
 * the model's file name, so these three files sit side by side in /public/models:
 *   Matrixtwin_opal.glb
 *   Matrixtwin_opal_flash.png
 *   Matrixtwin_opal_domain.png
 */
export type StoneTwin = {
  /** URL of the .glb under /public */
  model: string;
};

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
  /** Present only for stones that have a digital twin. */
  twin?: StoneTwin;
  /**
   * The product's handle in Shopify (the last part of its web address). When a product with
   * this handle exists there, the page shows its live price and the ACQUIRE button works.
   */
  handle?: string;
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
    heroImage: lunaticMatrix1,
    hasProvenance: true,
    twin: { model: "/models/Matrixtwin_opal.glb" },
    handle: "lunatic-matrix"
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
    heroImage: matrixStone,
    hasProvenance: false
  }
];

export const merch = [
  {
    id: "merch_01",
    // Shopify product handle: a product with this handle in Shopify makes the Acquire button live
    handle: "the-cobra-cuff",
    name: "The Cobra Cuff",
    category: "Artifacts",
    tagline: "Engineered from earth. Built to endure.",
    price: 2570,
    images: [cobraCuffB1, cobraCuffBR2, cobraCuffKH1],
    details: "Hand-braided paracord. Black steel. Andamooka matrix opal. This is not jewellery. It's a ritual. Only 20 are being made."
  },
  {
    id: "merch_02",
    // Shopify product handle: a product with this handle in Shopify makes the Acquire button live
    handle: "original-drifters",
    name: "Original Drifters",
    category: "Apparel",
    tagline: "The Andamooka Standard.",
    price: 140,
    images: [crewJumper1, hoodSun],
    details: "Heavyweight hoodies and jackets. Built for the cold, backed by brothers."
  },
  {
    id: "merch_03",
    // Shopify product handle: a product with this handle in Shopify makes the Acquire button live
    handle: "sol-survivor-mission",
    name: "Sol Survivor Mission",
    category: "Equipment",
    tagline: "Prepare. Protect. Prevail.",
    price: 280,
    images: [solSurvivor1],
    details: "Expedition first aid kit. Developed in partnership with the Royal Flying Doctor Service."
  },
  {
    id: "merch_05",
    // Shopify product handle: a product with this handle in Shopify makes the Acquire button live
    handle: "cold-snap-beanies",
    name: "Cold Snap Beanies",
    category: "Apparel",
    tagline: "Built for the cold.",
    price: 49,
    images: [beanie1, beanie2, beanie3],
    details: "Heavyweight 400 GSM+ premium yarn. Born in opal country."
  },
  {
    id: "merch_06",
    // Shopify product handle: a product with this handle in Shopify makes the Acquire button live
    handle: "not-trucker-hats",
    name: "Not-Trucker-Hats",
    category: "Apparel",
    tagline: "Light it up.",
    price: 40,
    images: [hat1, hat2],
    details: "Purpose-built UV lighting systems and apparel. Reveal what daylight can't."
  }
];

export const articles = [
  {
    id: "art_01",
    title: "The Dirt and the Dream",
    category: "History",
    excerpt: "What it takes to pull color from the Australian outback.",
    image: digitalMine
  }
];
