import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeaderActions } from "@/components/header-icons";
import { RemoteImage } from "@/components/remote-image";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { BRANDS, getCollection, getProduct } from "@/data/products";

const PADDING = 16;
const GAP = 12;

const CATEGORIES = ["furniture", "mattresses", "sofas", "beds", "chairs", "storage"];
const COLLECTIONS = [
  "hydraulic-beds",
  "swings",
  "bar-furniture",
  "centre-tables",
  "dining-sets",
  "lighting",
  "sleep",
  "deals",
  "all",
];

// A distinct, representative product photo for each section's cover.
const COVERS = {
  furniture: "bruno-fabric-sofa",
  mattresses: "ortho-memory-mattress",
  sofas: "hudson-l-sofa",
  beds: "indigo-queen-bed",
  chairs: "sunny-wingback",
  storage: "teak-wardrobe",
  "hydraulic-beds": "horizon-hydraulic-bed",
  swings: "arc-swivel-chair",
  "bar-furniture": "oak-bar-stool",
  "centre-tables": "teak-end-table",
  "dining-sets": "walnut-dining-set",
  lighting: "rattan-pendants",
  sleep: "plush-spring-mattress",
  deals: "cloud-sectional",
  all: "aldo-leather-sofa",
};

function coverImage(slug, collection) {
  return getProduct(COVERS[slug])?.image ?? collection.products[0]?.image;
}

// Tile width that fits exactly `columns` tiles per row on this screen.
function tileWidth(screenWidth, columns) {
  return Math.floor((screenWidth - PADDING * 2 - GAP * (columns - 1)) / columns);
}

function open(slug) {
  router.push(`/category/${slug}`);
}

function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function Tile({ slug, width }) {
  const collection = getCollection(slug);
  return (
    <Pressable style={[styles.tile, { width }]} onPress={() => open(slug)}>
      <RemoteImage
        source={coverImage(slug, collection)}
        label={collection.title}
        style={styles.tileImage}
      />
      <View style={styles.tileBody}>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {collection.title}
        </Text>
        <Text style={styles.tileCount}>{collection.products.length} items</Text>
      </View>
    </Pressable>
  );
}

export default function CategoriesScreen() {
  const { width } = useWindowDimensions();
  const third = tileWidth(width, 3);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <HeaderActions />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.search} onPress={() => router.push("/search")}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <Text style={styles.searchText}>Search for products, brands and more</Text>
        </Pressable>

        <SectionHeader title="Shop by Brand" subtitle="Top brands from HomeTown" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brands}
          style={styles.bleed}
        >
          {BRANDS.map((brand) => (
            <Pressable key={brand.slug} style={styles.brand} onPress={() => open(`brand-${brand.slug}`)}>
              <View style={styles.brandFrame}>
                <RemoteImage source={brand.cover} label={brand.name} style={styles.brandImage} />
              </View>
              <Text style={styles.brandName} numberOfLines={1}>
                {brand.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Shop by Category" />
        <View style={styles.grid}>
          {CATEGORIES.map((slug) => (
            <Tile key={slug} slug={slug} width={third} />
          ))}
        </View>

        <SectionHeader title="Collections" subtitle="Handpicked for your home" />
        <View style={styles.grid}>
          {COLLECTIONS.map((slug) => (
            <Tile key={slug} slug={slug} width={third} />
          ))}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PADDING,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
  },
  content: {
    paddingHorizontal: PADDING,
    paddingBottom: 28,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 48,
    ...shadow.soft,
  },
  searchText: {
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 14,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.sectionTitle,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  bleed: {
    marginHorizontal: -PADDING,
  },
  brands: {
    paddingHorizontal: PADDING,
    paddingVertical: 4,
    gap: 14,
  },
  brand: {
    width: 80,
    alignItems: "center",
  },
  brandFrame: {
    padding: 3,
    borderRadius: 40,
    backgroundColor: colors.card,
    ...shadow.soft,
  },
  brandImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  brandName: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  tile: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: "hidden",
    ...shadow.soft,
  },
  tileImage: {
    width: "100%",
    aspectRatio: 1,
  },
  tileBody: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tileTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.text,
  },
  tileCount: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});
