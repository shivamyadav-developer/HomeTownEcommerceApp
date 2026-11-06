import { BRAND_PRODUCT_ROWS, BRANDS } from "@/data/brands";

// Product photos are free-licensed stand-ins from Unsplash (https://unsplash.com/license).
const IMG = {
  sofaTanLiving: require("@/assets/images/products/sofa-tan-living.jpg"),
  sofaBrown3Seater: require("@/assets/images/products/sofa-brown-3seater.jpg"),
  sofaGreyL: require("@/assets/images/products/sofa-grey-l.jpg"),
  sectionalSofaWhite: require("@/assets/images/products/sectional-sofa-white.jpg"),
  sofaCreamMirror: require("@/assets/images/products/sofa-cream-mirror.jpg"),
  loveseatBlack: require("@/assets/images/products/loveseat-black.jpg"),
  sofaCozyPouf: require("@/assets/images/products/sofa-cozy-pouf.jpg"),
  armchairYellow: require("@/assets/images/products/armchair-yellow.jpg"),
  accentChairWhite: require("@/assets/images/products/accent-chair-white.jpg"),
  accentChairOrange: require("@/assets/images/products/accent-chair-orange.jpg"),
  loungeChairSwivel: require("@/assets/images/products/lounge-chair-swivel.jpg"),
  diningChairGrey: require("@/assets/images/products/dining-chair-grey.jpg"),
  barStoolWood: require("@/assets/images/products/bar-stool-wood.jpg"),
  kitchenTrolley: require("@/assets/images/products/kitchen-trolley.jpg"),
  endTableWood: require("@/assets/images/products/end-table-wood.jpg"),
  sideTableWhite: require("@/assets/images/products/side-table-white.jpg"),
  diningRoomSet: require("@/assets/images/products/dining-room-set.jpg"),
  diningTable4: require("@/assets/images/products/dining-table-4.jpg"),
  bedQueenBlue: require("@/assets/images/products/bed-queen-blue.jpg"),
  bedHotelKing: require("@/assets/images/products/bed-hotel-king.jpg"),
  bedGreyModern: require("@/assets/images/products/bed-grey-modern.jpg"),
  bedBlackKing: require("@/assets/images/products/bed-black-king.jpg"),
  bedUpholsteredGrey: require("@/assets/images/products/bed-upholstered-grey.jpg"),
  bedroomLuxury: require("@/assets/images/products/bedroom-luxury.jpg"),
  bedroomBoho: require("@/assets/images/products/bedroom-boho.jpg"),
  wardrobeTeak: require("@/assets/images/products/wardrobe-teak.jpg"),
  mattressWhite: require("@/assets/images/products/mattress-white.jpg"),
  mattressPlush: require("@/assets/images/products/mattress-plush.jpg"),
  pillowMemoryFoam: require("@/assets/images/products/pillow-memory-foam.jpg"),
  pillowStriped: require("@/assets/images/products/pillow-striped.jpg"),
  cushionsSet: require("@/assets/images/products/cushions-set.jpg"),
  wallFramesSet: require("@/assets/images/products/wall-frames-set.jpg"),
  floorLampGrey: require("@/assets/images/products/floor-lamp-grey.jpg"),
  pendantLights: require("@/assets/images/products/pendant-lights.jpg"),
  wallShelves: require("@/assets/images/products/wall-shelves.jpg"),
  bookshelfLarge: require("@/assets/images/products/bookshelf-large.jpg"),
  tvUnitLiving: require("@/assets/images/products/tv-unit-living.jpg"),
  studyDeskWhite: require("@/assets/images/products/study-desk-white.jpg"),
  studyWorkstation: require("@/assets/images/products/study-workstation.jpg"),
  writingDesk: require("@/assets/images/products/writing-desk.jpg"),
  wallDesk: require("@/assets/images/products/wall-desk.jpg"),
  kitchenModularWhite: require("@/assets/images/products/kitchen-modular-white.jpg"),
  kitchenIslandMarble: require("@/assets/images/products/kitchen-island-marble.jpg"),
  kitchenGreyIsland: require("@/assets/images/products/kitchen-grey-island.jpg"),
  kitchenGreen: require("@/assets/images/products/kitchen-green.jpg"),
  kitchenDark: require("@/assets/images/products/kitchen-dark.jpg"),
  livingLounge: require("@/assets/images/products/living-lounge.jpg"),
  loungeSofaChairs: require("@/assets/images/products/lounge-sofa-chairs.jpg"),
};

