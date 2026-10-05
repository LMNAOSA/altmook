import hutInteriorImg from "../assets/images/Hut interior.jpg";
import eromangaImg from "../assets/images/EromangaAnda.png";
import minerHutImg from "../assets/images/Minerhut1.jpg";
import matrixImg from "../assets/images/DigitalMine.png";
import tradingPostImg from "../assets/images/Trading Post.png";
import outfittersImg from "../assets/images/Outfitters.png";
import workshopImg from "../assets/images/Workshop2.png";

export interface EditorialSection {
  title: string;
  content: string;
  image?: string;
  imageCaption?: string;
  imageStyle?: "full" | "inline";
}

export interface MiningNode {
  id: string;
  name: string;
  type: "destination" | "field";
  x: number;
  y: number;
  tagline: string;
  history: string;
  theDirt: string;
  minersNote: string;
  image?: string;
  sections?: EditorialSection[];
  rooms?: {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    image: string;
    quote?: string;
  }[];
  products?: string[];
}

export interface ProductCharacteristic {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  narrative: string;
  weight: string;
  fieldId: string;
  image: string;
  characteristics: ProductCharacteristic[];
}

export const PRODUCTS: Record<string, Product> = {
  "mb-094": {
    id: "mb-094",
    name: "The Bloodline Specimen",
    price: 18500,
    description: "A solid N1 black opal displaying intense rolling red flash.",
    narrative: "Unearthed at Gun Gully after three weeks of dry shafts. It was a scorching 44 degrees when the pick finally broke through the clay seal.",
    weight: "14.2 ct",
    fieldId: "trading-post",
    image: "/src/assets/images/MookaBoysWallet.png",
    characteristics: [
      { label: "Stone ID", value: "MB-094" },
      { label: "Body Tone", value: "N1 (Black)" },
      { label: "Brightness", value: "B4 (Brilliant)" },
      { label: "Pattern", value: "Rolling Red Flash" },
      { label: "Origin", value: "Gun Gully, Andamooka" }
    ]
  },
  "mb-112": {
    id: "mb-112",
    name: "Lunatic Green Matrix",
    price: 4200,
    description: "Premium Andamooka Matrix treated with sugar/acid to reveal electric green crystal.",
    narrative: "Found close to the surface, showing that sometimes the old-timers walked right over the best material.",
    weight: "42.5 ct",
    fieldId: "trading-post",
    image: "/src/assets/images/DigitalMine.png",
    characteristics: [
      { label: "Stone ID", value: "MB-112" },
      { label: "Treatment", value: "Sugar/Acid Carbonized" },
      { label: "Dominant Color", value: "Electric Green" },
      { label: "Origin", value: "Lunatic Field, Andamooka" }
    ]
  },
  "mb-wallet": {
    id: "mb-wallet",
    name: "Surveyor's Field Wallet",
    price: 145,
    description: "Hand-stitched kangaroo leather built for the red dirt.",
    narrative: "We got tired of factory wallets disintegrating in desert dust. So we built our own using brass rivets and heavy-duty outback leather.",
    weight: "220g",
    fieldId: "outfitters",
    image: "/src/assets/images/MookaBoysWallet.png",
    characteristics: [
      { label: "Gear ID", value: "HW-01" },
      { label: "Material", value: "Full-Grain Kangaroo Leather" },
      { label: "Hardware", value: "Solid Brass Rivets" },
      { label: "Crafted In", value: "South Australia" }
    ]
  },
  "mb-brew-01": {
    id: "mb-brew-01",
    name: "Eromanga Draught - 6 Pack",
    price: 38,
    description: "Cold-fermented ale brewed with desert rainwater and native Australian hops.",
    narrative: "Brewed on site at Mooka Boys Brewing Co. Crisp, refreshing, and crafted to wash down the red dust after a long day in the cut.",
    weight: "6 x 375ml",
    fieldId: "brewery",
    image: "/src/assets/images/Hut interior.jpg",
    characteristics: [
      { label: "Batch ID", value: "MB-BREW-01" },
      { label: "Style", value: "Outback Crisp Draught" },
      { label: "ABV", value: "4.8%" },
      { label: "Water Source", value: "Andamooka Rainwater" },
      { label: "Brewed In", value: "Andamooka, SA" }
    ]
  },
  "mb-notebook": {
    id: "mb-notebook",
    name: "Geological Field Ledger",
    price: 45,
    description: "Waterproof survey paper notebook bound in oil-waxed canvas.",
    narrative: "Made for recording coordinates, claim sketches, and field notes under the harsh desert sun.",
    weight: "180g",
    fieldId: "outfitters",
    image: "/src/assets/images/Leyland.jpg",
    characteristics: [
      { label: "Item ID", value: "SB-04" },
      { label: "Paper", value: "100gsm Stone Survey Paper" },
      { label: "Binding", value: "Copper Wire & Wax Canvas" },
      { label: "Pages", value: "120 Grid Grid/Plain" }
    ]
  }
};

