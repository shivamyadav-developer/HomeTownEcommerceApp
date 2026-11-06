// Every image on the home screen comes from this map.
// Each value can be:
//   null                                   -> a labelled placeholder is shown
//   require("@/assets/images/pepperfry/x.jpg")  -> a local file
//   { uri: "https://..." }                 -> a remote image
// Current photos are free-licensed stand-ins from Unsplash (https://unsplash.com/license).
export const images = {
  // Top category shortcuts
  catFurniture: require("@/assets/images/pepperfry/cat-furniture.jpg"),
  catBedRoom: require("@/assets/images/pepperfry/cat-bedroom.jpg"),
  catLivingRoom: require("@/assets/images/pepperfry/cat-living-room.jpg"),
  catKitchen: require("@/assets/images/pepperfry/cat-kitchen.jpg"),

  // Hero banners
  bigSaleBanner: require("@/assets/images/pepperfry/banner-big-sale.jpg"),
  cushionsBanner: require("@/assets/images/pepperfry/banner-cushions.jpg"),

  // HomeTown Deals
  dealDining: require("@/assets/images/pepperfry/deal-dining.jpg"),
  dealWardrobe: require("@/assets/images/pepperfry/deal-wardrobe.jpg"),

  // Our Favourite Categories
  favHydraulicBeds: require("@/assets/images/pepperfry/fav-hydraulic-beds.jpg"),
  favSwings: require("@/assets/images/pepperfry/fav-swings.jpg"),
  favBarFurniture: require("@/assets/images/pepperfry/fav-bar-furniture.jpg"),
  favCentreTables: require("@/assets/images/pepperfry/fav-centre-tables.jpg"),

  // Sleep Essentials Collection
  sleepSofaSet: require("@/assets/images/pepperfry/sleep-sofa-set.jpg"),
  sleepProductsOnSale: require("@/assets/images/pepperfry/sleep-products-on-sale.jpg"),

  // Need Help Buying
  helpBuying1: require("@/assets/images/pepperfry/help-buying-1.jpg"),
  helpBuying2: require("@/assets/images/pepperfry/help-buying-2.jpg"),
  helpBuying3: require("@/assets/images/pepperfry/help-buying-3.jpg"),

  // Follow Home Interior Trends
  trends1: require("@/assets/images/pepperfry/trends-1.jpg"),
  trends2: require("@/assets/images/pepperfry/trends-2.jpg"),

  // Footer banner
  bedroomDesignsBanner: require("@/assets/images/pepperfry/banner-bedroom-designs.jpg"),
};