// [id, name, image, price, mrp, rating, reviews, categories, tags, material, dimensions]
const RAW = [
  ["aldo-leather-sofa", "Aldo 3 Seater Leather Sofa", IMG.sofaTanLiving, 45999, 79999, 4.6, 812, ["furniture", "living-room"], ["sofas"], "Top-grain leather, solid wood frame", "W 210 x D 90 x H 85 cm"],
  ["bruno-fabric-sofa", "Bruno Fabric 3 Seater Sofa", IMG.sofaBrown3Seater, 32999, 54999, 4.4, 540, ["furniture", "living-room"], ["sofas"], "Velvet fabric, engineered wood", "W 200 x D 88 x H 80 cm"],
  ["hudson-l-sofa", "Hudson L-Shaped Sofa", IMG.sofaGreyL, 58999, 98999, 4.5, 397, ["furniture", "living-room"], ["sofas", "sleep"], "Linen blend, sheesham wood", "W 260 x D 160 x H 85 cm"],
  ["cloud-sectional", "Cloud Sectional Sofa", IMG.sectionalSofaWhite, 74999, 119999, 4.7, 288, ["furniture", "living-room"], ["sofas", "sleep"], "Performance fabric, pine frame", "W 300 x D 170 x H 80 cm"],
  ["ivory-boucle-sofa", "Ivory Boucle Sofa", IMG.sofaCreamMirror, 41999, 62999, 4.3, 176, ["furniture", "living-room"], ["sofas"], "Boucle fabric, solid wood", "W 190 x D 85 x H 78 cm"],
  ["noir-loveseat", "Noir 2 Seater Loveseat", IMG.loveseatBlack, 21999, 34999, 4.2, 233, ["furniture", "living-room"], ["sofas"], "Velvet fabric, metal legs", "W 140 x D 80 x H 82 cm"],
  ["nest-sofa-pouf", "Nest Sofa with Pouf", IMG.sofaCozyPouf, 36999, 59999, 4.5, 301, ["furniture", "living-room"], ["sofas"], "Cotton blend, rubberwood", "W 205 x D 90 x H 82 cm"],
  ["sunny-wingback", "Sunny Wingback Armchair", IMG.armchairYellow, 14999, 24999, 4.6, 655, ["furniture", "living-room"], ["chairs", "swings"], "Velvet fabric, beech wood legs", "W 75 x D 80 x H 100 cm"],
  ["tufted-accent-chair", "Tufted Vanity Accent Chair", IMG.accentChairWhite, 8999, 15999, 4.1, 142, ["furniture", "bed-room"], ["chairs"], "Faux leather, solid wood", "W 60 x D 58 x H 82 cm"],
  ["rust-barrel-chair", "Rust Barrel Accent Chair", IMG.accentChairOrange, 12999, 19999, 4.4, 208, ["furniture", "living-room"], ["chairs", "swings"], "Boucle fabric, plywood", "W 72 x D 70 x H 74 cm"],
  ["arc-swivel-chair", "Arc Swivel Lounge Chair", IMG.loungeChairSwivel, 11499, 18999, 4.3, 189, ["furniture", "living-room"], ["chairs", "swings"], "Wool blend, ash wood base", "W 70 x D 72 x H 80 cm"],
  ["elora-dining-chair", "Elora Upholstered Dining Chair", IMG.diningChairGrey, 6499, 10999, 4.2, 321, ["furniture", "dining"], ["chairs"], "Linen fabric, beech wood", "W 50 x D 55 x H 92 cm"],
  ["oak-bar-stool", "Oak Bar Stool", IMG.barStoolWood, 3999, 6999, 4.3, 412, ["furniture", "kitchen"], ["bar-furniture"], "Solid oak wood", "W 40 x D 40 x H 75 cm"],
  ["kitchen-trolley", "Kitchen Storage Trolley", IMG.kitchenTrolley, 5499, 8999, 4.0, 97, ["kitchen"], ["bar-furniture", "storage"], "Pine wood, metal baskets", "W 60 x D 40 x H 88 cm"],
  ["teak-end-table", "Teak C-Shaped End Table", IMG.endTableWood, 4999, 8499, 4.5, 264, ["furniture", "living-room"], ["centre-tables"], "Solid teak wood", "W 55 x D 35 x H 60 cm"],
  ["mila-side-table", "Mila Round Side Table", IMG.sideTableWhite, 3499, 5999, 4.2, 158, ["furniture", "living-room"], ["centre-tables"], "MDF top, iron frame", "Dia 40 x H 55 cm"],
  ["nordic-dining-set", "Nordic 6 Seater Dining Set", IMG.diningRoomSet, 42999, 69999, 4.6, 377, ["furniture", "dining"], ["dining-sets"], "Solid rubberwood", "Table W 180 x D 90 x H 76 cm"],
  ["walnut-dining-set", "Walnut 4 Seater Dining Set", IMG.diningTable4, 28999, 45999, 4.4, 268, ["furniture", "dining"], ["dining-sets"], "Sheesham wood, walnut finish", "Table W 120 x D 80 x H 76 cm"],
  ["indigo-queen-bed", "Indigo Queen Bed", IMG.bedQueenBlue, 34999, 56999, 4.5, 423, ["furniture", "bed-room"], ["beds", "hydraulic-beds"], "Sheesham wood, velvet headboard", "Queen 160 x 200 cm"],
  ["regal-king-bed", "Regal King Bed with Bench", IMG.bedHotelKing, 49999, 84999, 4.7, 289, ["furniture", "bed-room"], ["beds", "hydraulic-beds"], "Engineered wood, fabric upholstery", "King 180 x 200 cm"],
  ["slate-queen-bed", "Slate Upholstered Queen Bed", IMG.bedGreyModern, 29999, 49999, 4.3, 190, ["furniture", "bed-room"], ["beds"], "Linen upholstery, pine frame", "Queen 160 x 200 cm"],
  ["onyx-king-bed", "Onyx King Bed", IMG.bedBlackKing, 44999, 72999, 4.5, 246, ["furniture", "bed-room"], ["beds", "hydraulic-beds"], "Solid wood, matte black finish", "King 180 x 200 cm"],
  ["horizon-hydraulic-bed", "Horizon Hydraulic Storage Bed", IMG.bedUpholsteredGrey, 39999, 64999, 4.6, 512, ["furniture", "bed-room"], ["beds", "hydraulic-beds"], "Engineered wood, hydraulic lift", "Queen 160 x 200 cm"],
  ["royale-canopy-bed", "Royale Canopy Bed", IMG.bedroomLuxury, 64999, 99999, 4.4, 88, ["furniture", "bed-room"], ["beds"], "Solid mango wood", "King 180 x 200 cm"],
  ["boho-platform-bed", "Boho Platform Bed", IMG.bedroomBoho, 24999, 39999, 4.3, 211, ["furniture", "bed-room"], ["beds"], "Rattan and acacia wood", "Queen 160 x 200 cm"],
  ["teak-wardrobe", "Teak 2 Door Wardrobe", IMG.wardrobeTeak, 27999, 44999, 4.4, 176, ["furniture", "bed-room"], ["storage"], "Solid teak wood", "W 100 x D 55 x H 190 cm"],
  ["ortho-memory-mattress", "Ortho Memory Foam Mattress", IMG.mattressWhite, 15999, 27999, 4.7, 1840, ["mattresses", "bed-room"], ["sleep"], "Memory foam, 8 inch", "Queen 152 x 198 cm"],
  ["plush-spring-mattress", "Plush Pocket Spring Mattress", IMG.mattressPlush, 21999, 36999, 4.6, 932, ["mattresses", "bed-room"], ["sleep"], "Pocket springs, 10 inch", "King 182 x 198 cm"],
  ["contour-pillow", "Contour Memory Foam Pillow", IMG.pillowMemoryFoam, 1499, 2999, 4.5, 2210, ["mattresses"], ["sleep"], "Memory foam, bamboo cover", "60 x 35 x 12 cm"],
  ["striped-pillow-pair", "Striped Cotton Pillow Pair", IMG.pillowStriped, 999, 1799, 4.2, 678, ["mattresses", "decor"], ["sleep", "cushions"], "100% cotton", "Set of 2, 45 x 70 cm"],
  ["earthy-cushion-covers", "Earthy Cushion Covers (Set of 5)", IMG.cushionsSet, 1299, 2499, 4.3, 845, ["decor", "living-room"], ["cushions"], "Cotton and jute", "40 x 40 cm each"],
  ["gallery-frames", "Gallery Wall Frames (Set of 12)", IMG.wallFramesSet, 2999, 5499, 4.4, 367, ["decor"], ["wall-decor"], "Pine wood frames", "Assorted sizes"],
  ["industrial-floor-lamp", "Industrial Floor Lamp", IMG.floorLampGrey, 4499, 7499, 4.3, 254, ["decor", "living-room"], ["lighting"], "Powder coated metal", "H 160 cm"],
  ["rattan-pendants", "Rattan Pendant Lights (Set of 3)", IMG.pendantLights, 5999, 9999, 4.5, 199, ["decor"], ["lighting"], "Natural rattan", "Dia 30 cm each"],
  ["floating-shelves", "Floating Wall Shelves", IMG.wallShelves, 3999, 6499, 4.1, 143, ["decor", "furniture"], ["storage", "wall-decor"], "Engineered wood", "Set of 4"],
  ["library-bookshelf", "Library Bookshelf", IMG.bookshelfLarge, 19999, 32999, 4.5, 121, ["furniture", "study"], ["storage"], "Solid pine wood", "W 180 x D 35 x H 210 cm"],
  ["matte-tv-unit", "Matte Black TV Unit", IMG.tvUnitLiving, 17999, 29999, 4.3, 236, ["furniture", "living-room"], ["storage"], "Engineered wood, matte laminate", "W 180 x D 40 x H 50 cm"],
  ["minimal-study-desk", "Minimal Study Desk", IMG.studyDeskWhite, 6999, 11999, 4.2, 310, ["furniture", "study"], ["desks"], "MDF top, metal legs", "W 100 x D 50 x H 75 cm"],
  ["pro-workstation", "Pro Workstation Desk", IMG.studyWorkstation, 9999, 16999, 4.4, 402, ["furniture", "study"], ["desks"], "Engineered wood, steel trestle", "W 120 x D 60 x H 75 cm"],
  ["midcentury-writing-desk", "Mid-Century Writing Desk", IMG.writingDesk, 8499, 13999, 4.5, 187, ["furniture", "study"], ["desks"], "Solid oak", "W 110 x D 55 x H 76 cm"],
  ["wall-mounted-desk", "Wall Mounted Desk", IMG.wallDesk, 4999, 7999, 4.0, 96, ["furniture", "study"], ["desks"], "Plywood with oak veneer", "W 90 x D 40 cm"],
  ["classic-white-kitchen", "Modular Kitchen - Classic White", IMG.kitchenModularWhite, 189999, 279999, 4.6, 64, ["kitchen"], ["modular-kitchen"], "BWP plywood, acrylic shutters", "10 ft straight layout"],
  ["marble-island-kitchen", "Marble Island Kitchen", IMG.kitchenIslandMarble, 249999, 359999, 4.7, 41, ["kitchen"], ["modular-kitchen"], "Quartz top, PU shutters", "12 x 10 ft with island"],
  ["grey-island-kitchen", "Grey Modular Kitchen with Island", IMG.kitchenGreyIsland, 219999, 329999, 4.5, 37, ["kitchen"], ["modular-kitchen"], "BWP plywood, laminate", "12 x 12 ft"],
  ["emerald-kitchen", "Emerald Modular Kitchen", IMG.kitchenGreen, 199999, 299999, 4.6, 52, ["kitchen"], ["modular-kitchen"], "Membrane shutters", "9 ft parallel"],
  ["charcoal-l-kitchen", "Charcoal L-Shaped Kitchen", IMG.kitchenDark, 169999, 249999, 4.4, 48, ["kitchen"], ["modular-kitchen"], "Matte laminate", "10 x 8 ft L-shape"],
  ["lounge-living-set", "Lounge Living Room Set", IMG.livingLounge, 89999, 149999, 4.5, 73, ["living-room", "furniture"], ["sofas"], "Fabric sofa, teak tables", "Sofa + 2 chairs + table"],
  ["loft-lounge-set", "Loft Lounge Set", IMG.loungeSofaChairs, 54999, 89999, 4.3, 92, ["living-room", "furniture"], ["sofas", "chairs"], "Leatherette, metal frame", "Sofa + 2 chairs"],
];