export const MINING_NODES: MiningNode[] = [
  {
    id: "brewery",
    name: "Mooka Boys Brewery",
    type: "destination",
    x: 52.0,
    y: 37.8,
    tagline: "Cold beer. Red dust. Local stories.",
    history: "The only place in Andamooka where the dust settles in the bottom of a glass. Established as a watering hole for miners coming off shift from the brutal summer heat.",
    theDirt: "Brewed using ancient Eromanga Basin artesian water. The tanks are insulated with local clay.",
    minersNote: "'If you can't find a miner underground, check the brewery. Actually, check here first.'",
    image: "/src/assets/images/Hut interior.jpg",
  },
  {
    id: "opal-workshop",
    name: "Workshop",
    type: "destination",
    x: 46.6,
    y: 44.0,
    tagline: "Cut. Learn. Create. Find your Andamooka Opal.",
    history: "Adjacent to the brewery, the workshop provides hands-on access to diamond wheels, dop sticks, and lapidary saws. Outside lies 'The Dig'—an open excavation pit where visitors try their hand at unearthing matrix rough.",
    theDirt: "Equipped with brass water spouts and heavy timber benches worn smooth by thousands of hands shaping stone.",
    minersNote: "'You don't cut the stone. You follow the flash until it tells you where to stop.'",
    image: workshopImg
  },
  {
    id: "marys-place",
    name: "Mary's Shop",
    type: "destination",
    x: 71.3,
    y: 47.5,
    tagline: "Local Stockist. Authentic recommendations. Unexpected finds.",
    history: "The physical heart of community trade. Long before digital ledgers, Mary curated the finest stones and local artisan goods from the region.",
    theDirt: "Quiet, cool, and smelling faintly of dried lavender and polished timber display cabinets.",
    minersNote: "'You don't tell Mary what you want. She tells you what you need.'",
    image: "/src/assets/images/MattCoz2.jpg"
  },
  {
    id: "trading-post",
    name: "Trading Post",
    type: "destination",
    x: 64.3,
    y: 47.1,
    tagline: "Authenticated opal. Mining tools. Collections. Future marketplace.",
    history: "The physical exchange where miners trade diesel fuel, heavy shovels, and handcrafted goods.",
    theDirt: "A rustic outpost smelling of tanned cowhide, steel grease, and strong outback tobacco.",
    minersNote: "'If your gear can't survive a month in the Andamooka wind, it isn't worth bringing.'",
    image: tradingPostImg,
    products: ["mb-094", "mb-112"]
  },
  {
    id: "outfitters",
    name: "Outfitters",
    type: "destination",
    x: 56.6,
    y: 46.9,
    tagline: "Caps. Shirts. Leather goods. Field notebooks. Objects built to last.",
    history: "Built to endure the frontier. A supply depot for the working hands of the outback.",
    theDirt: "Stacks of heavy canvas, boxes of brass hardware, and the constant hum of industrial sewing machines.",
    minersNote: "'Wear it in, don't wear it out.'",
    image: outfittersImg,
    products: ["mb-wallet", "mb-notebook"]
  },
  {
    id: "trade-school",
    name: "Library",
    type: "destination",
    x: 42.0,
    y: 39.7,
    tagline: "Stories. History. Geology. Education. Provenance.",
    history: "The central reading room and archive of Andamooka. This building houses over a century of frontier mining lore, geological surveys, field accounts, and the complete provenance system of Mooka Boys.",
    theDirt: "Shelves of weathered leather-bound field journals, hand-drawn topographic maps, preserved marine fossils from the ancient inland sea, and physical ledgers tracking every discovered stone.",
    minersNote: "'You are walking on an ancient seabed. The stone in your satchel was formed when plesiosaurs swam over this very red soil.'",
    image: eromangaImg,
    sections: [
      {
        title: "Stories of the Frontier",
        content: "Outback mining is not for the faint of heart. Over a century of pioneers, families, and lone prospectors have ventured into the South Australian desert, sinking timber shafts into the blistering earth. Their stories are recorded here in unedited field journals and taped campfire recollections.",
        image: minerHutImg,
        imageCaption: "Frontier dwellings — Where stories of opal strikes and hardship were forged.",
        imageStyle: "full"
      },
      {
        title: "The Ancient Inland Sea & Geology",
        content: "One hundred million years ago, during the Cretaceous period, Andamooka lay beneath a vast inland sea known as the Eromanga Sea. As the waters receded and the climate dried, silica-rich groundwater seeped into cracks, faults, and ancient marine fossils—slowly hardening over millennia into brilliant precious opal.",
        image: eromangaImg,
        imageCaption: "The Eromanga Basin — Mapping the ancient seabed that birthed Andamooka's opal fields.",
        imageStyle: "inline"
      },
      {
        title: "Mining History & Heritage",
        content: "Discovered in 1930 by boundary riders from the Andamooka Station, this field quickly became a sanctuary for independent miners who valued freedom above all else. Unlike modern corporate open-cut mines, Andamooka remains a testament to small-scale underground craftsmanship and traditional hand-sunk claims."
      },
      {
        title: "Education & Opal Grading",
        content: "Understanding opal requires learning the language of light and stone. From body tone (dark matrix to white crystal) to play-of-color, pattern, and brilliance—every gem is unique. Our educational ledgers teach visitors how to read a stone's fire without laboratory jargon."
      },
      {
        title: "The Provenance Architecture",
        content: "Mooka Boys merges heritage with modern verification. Every opal retrieved from our claims is photographed, weighed, and mapped to its exact shaft coordinates before being entered into our digital and physical provenance registries. You are not just acquiring a gemstone; you are acquiring a certified chapter of time.",
        image: matrixImg,
        imageCaption: "Digital provenance registry — Cryptographic verification rooted in outback soil.",
        imageStyle: "inline"
      }
    ]
  },
  {
    id: "post-office",
    name: "Post Office",
    type: "destination",
    x: 37.4,
    y: 44.0,
    tagline: "Contact. Support. Newsletter. Mail. Community.",
    history: "The only reliable connection to the outside world. Where stories are dispatched and supplies are received.",
    theDirt: "Stamps, ink pads, and the heavy thud of the sorting desk. The lifeblood of outback communication.",
    minersNote: "'Patience is a virtue when you're waiting on the mail truck.'",
    image: "/src/assets/images/DigitalMine.png"
  },
  {
    id: "partners",
    name: "Mooka Boys HQ",
    type: "destination",
    x: 56.6,
    y: 41.7,
    tagline: "Trusted collaborators. Suppliers. Technology. Community.",
    history: "A tribute to the local independent families, fuel suppliers, and authentic outback merchants who keep our mining engines fueled.",
    theDirt: "A visual registry of frontier brands, handcrafted stamps, and historic mining lease certificates.",
    minersNote: "'Mining isn't a solo game. Out here, you are only as strong as the neighbors who'd pull your truck out of a clay bog.'",
    image: "/src/assets/images/JimShaw.png"
  },
  {
    id: "museum",
    name: "Museum",
    type: "destination",
    x: 35.8,
    y: 48.2,
    tagline: "Historical artefacts and people's stories.",
    history: "A repository of outback memory. The museum houses the physical relics of Andamooka's founding generations.",
    theDirt: "Displays of vintage mining gear, old photographs, and handwritten letters.",
    minersNote: "'Every object here has a story. Some are even true.'",
    image: "/src/assets/images/Hut interior.jpg"
  },
  {
    id: "digital-mining",
    name: "Digital Mining",
    type: "destination",
    x: 62.0,
    y: 33.0,
    tagline: "A tunnel into the mullock heap that leads underground to the digital layer.",
    history: "Where the physical grit of the outback meets cryptographic permanence.",
    theDirt: "The gateway to the digital layer. Proving provenance through science and technology.",
    minersNote: "'The future of opal mining isn't just in the dirt, it's in the data.'",
    image: "/src/assets/images/DigitalMine.png"
  }
];

