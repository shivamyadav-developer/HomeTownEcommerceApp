import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Pressable, StyleSheet, Text, View } from "react-native";
// Gesture-handler scroll views coordinate nested horizontal/vertical scrolling
// correctly inside GestureHandlerRootView (plain RN ones can lose the swipe on Android).
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeHeader } from "@/components/home-header";
import { ProductCard } from "@/components/product-card";
import { RemoteImage } from "@/components/remote-image";
import { SectionTitle } from "@/components/section-title";
import { images } from "@/constants/images";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { BRANDS, products } from "@/data/products";

const TOP_BRANDS = BRANDS.map((brand) => ({
  label: brand.name,
  slug: `brand-${brand.slug}`,
  image: brand.cover,
}));

const FAVOURITES = [
  { label: "Hydraulic Beds", slug: "hydraulic-beds", image: images.favHydraulicBeds },
  { label: "Swings", slug: "swings", image: images.favSwings },
  { label: "Bar furniture", slug: "bar-furniture", image: images.favBarFurniture },
  { label: "Centre Tables", slug: "centre-tables", image: images.favCentreTables },
];

const HELP_BUYING = [
  { label: "Sofas", slug: "sofas", image: images.helpBuying1 },
  { label: "Chairs", slug: "chairs", image: images.helpBuying2 },
  { label: "Living Room", slug: "living-room", image: images.helpBuying3 },
];

const TRENDS = [
  { label: "Bed Room", slug: "bed-room", image: images.trends1 },
  { label: "Lounge", slug: "living-room", image: images.trends2 },
];

const BEST_SELLERS = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
const NEW_ARRIVALS = products.filter((_, index) => index % 5 === 2).slice(0, 6);

const SOCIALS = [
  { icon: "logo-instagram", color: "#E1306C", url: "https://www.instagram.com/" },
  { icon: "logo-facebook", color: "#1877F2", url: "https://www.facebook.com/" },
  { icon: "logo-linkedin", color: "#0A66C2", url: "https://www.linkedin.com/" },
  { icon: "logo-youtube", color: "#FF0000", url: "https://www.youtube.com/" },
  { icon: "logo-x", color: "#000000", url: "https://x.com/" },
];

function openCollection(slug) {
  router.push(`/category/${slug}`);
}

