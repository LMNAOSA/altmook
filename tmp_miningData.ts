import mattImg from "../assets/images/MattCoz1.jpg";
import cozzaImg from "../assets/images/Cozza.jpg";
import matt3Img from "../assets/images/Matt 3.jpg";
import lunaticsImg from "../assets/images/Lunatics.jpg";
import cozza2Img from "../assets/images/Cozza2.jpg";
import hutInteriorImg from "../assets/images/Hut interior.jpg";
import eromangaImg from "../assets/images/EromangaAnda.png";
import minerHutImg from "../assets/images/Minerhut1.jpg";
import matrixImg from "../assets/images/DigitalMine.png";
import tradingPostImg from "../assets/images/Trading Post.png";
import outfittersImg from "../assets/images/Outfitters.png";
import workshopImg from "../assets/images/Workshop.png";

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
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
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
    name: "Outback Brewery",
    type: "destination",
    x: 40,
    y: 50,
    tagline: "Cold beer. Red dust. Local stories.",
    history: "The only place in Andamooka where the dust settles in the bottom of a glass. Established as a watering hole for miners coming off shift from the brutal summer heat.",
    theDirt: "Brewed using ancient Eromanga Basin artesian water. The tanks are insulated with local clay.",
    minersNote: "'If you can't find a miner underground, check the brewery. Actually, check here first.'",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80",
  },
  {
    id: "matts-place",
    name: "Matt's Place",
    type: "destination",
    x: 57,
    y: 31,
    tagline: "Founder. Ideas. Projects. Behind the scenes.",
    history: "Where raw clay is sliced open to reveal light. Matt's workshop and sanctuary. It houses a state-of-the-art diamond-tip cutting wheel system and macro-photography rig, balanced beside old diesel drums.",
    theDirt: "The floor is permanently layered in a super-fine, brilliant white silica dust—the signature of cutting raw Andamooka stones.",
    minersNote: "'Cutting opal is a game of millimeters. One bad turn of the wheel and thousands of dollars of fire disappears into white powder.'",
    image: mattImg,
    sections: [
      {
        title: "How I came to Andamooka",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Outback dust settles over every story here, turning memory into stone."
      },
      {
        title: "Projects",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Building custom equipment that survives the desert heat."
      },
      {
        title: "Philosophy",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        image: matt3Img,
        imageCaption: "Matt at the cutting bench — Crafting light from raw Andamooka stone.",
        imageStyle: "inline"
      },
      {
        title: "History",
        content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet."
      },
      {
        title: "Favourite Opal",
        content: "Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. The deep blue Eromanga crystal opal remains unmatched in fire and depth."
      },
      {
        title: "Favourite Tools",
        content: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Diamond-tip slicing wheels, vintage optical loupes, and heavy brass calipers."
      },
      {
        title: "What's in my tool kit",
        content: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Precision blades, survey maps, leather pouches, and a rugged geological hammer."
      },
      {
        title: "Favourite Tool",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident. The custom 6-inch diamond saw."
      },
      {
        title: "Favourite field",
        content: "Similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. The White Dam field, where the clay is tough and the seams run deep."
      },
      {
        title: "Hardest field: Lunatic",
        content: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. A relentless stretch of hard country that tests every miner's resolve.",
        image: lunaticsImg,
        imageCaption: "Lunatic Field — The hardest, most unforgiving ground in Andamooka.",
        imageStyle: "full"
      },
      {
        title: "Stories",
        content: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Late night discussions by the oil drum fire when the wind howls across the ridge."
      },
      {
        title: "Theories",
        content: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. The ancient inland sea left pockets of silica that follow tectonic stress lines."
      },
      {
        title: "For fun",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Exploring abandoned shafts and mapping forgotten 1960s claims across the desert."
      },
      {
        title: "Best cut",
        content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. A 42-carat museum-grade gem with rolling red and green fire, cut from a weathered nodule found after a heavy downpour."
      }
    ]
  },
  {
    id: "cozzas-place",
    name: "Cozzas Place",
    type: "destination",
    x: 75,
    y: 34,
    tagline: "Mining. Field stories. Equipment. Knowledge.",
    history: "A rugged humpy assembled in the late 70s using discarded corrugated iron sheets, cedar poles, and red outback earth. This is the operational center.",
    theDirt: "Surrounded by a small collection of vintage drilling rigs and mounds of old pickings. Inside, Cozza keeps his legendary collection of rough specimen stones.",
    minersNote: "'Drop in for a cuppa. Knock twice, if the dog doesn't bite, we'll talk stones.'",
    image: cozzaImg,
    sections: [
      {
        title: "How I came to Andamooka",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Arrived in the late seventies with a Bedford truck and never found a reason to leave."
      },
      {
        title: "Philosophy",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. You don't fight the desert; you work on its schedule."
      },
      {
        title: "History",
        content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet. Five decades of hand-sunk shafts and timber-framed underground workings."
      },
      {
        title: "Favourite Opal",
        content: "Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Dark matrix opal with lightning flashes of green and gold."
      },
      {
        title: "Favourite Tools",
        content: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Pneumatic jackhammers, heavy iron crowbars, and a trusty hand winch."
      },
      {
        title: "What's in my tool kit",
        content: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Canvas roll with heavy wrenches, spare grease cartridges, a carbide lamp, and steel wedges."
      },
      {
        title: "Favourite Tool",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident. The old timber-handled pick that has sunk twenty shafts."
      },
      {
        title: "Favourite field",
        content: "Similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. The Gun Gully workings, where the ground is honest and stable.",
        image: hutInteriorImg,
        imageCaption: "Inside the humpy — Where field knowledge and opal lore are passed down.",
        imageStyle: "full"
      },
      {
        title: "Hardest field",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Restoring a 1968 Caldwell drill rig and reinforcing the timber dugout shafts.",
        image: cozza2Img,
        imageCaption: "Cozza in the field — Decades of outback engineering and opal knowledge.",
        imageStyle: "inline"
      },
      {
        title: "Stories",
        content: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. The time a sudden thunderstorm flooded the lower levels and we had to winch equipment out by candlelight."
      },
      {
        title: "Theories",
        content: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Notice how the opalized shells always congregate where the ironstone bands meet the grey clay."
      },
      {
        title: "For fun",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Repairing vintage machinery and spinning yarns over billy tea with visiting geologists."
      },
      {
        title: "Best cut",
        content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. A massive painted boulder specimen that still sits on the timber shelf above the workbench, untouched by the wheel."
      }
    ]
  },
  /* Hidden for now as requested
  {
    id: "brewery",
    name: "The Brewery",
    type: "destination",
    x: 60,
    y: 38,
    tagline: "Mooka Boys Brewing Co. Rainwater ale. Sunset deck. The Dugout cave.",
    history: "Perched on a ridge overlooking the vast desert basin, Mooka Boys Brewing Co. is built from weathered corrugated steel, iron ore stone, and massive Jarrah beams. Cold beer, warm fires, and stories that outlast the sun.",
    theDirt: "Fresh desert rainwater harvested from roof catchments, filtered through silica sand, and brewed inside copper vessels right on site.",
    minersNote: "'Everything carries the memory of where it began. Even a hangover. Scull.'",
    image: "https://images.unsplash.com/photo-1518176258769-f227c798150e?w=1200&q=80",
    rooms: [
      {
        id: "taproom",
        name: "The Taproom",
        subtitle: "Corrugated Iron & Weathered Jarrah Slab Bar",
        description: "A expansive sanctuary of blackened steel, timber slabs, and open fireplaces. Look through the floor-to-ceiling glass to watch the copper fermenters glistening under low hanging industrial lamps.",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80",
        quote: "Everything carries the memory of where it began. Even a hangover. SCULL."
      },
      {
        id: "sunset-deck",
        name: "The Sunset Deck",
        subtitle: "Panoramic Views Across The Eromanga Basin",
        description: "Open timber decking suspended over the rocky red ridge. As dusk settles, string lights illuminate timber benches while vinyl records spin quietly inside.",
        image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200&q=80",
        quote: "The sky turns from ochre to deep opal blue in less than ten minutes."
      },
      {
        id: "dugout",
        name: "The Dugout",
        subtitle: "Subterranean Dining Room & Candlelit Cellar",
        description: "Carved 8 meters directly into solid desert stone down a narrow stairwell. Naturally ambient at 22 degrees year-round, featuring long communal tables and flickering hearths.",
        image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80",
        quote: "Silent, cool, and smelling of aged timber, red earth, and roasted malt."
      }
    ],
    products: ["mb-brew-01"]
  },
  */
  {
    id: "opal-workshop",
    name: "Workshop",
    type: "destination",
    x: 29,
    y: 50,
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
    x: 106,
    y: 48,
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
    x: 49,
    y: 42,
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
    x: 64,
    y: 53,
    tagline: "Caps. Shirts. Leather goods. Field notebooks. Objects built to last.",
    history: "Built to endure the frontier. A supply depot for the working hands of the outback.",
    theDirt: "Stacks of heavy canvas, boxes of brass hardware, and the constant hum of industrial sewing machines.",
    minersNote: "'Wear it in, don't wear it out.'",
    image: outfittersImg,
    products: ["mb-wallet", "mb-notebook"]
  },
  {
    id: "library",
    name: "Library",
    type: "destination",
    x: 94,
    y: 33,
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
    x: 89,
    y: 59,
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
    x: 84,
    y: 44,
    tagline: "Trusted collaborators. Suppliers. Technology. Community.",
    history: "A tribute to the local independent families, fuel suppliers, and authentic outback merchants who keep our mining engines fueled.",
    theDirt: "A visual registry of frontier brands, handcrafted stamps, and historic mining lease certificates.",
    minersNote: "'Mining isn't a solo game. Out here, you are only as strong as the neighbors who'd pull your truck out of a clay bog.'",
    image: "/src/assets/images/JimShaw.png"
  }
];