const ownProducts = RAW.map(
  ([id, name, image, price, mrp, rating, reviews, categories, tags, material, dimensions]) => ({
    id,
    name,
    image,
    price,
    mrp,
    rating,
    reviews,
    categories,
    tags,
    material,
    dimensions,
    brand: "HomeTown",
    warranty: categories.includes("mattresses") ? "10 years" : "1 year",
    discount: Math.round(((mrp - price) / mrp) * 100),
    description: `The ${name} is crafted from ${material.toLowerCase()} for everyday comfort and lasting quality. Free delivery and installation included.`,
  }),
);

const brandNames = Object.fromEntries(BRANDS.map((b) => [b.slug, b.name]));

const brandProducts = BRAND_PRODUCT_ROWS.map(
  ([id, name, imageUrl, price, mrp, brandSlug, categories, productType]) => ({
    id,
    name,
    image: { uri: imageUrl },
    price,
    mrp,
    rating: null,
    reviews: 0,
    categories,
    tags: [],
    material: null,
    dimensions: null,
    brand: brandNames[brandSlug],
    brandSlug,
    productType,
    warranty: null,
    discount: Math.round(((mrp - price) / mrp) * 100),
    description: `${name} by ${brandNames[brandSlug]}. Sold and delivered by HomeTown.`,
  }),
);