function Banner({ slug, source, label, style, tag }) {
  return (
    <Pressable onPress={() => openCollection(slug)} style={styles.lift}>
      <RemoteImage source={source} label={label} style={style} />
      {tag ? (
        <View style={styles.tag}>
          <Text style={styles.tagTitle}>{label}</Text>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function RowHeader({ title, slug }) {
  return (
    <View style={styles.rowHeader}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Pressable onPress={() => openCollection(slug)} hitSlop={8}>
        <Text style={styles.viewAll}>View All</Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHeader />

        <FlatList
          data={TOP_BRANDS}
          keyExtractor={(item) => item.slug}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="normal"
          contentContainerStyle={styles.topCategories}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.topCategory, pressed && styles.pressed]}
              onPress={() => openCollection(item.slug)}
            >
              <View style={styles.topCategoryFrame}>
                <RemoteImage source={item.image} label={item.label} style={styles.topCategoryImage} />
              </View>
              <Text style={styles.topCaption} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />

        <View style={styles.section}>
          <Pressable onPress={() => openCollection("deals")} style={styles.lift}>
            <RemoteImage source={images.bigSaleBanner} label="Big Sale" style={styles.banner} />
            <View style={styles.saleOverlay}>
              <Text style={styles.saleKicker}>Exclusive</Text>
              <Text style={styles.saleTitle}>Furniture</Text>
              <Text style={styles.saleTitleBig}>BIG SALE</Text>
              <View style={styles.salePill}>
                <Text style={styles.salePillText}>Shop Now</Text>
              </View>
            </View>
          </Pressable>
          <Banner
            slug="decor"
            source={images.cushionsBanner}
            label="Cushions"
            style={[styles.banner, styles.bannerSpacing]}
          />
        </View>

        <SectionTitle color={colors.dealsTitle}>HomeTown Deals</SectionTitle>
        <View style={[styles.section, styles.row]}>
          <View style={styles.flex}>
            <Banner
              slug="dining"
              source={images.dealDining}
              label="Dining Sets"
              tag="Up to 40% off"
              style={styles.dealImage}
            />
          </View>
          <View style={styles.flex}>
            <Banner
              slug="storage"
              source={images.dealWardrobe}
              label="Wardrobes"
              tag="Starting ₹3,999"
              style={styles.dealImage}
            />
          </View>
        </View>

        <RowHeader title="Best Sellers" slug="all" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productRow}
        >
          {BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} product={product} style={styles.rowCard} />
          ))}
        </ScrollView>

        <View style={styles.card}>
          <SectionTitle>Our Favourite Categories</SectionTitle>
          <View style={styles.grid}>
            {FAVOURITES.map((item) => (
              <Pressable
                key={item.label}
                style={styles.gridItem}
                onPress={() => openCollection(item.slug)}
              >
                <RemoteImage source={item.image} label={item.label} style={styles.gridImage} />
                <Text style={styles.gridCaption}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <SectionTitle>Sleep Essentials Collection</SectionTitle>
          <Banner
            slug="sleep"
            source={images.sleepSofaSet}
            label="Sofa Sets"
            style={styles.wideBanner}
          />
          <Pressable onPress={() => openCollection("mattresses")}>
            <RemoteImage
              source={images.sleepProductsOnSale}
              label="Products on Sale"
              style={[styles.wideBanner, styles.bannerSpacing]}
            />
            <View style={styles.onSaleOverlay}>
              <Text style={styles.onSaleTitle}>Products on Sale</Text>
              <Text style={styles.onSaleSub}>Lighter on pocket, higher on joy</Text>
            </View>
          </Pressable>
        </View>

        <RowHeader title="New Arrivals" slug="all" />
        <View style={styles.newGrid}>
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} product={product} style={styles.gridCard} />
          ))}
        </View>

        <View style={styles.card}>
          <SectionTitle>Need Help Buying</SectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {HELP_BUYING.map((item) => (
              <Pressable key={item.label} onPress={() => openCollection(item.slug)}>
                <RemoteImage source={item.image} label={item.label} style={styles.helpImage} />
                <Text style={styles.helpCaption}>{item.label} Guide</Text>
              </Pressable>
            ))}
          </ScrollView>

          <SectionTitle>Follow Home Interior Trends</SectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {TRENDS.map((item) => (
              <Banner
                key={item.label}
                slug={item.slug}
                source={item.image}
                label={item.label}
                style={styles.trendImage}
              />
            ))}
          </ScrollView>

          <View style={styles.brandBlock}>
            <Text style={styles.brandLine}>
              A <Text style={styles.brandName}>PRAXIS</Text> company
            </Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>
              Building Technology That Serves People And Shapes Tomorrow
            </Text>
            <Text style={styles.followText}>Like What You See ? Follow Us Here</Text>
            <View style={styles.socials}>
              {SOCIALS.map((social) => (
                <Pressable
                  key={social.icon}
                  onPress={() => WebBrowser.openBrowserAsync(social.url)}
                  hitSlop={8}
                >
                  <Ionicons name={social.icon} size={26} color={social.color} />
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable onPress={() => openCollection("bed-room")}>
            <RemoteImage
              source={images.bedroomDesignsBanner}
              label="Latest Bedroom Furniture Designs"
              style={styles.footerBanner}
            />
            <View style={styles.footerOverlay}>
              <Text style={styles.footerOverlayText}>Latest{"\n"}Bedroom{"\n"}Furniture{"\n"}Designs</Text>
            </View>
          </Pressable>

          <Text style={styles.copyright}>© Copyright HomeTown</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 24,
  },
  flex: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  lift: {
    borderRadius: radius.md,
    ...shadow.card,
  },
  tag: {
    position: "absolute",
    left: 8,
    bottom: 8,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.text,
  },
  tagText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.sale,
  },
  topCategories: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12,
    paddingBottom: 16,
  },
  topCategory: {
    alignItems: "center",
    width: 80,
  },
  pressed: {
    opacity: 0.7,
  },
  topCategoryFrame: {
    width: 74,
    height: 74,
    borderRadius: 37,
    padding: 3,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    ...shadow.soft,
  },
  topCategoryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 34,
  },
  topCaption: {
    fontFamily: fonts.medium,
    marginTop: 7,
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
  },
  gridCaption: {
    fontFamily: fonts.medium,
    marginTop: 8,
    fontSize: 13,
    color: colors.text,
    textAlign: "center",
  },
  caption: {
    fontFamily: fonts.regular,
    marginTop: 6,
    fontSize: 13,
    color: colors.text,
    textAlign: "center",
  },
  banner: {
    width: "100%",
    aspectRatio: 2.4,
    borderRadius: radius.md,
  },
  bannerSpacing: {
    marginTop: 12,
  },
  saleOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "50%",
    justifyContent: "center",
    paddingLeft: 14,
    borderTopLeftRadius: radius.md,
    borderBottomLeftRadius: radius.md,
    backgroundColor: "rgba(52,79,122,0.88)",
  },
  saleKicker: {
    fontFamily: fonts.regular,
    color: "#fff",
    fontStyle: "italic",
    fontSize: 12,
  },
  saleTitle: {
    fontFamily: fonts.semibold,
    color: "#fff",
    fontSize: 20,
  },
  saleTitleBig: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 24,
  },
  salePill: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  salePillText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
  },
  dealImage: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: radius.md,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  rowTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.dealsTitle,
  },
  viewAll: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.accent,
  },
  productRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 12,
  },
  rowCard: {
    width: 160,
  },
  newGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    rowGap: 12,
  },
  gridCard: {
    width: "48%",
  },
  card: {
    marginTop: 26,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingBottom: 18,
    borderRadius: 28,
    backgroundColor: colors.card,
    ...shadow.soft,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  gridItem: {
    width: "48.5%",
  },
  gridImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.md,
  },
  wideBanner: {
    width: "100%",
    aspectRatio: 2.8,
    borderRadius: radius.md,
  },
  onSaleOverlay: {
    position: "absolute",
    left: 10,
    top: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  onSaleTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.dealsTitle,
  },
  onSaleSub: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.text,
  },
  carousel: {
    gap: 10,
    paddingVertical: 4,
  },
  helpImage: {
    width: 104,
    height: 118,
    borderRadius: radius.md,
  },
  helpCaption: {
    fontFamily: fonts.medium,
    marginTop: 6,
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
  trendImage: {
    width: 170,
    height: 190,
    borderRadius: radius.md,
  },
  brandBlock: {
    alignItems: "center",
    marginTop: 14,
  },
  brandLine: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  brandName: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    letterSpacing: 2,
    color: colors.dealsTitle,
  },
  divider: {
    alignSelf: "stretch",
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.text,
    textAlign: "center",
  },
  followText: {
    fontFamily: fonts.regular,
    marginTop: 8,
    fontSize: 13,
    color: colors.text,
  },
  socials: {
    flexDirection: "row",
    gap: 18,
    marginTop: 10,
  },
  footerBanner: {
    marginTop: 18,
    width: "100%",
    aspectRatio: 2,
    borderRadius: radius.sm,
  },
  footerOverlay: {
    position: "absolute",
    left: 0,
    top: 18,
    bottom: 0,
    width: "42%",
    justifyContent: "center",
    paddingLeft: 14,
    backgroundColor: "rgba(232,221,210,0.92)",
    borderTopLeftRadius: radius.sm,
    borderBottomLeftRadius: radius.sm,
  },
  footerOverlayText: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 22,
    color: colors.dealsTitle,
  },
  copyright: {
    fontFamily: fonts.regular,
    marginTop: 18,
    fontSize: 11,
    color: colors.text,
    textAlign: "center",
  },
});