export const products = [...ownProducts, ...brandProducts];

export { BRANDS };

export const GIFT_CARD_AMOUNTS = [1000, 2500, 5000, 10000];

function giftCard(amount) {
  return {
    id: `gift-${amount}`,
    name: `HomeTown Gift Card ₹${formatNumber(amount)}`,
    image: null,
    price: amount,
    mrp: amount,
    discount: 0,
    giftCard: true,
  };
}

export function getProduct(id) {
  if (id?.startsWith("gift-")) {
    return giftCard(Number(id.slice(5)));
  }
  return products.find((p) => p.id === id);
}

// Every listing screen is a "collection": a title plus a rule that picks products.
export const collections = {
  all: { title: "All Products", match: () => true },
  furniture: { title: "Furniture", match: (p) => p.categories.includes("furniture") },
  mattresses: { title: "Mattresses", match: (p) => p.categories.includes("mattresses") },
  "living-room": { title: "Living Room", match: (p) => p.categories.includes("living-room") },
  "bed-room": { title: "Bed Room", match: (p) => p.categories.includes("bed-room") },
  decor: { title: "Decor", match: (p) => p.categories.includes("decor") },
  kitchen: { title: "Kitchen", match: (p) => p.categories.includes("kitchen") },
  dining: { title: "Dining", match: (p) => p.categories.includes("dining") },
  study: { title: "Study", match: (p) => p.categories.includes("study") },
  sofas: { title: "Sofas", match: (p) => p.tags.includes("sofas") },
  chairs: { title: "Chairs", match: (p) => p.tags.includes("chairs") },
  beds: { title: "Beds", match: (p) => p.tags.includes("beds") },
  "hydraulic-beds": { title: "Hydraulic Beds", match: (p) => p.tags.includes("hydraulic-beds") },
  swings: { title: "Swings & Lounge Chairs", match: (p) => p.tags.includes("swings") },
  "bar-furniture": { title: "Bar Furniture", match: (p) => p.tags.includes("bar-furniture") },
  "centre-tables": { title: "Centre Tables", match: (p) => p.tags.includes("centre-tables") },
  "dining-sets": { title: "Dining Sets", match: (p) => p.tags.includes("dining-sets") },
  storage: { title: "Storage & Wardrobes", match: (p) => p.tags.includes("storage") },
  lighting: { title: "Lighting", match: (p) => p.tags.includes("lighting") },
  sleep: { title: "Sleep Essentials", match: (p) => p.tags.includes("sleep") },
  deals: { title: "HomeTown Deals", match: (p) => p.discount >= 40 },
  ...Object.fromEntries(
    BRANDS.map((b) => [`brand-${b.slug}`, { title: b.name, match: (p) => p.brandSlug === b.slug }]),
  ),
};

export function getCollection(slug) {
  const collection = collections[slug] ?? collections.all;
  return { ...collection, products: products.filter(collection.match) };
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.brand, p.material, p.productType, ...p.categories, ...p.tags]
      .filter(Boolean)
      .some((field) => field.toLowerCase().replaceAll("-", " ").includes(q)),
  );
}

// Indian digit grouping: 1,23,456
export function formatNumber(n) {
  const [whole] = String(Math.round(n)).split(".");
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  return rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}` : last3;
}

export function formatPrice(n) {
  return `₹${formatNumber(n)}`;
}
